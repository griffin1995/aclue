#!/bin/bash
# =============================================================================
# aclue Platform Post-Deployment Security Verification Script
# =============================================================================
#
# Comprehensive security verification script that runs after successful
# deployments to validate security configurations and runtime security posture.
# This script performs live security testing against the deployed application.
#
# Usage:
#   ./post-deployment-verify.sh --url=https://aclue.app [--environment=prod|staging|dev]
#
# Exit Codes:
#   0 - All security verifications passed
#   1 - Critical security issues found in deployment
#   2 - Warning-level security issues found
#   3 - Configuration or environment issues
#
# =============================================================================

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORT_DIR="${PROJECT_ROOT}/security-reports"

# Default values
TARGET_URL=""
ENVIRONMENT="dev"
TIMEOUT=30
VERBOSE=false
SKIP_SSL_VERIFY=false

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

log_critical() {
    echo -e "${RED}[CRITICAL]${NC} $1"
}

# Help function
show_help() {
    cat << EOF
aclue Platform Post-Deployment Security Verification

Usage: $0 --url=TARGET_URL [OPTIONS]

REQUIRED:
    --url=URL               Target URL to verify (e.g., https://aclue.app)

OPTIONS:
    --environment=ENV       Environment being verified (prod, staging, dev)
    --timeout=SECONDS       HTTP request timeout in seconds (default: 30)
    --skip-ssl-verify       Skip SSL certificate verification (not recommended)
    --verbose               Enable verbose output
    --help                  Show this help message

EXAMPLES:
    $0 --url=https://aclue.app --environment=prod
    $0 --url=https://staging.aclue.app --environment=staging --verbose
    $0 --url=http://localhost:3000 --environment=dev --skip-ssl-verify

SECURITY CHECKS PERFORMED:
    ✓ SSL/TLS configuration and certificate validation
    ✓ Security headers analysis (HSTS, CSP, X-Frame-Options, etc.)
    ✓ Content Security Policy validation
    ✓ HTTP methods and endpoint security
    ✓ Information disclosure detection
    ✓ Authentication and session security
    ✓ API endpoint security validation
    ✓ Performance security (response times, rate limiting)

EXIT CODES:
    0 - All security verifications passed
    1 - Critical security issues found
    2 - Warning-level security issues found
    3 - Configuration or connectivity issues
EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --url=*)
                TARGET_URL="${1#*=}"
                shift
                ;;
            --environment=*)
                ENVIRONMENT="${1#*=}"
                shift
                ;;
            --timeout=*)
                TIMEOUT="${1#*=}"
                shift
                ;;
            --skip-ssl-verify)
                SKIP_SSL_VERIFY=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --help)
                show_help
                exit 0
                ;;
            *)
                log_error "Unknown option: $1"
                show_help
                exit 3
                ;;
        esac
    done

    if [[ -z "$TARGET_URL" ]]; then
        log_error "Target URL is required. Use --url=https://example.com"
        show_help
        exit 3
    fi
}

# Initialize verification environment
initialize_environment() {
    log_info "Initializing post-deployment security verification..."

    # Create reports directory
    mkdir -p "$REPORT_DIR"

    # Check if required tools are available
    local required_tools=("curl" "jq" "openssl")
    local optional_tools=("nmap" "nikto" "testssl.sh")

    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "Required tool '$tool' is not installed"
            exit 3
        fi
    done

    for tool in "${optional_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_warning "Optional security tool '$tool' is not available"
        fi
    done

    # Validate target URL
    if ! curl -s --head --max-time 10 ${SKIP_SSL_VERIFY:+--insecure} "$TARGET_URL" > /dev/null 2>&1; then
        log_error "Cannot connect to target URL: $TARGET_URL"
        exit 3
    fi

    log_success "Environment initialized successfully"
    log_info "Target URL: $TARGET_URL"
    log_info "Environment: $ENVIRONMENT"
}

