# GiftSync Production Troubleshooting Guide

This guide covers common issues you might encounter during deployment and how to resolve them.

## Common Deployment Issues

### 1. Terraform Deployment Failures

#### Issue: "Insufficient capacity" error
```
Error: error creating EKS Node Group: InvalidParameterException: 
Insufficient capacity in availability zone us-east-1a
```
**Solution:**
```bash
# Try different availability zones
# Edit environments/production.tfvars:
availability_zones = ["us-east-1b", "us-east-1c", "us-east-1d"]

# Or use different instance types
node_instance_types = ["t3.small", "t3.medium"]
```

#### Issue: Certificate validation timeout
```
Error: error waiting for ACM Certificate validation: timeout while waiting for state to become 'ISSUED'
```
**Solution:**
```bash
# Manually validate certificate in AWS Console
# Go to Certificate Manager → Your certificate → Create record in Route 53
# Wait 5-30 minutes for validation

# Or request certificate manually:
aws acm request-certificate \
    --domain-name "yourdomain.com" \
    --subject-alternative-names "*.yourdomain.com" \
    --validation-method DNS \
    --region us-east-1
```

#### Issue: EKS cluster creation timeout
```
Error: timeout while waiting for state to become 'ACTIVE'
```
**Solution:**
```bash
# Check EKS cluster status in AWS Console
aws eks describe-cluster --name giftsync-prod-cluster

# If cluster is in failed state, destroy and recreate:
terraform destroy -target=aws_eks_cluster.main -var-file="environments/production.tfvars"
terraform apply -target=aws_eks_cluster.main -var-file="environments/production.tfvars"
```

### 2. Database Connection Issues

#### Issue: "Connection refused" to RDS
```
psql: error: connection to server at "..." failed: Connection refused
```
**Solution:**
```bash
# Check security group rules
aws ec2 describe-security-groups --group-ids sg-xxx

# Verify RDS is running
aws rds describe-db-instances --db-instance-identifier giftsync-prod

# Test from EC2 instance in same VPC:
aws ec2 run-instances \
    --image-id ami-0abcdef1234567890 \
    --instance-type t3.micro \
    --subnet-id subnet-xxx \
    --security-group-ids sg-xxx
```

#### Issue: "Authentication failed" for database
```
psql: error: FATAL: password authentication failed for user "giftsync_user"
```
**Solution:**
```bash
# Reset password in AWS Secrets Manager
aws secretsmanager update-secret \
    --secret-id "giftsync/prod/database-password" \
    --secret-string "new-secure-password"

# Update RDS master password
aws rds modify-db-instance \
    --db-instance-identifier giftsync-prod \
    --master-user-password "new-secure-password" \
    --apply-immediately
```

### 3. EKS and Kubernetes Issues

#### Issue: "kubectl: command not found" or connection issues
```bash
# Install kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Update kubeconfig
aws eks update-kubeconfig --region us-east-1 --name giftsync-prod-cluster

# Test connection
kubectl get nodes
```

#### Issue: Pods stuck in "Pending" state
```bash
# Check pod events
kubectl describe pod POD_NAME -n giftsync

# Common causes and solutions:
# 1. Resource constraints
kubectl get nodes
kubectl describe nodes

# 2. Image pull issues
kubectl logs POD_NAME -n giftsync

# 3. Security group issues
kubectl get events -n giftsync --sort-by='.lastTimestamp'
```

#### Issue: "ImagePullBackOff" errors
```bash
# Check ECR repository and image
aws ecr describe-repositories
aws ecr describe-images --repository-name giftsync-api

# Re-login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 123456789012.dkr.ecr.us-east-1.amazonaws.com

# Rebuild and push image
cd backend
docker build -f Dockerfile.prod -t giftsync-api:latest .
docker tag giftsync-api:latest 123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api:latest
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/giftsync-api:latest
```

### 4. Load Balancer and Ingress Issues

#### Issue: Ingress not getting external IP
```bash
# Check AWS Load Balancer Controller
kubectl get deployment -n kube-system aws-load-balancer-controller

# If not installed, install it:
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.5.4/docs/install/iam_policy.json

aws iam create-policy \
    --policy-name AWSLoadBalancerControllerIAMPolicy \
    --policy-document file://iam_policy.json

# Install via Helm
helm repo add eks https://aws.github.io/eks-charts
helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=giftsync-prod-cluster
```

