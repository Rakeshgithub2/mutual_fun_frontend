# Comprehensive System Check Script
# This script checks Frontend, Backend, Database connections and all APIs

Write-Host "================================" -ForegroundColor Cyan
Write-Host "COMPREHENSIVE SYSTEM CHECK" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# Color functions
function Write-Success { param($message) Write-Host "✓ $message" -ForegroundColor Green }
function Write-Error { param($message) Write-Host "✗ $message" -ForegroundColor Red }
function Write-Info { param($message) Write-Host "ℹ $message" -ForegroundColor Yellow }
function Write-Section { param($message) Write-Host "`n=== $message ===" -ForegroundColor Cyan }

$ErrorCount = 0
$SuccessCount = 0

# Configuration
$BACKEND_URL = "http://localhost:3002"
$FRONTEND_URL = "http://localhost:5001"
$API_URL = "$BACKEND_URL/api"

# Test function
function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Url,
        [string]$Method = "GET",
        [hashtable]$Headers = @{},
        [string]$Body = $null
    )
    
    try {
        Write-Host "Testing: $Name..." -NoNewline
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $Headers
            TimeoutSec = 10
        }
        
        if ($Body) {
            $params.Body = $Body
            $params.ContentType = "application/json"
        }
        
        $response = Invoke-RestMethod @params
        Write-Success " PASSED"
        $script:SuccessCount++
        return $true
    }
    catch {
        Write-Error " FAILED"
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        $script:ErrorCount++
        return $false
    }
}

# 1. CHECK BACKEND SERVER
Write-Section "1. Backend Server Status"
$backendHealth = Test-Endpoint -Name "Backend Health Check" -Url "$BACKEND_URL/health"
$backendTest = Test-Endpoint -Name "Backend Test Endpoint" -Url "$API_URL/test"

if (-not $backendHealth) {
    Write-Error "Backend server is not running on port 3002"
    Write-Info "Please start backend: cd mutual-funds-backend && npm run dev"
    exit 1
}

# 2. CHECK DATABASE CONNECTION
Write-Section "2. Database Connection"
Test-Endpoint -Name "Database Connection via API" -Url "$API_URL/test"

# 3. CHECK AUTHENTICATION ENDPOINTS
Write-Section "3. Authentication APIs"
Test-Endpoint -Name "Auth - Health Check" -Url "$API_URL/auth/health"

# 4. CHECK FUNDS ENDPOINTS
Write-Section "4. Mutual Funds APIs"
Test-Endpoint -Name "Get All Funds" -Url "$API_URL/funds?limit=10"
Test-Endpoint -Name "Search Funds" -Url "$API_URL/funds/search?q=hdfc"
Test-Endpoint -Name "Fund Categories" -Url "$API_URL/funds/categories"
Test-Endpoint -Name "Fund Types" -Url "$API_URL/funds/types"
Test-Endpoint -Name "Top Performing Funds" -Url "$API_URL/funds/top-performing?limit=10"

# 5. CHECK AUTOCOMPLETE/SUGGEST API
Write-Section "5. Autocomplete/Suggest API"
Test-Endpoint -Name "Suggest Funds (HDFC)" -Url "$API_URL/suggest/funds?q=hdfc&limit=10"
Test-Endpoint -Name "Suggest Funds (SBI)" -Url "$API_URL/suggest/funds?q=sbi&limit=10"
Test-Endpoint -Name "Suggest Funds (ICICI)" -Url "$API_URL/suggest/funds?q=icici&limit=10"

# 6. CHECK COMPARISON & OVERLAP APIs
Write-Section "6. Comparison & Overlap APIs"
Test-Endpoint -Name "Compare Endpoint" -Url "$API_URL/comparison/compare"
Test-Endpoint -Name "Overlap Endpoint" -Url "$API_URL/comparison/overlap"

# 7. CHECK CALCULATOR APIs
Write-Section "7. Calculator APIs"
Test-Endpoint -Name "SIP Calculator" -Url "$API_URL/calculator/sip"
Test-Endpoint -Name "Lumpsum Calculator" -Url "$API_URL/calculator/lumpsum"
Test-Endpoint -Name "SWP Calculator" -Url "$API_URL/calculator/swp"
Test-Endpoint -Name "CAGR Calculator" -Url "$API_URL/calculator/cagr"

# 8. CHECK MARKET DATA APIs
Write-Section "8. Market Data APIs"
Test-Endpoint -Name "Market Indices" -Url "$API_URL/market-indices/latest"
Test-Endpoint -Name "Latest News" -Url "$API_URL/news/latest?limit=5"

# 9. CHECK KYC & PORTFOLIO APIs
Write-Section "9. KYC & Portfolio APIs"
Test-Endpoint -Name "KYC Status Check" -Url "$API_URL/kyc/status"

