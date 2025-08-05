#!/bin/bash

# Comprehensive Deployment Pipeline Test Script
# Tests all components of the GiftSync deployment system

set -euo pipefail

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

# Test configuration
TEST_LOG_FILE="$LOG_DIR/pipeline-test-$(date +%Y%m%d-%H%M%S).log"
TEST_RESULTS_FILE="$LOG_DIR/pipeline-test-results-$(date +%Y%m%d-%H%M%S).json"
mkdir -p "$LOG_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Test tracking
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
declare -a TEST_RESULTS=()

log_test() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    
    echo "[$timestamp] [$level] $message" | tee -a "$TEST_LOG_FILE"
    
    case "$level" in
        "ERROR")   echo -e "${RED}❌ $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO")    echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "TEST")    echo -e "${PURPLE}🧪 $message${NC}" ;;
    esac
}

run_test() {
    local test_name="$1"
    local test_command="$2"
    local expected_result="${3:-0}"
    
    TOTAL_TESTS=$((TOTAL_TESTS + 1))
    log_test "TEST" "Running: $test_name"
    
    local start_time=$(date +%s)
    local result_code=0
    
    if eval "$test_command" >> "$TEST_LOG_FILE" 2>&1; then
        result_code=0
    else
        result_code=$?
    fi
    
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))
    
    if [[ $result_code -eq $expected_result ]]; then
        PASSED_TESTS=$((PASSED_TESTS + 1))
        log_test "SUCCESS" "$test_name - PASSED (${duration}s)"
        TEST_RESULTS+=("{\"name\":\"$test_name\",\"status\":\"passed\",\"duration\":$duration}")
        return 0
    else
        FAILED_TESTS=$((FAILED_TESTS + 1))
        log_test "ERROR" "$test_name - FAILED (${duration}s, exit code: $result_code)"
        TEST_RESULTS+=("{\"name\":\"$test_name\",\"status\":\"failed\",\"duration\":$duration,\"exit_code\":$result_code}")
        return 1
    fi
}

# Test 1: Environment Configuration
test_environment_config() {
    log_test "INFO" "Testing environment configuration..."
    
    # Check required environment variables
    run_test "Cloudflare API Token Set" "test -n '$CLOUDFLARE_API_TOKEN'"
    run_test "Cloudflare Account ID Set" "test -n '$CLOUDFLARE_ACCOUNT_ID'"
    run_test "Railway Backend URL Set" "test -n '$RAILWAY_BACKEND_URL'"
    run_test "Domains Configuration Set" "test -n '$DOMAINS'"
    run_test "Project Root Set" "test -n '$PROJECT_ROOT'"
    
    # Check directories exist
    run_test "Backup Directory Exists" "test -d '$BACKUP_DIR'"
    run_test "Log Directory Exists" "test -d '$LOG_DIR'"
    run_test "Project Root Exists" "test -d '$PROJECT_ROOT'"
}

# Test 2: Script Permissions and Executability
test_script_permissions() {
    log_test "INFO" "Testing script permissions..."
    
    local scripts=(
        "check-status.sh"
        "config-manager.sh"
        "deploy-security.sh"
        "deploy-with-cache-purge.sh"
        "dns-backup.sh"
        "integrate-deployment.sh"
        "monitor-domains.sh"
        "purge-cache.sh"
        "rollback-manager.sh"
        "security-alerts.sh"
        "security-audit.sh"
        "security-firewall-rules.sh"
        "security-headers.sh"
        "security-monitor.sh"
        "setup-pipeline.sh"
        "scripts/health-check.sh"
    )
    
    for script in "${scripts[@]}"; do
        run_test "Script Executable: $script" "test -x '$SCRIPT_DIR/$script'"
    done
}

# Test 3: Cloudflare API Connectivity
test_cloudflare_api() {
    log_test "INFO" "Testing Cloudflare API connectivity..."
    
    # Test API token validity
    run_test "Cloudflare API Token Valid" "curl -s -f -H 'Authorization: Bearer $CLOUDFLARE_API_TOKEN' 'https://api.cloudflare.com/client/v4/user/tokens/verify' | grep -q '\"success\":true'"
    
    # Test zone access
    run_test "Cloudflare Zone Access" "curl -s -f -H 'Authorization: Bearer $CLOUDFLARE_API_TOKEN' 'https://api.cloudflare.com/client/v4/zones' | grep -q '\"success\":true'"
    
    # Test account access
    run_test "Cloudflare Account Access" "curl -s -f -H 'Authorization: Bearer $CLOUDFLARE_API_TOKEN' 'https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID' | grep -q '\"success\":true'"
}

