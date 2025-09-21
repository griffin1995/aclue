# Cloudflare Redirect Rules for www to apex

## Page Rules Setup (if choosing redirect approach)

### Rule 1: www.aclue.app → aclue.app
- URL Pattern: `www.aclue.app/*`
- Setting: Forwarding URL (301 Permanent Redirect)
- Destination: `https://aclue.app/$1`

### Rule 2: www.aclue.co.uk → aclue.co.uk
- URL Pattern: `www.aclue.co.uk/*`
- Setting: Forwarding URL (301 Permanent Redirect)
- Destination: `https://aclue.co.uk/$1`

## OR Use Bulk Redirects (Modern Approach)

In Cloudflare Rules → Redirect Rules:

### Source URL: `www.aclue.app`
- When incoming requests match: Hostname equals `www.aclue.app`
- Then redirect to: Dynamic
- Expression: `concat("https://aclue.app", http.request.uri.path)`
- Status code: 301

### Source URL: `www.aclue.co.uk`
- When incoming requests match: Hostname equals `www.aclue.co.uk`
- Then redirect to: Dynamic
- Expression: `concat("https://aclue.co.uk", http.request.uri.path)`
- Status code: 301