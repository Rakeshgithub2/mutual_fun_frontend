# Port Configuration Reference

## Current Configuration

### Backend

- **Port**: 3002
- **URL**: http://localhost:3002
- **Config File**: `mutual-funds-backend/.env`
- **Setting**: `PORT=3002`

### Frontend

- **Port**: 5001
- **URL**: http://localhost:5001
- **API Config**: `.env.local`
- **Setting**: `NEXT_PUBLIC_API_URL=http://localhost:3002/api`

## Files Updated (2025-01-21)

### Comprehensive Port Standardization

All files standardized to use port 3002:

1. **`.env.local`** - Main environment config
2. **`app/funds/[id]/page.tsx`** - Fund details page
3. **`app/funds/[id]/page-enhanced.tsx`** - Enhanced fund page
4. **`lib/api.ts`** - API utilities
5. **`lib/auth-context.tsx`** - Auth context
6. **`components/ai-chatbot.tsx`** - AI chatbot
7. **`app/overlap/page.tsx`** - Fund overlap tool
8. **`app/kyc/page.tsx`** - KYC page
9. **`app/portfolio/page.tsx`** - Portfolio page
10. **`app/invest/[fundId]/page.tsx`** - Investment page
11. **`app/page-old.tsx`** - Old homepage
12. **`app/market/[id]/page.tsx`** - Market indices
13. **`app/calculators/page.tsx`** - All calculators
14. **`app/chat/page.tsx`** - Chat page
15. **`app/auth/page.tsx`** - Auth page
16. **`src/tests/auth.integration.test.ts`** - Integration tests

**Total: 16+ files standardized to PORT 3002**

## How to Restart Servers

### Backend

```powershell
cd "c:\mutual fund\mutual-funds-backend"
npm run dev
```

Expected output: `Server is running on http://localhost:3002`

### Frontend

```powershell
cd "c:\mutual fund"
npm run dev
```

Expected output: `ready in Xms` on `http://localhost:5001`

## Testing

### Backend Health Check

```powershell
Invoke-RestMethod "http://localhost:3002/api/funds?limit=1"
```

### Frontend

Open browser: http://localhost:5001

### Fund Details with Real Holdings

http://localhost:5001/funds/69206d0f1d1b264de4de750c

## Troubleshooting

### "Fund not found" Error

- **Cause**: Frontend calling wrong port
- **Solution**: Verify `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:3002/api` and restart frontend

### Backend not responding

- **Check**: Is backend running? `Get-Job | Where-Object { $_.Name -eq "backend-server" }`
- **Restart**: Stop job and start fresh (see commands above)

### Port already in use

```powershell
# Find process using port 3002
netstat -ano | findstr :3002

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

## Status (Current)

- ✅ Backend: Running on port 3002
- ✅ Backend: 15 real company holdings per fund
- ✅ Configuration: ALL files standardized to port 3002
- ✅ Frontend: Running on port 5001
- ✅ Environment configured correctly

## Verification Results

```
✅ Backend responding: http://localhost:3002/api
✅ Real company holdings: 15 per fund
✅ Sample fund: HDFC Top 100 Fund Direct Plan Growth
✅ Top holding: Reliance Industries Ltd (8.52%)
✅ All files using port 3002 consistently
```
