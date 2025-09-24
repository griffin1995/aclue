#!/bin/bash

# Nuclei Production Security Scanning Script for aclue Platform
# Configured for WAF allowlist compatibility

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="${SCRIPT_DIR}/nuclei-production-config.yaml"
REPORTS_DIR="${SCRIPT_DIR}/../reports/nuclei"
TEMPLATES_DIR="${SCRIPT_DIR}/nuclei-templates"
LOG_FILE="${REPORTS_DIR}/nuclei-scan-$(date +%Y%m%d-%H%M%S).log"

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

# Logging function
log() {
    echo -e "${BLUE}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1" | tee -a "$LOG_FILE"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" | tee -a "$LOG_FILE"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" | tee -a "$LOG_FILE"
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."

    # Check if nuclei is installed
    if ! command -v nuclei &> /dev/null; then
        error "Nuclei is not installed. Please install it first:"
        echo "  go install -v github.com/projectdiscovery/nuclei/v2/cmd/nuclei@latest"
        exit 1
    fi

    # Check nuclei version
    local nuclei_version
    nuclei_version=$(nuclei -version 2>&1 | grep -oP 'v\d+\.\d+\.\d+' || echo "unknown")
    log "Nuclei version: $nuclei_version"

    # Check configuration file
    if [[ ! -f "$CONFIG_FILE" ]]; then
        error "Configuration file not found: $CONFIG_FILE"
        exit 1
    fi

    success "Prerequisites check completed"
}

# Setup directories
setup_directories() {
    log "Setting up directories..."

    mkdir -p "$REPORTS_DIR"
    mkdir -p "$TEMPLATES_DIR"

    success "Directories setup completed"
}

# WAF access verification
verify_waf_access() {
    log "Verifying WAF allowlist access..."

    # Test basic connectivity with Nuclei user agent
    local test_response
    test_response=$(curl -s -o /dev/null -w "%{http_code}" \
        -H "User-Agent: Nuclei/v2.9.4 (+https://projectdiscovery.io/nuclei)" \
        -H "X-Test-Purpose: security-assessment" \
        -H "X-Monitoring-Tool: nuclei" \
        "https://aclue.app" || echo "000")

    if [[ "$test_response" == "200" ]]; then
        success "WAF allowlist access verified (HTTP $test_response)"
    elif [[ "$test_response" == "403" ]]; then
        error "WAF is blocking requests (HTTP 403). Check allowlist configuration."
        exit 1
    else
        warning "Unexpected response code: $test_response. Proceeding with caution."
    fi
}

# Update templates (if needed)
update_templates() {
    log "Checking template updates..."

    # Only update if templates directory is empty or if explicitly requested
    if [[ ! -d "$TEMPLATES_DIR/http" ]] || [[ "${1:-}" == "--update-templates" ]]; then
        log "Updating Nuclei templates..."
        nuclei -update-templates -update-directory "$TEMPLATES_DIR"
        success "Templates updated"
    else
        log "Using existing templates (use --update-templates to force update)"
    fi
}

# Run security scan
run_security_scan() {
    log "Starting Nuclei security scan for aclue platform..."

    local timestamp
    timestamp=$(date +%Y%m%d-%H%M%S)
    local report_json="${REPORTS_DIR}/nuclei-results-${timestamp}.json"
    local report_markdown="${REPORTS_DIR}/nuclei-summary-${timestamp}.md"

    # Run nuclei with production configuration
    nuclei \
        -config "$CONFIG_FILE" \
        -target "https://aclue.app" \
        -json-export "$report_json" \
        -markdown-export "$report_markdown" \
        -stats \
        -verbose 2>&1 | tee -a "$LOG_FILE"

    local scan_exit_code=$?

    if [[ $scan_exit_code -eq 0 ]]; then
        success "Nuclei scan completed successfully"
        log "Reports generated:"
        log "  JSON: $report_json"
        log "  Markdown: $report_markdown"
    else
        error "Nuclei scan completed with errors (exit code: $scan_exit_code)"
    fi

    return $scan_exit_code
}

# Generate summary report
generate_summary() {
    log "Generating scan summary..."

    local latest_json
    latest_json=$(find "$REPORTS_DIR" -name "nuclei-results-*.json" -type f -printf '%T@ %p\n' | sort -rn | head -1 | cut -d' ' -f2-)

    if [[ -f "$latest_json" ]]; then
        local total_findings
        local critical_findings
        local high_findings
        local medium_findings

        total_findings=$(jq length "$latest_json")
        critical_findings=$(jq '[.[] | select(.info.severity == "critical")] | length' "$latest_json")
        high_findings=$(jq '[.[] | select(.info.severity == "high")] | length' "$latest_json")
        medium_findings=$(jq '[.[] | select(.info.severity == "medium")] | length' "$latest_json")

        log "Scan Summary:"
        log "  Total findings: $total_findings"
        log "  Critical: $critical_findings"
        log "  High: $high_findings"
        log "  Medium: $medium_findings"

        # Generate alert if critical findings
        if [[ $critical_findings -gt 0 ]]; then
            error "CRITICAL: $critical_findings critical security findings detected!"
            return 1
        elif [[ $high_findings -gt 0 ]]; then
            warning "WARNING: $high_findings high severity findings detected"
            return 2
        else
            success "No critical or high severity findings detected"
            return 0
        fi
    else
        error "No scan results found for summary generation"
        return 1
    fi
}

# Cleanup old reports
cleanup_old_reports() {
    log "Cleaning up old reports (keeping last 10)..."

    # Keep only the 10 most recent reports
    find "$REPORTS_DIR" -name "nuclei-results-*.json" -type f -printf '%T@ %p\n' | \
        sort -rn | tail -n +11 | cut -d' ' -f2- | xargs -r rm -f

    find "$REPORTS_DIR" -name "nuclei-summary-*.md" -type f -printf '%T@ %p\n' | \
        sort -rn | tail -n +11 | cut -d' ' -f2- | xargs -r rm -f

    success "Cleanup completed"
}

# Main execution function
main() {
    local start_time
    start_time=$(date +%s)

    log "=== Starting aclue Platform Security Scan ==="
    log "Configuration: $CONFIG_FILE"
    log "Reports directory: $REPORTS_DIR"

    # Execute scan steps
    check_prerequisites
    setup_directories
    verify_waf_access
    update_templates "$@"

    # Run the actual scan
    if run_security_scan; then
        generate_summary
        local summary_exit=$?
        cleanup_old_reports

        local end_time
        end_time=$(date +%s)
        local duration=$((end_time - start_time))

        success "Security scan completed in ${duration} seconds"

        # Set appropriate exit code
        exit $summary_exit
    else
        error "Security scan failed"
        exit 1
    fi
}

# Help function
show_help() {
    echo "Usage: $0 [options]"
    echo ""
    echo "Options:"
    echo "  --update-templates    Force update of Nuclei templates"
    echo "  --help               Show this help message"
    echo ""
    echo "Environment Variables:"
    echo "  NUCLEI_CONFIG        Override default config file path"
    echo "  NUCLEI_REPORTS_DIR   Override default reports directory"
    echo ""
    echo "Examples:"
    echo "  $0                           # Run scan with existing templates"
    echo "  $0 --update-templates        # Update templates and run scan"
    echo ""
}

# Command line argument handling
case "${1:-}" in
    --help|-h)
        show_help
        exit 0
        ;;
    --update-templates)
        main "$@"
        ;;
    "")
        main
        ;;
    *)
        error "Unknown option: $1"
        show_help
        exit 1
        ;;
esac
