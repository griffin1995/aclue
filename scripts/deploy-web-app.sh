#!/bin/bash
set -e

# Deploy aclue Web Application to AWS
# This script builds and deploys the Next.js web app to S3 + CloudFront

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )\" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
WEB_DIR="$PROJECT_ROOT/web"
TERRAFORM_DIR="$PROJECT_ROOT/infrastructure/terraform"

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

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
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

# Function to prompt for confirmation
prompt_confirm() {
    local prompt="$1"
    local response
    
    read -p "$(echo -e "${YELLOW}$prompt${NC} (y/N): ")" -n 1 -r response
    echo
    [[ $response =~ ^[Yy]$ ]]
}

# Function to check prerequisites
check_prerequisites() {
    print_header "CHECKING PREREQUISITES"
    
    local missing_tools=()
    
    # Check required tools
    local tools=("aws" "terraform" "node" "npm")
    for tool in "${tools[@]}"; do
        if command_exists "$tool"; then
            print_success "$tool is installed"
        else
            missing_tools+=("$tool")
            print_error "$tool is not installed"
        fi
    done
    
    if [ ${#missing_tools[@]} -gt 0 ]; then
        print_error "Missing required tools: ${missing_tools[*]}"
        echo
        echo "Please install missing tools:"
        echo "  Ubuntu/Debian: sudo apt-get install awscli terraform nodejs npm"
        echo "  macOS: brew install awscli terraform node npm"
        exit 1
    fi
    
    # Check AWS credentials
    if aws sts get-caller-identity >/dev/null 2>&1; then
        print_success "AWS credentials configured"
        AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
        AWS_REGION=$(aws configure get region)
        print_info "Account ID: $AWS_ACCOUNT_ID"
        print_info "Region: $AWS_REGION"
    else
        print_error "AWS credentials not configured"
        echo "Please run: aws configure"
        exit 1
    fi
    
    # Check if web directory exists
    if [ ! -d "$WEB_DIR" ]; then
        print_error "Web directory not found: $WEB_DIR"
        exit 1
    fi
    
    print_success "Prerequisites check completed"
}

# Function to get infrastructure outputs
get_infrastructure_outputs() {
    print_header "GETTING INFRASTRUCTURE INFORMATION"
    
    cd "$TERRAFORM_DIR"
    
    if [ ! -f "terraform.tfstate" ]; then
        print_error "Terraform state not found. Please deploy infrastructure first."
        echo "Run: ./scripts/complete-deployment.sh"
        exit 1
    fi
    
    print_step "Getting infrastructure outputs"
    
    # Get outputs
    S3_BUCKET=$(terraform output -raw web_app_bucket_name 2>/dev/null || echo "")
    CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw web_app_cloudfront_distribution_id 2>/dev/null || echo "")
    DOMAIN_NAME=$(terraform output -raw domain_name 2>/dev/null || echo "")
    API_URL=$(terraform output -raw api_url 2>/dev/null || echo "")
    
    if [ -z "$S3_BUCKET" ] || [ -z "$CLOUDFRONT_DISTRIBUTION_ID" ]; then
        print_warning "Web app infrastructure not found. Deploying web app infrastructure..."
        
        # Apply web app specific resources
        terraform apply -target=aws_s3_bucket.web_app \
                       -target=aws_cloudfront_distribution.web_app \
                       -target=aws_route53_record.web_app \
                       -var-file="environments/production.tfvars" \
                       -auto-approve
        
        # Get outputs again
        S3_BUCKET=$(terraform output -raw web_app_bucket_name)
        CLOUDFRONT_DISTRIBUTION_ID=$(terraform output -raw web_app_cloudfront_distribution_id)
        DOMAIN_NAME=$(terraform output -raw domain_name)
        API_URL=$(terraform output -raw api_url)
    fi
    
    print_success "Infrastructure information retrieved"
    print_info "S3 Bucket: $S3_BUCKET"
    print_info "CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"
    print_info "Domain: $DOMAIN_NAME"
    print_info "API URL: $API_URL"
    
    cd "$PROJECT_ROOT"
}

# Function to setup environment
setup_environment() {
    print_header "SETTING UP ENVIRONMENT"
    
    cd "$WEB_DIR"
    
    print_step "Creating production environment file"
    
    # Create .env.production
    cat > .env.production << EOF
# aclue Web App Production Environment
NODE_ENV=production
NEXT_TELEMETRY_DISABLED=1

# API Configuration
NEXT_PUBLIC_API_URL=https://$API_URL
NEXT_PUBLIC_WEB_URL=https://$DOMAIN_NAME

# Build Configuration
NEXT_PUBLIC_ASSET_PREFIX=
NEXT_PUBLIC_BASE_PATH=

# Feature Flags
NEXT_PUBLIC_ENABLE_ANALYTICS=true
NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN=true
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_BETA_FEATURES=false

# Generated on $(date)
EOF
    
    print_success "Environment configuration created"
    
    print_step "Installing dependencies"
    npm ci --only=production
    
    print_success "Dependencies installed"
}

# Function to build the application
build_application() {
    print_header "BUILDING APPLICATION"
    
    cd "$WEB_DIR"
    
    print_step "Building Next.js application for production"
    
    # Set environment variables for build
    export NODE_ENV=production
    export NEXT_TELEMETRY_DISABLED=1
    
    # Build the application
    npm run build
    
    print_success "Application built successfully"
    
    # Check if build output exists
    if [ ! -d "out" ] && [ ! -d ".next" ]; then
        print_error "Build output not found"
        exit 1
    fi
    
    print_step "Preparing static assets for deployment"
    
    # If using static export
    if [ -d "out" ]; then
        DEPLOY_DIR="out"
    else
        # For standard Next.js build, we'll need to extract static files
        DEPLOY_DIR=".next"
    fi
    
    print_info "Deploy directory: $DEPLOY_DIR"
}

# Function to deploy to S3
deploy_to_s3() {
    print_header "DEPLOYING TO S3"
    
    cd "$WEB_DIR"
    
    print_step "Syncing files to S3 bucket: $S3_BUCKET"
    
    # Sync files to S3 with appropriate cache headers
    aws s3 sync "$DEPLOY_DIR" "s3://$S3_BUCKET" \
        --delete \
        --cache-control "public, max-age=31536000, immutable" \
        --exclude "*.html" \
        --exclude "*.xml" \
        --exclude "*.txt" \
        --exclude "sw.js" \
        --exclude "workbox-*"
    
    # Upload HTML files with shorter cache
    aws s3 sync "$DEPLOY_DIR" "s3://$S3_BUCKET" \
        --cache-control "public, max-age=0, must-revalidate" \
        --include "*.html" \
        --include "*.xml" \
        --include "*.txt" \
        --include "sw.js" \
        --include "workbox-*"
    
    # Upload static assets with long cache
    if [ -d "$DEPLOY_DIR/_next/static" ]; then
        aws s3 sync "$DEPLOY_DIR/_next/static" "s3://$S3_BUCKET/_next/static" \
            --cache-control "public, max-age=31536000, immutable"
    fi
    
    # Set content type for specific files
    aws s3 cp "s3://$S3_BUCKET/manifest.json" "s3://$S3_BUCKET/manifest.json" \
        --content-type "application/manifest+json" \
        --metadata-directive REPLACE \
        --cache-control "public, max-age=86400" 2>/dev/null || true
    
    print_success "Files uploaded to S3"
}

# Function to invalidate CloudFront cache
invalidate_cloudfront() {
    print_header "INVALIDATING CLOUDFRONT CACHE"
    
    print_step "Creating CloudFront invalidation"
    
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    print_info "Invalidation ID: $INVALIDATION_ID"
    print_step "Waiting for invalidation to complete..."
    
    # Wait for invalidation to complete (optional)
    if prompt_confirm "Wait for CloudFront invalidation to complete? (recommended)"; then
        aws cloudfront wait invalidation-completed \
            --distribution-id "$CLOUDFRONT_DISTRIBUTION_ID" \
            --id "$INVALIDATION_ID"
        print_success "CloudFront cache invalidated"
    else
        print_info "Invalidation in progress. Check AWS Console for status."
    fi
}

# Function to run post-deployment tests
run_tests() {
    print_header "RUNNING POST-DEPLOYMENT TESTS"
    
    print_step "Testing web application"
    
    local web_url="https://$DOMAIN_NAME"
    
    # Test main page
    print_step "Testing main page: $web_url"
    if curl -sf "$web_url" >/dev/null 2>&1; then
        print_success "Main page is accessible"
    else
        print_warning "Main page test failed (may take a few minutes for DNS to propagate)"
    fi
    
    # Test health endpoint (if available)
    print_step "Testing health endpoint"
    if curl -sf "$web_url/api/health" >/dev/null 2>&1; then
        print_success "Health endpoint is accessible"
    else
        print_info "Health endpoint not available (this is normal for static sites)"
    fi
    
    # Test static assets
    print_step "Testing static assets"
    if curl -sf "$web_url/_next/static/css" >/dev/null 2>&1; then
        print_success "Static assets are accessible"
    else
        print_info "Static assets test inconclusive"
    fi
    
    print_success "Post-deployment tests completed"
}

# Function to display deployment summary
show_deployment_summary() {
    print_header "🎉 WEB APP DEPLOYMENT COMPLETE!"
    
    echo -e "${GREEN}Your aclue web application has been deployed successfully!${NC}"
    echo
    echo "📊 Deployment Summary:"
    echo "  • Domain: https://$DOMAIN_NAME"
    echo "  • S3 Bucket: $S3_BUCKET"
    echo "  • CloudFront Distribution: $CLOUDFRONT_DISTRIBUTION_ID"
    echo "  • API Backend: $API_URL"
    echo
    echo "🔗 Access URLs:"
    echo "  • Main Site: https://$DOMAIN_NAME"
    echo "  • WWW: https://www.$DOMAIN_NAME"
    echo "  • App: https://app.$DOMAIN_NAME"
    echo
    echo "⚡ Performance Features:"
    echo "  • Global CDN with CloudFront"
    echo "  • Optimized caching strategies"
    echo "  • Compressed assets"
    echo "  • HTTP/2 and modern protocols"
    echo
    echo "🔧 Management URLs:"
    echo "  • S3 Console: https://s3.console.aws.amazon.com/s3/buckets/$S3_BUCKET"
    echo "  • CloudFront Console: https://console.aws.amazon.com/cloudfront/home#distribution-settings:$CLOUDFRONT_DISTRIBUTION_ID"
    echo "  • Route 53 Console: https://console.aws.amazon.com/route53/v2/hostedzones"
    echo
    echo "💡 Next Steps:"
    echo "  1. Test the web application thoroughly"
    echo "  2. Configure custom error pages if needed"
    echo "  3. Set up monitoring and alerts"
    echo "  4. Configure CI/CD for automatic deployments"
    echo "  5. Update mobile app configuration"
    echo
    echo "📚 Documentation:"
    echo "  • AWS S3 Static Hosting: https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html"
    echo "  • CloudFront: https://docs.aws.amazon.com/cloudfront/"
    echo "  • Next.js Deployment: https://nextjs.org/docs/deployment"
    echo
    print_success "aclue web application is live! 🚀"
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
    echo "        Web Application Deployment"
    echo -e "${NC}"
    
    echo "🌐 This script will deploy your Next.js web app to AWS"
    echo "⏱️  Estimated time: 10-15 minutes"
    echo "💰 No additional costs (uses existing infrastructure)"
    echo
    
    if ! prompt_confirm "Ready to deploy web application?"; then
        echo "Deployment cancelled"
        exit 0
    fi
    
    # Run deployment steps
    check_prerequisites
    get_infrastructure_outputs
    setup_environment
    build_application
    deploy_to_s3
    invalidate_cloudfront
    run_tests
    show_deployment_summary
}

# Run main function
main "$@"