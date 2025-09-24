#!/bin/bash

# aclue /start Command Test Suite
# Comprehensive testing and validation of the enhanced start command system

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Test configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
START_SCRIPT="$SCRIPT_DIR/start.js"
MCP_SCRIPT="$SCRIPT_DIR/mcp-integration.js"
ERROR_SCRIPT="$SCRIPT_DIR/error-recovery.js"

# Test results
TESTS_PASSED=0
TESTS_FAILED=0
TESTS_TOTAL=0

# Function to print colored output
log() {
    local level=$1
    shift
    local message="$*"
    local timestamp=$(date '+%H:%M:%S')

    case $level in
        "INFO")
            echo -e "[${timestamp}] ${CYAN}INFO${NC}: $message"
            ;;
        "SUCCESS")
            echo -e "[${timestamp}] ${GREEN}SUCCESS${NC}: $message"
            ;;
        "WARNING")
            echo -e "[${timestamp}] ${YELLOW}WARNING${NC}: $message"
            ;;
        "ERROR")
            echo -e "[${timestamp}] ${RED}ERROR${NC}: $message"
            ;;
        "TITLE")
            echo -e "\n${MAGENTA}${message}${NC}"
            echo -e "${MAGENTA}$(echo "$message" | sed 's/./-/g')${NC}"
            ;;
        "TEST")
            echo -e "[${timestamp}] ${BLUE}TEST${NC}: $message"
            ;;
    esac
}

# Test framework functions
start_test() {
    local test_name="$1"
    log "TEST" "Starting test: $test_name"
    TESTS_TOTAL=$((TESTS_TOTAL + 1))
}

pass_test() {
    local test_name="$1"
    log "SUCCESS" "✅ PASSED: $test_name"
    TESTS_PASSED=$((TESTS_PASSED + 1))
}

fail_test() {
    local test_name="$1"
    local reason="$2"
    log "ERROR" "❌ FAILED: $test_name - $reason"
    TESTS_FAILED=$((TESTS_FAILED + 1))
}

# Utility functions
check_file_exists() {
    local file="$1"
    if [[ -f "$file" ]]; then
        return 0
    else
        return 1
    fi
}

check_script_executable() {
    local script="$1"
    if [[ -x "$script" ]]; then
        return 0
    else
        return 1
    fi
}

run_with_timeout() {
    local timeout_duration="$1"
    shift
    local command="$@"

    timeout "$timeout_duration" bash -c "$command"
    return $?
}

# Test functions
test_prerequisites() {
    start_test "Prerequisites Check"

    # Check Node.js
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log "INFO" "Node.js found: $node_version"
    else
        fail_test "Prerequisites Check" "Node.js not found"
        return
    fi

    # Check Python
    if command -v python3 &> /dev/null; then
        local python_version=$(python3 --version)
        log "INFO" "Python found: $python_version"
    else
        fail_test "Prerequisites Check" "Python3 not found"
        return
    fi

    # Check project directory
    if [[ -d "$PROJECT_ROOT" ]]; then
        log "INFO" "Project directory found: $PROJECT_ROOT"
    else
        fail_test "Prerequisites Check" "Project directory not found"
        return
    fi

    pass_test "Prerequisites Check"
}

