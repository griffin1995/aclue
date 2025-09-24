# WAF Implementation Checklist for aclue Platform

## Executive Summary

This checklist provides step-by-step instructions for implementing the WAF allowlist configuration on Cloudflare for the aclue platform. Follow these procedures to enable legitimate monitoring tools while maintaining robust security protection.

## Pre-Implementation Requirements

### ✅ Prerequisites Checklist

- [ ] **Cloudflare Account Access**: Verify you have admin access to the aclue.app Cloudflare account
- [ ] **Pro Plan Verification**: Confirm Cloudflare Pro plan is active (required for custom WAF rules)
- [ ] **DNS Management**: Verify aclue.app DNS is managed through Cloudflare
- [ ] **SSL Configuration**: Confirm SSL/TLS encryption mode is set to "Full (strict)"
- [ ] **Backup Current Configuration**: Export current WAF settings for rollback
- [ ] **Team Notification**: Inform development and operations teams of maintenance window
- [ ] **Monitoring Tools Ready**: Ensure monitoring tool credentials and configurations are prepared

### 📋 Required Information Gathering

- [ ] **Monitoring Service IP Ranges**: Collect current IP ranges from all monitoring providers
- [ ] **Tool User-Agent Strings**: Document user-agent strings for all legitimate tools
- [ ] **Testing Schedule**: Plan maintenance window for implementation (recommended: Sunday 02:00-06:00 UTC)
- [ ] **Rollback Timeline**: Define maximum implementation time before automatic rollback (4 hours)
- [ ] **Emergency Contacts**: Prepare contact list for immediate escalation if issues arise

## Phase 1: Cloudflare Dashboard Configuration

### Step 1: Access Cloudflare WAF Settings

1. **Login to Cloudflare Dashboard**
   - Navigate to: https://dash.cloudflare.com
   - Select the aclue.app domain
   - Go to **Security** → **WAF** → **Custom rules**

2. **Backup Current Configuration**
   ```bash
   # Document current rules
   curl -X GET "https://api.cloudflare.com/client/v4/zones/{zone_id}/firewall/rules" \
        -H "Authorization: Bearer {api_token}" \
        -H "Content-Type: application/json" > waf-backup-$(date +%Y%m%d).json
   ```

3. **Verify Current Security Level**
   - Check **Security** → **Settings**
   - Note current security level and bot fight mode status
   - Document any existing custom rules

### Step 2: Create IP Lists for Monitoring Services

1. **Navigate to IP Lists**
   - Go to **Manage Account** → **Configurations** → **Lists**
   - Click **Create new list**

2. **Create Monitoring Services IP List**
   ```
   List Name: monitoring_services_ips
   Description: IP ranges for legitimate monitoring services
   Type: IP addresses
   ```

3. **Add Monitoring Service IP Ranges**
   ```
   # Pingdom IPv4 Ranges
   185.70.76.0/22
   185.180.12.0/22
   169.56.174.0/24
   198.244.92.0/24
   63.143.42.0/24

   # UptimeRobot IPv4 Ranges
   69.162.124.0/24
   63.143.42.0/24
   50.16.153.0/24
   52.201.3.0/24

   # StatusCake IPv4 Ranges
   77.75.105.0/24
   188.172.252.0/24
   91.208.99.0/24

   # GTmetrix IPv4 Ranges
   172.255.48.0/24
   199.87.228.0/24
   ```

4. **Create Performance Testing IP List**
   ```
   List Name: performance_testing_ips
   Description: IP ranges for performance testing tools
   Type: IP addresses
   ```

5. **Add Performance Testing IP Ranges**
   ```
   # K6 Cloud IP Ranges
   34.107.0.0/16
   35.235.0.0/16

   # Artillery.io IP Ranges
   52.70.0.0/16
   54.175.0.0/16

   # WebPageTest IP Ranges
   72.66.115.0/24
   208.86.224.0/24
   ```

6. **Create Security Scanning IP List**
   ```
   List Name: security_scanning_ips
   Description: IP ranges for security scanning tools
   Type: IP addresses
   ```

### Step 3: Configure Custom WAF Rules

#### Rule 1: Monitoring Tools Allowlist (Priority 1)

1. **Create New Custom Rule**
   - Click **Create custom rule**
   - Rule name: `monitoring_tools_allowlist`
   - Priority: 1

2. **Configure Rule Expression**
   ```
   (http.user_agent contains "Pingdom" or 
    http.user_agent contains "UptimeRobot" or 
    http.user_agent contains "StatusCake" or 
    http.user_agent contains "Site24x7" or 
    http.user_agent contains "Datadog" or 
    http.user_agent contains "NewRelic" or
    http.user_agent contains "monitoring") and
   (ip.src in $monitoring_services_ips)
   ```

3. **Set Action**
   - Action: **Allow**
   - Enable logging: ✅

#### Rule 2: Performance Testing Tools (Priority 2)

1. **Create New Custom Rule**
   - Rule name: `performance_testing_allowlist`
   - Priority: 2

2. **Configure Rule Expression**
   ```
   (http.user_agent contains "k6" or 
    http.user_agent contains "Artillery" or 
    http.user_agent contains "Lighthouse" or 
    http.user_agent contains "Chrome-Lighthouse" or
    http.user_agent contains "GTmetrix" or 
    http.user_agent contains "WebPageTest") and
   (ip.src in $performance_testing_ips) and
   (http.request.uri.path matches "^/(api/health|api/v1/products|newsletter|landingpage|robots.txt|sitemap.xml).*")
   ```

3. **Set Action**
   - Action: **Allow**
   - Enable logging: ✅

#### Rule 3: Security Scanning Tools (Priority 3)

1. **Create New Custom Rule**
   - Rule name: `security_scanning_allowlist`
   - Priority: 3

2. **Configure Rule Expression**
   ```
   (http.user_agent contains "Nuclei" or 
    http.user_agent contains "OWASP" or 
    http.user_agent contains "ZAP" or 
    http.user_agent contains "Nessus") and
   (ip.src in $security_scanning_ips) and
   (not http.request.uri.path matches ".*(admin|auth|login|register|dashboard|wp-admin).*") and
   (http.request.method eq "GET")
   ```

3. **Set Action**
   - Action: **Allow**
   - Enable logging: ✅

### Step 4: Configure Rate Limiting Rules

1. **Navigate to Rate Limiting**
   - Go to **Security** → **WAF** → **Rate limiting rules**

2. **Create Monitoring Services Rate Limit**
   ```
   Rule Name: monitoring_services_rate_limit
   Expression: (ip.src in $monitoring_services_ips)
   Rate: 60 requests per 1 minute
   Action: Block
   Duration: 1 minute
   ```

3. **Create Performance Testing Rate Limit**
   ```
   Rule Name: performance_testing_rate_limit
   Expression: (ip.src in $performance_testing_ips)
   Rate: 30 requests per 1 minute
   Action: Challenge
   Duration: 5 minutes
   ```

4. **Create Security Scanning Rate Limit**
   ```
   Rule Name: security_scanning_rate_limit
   Expression: (ip.src in $security_scanning_ips)
   Rate: 10 requests per 1 minute
   Action: Block
   Duration: 5 minutes
   ```

## Phase 2: DNS and Traffic Routing Configuration

### Step 1: Verify DNS Configuration

1. **Check DNS Records**
   ```bash
   # Verify A record for aclue.app
   dig A aclue.app
   
   # Verify CNAME for www
   dig CNAME www.aclue.app
   
   # Check CAA records
   dig CAA aclue.app
   ```

2. **Verify Proxy Status**
   - Ensure DNS records are proxied through Cloudflare (orange cloud icon)
   - Confirm SSL/TLS encryption mode is "Full (strict)"

### Step 2: Configure SSL/TLS Settings

1. **SSL/TLS Configuration**
   - Go to **SSL/TLS** → **Overview**
   - Encryption mode: **Full (strict)**
   - Always Use HTTPS: **On**

2. **Edge Certificates**
   - Go to **SSL/TLS** → **Edge Certificates**
   - Always Use HTTPS: **On**
   - HTTP Strict Transport Security (HSTS): **Enable**
   - Minimum TLS Version: **1.2**

## Phase 3: Testing and Validation Procedures

### Step 1: Pre-Production Testing

1. **Test WAF Rule Syntax**
   ```bash
   # Use Cloudflare API to validate rules
   curl -X POST "https://api.cloudflare.com/client/v4/zones/{zone_id}/firewall/rules/preview" \
        -H "Authorization: Bearer {api_token}" \
        -H "Content-Type: application/json" \
        -d '{"targets":[{"target":"ip","constraint":{"operator":"ip_in_list","value":"monitoring_services_ips"}}]}'
   ```

