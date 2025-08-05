#!/bin/bash

# Comprehensive Health Check Script
# Used by CI/CD pipeline and monitoring systems

set -euo pipefail

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/../.env"

# Configuration from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"
TIMEOUT=10
MAX_RESPONSE_TIME=3.0
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/health-check-$(date +%Y%m%d-%H%M%S).log"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$level] $message" | tee -a "$LOG_FILE"
    
    case "$level" in
        "ERROR")   echo -e "${RED}❌ $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO")    echo -e "${BLUE}ℹ️  $message${NC}" ;;
    esac
}

# Domain health check
check_domain_health() {
    local domain="$1"
    local issues=()
    
    log "INFO" "Checking $domain"
    
    # Basic HTTP check
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "https://$domain" || echo "000")
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "https://$domain" || echo "999")
    
    if [[ "$http_status" != "200" ]]; then
        issues+=("HTTP status: $http_status")
    fi
    
    if (( $(echo "$response_time > $MAX_RESPONSE_TIME" | bc -l 2>/dev/null || echo 1) )); then
        issues+=("Slow response: ${response_time}s")
    fi
    
    # SSL certificate check
    local ssl_expiry=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | \
        openssl x509 -noout -dates 2>/dev/null | grep "notAfter" | cut -d= -f2 || echo "")
    
    if [[ -n "$ssl_expiry" ]]; then
        local expiry_epoch=$(date -d "$ssl_expiry" +%s 2>/dev/null || echo 0)
        local current_epoch=$(date +%s)
        local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))
        
        if [[ $days_until_expiry -lt 30 ]]; then
            issues+=("SSL expires in $days_until_expiry days")
        fi
    fi
    
    # Security headers check
    local headers=$(curl -sI "https://$domain" --max-time "$TIMEOUT" 2>/dev/null || echo "")
    
    if ! echo "$headers" | grep -qi "x-frame-options"; then
        issues+=("Missing X-Frame-Options")
    fi
    
    if ! echo "$headers" | grep -qi "x-content-type-options"; then
        issues+=("Missing X-Content-Type-Options")
    fi
    
    if ! echo "$headers" | grep -qi "strict-transport-security"; then
        issues+=("Missing HSTS header")
    fi
    
    # Report results
    if [[ ${#issues[@]} -eq 0 ]]; then
        log "SUCCESS" "$domain - All checks passed (${response_time}s)"
        return 0
    else
        log "ERROR" "$domain - Issues found:"
        for issue in "${issues[@]}"; do
            log "ERROR" "  • $issue"
        done
        return 1
    fi
}

# Backend health check
check_backend_health() {
    log "INFO" "Checking backend health"
    
    local issues=()
    
    # Health endpoint check
    local health_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$RAILWAY_BACKEND_URL/health" 2>/dev/null || echo "000")
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "$RAILWAY_BACKEND_URL/health" 2>/dev/null || echo "999")
    
    if [[ "$health_status" == "200" ]]; then
        log "SUCCESS" "Backend health check passed (${response_time}s)"
    else
        issues+=("Health endpoint status: $health_status")
    fi
    
    # API endpoints check
    local api_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "$RAILWAY_BACKEND_URL/api/v1/products" 2>/dev/null || echo "000")
    
    if [[ "$api_status" == "401" || "$api_status" == "200" ]]; then
        log "SUCCESS" "API endpoints responding correctly"
    else
        issues+=("API endpoint status: $api_status")
    fi
    
    if [[ ${#issues[@]} -eq 0 ]]; then
        return 0
    else
        for issue in "${issues[@]}"; do
            log "ERROR" "Backend issue: $issue"
        done
        return 1
    fi
}

# Database connectivity check
check_database_connectivity() {
    log "INFO" "Checking database connectivity via backend"
    
    # Test database connection through backend
    local db_check=$(curl -s --max-time "$TIMEOUT" "$RAILWAY_BACKEND_URL/api/v1/health/db" 2>/dev/null || echo '{"status":"error"}')
    local db_status=$(echo "$db_check" | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('status', 'unknown'))" 2>/dev/null || echo "unknown")
    
    if [[ "$db_status" == "healthy" || "$db_status" == "ok" ]]; then
        log "SUCCESS" "Database connectivity verified"
        return 0
    else
        log "WARNING" "Database connectivity check inconclusive: $db_status"
        return 1
    fi
}

# CDN performance check
check_cdn_performance() {
    log "INFO" "Checking CDN performance"
    
    for domain in "${DOMAINS[@]}"; do
        # Check if content is being served from CDN
        local cf_ray=$(curl -sI "https://$domain" --max-time "$TIMEOUT" 2>/dev/null | grep -i "cf-ray" || echo "")
        
        if [[ -n "$cf_ray" ]]; then
            log "SUCCESS" "$domain served via Cloudflare CDN"
        else
            log "WARNING" "$domain may not be using CDN"
        fi
        
        # Check cache status
        local cache_status=$(curl -sI "https://$domain" --max-time "$TIMEOUT" 2>/dev/null | grep -i "cf-cache-status" | cut -d' ' -f2 | tr -d '\r' || echo "UNKNOWN")
        log "INFO" "$domain cache status: $cache_status"
    done
}

# Generate JSON report
generate_json_report() {
    local overall_status="$1"
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    
    cat > "$LOG_FILE.json" << EOF
{
  "timestamp": "$timestamp",
  "overall_status": "$overall_status",
  "domains": [
$(for domain in "${DOMAINS[@]}"; do
    local http_status=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" "https://$domain" 2>/dev/null || echo "000")
    local response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" "https://$domain" 2>/dev/null || echo "999")
    
    cat << DOMAIN_EOF
    {
      "domain": "$domain",
      "http_status": $http_status,
      "response_time": $response_time,
      "healthy": $(if [[ "$http_status" == "200" && $(echo "$response_time < $MAX_RESPONSE_TIME" | bc -l 2>/dev/null || echo 0) == "1" ]]; then echo "true"; else echo "false"; fi)
    }$(if [[ "$domain" != "${DOMAINS[-1]}" ]]; then echo ","; fi)
DOMAIN_EOF
done)
  ],
  "backend": {
    "url": "$RAILWAY_BACKEND_URL",
    "healthy": $(if check_backend_health >/dev/null 2>&1; then echo "true"; else echo "false"; fi)
  },
  "log_file": "$LOG_FILE"
}
EOF
    
    log "INFO" "JSON report generated: $LOG_FILE.json"
}

# Main health check
main() {
    local overall_healthy=true
    
    log "INFO" "Starting comprehensive health check"
    log "INFO" "Log file: $LOG_FILE"
    
    # Domain checks
    for domain in "${DOMAINS[@]}"; do
        if ! check_domain_health "$domain"; then
            overall_healthy=false
        fi
    done
    
    # Backend check
    if ! check_backend_health; then
        overall_healthy=false
    fi
    
    # Database check
    check_database_connectivity || true  # Don't fail on DB check
    
    # CDN performance check
    check_cdn_performance
    
    # Generate report
    local status=$([[ "$overall_healthy" == "true" ]] && echo "healthy" || echo "unhealthy")
    generate_json_report "$status"
    
    # Summary
    if [[ "$overall_healthy" == "true" ]]; then
        log "SUCCESS" "All health checks passed"
        echo "HEALTH_CHECK_STATUS=success" >> "$GITHUB_OUTPUT" 2>/dev/null || true
        exit 0
    else
        log "ERROR" "Some health checks failed"
        echo "HEALTH_CHECK_STATUS=failure" >> "$GITHUB_OUTPUT" 2>/dev/null || true
        exit 1
    fi
}

# Handle command line arguments
case "${1:-main}" in
    "domain")
        check_domain_health "${2:-aclue.co.uk}"
        ;;
    "backend")
        check_backend_health
        ;;
    "database")
        check_database_connectivity
        ;;
    "cdn")
        check_cdn_performance
        ;;
    "json-only")
        main > /dev/null 2>&1 || true
        cat "$LOG_FILE.json"
        ;;
    "main"|*)
        main
        ;;
esac