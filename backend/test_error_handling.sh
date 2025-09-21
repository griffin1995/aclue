#!/bin/bash

echo "🚨 Error Handling Test - Newsletter Signup"
echo "=========================================="
echo ""

BASE_URL="http://localhost:8000/api/v1/newsletter/signup"

# Function to test error scenarios
test_error_scenario() {
    local test_name="$1"
    local payload="$2"
    local expected_status="$3"

    echo "🧪 Test: $test_name"
    echo "   📤 Payload: $payload"

    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d "$payload")

    http_code="${response: -3}"
    response_body="${response%???}"

    echo "   📊 Status: $http_code"
    echo "   📄 Response: $response_body"

    if [ "$http_code" = "$expected_status" ]; then
        echo "   ✅ PASS - Expected status $expected_status"
    else
        echo "   ❌ FAIL - Expected $expected_status, got $http_code"
    fi
    echo ""
}

# Wait for rate limit to reset
echo "⏰ Waiting 5 seconds for any previous rate limits to clear..."
sleep 5
echo ""

# Test 1: Invalid email format
test_error_scenario \
    "Invalid Email Format" \
    '{"email": "invalid-email", "source": "error_test"}' \
    "422"

# Test 2: Missing email field
test_error_scenario \
    "Missing Email Field" \
    '{"source": "error_test"}' \
    "422"

# Test 3: Empty email
test_error_scenario \
    "Empty Email" \
    '{"email": "", "source": "error_test"}' \
    "422"

# Test 4: Invalid JSON
echo "🧪 Test: Invalid JSON Format"
echo "   📤 Payload: {invalid json}"

response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "{invalid json}")

http_code="${response: -3}"
response_body="${response%???}"

echo "   📊 Status: $http_code"
echo "   📄 Response: $response_body"

if [ "$http_code" = "422" ] || [ "$http_code" = "400" ]; then
    echo "   ✅ PASS - Expected 4xx error"
else
    echo "   ❌ FAIL - Expected 4xx error, got $http_code"
fi
echo ""

# Test 5: Duplicate email (should handle gracefully)
test_duplicate_email="duplicate-test@aclue.app"

echo "🧪 Test: Duplicate Email Handling"
echo "   📤 First signup with: $test_duplicate_email"

# First signup
response1=$(curl -s -w "%{http_code}" -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$test_duplicate_email\", \"source\": \"error_test\"}")

http_code1="${response1: -3}"
response_body1="${response1%???}"

echo "   📊 First signup status: $http_code1"
echo "   📄 First signup response: $response_body1"

# Second signup (duplicate)
sleep 1
echo "   📤 Second signup with same email: $test_duplicate_email"

response2=$(curl -s -w "%{http_code}" -X POST "$BASE_URL" \
    -H "Content-Type: application/json" \
    -d "{\"email\": \"$test_duplicate_email\", \"source\": \"error_test\"}")

http_code2="${response2: -3}"
response_body2="${response2%???}"

echo "   📊 Duplicate signup status: $http_code2"
echo "   📄 Duplicate signup response: $response_body2"

if [ "$http_code2" = "200" ] && echo "$response_body2" | grep -q "already_subscribed"; then
    echo "   ✅ PASS - Duplicate handled gracefully"
else
    echo "   ❌ FAIL - Duplicate not handled correctly"
fi
echo ""

# Test 6: Large email address
test_error_scenario \
    "Extremely Long Email" \
    "{\"email\": \"$(printf 'a%.0s' {1..300})@aclue.app\", \"source\": \"error_test\"}" \
    "422"

echo "📊 ERROR HANDLING TEST SUMMARY"
echo "=============================="
echo "✅ Tests completed for:"
echo "   • Invalid email format validation"
echo "   • Missing required fields"
echo "   • Empty email handling"
echo "   • Invalid JSON parsing"
echo "   • Duplicate email management"
echo "   • Input length validation"
echo ""
echo "All error scenarios should return appropriate HTTP status codes"
echo "and helpful error messages."