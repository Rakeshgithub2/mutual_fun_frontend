#!/usr/bin/env pwsh
# Start both frontend and backend servers with correct ports

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       MUTUAL FUND PLATFORM - SERVER STARTUP          ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📋 PORT CONFIGURATION:" -ForegroundColor Yellow
Write-Host "   Frontend: http://localhost:5001" -ForegroundColor Green
Write-Host "   Backend:  http://localhost:3002" -ForegroundColor Green
Write-Host "   MongoDB:  mongodb://localhost:27017" -ForegroundColor Green

# Check if ports are already in use
Write-Host "`n🔍 Checking port availability..." -ForegroundColor Cyan

$port5001 = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
$port3002 = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue

if ($port5001) {
    Write-Host "   ⚠️  Port 5001 is already in use!" -ForegroundColor Yellow
    $response = Read-Host "   Kill the process and continue? (y/n)"
    if ($response -eq 'y') {
        $pid = $port5001.OwningProcess
        Stop-Process -Id $pid -Force
        Write-Host "   ✅ Killed process on port 5001" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

if ($port3002) {
    Write-Host "   ⚠️  Port 3002 is already in use!" -ForegroundColor Yellow
    $response = Read-Host "   Kill the process and continue? (y/n)"
    if ($response -eq 'y') {
        $pid = $port3002.OwningProcess
        Stop-Process -Id $pid -Force
        Write-Host "   ✅ Killed process on port 3002" -ForegroundColor Green
        Start-Sleep -Seconds 2
    }
}

Write-Host "`n✅ Ports are available" -ForegroundColor Green

# Check if MongoDB is running
Write-Host "`n🔍 Checking MongoDB status..." -ForegroundColor Cyan
try {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        Write-Host "   ✅ MongoDB is running (PID: $($mongoProcess.Id))" -ForegroundColor Green
    } else {
        Write-Host "   ⚠️  MongoDB is not running!" -ForegroundColor Yellow
        Write-Host "   Please start MongoDB manually:" -ForegroundColor Yellow
        Write-Host "   mongod --dbpath C:\data\db" -ForegroundColor White
        $continue = Read-Host "   Continue anyway? (y/n)"
        if ($continue -ne 'y') {
            exit 1
        }
    }
} catch {
    Write-Host "   ⚠️  Could not check MongoDB status" -ForegroundColor Yellow
}

# Start Backend Server
Write-Host "`n🚀 Starting Backend Server (port 3002)..." -ForegroundColor Cyan
Write-Host "   Location: .\mutual-funds-backend" -ForegroundColor Gray

$backendPath = Join-Path $PSScriptRoot "mutual-funds-backend"
if (Test-Path $backendPath) {
    Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$backendPath'; Write-Host '🔧 Backend Server Starting...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal
    Write-Host "   ✅ Backend server starting in new window" -ForegroundColor Green
} else {
    Write-Host "   ❌ Backend directory not found!" -ForegroundColor Red
    exit 1
}

# Wait for backend to initialize
Write-Host "`n⏳ Waiting for backend to initialize (10 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Test Backend Health
Write-Host "`n🏥 Testing Backend Health..." -ForegroundColor Cyan
try {
    $healthResponse = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
    Write-Host "   ✅ Backend is healthy!" -ForegroundColor Green
    Write-Host "   Status: $($healthResponse.status)" -ForegroundColor Gray
} catch {
    Write-Host "   ⚠️  Backend health check failed (it might still be starting)" -ForegroundColor Yellow
}

# Start Frontend Server
Write-Host "`n🚀 Starting Frontend Server (port 5001)..." -ForegroundColor Cyan
Write-Host "   Location: ." -ForegroundColor Gray

Start-Process pwsh -ArgumentList "-NoExit", "-Command", "cd '$PSScriptRoot'; Write-Host '🎨 Frontend Server Starting...' -ForegroundColor Cyan; npm run dev" -WindowStyle Normal
Write-Host "   ✅ Frontend server starting in new window" -ForegroundColor Green

# Wait for frontend to initialize
Write-Host "`n⏳ Waiting for frontend to initialize (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              🎉 SERVERS STARTED SUCCESSFULLY!          ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📍 ACCESS YOUR APPLICATION:" -ForegroundColor Cyan
Write-Host "   🌐 Frontend:  http://localhost:5001" -ForegroundColor White
Write-Host "   🔌 Backend:   http://localhost:3002" -ForegroundColor White
Write-Host "   🏥 Health:    http://localhost:3002/health" -ForegroundColor White
Write-Host "   📊 API Test:  http://localhost:3002/api/funds?limit=5" -ForegroundColor White

Write-Host "`n💡 TIPS:" -ForegroundColor Yellow
Write-Host "   • Check the new terminal windows for server logs" -ForegroundColor White
Write-Host "   • Frontend hot-reloads automatically on file changes" -ForegroundColor White
Write-Host "   • Use Ctrl+C in each terminal to stop servers" -ForegroundColor White
Write-Host "   • Check MongoDB with: mongosh --eval 'db.funds.countDocuments()'" -ForegroundColor White

Write-Host "`n🧪 Quick API Test:" -ForegroundColor Cyan
try {
    $testResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=5" -TimeoutSec 10
    Write-Host "   ✅ API is responding!" -ForegroundColor Green
    Write-Host "   Total Funds: $($testResponse.pagination.total)" -ForegroundColor White
    Write-Host "   Returned: $($testResponse.data.Count) funds" -ForegroundColor White
    
    if ($testResponse.data.Count -gt 0) {
        Write-Host "`n   Sample Fund:" -ForegroundColor Gray
        $fund = $testResponse.data[0]
        Write-Host "   - Name: $($fund.name)" -ForegroundColor White
        Write-Host "   - NAV: ₹$($fund.currentNav)" -ForegroundColor White
        Write-Host "   - Category: $($fund.category)" -ForegroundColor White
    }
} catch {
    Write-Host "   ⚠️  Could not test API (backend might still be starting)" -ForegroundColor Yellow
}

Write-Host "`n✨ Open your browser to http://localhost:5001 to see your app!" -ForegroundColor Green
Write-Host "`n📝 Press any key to exit this window (servers will keep running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
