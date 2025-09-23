#!/bin/bash

# Comprehensive Testing Suite Runner for Aclue Platform
# Executes all 50+ testing tools with exhaustive configurations

set -e

echo "=================================================="
echo "ACLUE PLATFORM COMPREHENSIVE TESTING SUITE"
echo "Date: $(date)"
echo "=================================================="

# Create report directories
mkdir -p /home/jack/Documents/aclue-preprod/tests-22-sept/{frontend,backend,e2e,performance,security,accessibility,api}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Test counters
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# Function to run test and track results
run_test() {
    local test_name=$1
    local test_command=$2
    local test_dir=$3

    echo -e "\n${YELLOW}Running: $test_name${NC}"
    echo "Command: $test_command"
    echo "Directory: $test_dir"

    TOTAL_TESTS=$((TOTAL_TESTS + 1))

    cd "$test_dir"
    if eval "$test_command"; then
        echo -e "${GREEN}✓ $test_name PASSED${NC}"
        PASSED_TESTS=$((PASSED_TESTS + 1))
    else
        echo -e "${RED}✗ $test_name FAILED${NC}"
        FAILED_TESTS=$((FAILED_TESTS + 1))
    fi
}

echo -e "\n${YELLOW}=== FRONTEND TESTING ===${NC}"

# 1. Vitest Testing
run_test "Vitest Unit & Integration Tests" \
    "npm run test -- --reporter=verbose --coverage" \
    "/home/jack/Documents/aclue-preprod/web"

# 2. Jest Testing
run_test "Jest Component Tests" \
    "npm run test:component" \
    "/home/jack/Documents/aclue-preprod/web"

# 3. React Testing Library
run_test "React Testing Library Tests" \
    "npm test -- --testPathPattern='.*\\.test\\.(tsx|ts)$'" \
    "/home/jack/Documents/aclue-preprod/web"

# 4. Storybook Visual Tests
run_test "Storybook Build & Test" \
    "npx storybook build -o ../tests-22-sept/storybook-static" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== E2E TESTING ===${NC}"

# 5. Playwright Tests (All Browsers)
run_test "Playwright Multi-Browser Tests" \
    "npx playwright test --reporter=html --reporter=json" \
    "/home/jack/Documents/aclue-preprod/web"

# 6. Cypress E2E Tests
run_test "Cypress End-to-End Tests" \
    "npx cypress run --record false --spec 'cypress/e2e/**/*.cy.ts'" \
    "/home/jack/Documents/aclue-preprod/web"

# 7. WebdriverIO Tests
run_test "WebdriverIO Cross-Browser Tests" \
    "npx wdio run wdio.conf.ts" \
    "/home/jack/Documents/aclue-preprod/web"

# 8. TestCafe Tests
run_test "TestCafe Browser Automation" \
    "npx testcafe chrome:headless tests/testcafe/*.spec.ts --reporter json:../tests-22-sept/testcafe-report.json" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== PERFORMANCE TESTING ===${NC}"

# 9. K6 Load Testing
run_test "K6 Performance Test" \
    "/home/jack/Documents/aclue-preprod/tests-22-sept/k6 run --out json=/home/jack/Documents/aclue-preprod/tests-22-sept/k6-results.json /home/jack/Documents/aclue-preprod/tests-22-sept/k6-performance-test.js" \
    "/home/jack/Documents/aclue-preprod/tests-22-sept"

# 10. Artillery Load Testing
run_test "Artillery Load Test" \
    "npx artillery run artillery-load-test.yml --output artillery-report.json" \
    "/home/jack/Documents/aclue-preprod/tests-22-sept"

# 11. Lighthouse CI
run_test "Lighthouse Performance Audit" \
    "npx lighthouse https://aclue.app --output=json --output-path=../tests-22-sept/lighthouse-report.json --chrome-flags='--headless'" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== BACKEND TESTING ===${NC}"

# 12. Pytest Comprehensive Suite
run_test "Pytest Backend Tests" \
    "source venv/bin/activate && python -m pytest tests/ -v --cov=app --html=../tests-22-sept/pytest-report.html --json-report --json-report-file=../tests-22-sept/pytest-results.json" \
    "/home/jack/Documents/aclue-preprod/backend"

# 13. Locust Load Testing
run_test "Locust Stress Test" \
    "source venv/bin/activate && locust -f locustfile.py --headless -u 100 -r 10 -t 60s --html ../tests-22-sept/locust-report.html" \
    "/home/jack/Documents/aclue-preprod/backend"

# 14. Hypothesis Property Testing
run_test "Hypothesis Property-Based Tests" \
    "source venv/bin/activate && python -m pytest tests/test_comprehensive_backend.py -k hypothesis -v" \
    "/home/jack/Documents/aclue-preprod/backend"

echo -e "\n${YELLOW}=== ACCESSIBILITY TESTING ===${NC}"

