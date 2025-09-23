#!/bin/bash

# ================================================================
# ACLUE TESTING MONITORING DASHBOARD
# ================================================================
# Real-time monitoring dashboard for the testing automation suite
# Provides live status updates, metrics tracking, and alerting
# Designed for operations teams and continuous monitoring
# ================================================================

set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_NAME="Aclue Testing Monitoring Dashboard"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly MONITORING_DIR="${SCRIPT_DIR}/monitoring/${TIMESTAMP}"

# Configuration
readonly REFRESH_INTERVAL=30  # seconds
readonly ALERT_THRESHOLD_FAILURES=3
readonly ALERT_THRESHOLD_RESPONSE_TIME=5000  # milliseconds
readonly HISTORY_RETENTION_DAYS=30

# URLs
readonly FRONTEND_URL="${FRONTEND_URL:-https://aclue.app}"
readonly BACKEND_URL="${BACKEND_URL:-https://aclue-backend-production.up.railway.app}"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# Monitoring state
declare -A CURRENT_STATUS=()
declare -A METRICS_HISTORY=()
declare -A ALERT_COUNTS=()
MONITORING_ACTIVE=true
DASHBOARD_MODE="live"  # live, history, alerts

# ================================================================
# UTILITY FUNCTIONS
# ================================================================

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")     echo -e "${CYAN}[${timestamp}] [INFO]${NC} $message" ;;
        "WARN")     echo -e "${YELLOW}[${timestamp}] [WARN]${NC} $message" ;;
        "ERROR")    echo -e "${RED}[${timestamp}] [ERROR]${NC} $message" ;;
        "SUCCESS")  echo -e "${GREEN}[${timestamp}] [SUCCESS]${NC} $message" ;;
        "ALERT")    echo -e "${RED}${BOLD}[${timestamp}] [ALERT]${NC} $message" ;;
        "METRIC")   echo -e "${BLUE}[${timestamp}] [METRIC]${NC} $message" ;;
        *) echo -e "${WHITE}[${timestamp}]${NC} $message" ;;
    esac

    # Log to file
    mkdir -p "$MONITORING_DIR"
    echo "[${timestamp}] [$level] $message" >> "${MONITORING_DIR}/monitoring.log"
}

setup_monitoring() {
    mkdir -p "$MONITORING_DIR"/{metrics,alerts,history,reports}
    log "INFO" "Monitoring dashboard initialized"
    log "INFO" "Dashboard mode: $DASHBOARD_MODE"
    log "INFO" "Refresh interval: ${REFRESH_INTERVAL}s"
}

# ================================================================
# MONITORING FUNCTIONS
# ================================================================

check_frontend_status() {
    local start_time=$(date +%s.%N)
    local status="UNKNOWN"
    local response_time=0
    local status_code=0

    if response=$(curl -w "%{http_code}|%{time_total}" -s --max-time 10 "$FRONTEND_URL" 2>/dev/null); then
        IFS='|' read -r status_code response_time_str <<< "$(echo "$response" | tail -1)"
        response_time=$(echo "$response_time_str * 1000" | bc 2>/dev/null || echo "0")

        if [[ "$status_code" == "200" ]]; then
            if (( $(echo "$response_time <= 3000" | bc -l) )); then
                status="HEALTHY"
            else
                status="SLOW"
            fi
        else
            status="UNHEALTHY"
        fi
    else
        status="UNREACHABLE"
        response_time=9999
    fi

    CURRENT_STATUS["frontend_status"]="$status"
    CURRENT_STATUS["frontend_response_time"]="$response_time"
    CURRENT_STATUS["frontend_status_code"]="$status_code"

    # Log metric
    log "METRIC" "Frontend: $status (${response_time}ms, HTTP $status_code)"

    return 0
}

