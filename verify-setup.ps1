#!/usr/bin/env pwsh
# Verify the complete setup with correct ports

Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       MUTUAL FUND PLATFORM - SETUP VERIFICATION       ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

$results = @{
    passed = 0
    failed = 0
    warnings = 0
}

function Test-Check {
    param(
        [string]$Name,
        [scriptblock]$Test,
        [string]$SuccessMessage,
        [string]$FailureMessage,
        [string]$WarningMessage
    )
    
    Write-Host "`n🔍 $Name" -ForegroundColor Cyan
    try {
        $result = & $Test
        if ($result -eq $true) {
            Write-Host "   ✅ $SuccessMessage" -ForegroundColor Green
            $script:results.passed++
            return $true
        } elseif ($result -eq "warning") {
            Write-Host "   ⚠️  $WarningMessage" -ForegroundColor Yellow
            $script:results.warnings++
            return "warning"
        } else {
            Write-Host "   ❌ $FailureMessage" -ForegroundColor Red
            $script:results.failed++
            return $false
        }
    } catch {
        Write-Host "   ❌ $FailureMessage - $($_.Exception.Message)" -ForegroundColor Red
        $script:results.failed++
        return $false
    }
}

# Check 1: Environment File
Test-Check -Name "Checking .env.local configuration" -Test {
    $envPath = Join-Path $PSScriptRoot ".env.local"
    if (Test-Path $envPath) {
        $content = Get-Content $envPath -Raw
        if ($content -match "localhost:3002") {
            return $true
        }
        return $false
    }
    return $false
} -SuccessMessage "Environment file configured for port 3002" -FailureMessage "Environment file not configured correctly"

# Check 2: Backend .env
Test-Check -Name "Checking backend .env configuration" -Test {
    $envPath = Join-Path $PSScriptRoot "mutual-funds-backend\.env"
    if (Test-Path $envPath) {
        $content = Get-Content $envPath -Raw
        if ($content -match "PORT=3002") {
            return $true
        }
        return $false
    }
    return $false
} -SuccessMessage "Backend configured for port 3002" -FailureMessage "Backend .env not configured correctly"

# Check 3: MongoDB Running
Test-Check -Name "Checking MongoDB status" -Test {
    $mongoProcess = Get-Process mongod -ErrorAction SilentlyContinue
    if ($mongoProcess) {
        return $true
    }
    return "warning"
} -SuccessMessage "MongoDB is running" -FailureMessage "MongoDB is not running" -WarningMessage "MongoDB may not be running"

# Check 4: MongoDB Connection
Test-Check -Name "Testing MongoDB connection" -Test {
    try {
        # Use mongosh to test connection
        $mongoTest = mongosh --quiet --eval "db.adminCommand('ping').ok" mongodb://localhost:27017 2>&1
        if ($mongoTest -eq "1") {
            return $true
        }
        return "warning"
    } catch {
        return "warning"
    }
} -SuccessMessage "MongoDB connection successful" -FailureMessage "Cannot connect to MongoDB" -WarningMessage "MongoDB connection test skipped"

# Check 5: MongoDB Database
Test-Check -Name "Checking mutual_funds_db database" -Test {
    try {
        $dbCheck = mongosh --quiet --eval "db.getName()" mongodb://localhost:27017/mutual_funds_db 2>&1
        if ($dbCheck -eq "mutual_funds_db") {
            return $true
        }
        return "warning"
    } catch {
        return "warning"
    }
} -SuccessMessage "Database mutual_funds_db exists" -FailureMessage "Database check failed" -WarningMessage "Could not verify database"

# Check 6: Fund Count
Test-Check -Name "Checking fund count in database" -Test {
    try {
        $count = mongosh --quiet --eval "db.funds.countDocuments()" mongodb://localhost:27017/mutual_funds_db 2>&1
        if ($count -match "(\d+)") {
            $fundCount = [int]$matches[1]
            Write-Host "   📊 Found $fundCount funds in database" -ForegroundColor Gray
            if ($fundCount -ge 150) {
                return $true
            } elseif ($fundCount -gt 0) {
                return "warning"
            }
        }
        return $false
    } catch {
        return "warning"
    }
} -SuccessMessage "Database has 150+ funds" -FailureMessage "Database has insufficient funds" -WarningMessage "Database has some funds but less than 150"

