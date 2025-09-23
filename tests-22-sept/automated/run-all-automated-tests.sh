#!/bin/bash

# ================================================================
# ACLUE MASTER TESTING ORCHESTRATION SCRIPT
# ================================================================
# Complete automation script for all 100+ testing tools
# Supports multiple execution modes and unified reporting
# Production-ready CI/CD integration
# ================================================================

set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_NAME="aclue Master Testing Orchestrator"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"
readonly RESULTS_DIR="${SCRIPT_DIR}/results/${TIMESTAMP}"

# Execution modes
declare -A EXECUTION_MODES=(
    ["quick"]="5-10 minute critical security and performance checks"
    ["standard"]="15-30 minute core testing suite"
    ["full"]="1-2 hour complete exhaustive testing"
    ["custom"]="User-defined testing categories"
    ["ci"]="Optimized CI/CD pipeline execution"
    ["health"]="System validation and health check"
)

# Testing categories and their master scripts
declare -A TEST_CATEGORIES=(
    ["security"]="${SCRIPT_DIR}/security/run-security-scan.sh"
    ["frontend"]="${SCRIPT_DIR}/frontend/run-frontend-audit.sh"
    ["api"]="${SCRIPT_DIR}/api/run_api_tests.sh"
    ["performance"]="${SCRIPT_DIR}/performance/run-all-performance-tests.sh"
    ["code-quality"]="${SCRIPT_DIR}/code-quality/master_quality_scan.sh"
    ["database"]="${SCRIPT_DIR}/database/master-security-scan.sh"
    ["infrastructure"]="${SCRIPT_DIR}/infrastructure/run-all-tools.sh"
)

# Execution mode configurations
declare -A QUICK_TESTS=(
    ["security"]="true"
    ["performance"]="true"
    ["api"]="false"
    ["frontend"]="false"
    ["code-quality"]="false"
    ["database"]="false"
    ["infrastructure"]="false"
)

declare -A STANDARD_TESTS=(
    ["security"]="true"
    ["performance"]="true"
    ["api"]="true"
    ["frontend"]="true"
    ["code-quality"]="true"
    ["database"]="false"
    ["infrastructure"]="false"
)

declare -A FULL_TESTS=(
    ["security"]="true"
    ["performance"]="true"
    ["api"]="true"
    ["frontend"]="true"
    ["code-quality"]="true"
    ["database"]="true"
    ["infrastructure"]="true"
)

# Colors and formatting
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly PURPLE='\033[0;35m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m' # No Color
readonly BOLD='\033[1m'

# Global variables
EXECUTION_MODE="standard"
PARALLEL_EXECUTION=true
MAX_PARALLEL_JOBS=4
TIMEOUT_DURATION=3600  # 1 hour default
ENABLE_NOTIFICATIONS=false
SLACK_WEBHOOK=""
EMAIL_RECIPIENTS=""
GENERATE_REPORTS=true
EXPORT_FORMATS=("html" "json")
CUSTOM_CATEGORIES=()
VERBOSE=false
DRY_RUN=false

# Statistics tracking
declare -A TEST_RESULTS=()
declare -A TEST_DURATIONS=()
declare -A TEST_OUTPUTS=()
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0
SKIPPED_TESTS=0
START_TIME=""
END_TIME=""

# ================================================================
# UTILITY FUNCTIONS
# ================================================================

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")  echo -e "${CYAN}[${timestamp}] [INFO]${NC} $message" ;;
        "WARN")  echo -e "${YELLOW}[${timestamp}] [WARN]${NC} $message" ;;
        "ERROR") echo -e "${RED}[${timestamp}] [ERROR]${NC} $message" ;;
        "SUCCESS") echo -e "${GREEN}[${timestamp}] [SUCCESS]${NC} $message" ;;
        "DEBUG") [[ "$VERBOSE" == "true" ]] && echo -e "${PURPLE}[${timestamp}] [DEBUG]${NC} $message" ;;
        *) echo -e "${WHITE}[${timestamp}]${NC} $message" ;;
    esac

    # Also log to file
    echo "[${timestamp}] [$level] $message" >> "${RESULTS_DIR}/execution.log"
}

print_banner() {
    echo -e "${BOLD}${BLUE}"
    echo "================================================================"
    echo "            ACLUE MASTER TESTING ORCHESTRATOR"
    echo "================================================================"
    echo -e "Version: ${SCRIPT_VERSION}"
    echo -e "Mode: ${EXECUTION_MODE}"
    echo -e "Timestamp: ${TIMESTAMP}"
    echo -e "Results Directory: ${RESULTS_DIR}"
    echo "================================================================"
    echo -e "${NC}"
}

print_usage() {
    cat << EOF
${BOLD}${SCRIPT_NAME} v${SCRIPT_VERSION}${NC}

USAGE:
    $(basename "$0") [OPTIONS]

EXECUTION MODES:
$(for mode in "${!EXECUTION_MODES[@]}"; do
    printf "    %-12s %s\n" "--${mode}" "${EXECUTION_MODES[$mode]}"
done)

OPTIONS:
    -m, --mode MODE          Execution mode (default: standard)
    -c, --categories LIST    Comma-separated test categories for custom mode
    -p, --parallel           Enable parallel execution (default: true)
    -j, --jobs N            Maximum parallel jobs (default: 4)
    -t, --timeout SECONDS   Timeout duration (default: 3600)
    -v, --verbose           Enable verbose output
    -n, --dry-run           Show what would be executed without running
    --no-reports            Disable report generation
    --formats FORMATS       Export formats: html,json,pdf,csv (default: html,json)
    --slack-webhook URL     Slack webhook for notifications
    --email ADDRESSES       Email addresses for notifications
    -h, --help              Show this help message

EXAMPLES:
    # Quick security and performance scan
    $(basename "$0") --quick

    # Standard testing suite
    $(basename "$0") --standard

    # Full comprehensive testing
    $(basename "$0") --full

    # Custom categories
    $(basename "$0") --custom --categories security,api,performance

    # CI/CD optimized execution
    $(basename "$0") --ci --no-reports --timeout 1800

    # Dry run to see execution plan
    $(basename "$0") --full --dry-run

TESTING CATEGORIES:
$(for category in "${!TEST_CATEGORIES[@]}"; do
    printf "    %-15s %s\n" "$category" "${TEST_CATEGORIES[$category]}"
done)
EOF
}

setup_directories() {
    log "INFO" "Setting up directory structure..."

    mkdir -p "${RESULTS_DIR}"/{reports,logs,artifacts,summaries}
    mkdir -p "${RESULTS_DIR}/category-results"

    for category in "${!TEST_CATEGORIES[@]}"; do
        mkdir -p "${RESULTS_DIR}/category-results/${category}"
    done

    log "SUCCESS" "Directory structure created: ${RESULTS_DIR}"
}

