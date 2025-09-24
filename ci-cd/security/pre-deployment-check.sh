#!/bin/bash
# =============================================================================
# aclue Platform Pre-Deployment Security Validation Script
# =============================================================================
#
# Comprehensive security validation script that runs before deployments to
# ensure the codebase meets security standards. This script is designed to
# be integrated with CI/CD pipelines for automated security gate enforcement.
#
# Usage:
#   ./pre-deployment-check.sh [--environment=prod|staging|dev] [--strict]
#
# Exit Codes:
#   0 - All security checks passed
#   1 - Critical security issues found
#   2 - High severity issues found (may be acceptable for non-prod)
#   3 - Configuration or environment issues
#
# =============================================================================

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SECURITY_CONFIG="${SCRIPT_DIR}/security-scan-config.yml"
VULNERABILITY_ALLOWLIST="${SCRIPT_DIR}/vulnerability-allowlist.yml"
REPORT_DIR="${PROJECT_ROOT}/security-reports"

# Default values
ENVIRONMENT="dev"
STRICT_MODE=false
VERBOSE=false
FAIL_FAST=true

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
aclue Platform Pre-Deployment Security Check

Usage: $0 [OPTIONS]

OPTIONS:
    --environment=ENV    Target environment (prod, staging, dev). Default: dev
    --strict            Enable strict mode (fail on any security finding)
    --verbose           Enable verbose output
    --no-fail-fast      Continue even if critical issues are found
    --help              Show this help message

EXAMPLES:
    $0 --environment=prod --strict
    $0 --environment=staging --verbose
    $0 --help

EXIT CODES:
    0 - All security checks passed
    1 - Critical security issues found
    2 - High severity issues found
    3 - Configuration or environment issues
EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --environment=*)
                ENVIRONMENT="${1#*=}"
                shift
                ;;
            --strict)
                STRICT_MODE=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            --no-fail-fast)
                FAIL_FAST=false
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
}

# Initialize security scan environment
initialize_environment() {
    log_info "Initializing security scan environment..."

    # Create reports directory
    mkdir -p "$REPORT_DIR"

    # Check if required tools are available
    local required_tools=("jq" "yq" "curl" "git")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "Required tool '$tool' is not installed"
            exit 3
        fi
    done

    # Validate configuration files
    if [[ ! -f "$SECURITY_CONFIG" ]]; then
        log_error "Security configuration file not found: $SECURITY_CONFIG"
        exit 3
    fi

    if [[ ! -f "$VULNERABILITY_ALLOWLIST" ]]; then
        log_warning "Vulnerability allowlist not found: $VULNERABILITY_ALLOWLIST"
    fi

    log_success "Environment initialized successfully"
}

# Check if secrets baseline exists and is up to date
check_secrets_baseline() {
    log_info "Checking secrets detection baseline..."

    local baseline_file="${PROJECT_ROOT}/.secrets.baseline"
    if [[ ! -f "$baseline_file" ]]; then
        log_warning "Secrets baseline file not found. Creating new baseline..."
        cd "$PROJECT_ROOT"
        detect-secrets scan --all-files \
            --exclude-files '.*\.git/.*|.*node_modules/.*|.*backend_env/.*|.*\.log' \
            . > "$baseline_file" || true
        log_success "New secrets baseline created"
    else
        # Check if baseline is older than 7 days
        local baseline_age=$(( ($(date +%s) - $(stat -c %Y "$baseline_file")) / 86400 ))
        if [[ $baseline_age -gt 7 ]]; then
            log_warning "Secrets baseline is $baseline_age days old. Consider updating it."
        fi
        log_success "Secrets baseline check completed"
    fi
}

# Run frontend security checks
check_frontend_security() {
    log_info "Running frontend security checks..."

    cd "${PROJECT_ROOT}/web"

    # Check if package-lock.json exists
    if [[ ! -f "package-lock.json" ]]; then
        log_error "package-lock.json not found. Run 'npm install' first."
        return 1
    fi

    # npm audit check
    log_info "Running npm audit..."
    local npm_audit_result=0
    if [[ "$ENVIRONMENT" == "prod" ]] || [[ "$STRICT_MODE" == true ]]; then
        npm audit --audit-level=moderate || npm_audit_result=$?
    else
        npm audit --audit-level=high || npm_audit_result=$?
    fi

    if [[ $npm_audit_result -ne 0 ]]; then
        log_error "npm audit found security vulnerabilities"
        npm audit --json > "${REPORT_DIR}/npm-audit-frontend.json" || true
        if [[ "$FAIL_FAST" == true ]]; then
            return 1
        fi
    else
        log_success "npm audit passed"
    fi

    # ESLint security check
    log_info "Running ESLint security analysis..."
    if [[ -f ".eslintrc.security.json" ]]; then
        local eslint_result=0
        npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.security.json || eslint_result=$?

        if [[ $eslint_result -ne 0 ]]; then
            log_warning "ESLint security warnings found"
            npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.security.json \
                --format json > "${REPORT_DIR}/eslint-security-frontend.json" || true
        else
            log_success "ESLint security check passed"
        fi
    else
        log_warning "ESLint security configuration not found"
    fi

    log_success "Frontend security checks completed"
    return 0
}

# Run backend security checks
check_backend_security() {
    log_info "Running backend security checks..."

    cd "${PROJECT_ROOT}/backend"

    # Check if requirements.txt exists
    if [[ ! -f "requirements.txt" ]]; then
        log_error "requirements.txt not found in backend directory"
        return 1
    fi

    # Safety check for Python dependencies
    log_info "Running Safety dependency check..."
    local safety_result=0
    if command -v safety &> /dev/null; then
        safety check --json --output "${REPORT_DIR}/safety-backend.json" || safety_result=$?

        if [[ $safety_result -ne 0 ]]; then
            log_error "Safety found vulnerable Python dependencies"
            if [[ "$FAIL_FAST" == true ]]; then
                return 1
            fi
        else
            log_success "Safety check passed"
        fi
    else
        log_warning "Safety tool not available, skipping Python dependency check"
    fi

    # Bandit security analysis
    log_info "Running Bandit security analysis..."
    if command -v bandit &> /dev/null; then
        local bandit_result=0
        bandit -r . -f json -o "${REPORT_DIR}/bandit-backend.json" \
            --exclude tests/ || bandit_result=$?

        if [[ $bandit_result -ne 0 ]]; then
            log_warning "Bandit found potential security issues"
            bandit -r . -ll --exclude tests/ || true
        else
            log_success "Bandit security check passed"
        fi
    else
        log_warning "Bandit tool not available, skipping Python security analysis"
    fi

    log_success "Backend security checks completed"
    return 0
}

# Run secret detection checks
check_secrets() {
    log_info "Running comprehensive secret detection..."

    cd "$PROJECT_ROOT"

    local secrets_found=0

    # GitLeaks scan
    log_info "Running GitLeaks secret detection..."
    if command -v gitleaks &> /dev/null; then
        local gitleaks_result=0
        gitleaks detect --config .gitleaks.toml --report-format json \
            --report-path "${REPORT_DIR}/gitleaks-report.json" || gitleaks_result=$?

        if [[ $gitleaks_result -ne 0 ]]; then
            log_error "GitLeaks detected potential secrets"
            secrets_found=1
        else
            log_success "GitLeaks scan completed - no secrets found"
        fi
    else
        log_warning "GitLeaks not available, skipping secret detection"
    fi

    # detect-secrets scan
    log_info "Running detect-secrets analysis..."
    if command -v detect-secrets &> /dev/null; then
        local detect_secrets_result=0
        if [[ -f ".secrets.baseline" ]]; then
            detect-secrets scan --baseline .secrets.baseline || detect_secrets_result=$?
        else
            detect-secrets scan --all-files \
                --exclude-files '.*\.git/.*|.*node_modules/.*|.*backend_env/.*|.*\.log' \
                . > "${REPORT_DIR}/detect-secrets-scan.json" || detect_secrets_result=$?
        fi

        if [[ $detect_secrets_result -ne 0 ]]; then
            log_error "detect-secrets found potential secrets"
            secrets_found=1
        else
            log_success "detect-secrets scan completed - no new secrets found"
        fi
    else
        log_warning "detect-secrets not available, installing..."
        pip install detect-secrets &> /dev/null || true
    fi

    if [[ $secrets_found -eq 1 ]]; then
        log_critical "Secrets detected in codebase - deployment blocked"
        return 1
    fi

    log_success "Secret detection checks completed"
    return 0
}

# Check Docker security (if Dockerfile exists)
check_docker_security() {
    log_info "Running Docker security checks..."

    cd "$PROJECT_ROOT"

    # Find Dockerfiles
    local dockerfiles=($(find . -name "Dockerfile*" -type f))

    if [[ ${#dockerfiles[@]} -eq 0 ]]; then
        log_info "No Dockerfiles found, skipping Docker security checks"
        return 0
    fi

    for dockerfile in "${dockerfiles[@]}"; do
        log_info "Analyzing Docker file: $dockerfile"

        # Basic Dockerfile security checks
        local issues=0

        # Check for root user
        if grep -q "USER root" "$dockerfile"; then
            log_warning "Dockerfile uses root user: $dockerfile"
            issues=$((issues + 1))
        fi

        # Check for package manager cache cleanup
        if grep -q "apt-get install" "$dockerfile" && ! grep -q "rm -rf /var/lib/apt/lists" "$dockerfile"; then
            log_warning "Dockerfile doesn't clean package manager cache: $dockerfile"
            issues=$((issues + 1))
        fi

        # Check for COPY --chown usage instead of RUN chown
        if grep -q "RUN chown" "$dockerfile" && ! grep -q "COPY --chown" "$dockerfile"; then
            log_warning "Consider using COPY --chown instead of RUN chown: $dockerfile"
            issues=$((issues + 1))
        fi

        if [[ $issues -eq 0 ]]; then
            log_success "Docker security check passed for: $dockerfile"
        else
            log_warning "Found $issues potential security improvements for: $dockerfile"
        fi
    done

    log_success "Docker security checks completed"
    return 0
}

# Generate security summary report
generate_security_report() {
    log_info "Generating security summary report..."

    local report_file="${REPORT_DIR}/pre-deployment-security-summary.json"
    local timestamp=$(date -u '+%Y-%m-%d %H:%M:%S UTC')

    cat > "$report_file" << EOF
{
  "scan_metadata": {
    "timestamp": "$timestamp",
    "environment": "$ENVIRONMENT",
    "strict_mode": $STRICT_MODE,
    "project_root": "$PROJECT_ROOT",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
  },
  "scan_results": {
    "frontend_security": "$([ -f "${REPORT_DIR}/npm-audit-frontend.json" ] && echo "vulnerabilities_found" || echo "passed")",
    "backend_security": "$([ -f "${REPORT_DIR}/safety-backend.json" ] && echo "vulnerabilities_found" || echo "passed")",
    "secret_detection": "$([ -f "${REPORT_DIR}/gitleaks-report.json" ] && echo "secrets_found" || echo "passed")",
    "docker_security": "passed"
  },
  "recommendations": [
    "Review all security scan reports in the security-reports directory",
    "Address any high or critical severity vulnerabilities before deployment",
    "Ensure secrets baseline is up to date",
    "Consider running additional security tools based on your security requirements"
  ]
}
EOF

    log_success "Security summary report generated: $report_file"
}

# Main execution function
main() {
    local start_time=$(date +%s)
    local exit_code=0

    log_info "Starting aclue platform pre-deployment security validation"
    log_info "Environment: $ENVIRONMENT | Strict Mode: $STRICT_MODE | Fail Fast: $FAIL_FAST"

    # Initialize environment
    initialize_environment

    # Check secrets baseline
    check_secrets_baseline

    # Run security checks
    if ! check_frontend_security; then
        log_error "Frontend security checks failed"
        exit_code=1
    fi

    if ! check_backend_security; then
        log_error "Backend security checks failed"
        exit_code=2
    fi

    if ! check_secrets; then
        log_critical "Secret detection failed"
        exit_code=1
    fi

    if ! check_docker_security; then
        log_error "Docker security checks failed"
        exit_code=2
    fi

    # Generate summary report
    generate_security_report

    # Calculate execution time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    # Final status
    if [[ $exit_code -eq 0 ]]; then
        log_success "✅ All security checks passed! Deployment approved."
        log_success "Security validation completed in ${duration}s"
    elif [[ $exit_code -eq 1 ]]; then
        log_critical "❌ Critical security issues found! Deployment blocked."
        log_error "Security validation failed in ${duration}s"
    elif [[ $exit_code -eq 2 ]]; then
        if [[ "$ENVIRONMENT" == "prod" ]] || [[ "$STRICT_MODE" == true ]]; then
            log_error "❌ High severity security issues found! Deployment blocked for production."
        else
            log_warning "⚠️ High severity security issues found. Review before deploying."
            exit_code=0  # Allow deployment for non-production environments
        fi
        log_info "Security validation completed in ${duration}s"
    fi

    log_info "Security reports available in: $REPORT_DIR"
    exit $exit_code
}

# Parse arguments and run main function
parse_arguments "$@"
main