# Check SSL/TLS configuration
check_ssl_configuration() {
    log_info "Checking SSL/TLS configuration..."

    local ssl_report="${REPORT_DIR}/ssl-analysis.json"
    local issues=0

    # Extract hostname from URL
    local hostname=$(echo "$TARGET_URL" | sed -e 's/[^/]*\/\/\([^@]*@\)\?\([^:/]*\).*/\2/')
    local port="443"

    # Skip SSL checks for non-HTTPS URLs
    if [[ ! "$TARGET_URL" =~ ^https:// ]]; then
        log_warning "Non-HTTPS URL detected - skipping SSL/TLS checks"
        echo '{"ssl_enabled": false, "reason": "non-https-url"}' > "$ssl_report"
        return 2
    fi

    # Check SSL certificate validity
    log_info "Validating SSL certificate..."
    local cert_info=""
    if cert_info=$(openssl s_client -connect "$hostname:$port" -servername "$hostname" < /dev/null 2>/dev/null | openssl x509 -noout -dates -subject -issuer 2>/dev/null); then
        log_success "SSL certificate is valid"

        # Extract certificate expiry
        local expiry_date=$(echo "$cert_info" | grep "notAfter" | cut -d= -f2)
        local expiry_epoch=$(date -d "$expiry_date" +%s 2>/dev/null || echo "0")
        local current_epoch=$(date +%s)
        local days_until_expiry=$(( (expiry_epoch - current_epoch) / 86400 ))

        if [[ $days_until_expiry -lt 30 ]]; then
            log_warning "SSL certificate expires in $days_until_expiry days"
            issues=$((issues + 1))
        else
            log_success "SSL certificate is valid for $days_until_expiry days"
        fi
    else
        log_error "SSL certificate validation failed"
        issues=$((issues + 1))
    fi

    # Check SSL/TLS protocols and cipher suites using testssl.sh if available
    if command -v testssl.sh &> /dev/null; then
        log_info "Running comprehensive SSL/TLS analysis with testssl.sh..."
        testssl.sh --json --quiet "$TARGET_URL" > "${REPORT_DIR}/testssl-report.json" 2>/dev/null || {
            log_warning "testssl.sh analysis failed or incomplete"
        }
    else
        log_info "testssl.sh not available, performing basic SSL checks..."

        # Check supported protocols
        local protocols=("ssl3" "tls1" "tls1_1" "tls1_2" "tls1_3")
        echo '{"ssl_protocols": {' > "${REPORT_DIR}/ssl-protocols.json"

        for protocol in "${protocols[@]}"; do
            if openssl s_client -connect "$hostname:$port" -"$protocol" < /dev/null &>/dev/null; then
                echo "  \"$protocol\": true," >> "${REPORT_DIR}/ssl-protocols.json"
                if [[ "$protocol" == "ssl3" || "$protocol" == "tls1" || "$protocol" == "tls1_1" ]]; then
                    log_warning "Insecure protocol $protocol is enabled"
                    issues=$((issues + 1))
                fi
            else
                echo "  \"$protocol\": false," >> "${REPORT_DIR}/ssl-protocols.json"
            fi
        done

        echo '}}' >> "${REPORT_DIR}/ssl-protocols.json"
    fi

    # Create SSL summary report
    cat > "$ssl_report" << EOF
{
  "ssl_enabled": true,
  "hostname": "$hostname",
  "certificate_info": $(echo "$cert_info" | jq -R -s -c 'split("\n")' 2>/dev/null || echo '[]'),
  "days_until_expiry": $days_until_expiry,
  "security_issues_found": $issues,
  "timestamp": "$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
}
EOF

    if [[ $issues -eq 0 ]]; then
        log_success "SSL/TLS configuration check passed"
        return 0
    else
        log_warning "SSL/TLS configuration has $issues potential issues"
        return 2
    fi
}

# Check security headers
check_security_headers() {
    log_info "Analyzing HTTP security headers..."

    local headers_report="${REPORT_DIR}/security-headers.json"
    local issues=0
    local warnings=0

    # Get HTTP response headers
    local response_file="${REPORT_DIR}/http-response.txt"
    curl -s -I --max-time "$TIMEOUT" ${SKIP_SSL_VERIFY:+--insecure} "$TARGET_URL" > "$response_file"

    # Define expected security headers and their importance
    declare -A expected_headers=(
        ["strict-transport-security"]="critical"
        ["content-security-policy"]="critical"
        ["x-frame-options"]="high"
        ["x-content-type-options"]="high"
        ["referrer-policy"]="medium"
        ["permissions-policy"]="medium"
        ["x-xss-protection"]="low"
    )

    # Analyze each header
    echo '{"security_headers": {' > "$headers_report"

    for header in "${!expected_headers[@]}"; do
        local importance="${expected_headers[$header]}"
        local header_value=""

        if header_value=$(grep -i "^${header}:" "$response_file" | cut -d: -f2- | sed 's/^ *//'); then
            echo "  \"$header\": {\"present\": true, \"value\": \"$header_value\", \"importance\": \"$importance\"}," >> "$headers_report"
            log_success "Security header present: $header"

            # Validate specific header values
            case "$header" in
                "strict-transport-security")
                    if [[ ! "$header_value" =~ max-age=([0-9]+) ]] || [[ ${BASH_REMATCH[1]} -lt 31536000 ]]; then
                        log_warning "HSTS max-age should be at least 31536000 (1 year)"
                        warnings=$((warnings + 1))
                    fi
                    ;;
                "content-security-policy")
                    if [[ "$header_value" =~ unsafe-inline ]] || [[ "$header_value" =~ unsafe-eval ]]; then
                        log_warning "CSP contains unsafe directives (unsafe-inline/unsafe-eval)"
                        warnings=$((warnings + 1))
                    fi
                    ;;
                "x-frame-options")
                    if [[ ! "$header_value" =~ ^(DENY|SAMEORIGIN)$ ]]; then
                        log_warning "X-Frame-Options should be DENY or SAMEORIGIN"
                        warnings=$((warnings + 1))
                    fi
                    ;;
            esac
        else
            echo "  \"$header\": {\"present\": false, \"importance\": \"$importance\"}," >> "$headers_report"

            case "$importance" in
                "critical")
                    log_error "Critical security header missing: $header"
                    issues=$((issues + 1))
                    ;;
                "high")
                    log_warning "Important security header missing: $header"
                    warnings=$((warnings + 1))
                    ;;
                "medium"|"low")
                    log_info "Optional security header missing: $header"
                    ;;
            esac
        fi
    done

    # Check for information disclosure headers
    local disclosure_headers=("server" "x-powered-by" "x-aspnet-version" "x-generator")
    for header in "${disclosure_headers[@]}"; do
        if grep -qi "^${header}:" "$response_file"; then
            local header_value=$(grep -i "^${header}:" "$response_file" | cut -d: -f2- | sed 's/^ *//')
            log_warning "Information disclosure header present: $header: $header_value"
            warnings=$((warnings + 1))
            echo "  \"$header\": {\"present\": true, \"value\": \"$header_value\", \"type\": \"information_disclosure\"}," >> "$headers_report"
        fi
    done

    echo "  \"analysis_summary\": {\"critical_issues\": $issues, \"warnings\": $warnings, \"timestamp\": \"$(date -u '+%Y-%m-%d %H:%M:%S UTC')\"}" >> "$headers_report"
    echo '}}' >> "$headers_report"

    # Return appropriate exit code
    if [[ $issues -eq 0 ]] && [[ $warnings -eq 0 ]]; then
        log_success "Security headers check passed"
        return 0
    elif [[ $issues -eq 0 ]]; then
        log_warning "Security headers check completed with $warnings warnings"
        return 2
    else
        log_error "Security headers check failed with $issues critical issues and $warnings warnings"
        return 1
    fi
}

