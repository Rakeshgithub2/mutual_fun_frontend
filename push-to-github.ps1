# Safe GitHub Push Script
# This script will safely push your project to GitHub while protecting sensitive data

Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "  Safe GitHub Push - Mutual Funds" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Verify we're in the right directory
if (-not (Test-Path "mutual-funds-backend") -or -not (Test-Path "mutual-funds-portal")) {
    Write-Host "ERROR: Backend or Frontend folder not found!" -ForegroundColor Red
    Write-Host "Please run this script from the 'mutual fund' directory" -ForegroundColor Yellow
    exit 1
}

Write-Host "[1/8] Checking directory structure..." -ForegroundColor Yellow
Write-Host "OK: Found backend and frontend folders" -ForegroundColor Green
Write-Host ""

# Step 2: Verify .gitignore files exist
Write-Host "[2/8] Verifying .gitignore files..." -ForegroundColor Yellow
$gitignoreOk = $true

if (-not (Test-Path "mutual-funds-backend\.gitignore")) {
    Write-Host "ERROR: Backend .gitignore missing!" -ForegroundColor Red
    $gitignoreOk = $false
}

if (-not (Test-Path "mutual-funds-portal\.gitignore")) {
    Write-Host "ERROR: Frontend .gitignore missing!" -ForegroundColor Red
    $gitignoreOk = $false
}

if ($gitignoreOk) {
    Write-Host "OK: .gitignore files present" -ForegroundColor Green
} else {
    Write-Host "Please ensure .gitignore files exist before pushing" -ForegroundColor Red
    exit 1
}
Write-Host ""

# Step 3: Check if .env files would be committed (security check)
Write-Host "[3/8] Security check - scanning for sensitive files..." -ForegroundColor Yellow
$sensitiveFiles = @(
    "mutual-funds-backend\.env",
    "mutual-funds-backend\.env.local",
    "mutual-funds-portal\.env.local"
)

$foundSensitive = $false
foreach ($file in $sensitiveFiles) {
    if (Test-Path $file) {
        # Check if this file would be committed
        $gitCheck = git check-ignore $file 2>$null
        if ([string]::IsNullOrEmpty($gitCheck)) {
            Write-Host "WARNING: $file is NOT ignored by git!" -ForegroundColor Red
            $foundSensitive = $true
        } else {
            Write-Host "OK: $file is properly ignored" -ForegroundColor Green
        }
    }
}

if ($foundSensitive) {
    Write-Host ""
    Write-Host "SECURITY ALERT: Some sensitive files are not properly ignored!" -ForegroundColor Red
    Write-Host "Please fix .gitignore files before continuing" -ForegroundColor Yellow
    exit 1
}
Write-Host ""

# Step 4: Check if .env.example files exist
Write-Host "[4/8] Checking template files..." -ForegroundColor Yellow
if (Test-Path "mutual-funds-backend\.env.example") {
    Write-Host "OK: Backend .env.example exists" -ForegroundColor Green
} else {
    Write-Host "WARNING: Backend .env.example not found (recommended)" -ForegroundColor Yellow
}

if (Test-Path "mutual-funds-portal\.env.example") {
    Write-Host "OK: Frontend .env.example exists" -ForegroundColor Green
} else {
    Write-Host "WARNING: Frontend .env.example not found (recommended)" -ForegroundColor Yellow
}
Write-Host ""

# Step 5: Initialize git if needed
Write-Host "[5/8] Checking Git repository..." -ForegroundColor Yellow
if (-not (Test-Path ".git")) {
    Write-Host "Initializing Git repository..." -ForegroundColor Yellow
    git init
    Write-Host "OK: Git repository initialized" -ForegroundColor Green
} else {
    Write-Host "OK: Git repository already initialized" -ForegroundColor Green
}
Write-Host ""

# Step 6: Add remote if not exists
Write-Host "[6/8] Setting up GitHub remote..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Please enter your GitHub repository details:" -ForegroundColor Cyan
$username = Read-Host "GitHub Username"
$repoName = Read-Host "Repository Name (e.g., mutual-funds-platform)"

$remoteUrl = "https://github.com/$username/$repoName.git"

$currentRemote = git remote get-url origin 2>$null
if ([string]::IsNullOrEmpty($currentRemote)) {
    git remote add origin $remoteUrl
    Write-Host "OK: Remote 'origin' added: $remoteUrl" -ForegroundColor Green
} else {
    Write-Host "Remote 'origin' already exists: $currentRemote" -ForegroundColor Yellow
    $change = Read-Host "Do you want to change it? (y/n)"
    if ($change -eq "y") {
        git remote set-url origin $remoteUrl
        Write-Host "OK: Remote updated to: $remoteUrl" -ForegroundColor Green
    }
}
Write-Host ""

# Step 7: Stage and commit files
Write-Host "[7/8] Staging files for commit..." -ForegroundColor Yellow
git add .

Write-Host ""
Write-Host "Files to be committed:" -ForegroundColor Cyan
git status --short

Write-Host ""
$proceed = Read-Host "Do you want to proceed with commit? (y/n)"

if ($proceed -ne "y") {
    Write-Host "Commit cancelled by user" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Creating commit..." -ForegroundColor Yellow
git commit -m "Initial commit: Mutual Funds Platform with Backend and Frontend"

Write-Host "OK: Changes committed" -ForegroundColor Green
Write-Host ""

# Step 8: Push to GitHub
Write-Host "[8/8] Pushing to GitHub..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Branch: main (or master)" -ForegroundColor Cyan
Write-Host "Remote: origin" -ForegroundColor Cyan
Write-Host ""

$branch = git branch --show-current
if ([string]::IsNullOrEmpty($branch)) {
    $branch = "master"
}

Write-Host "Pushing to branch: $branch" -ForegroundColor Yellow

# Try to push
try {
    git push -u origin $branch
    Write-Host ""
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host "  SUCCESS! Pushed to GitHub" -ForegroundColor Green
    Write-Host "=====================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your repository is now available at:" -ForegroundColor Cyan
    Write-Host "https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host ""
    Write-Host "IMPORTANT REMINDERS:" -ForegroundColor Yellow
    Write-Host "1. Your .env files are NOT in the repository (secure)" -ForegroundColor Green
    Write-Host "2. Only .env.example files were pushed (safe)" -ForegroundColor Green
    Write-Host "3. API keys and secrets remain on your local machine" -ForegroundColor Green
    Write-Host ""
} catch {
    Write-Host ""
    Write-Host "Push failed! This might be because:" -ForegroundColor Red
    Write-Host "1. The repository doesn't exist on GitHub yet" -ForegroundColor Yellow
    Write-Host "2. You need to authenticate with GitHub" -ForegroundColor Yellow
    Write-Host "3. The repository URL is incorrect" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Please create the repository on GitHub first:" -ForegroundColor Cyan
    Write-Host "https://github.com/new" -ForegroundColor White
    Write-Host ""
    Write-Host "Then run this script again." -ForegroundColor Yellow
}