# Test 4: Domain and SSL Health
test_domain_health() {
    log_test "INFO" "Testing domain health and SSL..."
    
    IFS=' ' read -ra DOMAIN_ARRAY <<< "$DOMAINS"
    
    for domain in "${DOMAIN_ARRAY[@]}"; do
        # HTTP connectivity
        run_test "HTTP Access: $domain" "curl -f -s --max-time 10 'https://$domain' > /dev/null"
        
        # SSL certificate validity
        run_test "SSL Certificate: $domain" "echo | openssl s_client -servername '$domain' -connect '$domain:443' 2>/dev/null | openssl x509 -noout -dates | grep -q 'notAfter'"
        
        # Security headers presence
        run_test "Security Headers: $domain" "curl -sI 'https://$domain' | grep -qi 'x-frame-options\\|strict-transport-security'"
    done
}

# Test 5: Backend Health
test_backend_health() {
    log_test "INFO" "Testing backend health..."
    
    # Basic connectivity
    run_test "Backend Health Endpoint" "curl -f -s --max-time 10 '$RAILWAY_BACKEND_URL/health' > /dev/null"
    
    # API endpoint accessibility (should return 307 redirect or 401 auth required)
    run_test "Backend API Endpoint" "curl -s --max-time 10 '$RAILWAY_BACKEND_URL/api/v1/products' | grep -qE '307|401|200'"
    
    # Response time check
    run_test "Backend Response Time" "test $(curl -s -o /dev/null -w '%{time_total}' --max-time 10 '$RAILWAY_BACKEND_URL/health' | cut -d. -f1) -lt 5"
}

# Test 6: Health Check System
test_health_check_system() {
    log_test "INFO" "Testing health check system..."
    
    # Individual health check components
    run_test "Domain Health Check" "./scripts/health-check.sh domain aclue.co.uk"
    run_test "Backend Health Check" "./scripts/health-check.sh backend"
    run_test "CDN Performance Check" "./scripts/health-check.sh cdn"
    
    # JSON output generation
    run_test "JSON Report Generation" "./scripts/health-check.sh json-only | jq . > /dev/null"
}

# Test 7: DNS Backup System
test_dns_backup() {
    log_test "INFO" "Testing DNS backup system..."
    
    # DNS backup functionality
    run_test "DNS Backup Script" "./dns-backup.sh --dry-run"
    
    # Check backup file format
    if [[ -f "$BACKUP_DIR/aclue.co.uk_dns_backup_$(date +%Y%m%d)_*.json" ]]; then
        run_test "DNS Backup File Format" "ls $BACKUP_DIR/*_dns_backup_*.json | head -1 | xargs jq . > /dev/null"
    fi
}

# Test 8: Security Configuration
test_security_config() {
    log_test "INFO" "Testing security configuration..."
    
    # Security headers deployment (dry run)
    run_test "Security Headers Config" "./security-headers.sh --dry-run"
    
    # Security audit
    run_test "Security Audit" "./security-audit.sh --quiet"
    
    # Firewall rules check
    run_test "Firewall Rules Check" "./security-firewall-rules.sh --check"
}

# Test 9: Cache Management
test_cache_management() {
    log_test "INFO" "Testing cache management..."
    
    # Cache purge (dry run if possible)
    run_test "Cache Purge Script" "./purge-cache.sh --dry-run"
    
    # CDN status check
    run_test "CDN Status Check" "curl -sI 'https://aclue.co.uk' | grep -q 'server.*cloudflare'"
}

# Test 10: Configuration Management
test_config_management() {
    log_test "INFO" "Testing configuration management..."
    
    # Config validation
    run_test "Deployment Config Validation" "./config-manager.sh validate"
    
    # Config file parsing
    run_test "YAML Config Parsing" "python3 -c 'import yaml; yaml.safe_load(open(\"config/deployment-config.yaml\"))'"
}

