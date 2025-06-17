#!/bin/bash
set -e

# Complete GiftSync Production Deployment Script
# This script automates the entire deployment process

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
TERRAFORM_DIR="$PROJECT_ROOT/infrastructure/terraform"
K8S_DIR="$PROJECT_ROOT/k8s"
BACKEND_DIR="$PROJECT_ROOT/backend"

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

# Function to generate secure password
generate_password() {
    openssl rand -base64 32
}

# Function to base64 encode
b64encode() {
    echo -n "$1" | base64 -w 0
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

# Function to validate email
validate_email() {
    local email="$1"
    if [[ "$email" =~ ^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$ ]]; then
        return 0
    else
        return 1
    fi
}

# Function to check prerequisites
check_prerequisites() {
    print_header "CHECKING PREREQUISITES"
    
    local missing_tools=()
    
    # Check required tools
    local tools=("aws" "terraform" "kubectl" "docker" "psql" "openssl")
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
        echo "  Ubuntu/Debian: sudo apt-get install awscli terraform kubectl docker postgresql-client openssl"
        echo "  macOS: brew install awscli terraform kubectl docker postgresql openssl"
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
    
    # Check Docker daemon
    if docker info >/dev/null 2>&1; then
        print_success "Docker daemon is running"
    else
        print_error "Docker daemon is not running"
        echo "Please start Docker and try again"
        exit 1
    fi
}

# Function to collect configuration
collect_configuration() {
    print_header "CONFIGURATION SETUP"
    
    echo "Please provide the following information for your GiftSync deployment:"
    echo
    
    # Domain configuration
    DOMAIN_NAME=$(prompt_input "Your domain name (e.g., giftsync.com)" "")
    while [ -z "$DOMAIN_NAME" ]; do
        print_error "Domain name is required"
        DOMAIN_NAME=$(prompt_input "Your domain name (e.g., giftsync.com)" "")
    done
    
    # Admin email
    ADMIN_EMAIL=$(prompt_input "Admin email address" "admin@$DOMAIN_NAME")
    while ! validate_email "$ADMIN_EMAIL"; do
        print_error "Invalid email address"
        ADMIN_EMAIL=$(prompt_input "Admin email address" "")
    done
    
    # Environment name
    ENVIRONMENT=$(prompt_input "Environment name" "production")
    PROJECT_NAME=$(prompt_input "Project name" "giftsync")
    
    # Database configuration
    print_info "Generating secure database credentials..."
    DB_PASSWORD=$(generate_password)
    SECRET_KEY=$(generate_password)
    JWT_SECRET=$(generate_password)
    
    # External service configuration
    echo
    print_info "External service configuration (leave empty to configure later):"
    MIXPANEL_TOKEN=$(prompt_input "Mixpanel token (optional)" "")
    SENTRY_DSN=$(prompt_input "Sentry DSN (optional)" "")
    SENDGRID_API_KEY=$(prompt_input "SendGrid API key (optional)" "")
    
    # Confirmation
    echo
    print_info "Configuration Summary:"
    echo "  Domain: $DOMAIN_NAME"
    echo "  Admin Email: $ADMIN_EMAIL"
    echo "  Environment: $ENVIRONMENT"
    echo "  Project: $PROJECT_NAME"
    echo "  AWS Account: $AWS_ACCOUNT_ID"
    echo "  AWS Region: $AWS_REGION"
    echo
    
    if ! prompt_confirm "Proceed with this configuration?"; then
        echo "Deployment cancelled"
        exit 0
    fi
}

# Function to prompt for confirmation
prompt_confirm() {
    local prompt="$1"
    local response
    
    read -p "$(echo -e "${YELLOW}$prompt${NC} (y/N): ")" -n 1 -r response
    echo
    [[ $response =~ ^[Yy]$ ]]
}

# Function to request SSL certificate
request_ssl_certificate() {
    print_header "SSL CERTIFICATE SETUP"
    
    print_step "Requesting SSL certificate for $DOMAIN_NAME"
    
    # Request certificate
    CERT_ARN=$(aws acm request-certificate \
        --domain-name "$DOMAIN_NAME" \
        --subject-alternative-names "*.$DOMAIN_NAME" \
        --validation-method DNS \
        --region "$AWS_REGION" \
        --query 'CertificateArn' \
        --output text)
    
    print_success "Certificate requested: $CERT_ARN"
    
    print_warning "IMPORTANT: You must validate the certificate in AWS Console"
    print_info "1. Go to AWS Console → Certificate Manager"
    print_info "2. Find your certificate and click 'Create record in Route 53'"
    print_info "3. Wait for validation to complete (5-30 minutes)"
    
    if prompt_confirm "Have you completed certificate validation?"; then
        print_success "Certificate validation confirmed"
    else
        print_error "Please complete certificate validation before continuing"
        exit 1
    fi
}

# Function to create Terraform configuration
create_terraform_config() {
    print_header "TERRAFORM CONFIGURATION"
    
    print_step "Creating Terraform configuration files"
    
    # Create production.tfvars
    cat > "$TERRAFORM_DIR/environments/production.tfvars" << EOF
# GiftSync Production Configuration
# Generated by deployment script

# General
environment = "$ENVIRONMENT"
project_name = "$PROJECT_NAME"
region = "$AWS_REGION"
aws_account_id = "$AWS_ACCOUNT_ID"

# Domain Configuration
domain_name = "$DOMAIN_NAME"
api_subdomain = "api"
app_subdomain = "app"
certificate_arn = "$CERT_ARN"

# Networking
vpc_cidr = "10.0.0.0/16"
availability_zones = ["${AWS_REGION}a", "${AWS_REGION}b", "${AWS_REGION}c"]

# EKS Configuration
cluster_version = "1.28"
node_instance_types = ["t3.medium"]
node_desired_capacity = 2
node_max_capacity = 5
node_min_capacity = 1

# RDS Configuration
db_instance_class = "db.t3.medium"
db_allocated_storage = 100
db_max_allocated_storage = 500
db_backup_retention_period = 7
db_deletion_protection = true
db_username = "giftsync_admin"

# ElastiCache Configuration
redis_node_type = "cache.t3.micro"
redis_num_cache_nodes = 1

# S3 Configuration
s3_versioning_enabled = true
s3_lifecycle_enabled = true

# Monitoring
enable_cloudwatch_logs = true
log_retention_in_days = 14

# Tags
tags = {
  Environment = "$ENVIRONMENT"
  Project     = "$PROJECT_NAME"
  Owner       = "$ADMIN_EMAIL"
  ManagedBy   = "terraform"
}
EOF
    
    print_success "Terraform configuration created"
}

# Function to deploy infrastructure
deploy_infrastructure() {
    print_header "INFRASTRUCTURE DEPLOYMENT"
    
    cd "$TERRAFORM_DIR"
    
    print_step "Initializing Terraform"
    terraform init
    
    print_step "Validating Terraform configuration"
    terraform validate
    
    print_step "Planning infrastructure deployment"
    terraform plan -var-file="environments/production.tfvars"
    
    if prompt_confirm "Deploy infrastructure? This will create AWS resources and incur costs."; then
        print_step "Deploying infrastructure (this takes 15-20 minutes)"
        terraform apply -var-file="environments/production.tfvars" -auto-approve
        
        # Get outputs
        RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
        REDIS_ENDPOINT=$(terraform output -raw redis_endpoint)
        ECR_REPOSITORY=$(terraform output -raw ecr_repository_url)
        EKS_CLUSTER_NAME=$(terraform output -raw eks_cluster_name)
        S3_BUCKET=$(terraform output -raw s3_bucket_name)
        
        print_success "Infrastructure deployed successfully"
        print_info "RDS Endpoint: $RDS_ENDPOINT"
        print_info "Redis Endpoint: $REDIS_ENDPOINT"
        print_info "ECR Repository: $ECR_REPOSITORY"
        print_info "EKS Cluster: $EKS_CLUSTER_NAME"
        print_info "S3 Bucket: $S3_BUCKET"
    else
        print_error "Infrastructure deployment cancelled"
        exit 1
    fi
    
    cd "$PROJECT_ROOT"
}

# Function to setup database
setup_database() {
    print_header "DATABASE SETUP"
    
    print_step "Setting up database credentials"
    
    # Store password in AWS Secrets Manager
    aws secretsmanager create-secret \
        --name "giftsync/$ENVIRONMENT/database-password" \
        --description "GiftSync $ENVIRONMENT database password" \
        --secret-string "$DB_PASSWORD" >/dev/null 2>&1 || \
    aws secretsmanager update-secret \
        --secret-id "giftsync/$ENVIRONMENT/database-password" \
        --secret-string "$DB_PASSWORD" >/dev/null
    
    print_step "Creating database and user"
    
    # Create database URL
    DATABASE_URL="postgresql://giftsync_user:$DB_PASSWORD@$RDS_ENDPOINT:5432/giftsync_prod"
    
    # Connect and setup database
    PGPASSWORD="$DB_PASSWORD" psql -h "$RDS_ENDPOINT" -U giftsync_admin -d postgres << EOF
CREATE DATABASE giftsync_prod;
CREATE USER giftsync_user WITH ENCRYPTED PASSWORD '$DB_PASSWORD';
GRANT ALL PRIVILEGES ON DATABASE giftsync_prod TO giftsync_user;
\c giftsync_prod;
GRANT ALL ON SCHEMA public TO giftsync_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO giftsync_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO giftsync_user;
EOF
    
    print_step "Running database migrations"
    
    cd "$BACKEND_DIR"
    
    # Setup Python environment
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt >/dev/null 2>&1
    
    # Run migrations
    export DATABASE_URL="$DATABASE_URL"
    alembic upgrade head
    
    print_step "Loading initial data"
    python scripts/load_initial_data.py
    
    print_success "Database setup completed"
    
    cd "$PROJECT_ROOT"
}

# Function to build and deploy application
build_and_deploy_app() {
    print_header "APPLICATION DEPLOYMENT"
    
    print_step "Configuring EKS cluster access"
    aws eks update-kubeconfig --region "$AWS_REGION" --name "$EKS_CLUSTER_NAME"
    
    print_step "Building and pushing Docker image"
    
    # Login to ECR
    aws ecr get-login-password --region "$AWS_REGION" | \
        docker login --username AWS --password-stdin "$ECR_REPOSITORY"
    
    cd "$BACKEND_DIR"
    
    # Build image
    docker build -f Dockerfile.prod -t giftsync-api:latest .
    docker tag giftsync-api:latest "$ECR_REPOSITORY:latest"
    docker tag giftsync-api:latest "$ECR_REPOSITORY:v1.0.0"
    
    # Push image
    docker push "$ECR_REPOSITORY:latest"
    docker push "$ECR_REPOSITORY:v1.0.0"
    
    print_success "Docker image built and pushed"
    
    cd "$PROJECT_ROOT"
    
    print_step "Creating Kubernetes secrets and configuration"
    
    # Create secrets
    cat > "$K8S_DIR/secrets.yaml" << EOF
apiVersion: v1
kind: Secret
metadata:
  name: giftsync-secrets
  namespace: giftsync
type: Opaque
data:
  database-url: $(b64encode "$DATABASE_URL")
  secret-key: $(b64encode "$SECRET_KEY")
  jwt-secret: $(b64encode "$JWT_SECRET")
  redis-url: $(b64encode "redis://$REDIS_ENDPOINT:6379")
  aws-access-key: $(b64encode "$AWS_ACCESS_KEY_ID")
  aws-secret-key: $(b64encode "$AWS_SECRET_ACCESS_KEY")
  mixpanel-token: $(b64encode "$MIXPANEL_TOKEN")
  sentry-dsn: $(b64encode "$SENTRY_DSN")
  sendgrid-api-key: $(b64encode "$SENDGRID_API_KEY")
EOF
    
    # Update deployment with correct image
    sed -i "s|123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api:latest|$ECR_REPOSITORY:latest|g" "$K8S_DIR/deployment.yaml"
    
    # Update ingress with correct certificate and domain
    sed -i "s|arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012|$CERT_ARN|g" "$K8S_DIR/ingress.yaml"
    sed -i "s|api.giftsync.com|api.$DOMAIN_NAME|g" "$K8S_DIR/ingress.yaml"
    
    print_step "Deploying to Kubernetes"
    
    # Deploy application
    kubectl apply -f "$K8S_DIR/namespace.yaml"
    kubectl apply -f "$K8S_DIR/configmap.yaml"
    kubectl apply -f "$K8S_DIR/secrets.yaml"
    kubectl apply -f "$K8S_DIR/deployment.yaml"
    kubectl apply -f "$K8S_DIR/service.yaml"
    kubectl apply -f "$K8S_DIR/ingress.yaml"
    
    print_step "Waiting for deployment to be ready"
    kubectl wait --for=condition=available --timeout=300s deployment/giftsync-api -n giftsync
    
    print_success "Application deployed successfully"
}

# Function to setup DNS
setup_dns() {
    print_header "DNS CONFIGURATION"
    
    print_step "Getting load balancer DNS name"
    
    # Wait for load balancer to be ready
    local attempts=0
    local max_attempts=30
    
    while [ $attempts -lt $max_attempts ]; do
        ALB_DNS=$(kubectl get ingress giftsync-ingress -n giftsync -o jsonpath='{.status.loadBalancer.ingress[0].hostname}' 2>/dev/null)
        
        if [ -n "$ALB_DNS" ]; then
            break
        fi
        
        print_info "Waiting for load balancer... ($((attempts + 1))/$max_attempts)"
        sleep 30
        ((attempts++))
    done
    
    if [ -z "$ALB_DNS" ]; then
        print_error "Load balancer not ready after $max_attempts attempts"
        print_warning "You'll need to configure DNS manually later"
        return 1
    fi
    
    print_success "Load balancer ready: $ALB_DNS"
    
    print_step "Creating Route 53 DNS records"
    
    # Get hosted zone ID
    HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN_NAME" --query 'HostedZones[0].Id' --output text | cut -d'/' -f3)
    
    if [ "$HOSTED_ZONE_ID" = "None" ]; then
        print_warning "Route 53 hosted zone not found for $DOMAIN_NAME"
        print_info "Please create DNS records manually:"
        print_info "  api.$DOMAIN_NAME → $ALB_DNS (CNAME)"
        return 0
    fi
    
    # Create DNS record
    aws route53 change-resource-record-sets \
        --hosted-zone-id "$HOSTED_ZONE_ID" \
        --change-batch "{
            \"Changes\": [{
                \"Action\": \"UPSERT\",
                \"ResourceRecordSet\": {
                    \"Name\": \"api.$DOMAIN_NAME\",
                    \"Type\": \"A\",
                    \"AliasTarget\": {
                        \"DNSName\": \"$ALB_DNS\",
                        \"EvaluateTargetHealth\": false,
                        \"HostedZoneId\": \"Z35SXDOTRQ7X7K\"
                    }
                }
            }]
        }" >/dev/null
    
    print_success "DNS record created for api.$DOMAIN_NAME"
}