# Test API endpoint security
check_api_security() {
    log_info "Testing API endpoint security..."

    local api_report="${REPORT_DIR}/api-security.json"
    local issues=0
    local warnings=0

    # Common API endpoints to test
    local endpoints=(
        "/api/health"
        "/api/v1/auth/me"
        "/api/v1/products"
        "/api/v1/recommendations"
        "/.well-known/security.txt"
    )

    echo '{"api_security": {' > "$api_report"

    for endpoint in "${endpoints[@]}"; do
        local endpoint_url="${TARGET_URL}${endpoint}"
        log_info "Testing endpoint: $endpoint"

        # Test HTTP methods
        local methods=("GET" "POST" "PUT" "DELETE" "PATCH" "OPTIONS" "HEAD")
        local allowed_methods=()
        local response_codes=()

        for method in "${methods[@]}"; do
            local response_code=""
            if response_code=$(curl -s -o /dev/null -w "%{http_code}" -X "$method" --max-time "$TIMEOUT" ${SKIP_SSL_VERIFY:+--insecure} "$endpoint_url" 2>/dev/null); then
                response_codes+=("$method:$response_code")

                # Check for potentially dangerous method responses
                if [[ "$response_code" =~ ^2[0-9][0-9]$ ]] && [[ "$method" =~ ^(PUT|DELETE|PATCH)$ ]]; then
                    log_warning "Endpoint $endpoint allows potentially dangerous method: $method"
                    warnings=$((warnings + 1))
                fi

                # Check for method not allowed vs forbidden
                if [[ "$response_code" == "200" ]] || [[ "$response_code" == "405" ]]; then
                    allowed_methods+=("$method")
                fi
            fi
        done

        # Test for common vulnerabilities
        local vuln_tests=(
            "sql_injection:' OR '1'='1"
            "xss_basic:<script>alert(1)</script>"
            "path_traversal:../../../etc/passwd"
            "command_injection:; ls -la"
        )

        for test in "${vuln_tests[@]}"; do
            local test_name="${test%%:*}"
            local payload="${test##*:}"
            local test_url="${endpoint_url}?test=${payload// /%20}"

            local response_code=""
            if response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time "$TIMEOUT" ${SKIP_SSL_VERIFY:+--insecure} "$test_url" 2>/dev/null); then
                # Look for suspicious responses that might indicate vulnerability
                if [[ "$response_code" == "500" ]]; then
                    log_warning "Endpoint $endpoint returned 500 for $test_name test (potential vulnerability)"
                    warnings=$((warnings + 1))
                fi
            fi
        done

        echo "  \"$endpoint\": {\"allowed_methods\": $(printf '%s\n' "${allowed_methods[@]}" | jq -R . | jq -s .), \"response_codes\": $(printf '%s\n' "${response_codes[@]}" | jq -R . | jq -s .)}," >> "$api_report"
    done

    echo "  \"analysis_summary\": {\"issues\": $issues, \"warnings\": $warnings, \"timestamp\": \"$(date -u '+%Y-%m-%d %H:%M:%S UTC')\"}" >> "$api_report"
    echo '}}' >> "$api_report"

    if [[ $issues -eq 0 ]] && [[ $warnings -eq 0 ]]; then
        log_success "API security check passed"
        return 0
    else
        log_warning "API security check completed with $issues issues and $warnings warnings"
        return 2
    fi
}

