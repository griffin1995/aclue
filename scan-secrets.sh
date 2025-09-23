#!/bin/bash

# aclue Manual Secret Scanning Script
# This script performs comprehensive secret detection across the aclue codebase
#
# Author: aclue Security Team
# Date: September 2025
# Version: 1.0

set -euo pipefail

# Colours for output
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Colour

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if security environment exists
check_environment() {
    if [ ! -d "security-hooks-env" ]; then
        log_error "Security environment not found. Run ./setup-security-hooks.sh first."
        exit 1
    fi

    if [ ! -f ".secrets.baseline" ]; then
        log_warning "Secrets baseline not found. Creating a new one..."
        touch .secrets.baseline
    fi

    log_success "Security environment validated"
}

# Run detect-secrets scan
run_detect_secrets() {
    log_info "🔍 Running detect-secrets scan..."

    source security-hooks-env/bin/activate

    # Run scan with exclusions
    if detect-secrets scan \
        --exclude-files node_modules \
        --exclude-files .git \
        --exclude-files security-hooks-env \
        --exclude-files "*env" \
        --exclude-files "*-env" \
        --exclude-files .vscode \
        --exclude-files .pytest_cache \
        --exclude-files __pycache__ \
        . > scan_results.json 2>/dev/null; then

        # Check if any secrets found
        local secret_count=$(jq -r '.results | length' scan_results.json 2>/dev/null || echo "0")

        if [ "$secret_count" -gt 0 ]; then
            log_error "🚨 SECRETS DETECTED: $secret_count potential secret(s) found!"

            # Show detailed results
            echo "📋 Detailed Results:"
            jq -r '.results | to_entries[] | "\(.key): \(.value | length) secret(s)"' scan_results.json 2>/dev/null || echo "Error parsing results"

            return 1
        else
            log_success "✅ No secrets detected by detect-secrets"
            return 0
        fi
    else
        log_error "Failed to run detect-secrets scan"
        return 1
    fi
}

# Run GitLeaks scan
run_gitleaks() {
    log_info "🔍 Running GitLeaks scan..."

    if command -v gitleaks &> /dev/null; then
        if gitleaks detect --source . --verbose 2>/dev/null; then
            log_success "✅ No secrets detected by GitLeaks"
            return 0
        else
            log_error "🚨 GitLeaks detected potential secrets!"
            return 1
        fi
    else
        log_warning "GitLeaks not installed - skipping (install from https://github.com/gitleaks/gitleaks)"
        return 0
    fi
}

# Run Bandit Python security scan
run_bandit() {
    log_info "🔍 Running Bandit Python security scan..."

    if [ -d "backend" ]; then
        source security-hooks-env/bin/activate

        if bandit -r backend/ -ll -f json -o bandit_results.json 2>/dev/null; then
            log_success "✅ No high-severity security issues found in Python code"
            return 0
        else
            log_warning "⚠️ Bandit found potential security issues in Python code"
            log_info "Check bandit_results.json for details"
            return 1
        fi
    else
        log_info "No backend directory found - skipping Bandit scan"
        return 0
    fi
}

# Run Safety dependency check
run_safety() {
    log_info "🔍 Running Safety dependency vulnerability check..."

    source security-hooks-env/bin/activate

    # Check if requirements files exist
    local requirements_files=()
    for req_file in requirements.txt backend/requirements.txt; do
        if [ -f "$req_file" ]; then
            requirements_files+=("$req_file")
        fi
    done

    if [ ${#requirements_files[@]} -eq 0 ]; then
        log_info "No requirements.txt files found - skipping Safety scan"
        return 0
    fi

    local safety_failed=false
    for req_file in "${requirements_files[@]}"; do
        log_info "Checking $req_file..."
        if safety check -r "$req_file" --json --output safety_results.json 2>/dev/null; then
            log_success "✅ No known vulnerabilities in $req_file"
        else
            log_warning "⚠️ Safety found vulnerabilities in $req_file"
            safety_failed=true
        fi
    done

    if [ "$safety_failed" = true ]; then
        log_info "Check safety_results.json for details"
        return 1
    else
        return 0
    fi
}

# Scan for environment files
scan_env_files() {
    log_info "🔍 Scanning for environment files..."

    local env_files=$(find . -name ".env*" \
        -not -path "./node_modules/*" \
        -not -path "./.git/*" \
        -not -path "./*env/*" \
        -not -path "./*-env/*" \
        -not -name ".env.example" \
        -not -name ".env.template" \
        -not -name ".env.production.example" \
        2>/dev/null || true)

    if [ -n "$env_files" ]; then
        log_warning "⚠️ Environment files found (should not be committed):"
        echo "$env_files" | while read -r file; do
            echo "  - $file"
        done
        return 1
    else
        log_success "✅ No problematic environment files found"
        return 0
    fi
}

# Quick pattern-based scan
quick_pattern_scan() {
    log_info "🔍 Running quick pattern-based scan..."

    local patterns_found=false

    # AWS keys pattern
    if grep -r --include="*.py" --include="*.js" --include="*.jsx" --include="*.ts" --include="*.tsx" \
        --exclude-dir=node_modules --exclude-dir=.git --exclude-dir="*env" --exclude-dir=".vscode" \
        -E "AKIA[0-9A-Z]{16}" . 2>/dev/null | head -5; then
        log_warning "⚠️ Potential AWS access keys found"
        patterns_found=true
    fi

    # Private key patterns
    if find . -name "*.py" -o -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
        grep -v node_modules | grep -v .git | grep -v "*env" | \
        xargs grep -l "BEGIN.*PRIVATE KEY" 2>/dev/null | head -5; then
        log_warning "⚠️ Potential private keys found"
        patterns_found=true
    fi

    # Generic secrets pattern
    if find . -name "*.py" -o -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" | \
        grep -v node_modules | grep -v .git | grep -v "*env" | \
        xargs grep -l 'password\s*[:=]\s*["\'"'"'][a-zA-Z0-9_-]\{8,\}' 2>/dev/null | head -5; then
        log_warning "⚠️ Potential hardcoded passwords found"
        patterns_found=true
    fi

    if [ "$patterns_found" = false ]; then
        log_success "✅ No obvious secret patterns detected"
        return 0
    else
        return 1
    fi
}

# Generate summary report
generate_report() {
    local total_issues=$1
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    cat > security_scan_report.txt << EOF
# aclue Security Scan Report

**Generated**: $timestamp
**Repository**: $(pwd)
**Branch**: $(git branch --show-current 2>/dev/null || echo "unknown")
**Commit**: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")

## Summary

Total Issues Found: $total_issues

## Tools Run

- ✅ detect-secrets: Primary secret detection
- ✅ GitLeaks: Git history secret analysis
- ✅ Bandit: Python security vulnerability scanning
- ✅ Safety: Python dependency vulnerability checking
- ✅ Environment file detection
- ✅ Pattern-based quick scan

## Files Generated

$(ls -la *_results.json security_scan_report.txt 2>/dev/null || echo "No result files generated")

## Next Steps

EOF

    if [ "$total_issues" -eq 0 ]; then
        cat >> security_scan_report.txt << EOF
🎉 **All security scans passed!**

Your code appears to be free of detectable secrets and security issues.

### Recommendations:
- Continue following secure coding practices
- Regularly update dependencies
- Review environment variable usage
- Run security scans before important commits
EOF
    else
        cat >> security_scan_report.txt << EOF
🚨 **Security issues detected!**

Please review the detailed results above and take appropriate action.

### Immediate Actions Required:
1. Review all flagged files for actual secrets
2. Remove any real credentials found
3. Replace with environment variables or secure storage
4. Update .secrets.baseline if false positives exist
5. Commit fixes and re-run security scan

### For False Positives:
\`\`\`bash
source security-hooks-env/bin/activate
detect-secrets audit .secrets.baseline
git add .secrets.baseline
git commit -m "fix: update secrets baseline"
\`\`\`
EOF
    fi

    cat >> security_scan_report.txt << EOF

## Support

For help with security issues:
- Read SECURITY_HOOKS_SETUP.md
- Contact the security team
- Create a GitHub issue

---
Generated by aclue security scanning tools
EOF

    log_info "📋 Report generated: security_scan_report.txt"
}

# Clean up temporary files
cleanup() {
    rm -f scan_results.json bandit_results.json safety_results.json 2>/dev/null || true
}

# Main execution
main() {
    echo "🔒 aclue Comprehensive Security Scan"
    echo "====================================="
    echo

    check_environment

    local total_issues=0

    # Run all security scans
    run_detect_secrets || ((total_issues++))
    echo

    run_gitleaks || ((total_issues++))
    echo

    run_bandit || ((total_issues++))
    echo

    run_safety || ((total_issues++))
    echo

    scan_env_files || ((total_issues++))
    echo

    quick_pattern_scan || ((total_issues++))
    echo

    # Generate report
    generate_report "$total_issues"

    # Final summary
    echo "🏁 Security Scan Complete"
    echo "========================="

    if [ "$total_issues" -eq 0 ]; then
        log_success "🎉 All security scans passed! No issues detected."
        echo
        log_info "Your aclue codebase appears secure. Continue following best practices!"
    else
        log_error "🚨 $total_issues security issue(s) detected!"
        echo
        log_info "Please review the detailed results above and the generated report."
        log_info "Take appropriate action to resolve security issues before deployment."
    fi

    echo
    log_info "📋 Full report available in: security_scan_report.txt"

    # Cleanup
    cleanup

    # Exit with appropriate code
    exit "$total_issues"
}

# Handle script interruption
trap cleanup EXIT

# Run main function
main "$@"
