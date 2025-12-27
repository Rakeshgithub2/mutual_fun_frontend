# Test Backend Data - Market Indices and Fund Count
# Tests the actual backend responses to verify data availability

$API_URL = "http://localhost:3002"

Write-Host "`n=== BACKEND DATA VERIFICATION ===" -ForegroundColor Cyan
Write-Host "Testing backend at: $API_URL`n" -ForegroundColor Yellow

# Test 1: Market Indices
Write-Host "TEST 1: Market Indices Endpoint" -ForegroundColor Green
Write-Host "URL: $API_URL/api/market-indices" -ForegroundColor Gray
try {
    $marketResponse = Invoke-RestMethod -Uri "$API_URL/api/market-indices" -Method Get -TimeoutSec 10
    
    if ($marketResponse.success) {
        Write-Host "  ✅ Market indices endpoint working" -ForegroundColor Green
        
        if ($marketResponse.data.indian) {
            $indianCount = $marketResponse.data.indian.Count
            Write-Host "  📊 Indian indices: $indianCount" -ForegroundColor Cyan
            
            # Show first 3 indices
            $marketResponse.data.indian | Select-Object -First 3 | ForEach-Object {
                $changeSymbol = if ($_.change -gt 0) { "+" } else { "-" }
                $changePct = [Math]::Abs($_.changePercent)
                $displayText = "     - $($_.name): $($_.currentValue) ($changeSymbol" + "$changePct%)"
                Write-Host $displayText -ForegroundColor White
            }
        } elseif ($marketResponse.data -is [Array]) {
            Write-Host "  📊 Total indices: $($marketResponse.data.Count)" -ForegroundColor Cyan
            $marketResponse.data | Select-Object -First 3 | ForEach-Object {
                Write-Host "     - $($_.name): $($_.value)" -ForegroundColor White
            }
        }
        
        if ($marketResponse.data.global) {
            Write-Host "  🌍 Global indices: $($marketResponse.data.global.Count)" -ForegroundColor Cyan
        }
    } else {
        Write-Host "  ❌ API returned success: false" -ForegroundColor Red
        Write-Host "     Message: $($marketResponse.message)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "  ❌ Failed to fetch market indices" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n" + ("─" * 70) + "`n"

# Test 2: Funds Count (Page 1)
Write-Host "TEST 2: Funds Pagination (Page 1, limit=200)" -ForegroundColor Green
Write-Host "URL: $API_URL/api/funds?page=1&limit=200" -ForegroundColor Gray
try {
    $fundsPage1 = Invoke-RestMethod -Uri "$API_URL/api/funds?page=1&limit=200" -Method Get -TimeoutSec 10
    
    if ($fundsPage1.success) {
        $page1Count = $fundsPage1.data.Count
        $totalFunds = $fundsPage1.pagination.total
        $hasNext = $fundsPage1.pagination.hasNext
        
        Write-Host "  ✅ Funds endpoint working" -ForegroundColor Green
        Write-Host "  📊 Page 1 returned: $page1Count funds" -ForegroundColor Cyan
        Write-Host "  📊 Total funds in DB: $totalFunds" -ForegroundColor Cyan
        Write-Host "  📊 Has next page: $hasNext" -ForegroundColor Cyan
        Write-Host "  📊 Estimated total pages: $([Math]::Ceiling($totalFunds / 200))" -ForegroundColor Cyan
        
        # Show first 3 funds
        Write-Host "`n  Sample funds:" -ForegroundColor White
        $fundsPage1.data | Select-Object -First 3 | ForEach-Object {
            Write-Host "     - $($_.name) ($($_.category))" -ForegroundColor White
        }
    } else {
        Write-Host "  ❌ API returned success: false" -ForegroundColor Red
    }
} catch {
    Write-Host "  ❌ Failed to fetch funds" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n" + ("─" * 70) + "`n"

# Test 3: Equity Funds Count
Write-Host "TEST 3: Equity Funds Count" -ForegroundColor Green
Write-Host "URL: $API_URL/api/funds?category=equity&limit=1" -ForegroundColor Gray
try {
    $equityFunds = Invoke-RestMethod -Uri "$API_URL/api/funds?category=equity&limit=1" -Method Get -TimeoutSec 10
    
    if ($equityFunds.success) {
        $equityTotal = $equityFunds.pagination.total
        Write-Host "  ✅ Equity category working" -ForegroundColor Green
        Write-Host "  💼 Total equity funds: $equityTotal" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Failed to fetch equity funds" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n" + ("─" * 70) + "`n"

# Test 4: Debt Funds Count
Write-Host "TEST 4: Debt Funds Count" -ForegroundColor Green
Write-Host "URL: $API_URL/api/funds?category=debt&limit=1" -ForegroundColor Gray
try {
    $debtFunds = Invoke-RestMethod -Uri "$API_URL/api/funds?category=debt&limit=1" -Method Get -TimeoutSec 10
    
    if ($debtFunds.success) {
        $debtTotal = $debtFunds.pagination.total
        Write-Host "  ✅ Debt category working" -ForegroundColor Green
        Write-Host "  💳 Total debt funds: $debtTotal" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Failed to fetch debt funds" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n" + ("─" * 70) + "`n"

# Test 5: Hybrid Funds Count
Write-Host "TEST 5: Hybrid Funds Count" -ForegroundColor Green
Write-Host "URL: $API_URL/api/funds?category=hybrid&limit=1" -ForegroundColor Gray
try {
    $hybridFunds = Invoke-RestMethod -Uri "$API_URL/api/funds?category=hybrid&limit=1" -Method Get -TimeoutSec 10
    
    if ($hybridFunds.success) {
        $hybridTotal = $hybridFunds.pagination.total
        Write-Host "  ✅ Hybrid category working" -ForegroundColor Green
        Write-Host "  🔀 Total hybrid funds: $hybridTotal" -ForegroundColor Cyan
    }
} catch {
    Write-Host "  ❌ Failed to fetch hybrid funds" -ForegroundColor Red
    Write-Host "     Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

Write-Host "`n" + ("─" * 70) + "`n"

# Summary
Write-Host "=== SUMMARY ===" -ForegroundColor Cyan
Write-Host "Backend URL: $API_URL" -ForegroundColor White
Write-Host "`nIf backend is not running, start it with:" -ForegroundColor Yellow
Write-Host "  cd path\to\mutualfun-backend" -ForegroundColor Gray
Write-Host "  npm run dev" -ForegroundColor Gray
Write-Host "`n" -ForegroundColor White
