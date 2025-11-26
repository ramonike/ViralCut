package models

import (
	"time"
)

// User represents a user in the system
type User struct {
	ID            string    `json:"id" db:"id"`
	Name          string    `json:"name" db:"name"`
	Email         string    `json:"email" db:"email"`
	EmailVerified bool      `json:"emailVerified" db:"email_verified"`
	Image         *string   `json:"image,omitempty" db:"image"`
	CreatedAt     time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt     time.Time `json:"updatedAt" db:"updated_at"`
}

// Session represents a user session
type Session struct {
	ID        string    `json:"id" db:"id"`
	ExpiresAt time.Time `json:"expiresAt" db:"expires_at"`
	Token     string    `json:"token" db:"token"`
	CreatedAt time.Time `json:"createdAt" db:"created_at"`
	UpdatedAt time.Time `json:"updatedAt" db:"updated_at"`
	IPAddress *string   `json:"ipAddress,omitempty" db:"ip_address"`
	UserAgent *string   `json:"userAgent,omitempty" db:"user_agent"`
	UserID    string    `json:"userId" db:"user_id"`
}

// Account represents authentication credentials and OAuth tokens
type Account struct {
	ID                    string     `json:"id" db:"id"`
	AccountID             string     `json:"accountId" db:"account_id"`
	ProviderID            string     `json:"providerId" db:"provider_id"`
	UserID                string     `json:"userId" db:"user_id"`
	AccessToken           *string    `json:"accessToken,omitempty" db:"access_token"`
	RefreshToken          *string    `json:"refreshToken,omitempty" db:"refresh_token"`
	IDToken               *string    `json:"idToken,omitempty" db:"id_token"`
	AccessTokenExpiresAt  *time.Time `json:"accessTokenExpiresAt,omitempty" db:"access_token_expires_at"`
	RefreshTokenExpiresAt *time.Time `json:"refreshTokenExpiresAt,omitempty" db:"refresh_token_expires_at"`
	Scope                 *string    `json:"scope,omitempty" db:"scope"`
	Password              *string    `json:"-" db:"password"` // Never expose password in JSON
	CreatedAt             time.Time  `json:"createdAt" db:"created_at"`
	UpdatedAt             time.Time  `json:"updatedAt" db:"updated_at"`
}

// SessionWithUser combines session and user data for API responses
type SessionWithUser struct {
	Session Session `json:"session"`
	User    User    `json:"user"`
}
