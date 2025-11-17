# Start Both Frontend and Backend Servers

Write-Host "Starting Mutual Fund Portal" -ForegroundColor Cyan
Write-Host "===========================" -ForegroundColor Cyan
Write-Host ""

# Check backend dependencies
Write-Host "Checking backend setup..." -ForegroundColor Yellow
if (-not (Test-Path "mutual-funds-backend\node_modules")) {
    Write-Host "  Installing backend dependencies..." -ForegroundColor Gray
    Set-Location "mutual-funds-backend"
    npm install
    Set-Location ".."
}
Write-Host "  Backend ready" -ForegroundColor Green
Write-Host ""

# Check frontend dependencies
Write-Host "Checking frontend setup..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "  Installing frontend dependencies..." -ForegroundColor Gray
    npm install
}
Write-Host "  Frontend ready" -ForegroundColor Green
Write-Host ""

# Start Backend
Write-Host "Starting Backend Server (Port 3002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\mutual-funds-backend'; Write-Host 'BACKEND SERVER' -ForegroundColor Cyan; npm run dev"
Write-Host "  Backend starting in new window" -ForegroundColor Green
Start-Sleep -Seconds 10
Write-Host ""

# Start Frontend
Write-Host "Starting Frontend Server (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host 'FRONTEND SERVER' -ForegroundColor Magenta; npm run dev"
Write-Host "  Frontend starting in new window" -ForegroundColor Green
Start-Sleep -Seconds 15
Write-Host ""

# Status
Write-Host "========================================" -ForegroundColor Green
Write-Host "SERVERS RUNNING" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Backend:  http://localhost:3002" -ForegroundColor White
Write-Host "Frontend: http://localhost:5001" -ForegroundColor White
Write-Host ""

# Test backend
Write-Host "Testing backend connection..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "Backend is responding!" -ForegroundColor Green
} catch {
    Write-Host "Backend might still be starting..." -ForegroundColor Yellow
}
Write-Host ""

# Open browser
Write-Host "Opening browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "http://localhost:5001"
Write-Host ""

Write-Host "Tips:" -ForegroundColor Cyan
Write-Host "  - Frontend: http://localhost:5001" -ForegroundColor White
Write-Host "  - Backend: http://localhost:3002/api" -ForegroundColor White
Write-Host "  - Press Ctrl+C in terminals to stop" -ForegroundColor White
Write-Host ""
Write-Host "Next: Run .\quickstart-real-data.ps1 to add fund data" -ForegroundColor Yellow
Write-Host ""
