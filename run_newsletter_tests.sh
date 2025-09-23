#!/bin/bash
#
# Newsletter Testing Runner Script
#
# This script provides an easy way to run all newsletter tests for the Aclue platform.
# It supports different testing modes and environments.
#
# Usage:
#     ./run_newsletter_tests.sh [mode] [backend_url]
#     
# Modes:
#     api     - Run API tests only (default)
#     e2e     - Run end-to-end browser tests  
#     all     - Run all tests
#     quick   - Run quick API health check
#
# Examples:
#     ./run_newsletter_tests.sh api
#     ./run_newsletter_tests.sh e2e
#     ./run_newsletter_tests.sh all
#     ./run_newsletter_tests.sh quick https://aclue-backend-production.up.railway.app
#

# Set default values
MODE=${1:-api}
BACKEND_URL=${2:-https://aclue-backend-production.up.railway.app}
FRONTEND_URL=${3:-https://aclue.app}

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_header() {
    echo -e "${BLUE}========================================${NC}"
    echo -e "${BLUE} $1${NC}"
    echo -e "${BLUE}========================================${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Python 3 is available
check_python() {
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is not installed or not in PATH"
        exit 1
    fi
    print_success "Python 3 found: $(python3 --version)"
}

# Install Python dependencies if needed
install_dependencies() {
    print_header "Installing Dependencies"
    
    # Check if requests is available
    if ! python3 -c "import requests" &> /dev/null; then
        echo "Installing requests library..."
        pip3 install requests
    fi
    
    if [ "$MODE" = "e2e" ] || [ "$MODE" = "all" ]; then
        # Check if playwright is available
        if ! python3 -c "import playwright" &> /dev/null; then
            echo "Installing Playwright..."
            pip3 install playwright pytest-playwright
            playwright install
        fi
    fi
    
    print_success "Dependencies ready"
}

# Run API tests
run_api_tests() {
    print_header "Running API Tests"
    echo "Backend URL: $BACKEND_URL"
    echo ""
    
    if [ -f "tests/newsletter_comprehensive_test_suite.py" ]; then
        python3 tests/newsletter_comprehensive_test_suite.py "$BACKEND_URL"
        return $?
    else
        print_error "API test suite not found: tests/newsletter_comprehensive_test_suite.py"
        return 1
    fi
}

# Run E2E tests
run_e2e_tests() {
    print_header "Running End-to-End Tests"
    echo "Frontend URL: $FRONTEND_URL"
    echo "Backend URL: $BACKEND_URL"
    echo ""
    
    if [ -f "tests/newsletter_e2e_tests.py" ]; then
        python3 tests/newsletter_e2e_tests.py
        return $?
    else
        print_error "E2E test suite not found: tests/newsletter_e2e_tests.py"
        return 1
    fi
}

# Run quick health check
run_quick_test() {
    print_header "Quick Newsletter API Health Check"
    echo "Testing: $BACKEND_URL"
    echo ""
    
    # Test health endpoint
    echo "🔍 Checking API health..."
    if curl -s -f "$BACKEND_URL/health" > /dev/null; then
        print_success "API is healthy"
    else
        print_error "API health check failed"
        return 1
    fi
    
    # Test newsletter signup endpoint
    echo "📧 Testing newsletter signup..."
    TIMESTAMP=$(date +%s)
    TEST_EMAIL="quicktest+$TIMESTAMP@example.com"
    
    RESPONSE=$(curl -s -X POST "$BACKEND_URL/api/v1/newsletter/signup" \
        -H "Content-Type: application/json" \
        -d "{\"email\":\"$TEST_EMAIL\",\"source\":\"quick_test\"}")
    
    if echo "$RESPONSE" | grep -q '"success":true'; then
        print_success "Newsletter signup working correctly"
        echo "Response: $RESPONSE"
    else
        print_error "Newsletter signup failed"
        echo "Response: $RESPONSE"
        return 1
    fi
    
    print_success "Quick test completed successfully"
    return 0
}

# Main execution
main() {
    print_header "Aclue Newsletter Testing Suite"
    echo "Mode: $MODE"
    echo "Backend: $BACKEND_URL"
    echo "Frontend: $FRONTEND_URL"
    echo ""
    
    # Check requirements
    check_python
    
    case $MODE in
        "api")
            install_dependencies
            run_api_tests
            ;;
        "e2e")
            install_dependencies
            run_e2e_tests
            ;;
        "all")
            install_dependencies
            echo ""
            run_api_tests
            API_RESULT=$?
            echo ""
            run_e2e_tests
            E2E_RESULT=$?
            
            print_header "Combined Test Results"
            if [ $API_RESULT -eq 0 ]; then
                print_success "API Tests: PASSED"
            else
                print_error "API Tests: FAILED"
            fi
            
            if [ $E2E_RESULT -eq 0 ]; then
                print_success "E2E Tests: PASSED"
            else
                print_error "E2E Tests: FAILED"
            fi
            
            if [ $API_RESULT -eq 0 ] && [ $E2E_RESULT -eq 0 ]; then
                print_success "All tests passed!"
                exit 0
            else
                print_error "Some tests failed"
                exit 1
            fi
            ;;
        "quick")
            run_quick_test
            ;;
        *)
            print_error "Unknown mode: $MODE"
            echo ""
            echo "Available modes:"
            echo "  api   - Run API tests only"
            echo "  e2e   - Run end-to-end browser tests"
            echo "  all   - Run all tests"
            echo "  quick - Run quick health check"
            exit 1
            ;;
    esac
    
    EXIT_CODE=$?
    echo ""
    
    if [ $EXIT_CODE -eq 0 ]; then
        print_success "Testing completed successfully!"
    else
        print_error "Testing completed with errors"
    fi
    
    exit $EXIT_CODE
}

# Run main function
main "$@"