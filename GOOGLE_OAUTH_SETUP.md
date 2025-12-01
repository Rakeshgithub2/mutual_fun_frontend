# Google OAuth Configuration Guide

## Current Configuration Status

**Client ID:** `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`

**Client Name:** `mutual_fund`

---

## Required Configuration in Google Cloud Console

### Step 1: Authorized JavaScript Origins

Add these URLs to allow Google Sign-In to work from your domains:

```
https://mutual-fun-frontend-osed.vercel.app
http://localhost:3000
http://localhost:5001
```

### Step 2: Authorized Redirect URIs

Add these URLs to allow OAuth callbacks:

```
https://mutual-fun-frontend-osed.vercel.app/auth/success
https://mutualfun-backend.vercel.app/api/auth/google/callback
http://localhost:3000/auth/success
http://localhost:9002/api/auth/google/callback
```

---

## How to Update in Google Cloud Console

1. Go to: https://console.cloud.google.com/apis/credentials
2. Select your project: **My First Project**
3. Click on your OAuth 2.0 Client ID: **mutual_fund**
4. Under **Authorized JavaScript origins**, click **+ ADD URI** and add:
   - `https://mutual-fun-frontend-osed.vercel.app`
   - `http://localhost:3000`
5. Under **Authorized redirect URIs**, click **+ ADD URI** and add:

   - `https://mutual-fun-frontend-osed.vercel.app/auth/success`
   - `https://mutualfun-backend.vercel.app/api/auth/google/callback`
   - `http://localhost:3000/auth/success`

6. Click **SAVE**

7. **Wait 5 minutes** for changes to take effect (as noted in the console)

---

## Testing the Configuration

After updating and waiting 5 minutes:

1. Visit: https://mutual-fun-frontend-osed.vercel.app
2. Click **"Login with Google"** button
3. Select your Google account
4. You should be redirected back to your site and logged in successfully

---

## OAuth Flow Explanation

```
User clicks "Login with Google"
        ↓
Google Sign-In popup opens (JavaScript origin check)
        ↓
User authenticates with Google
        ↓
Google returns credential token to frontend
        ↓
Frontend sends token to: https://mutualfun-backend.vercel.app/api/auth/google
        ↓
Backend validates token with Google API
        ↓
Backend creates JWT tokens (access + refresh)
        ↓
Backend redirects to: /auth/success?accessToken=...&refreshToken=...&user=...
        ↓
Frontend stores tokens in localStorage
        ↓
User is logged in ✅
```

---

## Troubleshooting

### Error: "redirect_uri_mismatch"

- **Cause:** The redirect URI is not in the authorized list
- **Solution:** Double-check all redirect URIs are added exactly as shown above

### Error: "origin_mismatch"

- **Cause:** The JavaScript origin is not authorized
- **Solution:** Add your Vercel URL to Authorized JavaScript origins

### Login button doesn't appear

- **Check:** Browser console for errors
- **Check:** Environment variable `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set correctly

### Token not saved after redirect

- **Check:** Browser console in `/auth/success` page
- **Check:** URL contains `accessToken` and `refreshToken` parameters

---

## Environment Variables Check

Make sure these are set in **Vercel** (not just local files):

### Frontend (.env.production)

```
NEXT_PUBLIC_API_URL=https://mutualfun-backend.vercel.app/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
```

### Backend (.env)

```
GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=[your-secret-from-google-console]
FRONTEND_URL=https://mutual-fun-frontend-osed.vercel.app
JWT_SECRET=84924af5b7baed0d91a04c0f79ad47cbc9ffc3a4c1c37ae8e1e35056ea42eb48
JWT_REFRESH_SECRET=3980022e14d6f4f5ecb8c9e583856f73d54a7da0c9652d9e00b7e1eef16bf0fe
```

---

## Current Status

- ✅ Google Client ID configured in code
- ✅ Frontend environment variables set
- ❌ **Google Cloud Console redirect URIs need updating** (see Step 2 above)
- ⚠️ Backend environment variables need verification in Vercel

---

**Next Action:** Update the redirect URIs in Google Cloud Console, then test the login flow.
