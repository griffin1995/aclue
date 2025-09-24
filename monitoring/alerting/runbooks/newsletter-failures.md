# Newsletter Subscription Failures Runbook

**Alert**: NewsletterSubscriptionFailures  
**Severity**: P1 - High  
**Response Time**: < 15 minutes  
**Impact**: Primary growth channel compromised - direct impact on customer acquisition  

## 🚨 Immediate Response Actions (First 15 Minutes)

### 1. Acknowledge Alert and Assess Impact
```bash
# Check current failure rate
curl -s https://aclue-backend-production.up.railway.app/api/v1/health/newsletter | jq .failure_rate

# Verify newsletter endpoint accessibility
curl -f https://aclue.app/newsletter || echo "Newsletter page inaccessible"
```

### 2. Quick Manual Test
```bash
# Test newsletter subscription manually
# Navigate to https://aclue.app/newsletter
# Try subscribing with a test email
# Expected: Success message and welcome email delivery
```

### 3. Immediate Business Impact Assessment
- **Growth Impact**: Newsletter is primary lead generation channel
- **Revenue Impact**: Failed subscriptions = lost potential customers
- **User Experience**: Poor first impression for new visitors
- **Reputation Risk**: Users may report issues on social media

## 🔍 Diagnostic Procedures

### Check Newsletter System Components

#### 1. Frontend Newsletter Form (Next.js)
```bash
# Check newsletter page accessibility
curl -I https://aclue.app/newsletter

# Verify form rendering (check for JavaScript errors)
curl -s https://aclue.app/newsletter | grep -i "newsletter\|subscribe\|email"
```

#### 2. Server Action Execution (Critical - Direct Resend Integration)
```bash
# Check Vercel function logs
# Navigate to Vercel Dashboard → Functions → newsletter action logs

# Look for Server Action errors
grep -i "newsletter\|server action\|resend" /var/log/vercel/*.log
```

#### 3. Resend Email Service Status
```bash
# Check Resend service status
curl -s https://status.resend.com/api/v2/status.json | jq .

# Test Resend API connectivity
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "test@aclue.app",
    "to": "test@example.com",
    "subject": "Test Email",
    "text": "Test message"
  }'
```

#### 4. Database Connectivity (Supabase)
```bash
# Test newsletter_subscribers table access
psql "$SUPABASE_DB_URL" -c "
SELECT COUNT(*) as total_subscribers,
       COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 hour') as recent_subscribers
FROM newsletter_subscribers;"

# Check for database connection issues
psql "$SUPABASE_DB_URL" -c "SELECT 1;" || echo "Database connection failed"
```

## 🔧 Common Failure Scenarios & Solutions

### Scenario 1: Server Action Failures (Most Common)

#### Symptoms
- Form submission returns error
- No welcome emails sent
- No database records created

#### Diagnosis
```bash
# Check Vercel function execution logs
# Look for Server Action errors in Vercel Dashboard

# Common error patterns:
# - "RESEND_API_KEY is undefined"
# - "Network request failed" 
# - "Supabase connection timeout"
```

#### Resolution
```bash
# 1. Verify environment variables in Vercel
# Navigate to Vercel Dashboard → Project → Settings → Environment Variables
# Ensure these are set:
# - RESEND_API_KEY (no NEXT_PUBLIC_ prefix)
# - SUPABASE_SERVICE_ROLE_KEY
# - NEXT_PUBLIC_SUPABASE_URL
# - NEXT_PUBLIC_SUPABASE_ANON_KEY

# 2. Redeploy if environment variables were missing/incorrect
vercel --prod

# 3. Test Server Action directly (if possible via API)
```

### Scenario 2: Resend API Issues

#### Symptoms
- Database records created but no emails sent
- Resend API returns errors
- Email delivery failures

#### Diagnosis
```bash
# Check Resend dashboard for delivery failures
# Navigate to: https://resend.com/dashboard

# Check API key validity
curl -X GET https://api.resend.com/domains \
  -H "Authorization: Bearer $RESEND_API_KEY"

# Verify sending domain status
curl -X GET https://api.resend.com/domains/aclue.app \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

#### Resolution
```bash
# 1. Check domain verification status
# Ensure aclue.app is verified in Resend dashboard

# 2. Verify DNS records for email sending
dig TXT _resend.aclue.app

# 3. Check rate limits and quotas
# Review Resend dashboard for any quota exceeded errors

# 4. Test email sending manually
curl -X POST https://api.resend.com/emails \
  -H "Authorization: Bearer $RESEND_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "from": "hello@aclue.app",
    "to": "test@example.com", 
    "subject": "Test Welcome Email",
    "html": "<p>Test welcome email from aclue</p>"
  }'
```

### Scenario 3: Database Connection Issues

#### Symptoms
- Newsletter form submissions timeout
- Database write failures
- Supabase connection errors

#### Diagnosis
```bash
# Check Supabase service status
curl -s https://status.supabase.com/api/v2/status.json | jq .

# Test database connectivity
psql "$SUPABASE_DB_URL" -c "SELECT NOW();"

# Check connection pool usage
psql "$SUPABASE_DB_URL" -c "
SELECT count(*) as active_connections,
       setting::int as max_connections
FROM pg_stat_activity, pg_settings 
WHERE pg_settings.name = 'max_connections'
GROUP BY setting;"
```

#### Resolution
```bash
# 1. Reset connection pool if exhausted
psql "$SUPABASE_DB_URL" -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND state_change < now() - interval '5 minutes';"

# 2. Check for database locks
psql "$SUPABASE_DB_URL" -c "
SELECT blocked_locks.pid AS blocked_pid,
       blocking_locks.pid AS blocking_pid,
       blocked_activity.usename AS blocked_user,
       blocking_activity.usename AS blocking_user,
       blocked_activity.query AS blocked_statement
FROM pg_catalog.pg_locks blocked_locks
JOIN pg_catalog.pg_stat_activity blocked_activity 
  ON blocked_activity.pid = blocked_locks.pid
JOIN pg_catalog.pg_locks blocking_locks 
  ON blocking_locks.locktype = blocked_locks.locktype
  AND blocking_locks.transactionid = blocked_locks.transactionid
JOIN pg_catalog.pg_stat_activity blocking_activity 
  ON blocking_activity.pid = blocking_locks.pid
WHERE NOT blocked_locks.granted;"

# 3. Verify newsletter_subscribers table structure
psql "$SUPABASE_DB_URL" -c "\d newsletter_subscribers"
```

### Scenario 4: Frontend Form Issues

#### Symptoms
- Form doesn't submit
- JavaScript errors prevent submission
- Form validation failures

#### Diagnosis
```bash
# Check console errors in browser dev tools
# Navigate to https://aclue.app/newsletter
# Open browser dev tools → Console tab
# Look for JavaScript errors

# Check form action attribute
curl -s https://aclue.app/newsletter | grep -A 10 -B 10 "form\|action"
```

#### Resolution
```bash
# 1. Clear CDN cache to ensure latest version
# Navigate to Vercel Dashboard → Deployments → Current → Functions tab
# Clear cache if necessary

# 2. Verify form component integrity
# Check for recent deployments that may have broken form

# 3. Test with JavaScript disabled
# This tests if Server Action works without client-side JavaScript
```

## 📊 Real-Time Monitoring During Investigation

### Newsletter Metrics Dashboard
```bash
# Check subscription success rate (last hour)
curl -s "https://grafana.aclue.app/api/datasources/proxy/1/query?q=
newsletter_subscription_success_rate_1h" | jq .

