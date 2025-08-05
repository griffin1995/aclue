#!/bin/bash

# GiftSync Configuration Manager
# Manages environment-specific deployment configurations

set -euo pipefail

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_FILE="$SCRIPT_DIR/config/deployment-config.yaml"
ENV_FILE="$SCRIPT_DIR/.env"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m'

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

# Check if yq is available
check_yq() {
    if ! command -v yq >/dev/null 2>&1; then
        log "ERROR" "yq is required but not installed"
        log "INFO" "Install with: sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64 && sudo chmod +x /usr/local/bin/yq"
        exit 1
    fi
}

# Get configuration value
get_config() {
    local environment="$1"
    local key="$2"
    
    check_yq
    
    if [[ ! -f "$CONFIG_FILE" ]]; then
        log "ERROR" "Configuration file not found: $CONFIG_FILE"
        exit 1
    fi
    
    local value=$(yq eval ".environments.$environment.$key" "$CONFIG_FILE" 2>/dev/null || echo "null")
    
    if [[ "$value" == "null" ]]; then
        # Try global config
        value=$(yq eval ".global.$key" "$CONFIG_FILE" 2>/dev/null || echo "null")
    fi
    
    echo "$value"
}

# List all environments
list_environments() {
    check_yq
    
    log "HEADER" "AVAILABLE ENVIRONMENTS"
    
    yq eval '.environments | keys | .[]' "$CONFIG_FILE" 2>/dev/null | while read -r env; do
        local domains=$(yq eval ".environments.$env.domains[]" "$CONFIG_FILE" 2>/dev/null | tr '\n' ' ')
        echo "  $env: $domains"
    done
}

# Show environment configuration
show_config() {
    local environment="$1"
    
    check_yq
    
    if ! yq eval ".environments.$environment" "$CONFIG_FILE" >/dev/null 2>&1; then
        log "ERROR" "Environment '$environment' not found"
        list_environments
        exit 1
    fi
    
    log "HEADER" "$environment CONFIGURATION"
    
    echo "Domains:"
    yq eval ".environments.$environment.domains[]" "$CONFIG_FILE" 2>/dev/null | sed 's/^/  - /'
    
    echo
    echo "Backend URLs:"
    yq eval ".environments.$environment.backends[]" "$CONFIG_FILE" 2>/dev/null | sed 's/^/  - /'
    
    echo
    echo "Cloudflare Settings:"
    yq eval ".environments.$environment.cloudflare" "$CONFIG_FILE" 2>/dev/null | sed 's/^/  /'
    
    echo
    echo "Monitoring Settings:"
    yq eval ".environments.$environment.monitoring" "$CONFIG_FILE" 2>/dev/null | sed 's/^/  /'
    
    echo
    echo "Features:"
    yq eval ".environments.$environment.features" "$CONFIG_FILE" 2>/dev/null | sed 's/^/  /' || echo "  (using global features)"
}

