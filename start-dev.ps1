# Start Backend (Go) in a new window/tab
Write-Host "Starting Go Backend..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd server; go run main.go"

# Start Frontend (Vite) in the current window
Write-Host "Starting Frontend..." -ForegroundColor Cyan
npm run dev