2. **Validate IP Lists**
   ```bash
   # Test IP list creation
   curl -X GET "https://api.cloudflare.com/client/v4/accounts/{account_id}/rules/lists" \
        -H "Authorization: Bearer {api_token}"
   ```

### Step 2: Production Validation Testing

#### Test 1: Monitoring Tools Access

1. **Pingdom Simulation**
   ```bash
   curl -H "User-Agent: Pingdom.com_bot_version_1.4" \
        -v https://aclue.app/api/health
   ```
   Expected: 200 OK response

2. **UptimeRobot Simulation**
   ```bash
   curl -H "User-Agent: UptimeRobot/2.0; http://www.uptimerobot.com/" \
        -v https://aclue.app
   ```
   Expected: 200 OK response

#### Test 2: Performance Testing Tools

1. **K6 Access Test**
   ```bash
   curl -H "User-Agent: k6/0.45.0 (aclue-monitoring; +https://aclue.app/monitoring)" \
        -v https://aclue.app/api/v1/products
   ```
   Expected: 200 OK response

2. **Lighthouse Access Test**
   ```bash
   curl -H "User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome-Lighthouse" \
        -v https://aclue.app
   ```
   Expected: 200 OK response

#### Test 3: Security Scanning Tools

1. **Nuclei Access Test**
   ```bash
   curl -H "User-Agent: Nuclei/v2.9.4 (+https://projectdiscovery.io/nuclei)" \
        -v https://aclue.app
   ```
   Expected: 200 OK response

2. **Blocked Endpoint Test**
   ```bash
   curl -H "User-Agent: Nuclei/v2.9.4" \
        -v https://aclue.app/admin
   ```
   Expected: 403 Forbidden response

#### Test 4: Rate Limiting Validation

1. **Rapid Request Test**
   ```bash
   # Test rate limiting (should trigger after threshold)
   for i in {1..70}; do
     curl -H "User-Agent: test-monitoring-tool" https://aclue.app &
   done
   wait
   ```

### Step 3: Monitoring and Alerting Verification

1. **Check Cloudflare Analytics**
   - Go to **Analytics & Logs** → **Security**
   - Verify rule hit rates and blocked requests
   - Confirm legitimate tools are not being blocked

2. **Configure Monitoring Alerts**
   ```bash
   # Set up alert for excessive WAF blocks of monitoring tools
   # (Configure in your monitoring system)
   ```

## Phase 4: Documentation and Training

### Step 1: Update Documentation

1. **Create Configuration Record**
   - Document all created rules and their purposes
   - Record IP list contents and sources
   - Note rate limiting thresholds and rationales

2. **Update Runbooks**
   - Include WAF allowlist in incident response procedures
   - Document troubleshooting steps for monitoring failures
   - Add emergency bypass procedures

### Step 2: Team Training

1. **Operations Team Training**
   - How to access and modify WAF rules
   - Emergency response procedures
   - Monitoring dashboard navigation

2. **Development Team Guidelines**
   - How to request new tool allowlisting
   - Testing procedures for CI/CD integration
   - Local development bypass methods

## Emergency Procedures

### Emergency Bypass Activation

1. **Critical Testing Bypass**
   ```
   Rule Name: emergency_bypass
   Expression: (ip.src eq "YOUR_EMERGENCY_IP")
   Action: Allow
   TTL: 4 hours maximum
   ```

2. **Bulk Testing Window**
   - Temporarily disable rate limiting rules
   - Enable comprehensive logging
   - Set automatic re-enablement after 4 hours

### Rollback Procedures

#### Immediate Rollback (Critical Issues)

1. **Disable All Custom Rules**
   - Go to **Security** → **WAF** → **Custom rules**
   - Toggle off all monitoring allowlist rules
   - Revert to default security settings

2. **Emergency Communication**
   ```bash
   # Notify team immediately
   echo "WAF allowlist rollback initiated due to critical issues" | \
   mail -s "URGENT: WAF Configuration Rollback" team@aclue.app
   ```

#### Gradual Rollback (Fine-tuning)

1. **Disable Individual Rules**
   - Start with lowest priority rules
   - Monitor impact for 15-minute intervals
   - Document performance and security metrics

2. **Re-enable with Adjustments**
   - Modify rule parameters based on observed data
   - Test individual rule effectiveness
   - Update documentation with changes

