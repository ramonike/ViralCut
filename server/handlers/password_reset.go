package handlers

import (
	"context"
	"crypto/rand"
	"encoding/base64"
	"net/http"
	"time"
	"viral-cuts-server/utils"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
)

type PasswordResetHandler struct {
	db *pgx.Conn
}

func NewPasswordResetHandler(db *pgx.Conn) *PasswordResetHandler {
	return &PasswordResetHandler{db: db}
}

// ForgotPasswordRequest represents the forgot password request body
type ForgotPasswordRequest struct {
	Email string `json:"email" binding:"required,email"`
}

// ResetPasswordRequest represents the reset password request body
type ResetPasswordRequest struct {
	Token       string `json:"token" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=6"`
}

// ForgotPassword handles password reset requests
func (h *PasswordResetHandler) ForgotPassword(c *gin.Context) {
	var req ForgotPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user exists
	var userID string
	err := h.db.QueryRow(context.Background(),
		`SELECT id FROM "user" WHERE email = $1`,
		req.Email,
	).Scan(&userID)

	// Always return success to prevent email enumeration
	if err == pgx.ErrNoRows {
		c.JSON(http.StatusOK, gin.H{"message": "Se o email existir, você receberá instruções para resetar sua senha"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Generate reset token
	tokenBytes := make([]byte, 32)
	_, err = rand.Read(tokenBytes)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to generate token"})
		return
	}
	token := base64.URLEncoding.EncodeToString(tokenBytes)

	// Store token in verification table
	verificationID := utils.GenerateID()
	expiresAt := time.Now().Add(1 * time.Hour) // Token expires in 1 hour

	_, err = h.db.Exec(context.Background(),
		`INSERT INTO "verification" (id, identifier, value, expires_at, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		verificationID, req.Email, token, expiresAt, time.Now(), time.Now(),
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create reset token"})
		return
	}

	// Send password reset email (async)
	go func() {
		err := utils.SendPasswordResetEmail(req.Email, token)
		if err != nil {
			println("Failed to send password reset email:", err.Error())
		}
	}()

	c.JSON(http.StatusOK, gin.H{
		"message": "Se o email existir, você receberá instruções para resetar sua senha",
	})

}

// ResetPassword handles password reset confirmation
func (h *PasswordResetHandler) ResetPassword(c *gin.Context) {
	var req ResetPasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Verify token
	var email string
	var expiresAt time.Time
	err := h.db.QueryRow(context.Background(),
		`SELECT identifier, expires_at FROM "verification" 
		 WHERE value = $1 AND expires_at > NOW()`,
		req.Token,
	).Scan(&email, &expiresAt)

	if err == pgx.ErrNoRows {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token inválido ou expirado"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Get user ID
	var userID string
	err = h.db.QueryRow(context.Background(),
		`SELECT id FROM "user" WHERE email = $1`,
		email,
	).Scan(&userID)

	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// Hash new password
	hashedPassword, err := utils.HashPassword(req.NewPassword)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Update password in account table
	_, err = h.db.Exec(context.Background(),
		`UPDATE "account" 
		 SET password = $1, updated_at = $2
		 WHERE user_id = $3 AND provider_id = 'credential'`,
		hashedPassword, time.Now(), userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update password"})
		return
	}

	// Delete used token
	_, err = h.db.Exec(context.Background(),
		`DELETE FROM "verification" WHERE value = $1`,
		req.Token,
	)
	if err != nil {
		// Log error but don't fail the request
		println("Failed to delete verification token:", err.Error())
	}

	// Invalidate all existing sessions for this user
	_, err = h.db.Exec(context.Background(),
		`DELETE FROM "session" WHERE user_id = $1`,
		userID,
	)
	if err != nil {
		// Log error but don't fail the request
		println("Failed to invalidate sessions:", err.Error())
	}

	c.JSON(http.StatusOK, gin.H{"message": "Senha resetada com sucesso"})
}
