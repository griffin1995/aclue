#!/bin/bash

# aclue Test Execution Script
#
# Comprehensive test runner for local development and CI/CD environments.
# Supports running different test suites with proper environment setup
# and cleanup procedures.
#
# Usage:
#   ./scripts/run-tests.sh [test-type] [options]
#
# Test Types:
#   unit        - Run unit tests only
#   integration - Run integration tests only
#   e2e         - Run end-to-end tests only
#   performance - Run performance tests only
#   security    - Run security tests only
#   all         - Run all tests (default)
#
# Options:
#   --backend-only    - Run backend tests only
#   --frontend-only   - Run frontend tests only
#   --coverage        - Generate coverage reports
#   --watch          - Run tests in watch mode
#   --verbose        - Verbose output
#   --help           - Show this help message

set -e  # Exit on any error

# ==============================================================================
# CONFIGURATION AND SETUP
# ==============================================================================

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$PROJECT_ROOT/backend"
FRONTEND_DIR="$PROJECT_ROOT/web"

# Default values
TEST_TYPE="all"
BACKEND_ONLY=false
FRONTEND_ONLY=false
COVERAGE=false
WATCH=false
VERBOSE=false
SHOW_HELP=false

# Test configuration
PYTHON_VERSION="3.11"
NODE_VERSION="18.20.8"
POSTGRES_PORT=5433  # Use different port to avoid conflicts
REDIS_PORT=6380     # Use different port to avoid conflicts

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# ==============================================================================
# UTILITY FUNCTIONS
# ==============================================================================

print_header() {
    echo -e "${CYAN}================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}================================${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
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

print_step() {
    echo -e "${PURPLE}🔄 $1${NC}"
}

show_help() {
    cat << EOF
aclue Test Runner

Usage: $0 [test-type] [options]

Test Types:
    unit          Run unit tests only
    integration   Run integration tests only
    e2e           Run end-to-end tests only
    performance   Run performance tests only
    security      Run security tests only
    all           Run all tests (default)

Options:
    --backend-only     Run backend tests only
    --frontend-only    Run frontend tests only
    --coverage         Generate coverage reports
    --watch           Run tests in watch mode
    --verbose         Verbose output
    --help            Show this help message

Examples:
    $0                           # Run all tests
    $0 unit --coverage           # Run unit tests with coverage
    $0 e2e --backend-only        # Run backend E2E tests only
    $0 all --verbose             # Run all tests with verbose output

EOF
}

# ==============================================================================
# ARGUMENT PARSING
# ==============================================================================

while [[ $# -gt 0 ]]; do
    case $1 in
        unit|integration|e2e|performance|security|all)
            TEST_TYPE="$1"
            shift
            ;;
        --backend-only)
            BACKEND_ONLY=true
            shift
            ;;
        --frontend-only)
            FRONTEND_ONLY=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --watch)
            WATCH=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --help)
            SHOW_HELP=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

if [ "$SHOW_HELP" = true ]; then
    show_help
    exit 0
fi

# ==============================================================================
# ENVIRONMENT SETUP
# ==============================================================================

setup_environment() {
    print_header "Setting Up Test Environment"
    
    # Create test logs directory
    mkdir -p "$PROJECT_ROOT/test-logs"
    
    # Check for required tools
    print_step "Checking required tools..."
    
    if ! command -v python3 &> /dev/null; then
        print_error "Python 3 is required but not installed"
        exit 1
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "Node.js is required but not installed"
        exit 1
    fi
    
    if ! command -v docker &> /dev/null; then
        print_warning "Docker not found - some tests may not run properly"
    fi
    
    print_success "Environment check completed"
}

setup_test_databases() {
    print_step "Setting up test databases..."
    
    # Check if Docker is available
    if command -v docker &> /dev/null; then
        # Start PostgreSQL test container
        if ! docker ps | grep -q postgres-test; then
            docker run --name postgres-test \
                -e POSTGRES_PASSWORD=testpassword \
                -e POSTGRES_USER=testuser \
                -e POSTGRES_DB=aclue_test \
                -p $POSTGRES_PORT:5432 \
                -d postgres:15 || print_warning "Failed to start PostgreSQL container"
        fi
        
        # Start Redis test container
        if ! docker ps | grep -q redis-test; then
            docker run --name redis-test \
                -p $REDIS_PORT:6379 \
                -d redis:7-alpine || print_warning "Failed to start Redis container"
        fi
        
        # Wait for databases to be ready
        sleep 5
        print_success "Test databases started"
    else
        print_warning "Docker not available - using system databases"
    fi
}

cleanup_test_environment() {
    print_step "Cleaning up test environment..."
    
    if command -v docker &> /dev/null; then
        # Stop and remove test containers
        docker stop postgres-test redis-test 2>/dev/null || true
        docker rm postgres-test redis-test 2>/dev/null || true
    fi
    
    print_success "Test environment cleaned up"
}

# ==============================================================================
# BACKEND TESTING FUNCTIONS
# ==============================================================================

run_backend_tests() {
    if [ "$FRONTEND_ONLY" = true ]; then
        return 0
    fi
    
    print_header "Running Backend Tests"
    
    cd "$BACKEND_DIR"
    
    # Set up Python virtual environment
    if [ ! -d "venv" ]; then
        print_step "Creating Python virtual environment..."
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    
    # Install dependencies
    print_step "Installing Python dependencies..."
    pip install -r requirements.txt > /dev/null 2>&1
    pip install pytest-cov pytest-xdist pytest-mock pytest-html > /dev/null 2>&1
    
    # Set up test environment
    if [ ! -f ".env.test" ]; then
        cp .env.test.example .env.test
        print_info "Created .env.test from example file"
    fi
    
    # Build test command
    local pytest_cmd="pytest"
    local pytest_args=""
    
    # Add coverage options
    if [ "$COVERAGE" = true ]; then
        pytest_args="$pytest_args --cov=app --cov-report=html --cov-report=xml --cov-report=term"
    fi
    
    # Add verbose option
    if [ "$VERBOSE" = true ]; then
        pytest_args="$pytest_args -v"
    fi
    
    # Add HTML report
    pytest_args="$pytest_args --html=../test-logs/backend-report.html --self-contained-html"
    
    # Run specific test types
    case $TEST_TYPE in
        unit)
            print_step "Running backend unit tests..."
            $pytest_cmd tests/ -m "not integration and not e2e and not performance and not security" $pytest_args
            ;;
        integration)
            print_step "Running backend integration tests..."
            $pytest_cmd tests/ -m "integration" $pytest_args
            ;;
        performance)
            print_step "Running backend performance tests..."
            $pytest_cmd tests/ -m "performance" $pytest_args --benchmark-json=../test-logs/benchmark-results.json
            ;;
        security)
            print_step "Running backend security tests..."
            $pytest_cmd tests/ -m "security" $pytest_args
            ;;
        all)
            print_step "Running all backend tests..."
            $pytest_cmd tests/ $pytest_args
            ;;
    esac
    
    local backend_exit_code=$?
    
    # Run additional security checks
    if [ "$TEST_TYPE" = "security" ] || [ "$TEST_TYPE" = "all" ]; then
        print_step "Running security analysis..."
        
        # Bandit security linting
        if command -v bandit &> /dev/null; then
            bandit -r app/ -f json -o ../test-logs/bandit-report.json || true
            print_info "Bandit security report generated"
        fi
        
        # Safety check for known vulnerabilities
        if command -v safety &> /dev/null; then
            safety check --json --output ../test-logs/safety-report.json || true
            print_info "Safety vulnerability report generated"
        fi
    fi
    
    deactivate
    cd "$PROJECT_ROOT"
    
    if [ $backend_exit_code -eq 0 ]; then
        print_success "Backend tests completed successfully"
    else
        print_error "Backend tests failed"
        return $backend_exit_code
    fi
}

# ==============================================================================
# FRONTEND TESTING FUNCTIONS
# ==============================================================================

