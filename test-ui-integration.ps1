# UI Integration Test Script
# Tests the frontend API client against the backend

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "UI Integration Tests" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3002"
$testsPassed = 0
$testsFailed = 0

# Function to test an endpoint
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [object]$Body = $null
    )
    
    Write-Host "Testing: $Name" -ForegroundColor Yellow
    Write-Host "URL: $Url" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Url
            Method = $Method
            ContentType = "application/json"
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
        }
        
        $response = Invoke-RestMethod @params
        
        if ($response.success -eq $true) {
            Write-Host "✅ PASSED - Success: $($response.success)" -ForegroundColor Green
            Write-Host "   Data received: $($response.data.GetType().Name)" -ForegroundColor Gray
            $script:testsPassed++
            return $response
        } else {
            Write-Host "❌ FAILED - Response not successful" -ForegroundColor Red
            $script:testsFailed++
            return $null
        }
    }
    catch {
        Write-Host "❌ FAILED - Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:testsFailed++
        return $null
    }
    Write-Host ""
}

# Test 1: Health Check
Write-Host "`n1. Health Check" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
$health = Test-Endpoint -Name "Backend Health" -Url "$baseUrl/api/health"

# Test 2: Get Funds List (useFunds hook)
Write-Host "`n2. Get Funds List (Search Page)" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
$funds = Test-Endpoint -Name "Get All Funds" -Url "$baseUrl/api/funds?limit=5"
if ($funds) {
    Write-Host "   📊 Total funds: $($funds.data.Count)" -ForegroundColor Cyan
    Write-Host "   📄 Pagination: Page $($funds.pagination.page) of $($funds.pagination.totalPages)" -ForegroundColor Cyan
}

# Test 3: Search Funds
Write-Host "`n3. Search Funds" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
$search = Test-Endpoint -Name "Search for 'HDFC'" -Url "$baseUrl/api/funds?query=HDFC&limit=3"
if ($search) {
    Write-Host "   🔍 Found: $($search.data.Count) funds" -ForegroundColor Cyan
}

# Test 4: Filter by Category
Write-Host "`n4. Filter by Category" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
$category = Test-Endpoint -Name "Get Equity Funds" -Url "$baseUrl/api/funds?category=equity&limit=3"
if ($category) {
    Write-Host "   📂 Category funds: $($category.data.Count)" -ForegroundColor Cyan
}

# Test 5: Get Single Fund (Fund Detail Page)
Write-Host "`n5. Get Single Fund Details" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
if ($funds -and $funds.data.Count -gt 0) {
    $fundId = $funds.data[0].id
    $fundDetail = Test-Endpoint -Name "Get Fund by ID" -Url "$baseUrl/api/funds/$fundId"
    if ($fundDetail) {
        Write-Host "   📋 Fund: $($fundDetail.data.name)" -ForegroundColor Cyan
        Write-Host "   💰 NAV: ₹$($fundDetail.data.nav)" -ForegroundColor Cyan
        Write-Host "   ⭐ Rating: $($fundDetail.data.ratings.morningstar)/5" -ForegroundColor Cyan
    }
}

# Test 6: Get Suggestions (Autocomplete)
Write-Host "`n6. Get Suggestions (Autocomplete)" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
$suggestions = Test-Endpoint -Name "Get Suggestions for 'axis'" -Url "$baseUrl/api/suggest?query=axis&limit=3"
if ($suggestions) {
    Write-Host "   💡 Suggestions: $($suggestions.data.Count)" -ForegroundColor Cyan
    foreach ($s in $suggestions.data) {
        Write-Host "      - $($s.name) ($($s.category))" -ForegroundColor Gray
    }
}

# Test 7: Compare Funds (Compare Page)
Write-Host "`n7. Compare Multiple Funds" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
if ($funds -and $funds.data.Count -ge 2) {
    $fundIds = @($funds.data[0].id, $funds.data[1].id)
    $compare = Test-Endpoint -Name "Compare 2 Funds" -Url "$baseUrl/api/compare" -Method "POST" -Body @{ fundIds = $fundIds }
    if ($compare) {
        Write-Host "   📊 Comparing: $($compare.data.funds.Count) funds" -ForegroundColor Cyan
    }
}

# Test 8: Calculate Overlap
Write-Host "`n8. Calculate Portfolio Overlap" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
if ($funds -and $funds.data.Count -ge 2) {
    $fundIds = @($funds.data[0].id, $funds.data[1].id)
    $overlap = Test-Endpoint -Name "Calculate Overlap" -Url "$baseUrl/api/overlap" -Method "POST" -Body @{ fundIds = $fundIds }
    if ($overlap) {
        Write-Host "   🔗 Overlap Score: $($overlap.data.overallOverlap)%" -ForegroundColor Cyan
    }
}

# Test 9: Get Price History (Charts)
Write-Host "`n9. Get NAV Price History" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
if ($funds -and $funds.data.Count -gt 0) {
    $fundId = $funds.data[0].id
    $priceHistory = Test-Endpoint -Name "Get Price History" -Url "$baseUrl/api/funds/$fundId/price-history?days=30"
    if ($priceHistory) {
        Write-Host "   📈 Data points: $($priceHistory.data.Count)" -ForegroundColor Cyan
    }
}

# Test 10: Pagination
Write-Host "`n10. Pagination Test" -ForegroundColor Cyan
Write-Host "-----------------------------------" -ForegroundColor Cyan
$page2 = Test-Endpoint -Name "Get Page 2" -Url "$baseUrl/api/funds?page=2&limit=5"
if ($page2) {
    Write-Host "   📄 Page 2 funds: $($page2.data.Count)" -ForegroundColor Cyan
    Write-Host "   ⏭️ Has more: $($page2.pagination.hasMore)" -ForegroundColor Cyan
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Results Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✅ Tests Passed: $testsPassed" -ForegroundColor Green
Write-Host "❌ Tests Failed: $testsFailed" -ForegroundColor Red
Write-Host "📊 Total Tests: $($testsPassed + $testsFailed)" -ForegroundColor Cyan

if ($testsFailed -eq 0) {
    Write-Host "`n🎉 All tests passed! UI integration is working correctly." -ForegroundColor Green
    Write-Host "   You can now start the frontend with: npm run dev" -ForegroundColor Cyan
} else {
    Write-Host "`n⚠️ Some tests failed. Please check:" -ForegroundColor Yellow
    Write-Host "   1. Backend server is running (npm start in mutual-funds-backend)" -ForegroundColor Yellow
    Write-Host "   2. MongoDB is running and connected" -ForegroundColor Yellow
    Write-Host "   3. Database has been seeded (npm run seed)" -ForegroundColor Yellow
}

Write-Host ""
