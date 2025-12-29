# Domain Setup Guide for lksy.org

Since your domain is managed by Cloudflare, here's the step-by-step process to connect it to Google Cloud Run.

## Step 1: Verify Domain Ownership in Google Cloud

1. **Go to Google Cloud Console:**
   - Navigate to: https://console.cloud.google.com/run/domains?project=visual-validation
   - Or: APIs & Services > Domain Verification

2. **Add Domain for Verification:**
   - Click "Add Domain" or "Verify Domain"
   - Enter: `lksy.org`
   - Google will provide you with DNS records to add

3. **Add Verification Records in Cloudflare:**
   - Google will give you a TXT record like:
     ```
     Name: @ (or lksy.org)
     Type: TXT
     Value: google-site-verification=XXXXXXXXXXXXX
     ```
   - Add this record in Cloudflare DNS settings
   - Wait for verification (usually 5-30 minutes)

## Step 2: Create Domain Mappings

Once the domain is verified, run these commands:

```bash
# Map lksy.org to frontend
gcloud beta run domain-mappings create \
  --service lksy-frontend \
  --domain lksy.org \
  --region us-central1 \
  --project visual-validation

# Map api.lksy.org to API
gcloud beta run domain-mappings create \
  --service lksy-api \
  --domain api.lksy.org \
  --region us-central1 \
  --project visual-validation
```

## Step 3: Get DNS Records from Google Cloud

After creating the mappings, get the DNS records:

```bash
# Get DNS records for lksy.org
gcloud beta run domain-mappings describe \
  --domain lksy.org \
  --region us-central1 \
  --project visual-validation \
  --format="value(status.resourceRecords)"

# Get DNS records for api.lksy.org
gcloud beta run domain-mappings describe \
  --domain api.lksy.org \
  --region us-central1 \
  --project visual-validation \
  --format="value(status.resourceRecords)"
```

## Step 4: Configure DNS in Cloudflare

You'll need to add CNAME records in Cloudflare:

1. **For lksy.org:**
   - Go to Cloudflare DNS settings for lksy.org
   - Add a CNAME record:
     ```
     Name: @ (or lksy.org)
     Type: CNAME
     Target: ghs.googlehosted.com
     Proxy status: DNS only (gray cloud) - IMPORTANT!
     TTL: Auto
     ```

2. **For api.lksy.org:**
   - Add another CNAME record:
     ```
     Name: api
     Type: CNAME
     Target: ghs.googlehosted.com
     Proxy status: DNS only (gray cloud) - IMPORTANT!
     TTL: Auto
     ```

**Important:** Make sure the proxy status is set to "DNS only" (gray cloud), not "Proxied" (orange cloud). Cloud Run requires direct DNS resolution.

## Step 5: Update Frontend Environment Variables

Once DNS is configured, update the frontend to use the custom domain:

```bash
gcloud run services update lksy-frontend \
  --set-env-vars="NEXT_PUBLIC_API_URL=https://api.lksy.org,GITHUB_OWNER=mhhlines,GITHUB_REPO=LKSY" \
  --region us-central1 \
  --project visual-validation
```

## Step 6: Verify Everything Works

After DNS propagates (5-30 minutes):

1. **Check domain mapping status:**
   ```bash
   gcloud beta run domain-mappings list --region us-central1 --project visual-validation
   ```

2. **Test the sites:**
   - Frontend: https://lksy.org
   - API: https://api.lksy.org/health

## Troubleshooting

- **Domain not verified:** Make sure you've completed Step 1 and the verification TXT record is in Cloudflare
- **DNS not resolving:** Check that CNAME records are set to "DNS only" (not proxied) in Cloudflare
- **SSL certificate issues:** Google Cloud automatically provisions SSL certificates, but it may take 15-60 minutes after DNS is configured

## Current Service URLs (Before Domain Setup)

- Frontend: https://lksy-frontend-722879364416.us-central1.run.app
- API: https://lksy-api-722879364416.us-central1.run.app

These will continue to work even after the custom domain is set up.


