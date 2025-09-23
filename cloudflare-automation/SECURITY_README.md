# aclue Enterprise Security Configuration

## Overview

This repository contains comprehensive enterprise-grade security configuration scripts for the aclue platform domains (`aclue.co.uk` and `aclue.app`). The implementation follows OWASP security standards and UK/GDPR compliance requirements.

## 🔐 Security Features Implemented

### SSL/TLS Security
- **Full Strict SSL Mode**: End-to-end encryption with certificate validation
- **HSTS with Preload**: 1-year max-age with subdomain inclusion and preload list
- **TLS Version Control**: Minimum TLS 1.2, TLS 1.3 enabled
- **Automatic HTTPS Rewrites**: All HTTP traffic redirected to HTTPS

### Security Headers
- **Strict Transport Security (HSTS)**: Prevents downgrade attacks
- **Content Security Policy (CSP)**: Prevents XSS and data injection
- **X-Frame-Options**: Clickjacking protection  
- **X-Content-Type-Options**: MIME sniffing protection
- **Referrer Policy**: Controls referrer information leakage

### Web Application Firewall (WAF)
- **Custom Security Rules**: Block malicious user agents and injection attempts
- **Rate Limiting**: API endpoints (100/min), Login attempts (5/min)
- **Geo-blocking**: Challenge non-UK/EU traffic to admin endpoints
- **Bot Protection**: Advanced bot detection and mitigation

### DDoS & Attack Mitigation
- **Cloudflare DDoS Protection**: Automatic traffic analysis and blocking
- **Challenge Mechanisms**: Browser integrity checks and CAPTCHAs
- **Traffic Analysis**: Real-time monitoring of suspicious patterns
- **Attack Response**: Automated incident detection and response

### Security Monitoring
- **Real-time Alerting**: Email, Slack, and webhook notifications
- **Security Analytics**: Traffic patterns and threat intelligence
- **Compliance Reporting**: Automated security audit reports
- **Incident Response**: Automated detection and escalation procedures

## 📁 Script Architecture

```
/home/jack/cloudflare-automation/
├── deploy-security.sh          # Master deployment orchestrator
├── security-headers.sh         # Basic security headers and SSL configuration
├── security-firewall-rules.sh  # Advanced firewall and bot protection
├── security-monitor.sh         # Security monitoring and compliance reporting
├── security-audit.sh           # Comprehensive security audit and validation
├── security-alerts.sh          # Incident response and alerting system
└── SECURITY_README.md          # This documentation file
```

## 🚀 Quick Start

### Prerequisites

1. **Required Tools**: Ensure these are installed:
   ```bash
   sudo apt-get update
   sudo apt-get install curl jq openssl bc mailutils
   ```

2. **Cloudflare Credentials**: Create `~/.cloudflare-credentials`:
   ```bash
   # Cloudflare API Credentials
   export CLOUDFLARE_API_TOKEN="your_api_token_here"
   ```

3. **Permissions**: Ensure scripts are executable:
   ```bash
   chmod +x /home/jack/cloudflare-automation/*.sh
   ```

### Complete Security Deployment

Execute the master deployment script for comprehensive security hardening:

```bash
cd /home/jack/cloudflare-automation
./deploy-security.sh
```

This will:
1. ✅ Perform pre-deployment validation
2. 🔒 Configure SSL/TLS and security headers
3. 🛡️ Deploy firewall rules and bot protection
4. 📊 Set up security monitoring
5. 🔍 Run security audit validation
6. 📋 Generate comprehensive deployment report

## 📋 Individual Script Usage

### 1. Basic Security Configuration
Apply fundamental security headers and SSL settings:
```bash
./security-headers.sh
```

**Features:**
- SSL Full Strict mode
- HSTS with 1-year max-age and preload
- TLS 1.2+ enforcement
- Automatic HTTPS rewrites
- Basic security headers

### 2. Advanced Firewall Protection
Deploy comprehensive firewall rules and bot protection:
```bash
./security-firewall-rules.sh
```

**Features:**
- Rate limiting for API and authentication endpoints
- WAF rules for common attack patterns
- Malicious user agent blocking
- Geo-blocking for sensitive endpoints
- Advanced bot protection

### 3. Security Monitoring
Generate security compliance reports and monitoring data:
```bash
./security-monitor.sh
```

**Features:**
- SSL certificate expiry monitoring
- Security settings validation
- Traffic analytics and threat detection
- HTML compliance report generation
- Security metrics collection

### 4. Security Audit
Perform comprehensive security validation and testing:
```bash
./security-audit.sh
```

**Features:**
- SSL/TLS configuration testing
- HTTP security headers validation
- Vulnerability scanning (OWASP Top 10)
- Cloudflare settings verification
- JSON audit report generation

### 5. Security Alerting
Real-time security incident detection and response:
```bash
./security-alerts.sh
```

**Features:**
- Real-time firewall event monitoring
- Traffic anomaly detection
- SSL certificate expiry alerts
- Security configuration change detection
- Multi-channel alerting (email/Slack/webhook)

## 🔧 Configuration Options

### Alert Thresholds
Edit `/home/jack/cloudflare-automation/security-alerts.sh`:
```bash
CRITICAL_BLOCKED_REQUESTS_THRESHOLD=100
HIGH_TRAFFIC_THRESHOLD=5000
FAILED_LOGIN_THRESHOLD=20
DDoS_THRESHOLD=10000
SSL_EXPIRY_WARNING_DAYS=30
```

### Notification Channels
Configure in `security-alerts.sh`:
```bash
EMAIL_ALERTS="security@aclue.co.uk"
SLACK_WEBHOOK="https://hooks.slack.com/services/..."
WEBHOOK_URL="https://your-webhook-endpoint.com/alerts"
```

### Content Security Policy
Modify CSP in `security-headers.sh`:
```bash
CSP_POLICY="default-src 'self'; script-src 'self' 'unsafe-inline' ..."
```

## 📊 Monitoring & Maintenance

### Recommended Schedule

| Script | Frequency | Purpose |
|--------|-----------|---------|
| `security-alerts.sh` | Every 5 minutes | Real-time incident detection |
| `security-monitor.sh` | Daily | Comprehensive security review |
| `security-audit.sh` | Weekly | Full security audit |
| `deploy-security.sh` | As needed | Configuration updates |

### Cron Job Setup
```bash
# Real-time security monitoring (every 5 minutes)
*/5 * * * * /home/jack/cloudflare-automation/security-alerts.sh

# Daily security monitoring report (6 AM)
0 6 * * * /home/jack/cloudflare-automation/security-monitor.sh

# Weekly comprehensive audit (Sundays at 2 AM)
0 2 * * 0 /home/jack/cloudflare-automation/security-audit.sh
```

### Log Files Location
- **Deployment**: `/tmp/aclue-security-deployment-*.log`
- **Monitoring**: `/tmp/cloudflare-security-monitor-*.log`
- **Alerts**: `/tmp/cloudflare-security-alerts-*.log`
- **Incidents**: `/var/log/aclue-security-incidents.log`

## 🎯 Security Compliance

### OWASP Top 10 Protection
✅ **A01: Broken Access Control** - WAF rules and rate limiting  
✅ **A02: Cryptographic Failures** - TLS 1.2+ enforcement  
✅ **A03: Injection** - Input validation and WAF protection  
✅ **A04: Insecure Design** - Security-by-design implementation  
✅ **A05: Security Misconfiguration** - Automated configuration management  
✅ **A06: Vulnerable Components** - Regular security auditing  
✅ **A07: Authentication Failures** - Rate limiting and monitoring  
✅ **A08: Software Integrity Failures** - CSP and security headers  
✅ **A09: Logging Failures** - Comprehensive security logging  
✅ **A10: Server-Side Request Forgery** - WAF rules and filtering  

### UK/GDPR Compliance
- **Data Protection**: Encrypted data transmission (TLS 1.2+)
- **Privacy Controls**: Privacy Pass support, minimal data exposure
- **Incident Response**: Automated detection and reporting
- **Access Controls**: Geo-blocking and authentication protection
- **Audit Trails**: Comprehensive security logging and reporting

## 🚨 Incident Response

### Automatic Response Actions
1. **High Traffic**: Rate limiting activation
2. **Attack Patterns**: WAF rule triggering
3. **SSL Issues**: Immediate alerting
4. **Configuration Changes**: Change detection and notification

### Manual Response Procedures
1. **Critical Incidents**: Check `/var/log/aclue-security-incidents.log`
2. **Review Firewall Events**: Cloudflare dashboard → Security → Events
3. **Adjust Rate Limits**: Modify thresholds in `security-firewall-rules.sh`
4. **Update WAF Rules**: Add new patterns to firewall configuration

## 🔍 Troubleshooting

### Common Issues

**API Token Issues:**
```bash
# Test API connectivity
curl -X GET "https://api.cloudflare.com/client/v4/user" \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN"
```

**Missing Dependencies:**
```bash
# Install required tools
sudo apt-get install curl jq openssl bc mailutils
```

**Permission Errors:**
```bash
# Fix script permissions
chmod +x /home/jack/cloudflare-automation/*.sh
```

**Log Analysis:**
```bash
# View recent security incidents
tail -f /var/log/aclue-security-incidents.log

# Check deployment logs
ls -la /tmp/aclue-security-deployment-*.log
```

## 📈 Performance Impact

The security configurations are designed for minimal performance impact:
- **CDN Optimization**: Leverages Cloudflare's global network
- **Edge Processing**: Security rules processed at edge locations
- **Caching Efficiency**: Security headers cached appropriately
- **Minimal Latency**: Geographic optimization for UK/EU users

## 🔄 Updates & Maintenance

### Regular Maintenance Tasks
1. **Weekly**: Review firewall events and adjust rules
2. **Monthly**: Update security thresholds based on traffic patterns
3. **Quarterly**: Full security audit and penetration testing
4. **Annually**: Review and update security policies

### Version Control
All security configurations are version controlled. To update:
```bash
cd /home/jack/cloudflare-automation
git pull origin main
./deploy-security.sh
```

## 📞 Support & Escalation

### Security Incident Escalation
1. **Level 1**: Automated alerts and monitoring
2. **Level 2**: Manual investigation required
3. **Level 3**: Critical security incident - immediate response required

### Contact Information
- **Security Team**: security@aclue.co.uk
- **Technical Lead**: technical@aclue.co.uk
- **Emergency Contact**: emergency@aclue.co.uk

---

## 📝 Security Audit Trail

**Last Updated**: 2025-08-05  
**Version**: 1.0  
**Security Level**: Enterprise Grade  
**Compliance**: OWASP, UK/GDPR  
**Audit Status**: ✅ Fully Compliant  

---

*This security implementation provides enterprise-grade protection for the aclue platform while maintaining optimal performance and user experience. Regular monitoring and maintenance ensure continued security effectiveness.*