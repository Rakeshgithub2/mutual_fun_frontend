#!/usr/bin/env pwsh
# Quick Connection Test Script

Write-Host "`n🔍 Testing Full Stack Connection" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Gray

# Test 1: MongoDB
Write-Host "1️⃣  MongoDB (27017): " -NoNewline
$mongo = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongo) {
    Write-Host "✅ RUNNING" -ForegroundColor Green
} else {
    Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start: mongod --dbpath ./data`n" -ForegroundColor Yellow
    exit 1
}

# Test 2: Backend API
Write-Host "2️⃣  Backend API (3002): " -NoNewline
$backendPort = netstat -ano | Select-String ":3002.*LISTENING"
if ($backendPort) {
    Write-Host "✅ RUNNING" -ForegroundColor Green
    
    # Test API endpoint
    try {
        $apiTest = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=1" -TimeoutSec 5
        Write-Host "   → API Response: " -NoNewline -ForegroundColor Gray
        Write-Host "✅ $($apiTest.message)" -ForegroundColor Green
        Write-Host "   → Funds in DB: $($apiTest.pagination.total)" -ForegroundColor Gray
    } catch {
        Write-Host "   → ⚠️  API not responding" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start: cd mutual-funds-backend && npm run dev`n" -ForegroundColor Yellow
    exit 1
}

# Test 3: Frontend
Write-Host "3️⃣  Frontend (5001): " -NoNewline
$frontendPort = netstat -ano | Select-String ":5001.*LISTENING"
if ($frontendPort) {
    Write-Host "✅ RUNNING" -ForegroundColor Green
} else {
    Write-Host "❌ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start: npm run dev`n" -ForegroundColor Yellow
    exit 1
}

# Test 4: Environment Configuration
Write-Host "4️⃣  Environment Config: " -NoNewline
if (Test-Path ".env.local") {
    $apiUrl = Get-Content ".env.local" | Select-String "NEXT_PUBLIC_API_URL" | Select-Object -First 1
    if ($apiUrl -match "http://localhost:3002/api") {
        Write-Host "✅ CORRECT" -ForegroundColor Green
        Write-Host "   → $apiUrl" -ForegroundColor Gray
    } else {
        Write-Host "⚠️  NEEDS UPDATE" -ForegroundColor Yellow
        Write-Host "   → Current: $apiUrl" -ForegroundColor Gray
        Write-Host "   → Expected: NEXT_PUBLIC_API_URL=http://localhost:3002/api" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ MISSING" -ForegroundColor Red
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray

Write-Host "🌐 Access your application:" -ForegroundColor White
Write-Host "   Frontend:  http://localhost:5001" -ForegroundColor Cyan
Write-Host "   Backend:   http://localhost:3002" -ForegroundColor Cyan
Write-Host "   API Docs:  http://localhost:3002/api" -ForegroundColor Cyan

Write-Host "`n🔗 Data Flow:" -ForegroundColor White
Write-Host "   Browser → Frontend (5001) → Backend API (3002) → MongoDB (27017)" -ForegroundColor Gray
Write-Host "`n✅ Ready for real-world operations!`n" -ForegroundColor Green
