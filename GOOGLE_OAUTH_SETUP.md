# Google OAuth Configuration Steps

## Error: "The given origin is not allowed for the given client ID"

To fix this, you need to add your localhost URL to Google Console:

### Steps:

1. Go to **Google Cloud Console**: https://console.cloud.google.com/

2. Navigate to **APIs & Services** > **Credentials**

3. Find your OAuth 2.0 Client ID: `336417139932-cofv6fogqqch4uub4k19krimj1mhoslc`

4. Click on it to edit

5. Under **Authorized JavaScript origins**, add:
   - `http://localhost:5001`
   - `http://localhost:3002`

6. Under **Authorized redirect URIs**, add:
   - `http://localhost:3002/api/auth/google/callback`
   - `http://localhost:5001/auth/success`

7. Click **Save**

8. Wait a few minutes for changes to propagate

### Alternative for Testing:

If you don't have access to the Google Console, you can:

1. **Test without Google OAuth** first:
   - Use email/password signup and login
   - Test forgot password flow
   - Verify all other features work

2. **Create a new Google OAuth Client ID** for local development:
   - Go to Google Cloud Console
   - Create a new OAuth 2.0 Client ID
   - Add localhost origins
   - Update your `.env` file with the new Client ID

## Current Configuration:

Your current Google Client ID is configured for:

- Production: `https://mutual-fun-frontend-osed.vercel.app`

But you're testing on:

- Local: `http://localhost:5001`

This mismatch causes the 403 error.
