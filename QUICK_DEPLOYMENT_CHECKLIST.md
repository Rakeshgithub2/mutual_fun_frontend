# 🚀 Quick Deployment Checklist

## Your Vercel URLs (Fill these in)

```
Frontend URL: https://_________________.vercel.app
Backend URL:  https://_________________.vercel.app
```

---

## ✅ Step 1: Fix Backend CORS (Backend Repo)

### Update these 3 files with YOUR ACTUAL FRONTEND URL:

#### File 1: `mutual-funds-backend/vercel.json`

Find line 19 and change to your frontend URL:

```json
"value": "https://YOUR-FRONTEND-URL.vercel.app"
```

#### File 2: `mutual-funds-backend/api/index.ts`

Find line 7-8 and change:

```typescript
res.setHeader(
  "Access-Control-Allow-Origin",
  "https://YOUR-FRONTEND-URL.vercel.app"
);
```

#### File 3: `mutual-funds-backend/src/index.ts`

Find line ~33 and add your URL:

```typescript
const allowedOrigins = [
  "http://localhost:5001",
  "http://localhost:3000",
  "http://localhost:3001",
  "https://YOUR-FRONTEND-URL.vercel.app", // ADD THIS LINE
  process.env.FRONTEND_URL || "http://localhost:5001",
];
```

### Then commit and push:

```powershell
git add .
git commit -m "fix: Update CORS for production"
git push origin main
```

---

## ✅ Step 2: Set Backend Environment Variables

Go to **Vercel Dashboard → Backend Project → Settings → Environment Variables**

Add these (click Add for each):

```
NODE_ENV=production
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/mutual_funds_db?retryWrites=true&w=majority
JWT_SECRET=your-secret-key-minimum-32-characters-long
FRONTEND_URL=https://YOUR-FRONTEND-URL.vercel.app
```

**Remember to click "Save" after adding each variable!**

---

## ✅ Step 3: Set Frontend Environment Variables

Go to **Vercel Dashboard → Frontend Project → Settings → Environment Variables**

Add this (for Production environment):

```
NEXT_PUBLIC_API_URL=https://YOUR-BACKEND-URL.vercel.app/api
```

**IMPORTANT:**

- Select "Production" environment
- Click "Save"

---

## ✅ Step 4: Redeploy Frontend

After adding environment variables, you MUST redeploy:

**Option A: Redeploy in Vercel Dashboard**

1. Go to Deployments tab
2. Click latest deployment
3. Click three dots (...)
4. Click "Redeploy"
5. **UNCHECK** "Use existing Build Cache"
6. Click "Redeploy"

**Option B: Push a change to trigger redeploy**

```powershell
# In frontend repo
git commit --allow-empty -m "chore: Trigger redeploy with env vars"
git push origin main
```

---

## ✅ Step 5: Test Everything

### A. Test Backend

Open in browser or use curl:

```
https://YOUR-BACKEND-URL.vercel.app/health
```

Should see: `{"message":"Minimal test working!",..."env":{...}}`

### B. Test Frontend

1. Open: `https://YOUR-FRONTEND-URL.vercel.app`
2. Press F12 to open DevTools
3. Go to Console tab
4. Run this command:

```javascript
console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);
```

Should show your backend URL.

5. Check Network tab - look for API calls
6. If you see CORS errors, backend CORS is not updated

---

## 🐛 If Frontend Still Shows Error

### Check Browser Console (F12 → Console)

Look for errors and follow these fixes:

**Error: "CORS policy"**
→ Update backend CORS in the 3 files above

**Error: "Failed to fetch"**  
→ Check NEXT_PUBLIC_API_URL in Vercel env vars
→ Verify backend is deployed and working

**Error: "Hydration failed" or "Text content does not match"**
→ Already fixed in next.config.mjs (reactStrictMode: false)

**Error: "Application error: a client-side exception has occurred"**
→ Check browser console for actual error
→ Verify environment variables are set in Vercel
→ Redeploy with cache disabled

---

## 📝 Current File Status

### Frontend Files Updated:

- ✅ `next.config.mjs` - Fixed React strict mode, added eslint ignore
- ✅ `tsconfig.json` - Fixed JSX setting to "preserve"
- ✅ `.gitignore` - Updated to allow .env.production template

### Backend Files Updated:

- ✅ `api/index.ts` - Proper serverless handler
- ✅ `src/serverless.ts` - Fixed TypeScript types
- ✅ `vercel.json` - Proper routing configuration
- ✅ `.gitignore` - Updated to allow .env.production template

### Still Need to Update (with YOUR URLs):

- ⚠️ Backend CORS in 3 files (see Step 1 above)
- ⚠️ Vercel environment variables (see Steps 2 & 3 above)

---

## 🎯 Success Criteria

Your deployment is working when:

- [ ] Backend /health returns 200 OK
- [ ] Frontend loads without error page
- [ ] Browser console shows correct NEXT_PUBLIC_API_URL
- [ ] No CORS errors in browser console
- [ ] API calls from frontend work (check Network tab)

---

## 💡 Pro Tips

1. **Always redeploy frontend after adding environment variables**
2. **Test backend independently before testing frontend**
3. **Use browser DevTools (F12) to debug - Console and Network tabs**
4. **CORS URLs must match EXACTLY (no trailing slashes)**
5. **Environment variables only take effect after redeployment**

---

## 📞 Need Help?

1. Check browser console (F12 → Console tab)
2. Check Vercel function logs (Dashboard → Functions)
3. Verify all environment variables are set correctly
4. Make sure you redeployed after adding env vars

---

**Created:** November 18, 2025
**For:** Separate repository deployment on Vercel
