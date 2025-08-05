#!/bin/bash
# Cloudflare DNS Backup Tool
# Creates backups of DNS records for both domains

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ "$CLOUDFLARE_API_TOKEN" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ Please set your Cloudflare API token in $SCRIPT_DIR/.env"
    exit 1
fi

# Use domains and backup directory from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"

mkdir -p "$BACKUP_DIR"

echo "💾 Creating DNS backups..."

for domain in "${DOMAINS[@]}"; do
    echo "📡 Backing up DNS for $domain..."
    
    # Get zone ID
    ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq -r '.result[0].id')
    
    if [ "$ZONE_ID" = "null" ]; then
        echo "❌ Could not find zone for $domain"
        continue
    fi
    
    # Get all DNS records
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    BACKUP_FILE="$BACKUP_DIR/${domain}_dns_backup_${TIMESTAMP}.json"
    
    curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/dns_records" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" | \
        jq '.result' > "$BACKUP_FILE"
    
    RECORD_COUNT=$(jq length "$BACKUP_FILE")
    echo "✅ Backed up $RECORD_COUNT DNS records for $domain to $BACKUP_FILE"
done

echo "🎉 DNS backup complete! Files saved to: $BACKUP_DIR"