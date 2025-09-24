# Post-WAF Implementation Testing Plan

## Executive Summary

This document outlines the comprehensive testing procedures to validate the WAF allowlist implementation for the aclue platform monitoring tools. The plan ensures all monitoring capabilities function correctly while maintaining security.

---

## 🎯 Testing Objectives

### Primary Goals
1. **Validate WAF Allowlist Functionality** - Confirm monitoring tools can access both frontend and backend
2. **Verify Performance Metrics** - Ensure no degradation in response times post-WAF
3. **Security Validation** - Confirm WAF still blocks unauthorised access
4. **Tool Integration** - Validate all monitoring tools work as expected
5. **Establish Baselines** - Create performance benchmarks for ongoing monitoring

### Success Criteria
- ✅ All monitoring tools receive 200 responses (not 403)
- ✅ Response times remain within acceptable thresholds
- ✅ Security scanning tools can complete assessments
- ✅ Load testing achieves target throughput
- ✅ No false positives in WAF blocking

---

## 📋 Pre-Deployment Checklist

### Environment Validation
- [ ] Verify WAF allowlist rules are staged
- [ ] Confirm monitoring tool IP ranges are documented
- [ ] Validate User-Agent strings match configuration
- [ ] Check rate limiting thresholds are appropriate
- [ ] Review rollback procedures are in place

### Tool Preparation
- [ ] K6 scripts updated with correct headers
- [ ] Nuclei templates configured for production
- [ ] Artillery scenarios ready
- [ ] Lighthouse CI configured
- [ ] Grafana dashboards prepared

### Baseline Metrics (Current)
```yaml
Backend API (Accessible):
  Health Endpoint:
    - Status: 200 OK
    - Response Time: ~150-300ms
    - Availability: 99.9%
  Products API:
    - Status: 200 OK
    - Response Time: ~500-800ms
    - Throughput: 100 req/min

Frontend (Currently WAF Blocked):
  Root Page:
    - Status: 403 Forbidden
    - WAF Block Reason: Automated tool detection
  Static Assets:
    - Status: 403 Forbidden
    - CDN Cache: Not accessible
```

---

## 🚀 Phase 1: Initial Validation (0-30 minutes)

### Step 1.1: Basic Connectivity Test
```bash
# Test frontend accessibility
curl -H "User-Agent: k6/0.45.0 (aclue-monitoring)" \
     -H "X-Test-Purpose: waf-validation" \
     -w "%{http_code} - %{time_total}s\n" \
     https://aclue.app/

# Expected: 200 OK (not 403)
```

### Step 1.2: Backend API Verification
```bash
# Confirm backend remains accessible
curl https://aclue-backend-production.up.railway.app/health

# Expected: {"status": "ok"}
```

### Step 1.3: Tool-Specific Headers Test
```javascript
// K6 Quick Test
import http from 'k6/http';
import { check } from 'k6';

export default function() {
  const response = http.get('https://aclue.app', {
    headers: {
      'User-Agent': 'k6/0.45.0 (aclue-monitoring)',
      'X-Test-Purpose': 'performance-monitoring',
    },
  });

  check(response, {
    'WAF allows K6': (r) => r.status === 200,
  });
}
```

### Validation Metrics
| Endpoint | Expected Status | Expected Time | Pass/Fail |
|----------|-----------------|---------------|-----------|
| Frontend Root | 200 | <500ms | [ ] |
| Backend Health | 200 | <300ms | [ ] |
| Static Assets | 200 | <200ms | [ ] |
| API Endpoints | 200/401 | <1000ms | [ ] |

---

## 🔍 Phase 2: Comprehensive Testing (30-90 minutes)

### Step 2.1: Performance Testing with K6
```bash
# Run full performance test suite
cd /home/jack/Documents/aclue-preprod/monitoring/tool-configurations
k6 run --out json=results.json k6-production-tests.js

# Validate results
k6 inspect results.json
```

**Expected Outcomes:**
- P95 response time < 2000ms
- Error rate < 5%
- Successful completion of all test stages
- No 403 responses from WAF

### Step 2.2: Security Scanning with Nuclei
```bash
# Run security scan
nuclei -u https://aclue.app \
       -t ~/nuclei-templates/ \
       -c 10 \
       -rl 30 \
       -H "User-Agent: Nuclei/2.9.0 (aclue-security)" \
       -o security-scan-results.txt

# Check for WAF blocks
grep "403" security-scan-results.txt
```

