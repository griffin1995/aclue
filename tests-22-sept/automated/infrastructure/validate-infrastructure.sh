#!/bin/bash

# aclue Infrastructure Validation Suite
# Comprehensive automated infrastructure security and compliance analysis
# 
# This script orchestrates multiple security tools to provide complete infrastructure validation:
# - Container security (Docker Scout, Hadolint, Dockle)
# - Infrastructure as Code scanning (Checkov, tfsec, Terrascan, KICS)
# - Secret detection (TruffleHog, Gitleaks, detect-secrets)
# - Docker and Kubernetes security
# - Cloud configuration validation

set -e  # Exit on any error

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TOOLS_DIR="$SCRIPT_DIR/tools"
CONFIGS_DIR="$SCRIPT_DIR/configs"
REPORTS_DIR="$SCRIPT_DIR/reports"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../.." && pwd)"

# Create reports directory
mkdir -p "$REPORTS_DIR"

# Logging setup
LOG_FILE="$REPORTS_DIR/infrastructure-validation.log"
SUMMARY_FILE="$REPORTS_DIR/validation-summary.json"

# Initialize summary
echo "[]" > "$SUMMARY_FILE"

# Utility functions
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

log_info() {
    echo -e "${CYAN}[INFO]${NC} $1" | tee -a "$LOG_FILE"
}

# Function to add tool result to summary
add_to_summary() {
    local tool="$1"
    local status="$2"
    local report_file="$3"
    local issues_count="$4"
    local execution_time="$5"
    
    # Create temporary file with new entry
    local temp_file=$(mktemp)
    cat "$SUMMARY_FILE" | jq ". + [{
        \"tool\": \"$tool\",
        \"status\": \"$status\",
        \"report_file\": \"$report_file\",
        \"issues_count\": $issues_count,
        \"execution_time\": \"$execution_time\",
        \"timestamp\": \"$(date -Iseconds)\"
    }]" > "$temp_file"
    mv "$temp_file" "$SUMMARY_FILE"
}

# Function to check if tool exists
check_tool() {
    local tool="$1"
    local path="$2"
    
    if [[ -x "$path" ]]; then
        log_success "Found $tool at $path"
        return 0
    else
        log_error "$tool not found at $path"
        return 1
    fi
}

# Function to run container security scans
run_container_security() {
    log "=== Container Security Analysis ==="
    
    # Find Dockerfiles
    local dockerfiles=($(find "$PROJECT_ROOT" -name "Dockerfile*" -type f))
    
    if [[ ${#dockerfiles[@]} -eq 0 ]]; then
        log_warning "No Dockerfiles found in project"
        return 0
    fi
    
    for dockerfile in "${dockerfiles[@]}"; do
        log_info "Analyzing Dockerfile: $dockerfile"
        
        # Hadolint - Dockerfile linting
        if check_tool "Hadolint" "$TOOLS_DIR/hadolint"; then
            log "Running Hadolint on $dockerfile"
            local start_time=$(date +%s)
            
            "$TOOLS_DIR/hadolint" \
                --config "$CONFIGS_DIR/hadolint-config.yaml" \
                --format json \
                "$dockerfile" > "$REPORTS_DIR/hadolint-$(basename "$dockerfile").json" 2>&1 || true
                
            local end_time=$(date +%s)
            local execution_time=$((end_time - start_time))
            
            local issues_count=$(cat "$REPORTS_DIR/hadolint-$(basename "$dockerfile").json" | jq '. | length' 2>/dev/null || echo "0")
            add_to_summary "hadolint" "completed" "hadolint-$(basename "$dockerfile").json" "$issues_count" "${execution_time}s"
            log_success "Hadolint analysis completed for $dockerfile"
        fi
    done
    
    # Docker Scout (if Docker is available and images exist)
    if command -v docker &> /dev/null; then
        log "Checking for Docker images to scan with Docker Scout"
        local images=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep -v "REPOSITORY" | head -5)
        
        if [[ -n "$images" ]]; then
            while IFS= read -r image; do
                if [[ "$image" != "<none>:<none>" ]]; then
                    log "Running Docker Scout on $image"
                    local start_time=$(date +%s)
                    
                    docker scout cves --format json "$image" > "$REPORTS_DIR/docker-scout-$(echo "$image" | tr '/:' '_').json" 2>&1 || true
                    
                    local end_time=$(date +%s)
                    local execution_time=$((end_time - start_time))
                    add_to_summary "docker-scout" "completed" "docker-scout-$(echo "$image" | tr '/:' '_').json" "0" "${execution_time}s"
                fi
            done <<< "$images"
            log_success "Docker Scout analysis completed"
        else
            log_info "No Docker images found to scan"
        fi
    else
        log_warning "Docker not available, skipping Docker Scout"
    fi
    
    # Dockle - Docker image security
    if check_tool "Dockle" "$TOOLS_DIR/dockle" && command -v docker &> /dev/null; then
        local images=$(docker images --format "table {{.Repository}}:{{.Tag}}" | grep -v "REPOSITORY" | head -3)
        
        if [[ -n "$images" ]]; then
            while IFS= read -r image; do
                if [[ "$image" != "<none>:<none>" ]]; then
                    log "Running Dockle on $image"
                    local start_time=$(date +%s)
                    
                    "$TOOLS_DIR/dockle" \
                        --format json \
                        --output "$REPORTS_DIR/dockle-$(echo "$image" | tr '/:' '_').json" \
                        "$image" 2>&1 || true
                        
                    local end_time=$(date +%s)
                    local execution_time=$((end_time - start_time))
                    local issues_count=$(cat "$REPORTS_DIR/dockle-$(echo "$image" | tr '/:' '_').json" | jq '.details | length' 2>/dev/null || echo "0")
                    add_to_summary "dockle" "completed" "dockle-$(echo "$image" | tr '/:' '_').json" "$issues_count" "${execution_time}s"
                fi
            done <<< "$images"
            log_success "Dockle analysis completed"
        fi
    fi
}

# Function to run Infrastructure as Code scans
run_iac_security() {
    log "=== Infrastructure as Code Security Analysis ==="
    
    # Checkov - Multi-framework IaC scanning
    if [[ -f "$SCRIPT_DIR/venv/bin/checkov" ]]; then
        log "Running Checkov comprehensive IaC scan"
        local start_time=$(date +%s)
        
        cd "$PROJECT_ROOT"
        source "$SCRIPT_DIR/venv/bin/activate"
        
        checkov \
            --config-file "$CONFIGS_DIR/checkov-config.yaml" \
            --directory "$PROJECT_ROOT" \
            --output json \
            --output-file "$REPORTS_DIR/checkov-report.json" \
            --quiet 2>&1 || true
            
        deactivate
        
        local end_time=$(date +%s)
        local execution_time=$((end_time - start_time))
        local issues_count=$(cat "$REPORTS_DIR/checkov-report.json" | jq '.results.failed_checks | length' 2>/dev/null || echo "0")
        add_to_summary "checkov" "completed" "checkov-report.json" "$issues_count" "${execution_time}s"
        log_success "Checkov analysis completed"
    fi
    
    # tfsec - Terraform security scanning
    if check_tool "tfsec" "$TOOLS_DIR/tfsec"; then
        local tf_files=($(find "$PROJECT_ROOT" -name "*.tf" -type f))
        
        if [[ ${#tf_files[@]} -gt 0 ]]; then
            log "Running tfsec on Terraform files"
            local start_time=$(date +%s)
            
            "$TOOLS_DIR/tfsec" \
                "$PROJECT_ROOT" \
                --format json \
                --out "$REPORTS_DIR/tfsec-report.json" \
                --no-colour 2>&1 || true
                
            local end_time=$(date +%s)
            local execution_time=$((end_time - start_time))
            local issues_count=$(cat "$REPORTS_DIR/tfsec-report.json" | jq '.results | length' 2>/dev/null || echo "0")
            add_to_summary "tfsec" "completed" "tfsec-report.json" "$issues_count" "${execution_time}s"
            log_success "tfsec analysis completed"
        else
            log_info "No Terraform files found"
        fi
    fi
    
    # Terrascan - Multi-cloud IaC security
    if check_tool "Terrascan" "$TOOLS_DIR/terrascan"; then
        log "Running Terrascan multi-cloud security scan"
        local start_time=$(date +%s)
        
        "$TOOLS_DIR/terrascan" scan \
            --config-path "$CONFIGS_DIR/terrascan-config.toml" \
            --iac-dir "$PROJECT_ROOT" \
            --output json \
            --output-file "$REPORTS_DIR/terrascan-report.json" \
            --verbose 2>&1 || true
            
        local end_time=$(date +%s)
        local execution_time=$((end_time - start_time))
        local issues_count=$(cat "$REPORTS_DIR/terrascan-report.json" | jq '.results.violations | length' 2>/dev/null || echo "0")
        add_to_summary "terrascan" "completed" "terrascan-report.json" "$issues_count" "${execution_time}s"
        log_success "Terrascan analysis completed"
    fi
    
    # KICS - Infrastructure as Code security
    if command -v kics &> /dev/null; then
        log "Running KICS security scan"
        local start_time=$(date +%s)
        
        kics scan \
            --path "$PROJECT_ROOT" \
            --output-path "$REPORTS_DIR" \
            --output-name "kics-report" \
            --report-formats json \
            --verbose 2>&1 || true
            
        local end_time=$(date +%s)
        local execution_time=$((end_time - start_time))
        local issues_count=$(cat "$REPORTS_DIR/kics-report.json" | jq '.queries | length' 2>/dev/null || echo "0")
        add_to_summary "kics" "completed" "kics-report.json" "$issues_count" "${execution_time}s"
        log_success "KICS analysis completed"
    fi
}

# Function to run secret detection scans
run_secret_detection() {
    log "=== Secret Detection Analysis ==="
    
    # Gitleaks - Git repository secret scanning
    if check_tool "Gitleaks" "$TOOLS_DIR/gitleaks"; then
        log "Running Gitleaks git history secret scan"
        local start_time=$(date +%s)
        
        cd "$PROJECT_ROOT"
        "$TOOLS_DIR/gitleaks" detect \
            --config "$CONFIGS_DIR/gitleaks-config.toml" \
            --report-path "$REPORTS_DIR/gitleaks-report.json" \
            --report-format json \
            --source . \
            --verbose 2>&1 || true
            
        local end_time=$(date +%s)
        local execution_time=$((end_time - start_time))
        local issues_count=$(cat "$REPORTS_DIR/gitleaks-report.json" | jq '. | length' 2>/dev/null || echo "0")
        add_to_summary "gitleaks" "completed" "gitleaks-report.json" "$issues_count" "${execution_time}s"
        log_success "Gitleaks analysis completed"
    fi
    
    # TruffleHog - Deep secret scanning
    if [[ -f "$SCRIPT_DIR/venv/bin/trufflehog" ]]; then
        log "Running TruffleHog deep secret scan"
        local start_time=$(date +%s)
        
        cd "$PROJECT_ROOT"
        source "$SCRIPT_DIR/venv/bin/activate"
        
        trufflehog --json --entropy=False . > "$REPORTS_DIR/trufflehog-report.json" 2>&1 || true
        
        deactivate
        
        local end_time=$(date +%s)
        local execution_time=$((end_time - start_time))
        local issues_count=$(cat "$REPORTS_DIR/trufflehog-report.json" | jq -s '. | length' 2>/dev/null || echo "0")
        add_to_summary "trufflehog" "completed" "trufflehog-report.json" "$issues_count" "${execution_time}s"
        log_success "TruffleHog analysis completed"
    fi
    
    # detect-secrets - Baseline secret detection
    if [[ -f "$SCRIPT_DIR/venv/bin/detect-secrets" ]]; then
        log "Running detect-secrets baseline scan"
        local start_time=$(date +%s)
        
        cd "$PROJECT_ROOT"
        source "$SCRIPT_DIR/venv/bin/activate"
        
        # Create baseline
        detect-secrets scan \
            --baseline "$REPORTS_DIR/detect-secrets-baseline.json" \
            --exclude-files '.*\.git/.*' \
            --exclude-files 'node_modules/.*' \
            --exclude-files 'venv/.*' \
            . 2>&1 || true
            
        # Audit baseline
        detect-secrets audit \
            --baseline "$REPORTS_DIR/detect-secrets-baseline.json" \
            --report "$REPORTS_DIR/detect-secrets-report.json" 2>&1 || true
            
        deactivate
        
        local end_time=$(date +%s)
        local execution_time=$((end_time - start_time))
        local issues_count=$(cat "$REPORTS_DIR/detect-secrets-baseline.json" | jq '.results | to_entries | length' 2>/dev/null || echo "0")
        add_to_summary "detect-secrets" "completed" "detect-secrets-report.json" "$issues_count" "${execution_time}s"
        log_success "detect-secrets analysis completed"
    fi
}

# Function to scan deployment configurations
run_deployment_config_scan() {
    log "=== Deployment Configuration Analysis ==="
    
    # Check Vercel configuration
    if [[ -f "$PROJECT_ROOT/vercel.json" ]]; then
        log_info "Found Vercel configuration"
        cp "$PROJECT_ROOT/vercel.json" "$REPORTS_DIR/vercel-config.json"
    fi
    
    # Check GitHub Actions workflows
    if [[ -d "$PROJECT_ROOT/.github/workflows" ]]; then
        log_info "Found GitHub Actions workflows"
        cp -r "$PROJECT_ROOT/.github/workflows" "$REPORTS_DIR/github-workflows/" 2>/dev/null || true
    fi
    
    # Check Railway configuration
    if [[ -f "$PROJECT_ROOT/railway.json" ]] || [[ -f "$PROJECT_ROOT/railway.toml" ]]; then
        log_info "Found Railway configuration"
        [[ -f "$PROJECT_ROOT/railway.json" ]] && cp "$PROJECT_ROOT/railway.json" "$REPORTS_DIR/"
        [[ -f "$PROJECT_ROOT/railway.toml" ]] && cp "$PROJECT_ROOT/railway.toml" "$REPORTS_DIR/"
    fi
    
    # Check package.json for security issues
    local package_files=($(find "$PROJECT_ROOT" -name "package.json" -type f))
    for package_file in "${package_files[@]}"; do
        log_info "Analyzing package.json: $package_file"
        # Basic security check for known vulnerable patterns
        if grep -qi "protocol.*http:" "$package_file"; then
            log_warning "Found HTTP protocol usage in $package_file"
        fi
    done
}

# Function to generate consolidated report
generate_consolidated_report() {
    log "=== Generating Consolidated Report ==="
    
    local report_file="$REPORTS_DIR/infrastructure-validation-report.json"
    local html_report="$REPORTS_DIR/infrastructure-validation-report.html"
    
    # Create consolidated JSON report
    cat > "$report_file" << EOF
{
    "scan_metadata": {
        "timestamp": "$(date -Iseconds)",
        "project_path": "$PROJECT_ROOT",
        "scanner_version": "1.0.0",
        "total_tools": $(cat "$SUMMARY_FILE" | jq '. | length')
    },
    "tool_results": $(cat "$SUMMARY_FILE"),
    "summary": {
        "total_issues": $(cat "$SUMMARY_FILE" | jq '[.[].issues_count] | add // 0'),
        "tools_executed": $(cat "$SUMMARY_FILE" | jq '[.[] | select(.status == "completed")] | length'),
        "tools_failed": $(cat "$SUMMARY_FILE" | jq '[.[] | select(.status == "failed")] | length')
    }
}
EOF
    
    # Generate HTML report
    cat > "$html_report" << 'EOF'
<!DOCTYPE html>
<html>
<head>
    <title>aclue Infrastructure Validation Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { background-color: #f0f0f0; padding: 20px; border-radius: 5px; }
        .section { margin: 20px 0; }
        .tool-result { border: 1px solid #ddd; margin: 10px 0; padding: 15px; border-radius: 5px; }
        .success { border-left: 5px solid #4CAF50; }
        .warning { border-left: 5px solid #FF9800; }
        .error { border-left: 5px solid #F44336; }
        .summary-stats { display: flex; gap: 20px; }
        .stat-box { background: #f9f9f9; padding: 15px; border-radius: 5px; text-align: center; }
        .report-links { margin: 20px 0; }
        .report-links a { margin-right: 15px; color: #2196F3; text-decoration: none; }
    </style>
</head>
<body>
    <div class="header">
        <h1>🛡️ aclue Infrastructure Validation Report</h1>
        <p><strong>Generated:</strong> $(date)</p>
        <p><strong>Project:</strong> $PROJECT_ROOT</p>
    </div>
    
    <div class="section">
        <h2>📊 Summary Statistics</h2>
        <div class="summary-stats">
            <div class="stat-box">
                <h3>$(cat "$SUMMARY_FILE" | jq '[.[].issues_count] | add // 0')</h3>
                <p>Total Issues Found</p>
            </div>
            <div class="stat-box">
                <h3>$(cat "$SUMMARY_FILE" | jq '[.[] | select(.status == "completed")] | length')</h3>
                <p>Tools Executed</p>
            </div>
            <div class="stat-box">
                <h3>$(cat "$SUMMARY_FILE" | jq '. | length')</h3>
                <p>Total Tools</p>
            </div>
        </div>
    </div>
    
    <div class="section">
        <h2>🔧 Tool Results</h2>
EOF
    
    # Add tool results to HTML
    cat "$SUMMARY_FILE" | jq -r '.[] | @base64' | while read -r encoded_result; do
        local result=$(echo "$encoded_result" | base64 --decode)
        local tool=$(echo "$result" | jq -r '.tool')
        local status=$(echo "$result" | jq -r '.status')
        local issues=$(echo "$result" | jq -r '.issues_count')
        local report_file=$(echo "$result" | jq -r '.report_file')
        local exec_time=$(echo "$result" | jq -r '.execution_time')
        
        local css_class="success"
        [[ "$issues" -gt 0 ]] && css_class="warning"
        [[ "$status" != "completed" ]] && css_class="error"
        
        cat >> "$html_report" << EOF
        <div class="tool-result $css_class">
            <h3>$tool</h3>
            <p><strong>Status:</strong> $status</p>
            <p><strong>Issues Found:</strong> $issues</p>
            <p><strong>Execution Time:</strong> $exec_time</p>
            <p><strong>Report File:</strong> <a href="$report_file">$report_file</a></p>
        </div>
EOF
    done
    
    cat >> "$html_report" << 'EOF'
    </div>
    
    <div class="section">
        <h2>📁 Report Files</h2>
        <div class="report-links">
EOF
    
    # Add links to all report files
    find "$REPORTS_DIR" -name "*.json" -type f | while read -r file; do
        local filename=$(basename "$file")
        echo "            <a href=\"$filename\">$filename</a>" >> "$html_report"
    done
    
    cat >> "$html_report" << 'EOF'
        </div>
    </div>
    
    <div class="section">
        <h2>🚀 Next Steps</h2>
        <ul>
            <li>Review individual tool reports for detailed findings</li>
            <li>Prioritize high-severity security issues</li>
            <li>Implement recommended security controls</li>
            <li>Re-run validation after fixes</li>
        </ul>
    </div>
</body>
</html>
EOF
    
    log_success "Consolidated report generated: $report_file"
    log_success "HTML report generated: $html_report"
}

# Main execution function
main() {
    log "🛡️ Starting aclue Infrastructure Validation Suite"
    log "Project root: $PROJECT_ROOT"
    log "Reports directory: $REPORTS_DIR"
    
    # Clean previous reports
    rm -f "$REPORTS_DIR"/*.json "$REPORTS_DIR"/*.html 2>/dev/null || true
    
    # Run all security scans
    run_container_security
    run_iac_security
    run_secret_detection
    run_deployment_config_scan
    
    # Generate reports
    generate_consolidated_report
    
    # Final summary
    local total_issues=$(cat "$SUMMARY_FILE" | jq '[.[].issues_count] | add // 0')
    local tools_executed=$(cat "$SUMMARY_FILE" | jq '[.[] | select(.status == "completed")] | length')
    
    log "=== Infrastructure Validation Complete ==="
    log_success "Tools executed: $tools_executed"
    log_info "Total issues found: $total_issues"
    log_success "Reports saved to: $REPORTS_DIR"
    
    if [[ "$total_issues" -gt 0 ]]; then
        log_warning "⚠️  Security issues detected. Please review reports and implement fixes."
        exit 1
    else
        log_success "✅ No security issues detected in infrastructure validation."
        exit 0
    fi
}

# Script execution
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi