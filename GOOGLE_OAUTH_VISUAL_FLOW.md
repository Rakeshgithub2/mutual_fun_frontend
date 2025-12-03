# 🎯 Google OAuth Visual Flow

## Authentication Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER JOURNEY                              │
└─────────────────────────────────────────────────────────────────┘

1. USER VISITS LOGIN PAGE
   ┌──────────────────────────────────┐
   │   http://localhost:5001/auth/login  │
   │                                  │
   │   ┌──────────────────────┐      │
   │   │  Welcome Back        │      │
   │   │  Sign in to account  │      │
   │   │                      │      │
   │   │  [Email Input]       │      │
   │   │  [Password Input]    │      │
   │   │  [Sign In Button]    │      │
   │   │                      │      │
   │   │  Or continue with    │      │
   │   │  [G Sign in Google]  │ ← CLICK HERE
   │   └──────────────────────┘      │
   └──────────────────────────────────┘
                  ↓

2. GOOGLE POPUP OPENS
   ┌─────────────────────────────┐
   │  Choose an account          │
   │                             │
   │  ● user@gmail.com          │ ← SELECT ACCOUNT
   │    John Doe                 │
   │                             │
   │  ○ another@gmail.com       │
   │    Jane Smith               │
   └─────────────────────────────┘
                  ↓

3. GOOGLE RETURNS TOKEN
   ┌──────────────────────────────────┐
   │  ID Token (JWT)                  │
   │  eyJhbGciOiJSUzI1NiIsImtpZCI...  │
   └──────────────────────────────────┘
                  ↓

4. FRONTEND SENDS TO BACKEND
   ┌─────────────────────────────────────────────┐
   │  POST http://localhost:3002/api/auth/google │
   │  Body: { idToken: "eyJhbG..." }            │
   └─────────────────────────────────────────────┘
                  ↓

5. BACKEND VERIFIES WITH GOOGLE
   ┌────────────────────────────────────┐
   │  Backend → Google OAuth2 API       │
   │  "Is this token valid?"            │
   │  Google: "Yes! Here's user info"   │
   └────────────────────────────────────┘
                  ↓

6. BACKEND SAVES TO MONGODB
   ┌─────────────────────────────────────┐
   │  MongoDB: mutual_funds_db           │
   │  Collection: users                  │
   │  {                                  │
   │    userId: "550e8400-e29b...",     │
   │    googleId: "1028374659...",      │
   │    email: "user@gmail.com",        │
   │    name: "John Doe",               │
   │    ...                             │
   │  }                                  │
   └─────────────────────────────────────┘
                  ↓

7. BACKEND GENERATES JWT TOKENS
   ┌──────────────────────────────────┐
   │  Access Token (15 min expiry)    │
   │  eyJhbGciOiJIUzI1NiIsInR5cCI...  │
   │                                  │
   │  Refresh Token (7 day expiry)    │
   │  eyJhbGciOiJIUzI1NiIsInR5cCI...  │
   └──────────────────────────────────┘
                  ↓

8. BACKEND RESPONDS TO FRONTEND
   ┌────────────────────────────────────┐
   │  Response 200 OK                   │
   │  {                                 │
   │    success: true,                  │
   │    data: {                         │
   │      user: {...},                  │
   │      tokens: {                     │
   │        accessToken: "eyJ...",     │
   │        refreshToken: "eyJ..."     │
   │      }                             │
   │    }                               │
   │  }                                 │
   └────────────────────────────────────┘
                  ↓

9. FRONTEND STORES IN LOCALSTORAGE
   ┌─────────────────────────────────────┐
   │  localStorage.setItem(              │
   │    'accessToken',                   │
   │    'eyJhbGciOiJIUzI1NiI...'        │
   │  )                                  │
   │  localStorage.setItem(              │
   │    'refreshToken',                  │
   │    'eyJhbGciOiJIUzI1NiI...'        │
   │  )                                  │
   │  localStorage.setItem(              │
   │    'user',                          │
   │    '{"userId":"550e...","name"...}' │
   │  )                                  │
   └─────────────────────────────────────┘
                  ↓

10. ✅ REDIRECT TO HOME PAGE
   ┌──────────────────────────────────────┐
   │  router.push('/')                    │
   │  window.location.reload()            │
   └──────────────────────────────────────┘
                  ↓

