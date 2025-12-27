# Simple Backend Test - Market Indices and Funds
$API_URL = "http://localhost:3002"

Write-Host "`n=== BACKEND DATA TEST ===" -ForegroundColor Cyan
Write-Host "Testing: $API_URL`n" -ForegroundColor Yellow

# Test Market Indices
Write-Host "1. Testing Market Indices..." -ForegroundColor Green
try {
    $market = Invoke-RestMethod -Uri "$API_URL/api/market-indices" -TimeoutSec 10
    if ($market.success) {
        Write-Host "   SUCCESS: Market indices working" -ForegroundColor Green
        if ($market.data.indian) {
            Write-Host "   Indian indices count: $($market.data.indian.Count)" -ForegroundColor Cyan
        }
        if ($market.data.global) {
            Write-Host "   Global indices count: $($market.data.global.Count)" -ForegroundColor Cyan
        }
    }
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Test Funds Page 1
Write-Host "`n2. Testing Funds Page 1 (limit=200)..." -ForegroundColor Green
try {
    $page1 = Invoke-RestMethod -Uri "$API_URL/api/funds?page=1&limit=200" -TimeoutSec 10
    if ($page1.success) {
        Write-Host "   SUCCESS: Funds API working" -ForegroundColor Green
        Write-Host "   Returned: $($page1.data.Count) funds" -ForegroundColor Cyan
        Write-Host "   Total in DB: $($page1.pagination.total)" -ForegroundColor Cyan
        Write-Host "   Has next page: $($page1.pagination.hasNext)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Test Equity Category
Write-Host "`n3. Testing Equity Category..." -ForegroundColor Green
try {
    $equity = Invoke-RestMethod -Uri "$API_URL/api/funds?category=equity&limit=1" -TimeoutSec 10
    if ($equity.success) {
        Write-Host "   SUCCESS: Equity category working" -ForegroundColor Green
        Write-Host "   Total equity funds: $($equity.pagination.total)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

# Test Debt Category
Write-Host "`n4. Testing Debt Category..." -ForegroundColor Green
try {
    $debt = Invoke-RestMethod -Uri "$API_URL/api/funds?category=debt&limit=1" -TimeoutSec 10
    if ($debt.success) {
        Write-Host "   SUCCESS: Debt category working" -ForegroundColor Green
        Write-Host "   Total debt funds: $($debt.pagination.total)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "   FAILED: $_" -ForegroundColor Red
}

Write-Host "`n=== TEST COMPLETE ===`n" -ForegroundColor Cyan
