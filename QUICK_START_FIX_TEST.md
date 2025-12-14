# 🚀 Quick Start - Testing the Fix

## Step 1: Verify Environment Variables

Check that [.env.local](.env.local) has:

```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_FRONTEND_URL=http://localhost:5001
```

**✅ This is already set up!**

---

## Step 2: Clear Next.js Cache

```powershell
# Stop your development server (Ctrl+C if running)

# Delete the .next folder
Remove-Item -Recurse -Force .next

# Or on bash/cmd:
# rm -rf .next
# rmdir /s /q .next
```

---

## Step 3: Start Backend (if not running)

```powershell
# Make sure backend is running on port 3002
# Navigate to backend folder and run:
npm run dev

# Or use the START_BACKEND.bat script
.\START_BACKEND.bat
```

**Verify backend is running:**

```powershell
# Should return health status
curl http://localhost:3002/health
```

---

## Step 4: Start Frontend

```powershell
# In the frontend/root folder:
npm run dev

# Or use the START_FRONTEND.bat script
.\START_FRONTEND.bat
```

**Frontend should start on port 5001**

---

## Step 5: Test API Connection

```powershell
# Run the test script
node test-api-connection.js
```

**Expected output:**

```
✅ Passed: 5
❌ Failed: 0
📈 Success Rate: 100.0%
🎉 All tests passed! API is working correctly.
```

---

## Step 6: Open Browser & Check Console

1. Open: http://localhost:5001
2. Press F12 (Developer Tools)
3. Go to Console tab

**Look for these logs:**

```
🌐 API Base URL configured: http://localhost:3002
🔍 Fetching funds with filters: {...}
🌐 API Request: http://localhost:3002/api/funds
✅ Funds fetched successfully: {...}
```

**Should NOT see:**

- ❌ "Failed to fetch"
- ❌ "CORS policy blocked"
- ❌ "404 Not Found"
- ❌ "Network Error"

---

## Step 7: Test Features

Try these features to ensure everything works:

### ✅ Home Page

- Market indices should load
- Fund cards should display with real data

### ✅ Search Page

- Search for "HDFC" or "SBI"
- Autocomplete should show suggestions
- Results should load

### ✅ Fund Details

- Click on any fund
- Details page should load with:
  - Real NAV
  - Holdings
  - Performance charts

### ✅ Authentication (if needed)

- Try login/register
- Google OAuth should work

### ✅ Feedback System

- Click feedback button
- Submit feedback
- Should see success message

---

## 🐛 If Something Goes Wrong

### Problem: "Failed to fetch"

**Solution:**

1. Check backend is running: `curl http://localhost:3002/health`
2. Verify `.env.local` has correct URL (no `/api` suffix)
3. Clear browser cache: Ctrl + Shift + R
4. Check browser console for specific error

### Problem: "CORS policy blocked"

**Solution:**

1. Restart backend server
2. Ensure backend CORS allows port 5001
3. Check backend logs for CORS errors

### Problem: "404 Not Found"

**Solution:**

1. Verify endpoint has `/api` prefix
2. Check backend routes are registered
3. Look at Network tab in DevTools

### Problem: Environment variable not loaded

**Solution:**

1. Restart Next.js dev server completely
2. Verify `.env.local` is in root directory (not in subdirectory)
3. Check no typos: `NEXT_PUBLIC_API_URL` (not `NEXT_PUBLIC_API_BASE_URL`)

---

## 📊 Expected Console Output (Success)

When everything works correctly, you should see:

```
🌐 API Base URL configured: http://localhost:3002
🔍 Fetching funds with filters: {limit: 100}
🌐 API Request: http://localhost:3002/api/funds?limit=100
📡 API Response: 200
✅ Funds fetched successfully: {success: true, data: Array(100), ...}
📊 Transformed funds: 100 funds ready to display
📝 Sample fund: HDFC Equity Fund
```

---

## 🎯 Quick Command Reference

```powershell
# Test API
node test-api-connection.js

# Clear cache
Remove-Item -Recurse -Force .next

# Check backend health
curl http://localhost:3002/health

# Test funds endpoint
curl "http://localhost:3002/api/funds?limit=2"

# Check environment
Write-Host $env:NEXT_PUBLIC_API_URL
```

---

## ✅ Success Indicators

You'll know it's working when:

- ✅ Test script shows 100% pass rate
- ✅ Console logs show "✅ Funds fetched successfully"
- ✅ No "Failed to fetch" errors
- ✅ Fund data loads on homepage
- ✅ Search/autocomplete works
- ✅ Market indices display correctly
- ✅ No CORS errors in console

---

## 📁 Files Modified

All changes are complete in these files:

1. ✅ [.env.local](.env.local) - API URL configuration
2. ✅ [lib/api-client.ts](lib/api-client.ts) - Centralized API client
3. ✅ [lib/hooks/use-funds.ts](lib/hooks/use-funds.ts) - Using apiClient
4. ✅ [lib/auth-context.tsx](lib/auth-context.tsx) - Auth endpoints fixed
5. ✅ [components/market-indices.tsx](components/market-indices.tsx) - Market data fixed
6. ✅ [components/FeedbackButton.tsx](components/FeedbackButton.tsx) - Feedback fixed
7. ✅ [app/admin/feedback/page.tsx](app/admin/feedback/page.tsx) - Admin feedback fixed
8. ✅ [test-api-connection.js](test-api-connection.js) - New test script

---

## 🎉 You're All Set!

The "Failed to fetch" error is now fixed. Just follow these steps to verify everything works.

**Happy coding! 🚀**
