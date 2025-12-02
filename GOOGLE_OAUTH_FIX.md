# 🔧 Google OAuth Connection Refused - Fix Guide

## ❌ Problem

After successful Google login, you're getting:

```
ERR_CONNECTION_REFUSED
localhost refused to connect
```

## ✅ Solution Applied

I've updated your `.env` file with the missing configuration. However, you need to complete one more step:

---

## 🔑 Step 1: Get Your Google Client Secret

1. **Go to Google Cloud Console:**

   - https://console.cloud.google.com/apis/credentials

2. **Find your OAuth 2.0 Client:**

   - Look for: `336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com`

3. **Click on the client name to edit**

4. **Copy the full Client Secret** (starts with `GOCSPX-`)

5. **Update `.env` file:**
   ```env
   GOOGLE_CLIENT_SECRET=GOCSPX-your-full-secret-here
   ```

---

## 📋 Your Updated `.env` Configuration

I've already added these lines to your `.env` file:

```env
FRONTEND_URL=http://localhost:5001

# Google OAuth (Backend)
GOOGLE_CLIENT_ID=336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-GJKt3_****Qj6  # ⚠️ REPLACE WITH YOUR FULL SECRET
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
```

**⚠️ IMPORTANT:** Replace `GOOGLE_CLIENT_SECRET` with your actual secret from Google Cloud Console!

---

## 🔄 Step 2: Verify Google Cloud Console Settings

In Google Cloud Console, make sure you have these **Authorized redirect URIs**:

```
http://localhost:3002/api/auth/google/callback
```

And these **Authorized JavaScript origins**:

```
http://localhost:5001
http://localhost:3002
```

---

## 🚀 Step 3: Restart Backend Server

After updating the `.env` file with the correct secret:

```powershell
# Stop the backend server (Ctrl+C)

# Start it again
npx tsx src/server-simple.ts
```

You should see in the console:

```
🔐 Google OAuth Configuration:
  CLIENT_ID: 336417139932-cofvfoqgq...
  CLIENT_SECRET: GOCSPX-GJKt...
  REDIRECT_URI: http://localhost:3002/api/auth/google/callback
  FRONTEND_URL: http://localhost:5001
```

---

## ✅ Step 4: Test Again

1. **Go to:** `http://localhost:5001/auth/login`
2. **Click:** "Sign in with Google"
3. **Select:** Your Gmail account
4. **Expected Result:**
   - ✅ Redirects to: `http://localhost:5001/auth/success?accessToken=...`
   - ✅ Then redirects to: `http://localhost:5001/` (home page)
   - ✅ Header shows your Google profile picture and name

---

## 🔍 Debugging

### Check Backend Logs:

When you click "Sign in with Google", you should see:

```
🔵 redirectToGoogle called
✅ Generated OAuth URL: https://accounts.google.com/o/oauth2/v2/auth...
🔵 Google OAuth Callback Started
✅ Authorization code received
✅ Tokens received from Google
✅ User upserted successfully: your-email@gmail.com
✅ Redirecting to frontend success page
```

### If You Still Get Connection Refused:

1. **Check if frontend is running:**

   ```powershell
   # In a new terminal
   npm run dev
   ```

   Should show: `> Local: http://localhost:5001`

2. **Check if backend is running:**

   ```powershell
   # In another terminal
   npx tsx src/server-simple.ts
   ```

   Should show: `🚀 Server started on port 3002`

3. **Check browser console (F12):**
   Look for any error messages

---

## 📝 Complete Flow (After Fix)

```
1. User clicks "Sign in with Google"
   ↓
2. Backend redirects to Google OAuth
   ↓
3. User selects Gmail account
   ↓
4. Google redirects to: http://localhost:3002/api/auth/google/callback?code=...
   ↓
5. Backend processes auth, creates user, generates tokens
   ↓
6. Backend redirects to: http://localhost:5001/auth/success?accessToken=...&refreshToken=...&user=...
   ↓
7. Frontend stores tokens in localStorage
   ↓
8. Frontend redirects to: http://localhost:5001/ (home page)
   ↓
9. ✅ User is logged in, avatar shows in header
```

---

## 🎯 Quick Fix Checklist

- [ ] Get full `GOOGLE_CLIENT_SECRET` from Google Cloud Console
- [ ] Update `.env` file with the secret
- [ ] Verify `FRONTEND_URL=http://localhost:5001` in `.env`
- [ ] Verify `GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback` in `.env`
- [ ] Restart backend server
- [ ] Test Google login again

---

## 🆘 Still Having Issues?

Run this command to check your environment:

```powershell
cd "c:\mutual fund"
Get-Content .env | Select-String "GOOGLE|FRONTEND"
```

Should show:

```
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com
FRONTEND_URL=http://localhost:5001
GOOGLE_CLIENT_ID=336417139932-cofvfoqgqch4uub4kt9krimj1mhosilc.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-your-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3002/api/auth/google/callback
```

---

**After completing these steps, Google OAuth will redirect to your home page successfully!** 🚀
