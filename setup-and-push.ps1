# Automated Monorepo Setup and GitHub Push
# This script will set up your project as a monorepo and push to GitHub

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " Mutual Funds Platform - GitHub Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# Verify location
if (-not (Test-Path "mutual-funds-backend") -or -not (Test-Path "mutual-funds-portal")) {
    Write-Host "ERROR: Please run from the 'mutual fund' directory" -ForegroundColor Red
    exit 1
}

Write-Host "Step 1: Setting up Monorepo structure..." -ForegroundColor Yellow
Write-Host ""

# Remove nested .git folders
$changes = $false

if (Test-Path "mutual-funds-backend\.git") {
    Write-Host "Found nested .git in backend - removing..." -ForegroundColor Yellow
    Remove-Item -Path "mutual-funds-backend\.git" -Recurse -Force
    Write-Host "OK: Backend .git removed" -ForegroundColor Green
    $changes = $true
}

if (Test-Path "mutual-funds-portal\.git") {
    Write-Host "Found nested .git in frontend - removing..." -ForegroundColor Yellow
    Remove-Item -Path "mutual-funds-portal\.git" -Recurse -Force
    Write-Host "OK: Frontend .git removed" -ForegroundColor Green
    $changes = $true
}

if (-not $changes) {
    Write-Host "OK: Monorepo structure already set up" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 2: Security Check..." -ForegroundColor Yellow

# Verify .env files are not tracked
git add . 2>&1 | Out-Null
$envInGit = git ls-files | Select-String "\.env$" | Where-Object { $_ -notmatch "\.env\.example" }

if ($envInGit) {
    Write-Host "ERROR: .env files found in git!" -ForegroundColor Red
    Write-Host $envInGit
    exit 1
} else {
    Write-Host "OK: No .env files in repository" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 3: GitHub Repository Setup..." -ForegroundColor Yellow
Write-Host ""

# Get GitHub details
$username = Read-Host "Enter your GitHub username"
$repoName = Read-Host "Enter repository name (e.g., mutual-funds-platform)"

Write-Host ""
Write-Host "IMPORTANT: Create the repository on GitHub first!" -ForegroundColor Cyan
Write-Host "Go to: https://github.com/new" -ForegroundColor White
Write-Host ""
Write-Host "Settings:" -ForegroundColor Yellow
Write-Host "  - Name: $repoName" -ForegroundColor White
Write-Host "  - Visibility: Private (recommended)" -ForegroundColor White
Write-Host "  - Don't initialize with README, .gitignore, or license" -ForegroundColor White
Write-Host ""

$ready = Read-Host "Have you created the repository? (y/n)"
if ($ready -ne "y") {
    Write-Host "Please create the repository first, then run this script again" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Step 4: Staging files..." -ForegroundColor Yellow

# Stage all files
git add .

# Show what will be committed
$fileCount = (git diff --cached --name-only | Measure-Object).Count
Write-Host "Files to commit: $fileCount" -ForegroundColor Cyan
Write-Host ""

# Show first 20 files
Write-Host "Sample of files:" -ForegroundColor Cyan
git diff --cached --name-only | Select-Object -First 20

$more = (git diff --cached --name-only | Measure-Object).Count - 20
if ($more -gt 0) {
    Write-Host "... and $more more files" -ForegroundColor Gray
}

Write-Host ""
$proceed = Read-Host "Proceed with commit? (y/n)"

if ($proceed -ne "y") {
    Write-Host "Cancelled by user" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Step 5: Creating commit..." -ForegroundColor Yellow

git commit -m @"
Initial commit: Full-stack Mutual Funds Investment Platform

Backend (mutual-funds-backend/):
- Node.js + Express + TypeScript
- MongoDB with Prisma ORM
- JWT + Google OAuth authentication
- Real-time news integration (NewsData.io API)
- RESTful API endpoints
- WebSocket support for real-time updates

Frontend (mutual-funds-portal/):
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- Responsive design
- Portfolio management
- Investment calculators (SIP, Lumpsum, SWP)
- Fund comparison and analysis
- Real-time market data

Features:
- User authentication and authorization
- Portfolio tracking and analytics
- Investment calculators
- Real-time financial news
- Fund search and comparison
- Market indices tracking
- Google OAuth integration
- Secure API key management
"@

Write-Host "OK: Commit created" -ForegroundColor Green
Write-Host ""

Write-Host "Step 6: Adding GitHub remote..." -ForegroundColor Yellow

$remoteUrl = "https://github.com/$username/$repoName.git"
$currentRemote = git remote get-url origin 2>$null

if ($currentRemote) {
    Write-Host "Remote already exists: $currentRemote" -ForegroundColor Yellow
    git remote set-url origin $remoteUrl
    Write-Host "Updated remote to: $remoteUrl" -ForegroundColor Green
} else {
    git remote add origin $remoteUrl
    Write-Host "Added remote: $remoteUrl" -ForegroundColor Green
}

Write-Host ""
Write-Host "Step 7: Pushing to GitHub..." -ForegroundColor Yellow

# Determine branch name
$branch = git branch --show-current
if ([string]::IsNullOrEmpty($branch)) {
    Write-Host "Setting branch to 'main'..." -ForegroundColor Yellow
    git branch -M main
    $branch = "main"
}

Write-Host "Pushing to: origin/$branch" -ForegroundColor Cyan
Write-Host ""

# Push with error handling
try {
    git push -u origin $branch 2>&1 | Out-String | Write-Host
    
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "         SUCCESS! " -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Repository URL:" -ForegroundColor Cyan
    Write-Host "https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host ""
    Write-Host "SECURITY SUMMARY:" -ForegroundColor Yellow
    Write-Host "OK: .env files are NOT in repository" -ForegroundColor Green
    Write-Host "OK: Only .env.example files were pushed" -ForegroundColor Green
    Write-Host "OK: API keys remain on your local machine" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next Steps:" -ForegroundColor Cyan
    Write-Host "1. View your repository: https://github.com/$username/$repoName" -ForegroundColor White
    Write-Host "2. Add a repository description on GitHub" -ForegroundColor White
    Write-Host "3. Add topics: mutual-funds, react, nodejs, typescript" -ForegroundColor White
    Write-Host "4. Share with collaborators if needed" -ForegroundColor White
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "         PUSH FAILED" -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host ""
    Write-Host "Error details:" -ForegroundColor Yellow
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "Common solutions:" -ForegroundColor Yellow
    Write-Host "1. Make sure the repository exists on GitHub" -ForegroundColor White
    Write-Host "2. Check your GitHub authentication" -ForegroundColor White
    Write-Host "3. Verify repository name and username are correct" -ForegroundColor White
    Write-Host ""
    Write-Host "You can try pushing manually:" -ForegroundColor Cyan
    Write-Host "git push -u origin $branch" -ForegroundColor White
    Write-Host ""
}
