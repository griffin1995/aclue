# Secret Management Procedures for aclue Development Team

**Version**: 2.1.0
**Last Updated**: September 2025
**Classification**: CONFIDENTIAL - Development Team Only
**Compliance**: GDPR, SOC2, PCI-DSS Ready

## Table of Contents

1. [Secret Management Overview](#1-secret-management-overview)
2. [Pre-commit Security Hooks](#2-pre-commit-security-hooks)
3. [Environment Variable Management](#3-environment-variable-management)
4. [Incident Response Procedures](#4-incident-response-procedures)
5. [Developer Guidelines](#5-developer-guidelines)
6. [Tools and Technologies](#6-tools-and-technologies)
7. [Compliance and Auditing](#7-compliance-and-auditing)
8. [Quick Reference Guide](#8-quick-reference-guide)

---

## 1. Secret Management Overview

### 1.1 What Constitutes a Secret?

Secrets are sensitive information that must never be exposed in version control or logs. The aclue platform treats the following as secrets:

#### **Critical Secrets** (Immediate Security Risk)
- **API Keys**: Resend, OpenAI, PostHog, Stripe, Amazon Associates
- **Database Credentials**: PostgreSQL connection strings, Supabase service role keys
- **JWT Secrets**: SECRET_KEY for token signing
- **Service Account Keys**: Google Cloud, AWS, Azure credentials
- **Private Keys**: SSL certificates, SSH keys, signing certificates
- **OAuth Secrets**: Google Client Secret, GitHub Client Secret

#### **Sensitive Configuration** (Business Risk)
- **Webhook Secrets**: Stripe webhook signing secrets
- **Admin Credentials**: Default admin passwords, service accounts
- **Internal URLs**: Non-public API endpoints, internal services
- **Encryption Keys**: Any symmetric or asymmetric encryption keys
- **Session Secrets**: NextAuth secrets, cookie signing keys

#### **Compliance-Required Secrets** (Regulatory Risk)
- **Payment Tokens**: Stripe secret keys, payment gateway credentials
- **Personal Data Access**: Keys that grant access to user data
- **Audit Trail Credentials**: Logging service credentials
- **Backup Encryption Keys**: Keys for encrypted backups

### 1.2 Risk Assessment and Impact

| Secret Type | Exposure Impact | Recovery Time | Business Impact |
|-------------|----------------|---------------|-----------------|
| Database Credentials | **CRITICAL** - Full data breach | 4-8 hours | Complete service outage, data loss |
| API Keys (Payment) | **CRITICAL** - Financial loss | 2-4 hours | Transaction failures, revenue loss |
| JWT Secrets | **HIGH** - Session hijacking | 1-2 hours | User impersonation, auth bypass |
| Email API Keys | **MEDIUM** - Spam/abuse | 30 minutes | Service suspension, reputation damage |
| Analytics Keys | **LOW** - Data pollution | 15 minutes | Incorrect metrics, minor impact |

### 1.3 Compliance Requirements

#### **GDPR Compliance**
- Encryption of personal data access keys at rest
- Audit trail for all secret access
- Right to erasure includes key rotation logs
- 72-hour breach notification if secrets exposed

#### **SOC2 Requirements**
- Quarterly secret rotation policy
- Documented access control for production secrets
- Separation of development and production secrets
- Continuous monitoring of secret exposure

#### **PCI-DSS Alignment**
- Payment-related secrets require additional encryption
- Two-factor authentication for production secret access
- Annual security assessment of secret management
- Immediate rotation upon employee departure

---

## 2. Pre-commit Security Hooks

### 2.1 Security Hook Architecture

The aclue codebase implements a multi-layered security approach through `.pre-commit-config.yaml`:

```yaml
# Primary Layer: detect-secrets
- Comprehensive secret pattern detection
- Baseline comparison to reduce false positives
- Gibberish detection for random strings

# Secondary Layer: GitLeaks
- Git history scanning
- Extended pattern matching
- Cloud provider specific detection

# Tertiary Layer: Bandit (Python)
- Code security analysis
- Hardcoded password detection
- Cryptographic weakness identification

# Final Layer: Custom Hooks
- Environment file prevention
- Private key detection
- Large file prevention
```

### 2.2 When Hooks Are Triggered

Pre-commit hooks activate automatically during:
- `git commit` operations
- Manual runs via `pre-commit run --all-files`
- CI/CD pipeline validation
- PR merge checks

### 2.3 Handling Hook Violations

#### **Step 1: Understand the Violation**
```bash
# Example detect-secrets output
Potential secrets about to be committed:
  backend/app/core/config.py:45: Secret Keyword

# DO NOT proceed without investigation
```

#### **Step 2: Determine if it's a False Positive**
```bash
# Review the flagged line
cat -n backend/app/core/config.py | sed -n '45p'

# If it's a placeholder or example:
# 1. Replace with environment variable reference
# 2. Move actual value to .env.example as template
```

#### **Step 3: Handle True Positives**
```bash
# IMMEDIATE ACTIONS:
1. Remove the secret from the file
2. Replace with environment variable:
   - Python: os.getenv('SECRET_NAME')
   - TypeScript: process.env.SECRET_NAME
3. Add to .env.example with placeholder
4. Document in this procedures file if new secret type
```

### 2.4 Managing False Positives Safely

#### **Using detect-secrets Baseline**
```bash
# Generate initial baseline (run from repository root)
detect-secrets scan --baseline .secrets.baseline

# Update baseline after fixing false positives
detect-secrets scan --update .secrets.baseline

# Audit baseline (interactive review)
detect-secrets audit .secrets.baseline
```

#### **Temporary Bypass (USE WITH EXTREME CAUTION)**
```bash
# Skip specific hooks for emergency fixes
SKIP=detect-secrets,gitleaks git commit -m "fix: emergency patch"

# MANDATORY: Create follow-up ticket to address skipped checks
# MANDATORY: Security review within 24 hours
```

### 2.5 Developer Workflow Integration

```mermaid
graph TD
    A[Developer Makes Changes] --> B{Pre-commit Hooks Run}
    B -->|Pass| C[Commit Proceeds]
    B -->|Fail| D[Security Violation Detected]
    D --> E{Is it a Secret?}
    E -->|Yes| F[Remove Secret & Use Env Var]
    E -->|No| G[Update Baseline/Whitelist]
    F --> H[Update .env.example]
    G --> I[Document False Positive]
    H --> B
    I --> B
```

---

## 3. Environment Variable Management

### 3.1 Environment File Structure

The aclue platform uses a three-tier environment configuration:

```
Repository Structure:
├── backend/
│   ├── .env.example    # Template with ALL variables documented
│   └── .env            # LOCAL ONLY - Never committed
├── web/
│   ├── .env.example    # Template with client/server separation
│   └── .env.local      # LOCAL ONLY - Never committed
```

### 3.2 Using .env.example Templates

#### **Backend Template Structure** (`backend/.env.example`)
```bash
# Section header with context
# ===============================================================================
# SERVICE_NAME CONFIGURATION
# ===============================================================================

# Variable documentation format:
# Purpose - REQUIRED/OPTIONAL - SECURITY_LEVEL
# Requirements: Specific format or constraints
# Used for: Where and how this variable is used
# Generate with: Command to generate secure value
VARIABLE_NAME=placeholder-value-change-in-production
```

#### **Frontend Template Structure** (`web/.env.example`)
```bash
# Client-exposed variables (NEXT_PUBLIC_ prefix)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Server-only variables (no prefix)
RESEND_API_KEY=re_your_resend_api_key_here
```

### 3.3 Local Development Setup

#### **Initial Setup Procedure**
```bash
# 1. Backend setup
cd backend
cp .env.example .env
# Edit .env with your development values

# 2. Frontend setup
cd ../web
cp .env.example .env.local
# Edit .env.local with your development values

# 3. Verify no real secrets in git
git status  # Should NOT show .env or .env.local
```

#### **Secure Value Generation**
```bash
# Generate SECRET_KEY (Python)
python -c "import secrets; print(secrets.token_urlsafe(64))"

# Generate random password
openssl rand -base64 32

# Generate UUID
python -c "import uuid; print(uuid.uuid4())"
```

### 3.4 Production Deployment

#### **Vercel (Frontend)**
```bash
# Via Vercel CLI
vercel env add RESEND_API_KEY production
# Enter value when prompted (hidden input)

# Via Dashboard
1. Project Settings → Environment Variables
2. Add variable with "Sensitive" flag enabled
3. Select "Production" environment
4. Save without exposing in UI
```

#### **Railway (Backend)**
```bash
# Via Railway CLI
railway variables set SECRET_KEY="your-production-secret"

# Via Dashboard
1. Project → Variables
2. Add variable (automatically encrypted)
3. Deploy triggers automatically
```

### 3.5 Validation Implementation

#### **Python (Pydantic) - Backend**
```python
# backend/app/core/config.py
from pydantic import BaseSettings, validator, SecretStr
from typing import Optional
import json

class Settings(BaseSettings):
    # Critical secrets with validation
    SECRET_KEY: SecretStr
    DATABASE_URL: SecretStr
    SUPABASE_SERVICE_ROLE_KEY: SecretStr

    # Required configurations
    ENVIRONMENT: str
    CORS_ORIGINS: list[str]

    @validator('SECRET_KEY')
    def validate_secret_key(cls, v):
        if len(v.get_secret_value()) < 64:
            raise ValueError('SECRET_KEY must be at least 64 characters')
        return v

    @validator('DATABASE_URL')
    def validate_database_url(cls, v):
        if not v.get_secret_value().startswith('postgresql://'):
            raise ValueError('DATABASE_URL must be a PostgreSQL connection string')
        return v

    @validator('CORS_ORIGINS', pre=True)
    def parse_cors_origins(cls, v):
        if isinstance(v, str):
            return json.loads(v)
        return v

    class Config:
        env_file = '.env'
        case_sensitive = True

settings = Settings()
```

#### **TypeScript (Zod) - Frontend**
```typescript
// web/lib/env.ts
import { z } from 'zod';

const envSchema = z.object({
  // Public variables (client-side)
  NEXT_PUBLIC_API_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),

  // Server-only variables
  RESEND_API_KEY: z.string().startsWith('re_'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),

  // Optional with defaults
  NODE_ENV: z.enum(['development', 'test', 'production'])
    .default('development'),
});

// Validate at build time
const env = envSchema.parse(process.env);

export default env;
```

---

## 4. Incident Response Procedures

### 4.1 Secret Exposure Detection

#### **Indicators of Compromise**
- Pre-commit hooks failing after commit
- GitHub secret scanning alerts
- Unusual API usage patterns
- Security tool notifications
- Team member reports

### 4.2 Immediate Response Protocol

#### **PRIORITY 1: Stop the Bleeding (0-15 minutes)**
```bash
# 1. Revoke exposed secret IMMEDIATELY
#    - Disable API key in provider dashboard
#    - Rotate database passwords
#    - Invalidate all JWT tokens

# 2. Remove from Git history
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch path/to/secret-file" \
  --prune-empty --tag-name-filter cat -- --all

# 3. Force push to all remotes
git push --force --all
git push --force --tags
```

#### **PRIORITY 2: Assess Impact (15-30 minutes)**
```bash
# Check access logs
- Review provider dashboards for unauthorised usage
- Check database audit logs
- Review application logs for suspicious activity
- Calculate potential data exposure
```

#### **PRIORITY 3: Rotate and Secure (30-60 minutes)**
```bash
# 1. Generate new secrets
python -c "import secrets; print(secrets.token_urlsafe(64))"

# 2. Update all environments
- Development: Update local .env files
- Staging: Update platform variables
- Production: Coordinate deployment window

# 3. Redeploy all services
- Backend: Trigger Railway deployment
- Frontend: Trigger Vercel deployment
```

### 4.3 Communication Protocol

#### **Internal Communication Timeline**
| Time | Action | Responsible | Channel |
|------|--------|-------------|---------|
| T+0 | Detect exposure | Discoverer | Direct to Tech Lead |
| T+5min | Assess severity | Tech Lead | Security channel |
| T+15min | Begin remediation | DevOps | Team standup |
| T+1hr | Status update | Tech Lead | All hands |
| T+24hr | Post-mortem | Team | Documentation |

#### **External Communication (If Required)**
```markdown
Subject: Security Notification - Precautionary Credential Rotation

Dear [Customer/Partner],

As part of our continuous security monitoring, we identified and immediately
addressed a potential security concern affecting [service]. As a precaution,
we have:

1. Rotated all potentially affected credentials
2. Reviewed all access logs (no unauthorised access detected)
3. Implemented additional security measures

Required Action: [If any, e.g., password reset]

Timeline:
- Issue detected: [Time]
- Remediation complete: [Time]
- Services fully restored: [Time]

We take security seriously and apologise for any inconvenience.

[Contact Information]
```

### 4.4 Post-Incident Actions

#### **Mandatory Post-Mortem Template**
```markdown
## Incident Post-Mortem: [Date]

### Summary
- **Severity**: Critical/High/Medium/Low
- **Duration**: [Detection to resolution time]
- **Impact**: [Users/services affected]

### Timeline
- [Time]: Event occurred
- [Time]: Event detected
- [Time]: Response initiated
- [Time]: Resolution completed

### Root Cause
[Detailed explanation of how the secret was exposed]

### Resolution
[Steps taken to resolve]

### Lessons Learned
1. What went well
2. What could be improved
3. Action items

### Prevention Measures
- [ ] Update pre-commit hooks
- [ ] Enhance monitoring
- [ ] Team training
- [ ] Process improvement
```

---

## 5. Developer Guidelines

### 5.1 Best Practices for Secret Handling

#### **The Golden Rules**
```python
# ❌ NEVER DO THIS
API_KEY = "sk-abc123def456ghi789"
password = "admin123"
DATABASE_URL = "postgresql://[USER]:[PASS]@prod-server/db"

# ✅ ALWAYS DO THIS
API_KEY = os.getenv('API_KEY')
password = settings.ADMIN_PASSWORD
DATABASE_URL = config.database_url
```

#### **Language-Specific Patterns**

**Python (Backend)**
```python
# Use python-dotenv for local development
from dotenv import load_dotenv
import os

load_dotenv()  # Only in development

class Config:
    # Use Pydantic's SecretStr for sensitive values
    api_key: SecretStr = SecretStr(os.getenv('API_KEY', ''))

    # Validate on startup
    def __post_init__(self):
        if not self.api_key.get_secret_value():
            raise ValueError("API_KEY is required")
```

**TypeScript (Frontend)**
```typescript
// Server-side only (Next.js Server Actions)
const resendApiKey = process.env.RESEND_API_KEY;
if (!resendApiKey) {
  throw new Error('RESEND_API_KEY is required');
}

// Client-side safe
const publicApiUrl = process.env.NEXT_PUBLIC_API_URL;
```

### 5.2 Testing Without Exposing Secrets

#### **Mock Secrets for Testing**
```python
# backend/tests/conftest.py
import pytest
from unittest.mock import patch

@pytest.fixture(autouse=True)
def mock_env_vars():
    with patch.dict('os.environ', {
        'SECRET_KEY': 'test-secret-key-minimum-64-chars' + 'x' * 40,
        'DATABASE_URL': 'postgresql://[USER]:[PASS]@localhost/test',
        'RESEND_API_KEY': 're_test_key',
    }):
        yield
```

#### **Test Data Generators**
```typescript
// web/tests/helpers.ts
export const generateMockEnv = () => ({
  NEXT_PUBLIC_API_URL: 'http://localhost:8000',
  RESEND_API_KEY: 'resend_test_key',
  SUPABASE_SERVICE_ROLE_KEY: 'test_service_role',
});

// Use in tests
jest.mock('../lib/env', () => generateMockEnv());
```

### 5.3 Code Review Checklist

#### **Secret Management Review Points**
- [ ] No hardcoded values that look like secrets
- [ ] All sensitive values from environment variables
- [ ] .env.example updated with new variables
- [ ] Documentation includes setup instructions
- [ ] No sensitive data in comments
- [ ] No secrets in test files
- [ ] URLs use environment-specific values
- [ ] Error messages don't leak sensitive info

#### **Automated Review Integration**
```yaml
# .github/PULL_REQUEST_TEMPLATE.md
## Security Checklist
- [ ] No secrets or credentials in code
- [ ] Environment variables documented in .env.example
- [ ] Pre-commit hooks passed locally
- [ ] Sensitive operations have appropriate logging
```

### 5.4 Common Pitfalls and Solutions

| Pitfall | Example | Solution |
|---------|---------|----------|
| Secrets in URLs | `fetch('https://api.service.com?key=abc123')` | Use headers: `Authorization: Bearer ${token}` |
| Logging secrets | `console.log('Config:', config)` | Use redacted logging: `console.log('Config loaded')` |
| Error messages | `throw new Error(\`DB failed: ${connectionString}\`)` | `throw new Error('Database connection failed')` |
| Git history | Committed then removed secret | Use `git filter-branch` or BFG Repo-Cleaner |
| Development secrets in production | Same SECRET_KEY everywhere | Generate unique per environment |

---

## 6. Tools and Technologies

### 6.1 Pre-commit Framework

#### **Installation and Setup**
```bash
# Install pre-commit
pip install pre-commit

# Install hooks for the repository
pre-commit install

# Install commit-msg hooks (for conventional commits)
pre-commit install --hook-type commit-msg

# Run against all files (initial check)
pre-commit run --all-files
```

#### **Configuration Structure** (`.pre-commit-config.yaml`)
```yaml
repos:
  # Security Layer 1: Secret Detection
  - repo: https://github.com/Yelp/detect-secrets
    rev: v1.5.0
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']
        exclude: 'tests|docs|*.md'

  # Security Layer 2: GitLeaks
  - repo: https://github.com/gitleaks/gitleaks
    rev: v8.21.2
    hooks:
      - id: gitleaks

  # Security Layer 3: Language-specific
  - repo: https://github.com/PyCQA/bandit
    rev: '1.8.6'
    hooks:
      - id: bandit
        args: ['-ll', '--exclude', 'tests']
```

### 6.2 Security Scanning Tools

#### **detect-secrets**
```bash
# Initial setup
detect-secrets scan --baseline .secrets.baseline

# Update after changes
detect-secrets scan --update .secrets.baseline

# Audit interactively
detect-secrets audit .secrets.baseline

# Custom configuration (.secrets.toml)
[tools.detect-secrets]
exclude_patterns = [
    'tests/',
    '*.md',
    'package-lock.json'
]
```

#### **GitLeaks**
```bash
# Scan current directory
gitleaks detect --source . -v

# Scan git history
gitleaks detect --source . --log-opts="--all"

# Use custom rules (.gitleaks.toml)
gitleaks detect --config .gitleaks.toml
```

#### **Bandit (Python)**
```bash
# Scan Python code
bandit -r backend/ -ll

# Generate report
bandit -r backend/ -f json -o security-report.json

# Exclude test files
bandit -r backend/ --exclude backend/tests
```

### 6.3 Troubleshooting Common Issues

#### **Problem: Pre-commit hooks not running**
```bash
# Solution 1: Reinstall hooks
pre-commit uninstall
pre-commit install

# Solution 2: Update pre-commit
pip install --upgrade pre-commit
pre-commit autoupdate

# Solution 3: Clear cache
pre-commit clean
pre-commit gc
```

#### **Problem: detect-secrets baseline conflicts**
```bash
# Regenerate baseline
detect-secrets scan --baseline .secrets.baseline.new

# Compare and merge
diff .secrets.baseline .secrets.baseline.new

# Accept new baseline
mv .secrets.baseline.new .secrets.baseline
git add .secrets.baseline
```

#### **Problem: False positives blocking commits**
```bash
# Temporary bypass (CAREFULLY)
SKIP=detect-secrets git commit -m "fix: urgent patch"

# Permanent exclusion (add to .pre-commit-config.yaml)
exclude: |
  (?x)^(
    path/to/false-positive-file\.py|
    another/excluded/path/
  )$
```

---

## 7. Compliance and Auditing

### 7.1 Regular Security Audits

#### **Weekly Automated Scans**
```bash
#!/bin/bash
# security-audit.sh - Run weekly via cron/CI

echo "=== Weekly Security Audit ==="
date

# Scan for secrets in repository
echo "Scanning for secrets..."
detect-secrets scan --all-files

# Check dependencies for vulnerabilities
echo "Checking Python dependencies..."
safety check -r requirements.txt

echo "Checking Node dependencies..."
cd web && npm audit

# Review recent commits for secrets
echo "Reviewing recent commits..."
gitleaks detect --log-opts="--since=1 week ago"

# Generate report
echo "Audit complete. Results saved to security-audit-$(date +%Y%m%d).log"
```

#### **Monthly Manual Review**
- [ ] Review all environment variables in production
- [ ] Verify secret rotation compliance
- [ ] Audit access logs for production secrets
- [ ] Review and update .secrets.baseline
- [ ] Check for unused API keys and revoke
- [ ] Verify backup encryption keys are secure

### 7.2 Documentation Requirements

#### **Secret Inventory Template**
```markdown
| Secret Name | Type | Environment | Last Rotated | Owner | Compliance |
|-------------|------|-------------|--------------|-------|------------|
| SECRET_KEY | JWT Signing | Production | 2024-01-15 | DevOps | SOC2 |
| DATABASE_URL | PostgreSQL | Production | 2024-01-01 | Backend | GDPR |
| RESEND_API_KEY | Email Service | All | 2024-02-01 | FullStack | None |
```

#### **Rotation Schedule**
```yaml
# .github/workflows/secret-rotation-reminder.yml
name: Secret Rotation Reminder

on:
  schedule:
    - cron: '0 9 1 * *'  # First day of month at 9 AM

jobs:
  remind:
    runs-on: ubuntu-latest
    steps:
      - name: Create rotation reminder issue
        uses: actions/github-script@v6
        with:
          script: |
            await github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.name,
              title: 'Monthly Secret Rotation Required',
              body: 'Complete secret rotation checklist in SECRET-MANAGEMENT-PROCEDURES.md',
              labels: ['security', 'priority:high']
            })
```

### 7.3 Audit Trail Requirements

#### **Required Logging**
```python
# backend/app/core/audit.py
import logging
from datetime import datetime
from typing import Optional

class SecurityAudit:
    @staticmethod
    def log_secret_access(
        secret_name: str,
        accessed_by: str,
        purpose: str,
        ip_address: Optional[str] = None
    ):
        logging.info(
            f"SECRET_ACCESS: {secret_name} accessed by {accessed_by} "
            f"for {purpose} from {ip_address} at {datetime.utcnow().isoformat()}"
        )

    @staticmethod
    def log_secret_rotation(
        secret_name: str,
        rotated_by: str,
        reason: str
    ):
        logging.info(
            f"SECRET_ROTATION: {secret_name} rotated by {rotated_by} "
            f"reason: {reason} at {datetime.utcnow().isoformat()}"
        )
```

#### **Compliance Reporting**
```bash
# Generate compliance report
#!/bin/bash
echo "=== Secret Management Compliance Report ==="
echo "Generated: $(date)"
echo ""
echo "1. Secret Detection Status"
pre-commit run detect-secrets --all-files
echo ""
echo "2. Environment File Protection"
find . -name ".env*" -not -name "*.example" -not -path "./node_modules/*"
echo ""
echo "3. Recent Secret Rotations"
git log --grep="secret rotation" --since="3 months ago" --oneline
echo ""
echo "4. Access Audit"
grep "SECRET_ACCESS" logs/application.log | tail -20
```

---

## 8. Quick Reference Guide

### 8.1 Emergency Commands

```bash
# 🚨 Secret exposed - immediate actions
git rm --cached file-with-secret
git commit -m "fix: remove exposed secret"
git push --force-with-lease

# Scan repository for secrets
detect-secrets scan --all-files
gitleaks detect --source . -v

# Generate secure secrets
python -c "import secrets; print(secrets.token_urlsafe(64))"
openssl rand -base64 32

# Install security hooks
pre-commit install
pre-commit run --all-files
```

### 8.2 Environment Setup Checklist

- [ ] Copy `.env.example` to `.env` (backend)
- [ ] Copy `.env.example` to `.env.local` (web)
- [ ] Generate unique SECRET_KEY (64+ characters)
- [ ] Configure database connection string
- [ ] Set up Supabase credentials
- [ ] Configure Resend API key
- [ ] Verify pre-commit hooks installed
- [ ] Run initial security scan
- [ ] Document any new secrets in inventory

### 8.3 Deployment Checklist

- [ ] All secrets in platform environment variables
- [ ] No `.env` files in deployment
- [ ] Production secrets different from development
- [ ] Secret rotation completed this quarter
- [ ] Access logs configured
- [ ] Monitoring alerts set up
- [ ] Backup encryption keys secure
- [ ] Post-deployment security scan

### 8.4 Incident Response Contacts

| Role | Contact | Escalation Time |
|------|---------|-----------------|
| Security Lead | [Name] | Immediate |
| Tech Lead | [Name] | < 15 minutes |
| DevOps | [Name] | < 30 minutes |
| CTO | [Name] | < 1 hour |
| Legal/Compliance | [Name] | < 24 hours |

### 8.5 Tool Installation Commands

```bash
# Python environment
pip install pre-commit detect-secrets bandit safety

# Node environment
npm install -g gitleaks

# Verify installations
pre-commit --version
detect-secrets --version
bandit --version
gitleaks version
```

---

## Appendices

### Appendix A: Secret Patterns Reference

| Secret Type | Pattern Example | Detection Method |
|-------------|----------------|------------------|
| API Key | `[api_key_prefix]_[key_data]` | Regex + Entropy |
| JWT | `eyJhbGciOiJIUzI1NiIs...` | JWT structure |
| AWS Key | `AKIA[A-Z0-9]{16}` | AWS pattern |
| Private Key | `-----BEGIN [ALGORITHM] PRIVATE KEY-----` | PEM format |
| Database URL | `postgresql://[USER]:[PASS]@host/db` | URL structure |

### Appendix B: Compliance Timelines

| Requirement | Frequency | Deadline | Responsible |
|-------------|-----------|----------|-------------|
| Secret Rotation | Quarterly | End of quarter | DevOps |
| Security Audit | Monthly | First Monday | Security Lead |
| Compliance Report | Quarterly | Quarter + 15 days | Compliance |
| Penetration Test | Annually | Q4 | External + Security |
| Training | Bi-annually | Q2, Q4 | HR + Security |

### Appendix C: References and Resources

- [OWASP Secret Management Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html)
- [GitHub Secret Scanning](https://docs.github.com/en/code-security/secret-scanning)
- [detect-secrets Documentation](https://github.com/Yelp/detect-secrets)
- [Gitleaks Documentation](https://github.com/gitleaks/gitleaks)
- [Pre-commit Framework](https://pre-commit.com/)
- [aclue Security Policy](./SECURITY.md)

---

**Document Classification**: CONFIDENTIAL
**Review Cycle**: Quarterly
**Next Review**: January 2026
**Document Owner**: Security Team
**Approval**: CTO / Security Lead

For questions or concerns regarding secret management, contact the security team immediately. Remember: when in doubt, assume it's a secret and protect it accordingly.