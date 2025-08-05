#!/bin/bash
# Cloudflare Status Checker
# Checks SSL, security settings, and DNS for both domains

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ "$CLOUDFLARE_API_TOKEN" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ Please set your Cloudflare API token in $SCRIPT_DIR/.env"
    exit 1
fi

# Use domains from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"

echo "🔍 Checking Cloudflare status for domains..."

for domain in "${DOMAINS[@]}"; do
    echo ""
    echo "🌐 === $domain ==="
    
    # Get zone ID
    ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq -r '.result[0].id')
    
    if [ "$ZONE_ID" = "null" ]; then
        echo "❌ Could not find zone for $domain"
        continue
    fi
    
    echo "Zone ID: $ZONE_ID"
    
    # Check SSL status
    SSL_STATUS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | \
        jq -r '.result.value')
    echo "🔒 SSL Mode: $SSL_STATUS"
    
    # Check HTTPS redirect
    HTTPS_REDIRECT=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | \
        jq -r '.result.value')
    echo "🔄 Always HTTPS: $HTTPS_REDIRECT"
    
    # Check DNS records pointing to Vercel
    VERCEL_RECORDS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records?content=cname.vercel-dns.com" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | \
        jq -r '.result | length')
    echo "📡 Vercel DNS Records: $VERCEL_RECORDS"
    
    # Test domain response
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "https://$domain")
    if [ "$HTTP_STATUS" = "200" ]; then
        echo "✅ Domain responding: HTTP $HTTP_STATUS"
    else
        echo "❌ Domain issue: HTTP $HTTP_STATUS"
    fi
done

echo ""
echo "🎉 Status check complete!"