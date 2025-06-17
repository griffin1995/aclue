# GiftSync Production Deployment Guide

## Prerequisites

### Required Accounts & Tools
- AWS Account with billing enabled
- Terraform CLI (v1.0+)
- Docker & Docker Compose
- kubectl (for EKS management)
- awscli v2
- GitHub account for CI/CD

### Required Environment Variables
Create these files with your actual values:

#### `.env.production`
```bash
# Database
DATABASE_URL=postgresql://giftsync_user:SECURE_PASSWORD@giftsync-prod.abc123.us-east-1.rds.amazonaws.com:5432/giftsync_prod
REDIS_URL=redis://giftsync-prod.abc123.cache.amazonaws.com:6379

# API Security
SECRET_KEY=your-super-secure-256-bit-secret-key-here
JWT_SECRET_KEY=another-super-secure-jwt-secret-key

# AWS Configuration
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
S3_BUCKET_NAME=giftsync-prod-assets

# External APIs
AMAZON_API_KEY=your-amazon-affiliate-api-key
COMMISSION_JUNCTION_API_KEY=your-cj-api-key
MIXPANEL_TOKEN=your-mixpanel-project-token

# Email & Notifications
SENDGRID_API_KEY=your-sendgrid-api-key
TWILIO_ACCOUNT_SID=your-twilio-sid
TWILIO_AUTH_TOKEN=your-twilio-token

# Monitoring
SENTRY_DSN=your-sentry-dsn-url
```

#### `.env.mobile`
```bash
API_BASE_URL=https://api.giftsync.com
MIXPANEL_TOKEN=your-mixpanel-token
FIREBASE_PROJECT_ID=giftsync-prod
```

## Step 1: AWS Infrastructure Deployment

### 1.1 Configure AWS CLI
```bash
aws configure
# Enter your AWS Access Key ID, Secret Key, Region (us-east-1), and output format (json)
```

### 1.2 Deploy Infrastructure with Terraform
```bash
cd infrastructure/terraform

# Initialize Terraform
terraform init

# Review and customize variables
cp environments/production.tfvars.example environments/production.tfvars
# Edit the file with your specific values

# Plan deployment
terraform plan -var-file="environments/production.tfvars"

# Deploy (this takes 15-20 minutes)
terraform apply -var-file="environments/production.tfvars"
```

### 1.3 Configure kubectl for EKS
```bash
aws eks update-kubeconfig --region us-east-1 --name giftsync-prod-cluster
kubectl get nodes  # Verify connection
```

## Step 2: Database Setup

### 2.1 RDS PostgreSQL Configuration
The RDS instance is created by Terraform. Connect and set up the database:

```bash
# Get RDS endpoint from Terraform output
terraform output rds_endpoint

# Connect to database (use password from terraform output)
psql -h YOUR_RDS_ENDPOINT -U giftsync_admin -d postgres

# Create application database and user
CREATE DATABASE giftsync_prod;
CREATE USER giftsync_user WITH ENCRYPTED PASSWORD 'your-secure-password';
GRANT ALL PRIVILEGES ON DATABASE giftsync_prod TO giftsync_user;
\q
```

### 2.2 Run Database Migrations
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export DATABASE_URL="postgresql://giftsync_user:PASSWORD@YOUR_RDS_ENDPOINT:5432/giftsync_prod"

# Run migrations
alembic upgrade head

# Verify tables created
psql $DATABASE_URL -c "\dt"
```

### 2.3 Load Initial Data
```bash
# Create sample categories and initial data
python scripts/load_initial_data.py
```

## Step 3: Backend API Deployment

### 3.1 Build and Push Docker Images
```bash
cd backend

# Build production image
docker build -t giftsync-api:latest .

# Tag for ECR (replace with your account ID)
docker tag giftsync-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api:latest

# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Push image
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api:latest
```

### 3.2 Deploy to EKS
```bash
# Apply Kubernetes manifests
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# Verify deployment
kubectl get pods -n giftsync
kubectl get services -n giftsync
```

## Step 4: Domain & SSL Setup

### 4.1 Configure Route 53
```bash
# Get Load Balancer DNS name
kubectl get ingress -n giftsync

# Create Route 53 hosted zone for your domain
aws route53 create-hosted-zone --name giftsync.com --caller-reference $(date +%s)

# Create A record pointing to ALB
# Use AWS Console or CLI to create:
# api.giftsync.com -> ALB DNS name
# app.giftsync.com -> ALB DNS name
```

### 4.2 SSL Certificate with ACM
```bash
# Request certificate
aws acm request-certificate \
  --domain-name giftsync.com \
  --subject-alternative-names "*.giftsync.com" \
  --validation-method DNS \
  --region us-east-1

# Follow email validation or add DNS records as instructed
```

## Step 5: External Service Integration

### 5.1 Amazon Affiliate API
1. Sign up for Amazon Associates program
2. Apply for Product Advertising API access
3. Get Access Key and Secret Key
4. Update environment variables

### 5.2 Firebase Setup (for mobile)
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login and create project
firebase login
firebase projects:create giftsync-prod

# Configure authentication
firebase auth:export --project giftsync-prod

# Update mobile/android/app/google-services.json
# Update mobile/ios/Runner/GoogleService-Info.plist
```

### 5.3 Mixpanel Analytics
1. Create Mixpanel project
2. Get project token
3. Update environment variables

## Step 6: Mobile App Configuration

### 6.1 Update Configuration Files
```bash
cd mobile

# Update pubspec.yaml with production Firebase config
# Update lib/core/constants/app_constants.dart with production API URL

# Generate required files
flutter packages pub run build_runner build --delete-conflicting-outputs
```

### 6.2 Build Production Apps
```bash
# Android
flutter build apk --release
flutter build appbundle --release

# iOS (requires Mac and Xcode)
flutter build ios --release
```

## Step 7: CI/CD Pipeline Setup

### 7.1 GitHub Actions Workflow
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
        run: |
          cd backend
          docker build -t $ECR_REGISTRY/giftsync-api:$GITHUB_SHA .
          docker push $ECR_REGISTRY/giftsync-api:$GITHUB_SHA
          
      - name: Deploy to EKS
        run: |
          aws eks update-kubeconfig --name giftsync-prod-cluster
          kubectl set image deployment/giftsync-api giftsync-api=$ECR_REGISTRY/giftsync-api:$GITHUB_SHA -n giftsync
```

### 7.2 Required GitHub Secrets
Add these to your GitHub repository secrets:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `DATABASE_URL`
- `SECRET_KEY`
- All other production environment variables

## Step 8: Monitoring & Logging

### 8.1 CloudWatch Setup
```bash
# Install CloudWatch agent on EKS
kubectl apply -f https://raw.githubusercontent.com/aws-samples/amazon-cloudwatch-container-insights/latest/k8s-deployment-manifest-templates/deployment-mode/daemonset/container-insights-monitoring/cloudwatch-namespace.yaml

# Configure log groups
aws logs create-log-group --log-group-name /aws/eks/giftsync-prod/cluster
```

### 8.2 Application Monitoring
- **Sentry**: Error tracking and performance monitoring
- **Mixpanel**: User behavior analytics
- **CloudWatch**: Infrastructure metrics
- **Custom Dashboards**: Business metrics tracking

## Step 9: Security Hardening

### 9.1 Network Security
- VPC with private subnets for databases
- Security groups with minimal required access
- WAF rules for DDoS protection
- SSL/TLS encryption everywhere

### 9.2 Application Security
```bash
# Rotate secrets regularly
aws secretsmanager rotate-secret --secret-id prod/giftsync/database-password

# Enable GuardDuty
aws guardduty create-detector --enable

# Configure backup encryption
aws rds modify-db-instance --db-instance-identifier giftsync-prod --storage-encrypted
```

## Step 10: Testing & Validation

### 10.1 Health Checks
```bash
# API health check
curl https://api.giftsync.com/health

# Database connectivity
kubectl exec -it deployment/giftsync-api -n giftsync -- python -c "
from app.core.database import db_manager
import asyncio
result = asyncio.run(db_manager.health_check())
print('Database:', 'OK' if result else 'FAILED')
"

# Redis connectivity
kubectl exec -it deployment/giftsync-api -n giftsync -- redis-cli -h YOUR_REDIS_ENDPOINT ping
```

### 10.2 Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load tests
artillery quick --count 10 --num 100 https://api.giftsync.com/health
```

## Estimated Costs (Monthly)

### AWS Infrastructure
- **EKS Cluster**: $73/month
- **RDS PostgreSQL (db.t3.medium)**: $85/month  
- **ElastiCache Redis (cache.t3.micro)**: $15/month
- **ALB**: $23/month
- **S3 + CloudFront**: $10-50/month
- **Route 53**: $0.50/month
- **Total**: ~$200-250/month

### External Services
- **Firebase**: $0-25/month (depending on usage)
- **Mixpanel**: $0-89/month (free tier available)
- **Sentry**: $0-26/month (free tier available)
- **SendGrid**: $15-30/month
- **Total**: ~$15-170/month

### **Grand Total: $215-420/month**

## Scaling Considerations

### Horizontal Scaling
- EKS auto-scaling groups
- RDS read replicas
- Redis cluster mode
- CDN for global distribution

### Performance Optimization
- Database indexing and query optimization
- Redis caching strategy
- Image optimization and lazy loading
- API response caching

## Backup & Disaster Recovery

### Automated Backups
- RDS automated backups (7-day retention)
- S3 cross-region replication
- Database dump exports to S3
- Infrastructure as Code in Git

### Recovery Procedures
- RDS point-in-time recovery
- Infrastructure recreation via Terraform
- Application deployment via CI/CD
- Data migration procedures

## Support & Maintenance

### Regular Tasks
- Security patches and updates
- Database maintenance windows
- Cost optimization reviews
- Performance monitoring
- Backup validation

### Monitoring Alerts
- API response times > 500ms
- Database CPU > 80%
- Error rates > 1%
- Failed deployments
- Security incidents

This guide provides a complete production setup. Start with the infrastructure deployment and work through each step systematically. Each component can be deployed and tested independently before moving to the next.