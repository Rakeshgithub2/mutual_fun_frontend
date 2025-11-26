# 📧 Email Feedback Setup Guide

## ✅ Current Status

Your feedback system is now configured to send emails to **rakeshd01042024@gmail.com**.

## 🔐 Gmail App Password Setup (REQUIRED)

To enable email sending, you need to create a Gmail App Password:

### Step 1: Enable 2-Factor Authentication

1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** if not already enabled

### Step 2: Create App Password

1. Visit https://myaccount.google.com/apppasswords
2. Sign in with your Google account (rakeshd01042024@gmail.com)
3. Select app: **Mail**
4. Select device: **Other (Custom name)** → Enter: "Mutual Funds Feedback"
5. Click **Generate**
6. Google will display a 16-character password (e.g., `abcd efgh ijkl mnop`)
7. **Copy this password** (without spaces)

### Step 3: Update Backend Configuration

1. Open: `mutual-funds-backend\.env`
2. Find the line: `EMAIL_PASSWORD=your-gmail-app-password-here`
3. Replace with your 16-character app password (no spaces):
   ```
   EMAIL_PASSWORD=abcdefghijklmnop
   ```
4. Save the file
5. Restart the backend server

## 🚀 How to Test

1. **Open your frontend**: http://localhost:5001
2. **Click the feedback button** (floating blue-purple circle in bottom-right)
3. **Type your test message**
4. **Click "Send Feedback"**
5. **Check rakeshd01042024@gmail.com inbox** - you should receive a beautifully formatted email!

## 📧 Email Features

When a user sends feedback, you'll receive an email with:

- ✅ User's email address (or "Anonymous" if not logged in)
- ✅ Timestamp of submission
- ✅ Full feedback message
- ✅ Professional HTML formatting with your brand colors
- ✅ Email hidden from users - they never see your email address

## 🔧 Troubleshooting

### "Authentication failed" error

- **Cause**: Wrong app password or 2FA not enabled
- **Solution**:
  1. Make sure 2-Factor Authentication is ON
  2. Generate a NEW app password
  3. Copy it correctly (no spaces)
  4. Update `.env` file
  5. Restart backend

### "Failed to send email" in console

- **Cause**: Gmail security blocking
- **Solution**:
  1. Use App Password (NOT your regular Gmail password)
  2. Make sure the email in `.env` matches the Google account

### Email not arriving

- **Check**: Spam/Junk folder
- **Check**: Backend terminal for "✅ Email sent successfully" message
- **Check**: Gmail account is rakeshd01042024@gmail.com

## 📁 Files Modified

### Backend Files:

1. **`mutual-funds-backend/src/routes/feedback.routes.ts`**

   - ✅ Added nodemailer email sending
   - ✅ HTML email template
   - ✅ Sends to rakeshd01042024@gmail.com

2. **`mutual-funds-backend/.env`**

   - ✅ Added EMAIL_USER=rakeshd01042024@gmail.com
   - ⚠️ Needs EMAIL_PASSWORD (Gmail App Password)

3. **`mutual-funds-backend/package.json`**
   - ✅ Added nodemailer dependency

## 🎯 Next Steps

1. **Create Gmail App Password** (see steps above)
2. **Update EMAIL_PASSWORD in `.env`**
3. **Restart backend server**
4. **Test the feedback button**
5. **Check your email inbox!**

## 💡 Production Notes

For production deployment:

- Consider using a professional email service (SendGrid, AWS SES, Mailgun)
- Store email credentials in environment variables
- Add rate limiting to prevent spam
- Store feedback in database for backup

## 📞 Support

If you encounter issues:

1. Check backend terminal for error messages
2. Verify Gmail App Password is correct
3. Ensure 2FA is enabled on Gmail account
4. Try generating a new App Password

---

**Remember**: Never commit your App Password to GitHub! It's already in `.gitignore`.