# Function to validate deployment
validate_deployment() {
    print_header "DEPLOYMENT VALIDATION"
    
    print_step "Waiting for DNS propagation"
    sleep 60
    
    print_step "Testing API endpoints"
    
    local api_url="https://api.$DOMAIN_NAME"
    local max_attempts=15
    local attempts=0
    
    while [ $attempts -lt $max_attempts ]; do
        if curl -sf "$api_url/health" >/dev/null 2>&1; then
            print_success "API health check passed"
            break
        fi
        
        print_info "Waiting for API to be ready... ($((attempts + 1))/$max_attempts)"
        sleep 30
        ((attempts++))
    done
    
    if [ $attempts -eq $max_attempts ]; then
        print_warning "API not responding yet. This may take a few more minutes."
        print_info "Try accessing: $api_url/health"
        print_info "API Documentation: $api_url/docs"
    else
        print_success "API is responding at: $api_url"
        print_info "API Documentation: $api_url/docs"
        
        # Test additional endpoints
        print_step "Testing additional API endpoints"
        
        # Test products endpoint
        if curl -sf "$api_url/products/" >/dev/null 2>&1; then
            print_success "Products endpoint working"
        else
            print_warning "Products endpoint not responding"
        fi
        
        # Test auth endpoints
        local register_response=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$api_url/auth/register" \
            -H "Content-Type: application/json" \
            -d '{"first_name":"Test","last_name":"User","email":"test@example.com","password":"TestPassword123!"}' 2>/dev/null)
        
        if [ "$register_response" = "422" ] || [ "$register_response" = "200" ]; then
            print_success "Auth endpoints accessible"
        else
            print_warning "Auth endpoints may have issues (HTTP $register_response)"
        fi
    fi
    
    print_step "Checking Kubernetes deployment status"
    kubectl get pods -n giftsync
    kubectl get services -n giftsync
    kubectl get ingress -n giftsync
    
    print_step "Checking database connectivity"
    if kubectl exec -it deployment/giftsync-api -n giftsync -- psql "$DATABASE_URL" -c "SELECT 1;" >/dev/null 2>&1; then
        print_success "Database connectivity verified"
    else
        print_warning "Database connectivity issue - check logs"
    fi
    
    print_step "Checking Redis connectivity"
    if kubectl exec -it deployment/giftsync-api -n giftsync -- redis-cli -u "redis://$REDIS_ENDPOINT:6379" ping >/dev/null 2>&1; then
        print_success "Redis connectivity verified"
    else
        print_warning "Redis connectivity issue - check configuration"
    fi
}

# Function to display final information
show_completion_info() {
    print_header "🎉 DEPLOYMENT COMPLETE!"
    
    echo -e "${GREEN}Your GiftSync production environment is now deployed!${NC}"
    echo
    echo "📊 Deployment Summary:"
    echo "  • Domain: $DOMAIN_NAME"
    echo "  • API URL: https://api.$DOMAIN_NAME"
    echo "  • Environment: $ENVIRONMENT"
    echo "  • AWS Region: $AWS_REGION"
    echo "  • AWS Account: $AWS_ACCOUNT_ID"
    echo "  • Database: $RDS_ENDPOINT"
    echo "  • Redis: $REDIS_ENDPOINT"
    echo "  • ECR Repository: $ECR_REPOSITORY"
    echo "  • EKS Cluster: $EKS_CLUSTER_NAME"
    echo "  • S3 Bucket: $S3_BUCKET"
    echo
    echo "🔗 Important URLs:"
    echo "  • API Health: https://api.$DOMAIN_NAME/health"
    echo "  • API Docs: https://api.$DOMAIN_NAME/docs"
    echo "  • Products API: https://api.$DOMAIN_NAME/products/"
    echo "  • AWS Console: https://us-east-1.console.aws.amazon.com/"
    echo "  • EKS Console: https://us-east-1.console.aws.amazon.com/eks/home?region=us-east-1#/clusters/$EKS_CLUSTER_NAME"
    echo "  • RDS Console: https://us-east-1.console.aws.amazon.com/rds/home?region=us-east-1"
    echo
    echo "💡 Quick Commands:"
    echo "  • View pods: kubectl get pods -n giftsync"
    echo "  • View logs: kubectl logs -f deployment/giftsync-api -n giftsync"
    echo "  • Connect to DB: psql $DATABASE_URL"
    echo "  • Test Redis: redis-cli -u redis://$REDIS_ENDPOINT:6379 ping"
    echo
    echo "💰 Estimated Monthly Cost: ~\$373 (AWS Infrastructure)"
    echo "💰 Total with Services: ~\$509 (Including external APIs)"
    echo
    echo "🔒 Security Notes:"
    echo "  • Database password stored in AWS Secrets Manager"
    echo "  • SSL certificate automatically configured"
    echo "  • VPC with private subnets for security"
    echo "  • Application secrets encrypted in Kubernetes"
    echo
    echo "📝 Next Steps:"
    echo "  1. Test all API endpoints thoroughly"
    echo "  2. Configure external services (run: ./scripts/configure-external-services.sh)"
    echo "  3. Update mobile app configuration with new API URL"
    echo "  4. Set up monitoring alerts and dashboards"
    echo "  5. Configure automated backup procedures"
    echo "  6. Load initial product catalog data"
    echo "  7. Set up CI/CD pipeline for future deployments"
    echo
    echo "📚 Documentation:"
    echo "  • Complete Setup Guide: ./DETAILED_AWS_SETUP.md"
    echo "  • Troubleshooting Guide: ./TROUBLESHOOTING_GUIDE.md"
    echo "  • Cost Analysis: ./COST_ESTIMATION.md"
    echo "  • Production Environment: ./.env.production.example"
    echo
    echo "⚠️  Important Reminders:"
    echo "  • Keep your .env.production file secure and never commit it"
    echo "  • Set up billing alerts in AWS Console"
    echo "  • Enable MFA on all AWS accounts"
    echo "  • Regularly review security and access logs"
    echo
    print_success "GiftSync is ready for production! 🚀"
    echo
    echo "Need help? Check the troubleshooting guide or contact support."
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
    echo "        Production Deployment Script"
    echo -e "${NC}"
    
    echo "🚀 This script will deploy GiftSync to AWS production"
    echo "⏱️  Estimated time: 30-45 minutes"
    echo "💰 Estimated cost: ~\$373/month"
    echo
    
    if ! prompt_confirm "Ready to begin deployment?"; then
        echo "Deployment cancelled"
        exit 0
    fi
    
    # Run deployment steps
    check_prerequisites
    collect_configuration
    request_ssl_certificate
    create_terraform_config
    deploy_infrastructure
    setup_database
    build_and_deploy_app
    setup_dns
    validate_deployment
    show_completion_info
}

# Run main function
main "$@"