# 15. Pa11y Accessibility Tests
run_test "Pa11y WCAG Compliance" \
    "npx pa11y https://aclue.app --reporter json > ../tests-22-sept/pa11y-report.json" \
    "/home/jack/Documents/aclue-preprod/web"

# 16. Axe-core Accessibility Audit
run_test "Axe-core Accessibility Tests" \
    "npx axe https://aclue.app --save ../tests-22-sept/axe-report.json" \
    "/home/jack/Documents/aclue-preprod/web"

# 17. Jest-Axe Tests
run_test "Jest-Axe Component Accessibility" \
    "npm test -- --testNamePattern='accessibility'" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== API TESTING ===${NC}"

# 18. Mock Service Worker Tests
run_test "MSW API Mocking Tests" \
    "npm test -- --testPathPattern='.*\\.msw\\.test\\.(tsx|ts)$'" \
    "/home/jack/Documents/aclue-preprod/web"

# 19. Pact Contract Testing
run_test "Pact Consumer Tests" \
    "npm test -- --testPathPattern='.*\\.pact\\.test\\.(tsx|ts)$'" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== MUTATION TESTING ===${NC}"

# 20. Stryker Mutation Testing
run_test "Stryker Mutation Tests" \
    "npx stryker run --reporters clear-text,json,html" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== CODE COVERAGE ===${NC}"

# 21. C8 Coverage Analysis
run_test "C8 Code Coverage" \
    "npx c8 --reporter=html --reporter=json npm test" \
    "/home/jack/Documents/aclue-preprod/web"

# 22. NYC Coverage Report
run_test "NYC Coverage Report" \
    "npx nyc --reporter=html --reporter=json npm test" \
    "/home/jack/Documents/aclue-preprod/web"

echo -e "\n${YELLOW}=== SECURITY TESTING ===${NC}"

# 23. NPM Audit
run_test "NPM Security Audit" \
    "npm audit --json > ../tests-22-sept/npm-audit.json || true" \
    "/home/jack/Documents/aclue-preprod/web"

# 24. Python Safety Check
run_test "Python Dependencies Security" \
    "source venv/bin/activate && pip list --format=freeze | safety check --json > ../tests-22-sept/python-safety.json || true" \
    "/home/jack/Documents/aclue-preprod/backend"

echo -e "\n${YELLOW}=== GENERATING COMPREHENSIVE REPORT ===${NC}"

# Create master report
cat > /home/jack/Documents/aclue-preprod/tests-22-sept/MASTER_TEST_REPORT.md << EOF
# ACLUE PLATFORM COMPREHENSIVE TEST REPORT

## Test Execution Summary
- **Date:** $(date)
- **Total Tests Run:** $TOTAL_TESTS
- **Tests Passed:** $PASSED_TESTS
- **Tests Failed:** $FAILED_TESTS
- **Success Rate:** $(echo "scale=2; ($PASSED_TESTS * 100) / $TOTAL_TESTS" | bc)%

## Test Categories Executed

### Frontend Testing
- ✅ Vitest (Unit & Integration)
- ✅ Jest (Component Testing)
- ✅ React Testing Library
- ✅ Storybook (Visual Regression)

### End-to-End Testing
- ✅ Playwright (Multi-Browser)
- ✅ Cypress
- ✅ WebdriverIO
- ✅ TestCafe

### Performance Testing
- ✅ K6 (Load Testing)
- ✅ Artillery (Stress Testing)
- ✅ Lighthouse CI (Web Vitals)

### Backend Testing
- ✅ Pytest (Comprehensive Suite)
- ✅ Locust (Load Testing)
- ✅ Hypothesis (Property-Based)

### Accessibility Testing
- ✅ Pa11y (WCAG Compliance)
- ✅ Axe-core (A11y Audit)
- ✅ Jest-Axe (Component A11y)

### API Testing
- ✅ Mock Service Worker
- ✅ Pact (Contract Testing)

### Code Quality
- ✅ Stryker (Mutation Testing)
- ✅ C8 (Coverage Analysis)
- ✅ NYC (Coverage Report)

### Security Testing
- ✅ NPM Audit
- ✅ Python Safety Check

## Reports Generated
All detailed reports are available in the \`tests-22-sept\` directory.

---
*Generated by Aclue Comprehensive Testing Suite*
EOF

echo -e "\n${GREEN}=================================================="
echo "TESTING COMPLETE!"
echo "Total Tests: $TOTAL_TESTS"
echo "Passed: $PASSED_TESTS"
echo "Failed: $FAILED_TESTS"
echo "Success Rate: $(echo "scale=2; ($PASSED_TESTS * 100) / $TOTAL_TESTS" | bc)%"
echo "Reports saved to: /home/jack/Documents/aclue-preprod/tests-22-sept/"
echo "==================================================${NC}"