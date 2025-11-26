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

	// Initialize Gin router
	r := gin.Default()

	// CORS Middleware
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "http://localhost:5173")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	// Initialize auth handler
	authHandler := handlers.NewAuthHandler(db)

	// Auth routes (Better Auth compatible)
	auth := r.Group("/api/auth")
	{
		auth.POST("/sign-up", authHandler.SignUp)
		auth.POST("/sign-in", authHandler.SignIn)
		auth.POST("/sign-out", authHandler.SignOut)
		auth.GET("/session", authHandler.GetSession)
	}

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
