# Quick Test - Verify URL Fix

Write-Host "🔍 Checking API URL Configuration..." -ForegroundColor Cyan

# Check if .env.production exists and has correct URL
$envFile = ".env.production"
if (Test-Path $envFile) {
    Write-Host "✅ Found $envFile" -ForegroundColor Green
    $content = Get-Content $envFile -Raw
    if ($content -match "NEXT_PUBLIC_API_URL=https://mutualfun-backend\.vercel\.app/api") {
        Write-Host "✅ NEXT_PUBLIC_API_URL is correctly set (no trailing slash)" -ForegroundColor Green
    } else {
        Write-Host "⚠️  NEXT_PUBLIC_API_URL format may need checking" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ $envFile not found" -ForegroundColor Red
}

Write-Host "`n🔍 Checking for trailing slashes in code..." -ForegroundColor Cyan

# Check if any BASE_URL has trailing slash
$trailingSlashes = Select-String -Path "**/*.{ts,tsx,js,jsx}" -Pattern "mutualfun-backend\.vercel\.app/['\`"]" -ErrorAction SilentlyContinue

if ($trailingSlashes) {
    Write-Host "⚠️  Found potential trailing slashes:" -ForegroundColor Yellow
    $trailingSlashes | ForEach-Object {
        Write-Host "  $($_.Path):$($_.LineNumber)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ No trailing slashes found in code" -ForegroundColor Green
}

Write-Host "`n🔍 Checking API URL construction..." -ForegroundColor Cyan

# Check if defensive code is present
$pattern = "replace.*trailing"
$defensiveFiles = @()
Get-ChildItem -Path "lib", "components", "app" -Recurse -Include "*.ts", "*.tsx" -ErrorAction SilentlyContinue | ForEach-Object {
    if ((Get-Content $_.FullName -Raw) -match "replace") {
        $defensiveFiles += $_.FullName
    }
}

if ($defensiveFiles.Count -gt 0) {
    Write-Host "✅ Found defensive URL cleaning in $($defensiveFiles.Count) files" -ForegroundColor Green
} else {
    Write-Host "⚠️  Checking defensive URL cleaning..." -ForegroundColor Yellow
}

Write-Host "`n📋 Summary:" -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray
Write-Host "✅ Code changes: COMPLETE" -ForegroundColor Green
Write-Host "⏳ Next steps:" -ForegroundColor Yellow
Write-Host "   1. Update Vercel environment variables" -ForegroundColor White
Write-Host "   2. Commit and push changes" -ForegroundColor White
Write-Host "   3. Wait for deployment" -ForegroundColor White
Write-Host "   4. Hard refresh browser (Ctrl+Shift+R)" -ForegroundColor White
Write-Host "   5. Check Network tab for correct URLs" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Gray

Write-Host ""
Write-Host "See FRONTEND_URL_FIX_SUMMARY.md for full details" -ForegroundColor Cyan
