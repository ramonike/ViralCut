package handlers

import (
	"context"
	"net/http"
	"time"
	"viral-cuts-server/models"
	"viral-cuts-server/utils"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type AuthHandler struct {
	db *pgxpool.Pool
}

func NewAuthHandler(db *pgxpool.Pool) *AuthHandler {
	return &AuthHandler{db: db}
}

// SignUpRequest represents the sign-up request body
type SignUpRequest struct {
	Name     string `json:"name" binding:"required"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6"`
}

// SignInRequest represents the sign-in request body
type SignInRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

// SignUp handles user registration
func (h *AuthHandler) SignUp(c *gin.Context) {
	var req SignUpRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	var existingEmail string
	err := h.db.QueryRow(context.Background(),
		`SELECT email FROM "user" WHERE email = $1`,
		req.Email,
	).Scan(&existingEmail)

	if err == nil {
		c.JSON(http.StatusConflict, gin.H{"error": "User with this email already exists"})
		return
	} else if err != pgx.ErrNoRows {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to hash password"})
		return
	}

	// Create user
	userID := utils.GenerateID()
	now := time.Now()

	_, err = h.db.Exec(context.Background(),
		`INSERT INTO "user" (id, name, email, email_verified, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		userID, req.Name, req.Email, false, now, now,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create user"})
		return
	}

	// Create account with password
	accountID := utils.GenerateID()
	_, err = h.db.Exec(context.Background(),
		`INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7)`,
		accountID, req.Email, "credential", userID, hashedPassword, now, now,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create account"})
		return
	}

	// Create session
	session, err := h.createSession(userID, c.ClientIP(), c.Request.UserAgent())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	// Set session cookie
	h.setSessionCookie(c, session.Token)

	// Generate and send verification email
	verificationToken := utils.GenerateID()
	verificationExpiresAt := now.Add(24 * time.Hour)

	_, err = h.db.Exec(context.Background(),
		`INSERT INTO verification (id, identifier, value, expires_at, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6)`,
		utils.GenerateID(), req.Email, verificationToken, verificationExpiresAt, now, now,
	)
	if err != nil {
		// Don't fail registration if verification email fails
		// Just log the error
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create verification token"})
		return
	}

	// Send verification email (async, don't block registration)
	go func() {
		err := utils.SendVerificationEmail(req.Email, verificationToken)
		if err != nil {
			// Log error but don't fail the request
			println("Failed to send verification email:", err.Error())
		}
	}()

	// Return user data
	user := models.User{
		ID:            userID,
		Name:          req.Name,
		Email:         req.Email,
		EmailVerified: false,
		CreatedAt:     now,
		UpdatedAt:     now,
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"session": session,
	})
}

// SignIn handles user login
func (h *AuthHandler) SignIn(c *gin.Context) {
	var req SignInRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Get user and password
	var userID, name, email, hashedPassword string
	var emailVerified bool
	var createdAt, updatedAt time.Time

	err := h.db.QueryRow(context.Background(),
		`SELECT u.id, u.name, u.email, u.email_verified, u.created_at, u.updated_at, a.password
		 FROM "user" u
		 JOIN "account" a ON u.id = a.user_id
		 WHERE u.email = $1 AND a.provider_id = 'credential'`,
		req.Email,
	).Scan(&userID, &name, &email, &emailVerified, &createdAt, &updatedAt, &hashedPassword)

	if err == pgx.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	// Check password
	if !utils.CheckPassword(hashedPassword, req.Password) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid email or password"})
		return
	}

	// Create session
	session, err := h.createSession(userID, c.ClientIP(), c.Request.UserAgent())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create session"})
		return
	}

	// Set session cookie
	h.setSessionCookie(c, session.Token)

	// Return user data
	user := models.User{
		ID:            userID,
		Name:          name,
		Email:         email,
		EmailVerified: emailVerified,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"session": session,
	})
}

// GetSession returns the current session
func (h *AuthHandler) GetSession(c *gin.Context) {
	// Get session token from cookie
	token, err := c.Cookie("better-auth.session_token")
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "No session found"})
		return
	}

	// Get session and user
	var sessionID, userID, name, email string
	var emailVerified bool
	var expiresAt, createdAt, updatedAt time.Time

	err = h.db.QueryRow(context.Background(),
		`SELECT s.id, s.expires_at, s.user_id, u.name, u.email, u.email_verified, u.created_at, u.updated_at
		 FROM "session" s
		 JOIN "user" u ON s.user_id = u.id
		 WHERE s.token = $1 AND s.expires_at > NOW()`,
		token,
	).Scan(&sessionID, &expiresAt, &userID, &name, &email, &emailVerified, &createdAt, &updatedAt)

	if err == pgx.ErrNoRows {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired session"})
		return
	} else if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database error"})
		return
	}

	user := models.User{
		ID:            userID,
		Name:          name,
		Email:         email,
		EmailVerified: emailVerified,
		CreatedAt:     createdAt,
		UpdatedAt:     updatedAt,
	}

	session := models.Session{
		ID:        sessionID,
		Token:     token,
		ExpiresAt: expiresAt,
		UserID:    userID,
	}

	c.JSON(http.StatusOK, gin.H{
		"user":    user,
		"session": session,
	})
}

// SignOut handles user logout
func (h *AuthHandler) SignOut(c *gin.Context) {
	// Get session token from cookie
	token, err := c.Cookie("better-auth.session_token")
	if err != nil {
		c.JSON(http.StatusOK, gin.H{"message": "Already signed out"})
		return
	}

	// Delete session from database
	_, err = h.db.Exec(context.Background(),
		`DELETE FROM "session" WHERE token = $1`,
		token,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign out"})
		return
	}

	// Clear cookie
	c.SetCookie("better-auth.session_token", "", -1, "/", "", false, true)

	c.JSON(http.StatusOK, gin.H{"message": "Signed out successfully"})
}

// Helper functions

func (h *AuthHandler) createSession(userID, ipAddress, userAgent string) (*models.Session, error) {
	sessionID := utils.GenerateID()
	token, err := utils.GenerateSessionToken()
	if err != nil {
		return nil, err
	}

	now := time.Now()
	expiresAt := now.Add(30 * 24 * time.Hour) // 30 days

	_, err = h.db.Exec(context.Background(),
		`INSERT INTO "session" (id, token, expires_at, user_id, ip_address, user_agent, created_at, updated_at)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
		sessionID, token, expiresAt, userID, ipAddress, userAgent, now, now,
	)
	if err != nil {
		return nil, err
	}

	return &models.Session{
		ID:        sessionID,
		Token:     token,
		ExpiresAt: expiresAt,
		UserID:    userID,
		CreatedAt: now,
		UpdatedAt: now,
	}, nil
}

func (h *AuthHandler) setSessionCookie(c *gin.Context, token string) {
	// Set HTTP-only cookie (same name as Better Auth for compatibility)
	c.SetCookie(
		"better-auth.session_token", // name
		token,                       // value
		30*24*60*60,                 // maxAge (30 days in seconds)
		"/",                         // path
		"",                          // domain (empty = current domain)
		false,                       // secure (set to true in production with HTTPS)
		true,                        // httpOnly
	)
}
