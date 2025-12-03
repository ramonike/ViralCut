package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"viral-cuts-server/handlers"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"github.com/joho/godotenv"
)

var db *pgxpool.Pool

func main() {
	// Load .env file
	if err := godotenv.Load(); err != nil {
		if err := godotenv.Load("../.env"); err != nil {
			log.Println("No .env file found, relying on system environment variables")
		}
	}

	// Database connection
	dbUrl := os.Getenv("DATABASE_URL")
	if dbUrl == "" {
		log.Fatal("DATABASE_URL is not set in .env file")
	}

	// Parse configuration
	config, err := pgxpool.ParseConfig(dbUrl)
	if err != nil {
		log.Fatalf("Unable to parse database URL: %v\n", err)
	}

	// For Supabase Transaction Pooler (port 6543), we must use simple protocol
	config.ConnConfig.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	// Create connection pool
	db, err = pgxpool.NewWithConfig(context.Background(), config)
	if err != nil {
		log.Printf("Failed to connect to database: %v\n", err)
		os.Exit(1)
	}
	defer db.Close()

	// Test connection
	if err := db.Ping(context.Background()); err != nil {
		log.Fatalf("Failed to ping database: %v\n", err)
	}

	fmt.Println("Connected to Supabase PostgreSQL successfully (via pgxpool)!")

	// Initialize Gin router
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		allowedOrigins := []string{
			"http://localhost:5173",
			"http://localhost:5174",
			"http://localhost:3000",
			"https://viral-cut-kappa.vercel.app",
		}

		isAllowed := false
		for _, allowed := range allowedOrigins {
			if origin == allowed {
				isAllowed = true
				break
			}
		}

		if isAllowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		}

		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(db)
	passwordResetHandler := handlers.NewPasswordResetHandler(db)
	emailVerificationHandler := handlers.NewEmailVerificationHandler(db)
	adminHandler := handlers.NewAdminHandler(db)

	// Auth routes
	r.POST("/api/auth/sign-up", authHandler.SignUp)
	r.POST("/api/auth/sign-in", authHandler.SignIn)
	r.GET("/api/auth/session", authHandler.GetSession)
	r.POST("/api/auth/sign-out", authHandler.SignOut)

	// Password reset routes
	r.POST("/api/auth/forgot-password", passwordResetHandler.ForgotPassword)
	r.POST("/api/auth/reset-password", passwordResetHandler.ResetPassword)

	// Email verification routes
	r.GET("/api/auth/verify-email", emailVerificationHandler.VerifyEmail)
	r.POST("/api/auth/resend-verification", emailVerificationHandler.ResendVerification)

	// Admin routes
	r.GET("/api/admin/users", adminHandler.GetUsers)

	// Test user table endpoint
	r.GET("/test-users", func(c *gin.Context) {
		var count int
		err := db.QueryRow(context.Background(), `SELECT COUNT(*) FROM "user"`).Scan(&count)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{"count": count, "message": "User table accessible"})
	})

	// Ping endpoint
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"message": "pong",
			"status":  "Go server is running",
		})
	})

	// Test DB endpoint
	r.GET("/test-db", func(c *gin.Context) {
		var version string
		err := db.QueryRow(context.Background(), "SELECT version()").Scan(&version)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"message":    "Database connection working",
			"db_version": version,
		})
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "3000"
	}

	fmt.Printf("Server running on port %s\n", port)
	r.Run(":" + port)
}
