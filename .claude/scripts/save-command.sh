#!/bin/bash

# aclue /save Slash Command Integration
# This script serves as the bridge between Claude Code slash commands and the main save.js implementation

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/../.." && pwd)"
SAVE_SCRIPT="$SCRIPT_DIR/save.js"

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

    # Check if save.js exists
    if [[ ! -f "$SAVE_SCRIPT" ]]; then
        log "ERROR" "Save script not found: $SAVE_SCRIPT"
        exit 1
    fi

    # Check git (optional but recommended)
    if ! command -v git &> /dev/null; then
        log "WARNING" "Git not found - git operations will be disabled"
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
            --force|-f)
                args+=("--force")
                shift
                ;;
            --verbose|-v)
                args+=("--verbose")
                shift
                ;;
            --commit)
                args+=("--commit")
                shift
                ;;
            --stash)
                args+=("--stash")
                shift
                ;;
            --clean)
                args+=("--clean")
                shift
                ;;
            --status-only)
                args+=("--status-only")
                shift
                ;;
            --dry-run)
                args+=("--dry-run")
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
${MAGENTA}aclue /save Command${NC}
Graceful development environment shutdown with state preservation

${CYAN}Usage:${NC}
    /save [options]

${CYAN}Options:${NC}
    -h, --help          Show this help message
    -q, --quick         Quick shutdown - skip comprehensive checks
    -f, --force         Force shutdown - kill all processes immediately
    -v, --verbose       Enable verbose logging and detailed output
    --commit            Auto-commit uncommitted changes before shutdown
    --stash             Stash uncommitted changes before shutdown
    --clean             Perform resource cleanup (temp files, caches)
    --status-only       Save session state without shutting down
    --dry-run           Show what would be done without executing

${CYAN}Examples:${NC}
    /save                           # Standard graceful shutdown
    /save --commit --clean          # Commit changes and clean up resources
    /save --quick --verbose         # Quick shutdown with detailed logging
    /save --force                   # Emergency force shutdown
    /save --stash --status-only     # Stash changes and save state only
    /save --dry-run                 # Preview what would be done

${CYAN}Shutdown Modes:${NC}
    • Standard: Graceful termination with SIGTERM → SIGKILL escalation
    • Quick: Skip comprehensive process checks and state validation
    • Force: Immediate termination with SIGKILL (emergency use only)

${CYAN}Git Operations:${NC}
    • --commit: Automatically commit all staged and modified files
    • --stash:  Stash uncommitted changes for later recovery
    • Both options preserve work and allow clean /start recovery

${CYAN}Resource Cleanup:${NC}
    • --clean: Remove temporary files, clear caches, archive logs
    • Supports both conservative and aggressive cleanup modes
    • Always preserves important project files and dependencies

${CYAN}State Preservation:${NC}
    • Session state: Current processes, git status, environment
    • Service status: Vercel and Railway deployment information
    • Recovery data: Enables intelligent /start command restoration

${CYAN}Typical Shutdown Time:${NC}
    • Standard mode:    15-30 seconds
    • Quick mode:       5-15 seconds  
    • Force mode:       < 5 seconds
    • Status only:      5-10 seconds

${CYAN}Integration:${NC}
    • Coordinates with /start command for session restoration
    • Uses MCP tools for enhanced deployment status capture
    • Preserves development environment state for seamless recovery
    • Compatible with existing error recovery and logging systems

${CYAN}Safety Features:${NC}
    • Graceful termination prevents data loss
    • Git operations include rollback capabilities
    • Emergency recovery for failed shutdowns
    • Comprehensive logging and diagnostic reporting

For more details, see: $PROJECT_ROOT/.claude/scripts/save.js
EOF
}

# Function to setup signal handlers
setup_signal_handlers() {
    trap 'log "INFO" "Interrupt received. Aborting save operation..."; kill_child_processes; exit 130' INT
    trap 'log "INFO" "Termination received. Aborting save operation..."; kill_child_processes; exit 143' TERM
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
        "$PROJECT_ROOT/.claude"
        "$PROJECT_ROOT/.claude/scripts"
    )

    # Check if this looks like the aclue project
    local aclue_indicators=(
        "$PROJECT_ROOT/web"
        "$PROJECT_ROOT/backend"
        "$PROJECT_ROOT/CLAUDE.md"
    )

    local found_indicators=0
    for path in "${aclue_indicators[@]}"; do
        if [[ -e "$path" ]]; then
            ((found_indicators++))
        fi
    done

    if [[ $found_indicators -lt 2 ]]; then
        log "WARNING" "This doesn't appear to be the aclue project directory"
        log "INFO" "Expected to find: web/, backend/, or CLAUDE.md"
        log "INFO" "Current directory: $PROJECT_ROOT"
    fi

    # Check required paths
    for path in "${required_paths[@]}"; do
        if [[ ! -e "$path" ]]; then
            log "ERROR" "Required path not found: $path"
            exit 1
        fi
    done

    log "SUCCESS" "Project structure validation passed"
}

# Function to check if development servers are running
check_running_processes() {
    log "INFO" "Checking for running aclue processes..."

    local found_processes=0

    # Check common development ports
    if command -v lsof &> /dev/null; then
        # Check port 3000 (frontend)
        if lsof -i :3000 &> /dev/null; then
            log "INFO" "Found process on port 3000 (likely frontend)"
            ((found_processes++))
        fi

        # Check port 8000 (backend)
        if lsof -i :8000 &> /dev/null; then
            log "INFO" "Found process on port 8000 (likely backend)"
            ((found_processes++))
        fi
    elif command -v netstat &> /dev/null; then
        # Fallback to netstat
        if netstat -tlnp 2>/dev/null | grep -q ":3000 "; then
            log "INFO" "Found process on port 3000 (likely frontend)"
            ((found_processes++))
        fi

        if netstat -tlnp 2>/dev/null | grep -q ":8000 "; then
            log "INFO" "Found process on port 8000 (likely backend)"
            ((found_processes++))
        fi
    fi

    # Check for specific process names
    if pgrep -f "npm.*dev" &> /dev/null; then
        log "INFO" "Found npm dev server process"
        ((found_processes++))
    fi

    if pgrep -f "uvicorn" &> /dev/null; then
        log "INFO" "Found uvicorn process"
        ((found_processes++))
    fi

    if [[ $found_processes -eq 0 ]]; then
        log "INFO" "No aclue development processes found running"
    else
        log "INFO" "Found $found_processes development process(es)"
    fi

    return $found_processes
}

# Function to confirm shutdown if processes are running
confirm_shutdown() {
    local process_count=$1
    
    if [[ $process_count -eq 0 ]]; then
        return 0
    fi

    # Skip confirmation in force mode or if running non-interactively
    if [[ "$*" =~ "--force" ]] || [[ ! -t 0 ]]; then
        return 0
    fi

    echo
    log "WARNING" "Found $process_count running development process(es)"
    echo -n "Proceed with shutdown? [y/N]: "
    read -r response

    case $response in
        [yY][eE][sS]|[yY])
            log "INFO" "User confirmed shutdown"
            return 0
            ;;
        *)
            log "INFO" "Shutdown cancelled by user"
            return 1
            ;;
    esac
}

# Function to perform pre-shutdown backup
create_pre_shutdown_backup() {
    if ! command -v git &> /dev/null; then
        return 0
    fi

    log "INFO" "Creating pre-shutdown backup..."

    # Check if we're in a git repository
    if ! git rev-parse --git-dir &> /dev/null; then
        log "INFO" "Not a git repository - skipping backup"
        return 0
    fi

    # Create a backup branch (non-destructive)
    local timestamp=$(date '+%Y%m%d-%H%M%S')
    local backup_branch="backup/pre-save-$timestamp"

    if git branch "$backup_branch" &> /dev/null; then
        log "SUCCESS" "Created backup branch: $backup_branch"
    else
        log "WARNING" "Could not create backup branch"
    fi
}

# Main execution function
main() {
    # Setup
    setup_signal_handlers

    # Header
    log "TITLE" "💾 aclue Development Environment Shutdown"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    # Parse arguments
    local node_args
    node_args=($(parse_arguments "$@"))

    # Perform checks
    check_prerequisites
    validate_project_structure

    # Check for running processes
    check_running_processes
    local process_count=$?

    # Confirm shutdown if processes are running
    if ! confirm_shutdown $process_count "${node_args[@]}"; then
        log "INFO" "Shutdown aborted"
        exit 0
    fi

    # Create pre-shutdown backup (if git is available)
    create_pre_shutdown_backup

    # Change to project root for consistency
    cd "$PROJECT_ROOT"

    # Show what we're going to do
    if [[ "${node_args[*]}" =~ "--dry-run" ]]; then
        log "INFO" "DRY RUN MODE - No actual shutdown will occur"
    elif [[ "${node_args[*]}" =~ "--status-only" ]]; then
        log "INFO" "STATUS ONLY MODE - Development environment will remain running"
    else
        log "INFO" "Initiating shutdown sequence..."
    fi

    # Execute the main save script
    log "INFO" "Executing save script with arguments: ${node_args[*]}"

    # Make save.js executable
    chmod +x "$SAVE_SCRIPT"

    # Execute with node, capturing exit code
    local exit_code=0
    if node "$SAVE_SCRIPT" "${node_args[@]}"; then
        if [[ "${node_args[*]}" =~ "--dry-run" ]]; then
            log "SUCCESS" "Dry run completed - no changes made"
        elif [[ "${node_args[*]}" =~ "--status-only" ]]; then
            log "SUCCESS" "Status captured - development environment still running"
        else
            log "SUCCESS" "Shutdown completed successfully"
            log "INFO" "Use '/start' to resume development"
        fi
    else
        exit_code=$?
        log "ERROR" "Save operation failed with exit code: $exit_code"
        
        if [[ $exit_code -ne 0 ]] && [[ ! "${node_args[*]}" =~ "--force" ]]; then
            log "WARNING" "Consider using '/save --force' for emergency shutdown"
        fi
    fi

    exit $exit_code
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi