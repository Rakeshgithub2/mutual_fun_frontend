# Auth Context Usage Guide

## Overview

The enhanced `auth-context.tsx` provides a complete authentication solution for your Next.js application with the following features:

- ✅ Email/password login
- ✅ Google OAuth login (with @react-oauth/google)
- ✅ JWT token storage in localStorage
- ✅ Loading and error state management
- ✅ Automatic redirect after login using sessionStorage
- ✅ Automatic token refresh
- ✅ Production-ready TypeScript types
- ✅ Comprehensive error handling and logging

## Setup

The `AuthProvider` is already wrapped in your `app/layout.tsx`:

```tsx
<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
  <TranslationProvider>
    <AuthProvider>
      <ProtectedRoute>{children}</ProtectedRoute>
      <Toaster />
    </AuthProvider>
  </TranslationProvider>
</GoogleOAuthProvider>
```

## Using the useAuth Hook

Import and use the `useAuth` hook in any component:

```tsx
import { useAuth } from '@/lib/auth-context';

function MyComponent() {
  const {
    user,
    isAuthenticated,
    isLoading,
    error,
    loginWithEmail,
    googleSignIn,
    logout,
    clearError,
  } = useAuth();

  // Your component logic
}
```

## Features

### 1. Email/Password Login

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { loginWithEmail, isLoading, error, clearError } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError(); // Clear any previous errors

    try {
      await loginWithEmail(email, password);
      // Redirect happens automatically via sessionStorage or to /dashboard
    } catch (err) {
      console.error('Login failed:', err);
      // Error is already set in context, displayed via error state
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error.message}</div>}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 2. Google OAuth Login

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';
import { GoogleLogin } from '@react-oauth/google';

export default function GoogleSignIn() {
  const { googleSignIn, error, clearError } = useAuth();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    clearError();

    try {
      if (credentialResponse.credential) {
        await googleSignIn(credentialResponse.credential);
        // Redirect happens automatically
      }
    } catch (err) {
      console.error('Google sign-in failed:', err);
    }
  };

  const handleGoogleError = () => {
    console.error('Google sign-in error');
  };

  return (
    <div>
      {error && <div className="alert alert-danger">{error.message}</div>}

      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={handleGoogleError}
        useOneTap
      />
    </div>
  );
}
```

### 3. Setting Redirect Path Before Login

If you want to redirect users to a specific page after they login, set it in sessionStorage:

```tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';

export default function ProtectedPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Save current path for redirect after login
      sessionStorage.setItem('redirectAfterLogin', window.location.pathname);
      router.push('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <div>Protected Content</div>;
}
```

### 4. User Registration

```tsx
'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [age, setAge] = useState<number>();
  const { register, isLoading, error, clearError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await register(name, email, password, age);
      // Redirect happens automatically
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger">{error.message}</div>}

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        required
      />

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />

      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />

      <input
        type="number"
        value={age || ''}
        onChange={(e) =>
          setAge(e.target.value ? Number(e.target.value) : undefined)
        }
        placeholder="Age (optional)"
      />

      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Creating account...' : 'Sign Up'}
      </button>
    </form>
  );
}
```

### 5. Logout

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function LogoutButton() {
  const { logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      // User is redirected to '/' automatically
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  if (!user) return null;

  return (
    <div>
      <span>Welcome, {user.name}!</span>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
```

### 6. Accessing User Information

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function UserProfile() {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      {user.picture && <img src={user.picture} alt="Profile" />}
      <p>Email Verified: {user.emailVerified ? 'Yes' : 'No'}</p>
    </div>
  );
}
```

### 7. Updating User Information

```tsx
'use client';

import { useAuth } from '@/lib/auth-context';

export default function UpdateProfile() {
  const { user, updateUser } = useAuth();

  const handleUpdateName = () => {
    updateUser({ name: 'New Name' });
  };

  return (
    <div>
      <p>Current name: {user?.name}</p>
      <button onClick={handleUpdateName}>Update Name</button>
    </div>
  );
}
```

### 8. Error Handling

```tsx
'use client';

import { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { toast } from '@/components/ui/use-toast';

export default function ErrorDisplay() {
  const { error, clearError } = useAuth();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Authentication Error',
        description: error.message,
        variant: 'destructive',
      });

      // Optionally clear error after displaying
      const timer = setTimeout(() => {
        clearError();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  return null;
}
```

## API Endpoints

The auth context expects the following backend endpoints:

### 1. Google OAuth: `POST /api/auth/google`

**Request:**

```json
{
  "token": "google_id_token_here"
}
```

**Response:**

```json
{
  "data": {
    "user": {
      "userId": "123",
      "email": "user@example.com",
      "name": "John Doe",
      "picture": "https://...",
      "emailVerified": true
    },
    "tokens": {
      "accessToken": "jwt_access_token",
      "refreshToken": "jwt_refresh_token"
    }
  }
}
```

### 2. Email Login: `POST /api/auth/login`

**Request:**

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:** Same as Google OAuth

### 3. Registration: `POST /api/auth/register`

**Request:**

```json
{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123",
  "age": 25
}
```

**Response:** Same as Google OAuth

### 4. Token Refresh: `POST /api/auth/refresh`

**Request:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "data": {
    "accessToken": "new_jwt_access_token"
  }
}
```

### 5. Logout: `POST /api/auth/logout`

**Headers:**

```
Authorization: Bearer access_token
```

**Request:**

```json
{
  "refreshToken": "jwt_refresh_token"
}
```

**Response:**

```json
{
  "message": "Logged out successfully"
}
```

## Environment Variables

Make sure you have the following environment variables set:

```env
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

## Token Storage

- **Access Token**: Stored in `localStorage` as `accessToken`
- **Refresh Token**: Stored in `localStorage` as `refreshToken`
- **User Data**: Stored in `localStorage` as `user`
- **Redirect Path**: Stored in `sessionStorage` as `redirectAfterLogin`

## Automatic Features

### 1. Automatic Token Refresh

Tokens are automatically refreshed every 14 minutes (access tokens expire in 15 minutes).

### 2. Automatic Redirect After Login

If `sessionStorage.redirectAfterLogin` exists, users are redirected there after login. Otherwise, they're redirected to `/dashboard`.

### 3. Session Restoration

User sessions are automatically restored from localStorage on page load.

### 4. Comprehensive Logging

All auth operations are logged to the console with `[Auth Context]` prefix for easy debugging.

## TypeScript Types

```typescript
interface User {
  userId: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  picture?: string;
  emailVerified?: boolean;
  preferences?: any;
  subscription?: any;
  kyc?: any;
}

interface AuthError {
  message: string;
  code?: string;
  details?: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: AuthError | null;
  login: (idToken: string) => Promise<void>;
  loginWithEmail: (email: string, password: string) => Promise<void>;
  register: (
    name: string,
    email: string,
    password: string,
    age?: number
  ) => Promise<void>;
  googleSignIn: (idToken: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
}
```

## Helper Functions

The auth context also exports helper functions:

### getAccessToken()

Automatically refreshes the token if it's about to expire:

```typescript
import { getAccessToken } from '@/lib/auth-context';

const token = await getAccessToken();
```

### fetchWithAuth()

Make authenticated API calls:

```typescript
import { fetchWithAuth } from '@/lib/auth-context';

const response = await fetchWithAuth('/api/protected-endpoint', {
  method: 'GET',
});
```

## Best Practices

1. **Always clear errors** before initiating new auth operations
2. **Use the error state** to display user-friendly error messages
3. **Check isLoading** before showing loading indicators
4. **Set redirectAfterLogin** in sessionStorage for better UX
5. **Use fetchWithAuth** for all authenticated API calls
6. **Monitor console logs** with `[Auth Context]` prefix for debugging
7. **Handle logout gracefully** by clearing all user data

## Troubleshooting

### User not redirected after login

- Check if `sessionStorage.redirectAfterLogin` is set correctly
- Verify the path exists in your app
- Check browser console for `[Auth Context]` logs

### Token refresh fails

- Verify backend `/api/auth/refresh` endpoint is working
- Check if refresh token is valid
- Ensure `NEXT_PUBLIC_API_URL` is correct

### Google OAuth not working

- Verify `NEXT_PUBLIC_GOOGLE_CLIENT_ID` is set
- Check Google Console credentials
- Ensure backend `/api/auth/google` endpoint accepts the token format

### Session not persisting

- Check if localStorage is available (not in incognito mode)
- Verify tokens are being saved correctly
- Check browser console for storage errors

## Security Notes

- **localStorage** is used for convenience but consider httpOnly cookies for production
- **Tokens expire** after 15 minutes and are automatically refreshed
- **Refresh tokens** should be rotated on the backend for better security
- **HTTPS** should be used in production to prevent token interception
- **CSP headers** should be configured to prevent XSS attacks
