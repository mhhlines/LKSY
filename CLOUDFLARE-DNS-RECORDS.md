# Cloudflare DNS Records for lksy.org

Add these DNS records in your Cloudflare dashboard for `lksy.org`:

## Required DNS Records

### 1. Root Domain (lksy.org) - A Records
Add **4 A records** for the root domain:

| Name | Type | IPv4 Address | Proxy Status |
|------|------|--------------|--------------|
| @ | A | 216.239.32.21 | DNS only (gray cloud) |
| @ | A | 216.239.34.21 | DNS only (gray cloud) |
| @ | A | 216.239.36.21 | DNS only (gray cloud) |
| @ | A | 216.239.38.21 | DNS only (gray cloud) |

### 2. Root Domain (lksy.org) - AAAA Records (IPv6)
Add **4 AAAA records** for the root domain:

| Name | Type | IPv6 Address | Proxy Status |
|------|------|--------------|--------------|
| @ | AAAA | C | DNS only (gray cloud) |
| @ | AAAA | 2001:4860:4802:34::15 | DNS only (gray cloud) |
| @ | AAAA | 2001:4860:4802:36::15 | DNS only (gray cloud) |
| @ | AAAA | 2001:4860:4802:38::15 | DNS only (gray cloud) |

### 3. www.lksy.org - CNAME Record
Add **1 CNAME record** for www:

| Name | Type | Target | Proxy Status |
|------|------|--------|--------------|
| www | CNAME | ghs.googlehosted.com | DNS only (gray cloud) |

### 4. api.lksy.org - CNAME Record
Add **1 CNAME record** for api:

| Name | Type | Target | Proxy Status |
|------|------|--------|--------------|
| api | CNAME | ghs.googlehosted.com | DNS only (gray cloud) |

## Important Notes

⚠️ **CRITICAL:** Set all records to **"DNS only"** (gray cloud), NOT "Proxied" (orange cloud). Cloud Run requires direct DNS resolution.

## Steps in Cloudflare

1. Go to your Cloudflare dashboard for `lksy.org`
2. Navigate to **DNS** → **Records**
3. Add each record listed above
4. Make sure the proxy status is **OFF** (gray cloud) for all records
5. Save each record

## After Adding Records

1. **Wait for DNS propagation** (usually 5-30 minutes)
2. **SSL certificates** will be automatically provisioned by Google Cloud (may take 15-60 minutes)
3. **Test your sites:**
   - https://lksy.org
   - https://www.lksy.org
   - https://api.lksy.org/health

## Verify Domain Mapping Status

You can check the status with:

```bash
gcloud beta run domain-mappings list --region us-central1 --project visual-validation
```

Once DNS is configured and certificates are provisioned, the status will change from "Unknown" to "Active".