check_backend_status() {
    local status="UNKNOWN"
    local response_time=0
    local status_code=0

    # Check health endpoint
    if response=$(curl -w "%{http_code}|%{time_total}" -s --max-time 10 "$BACKEND_URL/health" 2>/dev/null); then
        IFS='|' read -r status_code response_time_str <<< "$(echo "$response" | tail -1)"
        response_time=$(echo "$response_time_str * 1000" | bc 2>/dev/null || echo "0")

        if [[ "$status_code" == "200" ]]; then
            # Check if response contains expected health data
            if echo "$response" | grep -q "status\|health"; then
                status="HEALTHY"
            else
                status="DEGRADED"
            fi
        else
            status="UNHEALTHY"
        fi
    else
        status="UNREACHABLE"
        response_time=9999
    fi

    CURRENT_STATUS["backend_status"]="$status"
    CURRENT_STATUS["backend_response_time"]="$response_time"
    CURRENT_STATUS["backend_status_code"]="$status_code"

    # Test critical API endpoints
    local api_endpoints=("/api/v1/products/" "/api/v1/categories/")
    local api_failures=0

    for endpoint in "${api_endpoints[@]}"; do
        if ! curl -f -s --max-time 5 "$BACKEND_URL$endpoint" >/dev/null 2>&1; then
            ((api_failures++))
        fi
    done

    CURRENT_STATUS["backend_api_failures"]="$api_failures"

    # Log metric
    log "METRIC" "Backend: $status (${response_time}ms, API failures: $api_failures)"

    return 0
}

check_security_status() {
    local status="UNKNOWN"
    local last_scan_time="never"
    local critical_issues=0

    # Check for recent security scan results
    local latest_security_result=""
    if [[ -d "${SCRIPT_DIR}/results" ]]; then
        latest_security_result=$(find "${SCRIPT_DIR}/results" -name "*security*" -type d -newer "$(date -d '24 hours ago' '+%Y-%m-%d')" | head -1)
    fi

    if [[ -n "$latest_security_result" ]]; then
        # Parse security results if available
        local security_json=""
        if [[ -f "$latest_security_result/security-summary.json" ]]; then
            security_json="$latest_security_result/security-summary.json"
        elif [[ -f "$latest_security_result/summary.json" ]]; then
            security_json="$latest_security_result/summary.json"
        fi

        if [[ -n "$security_json" ]]; then
            critical_issues=$(jq '.statistics.critical_issues // 0' "$security_json" 2>/dev/null || echo "0")
            last_scan_time=$(jq -r '.timestamp // "unknown"' "$security_json" 2>/dev/null || echo "unknown")

            if [[ $critical_issues -eq 0 ]]; then
                status="SECURE"
            elif [[ $critical_issues -le 2 ]]; then
                status="MINOR_ISSUES"
            else
                status="CRITICAL_ISSUES"
            fi
        else
            status="NO_DATA"
        fi
    else
        status="STALE"
    fi

    CURRENT_STATUS["security_status"]="$status"
    CURRENT_STATUS["security_critical_issues"]="$critical_issues"
    CURRENT_STATUS["security_last_scan"]="$last_scan_time"

    # Log metric
    log "METRIC" "Security: $status (Critical issues: $critical_issues, Last scan: $last_scan_time)"

    return 0
}

check_testing_pipeline_status() {
    local status="UNKNOWN"
    local last_run_time="never"
    local success_rate=0

    # Check for recent test results
    local latest_test_result=""
    if [[ -d "${SCRIPT_DIR}/results" ]]; then
        latest_test_result=$(find "${SCRIPT_DIR}/results" -name "execution-summary.json" -newer "$(date -d '6 hours ago' '+%Y-%m-%d')" | head -1)
    fi

    if [[ -n "$latest_test_result" ]]; then
        success_rate=$(jq '.statistics.success_rate // 0' "$latest_test_result" 2>/dev/null || echo "0")
        last_run_time=$(jq -r '.metadata.timestamp // "unknown"' "$latest_test_result" 2>/dev/null || echo "unknown")

        if [[ $success_rate -ge 95 ]]; then
            status="EXCELLENT"
        elif [[ $success_rate -ge 80 ]]; then
            status="GOOD"
        elif [[ $success_rate -ge 60 ]]; then
            status="DEGRADED"
        else
            status="FAILING"
        fi
    else
        status="STALE"
    fi

    CURRENT_STATUS["testing_status"]="$status"
    CURRENT_STATUS["testing_success_rate"]="$success_rate"
    CURRENT_STATUS["testing_last_run"]="$last_run_time"

    # Log metric
    log "METRIC" "Testing Pipeline: $status (Success rate: $success_rate%, Last run: $last_run_time)"

    return 0
}

# ================================================================
# ALERTING FUNCTIONS
# ================================================================

