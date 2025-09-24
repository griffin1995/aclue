# Service Down Response Runbook

**Alert**: ServiceDown  
**Severity**: P0 - Critical  
**Response Time**: < 5 minutes  
**Impact**: Complete service outage affecting all users  

## 🚨 Immediate Response Actions (First 5 Minutes)

### 1. Acknowledge Alert Immediately
```bash
# Acknowledge in PagerDuty to stop escalation
# Update incident status: "Investigating"
```

### 2. Quick Impact Assessment
- **Check Status**: https://status.aclue.app
- **Verify Outage**: Test service endpoints manually
- **User Impact**: Complete service unavailability

### 3. Identify Affected Service
- **Frontend (aclue.app)**: Vercel deployment issue
- **Backend API**: Railway container or deployment issue  
- **Database**: Supabase connectivity or service issue

## 🔍 Diagnostic Procedures

### Frontend Service Down (Vercel)

#### Check Vercel Status
```bash
# Check Vercel status page
curl -s https://www.vercel-status.com/api/v2/status.json | jq .

# Check deployment status
curl -H "Authorization: Bearer $VERCEL_TOKEN" \
     https://api.vercel.com/v9/projects/$PROJECT_ID/deployments
```

#### Verify DNS and CDN
```bash
# Check DNS resolution
nslookup aclue.app
dig +short aclue.app

# Check CDN response
curl -I https://aclue.app
```

#### Check Recent Deployments
1. **Vercel Dashboard**: https://vercel.com/dashboard
2. **Review Recent Deployments**: Check for failed or stuck deployments
3. **Check Build Logs**: Look for build failures or errors

### Backend Service Down (Railway)

#### Check Railway Service Status
```bash
# Check Railway status
curl -s https://railway.app/status

# Check container health
curl -f https://aclue-backend-production.up.railway.app/health
```

#### Review Container Logs
1. **Railway Dashboard**: https://railway.app/dashboard
2. **View Logs**: Check for application crashes or errors
3. **Resource Usage**: Check CPU/memory/disk usage

#### Check Database Connectivity
```bash
# Test database connection from backend
curl -f https://aclue-backend-production.up.railway.app/api/v1/health/database
```

### Database Service Down (Supabase)

#### Check Supabase Status
```bash
# Check Supabase status page
curl -s https://status.supabase.com/api/v2/status.json | jq .

# Test database connectivity
psql "$SUPABASE_DB_URL" -c "SELECT 1 AS health_check;"
```

#### Check Connection Pool
```bash
# Check active connections
psql "$SUPABASE_DB_URL" -c "
SELECT count(*) as active_connections,
       max_conn
FROM pg_stat_activity, 
     (SELECT setting::int as max_conn FROM pg_settings WHERE name = 'max_connections') mc
GROUP BY max_conn;"
```

## ⚡ Recovery Actions

### Frontend Recovery (Vercel)

#### Option 1: Redeploy Current Version
```bash
# Trigger redeployment via Vercel CLI
vercel --prod --force

# Or via API
curl -X POST \
  -H "Authorization: Bearer $VERCEL_TOKEN" \
  -H "Content-Type: application/json" \
  https://api.vercel.com/v1/integrations/deploy/PROJECT_ID
```

#### Option 2: Rollback to Previous Version
```bash
# List recent deployments
vercel ls --prod

# Rollback to specific deployment
vercel rollback [deployment-url] --prod
```

#### Option 3: Emergency DNS Change
```bash
# If CDN issues, temporarily point to backup
# (This requires pre-configured backup infrastructure)
```

### Backend Recovery (Railway)

#### Option 1: Restart Container
1. **Railway Dashboard** → Select Service → **Restart**
2. **Monitor Logs** during restart process
3. **Verify Health Check** after restart

#### Option 2: Rollback Deployment
```bash
# Via Railway CLI
railway rollback

# Or via dashboard - select previous working deployment
```

#### Option 3: Scale Resources
If resource exhaustion caused the outage:
1. **Increase Memory/CPU** allocation
2. **Restart Service** with new resources
3. **Monitor Performance** during recovery

### Database Recovery (Supabase)

#### Option 1: Connection Pool Reset
```bash
# Kill long-running connections
psql "$SUPABASE_DB_URL" -c "
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
AND state_change < now() - interval '5 minutes';"
```

#### Option 2: Emergency Read-Only Mode
```bash
# If write operations are failing, enable read-only temporarily
# This requires application-level configuration
```

#### Option 3: Contact Supabase Support
- **Supabase Dashboard**: Create support ticket
- **Emergency Contact**: Use Supabase emergency escalation
- **Status Updates**: Monitor https://status.supabase.com/

## 📢 Communication Procedures