**Expected Outcomes:**
- Scan completes without WAF interference
- No critical vulnerabilities found
- Rate limiting respects 30 req/min threshold

### Step 2.3: Load Testing with Artillery
```bash
# Run progressive load test
artillery run artillery-load-test.yaml

# Generate report
artillery report results.json
```

**Target Metrics:**
- Throughput: 100+ requests/minute sustained
- Response time P99 < 3000ms
- Error rate < 1%
- No WAF rate limiting triggers

### Step 2.4: Frontend Performance with Lighthouse
```javascript
// Lighthouse CI Test
const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');

async function runLighthouse() {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless']});
  const options = {
    logLevel: 'info',
    output: 'json',
    port: chrome.port,
    extraHeaders: {
      'User-Agent': 'Lighthouse/10.0.0 (aclue-monitoring)',
    },
  };

  const result = await lighthouse('https://aclue.app', options);
  console.log('Performance Score:', result.lhr.categories.performance.score * 100);

  await chrome.kill();
}
```

**Performance Targets:**
- Performance Score: > 85
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- Cumulative Layout Shift: < 0.1

---

## 📊 Phase 3: Validation & Reporting (90-120 minutes)

### Step 3.1: Metrics Comparison

#### Response Time Analysis
```yaml
Endpoint Comparison:
  Pre-WAF Allowlist:
    Frontend: 403 (Blocked)
    Backend: 250ms average

  Post-WAF Allowlist:
    Frontend: 200 OK, 450ms average (Expected)
    Backend: 250ms average (No change expected)

  Acceptable Variance: ±20%
```

#### Throughput Analysis
```yaml
Load Testing Results:
  Target: 100 req/min sustained
  Achieved: [To be measured]
  Peak: [To be measured]
  Error Rate: [To be measured]
```

### Step 3.2: Tool Validation Matrix

| Tool | Purpose | Pre-WAF | Post-WAF | Status |
|------|---------|---------|----------|--------|
| K6 | Load Testing | Backend only | Full access | [ ] |
| Nuclei | Security | Blocked | Limited scan | [ ] |
| Artillery | Performance | Backend only | Full access | [ ] |
| Lighthouse | Frontend audit | Blocked | Full access | [ ] |
| curl/wget | Manual testing | Varies | Full access | [ ] |

### Step 3.3: Security Validation
```bash
# Verify WAF still blocks non-allowlisted tools
curl -A "sqlmap/1.0" https://aclue.app/
# Expected: 403 Forbidden

# Verify rate limiting still active
for i in {1..100}; do
  curl -A "k6/0.45.0 (aclue-monitoring)" https://aclue.app/ &
done
# Expected: Rate limiting after 30 requests/minute
```

---

## 🔄 Rollback Criteria

### Immediate Rollback Triggers
1. **Performance Degradation** > 50% increase in response times
2. **Security Breach** - Any unauthorised access detected
3. **Service Disruption** - Error rate > 10%
4. **False Positives** - Legitimate traffic blocked

### Rollback Procedure
```bash
# 1. Disable WAF allowlist rules in Cloudflare
cf-cli waf-rules disable --rule-id [RULE_ID]

# 2. Verify rollback
curl https://aclue.app/
# Expected: 403 (back to original state)

# 3. Document issues
echo "Rollback reason: [REASON]" >> rollback-log.txt
echo "Timestamp: $(date -Iseconds)" >> rollback-log.txt

# 4. Notify team
slack-notify "WAF rollback executed: [REASON]"
```

---

## 📈 Success Metrics

### Performance KPIs
- **Response Time P95**: < 2000ms ✅
- **Availability**: > 99.9% ✅
- **Throughput**: > 100 req/min ✅
- **Error Rate**: < 1% ✅

### Security KPIs
- **WAF Effectiveness**: Blocks non-allowlisted tools ✅
- **False Positive Rate**: < 0.1% ✅
- **Rate Limiting**: Enforced at 30 req/min ✅

### Monitoring Coverage
- **Frontend Monitoring**: Fully operational ✅
- **Backend Monitoring**: Maintained ✅
- **Security Scanning**: Functional ✅
- **Performance Testing**: Unrestricted ✅

