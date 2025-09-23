# aclue Infrastructure Validation Suite

## Overview

Comprehensive automated infrastructure security and compliance analysis suite for the aclue platform. This suite deploys and orchestrates multiple industry-standard security tools to provide complete infrastructure validation.

## Deployed Tools

### Container Security
- **Docker Scout** - Container image vulnerability analysis
- **Hadolint** - Dockerfile best practices and security linting
- **Dockle** - CIS Docker Benchmark compliance analysis

### Infrastructure as Code (IaC) Security
- **Checkov** - Multi-framework IaC security scanning (Terraform, CloudFormation, Kubernetes, etc.)
- **tfsec** - Terraform-specific static analysis
- **Terrascan** - Multi-cloud IaC security policy enforcement
- **KICS** - Infrastructure as Code security scanning

### Secret Detection
- **Gitleaks** - Git repository secret scanning with entropy detection
- **TruffleHog** - Deep secret discovery in Git history
- **detect-secrets** - Baseline secret detection and management

## Directory Structure

```
tests-22-sept/automated/infrastructure/
├── tools/                  # All security tool binaries
│   ├── hadolint           # Dockerfile linter
│   ├── dockle             # Docker security scanner
│   ├── gitleaks           # Git secret scanner
│   ├── tfsec              # Terraform security scanner
│   └── terrascan          # Multi-cloud IaC scanner
├── configs/               # Tool configuration files
│   ├── checkov-config.yaml
│   ├── gitleaks-config.toml
│   ├── hadolint-config.yaml
│   ├── terrascan-config.toml
│   ├── detect-secrets-config.yaml
│   └── dockle-config.yaml
├── reports/               # Generated security reports
├── venv/                  # Python virtual environment for Python tools
├── validate-infrastructure.sh  # Master validation script
├── run-all-tools.sh      # Tool testing script
├── run-checkov.sh        # Individual Checkov runner
└── run-gitleaks.sh       # Individual Gitleaks runner
```

## Usage

### Full Infrastructure Validation

Run comprehensive security analysis across all tools:

```bash
cd tests-22-sept/automated/infrastructure
./validate-infrastructure.sh
```

This script will:
1. Scan all Dockerfiles with Hadolint and Dockle
2. Analyze Docker images with Docker Scout
3. Run IaC security scans with Checkov, tfsec, Terrascan, and KICS
4. Perform secret detection with Gitleaks, TruffleHog, and detect-secrets
5. Generate consolidated HTML and JSON reports

### Individual Tool Testing

Test all tools for proper installation and configuration:

```bash
./run-all-tools.sh
```

### Individual Tool Execution

Run specific tools individually:

```bash
# Checkov comprehensive IaC scan
./run-checkov.sh

# Gitleaks secret detection
./run-gitleaks.sh
```

## Configuration

### Tool Configurations

Each tool has optimized configuration files in the `configs/` directory:

- **Checkov**: Comprehensive IaC scanning across all frameworks
- **Gitleaks**: Custom secret detection rules for cloud platforms and APIs
- **Hadolint**: Strict Dockerfile best practices enforcement
- **Terrascan**: Multi-cloud security policy enforcement
- **detect-secrets**: Baseline secret detection with allowlists
- **Dockle**: CIS Docker Benchmark compliance checking

### Scan Targets

The validation suite automatically scans:

- **Vercel deployment configuration**
- **Railway deployment configuration**
- **Supabase security settings**
- **GitHub Actions workflow security**
- **Dockerfile security and best practices**
- **Environment variable security**
- **Git repository secret history**
- **Infrastructure as Code files**
- **Package.json security configurations**

## Report Generation

### Automated Reports

The validation script generates:

1. **JSON Reports**: Machine-readable detailed findings for each tool
2. **HTML Dashboard**: Human-readable consolidated security report
3. **Summary Statistics**: Total issues, tools executed, compliance status
4. **Execution Logs**: Detailed logging of scan execution

### Report Files

```
reports/
├── infrastructure-validation-report.html    # Main dashboard
├── infrastructure-validation-report.json    # Consolidated JSON
├── validation-summary.json                  # Execution summary
├── checkov-report.json                     # IaC security findings
├── gitleaks-report.json                    # Secret detection results
├── hadolint-*.json                         # Dockerfile analysis
├── dockle-*.json                           # Docker security analysis
├── tfsec-report.json                       # Terraform security
├── terrascan-report.json                   # Multi-cloud IaC security
└── infrastructure-validation.log           # Execution logs
```

## Security Focus Areas

### aclue Platform Specific

- **Vercel Edge Network Configuration**: Security headers, CSP, deployment settings
- **Railway Docker Container**: Container security, resource limits, health checks
- **Supabase PostgreSQL**: Database security, connection strings, access policies
- **GitHub Actions**: Workflow security, secret management, permission scoping
- **Environment Variables**: Secret detection, configuration security

### Compliance Frameworks

The suite checks against multiple compliance standards:
- **PCI DSS**: Payment card industry security
- **NIST**: National Institute of Standards and Technology
- **ISO 27001**: Information security management
- **GDPR**: General Data Protection Regulation
- **SOC 2**: Service Organization Control 2
- **CIS Controls**: Center for Internet Security benchmarks

## Performance Characteristics

### Execution Times (Typical)

- **Container Security**: 2-5 minutes (depends on number of images)
- **IaC Security**: 3-8 minutes (depends on codebase size)
- **Secret Detection**: 1-3 minutes (depends on Git history)
- **Total Validation**: 5-15 minutes

### Resource Requirements

- **CPU**: Moderate (parallel execution supported)
- **Memory**: 2-4GB recommended
- **Disk**: 500MB for tools, 100MB for reports
- **Network**: Required for tool updates and vulnerability databases

## Integration

### CI/CD Integration

Add to GitHub Actions workflow:

```yaml
- name: Infrastructure Security Validation
  run: |
    cd tests-22-sept/automated/infrastructure
    ./validate-infrastructure.sh
```

### Exit Codes

- `0`: No security issues detected
- `1`: Security issues found (review required)
- `2`: Tool execution errors

## Maintenance

### Tool Updates

Tools are installed as standalone binaries and can be updated by:
1. Downloading latest releases
2. Updating configuration files if needed
3. Testing with `./run-all-tools.sh`

### Adding New Tools

To add additional security tools:
1. Install tool binary in `tools/` directory
2. Create configuration file in `configs/`
3. Add execution logic to `validate-infrastructure.sh`
4. Update this documentation

## Security Recommendations

### Critical Findings Priority

1. **Secret Exposure**: Immediate remediation required
2. **Container Vulnerabilities**: High-severity CVEs first
3. **IaC Misconfigurations**: Security controls and access policies
4. **Compliance Violations**: Regulatory requirements

### Best Practices

- Run validation on every pull request
- Address critical and high severity issues immediately
- Maintain baseline configurations for consistent scanning
- Regular tool updates for latest security rules
- Document exceptions and false positives

## Troubleshooting

### Common Issues

1. **Docker not available**: Install Docker for container scanning
2. **Python tools missing**: Check virtual environment activation
3. **Permission errors**: Ensure scripts are executable (`chmod +x`)
4. **Large repository timeouts**: Exclude unnecessary directories

### Support

- Check execution logs in `reports/infrastructure-validation.log`
- Verify tool installation with `./run-all-tools.sh`
- Review individual tool configurations in `configs/`

---

## Example Output

```bash
$ ./validate-infrastructure.sh

🛡️ Starting aclue Infrastructure Validation Suite
Project root: /home/jack/Documents/aclue-preprod
Reports directory: /home/jack/Documents/aclue-preprod/tests-22-sept/automated/infrastructure/reports

=== Container Security Analysis ===
✅ Hadolint analysis completed for 16 Dockerfiles
✅ Docker Scout analysis completed for 3 images
✅ Dockle analysis completed for 3 images

=== Infrastructure as Code Security Analysis ===
✅ Checkov analysis completed
✅ tfsec analysis completed
✅ Terrascan analysis completed

=== Secret Detection Analysis ===
✅ Gitleaks analysis completed
✅ TruffleHog analysis completed
✅ detect-secrets analysis completed

=== Infrastructure Validation Complete ===
✅ Tools executed: 8
ℹ️  Total issues found: 23
✅ Reports saved to: reports/

⚠️  Security issues detected. Please review reports and implement fixes.
```

This comprehensive infrastructure validation suite provides enterprise-grade security analysis for the aclue platform, ensuring robust security posture across all deployment and infrastructure components.