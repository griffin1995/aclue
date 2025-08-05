#!/bin/bash
# Security Incident Response and Alerting System for GiftSync Domains
# Implements real-time security monitoring, incident detection, and automated response
# Integrates with email, Slack, and webhook notifications for security events

set -euo pipefail

source ~/.cloudflare-credentials

# Configuration
DOMAINS=("aclue.co.uk" "aclue.app")
LOG_FILE="/tmp/cloudflare-security-alerts-$(date +%Y%m%d-%H%M%S).log"
INCIDENT_LOG="/var/log/giftsync-security-incidents.log"
STATE_FILE="/tmp/security-alert-state.json"

# Alert thresholds
CRITICAL_BLOCKED_REQUESTS_THRESHOLD=100    # Alert if >100 blocks in 5 minutes
HIGH_TRAFFIC_THRESHOLD=5000                # Alert if >5000 requests in 5 minutes
FAILED_LOGIN_THRESHOLD=20                  # Alert if >20 failed logins in 5 minutes
DDoS_THRESHOLD=10000                       # Alert if >10k requests in 1 minute
SSL_EXPIRY_WARNING_DAYS=30                 # Warn if SSL expires in <30 days

# Notification settings (configure these)
EMAIL_ALERTS="security@aclue.co.uk"        # Email for security alerts
SLACK_WEBHOOK=""                           # Slack webhook URL (optional)
WEBHOOK_URL=""                             # Custom webhook URL (optional)

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Critical incident logging
incident_log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] INCIDENT: $1" | tee -a "$INCIDENT_LOG"
    log "🚨 SECURITY INCIDENT: $1"
}

# Error handling function
handle_error() {
    log "❌ ERROR: $1"
    return 1
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
        return 1
    fi
    
    echo "$response"
}

# Email notification function
send_email_alert() {
    local subject="$1"
    local message="$2"
    local priority="${3:-normal}"
    
    if [ -n "$EMAIL_ALERTS" ] && command -v mail >/dev/null 2>&1; then
        {
            echo "GiftSync Security Alert"
            echo "======================="
            echo ""
            echo "Time: $(date '+%Y-%m-%d %H:%M:%S UTC')"
            echo "Priority: $priority"
            echo "Domains: ${DOMAINS[*]}"
            echo ""
            echo "Alert Details:"
            echo "$message"
            echo ""
            echo "This is an automated security alert from the GiftSync monitoring system."
            echo "Please review the incident immediately if marked as critical."
        } | mail -s "$subject" "$EMAIL_ALERTS"
        
        log "📧 Email alert sent to $EMAIL_ALERTS"
    else
        log "⚠️ Email alerts not configured or mail command not available"
    fi
}

# Slack notification function
send_slack_alert() {
    local message="$1"
    local priority="${2:-normal}"
    
    if [ -n "$SLACK_WEBHOOK" ]; then
        local color="good"
        local emoji="ℹ️"
        
        case "$priority" in
            "critical") color="danger"; emoji="🚨" ;;
            "warning") color="warning"; emoji="⚠️" ;;
            "info") color="good"; emoji="ℹ️" ;;
        esac
        
        local payload=$(jq -n \
            --arg text "$emoji GiftSync Security Alert" \
            --arg color "$color" \
            --arg message "$message" \
            --arg timestamp "$(date '+%Y-%m-%d %H:%M:%S UTC')" \
            '{\n              text: $text,\n              attachments: [{\n                color: $color,\n                fields: [\n                  {title: \"Message\", value: $message, short: false},\n                  {title: \"Time\", value: $timestamp, short: true},\n                  {title: \"Domains\", value: \"aclue.co.uk, aclue.app\", short: true}\n                ]\n              }]\n            }')\n        \n        if curl -s -X POST \"$SLACK_WEBHOOK\" \\\n            -H \"Content-Type: application/json\" \\\n            --data \"$payload\" >/dev/null; then\n            log \"💬 Slack alert sent\"\n        else\n            log \"❌ Failed to send Slack alert\"\n        fi\n    fi\n}\n\n# Webhook notification function\nsend_webhook_alert() {\n    local event_type=\"$1\"\n    local message=\"$2\"\n    local priority=\"${3:-normal}\"\n    local domain=\"${4:-all}\"\n    \n    if [ -n \"$WEBHOOK_URL\" ]; then\n        local payload=$(jq -n \\\n            --arg event_type \"$event_type\" \\\n            --arg message \"$message\" \\\n            --arg priority \"$priority\" \\\n            --arg domain \"$domain\" \\\n            --arg timestamp \"$(date -u '+%Y-%m-%dT%H:%M:%SZ')\" \\\n            '{\n              event_type: $event_type,\n              message: $message,\n              priority: $priority,\n              domain: $domain,\n              timestamp: $timestamp,\n              source: \"giftsync-security-monitor\"\n            }')\n        \n        if curl -s -X POST \"$WEBHOOK_URL\" \\\n            -H \"Content-Type: application/json\" \\\n            --data \"$payload\" >/dev/null; then\n            log \"🔗 Webhook alert sent\"\n        else\n            log \"❌ Failed to send webhook alert\"\n        fi\n    fi\n}\n\n# Master alert function\nsend_alert() {\n    local event_type=\"$1\"\n    local message=\"$2\"\n    local priority=\"${3:-normal}\"\n    local domain=\"${4:-all}\"\n    \n    # Always log the alert\n    case \"$priority\" in\n        \"critical\") incident_log \"$message\" ;;\n        *) log \"🔔 ALERT ($priority): $message\" ;;\n    esac\n    \n    # Send notifications based on priority\n    case \"$priority\" in\n        \"critical\")\n            send_email_alert \"[CRITICAL] GiftSync Security Alert\" \"$message\" \"$priority\"\n            send_slack_alert \"$message\" \"$priority\"\n            send_webhook_alert \"$event_type\" \"$message\" \"$priority\" \"$domain\"\n            ;;\n        \"warning\")\n            send_email_alert \"[WARNING] GiftSync Security Alert\" \"$message\" \"$priority\"\n            send_slack_alert \"$message\" \"$priority\"\n            send_webhook_alert \"$event_type\" \"$message\" \"$priority\" \"$domain\"\n            ;;\n        \"info\")\n            send_webhook_alert \"$event_type\" \"$message\" \"$priority\" \"$domain\"\n            ;;\n    esac\n}\n\n# Function to initialize state file\ninit_state_file() {\n    if [ ! -f \"$STATE_FILE\" ]; then\n        echo '{}' > \"$STATE_FILE\"\n    fi\n}\n\n# Function to get previous state\nget_previous_state() {\n    local key=\"$1\"\n    jq -r --arg key \"$key\" '.[$key] // \"0\"' \"$STATE_FILE\" 2>/dev/null || echo \"0\"\n}\n\n# Function to update state\nupdate_state() {\n    local key=\"$1\"\n    local value=\"$2\"\n    local temp_file=\"${STATE_FILE}.tmp\"\n    \n    jq --arg key \"$key\" --arg value \"$value\" '.[$key] = $value' \"$STATE_FILE\" > \"$temp_file\" && mv \"$temp_file\" \"$STATE_FILE\"\n}\n\n# Function to check SSL certificate expiry\ncheck_ssl_expiry() {\n    local domain=\"$1\"\n    \n    local ssl_info=$(echo | openssl s_client -servername \"$domain\" -connect \"$domain:443\" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null || echo \"SSL_ERROR\")\n    \n    if [[ \"$ssl_info\" != \"SSL_ERROR\" ]]; then\n        local expiry=$(echo \"$ssl_info\" | grep \"notAfter\" | cut -d= -f2)\n        local expiry_timestamp=$(date -d \"$expiry\" +%s 2>/dev/null || echo \"0\")\n        local current_timestamp=$(date +%s)\n        local days_until_expiry=$(( (expiry_timestamp - current_timestamp) / 86400 ))\n        \n        if [ \"$days_until_expiry\" -le \"$SSL_EXPIRY_WARNING_DAYS\" ] && [ \"$days_until_expiry\" -gt 0 ]; then\n            send_alert \"ssl_expiry_warning\" \\\n                \"SSL certificate for $domain expires in $days_until_expiry days. Please renew immediately.\" \\\n                \"warning\" \"$domain\"\n        elif [ \"$days_until_expiry\" -le 0 ]; then\n            send_alert \"ssl_expired\" \\\n                \"SSL certificate for $domain has EXPIRED. Immediate action required.\" \\\n                \"critical\" \"$domain\"\n        fi\n    else\n        send_alert \"ssl_check_failed\" \\\n            \"Unable to check SSL certificate for $domain. Manual verification required.\" \\\n            \"warning\" \"$domain\"\n    fi\n}\n\n# Function to monitor firewall events\nmonitor_firewall_events() {\n    local domain=\"$1\"\n    local zone_id=\"$2\"\n    \n    # Get firewall events from last 5 minutes\n    local since=$(date -d '5 minutes ago' -u '+%Y-%m-%dT%H:%M:%SZ')\n    local until=$(date -u '+%Y-%m-%dT%H:%M:%SZ')\n    \n    local firewall_response=$(cloudflare_api \"GET\" \"https://api.cloudflare.com/client/v4/zones/$zone_id/firewall/events?since=$since&until=$until\" \"\" \"Firewall events check\")\n    \n    if [ \"$?\" -eq 0 ]; then\n        local blocked_requests=$(echo \"$firewall_response\" | jq -r '.result | length // 0')\n        local previous_blocks=$(get_previous_state \"${domain}_blocks\")\n        \n        # Check for sudden spike in blocked requests\n        if [ \"$blocked_requests\" -gt \"$CRITICAL_BLOCKED_REQUESTS_THRESHOLD\" ]; then\n            # Get attack types\n            local attack_types=$(echo \"$firewall_response\" | jq -r '.result[].action' | sort | uniq -c | sort -rn | head -3)\n            \n            send_alert \"high_blocked_requests\" \\\n                \"High number of blocked requests detected for $domain: $blocked_requests in 5 minutes. Attack types: $attack_types\" \\\n                \"critical\" \"$domain\"\n        fi\n        \n        # Check for new attack patterns\n        local unique_countries=$(echo \"$firewall_response\" | jq -r '.result[].country' | sort | uniq | wc -l)\n        if [ \"$unique_countries\" -gt 10 ]; then\n            send_alert \"distributed_attack\" \\\n                \"Distributed attack detected on $domain from $unique_countries different countries\" \\\n                \"warning\" \"$domain\"\n        fi\n        \n        update_state \"${domain}_blocks\" \"$blocked_requests\"\n    fi\n}\n\n# Function to monitor traffic patterns\nmonitor_traffic_patterns() {\n    local domain=\"$1\"\n    local zone_id=\"$2\"\n    \n    # Get analytics for the last 5 minutes\n    local analytics_response=$(cloudflare_api \"GET\" \"https://api.cloudflare.com/client/v4/zones/$zone_id/analytics/dashboard?since=-5&until=0\" \"\" \"Traffic analytics\")\n    \n    if [ \"$?\" -eq 0 ]; then\n        local total_requests=$(echo \"$analytics_response\" | jq -r '.result.totals.requests.all // 0')\n        local cached_requests=$(echo \"$analytics_response\" | jq -r '.result.totals.requests.cached // 0')\n        local uncached_requests=$(echo \"$analytics_response\" | jq -r '.result.totals.requests.uncached // 0')\n        \n        # Check for traffic spike\n        if [ \"$total_requests\" -gt \"$HIGH_TRAFFIC_THRESHOLD\" ]; then\n            local cache_ratio=0\n            if [ \"$total_requests\" -gt 0 ]; then\n                cache_ratio=$(echo \"scale=2; $cached_requests * 100 / $total_requests\" | bc -l)\n            fi\n            \n            send_alert \"high_traffic\" \\\n                \"High traffic detected on $domain: $total_requests requests in 5 minutes (Cache ratio: ${cache_ratio}%)\" \\\n                \"warning\" \"$domain\"\n        fi\n        \n        # Check for potential DDoS (very high uncached requests)\n        if [ \"$uncached_requests\" -gt \"$DDoS_THRESHOLD\" ]; then\n            send_alert \"potential_ddos\" \\\n                \"Potential DDoS attack on $domain: $uncached_requests uncached requests in 5 minutes\" \\\n                \"critical\" \"$domain\"\n        fi\n        \n        update_state \"${domain}_requests\" \"$total_requests\"\n    fi\n}\n\n# Function to check zone security settings changes\ncheck_security_settings_changes() {\n    local domain=\"$1\"\n    local zone_id=\"$2\"\n    \n    # Get current security level\n    local security_response=$(cloudflare_api \"GET\" \"https://api.cloudflare.com/client/v4/zones/$zone_id/settings/security_level\" \"\" \"Security level check\")\n    local current_security_level=$(echo \"$security_response\" | jq -r '.result.value')\n    local previous_security_level=$(get_previous_state \"${domain}_security_level\")\n    \n    if [ \"$current_security_level\" != \"$previous_security_level\" ] && [ \"$previous_security_level\" != \"0\" ]; then\n        send_alert \"security_level_changed\" \\\n            \"Security level changed for $domain: $previous_security_level → $current_security_level\" \\\n            \"info\" \"$domain\"\n    fi\n    \n    update_state \"${domain}_security_level\" \"$current_security_level\"\n    \n    # Check SSL mode\n    local ssl_response=$(cloudflare_api \"GET\" \"https://api.cloudflare.com/client/v4/zones/$zone_id/settings/ssl\" \"\" \"SSL mode check\")\n    local current_ssl_mode=$(echo \"$ssl_response\" | jq -r '.result.value')\n    local previous_ssl_mode=$(get_previous_state \"${domain}_ssl_mode\")\n    \n    if [ \"$current_ssl_mode\" != \"$previous_ssl_mode\" ] && [ \"$previous_ssl_mode\" != \"0\" ]; then\n        local priority=\"warning\"\n        if [ \"$current_ssl_mode\" = \"off\" ] || [ \"$current_ssl_mode\" = \"flexible\" ]; then\n            priority=\"critical\"\n        fi\n        \n        send_alert \"ssl_mode_changed\" \\\n            \"SSL mode changed for $domain: $previous_ssl_mode → $current_ssl_mode\" \\\n            \"$priority\" \"$domain\"\n    fi\n    \n    update_state \"${domain}_ssl_mode\" \"$current_ssl_mode\"\n}\n\n# Function to perform health check\nperform_health_check() {\n    local domain=\"$1\"\n    \n    local http_status=$(curl -s -o /dev/null -w \"%{http_code}\" \"https://$domain\" --max-time 10 2>/dev/null || echo \"000\")\n    local response_time=$(curl -s -o /dev/null -w \"%{time_total}\" \"https://$domain\" --max-time 10 2>/dev/null || echo \"999\")\n    \n    # Check if site is down\n    if [[ ! \"$http_status\" =~ ^[23][0-9][0-9]$ ]]; then\n        send_alert \"site_down\" \\\n            \"$domain is returning HTTP $http_status. Site may be down or experiencing issues.\" \\\n            \"critical\" \"$domain\"\n    fi\n    \n    # Check for slow response times\n    if (( $(echo \"$response_time > 5.0\" | bc -l) )); then\n        send_alert \"slow_response\" \\\n            \"$domain is responding slowly: ${response_time}s response time\" \\\n            \"warning\" \"$domain\"\n    fi\n    \n    update_state \"${domain}_status\" \"$http_status\"\n    update_state \"${domain}_response_time\" \"$response_time\"\n}\n\n# Main monitoring loop\nlog \"🚨 Starting security incident monitoring and alerting system...\"\nlog \"📝 Alert log: $LOG_FILE\"\nlog \"📊 Incident log: $INCIDENT_LOG\"\n\n# Initialize state file\ninit_state_file\n\n# Ensure incident log exists and is writable\ntouch \"$INCIDENT_LOG\" 2>/dev/null || INCIDENT_LOG=\"/tmp/giftsync-security-incidents.log\"\n\nfor domain in \"${DOMAINS[@]}\"; do\n    log \"🔍 Monitoring security for $domain...\"\n    \n    # Get zone ID\n    ZONE_RESPONSE=$(cloudflare_api \"GET\" \"https://api.cloudflare.com/client/v4/zones?name=$domain\" \"\" \"Zone lookup for $domain\")\n    ZONE_ID=$(echo \"$ZONE_RESPONSE\" | jq -r '.result[0].id // \"null\"')\n    \n    if [ \"$ZONE_ID\" = \"null\" ]; then\n        send_alert \"zone_lookup_failed\" \\\n            \"Could not find Cloudflare zone for $domain\" \\\n            \"critical\" \"$domain\"\n        continue\n    fi\n    \n    log \"✅ Found zone ID: $ZONE_ID for $domain\"\n    \n    # Perform all security checks\n    check_ssl_expiry \"$domain\"\n    monitor_firewall_events \"$domain\" \"$ZONE_ID\"\n    monitor_traffic_patterns \"$domain\" \"$ZONE_ID\"\n    check_security_settings_changes \"$domain\" \"$ZONE_ID\"\n    perform_health_check \"$domain\"\n    \n    log \"✅ Security monitoring completed for $domain\"\ndone\n\n# Generate monitoring summary\nlog \"\"\nlog \"📊 MONITORING SUMMARY:\"\nlog \"✅ SSL certificate expiry checked\"\nlog \"✅ Firewall events monitored\"\nlog \"✅ Traffic patterns analysed\"\nlog \"✅ Security settings changes tracked\"\nlog \"✅ Health checks performed\"\nlog \"\"\nlog \"🔔 Alert channels configured:\"\n[ -n \"$EMAIL_ALERTS\" ] && log \"  📧 Email: $EMAIL_ALERTS\"\n[ -n \"$SLACK_WEBHOOK\" ] && log \"  💬 Slack: Configured\"\n[ -n \"$WEBHOOK_URL\" ] && log \"  🔗 Webhook: Configured\"\nlog \"\"\n\n# Final status\nlog \"🎉 Security monitoring cycle completed successfully!\"\nlog \"⏰ Next monitoring cycle: Run this script every 5 minutes for optimal coverage\"\nlog \"📋 Configure as cron job: */5 * * * * /path/to/security-alerts.sh\"\n\n# Cleanup old state if needed (keep last 24 hours)\nfind /tmp -name \"security-alert-state.json.old*\" -mtime +1 -delete 2>/dev/null || true"