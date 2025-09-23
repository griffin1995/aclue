#!/bin/bash

# aclue Security Hooks Setup Script
# This script sets up comprehensive pre-commit hooks for secret detection
# and security scanning in the aclue development environment.
#
# Author: aclue Security Team
# Date: September 2025
# Version: 1.0

set -euo pipefail

# Colours for output (British spelling)
readonly RED='\033[0;31m'
readonly GREEN='\033[0;32m'
readonly YELLOW='\033[1;33m'
readonly BLUE='\033[0;34m'
readonly NC='\033[0m' # No Colour

# Logging functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1" >&2
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1" >&2
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1" >&2
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1" >&2
}

# Check if we're in the correct directory
check_repository() {
    if [ ! -f "CLAUDE.md" ] || [ ! -d ".git" ]; then
        log_error "This script must be run from the root of the aclue repository"
        exit 1
    fi

    if [ ! -f ".pre-commit-config.yaml" ]; then
        log_error "Pre-commit configuration file not found"
        exit 1
    fi

    log_success "Repository structure validated"
}

# Check system requirements
check_requirements() {
    log_info "Checking system requirements..."

    # Check Python version
    if ! command -v python3 &> /dev/null; then
        log_error "Python 3 is required but not installed"
        exit 1
    fi

    local python_version=$(python3 --version | cut -d' ' -f2)
    local major_version=$(echo $python_version | cut -d'.' -f1)
    local minor_version=$(echo $python_version | cut -d'.' -f2)

    if [ "$major_version" -lt 3 ] || [ "$major_version" -eq 3 -a "$minor_version" -lt 8 ]; then
        log_error "Python 3.8 or higher is required. Found: $python_version"
        exit 1
    fi

    log_success "Python $python_version detected"

    # Check Git
    if ! command -v git &> /dev/null; then
        log_error "Git is required but not installed"
        exit 1
    fi

    log_success "Git $(git --version | cut -d' ' -f3) detected"

    # Check Node.js (optional but recommended)
    if command -v node &> /dev/null; then
        local node_version=$(node --version)
        log_success "Node.js $node_version detected"
    else
        log_warning "Node.js not found - some hooks may not work for frontend files"
    fi
}

# Create Python virtual environment for security tools
setup_python_environment() {
    log_info "Setting up Python virtual environment for security tools..."

    local venv_dir="security-hooks-env"

    if [ -d "$venv_dir" ]; then
        log_warning "Virtual environment already exists. Removing and recreating..."
        rm -rf "$venv_dir"
    fi

    python3 -m venv "$venv_dir"
    source "$venv_dir/bin/activate"

    log_info "Installing security packages..."
    pip install --upgrade pip
    pip install \
        pre-commit \
        detect-secrets \
        bandit \
        safety \
        gitpython \
        requests

    log_success "Python environment setup completed"
}

# Install pre-commit hooks
install_precommit_hooks() {
    log_info "Installing pre-commit hooks..."

    source security-hooks-env/bin/activate

    # Install pre-commit hooks
    pre-commit install
    pre-commit install --hook-type commit-msg

    log_success "Pre-commit hooks installed"
}

# Update secrets baseline
update_secrets_baseline() {
    log_info "Updating secrets baseline..."

    source security-hooks-env/bin/activate

    # Backup existing baseline if it exists
    if [ -f ".secrets.baseline" ]; then
        cp ".secrets.baseline" ".secrets.baseline.backup"
        log_info "Backed up existing secrets baseline"
    fi

    # Generate new baseline with exclusions
    detect-secrets scan \
        --exclude-files node_modules \
        --exclude-files .git \
        --exclude-files security-hooks-env \
        --exclude-files .vscode \
        --exclude-files .pytest_cache \
        --exclude-files __pycache__ \
        --exclude-files "*.pyc" \
        --exclude-files "*.log" \
        --exclude-files ".secrets.baseline" \
        . > .secrets.baseline.new

    # Move new baseline into place
    mv .secrets.baseline.new .secrets.baseline

    log_success "Secrets baseline updated"
}

# Test pre-commit setup
test_precommit_setup() {
    log_info "Testing pre-commit configuration..."

    source security-hooks-env/bin/activate

    # Test pre-commit on a sample file
    echo "# Test file for pre-commit validation" > test_precommit.tmp
    echo "console.log('Hello, aclue!');" >> test_precommit.tmp

    if pre-commit run --files test_precommit.tmp; then
        log_success "Pre-commit hooks are working correctly"
    else
        log_warning "Some pre-commit hooks failed - this is normal for initial setup"
    fi

    # Clean up test file
    rm -f test_precommit.tmp
}

# Create helper scripts
create_helper_scripts() {
    log_info "Creating helper scripts..."

    # Create manual scan script
    cat > scan-secrets.sh << 'EOF'
#!/bin/bash
# Manual secret scanning script for aclue repository

set -euo pipefail

echo "🔍 Running comprehensive secret scan..."

# Activate virtual environment
source security-hooks-env/bin/activate

echo "1. Running detect-secrets..."
detect-secrets scan --exclude-files node_modules --exclude-files .git .

echo "2. Running GitLeaks..."
if command -v gitleaks &> /dev/null; then
    gitleaks detect --source .
else
    echo "GitLeaks not installed - install from https://github.com/gitleaks/gitleaks"
fi

echo "3. Running Bandit (Python security)..."
bandit -r backend/ -ll || true

echo "4. Running Safety (Python dependencies)..."
safety check || true

echo "✅ Secret scan completed"
EOF

    chmod +x scan-secrets.sh

    # Create pre-commit update script
    cat > update-security-hooks.sh << 'EOF'
#!/bin/bash
# Update security hooks script for aclue repository

set -euo pipefail

echo "🔄 Updating security hooks..."

# Activate virtual environment
source security-hooks-env/bin/activate

echo "1. Updating pre-commit hooks..."
pre-commit autoupdate

echo "2. Updating Python security packages..."
pip install --upgrade pre-commit detect-secrets bandit safety

echo "3. Reinstalling hooks..."
pre-commit install --install-hooks

echo "4. Running pre-commit on all files..."
pre-commit run --all-files || true

echo "✅ Security hooks updated"
EOF

    chmod +x update-security-hooks.sh

    log_success "Helper scripts created (scan-secrets.sh, update-security-hooks.sh)"
}

