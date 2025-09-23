# Aclue Platform Automated Security Scanning Suite

## Overview

This directory contains a comprehensive automated security scanning suite for the Aclue platform, configured for **maximum scan depth** to identify all potential security vulnerabilities.

## Security Tools Deployed

### 1. **Semgrep** (Framework-aware static analysis)
- **Version**: Latest
- **Purpose**: Source code security analysis
- **Coverage**: OWASP Top 10, secrets, security audit, best practices
- **Languages**: Python, JavaScript, TypeScript, React, FastAPI

### 2. **Nuclei** (20.5k stars, 9,000+ templates)
- **Version**: 3.3.5
- **Purpose**: Web vulnerability scanning
- **Templates**: 9,000+ vulnerability detection templates
- **Protocols**: HTTP, DNS, SSL, WebSocket, Network

### 3. **Trivy** (Container/filesystem scanner)
- **Version**: Latest (Docker)
- **Purpose**: Container and filesystem vulnerability scanning
- **Scans**: Vulnerabilities, misconfigurations, secrets, licenses
- **Coverage**: OS packages, language-specific dependencies, IaC

### 4. **OWASP ZAP** (Dynamic application security testing)
- **Version**: Latest Stable (Docker)
- **Purpose**: Web application penetration testing
- **Modes**: Baseline, API, Full scan
- **Features**: Spider, AJAX spider, active/passive scanning

### 5. **Detect-Secrets** (Secret detection)
- **Version**: Latest
- **Purpose**: Hardcoded secret detection
- **Coverage**: API keys, passwords, tokens, certificates

## Quick Start

### Run Standard Security Scan
```bash
./run-security-scan.sh
```

### Run Quick Scan (Critical Issues Only)
```bash
./run-security-scan.sh quick
```

### Run Full Comprehensive Scan
```bash
./run-security-scan.sh full
```

### Run Specific Tool
```bash
./run-security-scan.sh semgrep   # Source code analysis
./run-security-scan.sh nuclei    # Web vulnerability scan
./run-security-scan.sh trivy     # Container/filesystem scan
./run-security-scan.sh zap       # OWASP ZAP scan
./run-security-scan.sh secrets   # Secret detection
```

## Directory Structure

```
tests-22-sept/automated/security/
├── configs/                    # Tool configuration files
│   ├── nuclei-config.yaml     # Nuclei scanner config
│   ├── semgrep-config.yaml    # Semgrep rules config
│   ├── trivy-config.yaml      # Trivy scanner config
│   └── zap-config.yaml        # OWASP ZAP config
├── reports/                    # Scan reports (auto-generated)
│   ├── consolidated/          # Consolidated security reports
│   ├── nuclei/               # Nuclei scan results
│   ├── semgrep/              # Semgrep findings
│   ├── trivy/                # Trivy scan results
│   ├── zap/                  # OWASP ZAP reports
│   └── secrets/              # Secret detection results
├── scripts/                   # Automation scripts
│   └── master-security-scan.sh  # Master orchestration script
├── logs/                      # Scan execution logs
├── run-security-scan.sh      # Quick-start script
└── README.md                 # This file
```

## Scan Targets

### Production Targets
- **Frontend**: https://aclue.app
- **Backend API**: https://aclue-backend-production.up.railway.app
- **Secondary Domain**: https://aclue.co.uk

### Development Targets
- **Local Frontend**: http://localhost:3000
- **Local Backend**: http://localhost:8000

### Code Analysis Targets
- **Frontend Code**: `/web` directory
- **Backend Code**: `/backend` directory
- **Dependencies**: `package.json`, `requirements.txt`
- **Dockerfiles**: Container configurations
- **IaC Files**: Infrastructure as code

## Configuration Details

### Semgrep Configuration
- **Rules**: security-audit, OWASP Top 10, secrets, best practices
- **Depth**: Maximum with dataflow and taint analysis
- **Coverage**: All file types including configs and env files
- **Memory**: 8GB allocated for deep analysis

### Nuclei Configuration
- **Templates**: ALL available (9,000+)
- **Severity**: Critical, High, Medium, Low, Info
- **Protocols**: All supported protocols
- **Rate Limit**: 150 requests/sec
- **Concurrency**: 25 threads

### Trivy Configuration
- **Checks**: vuln, misconfig, secret, license
- **Severity**: ALL levels
- **Compliance**: CIS, PCI-DSS, HIPAA, NIST
- **Scanners**: All enabled

### OWASP ZAP Configuration
- **Attack Strength**: INSANE (maximum)
- **Alert Threshold**: LOW (catch everything)
- **Spider Depth**: 10 levels
- **Scan Rules**: ALL enabled
- **Add-ons**: ALL security add-ons

## Report Formats

Each tool generates multiple report formats:

- **JSON**: Machine-readable for automation
- **SARIF**: Standard format for CI/CD integration
- **HTML**: Human-readable reports with visualizations
- **Markdown**: Documentation-friendly format
- **XML**: Legacy tool integration
- **Text**: Quick console review

## Security Checks Performed

### 1. Application Security
- SQL Injection
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- XML External Entity (XXE)
- Remote Code Execution
- Path Traversal
- Command Injection
- LDAP Injection
- Server-Side Request Forgery (SSRF)

### 2. Authentication & Authorization
- Weak passwords
- Session management
- JWT vulnerabilities
- OAuth misconfigurations
- Privilege escalation

### 3. Infrastructure Security
- Misconfigurations
- Exposed services
- SSL/TLS issues
- Security headers
- CORS policies

### 4. Dependency Security
- Known CVEs
- Outdated packages
- License compliance
- Supply chain attacks

### 5. Secret Detection
- API keys
- Database credentials
- Private keys
- Tokens
- Certificates

### 6. Compliance Checks
- OWASP Top 10
- CIS Benchmarks
- PCI-DSS
- HIPAA
- GDPR

## Interpreting Results

### Severity Levels

- **CRITICAL**: Immediate action required, production impact
- **HIGH**: Should be fixed before next release
- **MEDIUM**: Plan to fix in near future
- **LOW**: Consider fixing if time permits
- **INFO**: Informational, best practices

### False Positives

Some findings may be false positives. Review each finding and:
1. Verify if the issue is exploitable
2. Check if compensating controls exist
3. Document accepted risks
4. Update tool configurations to reduce noise

## Integration with CI/CD

### GitHub Actions
```yaml
- name: Run Security Scan
  run: |
    cd tests-22-sept/automated/security
    ./run-security-scan.sh quick
```

### Pre-commit Hook
```bash
#!/bin/bash
cd tests-22-sept/automated/security
./run-security-scan.sh semgrep
```

## Troubleshooting

### Docker Issues
```bash
# Check Docker daemon
docker info

# Pull latest images
docker pull zaproxy/zap-stable:latest
docker pull aquasec/trivy:latest
```

### Virtual Environment Issues
```bash
# Recreate virtual environment
python3 -m venv security-venv
source security-venv/bin/activate
pip install semgrep detect-secrets
```

### Permission Issues
```bash
# Fix script permissions
chmod +x run-security-scan.sh
chmod +x scripts/*.sh
```

## Best Practices

1. **Regular Scanning**: Run scans weekly or before releases
2. **Incremental Fixes**: Address critical issues first
3. **Documentation**: Document accepted risks and compensating controls
4. **Tool Updates**: Keep scanning tools and rules updated
5. **Custom Rules**: Add project-specific security rules
6. **Review Process**: Establish security review workflow
7. **Training**: Share findings with development team

## Security Contact

For security issues or questions about these scans:
- Review findings in `/reports/consolidated/`
- Check logs in `/logs/` for scan details
- Escalate CRITICAL findings immediately

## License

This security scanning suite is configured specifically for the Aclue platform.
All tools used are open-source or freely available for security testing.

---

**Last Updated**: September 2025
**Version**: 1.0.0
**Status**: Production Ready