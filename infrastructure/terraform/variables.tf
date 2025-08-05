# Variables for aclue Infrastructure

variable "project_name" {
  description = "Name of the project"
  type        = string
  default     = "aclue"
}

variable "environment" {
  description = "Environment name (dev, staging, production)"
  type        = string
  
  validation {
    condition     = contains(["dev", "staging", "production"], var.environment)
    error_message = "Environment must be one of: dev, staging, production."
  }
}

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "eu-west-2"
}

# Database Configuration
variable "db_password" {
  description = "Password for the PostgreSQL database"
  type        = string
  sensitive   = true
}

variable "db_instance_class" {
  description = "RDS instance class"
  type        = string
  default     = null # Will use environment-specific default
}

variable "db_allocated_storage" {
  description = "Initial allocated storage for RDS instance (GB)"
  type        = number
  default     = null # Will use environment-specific default
}

# Redis Configuration
variable "redis_auth_token" {
  description = "Auth token for Redis cluster"
  type        = string
  sensitive   = true
}

variable "redis_node_type" {
  description = "ElastiCache node type"
  type        = string
  default     = null # Will use environment-specific default
}

# EKS Configuration
variable "eks_cluster_version" {
  description = "Kubernetes version for EKS cluster"
  type        = string
  default     = "1.28"
}

variable "eks_node_instance_types" {
  description = "Instance types for EKS worker nodes"
  type        = list(string)
  default     = ["t3.medium", "t3.large"]
}

variable "eks_node_desired_capacity" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 3
}

variable "eks_node_min_capacity" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 2
}

variable "eks_node_max_capacity" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 10
}

# ML Infrastructure
variable "enable_ml_nodes" {
  description = "Whether to create dedicated ML compute nodes"
  type        = bool
  default     = true
}

variable "ml_node_instance_types" {
  description = "Instance types for ML worker nodes"
  type        = list(string)
  default     = ["c5.xlarge", "c5.2xlarge"]
}

variable "ml_node_desired_capacity" {
  description = "Desired number of ML worker nodes"
  type        = number
  default     = 1
}

# Monitoring Configuration
variable "enable_enhanced_monitoring" {
  description = "Enable enhanced monitoring for RDS"
  type        = bool
  default     = false # Will be enabled for production
}

variable "cloudwatch_log_retention_days" {
  description = "CloudWatch log retention period in days"
  type        = number
  default     = 14
}

# Security Configuration
variable "allowed_cidr_blocks" {
  description = "CIDR blocks allowed to access ALB"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "enable_deletion_protection" {
  description = "Enable deletion protection for critical resources"
  type        = bool
  default     = false # Will be enabled for production
}

# S3 Configuration
variable "s3_versioning_enabled" {
  description = "Enable S3 bucket versioning"
  type        = bool
  default     = true
}

variable "s3_lifecycle_rules" {
  description = "S3 lifecycle rules"
  type = list(object({
    id                            = string
    enabled                       = bool
    abort_incomplete_multipart_upload_days = number
    expiration_days              = number
    noncurrent_version_expiration_days = number
  }))
  default = [
    {
      id                            = "default"
      enabled                       = true
      abort_incomplete_multipart_upload_days = 7
      expiration_days              = 365
      noncurrent_version_expiration_days = 30
    }
  ]
}

# Application Configuration
variable "api_domain_name" {
  description = "Domain name for the API"
  type        = string
  default     = null
}

variable "cdn_domain_name" {
  description = "Domain name for the CDN"
  type        = string
  default     = null
}

variable "ssl_certificate_arn" {
  description = "ARN of SSL certificate for ALB"
  type        = string
  default     = null
}

# Backup Configuration
variable "backup_retention_period" {
  description = "Backup retention period for RDS (days)"
  type        = number
  default     = 7
}

variable "backup_window" {
  description = "Backup window for RDS"
  type        = string
  default     = "03:00-04:00"
}

variable "maintenance_window" {
  description = "Maintenance window for RDS"
  type        = string
  default     = "Sun:04:00-Sun:05:00"
}

# Scaling Configuration
variable "auto_scaling_enabled" {
  description = "Enable auto scaling for EKS nodes"
  type        = bool
  default     = true
}

variable "auto_scaling_target_cpu" {
  description = "Target CPU utilization for auto scaling"
  type        = number
  default     = 70
}

# Cost Optimization
variable "use_spot_instances" {
  description = "Use spot instances for worker nodes"
  type        = bool
  default     = true
}

variable "spot_instance_percentage" {
  description = "Percentage of spot instances in node groups"
  type        = number
  default     = 50
}

# Feature Flags
variable "enable_api_gateway" {
  description = "Enable API Gateway for external API access"
  type        = bool
  default     = false
}

variable "enable_waf" {
  description = "Enable AWS WAF for application protection"
  type        = bool
  default     = false
}

variable "enable_shield" {
  description = "Enable AWS Shield Advanced for DDoS protection"
  type        = bool
  default     = false
}

variable "enable_secrets_manager" {
  description = "Use AWS Secrets Manager for sensitive configuration"
  type        = bool
  default     = true
}

# Data Configuration
variable "enable_data_lake" {
  description = "Enable S3-based data lake for analytics"
  type        = bool
  default     = false
}

variable "enable_athena" {
  description = "Enable Amazon Athena for data querying"
  type        = bool
  default     = false
}

variable "enable_kinesis" {
  description = "Enable Kinesis for real-time data streaming"
  type        = bool
  default     = false
}

# Machine Learning
variable "enable_sagemaker" {
  description = "Enable SageMaker for ML model deployment"
  type        = bool
  default     = true
}

variable "sagemaker_instance_type" {
  description = "Instance type for SageMaker endpoints"
  type        = string
  default     = "ml.t3.medium"
}

# Additional Tags
variable "additional_tags" {
  description = "Additional tags to apply to all resources"
  type        = map(string)
  default     = {}
}