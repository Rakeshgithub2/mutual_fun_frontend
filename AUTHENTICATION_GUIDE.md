# Complete Authentication System - Setup & Usage Guide

## 🎯 Overview

The authentication system now supports **two methods**:

1. **Email & Password** - Traditional registration and login
2. **Google OAuth** - Sign in with Google account

Both methods:

- ✅ Store user data in MongoDB
- ✅ Send welcome emails upon registration
- ✅ Redirect to home page on successful login
- ✅ Show proper error messages on failure
- ✅ Use JWT tokens for authentication
- ✅ Support refresh tokens for extended sessions

## 📋 Prerequisites

1. **MongoDB** running on `mongodb://localhost:27017`
2. **Backend server** running on port `3000`
3. **Resend API Key** for sending emails (optional but recommended)
4. **Google OAuth credentials** (for Google sign-in)

## 🔧 Environment Configuration

Update your `.env` file in `mutual-funds-backend`:

```env
# Database
DATABASE_URL=mongodb://localhost:27017/mutual_funds_db

# JWT Secrets (generate strong secrets)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-this-in-production

# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Server
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:3001

# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@mutualfunds.com
```

### Getting Resend API Key (Optional - for emails)

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env` file

**Note**: If you don't configure Resend, the system will still work, but welcome emails won't be sent.

## 🚀 API Endpoints

### 1. Register with Email & Password

**Endpoint**: `POST /api/auth/register`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "name": "John Doe"
}
```

**Success Response** (201):

```json
{
  "success": true,
  "message": "Registration successful! Welcome email sent.",
  "data": {
    "user": {
      "userId": "uuid-here",
      "email": "user@example.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "emailVerified": false,
      "authMethod": "email",
      "preferences": {...},
      "subscription": {...},
      "kyc": {...}
    },
    "tokens": {
      "accessToken": "jwt-token-here",
      "refreshToken": "refresh-token-here",
      "expiresIn": 900
    }
  }
}
```

**Error Responses**:

- `400`: Missing fields or invalid email format
- `400`: User already exists
- `400`: Password too short (min 8 characters)

### 2. Login with Email & Password

**Endpoint**: `POST /api/auth/login`

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {...},
    "tokens": {
      "accessToken": "jwt-token-here",
      "refreshToken": "refresh-token-here",
      "expiresIn": 900
    }
  }
}
```

**Error Responses**:

- `401`: Invalid email or password
- `401`: Account created with Google (must use Google sign-in)

### 3. Google Sign-In

**Endpoint**: `POST /api/auth/google`

**Request Body**:

```json
{
  "idToken": "google-id-token-from-client"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Login successful", // or "Registration successful! Welcome email sent." for new users
  "data": {
    "user": {
      "userId": "uuid-here",
      "email": "user@gmail.com",
      "name": "John Doe",
      "firstName": "John",
      "lastName": "Doe",
      "picture": "https://google-profile-pic.jpg",
      "emailVerified": true,
      "authMethod": "google", // or "both" if linked with email account
      "preferences": {...},
      "subscription": {...},
      "kyc": {...}
    },
    "tokens": {
      "accessToken": "jwt-token-here",
      "refreshToken": "refresh-token-here",
      "expiresIn": 900
    }
  }
}
```

### 4. Get Current User Profile

**Endpoint**: `GET /api/auth/me`

**Headers**: `Authorization: Bearer {accessToken}`

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "userId": "uuid-here",
    "email": "user@example.com",
    "name": "John Doe",
    "firstName": "John",
    "lastName": "Doe",
    "picture": "...",
    "phone": "...",
    "preferences": {...},
    "subscription": {...},
    "kyc": {...},
    "createdAt": "2025-11-21T..."
  }
}
```

### 5. Refresh Access Token

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:

```json
{
  "refreshToken": "refresh-token-here"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "data": {
    "accessToken": "new-jwt-token-here",
    "expiresIn": 900
  }
}
```

### 6. Logout

**Endpoint**: `POST /api/auth/logout`

**Headers**: `Authorization: Bearer {accessToken}`

**Request Body**:

```json
{
  "refreshToken": "refresh-token-here"
}
```

**Success Response** (200):

```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## 📧 Welcome Email Features

When a user registers (via email or Google), they receive a professional welcome email with:

- **Personalized greeting** with their name
- **Authentication method** confirmation (email or Google)
- **Feature highlights**:
  - Browse thousands of mutual funds
  - Build and track investment portfolio
  - Compare fund performance
  - Set financial goals
  - Receive personalized alerts
- **Call-to-action button** linking to the platform
- **Professional email design** with gradient headers

## 🔐 Security Features

1. **Password Hashing**: Bcrypt with 12 rounds
2. **JWT Tokens**:
   - Access Token: 15 minutes expiry
   - Refresh Token: 7 days expiry
3. **HTTP-Only Cookies**: Refresh tokens stored securely
4. **Email Verification**: Tracked in user profile
5. **Account Linking**: Email accounts can be linked with Google
6. **Login History**: Track last 50 logins per user
7. **IP & User Agent Logging**: For security auditing

## 🧪 Testing

### Using the Test Script

```powershell
# Start backend server first
cd mutual-funds-backend
npm run dev