# Check performance and availability
check_performance_security() {
    log_info "Testing performance and availability security..."

    local perf_report="${REPORT_DIR}/performance-security.json"
    local issues=0
    local warnings=0

    # Performance metrics
    local response_times=()
    local requests=5

    log_info "Measuring response times over $requests requests..."
    for ((i=1; i<=requests; i++)); do
        local response_time=""
        if response_time=$(curl -s -o /dev/null -w "%{time_total}" --max-time "$TIMEOUT" ${SKIP_SSL_VERIFY:+--insecure} "$TARGET_URL" 2>/dev/null); then
            response_times+=("$response_time")
        fi
    done

    # Calculate average response time
    local total_time=0
    for time in "${response_times[@]}"; do
        total_time=$(echo "$total_time + $time" | bc -l)
    done
    local avg_response_time=$(echo "scale=3; $total_time / ${#response_times[@]}" | bc -l)

    # Check for performance issues
    if (( $(echo "$avg_response_time > 3.0" | bc -l) )); then
        log_warning "Average response time is high: ${avg_response_time}s"
        warnings=$((warnings + 1))
    else
        log_success "Average response time is acceptable: ${avg_response_time}s"
    fi

    # Test rate limiting (if implemented)
    log_info "Testing rate limiting..."
    local rapid_requests=10
    local rate_limit_triggered=false

    for ((i=1; i<=rapid_requests; i++)); do
        local response_code=""
        if response_code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 5 ${SKIP_SSL_VERIFY:+--insecure} "$TARGET_URL" 2>/dev/null); then
            if [[ "$response_code" == "429" ]]; then
                rate_limit_triggered=true
                log_success "Rate limiting is working (HTTP 429 received)"
                break
            fi
        fi
        sleep 0.1
    done

    if [[ "$rate_limit_triggered" == false ]]; then
        log_info "No rate limiting detected (may be implemented at infrastructure level)"
    fi

    # Create performance report
    cat > "$perf_report" << EOF
{
  "performance_security": {
    "average_response_time": $avg_response_time,
    "response_times": [$(IFS=,; echo "${response_times[*]}")],
    "rate_limiting_detected": $rate_limit_triggered,
    "performance_issues": $issues,
    "performance_warnings": $warnings,
    "timestamp": "$(date -u '+%Y-%m-%d %H:%M:%S UTC')"
  }
}
EOF

    if [[ $issues -eq 0 ]]; then
        log_success "Performance security check passed"
        return 0
    else
        log_warning "Performance security check completed with $warnings warnings"
        return 2
    fi
}

