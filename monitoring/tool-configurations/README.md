# Monitoring Tool Configurations for aclue Platform

## Overview

This directory contains monitoring tool configurations specifically designed to work with the Cloudflare WAF allowlist for the aclue platform. Each tool is configured with appropriate headers, rate limiting, and endpoint restrictions to ensure compatibility with the production security setup.

## WAF Allowlist Tiers

### Tier 1: Critical Monitoring (Full Access)
- **Purpose**: Essential uptime and performance monitoring
- **Rate Limit**: 60 requests/minute
- **Access Level**: Full platform access
- **Tools**: Pingdom, UptimeRobot, StatusCake, Datadog, New Relic

### Tier 2: Performance Testing (Controlled Access)
- **Purpose**: Load testing and performance analysis
- **Rate Limit**: 30 requests/minute
- **Access Level**: Specific endpoints only
- **Tools**: K6, Artillery, Lighthouse, GTmetrix

### Tier 3: Security Scanning (Limited Access)
- **Purpose**: Vulnerability assessment and security testing
- **Rate Limit**: 10 requests/minute
- **Access Level**: Public endpoints only (no admin/auth)
- **Tools**: Nuclei, OWASP ZAP, Nessus

## Tool Configurations

### K6 Load Testing

**File**: `k6-production-tests.js`

**Key Features**:
- WAF-compliant user agent and headers
- Rate limiting compliance (25 RPS)
- Endpoint-specific testing (allowlisted paths only)
- Comprehensive error handling and metrics

**Usage**:
```bash
# Install K6
npm install -g k6

# Run production tests
k6 run k6-production-tests.js

# Run with custom options
k6 run --vus 10 --duration 5m k6-production-tests.js
```

**WAF Compliance**:
- User-Agent: `k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)`
- Rate limiting: 25 requests/second (below 30/min threshold)
- Headers include WAF identification tags

### Lighthouse Automation

**File**: `lighthouse-automation.js`

**Key Features**:
- Automated Lighthouse audits with WAF compatibility
- Custom Chrome flags for production testing
- Multiple output formats (HTML, JSON)
- CI/CD integration support

**Usage**:
```bash
# Install dependencies
npm install lighthouse chrome-launcher

# Run Lighthouse audits
node lighthouse-automation.js

# Run in CI mode
node lighthouse-automation.js --ci
```

**WAF Compliance**:
- User-Agent: Chrome-Lighthouse with identification headers
- 30-second delays between audits for rate compliance
- WAF access verification before testing

### Artillery Load Testing

**File**: `artillery-production-test.yml`

**Key Features**:
- Multi-phase load testing with gradual ramp-up
- WAF-compliant request patterns
- Custom processor for WAF-specific metrics
- Comprehensive scenario coverage

**Usage**:
```bash
# Install Artillery
npm install -g artillery

# Run load tests
artillery run artillery-production-test.yml

# Generate HTML report
artillery run --output artillery-results.json artillery-production-test.yml
artillery report artillery-results.json
```

**WAF Compliance**:
- User-Agent: `Artillery/2.0.0 (aclue-performance-testing)`
- Gradual load increase to respect rate limits
- Custom processor tracks WAF blocks

### Nuclei Security Scanning

**Files**: 
- `nuclei-production-config.yaml`
- `nuclei-production-scan.sh`

**Key Features**:
- Production-safe security scanning
- WAF allowlist compliance (Tier 3)
- Automated reporting and cleanup
- Endpoint restrictions (no admin/auth paths)

**Usage**:
```bash
# Make script executable
chmod +x nuclei-production-scan.sh

# Run security scan
./nuclei-production-scan.sh

# Update templates and run
./nuclei-production-scan.sh --update-templates
```

**WAF Compliance**:
- User-Agent: `Nuclei/v2.9.4 (+https://projectdiscovery.io/nuclei)`
- Rate limiting: 10 requests/minute
- Excludes admin and authentication endpoints

### GTmetrix Automation

**File**: `gtmetrix-automation.py`

**Key Features**:
- GTmetrix API automation with WAF support
- Rate limiting compliance
- Comprehensive performance metrics
- WAF access verification

**Usage**:
```bash
# Install dependencies
pip install requests

# Run GTmetrix tests
python gtmetrix-automation.py --api-key YOUR_KEY --email YOUR_EMAIL

# Test specific URLs
python gtmetrix-automation.py --api-key YOUR_KEY --email YOUR_EMAIL \
  --urls https://aclue.app https://aclue.app/newsletter
```

**WAF Compliance**:
- User-Agent: `GTmetrix-API-Client/2.0 (aclue-monitoring)`
- Rate limiting: 2.5 seconds between requests
- WAF access verification before testing

## Common Configuration Elements

### Headers for WAF Identification

All tools include these standard headers for WAF allowlist identification:

```
User-Agent: {tool-specific-agent}
X-Test-Purpose: {monitoring|performance-testing|security-assessment}
X-Monitoring-Tool: {tool-name}
X-Request-Source: aclue-{team-name}
Accept: {appropriate-content-type}
```

### Rate Limiting Compliance

Each tool respects the WAF rate limits for its tier:

- **Tier 1**: 60 requests/minute (1 per second)
- **Tier 2**: 30 requests/minute (1 per 2 seconds)
- **Tier 3**: 10 requests/minute (1 per 6 seconds)

### Endpoint Restrictions

Tools are configured to only access allowlisted endpoints:

**Allowed Endpoints**:
- `/` (homepage)
- `/newsletter`
- `/landingpage`
- `/api/health`
- `/api/v1/products`
- `/robots.txt`
- `/sitemap.xml`
- Static assets (`.png`, `.jpg`, `.ico`, etc.)

**Restricted Endpoints**:
- `/admin*`
- `/auth*`
- `/login*`
- `/register*`
- `/dashboard*`
- `/wp-admin*`

## Setup Requirements

### Prerequisites

1. **Cloudflare Pro Plan**: Required for custom WAF rules
2. **IP Allowlisting**: Monitoring service IPs must be added to Cloudflare lists
3. **Tool Installation**: Each tool must be installed with appropriate versions
4. **API Keys**: Service-specific API keys and credentials
5. **Network Access**: Ensure monitoring infrastructure can reach aclue.app

### Environment Variables

Configure these environment variables for automated testing:

```bash
# Lighthouse CI thresholds
export LIGHTHOUSE_MIN_PERFORMANCE=70
export LIGHTHOUSE_MIN_ACCESSIBILITY=90

# K6 configuration
export K6_CLOUD_TOKEN=your_k6_token

# GTmetrix credentials
export GTMETRIX_API_KEY=your_api_key
export GTMETRIX_EMAIL=your_email

# Nuclei configuration
export NUCLEI_TEMPLATES_DIR=./nuclei-templates
```

## Monitoring and Troubleshooting

### Common Issues

#### WAF Blocking (403 Errors)

**Symptoms**: Tools receiving 403 Forbidden responses
**Diagnosis**: Check Cloudflare Security Events log
**Solutions**:
1. Verify IP address is in correct allowlist
2. Check user-agent string matches WAF rules
3. Ensure requests are within rate limits
4. Add temporary emergency bypass if needed

#### Rate Limiting Issues

**Symptoms**: Tools receiving 429 Too Many Requests
**Solutions**:
1. Increase delays between requests
2. Reduce concurrent connections
3. Use exponential backoff for retries
4. Check rate limit thresholds in Cloudflare

#### Performance Degradation

**Symptoms**: Slower response times during testing
**Solutions**:
1. Reduce test intensity
2. Schedule tests during off-peak hours
3. Use distributed testing approach
4. Monitor Cloudflare edge response times

### Validation Commands

Test WAF allowlist configuration:

```bash
# Test monitoring tool access
curl -H "User-Agent: Pingdom.com_bot_version_1.4" https://aclue.app/

# Test performance tool access
curl -H "User-Agent: k6/0.45.0 (aclue-monitoring)" https://aclue.app/api/health

# Test security tool access (should work)
curl -H "User-Agent: Nuclei/v2.9.4" https://aclue.app/

# Test blocked endpoint (should return 403)
curl -H "User-Agent: Nuclei/v2.9.4" https://aclue.app/admin
```

## Reporting and Analytics

### Output Directories

Each tool creates reports in its respective directory:

```
monitoring/
├── reports/
│   ├── k6/              # K6 test results
│   ├── lighthouse/      # Lighthouse audit reports
│   ├── artillery/       # Artillery load test results
│   ├── nuclei/          # Security scan reports
│   └── gtmetrix/        # GTmetrix performance reports
```

### Report Formats

- **K6**: JSON metrics, HTML reports
- **Lighthouse**: HTML audits, JSON metrics
- **Artillery**: JSON results, HTML dashboards
- **Nuclei**: JSON findings, Markdown summaries
- **GTmetrix**: JSON results, PDF reports (via API)

### CI/CD Integration

All tools support CI/CD integration with:

- Exit codes based on quality gates
- JSON output for automated processing
- Environment variable configuration
- Docker container compatibility

## Security Considerations

### Data Protection

- No sensitive data in test payloads
- API keys stored in environment variables
- Report data sanitisation for public sharing
- Automatic cleanup of old test data

### Access Control

- Monitoring tools limited to read-only operations
- Security scanners restricted to public endpoints
- Rate limiting prevents resource exhaustion
- WAF rules provide defence in depth

### Compliance

- All testing activities logged and auditable
- Regular review of allowlist effectiveness
- Documentation of all configuration changes
- Incident response procedures for security events

## Maintenance Schedule

### Daily
- Monitor tool execution success rates
- Check for WAF blocking events
- Review error logs and alerts

### Weekly
- Update monitoring service IP ranges
- Review rate limiting effectiveness
- Analyse performance trends

### Monthly
- Update tool versions and configurations
- Review and optimise WAF rules
- Generate comprehensive performance reports

### Quarterly
- Security review of allowlist configuration
- Tool effectiveness assessment
- Update documentation and procedures

## Support and Escalation

For issues with monitoring tools and WAF configuration:

1. **Level 1**: Check tool logs and configuration
2. **Level 2**: Review Cloudflare Security Events
3. **Level 3**: Implement emergency bypass procedures
4. **Level 4**: Escalate to Cloudflare support

**Emergency Contacts**:
- Operations Team: ops@aclue.app
- Security Team: security@aclue.app
- Platform Team: platform@aclue.app

---

**Last Updated**: September 2025  
**Version**: 1.0  
**Maintained By**: aclue Platform Team