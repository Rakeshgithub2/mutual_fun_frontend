# 🚀 Frontend Google OAuth Update Guide

## 📋 Overview

The backend Google OAuth has been updated to use **token-based authentication**. This document contains all the changes needed in the frontend.

---

## 🔧 Required Changes

### 1. Update `lib/auth-context.tsx`

**Location:** Lines 90-112 (the `login` function)

**Change the request body from `idToken` to `token`:**

```tsx
const login = async (idToken: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Include cookies for refresh token
      body: JSON.stringify({ token: idToken }), // ⚠️ CHANGED: 'idToken' → 'token'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Authentication failed');
    }

    // Store tokens
    localStorage.setItem('accessToken', data.data.tokens.accessToken);
    localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
    localStorage.setItem('user', JSON.stringify(data.data.user));

    setUser(data.data.user);

    return data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};
```

---

### 2. Environment Variable

**File:** `.env.local` or `.env`

Ensure you have:

```bash
NEXT_PUBLIC_GOOGLE_CLIENT_ID=336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com
NEXT_PUBLIC_API_URL=https://mutualfun-backend.vercel.app
```

---

## ✅ What's Already Correct

Good news! These files are already using the correct endpoint and don't need changes:

- ✅ `components/google-signin.tsx` - Already sends to `/api/auth/google`
- ✅ `components/google-signin-redirect.tsx` - Already redirects to `/api/auth/google`
- ✅ Google Client ID is already set up correctly

---

## 🔍 Summary of Changes

| File                   | Line | Old                                 | New                                        |
| ---------------------- | ---- | ----------------------------------- | ------------------------------------------ |
| `lib/auth-context.tsx` | ~97  | `body: JSON.stringify({ idToken })` | `body: JSON.stringify({ token: idToken })` |

That's it! Only **ONE line** needs to change.

---

## 🧪 Testing

### Manual Test:

1. Click "Login with Google" button
2. Open Browser DevTools → Network tab
3. Look for: `POST https://mutualfun-backend.vercel.app/api/auth/google`
4. You should see:
   ```json
   {
     "success": true,
     "data": {
       "tokens": {
         "accessToken": "...",
         "refreshToken": "..."
       },
       "user": {
         "email": "...",
         "name": "...",
         ...
       }
     }
   }
   ```

### Expected localStorage:

- `accessToken` ✅
- `refreshToken` ✅
- `user` ✅

---

## 🐛 Troubleshooting

### Error: "Token missing"

**Cause:** Backend is receiving `{ idToken: "..." }` instead of `{ token: "..." }`
**Fix:** Update `auth-context.tsx` line 97 as shown above

### Error: "Invalid Google token"

**Cause:** Google Client ID mismatch between frontend and backend
**Fix:** Verify both are using: `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc.apps.googleusercontent.com`

### Error: "404 Not Found"

**Cause:** Wrong endpoint URL
**Fix:** Ensure you're using `/api/auth/google` (with `/api`)

### CORS Error

**Cause:** Backend CORS not configured
**Fix:** Backend is already configured - restart backend if needed

---

## 📝 Code to Copy-Paste

Here's the exact line to replace:

### Before (Line ~97):

```tsx
body: JSON.stringify({ idToken }),
```

### After:

```tsx
body: JSON.stringify({ token: idToken }),
```

---

## 🚀 Deployment Checklist

- [ ] Update `lib/auth-context.tsx` (change `idToken` to `token`)
- [ ] Verify `.env.local` has correct `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- [ ] Test login flow locally
- [ ] Commit and push changes
- [ ] Deploy to Vercel/production
- [ ] Test in production environment
- [ ] Verify localStorage contains tokens

---

## 📞 Support

If you encounter issues:

1. Check Network tab in DevTools
2. Look at Request Payload - should be `{ "token": "..." }`
3. Check Response - should be `200 OK` with tokens
4. Verify backend is deployed and running

---

## 🎯 Quick Fix (TL;DR)

**File:** `lib/auth-context.tsx`

**Change:** Line ~97

```tsx
// OLD ❌
body: JSON.stringify({ idToken }),

// NEW ✅
body: JSON.stringify({ token: idToken }),
```

**Test:** Login → DevTools Network → See `200 OK`

**Done!** 🎉
