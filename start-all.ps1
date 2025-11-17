# Start Both Frontend and Backend Servers

Write-Host "🚀 Starting Mutual Fund Portal" -ForegroundColor Cyan
Write-Host "==============================" -ForegroundColor Cyan
Write-Host ""

# Check if backend dependencies are installed
Write-Host "1️⃣ Checking backend setup..." -ForegroundColor Yellow
if (-not (Test-Path "mutual-funds-backend\node_modules")) {
    Write-Host "   Installing backend dependencies..." -ForegroundColor Gray
    Set-Location "mutual-funds-backend"
    npm install
    Set-Location ".."
    Write-Host "   ✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✅ Backend dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Check if frontend dependencies are installed
Write-Host "2️⃣ Checking frontend setup..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   Installing frontend dependencies..." -ForegroundColor Gray
    npm install
    Write-Host "   ✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "   ✅ Frontend dependencies already installed" -ForegroundColor Green
}

Write-Host ""

# Start Backend Server
Write-Host "3️⃣ Starting Backend Server (Port 3002)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\mutual-funds-backend'; Write-Host '🔧 BACKEND SERVER' -ForegroundColor Cyan; Write-Host '==================' -ForegroundColor Cyan; Write-Host ''; npm run dev"

Write-Host "   ✅ Backend starting in new terminal" -ForegroundColor Green
Write-Host ""

# Wait for backend to start
Write-Host "⏰ Waiting 10 seconds for backend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 10

Write-Host ""

# Start Frontend Server
Write-Host "4️⃣ Starting Frontend Server (Port 5001)..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; Write-Host '🎨 FRONTEND SERVER' -ForegroundColor Magenta; Write-Host '==================' -ForegroundColor Magenta; Write-Host ''; npm run dev"

Write-Host "   ✅ Frontend starting in new terminal" -ForegroundColor Green
Write-Host ""

# Wait for frontend to start
Write-Host "⏰ Waiting 15 seconds for frontend to initialize..." -ForegroundColor Gray
Start-Sleep -Seconds 15

Write-Host ""

# Display status
Write-Host "✅ Both servers started successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                  🎉 SERVERS RUNNING 🎉                   ║" -ForegroundColor Cyan
Write-Host "╠══════════════════════════════════════════════════════════╣" -ForegroundColor Cyan
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║  🔧 Backend:  http://localhost:3002                      ║" -ForegroundColor White
Write-Host "║     Status:   Check http://localhost:3002/health         ║" -ForegroundColor Gray
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "║  🎨 Frontend: http://localhost:5001                      ║" -ForegroundColor White
Write-Host "║     Portal:   Open in your browser                       ║" -ForegroundColor Gray
Write-Host "║                                                          ║" -ForegroundColor Cyan
Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Test backend health
Write-Host "🔍 Testing backend connection..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 5 -ErrorAction Stop
    Write-Host "✅ Backend is responding!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend might still be starting up..." -ForegroundColor Yellow
    Write-Host "   Wait a few more seconds and check the backend terminal" -ForegroundColor Gray
}

Write-Host ""

# Open browser
Write-Host "🌐 Opening frontend in browser..." -ForegroundColor Yellow
Start-Sleep -Seconds 2
Start-Process "http://localhost:5001"

Write-Host ""
Write-Host "💡 Tips:" -ForegroundColor Cyan
Write-Host "   • Frontend: http://localhost:5001" -ForegroundColor White
Write-Host "   • Backend API: http://localhost:3002/api" -ForegroundColor White
Write-Host "   • Press Ctrl+C in each terminal to stop servers" -ForegroundColor White
Write-Host "   • Check terminal windows for logs and errors" -ForegroundColor White
Write-Host ""

Write-Host "📚 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Browse the mutual fund portal" -ForegroundColor White
Write-Host "   2. Run .\quickstart-real-data.ps1 to add real fund data" -ForegroundColor White
Write-Host "   3. Test features and explore!" -ForegroundColor White
Write-Host ""

Write-Host "🎉 Happy Coding!" -ForegroundColor Green
Write-Host ""
