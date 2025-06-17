# Development Environment Configuration

environment = "dev"
aws_region  = "eu-west-2"

# Database Configuration
db_instance_class      = "db.t3.micro"
db_allocated_storage   = 20
backup_retention_period = 1
enable_enhanced_monitoring = false

# Redis Configuration
redis_node_type = "cache.t3.micro"

# EKS Configuration
eks_node_instance_types    = ["t3.small", "t3.medium"]
eks_node_desired_capacity  = 2
eks_node_min_capacity      = 1
eks_node_max_capacity      = 5

# ML Configuration
enable_ml_nodes           = false
ml_node_desired_capacity  = 0

# Security Configuration
enable_deletion_protection = false
allowed_cidr_blocks       = ["0.0.0.0/0"]

# Monitoring Configuration
cloudwatch_log_retention_days = 7

# Cost Optimization
use_spot_instances        = true
spot_instance_percentage  = 80

# Feature Flags
enable_api_gateway       = false
enable_waf              = false
enable_shield           = false
enable_data_lake        = false
enable_athena           = false
enable_kinesis          = false
enable_sagemaker        = false

# Scaling Configuration
auto_scaling_enabled     = true
auto_scaling_target_cpu  = 80

# S3 Configuration
s3_versioning_enabled = false

# Additional tags for development
additional_tags = {
  Owner       = "Development Team"
  CostCenter  = "Engineering"
  AutoShutdown = "true"
}