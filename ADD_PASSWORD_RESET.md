# Como Adicionar Password Reset ao main.go

## Passo 1: Adicionar o handler
Na linha 78, logo após `authHandler := handlers.NewAuthHandler(db)`, adicione:

```go
passwordResetHandler := handlers.NewPasswordResetHandler(db)
```

## Passo 2: Adicionar as rotas
Dentro do bloco `auth := r.Group("/api/auth")` (após a linha 86), adicione estas duas linhas:

```go
auth.POST("/forgot-password", passwordResetHandler.ForgotPassword)
auth.POST("/reset-password", passwordResetHandler.ResetPassword)
```

## Resultado Final
O bloco de auth routes deve ficar assim:

```go
// Initialize auth handler
authHandler := handlers.NewAuthHandler(db)
passwordResetHandler := handlers.NewPasswordResetHandler(db)

// Auth routes (Better Auth compatible)
auth := r.Group("/api/auth")
{
    auth.POST("/sign-up", authHandler.SignUp)
    auth.POST("/sign-in", authHandler.SignIn)
    auth.POST("/sign-out", authHandler.SignOut)
    auth.GET("/session", authHandler.GetSession)
    
    // Password reset routes
    auth.POST("/forgot-password", passwordResetHandler.ForgotPassword)
    auth.POST("/reset-password", passwordResetHandler.ResetPassword)
}
```

Depois de fazer essas mudanças, reinicie o servidor Go com `Ctrl+C` e depois `go run main.go`.
