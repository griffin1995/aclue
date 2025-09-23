#!/bin/bash

# API Testing Suite for Aclue
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
RESULTS_DIR="${SCRIPT_DIR}/api-results/${TIMESTAMP}"
BACKEND_URL="https://aclue-backend-production.up.railway.app"

mkdir -p "${RESULTS_DIR}"

echo "================================================================"
echo "                API TESTING SUITE"
echo "================================================================"
echo "Timestamp: ${TIMESTAMP}"
echo "Backend URL: ${BACKEND_URL}"
echo "Results: ${RESULTS_DIR}"
echo "================================================================"

# Test API endpoints
echo "[INFO] Testing API endpoints..."

# Health check
echo "[TEST] Health endpoint..."
curl -s -w "\n%{http_code}" "${BACKEND_URL}/health" > "${RESULTS_DIR}/health.txt" 2>&1

# API documentation
echo "[TEST] API documentation..."
curl -s -w "\n%{http_code}" "${BACKEND_URL}/docs" > "${RESULTS_DIR}/docs.html" 2>&1

# Test authentication endpoints
echo "[TEST] Authentication endpoints..."

# Test registration
echo '[TEST] Registration endpoint...'
curl -X POST "${BACKEND_URL}/api/v1/auth/register" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "test_'${TIMESTAMP}'@example.com",
        "password": "TestPassword123!",
        "full_name": "Test User"
    }' \
    -s -w "\n%{http_code}" > "${RESULTS_DIR}/register.json" 2>&1

# Test login
echo '[TEST] Login endpoint...'
curl -X POST "${BACKEND_URL}/api/v1/auth/login" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "john.doe@example.com",
        "password": "password123"
    }' \
    -s -w "\n%{http_code}" > "${RESULTS_DIR}/login.json" 2>&1

# Test products endpoint
echo "[TEST] Products endpoint..."
curl -s -w "\n%{http_code}" "${BACKEND_URL}/api/v1/products/" > "${RESULTS_DIR}/products.json" 2>&1

# Test recommendations endpoint (requires auth)
echo "[TEST] Recommendations endpoint..."
curl -s -w "\n%{http_code}" "${BACKEND_URL}/api/v1/recommendations/" > "${RESULTS_DIR}/recommendations.json" 2>&1

# Test newsletter subscription
echo "[TEST] Newsletter subscription..."
curl -X POST "${BACKEND_URL}/api/v1/newsletter/subscribe" \
    -H "Content-Type: application/json" \
    -d '{
        "email": "newsletter_'${TIMESTAMP}'@example.com"
    }' \
    -s -w "\n%{http_code}" > "${RESULTS_DIR}/newsletter.json" 2>&1

# Run Python API tests if available
if [ -d "${PROJECT_ROOT}/backend/tests" ]; then
    echo "[INFO] Running Python API tests..."
    cd "${PROJECT_ROOT}"

    # Create virtual environment if needed
    if [ ! -d "test-env" ]; then
        python3 -m venv test-env
    fi

    source test-env/bin/activate
    pip install pytest httpx fastapi --quiet 2>/dev/null || true

    python -m pytest backend/tests/ --tb=short > "${RESULTS_DIR}/pytest.log" 2>&1 || true
fi

# Generate API test report
echo "[INFO] Generating API test report..."

# Count successful responses
successful_tests=0
total_tests=0

for result_file in "${RESULTS_DIR}"/*.txt "${RESULTS_DIR}"/*.json; do
    if [ -f "$result_file" ]; then
        total_tests=$((total_tests + 1))
        # Check if response contains 200 or 201 status code
        if grep -q "20[0-1]" "$result_file" 2>/dev/null; then
            successful_tests=$((successful_tests + 1))
        fi
    fi
done

# Generate summary
cat > "${RESULTS_DIR}/summary.json" << EOF
{
    "timestamp": "${TIMESTAMP}",
    "backend_url": "${BACKEND_URL}",
    "total_endpoints_tested": ${total_tests},
    "successful_responses": ${successful_tests},
    "endpoints_tested": [
        "/health",
        "/docs",
        "/api/v1/auth/register",
        "/api/v1/auth/login",
        "/api/v1/products/",
        "/api/v1/recommendations/",
        "/api/v1/newsletter/subscribe"
    ],
    "results_directory": "${RESULTS_DIR}"
}
EOF

echo "================================================================"
echo "API testing completed!"
echo "Total endpoints tested: ${total_tests}"
echo "Successful responses: ${successful_tests}"
echo "Results saved to: ${RESULTS_DIR}"
echo "================================================================"