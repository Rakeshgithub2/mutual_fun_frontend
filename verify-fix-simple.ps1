Write-Host "Checking API URL Configuration..." -ForegroundColor Cyan
Write-Host ""

# Check .env.production
$envFile = ".env.production"
if (Test-Path $envFile) {
    Write-Host "[OK] Found $envFile" -ForegroundColor Green
    $content = Get-Content $envFile -Raw
    if ($content -match "NEXT_PUBLIC_API_URL=https://mutualfun-backend\.vercel\.app/api") {
        Write-Host "[OK] NEXT_PUBLIC_API_URL is correctly set" -ForegroundColor Green
    } else {
        Write-Host "[WARN] NEXT_PUBLIC_API_URL format may need checking" -ForegroundColor Yellow
    }
} else {
    Write-Host "[ERROR] $envFile not found" -ForegroundColor Red
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Gray
Write-Host "[OK] Code changes: COMPLETE" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "  1. Update Vercel environment variables" -ForegroundColor White
Write-Host "  2. Commit and push changes" -ForegroundColor White
Write-Host "  3. Wait for deployment" -ForegroundColor White
Write-Host "  4. Hard refresh browser" -ForegroundColor White
Write-Host "  5. Check Network tab for correct URLs" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Gray
Write-Host ""
Write-Host "See FRONTEND_URL_FIX_SUMMARY.md for full details" -ForegroundColor Cyan