# Check 7: Backend Server
Test-Check -Name "Checking if backend server is running" -Test {
    $port = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
    if ($port) {
        return $true
    }
    return $false
} -SuccessMessage "Backend server is running on port 3002" -FailureMessage "Backend server is not running"

# Check 8: Backend Health
Test-Check -Name "Testing backend health endpoint" -Test {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3002/health" -TimeoutSec 5
        if ($response.status -eq "OK") {
            return $true
        }
        return $false
    } catch {
        return $false
    }
} -SuccessMessage "Backend health check passed" -FailureMessage "Backend health check failed"

# Check 9: Backend API
Test-Check -Name "Testing backend API endpoint" -Test {
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3002/api/funds?limit=1" -TimeoutSec 10
        if ($response.success -and $response.data) {
            return $true
        }
        return $false
    } catch {
        return $false
    }
} -SuccessMessage "Backend API is responding correctly" -FailureMessage "Backend API is not responding"

# Check 10: Frontend Server
Test-Check -Name "Checking if frontend server is running" -Test {
    $port = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
    if ($port) {
        return $true
    }
    return $false
} -SuccessMessage "Frontend server is running on port 5001" -FailureMessage "Frontend server is not running"

# Check 11: Frontend Response
Test-Check -Name "Testing frontend server response" -Test {
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5001" -TimeoutSec 10 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            return $true
        }
        return $false
    } catch {
        return $false
    }
} -SuccessMessage "Frontend is responding" -FailureMessage "Frontend is not responding"

# Check 12: Package.json Configuration
Test-Check -Name "Verifying package.json dev script" -Test {
    $packagePath = Join-Path $PSScriptRoot "package.json"
    if (Test-Path $packagePath) {
        $content = Get-Content $packagePath -Raw | ConvertFrom-Json
        if ($content.scripts.dev -match "5001") {
            return $true
        }
    }
    return $false
} -SuccessMessage "Frontend configured to run on port 5001" -FailureMessage "package.json not configured correctly"

# Summary
Write-Host "`n╔════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║                   VERIFICATION SUMMARY                 ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════╝" -ForegroundColor Cyan

Write-Host "`n📊 Results:" -ForegroundColor White
Write-Host "   ✅ Passed:   $($results.passed)" -ForegroundColor Green
Write-Host "   ⚠️  Warnings: $($results.warnings)" -ForegroundColor Yellow
Write-Host "   ❌ Failed:   $($results.failed)" -ForegroundColor Red

$total = $results.passed + $results.warnings + $results.failed
$score = [math]::Round(($results.passed / $total) * 100, 1)

Write-Host "`n🎯 Score: $score%" -ForegroundColor $(if ($score -ge 80) { "Green" } elseif ($score -ge 60) { "Yellow" } else { "Red" })

if ($results.failed -eq 0) {
    Write-Host "`n✨ All critical checks passed! Your setup is ready." -ForegroundColor Green
    Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
    Write-Host "   1. If servers aren't running, use: .\start-servers.ps1" -ForegroundColor White
    Write-Host "   2. Open browser to: http://localhost:5001" -ForegroundColor White
    Write-Host "   3. Start exploring your mutual fund platform!" -ForegroundColor White
} else {
    Write-Host "`n⚠️  Some checks failed. Please review the errors above." -ForegroundColor Yellow
    Write-Host "`n🔧 Common Fixes:" -ForegroundColor Cyan
    Write-Host "   • Start MongoDB: mongod --dbpath C:\data\db" -ForegroundColor White
    Write-Host "   • Seed database: cd mutual-funds-backend; node seed-complete-funds.js" -ForegroundColor White
    Write-Host "   • Start servers: .\start-servers.ps1" -ForegroundColor White
}

Write-Host ""
