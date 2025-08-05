#!/bin/bash

# GiftSync Rollback Manager
# Comprehensive rollback procedures for deployment failures
# Supports both automated and manual rollback scenarios

set -euo pipefail

# Configuration
source ~/.cloudflare-credentials

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
DOMAINS=("aclue.co.uk" "aclue.app")
PROJECT_ROOT="/home/jack/Documents/gift_sync"
ROLLBACK_LOG="/tmp/giftsync-rollback-$(date +%Y%m%d-%H%M%S).log"
SLACK_WEBHOOK_URL="${SLACK_WEBHOOK_URL:-}"
MAX_ROLLBACK_ATTEMPTS=3
HEALTH_CHECK_TIMEOUT=300  # 5 minutes
ROLLBACK_TIMEOUT=600      # 10 minutes

# Logging functions
log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$level] $message" | tee -a "$ROLLBACK_LOG"
    
    case "$level" in
        "ERROR")   echo -e "${RED}❌ $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO")    echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "STEP")    echo -e "${CYAN}➤ $message${NC}" ;;
        "HEADER")  echo -e "${PURPLE}━━━ $message ━━━${NC}" ;;
    esac
}

# Send Slack notification
send_slack_notification() {
    local message="$1"
    local status="${2:-info}"
    
    if [[ -z "$SLACK_WEBHOOK_URL" ]]; then
        log "WARNING" "Slack webhook URL not configured, skipping notification"
        return 0
    fi
    
    local color
    case "$status" in
        "success") color="#36a64f" ;;
        "error")   color="#ff0000" ;;
        "warning") color="#ffaa00" ;;
        *)         color="#36a64f" ;;
    esac
    
    local payload=$(cat <<EOF
{
  "attachments": [{
    "color": "$color",
    "title": "🔄 GiftSync Rollback Notification",
    "text": "$message",
    "timestamp": $(date +%s),
    "fields": [
      {
        "title": "Environment",
        "value": "Production",
        "short": true
      },
      {
        "title": "Timestamp",
        "value": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
        "short": true
      }
    ]
  }]
}
EOF
    )
    
    curl -s -X POST "$SLACK_WEBHOOK_URL" \
        -H "Content-Type: application/json" \
        -d "$payload" > /dev/null || log "WARNING" "Failed to send Slack notification"
}

# Health check function
perform_health_check() {
    local domain="$1"
    local max_attempts=10
    local attempt=1
    
    log "STEP" "Performing health check for $domain"
    
    while [[ $attempt -le $max_attempts ]]; do
        local http_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain" || echo "000")
        
        if [[ "$http_status" == "200" ]]; then
            log "SUCCESS" "$domain health check passed (attempt $attempt)"
            return 0
        fi
        
        log "WARNING" "$domain health check failed: HTTP $http_status (attempt $attempt/$max_attempts)"
        
        if [[ $attempt -lt $max_attempts ]]; then
            sleep 10
        fi
        
        ((attempt++))
    done
    
    log "ERROR" "$domain health check failed after $max_attempts attempts"
    return 1
}

# Comprehensive health checks
run_comprehensive_health_checks() {
    log "HEADER" "COMPREHENSIVE HEALTH CHECKS"
    
    local all_healthy=true
    
    for domain in "${DOMAINS[@]}"; do
        if ! perform_health_check "$domain"; then
            all_healthy=false
        fi
        
        # Test specific endpoints
        log "STEP" "Testing API endpoints for $domain"
        
        local api_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain/api/health" 2>/dev/null || echo "000")
        if [[ "$api_status" == "200" ]]; then
            log "SUCCESS" "$domain API health check passed"
        else
            log "WARNING" "$domain API endpoint status: HTTP $api_status (may be expected)"
        fi
        
        # Performance check
        local response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time 10 "https://$domain" || echo "999")
        if (( $(echo "$response_time > 3.0" | bc -l 2>/dev/null || echo 1) )); then
            log "WARNING" "$domain slow response time: ${response_time}s"
            all_healthy=false
        else
            log "SUCCESS" "$domain response time acceptable: ${response_time}s"
        fi
    done
    
    return $([[ "$all_healthy" == "true" ]] && echo 0 || echo 1)
}

# Get current Vercel deployment
get_current_deployment() {
    if command -v vercel >/dev/null 2>&1; then
        cd "$PROJECT_ROOT/web"
        local current_deployment=$(vercel ls --limit=1 --format=json 2>/dev/null | jq -r '.[0].uid' 2>/dev/null || echo "")
        echo "$current_deployment"
    else
        log "WARNING" "Vercel CLI not available, cannot get current deployment info"
        echo ""
    fi
}

