#!/bin/bash
# Cloudflare Domain Monitoring Script
# Checks SSL, performance, and security settings periodically

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ "$CLOUDFLARE_API_TOKEN" = "YOUR_TOKEN_HERE" ]; then
    echo "❌ Please set your Cloudflare API token in $SCRIPT_DIR/.env"
    exit 1
fi

# Use domains and log directory from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"
LOG_FILE="$LOG_DIR/domain-monitoring.log"

# Ensure log directory exists
mkdir -p "$LOG_DIR"
ALERT_EMAIL="jack@giftsync.com"  # Update with actual email

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_message() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "[$timestamp] $1" >> "$LOG_FILE"
    echo -e "$1"
}

check_domain_health() {
    local domain="$1"
    local issues=()
    
    log_message "${BLUE}🔍 Checking $domain${NC}"
    
    # Get zone ID
    ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
        -H "Content-Type: application/json" | \
        python3 -c "import json, sys; data=json.load(sys.stdin); print(data['result'][0]['id'] if data['result'] else 'null')")
    
    if [ "$ZONE_ID" = "null" ]; then
        issues+=("Zone not found")
        log_message "${RED}❌ Zone not found for $domain${NC}"
        return 1
    fi
    
    # Check SSL status
    SSL_STATUS=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/ssl" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | \
        python3 -c "import json, sys; data=json.load(sys.stdin); print(data['result']['value'])")
    
    if [ "$SSL_STATUS" != "full" ]; then
        issues+=("SSL not in Full mode ($SSL_STATUS)")
    fi
    
    # Check HTTPS redirect
    HTTPS_REDIRECT=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/settings/always_use_https" \
        -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" | \
        python3 -c "import json, sys; data=json.load(sys.stdin); print(data['result']['value'])")
    
    if [ "$HTTPS_REDIRECT" != "on" ]; then
        issues+=("HTTPS redirect disabled")
    fi
    
    # Test domain response
    HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain" || echo "000")
    RESPONSE_TIME=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 "https://$domain" || echo "999")
    
    if [ "$HTTP_STATUS" != "200" ]; then
        issues+=("HTTP status $HTTP_STATUS")
    fi
    
    if [ "$(echo "$RESPONSE_TIME > 5" | bc 2>/dev/null || echo 1)" = "1" ]; then
        issues+=("Slow response time: ${RESPONSE_TIME}s")
    fi
    
    # Test SSL certificate
    SSL_EXPIRY=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
        openssl x509 -noout -dates 2>/dev/null | grep "notAfter" | cut -d= -f2)
    
    if [ -n "$SSL_EXPIRY" ]; then
        EXPIRY_EPOCH=$(date -d "$SSL_EXPIRY" +%s 2>/dev/null || echo 0)
        CURRENT_EPOCH=$(date +%s)
        DAYS_UNTIL_EXPIRY=$(( (EXPIRY_EPOCH - CURRENT_EPOCH) / 86400 ))
        
        if [ "$DAYS_UNTIL_EXPIRY" -lt 30 ]; then
            issues+=("SSL certificate expires in $DAYS_UNTIL_EXPIRY days")
        fi
    fi
    
    # Report results
    if [ ${#issues[@]} -eq 0 ]; then
        log_message "${GREEN}✅ $domain - All checks passed (${RESPONSE_TIME}s response)${NC}"
        return 0
    else
        log_message "${RED}❌ $domain - Issues found:${NC}"
        for issue in "${issues[@]}"; do
            log_message "${RED}   • $issue${NC}"
        done
        return 1
    fi
}

send_alert() {
    local subject="$1"
    local message="$2"
    
    # Simple mail alert (requires mail command)
    if command -v mail >/dev/null 2>&1; then
        echo "$message" | mail -s "$subject" "$ALERT_EMAIL"
        log_message "${YELLOW}📧 Alert sent: $subject${NC}"
    else
        log_message "${YELLOW}⚠️ Would send alert: $subject${NC}"
        log_message "${YELLOW}   Install 'mailutils' for email alerts${NC}"
    fi
}

generate_report() {
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "Domain Monitoring Report - $timestamp"
    echo "========================================"
    echo
    
    local all_healthy=true
    
    for domain in "${DOMAINS[@]}"; do
        if ! check_domain_health "$domain"; then
            all_healthy=false
        fi
        echo
    done
    
    if [ "$all_healthy" = true ]; then
        log_message "${GREEN}🎉 All domains healthy!${NC}"
    else
        log_message "${RED}⚠️ Some domains have issues - check logs${NC}"
        send_alert "Domain Issues Detected" "Check domain monitoring log: $LOG_FILE"
    fi
    
    echo "Full log: $LOG_FILE"
    echo "Next check: $(date -d '+1 hour' '+%Y-%m-%d %H:%M:%S')"
}

# Main execution
case "${1:-}" in
    --continuous)
        log_message "${BLUE}🔄 Starting continuous monitoring (1 hour intervals)${NC}"
        while true; do
            generate_report
            sleep 3600  # 1 hour
        done
        ;;
    --daemon)
        log_message "${BLUE}🔄 Starting as daemon${NC}"
        nohup "$0" --continuous >> "$LOG_FILE" 2>&1 &
        echo "Monitoring daemon started. PID: $!"
        echo "Log file: $LOG_FILE"
        ;;
    --help)
        echo "Domain Monitoring Script"
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --continuous  Run monitoring every hour"
        echo "  --daemon     Start as background daemon"
        echo "  --help       Show this help"
        echo "  (no options) Run single check"
        ;;
    *)
        generate_report
        ;;
esac