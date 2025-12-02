# 🚀 Quick Start Guide - Authentication System

## Start Using the Authentication System in 3 Steps

### Step 1: Start the Backend Server

Open a terminal and run:

```bash
# Make sure backend is running on port 3002
node server.js
```

or if using the backend start script:

```bash
START_BACKEND.bat
```

**Expected Output:**

```
✅ Backend server running on http://localhost:3002
```

---

### Step 2: Start the Frontend Server

Open a **new terminal** and run:

```bash
npm run dev
```

or use:

```bash
START_FRONTEND.bat
```

**Expected Output:**

```
✅ Frontend ready on http://localhost:5001
```

---

### Step 3: Test the Authentication

Open your browser and visit:

#### **Register a New User**

1. Go to: http://localhost:5001/auth/register
2. Fill in the form:
   - **Name:** Your Name
   - **Email:** your@email.com
   - **Password:** password123 (min 8 characters)
   - **Confirm Password:** password123
3. Click "Create Account"
4. ✅ You'll be redirected to the dashboard!

#### **Or Login with Existing Account**

1. Go to: http://localhost:5001/auth/login
2. Enter your credentials
3. Click "Sign In"
4. ✅ Redirected to dashboard!

#### **Or Use Google Sign-In**

1. On login or register page
2. Click "Sign in with Google"
3. Choose your Google account
4. ✅ Instant authentication!

---

## 📍 Key URLs

| Page            | URL                                 | Description                           |
| --------------- | ----------------------------------- | ------------------------------------- |
| **Login**       | http://localhost:5001/auth/login    | Sign in with email/password or Google |
| **Register**    | http://localhost:5001/auth/register | Create new account                    |
| **Dashboard**   | http://localhost:5001/dashboard     | Protected page (requires login)       |
| **Backend API** | http://localhost:3002/api           | Backend endpoints                     |

---

## 🧪 Quick Tests

### Test 1: Registration Flow

```bash
1. Visit /auth/register
2. Fill form with valid data
3. Submit
4. ✅ Should redirect to /dashboard
5. ✅ Should see your name and email
```

### Test 2: Login Flow

```bash
1. Logout from dashboard
2. Visit /auth/login
3. Enter credentials
4. Submit
5. ✅ Should redirect to /dashboard
```

### Test 3: Protected Routes

```bash
1. Logout completely
2. Try to visit /dashboard directly
3. ✅ Should redirect to /auth/login
```

### Test 4: Google Sign-In

```bash
1. Visit /auth/login
2. Click "Sign in with Google"
3. Select Google account
4. ✅ Should redirect to /dashboard
```

### Test 5: Token Persistence

```bash
1. Login to dashboard
2. Close browser
3. Open browser again
4. Visit /dashboard
5. ✅ Should still be logged in
```

---

## 🛠️ Troubleshooting

### Problem: "Cannot connect to backend"

**Solution:**

- Check if backend is running on port 3002
- Run: `curl http://localhost:3002/api/health`
- Should return: `{"status":"ok"}`

### Problem: "Google Sign-In not working"

**Solution:**

- Check `.env` file has `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
- Verify Google OAuth is configured for `http://localhost:5001`
- Check browser console for errors

### Problem: "Token expired"

**Solution:**

- This is normal behavior
- Tokens auto-refresh every 14 minutes
- If refresh fails, you'll be redirected to login
- Just login again

### Problem: "Environment variables not loading"

**Solution:**

- Restart the dev server: `npm run dev`
- Next.js needs restart to load new env vars
- Check `.env` file has `NEXT_PUBLIC_` prefix

---

## 📦 What's Included

✅ **Complete Authentication System**

- Email/Password registration
- Email/Password login
- Google OAuth Sign-In
- JWT token management
- Automatic token refresh
- Protected routes
- User dashboard

✅ **Security Features**

- Password validation (min 8 chars)
- Email format validation
- JWT token encryption
- Automatic token refresh
- Secure logout

✅ **User Experience**

- Beautiful UI with Tailwind CSS
- Loading states
- Error handling
- Responsive design
- Form validation feedback

---

## 🎯 Features You Can Use

### From Any Component:

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (isAuthenticated) {
    return <div>Hello, {user?.name}!</div>;
  }

  return <div>Please login</div>;
}
```

### Make Authenticated API Calls:

```tsx
import apiClient from '@/lib/apiClient';

// Automatically includes JWT token
const response = await apiClient.get('/user/profile');
```

### Protect Any Route:

```tsx
import ProtectedRoute from '@/components/ProtectedRoute';

function PrivatePage() {
  return (
    <ProtectedRoute>
      <div>Only logged-in users see this</div>
    </ProtectedRoute>
  );
}
```

---

## 📚 Additional Resources

- **Full Documentation:** `AUTH_IMPLEMENTATION_COMPLETE.md`
- **Test Script:** Run `node test-auth-frontend.js`
- **Backend API:** Check backend documentation

---

## 🎉 You're All Set!

Your authentication system is fully configured and ready to use.

**Need Help?**

- Check the console for error messages
- Verify backend is running on port 3002
- Ensure all environment variables are set
- Review the full documentation in `AUTH_IMPLEMENTATION_COMPLETE.md`

**Happy Coding!** 🚀
