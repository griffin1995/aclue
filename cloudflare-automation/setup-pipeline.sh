#!/bin/bash

# GiftSync Deployment Pipeline Setup Script
# Quick setup for the complete deployment automation system

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

log() {
    local level="$1"
    shift
    local message="$*"
    
    case "$level" in
        "ERROR")   echo -e "${RED}❌ $message${NC}" ;;
        "SUCCESS") echo -e "${GREEN}✅ $message${NC}" ;;
        "WARNING") echo -e "${YELLOW}⚠️  $message${NC}" ;;
        "INFO")    echo -e "${BLUE}ℹ️  $message${NC}" ;;
        "STEP")    echo -e "${CYAN}➤ $message${NC}" ;;
        "HEADER")  echo -e "${PURPLE}━━━ $message ━━━${NC}" ;;
    esac
}

print_banner() {
    echo -e "${PURPLE}"
    echo "   ____  _  __ _   ____                  "
    echo "  / ___|(_)/ _| |_/ ___| _   _ _ __   ___ "
    echo " | |  _| | |_| __\___ \| | | | '_ \ / __|"
    echo " | |_| | |  _| |_ ___) | |_| | | | | (__ "
    echo "  \____|_|_|  \__|____/ \__, |_| |_|\___| "
    echo "                       |___/            "
    echo
    echo "     Deployment Pipeline Setup"
    echo -e "${NC}"
}

check_prerequisites() {
    log "HEADER" "CHECKING PREREQUISITES"
    
    local missing_tools=()
    
    # Check required tools
    command -v curl >/dev/null || missing_tools+=("curl")
    command -v jq >/dev/null || missing_tools+=("jq")
    command -v bc >/dev/null || missing_tools+=("bc")
    command -v openssl >/dev/null || missing_tools+=("openssl")
    command -v python3 >/dev/null || missing_tools+=("python3")
    command -v git >/dev/null || missing_tools+=("git")
    
    if [[ ${#missing_tools[@]} -gt 0 ]]; then
        log "ERROR" "Missing required tools: ${missing_tools[*]}"
        log "INFO" "Install with: sudo apt-get install ${missing_tools[*]}"
        exit 1
    fi
    
    # Check for yq
    if ! command -v yq >/dev/null; then
        log "WARNING" "yq not found, installing..."
        sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
        sudo chmod +x /usr/local/bin/yq
        log "SUCCESS" "yq installed successfully"
    fi
    
    log "SUCCESS" "All prerequisites satisfied"
}

setup_permissions() {
    log "HEADER" "SETTING UP PERMISSIONS"
    
    # Make all scripts executable
    local scripts=(
        "deploy-with-cache-purge.sh"
        "rollback-manager.sh"
        "config-manager.sh"
        "security-headers.sh"
        "purge-cache.sh"
        "monitor-domains.sh"
        "check-status.sh"
        "dns-backup.sh"
        "scripts/health-check.sh"
    )
    
    for script in "${scripts[@]}"; do
        if [[ -f "$SCRIPT_DIR/$script" ]]; then
            chmod +x "$SCRIPT_DIR/$script"
            log "SUCCESS" "$script permissions set"
        else
            log "WARNING" "$script not found, skipping"
        fi
    done
}

setup_credentials() {
    log "HEADER" "CREDENTIAL SETUP"
    
    if [[ -f "$HOME/.cloudflare-credentials" ]]; then
        log "INFO" "Credentials file already exists"
        read -p "Do you want to update it? (y/N): " -r update
        
        if [[ "$update" != "y" && "$update" != "Y" ]]; then
            return 0
        fi
    fi
    
    log "STEP" "Setting up Cloudflare credentials"
    "$SCRIPT_DIR/config-manager.sh" setup-credentials
}

validate_configuration() {
    log "HEADER" "VALIDATING CONFIGURATION"
    
    # Check if credentials are properly set
    if ! source "$SCRIPT_DIR/.env" 2>/dev/null; then
        log "ERROR" "Failed to source environment file at $SCRIPT_DIR/.env"
        return 1
    fi
    
    if [[ "${CLOUDFLARE_API_TOKEN:-YOUR_TOKEN_HERE}" == "YOUR_TOKEN_HERE" ]]; then
        log "ERROR" "Cloudflare API token not configured in $SCRIPT_DIR/.env"
        return 1
    fi
    
    # Validate each environment
    local environments=("development" "staging" "production")
    
    for env in "${environments[@]}"; do
        log "STEP" "Validating $env configuration"
        if "$SCRIPT_DIR/config-manager.sh" validate "$env"; then
            log "SUCCESS" "$env configuration valid"
        else
            log "WARNING" "$env configuration has issues"
        fi
    done
}

setup_github_actions() {
    log "HEADER" "GITHUB ACTIONS SETUP"
    
    local project_root="${PROJECT_ROOT:-/home/jack/Documents/gift_sync}"
    local github_workflows_dir="$project_root/.github/workflows"
    
    if [[ ! -d "$project_root" ]]; then
        log "ERROR" "Project root not found: $project_root"
        log "INFO" "Please set PROJECT_ROOT environment variable or update the path"
        return 1
    fi
    
    # Create .github/workflows directory
    mkdir -p "$github_workflows_dir"
    
    # Copy workflow file
    if [[ -f "$SCRIPT_DIR/.github/workflows/deployment-pipeline.yml" ]]; then
        cp "$SCRIPT_DIR/.github/workflows/deployment-pipeline.yml" "$github_workflows_dir/"
        log "SUCCESS" "GitHub Actions workflow copied to project"
    else
        log "WARNING" "Deployment pipeline workflow not found"
    fi
    
    log "INFO" "Don't forget to set up GitHub secrets:"
    cat << EOF
    - CLOUDFLARE_API_TOKEN
    - VERCEL_TOKEN
    - VERCEL_ORG_ID
    - VERCEL_PROJECT_ID
    - SLACK_WEBHOOK_URL
EOF
}

test_deployment_system() {
    log "HEADER" "TESTING DEPLOYMENT SYSTEM"
    
    # Test health checks
    log "STEP" "Testing health check system"
    if "$SCRIPT_DIR/scripts/health-check.sh" >/dev/null 2>&1; then
        log "SUCCESS" "Health checks working"
    else
        log "WARNING" "Health checks may have issues"
    fi
    
    # Test security configuration
    log "STEP" "Testing security configuration"
    if "$SCRIPT_DIR/security-headers.sh" verify >/dev/null 2>&1; then
        log "SUCCESS" "Security configuration verified"
    else
        log "WARNING" "Security configuration may need attention"
    fi
    
    # Test rollback manager
    log "STEP" "Testing rollback manager"
    if "$SCRIPT_DIR/rollback-manager.sh" status >/dev/null 2>&1; then
        log "SUCCESS" "Rollback manager working"
    else
        log "WARNING" "Rollback manager may have issues"
    fi
}

show_next_steps() {
    log "HEADER" "NEXT STEPS"
    
    echo "The deployment pipeline has been set up! Here's what you can do next:"
    echo
    echo "📋 Configuration:"
    echo "  • Review environment configurations: ./config-manager.sh list"
    echo "  • Update settings if needed: ./config-manager.sh show production"
    echo
    echo "🚀 Deployment:"
    echo "  • Deploy to staging: ./config-manager.sh deploy staging"
    echo "  • Deploy to production: ./config-manager.sh deploy production"
    echo "  • Cache purge only: ./deploy-with-cache-purge.sh --cache-only"
    echo
    echo "🔒 Security:"
    echo "  • Apply security headers: ./security-headers.sh"
    echo "  • Verify security: ./security-headers.sh verify"
    echo
    echo "📊 Monitoring:"
    echo "  • Health checks: ./scripts/health-check.sh"
    echo "  • Domain monitoring: ./monitor-domains.sh"
    echo "  • Check status: ./check-status.sh"
    echo
    echo "🔄 Rollback:"
    echo "  • Check status: ./rollback-manager.sh status"
    echo "  • Manual rollback: ./rollback-manager.sh rollback 'reason'"
    echo
    echo "📚 Documentation:"
    echo "  • Read full docs: cat DEPLOYMENT_PIPELINE_DOCUMENTATION.md"
    echo "  • GitHub workflows: .github/workflows/deployment-pipeline.yml"
    echo
    log "SUCCESS" "Setup complete! Happy deploying! 🎉"
}

main() {
    clear
    print_banner
    
    echo "This script will set up the complete GiftSync deployment pipeline:"
    echo "  ✓ Check prerequisites and install missing tools"
    echo "  ✓ Set up script permissions"
    echo "  ✓ Configure credentials and API tokens"
    echo "  ✓ Validate environment configurations"
    echo "  ✓ Set up GitHub Actions workflows"
    echo "  ✓ Test the deployment system"
    echo
    
    read -p "Ready to proceed? (Y/n): " -r confirm
    
    if [[ "$confirm" =~ ^[Nn]$ ]]; then
        log "INFO" "Setup cancelled"
        exit 0
    fi
    
    check_prerequisites
    setup_permissions
    setup_credentials
    validate_configuration
    setup_github_actions
    test_deployment_system
    show_next_steps
}

# Handle command line options
case "${1:-}" in
    "--help")
        echo "GiftSync Deployment Pipeline Setup"
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --help        Show this help message"
        echo "  --test-only   Only run tests, skip setup"
        echo "  --no-github   Skip GitHub Actions setup"
        exit 0
        ;;
    "--test-only")
        test_deployment_system
        ;;
    "--no-github")
        check_prerequisites
        setup_permissions
        setup_credentials
        validate_configuration
        test_deployment_system
        show_next_steps
        ;;
    *)
        main
        ;;
esac