# Validate configuration
validate_config() {
    local environment="$1"
    local issues=()
    
    check_yq
    
    log "STEP" "Validating $environment configuration"
    
    # Check required fields
    local domains=$(get_config "$environment" "domains")
    if [[ "$domains" == "null" ]]; then
        issues+=("Missing domains configuration")
    fi
    
    local backends=$(get_config "$environment" "backends")
    if [[ "$backends" == "null" ]]; then
        issues+=("Missing backends configuration")
    fi
    
    # Check Cloudflare settings
    local cache_ttl=$(get_config "$environment" "cloudflare.cache_ttl")
    if [[ "$cache_ttl" == "null" ]]; then
        issues+=("Missing cache TTL configuration")
    fi
    
    # Check monitoring settings
    local health_check_interval=$(get_config "$environment" "monitoring.health_check_interval")
    if [[ "$health_check_interval" == "null" ]]; then
        issues+=("Missing health check interval")
    fi
    
    # Report issues
    if [[ ${#issues[@]} -eq 0 ]]; then
        log "SUCCESS" "$environment configuration is valid"
        return 0
    else
        log "ERROR" "$environment configuration has issues:"
        for issue in "${issues[@]}"; do
            log "ERROR" "  • $issue"
        done
        return 1
    fi
}

# Generate environment variables
generate_env_vars() {
    local environment="$1"
    local output_file="${2:-/tmp/deployment-vars-$environment.env}"
    
    check_yq
    
    log "STEP" "Generating environment variables for $environment"
    
    # Create output file
    cat > "$output_file" << EOF
# GiftSync Deployment Environment Variables
# Environment: $environment
# Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)

DEPLOYMENT_ENVIRONMENT=$environment
EOF
    
    # Add domains
    local domains=$(yq eval ".environments.$environment.domains[]" "$CONFIG_FILE" 2>/dev/null | tr '\n' ',' | sed 's/,$//')
    echo "DOMAINS=\"$domains\"" >> "$output_file"
    
    # Add backend URLs
    local backends=$(yq eval ".environments.$environment.backends[]" "$CONFIG_FILE" 2>/dev/null | tr '\n' ',' | sed 's/,$//')
    echo "BACKEND_URLS=\"$backends\"" >> "$output_file"
    
    # Add Cloudflare settings
    local cache_ttl=$(get_config "$environment" "cloudflare.cache_ttl")
    echo "CLOUDFLARE_CACHE_TTL=$cache_ttl" >> "$output_file"
    
    local security_level=$(get_config "$environment" "cloudflare.security_level")
    echo "CLOUDFLARE_SECURITY_LEVEL=$security_level" >> "$output_file"
    
    # Add monitoring settings
    local health_check_interval=$(get_config "$environment" "monitoring.health_check_interval")
    echo "HEALTH_CHECK_INTERVAL=$health_check_interval" >> "$output_file"
    
    local alert_threshold=$(get_config "$environment" "monitoring.alert_threshold")
    echo "ALERT_THRESHOLD=$alert_threshold" >> "$output_file"
    
    # Add feature flags
    local rollback_enabled=$(get_config "$environment" "monitoring.rollback_enabled")
    echo "ROLLBACK_ENABLED=$rollback_enabled" >> "$output_file"
    
    # Add notification settings
    local slack_channel=$(get_config "$environment" "notifications.slack_channel")
    echo "SLACK_CHANNEL=$slack_channel" >> "$output_file"
    
    log "SUCCESS" "Environment variables generated: $output_file"
    
    # Show preview
    echo
    log "INFO" "Preview of generated variables:"
    head -20 "$output_file" | sed 's/^/  /'
}

# Deploy with configuration
deploy_with_config() {
    local environment="$1"
    local force="${2:-false}"
    
    log "HEADER" "DEPLOYING WITH $environment CONFIGURATION"
    
    # Validate configuration first
    if ! validate_config "$environment"; then
        log "ERROR" "Configuration validation failed"
        exit 1
    fi
    
    # Generate environment variables
    local env_file="/tmp/deployment-vars-$environment.env"
    generate_env_vars "$environment" "$env_file"
    
    # Source environment variables
    source "$env_file"
    
    # Check if deployment is allowed
    if [[ "$environment" == "production" && "$force" != "true" ]]; then
        echo
        log "WARNING" "You are about to deploy to PRODUCTION"
        log "INFO" "Domains: $DOMAINS"
        log "INFO" "Backend: $BACKEND_URLS"
        echo
        read -p "Are you sure you want to continue? (yes/no): " -r confirm
        
        if [[ "$confirm" != "yes" ]]; then
            log "INFO" "Deployment cancelled"
            exit 0
        fi
    fi
    
    # Call the main deployment script with environment variables
    log "STEP" "Starting deployment process"
    
    if [[ -f "$SCRIPT_DIR/deploy-with-cache-purge.sh" ]]; then
        "$SCRIPT_DIR/deploy-with-cache-purge.sh"
    else
        log "ERROR" "Deployment script not found: $SCRIPT_DIR/deploy-with-cache-purge.sh"
        exit 1
    fi
}

# Set up credentials
setup_credentials() {
    log "HEADER" "CREDENTIAL SETUP"
    
    if [[ -f "$CREDENTIALS_FILE" ]]; then
        log "INFO" "Credentials file already exists: $CREDENTIALS_FILE"
        read -p "Do you want to update it? (y/N): " -r update
        
        if [[ "$update" != "y" && "$update" != "Y" ]]; then
            return 0
        fi
    fi
    
    echo "# GiftSync Cloudflare Credentials" > "$CREDENTIALS_FILE"
    echo "# Generated: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> "$CREDENTIALS_FILE"
    echo >> "$CREDENTIALS_FILE"
    
    read -p "Enter Cloudflare API Token: " -r cf_token
    echo "export CLOUDFLARE_API_TOKEN=\"$cf_token\"" >> "$CREDENTIALS_FILE"
    
    read -p "Enter Slack Webhook URL (optional): " -r slack_url
    if [[ -n "$slack_url" ]]; then
        echo "export SLACK_WEBHOOK_URL=\"$slack_url\"" >> "$CREDENTIALS_FILE"
    fi
    
    chmod 600 "$CREDENTIALS_FILE"
    
    log "SUCCESS" "Credentials saved to $CREDENTIALS_FILE"
}

# Update configuration
update_config() {
    local environment="$1"
    local key="$2"
    local value="$3"
    
    check_yq
    
    log "STEP" "Updating $environment.$key to '$value'"
    
    # Create backup
    cp "$CONFIG_FILE" "$CONFIG_FILE.backup.$(date +%Y%m%d-%H%M%S)"
    
    # Update configuration
    yq eval ".environments.$environment.$key = \"$value\"" -i "$CONFIG_FILE"
    
    log "SUCCESS" "Configuration updated"
}

# Show usage
show_usage() {
    cat << EOF
GiftSync Configuration Manager

Usage: $0 [COMMAND] [OPTIONS]

Commands:
  list                          List all environments
  show <environment>            Show environment configuration
  validate <environment>       Validate environment configuration
  env-vars <environment> [file] Generate environment variables
  deploy <environment> [--force] Deploy with environment configuration
  setup-credentials            Set up API credentials
  update <env> <key> <value>   Update configuration value

Examples:
  $0 list
  $0 show production
  $0 validate staging
  $0 env-vars production
  $0 deploy staging
  $0 deploy production --force
  $0 setup-credentials
  $0 update production cloudflare.cache_ttl 7200

Options:
  --help                       Show this help message
  --force                      Skip confirmation prompts

Configuration file: $CONFIG_FILE
Credentials file: $CREDENTIALS_FILE

EOF
}

# Main execution
main() {
    case "${1:-}" in
        "list")
            list_environments
            ;;
        "show")
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Environment name required"
                show_usage
                exit 1
            fi
            show_config "$2"
            ;;
        "validate")
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Environment name required"
                show_usage
                exit 1
            fi
            validate_config "$2"
            ;;
        "env-vars")
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Environment name required"
                show_usage
                exit 1
            fi
            generate_env_vars "$2" "${3:-}"
            ;;
        "deploy")
            if [[ -z "${2:-}" ]]; then
                log "ERROR" "Environment name required"
                show_usage
                exit 1
            fi
            local force=$([[ "${3:-}" == "--force" ]] && echo "true" || echo "false")
            deploy_with_config "$2" "$force"
            ;;
        "setup-credentials")
            setup_credentials
            ;;
        "update")
            if [[ -z "${2:-}" || -z "${3:-}" || -z "${4:-}" ]]; then
                log "ERROR" "Usage: $0 update <environment> <key> <value>"
                exit 1
            fi
            update_config "$2" "$3" "$4"
            ;;
        "--help"|"help"|"")
            show_usage
            ;;
        *)
            log "ERROR" "Unknown command: $1"
            show_usage
            exit 1
            ;;
    esac
}

# Create config directory if it doesn't exist
mkdir -p "$SCRIPT_DIR/config"

# Run main function
main "$@"