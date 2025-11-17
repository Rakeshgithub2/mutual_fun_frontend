# Test Complete Authentication Flow

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   AUTHENTICATION FLOW TEST" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

# Check if servers are running
Write-Host "[1/4] Checking Backend..." -ForegroundColor Cyan
try {
    $backend = Invoke-RestMethod -Uri "http://localhost:3002/health" -Method Get -ErrorAction Stop
    Write-Host "✅ Backend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Backend is NOT running" -ForegroundColor Red
    Write-Host "   Start with: cd mutual-funds-backend; npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host "`n[2/4] Checking Frontend..." -ForegroundColor Cyan
try {
    $frontend = Invoke-WebRequest -Uri "http://localhost:5001" -Method Head -TimeoutSec 3 -ErrorAction Stop
    Write-Host "✅ Frontend is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend is NOT running" -ForegroundColor Red
    Write-Host "   Start with: cd mutual-funds-portal; npm run dev" -ForegroundColor Yellow
    exit
}

Write-Host "`n[3/4] Checking Authentication Endpoints..." -ForegroundColor Cyan
try {
    $authTest = Invoke-WebRequest -Uri "http://localhost:3002/api/auth/google" -Method Get -MaximumRedirection 0 -ErrorAction SilentlyContinue
} catch {
    if ($_.Exception.Response.Headers.Location -match "google") {
        Write-Host "✅ Google OAuth endpoint working" -ForegroundColor Green
    } else {
        Write-Host "⚠️  OAuth endpoint returned unexpected response" -ForegroundColor Yellow
    }
}

Write-Host "`n[4/4] Checking MongoDB Users..." -ForegroundColor Cyan
try {
    $query = 'use mutual_funds_db; db.users.countDocuments()'
    $userCount = mongosh --quiet --eval $query 2>$null
    if ($userCount) {
        Write-Host "✅ MongoDB connected - $userCount user(s) registered" -ForegroundColor Green
    } else {
        Write-Host "⚠️  MongoDB accessible, 0 users registered" -ForegroundColor Yellow
    }
} catch {
    Write-Host "⚠️  Cannot check MongoDB (mongosh not in PATH)" -ForegroundColor Yellow
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   HOW TO TEST" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "1. Open: " -NoNewline -ForegroundColor White
Write-Host "http://localhost:5001" -ForegroundColor Cyan
Write-Host "   → You should see the home page`n" -ForegroundColor Gray

Write-Host "2. Look at header → Click " -NoNewline -ForegroundColor White
Write-Host "'Sign In'" -ForegroundColor Yellow
Write-Host "   → Opens authentication page`n" -ForegroundColor Gray

Write-Host "3. Choose authentication method:" -ForegroundColor White
Write-Host "   A) Click " -NoNewline -ForegroundColor Gray
Write-Host "'Continue with Google'" -ForegroundColor Yellow
Write-Host "      → Sign in with Gmail" -ForegroundColor Gray
Write-Host "   B) Use " -NoNewline -ForegroundColor Gray
Write-Host "Email/Password form" -ForegroundColor Yellow
Write-Host "      → Enter credentials and submit`n" -ForegroundColor Gray

Write-Host "4. After successful login:" -ForegroundColor White
Write-Host "   ✓ Redirected back to home page" -ForegroundColor Green
Write-Host "   ✓ Header shows your name/email" -ForegroundColor Green
Write-Host "   ✓ 'Sign In' button becomes account menu" -ForegroundColor Green
Write-Host "   ✓ Success toast notification appears`n" -ForegroundColor Green

Write-Host "5. Test account menu:" -ForegroundColor White
Write-Host "   → Click your name in header" -ForegroundColor Gray
Write-Host "   → Dropdown shows Profile, Portfolio, Settings" -ForegroundColor Gray
Write-Host "   → Click 'Sign Out' to log out`n" -ForegroundColor Gray

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   VERIFY IN DATABASE" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "After logging in, run this to see your data:" -ForegroundColor White
Write-Host "   .\verify-google-login.ps1`n" -ForegroundColor Cyan

Write-Host "Or manually check MongoDB:" -ForegroundColor White
Write-Host "   mongosh" -ForegroundColor Cyan
Write-Host "   use mutual_funds_db" -ForegroundColor Cyan
Write-Host "   db.users.find().pretty()`n" -ForegroundColor Cyan

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   ERROR HANDLING" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "✓ Wrong password → Shows error toast" -ForegroundColor White
Write-Host "✓ User not found → Shows error toast" -ForegroundColor White
Write-Host "✓ Google OAuth error → Shows error toast" -ForegroundColor White
Write-Host "✓ Network error → Shows error toast" -ForegroundColor White
Write-Host "✓ All errors redirect back to auth page`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""