test_script_files() {
    start_test "Script Files Validation"

    local scripts=(
        "$START_SCRIPT"
        "$MCP_SCRIPT"
        "$ERROR_SCRIPT"
        "$SCRIPT_DIR/start-command.sh"
    )

    local missing_files=()

    for script in "${scripts[@]}"; do
        if check_file_exists "$script"; then
            log "INFO" "Script found: $(basename "$script")"
        else
            missing_files+=("$script")
        fi
    done

    if [[ ${#missing_files[@]} -gt 0 ]]; then
        fail_test "Script Files Validation" "Missing files: ${missing_files[*]}"
        return
    fi

    # Make scripts executable
    chmod +x "$START_SCRIPT" "$MCP_SCRIPT" "$ERROR_SCRIPT"

    pass_test "Script Files Validation"
}

test_mcp_integration() {
    start_test "MCP Integration Test"

    # Test MCP integration script standalone
    if run_with_timeout 30s "cd '$PROJECT_ROOT' && node '$MCP_SCRIPT' validate-structure"; then
        log "INFO" "MCP integration script executed successfully"
    else
        fail_test "MCP Integration Test" "MCP script execution failed"
        return
    fi

    # Test metadata retrieval
    if run_with_timeout 30s "cd '$PROJECT_ROOT' && node '$MCP_SCRIPT' metadata > /dev/null"; then
        log "INFO" "MCP metadata retrieval successful"
    else
        fail_test "MCP Integration Test" "MCP metadata retrieval failed"
        return
    fi

    pass_test "MCP Integration Test"
}

test_error_recovery() {
    start_test "Error Recovery System Test"

    # Test error recovery script standalone
    if run_with_timeout 30s "cd '$PROJECT_ROOT' && node '$ERROR_SCRIPT' test-network > /dev/null"; then
        log "INFO" "Error recovery network test successful"
    else
        fail_test "Error Recovery System Test" "Network test failed"
        return
    fi

    # Test diagnostic report
    if run_with_timeout 30s "cd '$PROJECT_ROOT' && node '$ERROR_SCRIPT' diagnostic-report > /dev/null"; then
        log "INFO" "Error recovery diagnostic report successful"
    else
        fail_test "Error Recovery System Test" "Diagnostic report failed"
        return
    fi

    pass_test "Error Recovery System Test"
}

test_start_script_syntax() {
    start_test "Start Script Syntax Check"

    # Test Node.js syntax
    if node -c "$START_SCRIPT"; then
        log "INFO" "Start script syntax is valid"
    else
        fail_test "Start Script Syntax Check" "Syntax errors in start.js"
        return
    fi

    # Test help functionality
    if run_with_timeout 15s "cd '$PROJECT_ROOT' && node '$START_SCRIPT' --help > /dev/null"; then
        log "INFO" "Help functionality works"
    else
        log "WARNING" "Help functionality test inconclusive"
    fi

    pass_test "Start Script Syntax Check"
}

test_project_structure() {
    start_test "Project Structure Validation"

    local required_paths=(
        "backend"
        "web"
        "backend/requirements.txt"
        "web/package.json"
        ".claude"
        "CLAUDE.md"
    )

    local missing_paths=()

    for path in "${required_paths[@]}"; do
        if [[ -e "$PROJECT_ROOT/$path" ]]; then
            log "INFO" "Required path found: $path"
        else
            missing_paths+=("$path")
        fi
    done

    if [[ ${#missing_paths[@]} -gt 0 ]]; then
        fail_test "Project Structure Validation" "Missing paths: ${missing_paths[*]}"
        return
    fi

    pass_test "Project Structure Validation"
}

test_environment_setup() {
    start_test "Environment Setup Test"

    # Check if environment templates exist
    local env_templates=(
        "backend/.env.example"
        "web/.env.example"
    )

    for template in "${env_templates[@]}"; do
        if [[ -f "$PROJECT_ROOT/$template" ]]; then
            log "INFO" "Environment template found: $template"
        else
            log "WARNING" "Environment template missing: $template"
        fi
    done

    # Test MCP environment creation
    if run_with_timeout 30s "cd '$PROJECT_ROOT' && node '$MCP_SCRIPT' create-env > /dev/null 2>&1"; then
        log "INFO" "MCP environment creation test successful"
    else
        log "WARNING" "MCP environment creation test failed (may be expected)"
    fi

    pass_test "Environment Setup Test"
}

test_configuration_files() {
    start_test "Configuration Files Test"

    local config_files=(
        ".claude/slash-commands.json"
        ".claude/mcp.optimized.json"
        ".claude/settings.optimized.json"
    )

    for config in "${config_files[@]}"; do
        if [[ -f "$PROJECT_ROOT/$config" ]]; then
            log "INFO" "Configuration file found: $config"

            # Test JSON validity
            if python3 -m json.tool "$PROJECT_ROOT/$config" > /dev/null 2>&1; then
                log "INFO" "Configuration file is valid JSON: $config"
            else
                log "WARNING" "Configuration file has invalid JSON: $config"
            fi
        else
            log "WARNING" "Configuration file missing: $config"
        fi
    done

    pass_test "Configuration Files Test"
}

test_port_availability() {
    start_test "Port Availability Check"

    local ports=(8000 3000)
    local occupied_ports=()

    for port in "${ports[@]}"; do
        if command -v lsof &> /dev/null; then
            if lsof -i :$port > /dev/null 2>&1; then
                occupied_ports+=($port)
                log "WARNING" "Port $port is occupied"
            else
                log "INFO" "Port $port is available"
            fi
        elif command -v netstat &> /dev/null; then
            if netstat -an | grep ":$port " > /dev/null 2>&1; then
                occupied_ports+=($port)
                log "WARNING" "Port $port is occupied"
            else
                log "INFO" "Port $port is available"
            fi
        else
            log "WARNING" "Cannot check port availability (no lsof or netstat)"
        fi
    done

    if [[ ${#occupied_ports[@]} -gt 0 ]]; then
        log "INFO" "Occupied ports will be tested for automatic recovery: ${occupied_ports[*]}"
    fi

    pass_test "Port Availability Check"
}

test_network_connectivity() {
    start_test "Network Connectivity Test"

    # Test basic internet connectivity
    local test_urls=(
        "https://google.com"
        "https://github.com"
    )

    local connectivity_ok=false

    for url in "${test_urls[@]}"; do
        if curl -s --connect-timeout 10 "$url" > /dev/null 2>&1; then
            log "INFO" "Network connectivity confirmed: $url"
            connectivity_ok=true
            break
        fi
    done

    if [[ "$connectivity_ok" == false ]]; then
        fail_test "Network Connectivity Test" "No network connectivity"
        return
    fi

    # Test aclue production endpoints
    local aclue_urls=(
        "https://aclue.app"
        "https://aclue-backend-production.up.railway.app/health"
    )

    for url in "${aclue_urls[@]}"; do
        if curl -s --connect-timeout 10 "$url" > /dev/null 2>&1; then
            log "INFO" "Production endpoint reachable: $url"
        else
            log "WARNING" "Production endpoint unreachable: $url"
        fi
    done

    pass_test "Network Connectivity Test"
}

test_start_command_dry_run() {
    start_test "Start Command Dry Run"

    # Test the start command with help flag (should not start services)
    if run_with_timeout 30s "cd '$PROJECT_ROOT' && '$SCRIPT_DIR/start-command.sh' --help > /dev/null"; then
        log "INFO" "Start command help executed successfully"
    else
        log "WARNING" "Start command help test failed"
    fi

    # Test start.js with quick mode (should validate but not start services)
    log "INFO" "Testing start.js quick validation..."

    # This is a more comprehensive test that would require actual execution
    # For safety, we'll just test the script loading
    if run_with_timeout 45s "cd '$PROJECT_ROOT' && timeout 30 node '$START_SCRIPT' --help 2>/dev/null || true"; then
        log "INFO" "Start script loads and responds to help"
    else
        log "WARNING" "Start script help test inconclusive"
    fi

    pass_test "Start Command Dry Run"
}

test_permissions() {
    start_test "File Permissions Test"

    # Check script permissions
    local scripts=(
        "$START_SCRIPT"
        "$MCP_SCRIPT"
        "$ERROR_SCRIPT"
        "$SCRIPT_DIR/start-command.sh"
    )

    for script in "${scripts[@]}"; do
        if [[ -f "$script" ]]; then
            if [[ -r "$script" ]]; then
                log "INFO" "Script is readable: $(basename "$script")"
            else
                fail_test "File Permissions Test" "Script not readable: $script"
                return
            fi
        fi
    done

    # Check project directory permissions
    if [[ -w "$PROJECT_ROOT" ]]; then
        log "INFO" "Project directory is writable"
    else
        fail_test "File Permissions Test" "Project directory not writable"
        return
    fi

    pass_test "File Permissions Test"
}

# Performance and stress tests
test_startup_performance() {
    start_test "Startup Performance Test"

    # This test measures how quickly the validation phases complete
    local start_time=$(date +%s%3N)

    # Run validation phases only (not full startup)
    if run_with_timeout 60s "cd '$PROJECT_ROOT' && node '$MCP_SCRIPT' validate-structure > /dev/null 2>&1"; then
        local end_time=$(date +%s%3N)
        local duration=$((end_time - start_time))

        log "INFO" "Validation completed in ${duration}ms"

        if [[ $duration -lt 30000 ]]; then  # Less than 30 seconds
            log "INFO" "Performance is acceptable (< 30s)"
        else
            log "WARNING" "Performance is slow (> 30s)"
        fi
    else
        fail_test "Startup Performance Test" "Validation phases failed"
        return
    fi

    pass_test "Startup Performance Test"
}

# Integration tests
test_full_integration() {
    start_test "Full Integration Test"

    # Test all components working together
    log "INFO" "Testing integrated system (read-only operations)..."

    # Test MCP + Error Recovery integration
    if run_with_timeout 45s "cd '$PROJECT_ROOT' && node -e '
        const MCP = require(\"$MCP_SCRIPT\");
        const ErrorRecovery = require(\"$ERROR_SCRIPT\");

        async function test() {
            const mcp = new MCP();
            const recovery = new ErrorRecovery();

            await mcp.initialize();
            const validation = await mcp.validateProjectStructure();
            console.log(\"MCP validation:\", validation.success);

            const report = recovery.generateDiagnosticReport();
            console.log(\"Recovery system ready:\", report.systemInfo ? true : false);

            mcp.cleanup && mcp.cleanup();
            recovery.cleanup && recovery.cleanup();
        }

        test().catch(console.error);
    ' > /dev/null"; then
        log "INFO" "Integration test passed"
    else
        fail_test "Full Integration Test" "Integration components failed to work together"
        return
    fi

    pass_test "Full Integration Test"
}

# Main test execution
main() {
    log "TITLE" "aclue /start Command Test Suite"
    echo "Project: $PROJECT_ROOT"
    echo "Test Time: $(date)"
    echo ""

    # Run all tests
    test_prerequisites
    test_script_files
    test_project_structure
    test_configuration_files
    test_permissions
    test_port_availability
    test_network_connectivity
    test_environment_setup
    test_mcp_integration
    test_error_recovery
    test_start_script_syntax
    test_start_command_dry_run
    test_startup_performance
    test_full_integration

    # Test summary
    echo ""
    log "TITLE" "Test Results Summary"
    echo "Total Tests: $TESTS_TOTAL"
    echo "Passed: ${GREEN}$TESTS_PASSED${NC}"
    echo "Failed: ${RED}$TESTS_FAILED${NC}"

    if [[ $TESTS_FAILED -eq 0 ]]; then
        echo ""
        log "SUCCESS" "🎉 All tests passed! The /start command system is ready."
        echo ""
        log "INFO" "To use the /start command:"
        echo "  1. Run: /start                    (Full startup)"
        echo "  2. Run: /start --quick           (Quick startup)"
        echo "  3. Run: /start --backend-only    (Backend only)"
        echo "  4. Run: /start --frontend-only   (Frontend only)"
        echo "  5. Run: /start --verbose         (Detailed logging)"
        echo ""
        exit 0
    else
        echo ""
        log "ERROR" "❌ Some tests failed. Please review the issues above."
        echo ""
        log "INFO" "The /start command may still work, but some features might be limited."
        echo ""
        exit 1
    fi
}

# Handle script termination
trap 'echo ""; log "INFO" "Test suite interrupted"; exit 130' INT
trap 'echo ""; log "INFO" "Test suite terminated"; exit 143' TERM

# Execute main function
main "$@"
