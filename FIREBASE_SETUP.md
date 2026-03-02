# Firebase Google Authentication Setup

This guide will help you set up Firebase Google Sign-In for the Tourism Management Website.

## Prerequisites

1. A Firebase project created at [firebase.google.com](https://firebase.google.com)
2. Google Sign-In enabled in your Firebase project
3. A service account with appropriate permissions

## Step 1: Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Click on **Project Settings** (gear icon)
4. Go to the **General** tab
5. Scroll down to find your Firebase config with these values:
   - `apiKey`
   - `authDomain`
   - `projectId`
   - `storageBucket`
   - `messagingSenderId`
   - `appId`

## Step 2: Enable Google Sign-In

1. In Firebase Console, go to **Authentication**
2. Click on **Sign-in method**
3. Enable **Google**
4. Save the changes

## Step 3: Get Service Account Key

1. In **Project Settings**, go to **Service Accounts** tab
2. Click **Generate New Private Key**
3. This downloads a JSON file - keep it safe!

## Step 4: Add Environment Variables

Add these variables to your Vercel project (or `.env.local` for local development):

### Public Variables (can be exposed to client)
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### Private Variable (must be kept secret)
```
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"..."}
```

For `FIREBASE_SERVICE_ACCOUNT_KEY`, paste the entire JSON content from the service account key file you downloaded.

## Step 5: Add Authorized Domains

1. In Firebase Console, go to **Authentication** → **Settings**
2. Under **Authorized domains**, add:
   - `localhost:3000` (for local development)
   - Your Vercel deployment domain (e.g., `yourdomain.vercel.app`)

## Troubleshooting

### "Invalid API Key" Error
- Check that all `NEXT_PUBLIC_FIREBASE_*` variables are set
- Verify the values match exactly what's in Firebase Console
- Restart your dev server after adding env vars

### "Auth/network-request-failed" Error
- Check your internet connection
- Verify the Firebase domain is whitelisted
- Check browser console for CORS errors

### "Auth/popup-closed-by-user" Error
- This is normal - the user closed the Google sign-in popup
- Your app handles this gracefully with error messaging

### Users not being created in database
- Verify `FIREBASE_SERVICE_ACCOUNT_KEY` is set correctly
- Check that database connection is working
- Review server logs for database errors

## Testing Locally

1. Create a `.env.local` file in your project root
2. Add all the environment variables
3. Run `npm run dev`
4. Visit http://localhost:3000/auth/login
5. Click "Sign in with Google"

## Production Deployment

When deploying to Vercel:

1. Go to your Vercel project settings
2. Navigate to **Environment Variables**
3. Add all the Firebase variables
4. Redeploy your application

For more help, visit the [Firebase Documentation](https://firebase.google.com/docs/auth/web/google-signin).
