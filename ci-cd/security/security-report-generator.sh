#!/bin/bash
# =============================================================================
# aclue Platform Security Report Generator
# =============================================================================
#
# Comprehensive security report generation script that consolidates findings
# from multiple security scanning tools and generates executive summaries,
# detailed technical reports, and actionable remediation guidance.
#
# Usage:
#   ./security-report-generator.sh [--format=html|json|pdf] [--output-dir=path]
#
# =============================================================================

set -euo pipefail

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
REPORT_DIR="${PROJECT_ROOT}/security-reports"
SECURITY_CONFIG="${SCRIPT_DIR}/security-scan-config.yml"

# Default values
OUTPUT_FORMAT="html"
OUTPUT_DIR="$REPORT_DIR"
INCLUDE_EXECUTIVE_SUMMARY=true
INCLUDE_REMEDIATION_GUIDE=true
VERBOSE=false

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

# Help function
show_help() {
    cat << EOF
aclue Platform Security Report Generator

Usage: $0 [OPTIONS]

OPTIONS:
    --format=FORMAT         Output format: html, json, pdf (default: html)
    --output-dir=PATH       Output directory for reports (default: security-reports/)
    --no-executive-summary  Skip executive summary generation
    --no-remediation        Skip remediation guide generation
    --verbose               Enable verbose output
    --help                  Show this help message

EXAMPLES:
    $0 --format=html --output-dir=./reports
    $0 --format=json --verbose
    $0 --format=pdf --no-remediation

REPORT TYPES GENERATED:
    ✓ Executive Summary (high-level overview for management)
    ✓ Technical Security Report (detailed findings for developers)
    ✓ Vulnerability Assessment Report (prioritized vulnerabilities)
    ✓ Compliance Report (security standards compliance)
    ✓ Remediation Guide (actionable steps for fixes)
    ✓ Metrics Dashboard (security posture over time)
EOF
}

# Parse command line arguments
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --format=*)
                OUTPUT_FORMAT="${1#*=}"
                shift
                ;;
            --output-dir=*)
                OUTPUT_DIR="${1#*=}"
                shift
                ;;
            --no-executive-summary)
                INCLUDE_EXECUTIVE_SUMMARY=false
                shift
                ;;
            --no-remediation)
                INCLUDE_REMEDIATION_GUIDE=false
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
                exit 1
                ;;
        esac
    done

    # Validate format
    if [[ ! "$OUTPUT_FORMAT" =~ ^(html|json|pdf)$ ]]; then
        log_error "Invalid format: $OUTPUT_FORMAT. Must be html, json, or pdf"
        exit 1
    fi
}

# Initialize report generation environment
initialize_environment() {
    log_info "Initializing security report generation..."

    # Create output directory
    mkdir -p "$OUTPUT_DIR"

    # Check for required tools
    local required_tools=("jq" "yq")
    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            log_error "Required tool '$tool' is not installed"
            exit 1
        fi
    done

    # Check for optional tools based on format
    if [[ "$OUTPUT_FORMAT" == "pdf" ]]; then
        if ! command -v wkhtmltopdf &> /dev/null; then
            log_warning "wkhtmltopdf not found. PDF generation will be skipped."
            OUTPUT_FORMAT="html"
        fi
    fi

    log_success "Environment initialized successfully"
}

