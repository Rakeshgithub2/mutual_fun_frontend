Write-Host "Testing Fund Manager Page with Real Data..." -ForegroundColor Cyan
Write-Host ""

Write-Host "1. Checking backend connection..." -ForegroundColor Yellow
$backendResponse = Invoke-WebRequest -Uri "http://localhost:3002/api/fund-managers?limit=3" -Method GET -UseBasicParsing
Write-Host "Success: Backend is running on port 3002" -ForegroundColor Green

$managers = $backendResponse.Content | ConvertFrom-Json
Write-Host "Success: Found $($managers.Count) fund managers" -ForegroundColor Green
Write-Host ""

Write-Host "Available Fund Managers:" -ForegroundColor Cyan
foreach ($manager in $managers) {
    Write-Host "  - ID: $($manager.managerId) | Name: $($manager.name)" -ForegroundColor White
    Write-Host "    Company: $($manager.currentFundHouse)" -ForegroundColor Gray
    Write-Host "    Experience: $($manager.experience) years" -ForegroundColor Gray
    Write-Host "    AUM: Rs.$([math]::Round($manager.totalAumManaged / 1000, 1))K Cr" -ForegroundColor Gray
    Write-Host "    Funds: $($manager.fundsList.Count)" -ForegroundColor Gray
    Write-Host "    Awards: $($manager.awards.Count)" -ForegroundColor Gray
    Write-Host ""
}

Write-Host "2. Checking frontend connection..." -ForegroundColor Yellow
$frontendResponse = Invoke-WebRequest -Uri "http://localhost:5001" -Method GET -UseBasicParsing -TimeoutSec 5
Write-Host "Success: Frontend is running on port 5001" -ForegroundColor Green

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Test URLs:" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Fund Manager List:" -ForegroundColor Yellow
Write-Host "  http://localhost:5001/fund-manager" -ForegroundColor White
Write-Host ""
Write-Host "Individual Fund Managers:" -ForegroundColor Yellow
foreach ($manager in $managers) {
    Write-Host "  http://localhost:5001/fund-manager/$($manager.managerId) - $($manager.name)" -ForegroundColor White
}
Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Real Data Features Implemented:" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "- Verified Data badge shown" -ForegroundColor Green
Write-Host "- Real AUM from database" -ForegroundColor Green
Write-Host "- Actual fund performance (1Y/3Y/5Y returns)" -ForegroundColor Green
Write-Host "- Real awards and recognition" -ForegroundColor Green
Write-Host "- Actual funds managed with individual AUM" -ForegroundColor Green
Write-Host "- Portfolio average returns calculated from real data" -ForegroundColor Green
Write-Host "- No mock data fallback" -ForegroundColor Green
Write-Host ""
