# 📧 Feedback Email Setup Guide

## Current Issue

The feedback button shows a 500 error because Gmail App Password is not configured.

## ✅ Solution (5 Minutes Setup)

### Step 1: Create Gmail App Password

1. **Open Google Account Security**:

   - Visit: https://myaccount.google.com/apppasswords
   - Sign in with: `rakeshd01042024@gmail.com`

2. **Create App Password**:

   - Click **"Create"** or **"Generate App Password"**
   - Select App: **"Mail"**
   - Select Device: **"Other (Custom name)"**
   - Enter name: **"Mutual Funds Platform"**
   - Click **"Generate"**

3. **Copy the Password**:
   - Google shows a **16-character password** (e.g., `abcd efgh ijkl mnop`)
   - **IMPORTANT**: Copy this password immediately!
   - Remove all spaces: `abcdefghijklmnop`
   - You won't be able to see it again

### Step 2: Update Backend Configuration

1. **Open file**: `mutual-funds-backend\.env`

2. **Find this line**:

   ```env
   EMAIL_PASSWORD=your-gmail-app-password-here
   ```

3. **Replace with your App Password**:
   ```env
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
   _(Use your actual 16-character password)_

### Step 3: Restart Backend Server

1. **Stop the current backend** (if running):

   - Press `Ctrl+C` in the backend terminal

2. **Restart backend**:

   ```bash
   cd mutual-funds-backend
   npm run dev
   ```

3. **Verify**: Look for these lines in terminal:
   ```
   ✅ Server is running on http://localhost:3002
   ✅ MongoDB connected successfully
   ```

### Step 4: Test Feedback Button

1. **Open your app**: http://localhost:5001
2. **Click the feedback button** (purple floating button at bottom-right)
3. **Enter test message**: "Testing feedback system"
4. **Click "Send Feedback"**
5. **Expected**: "Thank You!" success message
6. **Check email**: rakeshd01042024@gmail.com inbox

---

## 📋 Current Configuration

- **Feedback Email Goes To**: rakeshd01042024@gmail.com
- **Backend Server**: http://localhost:3002
- **Frontend App**: http://localhost:5001
- **Email Service**: Gmail via Nodemailer

---

## 🔧 Temporary Fix (While Setting Up)

The system now works even without email configured:

- ✅ Feedback is logged to backend console
- ✅ Success message shows to user
- ⚠️ Warning: "Email notifications not configured"
- 📧 Emails will be sent once you add the App Password

---

## ❓ Troubleshooting

### "Invalid login" or "Authentication failed"

- **Cause**: Wrong App Password or spaces in password
- **Fix**: Regenerate App Password and remove all spaces

### "Connection refused" or "ECONNREFUSED"

- **Cause**: Gmail blocking sign-in attempts
- **Fix**:
  1. Check 2-Step Verification is enabled
  2. Use App Password (not regular password)
  3. Check Gmail settings: https://myaccount.google.com/security

### Email not arriving

- **Check**: Backend terminal logs
- **Look for**: `✅ Email sent successfully`
- **If error**: Check spam folder or Gmail security settings

### Still getting 500 error

1. **Check backend is running**: http://localhost:3002
2. **Check backend logs** for specific error
3. **Verify `.env` file** has correct EMAIL_PASSWORD
4. **Restart backend** after changing .env

---

## 📝 Notes

- **Security**: App Passwords are safer than using your actual Gmail password
- **Revoke**: You can revoke the App Password anytime from Google Account settings
- **Limit**: Gmail allows 500 emails/day for free accounts
- **Alternative**: You can use other email services (Resend, SendGrid, etc.)

---

## 🎯 Expected Behavior (After Setup)

1. **User clicks feedback button** → Opens dialog
2. **User types feedback** → Enters message
3. **User clicks "Send"** → Shows "Sending..."
4. **Backend receives request** → Logs to console
5. **Backend sends email** → To rakeshd01042024@gmail.com
6. **User sees success** → "Thank You!" message
7. **Email arrives** → Beautiful HTML email with feedback

---

## 📧 Email Template Preview

You'll receive emails that look like this:

```
Subject: 📬 New Feedback from test@example.com

┌─────────────────────────────────────┐
│  📬 New User Feedback                │
├─────────────────────────────────────┤
│  From: test@example.com             │
│  Date: Nov 23, 2025 10:30 AM        │
├─────────────────────────────────────┤
│  Feedback Message:                   │
│                                     │
│  This is a test feedback message.   │
│  The app is working great!          │
└─────────────────────────────────────┘
```

_(Actual email has beautiful HTML formatting with colors and gradients)_

---

## ✨ Quick Start (Copy-Paste Commands)

```bash
# 1. Go to backend directory
cd mutual-funds-backend

# 2. Edit .env file (use any text editor)
notepad .env
# OR
code .env

# 3. Update EMAIL_PASSWORD line with your App Password

# 4. Save and close

# 5. Restart backend
npm run dev

# 6. Test feedback at http://localhost:5001
```

---

**Need Help?** Check the backend terminal logs for detailed error messages.
