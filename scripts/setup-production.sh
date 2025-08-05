#!/bin/bash
set -e

echo "🚀 Setting up aclue Production Environment"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if required tools are installed
    commands=("aws" "terraform" "kubectl" "docker")
    for cmd in "${commands[@]}"; do
        if ! command -v $cmd &> /dev/null; then
            print_error "$cmd is not installed. Please install it first."
            exit 1
        fi
    done
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials not configured. Run 'aws configure' first."
        exit 1
    fi
    
    print_status "Prerequisites check passed ✓"
}

# Setup environment variables
setup_environment() {
    print_status "Setting up environment variables..."
    
    if [ ! -f ".env.production" ]; then
        print_warning ".env.production not found. Creating template..."
        cp .env.production.example .env.production
        print_warning "Please edit .env.production with your actual values before continuing."
        read -p "Press enter when ready to continue..."
    fi
    
    # Source environment variables
    export $(cat .env.production | grep -v '^#' | xargs)
    print_status "Environment variables loaded ✓"
}

# Deploy infrastructure
deploy_infrastructure() {
    print_status "Deploying AWS infrastructure with Terraform..."
    
    cd infrastructure/terraform
    
    # Initialize Terraform
    terraform init
    
    # Create production.tfvars if it doesn't exist
    if [ ! -f "environments/production.tfvars" ]; then
        print_warning "production.tfvars not found. Creating from template..."
        cp environments/production.tfvars.example environments/production.tfvars
        print_warning "Please edit environments/production.tfvars with your values."
        read -p "Press enter when ready to continue..."
    fi
    
    # Plan and apply
    terraform plan -var-file="environments/production.tfvars"
    
    read -p "Do you want to proceed with infrastructure deployment? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        terraform apply -var-file="environments/production.tfvars" -auto-approve
        print_status "Infrastructure deployed ✓"
    else
        print_warning "Infrastructure deployment skipped"
        exit 1
    fi
    
    cd ../..
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    # Get RDS endpoint from Terraform
    cd infrastructure/terraform
    RDS_ENDPOINT=$(terraform output -raw rds_endpoint 2>/dev/null || echo "")
    cd ../..
    
    if [ -z "$RDS_ENDPOINT" ]; then
        print_error "Could not get RDS endpoint. Make sure infrastructure is deployed."
        exit 1
    fi
    
    print_status "RDS endpoint: $RDS_ENDPOINT"
    
    # Run database migrations
    cd backend
    
    # Install dependencies if not already installed
    if [ ! -d "venv" ]; then
        python -m venv venv
        source venv/bin/activate
        pip install -r requirements.txt
    else
        source venv/bin/activate
    fi
    
    # Run migrations
    alembic upgrade head
    
    # Load initial data
    python scripts/load_initial_data.py
    
    print_status "Database setup complete ✓"
    cd ..
}

# Build and deploy application
deploy_application() {
    print_status "Building and deploying application..."
    
    # Get ECR registry URL
    AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    ECR_REGISTRY="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com"
    
    # Login to ECR
    aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REGISTRY
    
    # Build and push backend image
    cd backend
    docker build -f Dockerfile.prod -t aclue-api:latest .
    docker tag aclue-api:latest $ECR_REGISTRY/aclue-api:latest
    docker push $ECR_REGISTRY/aclue-api:latest
    cd ..
    
    # Update Kubernetes configs with actual values
    sed -i "s/123456789012/$AWS_ACCOUNT_ID/g" k8s/deployment.yaml
    sed -i "s/123456789012/$AWS_ACCOUNT_ID/g" k8s/ingress.yaml
    
    # Configure kubectl for EKS
    aws eks update-kubeconfig --region $AWS_REGION --name aclue-prod-cluster
    
    # Deploy to Kubernetes
    kubectl apply -f k8s/namespace.yaml
    
    # Create secrets (you'll need to update k8s/secrets.yaml with base64 encoded values)
    print_warning "Please update k8s/secrets.yaml with your base64 encoded secrets before continuing."
    print_status "To encode a value: echo -n 'your-value' | base64"
    read -p "Press enter when secrets are updated..."
    
    kubectl apply -f k8s/secrets.yaml
    kubectl apply -f k8s/configmap.yaml
    kubectl apply -f k8s/deployment.yaml
    kubectl apply -f k8s/service.yaml
    kubectl apply -f k8s/ingress.yaml
    
    print_status "Application deployed ✓"
}

# Verify deployment
verify_deployment() {
    print_status "Verifying deployment..."
    
    # Wait for pods to be ready
    kubectl wait --for=condition=ready pod -l app=aclue-api -n aclue --timeout=300s
    
    # Get service status
    kubectl get pods -n aclue
    kubectl get services -n aclue
    kubectl get ingress -n aclue
    
    # Get Load Balancer URL
    ALB_URL=$(kubectl get ingress aclue-ingress -n aclue -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
    
    if [ ! -z "$ALB_URL" ]; then
        print_status "Application Load Balancer URL: $ALB_URL"
        print_status "Set up your DNS to point api.aclue.app to this ALB"
    fi
    
    print_status "Deployment verification complete ✓"
}

# Setup monitoring
setup_monitoring() {
    print_status "Setting up monitoring..."
    
    # CloudWatch Logs
    kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cloudwatch-namespace.yaml
    
    print_status "Monitoring setup complete ✓"
}

# Main execution
main() {
    echo "🎉 Welcome to aclue Production Setup!"
    echo "This script will deploy your complete aclue infrastructure to AWS."
    echo
    
    read -p "Are you ready to proceed? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Setup cancelled by user"
        exit 1
    fi
    
    check_prerequisites
    setup_environment
    deploy_infrastructure
    setup_database
    deploy_application
    verify_deployment
    setup_monitoring
    
    echo
    print_status "🎉 aclue production setup complete!"
    echo
    echo "Next steps:"
    echo "1. Set up your domain DNS to point to the Load Balancer"
    echo "2. Configure SSL certificate in AWS ACM"
    echo "3. Update mobile app configuration with production API URL"
    echo "4. Set up monitoring alerts in CloudWatch"
    echo "5. Configure backup schedules"
    echo
    echo "Your API should be available at: https://api.aclue.app"
    echo "Monitor your deployment: kubectl get pods -n aclue -w"
}

# Run main function
main "$@"