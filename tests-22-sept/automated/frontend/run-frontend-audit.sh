#!/bin/bash

# aclue Frontend Accessibility and SEO Automation Suite
# Comprehensive scanning with Pa11y, axe-core, Lighthouse, broken-link-checker, and webhint

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="${SCRIPT_DIR}/reports"
CONFIG_DIR="${SCRIPT_DIR}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Target URLs
PRODUCTION_URL="https://aclue.app"
LOCAL_URL="http://localhost:3000"

# Test pages
PAGES=(
    ""
    "/landingpage"
    "/discover"
)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
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

create_reports_directory() {
    mkdir -p "${REPORTS_DIR}/${TIMESTAMP}"
    log_info "Created reports directory: ${REPORTS_DIR}/${TIMESTAMP}"
}

check_url_availability() {
    local url=$1
    local timeout=10

    log_info "Checking availability of ${url}..."

    if curl -f -s --max-time $timeout --head "${url}" > /dev/null 2>&1; then
        log_success "${url} is accessible"
        return 0
    else
        log_warning "${url} is not accessible - skipping"
        return 1
    fi
}

run_pa11y_scan() {
    local base_url=$1
    local url_type=$2

    log_info "Running Pa11y accessibility scan for ${url_type}..."

    for page in "${PAGES[@]}"; do
        local full_url="${base_url}${page}"
        local page_name=$(echo "${page}" | sed 's/\//_/g')
        [ -z "$page_name" ] && page_name="home"

        local output_file="${REPORTS_DIR}/${TIMESTAMP}/pa11y_${url_type}_${page_name}.json"

        if check_url_availability "${full_url}"; then
            log_info "Scanning ${full_url} with Pa11y..."

            if pa11y --config "${CONFIG_DIR}/.pa11yrc.json" \
                    --reporter json \
                    "${full_url}" > "${output_file}" 2>/dev/null; then
                log_success "Pa11y scan completed for ${page_name}"
            else
                log_error "Pa11y scan failed for ${page_name}"
            fi
        fi
    done
}

run_pa11y_ci_scan() {
    local base_url=$1
    local url_type=$2

    log_info "Running Pa11y-CI sitemap scan for ${url_type}..."

    # Create temporary config for this URL
    local temp_config="${CONFIG_DIR}/.pa11yci_${url_type}_temp.json"

    # Update URLs in config
    sed "s|https://aclue.app|${base_url}|g; s|http://localhost:3000|${base_url}|g" \
        "${CONFIG_DIR}/.pa11yci.json" > "${temp_config}"

    local output_file="${REPORTS_DIR}/${TIMESTAMP}/pa11y_ci_${url_type}.json"

    if pa11y-ci --config "${temp_config}" \
               --json > "${output_file}" 2>/dev/null; then
        log_success "Pa11y-CI scan completed for ${url_type}"
    else
        log_error "Pa11y-CI scan failed for ${url_type}"
    fi

    # Clean up temp config
    rm -f "${temp_config}"
}

run_axe_scan() {
    local base_url=$1
    local url_type=$2

    log_info "Running axe-core accessibility scan for ${url_type}..."

    for page in "${PAGES[@]}"; do
        local full_url="${base_url}${page}"
        local page_name=$(echo "${page}" | sed 's/\//_/g')
        [ -z "$page_name" ] && page_name="home"

        local output_file="${REPORTS_DIR}/${TIMESTAMP}/axe_${url_type}_${page_name}.json"

        if check_url_availability "${full_url}"; then
            log_info "Scanning ${full_url} with axe-core..."

            if axe "${full_url}" \
                   --config "${CONFIG_DIR}/axe-config.json" \
                   --format json \
                   --output "${output_file}" \
                   --timeout 30000 > /dev/null 2>&1; then
                log_success "axe-core scan completed for ${page_name}"
            else
                log_error "axe-core scan failed for ${page_name}"
            fi
        fi
    done
}

run_lighthouse_scan() {
    local base_url=$1
    local url_type=$2

    log_info "Running Lighthouse scans for ${url_type}..."

    for page in "${PAGES[@]}"; do
        local full_url="${base_url}${page}"
        local page_name=$(echo "${page}" | sed 's/\//_/g')
        [ -z "$page_name" ] && page_name="home"

        if check_url_availability "${full_url}"; then
            # Mobile scan
            local mobile_output="${REPORTS_DIR}/${TIMESTAMP}/lighthouse_mobile_${url_type}_${page_name}.json"
            log_info "Running Lighthouse mobile scan for ${page_name}..."

            if lighthouse "${full_url}" \
                         --config-path="${CONFIG_DIR}/lighthouse-config.js" \
                         --output=json \
                         --output-path="${mobile_output}" \
                         --quiet > /dev/null 2>&1; then
                log_success "Lighthouse mobile scan completed for ${page_name}"
            else
                log_error "Lighthouse mobile scan failed for ${page_name}"
            fi

            # Desktop scan
            local desktop_output="${REPORTS_DIR}/${TIMESTAMP}/lighthouse_desktop_${url_type}_${page_name}.json"
            log_info "Running Lighthouse desktop scan for ${page_name}..."

            if lighthouse "${full_url}" \
                         --config-path="${CONFIG_DIR}/lighthouse-desktop-config.js" \
                         --output=json \
                         --output-path="${desktop_output}" \
                         --quiet > /dev/null 2>&1; then
                log_success "Lighthouse desktop scan completed for ${page_name}"
            else
                log_error "Lighthouse desktop scan failed for ${page_name}"
            fi

            # Add small delay between scans
            sleep 2
        fi
    done
}

