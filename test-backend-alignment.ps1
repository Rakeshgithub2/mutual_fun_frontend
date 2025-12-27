# Backend Alignment Test Script
# Tests if backend needs any updates for frontend compatibility

Write-Host "======================================" -ForegroundColor Cyan
Write-Host " BACKEND ALIGNMENT TEST" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$testResults = @{
    passed = 0
    failed = 0
    warnings = 0
}

# Check if backend is running
Write-Host "[1/7] Checking if backend is running..." -ForegroundColor Yellow
try {
    $health = Invoke-WebRequest -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 5
    if ($health.StatusCode -eq 200) {
        Write-Host "✅ Backend is running on port 3002" -ForegroundColor Green
        $testResults.passed++
        $backendRunning = $true
    }
} catch {
    Write-Host "❌ Backend is NOT running" -ForegroundColor Red
    Write-Host "   Start backend with: npm run dev:simple" -ForegroundColor Yellow
    $testResults.failed++
    $backendRunning = $false
}
Write-Host ""

if (-not $backendRunning) {
    Write-Host "Cannot proceed with tests. Please start backend first." -ForegroundColor Red
    exit 1
}

# Test 1: Lowercase category
Write-Host "[2/7] Testing lowercase category (equity)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?category=equity&limit=5" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success -eq $true -and $data.data.Count -gt 0) {
        Write-Host "✅ Lowercase category 'equity' works" -ForegroundColor Green
        Write-Host "   Found $($data.data.Count) funds" -ForegroundColor Gray
        $testResults.passed++
    } else {
        Write-Host "⚠️  No funds returned for category=equity" -ForegroundColor Yellow
        $testResults.warnings++
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.failed++
}
Write-Host ""

# Test 2: Uppercase category (should work with normalization)
Write-Host "[3/7] Testing uppercase category (EQUITY)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?category=EQUITY&limit=5" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success -eq $true -and $data.data.Count -gt 0) {
        Write-Host "✅ Uppercase category 'EQUITY' works (case-insensitive)" -ForegroundColor Green
        $testResults.passed++
    } else {
        Write-Host "⚠️  Backend may not handle case-insensitive categories" -ForegroundColor Yellow
        Write-Host "   Consider adding case-insensitive query handling" -ForegroundColor Yellow
        $testResults.warnings++
    }
} catch {
    Write-Host "⚠️  Case-insensitive not supported" -ForegroundColor Yellow
    Write-Host "   Backend should handle: category=EQUITY → equity" -ForegroundColor Yellow
    $testResults.warnings++
}
Write-Host ""

# Test 3: SubCategory with space
Write-Host "[4/7] Testing subcategory with space (Large Cap)..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?category=equity&subCategory=Large%20Cap&limit=5" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.success -eq $true -and $data.data.Count -gt 0) {
        Write-Host "✅ SubCategory 'Large Cap' (with space) works" -ForegroundColor Green
        Write-Host "   Found $($data.data.Count) Large Cap funds" -ForegroundColor Gray
        $testResults.passed++
    } else {
        Write-Host "⚠️  No funds returned for subCategory=Large Cap" -ForegroundColor Yellow
        Write-Host "   Check if subcategories in DB have spaces" -ForegroundColor Yellow
        $testResults.warnings++
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.failed++
}
Write-Host ""

# Test 4: Response format check
Write-Host "[5/7] Checking response format..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?limit=5" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    $formatCorrect = $true
    $issues = @()
    
    if ($null -eq $data.success) {
        $issues += "Missing 'success' field"
        $formatCorrect = $false
    }
    
    if ($null -eq $data.data) {
        $issues += "Missing 'data' field"
        $formatCorrect = $false
    }
    
    if ($null -eq $data.pagination) {
        $issues += "Missing 'pagination' field"
        $formatCorrect = $false
    } else {
        if ($null -eq $data.pagination.total) { $issues += "Missing 'pagination.total'" }
        if ($null -eq $data.pagination.page) { $issues += "Missing 'pagination.page'" }
        if ($null -eq $data.pagination.limit) { $issues += "Missing 'pagination.limit'" }
        if ($null -eq $data.pagination.totalPages) { $issues += "Missing 'pagination.totalPages'" }
        if ($null -eq $data.pagination.hasNext) { $issues += "Missing 'pagination.hasNext'" }
        if ($null -eq $data.pagination.hasPrev) { $issues += "Missing 'pagination.hasPrev'" }
    }
    
    if ($formatCorrect -and $issues.Count -eq 0) {
        Write-Host "✅ Response format is correct" -ForegroundColor Green
        Write-Host "   Total funds: $($data.pagination.total)" -ForegroundColor Gray
        $testResults.passed++
    } else {
        Write-Host "⚠️  Response format issues:" -ForegroundColor Yellow
        foreach ($issue in $issues) {
            Write-Host "   - $issue" -ForegroundColor Yellow
        }
        $testResults.warnings++
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.failed++
}
Write-Host ""

