# Detailed API Testing Script
# Tests all backend APIs with detailed response validation

Write-Host "================================" -ForegroundColor Cyan
Write-Host "DETAILED API TESTING" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$API_URL = "http://localhost:3002/api"
$results = @()

function Test-API {
    param(
        [string]$Category,
        [string]$Name,
        [string]$Endpoint,
        [string]$Method = "GET",
        [hashtable]$Body = $null,
        [switch]$ShowResponse
    )
    
    Write-Host "`n[$Category] $Name" -ForegroundColor Yellow
    Write-Host "Endpoint: $Method $Endpoint" -ForegroundColor Gray
    
    try {
        $params = @{
            Uri = $Endpoint
            Method = $Method
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json)
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        
        Write-Host "Status: SUCCESS ✓" -ForegroundColor Green
        
        if ($ShowResponse) {
            Write-Host "Response:" -ForegroundColor Cyan
            $response | ConvertTo-Json -Depth 3 | Write-Host
        } else {
            Write-Host "Response keys: $($response.PSObject.Properties.Name -join ', ')" -ForegroundColor Cyan
        }
        
        $script:results += @{
            Category = $Category
            Name = $Name
            Status = "PASS"
            Endpoint = $Endpoint
        }
        
        return $response
    }
    catch {
        Write-Host "Status: FAILED ✗" -ForegroundColor Red
        Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
        
        $script:results += @{
            Category = $Category
            Name = $Name
            Status = "FAIL"
            Endpoint = $Endpoint
            Error = $_.Exception.Message
        }
        
        return $null
    }
}

# 1. BASIC HEALTH CHECKS
Write-Host "`n=== BASIC HEALTH CHECKS ===" -ForegroundColor Cyan
Test-API -Category "Health" -Name "Backend Health" -Endpoint "http://localhost:3002/health" -ShowResponse
Test-API -Category "Health" -Name "API Test" -Endpoint "$API_URL/test" -ShowResponse

# 2. FUNDS APIs
Write-Host "`n=== FUNDS APIs ===" -ForegroundColor Cyan
$fundsResponse = Test-API -Category "Funds" -Name "Get All Funds" -Endpoint "$API_URL/funds?limit=5"
Test-API -Category "Funds" -Name "Search Funds (HDFC)" -Endpoint "$API_URL/funds/search?q=hdfc&limit=5"
Test-API -Category "Funds" -Name "Search Funds (SBI)" -Endpoint "$API_URL/funds/search?q=sbi&limit=5"
Test-API -Category "Funds" -Name "Fund Categories" -Endpoint "$API_URL/funds/categories"
Test-API -Category "Funds" -Name "Fund Types" -Endpoint "$API_URL/funds/types"
Test-API -Category "Funds" -Name "Top Performing" -Endpoint "$API_URL/funds/top-performing?limit=5"
Test-API -Category "Funds" -Name "Filter by Category" -Endpoint "$API_URL/funds?category=Equity&limit=5"
Test-API -Category "Funds" -Name "Filter by Type" -Endpoint "$API_URL/funds?type=Growth&limit=5"

# Test specific fund details if we have a fund ID
if ($fundsResponse -and $fundsResponse.data -and $fundsResponse.data.Count -gt 0) {
    $fundId = $fundsResponse.data[0].schemeCode
    Write-Host "`nTesting with Fund ID: $fundId" -ForegroundColor Yellow
    Test-API -Category "Funds" -Name "Fund Details" -Endpoint "$API_URL/funds/$fundId"
    Test-API -Category "Funds" -Name "Fund Performance" -Endpoint "$API_URL/funds/$fundId/performance"
    Test-API -Category "Funds" -Name "Fund Holdings" -Endpoint "$API_URL/funds/$fundId/holdings"
    Test-API -Category "Funds" -Name "Fund Returns" -Endpoint "$API_URL/funds/$fundId/returns"
}

# 3. AUTOCOMPLETE/SUGGEST APIs
Write-Host "`n=== AUTOCOMPLETE/SUGGEST APIs ===" -ForegroundColor Cyan
Test-API -Category "Suggest" -Name "Suggest Funds (h)" -Endpoint "$API_URL/suggest/funds?q=h&limit=10"
Test-API -Category "Suggest" -Name "Suggest Funds (hdfc)" -Endpoint "$API_URL/suggest/funds?q=hdfc&limit=10"
Test-API -Category "Suggest" -Name "Suggest Funds (sbi)" -Endpoint "$API_URL/suggest/funds?q=sbi&limit=10"
Test-API -Category "Suggest" -Name "Suggest Funds (icici)" -Endpoint "$API_URL/suggest/funds?q=icici&limit=10"
Test-API -Category "Suggest" -Name "Suggest Funds (axis)" -Endpoint "$API_URL/suggest/funds?q=axis&limit=10"

