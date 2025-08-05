#!/bin/bash
# GiftSync Deployment Integration Script
# Quick deployment integration for Railway backend and Vercel frontend

set -e

source ~/.cloudflare-credentials

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

DOMAINS=("aclue.co.uk" "aclue.app")

print_header() {
    echo -e "\n${PURPLE}🚀 GiftSync Deployment Integration${NC}"
    echo -e "${PURPLE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
}

print_step() {
    echo -e "${BLUE}➤ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# Function to check backend health
check_backend_health() {
    print_step "Checking backend health"
    
    BACKEND_URL="https://giftsync-backend-production.up.railway.app"
    
    # Test health endpoint
    HEALTH_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$BACKEND_URL/health" 2>/dev/null || echo "000")
    
    if [ "$HEALTH_STATUS" = "200" ]; then
        print_success "Backend healthy: $BACKEND_URL"
        return 0
    else
        print_error "Backend health check failed: HTTP $HEALTH_STATUS"
        return 1
    fi
}

# Function to verify frontend domains
check_frontend_domains() {
    print_step "Checking frontend domains"
    
    local all_healthy=true
    
    for domain in "${DOMAINS[@]}"; do
        HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "https://$domain" || echo "000")
        
        if [ "$HTTP_STATUS" = "200" ]; then
            print_success "Frontend healthy: https://$domain"
        else
            print_error "Frontend issue: https://$domain (HTTP $HTTP_STATUS)"
            all_healthy=false
        fi
    done
    
    return $([ "$all_healthy" = true ] && echo 0 || echo 1)
}

# Function to purge cache after deployment
purge_all_cache() {
    print_step "Purging Cloudflare cache"
    
    for domain in "${DOMAINS[@]}"; do
        # Get zone ID
        ZONE_ID=$(curl -s -X GET "https://api.cloudflare.com/client/v4/zones?name=$domain" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" | \
            python3 -c "import json, sys; data=json.load(sys.stdin); print(data['result'][0]['id'] if data['result'] else 'null')")
        
        if [ "$ZONE_ID" = "null" ]; then
            print_error "Could not find zone for $domain"
            continue
        fi
        
        # Purge cache
        RESPONSE=$(curl -s -X POST "https://api.cloudflare.com/client/v4/zones/$ZONE_ID/purge_cache" \
            -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
            -H "Content-Type: application/json" \
            --data '{"purge_everything":true}')
        
        SUCCESS=$(echo $RESPONSE | python3 -c "import json, sys; data=json.load(sys.stdin); print(data.get('success', False))")
        
        if [ "$SUCCESS" = "True" ]; then
            print_success "Cache purged for $domain"
        else
            print_error "Failed to purge cache for $domain"
        fi
    done
}

# Function to generate deployment report
generate_deployment_report() {
    print_header
    echo
    
    local timestamp=$(date '+%Y-%m-%d %H:%M:%S')
    echo "Deployment Status Report - $timestamp"
    echo "=================================================="
    echo
    
    # Check all components
    local backend_healthy=false
    local frontend_healthy=false
    
    if check_backend_health; then
        backend_healthy=true
    fi
    
    if check_frontend_domains; then
        frontend_healthy=true
    fi
    
    # Purge cache
    purge_all_cache
    
    echo
    echo "📊 DEPLOYMENT SUMMARY"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    if [ "$backend_healthy" = true ]; then
        print_success "Backend: Railway (FastAPI) - Healthy"
    else
        print_error "Backend: Railway (FastAPI) - Issues detected"
    fi
    
    if [ "$frontend_healthy" = true ]; then
        print_success "Frontend: Vercel + Cloudflare - Healthy"
    else
        print_error "Frontend: Vercel + Cloudflare - Issues detected"
    fi
    
    echo
    echo "🌐 LIVE URLS:"
    for domain in "${DOMAINS[@]}"; do
        echo "  • https://$domain"
    done
    
    echo
    echo "🔧 INFRASTRUCTURE:"
    echo "  • Backend: https://giftsync-backend-production.up.railway.app"
    echo "  • Database: Supabase PostgreSQL"
    echo "  • CDN: Cloudflare (Fresh cache)"
    echo "  • SSL: Full (Strict) mode enabled"
    echo "  • HTTPS: Always enabled"
    
    if [ "$backend_healthy" = true ] && [ "$frontend_healthy" = true ]; then
        echo
        print_success "🎉 All systems operational!"
        return 0
    else
        echo
        print_error "⚠️  Some issues detected - check individual components"
        return 1
    fi
}

# Main execution
case "${1:-}" in
    --health-check)
        print_header
        echo
        check_backend_health
        check_frontend_domains
        ;;
    --cache-purge)
        print_header
        echo
        purge_all_cache
        ;;
    --help)
        echo "GiftSync Deployment Integration Script"
        echo "Usage: $0 [options]"
        echo
        echo "Options:"
        echo "  --health-check   Check backend and frontend health"
        echo "  --cache-purge    Purge Cloudflare cache only"
        echo "  --help          Show this help message"
        echo "  (no options)    Full deployment status report"
        echo
        echo "This script helps verify and integrate your GiftSync deployment:"
        echo "  • Checks Railway backend health"
        echo "  • Verifies Vercel frontend on both domains"
        echo "  • Purges Cloudflare cache for fresh deployment"
        echo "  • Provides comprehensive deployment report"
        ;;
    *)
        generate_deployment_report
        ;;
esac