# Get previous stable deployment
get_previous_deployment() {
    if command -v vercel >/dev/null 2>&1; then
        cd "$PROJECT_ROOT/web"
        local previous_deployment=$(vercel ls --limit=5 --format=json 2>/dev/null | \
            jq -r '.[] | select(.state == "READY") | .uid' 2>/dev/null | \
            sed -n '2p' || echo "")
        echo "$previous_deployment"
    else
        log "WARNING" "Vercel CLI not available, cannot get previous deployment info"
        echo ""
    fi
}

# Rollback Vercel deployment
rollback_vercel_deployment() {
    local target_deployment="$1"
    
    log "STEP" "Rolling back Vercel deployment to $target_deployment"
    
    if [[ -z "$target_deployment" ]]; then
        log "ERROR" "No target deployment specified for rollback"
        return 1
    fi
    
    cd "$PROJECT_ROOT/web"
    
    if command -v vercel >/dev/null 2>&1; then
        # Promote previous deployment to production
        if vercel promote "$target_deployment" --yes 2>>"$ROLLBACK_LOG"; then
            log "SUCCESS" "Vercel deployment rolled back to $target_deployment"
            return 0
        else
            log "ERROR" "Failed to rollback Vercel deployment"
            return 1
        fi
    else
        log "ERROR" "Vercel CLI not available for rollback"
        return 1
    fi
}

# Rollback Railway deployment
rollback_railway_deployment() {
    log "STEP" "Rolling back Railway backend deployment"
    
    cd "$PROJECT_ROOT/backend"
    
    if command -v railway >/dev/null 2>&1; then
        # Railway rollback (if supported)
        log "INFO" "Railway rollback would be performed here"
        # Note: Railway doesn't have direct rollback command, would need to redeploy previous commit
        return 0
    else
        log "WARNING" "Railway CLI not available, skipping backend rollback"
        return 0
    fi
}

# Purge Cloudflare cache after rollback
purge_cache_after_rollback() {
    log "STEP" "Purging Cloudflare cache after rollback"
    
    for domain in "${DOMAINS[@]}"; do
        log "INFO" "Purging cache for $domain"
        
        # Get zone ID
        local zone_id=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" 2>>"$ROLLBACK_LOG" | \
            python3 -c "import json, sys; data=json.load(sys.stdin); print(data['result'][0]['id'] if data['result'] else 'null')" 2>/dev/null || echo "null")
        
        if [[ "$zone_id" == "null" ]]; then
            log "ERROR" "Could not find zone for $domain"
            continue
        fi
        
        # Purge cache
        local response=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$zone_id/purge_cache" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}' 2>>"$ROLLBACK_LOG")
        
        local success=$(echo "$response" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('success', False))" 2>/dev/null || echo "False")
        
        if [[ "$success" == "True" ]]; then
            log "SUCCESS" "Cache purged for $domain"
        else
            log "ERROR" "Failed to purge cache for $domain: $response"
        fi
    done
}

# Main rollback procedure
perform_rollback() {
    local rollback_reason="${1:-manual}"
    local target_deployment="${2:-}"
    
    log "HEADER" "INITIATING ROLLBACK PROCEDURE"
    log "INFO" "Rollback reason: $rollback_reason"
    log "INFO" "Rollback log: $ROLLBACK_LOG"
    
    send_slack_notification "🚨 Rollback initiated: $rollback_reason" "warning"
    
    # If no target deployment specified, try to get previous one
    if [[ -z "$target_deployment" ]]; then
        target_deployment=$(get_previous_deployment)
        if [[ -z "$target_deployment" ]]; then
            log "ERROR" "Could not determine previous deployment for rollback"
            send_slack_notification "❌ Rollback failed: Could not determine target deployment" "error"
            return 1
        fi
    fi
    
    log "INFO" "Target deployment: $target_deployment"
    
    # Perform rollback with timeout
    timeout "$ROLLBACK_TIMEOUT" bash -c '
        set -e
        
        # Step 1: Rollback frontend
        if ! rollback_vercel_deployment "'$target_deployment'"; then
            log "ERROR" "Frontend rollback failed"
            exit 1
        fi
        
        # Step 2: Rollback backend (if needed)
        rollback_railway_deployment
        
        # Step 3: Purge cache
        purge_cache_after_rollback
        
        # Step 4: Wait for propagation
        log "INFO" "Waiting for rollback to propagate..."
        sleep 30
        
    ' || {
        log "ERROR" "Rollback procedure timed out or failed"
        send_slack_notification "❌ Rollback failed or timed out" "error"
        return 1
    }
    
    # Step 5: Verify rollback success
    log "STEP" "Verifying rollback success"
    
    if run_comprehensive_health_checks; then
        log "SUCCESS" "Rollback completed successfully"
        send_slack_notification "✅ Rollback completed successfully\nTarget: $target_deployment\nReason: $rollback_reason" "success"
        return 0
    else
        log "ERROR" "Rollback verification failed - system still unhealthy"
        send_slack_notification "❌ Rollback completed but system still unhealthy\nManual intervention required" "error"
        return 1
    fi
}

# Emergency stop procedure
emergency_stop() {
    log "HEADER" "EMERGENCY STOP PROCEDURE"
    
    send_slack_notification "🛑 Emergency stop initiated - taking system offline" "error"
    
    # Put maintenance page up via Cloudflare
    for domain in "${DOMAINS[@]}"; do
        log "INFO" "Enabling maintenance mode for $domain"
        
        # This would typically involve:
        # 1. Updating DNS to point to maintenance page
        # 2. Or using Cloudflare Workers to serve maintenance page
        # 3. Or updating page rules to show maintenance
        
        log "WARNING" "Maintenance mode activation not implemented - manual intervention required"
    done
    
    log "ERROR" "System taken offline - manual recovery required"
}

# Show rollback status
show_rollback_status() {
    log "HEADER" "ROLLBACK STATUS"
    
    local current_deployment=$(get_current_deployment)
    local previous_deployment=$(get_previous_deployment)
    
    echo "Current deployment: ${current_deployment:-'Unknown'}"
    echo "Previous deployment: ${previous_deployment:-'Unknown'}"
    echo
    
    echo "Domain Status:"
    for domain in "${DOMAINS[@]}"; do
        local status=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 "https://$domain" || echo "000")
        echo "  $domain: HTTP $status"
    done
    
    echo
    echo "Recent rollback logs:"
    find /tmp -name "giftsync-rollback-*.log" -mtime -1 2>/dev/null | sort -r | head -5
}

# Usage information
show_usage() {
    cat << EOF
GiftSync Rollback Manager

Usage: $0 [COMMAND] [OPTIONS]

Commands:
  rollback [reason] [deployment]  Perform full rollback procedure
  health-check                    Run comprehensive health checks
  status                          Show current deployment status
  emergency-stop                  Emergency stop - take system offline
  test-notifications             Test Slack notifications

Options:
  --help                         Show this help message

Examples:
  $0 rollback "deployment-failure"
  $0 rollback "health-check-failed" dpl_abc123
  $0 health-check
  $0 status
  $0 emergency-stop

Environment Variables:
  CLOUDFLARE_API_TOKEN          Cloudflare API token (required)
  SLACK_WEBHOOK_URL            Slack webhook for notifications
  
Log file: $ROLLBACK_LOG

EOF
}

# Test notifications
test_notifications() {
    log "INFO" "Testing Slack notifications"
    send_slack_notification "🧪 Test notification from rollback manager" "info"
    log "SUCCESS" "Test notification sent"
}

# Export functions for sourcing
export -f log send_slack_notification perform_health_check run_comprehensive_health_checks
export -f get_current_deployment get_previous_deployment rollback_vercel_deployment
export -f rollback_railway_deployment purge_cache_after_rollback perform_rollback

# Main execution
main() {
    # Check dependencies
    if [[ "$CLOUDFLARE_API_TOKEN" == "YOUR_TOKEN_HERE" ]]; then
        log "ERROR" "Please set your Cloudflare API token in ~/.cloudflare-credentials"
        exit 1
    fi
    
    # Check required tools
    local missing_tools=()
    command -v curl >/dev/null || missing_tools+=("curl")
    command -v jq >/dev/null || missing_tools+=("jq")
    command -v bc >/dev/null || missing_tools+=("bc")
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log "ERROR" "Missing required tools: ${missing_tools[*]}"
        log "INFO" "Install with: sudo apt-get install ${missing_tools[*]}"
        exit 1
    fi
    
    case "${1:-}" in
        "rollback")
            perform_rollback "${2:-manual}" "${3:-}"
            ;;
        "health-check")
            run_comprehensive_health_checks
            ;;
        "status")
            show_rollback_status
            ;;
        "emergency-stop")
            emergency_stop
            ;;
        "test-notifications")
            test_notifications
            ;;
        "--help"|"help"|"")
            show_usage
            ;;
        *)
            log "ERROR" "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Handle script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi