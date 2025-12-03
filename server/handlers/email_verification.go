package handlers

import (
	"context"
	"fmt"
	"net/http"
	"time"
	"viral-cuts-server/models"
	"viral-cuts-server/utils"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type EmailVerificationHandler struct {
	db *pgxpool.Pool
}

func NewEmailVerificationHandler(db *pgxpool.Pool) *EmailVerificationHandler {
	return &EmailVerificationHandler{db: db}
}

// VerifyEmail handles GET /api/auth/verify-email?token=xxx
func (h *EmailVerificationHandler) VerifyEmail(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Token is required"})
		return
	}

	ctx := context.Background()

	// Find verification record
	var verification models.Verification
	err := h.db.QueryRow(ctx, `
		SELECT id, identifier, value, expires_at
		FROM verification
		WHERE value = $1 AND expires_at > NOW()
	`, token).Scan(&verification.ID, &verification.Identifier, &verification.Value, &verification.ExpiresAt)

	if err == pgx.ErrNoRows {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid or expired verification token"})
		return
	}
	if err != nil {
		fmt.Printf("Error finding verification: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify email"})
		return
	}

	// Update user's email_verified status
	_, err = h.db.Exec(ctx, `
		UPDATE "user"
		SET email_verified = true
		WHERE email = $1
	`, verification.Identifier)

	if err != nil {
		fmt.Printf("Error updating user: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to verify email"})
		return
	}

	// Delete used verification token
	_, err = h.db.Exec(ctx, `
		DELETE FROM verification WHERE id = $1
	`, verification.ID)

	if err != nil {
		fmt.Printf("Error deleting verification token: %v\n", err)
		// Don't fail the request, email is already verified
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Email verified successfully",
		"success": true,
	})
}

// ResendVerification handles POST /api/auth/resend-verification
func (h *EmailVerificationHandler) ResendVerification(c *gin.Context) {
	var req struct {
		Email string `json:"email" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid email address"})
		return
	}

	ctx := context.Background()

	// Check if user exists
	var user models.User
	err := h.db.QueryRow(ctx, `
		SELECT id, email, email_verified
		FROM "user"
		WHERE email = $1
	`, req.Email).Scan(&user.ID, &user.Email, &user.EmailVerified)

	if err == pgx.ErrNoRows {
		// Don't reveal if email exists or not for security
		c.JSON(http.StatusOK, gin.H{
			"message": "If the email exists, a verification link has been sent",
		})
		return
	}
	if err != nil {
		fmt.Printf("Error finding user: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to resend verification"})
		return
	}

	// Check if already verified
	if user.EmailVerified {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Email is already verified"})
		return
	}

	// Delete any existing verification tokens for this email
	_, err = h.db.Exec(ctx, `
		DELETE FROM verification WHERE identifier = $1
	`, user.Email)
	if err != nil {
		fmt.Printf("Error deleting old tokens: %v\n", err)
		// Continue anyway
	}

	// Generate new verification token
	verificationToken := uuid.New().String()
	expiresAt := time.Now().Add(24 * time.Hour)

	// Store verification token
	_, err = h.db.Exec(ctx, `
		INSERT INTO verification (id, identifier, value, expires_at, created_at, updated_at)
		VALUES ($1, $2, $3, $4, NOW(), NOW())
	`, uuid.New().String(), user.Email, verificationToken, expiresAt)

	if err != nil {
		fmt.Printf("Error creating verification token: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create verification token"})
		return
	}

	// Send verification email
	err = utils.SendVerificationEmail(user.Email, verificationToken)
	if err != nil {
		fmt.Printf("Error sending verification email: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send verification email"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Verification email sent successfully",
	})
}