validate_environment() {
    log "INFO" "Validating environment and dependencies..."

    local required_tools=("jq" "curl" "git" "python3" "node" "npm")
    local missing_tools=()

    for tool in "${required_tools[@]}"; do
        if ! command -v "$tool" &> /dev/null; then
            missing_tools+=("$tool")
        fi
    done

    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log "ERROR" "Missing required tools: ${missing_tools[*]}"
        log "ERROR" "Please install missing dependencies before proceeding"
        return 1
    fi

    # Validate test scripts exist
    local missing_scripts=()
    for category in "${!TEST_CATEGORIES[@]}"; do
        local script_path="${TEST_CATEGORIES[$category]}"
        if [[ ! -f "$script_path" ]]; then
            missing_scripts+=("$category:$script_path")
        fi
    done

    if [[ ${#missing_scripts[@]} -gt 0 ]]; then
        log "WARN" "Missing test scripts:"
        for script in "${missing_scripts[@]}"; do
            log "WARN" "  - $script"
        done
    fi

    log "SUCCESS" "Environment validation completed"
    return 0
}

# ================================================================
# EXECUTION FUNCTIONS
# ================================================================

get_categories_for_mode() {
    local mode="$1"
    local categories=()

    case "$mode" in
        "quick")
            for category in "${!QUICK_TESTS[@]}"; do
                [[ "${QUICK_TESTS[$category]}" == "true" ]] && categories+=("$category")
            done
            ;;
        "standard")
            for category in "${!STANDARD_TESTS[@]}"; do
                [[ "${STANDARD_TESTS[$category]}" == "true" ]] && categories+=("$category")
            done
            ;;
        "full")
            for category in "${!FULL_TESTS[@]}"; do
                [[ "${FULL_TESTS[$category]}" == "true" ]] && categories+=("$category")
            done
            ;;
        "custom")
            categories=("${CUSTOM_CATEGORIES[@]}")
            ;;
        "ci")
            # CI mode uses standard tests but with optimizations
            for category in "${!STANDARD_TESTS[@]}"; do
                [[ "${STANDARD_TESTS[$category]}" == "true" ]] && categories+=("$category")
            done
            ;;
        "health")
            categories=("security" "api")
            ;;
        *)
            log "ERROR" "Unknown execution mode: $mode"
            return 1
            ;;
    esac

    echo "${categories[@]}"
}

run_test_category() {
    local category="$1"
    local script_path="${TEST_CATEGORIES[$category]}"
    local category_results_dir="${RESULTS_DIR}/category-results/${category}"
    local start_time=$(date +%s)

    log "INFO" "Starting $category testing..."

    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "[DRY RUN] Would execute: $script_path"
        TEST_RESULTS["$category"]="SKIPPED"
        TEST_DURATIONS["$category"]="0"
        return 0
    fi

    if [[ ! -f "$script_path" ]]; then
        log "ERROR" "Test script not found: $script_path"
        TEST_RESULTS["$category"]="FAILED"
        TEST_DURATIONS["$category"]="0"
        return 1
    fi

    # Make script executable
    chmod +x "$script_path"

    # Create category-specific log file
    local log_file="${category_results_dir}/${category}.log"
    local error_file="${category_results_dir}/${category}.error"

    # Execute the test with timeout
    local exit_code=0
    if timeout "$TIMEOUT_DURATION" bash "$script_path" > "$log_file" 2> "$error_file"; then
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        TEST_RESULTS["$category"]="PASSED"
        TEST_DURATIONS["$category"]="$duration"
        TEST_OUTPUTS["$category"]="$log_file"

        log "SUCCESS" "$category testing completed in ${duration}s"
        ((PASSED_TESTS++))
    else
        exit_code=$?
        local end_time=$(date +%s)
        local duration=$((end_time - start_time))

        if [[ $exit_code -eq 124 ]]; then
            TEST_RESULTS["$category"]="TIMEOUT"
            log "ERROR" "$category testing timed out after ${TIMEOUT_DURATION}s"
        else
            TEST_RESULTS["$category"]="FAILED"
            log "ERROR" "$category testing failed (exit code: $exit_code)"
        fi

        TEST_DURATIONS["$category"]="$duration"
        TEST_OUTPUTS["$category"]="$error_file"

        # Log error details
        if [[ -s "$error_file" ]]; then
            log "DEBUG" "Error output for $category:"
            while IFS= read -r line; do
                log "DEBUG" "  $line"
            done < "$error_file"
        fi

        ((FAILED_TESTS++))
        return 1
    fi
}

run_tests_sequential() {
    local categories=("$@")

    log "INFO" "Running tests sequentially..."

    for category in "${categories[@]}"; do
        ((TOTAL_TESTS++))
        run_test_category "$category"
    done
}

run_tests_parallel() {
    local categories=("$@")
    local pids=()
    local running_jobs=0

    log "INFO" "Running tests in parallel (max jobs: $MAX_PARALLEL_JOBS)..."

    for category in "${categories[@]}"; do
        ((TOTAL_TESTS++))

        # Wait if we've reached max parallel jobs
        while [[ $running_jobs -ge $MAX_PARALLEL_JOBS ]]; do
            sleep 1

            # Check for completed jobs
            for i in "${!pids[@]}"; do
                if ! kill -0 "${pids[i]}" 2>/dev/null; then
                    wait "${pids[i]}"
                    unset "pids[i]"
                    ((running_jobs--))
                fi
            done

            # Reindex array
            pids=("${pids[@]}")
        done

        # Start new job
        (run_test_category "$category") &
        pids+=($!)
        ((running_jobs++))

        log "DEBUG" "Started $category testing (PID: $!)"
    done

    # Wait for all remaining jobs
    log "INFO" "Waiting for all parallel jobs to complete..."
    for pid in "${pids[@]}"; do
        wait "$pid"
    done
}

# ================================================================
# REPORTING FUNCTIONS
# ================================================================

generate_summary_stats() {
    local total_duration=0

    for category in "${!TEST_DURATIONS[@]}"; do
        total_duration=$((total_duration + TEST_DURATIONS["$category"]))
    done

    cat > "${RESULTS_DIR}/summaries/execution-summary.json" << EOF
{
    "metadata": {
        "script_version": "${SCRIPT_VERSION}",
        "execution_mode": "${EXECUTION_MODE}",
        "timestamp": "${TIMESTAMP}",
        "start_time": "${START_TIME}",
        "end_time": "${END_TIME}",
        "total_duration": ${total_duration}
    },
    "statistics": {
        "total_tests": ${TOTAL_TESTS},
        "passed_tests": ${PASSED_TESTS},
        "failed_tests": ${FAILED_TESTS},
        "skipped_tests": ${SKIPPED_TESTS},
        "success_rate": $(( TOTAL_TESTS > 0 ? (PASSED_TESTS * 100) / TOTAL_TESTS : 0 ))
    },
    "categories": {
$(for category in "${!TEST_RESULTS[@]}"; do
    echo "        \"$category\": {"
    echo "            \"status\": \"${TEST_RESULTS[$category]}\","
    echo "            \"duration\": ${TEST_DURATIONS[$category]},"
    echo "            \"output_file\": \"${TEST_OUTPUTS[$category]:-""}\""
    echo "        },"
done | sed '$ s/,$//')
    }
}
EOF
}