---

## 🚨 Incident Response Plan

### Monitoring Alerts
```yaml
Alert Thresholds:
  - Response Time > 3s: Warning
  - Response Time > 5s: Critical
  - Error Rate > 5%: Warning
  - Error Rate > 10%: Critical
  - WAF Blocks > 100/min: Investigation
```

### Escalation Path
1. **Level 1** - Automated alert to monitoring channel
2. **Level 2** - DevOps team notification (15 mins)
3. **Level 3** - Engineering lead escalation (30 mins)
4. **Level 4** - Rollback decision (45 mins)

---

## 📝 Post-Implementation Review

### Documentation Updates
- [ ] Update monitoring runbooks
- [ ] Document new WAF rules
- [ ] Update tool configurations
- [ ] Create troubleshooting guide

### Team Training
- [ ] WAF allowlist management
- [ ] Monitoring tool usage
- [ ] Incident response procedures
- [ ] Performance baseline awareness

### Continuous Improvement
- [ ] Weekly performance reviews
- [ ] Monthly security assessments
- [ ] Quarterly tool evaluation
- [ ] Annual WAF rule audit

---

## 🔧 Troubleshooting Guide

### Common Issues and Solutions

#### Issue: Monitoring tool receives 403
**Solution:**
```bash
# Verify User-Agent header
curl -H "User-Agent: k6/0.45.0 (aclue-monitoring)" https://aclue.app/

# Check IP allowlist
curl https://api.cloudflare.com/client/v4/zones/{zone_id}/firewall/access_rules/rules
```

#### Issue: Rate limiting too aggressive
**Solution:**
```bash
# Adjust rate limits in WAF
# Tier 2: 30 → 50 requests/minute
# Update monitoring scripts to add delays
sleep 2 # between requests
```

#### Issue: Performance degradation
**Solution:**
```bash
# Check CDN cache status
curl -I https://aclue.app/ | grep -i cache

# Verify edge locations
dig aclue.app

# Test direct origin
curl --resolve aclue.app:443:[ORIGIN_IP] https://aclue.app/
```

---

## 📅 Implementation Timeline

### Day 1 - Deployment
- **09:00** - Final checklist review
- **10:00** - Deploy WAF allowlist rules
- **10:30** - Phase 1 validation
- **11:30** - Phase 2 comprehensive testing
- **14:00** - Phase 3 reporting
- **16:00** - Go/No-Go decision

### Day 2-7 - Monitoring
- Daily performance reviews
- Alert threshold adjustments
- Tool configuration refinements

### Week 2-4 - Stabilisation
- Weekly performance reports
- Security scan reviews
- Capacity planning updates

---

## ✅ Sign-off Checklist

### Technical Validation
- [ ] All monitoring tools functional
- [ ] Performance within thresholds
- [ ] Security maintained
- [ ] No service disruption

### Business Validation
- [ ] No impact on user experience
- [ ] Cost within budget
- [ ] Compliance requirements met
- [ ] Documentation complete

### Final Approval
- [ ] DevOps Lead: _________________
- [ ] Security Team: _________________
- [ ] Engineering Manager: _________________
- [ ] Date: _________________

---

## 📚 Appendices

### A. Tool Configuration Files
- `/monitoring/tool-configurations/k6-production-tests.js`
- `/monitoring/tool-configurations/nuclei-production-config.yaml`
- `/monitoring/tool-configurations/artillery-processor.js`
- `/monitoring/tool-configurations/lighthouse-automation.js`

### B. WAF Rule Definitions
- `/monitoring/waf-configs/tier1-essential.tf`
- `/monitoring/waf-configs/tier2-performance.tf`
- `/monitoring/waf-configs/tier3-comprehensive.tf`

### C. Baseline Metrics
- `/monitoring/pre-waf-tests/baseline-results-*/`
- `/monitoring/validation/validation-results.json`

### D. Contact Information
- DevOps Team: devops@aclue.app
- Security Team: security@aclue.app
- Monitoring Alerts: alerts@aclue.app
- Incident Response: incident@aclue.app

---

**Document Version:** 1.0.0
**Last Updated:** September 2025
**Next Review:** October 2025