#### Issue: SSL certificate not working
```bash
# Check certificate status
aws acm describe-certificate --certificate-arn YOUR_CERT_ARN

# Verify certificate ARN in ingress
kubectl get ingress giftsync-ingress -n giftsync -o yaml

# Update ingress with correct certificate ARN
kubectl edit ingress giftsync-ingress -n giftsync
```

### 5. DNS and Domain Issues

#### Issue: Domain not resolving to load balancer
```bash
# Check Route 53 records
aws route53 list-resource-record-sets --hosted-zone-id YOUR_ZONE_ID

# Get load balancer DNS name
kubectl get ingress giftsync-ingress -n giftsync

# Create/update A record
aws route53 change-resource-record-sets \
  --hosted-zone-id YOUR_ZONE_ID \
  --change-batch '{
    "Changes": [{
      "Action": "UPSERT",
      "ResourceRecordSet": {
        "Name": "api.yourdomain.com",
        "Type": "A",
        "AliasTarget": {
          "DNSName": "k8s-giftsync-abc123.us-east-1.elb.amazonaws.com",
          "EvaluateTargetHealth": false,
          "HostedZoneId": "Z35SXDOTRQ7X7K"
        }
      }
    }]
  }'

# Test DNS propagation
nslookup api.yourdomain.com
dig api.yourdomain.com
```

## Application-Specific Issues

### 6. API Health Check Failures

#### Issue: API returns 500 errors
```bash
# Check application logs
kubectl logs -f deployment/giftsync-api -n giftsync

# Check database connectivity from pod
kubectl exec -it deployment/giftsync-api -n giftsync -- psql $DATABASE_URL -c "SELECT 1;"

# Check Redis connectivity
kubectl exec -it deployment/giftsync-api -n giftsync -- redis-cli -u $REDIS_URL ping
```

#### Issue: Database migration errors
```bash
# Connect to pod and run migrations manually
kubectl exec -it deployment/giftsync-api -n giftsync -- bash

# Inside pod:
cd /app
alembic current
alembic upgrade head

# If migrations fail, check database permissions:
psql $DATABASE_URL -c "GRANT ALL PRIVILEGES ON DATABASE giftsync_prod TO giftsync_user;"
```

### 7. Performance Issues

#### Issue: Slow API responses
```bash
# Check database performance
aws rds describe-db-instances --db-instance-identifier giftsync-prod

# Monitor CloudWatch metrics
aws cloudwatch get-metric-statistics \
    --namespace AWS/RDS \
    --metric-name CPUUtilization \
    --dimensions Name=DBInstanceIdentifier,Value=giftsync-prod \
    --statistics Average \
    --start-time 2024-01-01T00:00:00Z \
    --end-time 2024-01-01T12:00:00Z \
    --period 3600

# Scale up if needed
aws rds modify-db-instance \
    --db-instance-identifier giftsync-prod \
    --db-instance-class db.r5.large \
    --apply-immediately
```

#### Issue: High memory usage
```bash
# Check pod resources
kubectl top pods -n giftsync
kubectl describe pod POD_NAME -n giftsync

# Update resource limits in deployment
kubectl edit deployment giftsync-api -n giftsync

# Add/modify resources:
resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1000m"
```

## External Service Issues

### 8. AWS Services Configuration

#### Issue: S3 bucket access denied
```bash
# Check bucket policy
aws s3api get-bucket-policy --bucket giftsync-prod-assets

# Update bucket policy for application access
aws s3api put-bucket-policy --bucket giftsync-prod-assets --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "AllowApplicationAccess",
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::123456789012:role/giftsync-app-role"
      },
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::giftsync-prod-assets/*"
    }
  ]
}'
```

#### Issue: CloudWatch logs not appearing
```bash
# Check log group exists
aws logs describe-log-groups --log-group-name-prefix /aws/eks/giftsync

# Create log group if missing
aws logs create-log-group --log-group-name /aws/eks/giftsync-prod

# Check pod logs are being generated
kubectl logs deployment/giftsync-api -n giftsync --tail=100
```

### 9. Mobile App Connection Issues

