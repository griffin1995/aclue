# Environment Variable Security Best Practices Guide

## Overview

This guide provides comprehensive security best practices for managing environment variables in the aclue platform. Proper environment variable management is critical for maintaining the security of your application and protecting sensitive data.

## Table of Contents

1. [Security Fundamentals](#security-fundamentals)
2. [Environment Variable Classification](#environment-variable-classification)
3. [Storage and Access Patterns](#storage-and-access-patterns)
4. [Platform-Specific Security](#platform-specific-security)
5. [Key Rotation and Management](#key-rotation-and-management)
6. [Monitoring and Auditing](#monitoring-and-auditing)
7. [Incident Response](#incident-response)
8. [Development Workflow Security](#development-workflow-security)

## Security Fundamentals

### Core Principles

1. **Principle of Least Privilege**: Only grant access to environment variables that are absolutely necessary for each component
2. **Defence in Depth**: Use multiple layers of security controls
3. **Zero Trust**: Never trust, always verify
4. **Fail Secure**: Default to secure configurations when in doubt

### Critical Security Rules

#### ❌ Never Do This

```bash
# DON'T: Commit secrets to version control
RESEND_API_KEY=re_abc123456789  # This will be exposed!

# DON'T: Use NEXT_PUBLIC_ prefix for sensitive data
NEXT_PUBLIC_STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXX  # EXAMPLE - Exposed to browser!

# DON'T: Use weak or predictable secrets
SECRET_KEY=password123  # Easily guessable

# DON'T: Store production secrets in development files
DATABASE_URL=postgresql://prod_user:prod_pass@prod.db.com/prod_db
```

#### ✅ Always Do This

```bash
# DO: Use environment-specific placeholder values
RESEND_API_KEY=<set-in-deployment-platform>

# DO: Keep sensitive variables server-side only
STRIPE_SECRET_KEY=<server-side-only>

# DO: Use cryptographically secure random keys
SECRET_KEY=<generate-64-char-random-string>

# DO: Use local development configurations
DATABASE_URL=postgresql://dev_user:dev_pass@localhost:5432/dev_db
```

## Environment Variable Classification

### Security Levels

#### 🔴 **Critical Security (Level 1)**
- Database credentials and connection strings
- API keys for payment processing (Stripe)
- Service role keys (Supabase)
- JWT signing secrets
- Private keys and certificates

**Handling**: Server-side only, encrypted at rest, access logging required

#### 🟡 **Sensitive (Level 2)**
- Email service API keys (Resend)
- External service API keys (OpenAI, PostHog)
- Admin credentials
- Webhook secrets

**Handling**: Server-side only, encrypted at rest, regular rotation

#### 🟢 **Internal Configuration (Level 3)**
- Feature flags
- Internal service URLs
- Non-sensitive configuration options
- Debug settings

**Handling**: Can be client-side with NEXT_PUBLIC_ prefix if needed

#### 🔵 **Public Configuration (Level 4)**
- Public API URLs
- Analytics tracking IDs (anonymous)
- CDN URLs
- Public feature flags

**Handling**: Safe for client-side exposure

### Variable Classification Matrix

| Variable | Level | Client Safe | Rotation Required | Monitoring Required |
|----------|-------|-------------|-------------------|-------------------|
| `SECRET_KEY` | 1 | ❌ | ✅ Quarterly | ✅ |
| `DATABASE_URL` | 1 | ❌ | ✅ Annually | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | 1 | ❌ | ✅ Annually | ✅ |
| `STRIPE_SECRET_KEY` | 1 | ❌ | ✅ Quarterly | ✅ |
| `RESEND_API_KEY` | 2 | ❌ | ✅ Bi-annually | ✅ |
| `OPENAI_API_KEY` | 2 | ❌ | ✅ Bi-annually | ⚠️ |
| `POSTHOG_API_KEY` | 2 | ❌ | ✅ Annually | ⚠️ |
| `SUPABASE_ANON_KEY` | 3 | ✅ | ⚠️ As needed | ❌ |
| `NEXT_PUBLIC_API_URL` | 4 | ✅ | ❌ | ❌ |

## Storage and Access Patterns

### Development Environment

```bash
# ✅ Local development (.env.local)
NODE_ENV=development
DEBUG=true
DATABASE_URL=postgresql://localhost:5432/aclue_dev
SECRET_KEY=<generated-dev-key>

# ✅ Use local services when possible
SUPABASE_URL=http://localhost:54321
REDIS_URL=redis://localhost:6379
```

### Staging Environment

```bash
# ✅ Staging configuration
NODE_ENV=staging
DEBUG=false
DATABASE_URL=<staging-database-url>
SECRET_KEY=<staging-specific-key>

# ✅ Use staging instances of external services
STRIPE_SECRET_KEY=sk_test_<staging-key>
RESEND_API_KEY=re_<staging-key>
```

### Production Environment

```bash
# ✅ Production configuration
NODE_ENV=production
DEBUG=false
DATABASE_URL=<production-database-url>
SECRET_KEY=<production-specific-key>

# ✅ Use production instances with live keys
STRIPE_SECRET_KEY=sk_live_<production-key>
RESEND_API_KEY=re_<production-key>
```

## Platform-Specific Security

### Vercel (Frontend)

#### Security Configuration

```bash
# Environment Variables Dashboard Settings
# ✅ Set these as "Sensitive" in Vercel dashboard

# Server-side only (no NEXT_PUBLIC_ prefix)
RESEND_API_KEY=re_abc123...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
STRIPE_SECRET_KEY=sk_live_XXXXXXXXXXXX  # Example pattern only

# Client-side safe (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_SUPABASE_URL=https://abc123.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
NEXT_PUBLIC_API_URL=https://api.aclue.app
```

#### Vercel Security Features

- ✅ Enable "Sensitive" flag for critical variables
- ✅ Use Preview/Production environment separation
- ✅ Enable environment variable encryption
- ✅ Restrict access to team members only

### Railway (Backend)

#### Security Configuration

```bash
# Railway Variables Dashboard
# ✅ All variables are automatically encrypted

ENVIRONMENT=production
SECRET_KEY=<64-char-random-string>
DATABASE_URL=${{PGURL}}  # Railway's managed PostgreSQL
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
RESEND_API_KEY=<resend-key>
```

#### Railway Security Features

- ✅ Automatic encryption at rest
- ✅ Environment-specific variable scoping
- ✅ Access control via team permissions
- ✅ Audit logging for variable changes

### Docker/Self-Hosted

#### Security Configuration

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    environment:
      - SECRET_KEY_FILE=/run/secrets/secret_key
      - DATABASE_URL_FILE=/run/secrets/db_url
    secrets:
      - secret_key
      - db_url

secrets:
  secret_key:
    file: ./secrets/secret_key.txt
  db_url:
    file: ./secrets/db_url.txt
```

#### Docker Security Features

- ✅ Use Docker secrets for sensitive data
- ✅ Mount secrets as files, not environment variables
- ✅ Use multi-stage builds to exclude secrets from final image
- ✅ Implement proper file permissions (600)

## Key Rotation and Management

### Rotation Schedule

| Key Type | Frequency | Automation | Rollback Plan |
|----------|-----------|------------|---------------|
| JWT Secret | Quarterly | Manual | Previous key backup |
| Database Credentials | Annually | Automated | Blue-green deployment |
| API Keys (Critical) | Quarterly | Manual | Service degradation plan |
| API Keys (Standard) | Bi-annually | Manual | Fallback keys |
| TLS Certificates | Before expiry | Automated | Certificate chain backup |

### Rotation Process

#### 1. Pre-Rotation Checklist

- [ ] Backup current configuration
- [ ] Verify rollback procedures
- [ ] Schedule maintenance window
- [ ] Notify team members
- [ ] Prepare monitoring alerts

#### 2. Rotation Steps

```bash
# Step 1: Generate new key
NEW_SECRET_KEY=$(python -c "import secrets; print(secrets.token_urlsafe(64))")

# Step 2: Update staging environment
railway variables:set SECRET_KEY=$NEW_SECRET_KEY --environment staging

# Step 3: Test staging deployment
curl -H "Authorization: Bearer $STAGING_TOKEN" https://staging-api.aclue.app/health

# Step 4: Update production (during maintenance window)
railway variables:set SECRET_KEY=$NEW_SECRET_KEY --environment production

# Step 5: Verify production deployment
curl -H "Authorization: Bearer $PROD_TOKEN" https://api.aclue.app/health
```

#### 3. Post-Rotation Verification

- [ ] All services are healthy
- [ ] Authentication is working
- [ ] No error spikes in monitoring
- [ ] User functionality is intact
- [ ] Performance metrics are normal

### Emergency Rotation

```bash
# Emergency key rotation procedure
# 1. Immediately revoke compromised key at source (Stripe, etc.)
# 2. Update environment with new key
# 3. Force restart all services
# 4. Monitor for impact
# 5. Document incident
```

## Monitoring and Auditing

### What to Monitor

#### 🔍 **Access Monitoring**

```bash
# Log all environment variable access
LOG_LEVEL=INFO
ENABLE_ACCESS_LOGGING=true

# Monitor suspicious patterns
- Multiple failed authentication attempts
- Unusual geographic access patterns
- Off-hours administrative access
- Bulk environment variable requests
```

#### 📊 **Usage Monitoring**

```bash
# Track API key usage
- Request volume per key
- Geographic distribution
- Error rates per key
- Unusual usage spikes
```

#### 🚨 **Security Events**

```bash
# Alert on critical events
- Environment variable changes
- New team member access
- Failed deployment attempts
- Key rotation failures
```

### Monitoring Tools

#### Supabase Monitoring

```sql
-- Monitor service role key usage
SELECT
  timestamp,
  user_agent,
  ip_address,
  request_count
FROM auth.audit_log
WHERE auth_method = 'service_role'
AND timestamp > NOW() - INTERVAL '24 hours'
ORDER BY timestamp DESC;
```

#### Vercel Monitoring

```bash
# Vercel CLI monitoring
vercel env ls --scope production
vercel logs --follow --scope production
```

#### Custom Monitoring

```python
# backend/app/middleware/env_monitor.py
import logging
from datetime import datetime

class EnvironmentMonitor:
    def log_access(self, var_name: str, access_type: str):
        logging.info(f"ENV_ACCESS: {var_name} accessed via {access_type} at {datetime.utcnow()}")

    def detect_anomaly(self, access_pattern: dict):
        # Implement anomaly detection logic
        pass
```

### Audit Checklist

#### Monthly Audit

- [ ] Review all environment variables for necessity
- [ ] Check for leaked credentials in logs
- [ ] Verify access controls are current
- [ ] Review team member permissions
- [ ] Update security documentation

#### Quarterly Audit

- [ ] Rotate critical keys
- [ ] Review and test incident response procedures
- [ ] Update security training materials
- [ ] Assess new security requirements
- [ ] Conduct penetration testing

## Incident Response

### Incident Classification

#### 🔴 **Critical (P0)**
- Production database credentials compromised
- Payment processing keys exposed
- Customer data access compromised

**Response Time**: Immediate (< 15 minutes)

#### 🟡 **High (P1)**
- Non-critical API keys exposed
- Internal service credentials compromised
- Development environment compromise

**Response Time**: < 2 hours

#### 🟢 **Medium (P2)**
- Configuration exposure without security impact
- Non-sensitive environment variable issues

**Response Time**: < 24 hours

### Response Procedures

#### Immediate Response (0-15 minutes)

1. **Assess Scope**
   ```bash
   # Identify compromised variables
   grep -r "exposed_key" /var/log/

   # Check for suspicious access
   grep "SECRET_KEY" /var/log/application.log
   ```

2. **Contain Threat**
   ```bash
   # Immediately revoke compromised keys
   stripe keys revoke sk_live_EXAMPLE_KEY_ID  # Replace with actual key ID

   # Disable compromised service accounts
   railway auth:revoke --token abc123
   ```

3. **Communicate**
   ```bash
   # Alert team via Slack/Teams
   # Create incident ticket
   # Notify stakeholders if customer impact
   ```

#### Investigation Phase (15 minutes - 2 hours)

1. **Evidence Collection**
   ```bash
   # Collect logs
   docker logs container_name > incident_logs.txt

   # Export environment state
   printenv | grep -v SECRET > env_state.txt

   # Network traffic analysis
   tcpdump -i eth0 -w incident_traffic.pcap
   ```

2. **Impact Assessment**
   - Determine what data was potentially accessed
   - Identify affected systems and users
   - Assess business impact

3. **Root Cause Analysis**
   - How were credentials exposed?
   - What systems were compromised?
   - What process failures occurred?

#### Recovery Phase (2 hours - 24 hours)

1. **Secure Systems**
   ```bash
   # Generate new credentials
   python -c "import secrets; print(secrets.token_urlsafe(64))"

   # Update all environments
   vercel env add SECRET_KEY
   railway variables:set SECRET_KEY=new_value
   ```

2. **Verify Security**
   ```bash
   # Test new credentials
   curl -H "Authorization: Bearer $NEW_TOKEN" /api/health

   # Verify access controls
   vercel teams:list
   railway team:list
   ```

3. **Monitor for Impact**
   - Watch error rates
   - Monitor authentication failures
   - Check for unusual user behaviour

#### Post-Incident (24+ hours)

1. **Documentation**
   - Write detailed incident report
   - Document lessons learned
   - Update security procedures

2. **Prevention**
   - Implement additional security controls
   - Update monitoring and alerting
   - Conduct security training

## Development Workflow Security

### Secure Development Practices

#### Local Development

```bash
# ✅ Use separate development keys
cp .env.example .env.local
# Edit .env.local with development-specific values

# ✅ Never commit real secrets
echo ".env.local" >> .gitignore

# ✅ Use local services when possible
docker-compose up postgres redis

# ✅ Generate development-specific secrets
python -c "import secrets; print(f'SECRET_KEY={secrets.token_urlsafe(64)}')"
```

#### Code Review Guidelines

```bash
# ❌ Block these patterns in PRs
git diff --name-only | xargs grep -l "sk_live_"
git diff --name-only | xargs grep -l "pk_live_"
git diff --name-only | xargs grep -l "re_[a-zA-Z0-9]"

# ✅ Require these checks
- [ ] No hardcoded secrets
- [ ] Proper environment variable usage
- [ ] Security level classification
- [ ] Documentation updates
```

#### Pre-commit Hooks

```yaml
# .pre-commit-config.yaml
repos:
  - repo: https://github.com/pre-commit/pre-commit-hooks
    hooks:
      - id: detect-private-key
      - id: check-added-large-files

  - repo: https://github.com/Yelp/detect-secrets
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
```

#### Branch Protection

```bash
# Required status checks
- ✅ Security scan passed
- ✅ Environment validation passed
- ✅ No secrets detected
- ✅ Code review approved
```

### Testing Security

#### Environment Variable Tests

```python
# tests/test_environment_security.py
def test_no_production_secrets_in_test():
    """Ensure test environment doesn't use production secrets."""
    assert not os.getenv('SECRET_KEY', '').startswith('prod_')
    assert not os.getenv('DATABASE_URL', '').contains('production')

def test_required_variables_present():
    """Ensure all required variables are present."""
    required_vars = ['SECRET_KEY', 'DATABASE_URL', 'SUPABASE_URL']
    for var in required_vars:
        assert os.getenv(var), f"{var} is required but not set"

def test_secret_key_strength():
    """Ensure SECRET_KEY meets security requirements."""
    secret_key = os.getenv('SECRET_KEY')
    assert len(secret_key) >= 64, "SECRET_KEY must be at least 64 characters"
    assert secret_key != 'your-secret-key-change-in-production'
```

#### Security Integration Tests

```typescript
// tests/security/environment.test.ts
describe('Environment Security', () => {
  test('sensitive variables not exposed to client', () => {
    // Verify NEXT_PUBLIC_ prefix usage
    const clientVars = Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_'))

    const sensitivePatterns = ['SECRET', 'PRIVATE', 'KEY']

    clientVars.forEach(varName => {
      sensitivePatterns.forEach(pattern => {
        expect(varName).not.toContain(pattern)
      })
    })
  })

  test('API keys have correct format', () => {
    const resendKey = process.env.RESEND_API_KEY
    if (resendKey) {
      expect(resendKey).toMatch(/^re_[a-zA-Z0-9_-]+$/)
    }
  })
})
```

## Compliance and Legal Considerations

### Data Protection Regulations

#### GDPR Compliance

- Environment variables containing personal data must be documented
- Data processing purposes must be clearly defined
- Data retention policies must be implemented
- Right to erasure must be supported

#### UK Data Protection Act

- Similar requirements to GDPR
- Additional considerations for UK-specific data handling
- Regular data protection impact assessments

### Industry Standards

#### SOC 2 Type II

- Environment variable access must be logged
- Changes must be approved and documented
- Regular access reviews required
- Incident response procedures must be tested

#### PCI DSS (if handling payments)

- Payment-related environment variables require additional protection
- Network segmentation may be required
- Regular vulnerability assessments mandatory

## Tools and Resources

### Security Tools

#### Static Analysis

```bash
# detect-secrets
pip install detect-secrets
detect-secrets scan --all-files --force-use-all-plugins

# semgrep
pip install semgrep
semgrep --config=auto backend/
```

#### Dynamic Analysis

```bash
# Environment variable scanner
python scripts/env-security-scan.py

# API key validation
python scripts/validate-api-keys.py
```

#### Monitoring Tools

```bash
# Sentry for error tracking
SENTRY_DSN=https://abc123@sentry.io/123456

# PostHog for analytics
POSTHOG_API_KEY=phc_abc123

# Custom monitoring
python scripts/environment-monitor.py
```

### Key Management Services

#### HashiCorp Vault

```bash
# Store secrets in Vault
vault kv put secret/aclue/prod \
  secret_key="$(generate-secret-key)" \
  database_url="postgresql://..."

# Retrieve in application
vault kv get -field=secret_key secret/aclue/prod
```

#### AWS Secrets Manager

```python
# backend/app/core/secrets.py
import boto3

def get_secret(secret_name: str) -> str:
    client = boto3.client('secretsmanager')
    response = client.get_secret_value(SecretId=secret_name)
    return response['SecretString']
```

#### Azure Key Vault

```python
# Alternative secret management
from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential

credential = DefaultAzureCredential()
client = SecretClient(vault_url="https://vault.vault.azure.net/", credential=credential)

secret = client.get_secret("secret-name")
```

## Conclusion

Environment variable security is a critical component of application security. By following these best practices, you can significantly reduce the risk of credential exposure and data breaches.

### Key Takeaways

1. **Classification**: Always classify variables by security level
2. **Separation**: Keep sensitive variables server-side only
3. **Rotation**: Implement regular key rotation schedules
4. **Monitoring**: Monitor access and usage patterns
5. **Response**: Have a clear incident response plan
6. **Testing**: Test security controls regularly

### Next Steps

1. Implement the environment variable validation tools
2. Set up monitoring and alerting
3. Establish key rotation procedures
4. Train team members on security practices
5. Conduct regular security audits

For questions or assistance with environment variable security, contact the security team or refer to the incident response procedures.

---

**Document Version**: 1.0
**Last Updated**: September 2025
**Review Schedule**: Quarterly
**Owner**: Security Team
**Approved By**: Engineering Lead