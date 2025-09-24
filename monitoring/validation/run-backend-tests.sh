#!/bin/bash

# Backend API Testing Script
# Tests currently accessible Railway backend endpoints

set -e

# Colours
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
BACKEND_URL="https://aclue-backend-production.up.railway.app"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
RESULTS_DIR="./test-results-${TIMESTAMP}"

# Create results directory
mkdir -p "${RESULTS_DIR}"

echo -e "${CYAN}╔════════════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║         aclue Backend API Testing Suite                       ║${NC}"
echo -e "${CYAN}╚════════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}📅 Timestamp:${NC} ${TIMESTAMP}"
echo -e "${BLUE}🎯 Target:${NC} ${BACKEND_URL}"
echo -e "${BLUE}📁 Results:${NC} ${RESULTS_DIR}/"
echo ""

# Function to test endpoint with detailed metrics
test_endpoint() {
    local name=$1
    local endpoint=$2
    local method=${3:-GET}
    local data=${4:-}
    local expected=${5:-200}

    echo -e "${YELLOW}Testing:${NC} ${name}"
    echo -e "  Method: ${method}"
    echo -e "  Endpoint: ${endpoint}"

    # Build curl command
    local curl_cmd="curl -X ${method} -w @- -o ${RESULTS_DIR}/${name}_response.txt -s"

    # Add data if POST request
    if [[ "${method}" == "POST" ]] && [[ -n "${data}" ]]; then
        curl_cmd="${curl_cmd} -H 'Content-Type: application/json' -d '${data}'"
    fi

    # Add monitoring headers
    curl_cmd="${curl_cmd} -H 'User-Agent: k6/0.45.0 (aclue-monitoring)'"
    curl_cmd="${curl_cmd} -H 'X-Test-Purpose: backend-validation'"

    # Execute curl with timing template
    local timing=$(eval "${curl_cmd} '${BACKEND_URL}${endpoint}'" <<EOF
{
  "name": "${name}",
  "url": "%{url_effective}",
  "method": "${method}",
  "status_code": %{http_code},
  "time_namelookup": %{time_namelookup},
  "time_connect": %{time_connect},
  "time_appconnect": %{time_appconnect},
  "time_pretransfer": %{time_pretransfer},
  "time_starttransfer": %{time_starttransfer},
  "time_total": %{time_total},
  "size_download": %{size_download},
  "speed_download": %{speed_download},
  "content_type": "%{content_type}"
}
EOF
    )

    # Save timing data
    echo "${timing}" > "${RESULTS_DIR}/${name}_timing.json"

    # Parse results
    local status_code=$(echo "${timing}" | jq -r '.status_code')
    local time_total=$(echo "${timing}" | jq -r '.time_total')
    local size=$(echo "${timing}" | jq -r '.size_download')

    # Check status
    if [[ "${status_code}" == "${expected}" ]] || [[ "${expected}" == "*" ]]; then
        echo -e "  ${GREEN}✓ Status: ${status_code}${NC}"
    else
        echo -e "  ${RED}✗ Status: ${status_code} (expected ${expected})${NC}"
    fi

    # Performance analysis
    if (( $(echo "${time_total} < 0.5" | bc -l) )); then
        echo -e "  ${GREEN}✓ Response Time: ${time_total}s (Fast)${NC}"
    elif (( $(echo "${time_total} < 1.0" | bc -l) )); then
        echo -e "  ${YELLOW}⚡ Response Time: ${time_total}s (Acceptable)${NC}"
    else
        echo -e "  ${RED}⚠ Response Time: ${time_total}s (Slow)${NC}"
    fi

    echo -e "  📦 Size: ${size} bytes"
    echo ""

    # Return status for aggregation
    echo "${status_code}:${time_total}" >> "${RESULTS_DIR}/summary.txt"
}

# Function to run load test
run_load_test() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}           Load Testing with Concurrent Requests${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""

    local endpoint="/health"
    local concurrent=10
    local requests=50

    echo -e "${BLUE}Configuration:${NC}"
    echo -e "  Endpoint: ${endpoint}"
    echo -e "  Concurrent: ${concurrent}"
    echo -e "  Total Requests: ${requests}"
    echo ""

    # Use ab (Apache Bench) if available
    if command -v ab &> /dev/null; then
        echo -e "${GREEN}Using Apache Bench for load testing...${NC}"
        ab -n ${requests} -c ${concurrent} \
           -H "User-Agent: k6/0.45.0 (aclue-monitoring)" \
           -g "${RESULTS_DIR}/ab_results.tsv" \
           "${BACKEND_URL}${endpoint}" > "${RESULTS_DIR}/ab_output.txt" 2>&1

        # Parse results
        local rps=$(grep "Requests per second" "${RESULTS_DIR}/ab_output.txt" | awk '{print $4}')
        local avg_time=$(grep "Time per request" "${RESULTS_DIR}/ab_output.txt" | head -1 | awk '{print $4}')
        local failed=$(grep "Failed requests" "${RESULTS_DIR}/ab_output.txt" | awk '{print $3}')

        echo -e "${GREEN}Results:${NC}"
        echo -e "  Requests/sec: ${rps}"
        echo -e "  Avg Time: ${avg_time}ms"
        echo -e "  Failed: ${failed}"
    else
        echo -e "${YELLOW}Apache Bench not installed, using curl parallel requests...${NC}"

        # Parallel curl requests
        for i in $(seq 1 ${concurrent}); do
            (
                for j in $(seq 1 $((requests/concurrent))); do
                    curl -s -w "%{http_code}:%{time_total}\n" \
                         -H "User-Agent: k6/0.45.0 (aclue-monitoring)" \
                         -o /dev/null \
                         "${BACKEND_URL}${endpoint}"
                done
            ) >> "${RESULTS_DIR}/parallel_results.txt" &
        done

        wait

        # Analyse results
        local total=$(wc -l < "${RESULTS_DIR}/parallel_results.txt")
        local success=$(grep -c "^200:" "${RESULTS_DIR}/parallel_results.txt" || echo 0)
        local avg=$(awk -F: '{sum+=$2; count++} END {print sum/count}' "${RESULTS_DIR}/parallel_results.txt")

        echo -e "${GREEN}Results:${NC}"
        echo -e "  Total Requests: ${total}"
        echo -e "  Successful: ${success}"
        echo -e "  Average Time: ${avg}s"
    fi

    echo ""
}

# Main test execution
main() {
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                 1. Core Endpoint Tests${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Test health endpoint
    test_endpoint "health" "/health" "GET" "" "200"

    # Test root endpoint
    test_endpoint "root" "/" "GET" "" "200"

    # Test API documentation
    test_endpoint "openapi" "/openapi.json" "GET" "" "200"
    test_endpoint "swagger_docs" "/docs" "GET" "" "200"

    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                 2. API Endpoint Tests${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Test products endpoint
    test_endpoint "products_all" "/api/v1/products/" "GET" "" "*"
    test_endpoint "products_limited" "/api/v1/products/?limit=5" "GET" "" "*"
    test_endpoint "products_paginated" "/api/v1/products/?limit=10&offset=5" "GET" "" "*"

    # Test auth endpoints (expect failures with test data)
    test_endpoint "auth_login" "/api/v1/auth/login" "POST" \
        '{"email":"test@example.com","password":"test123"}' "401"

    test_endpoint "auth_register_invalid" "/api/v1/auth/register" "POST" \
        '{}' "422"

    # Test recommendations (may require auth)
    test_endpoint "recommendations" "/api/v1/recommendations/" "GET" "" "*"

    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                 3. Performance Tests${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Run load testing
    run_load_test

    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}                    4. Summary Report${NC}"
    echo -e "${CYAN}═══════════════════════════════════════════════════════${NC}"
    echo ""

    # Generate summary
    local total_tests=$(wc -l < "${RESULTS_DIR}/summary.txt")
    local success_200=$(grep -c "^200:" "${RESULTS_DIR}/summary.txt" || echo 0)
    local success_other=$(grep -c "^[234][0-9][0-9]:" "${RESULTS_DIR}/summary.txt" || echo 0)
    local failed=$(grep -c "^[5][0-9][0-9]:" "${RESULTS_DIR}/summary.txt" || echo 0)

    # Calculate average response time
    local avg_time=$(awk -F: '{sum+=$2; count++} END {if(count>0) print sum/count; else print 0}' \
                     "${RESULTS_DIR}/summary.txt")

    echo -e "${GREEN}📊 Test Results Summary${NC}"
    echo -e "  Total Tests: ${total_tests}"
    echo -e "  Successful (200): ${success_200}"
    echo -e "  Other Success (2xx/3xx/4xx): ${success_other}"
    echo -e "  Failed (5xx): ${failed}"
    echo -e "  Average Response Time: ${avg_time}s"
    echo ""

    # Performance analysis
    echo -e "${GREEN}⚡ Performance Analysis${NC}"
    local fast=$(awk -F: '$2 < 0.5 {count++} END {print count+0}' "${RESULTS_DIR}/summary.txt")
    local acceptable=$(awk -F: '$2 >= 0.5 && $2 < 1.0 {count++} END {print count+0}' "${RESULTS_DIR}/summary.txt")
    local slow=$(awk -F: '$2 >= 1.0 {count++} END {print count+0}' "${RESULTS_DIR}/summary.txt")

    echo -e "  Fast (<0.5s): ${fast} requests"
    echo -e "  Acceptable (0.5-1s): ${acceptable} requests"
    echo -e "  Slow (>1s): ${slow} requests"
    echo ""

    # Generate JSON summary
    cat > "${RESULTS_DIR}/test-summary.json" <<EOF
{
  "timestamp": "${TIMESTAMP}",
  "backend_url": "${BACKEND_URL}",
  "test_results": {
    "total_tests": ${total_tests},
    "successful_200": ${success_200},
    "other_success": ${success_other},
    "failed_5xx": ${failed},
    "average_response_time": ${avg_time}
  },
  "performance": {
    "fast_requests": ${fast},
    "acceptable_requests": ${acceptable},
    "slow_requests": ${slow}
  },
  "status": "$([ ${failed} -eq 0 ] && echo "PASSED" || echo "FAILED")"
}
EOF

    echo -e "${GREEN}📁 Detailed results saved to:${NC} ${RESULTS_DIR}/"
    echo -e "${GREEN}📄 Summary JSON:${NC} ${RESULTS_DIR}/test-summary.json"
    echo ""

    # Overall status
    if [ ${failed} -eq 0 ] && [ ${slow} -lt 3 ]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║                    ✅ ALL TESTS PASSED                        ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    else
        echo -e "${RED}╔════════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║                    ⚠️  SOME TESTS NEED ATTENTION              ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════════╝${NC}"
    fi
}

# Check dependencies
check_dependencies() {
    local missing=0

    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required${NC}"
        missing=1
    fi

    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required${NC}"
        missing=1
    fi

    if ! command -v bc &> /dev/null; then
        echo -e "${YELLOW}Warning: bc not found, some calculations may be limited${NC}"
    fi

    if [ ${missing} -eq 1 ]; then
        exit 1
    fi
}

# Run checks and main execution
check_dependencies
main "$@"
