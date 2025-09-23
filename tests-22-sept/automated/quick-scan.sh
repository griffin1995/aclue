#!/bin/bash

# ================================================================
# ACLUE QUICK SECURITY & PERFORMANCE SCAN
# ================================================================
# 5-10 minute critical checks for immediate feedback
# Optimized for CI/CD pipelines and rapid deployment gates
# ================================================================

set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_NAME="aclue Quick Scan"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly RESULTS_DIR="${SCRIPT_DIR}/results/quick-scan/${TIMESTAMP}"

# Configuration
readonly TIMEOUT_DURATION=600  # 10 minutes total timeout
readonly PARALLEL_EXECUTION=true
readonly MAX_PARALLEL_JOBS=3

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# Statistics
declare -A SCAN_RESULTS=()
declare -A SCAN_DURATIONS=()
TOTAL_SCANS=0
PASSED_SCANS=0
FAILED_SCANS=0
CRITICAL_ISSUES=0

# ================================================================
# UTILITY FUNCTIONS
# ================================================================

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")  echo -e "${CYAN}[${timestamp}] [INFO]${NC} $message" ;;
        "WARN")  echo -e "${YELLOW}[${timestamp}] [WARN]${NC} $message" ;;
        "ERROR") echo -e "${RED}[${timestamp}] [ERROR]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[${timestamp}] [SUCCESS]${NC} $message" ;;
        "CRITICAL") echo -e "${RED}${BOLD}[${timestamp}] [CRITICAL]${NC} $message" ;;
        *) echo -e "${WHITE}[${timestamp}]${NC} $message" ;;
    esac

    # Log to file
    mkdir -p "${RESULTS_DIR}"
    echo "[${timestamp}] [$level] $message" >> "${RESULTS_DIR}/quick-scan.log"
}

print_banner() {
    echo -e "${BOLD}${BLUE}"
    echo "================================================================"
    echo "                ACLUE QUICK SECURITY SCAN"
    echo "================================================================"
    echo -e "Version: ${SCRIPT_VERSION}"
    echo -e "Timeout: ${TIMEOUT_DURATION}s"
    echo -e "Results: ${RESULTS_DIR}"
    echo "================================================================"
    echo -e "${NC}"
}

setup_directories() {
    mkdir -p "${RESULTS_DIR}"/{security,performance,api,summary}
    log "INFO" "Quick scan directory structure created"
}

# ================================================================
# CRITICAL SECURITY CHECKS
# ================================================================

quick_secret_scan() {
    local start_time=$(date +%s)
    log "INFO" "Starting quick secret scan..."

    local scan_result="PASSED"
    local issues_found=0

    # Quick regex-based secret detection
    local secret_patterns=(
        "api[_-]?key[[:space:]]*[=:][[:space:]]*['\"][0-9a-zA-Z]{20,}['\"]"
        "password[[:space:]]*[=:][[:space:]]*['\"][^'\"]+['\"]"
        "secret[[:space:]]*[=:][[:space:]]*['\"][^'\"]+['\"]"
        "token[[:space:]]*[=:][[:space:]]*['\"][0-9a-zA-Z]{20,}['\"]"
        "aws[_-]?access[_-]?key[[:space:]]*[=:][[:space:]]*['\"][A-Z0-9]{20}['\"]"
        "DATABASE_URL[[:space:]]*[=:][[:space:]]*['\"].*://.*['\"]"
    )

    local exclude_dirs=("node_modules" ".git" "venv" "__pycache__" ".next" "dist" "build")
    local exclude_args=""
    for dir in "${exclude_dirs[@]}"; do
        exclude_args="$exclude_args --exclude-dir=$dir"
    done

    for pattern in "${secret_patterns[@]}"; do
        if grep -r $exclude_args -i -E "$pattern" "$PROJECT_ROOT" 2>/dev/null | grep -v "test" | grep -v "example" | head -5; then
            ((issues_found++))
            scan_result="FAILED"
        fi
    done

    # Check for common secret files
    local secret_files=(".env" ".env.local" ".env.production" "secrets.json" "config.json")
    for file in "${secret_files[@]}"; do
        if find "$PROJECT_ROOT" -name "$file" -type f 2>/dev/null | grep -v node_modules | head -1; then
            log "WARN" "Found potential secrets file: $file"
        fi
    done

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    SCAN_RESULTS["secret"]="$scan_result"
    SCAN_DURATIONS["secret"]="$duration"

    if [[ "$scan_result" == "FAILED" ]]; then
        CRITICAL_ISSUES=$((CRITICAL_ISSUES + issues_found))
        log "CRITICAL" "Secret scan failed - $issues_found potential secrets found"
        return 1
    else
        log "SUCCESS" "Secret scan passed in ${duration}s"
        return 0
    fi
}

