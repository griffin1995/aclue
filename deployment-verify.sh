#!/bin/bash

# aclue Production Deployment Verification Script
# Validates that all deployment components are functioning correctly

set -e

# Colours for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BACKEND_URL="https://aclue-backend-production.up.railway.app"
FRONTEND_URL="https://aclue.app"
TIMEOUT=30

echo -e "${BLUE}🚀 aclue Production Deployment Verification${NC}"
echo "=================================================="
echo ""

# Function to check HTTP status
check_endpoint() {
    local url=$1
    local expected_status=${2:-200}
    local description=$3

    echo -n "Checking $description... "

    if response=$(curl -s -o /dev/null -w "%{http_code}" --max-time $TIMEOUT "$url"); then
        if [ "$response" -eq "$expected_status" ]; then
            echo -e "${GREEN}✓ OK (HTTP $response)${NC}"
            return 0
        else
            echo -e "${RED}✗ FAILED (HTTP $response, expected $expected_status)${NC}"
            return 1
        fi
    else
        echo -e "${RED}✗ FAILED (Connection error)${NC}"
        return 1
    fi
}

# Function to check API endpoint with content validation
check_api_endpoint() {
    local url=$1
    local description=$2
    local expected_content=$3

    echo -n "Checking $description... "

    if response=$(curl -s --max-time $TIMEOUT "$url"); then
        if [[ $response == *"$expected_content"* ]]; then
            echo -e "${GREEN}✓ OK${NC}"
            return 0
        else
            echo -e "${YELLOW}⚠ WARNING (Unexpected response)${NC}"
            echo "  Response: $response"
            return 1
        fi
    else
        echo -e "${RED}✗ FAILED (Connection error)${NC}"
        return 1
    fi
}

# Test counters
total_tests=0
passed_tests=0

# Backend Health Checks
echo -e "${BLUE}Backend Health Checks${NC}"
echo "---------------------"

((total_tests++))
if check_endpoint "$BACKEND_URL/health" 200 "Backend health endpoint"; then
    ((passed_tests++))
fi

((total_tests++))
if check_api_endpoint "$BACKEND_URL/api/v1/health" "API health endpoint" "status"; then
    ((passed_tests++))
fi

((total_tests++))
if check_endpoint "$BACKEND_URL/docs" 200 "API documentation"; then
    ((passed_tests++))
fi

echo ""

# Frontend Health Checks
echo -e "${BLUE}Frontend Health Checks${NC}"
echo "----------------------"

((total_tests++))
if check_endpoint "$FRONTEND_URL" 200 "Frontend homepage"; then
    ((passed_tests++))
fi

((total_tests++))
if check_endpoint "$FRONTEND_URL/landingpage" 200 "Landing page"; then
    ((passed_tests++))
fi

echo ""

# API Connectivity Tests
echo -e "${BLUE}API Connectivity Tests${NC}"
echo "----------------------"

# Test public endpoints
((total_tests++))
if check_endpoint "$BACKEND_URL/api/v1/products/" 401 "Products endpoint (authentication required)"; then
    ((passed_tests++))
fi

((total_tests++))
if check_endpoint "$BACKEND_URL/api/v1/categories/" 200 "Categories endpoint"; then
    ((passed_tests++))
fi

echo ""

# Security Headers Check
echo -e "${BLUE}Security Headers Check${NC}"
echo "----------------------"

echo -n "Checking HTTPS redirect... "
if curl -s -o /dev/null -w "%{redirect_url}" "http://aclue.app" | grep -q "https://"; then
    echo -e "${GREEN}✓ OK${NC}"
    ((passed_tests++))
else
    echo -e "${YELLOW}⚠ WARNING (No HTTPS redirect detected)${NC}"
fi
((total_tests++))

echo -n "Checking security headers... "
headers=$(curl -s -I "$FRONTEND_URL" | grep -E "(X-Frame-Options|X-Content-Type-Options|Strict-Transport-Security)")
if [[ $(echo "$headers" | wc -l) -ge 2 ]]; then
    echo -e "${GREEN}✓ OK${NC}"
    ((passed_tests++))
else
    echo -e "${YELLOW}⚠ WARNING (Some security headers missing)${NC}"
fi
((total_tests++))

echo ""

# Database Connectivity (via API)
echo -e "${BLUE}Database Connectivity${NC}"
echo "--------------------"

# Test authentication endpoint (which requires database)
echo -n "Testing authentication endpoint... "
auth_response=$(curl -s -X POST "$BACKEND_URL/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{"email":"invalid@test.com","password":"invalid"}' \
    -w "%{http_code}")

if [[ $auth_response == *"401"* ]] || [[ $auth_response == *"422"* ]]; then
    echo -e "${GREEN}✓ OK (Endpoint responding correctly)${NC}"
    ((passed_tests++))
else
    echo -e "${RED}✗ FAILED (Unexpected response)${NC}"
fi
((total_tests++))

echo ""

# Performance Checks
echo -e "${BLUE}Performance Checks${NC}"
echo "------------------"

echo -n "Checking frontend response time... "
frontend_time=$(curl -s -o /dev/null -w "%{time_total}" "$FRONTEND_URL")
# Use awk instead of bc for floating point comparison
if awk "BEGIN{exit !($frontend_time < 3.0)}"; then
    echo -e "${GREEN}✓ OK (${frontend_time}s)${NC}"
    ((passed_tests++))
else
    echo -e "${YELLOW}⚠ SLOW (${frontend_time}s)${NC}"
fi
((total_tests++))

echo -n "Checking backend response time... "
backend_time=$(curl -s -o /dev/null -w "%{time_total}" "$BACKEND_URL/health")
# Use awk instead of bc for floating point comparison
if awk "BEGIN{exit !($backend_time < 2.0)}"; then
    echo -e "${GREEN}✓ OK (${backend_time}s)${NC}"
    ((passed_tests++))
else
    echo -e "${YELLOW}⚠ SLOW (${backend_time}s)${NC}"
fi
((total_tests++))

echo ""

# Summary
echo -e "${BLUE}Verification Summary${NC}"
echo "===================="
echo "Total tests: $total_tests"
echo "Passed: $passed_tests"
echo "Failed: $((total_tests - passed_tests))"

if [ $passed_tests -eq $total_tests ]; then
    echo -e "${GREEN}🎉 All tests passed! Deployment is healthy.${NC}"
    exit 0
elif [ $passed_tests -gt $((total_tests * 3 / 4)) ]; then
    echo -e "${YELLOW}⚠ Most tests passed, but some issues detected.${NC}"
    exit 1
else
    echo -e "${RED}❌ Multiple critical issues detected. Manual investigation required.${NC}"
    exit 2
fi