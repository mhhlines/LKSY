# Environment Setup Instructions

Your GitHub token has been saved. Now you need to complete the setup:

## Step 1: Create Environment Files

Run this script to create the .env files with your GitHub token:

```bash
./create-env-files.sh
```

## Step 2: Get GitHub OAuth Credentials

You still need to create a GitHub OAuth App:

1. Go to: https://github.com/settings/developers/apps/new
2. Fill in:
   - **Application name**: `lksy.org`
   - **Homepage URL**: `https://lksy.org`
   - **Authorization callback URL**: `https://lksy.org/api/auth/callback`
3. Click "Register application"
4. Copy the **Client ID** and **Client Secret**

## Step 3: Update api/.env

Edit `api/.env` and replace:
- `PLACEHOLDER_CLIENT_ID` with your OAuth Client ID
- `PLACEHOLDER_CLIENT_SECRET` with your OAuth Client Secret

## Step 4: Database Password

After you create the Cloud SQL database (during deployment), you'll need to:
1. Get the database password (generated during `./deploy.sh`)
2. Update `api/.env` with the actual `DATABASE_URL`

The DATABASE_URL format will be:
```
postgresql://lksy_user:YOUR_PASSWORD@/lksy?host=/cloudsql/visual-validation:us-central1:lksy-db
```

## Current Status

✅ GitHub Personal Access Token: Saved  
⏳ GitHub OAuth App: Need to create  
⏳ Database Password: Will be generated during deployment  

## Next Steps

1. Run `./create-env-files.sh` to create the files
2. Create GitHub OAuth App (link above)
3. Update `api/.env` with OAuth credentials
4. Run `./deploy.sh` to deploy (database password will be generated)


