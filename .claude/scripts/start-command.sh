#!/bin/bash

# aclue /start Slash Command Integration
# This script serves as the bridge between Claude Code slash commands and the main start.js implementation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
START_SCRIPT="$SCRIPT_DIR/start.js"

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

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
            ;;
    esac
}

# Function to check prerequisites
check_prerequisites() {
    log "INFO" "Checking prerequisites..."

    # Check if we're in the right directory
    if [[ ! "$PWD" =~ aclue-preprod ]]; then
        log "WARNING" "Not in aclue project directory. Current: $PWD"
    fi

    # Check Node.js
    if ! command -v node &> /dev/null; then
        log "ERROR" "Node.js not found. Please install Node.js 18+ first."
        exit 1
    fi

    local node_version=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [[ $node_version -lt 18 ]]; then
        log "ERROR" "Node.js version 18+ required. Found: $(node --version)"
        exit 1
    fi

    # Check if start.js exists
    if [[ ! -f "$START_SCRIPT" ]]; then
        log "ERROR" "Start script not found: $START_SCRIPT"
        exit 1
    fi

    log "SUCCESS" "Prerequisites check passed"
}

# Function to parse command line arguments
parse_arguments() {
    local args=()

    while [[ $# -gt 0 ]]; do
        case $1 in
            --help|-h)
                show_help
                exit 0
                ;;
            --quick|-q)
                args+=("--quick")
                shift
                ;;
            --verbose|-v)
                args+=("--verbose")
                shift
                ;;
            --skip-checks)
                args+=("--skip-checks")
                shift
                ;;
            --no-browser)
                args+=("--no-browser")
                shift
                ;;
            --backend-only)
                args+=("--backend-only")
                shift
                ;;
            --frontend-only)
                args+=("--frontend-only")
                shift
                ;;
            *)
                log "WARNING" "Unknown option: $1"
                shift
                ;;
        esac
    done

    echo "${args[@]}"
}

# Function to show help
show_help() {
    cat << EOF
${MAGENTA}aclue /start Command${NC}
Comprehensive development environment setup and launch

${CYAN}Usage:${NC}
    /start [options]

${CYAN}Options:${NC}
    -h, --help          Show this help message
    -q, --quick         Quick startup (skip dependency checks)
    -v, --verbose       Enable verbose logging
    --skip-checks       Skip environment validation checks
    --no-browser        Don't launch browser after startup
    --backend-only      Start only the backend service
    --frontend-only     Start only the frontend service

${CYAN}Examples:${NC}
    /start                          # Full startup with all services
    /start --quick --verbose        # Quick startup with detailed logging
    /start --backend-only           # Start only the backend API server
    /start --frontend-only          # Start only the frontend dev server
    /start --no-browser            # Start without opening browser

${CYAN}Services Started:${NC}
    • Backend API Server    (http://localhost:8000)
    • Frontend Dev Server   (http://localhost:3000)
    • API Documentation     (http://localhost:8000/docs)

${CYAN}Project Structure:${NC}
    • Backend:  $PROJECT_ROOT/backend
    • Frontend: $PROJECT_ROOT/web
    • Scripts:  $PROJECT_ROOT/.claude/scripts

${CYAN}Typical Startup Time:${NC}
    • Quick mode:     30-60 seconds
    • Full mode:      60-180 seconds
    • First run:      120-300 seconds (dependency installation)

${CYAN}Troubleshooting:${NC}
    • Port conflicts: The script will detect and offer to kill conflicting processes
    • Missing deps:   Dependencies are automatically installed on first run
    • Env files:      Environment files are created from templates if missing

${CYAN}Integration:${NC}
    • Integrates with existing backend/start.sh script
    • Uses MCP tools for enhanced functionality
    • Follows Quick Start Guide automation
    • Production deployment status checking

For more details, see: $PROJECT_ROOT/QUICK_START_GUIDE.md
EOF
}

# Function to setup signal handlers
setup_signal_handlers() {
    trap 'log "INFO" "Interrupt received. Cleaning up..."; kill_child_processes; exit 130' INT
    trap 'log "INFO" "Termination received. Cleaning up..."; kill_child_processes; exit 143' TERM
}

# Function to kill child processes
kill_child_processes() {
    local pids=$(jobs -p)
    if [[ -n "$pids" ]]; then
        log "INFO" "Terminating child processes..."
        echo "$pids" | xargs -r kill 2>/dev/null || true
        sleep 1
        echo "$pids" | xargs -r kill -9 2>/dev/null || true
    fi
}

# Function to validate project structure
validate_project_structure() {
    log "INFO" "Validating project structure..."

    local required_paths=(
        "$PROJECT_ROOT/backend"
        "$PROJECT_ROOT/web"
        "$PROJECT_ROOT/backend/requirements.txt"
        "$PROJECT_ROOT/web/package.json"
    )

    for path in "${required_paths[@]}"; do
        if [[ ! -e "$path" ]]; then
            log "ERROR" "Required path not found: $path"
            exit 1
        fi
    done

    log "SUCCESS" "Project structure validation passed"
}

# Main execution function
main() {
    # Setup
    setup_signal_handlers

    # Header
    log "TITLE" "🚀 aclue Development Environment Startup"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Parse arguments
    local node_args
    node_args=($(parse_arguments "$@"))

    # Perform checks
    check_prerequisites
    validate_project_structure

    # Change to project root for consistency
    cd "$PROJECT_ROOT"

    # Execute the main start script
    log "INFO" "Executing startup script with arguments: ${node_args[*]}"

    # Make start.js executable
    chmod +x "$START_SCRIPT"

    # Execute with node
    if node "$START_SCRIPT" "${node_args[@]}"; then
        log "SUCCESS" "Startup completed successfully"

        # Keep script alive to monitor processes
        log "INFO" "Monitoring services... (Press Ctrl+C to stop)"
        while true; do
            sleep 30
            # Could add periodic health checks here
        done
    else
        local exit_code=$?
        log "ERROR" "Startup failed with exit code: $exit_code"
        exit $exit_code
    fi
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
