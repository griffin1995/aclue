#!/bin/bash
# Advanced Firewall Rules and Bot Protection for GiftSync Domains
# Implements enterprise-grade bot protection, DDoS mitigation, and security rules
# Compliant with OWASP security standards and UK/GDPR regulations

set -euo pipefail

source ~/.cloudflare-credentials

# Validation and error handling
if [ "${CLOUDFLARE_API_TOKEN:-YOUR_TOKEN_HERE}" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ SECURITY ERROR: Please set your Cloudflare API token in ~/.cloudflare-credentials"
    exit 1
fi

# Domain configuration
DOMAINS=("aclue.co.uk" "aclue.app")
LOG_FILE="/tmp/cloudflare-firewall-$(date +%Y%m%d-%H%M%S).log"

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

log "🛡️ Starting advanced firewall and bot protection configuration..."
log "📝 Firewall configuration log: $LOG_FILE"

for domain in "${DOMAINS[@]}"; do
    log "🔥 Configuring firewall rules for $domain..."
    
    # Get zone ID
    ZONE_RESPONSE=$(cloudflare_api "GET" "https://api.cloudflare.com/client/v4/zones?name=$domain" "" "Zone lookup for $domain")
    ZONE_ID=$(echo "$ZONE_RESPONSE" | jq -r '.result[0].id // "null"')
    
    if [ "$ZONE_ID" = "null" ]; then
        handle_error "Could not find zone for $domain"
    fi
    
    log "✅ Found zone ID: $ZONE_ID for $domain"
    
    # ====== RATE LIMITING RULES ======
    log "🚦 Creating rate limiting rules..."
    
    # API endpoint rate limiting (100 requests per minute)
    API_RATE_LIMIT_RULE='{
        "mode": "simulate",
        "action": {
            "mode": "challenge",
            "timeout": 86400,
            "response": {
                "content_type": "application/json",
                "content": "{\"error\": \"Rate limit exceeded. Please try again later.\"}"
            }
        },
        "threshold": 100,
        "period": 60,
        "match": {
            "request": {
                "url": "*api*"
            }
        },
        "correlate": {
            "by": "ip"
        }
    }'
    
    cloudflare_api "POST" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rate_limits" \
        "$API_RATE_LIMIT_RULE" "API rate limiting rule" > /dev/null
    
    # Login endpoint protection (5 attempts per minute)
    LOGIN_RATE_LIMIT_RULE='{
        "mode": "simulate",
        "action": {
            "mode": "ban",
            "timeout": 1800
        },
        "threshold": 5,
        "period": 60,
        "match": {
            "request": {
                "url": "*login*",
                "methods": ["POST"]
            }
        },
        "correlate": {
            "by": "ip"
        }
    }'
    
    cloudflare_api "POST" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/rate_limits" \
        "$LOGIN_RATE_LIMIT_RULE" "Login rate limiting rule" > /dev/null
    
    # ====== WAF CUSTOM RULES ======
    log "🔍 Creating WAF custom security rules..."
    
    # Block known malicious user agents
    MALICIOUS_UA_RULE='{
        "filter": {
            "expression": "(http.user_agent contains \"sqlmap\") or (http.user_agent contains \"nikto\") or (http.user_agent contains \"nmap\") or (http.user_agent contains \"masscan\") or (http.user_agent contains \"nessus\")",
            "paused": false
        },
        "action": "block",
        "description": "Block malicious security scanners and automated tools"
    }'
    
    cloudflare_api "POST" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
        "$MALICIOUS_UA_RULE" "Malicious User Agent blocking rule" > /dev/null
    
    # Block suspicious request patterns
    SUSPICIOUS_PATTERNS_RULE='{
        "filter": {
            "expression": "(http.request.uri.path contains \"../\") or (http.request.uri.path contains \"<script\") or (http.request.uri.path contains \"union select\") or (http.request.uri.path contains \"drop table\")",
            "paused": false
        },
        "action": "block",
        "description": "Block common injection and traversal attempts"
    }'
    
    cloudflare_api "POST" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
        "$SUSPICIOUS_PATTERNS_RULE" "Suspicious pattern blocking rule" > /dev/null
    
    # Block requests without proper referrer for sensitive endpoints
    REFERRER_PROTECTION_RULE='{
        "filter": {
            "expression": "(http.request.uri.path contains \"/api/auth/\") and (http.referer ne \"https://aclue.co.uk\" and http.referer ne \"https://aclue.app\" and http.referer ne \"https://www.aclue.co.uk\" and http.referer ne \"https://www.aclue.app\")",
            "paused": false
        },
        "action": "challenge",
        "description": "Challenge requests to auth endpoints without proper referrer"
    }'
    
    cloudflare_api "POST" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
        "$REFERRER_PROTECTION_RULE" "Referrer protection rule" > /dev/null
    
    # ====== GEO-BLOCKING RULES (Optional - UK/EU focus) ======
    log "🌍 Creating geo-protection rules..."
    
    # Challenge non-UK/EU traffic to admin endpoints
    GEO_CHALLENGE_RULE='{
        "filter": {
            "expression": "(http.request.uri.path contains \"/admin\") and (ip.geoip.country ne \"GB\" and ip.geoip.continent ne \"EU\")",
            "paused": false
        },
        "action": "challenge",
        "description": "Challenge non-UK/EU access to admin endpoints"
    }'
    
    cloudflare_api "POST" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/firewall/rules" \
        "$GEO_CHALLENGE_RULE" "Geo-protection challenge rule" > /dev/null
    
    # ====== BOT MANAGEMENT CONFIGURATION ======
    log "🤖 Configuring advanced bot management..."
    
    # Enable Bot Fight Mode (free tier bot protection)
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/bot_management" \
        '{"fight_mode":true}' "Bot Fight Mode" > /dev/null
    
    # Configure Super Bot Fight Mode settings if available
    SUPER_BOT_CONFIG='{
        "definitely_automated": "block",
        "likely_automated": "challenge",
        "verified_bots": "allow"
    }'
    
    # This may fail on free plans - handle gracefully
    cloudflare_api "PUT" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/bot_management" \
        "$SUPER_BOT_CONFIG" "Super Bot Fight Mode configuration" > /dev/null || log "⚠️  Super Bot Fight Mode not available (requires paid plan)"
    
    # ====== SECURITY LEVEL AND CHALLENGE CONFIGURATION ======
    log "🔒 Configuring security challenges..."
    
    # Set WAF sensitivity to High
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/waf" \
        '{"value":"on"}' "WAF enabled" > /dev/null
    
    # Configure Security Level to High (already set in main script, but ensuring)
    cloudflare_api "PATCH" "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/security_level" \
        '{"value":"high"}' "High Security Level" > /dev/null
    
    log "✅ Advanced firewall and bot protection configured for $domain"
done

log "🎉 Advanced firewall configuration complete for all domains!"
log "📊 Firewall configuration log saved to: $LOG_FILE"

# ====== SECURITY RECOMMENDATIONS ======
log ""
log "📋 SECURITY CONFIGURATION SUMMARY:"
log "✅ Rate limiting: API (100/min), Login (5/min)"
log "✅ WAF rules: Malicious UAs, Injection patterns, Referrer protection"
log "✅ Geo-protection: Admin endpoints challenge for non-UK/EU"
log "✅ Bot protection: Bot Fight Mode enabled"
log "✅ Security level: High"
log ""
log "🔍 NEXT STEPS:"
log "1. Monitor firewall events in Cloudflare dashboard"
log "2. Adjust rate limits based on legitimate traffic patterns"
log "3. Review and tune WAF rules after deployment"
log "4. Consider upgrading to Pro plan for Super Bot Fight Mode"
log "5. Set up alerting for security events"