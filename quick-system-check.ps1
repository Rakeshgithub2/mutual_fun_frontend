# Quick System Check
Write-Host "=== QUICK SYSTEM CHECK ===" -ForegroundColor Cyan

# 1. Backend Check
Write-Host "`n1. Checking Backend..." -NoNewline
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
    Write-Host " ✓ RUNNING" -ForegroundColor Green
} catch {
    Write-Host " ✗ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start with: cd mutual-funds-backend; npm run dev" -ForegroundColor Yellow
}

# 2. Frontend Check
Write-Host "2. Checking Frontend..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5001" -TimeoutSec 5 -UseBasicParsing
    Write-Host " ✓ RUNNING" -ForegroundColor Green
} catch {
    Write-Host " ✗ NOT RUNNING" -ForegroundColor Red
    Write-Host "   Start with: npm run dev" -ForegroundColor Yellow
}

# 3. API Test
Write-Host "3. Testing API..." -NoNewline
try {
    $api = Invoke-RestMethod -Uri "http://localhost:3002/api/test" -TimeoutSec 5
    Write-Host " ✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# 4. Database Test
Write-Host "4. Testing Database..." -NoNewline
$dbTest = @"
const { MongoClient } = require('mongodb');
(async () => {
    const client = new MongoClient('mongodb://localhost:27017');
    try {
        await client.connect();
        const db = client.db('mutual_funds_db');
        const count = await db.collection('funds').countDocuments();
        console.log('SUCCESS:' + count);
        process.exit(0);
    } catch (e) {
        console.log('FAILED:' + e.message);
        process.exit(1);
    } finally {
        await client.close();
    }
})();
"@
$dbTest | Out-File -FilePath "temp-quick-db.js" -Encoding UTF8
try {
    $result = node temp-quick-db.js 2>&1
    if ($result -match "SUCCESS:(\d+)") {
        $count = $matches[1]
        Write-Host " ✓ CONNECTED ($count funds)" -ForegroundColor Green
    } else {
        Write-Host " ✗ FAILED" -ForegroundColor Red
    }
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
} finally {
    Remove-Item "temp-quick-db.js" -ErrorAction SilentlyContinue
}

# 5. Funds API Test
Write-Host "5. Testing Funds API..." -NoNewline
try {
    $funds = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=5" -TimeoutSec 10
    $count = $funds.data.Count
    Write-Host " ✓ WORKING ($count funds)" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# 6. Autocomplete API Test
Write-Host "6. Testing Autocomplete..." -NoNewline
try {
    $suggest = Invoke-RestMethod -Uri "http://localhost:3002/api/suggest/funds?q=hdfc&limit=5" -TimeoutSec 10
    Write-Host " ✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# 7. Market Indices Test
Write-Host "7. Testing Market Data..." -NoNewline
try {
    $market = Invoke-RestMethod -Uri "http://localhost:3002/api/market-indices/latest" -TimeoutSec 10
    Write-Host " ✓ WORKING" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

# 8. Calculator APIs Test
Write-Host "8. Testing Calculators..." -NoNewline
try {
    $calc = Invoke-RestMethod -Uri "http://localhost:3002/api/calculator/sip" -TimeoutSec 5
    Write-Host " ✓ AVAILABLE" -ForegroundColor Green
} catch {
    Write-Host " ✗ FAILED" -ForegroundColor Red
}

Write-Host "`n=== SYSTEM STATUS ===" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:5001" -ForegroundColor White
Write-Host "Backend:  http://localhost:3002" -ForegroundColor White
Write-Host "Database: mongodb://localhost:27017" -ForegroundColor White
Write-Host ""
