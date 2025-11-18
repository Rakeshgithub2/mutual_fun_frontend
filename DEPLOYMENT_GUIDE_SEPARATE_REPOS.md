# 🚀 Vercel Deployment Guide - Separate Repositories

## Current Setup

- ✅ Frontend: Separate repo deployed on Vercel
- ✅ Backend: Separate repo deployed on Vercel
- ❌ Issue: Frontend shows error when opening URL

---

## 🔍 Common Issues & Solutions

### Issue 1: Frontend Shows Error Page

**Causes:**

1. Missing environment variables in Vercel
2. CORS misconfiguration
3. React 19 hydration errors
4. Build errors ignored but causing runtime issues

---

## ✅ Step-by-Step Fix

### **1. Fix Backend First**

#### A. Update CORS in Backend Code

You need to update 3 files with your **actual frontend URL**:

**File 1: `mutual-funds-backend/vercel.json`** (line 19)

```json
{
  "key": "Access-Control-Allow-Origin",
  "value": "https://YOUR-ACTUAL-FRONTEND-URL.vercel.app"
}
```

**File 2: `mutual-funds-backend/api/index.ts`** (line 7-8)

```typescript
res.setHeader(
  "Access-Control-Allow-Origin",
  "https://YOUR-ACTUAL-FRONTEND-URL.vercel.app"
);
```

**File 3: `mutual-funds-backend/src/index.ts`** (line ~33)

```typescript
const allowedOrigins = [
  "http://localhost:5001",
  "https://YOUR-ACTUAL-FRONTEND-URL.vercel.app", // Add your frontend URL
];
```

#### B. Set Backend Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Backend Project
2. Settings → Environment Variables
3. Add these **REQUIRED** variables:

```env
NODE_ENV=production
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mutual_funds_db?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
FRONTEND_URL=https://YOUR-ACTUAL-FRONTEND-URL.vercel.app
```

Optional but recommended:

```env
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEWSDATA_API_KEY=your-api-key
```

#### C. Push Backend Changes

```powershell
# In backend repo
git add .
git commit -m "fix: Update CORS for production frontend"
git push origin main
```

Wait for Vercel to redeploy (auto-deploys on push).

#### D. Test Backend

```bash
# Test health endpoint
curl https://YOUR-BACKEND-URL.vercel.app/health

# Should return:
# {"message":"Minimal test working!","timestamp":"...","env":{...}}
```

---

### **2. Fix Frontend**

#### A. Set Frontend Environment Variables in Vercel

1. Go to Vercel Dashboard → Your Frontend Project
2. Settings → Environment Variables
3. Add these variables for **Production**:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
NODE_ENV=production
```

Optional:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id
```

⚠️ **IMPORTANT**: Click "Apply to Production" when adding variables!

#### B. Update Frontend .env.production (Optional - for reference)

Edit `mutual-funds-portal/.env.production`:

```env
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

#### C. Check for React 19 Issues

Your project uses React 19 which can have hydration issues. Add this to `next.config.mjs`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
  },
  reactStrictMode: false, // ← Change to false if having hydration errors
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
    buildActivityPosition: "bottom-right",
  },
  // Add experimental features for React 19
  experimental: {
    reactCompiler: false,
  },
};

export default nextConfig;
```

#### D. Push Frontend Changes

```powershell
# In frontend repo
git add .
git commit -m "fix: Configure production environment and React settings"
git push origin main
```

#### E. Force Redeploy in Vercel

After adding environment variables:

1. Go to Vercel Dashboard → Your Frontend Project
2. Deployments tab
3. Click on latest deployment → Click "..." → "Redeploy"
4. Check "Use existing Build Cache" = OFF
5. Click "Redeploy"

---

## 🧪 Testing & Debugging

### Step 1: Check Vercel Build Logs

1. Vercel Dashboard → Deployments → Click latest deployment
2. Check "Building" logs for errors
3. Common issues:
   - TypeScript errors (should be ignored with `ignoreBuildErrors: true`)
   - Missing dependencies
   - Build timeout

### Step 2: Check Runtime Logs

1. In Vercel Dashboard → Deployments → Click deployment
2. Go to "Functions" tab
3. Check for runtime errors

### Step 3: Check Browser Console

1. Open your frontend URL
2. Press F12 → Console tab
3. Look for errors:
   - **CORS errors** → Backend CORS not configured
   - **Failed to fetch** → Backend URL wrong or backend down
   - **Hydration errors** → Set `reactStrictMode: false`
   - **404 errors** → API route issues

### Step 4: Test API Connection

Open browser console on your frontend and run:

```javascript
fetch(process.env.NEXT_PUBLIC_API_URL + "/test")
  .then((r) => r.json())
  .then(console.log)
  .catch(console.error);
```

---

## 🐛 Common Error Messages & Fixes

### Error: "Application error: a client-side exception has occurred"

**Causes:**

- React 19 hydration mismatch
- Component error during render
- Missing environment variables causing undefined access

**Fix:**

1. Set `reactStrictMode: false` in next.config.mjs
2. Check browser console for actual error
3. Ensure all `NEXT_PUBLIC_*` variables are set in Vercel

### Error: "Failed to fetch" or Network Error

**Causes:**

- Backend URL wrong
- Backend not deployed
- CORS blocking request

**Fix:**

1. Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
2. Test backend health endpoint directly
3. Check backend CORS configuration

### Error: "Internal Server Error" (500)

**Causes:**

- Backend database connection failed
- Missing environment variables on backend
- Code error in backend

**Fix:**

1. Check backend function logs in Vercel
2. Verify `DATABASE_URL` is set correctly
3. Check MongoDB Atlas allows connections from 0.0.0.0/0

### Error: "This page could not be found" (404)

**Causes:**

- Routing issue in Next.js
- Missing page files

**Fix:**

1. Check if build succeeded
2. Verify all page files exist in `/app` directory
3. Clear build cache and redeploy

---

## 📋 Verification Checklist

Before considering deployment complete:

### Backend:

- [ ] Health endpoint returns 200: `https://backend-url.vercel.app/health`
- [ ] Environment variables set in Vercel (DATABASE_URL, JWT_SECRET, etc.)
- [ ] CORS configured with actual frontend URL
- [ ] MongoDB connection working (check function logs)
- [ ] No errors in Vercel function logs

### Frontend:

- [ ] Environment variables set in Vercel (NEXT_PUBLIC_API_URL)
- [ ] Build succeeds without blocking errors
- [ ] Frontend URL loads (even if showing error, page loads)
- [ ] Browser console shows environment variable correctly:
  ```javascript
  console.log(process.env.NEXT_PUBLIC_API_URL);
  ```
- [ ] No CORS errors in browser console
- [ ] API requests reach backend (check network tab)

---

## 🔄 Quick Commands for Fixes

### Update Backend CORS (in backend repo):

```powershell
# Replace YOUR-FRONTEND-URL with actual URL
$frontendUrl = "https://YOUR-FRONTEND-URL.vercel.app"

# Update vercel.json (manual edit recommended)
# Update api/index.ts (manual edit recommended)
# Update src/index.ts (manual edit recommended)

git add .
git commit -m "fix: Update CORS for production"
git push origin main
```

### Force Frontend Rebuild:

```powershell
# In frontend repo
git commit --allow-empty -m "chore: Force rebuild"
git push origin main
```

---

## 📞 Still Having Issues?

1. **Check this first:**

   - Open browser DevTools (F12)
   - Go to Console tab
   - Take screenshot of errors
   - Check Network tab to see which requests fail

2. **Verify environment variables:**

   ```javascript
   // Run in browser console on your frontend
   console.log({
     apiUrl: process.env.NEXT_PUBLIC_API_URL,
     nodeEnv: process.env.NODE_ENV,
   });
   ```

3. **Check Vercel logs:**

   - Backend: Dashboard → Functions → View logs
   - Frontend: Dashboard → Deployments → Click deployment → View function logs

4. **Common fixes that work 90% of the time:**
   - Redeploy with cache disabled
   - Ensure environment variables are set for "Production" environment
   - Verify CORS URLs match exactly (no trailing slashes)
   - Check MongoDB Atlas Network Access allows 0.0.0.0/0

---

## 🎯 Quick Reference - URLs to Update

When you have your actual Vercel URLs, update these locations:

**Backend Files (3 places):**

1. `vercel.json` - Line 19 (CORS header)
2. `api/index.ts` - Line 7-8 (CORS header)
3. `src/index.ts` - Line ~33 (allowedOrigins array)

**Frontend:**

1. Vercel Dashboard → Environment Variables → `NEXT_PUBLIC_API_URL`
2. (Optional) `.env.production` file

**Remember:** After updating CORS in backend, always redeploy!

---

**Last Updated:** November 18, 2025
**Status:** Ready for deployment with separate repositories