11. 🎉 USER ON HOME PAGE (LOGGED IN!)
   ┌──────────────────────────────────┐
   │   http://localhost:5001/         │
   │                                  │
   │   Welcome, John Doe! 👋          │
   │                                  │
   │   [User Avatar]  [Logout]        │
   │                                  │
   │   Your Dashboard                 │
   │   Portfolio, News, Funds...      │
   └──────────────────────────────────┘
```

---

## Code Flow

### 1. User Clicks Google Button

**File:** `app/auth/login/page.tsx`

```typescript
<GoogleLogin
  onSuccess={handleGoogleSuccess} // → Triggers handler
  onError={handleGoogleError}
/>
```

### 2. Handler Receives Token

**File:** `app/auth/login/page.tsx`

```typescript
const handleGoogleSuccess = async (credentialResponse) => {
  // credentialResponse.credential = "eyJhbGciOiJSUzI1NiI..."
  await googleSignIn(credentialResponse.credential);
  router.push('/'); // ← REDIRECT TO HOME
  window.location.reload();
};
```

### 3. Auth Context Sends to Backend

**File:** `lib/auth-context.tsx`

```typescript
const googleSignIn = async (idToken: string) => {
  return login(idToken); // Calls login function
};

const login = async (idToken: string) => {
  const response = await fetch(`${API_URL}/auth/google`, {
    method: 'POST',
    body: JSON.stringify({ idToken }),
  });

  const data = await response.json();

  // Store everything
  localStorage.setItem('accessToken', data.data.tokens.accessToken);
  localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
  localStorage.setItem('user', JSON.stringify(data.data.user));

  setUser(data.data.user); // Update context
};
```

### 4. Backend Processes (Already Done)

**Backend:** `e:\mutual-funds-backend\src\controllers\auth.controller.ts`

```typescript
// 1. Verify Google token
const payload = await verifyGoogleToken(idToken);

// 2. Create/update user in MongoDB
const user = await User.findOneAndUpdate(
  { googleId: payload.sub },
  { ...userData },
  { upsert: true, new: true }
);

// 3. Generate JWT tokens
const accessToken = generateAccessToken(user);
const refreshToken = generateRefreshToken(user);

// 4. Return response
res.json({
  success: true,
  data: { user, tokens: { accessToken, refreshToken } },
});
```

---

## File Structure

```
c:\mutual fund\
├── app/
│   ├── layout.tsx                    ← GoogleOAuthProvider wrapper
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx             ← Login page with Google button
│   │   └── register/
│   │       └── page.tsx             ← Register page
│   └── page.tsx                     ← Home page (redirect target)
│
├── lib/
│   └── auth-context.tsx             ← Auth logic, login, redirect
│
├── components/
│   └── google-signin.tsx            ← Reusable Google button
│
├── .env.local                       ← Environment variables
└── package.json                     ← Dependencies

e:\mutual-funds-backend\
└── src/
    ├── controllers/
    │   └── auth.controller.ts       ← Google auth endpoint
    ├── models/
    │   └── user.model.ts           ← User schema
    └── routes/
        └── auth.routes.ts          ← POST /api/auth/google
```

---

## Environment Variables

### Frontend (`.env.local`)

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc...
NEXT_PUBLIC_API_URL=http://localhost:3002/api
```

### Backend (`.env`)

```env
GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc...
GOOGLE_CLIENT_SECRET=GOCSPX-...
DATABASE_URL=mongodb+srv://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

---

## Testing Checklist

- [ ] Backend running on port 3002
- [ ] Frontend running on port 5001
- [ ] Visit http://localhost:5001/auth/login
- [ ] Click "Sign in with Google"
- [ ] Select Google account
- [ ] Check console: No errors
- [ ] Check redirect: Now on http://localhost:5001/
- [ ] Check localStorage: Has accessToken, refreshToken, user
- [ ] Check MongoDB: User document exists
- [ ] Test logout: Clears tokens and redirects

---

## Debug Commands

### Check Backend

```bash
curl http://localhost:3002/health
```

### Check Frontend API Connection

```javascript
// In browser console
fetch('http://localhost:3002/health')
  .then((r) => r.text())
  .then(console.log);
```

### Check LocalStorage

```javascript
// In browser console
console.log('Access Token:', localStorage.getItem('accessToken'));
console.log('User:', JSON.parse(localStorage.getItem('user')));
```

### Check MongoDB

```bash
mongosh "mongodb+srv://rakeshd01042024_db_user:Rakesh1234@mutualfunds.l7zeno9.mongodb.net/"
use mutual_funds_db
db.users.find({}, {name: 1, email: 1, lastLogin: 1})
```

---

**🎉 Complete authentication flow with redirect to home page!**
