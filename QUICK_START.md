# Quick Start Guide - Updated Port Configuration

## 🚀 Start Your Application (3 Steps)

### Step 1: Ensure MongoDB is Running

```powershell
# Check if MongoDB is running
Get-Process mongod

# If not running, start it:
mongod --dbpath C:\data\db
```

### Step 2: Start Servers

```powershell
# Automated (Recommended)
.\start-servers.ps1

# OR Manual
# Terminal 1 - Backend (port 3002)
cd "C:\mutual fund\mutual-funds-backend"
npm run dev

# Terminal 2 - Frontend (port 5001)
cd "C:\mutual fund"
npm run dev
```

### Step 3: Open Your Browser

```
http://localhost:5001
```

## ✅ Verify Everything Works

```powershell
# Run verification script
.\verify-setup.ps1

# Or quick manual checks:
# 1. Backend health
Invoke-RestMethod http://localhost:3002/health

# 2. API test
Invoke-RestMethod "http://localhost:3002/api/funds?limit=5"

# 3. Frontend test
Invoke-WebRequest http://localhost:5001
```

## 🎯 Current Port Configuration

| Service  | Port  | URL                       |
| -------- | ----- | ------------------------- |
| Frontend | 5001  | http://localhost:5001     |
| Backend  | 3002  | http://localhost:3002     |
| MongoDB  | 27017 | mongodb://localhost:27017 |

## 🔧 Troubleshooting

### Port Already in Use?

```powershell
# Kill process on port 3002
$p = Get-NetTCPConnection -LocalPort 3002 -ErrorAction SilentlyContinue
if ($p) { Stop-Process -Id $p.OwningProcess -Force }

# Kill process on port 5001
$p = Get-NetTCPConnection -LocalPort 5001 -ErrorAction SilentlyContinue
if ($p) { Stop-Process -Id $p.OwningProcess -Force }
```

### Backend Not Starting?

```powershell
# Check backend logs
cd mutual-funds-backend
npm run dev

# Check MongoDB connection
mongosh mongodb://localhost:27017
```

### Frontend Shows "Failed to fetch"?

This has been FIXED! All API calls now use port 3002.
If you still see errors:

1. Ensure backend is running: http://localhost:3002/health
2. Clear browser cache (Ctrl+Shift+Delete)
3. Hard refresh (Ctrl+Shift+R)

## 📊 Database Info

```powershell
# Check fund count
mongosh --eval "db.funds.countDocuments()" mongodb://localhost:27017/mutual_funds_db

# Should show: 150 funds (100 equity + 50 commodity)
```

## 📝 What Was Fixed?

- ✅ All API URLs updated from port 3003 to 3002
- ✅ Environment files updated
- ✅ 24 files updated across the codebase
- ✅ 35+ port references corrected
- ✅ 0 references to old port remaining

## 🎉 You're Ready!

Your mutual fund platform is configured correctly and ready to use.

**Start Command:**

```powershell
.\start-servers.ps1
```

**Access:**

```
http://localhost:5001
```
