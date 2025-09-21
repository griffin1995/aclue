#!/bin/bash

echo "🚦 Rate Limiting Test - Newsletter Signup"
echo "============================================"
echo "Testing: 5 requests per minute limit"
echo ""

BASE_URL="http://localhost:8000/api/v1/newsletter/signup"
TEST_EMAIL_BASE="rate-test"

# Function to test a single request
test_request() {
    local request_num=$1
    local email="${TEST_EMAIL_BASE}-${request_num}@aclue.app"

    echo "📨 Request $request_num: Testing with $email"

    response=$(curl -s -w "%{http_code}" -X POST "$BASE_URL" \
        -H "Content-Type: application/json" \
        -d "{\"email\": \"$email\", \"source\": \"rate_limit_test\", \"user_agent\": \"test-script\"}")

    http_code="${response: -3}"
    response_body="${response%???}"

    if [ "$http_code" = "200" ]; then
        echo "   ✅ Status: $http_code - Success"
    elif [ "$http_code" = "429" ]; then
        echo "   🚫 Status: $http_code - Rate Limited (Expected after 5 requests)"
    else
        echo "   ⚠️  Status: $http_code - Unexpected"
    fi

    echo "   📄 Response: $response_body"
    echo ""
}

# Test rapid fire requests (should hit rate limit)
echo "🔥 Testing Rapid Fire Requests..."
echo "Sending 8 requests rapidly to test rate limiting:"
echo ""

for i in {1..8}; do
    test_request $i
    # Small delay to avoid overwhelming the server
    sleep 0.1
done

echo "📊 RATE LIMITING TEST SUMMARY"
echo "============================="
echo "Expected behavior:"
echo "• First 5 requests: ✅ 200 OK"
echo "• Requests 6-8: 🚫 429 Too Many Requests"
echo ""
echo "If rate limiting is working correctly:"
echo "• You should see 429 status codes after the 5th request"
echo "• Rate limit resets after 1 minute"
echo ""
echo "⏰ Test completed. Rate limit will reset in 60 seconds."