check_alerts() {
    local alerts_triggered=0

    # Frontend alerts
    if [[ "${CURRENT_STATUS[frontend_status]}" == "UNREACHABLE" || "${CURRENT_STATUS[frontend_status]}" == "UNHEALTHY" ]]; then
        trigger_alert "FRONTEND_DOWN" "Frontend is unreachable or unhealthy"
        ((alerts_triggered++))
    fi

    # Backend alerts
    if [[ "${CURRENT_STATUS[backend_status]}" == "UNREACHABLE" || "${CURRENT_STATUS[backend_status]}" == "UNHEALTHY" ]]; then
        trigger_alert "BACKEND_DOWN" "Backend API is unreachable or unhealthy"
        ((alerts_triggered++))
    fi

    # Response time alerts
    local frontend_time="${CURRENT_STATUS[frontend_response_time]}"
    local backend_time="${CURRENT_STATUS[backend_response_time]}"

    if [[ -n "$frontend_time" ]] && (( $(echo "$frontend_time > $ALERT_THRESHOLD_RESPONSE_TIME" | bc -l) )); then
        trigger_alert "FRONTEND_SLOW" "Frontend response time is ${frontend_time}ms (threshold: ${ALERT_THRESHOLD_RESPONSE_TIME}ms)"
        ((alerts_triggered++))
    fi

    if [[ -n "$backend_time" ]] && (( $(echo "$backend_time > $ALERT_THRESHOLD_RESPONSE_TIME" | bc -l) )); then
        trigger_alert "BACKEND_SLOW" "Backend response time is ${backend_time}ms (threshold: ${ALERT_THRESHOLD_RESPONSE_TIME}ms)"
        ((alerts_triggered++))
    fi

    # Security alerts
    local critical_issues="${CURRENT_STATUS[security_critical_issues]}"
    if [[ -n "$critical_issues" ]] && [[ $critical_issues -gt 0 ]]; then
        trigger_alert "SECURITY_CRITICAL" "Critical security issues detected: $critical_issues"
        ((alerts_triggered++))
    fi

    # Testing pipeline alerts
    local success_rate="${CURRENT_STATUS[testing_success_rate]}"
    if [[ -n "$success_rate" ]] && [[ $success_rate -lt 80 ]]; then
        trigger_alert "TESTING_DEGRADED" "Testing success rate degraded: $success_rate%"
        ((alerts_triggered++))
    fi

    return $alerts_triggered
}

trigger_alert() {
    local alert_type="$1"
    local alert_message="$2"
    local timestamp=$(date -Iseconds)

    # Increment alert count
    local current_count="${ALERT_COUNTS[$alert_type]:-0}"
    ALERT_COUNTS["$alert_type"]=$((current_count + 1))

    # Log alert
    log "ALERT" "$alert_type: $alert_message"

    # Save alert to file
    cat >> "${MONITORING_DIR}/alerts/alerts.json" << EOF
{
  "timestamp": "$timestamp",
  "type": "$alert_type",
  "message": "$alert_message",
  "count": ${ALERT_COUNTS[$alert_type]}
}
EOF

    # Send external notifications if configured
    send_alert_notification "$alert_type" "$alert_message"
}

send_alert_notification() {
    local alert_type="$1"
    local alert_message="$2"

    # Slack notification
    if [[ -n "${SLACK_WEBHOOK:-}" ]]; then
        local color="danger"
        local emoji="🚨"

        curl -s -X POST -H 'Content-type: application/json' \
            --data "{
                \"attachments\": [
                    {
                        \"color\": \"$color\",
                        \"title\": \"$emoji Aclue Monitoring Alert\",
                        \"fields\": [
                            {\"title\": \"Alert Type\", \"value\": \"$alert_type\", \"short\": true},
                            {\"title\": \"Message\", \"value\": \"$alert_message\", \"short\": false},
                            {\"title\": \"Timestamp\", \"value\": \"$(date)\", \"short\": true}
                        ],
                        \"footer\": \"Aclue Monitoring Dashboard\"
                    }
                ]
            }" \
            "$SLACK_WEBHOOK" >/dev/null 2>&1 || true
    fi
}

# ================================================================
# DASHBOARD DISPLAY
# ================================================================

clear_screen() {
    clear
}

display_header() {
    echo -e "${BOLD}${BLUE}"
    echo "================================================================"
    echo "              ACLUE TESTING MONITORING DASHBOARD"
    echo "================================================================"
    echo -e "Last Update: $(date '+%Y-%m-%d %H:%M:%S')"
    echo -e "Refresh Interval: ${REFRESH_INTERVAL}s"
    echo -e "Mode: ${DASHBOARD_MODE}"
    echo "================================================================"
    echo -e "${NC}"
}

display_system_status() {
    echo -e "${BOLD}🔍 SYSTEM STATUS${NC}"
    echo

    # Frontend status
    local frontend_status="${CURRENT_STATUS[frontend_status]:-UNKNOWN}"
    local frontend_time="${CURRENT_STATUS[frontend_response_time]:-0}"
    local frontend_color="${GREEN}"

    case "$frontend_status" in
        "HEALTHY") frontend_color="${GREEN}" ;;
        "SLOW") frontend_color="${YELLOW}" ;;
        "UNHEALTHY"|"UNREACHABLE") frontend_color="${RED}" ;;
    esac

    printf "%-20s: %b%s%b (%sms)\n" "Frontend" "$frontend_color" "$frontend_status" "$NC" "$frontend_time"

    # Backend status
    local backend_status="${CURRENT_STATUS[backend_status]:-UNKNOWN}"
    local backend_time="${CURRENT_STATUS[backend_response_time]:-0}"
    local backend_failures="${CURRENT_STATUS[backend_api_failures]:-0}"
    local backend_color="${GREEN}"

    case "$backend_status" in
        "HEALTHY") backend_color="${GREEN}" ;;
        "DEGRADED") backend_color="${YELLOW}" ;;
        "UNHEALTHY"|"UNREACHABLE") backend_color="${RED}" ;;
    esac

    printf "%-20s: %b%s%b (%sms, %s API failures)\n" "Backend" "$backend_color" "$backend_status" "$NC" "$backend_time" "$backend_failures"

    # Security status
    local security_status="${CURRENT_STATUS[security_status]:-UNKNOWN}"
    local security_issues="${CURRENT_STATUS[security_critical_issues]:-0}"
    local security_color="${GREEN}"

    case "$security_status" in
        "SECURE") security_color="${GREEN}" ;;
        "MINOR_ISSUES") security_color="${YELLOW}" ;;
        "CRITICAL_ISSUES") security_color="${RED}" ;;
        "STALE"|"NO_DATA") security_color="${YELLOW}" ;;
    esac

    printf "%-20s: %b%s%b (%s critical issues)\n" "Security" "$security_color" "$security_status" "$NC" "$security_issues"

    # Testing pipeline status
    local testing_status="${CURRENT_STATUS[testing_status]:-UNKNOWN}"
    local testing_rate="${CURRENT_STATUS[testing_success_rate]:-0}"
    local testing_color="${GREEN}"

    case "$testing_status" in
        "EXCELLENT") testing_color="${GREEN}" ;;
        "GOOD") testing_color="${GREEN}" ;;
        "DEGRADED") testing_color="${YELLOW}" ;;
        "FAILING") testing_color="${RED}" ;;
        "STALE") testing_color="${YELLOW}" ;;
    esac

    printf "%-20s: %b%s%b (%s%% success rate)\n" "Testing Pipeline" "$testing_color" "$testing_status" "$NC" "$testing_rate"

    echo
}

display_active_alerts() {
    echo -e "${BOLD}🚨 ACTIVE ALERTS${NC}"
    echo

    if [[ ${#ALERT_COUNTS[@]} -eq 0 ]]; then
        echo -e "${GREEN}✅ No active alerts${NC}"
    else
        for alert_type in "${!ALERT_COUNTS[@]}"; do
            local count="${ALERT_COUNTS[$alert_type]}"
            printf "%-30s: %b%s%b\n" "$alert_type" "$RED" "$count alerts" "$NC"
        done
    fi

    echo
}

display_metrics_summary() {
    echo -e "${BOLD}📊 METRICS SUMMARY${NC}"
    echo

    echo "Response Times:"
    printf "  Frontend: %sms\n" "${CURRENT_STATUS[frontend_response_time]:-N/A}"
    printf "  Backend:  %sms\n" "${CURRENT_STATUS[backend_response_time]:-N/A}"

    echo
    echo "Service Health:"
    printf "  Frontend:    %s\n" "${CURRENT_STATUS[frontend_status]:-UNKNOWN}"
    printf "  Backend:     %s\n" "${CURRENT_STATUS[backend_status]:-UNKNOWN}"
    printf "  Security:    %s\n" "${CURRENT_STATUS[security_status]:-UNKNOWN}"
    printf "  Testing:     %s\n" "${CURRENT_STATUS[testing_status]:-UNKNOWN}"

    echo
}

display_controls() {
    echo -e "${BOLD}🎮 CONTROLS${NC}"
    echo
    echo "  [q] Quit monitoring"
    echo "  [r] Refresh now"
    echo "  [h] Toggle to health check mode"
    echo "  [t] Run quick tests"
    echo "  [s] Run security scan"
    echo
}

# ================================================================
# MAIN MONITORING LOOP
# ================================================================

collect_metrics() {
    log "INFO" "Collecting system metrics..."

    check_frontend_status
    check_backend_status
    check_security_status
    check_testing_pipeline_status

    # Save metrics to history
    local timestamp=$(date +%s)
    cat > "${MONITORING_DIR}/metrics/metrics-${timestamp}.json" << EOF
{
    "timestamp": "$timestamp",
    "frontend": {
        "status": "${CURRENT_STATUS[frontend_status]}",
        "response_time": ${CURRENT_STATUS[frontend_response_time]},
        "status_code": ${CURRENT_STATUS[frontend_status_code]}
    },
    "backend": {
        "status": "${CURRENT_STATUS[backend_status]}",
        "response_time": ${CURRENT_STATUS[backend_response_time]},
        "status_code": ${CURRENT_STATUS[backend_status_code]},
        "api_failures": ${CURRENT_STATUS[backend_api_failures]}
    },
    "security": {
        "status": "${CURRENT_STATUS[security_status]}",
        "critical_issues": ${CURRENT_STATUS[security_critical_issues]}
    },
    "testing": {
        "status": "${CURRENT_STATUS[testing_status]}",
        "success_rate": ${CURRENT_STATUS[testing_success_rate]}
    }
}
EOF
}

update_dashboard() {
    clear_screen
    display_header
    display_system_status
    display_active_alerts
    display_metrics_summary
    display_controls
}

run_monitoring_loop() {
    log "INFO" "Starting monitoring loop..."

    while [[ "$MONITORING_ACTIVE" == "true" ]]; do
        collect_metrics
        check_alerts
        update_dashboard

        # Check for user input (non-blocking)
        if read -t "$REFRESH_INTERVAL" -n 1 key; then
            case "$key" in
                q|Q)
                    MONITORING_ACTIVE=false
                    ;;
                r|R)
                    log "INFO" "Manual refresh triggered"
                    continue
                    ;;
                h|H)
                    log "INFO" "Running health check..."
                    "${SCRIPT_DIR}/health-check.sh" > "${MONITORING_DIR}/health-check-$(date +%s).log" 2>&1 &
                    ;;
                t|T)
                    log "INFO" "Running quick tests..."
                    "${SCRIPT_DIR}/quick-scan.sh" > "${MONITORING_DIR}/quick-scan-$(date +%s).log" 2>&1 &
                    ;;
                s|S)
                    log "INFO" "Running security scan..."
                    "${SCRIPT_DIR}/security/run-security-scan.sh" > "${MONITORING_DIR}/security-scan-$(date +%s).log" 2>&1 &
                    ;;
            esac
        fi
    done
}

# ================================================================
# MAIN EXECUTION
# ================================================================

cleanup() {
    MONITORING_ACTIVE=false
    log "INFO" "Monitoring dashboard shutting down..."

    # Generate final report
    cat > "${MONITORING_DIR}/monitoring-session-report.json" << EOF
{
    "session_start": "$TIMESTAMP",
    "session_end": "$(date -Iseconds)",
    "total_alerts": $(echo "${ALERT_COUNTS[@]}" | wc -w),
    "final_status": {
        "frontend": "${CURRENT_STATUS[frontend_status]:-UNKNOWN}",
        "backend": "${CURRENT_STATUS[backend_status]:-UNKNOWN}",
        "security": "${CURRENT_STATUS[security_status]:-UNKNOWN}",
        "testing": "${CURRENT_STATUS[testing_status]:-UNKNOWN}"
    }
}
EOF

    log "INFO" "Session report saved to: ${MONITORING_DIR}/monitoring-session-report.json"
}

main() {
    trap cleanup EXIT

    setup_monitoring

    log "INFO" "Aclue Testing Monitoring Dashboard starting..."
    log "INFO" "Press 'q' to quit, 'r' to refresh, 'h' for health check"

    # Initial metrics collection
    collect_metrics

    # Start monitoring loop
    run_monitoring_loop

    log "INFO" "Monitoring session completed"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --mode)
            DASHBOARD_MODE="$2"
            shift 2
            ;;
        --interval)
            REFRESH_INTERVAL="$2"
            shift 2
            ;;
        --slack-webhook)
            SLACK_WEBHOOK="$2"
            shift 2
            ;;
        -h|--help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --mode MODE         Dashboard mode (live, history, alerts)"
            echo "  --interval SECONDS  Refresh interval (default: 30)"
            echo "  --slack-webhook URL Slack webhook for alerts"
            echo "  -h, --help          Show help"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi