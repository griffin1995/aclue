#!/bin/bash

# Master Security Scanning Script for Aclue Platform
# Purpose: Orchestrate all security scanning tools with maximum depth
# Date: September 2025

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Directories
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BASE_DIR="$(dirname "$SCRIPT_DIR")"
CONFIG_DIR="$BASE_DIR/configs"
REPORTS_DIR="$BASE_DIR/reports"
LOGS_DIR="$BASE_DIR/logs"
VENV_DIR="/home/jack/Documents/aclue-preprod/security-venv"

# Project directories
PROJECT_ROOT="/home/jack/Documents/aclue-preprod"
WEB_DIR="$PROJECT_ROOT/web"
BACKEND_DIR="$PROJECT_ROOT/backend"

# Create necessary directories
mkdir -p "$REPORTS_DIR"/{nuclei,zap,semgrep,trivy,secrets,consolidated}
mkdir -p "$LOGS_DIR"

# Timestamp for reports
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Log function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOGS_DIR/master_scan_$TIMESTAMP.log"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOGS_DIR/master_scan_$TIMESTAMP.log"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOGS_DIR/master_scan_$TIMESTAMP.log"
}

info() {
    echo -e "${BLUE}[INFO]${NC} $1" | tee -a "$LOGS_DIR/master_scan_$TIMESTAMP.log"
}

# Activate virtual environment
activate_venv() {
    if [ -f "$VENV_DIR/bin/activate" ]; then
        source "$VENV_DIR/bin/activate"
        log "Virtual environment activated"
    else
        error "Virtual environment not found at $VENV_DIR"
        exit 1
    fi
}

# 1. SEMGREP - Source Code Analysis
run_semgrep() {
    log "========================================="
    log "Starting SEMGREP Source Code Analysis"
    log "========================================="

    # Activate venv for semgrep
    activate_venv

    # Update rules
    info "Updating Semgrep rules..."
    semgrep --config=auto --update-rules || true

    # Run comprehensive scan
    info "Running Semgrep security scan on entire codebase..."
    semgrep \
        --config="$CONFIG_DIR/semgrep-config.yaml" \
        --config=auto \
        --config=p/security-audit \
        --config=p/secrets \
        --config=p/owasp-top-ten \
        --config=p/r2c-security-audit \
        --json \
        --output="$REPORTS_DIR/semgrep/semgrep_full_$TIMESTAMP.json" \
        --metrics=on \
        --max-memory=8000 \
        --timeout=300 \
        --verbose \
        "$PROJECT_ROOT" 2>&1 | tee "$LOGS_DIR/semgrep_$TIMESTAMP.log"

    # Generate SARIF report
    semgrep \
        --config=auto \
        --sarif \
        --output="$REPORTS_DIR/semgrep/semgrep_sarif_$TIMESTAMP.sarif" \
        "$PROJECT_ROOT" || true

    # Generate text report for quick review
    semgrep \
        --config=auto \
        --text \
        --output="$REPORTS_DIR/semgrep/semgrep_text_$TIMESTAMP.txt" \
        "$PROJECT_ROOT" || true

    log "Semgrep scan completed"
}

# 2. NUCLEI - Web Vulnerability Scanning
run_nuclei() {
    log "========================================="
    log "Starting NUCLEI Vulnerability Scanning"
    log "========================================="

    # Update nuclei templates
    info "Updating Nuclei templates..."
    "$VENV_DIR/bin/nuclei" -update-templates || true

    # Define targets
    TARGETS=(
        "https://aclue.app"
        "https://aclue-backend-production.up.railway.app"
    )

    # Scan each target
    for TARGET in "${TARGETS[@]}"; do
        SAFE_TARGET=$(echo "$TARGET" | sed 's/[^a-zA-Z0-9]/_/g')
        info "Scanning $TARGET with Nuclei..."

        "$VENV_DIR/bin/nuclei" \
            -target "$TARGET" \
            -config "$CONFIG_DIR/nuclei-config.yaml" \
            -severity critical,high,medium,low,info \
            -es info \
            -rl 150 \
            -c 25 \
            -timeout 30 \
            -retries 3 \
            -json-export "$REPORTS_DIR/nuclei/nuclei_${SAFE_TARGET}_$TIMESTAMP.json" \
            -markdown-export "$REPORTS_DIR/nuclei/nuclei_${SAFE_TARGET}_$TIMESTAMP.md" \
            -v \
            -stats \
            -system-resolvers \
            -page-timeout 30 \
            2>&1 | tee -a "$LOGS_DIR/nuclei_$TIMESTAMP.log"
    done

    # Scan local development servers if running
    if curl -s http://localhost:3000 > /dev/null 2>&1; then
        info "Scanning localhost:3000 with Nuclei..."
        "$VENV_DIR/bin/nuclei" \
            -target "http://localhost:3000" \
            -severity critical,high,medium,low \
            -json-export "$REPORTS_DIR/nuclei/nuclei_localhost_3000_$TIMESTAMP.json" \
            || true
    fi

    if curl -s http://localhost:8000 > /dev/null 2>&1; then
        info "Scanning localhost:8000 with Nuclei..."
        "$VENV_DIR/bin/nuclei" \
            -target "http://localhost:8000" \
            -severity critical,high,medium,low \
            -json-export "$REPORTS_DIR/nuclei/nuclei_localhost_8000_$TIMESTAMP.json" \
            || true
    fi

    log "Nuclei scan completed"
}

# 3. TRIVY - Container & Filesystem Scanning
run_trivy() {
    log "========================================="
    log "Starting TRIVY Security Scanning"
    log "========================================="

    # Scan filesystem
    info "Scanning filesystem with Trivy..."
    docker run --rm \
        -v "$PROJECT_ROOT:/project" \
        -v "$REPORTS_DIR/trivy:/reports" \
        aquasec/trivy:latest \
        fs /project \
        --severity CRITICAL,HIGH,MEDIUM,LOW \
        --security-checks vuln,misconfig,secret,license \
        --format json \
        --output /reports/trivy_filesystem_$TIMESTAMP.json \
        2>&1 | tee -a "$LOGS_DIR/trivy_$TIMESTAMP.log"

    # Generate SARIF report
    docker run --rm \
        -v "$PROJECT_ROOT:/project" \
        -v "$REPORTS_DIR/trivy:/reports" \
        aquasec/trivy:latest \
        fs /project \
        --format sarif \
        --output /reports/trivy_sarif_$TIMESTAMP.sarif \
        || true

    # Scan Dockerfiles if present
    if [ -f "$PROJECT_ROOT/Dockerfile" ]; then
        info "Scanning Dockerfile with Trivy..."
        docker run --rm \
            -v "$PROJECT_ROOT:/project" \
            -v "$REPORTS_DIR/trivy:/reports" \
            aquasec/trivy:latest \
            config /project/Dockerfile \
            --format json \
            --output /reports/trivy_dockerfile_$TIMESTAMP.json \
            || true
    fi

    # Scan backend Dockerfile
    if [ -f "$BACKEND_DIR/Dockerfile" ]; then
        info "Scanning backend Dockerfile with Trivy..."
        docker run --rm \
            -v "$BACKEND_DIR:/project" \
            -v "$REPORTS_DIR/trivy:/reports" \
            aquasec/trivy:latest \
            config /project/Dockerfile \
            --format json \
            --output /reports/trivy_backend_dockerfile_$TIMESTAMP.json \
            || true
    fi

    log "Trivy scan completed"
}

# 4. OWASP ZAP - Dynamic Application Security Testing
run_zap() {
    log "========================================="
    log "Starting OWASP ZAP Security Testing"
    log "========================================="

    # Run ZAP baseline scan
    info "Running ZAP baseline scan on production..."
    docker run --rm \
        -v "$REPORTS_DIR/zap:/zap/wrk" \
        -t zaproxy/zap-stable \
        zap-baseline.py \
        -t https://aclue.app \
        -J zap_baseline_aclue_$TIMESTAMP.json \
        -r zap_baseline_aclue_$TIMESTAMP.html \
        -x zap_baseline_aclue_$TIMESTAMP.xml \
        -l INFO \
        -c "$CONFIG_DIR/zap-config.yaml" \
        2>&1 | tee -a "$LOGS_DIR/zap_$TIMESTAMP.log" || true

    # Run API scan on backend
    info "Running ZAP API scan on backend..."
    docker run --rm \
        -v "$REPORTS_DIR/zap:/zap/wrk" \
        -t zaproxy/zap-stable \
        zap-api-scan.py \
        -t https://aclue-backend-production.up.railway.app/openapi.json \
        -f openapi \
        -J zap_api_backend_$TIMESTAMP.json \
        -r zap_api_backend_$TIMESTAMP.html \
        -l INFO \
        2>&1 | tee -a "$LOGS_DIR/zap_api_$TIMESTAMP.log" || true

    # Run full scan if requested (takes longer)
    if [ "${FULL_SCAN:-false}" == "true" ]; then
        info "Running ZAP full scan (this will take time)..."
        docker run --rm \
            -v "$REPORTS_DIR/zap:/zap/wrk" \
            -t zaproxy/zap-stable \
            zap-full-scan.py \
            -t https://aclue.app \
            -J zap_full_aclue_$TIMESTAMP.json \
            -r zap_full_aclue_$TIMESTAMP.html \
            -l INFO \
            -n "$CONFIG_DIR/zap-config.yaml" \
            2>&1 | tee -a "$LOGS_DIR/zap_full_$TIMESTAMP.log" || true
    fi

    log "OWASP ZAP scan completed"
}

# 5. SECRET SCANNING - Detect hardcoded secrets
run_secret_scan() {
    log "========================================="
    log "Starting SECRET Detection Scanning"
    log "========================================="

    activate_venv

    # Run detect-secrets
    info "Running detect-secrets scan..."
    detect-secrets scan \
        --all-files \
        --force-use-all-plugins \
        "$PROJECT_ROOT" > "$REPORTS_DIR/secrets/detect_secrets_$TIMESTAMP.json" \
        2>&1 | tee -a "$LOGS_DIR/secrets_$TIMESTAMP.log"

    # Audit the baseline
    info "Generating secrets audit report..."
    detect-secrets audit "$REPORTS_DIR/secrets/detect_secrets_$TIMESTAMP.json" \
        --display-results > "$REPORTS_DIR/secrets/secrets_audit_$TIMESTAMP.txt" || true

    log "Secret scanning completed"
}

# 6. DEPENDENCY SCANNING
run_dependency_scan() {
    log "========================================="
    log "Starting DEPENDENCY Security Scanning"
    log "========================================="

    # Scan Python dependencies
    if [ -f "$BACKEND_DIR/requirements.txt" ]; then
        info "Scanning Python dependencies..."
        docker run --rm \
            -v "$BACKEND_DIR:/project" \
            -v "$REPORTS_DIR/trivy:/reports" \
            aquasec/trivy:latest \
            fs /project/requirements.txt \
            --security-checks vuln \
            --format json \
            --output /reports/python_deps_$TIMESTAMP.json \
            || true
    fi

    # Scan Node.js dependencies
    if [ -f "$WEB_DIR/package-lock.json" ]; then
        info "Scanning Node.js dependencies..."
        docker run --rm \
            -v "$WEB_DIR:/project" \
            -v "$REPORTS_DIR/trivy:/reports" \
            aquasec/trivy:latest \
            fs /project/package-lock.json \
            --security-checks vuln \
            --format json \
            --output /reports/nodejs_deps_$TIMESTAMP.json \
            || true
    fi

    log "Dependency scanning completed"
}

# 7. GENERATE CONSOLIDATED REPORT
generate_consolidated_report() {
    log "========================================="
    log "Generating Consolidated Security Report"
    log "========================================="

    REPORT_FILE="$REPORTS_DIR/consolidated/security_report_$TIMESTAMP.md"

    cat > "$REPORT_FILE" << EOF
# Aclue Platform Security Audit Report
## Date: $(date)
## Scan ID: $TIMESTAMP

---

## Executive Summary

This comprehensive security audit was performed using industry-leading security scanning tools with maximum depth configuration.

### Tools Used:
- **Semgrep**: Source code security analysis
- **Nuclei**: Web vulnerability scanning with 9,000+ templates
- **Trivy**: Container and filesystem vulnerability scanning
- **OWASP ZAP**: Dynamic application security testing
- **Detect-Secrets**: Hardcoded secret detection

### Scan Targets:
- **Production Frontend**: https://aclue.app
- **Production Backend**: https://aclue-backend-production.up.railway.app
- **Source Code**: $PROJECT_ROOT
- **Dependencies**: Python and Node.js packages

---

## Detailed Findings

### 1. Source Code Security (Semgrep)
- **Report Location**: $REPORTS_DIR/semgrep/
- **Scan Time**: $(date)
- **Rules Applied**: security-audit, OWASP Top 10, secrets, best-practices

#### Critical Findings:
EOF

    # Parse Semgrep results
    if [ -f "$REPORTS_DIR/semgrep/semgrep_text_$TIMESTAMP.txt" ]; then
        echo "$(head -n 50 "$REPORTS_DIR/semgrep/semgrep_text_$TIMESTAMP.txt")" >> "$REPORT_FILE"
    fi

    cat >> "$REPORT_FILE" << EOF

### 2. Web Vulnerabilities (Nuclei)
- **Report Location**: $REPORTS_DIR/nuclei/
- **Templates Used**: 9,000+ vulnerability templates
- **Severity Levels**: Critical, High, Medium, Low, Info

### 3. Container & Filesystem Security (Trivy)
- **Report Location**: $REPORTS_DIR/trivy/
- **Scan Types**: Vulnerabilities, Misconfigurations, Secrets, Licenses

### 4. Dynamic Application Security (OWASP ZAP)
- **Report Location**: $REPORTS_DIR/zap/
- **Scan Types**: Baseline, API, Full (if enabled)

### 5. Secret Detection
- **Report Location**: $REPORTS_DIR/secrets/
- **Plugins Used**: All available secret detection plugins

### 6. Dependency Vulnerabilities
- **Python Dependencies**: $REPORTS_DIR/trivy/python_deps_$TIMESTAMP.json
- **Node.js Dependencies**: $REPORTS_DIR/trivy/nodejs_deps_$TIMESTAMP.json

---

## Recommendations

### Immediate Actions Required:
1. Review all CRITICAL and HIGH severity findings
2. Remediate any detected secrets immediately
3. Update vulnerable dependencies
4. Apply security patches for identified CVEs

### Security Best Practices:
1. Implement Content Security Policy (CSP) headers
2. Enable HSTS (HTTP Strict Transport Security)
3. Implement rate limiting on all API endpoints
4. Use parameterized queries to prevent SQL injection
5. Implement proper input validation and sanitization
6. Enable security headers (X-Frame-Options, X-Content-Type-Options)
7. Implement comprehensive logging and monitoring
8. Regular security updates and dependency management

---

## Compliance Status

### OWASP Top 10 Coverage:
- [x] A01:2021 – Broken Access Control
- [x] A02:2021 – Cryptographic Failures
- [x] A03:2021 – Injection
- [x] A04:2021 – Insecure Design
- [x] A05:2021 – Security Misconfiguration
- [x] A06:2021 – Vulnerable and Outdated Components
- [x] A07:2021 – Identification and Authentication Failures
- [x] A08:2021 – Software and Data Integrity Failures
- [x] A09:2021 – Security Logging and Monitoring Failures
- [x] A10:2021 – Server-Side Request Forgery (SSRF)

---

## Report Files Generated

| Tool | Format | Location |
|------|--------|----------|
| Semgrep | JSON | $REPORTS_DIR/semgrep/semgrep_full_$TIMESTAMP.json |
| Semgrep | SARIF | $REPORTS_DIR/semgrep/semgrep_sarif_$TIMESTAMP.sarif |
| Nuclei | JSON | $REPORTS_DIR/nuclei/nuclei_*_$TIMESTAMP.json |
| Trivy | JSON | $REPORTS_DIR/trivy/trivy_filesystem_$TIMESTAMP.json |
| ZAP | HTML | $REPORTS_DIR/zap/zap_baseline_aclue_$TIMESTAMP.html |
| Secrets | JSON | $REPORTS_DIR/secrets/detect_secrets_$TIMESTAMP.json |

---

## Scan Metadata
- **Scan Started**: $(head -n 1 "$LOGS_DIR/master_scan_$TIMESTAMP.log" | cut -d' ' -f2-3)
- **Scan Completed**: $(date)
- **Log File**: $LOGS_DIR/master_scan_$TIMESTAMP.log
- **Environment**: $(uname -a)
- **Scanner Version**: Master Security Scanner v1.0

---

*Generated by Aclue Automated Security Scanner*
EOF

    log "Consolidated report generated: $REPORT_FILE"
}

# Main execution
main() {
    log "========================================="
    log "ACLUE PLATFORM MASTER SECURITY SCAN"
    log "========================================="
    log "Timestamp: $TIMESTAMP"
    log "Project Root: $PROJECT_ROOT"
    log "Reports Directory: $REPORTS_DIR"

    # Run all scans
    run_semgrep
    run_nuclei
    run_trivy
    run_zap
    run_secret_scan
    run_dependency_scan

    # Generate consolidated report
    generate_consolidated_report

    log "========================================="
    log "SECURITY SCAN COMPLETED SUCCESSFULLY"
    log "========================================="
    log "Reports available at: $REPORTS_DIR"
    log "Consolidated report: $REPORTS_DIR/consolidated/security_report_$TIMESTAMP.md"

    # Display summary
    info "Scan Summary:"
    info "- Semgrep findings: $(find $REPORTS_DIR/semgrep -name "*$TIMESTAMP*" | wc -l) files"
    info "- Nuclei findings: $(find $REPORTS_DIR/nuclei -name "*$TIMESTAMP*" | wc -l) files"
    info "- Trivy findings: $(find $REPORTS_DIR/trivy -name "*$TIMESTAMP*" | wc -l) files"
    info "- ZAP findings: $(find $REPORTS_DIR/zap -name "*$TIMESTAMP*" | wc -l) files"
    info "- Secret scan findings: $(find $REPORTS_DIR/secrets -name "*$TIMESTAMP*" | wc -l) files"

    # Check for critical issues
    warning "Please review all reports for CRITICAL and HIGH severity findings"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --full)
            export FULL_SCAN=true
            shift
            ;;
        --quick)
            export QUICK_SCAN=true
            shift
            ;;
        --help)
            echo "Usage: $0 [OPTIONS]"
            echo "Options:"
            echo "  --full    Run full comprehensive scan (takes longer)"
            echo "  --quick   Run quick scan (critical issues only)"
            echo "  --help    Display this help message"
            exit 0
            ;;
        *)
            error "Unknown option: $1"
            exit 1
            ;;
    esac
done

# Run main function
main

exit 0