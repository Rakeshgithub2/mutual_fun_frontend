# 🧪 Google OAuth Testing Guide

## Pre-Flight Checklist

Before testing, ensure:

- ✅ Node.js installed
- ✅ NPM packages installed in both projects
- ✅ MongoDB Atlas accessible
- ✅ `.env.local` file exists in frontend
- ✅ `.env` file exists in backend

---

## 🚀 Test Procedure

### Test 1: Environment Variables

**Run:**

```powershell
.\verify-google-oauth.ps1
```

**Expected Output:**

```
✅ Google Client ID configured
✅ Backend URL configured
```

---

### Test 2: Backend Health

**Start Backend:**

```powershell
cd e:\mutual-funds-backend
npm run dev
```

**Expected Console Output:**

```
🚀 Server running on port 3002
✅ MongoDB connected to mutual_funds_db
✅ CORS enabled for localhost:5001
```

**Test Health Endpoint:**

```powershell
curl http://localhost:3002/health
```

**Expected Response:**

```json
{ "status": "ok", "message": "Server is healthy" }
```

---

### Test 3: Frontend Startup

**Start Frontend:**

```powershell
cd "c:\mutual fund"
npm run dev
```

**Expected Console Output:**

```
▲ Next.js 14.x.x
- Local:        http://localhost:5001
✓ Ready in 2.3s
```

**Visit Home Page:**

```
http://localhost:5001
```

**Expected:** Page loads without errors

---

### Test 4: Login Page

**Visit:**

```
http://localhost:5001/auth/login
```

**Visual Check:**

- ✅ "Welcome Back" heading visible
- ✅ Email input field visible
- ✅ Password input field visible
- ✅ "Sign In" button visible
- ✅ "Or continue with" divider visible
- ✅ Google OAuth button visible

**Browser Console Check (F12):**

```
No errors should be present
```

---

### Test 5: Google OAuth Flow

**Step 1:** Click "Sign in with Google" button

**Expected:**

- Google popup opens
- Shows "Choose an account"
- Lists your Google accounts

**Step 2:** Select a Google account

**Expected:**

- Popup closes
- Loading indicator appears (if implemented)
- No console errors

**Step 3:** Wait for authentication

**Watch Network Tab (F12 → Network):**

```
1. POST http://localhost:3002/api/auth/google
   Status: 200 OK
   Response: { success: true, data: { user, tokens } }
```

**Step 4:** Check redirect

**Expected:**

- URL changes to: http://localhost:5001/
- Home page displays
- Page may reload once

---

### Test 6: Verify Authentication State

**Open Browser Console (F12):**

**Check Access Token:**

```javascript
localStorage.getItem('accessToken');
```

**Expected Output:**

```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lM..."
```

**Check Refresh Token:**

```javascript
localStorage.getItem('refreshToken');
```

**Expected Output:**

```
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1NTBlODQwMC1lM..."
```

**Check User Data:**

```javascript
JSON.parse(localStorage.getItem('user'));
```

**Expected Output:**

```javascript
{
  userId: "550e8400-e29b-41d4-a716-446655440000",
  email: "your-email@gmail.com",
  name: "Your Name",
  firstName: "Your",
  lastName: "Name",
  picture: "https://lh3.googleusercontent.com/...",
  emailVerified: true,
  authMethod: "google"
}
```

---

### Test 7: Verify MongoDB

**Connect to MongoDB:**

```powershell
mongosh "mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/"
```

**Switch to Database:**

```javascript
use mutual_funds_db
```

**Find Your User:**

```javascript
db.users.find({ email: 'your-email@gmail.com' }).pretty();
```

**Expected Output:**

```javascript
{
  _id: ObjectId("674f..."),
  userId: "550e8400-e29b-41d4-a716-446655440000",
  googleId: "102837465940283746594",
  email: "your-email@gmail.com",
  emailVerified: true,
  authMethod: "google",
  name: "Your Name",
  firstName: "Your",
  lastName: "Name",
  picture: "https://lh3.googleusercontent.com/...",
  preferences: { ... },
  kyc: { status: "pending" },
  subscription: { plan: "free" },
  refreshTokens: [ "..." ],
  lastLogin: ISODate("2025-12-03T..."),
  loginHistory: [ ... ],
  isActive: true,
  isBlocked: false,
  createdAt: ISODate("2025-12-03T..."),
  updatedAt: ISODate("2025-12-03T...")
}
```

---

### Test 8: Logout

**Method 1: Programmatic (Console)**

```javascript
// In browser console
localStorage.clear();
location.reload();
```

**Method 2: UI (If logout button exists)**

- Click logout button
- Should redirect to home or login page
- localStorage should be cleared

**Verify Logout:**

```javascript
console.log(localStorage.getItem('accessToken')); // null
console.log(localStorage.getItem('user')); // null
```

