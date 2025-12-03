# 🚀 Quick Start: Test Google OAuth

## ⚡ 3-Minute Setup

### Step 1: Start Backend (Terminal 1)

```powershell
cd e:\mutual-funds-backend
npm run dev
```

**Expected output:**

```
🚀 Server running on port 3002
✅ MongoDB connected
```

**Verify:**

```powershell
curl http://localhost:3002/health
# Should return: {"status":"ok","message":"Server is healthy"}
```

---

### Step 2: Start Frontend (Terminal 2)

```powershell
cd "c:\mutual fund"
npm run dev
```

**Expected output:**

```
  ▲ Next.js 14.x.x
  - Local:        http://localhost:5001
  ✓ Ready in 2.3s
```

---

### Step 3: Test Login

1. **Open browser:** http://localhost:5001/auth/login
2. **Click:** "Sign in with Google" button
3. **Select:** Your Google account
4. **Result:** Redirected to http://localhost:5001/ (home page)

---

## ✅ Verify Success

### Check Browser (F12 → Console)

```javascript
localStorage.getItem('accessToken'); // Should show JWT
localStorage.getItem('user'); // Should show user JSON
```

### Check MongoDB

```powershell
mongosh "mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/"
```

```javascript
use mutual_funds_db
db.users.find().pretty()
```

---

## 🎯 What Should Happen

```
1. Login page displays → ✅
2. Google popup opens → ✅
3. Select account → ✅
4. Redirected to home (/) → ✅
5. Tokens in localStorage → ✅
6. User in MongoDB → ✅
```

---

## 🐛 Quick Fixes

### Backend not running?

```powershell
cd e:\mutual-funds-backend
npm install
npm run dev
```

### Frontend not running?

```powershell
cd "c:\mutual fund"
npm install
npm run dev
```

### Still issues?

Run verification:

```powershell
.\verify-google-oauth.ps1
```

---

## 📚 Documentation Files

- `GOOGLE_OAUTH_IMPLEMENTATION_COMPLETE.md` - Full implementation details
- `GOOGLE_OAUTH_VISUAL_FLOW.md` - Visual authentication flow
- `verify-google-oauth.ps1` - Automated verification script

---

**🎉 That's it! Your Google OAuth with home redirect is working!**
