# aclue Testing Automation Suite

## 🚀 Overview

The aclue Testing Automation Suite is a comprehensive, production-ready testing infrastructure that unifies 100+ testing tools into a seamless, enterprise-grade testing platform. This suite provides automated security scanning, performance monitoring, code quality analysis, and deployment gates for the aclue platform.

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Features](#features)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [CI/CD Integration](#cicd-integration)
- [Configuration](#configuration)
- [Testing Categories](#testing-categories)
- [Execution Modes](#execution-modes)
- [Reporting](#reporting)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

## 🚀 Quick Start

### Prerequisites
- Linux/macOS environment
- Node.js 18+ and npm
- Python 3.11+ and pip
- Git
- curl and jq

### 1. Setup Automation Infrastructure
```bash
# Run the setup script to install all dependencies and configure the environment
./tests-22-sept/automated/setup-automation.sh
```

### 2. Run Your First Test
```bash
# Quick security and performance scan (5-10 minutes)
./quick-scan.sh

# Standard testing suite (15-30 minutes)
./run-tests.sh --standard

# Full comprehensive testing (1-2 hours)
./run-tests.sh --full
```

### 3. Check System Health
```bash
# Validate all systems are operational
./health-check.sh
```

## ✨ Features

### 🔒 Security Testing
- **Static Application Security Testing (SAST)**: Bandit, ESLint Security, CodeQL
- **Dependency Vulnerability Scanning**: npm audit, pip-audit, Safety
- **Secret Detection**: Gitleaks, TruffleHog patterns
- **Container Security**: Trivy scanning
- **Infrastructure Security**: SSL certificate monitoring, DNS validation

### ⚡ Performance Monitoring
- **Frontend Performance**: Lighthouse audits, Core Web Vitals
- **API Performance**: Load testing with Artillery, response time monitoring
- **Resource Monitoring**: Page size analysis, connection monitoring
- **Real-time Alerts**: Performance degradation detection

### 📝 Code Quality Analysis
- **Frontend Quality**: ESLint, Prettier, TypeScript checks
- **Backend Quality**: Pylint, MyPy, code coverage analysis
- **Maintainability**: Cyclomatic complexity, duplication detection
- **Standards Compliance**: Coding standards enforcement

### 🚪 Quality Gates
- **Multi-level Gates**: Strict, Standard, Lenient enforcement levels
- **Deployment Blocking**: Automatic deployment prevention on quality failures
- **Pull Request Integration**: Automated quality feedback on PRs
- **Customizable Thresholds**: Configurable quality and security thresholds

### 📊 Unified Reporting
- **Executive Dashboard**: High-level health score and trend analysis
- **Category-specific Reports**: Detailed results for each testing category
- **Multiple Formats**: HTML, JSON, PDF export capabilities
- **Historical Tracking**: Trend analysis and comparison over time

### 🔄 CI/CD Integration
- **GitHub Actions**: Complete workflow automation
- **Multiple Triggers**: Push, PR, schedule, manual execution
- **Parallel Execution**: Optimized for speed and resource efficiency
- **Artifact Management**: Comprehensive result storage and retrieval

## 🏗️ Architecture

```
aclue Testing Automation Suite
├── Master Orchestrator (run-all-automated-tests.sh)
├── Quick Scan (quick-scan.sh)
├── Health Check (health-check.sh)
├── Category-Specific Testing
│   ├── Security (security/)
│   ├── Frontend (frontend/)
│   ├── API (api/)
│   ├── Performance (performance/)
│   ├── Code Quality (code-quality/)
│   ├── Database (database/)
│   └── Infrastructure (infrastructure/)
├── Configuration Management
│   ├── Environment Configs (config/environments/)
│   ├── Tool Configs (config/tools/)
│   └── Secrets Management (config/secrets/)
├── CI/CD Workflows (.github/workflows/)
├── Reporting Engine (reports/)
└── Utilities and Tools (tools/)
```

## 🛠️ Installation

### Automated Installation
```bash
# Clone the repository
git clone <repository-url>
cd aclue-preprod

# Run the setup script
chmod +x tests-22-sept/automated/setup-automation.sh
./tests-22-sept/automated/setup-automation.sh
```

### Manual Installation
```bash
# Install Node.js dependencies
cd tests-22-sept/automated/tools
npm install

# Install Python dependencies
python -m venv python-venv
source python-venv/bin/activate
pip install bandit safety pip-audit pytest coverage pylint mypy

# Install system tools (requires sudo)
sudo apt-get install nmap nikto postgresql-client

# Download additional tools
wget -O gitleaks.tar.gz https://github.com/zricethezav/gitleaks/releases/latest/download/gitleaks_*_linux_x64.tar.gz
tar -xzf gitleaks.tar.gz
sudo mv gitleaks /usr/local/bin/
```

## 📖 Usage

### Command Line Interface

#### Master Test Orchestrator
```bash
# Show help and available options
./run-tests.sh --help

# Run with different execution modes
./run-tests.sh --quick          # 5-10 minute critical checks
./run-tests.sh --standard       # 15-30 minute core testing
./run-tests.sh --full           # 1-2 hour comprehensive testing
./run-tests.sh --custom --categories security,api,performance

# Advanced options
./run-tests.sh --standard \
  --parallel \
  --jobs 4 \
  --timeout 3600 \
  --verbose \
  --formats html,json \
  --slack-webhook $SLACK_URL
```

#### Quick Security Scan
```bash
# Fast security and performance checks
./quick-scan.sh

# The quick scan includes:
# - Secret detection
# - Critical dependency vulnerabilities
# - Basic code security patterns
# - API health validation
# - Frontend accessibility
```

#### System Health Check
```bash
# Comprehensive system validation
./health-check.sh

# Health check validates:
# - Frontend accessibility and performance
# - Backend API functionality
# - Database connectivity
# - SSL certificate status
# - DNS resolution
```

### Programmatic Usage

#### Python Integration
```python
import subprocess
import json

# Run quick scan programmatically
result = subprocess.run(['./quick-scan.sh'],
                       capture_output=True, text=True)

# Parse results
if result.returncode == 0:
    print("Quick scan passed - safe to deploy")
else:
    print("Quick scan failed - deployment blocked")
```

#### Node.js Integration
```javascript
const { exec } = require('child_process');

// Run standard test suite
exec('./run-tests.sh --standard --formats json', (error, stdout, stderr) => {
  if (error) {
    console.error('Testing failed:', error);
    return;
  }

  console.log('Testing completed successfully');
});
```

## 🔄 CI/CD Integration

### GitHub Actions Workflows

The suite includes several pre-configured GitHub Actions workflows:

#### 1. Automated Testing Suite (`.github/workflows/automated-testing-suite.yml`)
- **Triggers**: Push to main/develop, PRs, scheduled runs
- **Features**: Complete testing pipeline with parallel execution
- **Outputs**: Unified reports, Slack notifications, deployment gates

#### 2. Security Scan Pipeline (`.github/workflows/security-scan.yml`)
- **Triggers**: All pushes/PRs, every 6 hours
- **Features**: Comprehensive security analysis with SAST, dependency scanning, secret detection
- **Outputs**: Security reports, vulnerability alerts, security gates

#### 3. Performance Monitoring (`.github/workflows/performance-monitoring.yml`)
- **Triggers**: Every 4 hours, manual execution
- **Features**: Lighthouse audits, API load testing, resource monitoring
- **Outputs**: Performance dashboards, degradation alerts

#### 4. Quality Gates (`.github/workflows/quality-gates.yml`)
- **Triggers**: PRs, pushes to main
- **Features**: Multi-level quality enforcement with configurable thresholds
- **Outputs**: Quality decisions, PR comments, deployment blocking

### Workflow Configuration

#### Environment Variables
```yaml
env:
  # URLs
  FRONTEND_URL: https://aclue.app
  BACKEND_URL: https://aclue-backend-production.up.railway.app

  # Thresholds
  MIN_CODE_COVERAGE: 80
  MAX_RESPONSE_TIME: 3000
  MIN_LIGHTHOUSE_SCORE: 85

  # Notifications
  SLACK_WEBHOOK: ${{ secrets.SLACK_WEBHOOK }}
```

#### Secrets Configuration
Required secrets in GitHub repository settings:
- `SLACK_WEBHOOK`: Slack webhook URL for notifications
- `SLACK_SECURITY_WEBHOOK`: Security-specific Slack channel
- `SNYK_TOKEN`: Snyk API token for advanced vulnerability scanning

### Integration Examples

#### Deployment Pipeline Integration
```yaml
deploy:
  needs: [quality-gates]
  if: needs.quality-gates.outputs.gate_status == 'PASS'
  runs-on: ubuntu-latest
  steps:
    - name: Deploy to Production
      run: |
        echo "Quality gates passed - deploying to production"
        # Your deployment commands here
```

#### Custom Notification Integration
```yaml
- name: Custom Notification
  if: failure()
  run: |
    curl -X POST -H 'Content-Type: application/json' \
      -d '{"text":"Testing failed for commit ${{ github.sha }}"}' \
      ${{ secrets.WEBHOOK_URL }}
```

## ⚙️ Configuration

### Environment Configuration

#### Development Environment (`config/environments/development.env`)
```bash
ENVIRONMENT=development
DEBUG=true
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
TEST_TIMEOUT=1800
MAX_PARALLEL_JOBS=2
ENABLE_VERBOSE_LOGGING=true
```

#### Production Environment (`config/environments/production.env`)
```bash
ENVIRONMENT=production
DEBUG=false
FRONTEND_URL=https://aclue.app
BACKEND_URL=https://aclue-backend-production.up.railway.app
TEST_TIMEOUT=3600
MAX_PARALLEL_JOBS=4
ENABLE_VERBOSE_LOGGING=false
```

### Tool Configuration

#### Security Tools (`config/tools/security.json`)
```json
{
  "bandit": {
    "enabled": true,
    "severity_level": "medium",
    "confidence_level": "medium",
    "exclude_paths": ["*/tests/*", "*/venv/*"]
  },
  "gitleaks": {
    "enabled": true,
    "scan_history": false
  }
}
```

#### Performance Tools (`config/tools/performance.json`)
```json
{
  "lighthouse": {
    "enabled": true,
    "throttling": "simulated3G",
    "form_factor": "desktop"
  },
  "artillery": {
    "enabled": true,
    "arrival_rate": 10,
    "duration": 60
  }
}
```

### Quality Thresholds

Configurable thresholds for different quality gate levels:

#### Strict Level
```json
{
  "code_quality": {
    "min_coverage": 90,
    "max_duplication": 2.0,
    "max_critical_issues": 0
  },
  "security": {
    "max_critical_vulnerabilities": 0,
    "max_high_vulnerabilities": 0
  },
  "performance": {
    "min_lighthouse_score": 90,
    "max_api_response_time": 1500
  }
}
```

#### Standard Level
```json
{
  "code_quality": {
    "min_coverage": 80,
    "max_duplication": 3.0,
    "max_critical_issues": 0
  },
  "security": {
    "max_critical_vulnerabilities": 0,
    "max_high_vulnerabilities": 2
  },
  "performance": {
    "min_lighthouse_score": 85,
    "max_api_response_time": 2000
  }
}
```

## 🧪 Testing Categories

### 1. Security Testing
- **Location**: `security/`
- **Tools**: Bandit, ESLint Security, Gitleaks, Safety, npm audit
- **Scope**: SAST, dependency vulnerabilities, secret detection
- **Runtime**: 5-15 minutes

### 2. Frontend Testing
- **Location**: `frontend/`
- **Tools**: Lighthouse, ESLint, Prettier, Accessibility audit
- **Scope**: Performance, accessibility, code quality, best practices
- **Runtime**: 3-10 minutes

### 3. API Testing
- **Location**: `api/`
- **Tools**: Custom API test suite, response validation
- **Scope**: Endpoint functionality, authentication, data validation
- **Runtime**: 2-8 minutes

### 4. Performance Testing
- **Location**: `performance/`
- **Tools**: Artillery, Lighthouse, response time monitoring
- **Scope**: Load testing, Core Web Vitals, resource optimization
- **Runtime**: 5-20 minutes

### 5. Code Quality Testing
- **Location**: `code-quality/`
- **Tools**: Pylint, MyPy, ESLint, coverage analysis
- **Scope**: Code standards, maintainability, test coverage
- **Runtime**: 3-12 minutes

### 6. Database Testing
- **Location**: `database/`
- **Tools**: Connection validation, query performance, security scan
- **Scope**: Database connectivity, performance, security
- **Runtime**: 2-8 minutes

### 7. Infrastructure Testing
- **Location**: `infrastructure/`
- **Tools**: SSL validation, DNS checks, service monitoring
- **Scope**: Infrastructure health, security configuration
- **Runtime**: 1-5 minutes

## 🚀 Execution Modes

### Quick Mode (5-10 minutes)
- **Purpose**: Rapid feedback for development and CI/CD gates
- **Categories**: Security (critical), Performance (basic)
- **Use Cases**: Pre-commit hooks, fast CI pipelines, deployment gates

### Standard Mode (15-30 minutes)
- **Purpose**: Comprehensive testing for regular development cycles
- **Categories**: Security, Performance, API, Frontend, Code Quality
- **Use Cases**: Pull requests, daily builds, feature testing

### Full Mode (1-2 hours)
- **Purpose**: Exhaustive testing for releases and security audits
- **Categories**: All categories with comprehensive coverage
- **Use Cases**: Release candidates, security audits, compliance checks

### Custom Mode
- **Purpose**: Tailored testing for specific requirements
- **Categories**: User-defined subset
- **Use Cases**: Focused testing, debugging, specialized audits

### CI Mode
- **Purpose**: Optimized for CI/CD environments
- **Categories**: Standard mode with CI-specific optimizations
- **Use Cases**: GitHub Actions, automated pipelines

### Health Mode
- **Purpose**: System validation and monitoring
- **Categories**: Security (basic), API health
- **Use Cases**: Health checks, monitoring, uptime validation

## 📊 Reporting

### Report Formats

#### HTML Reports
- **Purpose**: Human-readable dashboard with interactive elements
- **Features**: Executive summary, detailed results, trend analysis
- **Location**: `results/reports/test-report.html`

#### JSON Reports
- **Purpose**: Machine-readable data for integration and analysis
- **Features**: Structured data, API integration, custom processing
- **Location**: `results/reports/test-report.json`

#### Summary Reports
- **Purpose**: Quick overview of test results and key metrics
- **Features**: Pass/fail status, critical issues, recommendations
- **Location**: `results/summaries/execution-summary.json`

### Report Contents

#### Executive Summary
```json
{
  "overall_health": "HEALTHY",
  "success_rate": 95,
  "critical_issues": 0,
  "recommendations": [
    "Consider updating dependencies with medium vulnerabilities",
    "Optimize frontend images for better performance"
  ]
}
```

#### Category Results
```json
{
  "security": {
    "status": "PASSED",
    "duration": 45,
    "critical_issues": 0,
    "high_issues": 0,
    "medium_issues": 2
  }
}
```

#### Historical Tracking
- **Trend Analysis**: Performance and quality trends over time
- **Regression Detection**: Automatic detection of quality degradation
- **Baseline Comparison**: Compare results against established baselines

### Notification Integration

#### Slack Integration
```bash
./run-tests.sh --standard --slack-webhook $SLACK_WEBHOOK
```

#### Email Integration
```bash
./run-tests.sh --standard --email user@example.com,team@example.com
```

#### Custom Webhooks
```bash
./run-tests.sh --standard --webhook-url $CUSTOM_WEBHOOK
```

## 🔧 Troubleshooting

### Common Issues

#### 1. Permission Denied Errors
```bash
# Fix script permissions
chmod +x tests-22-sept/automated/*.sh
chmod +x tests-22-sept/automated/*/*.sh
```

#### 2. Missing Dependencies
```bash
# Re-run setup script
./tests-22-sept/automated/setup-automation.sh

# Check system requirements
./tests-22-sept/automated/run-all-automated-tests.sh --help
```

#### 3. Network Connectivity Issues
```bash
# Test API connectivity
curl -f https://aclue-backend-production.up.railway.app/health

# Test frontend connectivity
curl -f https://aclue.app
```

#### 4. Tool Installation Failures
```bash
# Check Python environment
source tests-22-sept/automated/tools/python-venv/bin/activate
python -c "import bandit, safety"

# Check Node.js environment
cd tests-22-sept/automated/tools
npm list
```

### Debug Mode
```bash
# Enable verbose logging
./run-tests.sh --standard --verbose

# Check logs
tail -f tests-22-sept/automated/results/*/execution.log
```

### Environment Validation
```bash
# Validate environment setup
./health-check.sh

# Check specific tool availability
command -v bandit
command -v lighthouse
command -v gitleaks
```

## 🤝 Contributing

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/new-testing-tool
   ```

3. **Add your testing tool**
   ```bash
   # Create tool script in appropriate category
   mkdir -p tests-22-sept/automated/security
   touch tests-22-sept/automated/security/new-security-tool.sh
   ```

4. **Update master orchestrator**
   ```bash
   # Add your tool to the master script
   vim tests-22-sept/automated/run-all-automated-tests.sh
   ```

5. **Test your changes**
   ```bash
   ./run-tests.sh --custom --categories security
   ```

6. **Update documentation**
   ```bash
   # Update README and tool documentation
   vim tests-22-sept/automated/README.md
   ```

7. **Submit pull request**

### Adding New Testing Tools

#### 1. Create Tool Script
```bash
#!/bin/bash
# Template for new testing tool

set -euo pipefail

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] [$1] $2"
}

run_new_tool() {
    log "INFO" "Starting new tool..."

    # Tool execution logic here
    if new-tool-command; then
        log "SUCCESS" "New tool completed successfully"
        return 0
    else
        log "ERROR" "New tool failed"
        return 1
    fi
}

# Execute if run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    run_new_tool "$@"
fi
```

#### 2. Integration Checklist
- [ ] Tool script follows naming convention
- [ ] Tool script is executable (`chmod +x`)
- [ ] Tool integrated into category master script
- [ ] Tool added to master orchestrator
- [ ] Configuration added to tool config files
- [ ] Documentation updated
- [ ] CI/CD workflow updated (if needed)

### Code Standards

#### Shell Scripts
- Use `set -euo pipefail` for error handling
- Follow Google Shell Style Guide
- Include comprehensive logging
- Provide help text and usage examples
- Handle timeouts and resource cleanup

#### Documentation
- Use clear, concise language
- Include practical examples
- Maintain up-to-date configuration references
- Document all command-line options
- Provide troubleshooting guidance

## 📚 Additional Resources

### Related Documentation
- [aclue Platform Documentation](../../CLAUDE.md)
- [Security Testing Best Practices](security/README.md)
- [Performance Optimization Guide](performance/README.md)
- [CI/CD Integration Guide](../../.github/workflows/README.md)

### External Tools Documentation
- [Bandit Security Linter](https://bandit.readthedocs.io/)
- [Google Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [Artillery Load Testing](https://artillery.io/docs/)
- [ESLint JavaScript Linter](https://eslint.org/docs/)

### Support and Community
- **Issues**: [GitHub Issues](https://github.com/aclue/testing-suite/issues)
- **Discussions**: [GitHub Discussions](https://github.com/aclue/testing-suite/discussions)
- **Slack**: #testing-automation channel

---

## 📄 License

This testing automation suite is part of the aclue platform and follows the same licensing terms.

---

**Version**: 1.0.0
**Last Updated**: September 2025
**Maintainer**: aclue Development Team