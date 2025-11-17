# 🔒 Secure Environment Files Guide

## Current Status

Your project has the following sensitive files that **MUST NOT** be pushed to GitHub:

### Backend (`mutual-funds-backend/`)

- ✅ `.env` - Contains production/local credentials
- ✅ `.env.local` - Contains local development credentials
- ✅ `.env.example` - Safe to commit (template without real values)

### Frontend (`mutual-funds-portal/`)

- ✅ `.env.local` - Contains local API URL
- ⚠️ No `.env.example` file exists yet

## ⚠️ Sensitive Information Found

Your `.env` files contain:

- 🔑 **MongoDB Atlas credentials** with username/password
- 🔑 **JWT Secrets** (authentication keys)
- 🔑 **Redis URL** with Upstash credentials
- 🔑 **Google OAuth credentials** (Client ID & Secret)
- 🔑 **RapidAPI Key** (Yahoo Finance)
- 🔑 **Resend API Key** (Email service)
- 🔑 **NewsData.io API Key**

## ✅ Current Protection Status

Good news! Your `.gitignore` files are already configured to ignore:

```
✓ .env
✓ .env.local
✓ .env.development.local
✓ .env.test.local
✓ .env.production.local
✓ docker.env
```

## 📋 Action Plan

### Step 1: Verify Git Status

Run this command to check if any env files are staged:

```powershell
git status
git ls-files | Select-String ".env"
```

### Step 2: If `.env` Files Are Already Committed

If you've already committed `.env` files to Git, you need to remove them:

```powershell
# Remove from Git tracking (keeps local file)
git rm --cached mutual-funds-backend/.env
git rm --cached mutual-funds-backend/.env.local
git rm --cached mutual-funds-portal/.env.local

# Commit the removal
git commit -m "chore: remove sensitive env files from git"

# Push changes
git push origin main
```

### Step 3: Create `.env.example` for Frontend

Create a template file that's safe to commit:

```powershell
# Create frontend .env.example
"# API Configuration`nNEXT_PUBLIC_API_URL=http://localhost:3002/api" | Out-File -FilePath "mutual-funds-portal/.env.example" -Encoding UTF8
```

### Step 4: Update Backend `.env.example`

Make sure all sensitive values are replaced with placeholders:

```bash
# Database
DATABASE_URL="mongodb://localhost:27017/mutual_funds_db"
# For production: "mongodb+srv://username:password@cluster.mongodb.net/dbname"

# JWT Secrets (generate new ones for production)
JWT_SECRET="generate-a-secure-random-secret-key-here"
JWT_REFRESH_SECRET="generate-another-secure-random-secret-key-here"

# Server
PORT=3002
NODE_ENV=development

# Redis URL (optional - for caching)
REDIS_URL="redis://localhost:6379"
# For production: "redis://default:password@host:port"

# APIs (sign up at respective services)
RAPIDAPI_KEY=your-rapidapi-key-here
RAPIDAPI_HOST=apidojo-yahoo-finance-v1.p.rapidapi.com
RESEND_API_KEY=your-resend-api-key-here
NEWSDATA_API_KEY=your-newsdata-api-key-here

# AMFI Data Source (public URL)
AMFI_NAV_URL=https://www.amfiindia.com/spages/NAVAll.txt

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:5001
```

## 🔐 Best Practices for API Keys

### 1. Use Environment Variables in Production

For deployment platforms:

- **Vercel**: Dashboard → Project Settings → Environment Variables
- **Heroku**: Dashboard → Settings → Config Vars
- **Railway**: Project Settings → Variables
- **AWS/Azure**: Use their secret management services

### 2. Generate Strong JWT Secrets

```powershell
# Generate secure random strings for JWT secrets
[Convert]::ToBase64String((1..64 | ForEach-Object { Get-Random -Maximum 256 }))
```

### 3. Rotate API Keys Regularly

- Change production keys every 3-6 months
- Use different keys for development and production
- Revoke old keys after rotation

### 4. Use Different Credentials Per Environment

```
Development: Use test/sandbox API keys
Staging: Use separate staging keys
Production: Use production keys with IP restrictions
```

## 🚀 Safe Commit Workflow

```powershell
# 1. Check what's being committed
git status

# 2. Verify no env files are included
git diff --cached

# 3. If all clear, commit
git add .
git commit -m "Your commit message"

# 4. Push to GitHub
git push origin main
```

## 🛡️ Additional Security Measures

### 1. Add Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/sh
if git diff --cached --name-only | grep -E '\.env$|\.env\.local$'; then
    echo "❌ ERROR: Attempting to commit .env files!"
    echo "Please remove them from staging area."
    exit 1
fi
```

### 2. Use Git-Secrets Tool

```powershell
# Install git-secrets (Windows)
# Download from: https://github.com/awslabs/git-secrets

# Scan repository
git secrets --scan

# Scan history
git secrets --scan-history
```

### 3. GitHub Secret Scanning

- Enable "Secret scanning" in repository settings
- GitHub will automatically detect leaked credentials
- Receive alerts if secrets are found

## 📝 Setup Instructions for New Developers

Create a `SETUP.md` file:

```markdown
# Development Setup

1. Clone the repository
2. Copy environment files:
```

cp mutual-funds-backend/.env.example mutual-funds-backend/.env
cp mutual-funds-portal/.env.example mutual-funds-portal/.env.local

```
3. Fill in your own API keys in the `.env` files
4. Install dependencies and run the project
```

## 🔄 What to Commit to GitHub

✅ **Safe to Commit:**

- `.env.example` (template files)
- `.gitignore` files
- Source code
- Documentation
- Configuration files without secrets

❌ **NEVER Commit:**

- `.env`
- `.env.local`
- `.env.production`
- Any file with actual API keys
- Database credentials
- JWT secrets

## 🆘 If You Accidentally Committed Secrets

1. **Immediately rotate all exposed credentials**
2. **Remove from Git history:**
   ```powershell
   # Use BFG Repo-Cleaner (recommended)
   java -jar bfg.jar --delete-files .env
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```
3. **Force push (⚠️ Warning: rewrites history)**
   ```powershell
   git push --force origin main
   ```
4. **Notify your team** about the credential rotation

## 📞 API Key Management Resources

- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Upstash Redis**: https://upstash.com/
- **Google OAuth**: https://console.cloud.google.com/
- **RapidAPI**: https://rapidapi.com/
- **Resend**: https://resend.com/
- **NewsData.io**: https://newsdata.io/

## 🎯 Summary

Your current setup is **SECURE** as long as:

1. ✅ `.gitignore` is properly configured (it is)
2. ✅ No `.env` files are committed to Git
3. ✅ Only `.env.example` files are in the repository

Run the verification script to confirm!
