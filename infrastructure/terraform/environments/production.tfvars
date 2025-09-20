# Production Environment Configuration

environment = "production"
aws_region  = "eu-west-2"

# Database Configuration
db_instance_class      = "db.r6g.large"
db_allocated_storage   = 100
backup_retention_period = 7
enable_enhanced_monitoring = true

# Redis Configuration
redis_node_type = "cache.r6g.large"

# EKS Configuration
eks_node_instance_types    = ["t3.large", "t3.xlarge"]
eks_node_desired_capacity  = 5
eks_node_min_capacity      = 3
eks_node_max_capacity      = 20

# ML Configuration
enable_ml_nodes           = true
ml_node_instance_types    = ["c5.xlarge", "c5.2xlarge", "c5.4xlarge"]
ml_node_desired_capacity  = 2

# Security Configuration
enable_deletion_protection = true
allowed_cidr_blocks       = ["0.0.0.0/0"] # Restrict this in production

# Monitoring Configuration
cloudwatch_log_retention_days = 30

# Cost Optimization
use_spot_instances        = true
spot_instance_percentage  = 30  # Lower percentage for production stability

# Feature Flags
enable_api_gateway       = true
enable_waf              = true
enable_shield           = true
enable_data_lake        = true
enable_athena           = true
enable_kinesis          = true
enable_sagemaker        = true

# Scaling Configuration
auto_scaling_enabled     = true
auto_scaling_target_cpu  = 60

# S3 Configuration
s3_versioning_enabled = true

# SSL/TLS Configuration
# ssl_certificate_arn = "arn:aws:acm:eu-west-2:ACCOUNT:certificate/CERTIFICATE_ID"
# api_domain_name     = "api.aclue.app"
# cdn_domain_name     = "cdn.aclue.app"

# Machine Learning
sagemaker_instance_type = "ml.c5.xlarge"

# Additional tags for production
additional_tags = {
  Owner        = "Platform Team"
  CostCenter   = "Engineering"
  Environment  = "Production"
  Compliance   = "GDPR"
  DataClass    = "Confidential"
  Backup       = "Required"
  Monitoring   = "24x7"
  SLA          = "99.9%"
}