# Test 11: GitHub Actions Workflow
test_github_workflow() {
    log_test "INFO" "Testing GitHub Actions workflow..."
    
    # Workflow file exists
    run_test "GitHub Workflow Exists" "test -f '$PROJECT_ROOT/.github/workflows/deploy.yml'"
    
    # Workflow syntax validation
    if command -v yamllint > /dev/null; then
        run_test "Workflow YAML Syntax" "yamllint '$PROJECT_ROOT/.github/workflows/deploy.yml'"
    else
        run_test "Workflow YAML Basic Check" "python3 -c 'import yaml; yaml.safe_load(open(\"$PROJECT_ROOT/.github/workflows/deploy.yml\"))'"
    fi
}

# Test 12: Integration Test
test_end_to_end_integration() {
    log_test "INFO" "Testing end-to-end integration..."
    
    # Full health check run
    run_test "Complete Health Check" "./scripts/health-check.sh"
    
    # Status monitoring
    run_test "Status Monitoring" "./check-status.sh"
    
    # Integration deployment check
    run_test "Integration Check" "./integrate-deployment.sh --check"
}

generate_test_report() {
    local timestamp=$(date -u +%Y-%m-%dT%H:%M:%SZ)
    local success_rate=$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))
    
    cat > "$TEST_RESULTS_FILE" << EOF
{
  "timestamp": "$timestamp",
  "summary": {
    "total_tests": $TOTAL_TESTS,
    "passed_tests": $PASSED_TESTS,
    "failed_tests": $FAILED_TESTS,
    "success_rate": $success_rate
  },
  "results": [
$(IFS=,; echo "${TEST_RESULTS[*]}")
  ],
  "log_file": "$TEST_LOG_FILE",
  "overall_status": "$(if [[ $FAILED_TESTS -eq 0 ]]; then echo "PASSED"; else echo "FAILED"; fi)"
}
EOF
    
    log_test "INFO" "Test report generated: $TEST_RESULTS_FILE"
}

print_summary() {
    echo
    echo "============================================="
    echo "        DEPLOYMENT PIPELINE TEST SUMMARY"
    echo "============================================="
    echo
    echo -e "Total Tests:  ${BLUE}$TOTAL_TESTS${NC}"
    echo -e "Passed:       ${GREEN}$PASSED_TESTS${NC}"
    echo -e "Failed:       ${RED}$FAILED_TESTS${NC}"
    echo -e "Success Rate: ${BLUE}$(( (PASSED_TESTS * 100) / TOTAL_TESTS ))%${NC}"
    echo
    echo -e "Log File:     ${BLUE}$TEST_LOG_FILE${NC}"
    echo -e "Results File: ${BLUE}$TEST_RESULTS_FILE${NC}"
    echo
    
    if [[ $FAILED_TESTS -eq 0 ]]; then
        echo -e "${GREEN}🎉 ALL TESTS PASSED! Deployment pipeline is ready.${NC}"
        echo
        return 0
    else
        echo -e "${RED}❌ SOME TESTS FAILED. Please review the logs and fix issues.${NC}"
        echo
        echo "Failed tests can be found in the log file:"
        echo "  tail -f $TEST_LOG_FILE"
        echo
        return 1
    fi
}

main() {
    log_test "INFO" "Starting comprehensive deployment pipeline test"
    log_test "INFO" "Test log: $TEST_LOG_FILE"
    echo
    
    # Run all test suites
    test_environment_config
    test_script_permissions
    test_cloudflare_api
    test_domain_health
    test_backend_health
    test_health_check_system
    test_dns_backup
    test_security_config
    test_cache_management
    test_config_management
    test_github_workflow
    test_end_to_end_integration
    
    # Generate report and summary
    generate_test_report
    print_summary
}

# Handle command line arguments
case "${1:-main}" in
    "environment")
        test_environment_config
        ;;
    "scripts")
        test_script_permissions
        ;;
    "cloudflare")
        test_cloudflare_api
        ;;
    "domains")
        test_domain_health
        ;;
    "backend")
        test_backend_health
        ;;
    "health")
        test_health_check_system
        ;;
    "security")
        test_security_config
        ;;
    "integration")
        test_end_to_end_integration
        ;;
    "quick")
        test_environment_config
        test_cloudflare_api
        test_domain_health
        test_backend_health
        generate_test_report
        print_summary
        ;;
    "main"|*)
        main
        ;;
esac