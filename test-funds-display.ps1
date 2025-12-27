# Frontend Funds Display - Testing & Validation Script
# Run this script to verify the frontend can display all 4,459 funds from the backend

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "FRONTEND FUNDS DISPLAY VALIDATION" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$script:errors = @()
$script:warnings = @()
$script:success = @()

function Test-Step {
    param(
        [string]$Description,
        [scriptblock]$Test,
        [bool]$IsCritical = $true
    )
    
    Write-Host "[ ] $Description" -ForegroundColor Yellow -NoNewline
    try {
        $result = & $Test
        if ($result) {
            Write-Host "`r[✓] $Description" -ForegroundColor Green
            $script:success += $Description
            return $true
        } else {
            if ($IsCritical) {
                Write-Host "`r[✗] $Description" -ForegroundColor Red
                $script:errors += $Description
            } else {
                Write-Host "`r[⚠] $Description" -ForegroundColor Yellow
                $script:warnings += $Description
            }
            return $false
        }
    } catch {
        if ($IsCritical) {
            Write-Host "`r[✗] $Description - Error: $_" -ForegroundColor Red
            $script:errors += "$Description - Error: $_"
        } else {
            Write-Host "`r[⚠] $Description - Warning: $_" -ForegroundColor Yellow
            $script:warnings += "$Description - Warning: $_"
        }
        return $false
    }
}

# Test 1: Check environment variables
Test-Step "Environment variable NEXT_PUBLIC_API_URL is set" {
    if (Test-Path ".env.local") {
        $envContent = Get-Content ".env.local" -Raw
        $envContent -match "NEXT_PUBLIC_API_URL=http://localhost:3002"
    } else {
        Write-Host "`n   Missing .env.local file" -ForegroundColor Red
        return $false
    }
}

# Test 2: Check backend is running
Test-Step "Backend server is running on port 3002" {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 5 -UseBasicParsing
        $response.StatusCode -eq 200
    } catch {
        Write-Host "`n   Backend not responding. Start it with: cd backend && npm run dev:simple" -ForegroundColor Red
        return $false
    }
}

# Test 3: Check backend API returns funds
Test-Step "Backend API returns funds data" {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=5" -Method GET -TimeoutSec 10
        if ($response.success -and $response.data -and $response.data.Count -gt 0) {
            Write-Host "`n   ✓ Backend returned $($response.data.Count) funds (Total: $($response.pagination.total))" -ForegroundColor Green
            return $true
        }
        return $false
    } catch {
        Write-Host "`n   Error: $_" -ForegroundColor Red
        return $false
    }
}

# Test 4: Verify critical files exist
$criticalFiles = @(
    "lib/api-client.ts",
    "lib/api/funds.ts",
    "lib/utils/categoryNormalizer.ts",
    "types/fund.types.ts",
    "components/EnhancedFundList.tsx",
    "components/DebugPanel.tsx",
    "hooks/use-funds.ts"
)

foreach ($file in $criticalFiles) {
    Test-Step "File exists: $file" {
        Test-Path $file
    }
}

# Test 5: Check for common mistakes in code
Write-Host "`n--- Code Quality Checks ---" -ForegroundColor Cyan

Test-Step "No hardcoded wrong port (3001, 5001)" {
    $apiClientContent = Get-Content "lib/api-client.ts" -Raw
    $fundsApiContent = Get-Content "lib/api/funds.ts" -Raw
    
    -not ($apiClientContent -match "localhost:3001" -or 
          $apiClientContent -match "localhost:5001" -or
          $fundsApiContent -match "localhost:3001" -or
          $fundsApiContent -match "localhost:5001")
} -IsCritical $false

Test-Step "API client uses NEXT_PUBLIC_API_URL env variable" {
    $apiClientContent = Get-Content "lib/api-client.ts" -Raw
    $apiClientContent -match "NEXT_PUBLIC_API_URL"
}

Test-Step "Category normalizer handles lowercase" {
    $normalizerContent = Get-Content "lib/utils/categoryNormalizer.ts" -Raw
    $normalizerContent -match "toLowerCase"
}

# Test 6: Check if frontend is running
$frontendRunning = Test-Step "Frontend server is running" {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5001" -Method GET -TimeoutSec 5 -UseBasicParsing
        $response.StatusCode -eq 200
    } catch {
        return $false
    }
} -IsCritical $false

if (-not $frontendRunning) {
    Write-Host "`n   Frontend not running. Start it with: npm run dev" -ForegroundColor Yellow
}

# Test 7: Check package.json dependencies
Test-Step "Required dependencies installed" {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $packageJson.dependencies -ne $null
}

# Display summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "VALIDATION SUMMARY" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✓ Passed: $($script:success.Count)" -ForegroundColor Green
Write-Host "⚠ Warnings: $($script:warnings.Count)" -ForegroundColor Yellow
Write-Host "✗ Errors: $($script:errors.Count)" -ForegroundColor Red

if ($script:errors.Count -eq 0) {
    Write-Host "`n✅ All critical checks passed!" -ForegroundColor Green
    Write-Host "`nNext Steps:" -ForegroundColor Cyan
    Write-Host "1. Start backend: cd backend && npm run dev:simple" -ForegroundColor White
    Write-Host "2. Start frontend: npm run dev" -ForegroundColor White
    Write-Host "3. Visit test page: http://localhost:5001/test-funds" -ForegroundColor White
    Write-Host "4. Visit demo page: http://localhost:5001/funds-demo" -ForegroundColor White
    Write-Host "5. Check Debug Panel (bottom-right corner)" -ForegroundColor White
    Write-Host "`nExpected Result: Should see 4,459 funds in the list" -ForegroundColor Green
} else {
    Write-Host "`n❌ Critical issues found:" -ForegroundColor Red
    foreach ($error in $script:errors) {
        Write-Host "   • $error" -ForegroundColor Red
    }
    Write-Host "`nPlease fix these issues and run the script again." -ForegroundColor Yellow
}

if ($script:warnings.Count -gt 0) {
    Write-Host "`n⚠️ Warnings (non-critical):" -ForegroundColor Yellow
    foreach ($warning in $script:warnings) {
        Write-Host "   • $warning" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
