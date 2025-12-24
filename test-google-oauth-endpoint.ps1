# Test Backend Google OAuth Endpoint
# Run this to verify the POST /api/auth/google endpoint exists

Write-Host "`n🧪 Testing Backend Google OAuth Endpoint..." -ForegroundColor Cyan
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

$apiUrl = "http://localhost:3002/api/auth/google"

Write-Host "`n📡 Testing: POST $apiUrl" -ForegroundColor Yellow

try {
    $body = @{
        idToken = "test-token"
    } | ConvertTo-Json

    $response = Invoke-WebRequest -Uri $apiUrl -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction SilentlyContinue

    Write-Host "✅ Endpoint exists! Status: $($response.StatusCode)" -ForegroundColor Green
    Write-Host "Response: $($response.Content)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    
    if ($statusCode -eq 404) {
        Write-Host "❌ ERROR: Endpoint not found (404)" -ForegroundColor Red
        Write-Host "   The backend route POST /api/auth/google does not exist!" -ForegroundColor Red
        Write-Host "   Make sure the backend is running and the route is registered." -ForegroundColor Yellow
    } elseif ($statusCode -eq 400 -or $statusCode -eq 401) {
        Write-Host "✅ Endpoint exists! Status: $statusCode" -ForegroundColor Green
        Write-Host "   (400/401 is expected with a test token)" -ForegroundColor Gray
        try {
            $errorContent = $_.ErrorDetails.Message | ConvertFrom-Json
            Write-Host "   Response: $($errorContent.error)" -ForegroundColor Gray
        } catch {
            Write-Host "   Response: $($_.ErrorDetails.Message)" -ForegroundColor Gray
        }
    } else {
        Write-Host "⚠️  Unexpected status code: $statusCode" -ForegroundColor Yellow
        Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Gray
    }
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

# Check if backend is running
Write-Host "`n🔍 Checking if backend is running..." -ForegroundColor Cyan
try {
    $healthCheck = Invoke-WebRequest -Uri "http://localhost:3002/api/health" -Method GET -ErrorAction Stop
    Write-Host "✅ Backend is running!" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running on port 3002!" -ForegroundColor Red
    Write-Host "   Start it with: cd backend && npm run dev" -ForegroundColor Yellow
}

Write-Host "`n"
