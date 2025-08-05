# GiftSync Deployment Pipeline Documentation

## Overview

This document provides comprehensive guidance for the GiftSync automated deployment pipeline, including CI/CD integration, Cloudflare automation, and operational procedures.

## Architecture

### Components

1. **GitHub Actions Workflow** (`/.github/workflows/deployment-pipeline.yml`)
   - Automated testing and validation
   - Multi-environment deployment
   - Rollback procedures
   - Notification system

2. **Vercel Webhook Integration** (`/vercel-deployment-webhook.js`)
   - Real-time deployment notifications
   - Automatic cache purging
   - Error handling and retry logic

3. **Rollback Manager** (`/rollback-manager.sh`)
   - Automated rollback procedures
   - Health check integration
   - Emergency stop capabilities

4. **Configuration Management** (`/config-manager.sh`)
   - Environment-specific configurations
   - Credential management
   - Validation and testing

5. **Security Automation** (`/security-headers.sh`)
   - Enterprise-grade security headers
   - SSL/TLS configuration
   - Compliance automation

## Prerequisites

### Required Tools

```bash
# Install required dependencies
sudo apt-get update
sudo apt-get install -y curl jq bc openssl python3

# Install yq for YAML processing
sudo wget -qO /usr/local/bin/yq https://github.com/mikefarah/yq/releases/latest/download/yq_linux_amd64
sudo chmod +x /usr/local/bin/yq

# Install Vercel CLI (optional)
npm install -g vercel

# Install Railway CLI (optional)
npm install -g @railway/cli
```

### Environment Setup

1. **Credentials Configuration**
   ```bash
   ./config-manager.sh setup-credentials
   ```

2. **GitHub Secrets Configuration**
   ```
   CLOUDFLARE_API_TOKEN          - Cloudflare API token
   VERCEL_TOKEN                  - Vercel deployment token
   VERCEL_ORG_ID                 - Vercel organization ID
   VERCEL_PROJECT_ID             - Vercel project ID
   SLACK_WEBHOOK_URL             - Slack notifications webhook
   CLOUDFLARE_WEBHOOK_URL        - Custom webhook endpoint
   CLOUDFLARE_WEBHOOK_TOKEN      - Webhook authentication token
   ROLLBACK_WEBHOOK_URL          - Rollback trigger endpoint
   ROLLBACK_TOKEN                - Rollback authentication token
   MONITORING_WEBHOOK_URL        - Monitoring system webhook
   ```

## Deployment Workflows

### 1. Development Workflow

```yaml
Trigger: Push to develop branch
├── Code validation and testing
├── Build applications
├── Deploy to staging environment
├── Run smoke tests
└── Send notifications
```

### 2. Production Workflow

```yaml
Trigger: Push to main branch
├── Comprehensive validation
├── Build and artifact creation
├── Deploy to production
├── Cloudflare cache purge
├── Security header verification
├── Health checks
├── Post-deployment monitoring
└── Rollback if issues detected
```

### 3. Manual Deployment

```bash
# Deploy specific environment
./config-manager.sh deploy production

# Force deployment (skip confirmations)
./config-manager.sh deploy production --force

# Cache purge only
./deploy-with-cache-purge.sh --cache-only
```

## Configuration Management

### Environment Configurations

The system supports multiple environments with specific configurations:

- **Development**: `dev.aclue.co.uk`
- **Staging**: `staging.aclue.co.uk`, `staging.aclue.app`
- **Production**: `aclue.co.uk`, `aclue.app`

### Configuration Commands

```bash
# List all environments
./config-manager.sh list

# Show environment configuration
./config-manager.sh show production

# Validate configuration
./config-manager.sh validate staging

# Generate environment variables
./config-manager.sh env-vars production

# Update configuration
./config-manager.sh update production cloudflare.cache_ttl 7200
```

## Security Automation

### Security Headers Configuration

Enterprise-grade security is automatically applied:

```bash
# Apply security configuration
./security-headers.sh

# Verify security settings
./security-headers.sh verify

# Show security configuration for environment
./security-headers.sh config production
```

### Security Features

- **SSL/TLS**: Full Strict mode with TLS 1.2+ minimum
- **HSTS**: 1-year max-age with preload and subdomains
- **Security Level**: Environment-specific (High for production)
- **DDoS Protection**: Browser integrity checks and challenge TTL
- **Privacy**: Compliance with UK/GDPR regulations

## Monitoring and Health Checks

### Health Check System

```bash
# Run comprehensive health checks
./scripts/health-check.sh

# Check specific domain
./scripts/health-check.sh domain aclue.co.uk

# Check backend health
./scripts/health-check.sh backend

# Generate JSON report
./scripts/health-check.sh json-only
```

### Monitoring Integration

- **Real-time monitoring**: 1-minute intervals for production
- **Alert thresholds**: Configurable per environment
- **Performance budgets**: Response time and availability targets
- **Notification channels**: Slack, email, PagerDuty

## Rollback Procedures

### Automatic Rollback

Triggers for automatic rollback:
- Health check failures
- Performance degradation (>3s response time)
- Error rate spikes (>5%)
- Manual triggers

### Manual Rollback

```bash
# Standard rollback
./rollback-manager.sh rollback "deployment-failure"

# Rollback to specific deployment
./rollback-manager.sh rollback "health-check-failed" dpl_abc123

# Emergency stop (maintenance mode)
./rollback-manager.sh emergency-stop

# Check rollback status
./rollback-manager.sh status
```