#### Issue: Mobile app can't connect to API
```bash
# Test API from mobile network
curl -I https://api.yourdomain.com/health

# Check CORS headers
curl -H "Origin: https://app.yourdomain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: X-Requested-With" \
     -X OPTIONS \
     https://api.yourdomain.com/auth/login

# Update CORS settings in application
# Edit backend/app/main.py:
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://yourdomain.com", "https://app.yourdomain.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Monitoring and Debugging Commands

### 10. Useful Debugging Commands

#### Kubernetes Debugging
```bash
# Get all resources in namespace
kubectl get all -n giftsync

# Check events
kubectl get events -n giftsync --sort-by='.lastTimestamp'

# Debug pod issues
kubectl describe pod POD_NAME -n giftsync
kubectl logs POD_NAME -n giftsync --previous

# Execute commands in pod
kubectl exec -it POD_NAME -n giftsync -- bash

# Port forward for local debugging
kubectl port-forward deployment/giftsync-api 8000:8000 -n giftsync
```

#### AWS Resource Debugging
```bash
# Check EKS cluster status
aws eks describe-cluster --name giftsync-prod-cluster

# Check node group status
aws eks describe-nodegroup --cluster-name giftsync-prod-cluster --nodegroup-name giftsync-prod-nodes

# Check RDS status
aws rds describe-db-instances --db-instance-identifier giftsync-prod

# Check load balancer status
aws elbv2 describe-load-balancers
aws elbv2 describe-target-groups
```

#### Application Debugging
```bash
# Test database connectivity
psql $DATABASE_URL -c "SELECT version();"

# Test Redis connectivity
redis-cli -u $REDIS_URL ping

# Check application logs
tail -f /app/logs/application.log

# Test API endpoints
curl -X GET https://api.yourdomain.com/health
curl -X GET https://api.yourdomain.com/products/
```

## Emergency Recovery Procedures

### 11. Disaster Recovery

#### Complete Infrastructure Recovery
```bash
# If entire infrastructure is lost:
cd infrastructure/terraform

# Restore from backup (if you have Terraform state backup)
terraform init
terraform import aws_eks_cluster.main giftsync-prod-cluster

# Or recreate from scratch
terraform apply -var-file="environments/production.tfvars"
```

#### Database Recovery
```bash
# Restore from automated backup
aws rds restore-db-instance-from-db-snapshot \
    --db-instance-identifier giftsync-prod-restored \
    --db-snapshot-identifier rds:giftsync-prod-2024-01-01-06-00

# Or point-in-time recovery
aws rds restore-db-instance-to-point-in-time \
    --source-db-instance-identifier giftsync-prod \
    --target-db-instance-identifier giftsync-prod-restored \
    --restore-time 2024-01-01T12:00:00.000Z
```

#### Application Recovery
```bash
# Redeploy application
kubectl delete deployment giftsync-api -n giftsync
kubectl apply -f k8s/deployment.yaml

# Or rollback to previous version
kubectl rollout undo deployment/giftsync-api -n giftsync
```

## Getting Help

### 12. Support Resources

#### AWS Support
- **AWS Support Center**: https://console.aws.amazon.com/support/
- **AWS Documentation**: https://docs.aws.amazon.com/
- **AWS Forums**: https://forums.aws.amazon.com/

#### Kubernetes Support
- **Kubernetes Documentation**: https://kubernetes.io/docs/
- **EKS Documentation**: https://docs.aws.amazon.com/eks/
- **kubectl Cheat Sheet**: https://kubernetes.io/docs/reference/kubectl/cheatsheet/

#### Application Support
- **FastAPI Documentation**: https://fastapi.tiangolo.com/
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **Redis Documentation**: https://redis.io/documentation

### 13. Log Analysis

#### Common Log Patterns to Look For
```bash
# Database connection errors
kubectl logs deployment/giftsync-api -n giftsync | grep -i "database\|postgres\|connection"

# Authentication errors
kubectl logs deployment/giftsync-api -n giftsync | grep -i "auth\|token\|login"

# API errors
kubectl logs deployment/giftsync-api -n giftsync | grep -i "error\|exception\|failed"

# Performance issues
kubectl logs deployment/giftsync-api -n giftsync | grep -i "slow\|timeout\|performance"
```

This troubleshooting guide should help you resolve most common issues during deployment and operation of your GiftSync production environment.