# Frontend Testing Script
# Tests all the new frontend fixes

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  FRONTEND FIXES - TESTING SCRIPT    " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check if backend is running
Write-Host "[1/5] Checking Backend Connection..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3002/health" -Method GET -TimeoutSec 5
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend is running on port 3002" -ForegroundColor Green
        $backendRunning = $true
    }
} catch {
    Write-Host "❌ Backend is NOT running on port 3002" -ForegroundColor Red
    Write-Host "   Please start backend with: npm run dev:simple" -ForegroundColor Yellow
    $backendRunning = $false
}
Write-Host ""

# Step 2: Check environment variables
Write-Host "[2/5] Checking Environment Variables..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    $envContent = Get-Content ".env.local" -Raw
    if ($envContent -match "NEXT_PUBLIC_API_URL=http://localhost:3002") {
        Write-Host "✅ NEXT_PUBLIC_API_URL is correctly set to http://localhost:3002" -ForegroundColor Green
    } else {
        Write-Host "⚠️  NEXT_PUBLIC_API_URL might not be set correctly" -ForegroundColor Yellow
        Write-Host "   Check .env.local file" -ForegroundColor Yellow
    }
} else {
    Write-Host "⚠️  .env.local file not found" -ForegroundColor Yellow
}
Write-Host ""

# Step 3: Check if new files exist
Write-Host "[3/5] Verifying New Files..." -ForegroundColor Yellow
$filesToCheck = @(
    "lib/api-client.ts",
    "lib/utils/categoryNormalizer.ts",
    "lib/api/funds.ts",
    "types/fund.types.ts",
    "components/DebugPanel.tsx",
    "components/EnhancedFundList.tsx",
    "app/test-funds/page.tsx"
)

$allFilesExist = $true
foreach ($file in $filesToCheck) {
    if (Test-Path $file) {
        Write-Host "  ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "  ❌ $file (missing)" -ForegroundColor Red
        $allFilesExist = $false
    }
}
Write-Host ""

# Step 4: Test backend API if running
if ($backendRunning) {
    Write-Host "[4/5] Testing Backend API..." -ForegroundColor Yellow
    
    try {
        Write-Host "  Testing /api/funds endpoint..." -ForegroundColor Cyan
        $fundsResponse = Invoke-WebRequest -Uri "http://localhost:3002/api/funds?limit=5" -Method GET -TimeoutSec 10
        $fundsData = $fundsResponse.Content | ConvertFrom-Json
        
        if ($fundsData.success -eq $true) {
            Write-Host "  ✅ API returns success: true" -ForegroundColor Green
            Write-Host "  ✅ Funds count: $($fundsData.data.Count)" -ForegroundColor Green
            Write-Host "  ✅ Total available: $($fundsData.pagination.total)" -ForegroundColor Green
            
            if ($fundsData.pagination.total -ge 4000) {
                Write-Host "  ✅ Database has $($fundsData.pagination.total) funds (4,459 expected)" -ForegroundColor Green
            } else {
                Write-Host "  ⚠️  Database has only $($fundsData.pagination.total) funds (4,459 expected)" -ForegroundColor Yellow
            }
        } else {
            Write-Host "  ❌ API returned success: false" -ForegroundColor Red
        }
        
    } catch {
        Write-Host "  ❌ Failed to test API: $($_.Exception.Message)" -ForegroundColor Red
    }
} else {
    Write-Host "[4/5] Skipping API tests (backend not running)" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Instructions
Write-Host "[5/5] Next Steps" -ForegroundColor Yellow
Write-Host ""

if (-not $backendRunning) {
    Write-Host "⚠️  BACKEND NOT RUNNING" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start backend:" -ForegroundColor Yellow
    Write-Host "  cd path\to\backend" -ForegroundColor Cyan
    Write-Host "  npm run dev:simple" -ForegroundColor Cyan
    Write-Host ""
}

Write-Host "To start frontend:" -ForegroundColor Yellow
Write-Host "  npm run dev" -ForegroundColor Cyan
Write-Host ""

Write-Host "To test the new components:" -ForegroundColor Yellow
Write-Host "  1. Open http://localhost:5001/test-funds" -ForegroundColor Cyan
Write-Host "  2. Check Debug Panel (bottom-right corner)" -ForegroundColor Cyan
Write-Host "  3. Should see funds displayed with filters" -ForegroundColor Cyan
Write-Host ""

Write-Host "To use in existing pages:" -ForegroundColor Yellow
Write-Host "  import EnhancedFundList from '@/components/EnhancedFundList';" -ForegroundColor Cyan
Write-Host "  <EnhancedFundList showFilters={true} />" -ForegroundColor Cyan
Write-Host ""

# Summary
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "  SUMMARY" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

if ($backendRunning -and $allFilesExist) {
    Write-Host "✅ All checks passed! Ready to test." -ForegroundColor Green
} elseif ($allFilesExist) {
    Write-Host "⚠️  Files created but backend not running" -ForegroundColor Yellow
    Write-Host "   Start backend and test again" -ForegroundColor Yellow
} else {
    Write-Host "❌ Some files are missing" -ForegroundColor Red
    Write-Host "   Check implementation" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "For detailed documentation, see:" -ForegroundColor Cyan
Write-Host "  FRONTEND_FIXES_COMPLETE.md" -ForegroundColor White
Write-Host ""