### Rollback Process

1. **Verification**: Confirm rollback necessity
2. **Frontend Rollback**: Promote previous Vercel deployment
3. **Backend Rollback**: Redeploy previous Railway version
4. **Cache Purge**: Clear Cloudflare cache
5. **Health Verification**: Confirm system recovery
6. **Notifications**: Update team and stakeholders

## Webhook Integration

### Vercel Webhook Setup

1. **Deploy Webhook Handler**
   ```bash
   # Deploy as serverless function or API endpoint
   node vercel-deployment-webhook.js
   ```

2. **Configure Vercel Webhook**
   - URL: `https://your-webhook-endpoint.com/vercel-deploy`
   - Events: `deployment.succeeded`, `deployment.failed`
   - Secret: Set `VERCEL_WEBHOOK_SECRET` environment variable

### Webhook Payload

```json
{
  "deployment": {
    "id": "dpl_abc123",
    "url": "https://your-app.vercel.app",
    "state": "READY"
  },
  "environment": "production",
  "trigger": "vercel-webhook",
  "commit_sha": "abc123...",
  "purge_cache": true
}
```

## Troubleshooting

### Common Issues

#### 1. Deployment Failures

**Symptoms**: GitHub Actions workflow fails
**Solutions**:
```bash
# Check logs
cat /tmp/giftsync-deployment-*.log

# Verify credentials
./config-manager.sh validate production

# Manual health check
./scripts/health-check.sh
```

#### 2. Cache Purge Failures

**Symptoms**: Old content still served
**Solutions**:
```bash
# Manual cache purge
./purge-cache.sh

# Check Cloudflare API status
curl -I https://api.cloudflare.com/client/v4/user/tokens/verify \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"

# Verify zone IDs
./config-manager.sh show production
```

#### 3. Security Configuration Issues

**Symptoms**: Security headers missing
**Solutions**:
```bash
# Reapply security configuration
./security-headers.sh

# Verify headers
curl -I https://aclue.co.uk

# Check security logs
tail -f /tmp/cloudflare-security-*.log
```

#### 4. Rollback Issues

**Symptoms**: Rollback fails or incomplete
**Solutions**:
```bash
# Check rollback status
./rollback-manager.sh status

# Manual emergency stop
./rollback-manager.sh emergency-stop

# Review rollback logs
cat /tmp/giftsync-rollback-*.log
```

### Log Files

- **Deployment**: `/tmp/giftsync-deployment-*.log`
- **Security**: `/tmp/cloudflare-security-*.log`
- **Rollback**: `/tmp/giftsync-rollback-*.log`
- **Health Checks**: `/tmp/health-check-*.log`
- **Domain Monitoring**: `~/domain-monitoring.log`

## Performance Optimization

### Caching Strategy

- **Static Assets**: 24-hour browser cache
- **Dynamic Content**: 1-hour CDN cache
- **API Responses**: No caching (real-time data)

### CDN Configuration

- **Regions**: US East (iad1), London (lhr1)
- **Compression**: Gzip and Brotli enabled
- **HTTP/2 & HTTP/3**: Enabled for performance
- **Edge Rules**: Optimized for Next.js applications

## Compliance and Security

### Data Protection

- **GDPR Compliance**: Privacy-first configuration
- **Data Retention**: Logs retained for 7-30 days
- **Encryption**: TLS 1.2+ for all communications
- **Access Control**: Role-based access to deployment systems

### Audit Trail

- **Deployment History**: Full audit log in GitHub Actions
- **Configuration Changes**: Version controlled in Git
- **Security Events**: Logged to Cloudflare and local files
- **Performance Metrics**: Retained for 30 days

## Maintenance Procedures

### Regular Tasks

#### Daily
- [ ] Check deployment status dashboard
- [ ] Review error logs and alerts
- [ ] Verify domain health checks

#### Weekly
- [ ] Review performance metrics
- [ ] Update dependencies if needed
- [ ] Test rollback procedures

#### Monthly
- [ ] Security audit and review
- [ ] Configuration backup verification
- [ ] Disaster recovery testing

### Maintenance Windows

**Scheduled Maintenance**: First Sunday of each month, 02:00-04:00 UTC
- System updates and patches
- Configuration optimization
- Performance tuning
- Security updates

## Support and Escalation

### Support Levels

1. **Level 1**: Automated monitoring and alerts
2. **Level 2**: Development team intervention
3. **Level 3**: Infrastructure team escalation
4. **Level 4**: Emergency response team

### Contact Information

- **Slack**: `#giftsync-deployments`, `#giftsync-alerts`
- **Email**: `devops@giftsync.com`
- **Emergency**: PagerDuty integration for critical issues

## Additional Resources

### Documentation Links

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Vercel API Documentation](https://vercel.com/docs/rest-api)
- [Cloudflare API Documentation](https://developers.cloudflare.com/api/)
- [Railway Deployment Guide](https://docs.railway.app/)

### Training Materials

- **Deployment Pipeline**: Internal wiki and video tutorials
- **Incident Response**: Playbooks and training scenarios
- **Security Procedures**: Compliance and audit documentation

---

*This documentation is maintained by the GiftSync DevOps team. Last updated: $(date -u +%Y-%m-%d)*