# Cloudflare Optimization Settings for aclue

## Speed Optimization
- **Auto Minify**: Enable HTML, CSS, JS
- **Rocket Loader**: Enable for JS optimization
- **Mirage**: Enable for image optimization
- **Polish**: Lossless compression
- **Brotli**: Enable compression

## Security Settings
- **Security Level**: Medium
- **Challenge Passage**: 30 minutes
- **Browser Integrity Check**: Enable
- **Hotlink Protection**: Enable for images

## Page Rules (Priority Order)
1. `*.aclue.app/*` and `*.aclue.co.uk/*`
   - Cache Level: Standard
   - Browser TTL: 4 hours
   - Edge TTL: 2 hours

2. `aclue.app/api/*` and `aclue.co.uk/api/*`
   - Cache Level: Bypass
   - Disable Apps
   - Disable Performance

## DNS Records Configuration

### For aclue.app:
```
A     @         216.198.79.1        Proxied
CNAME www       cname.vercel-dns.com Proxied
TXT   _vercel   [vercel-token]      DNS Only
MX    @         mail.protonmail.ch  DNS Only (Priority: 10)
MX    @         mailsec.protonmail.ch DNS Only (Priority: 20)
TXT   @         protonmail-verification= DNS Only
```

### For aclue.co.uk:
```
A     @         216.198.79.1        Proxied
CNAME www       cname.vercel-dns.com Proxied
TXT   _vercel   [vercel-token]      DNS Only
MX    @         mail.protonmail.ch  DNS Only (Priority: 10)
MX    @         mailsec.protonmail.ch DNS Only (Priority: 20)
TXT   @         protonmail-verification= DNS Only
```