#!/bin/bash

# ================================================================
# ACLUE SYSTEM HEALTH CHECK
# ================================================================
# Comprehensive system validation and health monitoring
# Verifies all components are operational and configured correctly
# Used for monitoring, alerting, and deployment validation
# ================================================================

set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_NAME="Aclue Health Check"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly RESULTS_DIR="${SCRIPT_DIR}/results/health-check/${TIMESTAMP}"

# Configuration
readonly TIMEOUT_DURATION=300  # 5 minutes
readonly CHECK_INTERVAL=1      # 1 second between checks
readonly RETRY_COUNT=3
readonly CONCURRENT_CHECKS=true

# Service URLs
readonly FRONTEND_URL="${FRONTEND_URL:-https://aclue.app}"
readonly BACKEND_URL="${BACKEND_URL:-https://aclue-backend-production.up.railway.app}"
readonly DATABASE_URL="${DATABASE_URL:-}"  # Supabase URL if available

# Health thresholds
readonly MAX_RESPONSE_TIME=3.0  # seconds
readonly MIN_SUCCESS_RATE=95    # percentage
readonly MAX_ERROR_RATE=5       # percentage

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# Health status tracking
declare -A HEALTH_STATUS=()
declare -A HEALTH_METRICS=()
declare -A HEALTH_DETAILS=()
OVERALL_HEALTH="HEALTHY"
TOTAL_CHECKS=0
PASSED_CHECKS=0
FAILED_CHECKS=0
WARNING_CHECKS=0

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
        "CRITICAL") echo -e "${RED}${BOLD}[${timestamp}] [CRITICAL]${NC} $message" ;;
        "HEALTHY")  echo -e "${GREEN}[${timestamp}] [HEALTHY]${NC} $message" ;;
        "UNHEALTHY") echo -e "${RED}[${timestamp}] [UNHEALTHY]${NC} $message" ;;
        *) echo -e "${WHITE}[${timestamp}]${NC} $message" ;;
    esac

    # Log to file
    mkdir -p "${RESULTS_DIR}"
    echo "[${timestamp}] [$level] $message" >> "${RESULTS_DIR}/health-check.log"
}

print_banner() {
    echo -e "${BOLD}${BLUE}"
    echo "================================================================"
    echo "                   ACLUE SYSTEM HEALTH CHECK"
    echo "================================================================"
    echo -e "Version: ${SCRIPT_VERSION}"
    echo -e "Timestamp: ${TIMESTAMP}"
    echo -e "Frontend: ${FRONTEND_URL}"
    echo -e "Backend: ${BACKEND_URL}"
    echo "================================================================"
    echo -e "${NC}"
}

setup_directories() {
    mkdir -p "${RESULTS_DIR}"/{frontend,backend,database,infrastructure,reports}
    log "INFO" "Health check directory structure created"
}

# ================================================================
# HTTP HEALTH CHECKS
# ================================================================

check_http_endpoint() {
    local name="$1"
    local url="$2"
    local expected_status="${3:-200}"
    local max_time="${4:-$MAX_RESPONSE_TIME}"

    local start_time=$(date +%s.%N)
    local status_code
    local response_time
    local content_length

    log "INFO" "Checking HTTP endpoint: $name ($url)"

    # Perform HTTP request with detailed metrics
    local curl_output=$(mktemp)
    if curl -s -w "%{http_code}|%{time_total}|%{size_download}" \
           --max-time "$max_time" \
           --connect-timeout 5 \
           -o "$curl_output" \
           "$url" 2>/dev/null; then

        IFS='|' read -r status_code response_time content_length <<< "$(cat "${curl_output}.tmp" 2>/dev/null || echo "000|0|0")"
        rm -f "$curl_output" "${curl_output}.tmp"

        # Validate response
        if [[ "$status_code" == "$expected_status" ]]; then
            if (( $(echo "$response_time <= $max_time" | bc -l) )); then
                HEALTH_STATUS["$name"]="HEALTHY"
                HEALTH_METRICS["$name"]="status:$status_code,time:${response_time}s,size:${content_length}b"
                log "HEALTHY" "$name - Status: $status_code, Time: ${response_time}s"
                ((PASSED_CHECKS++))
                return 0
            else
                HEALTH_STATUS["$name"]="WARNING"
                HEALTH_METRICS["$name"]="status:$status_code,time:${response_time}s,size:${content_length}b"
                HEALTH_DETAILS["$name"]="Response time too slow: ${response_time}s > ${max_time}s"
                log "WARN" "$name - Slow response: ${response_time}s"
                ((WARNING_CHECKS++))
                return 1
            fi
        else
            HEALTH_STATUS["$name"]="UNHEALTHY"
            HEALTH_METRICS["$name"]="status:$status_code,time:${response_time}s,size:${content_length}b"
            HEALTH_DETAILS["$name"]="Unexpected status code: $status_code (expected: $expected_status)"
            log "UNHEALTHY" "$name - Status: $status_code (expected: $expected_status)"
            ((FAILED_CHECKS++))
            return 1
        fi
    else
        HEALTH_STATUS["$name"]="UNHEALTHY"
        HEALTH_METRICS["$name"]="connection_failed"
        HEALTH_DETAILS["$name"]="Connection failed or timeout"
        log "UNHEALTHY" "$name - Connection failed"
        ((FAILED_CHECKS++))
        return 1
    fi
}

check_json_api() {
    local name="$1"
    local url="$2"
    local expected_fields="$3"  # comma-separated list

    log "INFO" "Checking JSON API: $name ($url)"

    local response_file="${RESULTS_DIR}/backend/${name}-response.json"

    if curl -s --max-time 10 -H "Accept: application/json" "$url" > "$response_file"; then
        if jq empty "$response_file" 2>/dev/null; then
            # Validate expected fields
            local missing_fields=()
            IFS=',' read -ra fields <<< "$expected_fields"

            for field in "${fields[@]}"; do
                if ! jq -e "has(\"$field\")" "$response_file" >/dev/null 2>&1; then
                    missing_fields+=("$field")
                fi
            done

            if [[ ${#missing_fields[@]} -eq 0 ]]; then
                HEALTH_STATUS["$name"]="HEALTHY"
                HEALTH_METRICS["$name"]="valid_json,all_fields_present"
                log "HEALTHY" "$name - Valid JSON with all expected fields"
                ((PASSED_CHECKS++))
                return 0
            else
                HEALTH_STATUS["$name"]="WARNING"
                HEALTH_METRICS["$name"]="valid_json,missing_fields:${#missing_fields[@]}"
                HEALTH_DETAILS["$name"]="Missing fields: ${missing_fields[*]}"
                log "WARN" "$name - Missing fields: ${missing_fields[*]}"
                ((WARNING_CHECKS++))
                return 1
            fi
        else
            HEALTH_STATUS["$name"]="UNHEALTHY"
            HEALTH_METRICS["$name"]="invalid_json"
            HEALTH_DETAILS["$name"]="Response is not valid JSON"
            log "UNHEALTHY" "$name - Invalid JSON response"
            ((FAILED_CHECKS++))
            return 1
        fi
    else
        HEALTH_STATUS["$name"]="UNHEALTHY"
        HEALTH_METRICS["$name"]="request_failed"
        HEALTH_DETAILS["$name"]="HTTP request failed"
        log "UNHEALTHY" "$name - HTTP request failed"
        ((FAILED_CHECKS++))
        return 1
    fi
}

# ================================================================
# FRONTEND HEALTH CHECKS
# ================================================================

check_frontend_health() {
    log "INFO" "Starting frontend health checks..."

    ((TOTAL_CHECKS++))
    check_http_endpoint "frontend_main" "$FRONTEND_URL" "200" 5.0

    ((TOTAL_CHECKS++))
    check_http_endpoint "frontend_landingpage" "$FRONTEND_URL/landingpage" "200" 5.0

    # Check for critical frontend resources
    local resources=("/_next/static" "/favicon.ico")
    for resource in "${resources[@]}"; do
        ((TOTAL_CHECKS++))
        check_http_endpoint "frontend_resource_$(basename "$resource")" "$FRONTEND_URL$resource" "200" 3.0
    done

    # Check frontend performance
    log "INFO" "Measuring frontend performance..."
    local perf_start=$(date +%s.%N)
    if curl -s --max-time 10 "$FRONTEND_URL" > "${RESULTS_DIR}/frontend/index.html"; then
        local perf_end=$(date +%s.%N)
        local load_time=$(echo "$perf_end - $perf_start" | bc -l)

        HEALTH_METRICS["frontend_performance"]="load_time:${load_time}s"

        if (( $(echo "$load_time <= 3.0" | bc -l) )); then
            log "SUCCESS" "Frontend performance good: ${load_time}s"
        else
            log "WARN" "Frontend performance slow: ${load_time}s"
        fi

        # Check for errors in HTML
        if grep -i "error\|exception\|500\|404" "${RESULTS_DIR}/frontend/index.html" >/dev/null; then
            HEALTH_STATUS["frontend_content"]="WARNING"
            HEALTH_DETAILS["frontend_content"]="Error messages found in HTML"
            log "WARN" "Frontend contains error messages"
            ((WARNING_CHECKS++))
        else
            HEALTH_STATUS["frontend_content"]="HEALTHY"
            log "SUCCESS" "Frontend content clean"
            ((PASSED_CHECKS++))
        fi
        ((TOTAL_CHECKS++))
    fi
}

# ================================================================
# BACKEND HEALTH CHECKS
# ================================================================

check_backend_health() {
    log "INFO" "Starting backend health checks..."

    # Main health endpoint
    ((TOTAL_CHECKS++))
    check_http_endpoint "backend_health" "$BACKEND_URL/health" "200" 3.0

    # API version endpoint
    ((TOTAL_CHECKS++))
    check_json_api "backend_api_health" "$BACKEND_URL/api/v1/health" "status,version"

    # Authentication endpoints
    local auth_endpoints=(
        "/api/v1/auth/health"
    )

    for endpoint in "${auth_endpoints[@]}"; do
        ((TOTAL_CHECKS++))
        check_http_endpoint "backend_auth_$(basename "$endpoint")" "$BACKEND_URL$endpoint" "200" 3.0
    done

    # Product endpoints (read-only)
    local product_endpoints=(
        "/api/v1/products/"
        "/api/v1/categories/"
    )

    for endpoint in "${product_endpoints[@]}"; do
        ((TOTAL_CHECKS++))
        check_http_endpoint "backend_products_$(basename "$endpoint")" "$BACKEND_URL$endpoint" "200" 5.0
    done

    # Check API response format
    log "INFO" "Validating API response formats..."
    if curl -s --max-time 10 -H "Accept: application/json" "$BACKEND_URL/api/v1/products/" > "${RESULTS_DIR}/backend/products-response.json"; then
        if jq -e '.[]' "${RESULTS_DIR}/backend/products-response.json" >/dev/null 2>&1; then
            log "SUCCESS" "Products API returns valid JSON array"
            HEALTH_STATUS["backend_api_format"]="HEALTHY"
            ((PASSED_CHECKS++))
        else
            log "WARN" "Products API response format unexpected"
            HEALTH_STATUS["backend_api_format"]="WARNING"
            ((WARNING_CHECKS++))
        fi
        ((TOTAL_CHECKS++))
    fi
}

# ================================================================
# DATABASE HEALTH CHECKS
# ================================================================

check_database_health() {
    log "INFO" "Starting database health checks..."

    # Test database connectivity through backend
    ((TOTAL_CHECKS++))
    if curl -s --max-time 10 "$BACKEND_URL/api/v1/health/database" > "${RESULTS_DIR}/database/connection-test.json" 2>/dev/null; then
        if jq -e '.database_status' "${RESULTS_DIR}/database/connection-test.json" >/dev/null 2>&1; then
            local db_status=$(jq -r '.database_status' "${RESULTS_DIR}/database/connection-test.json")
            if [[ "$db_status" == "connected" || "$db_status" == "healthy" ]]; then
                HEALTH_STATUS["database_connection"]="HEALTHY"
                log "HEALTHY" "Database connection verified"
                ((PASSED_CHECKS++))
            else
                HEALTH_STATUS["database_connection"]="UNHEALTHY"
                HEALTH_DETAILS["database_connection"]="Database status: $db_status"
                log "UNHEALTHY" "Database not healthy: $db_status"
                ((FAILED_CHECKS++))
            fi
        else
            HEALTH_STATUS["database_connection"]="WARNING"
            HEALTH_DETAILS["database_connection"]="Cannot verify database status"
            log "WARN" "Cannot verify database status"
            ((WARNING_CHECKS++))
        fi
    else
        HEALTH_STATUS["database_connection"]="UNHEALTHY"
        HEALTH_DETAILS["database_connection"]="Database health endpoint not responding"
        log "UNHEALTHY" "Database health endpoint not responding"
        ((FAILED_CHECKS++))
    fi

    # Test basic data retrieval
    ((TOTAL_CHECKS++))
    if curl -s --max-time 15 "$BACKEND_URL/api/v1/products/?limit=1" > "${RESULTS_DIR}/database/data-test.json"; then
        if jq -e '.[0]' "${RESULTS_DIR}/database/data-test.json" >/dev/null 2>&1; then
            HEALTH_STATUS["database_data"]="HEALTHY"
            log "HEALTHY" "Database data retrieval working"
            ((PASSED_CHECKS++))
        else
            HEALTH_STATUS["database_data"]="WARNING"
            HEALTH_DETAILS["database_data"]="No data returned or unexpected format"
            log "WARN" "Database data retrieval issue"
            ((WARNING_CHECKS++))
        fi
    else
        HEALTH_STATUS["database_data"]="UNHEALTHY"
        HEALTH_DETAILS["database_data"]="Data retrieval endpoint failed"
        log "UNHEALTHY" "Database data retrieval failed"
        ((FAILED_CHECKS++))
    fi
}

# ================================================================
# INFRASTRUCTURE HEALTH CHECKS
# ================================================================

check_infrastructure_health() {
    log "INFO" "Starting infrastructure health checks..."

    # Check SSL certificates
    local domains=("aclue.app" "aclue-backend-production.up.railway.app")

    for domain in "${domains[@]}"; do
        ((TOTAL_CHECKS++))
        log "INFO" "Checking SSL certificate for $domain"

        local cert_info
        if cert_info=$(echo | openssl s_client -servername "$domain" -connect "$domain:443" 2>/dev/null | openssl x509 -noout -dates 2>/dev/null); then
            local not_after=$(echo "$cert_info" | grep "notAfter=" | cut -d= -f2)
            local expiry_date=$(date -d "$not_after" +%s 2>/dev/null || echo "0")
            local current_date=$(date +%s)
            local days_until_expiry=$(( (expiry_date - current_date) / 86400 ))

            if [[ $days_until_expiry -gt 30 ]]; then
                HEALTH_STATUS["ssl_$domain"]="HEALTHY"
                HEALTH_METRICS["ssl_$domain"]="expires_in:${days_until_expiry}d"
                log "HEALTHY" "SSL certificate for $domain expires in $days_until_expiry days"
                ((PASSED_CHECKS++))
            elif [[ $days_until_expiry -gt 7 ]]; then
                HEALTH_STATUS["ssl_$domain"]="WARNING"
                HEALTH_METRICS["ssl_$domain"]="expires_in:${days_until_expiry}d"
                HEALTH_DETAILS["ssl_$domain"]="Certificate expires soon: $days_until_expiry days"
                log "WARN" "SSL certificate for $domain expires in $days_until_expiry days"
                ((WARNING_CHECKS++))
            else
                HEALTH_STATUS["ssl_$domain"]="UNHEALTHY"
                HEALTH_METRICS["ssl_$domain"]="expires_in:${days_until_expiry}d"
                HEALTH_DETAILS["ssl_$domain"]="Certificate expires very soon or expired"
                log "UNHEALTHY" "SSL certificate for $domain expires in $days_until_expiry days"
                ((FAILED_CHECKS++))
            fi
        else
            HEALTH_STATUS["ssl_$domain"]="UNHEALTHY"
            HEALTH_DETAILS["ssl_$domain"]="Cannot retrieve SSL certificate"
            log "UNHEALTHY" "Cannot check SSL certificate for $domain"
            ((FAILED_CHECKS++))
        fi
    done

    # Check DNS resolution
    for domain in "${domains[@]}"; do
        ((TOTAL_CHECKS++))
        log "INFO" "Checking DNS resolution for $domain"

        if nslookup "$domain" >/dev/null 2>&1; then
            HEALTH_STATUS["dns_$domain"]="HEALTHY"
            log "HEALTHY" "DNS resolution for $domain working"
            ((PASSED_CHECKS++))
        else
            HEALTH_STATUS["dns_$domain"]="UNHEALTHY"
            HEALTH_DETAILS["dns_$domain"]="DNS resolution failed"
            log "UNHEALTHY" "DNS resolution failed for $domain"
            ((FAILED_CHECKS++))
        fi
    done
}

# ================================================================
# CONCURRENT EXECUTION
# ================================================================

run_health_checks() {
    if [[ "$CONCURRENT_CHECKS" == "true" ]]; then
        log "INFO" "Running health checks concurrently..."

        # Run health checks in parallel
        check_frontend_health &
        local frontend_pid=$!

        check_backend_health &
        local backend_pid=$!

        check_database_health &
        local database_pid=$!

        check_infrastructure_health &
        local infrastructure_pid=$!

        # Wait for all checks to complete
        wait $frontend_pid $backend_pid $database_pid $infrastructure_pid
    else
        log "INFO" "Running health checks sequentially..."
        check_frontend_health
        check_backend_health
        check_database_health
        check_infrastructure_health
    fi
}

# ================================================================
# REPORTING FUNCTIONS
# ================================================================

calculate_overall_health() {
    local critical_failures=0
    local warnings=0

    for component in "${!HEALTH_STATUS[@]}"; do
        case "${HEALTH_STATUS[$component]}" in
            "UNHEALTHY")
                ((critical_failures++))
                ;;
            "WARNING")
                ((warnings++))
                ;;
        esac
    done

    if [[ $critical_failures -gt 0 ]]; then
        OVERALL_HEALTH="UNHEALTHY"
    elif [[ $warnings -gt 5 ]]; then
        OVERALL_HEALTH="DEGRADED"
    elif [[ $warnings -gt 0 ]]; then
        OVERALL_HEALTH="WARNING"
    else
        OVERALL_HEALTH="HEALTHY"
    fi
}

generate_health_report() {
    log "INFO" "Generating health report..."

    calculate_overall_health

    # Create JSON report
    cat > "${RESULTS_DIR}/reports/health-report.json" << EOF
{
    "metadata": {
        "script_version": "${SCRIPT_VERSION}",
        "timestamp": "${TIMESTAMP}",
        "check_duration": $(date +%s),
        "frontend_url": "${FRONTEND_URL}",
        "backend_url": "${BACKEND_URL}"
    },
    "overall_health": "${OVERALL_HEALTH}",
    "statistics": {
        "total_checks": ${TOTAL_CHECKS},
        "passed_checks": ${PASSED_CHECKS},
        "failed_checks": ${FAILED_CHECKS},
        "warning_checks": ${WARNING_CHECKS},
        "success_rate": $(( TOTAL_CHECKS > 0 ? (PASSED_CHECKS * 100) / TOTAL_CHECKS : 0 ))
    },
    "components": {
$(for component in "${!HEALTH_STATUS[@]}"; do
    echo "        \"$component\": {"
    echo "            \"status\": \"${HEALTH_STATUS[$component]}\","
    echo "            \"metrics\": \"${HEALTH_METRICS[$component]:-""}\","
    echo "            \"details\": \"${HEALTH_DETAILS[$component]:-""}\""
    echo "        },"
done | sed '$ s/,$//')
    }
}
EOF

    # Create human-readable report
    cat > "${RESULTS_DIR}/reports/health-summary.txt" << EOF
================================================================
ACLUE SYSTEM HEALTH REPORT
================================================================
Check Date: $(date)
Overall Health: ${OVERALL_HEALTH}
Version: ${SCRIPT_VERSION}

SUMMARY:
- Total Checks: ${TOTAL_CHECKS}
- Passed: ${PASSED_CHECKS}
- Failed: ${FAILED_CHECKS}
- Warnings: ${WARNING_CHECKS}
- Success Rate: $(( TOTAL_CHECKS > 0 ? (PASSED_CHECKS * 100) / TOTAL_CHECKS : 0 ))%

COMPONENT STATUS:
$(for component in "${!HEALTH_STATUS[@]}"; do
    printf "%-30s: %s\n" "$component" "${HEALTH_STATUS[$component]}"
    if [[ -n "${HEALTH_DETAILS[$component]:-}" ]]; then
        printf "%-30s  %s\n" "" "→ ${HEALTH_DETAILS[$component]}"
    fi
done)

SYSTEM ENDPOINTS:
- Frontend: ${FRONTEND_URL}
- Backend API: ${BACKEND_URL}

HEALTH STATUS LEGEND:
- HEALTHY: Component is functioning normally
- WARNING: Component has minor issues but is functional
- DEGRADED: Component has multiple warnings or performance issues
- UNHEALTHY: Component has critical issues requiring attention

================================================================
EOF

    log "SUCCESS" "Health report generated: ${RESULTS_DIR}/reports/"
}

print_health_summary() {
    echo
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo -e "${BOLD}${BLUE}                    SYSTEM HEALTH SUMMARY${NC}"
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo

    # Overall health with appropriate color
    local health_color="${GREEN}"
    case "$OVERALL_HEALTH" in
        "UNHEALTHY") health_color="${RED}" ;;
        "DEGRADED"|"WARNING") health_color="${YELLOW}" ;;
    esac

    echo -e "🏥 ${BOLD}Overall Health:${NC} ${health_color}${OVERALL_HEALTH}${NC}"
    echo

    echo -e "📊 ${BOLD}Statistics:${NC}"
    echo -e "   Total Checks: ${TOTAL_CHECKS}"
    echo -e "   Passed: ${GREEN}${PASSED_CHECKS}${NC}"
    echo -e "   Failed: ${RED}${FAILED_CHECKS}${NC}"
    echo -e "   Warnings: ${YELLOW}${WARNING_CHECKS}${NC}"
    echo -e "   Success Rate: $(( TOTAL_CHECKS > 0 ? (PASSED_CHECKS * 100) / TOTAL_CHECKS : 0 ))%"
    echo

    echo -e "🔍 ${BOLD}Component Status:${NC}"
    for component in "${!HEALTH_STATUS[@]}"; do
        local status="${HEALTH_STATUS[$component]}"
        local color="${GREEN}"

        case "$status" in
            "UNHEALTHY") color="${RED}" ;;
            "WARNING") color="${YELLOW}" ;;
        esac

        printf "   %-30s: %b%s%b\n" "$component" "$color" "$status" "$NC"

        if [[ -n "${HEALTH_DETAILS[$component]:-}" ]]; then
            printf "   %-30s  ${CYAN}→ %s${NC}\n" "" "${HEALTH_DETAILS[$component]}"
        fi
    done

    echo
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo -e "📁 Results saved to: ${RESULTS_DIR}/reports/"
    echo -e "${BOLD}${BLUE}================================================================${NC}"
}

# ================================================================
# MAIN EXECUTION
# ================================================================

main() {
    local start_time=$(date +%s)

    print_banner
    setup_directories

    # Check required tools
    local required_tools=("curl" "jq" "openssl" "nslookup" "bc")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "ERROR" "Required tool not found: $tool"
            exit 1
        fi
    done

    # Run health checks
    timeout "$TIMEOUT_DURATION" run_health_checks

    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))

    # Generate reports
    generate_health_report
    print_health_summary

    log "INFO" "Health check completed in ${total_duration}s"

    # Exit with appropriate code based on overall health
    case "$OVERALL_HEALTH" in
        "HEALTHY")
            log "SUCCESS" "All systems healthy"
            exit 0
            ;;
        "WARNING")
            log "WARN" "Some warnings detected"
            exit 0
            ;;
        "DEGRADED")
            log "WARN" "System performance degraded"
            exit 1
            ;;
        "UNHEALTHY")
            log "CRITICAL" "Critical health issues detected"
            exit 2
            ;;
    esac
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi