# Complete AWS Setup Guide for GiftSync Production

This guide will walk you through every single step to deploy GiftSync to AWS production, from account creation to live application.

## Table of Contents
1. [AWS Account Setup](#1-aws-account-setup)
2. [Domain and SSL Configuration](#2-domain-and-ssl-configuration)
3. [AWS CLI and Terraform Setup](#3-aws-cli-and-terraform-setup)
4. [Infrastructure Deployment](#4-infrastructure-deployment)
5. [Database Configuration](#5-database-configuration)
6. [Container Registry Setup](#6-container-registry-setup)
7. [Kubernetes Cluster Setup](#7-kubernetes-cluster-setup)
8. [Application Deployment](#8-application-deployment)
9. [DNS and Load Balancer Configuration](#9-dns-and-load-balancer-configuration)
10. [Monitoring and Logging](#10-monitoring-and-logging)
11. [Security Configuration](#11-security-configuration)
12. [Testing and Validation](#12-testing-and-validation)

---

## 1. AWS Account Setup

### 1.1 Create AWS Account
1. Go to https://aws.amazon.com/
2. Click "Create an AWS Account"
3. Enter email address (use a business email like `admin@yourdomain.com`)
4. Choose "Professional" account type
5. Enter company information:
   - Company name: "Your Company Name"
   - Phone number: Your business phone
   - Address: Your business address
6. Enter payment method (credit card required)
7. Choose "Basic Support Plan" (free)
8. Complete phone verification
9. Wait for account activation email (usually immediate)

### 1.2 Secure Root Account
```bash
# Immediately after account creation:
```
1. **Enable MFA on root account**:
   - Go to AWS Console → IAM → My Security Credentials
   - Click "Assign MFA device"
   - Choose "Virtual MFA device"
   - Use Google Authenticator or Authy
   - Scan QR code and enter two consecutive codes

2. **Create IAM Admin User**:
   - Go to IAM → Users → Add users
   - Username: `giftsync-admin`
   - Access type: ✅ Programmatic access, ✅ AWS Management Console access
   - Console password: ✅ Custom password (use strong password)
   - Require password reset: ❌ (uncheck)
   - Next: Permissions
   - Attach existing policies: `AdministratorAccess`
   - Next: Tags (skip)
   - Next: Review → Create user
   - **SAVE THE ACCESS KEYS** - download CSV file immediately

3. **Set up billing alerts**:
   - Go to Billing & Cost Management → Budgets
   - Create budget:
     - Budget type: Cost budget
     - Budget name: `giftsync-monthly-budget`
     - Budgeted amount: $500 (or your preferred limit)
     - Alert thresholds: 80%, 100%, 120%
     - Email: your email address

### 1.3 Configure AWS CLI
```bash
# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
sudo ./aws/install

# Verify installation
aws --version
# Should show: aws-cli/2.x.x

# Configure AWS CLI with your IAM admin user credentials
aws configure
# AWS Access Key ID: (from downloaded CSV)
# AWS Secret Access Key: (from downloaded CSV)
# Default region name: us-east-1
# Default output format: json

# Test configuration
aws sts get-caller-identity
# Should show your user ARN
```

---

## 2. Domain and SSL Configuration

### 2.1 Purchase Domain (if you don't have one)
**Option A: Buy through AWS Route 53**
1. Go to Route 53 → Registered domains → Register domain
2. Search for your domain (e.g., `giftsync.com`)
3. Add to cart ($12/year for .com)
4. Enter registrant contact info
5. Review and purchase

**Option B: Use existing domain**
1. Go to Route 53 → Hosted zones → Create hosted zone
2. Domain name: `yourdomain.com`
3. Type: Public hosted zone
4. Create hosted zone
5. Note the 4 name servers (NS records)
6. Update your domain registrar to use these name servers

### 2.2 Request SSL Certificate
```bash
# Request wildcard certificate for your domain
aws acm request-certificate \
    --domain-name "yourdomain.com" \
    --subject-alternative-names "*.yourdomain.com" \
    --validation-method DNS \
    --region us-east-1

# Get the certificate ARN (save this!)
aws acm list-certificates --region us-east-1
```

1. **Validate certificate**:
   - Go to AWS Console → Certificate Manager → Your certificate
   - Click "Create record in Route 53" for domain validation
   - Wait 5-30 minutes for validation to complete
   - Status should change to "Issued"

2. **Note your certificate ARN** (you'll need this later):
   ```
   arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012
   ```

---

## 3. AWS CLI and Terraform Setup

### 3.1 Install Terraform
```bash
# Ubuntu/Debian
wget -O- https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# macOS
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify installation
terraform version
# Should show: Terraform v1.x.x
```

### 3.2 Install kubectl
```bash
# Ubuntu/Debian
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# macOS
brew install kubectl

# Verify installation
kubectl version --client
```

### 3.3 Install Docker
```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
# Log out and back in for group changes

# macOS
brew install docker
# Or download Docker Desktop

# Verify installation
docker --version
```

---

## 4. Infrastructure Deployment

### 4.1 Prepare Terraform Configuration
```bash
cd infrastructure/terraform

# Copy and edit the production variables
cp environments/production.tfvars.example environments/production.tfvars
```

**Edit `environments/production.tfvars` with your actual values:**
```hcl
# environments/production.tfvars

# General Configuration
environment = "production"
project_name = "giftsync"
region = "us-east-1"

# Your AWS Account ID (get with: aws sts get-caller-identity)
aws_account_id = "123456789012"

# Domain Configuration - CHANGE THESE
domain_name = "yourdomain.com"
api_subdomain = "api"
app_subdomain = "app"

# SSL Certificate ARN - CHANGE THIS
certificate_arn = "arn:aws:acm:us-east-1:123456789012:certificate/your-cert-id"

# Networking
vpc_cidr = "10.0.0.0/16"
availability_zones = ["us-east-1a", "us-east-1b", "us-east-1c"]

# EKS Configuration (start small, scale later)
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

# Monitoring
enable_cloudwatch_logs = true
log_retention_in_days = 14

# Tags
tags = {
  Environment = "production"
  Project     = "giftsync"
  Owner       = "your-name"
  ManagedBy   = "terraform"
}
```

### 4.2 Initialize and Deploy Terraform
```bash
# Initialize Terraform
terraform init

# Validate configuration
terraform validate

# Plan deployment (review everything carefully)
terraform plan -var-file="environments/production.tfvars"

# If plan looks good, apply
terraform apply -var-file="environments/production.tfvars"
```

**This will create:**
- VPC with public/private subnets across 3 AZs
- Internet Gateway and NAT Gateways
- EKS cluster with managed node group
- RDS PostgreSQL instance
- ElastiCache Redis cluster
- ECR repository for container images
- S3 bucket for assets
- CloudWatch log groups
- Security groups with proper access rules
- IAM roles and policies

**Expected deployment time: 15-20 minutes**

### 4.3 Save Important Outputs
```bash
# After deployment completes, save these values:
terraform output rds_endpoint
terraform output redis_endpoint
terraform output ecr_repository_url
terraform output eks_cluster_name
terraform output s3_bucket_name

# Example outputs:
# rds_endpoint = "giftsync-prod.abc123.us-east-1.rds.amazonaws.com"
# redis_endpoint = "giftsync-prod.def456.cache.amazonaws.com"
# ecr_repository_url = "123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api"
```

---

## 5. Database Configuration

### 5.1 Generate Database Password
```bash
# Generate a secure password
openssl rand -base64 32
# Example: K7mN9pQ2rS8tU5vW1xY3zA6bC9dE2fG4hJ5kL8mN0pQ=
# SAVE THIS PASSWORD - you'll need it multiple times
```

### 5.2 Set Database Password in AWS Secrets Manager
```bash
# Store database password securely
aws secretsmanager create-secret \
    --name "giftsync/prod/database-password" \
    --description "GiftSync production database password" \
    --secret-string "K7mN9pQ2rS8tU5vW1xY3zA6bC9dE2fG4hJ5kL8mN0pQ="

# Get the secret ARN (save this)
aws secretsmanager describe-secret --secret-id "giftsync/prod/database-password"
```

### 5.3 Connect to Database and Set Up Schema
```bash
# Install PostgreSQL client
sudo apt-get install postgresql-client  # Ubuntu
brew install postgresql                  # macOS

# Get RDS endpoint from Terraform
RDS_ENDPOINT=$(terraform output -raw rds_endpoint)
echo "RDS Endpoint: $RDS_ENDPOINT"

# Connect to database (use password from step 5.1)
psql -h $RDS_ENDPOINT -U giftsync_admin -d postgres

# Once connected, create application database and user:
```

```sql
-- In psql session:
CREATE DATABASE giftsync_prod;
CREATE USER giftsync_user WITH ENCRYPTED PASSWORD 'K7mN9pQ2rS8tU5vW1xY3zA6bC9dE2fG4hJ5kL8mN0pQ=';
GRANT ALL PRIVILEGES ON DATABASE giftsync_prod TO giftsync_user;

-- Grant additional permissions
\c giftsync_prod;
GRANT ALL ON SCHEMA public TO giftsync_user;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO giftsync_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO giftsync_user;

-- Exit psql
\q
```

### 5.4 Run Database Migrations
```bash
cd ../../backend

# Set up Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Set database URL for migrations
export DATABASE_URL="postgresql://giftsync_user:K7mN9pQ2rS8tU5vW1xY3zA6bC9dE2fG4hJ5kL8mN0pQ=@$RDS_ENDPOINT:5432/giftsync_prod"

# Run migrations
alembic upgrade head

# Verify tables were created
psql $DATABASE_URL -c "\dt"
# Should show: users, products, categories, etc.

# Load initial data
python scripts/load_initial_data.py
```

---

## 6. Container Registry Setup

### 6.1 Configure ECR
```bash
# Get ECR repository URL from Terraform
ECR_REPO=$(terraform output -raw ecr_repository_url)
echo "ECR Repository: $ECR_REPO"

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REPO
```

### 6.2 Build and Push Application Image
```bash
cd backend

# Build production Docker image
docker build -f Dockerfile.prod -t giftsync-api:latest .

# Tag for ECR
docker tag giftsync-api:latest $ECR_REPO:latest
docker tag giftsync-api:latest $ECR_REPO:v1.0.0

# Push to ECR
docker push $ECR_REPO:latest
docker push $ECR_REPO:v1.0.0

# Verify push
aws ecr describe-images --repository-name giftsync-api --region us-east-1
```

---

## 7. Kubernetes Cluster Setup

### 7.1 Configure kubectl for EKS
```bash
# Get cluster name from Terraform
CLUSTER_NAME=$(terraform output -raw eks_cluster_name)
echo "EKS Cluster: $CLUSTER_NAME"

# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name $CLUSTER_NAME

# Verify connection
kubectl get nodes
# Should show 2 nodes in Ready state

# Check cluster info
kubectl cluster-info
```

### 7.2 Install AWS Load Balancer Controller
```bash
# Download IAM policy
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json

# Create IAM policy
aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

# Get your AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)

# Create service account
eksctl create iamserviceaccount \
  --cluster=$CLUSTER_NAME \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --role-name AmazonEKSLoadBalancerControllerRole \
  --attach-policy-arn=arn:aws:iam::$AWS_ACCOUNT_ID:policy/AWSLoadBalancerControllerIAMPolicy \
  --approve

# Install AWS Load Balancer Controller
helm repo add eks https://aws.github.io/eks-charts
helm repo update
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=$CLUSTER_NAME \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Verify installation
kubectl get deployment -n kube-system aws-load-balancer-controller
```

---

## 8. Application Deployment

### 8.1 Prepare Environment Variables
```bash
cd ../../

# Copy environment template
cp .env.production.example .env.production
```

**Edit `.env.production` with your actual values:**
```bash
# Database (use your actual values)
DATABASE_URL=postgresql://giftsync_user:K7mN9pQ2rS8tU5vW1xY3zA6bC9dE2fG4hJ5kL8mN0pQ=@giftsync-prod.abc123.us-east-1.rds.amazonaws.com:5432/giftsync_prod
REDIS_URL=redis://giftsync-prod.def456.cache.amazonaws.com:6379

# Security (generate these)
SECRET_KEY=$(openssl rand -base64 32)
JWT_SECRET_KEY=$(openssl rand -base64 32)

# AWS
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=giftsync-prod-assets-abc123

# External APIs (you'll need to sign up for these)
MIXPANEL_TOKEN=your-mixpanel-token
SENTRY_DSN=your-sentry-dsn
SENDGRID_API_KEY=your-sendgrid-key
```

### 8.2 Create Kubernetes Secrets
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets (encode values with base64)
# Helper function to encode
b64encode() { echo -n "$1" | base64; }

# Update k8s/secrets.yaml with base64 encoded values
cat > k8s/secrets.yaml << EOF
apiVersion: v1
kind: Secret
metadata:
  name: giftsync-secrets
  namespace: giftsync
type: Opaque
data:
  database-url: $(b64encode "postgresql://giftsync_user:K7mN9pQ2rS8tU5vW1xY3zA6bC9dE2fG4hJ5kL8mN0pQ=@$RDS_ENDPOINT:5432/giftsync_prod")
  secret-key: $(b64encode "$(openssl rand -base64 32)")
  jwt-secret: $(b64encode "$(openssl rand -base64 32)")
  redis-url: $(b64encode "redis://$(terraform output -raw redis_endpoint):6379")
  aws-access-key: $(b64encode "$AWS_ACCESS_KEY_ID")
  aws-secret-key: $(b64encode "$AWS_SECRET_ACCESS_KEY")
  mixpanel-token: $(b64encode "your-mixpanel-token")
  sentry-dsn: $(b64encode "your-sentry-dsn")
EOF

# Apply secrets
kubectl apply -f k8s/secrets.yaml
```

### 8.3 Update Kubernetes Manifests
```bash
# Update deployment.yaml with your ECR repository
sed -i "s|123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api:latest|$ECR_REPO:latest|g" k8s/deployment.yaml

# Update ingress.yaml with your certificate ARN and domain
CERT_ARN=$(terraform output -raw certificate_arn)
sed -i "s|arn:aws:acm:us-east-1:123456789012:certificate/12345678-1234-1234-1234-123456789012|$CERT_ARN|g" k8s/ingress.yaml
sed -i "s|api.giftsync.com|api.yourdomain.com|g" k8s/ingress.yaml
```

### 8.4 Deploy Application
```bash
# Apply all Kubernetes manifests
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Wait for deployment to be ready
kubectl wait --for=condition=available --timeout=300s deployment/giftsync-api -n giftsync

# Check deployment status
kubectl get pods -n giftsync
kubectl get services -n giftsync
kubectl get ingress -n giftsync

# Check logs
kubectl logs -f deployment/giftsync-api -n giftsync
```

---

## 9. DNS and Load Balancer Configuration

### 9.1 Get Load Balancer DNS Name
```bash
# Get the ALB DNS name
ALB_DNS=$(kubectl get ingress giftsync-ingress -n giftsync -o jsonpath='{.status.loadBalancer.ingress[0].hostname}')
echo "ALB DNS: $ALB_DNS"

# This will be something like:
# k8s-giftsync-giftsync-abc123def456-1234567890.us-east-1.elb.amazonaws.com
```

### 9.2 Create Route 53 Records
```bash
# Get hosted zone ID
HOSTED_ZONE_ID=$(aws route53 list-hosted-zones-by-name --dns-name yourdomain.com --query 'HostedZones[0].Id' --output text | cut -d'/' -f3)

# Create A record for API subdomain
cat > change-batch.json << EOF
{
  "Changes": [
    {
      "Action": "CREATE",
      "ResourceRecordSet": {
        "Name": "api.yourdomain.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "$ALB_DNS",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "Z35SXDOTRQ7X7K"
        }
      }
    }
  ]
}
EOF

# Apply DNS change
aws route53 change-resource-record-sets \
  --hosted-zone-id $HOSTED_ZONE_ID \
  --change-batch file://change-batch.json

# Wait for change to propagate (5-10 minutes)
# Check DNS propagation
nslookup api.yourdomain.com
```

### 9.3 Test API Access
```bash
# Test API health endpoint
curl https://api.yourdomain.com/health

# Should return:
# {"status":"healthy","timestamp":"2024-01-01T12:00:00Z"}

# Test API docs
# Visit: https://api.yourdomain.com/docs
```

---

## 10. Monitoring and Logging

### 10.1 Set Up CloudWatch Container Insights
```bash
# Install CloudWatch agent
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cloudwatch-namespace.yaml

kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cwagent/cwagent-daemonset.yaml

kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/fluentd/fluentd-daemonset-cloudwatch.yaml

# Verify installation
kubectl get pods -n amazon-cloudwatch
```

### 10.2 Create CloudWatch Dashboard
1. Go to CloudWatch → Dashboards → Create dashboard
2. Dashboard name: `GiftSync-Production`
3. Add widgets:
   - **API Response Time**: Custom metric from application logs
   - **Database Connections**: RDS metrics
   - **EKS Cluster Health**: Container Insights metrics
   - **Error Rate**: Application error logs

### 10.3 Set Up Alerts
```bash
# Create SNS topic for alerts
aws sns create-topic --name giftsync-alerts

# Subscribe your email
aws sns subscribe \
  --topic-arn arn:aws:sns:us-east-1:123456789012:giftsync-alerts \
  --protocol email \
  --notification-endpoint your-email@domain.com

# Create CloudWatch alarms
aws cloudwatch put-metric-alarm \
  --alarm-name "GiftSync-API-HighErrorRate" \
  --alarm-description "Alert when API error rate is high" \
  --metric-name "4XXError" \
  --namespace "AWS/ApplicationELB" \
  --statistic "Sum" \
  --period 300 \
  --threshold 10 \
  --comparison-operator "GreaterThanThreshold" \
  --evaluation-periods 2 \
  --alarm-actions arn:aws:sns:us-east-1:123456789012:giftsync-alerts
```

---

## 11. Security Configuration

### 11.1 Enable VPC Flow Logs
```bash
# Create IAM role for VPC Flow Logs
aws iam create-role \
  --role-name flowlogsRole \
  --assume-role-policy-document '{
    "Version": "2012-10-17",
    "Statement": [
      {
        "Effect": "Allow",
        "Principal": {
          "Service": "vpc-flow-logs.amazonaws.com"
        },
        "Action": "sts:AssumeRole"
      }
    ]
  }'

# Attach policy
aws iam attach-role-policy \
  --role-name flowlogsRole \
  --policy-arn arn:aws:iam::aws:policy/service-role/VPCFlowLogsDeliveryRolePolicy

# Enable VPC Flow Logs
VPC_ID=$(terraform output -raw vpc_id)
aws ec2 create-flow-logs \
  --resource-type VPC \
  --resource-ids $VPC_ID \
  --traffic-type ALL \
  --log-destination-type cloud-watch-logs \
  --log-group-name /aws/vpc/flowlogs
```

### 11.2 Enable GuardDuty
```bash
# Enable GuardDuty
aws guardduty create-detector --enable

# Get detector ID
DETECTOR_ID=$(aws guardduty list-detectors --query 'DetectorIds[0]' --output text)

# Configure findings export (optional)
aws guardduty create-publishing-destination \
  --detector-id $DETECTOR_ID \
  --destination-type S3 \
  --destination-properties DestinationArn=arn:aws:s3:::your-security-bucket,KmsKeyArn=arn:aws:kms:us-east-1:123456789012:key/your-key-id
```

### 11.3 Configure WAF (Web Application Firewall)
```bash
# Create WAF ACL
aws wafv2 create-web-acl \
  --scope REGIONAL \
  --default-action Allow={} \
  --name GiftSyncWAF \
  --description "WAF for GiftSync API" \
  --rules '[
    {
      "Name": "RateLimitRule",
      "Priority": 1,
      "Statement": {
        "RateBasedStatement": {
          "Limit": 2000,
          "AggregateKeyType": "IP"
        }
      },
      "Action": {
        "Block": {}
      },
      "VisibilityConfig": {
        "SampledRequestsEnabled": true,
        "CloudWatchMetricsEnabled": true,
        "MetricName": "RateLimitRule"
      }
    }
  ]'

# Associate WAF with ALB (get ALB ARN first)
ALB_ARN=$(aws elbv2 describe-load-balancers --query 'LoadBalancers[?contains(LoadBalancerName, `k8s-giftsync`)].LoadBalancerArn' --output text)

aws wafv2 associate-web-acl \
  --web-acl-arn arn:aws:wafv2:us-east-1:123456789012:regional/webacl/GiftSyncWAF/12345678-1234-1234-1234-123456789012 \
  --resource-arn $ALB_ARN
```

---

## 12. Testing and Validation

### 12.1 API Testing
```bash
# Test health endpoint
curl https://api.yourdomain.com/health

# Test API documentation
curl https://api.yourdomain.com/docs

# Test user registration
curl -X POST https://api.yourdomain.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Test",
    "last_name": "User",
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Test login
curl -X POST https://api.yourdomain.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPassword123!"
  }'

# Test products endpoint
curl https://api.yourdomain.com/products/
```

### 12.2 Database Testing
```bash
# Connect to database and verify data
psql $DATABASE_URL -c "SELECT count(*) FROM users;"
psql $DATABASE_URL -c "SELECT count(*) FROM products;"
psql $DATABASE_URL -c "SELECT count(*) FROM categories;"
```

### 12.3 Load Testing
```bash
# Install artillery for load testing
npm install -g artillery

# Create load test config
cat > load-test.yml << EOF
config:
  target: 'https://api.yourdomain.com'
  phases:
    - duration: 60
      arrivalRate: 5
scenarios:
  - name: "Health check"
    requests:
      - get:
          url: "/health"
EOF

# Run load test
artillery run load-test.yml
```

### 12.4 Mobile App Configuration
```bash
cd mobile

# Update API base URL
# Edit lib/core/constants/app_constants.dart:
# static const String apiBaseUrl = 'https://api.yourdomain.com';

# Build mobile apps
flutter clean
flutter pub get
flutter build apk --release  # Android
flutter build ios --release  # iOS (requires Mac + Xcode)
```

---

## 13. Final Checklist

### ✅ Infrastructure
- [ ] AWS account set up with MFA
- [ ] Domain purchased and SSL certificate issued
- [ ] Terraform infrastructure deployed
- [ ] EKS cluster running with 2+ nodes
- [ ] RDS database accessible and migrations run
- [ ] ECR repository with application image

### ✅ Application
- [ ] API deployed and accessible via HTTPS
- [ ] Database connections working
- [ ] Initial data loaded (categories, products)
- [ ] Authentication endpoints working
- [ ] API documentation accessible at /docs

### ✅ Security
- [ ] SSL certificate working (https://)
- [ ] WAF configured and associated
- [ ] VPC Flow Logs enabled
- [ ] GuardDuty enabled
- [ ] Secrets stored in AWS Secrets Manager

### ✅ Monitoring
- [ ] CloudWatch Container Insights enabled
- [ ] CloudWatch dashboard created
- [ ] SNS alerts configured
- [ ] Application logging working

### ✅ Testing
- [ ] Health endpoint responding
- [ ] User registration/login working
- [ ] Products API returning data
- [ ] Load testing passed
- [ ] Mobile app can connect to API

---

## 🎉 Congratulations!

Your GiftSync production environment is now fully deployed on AWS! 

**Your API is live at**: `https://api.yourdomain.com`
**API Documentation**: `https://api.yourdomain.com/docs`

### Next Steps:
1. **Deploy mobile apps** to Apple App Store and Google Play Store
2. **Set up external APIs** (Amazon Associates, Mixpanel, etc.)
3. **Configure monitoring alerts** for production
4. **Create backup procedures** for database and assets
5. **Set up CI/CD pipeline** for automated deployments

### Estimated Monthly Cost:
- **Current setup**: ~$373/month
- **With external services**: ~$509/month

Your production-ready GiftSync platform is now ready to start collecting users and generating revenue! 🚀