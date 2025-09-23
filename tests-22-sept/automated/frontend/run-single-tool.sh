#!/bin/bash

# aclue Frontend Single Tool Runner
# Run individual tools for specific URLs

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPORTS_DIR="${SCRIPT_DIR}/reports"
CONFIG_DIR="${SCRIPT_DIR}"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

show_help() {
    echo "Usage: $0 <tool> <url> [output_file]"
    echo ""
    echo "Available tools:"
    echo "  pa11y       - WCAG accessibility scanner"
    echo "  axe         - axe-core accessibility scanner"
    echo "  lighthouse  - Google Lighthouse audit"
    echo "  lighthouse-desktop - Lighthouse desktop audit"
    echo "  blc         - Broken link checker"
    echo "  webhint     - Web best practices scanner"
    echo ""
    echo "Examples:"
    echo "  $0 pa11y https://aclue.app"
    echo "  $0 lighthouse https://aclue.app/landingpage"
    echo "  $0 axe http://localhost:3000/discover"
    echo ""
}

run_pa11y() {
    local url=$1
    local output_file=${2:-"pa11y_$(date +%s).json"}

    log_info "Running Pa11y scan on ${url}..."

    if pa11y --config "${CONFIG_DIR}/.pa11yrc.json" \
            --reporter json \
            "${url}" > "${output_file}" 2>/dev/null; then
        log_success "Pa11y scan completed. Results saved to: ${output_file}"
    else
        log_error "Pa11y scan failed"
        return 1
    fi
}

run_axe() {
    local url=$1
    local output_file=${2:-"axe_$(date +%s).json"}

    log_info "Running axe-core scan on ${url}..."

    if axe "${url}" \
           --config "${CONFIG_DIR}/axe-config.json" \
           --format json \
           --output "${output_file}" \
           --timeout 30000 > /dev/null 2>&1; then
        log_success "axe-core scan completed. Results saved to: ${output_file}"
    else
        log_error "axe-core scan failed"
        return 1
    fi
}

run_lighthouse() {
    local url=$1
    local output_file=${2:-"lighthouse_$(date +%s).json"}

    log_info "Running Lighthouse mobile scan on ${url}..."

    if lighthouse "${url}" \
                 --config-path="${CONFIG_DIR}/lighthouse-config.js" \
                 --output=json \
                 --output-path="${output_file}" \
                 --quiet > /dev/null 2>&1; then
        log_success "Lighthouse scan completed. Results saved to: ${output_file}"
    else
        log_error "Lighthouse scan failed"
        return 1
    fi
}

run_lighthouse_desktop() {
    local url=$1
    local output_file=${2:-"lighthouse_desktop_$(date +%s).json"}

    log_info "Running Lighthouse desktop scan on ${url}..."

    if lighthouse "${url}" \
                 --config-path="${CONFIG_DIR}/lighthouse-desktop-config.js" \
                 --output=json \
                 --output-path="${output_file}" \
                 --quiet > /dev/null 2>&1; then
        log_success "Lighthouse desktop scan completed. Results saved to: ${output_file}"
    else
        log_error "Lighthouse desktop scan failed"
        return 1
    fi
}

run_blc() {
    local url=$1
    local output_file=${2:-"blc_$(date +%s).txt"}

    log_info "Running broken link checker on ${url}..."

    if blc "${url}" \
           --recursive \
           --ordered \
           --exclude-external \
           --filter-level 1 \
           --requests 2 \
           --host-requests 1 \
           --rate-limit 100 \
           --timeout 30000 \
           --user-agent "BLC-aclue-Scanner/1.0" > "${output_file}" 2>/dev/null; then
        log_success "Broken link check completed. Results saved to: ${output_file}"
    else
        log_error "Broken link check failed"
        return 1
    fi
}

run_webhint() {
    local url=$1
    local output_file=${2:-"webhint_$(date +%s).json"}

    log_info "Running webhint scan on ${url}..."

    cd "${CONFIG_DIR}" # webhint uses .hintrc from current directory

    if hint "${url}" \
            --format json \
            --output "${output_file}" > /dev/null 2>&1; then
        log_success "webhint scan completed. Results saved to: ${output_file}"
    else
        log_error "webhint scan failed"
        return 1
    fi
}

main() {
    if [ $# -lt 2 ]; then
        show_help
        exit 1
    fi

    local tool=$1
    local url=$2
    local output_file=$3

    # Create reports directory if it doesn't exist
    mkdir -p "${REPORTS_DIR}"

    # Set output file path relative to reports directory if not absolute
    if [ -n "$output_file" ] && [[ ! "$output_file" = /* ]]; then
        output_file="${REPORTS_DIR}/${output_file}"
    fi

    case "$tool" in
        pa11y)
            run_pa11y "$url" "$output_file"
            ;;
        axe)
            run_axe "$url" "$output_file"
            ;;
        lighthouse)
            run_lighthouse "$url" "$output_file"
            ;;
        lighthouse-desktop)
            run_lighthouse_desktop "$url" "$output_file"
            ;;
        blc)
            run_blc "$url" "$output_file"
            ;;
        webhint)
            run_webhint "$url" "$output_file"
            ;;
        *)
            log_error "Unknown tool: $tool"
            show_help
            exit 1
            ;;
    esac
}

main "$@"