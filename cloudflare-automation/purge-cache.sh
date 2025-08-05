#!/bin/bash
# Cloudflare Cache Purge Automation
# Purges cache for both domains after deployment

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ "$CLOUDFLARE_API_TOKEN" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ Please set your Cloudflare API token in $SCRIPT_DIR/.env"
    exit 1
fi

# Use domains from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"

echo "🧹 Purging Cloudflare cache..."

for domain in "${DOMAINS[@]}"; do
    echo "📡 Purging cache for $domain..."
    
    # Get zone ID
    ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq -r '.result[0].id')
    
    if [ "$ZONE_ID" = "null" ]; then
        echo "❌ Could not find zone for $domain"
        continue
    fi
    
    # Purge everything
    RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" \
        --data '{"purge_everything":true}')
    
    SUCCESS=$(echo $RESPONSE | jq -r '.success')
    
    if [ "$SUCCESS" = "true" ]; then
        echo "✅ Cache purged for $domain"
    else
        echo "❌ Failed to purge cache for $domain"
        echo "Response: $RESPONSE"
    fi
done

echo "🎉 Cache purge complete!"