#!/bin/bash
# GiftSync Deployment with Cloudflare Cache Purging
# Integrates with Vercel deployment and purges Cloudflare cache

set -e

# Get script directory and source .env file
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
source "$SCRIPT_DIR/.env"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

print_header() {
    echo -e "\n${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${PURPLE}  $1${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}\n"
}

print_step() {
    echo -e "${CYAN}➤ $1${NC}"
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

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Check if API token is configured
if [ -z "$CLOUDFLARE_API_TOKEN" ] || [ "$CLOUDFLARE_API_TOKEN" = "YOUR_TOKEN_HERE" ]; then
    print_error "Please set your Cloudflare API token in $SCRIPT_DIR/.env"
    exit 1
fi

# Use domains from .env file
IFS=' ' read -ra DOMAINS <<< "$DOMAINS"

# Function to deploy to Vercel
deploy_to_vercel() {
    print_header "VERCEL DEPLOYMENT"
    
    cd "$PROJECT_ROOT/web"
    
    print_step "Installing dependencies"
    npm ci
    
    print_step "Building application"
    npm run build
    
    print_step "Deploying to Vercel"
    if command -v vercel >/dev/null 2>&1; then
        vercel --prod --yes
        print_success "Deployed to Vercel"
    else
        print_warning "Vercel CLI not found. Please deploy manually or install with: npm i -g vercel"
        print_info "You can also use: npm run deploy (if configured in package.json)"
        if prompt_confirm "Continue with cache purging assuming deployment succeeded?"; then
            print_info "Continuing with cache purge..."
        else
            exit 1
        fi
    fi
}

# Function to deploy backend to Railway
deploy_backend() {
    print_header "BACKEND DEPLOYMENT"
    
    cd "$PROJECT_ROOT/backend"
    
    if command -v railway >/dev/null 2>&1; then
        print_step "Deploying backend to Railway"
        railway up
        print_success "Backend deployed to Railway"
    else
        print_warning "Railway CLI not found. Backend deployment skipped."
        print_info "Install Railway CLI: npm i -g @railway/cli"
        print_info "Or deploy manually via Railway dashboard"
    fi
}

# Function to purge Cloudflare cache
purge_cloudflare_cache() {
    print_header "CLOUDFLARE CACHE PURGING"
    
    print_step "Purging cache for all domains"
    
    for domain in "${DOMAINS[@]}"; do
        print_info "Processing $domain..."
        
        # Get zone ID
        ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" | \
            python3 -c "import json, sys; data=json.load(sys.stdin); print(data['result'][0]['id'] if data['result'] else 'null')")
        
        if [ "$ZONE_ID" = "null" ]; then
            print_error "Could not find zone for $domain"
            continue
        fi
        
        # Purge everything
        RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}')
        
        SUCCESS=$(echo $RESPONSE | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('success', False))")
        
        if [ "$SUCCESS" = "True" ]; then
            print_success "Cache purged for $domain"
        else
            print_error "Failed to purge cache for $domain"
            echo "Response: $RESPONSE"
        fi
    done
}

# Function to verify deployment
verify_deployment() {
    print_header "DEPLOYMENT VERIFICATION"
    
    for domain in "${DOMAINS[@]}"; do
        print_step "Testing $domain"
        
        # Test domain response
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            print_success "$domain responding: HTTP $HTTP_STATUS"
        else
            print_warning "$domain issue: HTTP $HTTP_STATUS"
        fi
        
        # Test specific paths
        HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain/api/health" 2>/dev/null || echo "000")
        if [ "$HEALTH_STATUS" = "200" ]; then
            print_success "$domain API health check passed"
        else
            print_info "$domain API endpoint status: HTTP $HEALTH_STATUS (may be expected)"
        fi
    done
}

# Function to prompt for confirmation
prompt_confirm() {
    local prompt="$1"
    local response
    
    read -p "$(echo -e "${YELLOW}$prompt${NC} (y/N): ")" -n 1 -r response
    echo
    [[ $response =~ ^[Yy]$ ]]
}

# Function to show completion info
show_completion_info() {
    print_header "🎉 DEPLOYMENT COMPLETE!"
    
    echo -e "${GREEN}Your GiftSync application has been deployed!${NC}"
    echo
    echo "🌐 Live URLs:"
    for domain in "${DOMAINS[@]}"; do
        echo "  • https://$domain"
    done
    echo
    echo "🏗️  Infrastructure:"
    echo "  • Frontend: Vercel (Static Site Generation)"
    echo "  • Backend: Railway (FastAPI)"
    echo "  • CDN: Cloudflare (Cache Purged)"
    echo "  • DNS: Cloudflare (CNAME to Vercel)"
    echo
    echo "⚡ Performance:"
    echo "  • Global CDN distribution"
    echo "  • Fresh cache after deployment"
    echo "  • SSL/TLS encryption"
    echo "  • HTTP/2 & HTTP/3 support"
    echo
    echo "🔧 Next Steps:"
    echo "  1. Test all application functionality"
    echo "  2. Monitor performance and errors"
    echo "  3. Run automated tests if available"
    echo "  4. Update documentation if needed"
    echo
    print_success "Deployment successful! 🚀"
}

# Main execution function
main() {
    clear
    echo -e "${PURPLE}"
    echo "   ____  _  __ _   ____                  "
    echo "  / ___|(_)/ _| |_/ ___| _   _ _ __   ___ "
    echo " | |  _| | |_| __\___ \| | | | '_ \ / __|"
    echo " | |_| | |  _| |_ ___) | |_| | | | | (__ "
    echo "  \____|_|_|  \__|____/ \__, |_| |_|\___| "
    echo "                       |___/            "
    echo
    echo "     Deployment + Cache Purge Script"
    echo -e "${NC}"
    
    echo "🚀 This script will:"
    echo "   1. Deploy frontend to Vercel"
    echo "   2. Deploy backend to Railway (if Railway CLI available)"
    echo "   3. Purge Cloudflare cache for both domains"
    echo "   4. Verify deployment status"
    echo
    
    if ! prompt_confirm "Ready to deploy?"; then
        echo "Deployment cancelled"
        exit 0
    fi
    
    # Run deployment steps
    deploy_to_vercel
    deploy_backend
    purge_cloudflare_cache
    verify_deployment
    show_completion_info
}

# Handle command line options
case "${1:-}" in
    --cache-only)
        print_header "CACHE PURGE ONLY"
        purge_cloudflare_cache
        ;;
    --verify-only)
        print_header "VERIFICATION ONLY"
        verify_deployment
        ;;
    --help)
        echo "GiftSync Deployment Script"
        echo "Usage: $0 [options]"
        echo "Options:"
        echo "  --cache-only   Only purge Cloudflare cache"
        echo "  --verify-only  Only verify deployment status"
        echo "  --help        Show this help message"
        echo "  (no options)  Full deployment pipeline"
        ;;
    *)
        main "$@"
        ;;
esac