run_frontend_tests() {
    if [ "$BACKEND_ONLY" = true ]; then
        return 0
    fi
    
    print_header "Running Frontend Tests"
    
    cd "$FRONTEND_DIR"
    
    # Install dependencies
    print_step "Installing Node.js dependencies..."
    npm ci > /dev/null 2>&1
    
    # Set up test environment
    if [ ! -f ".env.test" ]; then
        cp .env.test.example .env.test
        print_info "Created .env.test from example file"
    fi
    
    # Run linting
    print_step "Running ESLint..."
    npm run lint || print_warning "Linting issues found"
    
    # Run type checking
    print_step "Running TypeScript type check..."
    npm run type-check || print_warning "Type check issues found"
    
    # Build test command
    local test_cmd=""
    local test_args=""
    
    if [ "$WATCH" = true ]; then
        test_args="$test_args --watchAll"
    else
        test_args="$test_args --watchAll=false"
    fi
    
    if [ "$COVERAGE" = true ]; then
        test_args="$test_args --coverage"
    fi
    
    if [ "$VERBOSE" = true ]; then
        test_args="$test_args --verbose"
    fi
    
    # Run specific test types
    case $TEST_TYPE in
        unit)
            print_step "Running frontend unit tests..."
            npm run test:unit -- $test_args
            ;;
        integration)
            print_step "Running frontend integration tests..."
            npm run test:integration -- $test_args
            ;;
        e2e)
            print_step "Running frontend E2E tests..."
            # Start backend server for E2E tests
            cd "$BACKEND_DIR"
            source venv/bin/activate
            python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &
            BACKEND_PID=$!
            deactivate
            cd "$FRONTEND_DIR"
            
            # Wait for backend to start
            sleep 10
            
            # Run Playwright tests
            if [ "$VERBOSE" = true ]; then
                npx playwright test --reporter=list
            else
                npx playwright test
            fi
            
            local e2e_exit_code=$?
            
            # Kill backend server
            kill $BACKEND_PID 2>/dev/null || true
            
            if [ $e2e_exit_code -ne 0 ]; then
                return $e2e_exit_code
            fi
            ;;
        all)
            print_step "Running all frontend tests..."
            npm run test -- $test_args
            ;;
    esac
    
    local frontend_exit_code=$?
    
    # Run security audit
    if [ "$TEST_TYPE" = "security" ] || [ "$TEST_TYPE" = "all" ]; then
        print_step "Running npm security audit..."
        npm audit --audit-level moderate > ../test-logs/npm-audit-report.txt || print_warning "Security vulnerabilities found"
    fi
    
    cd "$PROJECT_ROOT"
    
    if [ $frontend_exit_code -eq 0 ]; then
        print_success "Frontend tests completed successfully"
    else
        print_error "Frontend tests failed"
        return $frontend_exit_code
    fi
}

# ==============================================================================
# MAIN EXECUTION FLOW
# ==============================================================================

main() {
    print_header "aclue Test Runner"
    print_info "Test Type: $TEST_TYPE"
    print_info "Backend Only: $BACKEND_ONLY"
    print_info "Frontend Only: $FRONTEND_ONLY"
    print_info "Coverage: $COVERAGE"
    print_info "Watch Mode: $WATCH"
    print_info "Verbose: $VERBOSE"
    
    # Trap cleanup on exit
    trap cleanup_test_environment EXIT
    
    # Set up environment
    setup_environment
    
    # Start test databases
    if [ "$TEST_TYPE" = "integration" ] || [ "$TEST_TYPE" = "e2e" ] || [ "$TEST_TYPE" = "all" ]; then
        setup_test_databases
    fi
    
    # Run tests
    local overall_exit_code=0
    
    if [ "$TEST_TYPE" = "performance" ] && [ "$FRONTEND_ONLY" = false ]; then
        run_backend_tests
        overall_exit_code=$?
    elif [ "$TEST_TYPE" = "security" ]; then
        run_backend_tests
        local backend_result=$?
        
        if [ "$BACKEND_ONLY" = false ]; then
            run_frontend_tests
            local frontend_result=$?
            overall_exit_code=$((backend_result || frontend_result))
        else
            overall_exit_code=$backend_result
        fi
    else
        # Run backend tests
        if [ "$FRONTEND_ONLY" = false ]; then
            run_backend_tests
            local backend_result=$?
        else
            local backend_result=0
        fi
        
        # Run frontend tests
        if [ "$BACKEND_ONLY" = false ]; then
            run_frontend_tests
            local frontend_result=$?
        else
            local frontend_result=0
        fi
        
        overall_exit_code=$((backend_result || frontend_result))
    fi
    
    # Print final results
    print_header "Test Results Summary"
    
    if [ $overall_exit_code -eq 0 ]; then
        print_success "All tests passed! 🎉"
        
        # Display test artifacts location
        if [ -d "$PROJECT_ROOT/test-logs" ]; then
            print_info "Test reports available in: $PROJECT_ROOT/test-logs/"
            ls -la "$PROJECT_ROOT/test-logs/"
        fi
        
        # Display coverage information
        if [ "$COVERAGE" = true ]; then
            print_info "Coverage reports generated:"
            if [ -f "$BACKEND_DIR/htmlcov/index.html" ]; then
                print_info "  Backend: $BACKEND_DIR/htmlcov/index.html"
            fi
            if [ -f "$FRONTEND_DIR/coverage/lcov-report/index.html" ]; then
                print_info "  Frontend: $FRONTEND_DIR/coverage/lcov-report/index.html"
            fi
        fi
    else
        print_error "Some tests failed! Please review the output above."
    fi
    
    exit $overall_exit_code
}

# Run main function
main "$@"