### Immediate Communication (Within 5 minutes)
```
Subject: 🚨 aclue Platform - Service Outage Detected

We have detected a complete service outage affecting aclue.app.

Status: INVESTIGATING
Impact: Complete service unavailability
ETA: Initial assessment in 10 minutes

Updates will be provided every 15 minutes.

Status Page: https://status.aclue.app
```

### Status Page Update
1. **Create Incident**: "Service Outage - Investigating"
2. **Set Impact**: "Major Outage"  
3. **Update Components**: Mark affected services as down
4. **Initial Message**: Brief description and investigation status

### Stakeholder Notifications
- **#alerts-critical**: Immediate alert with technical details
- **#general**: Brief user-facing update (if customer-facing)
- **Management**: For outages > 15 minutes or business impact

## 🔧 Advanced Troubleshooting

### Network Connectivity Issues
```bash
# Check external connectivity
ping -c 4 8.8.8.8
curl -I https://httpbin.org/status/200

# Check service-to-service connectivity
curl -f https://aclue-backend-production.up.railway.app/health
curl -f "$SUPABASE_URL/rest/v1/health" -H "apikey: $SUPABASE_ANON_KEY"
```

### Certificate/SSL Issues
```bash
# Check SSL certificate validity
openssl s_client -connect aclue.app:443 -servername aclue.app | \
  openssl x509 -noout -dates

# Check certificate expiration
echo | openssl s_client -connect aclue.app:443 -servername aclue.app 2>/dev/null | \
  openssl x509 -noout -subject -dates
```

### Load Balancer/CDN Issues
```bash
# Bypass CDN to test origin
curl -H "Host: aclue.app" http://origin-server-ip/

# Check CDN cache status
curl -I https://aclue.app -H "Cache-Control: no-cache"
```

## ✅ Resolution Verification

### Service Health Checks
```bash
# Frontend verification
curl -f https://aclue.app/ && echo "Frontend OK" || echo "Frontend FAIL"

# Backend API verification  
curl -f https://aclue-backend-production.up.railway.app/health && \
  echo "Backend OK" || echo "Backend FAIL"

# Database verification
psql "$SUPABASE_DB_URL" -c "SELECT 1;" && echo "Database OK" || echo "Database FAIL"
```

### Full End-to-End Test
```bash
# Test critical user journey
curl -X POST https://aclue-backend-production.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"testpass"}' && \
  echo "Auth flow OK" || echo "Auth flow FAIL"
```

### Performance Verification
```bash
# Check response times are normal
curl -w "Connect: %{time_connect}s, TTFB: %{time_starttransfer}s, Total: %{time_total}s\n" \
  -o /dev/null -s https://aclue.app/
```

## 📊 Post-Resolution Actions

### Update Status Communications
```
Subject: ✅ aclue Platform - Service Restored

The service outage affecting aclue.app has been resolved.

Status: RESOLVED
Resolution: [Brief description of fix applied]
Duration: [Total outage duration]
Root Cause: [Brief root cause - full RCA to follow]

All services are now operating normally.
We apologize for any inconvenience caused.
```

### Incident Documentation
1. **Timeline**: Document key events with timestamps
2. **Root Cause**: Identify underlying cause
3. **Resolution**: Document exact steps taken to resolve
4. **Impact**: Calculate user impact and business metrics affected
5. **Action Items**: Create tasks to prevent recurrence

### Monitoring and Alerts Review
- **Alert Timing**: Verify alerts fired appropriately
- **Response Time**: Measure actual vs target response time  
- **Detection Gap**: Identify any monitoring gaps
- **False Positives**: Check for any unnecessary alerts during incident

## 🚫 What NOT to Do

- **Don't panic**: Follow systematic troubleshooting approach
- **Don't skip communication**: Keep stakeholders informed even without updates
- **Don't make multiple changes**: Make one change at a time and verify
- **Don't ignore monitoring**: Continue monitoring during recovery
- **Don't forget documentation**: Document actions even during crisis

## 📱 Emergency Contacts

- **On-Call Engineer**: Available via PagerDuty
- **Incident Commander**: Escalated automatically for P0 alerts
- **Vercel Support**: https://vercel.com/support (if Vercel issue)
- **Railway Support**: support@railway.app (if Railway issue)  
- **Supabase Support**: https://supabase.com/support (if Supabase issue)

## 🔄 Related Runbooks

- [High Error Rate](./high-error-rate.md) - If service partially working
- [Database Down](./database-down.md) - If only database affected
- [Performance Degradation](./api-response-time.md) - If service slow but not down
- [Security Incident](./ddos-response.md) - If outage due to attack

---

**Last Updated**: September 2024  
**Next Review**: October 2024  
**Runbook Version**: 1.0