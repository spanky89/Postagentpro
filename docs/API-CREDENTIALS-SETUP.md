# API Credentials Setup Guide

This guide walks you through getting API credentials for PostAgentPro's integrations.

**Time Required:** ~30 minutes total (10 min per platform)

---

## 1. Google My Business API

### Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"New Project"** (top left)
3. Name it: `PostAgentPro` (or any name)
4. Click **"Create"**

### Step 2: Enable APIs

1. In your project, go to **"APIs & Services" → "Library"**
2. Search for and enable these APIs:
   - **"Google My Business API"** (for Google Business Profile posts)
   - **"Google My Business Account Management API"** (for account access)

### Step 3: Create OAuth Credentials

1. Go to **"APIs & Services" → "Credentials"**
2. Click **"+ Create Credentials"** → **"OAuth client ID"**
3. If prompted, configure the OAuth consent screen:
   - User Type: **External**
   - App name: `PostAgentPro`
   - User support email: Your email
   - Developer contact: Your email
   - Scopes: Add `https://www.googleapis.com/auth/business.manage`
   - Test users: Add your email
   - Click **"Save and Continue"**

4. Now create the OAuth client:
   - Application type: **Web application**
   - Name: `PostAgentPro Web`
   - Authorized redirect URIs:
     - `http://localhost:3000/auth/google/callback` (for development)
     - `https://postagentpro.com/auth/google/callback` (for production)
   - Click **"Create"**

5. **Copy your credentials:**
   - **Client ID** → Save this as `GOOGLE_CLIENT_ID`
   - **Client Secret** → Save this as `GOOGLE_CLIENT_SECRET`

### Step 4: Add to Environment Variables

In `postagentpro/api/.env`, add:
```
GOOGLE_CLIENT_ID="your-client-id-here.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-secret-here"
```

---

## 2. Meta (Facebook/Instagram) API

### Step 1: Create Meta App

1. Go to [Meta for Developers](https://developers.facebook.com/)
2. Click **"My Apps"** → **"Create App"**
3. Choose **"Business"** as app type
4. Fill in details:
   - App name: `PostAgentPro`
   - App contact email: Your email
   - Business Account: Select or create one
5. Click **"Create App"**

### Step 2: Add Products

1. In your app dashboard, click **"Add Product"**
2. Find **"Facebook Login"** and click **"Set Up"**
3. Select platform: **"Web"**
4. Site URL: `http://localhost:3000` (for development)
5. Click **"Save"** and **"Continue"**

### Step 3: Configure Facebook Login

1. In left sidebar, go to **"Facebook Login" → "Settings"**
2. Add these to **Valid OAuth Redirect URIs:**
   - `http://localhost:3000/auth/facebook/callback`
   - `https://postagentpro.com/auth/facebook/callback`
3. Click **"Save Changes"**

### Step 4: Request Permissions

1. Go to **"App Review" → "Permissions and Features"**
2. Request these permissions (required for posting):
   - `pages_manage_posts` (Post to Facebook Pages)
   - `pages_read_engagement` (Read engagement metrics)
   - `business_management` (Manage business accounts)
3. Submit for review (this can take 1-3 days)
   - For testing, add yourself as a test user

### Step 5: Get App Credentials

1. Go to **"Settings" → "Basic"**
2. **Copy your credentials:**
   - **App ID** → Save this as `META_APP_ID`
   - **App Secret** → Click "Show", copy as `META_APP_SECRET`

### Step 6: Add to Environment Variables

In `postagentpro/api/.env`, add:
```
META_APP_ID="your-app-id-here"
META_APP_SECRET="your-app-secret-here"
```

---

## 3. OpenAI API (for AI content generation)

### Step 1: Create OpenAI Account

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to **"API Keys"** in settings

### Step 2: Create API Key

1. Click **"+ Create new secret key"**
2. Name it: `PostAgentPro`
3. **Copy the key immediately** (you won't see it again)

### Step 3: Add Billing

1. Go to **"Billing"**
2. Add payment method
3. Set spending limit (e.g., $10/month for testing)

### Step 4: Add to Environment Variables

In `postagentpro/api/.env`, add:
```
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxx"
```

**Cost estimate:** ~$0.002 per post generation (GPT-4o) = 500 posts for $1

---

## 4. Pexels API (for stock photos)

### Step 1: Create Pexels Account

1. Go to [Pexels API](https://www.pexels.com/api/)
2. Click **"Get Started"**
3. Sign up with email

### Step 2: Get API Key

1. Verify your email
2. Go to your [API dashboard](https://www.pexels.com/api/)
3. Your API key will be displayed at the top
4. **Copy the key**

### Step 3: Add to Environment Variables

In `postagentpro/api/.env`, add:
```
PEXELS_API_KEY="your-pexels-api-key"
```

**Limits:** Free tier = 200 requests/hour (more than enough)

---

## Complete .env File Example

Your `postagentpro/api/.env` should look like:

```env
# Database
DATABASE_URL="postgresql://postgres:eDVwiUSIymLu5jt8@db.vihltugghefoddxusnzi.supabase.co:5432/postgres"

# JWT
JWT_SECRET="postagentpro-jwt-secret-change-in-production-2026"
JWT_EXPIRES_IN="7d"

# Stripe (for payments)
STRIPE_SECRET_KEY="sk_test_xxxxx"
STRIPE_WEBHOOK_SECRET="whsec_xxxxx"

# OpenAI
OPENAI_API_KEY="sk-proj-xxxxxxxxxxxxx"

# Google OAuth
GOOGLE_CLIENT_ID="xxxxx.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="GOCSPX-xxxxx"

# Meta OAuth
META_APP_ID="xxxxxxxxxxxxx"
META_APP_SECRET="xxxxxxxxxxxxx"

# Pexels
PEXELS_API_KEY="xxxxxxxxxxxxx"

# Server
PORT=4000
NODE_ENV="development"
FRONTEND_URL="http://localhost:3000"
```

---

## Testing the Setup

After adding all credentials:

1. **Restart the API server:**
   ```bash
   cd postagentpro/api
   npm run dev
   ```

2. **Test OAuth flows:**
   - Go to http://localhost:3000/dashboard/connections
   - Click "Connect Google" → Should redirect to Google login
   - Click "Connect Facebook" → Should redirect to Facebook login

3. **Troubleshooting:**
   - Check API server logs for errors
   - Verify redirect URIs match exactly
   - Ensure all credentials are in `.env` file (no typos)

---

## Production Setup

Before deploying to production:

1. **Update redirect URIs** in Google Cloud and Meta dashboard:
   - Change from `localhost:3000` to `postagentpro.com`

2. **Add production env vars** to Vercel:
   - Project Settings → Environment Variables
   - Add all the credentials above
   - Select "Production" environment

3. **Submit for app review** (Meta):
   - Required before public users can connect Facebook
   - Google My Business is instant (no review needed)

---

## Security Notes

- ❌ **Never commit `.env` files to Git** (already in `.gitignore`)
- ✅ **Use environment variables** for all secrets
- ✅ **Rotate keys** if ever exposed
- ✅ **Set spending limits** on OpenAI to avoid surprise bills

---

## Checklist

- [ ] Google Cloud project created
- [ ] Google My Business API enabled
- [ ] Google OAuth credentials created
- [ ] Meta app created
- [ ] Facebook Login configured
- [ ] Meta permissions requested
- [ ] OpenAI API key created
- [ ] Pexels API key created
- [ ] All credentials added to `.env`
- [ ] API server restarted
- [ ] OAuth flows tested

---

**Questions?** Check the docs or reach out to support.
