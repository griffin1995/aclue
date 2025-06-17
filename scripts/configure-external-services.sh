#!/bin/bash
set -e

# Configure External Services for GiftSync
# This script helps set up external APIs and services

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
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

# Function to prompt for user input
prompt_input() {
    local prompt="$1"
    local default="$2"
    local result
    
    if [ -n "$default" ]; then
        read -p "$(echo -e "${YELLOW}$prompt${NC} [${default}]: ")" result
        result="${result:-$default}"
    else
        read -p "$(echo -e "${YELLOW}$prompt${NC}: ")" result
    fi
    
    echo "$result"
}

# Function to prompt for sensitive input
prompt_password() {
    local prompt="$1"
    local result
    
    read -s -p "$(echo -e "${YELLOW}$prompt${NC}: ")" result
    echo
    echo "$result"
}

# Function to update Kubernetes secrets
update_k8s_secrets() {
    local key="$1"
    local value="$2"
    
    # Base64 encode the value
    local encoded_value=$(echo -n "$value" | base64 -w 0)
    
    # Update the secret
    kubectl patch secret giftsync-secrets -n giftsync -p "{\"data\":{\"$key\":\"$encoded_value\"}}"
    
    print_success "Updated $key in Kubernetes secrets"
}

# Function to restart deployment
restart_deployment() {
    print_step "Restarting deployment to pick up new secrets"
    kubectl rollout restart deployment/giftsync-api -n giftsync
    kubectl rollout status deployment/giftsync-api -n giftsync
    print_success "Deployment restarted successfully"
}

# Amazon Associates API Setup
setup_amazon_api() {
    print_header "AMAZON ASSOCIATES API SETUP"
    
    echo "To set up Amazon Associates API, you need to:"
    echo "1. Sign up at: https://affiliate-program.amazon.com/"
    echo "2. Apply for Product Advertising API access"
    echo "3. Create an API key in your Amazon Developer Console"
    echo
    
    if [[ $(prompt_input "Do you have Amazon API credentials? (y/n)" "n") == "y" ]]; then
        AMAZON_ACCESS_KEY=$(prompt_input "Amazon API Access Key" "")
        AMAZON_SECRET_KEY=$(prompt_password "Amazon API Secret Key")
        AMAZON_ASSOCIATE_TAG=$(prompt_input "Amazon Associate Tag" "giftsync-20")
        
        update_k8s_secrets "amazon-access-key" "$AMAZON_ACCESS_KEY"
        update_k8s_secrets "amazon-secret-key" "$AMAZON_SECRET_KEY"
        update_k8s_secrets "amazon-associate-tag" "$AMAZON_ASSOCIATE_TAG"
        
        print_success "Amazon API configured"
    else
        print_warning "Amazon API not configured - affiliate revenue will be limited"
    fi
}

# Mixpanel Analytics Setup
setup_mixpanel() {
    print_header "MIXPANEL ANALYTICS SETUP"
    
    echo "To set up Mixpanel:"
    echo "1. Sign up at: https://mixpanel.com/"
    echo "2. Create a new project"
    echo "3. Get your project token from Settings > Project Settings"
    echo
    
    if [[ $(prompt_input "Do you have a Mixpanel token? (y/n)" "n") == "y" ]]; then
        MIXPANEL_TOKEN=$(prompt_input "Mixpanel Project Token" "")
        
        update_k8s_secrets "mixpanel-token" "$MIXPANEL_TOKEN"
        
        print_success "Mixpanel configured"
    else
        print_warning "Mixpanel not configured - analytics will be limited"
    fi
}

# Sentry Error Tracking Setup
setup_sentry() {
    print_header "SENTRY ERROR TRACKING SETUP"
    
    echo "To set up Sentry:"
    echo "1. Sign up at: https://sentry.io/"
    echo "2. Create a new project (select Python/Django)"
    echo "3. Copy the DSN from your project settings"
    echo
    
    if [[ $(prompt_input "Do you have a Sentry DSN? (y/n)" "n") == "y" ]]; then
        SENTRY_DSN=$(prompt_input "Sentry DSN" "")
        
        update_k8s_secrets "sentry-dsn" "$SENTRY_DSN"
        
        print_success "Sentry configured"
    else
        print_warning "Sentry not configured - error tracking will be limited"
    fi
}

# SendGrid Email Setup
setup_sendgrid() {
    print_header "SENDGRID EMAIL SETUP"
    
    echo "To set up SendGrid:"
    echo "1. Sign up at: https://sendgrid.com/"
    echo "2. Verify your sender identity (domain or email)"
    echo "3. Create an API key with Mail Send permissions"
    echo
    
    if [[ $(prompt_input "Do you have a SendGrid API key? (y/n)" "n") == "y" ]]; then
        SENDGRID_API_KEY=$(prompt_password "SendGrid API Key")
        FROM_EMAIL=$(prompt_input "From Email Address" "noreply@$(prompt_input "Your Domain" "")")
        
        update_k8s_secrets "sendgrid-api-key" "$SENDGRID_API_KEY"
        update_k8s_secrets "from-email" "$FROM_EMAIL"
        
        print_success "SendGrid configured"
    else
        print_warning "SendGrid not configured - email notifications disabled"
    fi
}

# Stripe Payment Setup
setup_stripe() {
    print_header "STRIPE PAYMENT SETUP"
    
    echo "To set up Stripe:"
    echo "1. Sign up at: https://stripe.com/"
    echo "2. Complete account verification"
    echo "3. Get your API keys from Dashboard > Developers > API keys"
    echo
    
    if [[ $(prompt_input "Do you have Stripe API keys? (y/n)" "n") == "y" ]]; then
        STRIPE_PUBLISHABLE_KEY=$(prompt_input "Stripe Publishable Key (pk_live_...)" "")
        STRIPE_SECRET_KEY=$(prompt_password "Stripe Secret Key (sk_live_...)")
        
        update_k8s_secrets "stripe-publishable-key" "$STRIPE_PUBLISHABLE_KEY"
        update_k8s_secrets "stripe-secret-key" "$STRIPE_SECRET_KEY"
        
        print_success "Stripe configured"
    else
        print_warning "Stripe not configured - premium features disabled"
    fi
}

# Firebase Setup
setup_firebase() {
    print_header "FIREBASE AUTHENTICATION SETUP"
    
    echo "To set up Firebase:"
    echo "1. Go to: https://console.firebase.google.com/"
    echo "2. Create a new project"
    echo "3. Enable Authentication with Email/Password"
    echo "4. Download service account key (Project Settings > Service Accounts)"
    echo
    
    if [[ $(prompt_input "Do you have Firebase configured? (y/n)" "n") == "y" ]]; then
        FIREBASE_PROJECT_ID=$(prompt_input "Firebase Project ID" "")
        
        echo "Please upload your Firebase service account JSON file to the project root as 'firebase-key.json'"
        if [[ $(prompt_input "Have you uploaded firebase-key.json? (y/n)" "n") == "y" ]]; then
            # Create Kubernetes secret from file
            kubectl create secret generic firebase-config -n giftsync \
                --from-file=firebase-key.json=./firebase-key.json \
                --dry-run=client -o yaml | kubectl apply -f -
            
            update_k8s_secrets "firebase-project-id" "$FIREBASE_PROJECT_ID"
            
            print_success "Firebase configured"
        else
            print_warning "Firebase not fully configured - social auth disabled"
        fi
    else
        print_warning "Firebase not configured - social authentication disabled"
    fi
}

# Commission Junction Setup
setup_commission_junction() {
    print_header "COMMISSION JUNCTION SETUP"
    
    echo "To set up Commission Junction:"
    echo "1. Sign up at: https://www.cj.com/publishers"
    echo "2. Complete application process"
    echo "3. Get your Developer Key and Website ID"
    echo
    
    if [[ $(prompt_input "Do you have Commission Junction credentials? (y/n)" "n") == "y" ]]; then
        CJ_DEVELOPER_KEY=$(prompt_password "CJ Developer Key")
        CJ_WEBSITE_ID=$(prompt_input "CJ Website ID" "")
        
        update_k8s_secrets "cj-developer-key" "$CJ_DEVELOPER_KEY"
        update_k8s_secrets "cj-website-id" "$CJ_WEBSITE_ID"
        
        print_success "Commission Junction configured"
    else
        print_warning "Commission Junction not configured - affiliate options limited"
    fi
}

