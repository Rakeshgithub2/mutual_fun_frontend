# Test Credentials for MutualFunds.in

## Login Credentials

Use these credentials to test the authentication system:

### Admin Account

- **Email:** admin@mutualfunds.com
- **Password:** admin123
- **Role:** Administrator
- **Access:** Full system access

### Standard Test User

- **Email:** test@example.com
- **Password:** test123
- **Role:** Regular User
- **Access:** Standard features

### Demo User (Custom)

- **Email:** rakeshdrakeshd0635@gmail.com
- **Password:** 1234
- **Role:** Regular User
- **Access:** Standard features

## How to Seed Test Users

To create these test users in your database, run:

```bash
# Make sure MongoDB is running first
npm run seed
```

Or manually:

```bash
cd src
node -r ts-node/register db/seed-mongodb.ts
```

## Features Available After Login

✅ Portfolio Management  
✅ Goal Planning  
✅ Custom Watchlists  
✅ Fund Comparison  
✅ Overlap Analysis  
✅ Personalized Dashboard  
✅ Reports & Analytics  
✅ Alerts & Notifications

## Feedback System

Users can submit feedback through:

- **Feedback Page:** `/feedback`
- **Feedback Icon:** 💬 in the header
- **Settings Page:** Link in About section

## Support

For issues or questions:

- 📧 Email: support@mutualfunds.in
- 💬 Feedback: https://mutualfunds.in/feedback
- 📱 WhatsApp: +91 123-456-7890

---

**Note:** These are test credentials for development purposes only. Do not use in production.
