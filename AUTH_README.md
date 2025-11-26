# 🔐 Authentication System - Quick Start

## ✅ What's Implemented

Your authentication system now supports:

1. **Email & Password Registration** - Create accounts with email/password
2. **Email & Password Login** - Login with credentials
3. **Google OAuth** - Sign in with Google
4. **MongoDB Storage** - All user data stored in MongoDB
5. **Welcome Emails** - Automatic welcome emails via Resend
6. **JWT Authentication** - Secure token-based auth
7. **Proper Error Messages** - Clear feedback for all errors
8. **Home Page Redirect** - Successful login redirects to home

## 🚀 Quick Test

### Start Backend Server

```powershell
cd mutual-funds-backend
npm run dev
```

### Run Authentication Test

```powershell
# Option 1: PowerShell quick test
.\test-auth-quick.ps1

# Option 2: Full Node.js test suite
node test-auth-complete.js
```

## 📝 API Endpoints

### Register New User

```bash
POST /api/auth/register
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "name": "John Doe"
}
```

### Login

```bash
POST /api/auth/login
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

### Google Sign-In

```bash
POST /api/auth/google
{
  "idToken": "google-id-token"
}
```

### Get Current User

```bash
GET /api/auth/me
Headers: Authorization: Bearer {accessToken}
```

## 📧 Email Configuration (Optional)

To enable welcome emails:

1. Sign up at [Resend.com](https://resend.com)
2. Get your API key
3. Add to `.env`:

```env
RESEND_API_KEY=re_your_key_here
FROM_EMAIL=noreply@mutualfunds.com
```

**Note**: System works without emails, they just won't be sent.

## 🎯 Success Response Example

```json
{
  "success": true,
  "message": "Registration successful! Welcome email sent.",
  "data": {
    "user": {
      "userId": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "authMethod": "email",
      "emailVerified": false,
      ...
    },
    "tokens": {
      "accessToken": "jwt-token",
      "refreshToken": "refresh-token",
      "expiresIn": 900
    }
  }
}
```

## ❌ Error Response Example

```json
{
  "success": false,
  "error": "User with this email already exists"
}
```

## 🔒 Security Features

- ✅ Bcrypt password hashing (12 rounds)
- ✅ JWT tokens (15min access, 7 days refresh)
- ✅ HTTP-only cookies for refresh tokens
- ✅ Email verification tracking
- ✅ Login history (last 50 logins)
- ✅ IP and User Agent logging
- ✅ Account linking (email + Google)

## 📖 Full Documentation

See [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md) for:

- Complete API reference
- Frontend integration examples
- Security best practices
- Troubleshooting guide
- Database schema details

## ✨ Features

| Feature                     | Status     |
| --------------------------- | ---------- |
| Email/Password Registration | ✅ Working |
| Email/Password Login        | ✅ Working |
| Google OAuth                | ✅ Working |
| MongoDB Storage             | ✅ Working |
| Welcome Emails              | ✅ Working |
| JWT Tokens                  | ✅ Working |
| Refresh Tokens              | ✅ Working |
| Error Handling              | ✅ Working |
| Account Linking             | ✅ Working |
| Login History               | ✅ Working |

## 🎉 You're All Set!

Your authentication system is fully operational and ready to use. Test it with the provided scripts and integrate it into your frontend!

---

For detailed documentation, see [AUTHENTICATION_GUIDE.md](./AUTHENTICATION_GUIDE.md)
