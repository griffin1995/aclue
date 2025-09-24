# WAF Allowlist Configuration Strategy for aclue Platform

## Executive Summary

This document outlines a comprehensive WAF allowlist configuration strategy for the aclue platform that enables legitimate monitoring and testing tools while maintaining robust security protection. The configuration addresses the current Cloudflare WAF blocking issues that prevent automated monitoring tools from accessing the platform.

## Current Infrastructure Analysis

### Platform Overview
- **Frontend**: aclue.app (Vercel with Cloudflare CDN)
- **Backend**: aclue-backend-production.up.railway.app (Railway with native protection)
- **WAF Provider**: Cloudflare (currently blocking legitimate tools with 403 responses)
- **DNS Management**: Cloudflare
- **SSL/TLS**: Cloudflare Universal SSL

### Current WAF Configuration Issues
1. **Overly Aggressive Bot Protection**: Blocking legitimate monitoring tools
2. **User-Agent Filtering**: Preventing automated testing frameworks
3. **Rate Limiting**: Stopping performance testing tools
4. **IP Reputation**: Blocking known testing service IP ranges

## WAF Allowlist Strategy

### 1. Graduated Access Control Model

#### Tier 1: Critical Monitoring (Full Access)
- **Purpose**: Essential uptime and performance monitoring
- **Tools**: Pingdom, UptimeRobot, StatusCake
- **Access Level**: Full platform access with minimal restrictions
- **Rate Limits**: Relaxed (up to 60 requests/minute)

#### Tier 2: Performance Testing (Controlled Access)
- **Purpose**: Load testing and performance analysis
- **Tools**: K6, Artillery, Lighthouse, GTmetrix
- **Access Level**: Specific endpoints only
- **Rate Limits**: Controlled (up to 30 requests/minute)
- **Time Windows**: Scheduled testing periods

#### Tier 3: Security Scanning (Limited Access)
- **Purpose**: Vulnerability assessment and security testing
- **Tools**: Nuclei, OWASP ZAP, Nmap
- **Access Level**: Public endpoints only
- **Rate Limits**: Strict (up to 10 requests/minute)
- **Restrictions**: No admin/auth endpoints

### 2. Implementation Architecture

```
Internet → Cloudflare → WAF Rules Engine → Backend Services
                ↓
        Allowlist Decision Matrix:
        1. IP Address Check
        2. User-Agent Validation
        3. Request Pattern Analysis
        4. Rate Limiting Application
        5. Endpoint Access Control
```

## Cloudflare Configuration Steps

### 1. WAF Custom Rules Configuration

#### Rule 1: Monitoring Tools Allowlist
```
(http.user_agent contains "Pingdom" or 
 http.user_agent contains "UptimeRobot" or 
 http.user_agent contains "StatusCake" or 
 http.user_agent contains "Site24x7" or 
 http.user_agent contains "Datadog" or 
 http.user_agent contains "NewRelic") and
(ip.src in $monitoring_ips)
```
**Action**: Allow
**Priority**: 1

#### Rule 2: Performance Testing Tools
```
(http.user_agent contains "k6" or 
 http.user_agent contains "Artillery" or 
 http.user_agent contains "Lighthouse" or 
 http.user_agent contains "GTmetrix" or 
 http.user_agent contains "WebPageTest") and
(ip.src in $performance_testing_ips) and
(http.request.uri.path matches "^/(api/health|api/v1/products|newsletter).*")
```
**Action**: Allow
**Priority**: 2

#### Rule 3: Security Scanning Tools
```
(http.user_agent contains "Nuclei" or 
 http.user_agent contains "OWASP ZAP" or 
 http.user_agent contains "Nessus" or 
 http.user_agent contains "sqlmap") and
(ip.src in $security_scanning_ips) and
(not http.request.uri.path matches ".*(admin|auth|login|register).*")
```
**Action**: Allow
**Priority**: 3

### 2. IP Lists Configuration

#### Monitoring Services IP Ranges
```
# Pingdom IPv4 Ranges
185.70.76.0/22
185.180.12.0/22
169.56.174.0/24
198.244.92.0/24

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

# Lighthouse CI Common IPs
35.186.224.0/24
35.196.0.0/24
```

#### Performance Testing Services
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

### 3. Rate Limiting Configuration

#### Tier 1: Critical Monitoring
```json
{
  "threshold": 60,
  "period": 60,
  "action": "block",
  "match": "ip.src",
  "response": {
    "content_type": "application/json",
    "body": "{\"error\":\"Rate limit exceeded\"}"
  }
}
```

