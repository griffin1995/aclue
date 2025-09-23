#!/bin/bash

# ================================================================
# ACLUE TESTING AUTOMATION SETUP SCRIPT
# ================================================================
# Initializes and configures the complete testing infrastructure
# Sets up all dependencies, tools, and configurations required
# for running the automated testing suite
# ================================================================

set -euo pipefail

# Script metadata
readonly SCRIPT_VERSION="1.0.0"
readonly SCRIPT_NAME="Aclue Testing Automation Setup"
readonly SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
readonly PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
readonly TIMESTAMP="$(date +%Y%m%d_%H%M%S)"

# Configuration directories
readonly CONFIG_DIR="${SCRIPT_DIR}/config"
readonly TOOLS_DIR="${SCRIPT_DIR}/tools"
readonly LOGS_DIR="${SCRIPT_DIR}/logs/setup"

# Colors
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly CYAN='\033[0;36m'
readonly WHITE='\033[1;37m'
readonly NC='\033[0m'
readonly BOLD='\033[1m'

# Setup tracking
declare -A SETUP_STATUS=()
TOTAL_STEPS=0
COMPLETED_STEPS=0
FAILED_STEPS=0

# ================================================================
# UTILITY FUNCTIONS
# ================================================================

log() {
    local level="$1"
    shift
    local message="$*"
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')

    case "$level" in
        "INFO")     echo -e "${CYAN}[${timestamp}] [INFO]${NC} $message" ;;
        "WARN")     echo -e "${YELLOW}[${timestamp}] [WARN]${NC} $message" ;;
        "ERROR")    echo -e "${RED}[${timestamp}] [ERROR]${NC} $message" ;;
        "SUCCESS")  echo -e "${GREEN}[${timestamp}] [SUCCESS]${NC} $message" ;;
        "STEP")     echo -e "${BLUE}[${timestamp}] [STEP]${NC} $message" ;;
        *) echo -e "${WHITE}[${timestamp}]${NC} $message" ;;
    esac

    # Log to file
    mkdir -p "$LOGS_DIR"
    echo "[${timestamp}] [$level] $message" >> "${LOGS_DIR}/setup-${TIMESTAMP}.log"
}

print_banner() {
    echo -e "${BOLD}${BLUE}"
    echo "================================================================"
    echo "           ACLUE TESTING AUTOMATION SETUP"
    echo "================================================================"
    echo -e "Version: ${SCRIPT_VERSION}"
    echo -e "Project Root: ${PROJECT_ROOT}"
    echo -e "Setup Timestamp: ${TIMESTAMP}"
    echo "================================================================"
    echo -e "${NC}"
}

run_step() {
    local step_name="$1"
    local step_function="$2"

    ((TOTAL_STEPS++))
    log "STEP" "Starting: $step_name"

    if $step_function; then
        SETUP_STATUS["$step_name"]="SUCCESS"
        ((COMPLETED_STEPS++))
        log "SUCCESS" "Completed: $step_name"
        return 0
    else
        SETUP_STATUS["$step_name"]="FAILED"
        ((FAILED_STEPS++))
        log "ERROR" "Failed: $step_name"
        return 1
    fi
}

# ================================================================
# SYSTEM REQUIREMENTS CHECK
# ================================================================