quick_dependency_check() {
    local start_time=$(date +%s)
    log "INFO" "Starting quick dependency vulnerability check..."

    local scan_result="PASSED"
    local critical_vulns=0

    # Frontend dependency check
    if [[ -f "$PROJECT_ROOT/web/package-lock.json" ]]; then
        cd "$PROJECT_ROOT/web"

        # Quick npm audit for critical and high vulnerabilities only
        if npm audit --audit-level=critical --json > "${RESULTS_DIR}/security/npm-audit-critical.json" 2>/dev/null; then
            log "SUCCESS" "No critical npm vulnerabilities found"
        else
            critical_vulns=$(jq '.vulnerabilities | map(select(.severity == "critical")) | length' "${RESULTS_DIR}/security/npm-audit-critical.json" 2>/dev/null || echo "0")
            if [[ $critical_vulns -gt 0 ]]; then
                scan_result="FAILED"
                CRITICAL_ISSUES=$((CRITICAL_ISSUES + critical_vulns))
                log "CRITICAL" "Found $critical_vulns critical npm vulnerabilities"
            fi
        fi
    fi

    # Backend dependency check (quick)
    if [[ -f "$PROJECT_ROOT/backend/requirements.txt" ]]; then
        # Check for known vulnerable packages
        local vulnerable_packages=("requests==2.8.0" "urllib3==1.25.0" "jinja2==2.10.0" "flask==0.12.0")
        for pkg in "${vulnerable_packages[@]}"; do
            if grep -q "$pkg" "$PROJECT_ROOT/backend/requirements.txt"; then
                scan_result="FAILED"
                ((CRITICAL_ISSUES++))
                log "CRITICAL" "Found known vulnerable package: $pkg"
            fi
        done
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    SCAN_RESULTS["dependency"]="$scan_result"
    SCAN_DURATIONS["dependency"]="$duration"

    if [[ "$scan_result" == "FAILED" ]]; then
        log "ERROR" "Dependency check failed in ${duration}s"
        return 1
    else
        log "SUCCESS" "Dependency check passed in ${duration}s"
        return 0
    fi
}

quick_code_security() {
    local start_time=$(date +%s)
    log "INFO" "Starting quick code security scan..."

    local scan_result="PASSED"
    local issues_found=0

    # Quick security pattern detection
    local security_patterns=(
        "eval[[:space:]]*\("
        "exec[[:space:]]*\("
        "subprocess\.call"
        "os\.system"
        "\.innerHTML[[:space:]]*="
        "document\.write"
        "dangerouslySetInnerHTML"
        "shell=True"
        "pickle\.loads"
        "yaml\.load\("
    )

    local code_dirs=("$PROJECT_ROOT/web/src" "$PROJECT_ROOT/backend/app")

    for dir in "${code_dirs[@]}"; do
        if [[ -d "$dir" ]]; then
            for pattern in "${security_patterns[@]}"; do
                if grep -r -E "$pattern" "$dir" 2>/dev/null | head -3; then
                    ((issues_found++))
                    scan_result="FAILED"
                fi
            done
        fi
    done

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    SCAN_RESULTS["code_security"]="$scan_result"
    SCAN_DURATIONS["code_security"]="$duration"

    if [[ "$scan_result" == "FAILED" ]]; then
        CRITICAL_ISSUES=$((CRITICAL_ISSUES + issues_found))
        log "ERROR" "Code security scan failed - $issues_found potential issues found"
        return 1
    else
        log "SUCCESS" "Code security scan passed in ${duration}s"
        return 0
    fi
}

# ================================================================
# CRITICAL PERFORMANCE CHECKS
# ================================================================

quick_api_health() {
    local start_time=$(date +%s)
    log "INFO" "Starting quick API health check..."

    local scan_result="PASSED"
    local api_url="${API_URL:-https://aclue-backend-production.up.railway.app}"

    # Test API health endpoint
    if curl -f -s --max-time 10 "$api_url/health" > "${RESULTS_DIR}/api/health-response.json"; then
        log "SUCCESS" "API health endpoint responsive"

        # Check response time
        response_time=$(curl -w "%{time_total}" -s -o /dev/null --max-time 10 "$api_url/health")
        if (( $(echo "$response_time > 2.0" | bc -l) )); then
            log "WARN" "API response time slow: ${response_time}s"
        else
            log "SUCCESS" "API response time good: ${response_time}s"
        fi
    else
        scan_result="FAILED"
        ((CRITICAL_ISSUES++))
        log "CRITICAL" "API health endpoint not responding"
    fi

    # Test critical API endpoints
    local critical_endpoints=("/api/v1/auth/health" "/api/v1/products/" "/api/v1/health")
    for endpoint in "${critical_endpoints[@]}"; do
        if curl -f -s --max-time 5 "$api_url$endpoint" >/dev/null 2>&1; then
            log "SUCCESS" "Endpoint $endpoint responsive"
        else
            log "WARN" "Endpoint $endpoint not responsive"
        fi
    done

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    SCAN_RESULTS["api_health"]="$scan_result"
    SCAN_DURATIONS["api_health"]="$duration"

    if [[ "$scan_result" == "FAILED" ]]; then
        log "ERROR" "API health check failed in ${duration}s"
        return 1
    else
        log "SUCCESS" "API health check passed in ${duration}s"
        return 0
    fi
}

quick_frontend_check() {
    local start_time=$(date +%s)
    log "INFO" "Starting quick frontend check..."

    local scan_result="PASSED"
    local frontend_url="${FRONTEND_URL:-https://aclue.app}"

    # Test frontend availability
    if curl -f -s --max-time 10 "$frontend_url" > "${RESULTS_DIR}/performance/frontend-response.html"; then
        log "SUCCESS" "Frontend accessible"

        # Check for critical errors in HTML
        if grep -i "error\|exception\|500\|404" "${RESULTS_DIR}/performance/frontend-response.html" >/dev/null; then
            scan_result="FAILED"
            ((CRITICAL_ISSUES++))
            log "CRITICAL" "Frontend showing errors"
        fi

        # Basic performance check
        response_time=$(curl -w "%{time_total}" -s -o /dev/null --max-time 10 "$frontend_url")
        if (( $(echo "$response_time > 3.0" | bc -l) )); then
            log "WARN" "Frontend response time slow: ${response_time}s"
        else
            log "SUCCESS" "Frontend response time good: ${response_time}s"
        fi
    else
        scan_result="FAILED"
        ((CRITICAL_ISSUES++))
        log "CRITICAL" "Frontend not accessible"
    fi

    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    SCAN_RESULTS["frontend"]="$scan_result"
    SCAN_DURATIONS["frontend"]="$duration"

    if [[ "$scan_result" == "FAILED" ]]; then
        log "ERROR" "Frontend check failed in ${duration}s"
        return 1
    else
        log "SUCCESS" "Frontend check passed in ${duration}s"
        return 0
    fi
}

# ================================================================
# EXECUTION FUNCTIONS
# ================================================================

run_scan() {
    local scan_name="$1"
    local scan_function="$2"

    ((TOTAL_SCANS++))

    log "INFO" "Executing $scan_name..."

    if $scan_function; then
        ((PASSED_SCANS++))
        log "SUCCESS" "$scan_name completed successfully"
    else
        ((FAILED_SCANS++))
        log "ERROR" "$scan_name failed"
    fi
}

run_scans_parallel() {
    local pids=()

    # Define scans to run
    local scans=(
        "Secret Scan:quick_secret_scan"
        "Dependency Check:quick_dependency_check"
        "Code Security:quick_code_security"
        "API Health:quick_api_health"
        "Frontend Check:quick_frontend_check"
    )

    log "INFO" "Starting parallel quick scans..."

    for scan in "${scans[@]}"; do
        IFS=':' read -r scan_name scan_function <<< "$scan"

        # Run in background
        (run_scan "$scan_name" "$scan_function") &
        pids+=($!)
    done

    # Wait for all scans to complete
    for pid in "${pids[@]}"; do
        wait "$pid"
    done
}

run_scans_sequential() {
    log "INFO" "Starting sequential quick scans..."

    run_scan "Secret Scan" "quick_secret_scan"
    run_scan "Dependency Check" "quick_dependency_check"
    run_scan "Code Security" "quick_code_security"
    run_scan "API Health" "quick_api_health"
    run_scan "Frontend Check" "quick_frontend_check"
}

# ================================================================
# REPORTING FUNCTIONS
# ================================================================

generate_quick_report() {
    log "INFO" "Generating quick scan report..."

    local total_duration=0
    for duration in "${SCAN_DURATIONS[@]}"; do
        total_duration=$((total_duration + duration))
    done

    # Create summary report
    cat > "${RESULTS_DIR}/summary/quick-scan-report.json" << EOF
{
    "metadata": {
        "script_version": "${SCRIPT_VERSION}",
        "timestamp": "${TIMESTAMP}",
        "total_duration": ${total_duration}
    },
    "statistics": {
        "total_scans": ${TOTAL_SCANS},
        "passed_scans": ${PASSED_SCANS},
        "failed_scans": ${FAILED_SCANS},
        "critical_issues": ${CRITICAL_ISSUES},
        "success_rate": $(( TOTAL_SCANS > 0 ? (PASSED_SCANS * 100) / TOTAL_SCANS : 0 ))
    },
    "scans": {
$(for scan in "${!SCAN_RESULTS[@]}"; do
    echo "        \"$scan\": {"
    echo "            \"result\": \"${SCAN_RESULTS[$scan]}\","
    echo "            \"duration\": ${SCAN_DURATIONS[$scan]}"
    echo "        },"
done | sed '$ s/,$//')
    }
}
EOF

    # Create human-readable report
    cat > "${RESULTS_DIR}/summary/quick-scan-summary.txt" << EOF
================================================================
ACLUE QUICK SCAN REPORT
================================================================
Scan Date: $(date)
Duration: ${total_duration}s
Version: ${SCRIPT_VERSION}

SUMMARY:
- Total Scans: ${TOTAL_SCANS}
- Passed: ${PASSED_SCANS}
- Failed: ${FAILED_SCANS}
- Critical Issues: ${CRITICAL_ISSUES}
- Success Rate: $(( TOTAL_SCANS > 0 ? (PASSED_SCANS * 100) / TOTAL_SCANS : 0 ))%

SCAN RESULTS:
$(for scan in "${!SCAN_RESULTS[@]}"; do
    printf "%-20s: %s (%ss)\n" "$scan" "${SCAN_RESULTS[$scan]}" "${SCAN_DURATIONS[$scan]}"
done)

DEPLOYMENT GATE:
$(if [[ $CRITICAL_ISSUES -eq 0 && $FAILED_SCANS -eq 0 ]]; then
    echo "✅ PASSED - Safe to deploy"
else
    echo "❌ FAILED - Do not deploy (Critical Issues: $CRITICAL_ISSUES, Failed Scans: $FAILED_SCANS)"
fi)

================================================================
EOF

    log "SUCCESS" "Quick scan report generated: ${RESULTS_DIR}/summary/"
}

print_summary() {
    echo
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo -e "${BOLD}${BLUE}                    QUICK SCAN SUMMARY${NC}"
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo

    echo -e "📊 ${BOLD}Statistics:${NC}"
    echo -e "   Total Scans: ${TOTAL_SCANS}"
    echo -e "   Passed: ${GREEN}${PASSED_SCANS}${NC}"
    echo -e "   Failed: ${RED}${FAILED_SCANS}${NC}"
    echo -e "   Critical Issues: ${RED}${CRITICAL_ISSUES}${NC}"
    echo -e "   Success Rate: $(( TOTAL_SCANS > 0 ? (PASSED_SCANS * 100) / TOTAL_SCANS : 0 ))%"
    echo

    echo -e "🔍 ${BOLD}Scan Results:${NC}"
    for scan in "${!SCAN_RESULTS[@]}"; do
        local result="${SCAN_RESULTS[$scan]}"
        local duration="${SCAN_DURATIONS[$scan]}"
        local color="${GREEN}"
        [[ "$result" == "FAILED" ]] && color="${RED}"

        printf "   %-20s: %b%s%b (%ss)\n" "$scan" "$color" "$result" "$NC" "$duration"
    done
    echo

    echo -e "🚪 ${BOLD}Deployment Gate:${NC}"
    if [[ $CRITICAL_ISSUES -eq 0 && $FAILED_SCANS -eq 0 ]]; then
        echo -e "   ${GREEN}✅ PASSED${NC} - Safe to deploy"
    else
        echo -e "   ${RED}❌ FAILED${NC} - Do not deploy"
        echo -e "   Critical Issues: ${CRITICAL_ISSUES}, Failed Scans: ${FAILED_SCANS}"
    fi

    echo
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo -e "📁 Results saved to: ${RESULTS_DIR}"
    echo -e "${BOLD}${BLUE}================================================================${NC}"
}

# ================================================================
# MAIN EXECUTION
# ================================================================

cleanup() {
    log "INFO" "Cleaning up background processes..."
    jobs -p | xargs -r kill 2>/dev/null || true
}

main() {
    trap cleanup EXIT

    local start_time=$(date +%s)

    print_banner
    setup_directories

    # Check if required tools are available
    local required_tools=("curl" "grep" "jq")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log "ERROR" "Required tool not found: $tool"
            exit 1
        fi
    done

    # Execute scans
    if [[ "$PARALLEL_EXECUTION" == "true" ]]; then
        timeout "$TIMEOUT_DURATION" run_scans_parallel
    else
        timeout "$TIMEOUT_DURATION" run_scans_sequential
    fi

    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))

    # Generate reports
    generate_quick_report
    print_summary

    log "INFO" "Quick scan completed in ${total_duration}s"

    # Exit with appropriate code
    if [[ $CRITICAL_ISSUES -eq 0 && $FAILED_SCANS -eq 0 ]]; then
        log "SUCCESS" "Quick scan passed - deployment gate OPEN"
        exit 0
    else
        log "CRITICAL" "Quick scan failed - deployment gate CLOSED"
        exit 1
    fi
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi