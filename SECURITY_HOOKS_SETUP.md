# aclue Security Hooks Setup Guide

## Overview

This document provides comprehensive instructions for setting up and using the enterprise-grade pre-commit security hooks system for the aclue platform. This system prevents secret exposure and enforces security best practices across the development team.

## 🚨 Critical Security Implementation

The aclue platform implements a multi-layered secret detection system that automatically scans all code commits for:

- **AWS credentials and API keys**
- **TLS certificates and SSH keys**
- **Database connection strings**
- **JWT tokens and OAuth credentials**
- **Environment variables and configuration secrets**
- **Third-party service API keys**

## Quick Start

### 1. Initial Setup (One-time per developer)

```bash
# Clone the repository (if not already done)
git clone https://github.com/your-org/aclue-preprod.git
cd aclue-preprod

# Run the automated setup script
./setup-security-hooks.sh

# Verify installation
git add . && git commit -m "test: verify security hooks installation"
```

### 2. What Gets Installed

The setup script automatically installs:

- **detect-secrets**: Primary secret scanning with baseline management
- **GitLeaks**: Git history secret detection
- **Bandit**: Python security vulnerability scanning
- **Safety**: Python dependency vulnerability checking
- **ESLint**: JavaScript/TypeScript code quality (web directory only)
- **Black & Ruff**: Python code formatting and linting (backend directory only)
- **File validation**: YAML, JSON, TOML syntax checking
- **Environment file prevention**: Blocks .env files from being committed

## Daily Development Workflow

### Automatic Secret Detection

Every time you commit code, the hooks automatically run:

```bash
git add .
git commit -m "feat: add new authentication feature"

# Hooks run automatically and will:
# ✅ Pass if no secrets detected
# ❌ Fail and block commit if secrets found
```

### What Happens When Secrets Are Detected

If secrets are found, you'll see output like:

```
Detect secrets...........................................................Failed
- hook id: detect-secrets
- exit code: 1

test_file.py:2: AWS Access Key detected
test_file.py:5: Secret Keyword detected
```

**Action Required**: Remove the secrets and commit again.

### Manual Security Scanning

Run comprehensive scans manually:

```bash
# Full security scan
./scan-secrets.sh

# Run specific hooks
source security-hooks-env/bin/activate
pre-commit run detect-secrets --all-files
pre-commit run bandit --all-files
```

## Configuration Details

### Pre-commit Configuration Structure

The `.pre-commit-config.yaml` file defines multiple security layers:

```yaml
repos:
  # Primary secret detection
  - repo: https://github.com/Yelp/detect-secrets
    hooks:
      - id: detect-secrets
        args: ['--baseline', '.secrets.baseline']

  # Secondary secret detection
  - repo: https://github.com/gitleaks/gitleaks
    hooks:
      - id: gitleaks

  # Python security scanning
  - repo: https://github.com/PyCQA/bandit
    hooks:
      - id: bandit
        args: ['-r', 'backend/', '-ll']

  # Environment file prevention
  - repo: local
    hooks:
      - id: prevent-env-files
        name: Prevent .env files from being committed
```

### Excluded Files and Directories

The following are automatically excluded from scanning:

- `node_modules/` - Node.js dependencies
- `.git/` - Git internal files
- `*env/`, `*-env/`, `venv/` - Python virtual environments
- `.vscode/` - VS Code settings
- `tests/`, `.pytest_cache/` - Test files and cache
- Package lock files (`package-lock.json`, `yarn.lock`)
- Documentation files (`*.md`)

## Secret Detection Patterns

### AWS Credentials
```python
# ❌ Will be detected and blocked
aws_access_key = "AKIA" + "1234567890123456"  # Example pattern
aws_secret_key = "secret" + "_key_value_here"  # Example pattern

# ✅ Allowed - use environment variables
aws_access_key = os.getenv('AWS_ACCESS_KEY_ID')
```

### API Keys and Tokens
```javascript
// ❌ Will be detected and blocked
const apiKey = "sk-" + "example_key_here";  // Example pattern
const token = "ghp_" + "example_token_here";  // Example pattern

// ✅ Allowed - use environment variables
const apiKey = process.env.API_KEY;
const token = process.env.GITHUB_TOKEN;
```

### Database Credentials
```python
# ❌ Will be detected and blocked
DATABASE_URL = "postgresql://user:password123@localhost:5432/db"

# ✅ Allowed - use environment variables
DATABASE_URL = os.getenv('DATABASE_URL')
```

### TLS Certificates and SSH Keys
```
# ❌ Will be detected and blocked
# Any content matching cryptographic key patterns
# SSH keys, TLS certificates, PGP keys

# ✅ Store in secure key management systems
# Use environment variables or secure vaults
# Store certificates in proper certificate stores
```

## Environment Variable Management

### Allowed Files
- `.env.example` - Template files for environment variables
- `.env.template` - Template files for environment variables
- `.env.production.example` - Production template files

### Blocked Files
- `.env` - Local development environment files
- `.env.local` - Local environment overrides
- `.env.production` - Production environment files
- `.env.test` - Test environment files

### Best Practices

1. **Always use example files**:
   ```bash
   # ✅ Create template files
   cp .env .env.example
   # Remove actual values, replace with placeholders
   ```

2. **Store secrets securely**:
   - **Local Development**: Use `.env` files (gitignored)
   - **Production**: Use Vercel/Railway dashboard environment variables
   - **Team Sharing**: Use secure password managers

3. **Environment variable naming**:
   ```bash
   # ✅ Good naming
   DATABASE_URL=placeholder_database_url
   API_KEY=your_api_key_here

   # ❌ Avoid specific values
   DATABASE_URL=postgresql://user:actual_password@localhost/db
   API_KEY=actual_key_value_here
   ```

## Handling False Positives

### Temporary Bypass (Emergency Use Only)
```bash
# Skip all pre-commit hooks (use sparingly)
git commit --no-verify -m "emergency: critical production fix"
```

### Permanent Allowlist
If you have legitimate false positives:

```bash
# Add to allowlist
source security-hooks-env/bin/activate
detect-secrets audit .secrets.baseline

# Mark as allowed and commit the updated baseline
git add .secrets.baseline
git commit -m "fix: update secrets baseline for false positive"
```

## Troubleshooting

### Common Issues and Solutions

#### 1. Pre-commit Not Running
```bash
# Reinstall hooks
source security-hooks-env/bin/activate
pre-commit uninstall
pre-commit install
pre-commit install --hook-type commit-msg
```

#### 2. Python Environment Issues
```bash
# Recreate environment
rm -rf security-hooks-env
./setup-security-hooks.sh
```

#### 3. ESLint Configuration Missing
```bash
# For web directory JavaScript files
cd web
npm init @eslint/config
# Follow prompts to create .eslintrc.js
```

#### 4. Slow Hook Performance
```bash
# Run on specific files only
pre-commit run --files path/to/specific/file.py

# Skip heavy tools temporarily
SKIP=bandit,safety git commit -m "quick fix"
```

#### 5. Git Hooks Not Triggering
```bash
# Verify hooks installation
ls -la .git/hooks/pre-commit
# Should exist and be executable

# Check pre-commit configuration
pre-commit --version
cat .pre-commit-config.yaml
```

## Updating Security Tools

### Monthly Updates (Recommended)
```bash
# Run the update script
./update-security-hooks.sh

# Manual update process
source security-hooks-env/bin/activate
pre-commit autoupdate
pre-commit install --install-hooks
```

### Testing Updates
```bash
# Test on a sample file
echo "test = 'value'" > test_update.py
pre-commit run --files test_update.py
rm test_update.py
```

## Team Onboarding Checklist

### For New Team Members

- [ ] Clone the aclue repository
- [ ] Run `./setup-security-hooks.sh`
- [ ] Read this setup guide completely
- [ ] Test with a sample commit
- [ ] Understand secret detection patterns
- [ ] Know how to handle false positives
- [ ] Bookmark this documentation

### For Team Leads

- [ ] Ensure all team members complete onboarding
- [ ] Monitor for security hook bypasses
- [ ] Review false positives regularly
- [ ] Update security tools monthly
- [ ] Maintain team security training

## Security Standards Compliance

### Industry Standards Supported
- **OWASP**: Top 10 security practices
- **NIST**: Cybersecurity framework guidelines
- **PCI DSS**: Payment card industry standards (if applicable)
- **GDPR**: Data protection requirements

### Audit Trail
All security scans create audit trails:
- Pre-commit hook execution logs
- Secret detection results
- Security tool versions and updates
- False positive approvals

## Integration with CI/CD

### GitHub Actions Integration
```yaml
# .github/workflows/security.yml
name: Security Checks
on: [push, pull_request]
jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.12
      - name: Install security tools
        run: ./setup-security-hooks.sh
      - name: Run security checks
        run: |
          source security-hooks-env/bin/activate
          pre-commit run --all-files
```

### Deployment Pipeline Security
```bash
# Pre-deployment security check
source security-hooks-env/bin/activate
pre-commit run --all-files

# Only deploy if security checks pass
if [ $? -eq 0 ]; then
    echo "Security checks passed, proceeding with deployment"
    # Deploy to production
else
    echo "Security checks failed, blocking deployment"
    exit 1
fi
```

## Advanced Configuration

### Custom Secret Patterns
Add aclue-specific patterns to `.pre-commit-config.yaml`:

```yaml
- repo: local
  hooks:
    - id: detect-aclue-keys
      name: Detect aclue API Keys
      entry: bash -c 'grep -r "aclue_api_key\|aclue_secret" . && exit 1 || exit 0'
      language: system
```

### Performance Tuning
For large repositories:

```yaml
# Limit files scanned
exclude: |
  (?x)^(
    large_directory/|
    generated_files/|
    legacy_code/
  )$

# Reduce scan scope
args: ['--exclude-files', 'build/', '--exclude-files', 'dist/']
```

## Support and Escalation

### Self-Service Resources
1. Read this guide completely
2. Check troubleshooting section
3. Review `.pre-commit-config.yaml` configuration
4. Test with manual scans

### Team Support
- **Security Questions**: Contact security team
- **Tool Issues**: Create GitHub issue
- **False Positives**: Update baseline with team approval
- **Emergency Bypasses**: Document and review with team lead

### External Resources
- [detect-secrets documentation](https://github.com/Yelp/detect-secrets)
- [GitLeaks documentation](https://github.com/gitleaks/gitleaks)
- [Pre-commit documentation](https://pre-commit.com/)
- [aclue security guidelines](./CLAUDE.md#security)

## Conclusion

The aclue security hooks system provides comprehensive protection against secret exposure while maintaining developer productivity. Regular use of these tools ensures:

- **Zero secret commits** reach production
- **Consistent code quality** across the team
- **Automated security scanning** in development workflow
- **Compliance** with industry security standards

Remember: **Security is everyone's responsibility**. When in doubt, ask before committing sensitive information.

---

**Last Updated**: September 2025
**Version**: 1.0
**Maintained by**: aclue Security Team

For questions or improvements to this guide, please create an issue or contact the security team.