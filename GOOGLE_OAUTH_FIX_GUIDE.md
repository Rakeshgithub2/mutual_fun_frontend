# 🔧 GOOGLE OAUTH FIX GUIDE

## ❌ Current Errors

1. `[GSI_LOGGER]: The given origin is not allowed for the given client ID` (403)
2. `Failed to load resource: 404 on /api/auth/google`
3. `Cross-Origin-Opener-Policy policy would block the window.postMessage call`

## ✅ Root Causes Identified

### 1. Backend Missing POST Endpoint

**Problem:** Backend has GET `/auth/google` for redirect flow, but frontend uses POST with ID token.

**Solution:** Added `verifyGoogleToken` function to handle POST `/api/auth/google`.

### 2. Google OAuth Origin Not Authorized

**Problem:** `http://localhost:5001` is not in the authorized origins list in Google Cloud Console.

**Solution:** Must configure Google Cloud Console (see steps below).

### 3. COOP Headers

**Problem:** Cross-Origin-Opener-Policy blocking window.postMessage.

**Solution:** Configure headers in Next.js config.

---

## 🔧 FIXES APPLIED

### ✅ Backend Fix (COMPLETED)

**File: `src/routes/auth.ts`**

```typescript
// Added POST route for Google ID token verification
router.post('/google', verifyGoogleToken);
```

**File: `src/controllers/googleAuth.ts`**

```typescript
// Added new function to verify Google ID tokens from frontend
export const verifyGoogleToken = async (req: Request, res: Response) => {
  // Verifies idToken from @react-oauth/google
  // Creates/updates user in database
  // Returns JWT tokens
};
```

### ⚠️ Frontend Configuration Needed

You need to configure **Google Cloud Console** to allow your localhost origins.

---

## 🔑 GOOGLE CLOUD CONSOLE SETUP

### Step 1: Go to Google Cloud Console

1. Visit: https://console.cloud.google.com/
2. Select your project (or create a new one)

### Step 2: Enable Google+ API

1. Go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click **Enable**

### Step 3: Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Select **Application type**: **Web application**
4. Give it a name: "Mutual Fund Portal"

### Step 4: Configure Authorized JavaScript Origins

Add these origins:

```
http://localhost:5001
http://localhost:3000
http://localhost:3002
https://your-production-domain.com
```

### Step 5: Configure Authorized Redirect URIs

Add these redirect URIs:

```
http://localhost:3002/api/auth/google/callback
http://localhost:5001/auth/success
https://your-production-domain.com/api/auth/google/callback
https://your-production-domain.com/auth/success
```

### Step 6: Get Your Credentials

After saving, you'll see:

- **Client ID**: `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`
- **Client Secret**: (keep this secret!)

---

## 🔧 ENVIRONMENT VARIABLES

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

### Backend (src/.env or backend/.env)

```env
# Google OAuth Configuration
GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret-here

# URLs
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
FRONTEND_URL=http://localhost:5001
NEXT_PUBLIC_BACKEND_URL=http://localhost:3002
```

**⚠️ IMPORTANT:** Make sure `GOOGLE_CLIENT_SECRET` is set in your backend environment!

---

## 🔧 NEXT.JS CONFIGURATION FIX

### Update next.config.mjs

Add headers to fix COOP issues:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'unsafe-none',
          },
        ],
      },
    ];
  },
  // ... rest of your config
};

export default nextConfig;
```

---

## 🚀 RESTART SERVERS

After making these changes:

### 1. Restart Backend

```powershell
# Stop current backend (Ctrl+C)
# Then restart:
cd backend  # or wherever your backend is
npm run dev
```

### 2. Restart Frontend

```powershell
# Stop current frontend (Ctrl+C)
# Then restart:
npm run dev
```

---

## ✅ TESTING

### Test 1: Check Backend Endpoint

```powershell
# Test if POST /api/auth/google exists
curl -X POST http://localhost:3002/api/auth/google `
  -H "Content-Type: application/json" `
  -d '{"idToken":"test"}'
```

Expected response: `400` or `401` (not 404!)

### Test 2: Test Google Sign-In Button

1. Open: http://localhost:5001/auth/login
2. Click "Sign in with Google"
3. Check browser console for errors
4. Should see Google account picker popup

### Test 3: Complete Sign-In Flow

1. Click Google button
2. Select Google account
3. Should redirect to home page
4. Check localStorage for tokens:
   ```javascript
   console.log(localStorage.getItem('accessToken'));
   console.log(localStorage.getItem('user'));
   ```

---

## 🐛 TROUBLESHOOTING

### Error: "404 on /api/auth/google"

**Cause:** Backend not running or route not registered.

**Fix:**

1. Ensure backend is running: `npm run dev` in backend folder
2. Check terminal logs for "Google OAuth Configuration"
3. Verify the route is registered in `src/routes/auth.ts`

### Error: "Origin not allowed"

**Cause:** Google Cloud Console not configured properly.

**Fix:**

1. Go to Google Cloud Console
2. Add `http://localhost:5001` to authorized origins
3. Wait 5 minutes for changes to propagate
4. Clear browser cache and try again

### Error: "Invalid Google ID token"

**Cause:** Client ID mismatch between frontend and backend.

**Fix:**

1. Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
2. Verify `GOOGLE_CLIENT_ID` in backend `.env`
3. They should be the SAME value
4. Restart both servers

### Error: "GOOGLE_CLIENT_SECRET is not configured"

**Cause:** Missing environment variable in backend.

**Fix:**

1. Get Client Secret from Google Cloud Console
2. Add to backend `.env`:
   ```
   GOOGLE_CLIENT_SECRET=your-secret-here
   ```
3. Restart backend

### Error: Cross-Origin-Opener-Policy

**Cause:** COOP headers blocking Google OAuth popup.

**Fix:**

1. Update `next.config.mjs` with headers (see above)
2. Restart frontend
3. Clear browser cache

---

## 📋 CHECKLIST

Before testing, ensure:

- [x] Backend code updated with `verifyGoogleToken` function
- [x] Backend route added: `router.post('/google', verifyGoogleToken)`
- [ ] Google Cloud Console configured (authorized origins)
- [ ] Google Cloud Console configured (redirect URIs)
- [ ] Backend `.env` has `GOOGLE_CLIENT_ID`
- [ ] Backend `.env` has `GOOGLE_CLIENT_SECRET`
- [ ] Frontend `.env.local` has `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Backend server restarted
- [ ] Frontend server restarted
- [ ] Browser cache cleared

---

## 📞 NEED HELP?

### Check Backend Logs

The backend now has detailed logging. Look for:

```
🔐 Google OAuth Configuration:
  CLIENT_ID: 336417139932-cofv...
  CLIENT_SECRET: GOCSPX-...
  REDIRECT_URI: http://localhost:3002/api/auth/google/callback
```

If you see `MISSING!` for any value, that's your problem!

### Check Frontend Console

Look for:

- Network tab: Check if POST to `/api/auth/google` is being made
- Console: Look for Google GSI errors
- Application tab: Check if `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is loaded

---

## 🎉 SUCCESS INDICATORS

You'll know it's working when:

1. ✅ No 404 errors on `/api/auth/google`
2. ✅ No "origin not allowed" errors
3. ✅ Google account picker popup appears
4. ✅ After selecting account, redirects to home page
5. ✅ Tokens are stored in localStorage
6. ✅ User is logged in

---

**Backend changes are already applied. Now you need to configure Google Cloud Console!**