# Monitor error patterns
tail -f /var/log/newsletter/*.log | grep -i error

# Check email delivery rates in Resend dashboard
# Navigate to: https://resend.com/dashboard → Analytics
```

### User Impact Assessment
```bash
# Count failed subscriptions in last hour
psql "$SUPABASE_DB_URL" -c "
SELECT COUNT(*) as failed_attempts_last_hour
FROM newsletter_subscription_logs 
WHERE status = 'failed' 
AND created_at > NOW() - INTERVAL '1 hour';"

# Compare to normal subscription volume
psql "$SUPABASE_DB_URL" -c "
SELECT 
  COUNT(*) as current_hour,
  COUNT(*) FILTER (WHERE created_at > NOW() - INTERVAL '1 day' 
                  AND created_at <= NOW() - INTERVAL '23 hours') / 24 as avg_hourly_yesterday
FROM newsletter_subscribers 
WHERE created_at > NOW() - INTERVAL '1 hour';"
```

## ⚡ Immediate Temporary Fixes

### Option 1: Emergency Fallback Form
```bash
# If Server Actions are failing, temporarily implement API route fallback
# This requires code deployment but can restore functionality quickly
```

### Option 2: External Newsletter Service
```bash
# Temporarily redirect newsletter signups to external service
# Update DNS or implement redirect if primary system unusable
```

### Option 3: Manual Processing
```bash
# For critical periods, manually process failed subscription attempts
# Query failed attempts and manually add to email service
```

## ✅ Resolution Verification

### End-to-End Newsletter Test
```bash
# 1. Test newsletter page loads correctly
curl -f https://aclue.app/newsletter && echo "Page accessible"

# 2. Test form submission with unique test email
# Navigate to https://aclue.app/newsletter
# Submit form with email: test-$(date +%s)@example.com

# 3. Verify database record created
psql "$SUPABASE_DB_URL" -c "
SELECT * FROM newsletter_subscribers 
WHERE email LIKE 'test-%@example.com' 
ORDER BY created_at DESC LIMIT 1;"

# 4. Verify welcome email sent
# Check Resend dashboard for recent sends
# Check test email inbox for welcome email

# 5. Test unsubscribe functionality (if implemented)
```

### Performance Verification
```bash
# Test form submission response time
time curl -X POST https://aclue.app/api/newsletter-subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"perf-test@example.com"}'

# Should complete in < 3 seconds
```

## 📢 Communication Procedures

### Internal Team Communication
```
Subject: 🔧 Newsletter System Issue - Investigating

Newsletter subscription failures detected:
- Current failure rate: X%
- Impact: Primary growth channel affected
- Status: INVESTIGATING
- ETA: Initial fix within 30 minutes

Actions taken:
- [List current diagnostic steps]

Updates in 15 minutes.
```

### Business Stakeholder Communication
```
Subject: Newsletter System Monitoring Alert

We're monitoring an issue with newsletter subscriptions that may be affecting new user sign-ups. Our engineering team is investigating and implementing a fix.

Impact: Some visitors may experience issues subscribing to our newsletter
Timeline: Resolution expected within 1 hour
Mitigation: Manual processing for critical leads if needed

Will update as soon as resolved.
```

## 🔄 Post-Resolution Actions

### Immediate Verification
1. **Test newsletter flow end-to-end** with multiple email addresses
2. **Monitor subscription success rate** for 2 hours post-fix
3. **Check welcome email delivery rates** in Resend dashboard
4. **Verify database consistency** - no orphaned records

### Business Impact Assessment
```bash
# Calculate lost subscriptions during outage
psql "$SUPABASE_DB_URL" -c "
SELECT 
  DATE_TRUNC('hour', created_at) as hour,
  COUNT(*) as successful_subscriptions
FROM newsletter_subscribers 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY hour 
ORDER BY hour;"

# Compare to expected volume based on historical data
```

### Process Improvements
1. **Enhanced Monitoring**: Add newsletter-specific health checks
2. **Alerting Tuning**: Adjust failure rate thresholds if needed
3. **Documentation**: Update newsletter architecture docs
4. **Testing**: Add newsletter flow to automated testing suite

## 🚫 Critical Architecture Notes

### DO NOT Change Newsletter Architecture
The current newsletter system uses **Direct Resend SDK integration via Server Actions**. This architecture was implemented to prevent production failures:

- ❌ **Do NOT convert to API routes** - causes NETWORK_ERROR in production
- ❌ **Do NOT use fetch() internally** - breaks in Vercel Edge Runtime  
- ❌ **Do NOT expose RESEND_API_KEY to client** - security violation
- ✅ **DO maintain Server Action pattern** - proven reliable in production

### Environment Variable Requirements
```bash
# Required in Vercel (server-side only)
RESEND_API_KEY=re_xxxxxxxxxxxx  # NO NEXT_PUBLIC_ prefix
SUPABASE_SERVICE_ROLE_KEY=xxx   # NO NEXT_PUBLIC_ prefix

# Required in Vercel (client-accessible)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
```

## 📱 Emergency Escalation

### When to Escalate
- Newsletter failures > 50% for more than 30 minutes
- Complete newsletter system outage during high-traffic periods
- Security concerns (API key exposure, data breach)
- Vendor outages (Resend, Supabase) affecting recovery

### Escalation Contacts
- **Engineering Manager**: For technical roadblock or resource needs
- **Marketing Team**: For business impact assessment and alternatives
- **Security Team**: For any API key or data security concerns
- **Executive Team**: For outages > 2 hours affecting primary growth channel

---

**Last Updated**: September 2024  
**Next Review**: October 2024  
**Critical System**: Newsletter = Primary Growth Driver