generate_html_report() {
    local html_file="${RESULTS_DIR}/reports/test-report.html"

    cat > "$html_file" << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>aclue Testing Report</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f7fa; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { margin: 0; font-size: 2.5em; }
        .header .meta { opacity: 0.9; margin-top: 10px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; padding: 30px; }
        .stat-card { background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #007bff; }
        .stat-number { font-size: 2em; font-weight: bold; color: #333; }
        .stat-label { color: #666; text-transform: uppercase; font-size: 0.9em; }
        .categories { padding: 0 30px 30px; }
        .category { margin-bottom: 20px; border: 1px solid #e9ecef; border-radius: 8px; overflow: hidden; }
        .category-header { padding: 15px 20px; background: #f8f9fa; font-weight: bold; display: flex; justify-content: space-between; align-items: center; }
        .category-content { padding: 20px; }
        .status { padding: 4px 12px; border-radius: 4px; font-size: 0.85em; font-weight: bold; text-transform: uppercase; }
        .status.passed { background: #d4edda; color: #155724; }
        .status.failed { background: #f8d7da; color: #721c24; }
        .status.timeout { background: #fff3cd; color: #856404; }
        .status.skipped { background: #e2e3e5; color: #383d41; }
        .duration { color: #666; font-size: 0.9em; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>aclue Testing Report</h1>
            <div class="meta">
EOF

    # Add dynamic content
    echo "                Generated: $(date)" >> "$html_file"
    echo "                Mode: ${EXECUTION_MODE}" >> "$html_file"
    echo "                Version: ${SCRIPT_VERSION}" >> "$html_file"

    cat >> "$html_file" << EOF
            </div>
        </div>

        <div class="stats">
            <div class="stat-card">
                <div class="stat-number">${TOTAL_TESTS}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${PASSED_TESTS}</div>
                <div class="stat-label">Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">${FAILED_TESTS}</div>
                <div class="stat-label">Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number">$(( TOTAL_TESTS > 0 ? (PASSED_TESTS * 100) / TOTAL_TESTS : 0 ))%</div>
                <div class="stat-label">Success Rate</div>
            </div>
        </div>

        <div class="categories">
            <h2>Test Categories</h2>
EOF

    # Add category results
    for category in "${!TEST_RESULTS[@]}"; do
        local status="${TEST_RESULTS[$category]}"
        local duration="${TEST_DURATIONS[$category]}"
        local status_class=$(echo "$status" | tr '[:upper:]' '[:lower:]')

        cat >> "$html_file" << EOF
            <div class="category">
                <div class="category-header">
                    <span>${category}</span>
                    <div>
                        <span class="status ${status_class}">${status}</span>
                        <span class="duration">${duration}s</span>
                    </div>
                </div>
            </div>
EOF
    done

    cat >> "$html_file" << 'EOF'
        </div>
    </div>
</body>
</html>
EOF

    log "SUCCESS" "HTML report generated: $html_file"
}

generate_reports() {
    if [[ "$GENERATE_REPORTS" != "true" ]]; then
        log "INFO" "Report generation disabled"
        return 0
    fi

    log "INFO" "Generating reports..."

    generate_summary_stats

    for format in "${EXPORT_FORMATS[@]}"; do
        case "$format" in
            "html") generate_html_report ;;
            "json") cp "${RESULTS_DIR}/summaries/execution-summary.json" "${RESULTS_DIR}/reports/test-report.json" ;;
            *) log "WARN" "Unsupported report format: $format" ;;
        esac
    done

    log "SUCCESS" "Reports generated in: ${RESULTS_DIR}/reports/"
}

# ================================================================
# NOTIFICATION FUNCTIONS
# ================================================================

send_slack_notification() {
    [[ -z "$SLACK_WEBHOOK" ]] && return 0

    local success_rate=$(( TOTAL_TESTS > 0 ? (PASSED_TESTS * 100) / TOTAL_TESTS : 0 ))
    local color="good"
    [[ $success_rate -lt 80 ]] && color="warning"
    [[ $success_rate -lt 50 ]] && color="danger"

    local payload=$(cat << EOF
{
    "attachments": [
        {
            "color": "$color",
            "title": "aclue Testing Report - $EXECUTION_MODE Mode",
            "fields": [
                {"title": "Total Tests", "value": "$TOTAL_TESTS", "short": true},
                {"title": "Passed", "value": "$PASSED_TESTS", "short": true},
                {"title": "Failed", "value": "$FAILED_TESTS", "short": true},
                {"title": "Success Rate", "value": "${success_rate}%", "short": true}
            ],
            "footer": "aclue Testing Orchestrator",
            "ts": $(date +%s)
        }
    ]
}
EOF
    )

    if curl -X POST -H 'Content-type: application/json' --data "$payload" "$SLACK_WEBHOOK" &>/dev/null; then
        log "SUCCESS" "Slack notification sent"
    else
        log "WARN" "Failed to send Slack notification"
    fi
}

send_notifications() {
    [[ "$ENABLE_NOTIFICATIONS" != "true" ]] && return 0

    log "INFO" "Sending notifications..."
    send_slack_notification
}

# ================================================================
# MAIN EXECUTION FLOW
# ================================================================

cleanup() {
    log "INFO" "Cleaning up background processes..."
    jobs -p | xargs -r kill 2>/dev/null || true
}

main() {
    trap cleanup EXIT

    # Setup
    print_banner
    setup_directories
    validate_environment || exit 1

    START_TIME=$(date -Iseconds)

    # Get categories for execution mode
    local categories
    mapfile -t categories < <(get_categories_for_mode "$EXECUTION_MODE")

    if [[ ${#categories[@]} -eq 0 ]]; then
        log "ERROR" "No test categories selected for execution mode: $EXECUTION_MODE"
        exit 1
    fi

    log "INFO" "Execution plan:"
    log "INFO" "  Mode: $EXECUTION_MODE"
    log "INFO" "  Categories: ${categories[*]}"
    log "INFO" "  Parallel: $PARALLEL_EXECUTION"
    log "INFO" "  Max Jobs: $MAX_PARALLEL_JOBS"
    log "INFO" "  Timeout: ${TIMEOUT_DURATION}s"

    if [[ "$DRY_RUN" == "true" ]]; then
        log "INFO" "DRY RUN MODE - No tests will be executed"
    fi

    # Execute tests
    if [[ "$PARALLEL_EXECUTION" == "true" && ${#categories[@]} -gt 1 ]]; then
        run_tests_parallel "${categories[@]}"
    else
        run_tests_sequential "${categories[@]}"
    fi

    END_TIME=$(date -Iseconds)

    # Generate reports and send notifications
    generate_reports
    send_notifications

    # Final summary
    log "INFO" "Execution completed!"
    log "INFO" "Total: $TOTAL_TESTS, Passed: $PASSED_TESTS, Failed: $FAILED_TESTS"
    log "INFO" "Results available in: $RESULTS_DIR"

    # Exit with appropriate code
    [[ $FAILED_TESTS -eq 0 ]] && exit 0 || exit 1
}

# ================================================================
# ARGUMENT PARSING
# ================================================================

while [[ $# -gt 0 ]]; do
    case $1 in
        --quick)
            EXECUTION_MODE="quick"
            shift
            ;;
        --standard)
            EXECUTION_MODE="standard"
            shift
            ;;
        --full)
            EXECUTION_MODE="full"
            shift
            ;;
        --custom)
            EXECUTION_MODE="custom"
            shift
            ;;
        --ci)
            EXECUTION_MODE="ci"
            PARALLEL_EXECUTION=true
            GENERATE_REPORTS=false
            TIMEOUT_DURATION=1800
            shift
            ;;
        --health)
            EXECUTION_MODE="health"
            shift
            ;;
        -m|--mode)
            EXECUTION_MODE="$2"
            shift 2
            ;;
        -c|--categories)
            IFS=',' read -ra CUSTOM_CATEGORIES <<< "$2"
            shift 2
            ;;
        -p|--parallel)
            PARALLEL_EXECUTION=true
            shift
            ;;
        --no-parallel)
            PARALLEL_EXECUTION=false
            shift
            ;;
        -j|--jobs)
            MAX_PARALLEL_JOBS="$2"
            shift 2
            ;;
        -t|--timeout)
            TIMEOUT_DURATION="$2"
            shift 2
            ;;
        -v|--verbose)
            VERBOSE=true
            shift
            ;;
        -n|--dry-run)
            DRY_RUN=true
            shift
            ;;
        --no-reports)
            GENERATE_REPORTS=false
            shift
            ;;
        --formats)
            IFS=',' read -ra EXPORT_FORMATS <<< "$2"
            shift 2
            ;;
        --slack-webhook)
            SLACK_WEBHOOK="$2"
            ENABLE_NOTIFICATIONS=true
            shift 2
            ;;
        --email)
            EMAIL_RECIPIENTS="$2"
            ENABLE_NOTIFICATIONS=true
            shift 2
            ;;
        -h|--help)
            print_usage
            exit 0
            ;;
        *)
            log "ERROR" "Unknown option: $1"
            print_usage
            exit 1
            ;;
    esac
done

# Validate execution mode
if [[ ! "${EXECUTION_MODES[$EXECUTION_MODE]+exists}" ]]; then
    log "ERROR" "Invalid execution mode: $EXECUTION_MODE"
    log "INFO" "Available modes: ${!EXECUTION_MODES[*]}"
    exit 1
fi

# Validate custom categories
if [[ "$EXECUTION_MODE" == "custom" && ${#CUSTOM_CATEGORIES[@]} -eq 0 ]]; then
    log "ERROR" "Custom mode requires --categories option"
    exit 1
fi

# Execute main function
main "$@"