package utils

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"strings"
)

// EmailRequest represents the structure for sending emails via Supabase
type EmailRequest struct {
	To      string `json:"to"`
	Subject string `json:"subject"`
	HTML    string `json:"html"`
}

// SendVerificationEmail sends an email verification link to the user
func SendVerificationEmail(email, token string) error {
	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:5173"
	}

	verificationLink := fmt.Sprintf("%s/verify-email?token=%s", appURL, token)

	// Load HTML template
	template, err := os.ReadFile("templates/verification_email.html")
	if err != nil {
		return fmt.Errorf("failed to read email template: %w", err)
	}

	// Replace placeholder with actual link
	htmlContent := strings.ReplaceAll(string(template), "{{VERIFICATION_LINK}}", verificationLink)

	subject := "Verifique seu email - ViralCuts"

	return sendEmail(email, subject, htmlContent)
}

// SendPasswordResetEmail sends a password reset link to the user
func SendPasswordResetEmail(email, token string) error {
	appURL := os.Getenv("APP_URL")
	if appURL == "" {
		appURL = "http://localhost:5173"
	}

	resetLink := fmt.Sprintf("%s/reset-password?token=%s", appURL, token)

	// Load HTML template
	template, err := os.ReadFile("templates/password_reset_email.html")
	if err != nil {
		return fmt.Errorf("failed to read email template: %w", err)
	}

	// Replace placeholder with actual link
	htmlContent := strings.ReplaceAll(string(template), "{{RESET_LINK}}", resetLink)

	subject := "Reset de Senha - ViralCuts"

	return sendEmail(email, subject, htmlContent)
}

// sendEmail is a helper function that sends emails using a simple SMTP-like approach
// In production, you would use a service like SendGrid, Mailgun, or Resend
func sendEmail(to, subject, htmlContent string) error {
	// For development, we'll use a simple HTTP POST to a mock email service
	// In production, replace this with actual email service integration

	// Check if we're in development mode
	isDev := os.Getenv("GO_ENV") != "production"

	if isDev {
		// In development, just log the email
		fmt.Println("=== EMAIL SENT (DEV MODE) ===")
		fmt.Printf("To: %s\n", to)
		fmt.Printf("Subject: %s\n", subject)
		fmt.Printf("Content: %s\n", htmlContent)
		fmt.Println("=============================")
		return nil
	}

	// Production email sending using Resend API (recommended)
	// You can also use SendGrid, Mailgun, or any other service
	resendAPIKey := os.Getenv("RESEND_API_KEY")
	if resendAPIKey == "" {
		return fmt.Errorf("RESEND_API_KEY not set in environment")
	}

	type ResendEmail struct {
		From    string `json:"from"`
		To      string `json:"to"`
		Subject string `json:"subject"`
		HTML    string `json:"html"`
	}

	emailData := ResendEmail{
		From:    "ViralCuts <noreply@viralcuts.com>",
		To:      to,
		Subject: subject,
		HTML:    htmlContent,
	}

	jsonData, err := json.Marshal(emailData)
	if err != nil {
		return fmt.Errorf("failed to marshal email data: %w", err)
	}

	req, err := http.NewRequest("POST", "https://api.resend.com/emails", bytes.NewBuffer(jsonData))
	if err != nil {
		return fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Authorization", "Bearer "+resendAPIKey)
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("failed to send email: %w", err)
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		return fmt.Errorf("email service returned status: %d", resp.StatusCode)
	}

	return nil
}