run_broken_link_checker() {
    local base_url=$1
    local url_type=$2

    log_info "Running broken link checker for ${url_type}..."

    local output_file="${REPORTS_DIR}/${TIMESTAMP}/broken_links_${url_type}.json"

    if check_url_availability "${base_url}"; then
        log_info "Checking links for ${base_url}..."

        # Use blc with recursive checking and JSON output
        if blc "${base_url}" \
               --recursive \
               --ordered \
               --exclude-external \
               --filter-level 1 \
               --requests 2 \
               --host-requests 1 \
               --rate-limit 100 \
               --timeout 30000 \
               --user-agent "BLC-aclue-Scanner/1.0" > "${output_file}" 2>/dev/null; then
            log_success "Broken link check completed for ${url_type}"
        else
            log_error "Broken link check failed for ${url_type}"
        fi
    fi
}

run_webhint_scan() {
    local base_url=$1
    local url_type=$2

    log_info "Running webhint scan for ${url_type}..."

    for page in "${PAGES[@]}"; do
        local full_url="${base_url}${page}"
        local page_name=$(echo "${page}" | sed 's/\//_/g')
        [ -z "$page_name" ] && page_name="home"

        local output_file="${REPORTS_DIR}/${TIMESTAMP}/webhint_${url_type}_${page_name}.json"

        if check_url_availability "${full_url}"; then
            log_info "Scanning ${full_url} with webhint..."

            cd "${CONFIG_DIR}" # webhint uses .hintrc from current directory

            if hint "${full_url}" \
                    --format json \
                    --output "${output_file}" > /dev/null 2>&1; then
                log_success "webhint scan completed for ${page_name}"
            else
                log_error "webhint scan failed for ${page_name}"
            fi
        fi
    done
}

generate_summary_report() {
    local summary_file="${REPORTS_DIR}/${TIMESTAMP}/summary_report.json"

    log_info "Generating summary report..."

    cat > "${summary_file}" << EOF
{
  "scan_timestamp": "${TIMESTAMP}",
  "scan_date": "$(date -Iseconds)",
  "tools_used": [
    "pa11y",
    "pa11y-ci",
    "axe-core",
    "lighthouse",
    "broken-link-checker",
    "webhint"
  ],
  "scanned_urls": {
    "production": "${PRODUCTION_URL}",
    "local": "${LOCAL_URL}"
  },
  "scanned_pages": $(printf '%s\n' "${PAGES[@]}" | jq -R . | jq -s .),
  "reports_directory": "${REPORTS_DIR}/${TIMESTAMP}",
  "total_reports": $(find "${REPORTS_DIR}/${TIMESTAMP}" -name "*.json" | wc -l),
  "scan_completed": "$(date -Iseconds)"
}
EOF

    log_success "Summary report generated: ${summary_file}"
}

main() {
    echo "========================================"
    echo "aclue Frontend Accessibility & SEO Audit"
    echo "========================================"
    echo "Timestamp: ${TIMESTAMP}"
    echo "Tools: Pa11y, axe-core, Lighthouse, broken-link-checker, webhint"
    echo ""

    # Create reports directory
    create_reports_directory

    # Check which URLs are available
    local run_production=false
    local run_local=false

    if check_url_availability "${PRODUCTION_URL}"; then
        run_production=true
    fi

    if check_url_availability "${LOCAL_URL}"; then
        run_local=true
    fi

    if [ "$run_production" = false ] && [ "$run_local" = false ]; then
        log_error "Neither production nor local URLs are accessible. Exiting."
        exit 1
    fi

    # Run scans for available URLs
    if [ "$run_production" = true ]; then
        log_info "Starting production scans..."
        run_pa11y_scan "${PRODUCTION_URL}" "production"
        run_pa11y_ci_scan "${PRODUCTION_URL}" "production"
        run_axe_scan "${PRODUCTION_URL}" "production"
        run_lighthouse_scan "${PRODUCTION_URL}" "production"
        run_broken_link_checker "${PRODUCTION_URL}" "production"
        run_webhint_scan "${PRODUCTION_URL}" "production"
    fi

    if [ "$run_local" = true ]; then
        log_info "Starting local development scans..."
        run_pa11y_scan "${LOCAL_URL}" "local"
        run_pa11y_ci_scan "${LOCAL_URL}" "local"
        run_axe_scan "${LOCAL_URL}" "local"
        run_lighthouse_scan "${LOCAL_URL}" "local"
        run_broken_link_checker "${LOCAL_URL}" "local"
        run_webhint_scan "${LOCAL_URL}" "local"
    fi

    # Generate summary
    generate_summary_report

    echo ""
    echo "========================================"
    log_success "Frontend audit completed!"
    echo "Reports saved to: ${REPORTS_DIR}/${TIMESTAMP}"
    echo "========================================"
}

# Run main function
main "$@"