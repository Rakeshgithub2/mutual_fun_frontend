# 🔌 Port Configuration Summary

**Last Updated**: November 22, 2025

## ✅ Current Port Configuration

| Service                   | Port    | URL                       | Status     |
| ------------------------- | ------- | ------------------------- | ---------- |
| **Frontend** (Next.js)    | `5001`  | http://localhost:5001     | ✅ Running |
| **Backend** (Express API) | `3002`  | http://localhost:3002     | ✅ Running |
| **MongoDB**               | `27017` | mongodb://localhost:27017 | ✅ Running |

## 📝 Configuration Files

### Backend Configuration

**File**: `mutual-funds-backend/.env`

```env
PORT=3002
FRONTEND_URL=http://localhost:5001
DATABASE_URL=mongodb://localhost:27017/mutual_funds_db
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
```

### Frontend Configuration

**File**: `.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:3002/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

## 🔄 Recent Changes (Nov 22, 2025)

### Files Updated to Port 3002:

1. ✅ `src/index.ts` - CORS origins updated (removed 3000)
2. ✅ `src/services/socket.ts` - Socket.IO CORS updated (removed 3000)
3. ✅ `src/controllers/googleAuth.ts` - Frontend URL changed from 3000 → 5001
4. ✅ `test-auth-complete.js` - API base URL changed to 3002
5. ✅ `PORT_CONFIGURATION.md` - All documentation updated

### Why Port 3002?

- Backend was already configured to run on port 3002 in `.env` file
- Frontend configured to call port 3002 in `.env.local`
- All hardcoded references to port 3000 have been removed
- Consistent configuration across all files

## 🚀 Quick Start Commands

### Start Backend

```powershell
cd "c:\mutual fund\mutual-funds-backend"
npm run dev
```

Expected: `✅ Server is running on http://localhost:3002`

### Start Frontend

```powershell
cd "c:\mutual fund"
npm run dev
```

Expected: `✓ Ready in X.Xs` on http://localhost:5001

## 🧪 Testing

### Backend Health Check

```powershell
# Test backend is responding
curl http://localhost:3002/api/funds?limit=1

# Or using PowerShell
Invoke-RestMethod "http://localhost:3002/api/funds?limit=1"
```

### Frontend Check

Open browser: http://localhost:5001

### API Endpoints

- Funds List: http://localhost:3002/api/funds
- Fund Details: http://localhost:3002/api/funds/{id}
- Fund Managers: http://localhost:3002/api/fund-managers
- Market Indices: http://localhost:3002/api/market-indices

## 🔍 Verify Configuration

```powershell
# Check what's running on ports
Get-NetTCPConnection -LocalPort 5001,3002 -ErrorAction SilentlyContinue | Format-Table LocalPort, State

# Check environment variables
cd "c:\mutual fund"
Get-Content .env.local

cd "c:\mutual fund\mutual-funds-backend"
Get-Content .env
```

## ⚠️ Troubleshooting

### Port Already in Use

```powershell
# Find process using port 3002
netstat -ano | findstr :3002

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### Frontend Can't Connect to Backend

1. ✅ Check backend is running on port 3002
2. ✅ Verify `.env.local` has: `NEXT_PUBLIC_API_URL=http://localhost:3002/api`
3. ✅ Restart frontend after changing `.env.local`

### CORS Errors

The backend now allows these origins:

- http://localhost:5001 (frontend)
- http://localhost:3001 (alternative)
- https://mf-frontend-coral.vercel.app (production)

## 📊 Architecture

```
┌─────────────────────────────────────────────────┐
│  Browser                                        │
│  http://localhost:5001                          │
└────────────────┬────────────────────────────────┘
                 │
                 │ API Calls
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Frontend (Next.js)                             │
│  Port: 5001                                     │
│  Env: NEXT_PUBLIC_API_URL=localhost:3002/api   │
└────────────────┬────────────────────────────────┘
                 │
                 │ HTTP Requests
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  Backend (Express API)                          │
│  Port: 3002                                     │
│  CORS: Allows localhost:5001                    │
└────────────────┬────────────────────────────────┘
                 │
                 │ Database Queries
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│  MongoDB                                        │
│  Port: 27017                                    │
│  Database: mutual_funds_db                      │
└─────────────────────────────────────────────────┘
```

## ✨ Summary

**All systems configured to use:**

- ✅ **Frontend**: Port 5001
- ✅ **Backend**: Port 3002
- ✅ No references to port 3000 remain
- ✅ CORS properly configured
- ✅ Environment variables correct
- ✅ Both servers running successfully

---

**Note**: Port 3000 was used in older documentation. All references have been updated to reflect the correct port 3002 for the backend.