# Test 5: Check sample fund structure
Write-Host "[6/7] Checking fund data structure..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?limit=1" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.data.Count -gt 0) {
        $fund = $data.data[0]
        
        Write-Host "Sample fund structure:" -ForegroundColor Cyan
        Write-Host "  - category: '$($fund.category)' $(if ($fund.category -cmatch '^[a-z]+$') { '✅' } else { '⚠️ (should be lowercase)' })" -ForegroundColor Gray
        Write-Host "  - subCategory: '$($fund.subCategory)' $(if ($fund.subCategory -match '\s') { '✅' } else { '⚠️ (should have space if multi-word)' })" -ForegroundColor Gray
        Write-Host "  - fundId: $($fund.fundId)" -ForegroundColor Gray
        Write-Host "  - name: $($fund.name)" -ForegroundColor Gray
        
        # Check if category is lowercase
        if ($fund.category -cmatch '^[a-z_]+$') {
            Write-Host "✅ Category is in lowercase format" -ForegroundColor Green
            $testResults.passed++
        } else {
            Write-Host "⚠️  Category is not lowercase: '$($fund.category)'" -ForegroundColor Yellow
            Write-Host "   Frontend expects lowercase (equity, debt, hybrid)" -ForegroundColor Yellow
            $testResults.warnings++
        }
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.failed++
}
Write-Host ""

# Test 6: Pagination
Write-Host "[7/7] Testing pagination..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?page=2&limit=10" -Method GET -TimeoutSec 10
    $data = $response.Content | ConvertFrom-Json
    
    if ($data.pagination.page -eq 2 -and $data.pagination.limit -eq 10) {
        Write-Host "✅ Pagination works correctly" -ForegroundColor Green
        $testResults.passed++
    } else {
        Write-Host "⚠️  Pagination may not work as expected" -ForegroundColor Yellow
        $testResults.warnings++
    }
} catch {
    Write-Host "❌ Failed: $($_.Exception.Message)" -ForegroundColor Red
    $testResults.failed++
}
Write-Host ""

# Summary
Write-Host "======================================" -ForegroundColor Cyan
Write-Host " TEST RESULTS" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "✅ Passed:   $($testResults.passed)" -ForegroundColor Green
Write-Host "⚠️  Warnings: $($testResults.warnings)" -ForegroundColor Yellow
Write-Host "❌ Failed:   $($testResults.failed)" -ForegroundColor Red
Write-Host ""

# Recommendations
if ($testResults.warnings -gt 0 -or $testResults.failed -gt 0) {
    Write-Host "📋 RECOMMENDATIONS:" -ForegroundColor Cyan
    Write-Host ""
    
    if ($testResults.warnings -gt 0) {
        Write-Host "1. Review BACKEND_ALIGNMENT_CHECK.md for detailed fixes" -ForegroundColor Yellow
        Write-Host "2. Consider adding case-insensitive category queries" -ForegroundColor Yellow
        Write-Host "3. Ensure subcategories use spaces (Large Cap, not LargeCap)" -ForegroundColor Yellow
        Write-Host "4. Normalize database categories to lowercase if needed" -ForegroundColor Yellow
    }
    
    if ($testResults.failed -gt 0) {
        Write-Host "5. Fix response format to match frontend expectations" -ForegroundColor Red
        Write-Host "6. Ensure all required fields are present" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "See BACKEND_ALIGNMENT_CHECK.md for implementation details" -ForegroundColor Cyan
} else {
    Write-Host "🎉 All tests passed! Backend is fully aligned with frontend." -ForegroundColor Green
    Write-Host "   No backend changes needed!" -ForegroundColor Green
}

Write-Host ""
Write-Host "For detailed alignment documentation:" -ForegroundColor Cyan
Write-Host "  BACKEND_ALIGNMENT_CHECK.md" -ForegroundColor White
Write-Host ""