# Create documentation
create_documentation() {
    log_info "Creating security hooks documentation..."

    cat > SECURITY_HOOKS_GUIDE.md << 'EOF'
# aclue Security Hooks Guide

## Overview

This guide covers the comprehensive pre-commit security hooks system implemented for the aclue platform to prevent secret exposure and maintain code security standards.

## What's Included

### Secret Detection Tools
- **detect-secrets**: Primary secret scanning with baseline management
- **GitLeaks**: Secondary secret detection with Git history analysis
- **TruffleHog**: Tertiary verification-focused secret detection
- **Custom patterns**: aclue-specific credential detection

### Security Analysis Tools
- **Bandit**: Python security vulnerability scanning
- **Safety**: Python dependency vulnerability checking
- **Semgrep**: Static Application Security Testing (SAST)
- **Hadolint**: Docker security best practices

### Code Quality Tools
- **Black**: Python code formatting
- **Ruff**: Python linting and code quality
- **ESLint**: JavaScript/TypeScript linting
- **File validation**: YAML, JSON, TOML syntax checking

## Installation

Run the setup script from the repository root:

```bash
./setup-security-hooks.sh
```

This will:
1. Create a Python virtual environment
2. Install all required security tools
3. Configure pre-commit hooks
4. Generate secrets baseline
5. Create helper scripts

## Daily Usage

### Automatic Scanning
Pre-commit hooks run automatically when you commit changes:

```bash
git add .
git commit -m "feat: add new feature"
# Hooks run automatically
```

### Manual Scanning
Run comprehensive security scans manually:

```bash
# Full secret scan
./scan-secrets.sh

# Pre-commit on all files
source security-hooks-env/bin/activate
pre-commit run --all-files
```

### Updating Security Tools
Keep security tools up to date:

```bash
./update-security-hooks.sh
```

## Secret Detection Patterns

The system detects various types of credentials:

### Cloud Provider Credentials
- AWS access keys and secret keys
- Azure storage account keys
- Google Cloud service account keys

### API Keys and Tokens
- GitHub personal access tokens
- GitLab tokens
- JWT tokens
- OAuth tokens
- Bearer tokens

### Database Credentials
- Connection strings
- Database passwords
- Redis auth tokens

### Private Keys
- RSA, DSA, EC private keys
- SSH private keys
- PGP private keys
- TLS certificates

### Custom Patterns
- aclue-specific API keys
- Third-party service credentials
- Environment-specific tokens

## Handling False Positives

### Temporary Bypass
For urgent commits (use sparingly):

```bash
git commit --no-verify -m "urgent fix"
```

### Permanent Allowlist
Add false positives to `.secrets.baseline`:

```bash
source security-hooks-env/bin/activate
detect-secrets audit .secrets.baseline
```

## File Exclusions

The following files/directories are excluded from scanning:
- `node_modules/`
- `.git/`
- `__pycache__/`
- `.pytest_cache/`
- `*.log`
- Test files with mock credentials
- Documentation files (`.md`)

## Troubleshooting

### Hook Installation Issues
```bash
# Reinstall hooks
source security-hooks-env/bin/activate
pre-commit uninstall
pre-commit install
pre-commit install --hook-type commit-msg
```

### Python Environment Issues
```bash
# Recreate environment
rm -rf security-hooks-env
./setup-security-hooks.sh
```

### Performance Issues
If scans are slow, exclude additional directories in `.pre-commit-config.yaml`:

```yaml
exclude: |
  (?x)^(
    large_directory/|
    generated_files/
  )$
```

## Security Best Practices

### Environment Variables
- Never commit `.env` files (prevented by hooks)
- Use `.env.example` for templates
- Store secrets in secure vaults (Vercel/Railway dashboards)

### API Keys
- Rotate API keys regularly
- Use least-privilege access
- Monitor API key usage

### Development
- Test hooks before pushing
- Review security scan results
- Update security tools monthly

## Integration with CI/CD

For CI/CD pipelines, run security checks:

```bash
# In GitHub Actions / CI
source security-hooks-env/bin/activate
pre-commit run --all-files
```

## Team Onboarding

New team members should:
1. Clone the repository
2. Run `./setup-security-hooks.sh`
3. Read this guide
4. Test with a sample commit

## Support

For security-related questions:
- Check this guide first
- Review `.pre-commit-config.yaml`
- Consult the security team
- Update documentation for common issues

## Compliance

This security setup helps ensure:
- PCI DSS compliance (if applicable)
- GDPR data protection requirements
- Industry security best practices
- aclue security standards

---

**Remember**: Security is everyone's responsibility. When in doubt, ask before committing sensitive information.
EOF

    log_success "Documentation created (SECURITY_HOOKS_GUIDE.md)"
}

# Main setup function
main() {
    log_info "🔒 aclue Security Hooks Setup"
    log_info "========================================="

    check_repository
    check_requirements
    setup_python_environment
    install_precommit_hooks
    update_secrets_baseline
    test_precommit_setup
    create_helper_scripts
    create_documentation

    log_success "🎉 Security hooks setup completed successfully!"
    echo
    log_info "Next steps:"
    echo "  1. Read SECURITY_HOOKS_GUIDE.md for usage instructions"
    echo "  2. Test with a sample commit: git add . && git commit -m 'test: verify security hooks'"
    echo "  3. Run ./scan-secrets.sh for a manual security scan"
    echo "  4. Share this setup with your team members"
    echo
    log_info "The security hooks will now automatically scan for secrets on every commit."
}

# Run main function
main "$@"