#### Tier 2: Performance Testing
```json
{
  "threshold": 30,
  "period": 60,
  "action": "challenge",
  "match": "ip.src",
  "characteristics": ["ip.src", "http.user_agent"]
}
```

#### Tier 3: Security Scanning
```json
{
  "threshold": 10,
  "period": 60,
  "action": "block",
  "match": "ip.src",
  "mitigation_timeout": 300
}
```

### 4. Custom Rules for Specific Tools

#### Lighthouse Automation Rule
```
(http.user_agent contains "Chrome-Lighthouse" or 
 http.user_agent contains "lighthouse") and
(http.request.method eq "GET") and
(not http.request.uri.path contains "admin")
```
**Action**: Allow
**Notes**: Lighthouse requires full page access for accurate audits

#### K6 Load Testing Rule
```
(http.user_agent contains "k6") and
(ip.src in $k6_testing_ips) and
(http.request.uri.path matches "^/(api/v1/products|api/health|newsletter).*") and
(http.request.method in {"GET" "POST"})
```
**Action**: Allow
**Notes**: Limited to specific endpoints during testing windows

#### Nuclei Security Scanning Rule
```
(http.user_agent contains "Nuclei") and
(ip.src in $security_scanning_ips) and
(not http.request.uri.path matches ".*(admin|auth|login|register|dashboard).*") and
(http.request.method eq "GET")
```
**Action**: Allow
**Notes**: Read-only access to public endpoints only

## Advanced Configuration Options

### 1. Time-Based Access Control

```javascript
// Allow intensive testing only during maintenance windows
const isMaintenanceWindow = () => {
  const now = new Date();
  const hour = now.getUTCHours();
  const day = now.getUTCDay();
  
  // Sunday 02:00-06:00 UTC
  return day === 0 && hour >= 2 && hour < 6;
};
```

### 2. Geographic Restrictions

```
# Allow monitoring from specific regions only
(ip.geoip.country in {"US" "GB" "DE" "CA"}) and
(http.user_agent contains "monitoring")
```

### 3. Request Size Limitations

```
# Limit request size for security tools
(http.user_agent contains "security") and
(http.request.body.size < 1024)
```

## Bot Management Integration

### 1. Bot Score Adjustment
```json
{
  "rules": [
    {
      "expression": "cf.bot_management.score < 30 and http.user_agent contains \"monitoring\"",
      "action": "allow",
      "description": "Allow legitimate monitoring tools with low bot scores"
    }
  ]
}
```

### 2. Verified Bot Bypass
```json
{
  "verified_bots": {
    "action": "allow",
    "categories": ["monitoring", "search_engine"],
    "user_agents": [
      "Pingdom.com_bot",
      "UptimeRobot/2.0",
      "StatusCake",
      "Lighthouse"
    ]
  }
}
```

## Emergency Bypass Procedures

### 1. Critical Testing Bypass
**Purpose**: Emergency access for critical security testing or incident response

**Activation Process**:
1. Access Cloudflare Dashboard
2. Navigate to Security → WAF → Custom Rules
3. Create temporary bypass rule:
```
(ip.src eq "YOUR_EMERGENCY_IP") and
(http.user_agent contains "emergency-bypass")
```
4. Set expiration time (maximum 4 hours)
5. Document usage in security log

### 2. Bulk Testing Window
**Purpose**: Scheduled maintenance testing requiring relaxed rules

**Configuration**:
```javascript
// Temporary rule for bulk testing
const bulkTestingRule = {
  expression: `(ip.src in $bulk_testing_ips) and 
               (http.host eq "aclue.app") and 
               (cf.edge.server_port in {80 443})`,
  action: "allow",
  enabled: false // Enable only during testing windows
};
```

## Monitoring and Alerting

### 1. WAF Rule Performance Metrics
- Rule hit rates and effectiveness
- False positive detection
- Legitimate traffic impact assessment
- Performance impact on edge response times

### 2. Alert Configuration
```json
{
  "alerts": [
    {
      "name": "WAF Allowlist Abuse Detection",
      "condition": "rate(cloudflare_waf_allows[5m]) > 1000",
      "action": "notify_security_team"
    },
    {
      "name": "Monitoring Tool Blocking",
      "condition": "cloudflare_waf_blocks{user_agent=~\".*monitoring.*\"} > 10",
      "action": "notify_ops_team"
    }
  ]
}
```

### 3. Regular Review Schedule
- **Weekly**: Review blocked legitimate requests
- **Bi-weekly**: Analyse rule effectiveness and adjust thresholds
- **Monthly**: Update IP allowlists for monitoring services
- **Quarterly**: Comprehensive security review of allowlist rules