## Post-Implementation Monitoring

### Week 1: Intensive Monitoring

- [ ] **Daily Analytics Review**: Check Cloudflare security analytics
- [ ] **Monitoring Tool Status**: Verify all tools are functioning
- [ ] **False Positive Detection**: Look for blocked legitimate requests
- [ ] **Performance Impact**: Monitor edge response times
- [ ] **Security Effectiveness**: Verify malicious traffic blocking

### Week 2-4: Standard Monitoring

- [ ] **Bi-daily Analytics Review**: Reduced frequency monitoring
- [ ] **Weekly Rule Effectiveness Report**: Generate summary metrics
- [ ] **Tool Configuration Updates**: Adjust based on learned patterns
- [ ] **IP List Maintenance**: Update provider IP ranges if needed

### Monthly Review Process

- [ ] **Comprehensive Security Review**: Full allowlist audit
- [ ] **Performance Impact Assessment**: Detailed metrics analysis
- [ ] **Tool Coverage Analysis**: Verify all required tools included
- [ ] **Threat Intelligence Update**: Update blocking rules based on new threats
- [ ] **Documentation Update**: Keep all procedures current

## Success Metrics

### Operational Metrics

- **Monitoring Tool Availability**: >99.5% successful requests
- **False Positive Rate**: <1% legitimate requests blocked
- **Security Effectiveness**: >95% malicious requests blocked
- **Performance Impact**: <2ms additional latency

### Security Metrics

- **Blocked Attack Attempts**: Track and trend malicious activity
- **Allowlist Abuse Detection**: Monitor for suspicious patterns
- **Incident Response Time**: <15 minutes for critical issues
- **Compliance Maintenance**: 100% rule documentation accuracy

## Troubleshooting Guide

### Common Issues and Solutions

#### Issue 1: Monitoring Tool Blocked (403 Error)

**Symptoms**: Legitimate monitoring tool receiving 403 Forbidden
**Diagnosis**: Check if IP is in allowlist, verify user-agent pattern
**Solution**: 
1. Verify IP address in correct list
2. Check user-agent string matches rule
3. Temporarily add IP to emergency bypass

#### Issue 2: High False Positive Rate

**Symptoms**: Legitimate traffic being blocked by WAF rules
**Diagnosis**: Review Cloudflare security events log
**Solution**:
1. Identify common patterns in blocked requests
2. Adjust rule expressions to be more specific
3. Add exception rules for identified patterns

#### Issue 3: Performance Degradation

**Symptoms**: Increased response times after rule implementation
**Diagnosis**: Check rule complexity and processing overhead
**Solution**:
1. Optimise rule expressions for efficiency
2. Reduce regex complexity where possible
3. Consider rule ordering and prioritisation

### Escalation Procedures

1. **Level 1**: Operations team troubleshooting (0-30 minutes)
2. **Level 2**: Security team consultation (30-60 minutes)
3. **Level 3**: Emergency rollback activation (60+ minutes)
4. **Level 4**: Vendor escalation to Cloudflare support

## Compliance and Audit Requirements

### Documentation Requirements

- [ ] **Rule Configuration Export**: Monthly backup of all WAF rules
- [ ] **Change Log Maintenance**: Document all rule modifications
- [ ] **Access Control Audit**: Quarterly review of who can modify rules
- [ ] **Security Assessment**: Annual third-party security review

### Reporting Requirements

- [ ] **Monthly Security Report**: WAF effectiveness and metrics
- [ ] **Quarterly Business Review**: Impact on monitoring capabilities
- [ ] **Annual Compliance Audit**: Full security posture assessment
- [ ] **Incident Reports**: Document all security or availability incidents

## Implementation Sign-off

### Pre-Go-Live Checklist

- [ ] All WAF rules configured and tested
- [ ] IP lists populated and validated
- [ ] Rate limiting rules configured
- [ ] Emergency procedures documented
- [ ] Team training completed
- [ ] Monitoring and alerting configured
- [ ] Rollback procedures tested

### Approval Signatures

- [ ] **Security Team Lead**: _________________________ Date: _______
- [ ] **Operations Manager**: _________________________ Date: _______
- [ ] **Development Lead**: ___________________________ Date: _______
- [ ] **IT Director**: ________________________________ Date: _______

---

**Document Version**: 1.0  
**Last Updated**: September 2025  
**Next Review Date**: December 2025  
**Maintained By**: aclue Security Team