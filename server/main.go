package main

import (
	"context"
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"os"
	"viral-cuts-server/handlers"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
	_ "github.com/jackc/pgx/v5/stdlib"
	"github.com/joho/godotenv"
)

var db *pgx.Conn

func main() {
	// Load .env file
	// We try to load from the current directory or parent directory since we are in /server
	if err := godotenv.Load(); err != nil {
		// Try loading from parent directory if not found in current
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
	config, err := pgx.ParseConfig(dbUrl)
	if err != nil {
		log.Fatalf("Unable to parse database URL: %v\n", err)
	}

	// For Supabase Transaction Pooler (port 6543), we must use simple protocol
	// because it doesn't support prepared statements
	config.DefaultQueryExecMode = pgx.QueryExecModeSimpleProtocol

	db, err = pgx.ConnectConfig(context.Background(), config)
	if err != nil {
		log.Printf("Failed to connect to database: %v\n", err)
		log.Println("\nTroubleshooting tips:")
		log.Println("1. Check if your Supabase project is PAUSED (go to dashboard and click 'Restore project')")
		log.Println("2. Verify DATABASE_URL format in .env:")
		log.Println("   - Transaction mode (port 6543): postgres://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres")
		log.Println("   - Session mode (port 5432): postgres://postgres.[PROJECT-REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:5432/postgres")
		log.Println("3. Ensure password is correct (reset in Project Settings > Database if needed)")
		os.Exit(1)
	}
	defer db.Close(context.Background())

	fmt.Println("Connected to Supabase PostgreSQL successfully!")

	// Create database/sql connection for email verification handler
	dbSQL, err := sql.Open("pgx", dbUrl)
	if err != nil {
		log.Fatalf("Failed to create SQL connection: %v\n", err)
	}
	defer dbSQL.Close()

	// Initialize Gin router
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")

		// Allow localhost for development and Vercel for production
		allowedOrigins := []string{
			"http://localhost:5173",
			"http://localhost:3000",
			"https://viral-cut-kappa.vercel.app/", // Atualize com sua URL da Vercel
		}

		// Check if origin is allowed
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
	emailVerificationHandler := handlers.NewEmailVerificationHandler(dbSQL)

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

	// Ping endpoint (for health checks)
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
