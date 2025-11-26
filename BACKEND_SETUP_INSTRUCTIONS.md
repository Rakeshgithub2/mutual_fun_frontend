# Backend Setup Instructions

## Issue: API Error "Not Found" on Compare Page

This error occurs when the frontend cannot connect to the backend API server.

## Quick Fix

### Step 1: Navigate to Backend Directory

```powershell
cd "C:\mutual fund\mutual-funds-backend"
```

### Step 2: Install Dependencies (if not already done)

```powershell
npm install
```

### Step 3: Setup Environment Variables

Create a `.env` file in the `mutual-funds-backend` directory:

```bash
PORT=3002
DATABASE_URL="your-database-url"
# Add other required environment variables from .env.example
```

### Step 4: Start the Backend Server

```powershell
npm run dev
```

The backend should now be running on `http://localhost:3002`

### Step 5: Set Frontend Environment Variable

In the root directory (`C:\mutual fund`), create or update `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3002
```

### Step 6: Restart Frontend

```powershell
cd "C:\mutual fund"
npm run dev
```

## Verify Backend is Running

Test the backend API:

```powershell
# Test health endpoint
curl http://localhost:3002/health

# Test funds endpoint
curl http://localhost:3002/api/funds
```

## Common Issues

### Port Already in Use

If port 3002 is already in use:

```powershell
# Find process using the port
netstat -ano | findstr ":3002"

# Kill the process (replace PID with actual process ID)
Stop-Process -Id PID -Force
```

### Database Connection Error

Ensure your DATABASE_URL in `.env` is correct and the database is running.

### Missing Dependencies

Run `npm install` in both directories:

```powershell
# Frontend
cd "C:\mutual fund"
npm install

# Backend
cd "C:\mutual fund\mutual-funds-backend"
npm install
```

## Architecture

```
Frontend (Next.js)          Backend (Express/NestJS)
Port: 3000                  Port: 3002
├─ app/                     ├─ src/
│  ├─ compare/             │  ├─ api/
│  │  └─ page.tsx          │  │  └─ funds/
│  └─ ...                  │  │     ├─ GET /api/funds
└─ lib/                    │  │     └─ GET /api/funds/:id
   └─ api-client.ts        │  └─ ...
                           └─ ...
```

## API Endpoints Used by Compare Page

- `GET /api/funds` - Get list of funds (with search/filter)
- `GET /api/funds/:id` - Get detailed fund information
- `POST /api/compare` - Compare multiple funds (optional)

## Solution Summary

The compare page now includes:

1. **Fallback mechanism** - Uses cached fund data when API is unavailable
2. **Better error handling** - Shows helpful error messages
3. **User guidance** - Displays instructions when API connection fails

The page will continue to work with cached data even if the backend is not running, but full functionality requires the backend to be operational.
