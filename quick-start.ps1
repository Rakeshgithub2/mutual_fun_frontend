# Quick Start Script for Testing Frontend Integration
# PowerShell Script

Write-Host "🚀 Frontend Integration Quick Start" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green
Write-Host ""

# Check if backend is running
Write-Host "📡 Checking backend..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -UseBasicParsing -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running on port 3002" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Backend is NOT running on port 3002" -ForegroundColor Red
    Write-Host "   Please start the backend first:" -ForegroundColor Yellow
    Write-Host "   cd mutual-funds-backend" -ForegroundColor White
    Write-Host "   npm run dev" -ForegroundColor White
    Write-Host ""
    exit 1
}

# Check if funds are available
Write-Host "📊 Checking funds data..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?limit=1" -UseBasicParsing -TimeoutSec 5
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success -and $data.pagination.total -gt 0) {
        Write-Host "✅ Found $($data.pagination.total) funds in database" -ForegroundColor Green
    } else {
        Write-Host "⚠️ No funds found in database" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Could not fetch funds data" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Check environment file
Write-Host "🔧 Checking environment configuration..." -ForegroundColor Yellow
$envFile = ".env.local"
if (Test-Path $envFile) {
    $envContent = Get-Content $envFile -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL=http://localhost:3002") {
        Write-Host "✅ Environment file configured correctly" -ForegroundColor Green
    } else {
        Write-Host "⚠️ NEXT_PUBLIC_API_URL not set to http://localhost:3002" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ .env.local file not found" -ForegroundColor Red
}

# Check if required packages are installed
Write-Host "📦 Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "✅ Node modules found" -ForegroundColor Green
} else {
    Write-Host "⚠️ Node modules not found. Run: npm install" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ Pre-flight checks complete!" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""

Write-Host "📝 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Start the frontend: npm run dev" -ForegroundColor White
Write-Host "2. Open browser: http://localhost:5001/funds-demo" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   See FRONTEND_INTEGRATION_GUIDE.md for full details" -ForegroundColor White
Write-Host ""

# Ask if user wants to start frontend
$response = Read-Host "Would you like to start the frontend now? (Y/N)"
if ($response -eq "Y" -or $response -eq "y") {
    Write-Host ""
    Write-Host "🚀 Starting frontend on port 5001..." -ForegroundColor Green
    npm run dev
}