---

### Test 9: Re-login

**Repeat Test 5** to verify user can log in again

**Expected:**

- Login works
- Same user document updated in MongoDB (check `lastLogin` timestamp)
- New tokens generated

---

### Test 10: Token Refresh

**Wait 14+ minutes** OR **Manually test:**

**In Browser Console:**

```javascript
// Decode current token
const token = localStorage.getItem('accessToken');
const payload = JSON.parse(atob(token.split('.')[1]));
console.log('Expires at:', new Date(payload.exp * 1000));

// Calculate time remaining
const now = Date.now();
const expiresAt = payload.exp * 1000;
const minutesLeft = Math.floor((expiresAt - now) / 60000);
console.log('Minutes until expiry:', minutesLeft);
```

**After 14 minutes:**

- Check if new `accessToken` is in localStorage
- Check console for "Token refreshed" log (if implemented)

---

## 🐛 Troubleshooting Tests

### Test Fails: Backend Not Running

**Error:**

```
Failed to fetch
ERR_CONNECTION_REFUSED
```

**Solution:**

```powershell
cd e:\mutual-funds-backend
npm run dev
```

---

### Test Fails: CORS Error

**Error:**

```
Access to fetch at 'http://localhost:3002/api/auth/google'
from origin 'http://localhost:5001' has been blocked by CORS policy
```

**Solution:**
Check backend CORS configuration includes `localhost:5001`

---

### Test Fails: Google Popup Blocked

**Error:**

```
Popup blocked by browser
```

**Solution:**

- Allow popups for localhost:5001
- Or refresh page and try again

---

### Test Fails: Invalid Token

**Error:**

```
Google token verification failed
```

**Solutions:**

1. Check `NEXT_PUBLIC_GOOGLE_CLIENT_ID` matches backend `GOOGLE_CLIENT_ID`
2. Verify Client ID is from Google Console
3. Check backend has `GOOGLE_CLIENT_SECRET`

---

### Test Fails: MongoDB Connection

**Error:**

```
MongoDB connection failed
```

**Solution:**

1. Check MongoDB Atlas is accessible
2. Verify connection string in backend `.env`
3. Check network/firewall settings

---

### Test Fails: No Redirect

**Symptoms:**

- Login successful
- Tokens stored
- But stays on login page

**Solution:**
Check browser console for:

```javascript
// Should see this called:
router.push('/');
```

If not, check `app/auth/login/page.tsx` line ~59

---

### Test Fails: Tokens Not Stored

**Symptoms:**

- Login appears successful
- But localStorage is empty

**Check:**

```javascript
// In browser console after login
console.log('Response:', response);
console.log('Tokens:', response.data.data.tokens);
```

**Solution:**

- Check backend response structure matches frontend expectations
- Verify no JavaScript errors in console

---

## 📊 Test Results Template

```
=== GOOGLE OAUTH TEST RESULTS ===

Date: _______________
Tester: _______________

[✅/❌] Test 1: Environment Variables
[✅/❌] Test 2: Backend Health
[✅/❌] Test 3: Frontend Startup
[✅/❌] Test 4: Login Page Loads
[✅/❌] Test 5: Google OAuth Flow
[✅/❌] Test 6: Authentication State
[✅/❌] Test 7: MongoDB Verification
[✅/❌] Test 8: Logout
[✅/❌] Test 9: Re-login
[✅/❌] Test 10: Token Refresh

Overall: _______________

Notes:
_________________________
_________________________
_________________________
```

---

## 🎯 Success Criteria

**All tests pass when:**

✅ Backend starts without errors  
✅ Frontend starts without errors  
✅ Login page displays correctly  
✅ Google button opens popup  
✅ User can select account  
✅ **User redirected to home page**  
✅ Tokens stored in localStorage  
✅ User document created in MongoDB  
✅ Logout clears tokens  
✅ Re-login works successfully

---

## 🚀 Quick Test Command

**Run all automated tests:**

```powershell
.\verify-google-oauth.ps1
```

**Expected output:** All ✅ green checkmarks

---

## 📹 Expected User Journey

```
1. User visits /auth/login
   → Sees login form with Google button

2. User clicks "Sign in with Google"
   → Google popup opens

3. User selects Google account
   → Popup closes
   → Brief loading state

4. Authentication completes
   → URL changes to /
   → User sees home page
   → User is logged in

5. User can navigate app
   → All protected routes accessible
   → User data available in context

6. User clicks logout (optional)
   → Redirected to home/login
   → localStorage cleared
```

---

## ✅ Test Complete!

If all tests pass, your Google OAuth implementation is:

- ✅ Fully functional
- ✅ Production-ready
- ✅ Includes home page redirect
- ✅ Properly stores authentication state
- ✅ Integrates with MongoDB

**🎉 Ready to deploy!**
