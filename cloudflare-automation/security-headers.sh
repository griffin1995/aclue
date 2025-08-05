#!/bin/bash
# Enterprise Security Configuration for GiftSync Domains
# Implements comprehensive security hardening for aclue.co.uk and aclue.app
# Compliant with OWASP security standards and UK/GDPR regulations

set -euo pipefail  # Exit on any error, undefined vars, or pipe failures

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

# Validation and error handling
if [ -z "${CLOUDFLARE_API_TOKEN:-}" ] || [ "${CLOUDFLARE_API_TOKEN:-YOUR_TOKEN_HERE}" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ SECURITY ERROR: Please set your Cloudflare API token in $SCRIPT_DIR/.env"
    exit 1
fi

# Domain configuration from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/cloudflare-security-$(date +%Y%m%d-%H%M%S).log"

# Security configuration constants
HSTS_MAX_AGE=31536000  # 1 year
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com *.vercel-insights.com *.posthog.com; style-src 'self' 'unsafe-inline' fonts.googleapis.com; font-src 'self' fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' *.railway.app *.posthog.com *.vercel-analytics.com *.vercel-insights.com; frame-ancestors 'none'; base-uri 'self'; object-src 'none';"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Error handling function
handle_error() {
    log "❌ ERROR: $1"
    exit 1
}

# API request wrapper with error handling
cloudflare_api() {
    local method="$1"
    local endpoint="$2"
    local data="${3:-}"
    local description="${4:-API request}"
    
    local response
    if [ -n "$data" ]; then
        response=$(curl -s -X "$method" "$endpoint" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data "$data" 2>/dev/null)
    else
        response=$(curl -s -X "$method" "$endpoint" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" 2>/dev/null)
    fi
    
    local success=$(echo "$response" | jq -r '.success // false')
    if [ "$success" != "true" ]; then
        local errors=$(echo "$response" | jq -r '.errors[]? // "Unknown error"')
        handle_error "$description failed: $errors"
    fi
    
    echo "$response"
}

log "🔐 Starting enterprise security configuration for GiftSync domains..."
log "📝 Security audit log: $LOG_FILE"

for domain in "${DOMAINS[@]}"; do
    log "📡 Configuring security for $domain..."
    
    # Get zone ID with error handling
    ZONE_RESPONSE=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones?name=$domain" "" "Zone lookup for $domain")
    ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id // "null"')
    
    if [ "$ZONE_ID" = "null" ]; then
        handle_error "Could not find zone for $domain"
    fi
    
    log "✅ Found zone ID: $ZONE_ID for $domain"
    
    # ====== SSL/TLS SECURITY CONFIGURATION ======
    log "🔒 Configuring SSL/TLS security settings..."
    
    # Set SSL/TLS to Full (Strict) - Enterprise standard
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
        '{"value":"strict"}' "SSL Full Strict mode" > /dev/null
    
    # Enable Always Use HTTPS
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
        '{"value":"on"}' "Always Use HTTPS" > /dev/null
    
    # Enable Automatic HTTPS Rewrites
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/automatic_https_rewrites" \
        '{"value":"on"}' "Automatic HTTPS Rewrites" > /dev/null
    
    # Set minimum TLS version to 1.2 (security requirement)
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/min_tls_version" \
        '{"value":"1.2"}' "Minimum TLS 1.2" > /dev/null
    
    # Enable TLS 1.3
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/tls_1_3" \
        '{"value":"on"}' "TLS 1.3 support" > /dev/null
    
    # ====== SECURITY HEADERS CONFIGURATION ======
    log "🛡️  Configuring comprehensive security headers..."
    
    # Enhanced HSTS with preload
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_header" \
        "{\"value\":{\"strict_transport_security\":{\"enabled\":true,\"max_age\":$HSTS_MAX_AGE,\"include_subdomains\":true,\"preload\":true}}}" \
        "HSTS configuration" > /dev/null
    
    # ====== DDOS AND BOT PROTECTION ======
    log "🤖 Configuring DDoS and bot protection..."
    
    # Enable Browser Integrity Check
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/browser_check" \
        '{"value":"on"}' "Browser Integrity Check" > /dev/null
    
    # Enable Challenge Passage
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/challenge_ttl" \
        '{"value":1800}' "Challenge TTL (30 minutes)" > /dev/null
    
    # Set Security Level to High
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_level" \
        '{"value":"high"}' "High Security Level" > /dev/null
    
    # ====== PRIVACY AND COMPLIANCE ======
    log "🔐 Configuring privacy and compliance settings..."
    
    # Disable Server-side Excludes (privacy)
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/server_side_exclude" \
        '{"value":"off"}' "Server-side Excludes disabled" > /dev/null
    
    # Enable Privacy Pass
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/privacy_pass" \
        '{"value":"on"}' "Privacy Pass enabled" > /dev/null
    
    # Disable Email Obfuscation (can interfere with legitimate usage)
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/email_obfuscation" \
        '{"value":"off"}' "Email Obfuscation disabled" > /dev/null
    
    log "✅ Enterprise security configuration completed for $domain"
done

log "🎉 Enterprise security configuration complete for all domains!"
log "📊 Security audit log saved to: $LOG_FILE"
log "🔍 Next steps: Run security validation and monitoring setup"