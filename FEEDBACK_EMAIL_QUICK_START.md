# 📧 Quick Setup: Feedback Email Notifications

## 🎯 What Was Added

✅ **Automatic email notifications** when users submit feedback  
✅ **Sends to:** rakeshd01042024@gmail.com  
✅ **Includes:** Feedback type, rating, user info, message, timestamp  
✅ **Beautiful HTML template** with professional formatting

---

## ⚡ Quick Start (3 Steps)

### 1️⃣ Install Dependencies

```powershell
pnpm install
```

This installs:

- `resend` - Email delivery service
- `handlebars` - Email templating

### 2️⃣ Get Resend API Key

1. Go to: **https://resend.com**
2. Sign up (free account)
3. Create API key: **https://resend.com/api-keys**
4. Copy the key (starts with `re_`)

### 3️⃣ Update .env File

Add your Resend API key to `.env`:

```env
RESEND_API_KEY=re_your_api_key_here
ADMIN_EMAIL=rakeshd01042024@gmail.com
FROM_EMAIL=noreply@mutualfunds.in
```

---

## 🧪 Test It

### Option 1: Via Frontend

1. Open: http://localhost:5001
2. Click feedback button
3. Submit feedback
4. Check email: rakeshd01042024@gmail.com

### Option 2: Via Test Script

```powershell
node test-feedback-email.js
```

This sends 5 test feedbacks and shows results.

### Option 3: Via API

```powershell
$body = @{
    feedbackType = "general"
    rating = 5
    name = "Test User"
    email = "test@example.com"
    message = "Test feedback message"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3002/api/feedback" `
  -Method POST `
  -Body $body `
  -ContentType "application/json"
```

---

## 📧 What You'll Receive

**Subject:** `💬 New Feedback: General Feedback - ⭐⭐⭐⭐⭐`

**Email includes:**

- 📋 Feedback type (Bug/Feature/General)
- ⭐ Star rating
- 👤 User name
- 📧 User email (with reply-to)
- 💬 Full message
- 🕐 Timestamp (IST timezone)

---

## ✅ Backend Logs to Verify

Look for these in your backend console:

```
📧 Sending feedback notification email...
✅ Feedback email notification sent successfully
```

---

## 🔧 Troubleshooting

### Email not received?

1. Check spam folder
2. Verify `RESEND_API_KEY` in `.env`
3. Check backend logs for errors
4. Restart backend server

### Backend error?

```powershell
# Restart backend
npm run dev
# or
node src/server.js
```

---

## 📝 Files Modified

1. ✨ **New:** `src/services/feedbackEmailService.ts` - Email service
2. 🔄 **Updated:** `src/routes/feedback.ts` - Added email sending
3. 🔧 **Updated:** `.env` - Added email config
4. 📦 **Updated:** `package.json` - Added dependencies

---

## 🌐 For Production

Add these to **Vercel Environment Variables**:

```
RESEND_API_KEY=re_your_production_key
ADMIN_EMAIL=rakeshd01042024@gmail.com
FROM_EMAIL=noreply@mutualfunds.in
```

Then redeploy!

---

## 📚 Full Documentation

See: [FEEDBACK_EMAIL_SETUP_GUIDE.md](./FEEDBACK_EMAIL_SETUP_GUIDE.md)

---

**That's it! You're all set! 🎉**

Submit feedback → Check email at rakeshd01042024@gmail.com