# Twilio SMS Setup
setup_twilio() {
    print_header "TWILIO SMS SETUP"
    
    echo "To set up Twilio:"
    echo "1. Sign up at: https://www.twilio.com/"
    echo "2. Get a phone number"
    echo "3. Find your Account SID and Auth Token in Console"
    echo
    
    if [[ $(prompt_input "Do you have Twilio credentials? (y/n)" "n") == "y" ]]; then
        TWILIO_ACCOUNT_SID=$(prompt_input "Twilio Account SID" "")
        TWILIO_AUTH_TOKEN=$(prompt_password "Twilio Auth Token")
        TWILIO_PHONE_NUMBER=$(prompt_input "Twilio Phone Number" "+1234567890")
        
        update_k8s_secrets "twilio-account-sid" "$TWILIO_ACCOUNT_SID"
        update_k8s_secrets "twilio-auth-token" "$TWILIO_AUTH_TOKEN"
        update_k8s_secrets "twilio-phone-number" "$TWILIO_PHONE_NUMBER"
        
        print_success "Twilio configured"
    else
        print_warning "Twilio not configured - SMS notifications disabled"
    fi
}

# Function to test configured services
test_services() {
    print_header "TESTING CONFIGURED SERVICES"
    
    print_step "Waiting for deployment to restart with new configuration"
    sleep 30
    
    # Get API URL
    local api_url="https://api.$(kubectl get ingress giftsync-ingress -n giftsync -o jsonpath='{.spec.rules[0].host}')"
    
    print_step "Testing API health with new configuration"
    if curl -sf "$api_url/health" >/dev/null 2>&1; then
        print_success "API is responding with new configuration"
    else
        print_error "API not responding - check logs: kubectl logs -f deployment/giftsync-api -n giftsync"
    fi
    
    print_step "Testing database connectivity"
    if kubectl exec deployment/giftsync-api -n giftsync -- python -c "
import asyncio
import asyncpg
import os
import sys

async def test_db():
    try:
        conn = await asyncpg.connect(os.environ['DATABASE_URL'])
        result = await conn.fetchval('SELECT 1')
        await conn.close()
        print('Database OK')
        sys.exit(0)
    except Exception as e:
        print(f'Database Error: {e}')
        sys.exit(1)

asyncio.run(test_db())
" >/dev/null 2>&1; then
        print_success "Database connectivity verified"
    else
        print_warning "Database connectivity issue"
    fi
    
    print_info "Check application logs for any service configuration issues:"
    echo "  kubectl logs -f deployment/giftsync-api -n giftsync"
}

# Main execution
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
    echo "        External Services Configuration"
    echo -e "${NC}"
    
    echo "🔧 This script will help you configure external APIs and services"
    echo "⏱️  Estimated time: 15-30 minutes"
    echo "💡 You can skip services and configure them later"
    echo
    
    # Check if kubectl is configured
    if ! kubectl get pods -n giftsync >/dev/null 2>&1; then
        print_error "Cannot access Kubernetes cluster. Make sure kubectl is configured."
        exit 1
    fi
    
    print_success "Kubernetes cluster access verified"
    echo
    
    # Configure each service
    setup_amazon_api
    setup_mixpanel
    setup_sentry
    setup_sendgrid
    setup_stripe
    setup_firebase
    setup_commission_junction
    setup_twilio
    
    # Restart deployment to pick up new secrets
    restart_deployment
    
    # Test services
    test_services
    
    print_header "🎉 EXTERNAL SERVICES CONFIGURATION COMPLETE!"
    
    echo -e "${GREEN}External services have been configured and deployed!${NC}"
    echo
    echo "📝 Next Steps:"
    echo "  1. Test your configured services through the API"
    echo "  2. Set up monitoring for each service"
    echo "  3. Configure webhooks where applicable"
    echo "  4. Update mobile app with any new configuration"
    echo
    echo "📚 Service Documentation:"
    echo "  • Amazon Associates: https://webservices.amazon.com/paapi5/documentation/"
    echo "  • Mixpanel: https://developer.mixpanel.com/"
    echo "  • Sentry: https://docs.sentry.io/"
    echo "  • SendGrid: https://docs.sendgrid.com/"
    echo "  • Stripe: https://stripe.com/docs"
    echo "  • Firebase: https://firebase.google.com/docs"
    echo
    print_success "GiftSync external services are now configured! 🚀"
}

# Run main function
main "$@"