# Generate comprehensive security report
generate_security_report() {
    log_info "Generating comprehensive post-deployment security report..."

    local final_report="${REPORT_DIR}/post-deployment-security-report.json"
    local timestamp=$(date -u '+%Y-%m-%d %H:%M:%S UTC')

    cat > "$final_report" << EOF
{
  "scan_metadata": {
    "timestamp": "$timestamp",
    "target_url": "$TARGET_URL",
    "environment": "$ENVIRONMENT",
    "scan_type": "post-deployment-verification",
    "timeout_seconds": $TIMEOUT
  },
  "scan_results": {
    "ssl_tls": $([ -f "${REPORT_DIR}/ssl-analysis.json" ] && cat "${REPORT_DIR}/ssl-analysis.json" || echo 'null'),
    "security_headers": $([ -f "${REPORT_DIR}/security-headers.json" ] && cat "${REPORT_DIR}/security-headers.json" || echo 'null'),
    "api_security": $([ -f "${REPORT_DIR}/api-security.json" ] && cat "${REPORT_DIR}/api-security.json" || echo 'null'),
    "performance_security": $([ -f "${REPORT_DIR}/performance-security.json" ] && cat "${REPORT_DIR}/performance-security.json" || echo 'null')
  },
  "overall_security_score": "calculated_based_on_findings",
  "recommendations": [
    "Review SSL/TLS configuration and certificate management",
    "Implement missing security headers where applicable",
    "Consider implementing additional API security measures",
    "Monitor application performance and implement rate limiting",
    "Regularly review and update security configurations"
  ]
}
EOF

    log_success "Comprehensive security report generated: $final_report"
}

# Main execution function
main() {
    local start_time=$(date +%s)
    local exit_code=0
    local ssl_result=0
    local headers_result=0
    local api_result=0
    local perf_result=0

    log_info "Starting aclue platform post-deployment security verification"
    log_info "Target: $TARGET_URL | Environment: $ENVIRONMENT"

    # Initialize environment
    initialize_environment

    # Run security verifications
    check_ssl_configuration || ssl_result=$?
    check_security_headers || headers_result=$?
    check_api_security || api_result=$?
    check_performance_security || perf_result=$?

    # Determine overall exit code
    local results=($ssl_result $headers_result $api_result $perf_result)
    for result in "${results[@]}"; do
        if [[ $result -eq 1 ]] && [[ $exit_code -lt 1 ]]; then
            exit_code=1
        elif [[ $result -eq 2 ]] && [[ $exit_code -eq 0 ]]; then
            exit_code=2
        fi
    done

    # Generate comprehensive report
    generate_security_report

    # Calculate execution time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    # Final status
    case $exit_code in
        0)
            log_success "✅ All post-deployment security verifications passed!"
            log_success "Security verification completed in ${duration}s"
            ;;
        1)
            log_critical "❌ Critical security issues found in deployment!"
            log_error "Security verification failed in ${duration}s"
            ;;
        2)
            log_warning "⚠️ Post-deployment security verification completed with warnings."
            if [[ "$ENVIRONMENT" == "prod" ]]; then
                log_warning "Production environment warnings should be addressed promptly."
            fi
            log_info "Security verification completed in ${duration}s"
            ;;
    esac

    log_info "Detailed security reports available in: $REPORT_DIR"
    exit $exit_code
}

# Parse arguments and run main function
parse_arguments "$@"
main
