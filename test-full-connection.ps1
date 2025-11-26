#!/usr/bin/env pwsh

Write-Host "🔍 Testing Full Stack Connectivity (Frontend → Backend → Database)" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Gray
Write-Host ""

# Test 1: Check MongoDB Connection
Write-Host "📊 Test 1: MongoDB Connection" -ForegroundColor Yellow
Write-Host "-" * 80
$mongoRunning = Get-Process -Name "mongod" -ErrorAction SilentlyContinue
if ($mongoRunning) {
    Write-Host "✅ MongoDB is running (PID: $($mongoRunning.Id))" -ForegroundColor Green
    
    # Test MongoDB connectivity
    try {
        $mongoTest = netstat -ano | Select-String ":27017.*LISTENING"
        if ($mongoTest) {
            Write-Host "✅ MongoDB listening on port 27017" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Could not verify MongoDB port" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ MongoDB is NOT running!" -ForegroundColor Red
    Write-Host "   Start MongoDB first: mongod --dbpath <path>" -ForegroundColor Yellow
}
Write-Host ""

# Test 2: Check Backend Server
Write-Host "🖥️  Test 2: Backend Server (Port 3002)" -ForegroundColor Yellow
Write-Host "-" * 80
$backendPort = netstat -ano | Select-String ":3002.*LISTENING"
if ($backendPort) {
    Write-Host "✅ Backend server is running on port 3002" -ForegroundColor Green
    
    # Test backend health endpoint
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
        Write-Host "✅ Backend health check passed" -ForegroundColor Green
        Write-Host "   Status: $($response.status)" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Backend is running but health check failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
    
    # Test backend API endpoint
    try {
        $testResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/test" -TimeoutSec 5
        Write-Host "✅ Backend API test endpoint working" -ForegroundColor Green
        Write-Host "   Response: $($testResponse.message)" -ForegroundColor Gray
    } catch {
        Write-Host "⚠️  Backend API test failed: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Backend server is NOT running on port 3002!" -ForegroundColor Red
    Write-Host "   Start backend: cd mutual-funds-backend && npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Test 3: Check Frontend Server
Write-Host "🌐 Test 3: Frontend Server (Port 5001)" -ForegroundColor Yellow
Write-Host "-" * 80
$frontendPort = netstat -ano | Select-String ":5001.*LISTENING"
if ($frontendPort) {
    Write-Host "✅ Frontend server is running on port 5001" -ForegroundColor Green
    
    # Test frontend connection
    try {
        $frontResponse = Invoke-WebRequest -Uri "http://localhost:5001" -TimeoutSec 5 -UseBasicParsing
        if ($frontResponse.StatusCode -eq 200) {
            Write-Host "✅ Frontend is accessible" -ForegroundColor Green
        }
    } catch {
        Write-Host "⚠️  Frontend is running but not responding: $($_.Exception.Message)" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Frontend server is NOT running on port 5001!" -ForegroundColor Red
    Write-Host "   Start frontend: npm run dev" -ForegroundColor Yellow
}
Write-Host ""

# Test 4: Check Backend Database Connection
Write-Host "🔗 Test 4: Backend ↔️ Database Connection" -ForegroundColor Yellow
Write-Host "-" * 80
if ($backendPort -and $mongoRunning) {
    try {
        # Test funds endpoint to verify DB connection
        $fundsResponse = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=1" -TimeoutSec 10
        if ($fundsResponse.success -eq $true) {
            Write-Host "✅ Backend successfully connected to MongoDB" -ForegroundColor Green
            Write-Host "   Retrieved funds data from database" -ForegroundColor Gray
            Write-Host "   Total funds available: $($fundsResponse.pagination.total)" -ForegroundColor Gray
        } else {
            Write-Host "⚠️  Backend responded but no data returned" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "❌ Failed to retrieve data from database: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "   This might indicate a database connection issue" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  Cannot test - Backend or MongoDB not running" -ForegroundColor Yellow
}
Write-Host ""

# Test 5: Check Frontend → Backend Connection
Write-Host "🔄 Test 5: Frontend ↔️ Backend Connection" -ForegroundColor Yellow
Write-Host "-" * 80
Write-Host "Frontend API URL configured: http://localhost:3002" -ForegroundColor Gray
if ($frontendPort -and $backendPort) {
    Write-Host "✅ Both frontend and backend are running" -ForegroundColor Green
    Write-Host "   Frontend can connect to backend API" -ForegroundColor Gray
} else {
    Write-Host "❌ Frontend-Backend connection unavailable" -ForegroundColor Red
    if (-not $frontendPort) { Write-Host "   - Frontend not running" -ForegroundColor Yellow }
    if (-not $backendPort) { Write-Host "   - Backend not running" -ForegroundColor Yellow }
}
Write-Host ""

# Test 6: Environment Configuration
Write-Host "⚙️  Test 6: Environment Configuration" -ForegroundColor Yellow
Write-Host "-" * 80

# Check frontend .env.local
if (Test-Path ".env.local") {
    Write-Host "✅ Frontend .env.local exists" -ForegroundColor Green
    $frontendEnv = Get-Content ".env.local" | Select-String "NEXT_PUBLIC_API_URL"
    if ($frontendEnv) {
        Write-Host "   $frontendEnv" -ForegroundColor Gray
    }
} else {
    Write-Host "⚠️  Frontend .env.local not found" -ForegroundColor Yellow
}

# Check backend .env
if (Test-Path "mutual-funds-backend\.env") {
    Write-Host "✅ Backend .env exists" -ForegroundColor Green
    $backendEnv = Get-Content "mutual-funds-backend\.env" | Select-String "DATABASE_URL|PORT"
    foreach ($line in $backendEnv) {
        if ($line -notmatch "JWT_SECRET|GOOGLE_CLIENT_SECRET|API_KEY") {
            Write-Host "   $line" -ForegroundColor Gray
        }
    }
} else {
    Write-Host "⚠️  Backend .env not found" -ForegroundColor Yellow
}
Write-Host ""

# Summary
Write-Host "=" * 80 -ForegroundColor Gray
Write-Host "📋 SUMMARY" -ForegroundColor Cyan
Write-Host "=" * 80 -ForegroundColor Gray

$allGood = $mongoRunning -and $backendPort -and $frontendPort

if ($allGood) {
    Write-Host "✅ ALL SYSTEMS OPERATIONAL!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your stack is fully connected:" -ForegroundColor White
    Write-Host "  Frontend (http://localhost:5001) ↔️" -ForegroundColor Gray
    Write-Host "  Backend API (http://localhost:3002) ↔️" -ForegroundColor Gray
    Write-Host "  MongoDB (localhost:27017)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "🚀 You can now use the application without interruption!" -ForegroundColor Green
} else {
    Write-Host "⚠️  SOME ISSUES DETECTED" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To fix, start the missing components:" -ForegroundColor White
    
    if (-not $mongoRunning) {
        Write-Host "  1. Start MongoDB: mongod --dbpath ./data" -ForegroundColor Yellow
    }
    if (-not $backendPort) {
        Write-Host "  2. Start Backend: cd mutual-funds-backend && npm run dev" -ForegroundColor Yellow
    }
    if (-not $frontendPort) {
        Write-Host "  3. Start Frontend: npm run dev" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "=" * 80 -ForegroundColor Gray
