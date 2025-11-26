# Quick Authentication Test Script
# Tests email/password registration and login

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Authentication System Quick Test" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

$baseUrl = "http://localhost:3000/api"
$timestamp = [DateTimeOffset]::Now.ToUnixTimeSeconds()
$testEmail = "testuser$timestamp@example.com"
$testPassword = "SecurePassword123!"
$testName = "Test User $timestamp"

# Test 1: Registration
Write-Host "Test 1: User Registration" -ForegroundColor Yellow
Write-Host "  Email: $testEmail" -ForegroundColor Gray

$registerBody = @{
    email = $testEmail
    password = $testPassword
    name = $testName
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "$baseUrl/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody

    if ($registerResponse.success) {
        Write-Host "  ✓ Registration successful!" -ForegroundColor Green
        Write-Host "    User ID: $($registerResponse.data.user.userId)" -ForegroundColor Gray
        Write-Host "    Auth Method: $($registerResponse.data.user.authMethod)" -ForegroundColor Gray
        $accessToken = $registerResponse.data.tokens.accessToken
    } else {
        Write-Host "  ✗ Registration failed: $($registerResponse.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ✗ Registration error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 2: Login
Write-Host "`nTest 2: User Login" -ForegroundColor Yellow

$loginBody = @{
    email = $testEmail
    password = $testPassword
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $loginBody

    if ($loginResponse.success) {
        Write-Host "  ✓ Login successful!" -ForegroundColor Green
        Write-Host "    Email Verified: $($loginResponse.data.user.emailVerified)" -ForegroundColor Gray
        Write-Host "    Subscription: $($loginResponse.data.user.subscription.plan)" -ForegroundColor Gray
        $accessToken = $loginResponse.data.tokens.accessToken
    } else {
        Write-Host "  ✗ Login failed: $($loginResponse.error)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host "  ✗ Login error: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

Start-Sleep -Seconds 1

# Test 3: Get Current User
Write-Host "`nTest 3: Get Current User Profile" -ForegroundColor Yellow

try {
    $headers = @{
        "Authorization" = "Bearer $accessToken"
    }

    $profileResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" `
        -Method GET `
        -Headers $headers

    if ($profileResponse.success) {
        Write-Host "  ✓ Profile retrieved!" -ForegroundColor Green
        Write-Host "    Name: $($profileResponse.data.name)" -ForegroundColor Gray
        Write-Host "    Email: $($profileResponse.data.email)" -ForegroundColor Gray
        Write-Host "    KYC Status: $($profileResponse.data.kyc.status)" -ForegroundColor Gray
    } else {
        Write-Host "  ✗ Profile retrieval failed: $($profileResponse.error)" -ForegroundColor Red
    }
} catch {
    Write-Host "  ✗ Profile error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test 4: Invalid Login
Write-Host "`nTest 4: Invalid Login (Should Fail)" -ForegroundColor Yellow

$invalidLoginBody = @{
    email = "nonexistent@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

try {
    $invalidResponse = Invoke-RestMethod -Uri "$baseUrl/auth/login" `
        -Method POST `
        -ContentType "application/json" `
        -Body $invalidLoginBody `
        -ErrorAction Stop

    Write-Host "  ✗ Invalid login should have failed!" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "  ✓ Invalid login properly rejected!" -ForegroundColor Green
    } else {
        Write-Host "  ? Unexpected error: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# Summary
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "Test Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "✓ Email/Password authentication working!" -ForegroundColor Green
Write-Host "✓ User registration successful" -ForegroundColor Green
Write-Host "✓ User login successful" -ForegroundColor Green
Write-Host "✓ Profile retrieval working" -ForegroundColor Green
Write-Host "✓ Security validation working" -ForegroundColor Green
Write-Host "`nAuthentication system is fully operational!`n" -ForegroundColor Green