## Security Considerations

### 1. Principle of Least Privilege
- Grant minimum necessary access for each tool category
- Regular review and revocation of unused allowlist entries
- Time-limited access for intensive testing tools

### 2. Audit Logging
```json
{
  "log_configuration": {
    "enable_edge_logs": true,
    "log_fields": [
      "ClientIP",
      "ClientUserAgent", 
      "ClientRequestURI",
      "EdgeResponseStatus",
      "WAFAction",
      "WAFRuleID"
    ],
    "sample_rate": 1.0
  }
}
```

### 3. Threat Intelligence Integration
- Automatic IP reputation checking
- Dynamic blocklist updates
- Behavioural analysis for anomaly detection

## Performance Impact Assessment

### 1. Edge Processing Overhead
- **Additional Rules**: 5-8 custom WAF rules
- **Expected Latency Impact**: <2ms
- **Memory Usage**: Minimal (IP lists cached at edge)

### 2. Traffic Analysis Impact
- **Additional Processing**: User-Agent pattern matching
- **Regex Complexity**: Optimised patterns to minimise CPU impact
- **Cache Hit Rate**: Maintained at >95% for static assets

## Rollback Procedures

### 1. Emergency Rollback
**Trigger Conditions**:
- Significant increase in legitimate traffic blocking
- Performance degradation >10ms
- Security incident requiring immediate lockdown

**Rollback Steps**:
1. Disable all custom allowlist rules
2. Revert to default Cloudflare security settings
3. Implement emergency contact list notification
4. Document incident and impact assessment

### 2. Gradual Rollback
**Use Case**: Fine-tuning rules based on monitoring data

**Process**:
1. Disable individual rules in reverse priority order
2. Monitor impact for 15-minute intervals
3. Re-enable with adjusted parameters
4. Update documentation with changes

## Testing and Validation

### 1. Pre-Production Testing
```bash
# Test allowlist rules before production deployment
curl -H "User-Agent: Pingdom.com_bot_version_1.4" https://aclue.app/api/health
curl -H "User-Agent: k6/0.45.0" https://aclue.app/api/v1/products
curl -H "User-Agent: Nuclei/v2.9.4" https://aclue.app/
```

### 2. Production Validation
- Monitor Cloudflare Analytics for rule hit rates
- Verify monitoring tools can access required endpoints
- Confirm security tools are properly restricted
- Test emergency bypass procedures

### 3. Continuous Validation
```bash
#!/bin/bash
# Daily validation script
./validate-monitoring-access.sh
./check-security-rule-effectiveness.sh
./verify-performance-impact.sh
```

## Documentation and Training

### 1. Operations Team Training
- Cloudflare dashboard navigation
- Rule modification procedures
- Emergency response protocols
- Monitoring and alerting systems

### 2. Security Team Guidelines
- Allowlist review procedures
- Threat assessment protocols
- Incident response integration
- Compliance documentation requirements

### 3. Development Team Integration
- Testing tool configuration requirements
- CI/CD pipeline integration points
- Local development bypass procedures
- Production testing coordination

## Cost Implications

### 1. Cloudflare Plan Requirements
- **Current Plan**: Pro Plan required for custom WAF rules
- **Estimated Cost**: $20/month per domain
- **Additional Features**: Rate limiting, bot management

### 2. Monitoring Tool Costs
- Some tools may charge premium for allowlisted access
- Consider volume discounts for enterprise monitoring packages
- Budget for additional IP addresses if required

## Implementation Timeline

### Phase 1: Foundation (Week 1)
- Configure basic IP allowlists
- Implement Tier 1 monitoring rules
- Set up basic rate limiting

### Phase 2: Testing Tools (Week 2)
- Add performance testing allowlists
- Configure K6 and Lighthouse rules
- Test emergency bypass procedures

### Phase 3: Security Integration (Week 3)
- Implement security scanning rules
- Configure audit logging
- Set up monitoring and alerting

### Phase 4: Optimisation (Week 4)
- Fine-tune rate limits based on data
- Optimise rule performance
- Complete documentation and training

## Conclusion

This WAF allowlist configuration strategy provides a robust framework for enabling legitimate monitoring and testing tools while maintaining strong security protection for the aclue platform. The graduated access control model ensures that different tool categories receive appropriate access levels, while the comprehensive monitoring and alerting system enables proactive management of the allowlist rules.

Regular review and updates of this configuration will ensure continued effectiveness as the platform evolves and new monitoring requirements emerge.