# In another terminal, run the test
cd ..
node test-auth-complete.js
```

The test script will:

1. ✅ Register a new user
2. ✅ Login with credentials
3. ✅ Get user profile
4. ✅ Refresh access token
5. ✅ Logout successfully
6. ✅ Test invalid login (should fail)
7. ✅ Test duplicate registration (should fail)

### Manual Testing with cURL

**Register**:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!",
    "name": "Test User"
  }'
```

**Login**:

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "SecurePass123!"
  }'
```

**Get Profile**:

```bash
curl -X GET http://localhost:3000/api/auth/me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🎨 Frontend Integration

### Email/Password Registration Form

```javascript
async function handleRegister(email, password, name) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, name }),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to home page
      window.location.href = '/home';
    } else {
      // Show error message
      alert(data.error);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('Registration failed. Please try again.');
  }
}
```

### Email/Password Login Form

```javascript
async function handleLogin(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to home page
      window.location.href = '/home';
    } else {
      // Show error message
      alert(data.error);
    }
  } catch (error) {
    console.error('Login error:', error);
    alert('Login failed. Please try again.');
  }
}
```

### Google Sign-In Integration

```javascript
// Using Google Sign-In SDK
async function handleGoogleSignIn(googleResponse) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: googleResponse.credential }),
    });

    const data = await response.json();

    if (data.success) {
      // Store tokens
      localStorage.setItem('accessToken', data.data.tokens.accessToken);
      localStorage.setItem('refreshToken', data.data.tokens.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.data.user));

      // Redirect to home page
      window.location.href = '/home';
    } else {
      // Show error message
      alert(data.error);
    }
  } catch (error) {
    console.error('Google sign-in error:', error);
    alert('Google sign-in failed. Please try again.');
  }
}
```

### Protected API Calls

```javascript
async function makeProtectedRequest(endpoint) {
  const accessToken = localStorage.getItem('accessToken');

  try {
    const response = await fetch(`http://localhost:3000/api${endpoint}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401 || response.status === 403) {
      // Token expired, try to refresh
      await refreshAccessToken();
      // Retry the request
      return makeProtectedRequest(endpoint);
    }

    return await response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
}

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken');

  const response = await fetch('http://localhost:3000/api/auth/refresh', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  if (data.success) {
    localStorage.setItem('accessToken', data.data.accessToken);
  } else {
    // Refresh failed, logout user
    localStorage.clear();
    window.location.href = '/login';
  }
}
```

## 📊 Database Schema

Users are stored in MongoDB with the following structure:

```javascript
{
  userId: "uuid",

  // Authentication
  googleId: "google-user-id", // Optional, only for Google users
  email: "user@example.com",
  password: "hashed-password", // Optional, only for email/password users
  emailVerified: false,
  authMethod: "email" | "google" | "both",

  // Profile
  name: "John Doe",
  firstName: "John",
  lastName: "Doe",
  picture: "https://...",
  phone: "+1234567890",

  // Preferences, Subscription, KYC...
  // Security
  refreshTokens: ["token1", "token2"],
  lastLogin: Date,
  loginHistory: [{ timestamp, ip, userAgent }],

  // Metadata
  isActive: true,
  isBlocked: false,
  createdAt: Date,
  updatedAt: Date
}
```

## 🔍 Troubleshooting

### Email Not Sending

1. Check if `RESEND_API_KEY` is configured
2. Verify the API key is valid
3. Check backend logs for email errors
4. System works without emails, but won't send welcome notifications

### Google Sign-In Not Working

1. Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set
2. Check Google OAuth consent screen configuration
3. Ensure redirect URIs are properly configured in Google Console

### MongoDB Connection Issues

1. Ensure MongoDB is running: `mongod --version`
2. Check connection string in `.env`
3. Verify no firewall blocking port 27017

### JWT Token Issues

1. Ensure `JWT_SECRET` and `JWT_REFRESH_SECRET` are set
2. Tokens expire after 15 minutes (access) and 7 days (refresh)
3. Use refresh endpoint to get new access tokens

## 🎯 Next Steps

1. **Frontend Integration**: Create login/register pages using the API
2. **Email Verification**: Implement email verification flow
3. **Password Reset**: Add forgot password functionality
4. **Two-Factor Authentication**: Add 2FA for enhanced security
5. **Social Login**: Add more providers (Facebook, GitHub, etc.)
6. **Rate Limiting**: Protect against brute force attacks

## 📝 Notes

- Access tokens expire in 15 minutes for security
- Refresh tokens last 7 days
- Passwords must be at least 8 characters
- Email validation uses regex pattern
- Google accounts automatically verify email
- Email and Google accounts can be linked
- Last 50 login attempts are tracked per user
- Password reset functionality can be added using the email service

## ✅ Features Completed

✅ Email/Password registration
✅ Email/Password login  
✅ Google OAuth integration
✅ MongoDB user storage
✅ Welcome email on registration
✅ JWT token authentication
✅ Refresh token mechanism
✅ Account linking (email + Google)
✅ Login history tracking
✅ Proper error messages
✅ Security best practices
✅ HTTP-only cookies for refresh tokens
✅ Password hashing with bcrypt
✅ Email verification tracking
✅ User profile management

---

**System Status**: ✅ **FULLY OPERATIONAL**

All authentication features are implemented and ready to use!