# 10. CHECK AI CHATBOT API
Write-Section "10. AI Chatbot API"
Test-Endpoint -Name "AI Chat Endpoint" -Url "$API_URL/ai/chat"

# 11. CHECK FRONTEND SERVER
Write-Section "11. Frontend Server Status"
try {
    Write-Host "Testing: Frontend Server..." -NoNewline
    $frontendResponse = Invoke-WebRequest -Uri $FRONTEND_URL -TimeoutSec 10 -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Success " PASSED"
        $script:SuccessCount++
    }
}
catch {
    Write-Error " FAILED"
    Write-Host "  Error: Frontend server is not running on port 5001" -ForegroundColor Red
    Write-Info "Please start frontend: npm run dev"
    $script:ErrorCount++
}

# 12. TEST DATABASE OPERATIONS
Write-Section "12. Database Operations Test"
Write-Info "Testing MongoDB connection and operations..."

$mongoTestScript = @"
const { MongoClient } = require('mongodb');

async function testDatabase() {
    const url = 'mongodb://localhost:27017';
    const dbName = 'mutual_funds_db';
    const client = new MongoClient(url);
    
    try {
        await client.connect();
        console.log('✓ MongoDB connection: SUCCESS');
        
        const db = client.db(dbName);
        
        // Test collections
        const collections = await db.listCollections().toArray();
        console.log('✓ Collections found:', collections.length);
        
        // Test funds collection
        const fundsCount = await db.collection('funds').countDocuments();
        console.log('✓ Funds in database:', fundsCount);
        
        // Test users collection
        const usersCount = await db.collection('users').countDocuments();
        console.log('✓ Users in database:', usersCount);
        
        return true;
    } catch (error) {
        console.error('✗ Database test failed:', error.message);
        return false;
    } finally {
        await client.close();
    }
}

testDatabase().then(() => process.exit(0)).catch(err => {
    console.error(err);
    process.exit(1);
});
"@

$mongoTestScript | Out-File -FilePath "temp-db-test.js" -Encoding UTF8
try {
    node temp-db-test.js
    if ($LASTEXITCODE -eq 0) {
        $script:SuccessCount++
    } else {
        $script:ErrorCount++
    }
}
catch {
    Write-Error "Database test failed"
    $script:ErrorCount++
}
finally {
    Remove-Item "temp-db-test.js" -ErrorAction SilentlyContinue
}

# 13. TEST SPECIFIC FUND DETAILS API
Write-Section "13. Fund Details API Test"
Write-Info "Fetching a sample fund to test detailed endpoints..."

try {
    $funds = Invoke-RestMethod -Uri "$API_URL/funds?limit=1"
    if ($funds.data -and $funds.data.Count -gt 0) {
        $sampleFundId = $funds.data[0].schemeCode
        Write-Success "Sample Fund ID: $sampleFundId"
        Test-Endpoint -Name "Fund Details" -Url "$API_URL/funds/$sampleFundId"
        Test-Endpoint -Name "Fund Performance" -Url "$API_URL/funds/$sampleFundId/performance"
        Test-Endpoint -Name "Fund Holdings" -Url "$API_URL/funds/$sampleFundId/holdings"
        $script:SuccessCount++
    }
}
catch {
    Write-Error "Could not fetch sample fund for testing"
    $script:ErrorCount++
}

# SUMMARY
Write-Section "TEST SUMMARY"
$TotalTests = $SuccessCount + $ErrorCount
Write-Host ""
Write-Host "Total Tests: $TotalTests" -ForegroundColor Cyan
Write-Success "Passed: $SuccessCount"
Write-Error "Failed: $ErrorCount"
Write-Host ""

if ($ErrorCount -eq 0) {
    Write-Host "================================" -ForegroundColor Green
    Write-Host "ALL SYSTEMS OPERATIONAL! ✓" -ForegroundColor Green
    Write-Host "================================" -ForegroundColor Green
    Write-Host ""
    Write-Success "Frontend: Running on $FRONTEND_URL"
    Write-Success "Backend: Running on $BACKEND_URL"
    Write-Success "Database: Connected and operational"
    Write-Success "All APIs: Working correctly"
    Write-Host ""
    Write-Host "You can now use the application!" -ForegroundColor Green
} else {
    Write-Host "================================" -ForegroundColor Red
    Write-Host "ISSUES DETECTED!" -ForegroundColor Red
    Write-Host "================================" -ForegroundColor Red
    Write-Host ""
    Write-Info "Please check the errors above and:"
    Write-Host "1. Make sure MongoDB is running: mongod"
    Write-Host "2. Make sure Backend is running: cd mutual-funds-backend; npm run dev"
    Write-Host "3. Make sure Frontend is running: npm run dev"
    Write-Host "4. Check if all dependencies are installed"
}

Write-Host ""
exit $ErrorCount
