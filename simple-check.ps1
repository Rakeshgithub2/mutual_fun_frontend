# Quick System Check
Write-Host "=== QUICK SYSTEM CHECK ===" -ForegroundColor Cyan

# 1. Backend Check
Write-Host "`n1. Checking Backend..." -NoNewline
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 2. Frontend Check
Write-Host "2. Checking Frontend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001" -TimeoutSec 5 -UseBasicParsing
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 3. API Test
Write-Host "3. Testing API..." -NoNewline
try {
    $api = Invoke-RestMethod -Uri "http://localhost:3002/api/test" -TimeoutSec 5
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 4. Funds API
Write-Host "4. Testing Funds API..." -NoNewline
try {
    $funds = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=5" -TimeoutSec 10
    Write-Host " OK - $($funds.data.Count) funds" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 5. Autocomplete API
Write-Host "5. Testing Autocomplete..." -NoNewline
try {
    $suggest = Invoke-RestMethod -Uri "http://localhost:3002/api/suggest/funds?q=hdfc&limit=5" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 6. Market Indices
Write-Host "6. Testing Market Data..." -NoNewline
try {
    $market = Invoke-RestMethod -Uri "http://localhost:3002/api/market-indices/latest" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 7. Search API
Write-Host "7. Testing Search..." -NoNewline
try {
    $search = Invoke-RestMethod -Uri "http://localhost:3002/api/funds/search?q=hdfc&limit=5" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

# 8. Categories
Write-Host "8. Testing Categories..." -NoNewline
try {
    $categories = Invoke-RestMethod -Uri "http://localhost:3002/api/funds/categories" -TimeoutSec 10
    Write-Host " OK" -ForegroundColor Green
} catch {
    Write-Host " FAILED" -ForegroundColor Red
}

Write-Host "`n=== SYSTEM STATUS ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5001" -ForegroundColor White
Write-Host "Backend:  http://localhost:3002" -ForegroundColor White
Write-Host ""