# 4. COMPARISON & OVERLAP APIs
Write-Host "`n=== COMPARISON & OVERLAP APIs ===" -ForegroundColor Cyan
Test-API -Category "Comparison" -Name "Compare Info" -Endpoint "$API_URL/comparison/compare" -ShowResponse
Test-API -Category "Comparison" -Name "Overlap Info" -Endpoint "$API_URL/comparison/overlap" -ShowResponse

# 5. CALCULATOR APIs
Write-Host "`n=== CALCULATOR APIs ===" -ForegroundColor Cyan
Test-API -Category "Calculator" -Name "SIP Calculator Info" -Endpoint "$API_URL/calculator/sip"
Test-API -Category "Calculator" -Name "Lumpsum Calculator Info" -Endpoint "$API_URL/calculator/lumpsum"
Test-API -Category "Calculator" -Name "SWP Calculator Info" -Endpoint "$API_URL/calculator/swp"
Test-API -Category "Calculator" -Name "CAGR Calculator Info" -Endpoint "$API_URL/calculator/cagr"

# 6. MARKET DATA APIs
Write-Host "`n=== MARKET DATA APIs ===" -ForegroundColor Cyan
Test-API -Category "Market" -Name "Latest Market Indices" -Endpoint "$API_URL/market-indices/latest"
Test-API -Category "Market" -Name "Market Indices History" -Endpoint "$API_URL/market-indices/history?symbol=NIFTY50&days=7"
Test-API -Category "News" -Name "Latest News" -Endpoint "$API_URL/news/latest?limit=5"
Test-API -Category "News" -Name "Market News" -Endpoint "$API_URL/news/category/market?limit=5"

# 7. AUTHENTICATION APIs
Write-Host "`n=== AUTHENTICATION APIs ===" -ForegroundColor Cyan
Test-API -Category "Auth" -Name "Auth Health" -Endpoint "$API_URL/auth/health" -ShowResponse

# 8. KYC APIs
Write-Host "`n=== KYC APIs ===" -ForegroundColor Cyan
Test-API -Category "KYC" -Name "KYC Status Check" -Endpoint "$API_URL/kyc/status"

# 9. AI CHATBOT APIs
Write-Host "`n=== AI CHATBOT APIs ===" -ForegroundColor Cyan
Test-API -Category "AI" -Name "Chat Endpoint Info" -Endpoint "$API_URL/ai/chat"

# 10. ADMIN APIs
Write-Host "`n=== ADMIN APIs ===" -ForegroundColor Cyan
Test-API -Category "Admin" -Name "Admin Health" -Endpoint "$API_URL/admin/health"

# SUMMARY REPORT
Write-Host "`n================================" -ForegroundColor Cyan
Write-Host "TEST SUMMARY REPORT" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

$passed = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failed = ($results | Where-Object { $_.Status -eq "FAIL" }).Count
$total = $results.Count

Write-Host "`nTotal Tests: $total" -ForegroundColor White
Write-Host "Passed: $passed" -ForegroundColor Green
Write-Host "Failed: $failed" -ForegroundColor Red

if ($failed -gt 0) {
    Write-Host "`nFailed Tests:" -ForegroundColor Red
    $results | Where-Object { $_.Status -eq "FAIL" } | ForEach-Object {
        Write-Host "  ✗ [$($_.Category)] $($_.Name)" -ForegroundColor Red
        Write-Host "    $($_.Endpoint)" -ForegroundColor Gray
        Write-Host "    Error: $($_.Error)" -ForegroundColor Yellow
    }
}

Write-Host "`nTests by Category:" -ForegroundColor Cyan
$results | Group-Object Category | ForEach-Object {
    $categoryPassed = ($_.Group | Where-Object { $_.Status -eq "PASS" }).Count
    $categoryTotal = $_.Count
    $percentage = [math]::Round(($categoryPassed / $categoryTotal) * 100, 1)
    Write-Host "  $($_.Name): $categoryPassed/$categoryTotal ($percentage%)" -ForegroundColor $(if ($categoryPassed -eq $categoryTotal) { "Green" } else { "Yellow" })
}

Write-Host ""
if ($failed -eq 0) {
    Write-Host "================================" -ForegroundColor Green
    Write-Host "ALL APIs WORKING! ✓" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
} else {
    Write-Host "================================" -ForegroundColor Yellow
    Write-Host "SOME APIs NEED ATTENTION!" -ForegroundColor Yellow
    Write-Host "================================" -ForegroundColor Yellow
}
