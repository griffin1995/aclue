#!/bin/bash

# Baseline Performance Collection Script
# Collects performance metrics from accessible endpoints before WAF allowlist implementation

set -e

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Colour

# Configuration
BACKEND_URL="https://aclue-backend-production.up.railway.app"
FRONTEND_URL="https://aclue.app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="./baseline-results-${TIMESTAMP}"

# Create results directory
mkdir -p "${RESULTS_DIR}"

echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}       aclue Platform - Baseline Performance Collection${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${YELLOW}📅 Timestamp:${NC} ${TIMESTAMP}"
echo -e "${YELLOW}📁 Results Directory:${NC} ${RESULTS_DIR}"
echo ""

# Function to test endpoint
test_endpoint() {
    local name=$1
    local url=$2
    local expected_status=$3
    local output_file="${RESULTS_DIR}/${name}.json"

    echo -e "${BLUE}Testing:${NC} ${name}"
    echo -e "  URL: ${url}"

    # Perform curl with detailed timing
    curl_output=$(curl -w "@-" -o /tmp/response_body.txt -s "${url}" <<EOF
{
  "url": "%{url_effective}",
  "status_code": %{http_code},
  "time_namelookup": %{time_namelookup},
  "time_connect": %{time_connect},
  "time_appconnect": %{time_appconnect},
  "time_pretransfer": %{time_pretransfer},
  "time_redirect": %{time_redirect},
  "time_starttransfer": %{time_starttransfer},
  "time_total": %{time_total},
  "size_download": %{size_download},
  "size_upload": %{size_upload},
  "size_header": %{size_header},
  "size_request": %{size_request},
  "speed_download": %{speed_download},
  "speed_upload": %{speed_upload},
  "content_type": "%{content_type}",
  "num_connects": %{num_connects},
  "num_redirects": %{num_redirects}"
}
EOF
    )

    # Save results
    echo "${curl_output}" > "${output_file}"

    # Parse status code
    status_code=$(echo "${curl_output}" | jq -r '.status_code')
    time_total=$(echo "${curl_output}" | jq -r '.time_total')

    if [ "${status_code}" = "${expected_status}" ] || [ "${expected_status}" = "*" ]; then
        echo -e "  ${GREEN}✓ Status: ${status_code}${NC}"
        echo -e "  ${GREEN}✓ Time: ${time_total}s${NC}"
    else
        echo -e "  ${RED}✗ Status: ${status_code} (expected ${expected_status})${NC}"
        echo -e "  ${YELLOW}  Time: ${time_total}s${NC}"
    fi

    echo ""
}

# Function to test with K6
run_k6_test() {
    local test_file=$1
    local output_name=$2

    if command -v k6 &> /dev/null; then
        echo -e "${BLUE}Running K6 Test:${NC} ${output_name}"
        k6 run --summary-export="${RESULTS_DIR}/${output_name}-summary.json" \
               --out json="${RESULTS_DIR}/${output_name}-metrics.json" \
               "${test_file}" || true
        echo -e "${GREEN}✓ K6 test completed${NC}"
    else
        echo -e "${YELLOW}⚠ K6 not installed, skipping load test${NC}"
    fi
    echo ""
}

# Function to collect performance metrics
collect_metrics() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}                 1. Backend API Testing${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Test backend endpoints
    test_endpoint "backend_health" "${BACKEND_URL}/health" "200"
    test_endpoint "backend_root" "${BACKEND_URL}/" "200"
    test_endpoint "backend_docs" "${BACKEND_URL}/docs" "200"
    test_endpoint "backend_openapi" "${BACKEND_URL}/openapi.json" "200"
    test_endpoint "backend_products" "${BACKEND_URL}/api/v1/products/" "*"
    test_endpoint "backend_auth_login" "${BACKEND_URL}/api/v1/auth/login" "*"

    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}              2. Frontend Testing (WAF Check)${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Test frontend (expecting 403 due to WAF)
    test_endpoint "frontend_root" "${FRONTEND_URL}/" "*"
    test_endpoint "frontend_logo" "${FRONTEND_URL}/aclue_text_clean.png" "*"
    test_endpoint "frontend_newsletter" "${FRONTEND_URL}/newsletter" "*"

    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}                  3. Load Testing${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Run K6 tests if available
    if [ -f "./backend-api-test.js" ]; then
        run_k6_test "./backend-api-test.js" "backend-load-test"
    fi
}

# Function to generate summary report
generate_summary() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}                  4. Summary Report${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Create summary JSON
    cat > "${RESULTS_DIR}/summary.json" <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "test_type": "pre-waf-baseline",
  "backend_url": "${BACKEND_URL}",
  "frontend_url": "${FRONTEND_URL}",
  "results": {
EOF

    # Add backend results
    echo '    "backend": {' >> "${RESULTS_DIR}/summary.json"
    for file in "${RESULTS_DIR}"/backend_*.json; do
        if [ -f "$file" ]; then
            name=$(basename "$file" .json)
            status=$(jq -r '.status_code' "$file")
            time=$(jq -r '.time_total' "$file")
            echo "      \"${name}\": { \"status\": ${status}, \"time\": ${time} }," >> "${RESULTS_DIR}/summary.json"
        fi
    done
    echo '    },' >> "${RESULTS_DIR}/summary.json"

    # Add frontend results
    echo '    "frontend": {' >> "${RESULTS_DIR}/summary.json"
    for file in "${RESULTS_DIR}"/frontend_*.json; do
        if [ -f "$file" ]; then
            name=$(basename "$file" .json)
            status=$(jq -r '.status_code' "$file")
            time=$(jq -r '.time_total' "$file")
            echo "      \"${name}\": { \"status\": ${status}, \"time\": ${time} }," >> "${RESULTS_DIR}/summary.json"
        fi
    done
    echo '    }' >> "${RESULTS_DIR}/summary.json"

    echo '  }' >> "${RESULTS_DIR}/summary.json"
    echo '}' >> "${RESULTS_DIR}/summary.json"

    # Display summary
    echo -e "${GREEN}Baseline collection complete!${NC}"
    echo ""
    echo -e "${YELLOW}Backend API Status:${NC}"
    jq -r '.results.backend | to_entries[] | "  \(.key): Status \(.value.status), Time \(.value.time)s"' "${RESULTS_DIR}/summary.json"
    echo ""
    echo -e "${YELLOW}Frontend Status (WAF):${NC}"
    jq -r '.results.frontend | to_entries[] | "  \(.key): Status \(.value.status), Time \(.value.time)s"' "${RESULTS_DIR}/summary.json"
    echo ""
    echo -e "${GREEN}Results saved to:${NC} ${RESULTS_DIR}/"
    echo -e "${GREEN}Summary file:${NC} ${RESULTS_DIR}/summary.json"
}

# Main execution
main() {
    # Check dependencies
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required${NC}"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required${NC}"
        exit 1
    fi

    # Collect metrics
    collect_metrics

    # Generate summary
    generate_summary

    echo ""
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
    echo -e "${GREEN}       Baseline Collection Complete! 🎉${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════${NC}"
}

# Run main function
main "$@"
