# Verify Google Login Script
# Run this after you've logged in with Google

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   VERIFYING GOOGLE AUTHENTICATION" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "Checking MongoDB for new users..." -ForegroundColor Cyan

# Check if mongosh is available
try {
    $mongoVersion = mongosh --version 2>$null
    Write-Host "✅ MongoDB Shell found`n" -ForegroundColor Green
    
    Write-Host "Fetching users from database..." -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Gray
    
    # Run MongoDB query
    $query = 'use mutual_funds_db; db.users.find({}).forEach(function(user) { print("📧 Email: " + user.email); print("👤 Name: " + user.name); print("🆔 User ID: " + user._id); print("✅ Verified: " + user.isVerified); print("📅 Created: " + user.createdAt); print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"); });'
    
    mongosh --quiet --eval $query
    
    Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
    Write-Host "   CHECKING REFRESH TOKENS" -ForegroundColor Yellow
    Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
    
    $tokenQuery = 'use mutual_funds_db; print("Total Tokens: " + db.refresh_tokens.countDocuments()); db.refresh_tokens.find({}).limit(3).forEach(function(token) { print("🔑 Token ID: " + token._id); print("👤 User ID: " + token.userId); print("⏰ Expires: " + token.expiresAt); print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"); });'
    
    mongosh --quiet --eval $tokenQuery
    
} catch {
    Write-Host "⚠️  MongoDB Shell not found. Trying alternative method...`n" -ForegroundColor Yellow
    
    # Alternative: Check via backend API if we add an endpoint
    Write-Host "To verify manually, open MongoDB Compass and connect to:" -ForegroundColor White
    Write-Host "  mongodb://localhost:27017/mutual_funds_db`n" -ForegroundColor Cyan
    Write-Host "Then check the 'users' collection" -ForegroundColor White
}

Write-Host "`n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   WHAT TO CHECK IN YOUR BROWSER" -ForegroundColor Yellow
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan

Write-Host "1. Open Browser Console (F12)" -ForegroundColor White
Write-Host "2. Go to 'Console' tab" -ForegroundColor White
Write-Host "3. Type and press Enter:`n" -ForegroundColor White
Write-Host "   localStorage.getItem('accessToken')" -ForegroundColor Cyan
Write-Host "   localStorage.getItem('user')`n" -ForegroundColor Cyan
Write-Host "4. You should see your JWT token and user data!`n" -ForegroundColor White

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`n" -ForegroundColor Cyan
