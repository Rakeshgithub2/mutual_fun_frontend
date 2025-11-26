# Server Configuration

## Port Assignment

- **Frontend (Next.js)**: Port `5001`
- **Backend (Express)**: Port `3002`

## Starting Servers

### Backend

```powershell
cd "c:\mutual fund\mutual-funds-backend"
$env:PORT="3002"
npm run dev
```

### Frontend

```powershell
cd "c:\mutual fund"
npm run dev
```

## Environment Variables

`.env.local` should contain:

```
NEXT_PUBLIC_API_URL=http://localhost:3002
```

## Quick Health Check

```powershell
# Check if servers are running
Get-NetTCPConnection -LocalPort 5001,3002 -ErrorAction SilentlyContinue | Format-Table LocalPort, State

# Test backend API
Invoke-RestMethod -Uri "http://localhost:3002/health"

# Test market indices (the one that was failing)
Invoke-RestMethod -Uri "http://localhost:3002/api/market-indices"
```

## URLs

- Frontend: http://localhost:5001
- Backend API: http://localhost:3002
- Backend Health: http://localhost:3002/health

## Common Issues Fixed

✅ MarketIndices "Failed to fetch" error - caused by wrong port (3003 vs 3002)
✅ Backend connection refused - backend wasn't running
✅ Frontend not picking up env changes - needed restart after .env.local change
