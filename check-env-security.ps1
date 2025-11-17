# Environment Security Check Script
# This script verifies that sensitive files are not tracked by Git

Write-Host "Checking Environment File Security..." -ForegroundColor Cyan
Write-Host ""

# Check if we're in a git repository
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: Not a git repository" -ForegroundColor Red
    exit 1
}

# Define sensitive files that should NOT be in git
$sensitiveFiles = @(
    "mutual-funds-backend/.env",
    "mutual-funds-backend/.env.local",
    "mutual-funds-backend/.env.production",
    "mutual-funds-backend/docker.env",
    "mutual-funds-portal/.env",
    "mutual-funds-portal/.env.local",
    "mutual-funds-portal/.env.production"
)

# Check if sensitive files are tracked by git
Write-Host "Checking Git Tracking Status..." -ForegroundColor Yellow
$trackedFiles = git ls-files | ForEach-Object { $_.Replace('/', '\') }
$foundIssues = $false

foreach ($file in $sensitiveFiles) {
    $file = $file.Replace('/', '\')
    if ($trackedFiles -contains $file) {
        Write-Host "DANGER: $file is tracked by Git!" -ForegroundColor Red
        $foundIssues = $true
    } else {
        Write-Host "OK: $file is not tracked" -ForegroundColor Green
    }
}

Write-Host ""

# Check if .env.example files exist
Write-Host "Checking Template Files..." -ForegroundColor Yellow
$templateFiles = @(
    "mutual-funds-backend/.env.example",
    "mutual-funds-portal/.env.example"
)

foreach ($file in $templateFiles) {
    if (Test-Path $file) {
        Write-Host "OK: $file exists" -ForegroundColor Green
    } else {
        Write-Host "WARNING: $file missing (recommended)" -ForegroundColor Yellow
    }
}

Write-Host ""

# Check .gitignore entries
Write-Host "Checking .gitignore Configuration..." -ForegroundColor Yellow

$gitignoreFiles = @(
    "mutual-funds-backend/.gitignore",
    "mutual-funds-portal/.gitignore"
)

$requiredPatterns = @(".env", ".env.local", ".env.production")

foreach ($gitignoreFile in $gitignoreFiles) {
    if (Test-Path $gitignoreFile) {
        $content = Get-Content $gitignoreFile -Raw
        $folder = Split-Path $gitignoreFile -Parent
        
        foreach ($pattern in $requiredPatterns) {
            if ($content -match [regex]::Escape($pattern)) {
                Write-Host "OK: $folder ignores $pattern" -ForegroundColor Green
            } else {
                Write-Host "WARNING: $folder/.gitignore missing: $pattern" -ForegroundColor Yellow
            }
        }
    }
}

Write-Host ""

# Check for potential secrets in staged files
Write-Host "Scanning Staged Files for Potential Secrets..." -ForegroundColor Yellow
$stagedFiles = git diff --cached --name-only

if ($stagedFiles) {
    foreach ($file in $stagedFiles) {
        if ($file -match "\.env") {
            Write-Host "ALERT: $file is staged for commit!" -ForegroundColor Red
            $foundIssues = $true
        }
    }
} else {
    Write-Host "OK: No files staged for commit" -ForegroundColor Green
}

Write-Host ""

# Final verdict
if ($foundIssues) {
    Write-Host "SECURITY ISSUES FOUND!" -ForegroundColor Red
    Write-Host ""
    Write-Host "ACTION REQUIRED:" -ForegroundColor Yellow
    Write-Host "   Run these commands to fix:" -ForegroundColor Yellow
    Write-Host "   git rm --cached mutual-funds-backend/.env" -ForegroundColor White
    Write-Host "   git rm --cached mutual-funds-backend/.env.local" -ForegroundColor White
    Write-Host "   git rm --cached mutual-funds-portal/.env.local" -ForegroundColor White
    Write-Host "   git commit -m 'chore: remove sensitive env files'" -ForegroundColor White
    Write-Host ""
    exit 1
} else {
    Write-Host "SUCCESS: All Security Checks Passed!" -ForegroundColor Green
    Write-Host "Your environment files are properly secured." -ForegroundColor Green
    Write-Host ""
    Write-Host "Ready to push to GitHub safely!" -ForegroundColor Cyan
    exit 0
}
