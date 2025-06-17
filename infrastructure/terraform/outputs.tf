# Outputs for GiftSync Infrastructure

# VPC Outputs
output "vpc_id" {
  description = "ID of the VPC"
  value       = module.vpc.vpc_id
}

output "vpc_cidr_block" {
  description = "CIDR block of the VPC"
  value       = module.vpc.vpc_cidr_block
}

output "private_subnet_ids" {
  description = "IDs of the private subnets"
  value       = module.vpc.private_subnets
}

output "public_subnet_ids" {
  description = "IDs of the public subnets"
  value       = module.vpc.public_subnets
}

# EKS Outputs
output "cluster_name" {
  description = "Name of the EKS cluster"
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "Endpoint for EKS control plane"
  value       = module.eks.cluster_endpoint
}

output "cluster_security_group_id" {
  description = "Security group ID attached to the EKS cluster"
  value       = module.eks.cluster_security_group_id
}

output "cluster_iam_role_arn" {
  description = "IAM role ARN associated with EKS cluster"
  value       = module.eks.cluster_iam_role_arn
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = module.eks.cluster_certificate_authority_data
}

output "cluster_oidc_issuer_url" {
  description = "The URL on the EKS cluster OIDC Issuer"
  value       = module.eks.cluster_oidc_issuer_url
}

output "node_groups" {
  description = "EKS node groups"
  value       = module.eks.eks_managed_node_groups
  sensitive   = true
}

# Database Outputs
output "db_instance_id" {
  description = "RDS instance ID"
  value       = aws_db_instance.main.id
}

output "db_endpoint" {
  description = "RDS instance endpoint"
  value       = aws_db_instance.main.endpoint
  sensitive   = true
}

output "db_port" {
  description = "RDS instance port"
  value       = aws_db_instance.main.port
}

output "db_name" {
  description = "Database name"
  value       = aws_db_instance.main.db_name
}

# Redis Outputs
output "redis_cluster_id" {
  description = "ElastiCache cluster ID"
  value       = aws_elasticache_replication_group.main.id
}

output "redis_endpoint" {
  description = "ElastiCache cluster endpoint"
  value       = aws_elasticache_replication_group.main.configuration_endpoint_address
  sensitive   = true
}

output "redis_port" {
  description = "ElastiCache cluster port"
  value       = aws_elasticache_replication_group.main.port
}

# S3 Outputs
output "assets_bucket_name" {
  description = "Name of the S3 assets bucket"
  value       = aws_s3_bucket.assets.bucket
}

output "assets_bucket_arn" {
  description = "ARN of the S3 assets bucket"
  value       = aws_s3_bucket.assets.arn
}

output "assets_bucket_domain_name" {
  description = "Domain name of the S3 assets bucket"
  value       = aws_s3_bucket.assets.bucket_domain_name
}

# CloudFront Outputs
output "cloudfront_distribution_id" {
  description = "CloudFront distribution ID"
  value       = aws_cloudfront_distribution.assets.id
}

output "cloudfront_domain_name" {
  description = "CloudFront distribution domain name"
  value       = aws_cloudfront_distribution.assets.domain_name
}

output "cloudfront_hosted_zone_id" {
  description = "CloudFront distribution hosted zone ID"
  value       = aws_cloudfront_distribution.assets.hosted_zone_id
}

# DynamoDB Outputs
output "dynamodb_user_sessions_table_name" {
  description = "DynamoDB user sessions table name"
  value       = aws_dynamodb_table.user_sessions.name
}

output "dynamodb_user_sessions_table_arn" {
  description = "DynamoDB user sessions table ARN"
  value       = aws_dynamodb_table.user_sessions.arn
}

output "dynamodb_analytics_events_table_name" {
  description = "DynamoDB analytics events table name"
  value       = aws_dynamodb_table.analytics_events.name
}

output "dynamodb_analytics_events_table_arn" {
  description = "DynamoDB analytics events table ARN"
  value       = aws_dynamodb_table.analytics_events.arn
}

output "dynamodb_analytics_events_stream_arn" {
  description = "DynamoDB analytics events stream ARN"
  value       = aws_dynamodb_table.analytics_events.stream_arn
}

# Load Balancer Outputs
output "alb_name" {
  description = "Name of the Application Load Balancer"
  value       = aws_lb.main.name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = aws_lb.main.arn
}

output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.main.dns_name
}

output "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  value       = aws_lb.main.zone_id
}

# Security Group Outputs
output "rds_security_group_id" {
  description = "Security group ID for RDS"
  value       = aws_security_group.rds.id
}

output "elasticache_security_group_id" {
  description = "Security group ID for ElastiCache"
  value       = aws_security_group.elasticache.id
}

output "alb_security_group_id" {
  description = "Security group ID for ALB"
  value       = aws_security_group.alb.id
}

# IAM Outputs
output "rds_monitoring_role_arn" {
  description = "ARN of the RDS monitoring role"
  value       = var.environment == "production" ? aws_iam_role.rds_monitoring[0].arn : null
}

# General Information
output "environment" {
  description = "Environment name"
  value       = var.environment
}

output "region" {
  description = "AWS region"
  value       = var.aws_region
}

output "project_name" {
  description = "Project name"
  value       = var.project_name
}

# Connection Strings (for application configuration)
output "database_url" {
  description = "Database connection URL"
  value       = "postgresql://${aws_db_instance.main.username}:${var.db_password}@${aws_db_instance.main.endpoint}/${aws_db_instance.main.db_name}"
  sensitive   = true
}

output "redis_url" {
  description = "Redis connection URL"
  value       = "redis://:${var.redis_auth_token}@${aws_elasticache_replication_group.main.configuration_endpoint_address}:${aws_elasticache_replication_group.main.port}"
  sensitive   = true
}

# Kubernetes Configuration
output "kubeconfig" {
  description = "kubectl configuration"
  value = {
    cluster_name                     = module.eks.cluster_name
    endpoint                        = module.eks.cluster_endpoint
    certificate_authority_data      = module.eks.cluster_certificate_authority_data
    region                         = var.aws_region
  }
  sensitive = true
}