check_system_requirements() {
    log "INFO" "Checking system requirements..."

    # Check OS
    if [[ "$(uname)" != "Linux" ]]; then
        log "WARN" "This script is optimized for Linux systems"
    fi

    # Check required commands
    local required_commands=(
        "curl:HTTP client for API testing"
        "git:Version control"
        "jq:JSON processing"
        "python3:Python runtime"
        "node:Node.js runtime"
        "npm:Node package manager"
        "pip:Python package manager"
        "docker:Container runtime (optional)"
    )

    local missing_commands=()

    for cmd_desc in "${required_commands[@]}"; do
        IFS=':' read -r cmd desc <<< "$cmd_desc"
        if ! command -v "$cmd" &> /dev/null; then
            missing_commands+=("$cmd ($desc)")
            log "ERROR" "Missing required command: $cmd - $desc"
        else
            local version=$(command "$cmd" --version 2>/dev/null | head -n1 || echo "Unknown")
            log "SUCCESS" "Found $cmd: $version"
        fi
    done

    if [[ ${#missing_commands[@]} -gt 0 ]]; then
        log "ERROR" "Missing required commands. Please install:"
        for cmd in "${missing_commands[@]}"; do
            log "ERROR" "  - $cmd"
        done
        return 1
    fi

    # Check disk space (require at least 2GB)
    local available_space=$(df "$PROJECT_ROOT" | awk 'NR==2{print $4}')
    local required_space=2097152  # 2GB in KB

    if [[ $available_space -lt $required_space ]]; then
        log "WARN" "Low disk space: $(( available_space / 1024 ))MB available, 2GB recommended"
    else
        log "SUCCESS" "Sufficient disk space available: $(( available_space / 1024 ))MB"
    fi

    return 0
}

# ================================================================
# DIRECTORY STRUCTURE SETUP
# ================================================================

setup_directory_structure() {
    log "INFO" "Setting up directory structure..."

    local directories=(
        "${CONFIG_DIR}"
        "${CONFIG_DIR}/environments"
        "${CONFIG_DIR}/tools"
        "${CONFIG_DIR}/secrets"
        "${TOOLS_DIR}"
        "${TOOLS_DIR}/cache"
        "${SCRIPT_DIR}/results"
        "${SCRIPT_DIR}/artifacts"
        "${SCRIPT_DIR}/reports"
        "${LOGS_DIR}"
    )

    for dir in "${directories[@]}"; do
        if mkdir -p "$dir"; then
            log "SUCCESS" "Created directory: $dir"
        else
            log "ERROR" "Failed to create directory: $dir"
            return 1
        fi
    done

    # Set appropriate permissions
    chmod 700 "${CONFIG_DIR}/secrets" 2>/dev/null || true
    chmod 755 "${SCRIPT_DIR}/results" 2>/dev/null || true

    return 0
}

# ================================================================
# CONFIGURATION FILES SETUP
# ================================================================

create_environment_configs() {
    log "INFO" "Creating environment configuration files..."

    # Development environment config
    cat > "${CONFIG_DIR}/environments/development.env" << EOF
# Aclue Testing - Development Environment
ENVIRONMENT=development
DEBUG=true

# URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
DATABASE_URL=postgresql://localhost:5432/aclue_dev

# Testing Configuration
TEST_TIMEOUT=1800
MAX_PARALLEL_JOBS=2
ENABLE_VERBOSE_LOGGING=true
ENABLE_PERFORMANCE_MONITORING=true

# Security Configuration
ENABLE_SECURITY_SCANS=true
SKIP_SLOW_SECURITY_TESTS=false

# Notification Configuration
SLACK_WEBHOOK=
EMAIL_NOTIFICATIONS=false
EOF

    # Production environment config
    cat > "${CONFIG_DIR}/environments/production.env" << EOF
# Aclue Testing - Production Environment
ENVIRONMENT=production
DEBUG=false

# URLs
FRONTEND_URL=https://aclue.app
BACKEND_URL=https://aclue-backend-production.up.railway.app
DATABASE_URL=

# Testing Configuration
TEST_TIMEOUT=3600
MAX_PARALLEL_JOBS=4
ENABLE_VERBOSE_LOGGING=false
ENABLE_PERFORMANCE_MONITORING=true

# Security Configuration
ENABLE_SECURITY_SCANS=true
SKIP_SLOW_SECURITY_TESTS=false

# Notification Configuration
SLACK_WEBHOOK=
EMAIL_NOTIFICATIONS=true
EOF

    # CI/CD environment config
    cat > "${CONFIG_DIR}/environments/ci.env" << EOF
# Aclue Testing - CI/CD Environment
ENVIRONMENT=ci
DEBUG=false

# URLs (will be overridden by CI variables)
FRONTEND_URL=https://aclue.app
BACKEND_URL=https://aclue-backend-production.up.railway.app

# Testing Configuration
TEST_TIMEOUT=1800
MAX_PARALLEL_JOBS=4
ENABLE_VERBOSE_LOGGING=false
ENABLE_PERFORMANCE_MONITORING=false

# Security Configuration
ENABLE_SECURITY_SCANS=true
SKIP_SLOW_SECURITY_TESTS=true

# Notification Configuration
SLACK_WEBHOOK=
EMAIL_NOTIFICATIONS=false
EOF

    log "SUCCESS" "Environment configuration files created"
    return 0
}

create_tool_configs() {
    log "INFO" "Creating tool configuration files..."

    # Security tools configuration
    cat > "${CONFIG_DIR}/tools/security.json" << 'EOF'
{
    "bandit": {
        "enabled": true,
        "config_file": ".bandit",
        "severity_level": "medium",
        "confidence_level": "medium",
        "exclude_paths": ["*/tests/*", "*/test_*", "*/venv/*", "*/__pycache__/*"]
    },
    "safety": {
        "enabled": true,
        "check_dependencies": true,
        "ignore_ids": []
    },
    "gitleaks": {
        "enabled": true,
        "config_file": ".gitleaks.toml",
        "scan_history": false
    },
    "semgrep": {
        "enabled": false,
        "rules": ["auto"],
        "exclude_paths": ["*/node_modules/*", "*/venv/*"]
    }
}
EOF

    # Performance tools configuration
    cat > "${CONFIG_DIR}/tools/performance.json" << 'EOF'
{
    "lighthouse": {
        "enabled": true,
        "chrome_flags": ["--headless", "--no-sandbox"],
        "throttling": "simulated3G",
        "form_factor": "desktop"
    },
    "artillery": {
        "enabled": true,
        "arrival_rate": 10,
        "duration": 60,
        "target": "https://aclue-backend-production.up.railway.app"
    },
    "wrk": {
        "enabled": false,
        "threads": 4,
        "connections": 100,
        "duration": "30s"
    }
}
EOF

    # Code quality tools configuration
    cat > "${CONFIG_DIR}/tools/code-quality.json" << 'EOF'
{
    "eslint": {
        "enabled": true,
        "config_file": ".eslintrc.json",
        "extensions": [".js", ".jsx", ".ts", ".tsx"]
    },
    "prettier": {
        "enabled": true,
        "config_file": ".prettierrc"
    },
    "pylint": {
        "enabled": true,
        "rcfile": ".pylintrc",
        "min_rating": 8.0
    },
    "mypy": {
        "enabled": true,
        "config_file": "mypy.ini",
        "strict": true
    },
    "sonarqube": {
        "enabled": false,
        "server_url": "",
        "project_key": "aclue"
    }
}
EOF

    log "SUCCESS" "Tool configuration files created"
    return 0
}

# ================================================================
# DEPENDENCY INSTALLATION
# ================================================================

install_python_dependencies() {
    log "INFO" "Installing Python dependencies for testing tools..."

    # Create virtual environment for testing tools
    local venv_dir="${TOOLS_DIR}/python-venv"

    if ! python3 -m venv "$venv_dir"; then
        log "ERROR" "Failed to create Python virtual environment"
        return 1
    fi

    # Activate virtual environment
    source "$venv_dir/bin/activate"

    # Install testing dependencies
    local python_packages=(
        "bandit[toml]>=1.7.0"
        "safety>=2.0.0"
        "pip-audit>=2.0.0"
        "pytest>=7.0.0"
        "requests>=2.28.0"
        "urllib3>=1.26.0"
        "psutil>=5.9.0"
        "pyyaml>=6.0"
        "jinja2>=3.0.0"
    )

    for package in "${python_packages[@]}"; do
        if pip install "$package"; then
            log "SUCCESS" "Installed Python package: $package"
        else
            log "WARN" "Failed to install Python package: $package"
        fi
    done

    # Create activation script
    cat > "${TOOLS_DIR}/activate-python-env.sh" << EOF
#!/bin/bash
# Activate Python testing environment
source "${venv_dir}/bin/activate"
echo "Python testing environment activated"
EOF

    chmod +x "${TOOLS_DIR}/activate-python-env.sh"

    deactivate
    log "SUCCESS" "Python dependencies installed"
    return 0
}

install_node_dependencies() {
    log "INFO" "Installing Node.js dependencies for testing tools..."

    # Create package.json for testing tools
    cat > "${TOOLS_DIR}/package.json" << 'EOF'
{
    "name": "aclue-testing-tools",
    "version": "1.0.0",
    "description": "Testing tools and dependencies for Aclue platform",
    "private": true,
    "dependencies": {
        "@lighthouse-ci/cli": "^0.12.0",
        "lighthouse": "^10.0.0",
        "artillery": "^2.0.0",
        "eslint": "^8.0.0",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        "eslint-plugin-security": "^1.7.0",
        "prettier": "^3.0.0",
        "jest": "^29.0.0",
        "puppeteer": "^21.0.0",
        "playwright": "^1.40.0"
    },
    "devDependencies": {
        "npm-check-updates": "^16.0.0"
    },
    "scripts": {
        "audit": "npm audit --audit-level=moderate",
        "update-check": "ncu",
        "lighthouse": "lighthouse",
        "artillery": "artillery"
    }
}
EOF

    # Install Node.js dependencies
    cd "${TOOLS_DIR}"
    if npm install --silent; then
        log "SUCCESS" "Node.js dependencies installed"
    else
        log "ERROR" "Failed to install Node.js dependencies"
        return 1
    fi

    cd "$PROJECT_ROOT"
    return 0
}

install_system_tools() {
    log "INFO" "Installing additional system tools..."

    # Check if running as root or with sudo access
    if [[ $EUID -eq 0 ]] || sudo -n true 2>/dev/null; then
        local has_sudo=true
    else
        local has_sudo=false
        log "WARN" "No sudo access - skipping system tool installation"
    fi

    if [[ "$has_sudo" == "true" ]]; then
        # Install gitleaks
        if ! command -v gitleaks &> /dev/null; then
            log "INFO" "Installing gitleaks..."
            local gitleaks_url="https://github.com/zricethezav/gitleaks/releases/latest/download/gitleaks_*_linux_x64.tar.gz"
            local temp_dir=$(mktemp -d)

            if curl -L -o "$temp_dir/gitleaks.tar.gz" "$gitleaks_url" && \
               tar -xzf "$temp_dir/gitleaks.tar.gz" -C "$temp_dir" && \
               sudo mv "$temp_dir/gitleaks" /usr/local/bin/; then
                log "SUCCESS" "Gitleaks installed"
            else
                log "WARN" "Failed to install gitleaks"
            fi

            rm -rf "$temp_dir"
        fi

        # Install additional security tools
        local apt_packages=(
            "nmap"
            "nikto"
            "sqlmap"
            "postgresql-client"
        )

        for package in "${apt_packages[@]}"; do
            if ! command -v "$package" &> /dev/null; then
                log "INFO" "Installing $package..."
                if sudo apt-get update && sudo apt-get install -y "$package"; then
                    log "SUCCESS" "Installed $package"
                else
                    log "WARN" "Failed to install $package"
                fi
            fi
        done
    fi

    return 0
}

# ================================================================
# SCRIPT PERMISSIONS AND LINKS
# ================================================================

setup_script_permissions() {
    log "INFO" "Setting up script permissions and executable flags..."

    # Find all shell scripts and make them executable
    local scripts=(
        "${SCRIPT_DIR}/run-all-automated-tests.sh"
        "${SCRIPT_DIR}/quick-scan.sh"
        "${SCRIPT_DIR}/health-check.sh"
        "${SCRIPT_DIR}/setup-automation.sh"
    )

    # Add category scripts
    for category_dir in "${SCRIPT_DIR}"/{security,frontend,api,performance,code-quality,database,infrastructure}; do
        if [[ -d "$category_dir" ]]; then
            while IFS= read -r -d '' script; do
                scripts+=("$script")
            done < <(find "$category_dir" -name "*.sh" -type f -print0)
        fi
    done

    for script in "${scripts[@]}"; do
        if [[ -f "$script" ]]; then
            if chmod +x "$script"; then
                log "SUCCESS" "Made executable: $script"
            else
                log "WARN" "Failed to make executable: $script"
            fi
        fi
    done

    return 0
}

create_convenience_links() {
    log "INFO" "Creating convenience scripts and aliases..."

    # Create main runner script
    cat > "${PROJECT_ROOT}/run-tests.sh" << EOF
#!/bin/bash
# Convenience script to run Aclue testing suite
cd "\$(dirname "\$0")"
exec tests-22-sept/automated/run-all-automated-tests.sh "\$@"
EOF

    chmod +x "${PROJECT_ROOT}/run-tests.sh"

    # Create quick scan script
    cat > "${PROJECT_ROOT}/quick-scan.sh" << EOF
#!/bin/bash
# Convenience script for quick security scan
cd "\$(dirname "\$0")"
exec tests-22-sept/automated/quick-scan.sh "\$@"
EOF

    chmod +x "${PROJECT_ROOT}/quick-scan.sh"

    # Create health check script
    cat > "${PROJECT_ROOT}/health-check.sh" << EOF
#!/bin/bash
# Convenience script for system health check
cd "\$(dirname "\$0")"
exec tests-22-sept/automated/health-check.sh "\$@"
EOF

    chmod +x "${PROJECT_ROOT}/health-check.sh"

    log "SUCCESS" "Convenience scripts created in project root"
    return 0
}

# ================================================================
# VALIDATION AND TESTING
# ================================================================

validate_setup() {
    log "INFO" "Validating setup and testing basic functionality..."

    # Test master script
    if [[ -x "${SCRIPT_DIR}/run-all-automated-tests.sh" ]]; then
        if "${SCRIPT_DIR}/run-all-automated-tests.sh" --help >/dev/null 2>&1; then
            log "SUCCESS" "Master script validation passed"
        else
            log "ERROR" "Master script validation failed"
            return 1
        fi
    else
        log "ERROR" "Master script not executable"
        return 1
    fi

    # Test quick scan
    if [[ -x "${SCRIPT_DIR}/quick-scan.sh" ]]; then
        log "SUCCESS" "Quick scan script ready"
    else
        log "ERROR" "Quick scan script not executable"
    fi

    # Test health check
    if [[ -x "${SCRIPT_DIR}/health-check.sh" ]]; then
        log "SUCCESS" "Health check script ready"
    else
        log "ERROR" "Health check script not executable"
    fi

    # Test Python environment
    if [[ -f "${TOOLS_DIR}/activate-python-env.sh" ]]; then
        if source "${TOOLS_DIR}/activate-python-env.sh" && python -c "import bandit, safety" 2>/dev/null; then
            log "SUCCESS" "Python testing environment validated"
        else
            log "WARN" "Python testing environment has issues"
        fi
    fi

    # Test Node.js environment
    if [[ -f "${TOOLS_DIR}/package.json" ]] && [[ -d "${TOOLS_DIR}/node_modules" ]]; then
        if cd "${TOOLS_DIR}" && npm list --depth=0 >/dev/null 2>&1; then
            log "SUCCESS" "Node.js testing environment validated"
        else
            log "WARN" "Node.js testing environment has issues"
        fi
        cd "$PROJECT_ROOT"
    fi

    return 0
}

# ================================================================
# MAIN SETUP EXECUTION
# ================================================================

main() {
    local start_time=$(date +%s)

    print_banner

    # Define setup steps
    local setup_steps=(
        "System Requirements Check:check_system_requirements"
        "Directory Structure Setup:setup_directory_structure"
        "Environment Configs:create_environment_configs"
        "Tool Configs:create_tool_configs"
        "Python Dependencies:install_python_dependencies"
        "Node.js Dependencies:install_node_dependencies"
        "System Tools:install_system_tools"
        "Script Permissions:setup_script_permissions"
        "Convenience Links:create_convenience_links"
        "Validation:validate_setup"
    )

    # Execute setup steps
    local continue_on_failure=true

    for step in "${setup_steps[@]}"; do
        IFS=':' read -r step_name step_function <<< "$step"

        if ! run_step "$step_name" "$step_function"; then
            if [[ "$continue_on_failure" == "false" ]]; then
                log "ERROR" "Setup failed at step: $step_name"
                break
            else
                log "WARN" "Step failed but continuing: $step_name"
            fi
        fi
    done

    local end_time=$(date +%s)
    local total_duration=$((end_time - start_time))

    # Print setup summary
    echo
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo -e "${BOLD}${BLUE}                    SETUP SUMMARY${NC}"
    echo -e "${BOLD}${BLUE}================================================================${NC}"
    echo
    echo -e "📊 ${BOLD}Setup Statistics:${NC}"
    echo -e "   Total Steps: ${TOTAL_STEPS}"
    echo -e "   Completed: ${GREEN}${COMPLETED_STEPS}${NC}"
    echo -e "   Failed: ${RED}${FAILED_STEPS}${NC}"
    echo -e "   Duration: ${total_duration}s"
    echo

    echo -e "📋 ${BOLD}Step Results:${NC}"
    for step in "${!SETUP_STATUS[@]}"; do
        local status="${SETUP_STATUS[$step]}"
        local color="${GREEN}"
        [[ "$status" == "FAILED" ]] && color="${RED}"

        printf "   %-30s: %b%s%b\n" "$step" "$color" "$status" "$NC"
    done

    echo
    echo -e "🚀 ${BOLD}Getting Started:${NC}"
    echo -e "   Run full test suite:  ./run-tests.sh --standard"
    echo -e "   Run quick scan:       ./quick-scan.sh"
    echo -e "   Run health check:     ./health-check.sh"
    echo -e "   View help:            ./run-tests.sh --help"
    echo

    echo -e "📁 ${BOLD}Important Locations:${NC}"
    echo -e "   Configuration:        ${CONFIG_DIR}"
    echo -e "   Tools:                ${TOOLS_DIR}"
    echo -e "   Logs:                 ${LOGS_DIR}"
    echo -e "   Main Script:          ${SCRIPT_DIR}/run-all-automated-tests.sh"

    echo
    echo -e "${BOLD}${BLUE}================================================================${NC}"

    log "INFO" "Setup completed in ${total_duration}s"

    # Exit with appropriate code
    if [[ $FAILED_STEPS -eq 0 ]]; then
        log "SUCCESS" "Setup completed successfully!"
        exit 0
    elif [[ $COMPLETED_STEPS -gt $((TOTAL_STEPS / 2)) ]]; then
        log "WARN" "Setup completed with some failures"
        exit 0
    else
        log "ERROR" "Setup failed - too many failures"
        exit 1
    fi
}

# Check if script is being run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi