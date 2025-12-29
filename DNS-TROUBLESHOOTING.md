# DNS Troubleshooting for lksy.org

## Current Status
- ✅ DNS records are resolving correctly
- ⏳ SSL certificates are pending provisioning

## Critical Cloudflare Settings

### 1. Proxy Status (MOST IMPORTANT)
All DNS records **MUST** be set to **"DNS only"** (gray cloud), NOT "Proxied" (orange cloud).

**How to check:**
1. Go to Cloudflare Dashboard → DNS → Records
2. Look at each record for `lksy.org`, `www.lksy.org`, and `api.lksy.org`
3. The cloud icon should be **gray** (DNS only), not **orange** (Proxied)

**If any record is orange (Proxied):**
- Click on the record
- Click the orange cloud to turn it gray
- Save

### 2. SSL/TLS Settings
1. Go to Cloudflare Dashboard → SSL/TLS
2. Set encryption mode to **"Full"** or **"Full (strict)"**
3. **Do NOT** use "Flexible" mode

### 3. Verify All Records Exist

**For lksy.org (root domain):**
- 4 A records pointing to:
  - 216.239.32.21
  - 216.239.34.21
  - 216.239.36.21
  - 216.239.38.21
- 4 AAAA records pointing to:
  - 2001:4860:4802:32::15
  - 2001:4860:4802:34::15
  - 2001:4860:4802:36::15
  - 2001:4860:4802:38::15

**For www.lksy.org:**
- 1 CNAME record: `www` → `ghs.googlehosted.com`

**For api.lksy.org:**
- 1 CNAME record: `api` → `ghs.googlehosted.com`

## Why Certificates Are Pending

Google Cloud needs to:
1. Verify DNS records are correctly configured
2. Verify records are NOT proxied through Cloudflare
3. Issue SSL certificates (can take 15-60 minutes)

## What to Do

1. **Double-check all records are "DNS only" (gray cloud)**
2. **Wait 15-60 minutes** for certificate provisioning
3. **Check status:**
   ```bash
   gcloud beta run domain-mappings list --region us-central1 --project visual-validation
   ```

## If Still Not Working After 1 Hour

1. Verify SSL/TLS mode is "Full" or "Full (strict)"
2. Check that no Cloudflare page rules are interfering
3. Try temporarily disabling Cloudflare proxy for these domains
4. Contact support if DNS is correct but certificates still pending