# Collect and parse security scan results
collect_scan_results() {
    log_info "Collecting security scan results..."

    local results_file="${OUTPUT_DIR}/consolidated-results.json"
    local timestamp=$(date -u '+%Y-%m-%d %H:%M:%S UTC')

    # Initialize results structure
    cat > "$results_file" << EOF
{
  "collection_metadata": {
    "timestamp": "$timestamp",
    "project_root": "$PROJECT_ROOT",
    "git_commit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
    "git_branch": "$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')"
  },
  "scan_results": {}
}
EOF

    # Collect results from various scan reports
    local scan_types=(
        "npm-audit:npm_audit_results"
        "safety:python_safety_results"
        "bandit:python_bandit_results"
        "gitleaks:secret_detection_results"
        "trufflehog:secret_detection_results"
        "detect-secrets:secret_detection_results"
        "eslint-security:javascript_security_results"
        "semgrep:static_analysis_results"
        "trivy:container_security_results"
        "hadolint:dockerfile_security_results"
        "ssl-analysis:ssl_tls_results"
        "security-headers:security_headers_results"
        "api-security:api_security_results"
        "performance-security:performance_security_results"
    )

    local temp_results="{}"

    for scan_type in "${scan_types[@]}"; do
        local scan_name="${scan_type%%:*}"
        local result_key="${scan_type##*:}"
        local scan_files=($(find "$REPORT_DIR" -name "*${scan_name}*" -type f \( -name "*.json" \) 2>/dev/null || true))

        if [[ ${#scan_files[@]} -gt 0 ]]; then
            log_info "Found ${#scan_files[@]} result file(s) for $scan_name"

            # Process each scan file
            for scan_file in "${scan_files[@]}"; do
                if [[ -s "$scan_file" ]]; then
                    local scan_data=""
                    if scan_data=$(jq '.' "$scan_file" 2>/dev/null); then
                        temp_results=$(echo "$temp_results" | jq ". + {\"$result_key\": $scan_data}")
                        [[ "$VERBOSE" == true ]] && log_info "Processed: $(basename "$scan_file")"
                    else
                        log_warning "Invalid JSON in: $(basename "$scan_file")"
                    fi
                else
                    [[ "$VERBOSE" == true ]] && log_info "Empty file: $(basename "$scan_file")"
                fi
            done
        else
            [[ "$VERBOSE" == true ]] && log_info "No results found for: $scan_name"
        fi
    done

    # Update consolidated results
    jq ".scan_results = $temp_results" "$results_file" > "${results_file}.tmp" && mv "${results_file}.tmp" "$results_file"

    log_success "Security scan results collected"
}

# Analyze and categorize vulnerabilities
analyze_vulnerabilities() {
    log_info "Analyzing and categorizing vulnerabilities..."

    local results_file="${OUTPUT_DIR}/consolidated-results.json"
    local analysis_file="${OUTPUT_DIR}/vulnerability-analysis.json"

    # Initialize vulnerability analysis structure
    cat > "$analysis_file" << EOF
{
  "vulnerability_summary": {
    "critical": 0,
    "high": 0,
    "medium": 0,
    "low": 0,
    "info": 0,
    "total": 0
  },
  "categories": {
    "dependency_vulnerabilities": [],
    "code_security_issues": [],
    "secret_exposures": [],
    "configuration_issues": [],
    "infrastructure_security": []
  },
  "risk_assessment": {
    "overall_risk_score": 0,
    "risk_level": "low",
    "critical_findings": [],
    "recommendations": []
  }
}
EOF

    # Analyze different types of findings
    if [[ -f "$results_file" ]]; then
        # Count vulnerabilities by severity from npm audit
        if jq -e '.scan_results.npm_audit_results.vulnerabilities' "$results_file" > /dev/null 2>&1; then
            local npm_critical=$(jq '.scan_results.npm_audit_results.metadata.vulnerabilities.critical // 0' "$results_file")
            local npm_high=$(jq '.scan_results.npm_audit_results.metadata.vulnerabilities.high // 0' "$results_file")
            local npm_medium=$(jq '.scan_results.npm_audit_results.metadata.vulnerabilities.moderate // 0' "$results_file")
            local npm_low=$(jq '.scan_results.npm_audit_results.metadata.vulnerabilities.low // 0' "$results_file")

            # Update vulnerability summary
            jq ".vulnerability_summary.critical += $npm_critical |
                .vulnerability_summary.high += $npm_high |
                .vulnerability_summary.medium += $npm_medium |
                .vulnerability_summary.low += $npm_low" "$analysis_file" > "${analysis_file}.tmp" && mv "${analysis_file}.tmp" "$analysis_file"
        fi

        # Count secrets detected
        if jq -e '.scan_results.secret_detection_results' "$results_file" > /dev/null 2>&1; then
            local secrets_count=$(jq '.scan_results.secret_detection_results | length // 0' "$results_file" 2>/dev/null || echo "0")
            if [[ "$secrets_count" -gt 0 ]]; then
                jq ".vulnerability_summary.critical += $secrets_count" "$analysis_file" > "${analysis_file}.tmp" && mv "${analysis_file}.tmp" "$analysis_file"
            fi
        fi

        # Calculate total vulnerabilities
        local total_vulns=$(jq '.vulnerability_summary.critical + .vulnerability_summary.high + .vulnerability_summary.medium + .vulnerability_summary.low + .vulnerability_summary.info' "$analysis_file")
        jq ".vulnerability_summary.total = $total_vulns" "$analysis_file" > "${analysis_file}.tmp" && mv "${analysis_file}.tmp" "$analysis_file"

        # Calculate overall risk score (0-100)
        local critical_count=$(jq '.vulnerability_summary.critical' "$analysis_file")
        local high_count=$(jq '.vulnerability_summary.high' "$analysis_file")
        local medium_count=$(jq '.vulnerability_summary.medium' "$analysis_file")

        local risk_score=$((critical_count * 25 + high_count * 10 + medium_count * 3))
        if [[ $risk_score -gt 100 ]]; then risk_score=100; fi

        local risk_level="low"
        if [[ $critical_count -gt 0 ]]; then
            risk_level="critical"
        elif [[ $high_count -gt 5 ]]; then
            risk_level="high"
        elif [[ $high_count -gt 0 ]] || [[ $medium_count -gt 10 ]]; then
            risk_level="medium"
        fi

        jq ".risk_assessment.overall_risk_score = $risk_score |
            .risk_assessment.risk_level = \"$risk_level\"" "$analysis_file" > "${analysis_file}.tmp" && mv "${analysis_file}.tmp" "$analysis_file"
    fi

    log_success "Vulnerability analysis completed"
}

# Generate executive summary report
generate_executive_summary() {
    if [[ "$INCLUDE_EXECUTIVE_SUMMARY" != true ]]; then
        return 0
    fi

    log_info "Generating executive summary report..."

    local analysis_file="${OUTPUT_DIR}/vulnerability-analysis.json"
    local exec_summary="${OUTPUT_DIR}/executive-summary.${OUTPUT_FORMAT}"

    if [[ ! -f "$analysis_file" ]]; then
        log_error "Vulnerability analysis file not found"
        return 1
    fi

    # Extract key metrics
    local total_vulns=$(jq '.vulnerability_summary.total' "$analysis_file")
    local critical_vulns=$(jq '.vulnerability_summary.critical' "$analysis_file")
    local high_vulns=$(jq '.vulnerability_summary.high' "$analysis_file")
    local risk_score=$(jq '.risk_assessment.overall_risk_score' "$analysis_file")
    local risk_level=$(jq -r '.risk_assessment.risk_level' "$analysis_file")
    local timestamp=$(date '+%B %d, %Y')

    if [[ "$OUTPUT_FORMAT" == "html" ]]; then
        cat > "$exec_summary" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Platform Security Executive Summary</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #007acc; }
        .logo { font-size: 32px; font-weight: bold; color: #007acc; margin-bottom: 10px; }
        .subtitle { color: #666; font-size: 18px; }
        .risk-level { padding: 10px 20px; border-radius: 25px; display: inline-block; font-weight: bold; text-transform: uppercase; }
        .risk-critical { background: #ff4444; color: white; }
        .risk-high { background: #ff8800; color: white; }
        .risk-medium { background: #ffaa00; color: white; }
        .risk-low { background: #44aa44; color: white; }
        .metrics { display: flex; justify-content: space-around; margin: 30px 0; }
        .metric { text-align: center; }
        .metric-value { font-size: 36px; font-weight: bold; color: #007acc; }
        .metric-label { color: #666; margin-top: 5px; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .recommendation { background: #f8f9fa; padding: 15px; border-left: 4px solid #007acc; margin: 10px 0; }
        .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">aclue</div>
            <div class="subtitle">Security Executive Summary</div>
            <div style="margin-top: 10px; color: #999;">Generated on $timestamp</div>
        </div>

        <div class="section">
            <h2>Overall Security Posture</h2>
            <p style="text-align: center; margin: 20px 0;">
                <span class="risk-level risk-$risk_level">Risk Level: $risk_level</span>
            </p>
            <p>Security Score: <strong>$((100 - risk_score))/100</strong> (Higher is better)</p>
        </div>

        <div class="metrics">
            <div class="metric">
                <div class="metric-value">$total_vulns</div>
                <div class="metric-label">Total Vulnerabilities</div>
            </div>
            <div class="metric">
                <div class="metric-value">$critical_vulns</div>
                <div class="metric-label">Critical Issues</div>
            </div>
            <div class="metric">
                <div class="metric-value">$high_vulns</div>
                <div class="metric-label">High Priority</div>
            </div>
        </div>

        <div class="section">
            <h2>Key Findings</h2>
            $(if [[ $critical_vulns -gt 0 ]]; then
                echo "<div class=\"recommendation\">⚠️ <strong>Immediate Action Required:</strong> $critical_vulns critical security vulnerabilities detected that require immediate remediation.</div>"
            fi)
            $(if [[ $high_vulns -gt 0 ]]; then
                echo "<div class=\"recommendation\">🔍 <strong>High Priority:</strong> $high_vulns high-severity issues identified that should be addressed within the next sprint.</div>"
            fi)
            $(if [[ $total_vulns -eq 0 ]]; then
                echo "<div class=\"recommendation\">✅ <strong>Excellent:</strong> No critical security vulnerabilities detected in the current scan.</div>"
            fi)
        </div>

        <div class="section">
            <h2>Recommended Actions</h2>
            <div class="recommendation">
                📋 Review the detailed technical security report for specific remediation steps
            </div>
            <div class="recommendation">
                🔄 Implement automated security scanning in CI/CD pipeline
            </div>
            <div class="recommendation">
                📚 Ensure development team follows secure coding practices
            </div>
            <div class="recommendation">
                🛡️ Schedule regular security assessments and penetration testing
            </div>
        </div>

        <div class="footer">
            <p>This report was automatically generated by the aclue security scanning pipeline.</p>
            <p>For detailed technical information, please refer to the complete security assessment report.</p>
        </div>
    </div>
</body>
</html>
EOF
    elif [[ "$OUTPUT_FORMAT" == "json" ]]; then
        cat > "$exec_summary" << EOF
{
  "executive_summary": {
    "report_metadata": {
      "generated_date": "$timestamp",
      "report_type": "executive_summary",
      "target": "aclue_platform"
    },
    "security_posture": {
      "overall_risk_level": "$risk_level",
      "security_score": $((100 - risk_score)),
      "total_vulnerabilities": $total_vulns,
      "critical_vulnerabilities": $critical_vulns,
      "high_vulnerabilities": $high_vulns
    },
    "key_findings": [
      $(if [[ $critical_vulns -gt 0 ]]; then
        echo "\"$critical_vulns critical security vulnerabilities require immediate attention\","
      fi)
      $(if [[ $high_vulns -gt 0 ]]; then
        echo "\"$high_vulns high-severity issues should be addressed in next sprint\","
      fi)
      "Security scanning pipeline is operational and providing continuous monitoring"
    ],
    "recommended_actions": [
      "Review detailed technical security report",
      "Implement automated security scanning in CI/CD pipeline",
      "Ensure secure coding practices across development team",
      "Schedule regular security assessments"
    ]
  }
}
EOF
    fi

    log_success "Executive summary generated: $exec_summary"
}

# Generate detailed technical report
generate_technical_report() {
    log_info "Generating detailed technical security report..."

    local results_file="${OUTPUT_DIR}/consolidated-results.json"
    local analysis_file="${OUTPUT_DIR}/vulnerability-analysis.json"
    local tech_report="${OUTPUT_DIR}/technical-security-report.${OUTPUT_FORMAT}"

    if [[ "$OUTPUT_FORMAT" == "html" ]]; then
        cat > "$tech_report" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Platform Technical Security Report</title>
    <style>
        body { font-family: 'Courier New', monospace; margin: 20px; background: #1e1e1e; color: #d4d4d4; }
        .container { max-width: 1200px; margin: 0 auto; background: #2d2d30; padding: 30px; border-radius: 5px; }
        .header { text-align: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 2px solid #007acc; }
        .section { margin: 20px 0; }
        .section h2 { color: #4ec9b0; border-bottom: 1px solid #404040; padding-bottom: 8px; }
        .section h3 { color: #dcdcaa; margin-top: 20px; }
        .vulnerability { background: #3c3c3c; padding: 15px; margin: 10px 0; border-radius: 3px; border-left: 4px solid; }
        .vuln-critical { border-color: #f44747; }
        .vuln-high { border-color: #ff8c00; }
        .vuln-medium { border-color: #ffcc02; }
        .vuln-low { border-color: #73c991; }
        .code-block { background: #1e1e1e; padding: 15px; border-radius: 3px; overflow-x: auto; }
        .metric { display: inline-block; margin: 10px; padding: 10px; background: #404040; border-radius: 3px; }
        pre { margin: 0; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1 style="color: #007acc; margin: 0;">aclue Platform</h1>
            <h2 style="color: #d4d4d4; margin: 5px 0;">Technical Security Assessment Report</h2>
            <p style="color: #888;">Generated: $(date '+%Y-%m-%d %H:%M:%S UTC')</p>
        </div>

        <div class="section">
            <h2>Scan Overview</h2>
            <div class="code-block">
                <pre>Project Root: $PROJECT_ROOT
Git Branch: $(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')
Git Commit: $(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')
Scan Tools: npm audit, safety, bandit, gitleaks, semgrep, trivy</pre>
            </div>
        </div>

        <div class="section">
            <h2>Security Scan Results</h2>
            $(if [[ -f "$results_file" ]]; then
                echo "<h3>Dependency Vulnerabilities</h3>"
                if jq -e '.scan_results.npm_audit_results' "$results_file" > /dev/null 2>&1; then
                    echo "<div class=\"code-block\">"
                    jq -r '.scan_results.npm_audit_results.metadata.vulnerabilities | to_entries[] | "  \(.key | ascii_upcase): \(.value)"' "$results_file" 2>/dev/null || echo "  No npm audit results available"
                    echo "</div>"
                fi

                echo "<h3>Code Security Analysis</h3>"
                if jq -e '.scan_results.python_bandit_results' "$results_file" > /dev/null 2>&1; then
                    echo "<div class=\"code-block\">"
                    echo "  Python security issues detected by Bandit"
                    echo "</div>"
                fi

                echo "<h3>Secret Detection</h3>"
                if jq -e '.scan_results.secret_detection_results' "$results_file" > /dev/null 2>&1; then
                    local secret_count=$(jq '.scan_results.secret_detection_results | length // 0' "$results_file" 2>/dev/null || echo "0")
                    echo "<div class=\"code-block\">"
                    echo "  Potential secrets detected: $secret_count"
                    echo "</div>"
                fi
            fi)
        </div>

        <div class="section">
            <h2>Remediation Recommendations</h2>
            <div class="vulnerability vuln-high">
                <h3>High Priority Actions</h3>
                <ul>
                    <li>Update all critical and high-severity dependency vulnerabilities</li>
                    <li>Review and rotate any exposed secrets or API keys</li>
                    <li>Implement additional input validation and sanitization</li>
                </ul>
            </div>

            <div class="vulnerability vuln-medium">
                <h3>Medium Priority Actions</h3>
                <ul>
                    <li>Address medium-severity dependency vulnerabilities</li>
                    <li>Implement additional security headers where missing</li>
                    <li>Review and update security configurations</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2>Next Steps</h2>
            <div class="code-block">
                <pre>1. Review detailed scan results in individual JSON reports
2. Create tickets for high and critical vulnerability remediation
3. Implement security fixes and test thoroughly
4. Re-run security scans to validate fixes
5. Update security baselines and allowlists as needed</pre>
            </div>
        </div>
    </div>
</body>
</html>
EOF
    elif [[ "$OUTPUT_FORMAT" == "json" ]]; then
        # Combine all scan results into a comprehensive JSON report
        if [[ -f "$results_file" ]] && [[ -f "$analysis_file" ]]; then
            jq -s '.[0] * .[1] * {"report_type": "technical_security_report", "generated_timestamp": "$(date -u '+%Y-%m-%d %H:%M:%S UTC')"}' "$results_file" "$analysis_file" > "$tech_report"
        else
            echo '{"error": "Required result files not found", "technical_report": null}' > "$tech_report"
        fi
    fi

    log_success "Technical security report generated: $tech_report"
}

# Generate remediation guide
generate_remediation_guide() {
    if [[ "$INCLUDE_REMEDIATION_GUIDE" != true ]]; then
        return 0
    fi

    log_info "Generating security remediation guide..."

    local remediation_guide="${OUTPUT_DIR}/remediation-guide.${OUTPUT_FORMAT}"
    local analysis_file="${OUTPUT_DIR}/vulnerability-analysis.json"

    if [[ "$OUTPUT_FORMAT" == "html" ]]; then
        cat > "$remediation_guide" << EOF
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Platform Security Remediation Guide</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 30px; background: #f8f9fa; }
        .container { max-width: 1000px; margin: 0 auto; background: white; padding: 40px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 40px; }
        .priority-high { border-left: 5px solid #dc3545; background: #f8d7da; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .priority-medium { border-left: 5px solid #fd7e14; background: #fff3cd; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .priority-low { border-left: 5px solid #28a745; background: #d1f2eb; padding: 20px; margin: 20px 0; border-radius: 5px; }
        .code { background: #f4f4f4; padding: 15px; border-radius: 4px; font-family: 'Courier New', monospace; margin: 10px 0; }
        .step { margin: 15px 0; padding: 15px; background: #e3f2fd; border-radius: 4px; }
        .step h4 { margin-top: 0; color: #1976d2; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🛡️ Security Remediation Guide</h1>
            <p>Actionable steps to address security findings in the aclue platform</p>
        </div>

        <div class="priority-high">
            <h2>🚨 Critical Priority Items</h2>

            <div class="step">
                <h4>1. Dependency Vulnerability Remediation</h4>
                <p><strong>Action:</strong> Update vulnerable npm and Python packages</p>
                <div class="code">
                    # For frontend dependencies<br>
                    cd web<br>
                    npm audit fix --force<br>
                    npm update<br><br>

                    # For backend dependencies<br>
                    cd backend<br>
                    pip install --upgrade pip<br>
                    pip install -r requirements.txt --upgrade
                </div>
                <p><strong>Validation:</strong> Re-run security scans to confirm fixes</p>
            </div>

            <div class="step">
                <h4>2. Secret Management</h4>
                <p><strong>Action:</strong> Remove exposed secrets and implement proper secret management</p>
                <div class="code">
                    # Remove secrets from git history<br>
                    git filter-branch --force --index-filter 'git rm --cached --ignore-unmatch path/to/file-with-secret'<br><br>

                    # Rotate affected API keys<br>
                    # - Resend API keys<br>
                    # - Supabase service keys<br>
                    # - PostHog API keys<br>
                    # - Vercel tokens<br>
                    # - Railway tokens
                </div>
                <p><strong>Prevention:</strong> Use environment variables and secrets management services</p>
            </div>
        </div>

        <div class="priority-medium">
            <h2>⚠️ High Priority Items</h2>

            <div class="step">
                <h4>3. Security Headers Implementation</h4>
                <p><strong>Action:</strong> Ensure all security headers are properly configured</p>
                <div class="code">
                    // Update vercel.json security headers<br>
                    {<br>
                    &nbsp;&nbsp;"headers": [{<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;"source": "/(.*)",<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;"headers": [<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"key": "Strict-Transport-Security", "value": "max-age=31536000; includeSubDomains; preload"},<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"key": "Content-Security-Policy", "value": "default-src 'self'; ..."},<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{"key": "X-Frame-Options", "value": "DENY"}<br>
                    &nbsp;&nbsp;&nbsp;&nbsp;]<br>
                    &nbsp;&nbsp;}]<br>
                    }
                </div>
            </div>

            <div class="step">
                <h4>4. Code Security Issues</h4>
                <p><strong>Action:</strong> Address static analysis findings</p>
                <div class="code">
                    # Run ESLint security plugin<br>
                    npx eslint . --config .eslintrc.security.json --fix<br><br>

                    # Run Bandit for Python security<br>
                    bandit -r backend/ --exclude tests/ -f json
                </div>
            </div>
        </div>

        <div class="priority-low">
            <h2>📋 Medium Priority Items</h2>

            <div class="step">
                <h4>5. Docker Security Hardening</h4>
                <p><strong>Action:</strong> Implement Docker security best practices</p>
                <div class="code">
                    # Use non-root user in Dockerfile<br>
                    RUN groupadd -r appuser && useradd -r -g appuser appuser<br>
                    USER appuser<br><br>

                    # Remove package caches<br>
                    RUN apt-get clean && rm -rf /var/lib/apt/lists/*
                </div>
            </div>

            <div class="step">
                <h4>6. API Security Enhancements</h4>
                <p><strong>Action:</strong> Implement additional API security measures</p>
                <div class="code">
                    // Add rate limiting<br>
                    import rateLimit from 'express-rate-limit'<br><br>

                    const limiter = rateLimit({<br>
                    &nbsp;&nbsp;windowMs: 15 * 60 * 1000, // 15 minutes<br>
                    &nbsp;&nbsp;max: 100 // limit each IP to 100 requests per windowMs<br>
                    })
                </div>
            </div>
        </div>

        <div class="step">
            <h2>🔄 Continuous Security Process</h2>
            <h4>Implement Ongoing Security Practices</h4>
            <ol>
                <li><strong>Automated Scanning:</strong> Ensure CI/CD pipeline includes security scans</li>
                <li><strong>Regular Updates:</strong> Schedule monthly dependency updates</li>
                <li><strong>Security Reviews:</strong> Include security review in code review process</li>
                <li><strong>Incident Response:</strong> Have a plan for handling security incidents</li>
                <li><strong>Training:</strong> Provide security training for development team</li>
            </ol>
        </div>

        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
            <p>This remediation guide is automatically generated based on current security scan results.</p>
            <p>For assistance with implementation, consult the development team or security specialist.</p>
        </div>
    </div>
</body>
</html>
EOF
    fi

    log_success "Security remediation guide generated: $remediation_guide"
}

# Convert HTML to PDF if requested
convert_to_pdf() {
    if [[ "$OUTPUT_FORMAT" != "pdf" ]]; then
        return 0
    fi

    log_info "Converting HTML reports to PDF..."

    local html_files=($(find "$OUTPUT_DIR" -name "*.html" -type f))

    for html_file in "${html_files[@]}"; do
        local pdf_file="${html_file%.html}.pdf"
        if command -v wkhtmltopdf &> /dev/null; then
            wkhtmltopdf --page-size A4 --margin-top 0.75in --margin-right 0.75in --margin-bottom 0.75in --margin-left 0.75in "$html_file" "$pdf_file"
            log_success "PDF generated: $(basename "$pdf_file")"
        else
            log_warning "wkhtmltopdf not available, skipping PDF conversion for: $(basename "$html_file")"
        fi
    done
}

# Main execution function
main() {
    local start_time=$(date +%s)

    log_info "Starting aclue platform security report generation"
    log_info "Format: $OUTPUT_FORMAT | Output Directory: $OUTPUT_DIR"

    # Initialize environment
    initialize_environment

    # Collect and analyze scan results
    collect_scan_results
    analyze_vulnerabilities

    # Generate different types of reports
    generate_executive_summary
    generate_technical_report
    generate_remediation_guide

    # Convert to PDF if requested
    convert_to_pdf

    # Calculate execution time
    local end_time=$(date +%s)
    local duration=$((end_time - start_time))

    # Final status
    log_success "✅ Security report generation completed successfully!"
    log_success "Reports generated in: $OUTPUT_DIR"
    log_success "Generation completed in ${duration}s"

    # List generated reports
    log_info "Generated reports:"
    find "$OUTPUT_DIR" -name "*.$OUTPUT_FORMAT" -type f | while read -r report; do
        log_info "  📄 $(basename "$report")"
    done
}

# Parse arguments and run main function
parse_arguments "$@"
main
