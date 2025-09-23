# aclue Database Enhancement Deployment Guide

## 🎯 Deployment Overview

This guide provides step-by-step instructions for deploying the missing database tables required for revenue tracking and ML features on the aclue platform.

### 📋 Deployment Summary
- **5 new tables** for comprehensive platform functionality
- **Zero downtime deployment** using safe SQL patterns
- **Production-ready** with full RLS security and performance optimisation
- **Comprehensive verification** procedures included

### 🏗️ Tables Being Deployed

| Table | Purpose | Business Value |
|-------|---------|---------------|
| `affiliate_clicks` | Revenue tracking and affiliate attribution | Commission tracking, revenue analytics |
| `user_preferences` | ML-powered personalisation profiles | Improved recommendations, user experience |
| `session_analytics` | User behaviour tracking | Funnel analysis, conversion optimisation |
| `product_views` | Product engagement metrics | CTR analysis, popularity tracking |
| `recommendation_feedback` | ML training feedback data | Continuous learning, model improvement |

---

## 🚀 Pre-Deployment Checklist

### ✅ Prerequisites Verification

1. **Database Access Confirmed**
   - [ ] Supabase project access available
   - [ ] SQL Editor accessible at: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
   - [ ] Service role permissions confirmed

2. **Dependency Validation**
   - [ ] Existing tables confirmed: `auth.users`, `products`, `recommendations`
   - [ ] Required extensions available: `uuid-ossp`, `pg_trgm`
   - [ ] Update trigger function `update_updated_at_column()` exists

3. **Backup Preparation**
   - [ ] Current database schema exported
   - [ ] Backup strategy confirmed for rollback capability
   - [ ] Monitoring tools ready for deployment verification

### 🔍 Current Schema Validation

Run this query in Supabase SQL Editor to verify prerequisites:

```sql
-- Verify existing dependencies
SELECT
    'Dependency Check' as verification_type,
    table_name,
    CASE WHEN table_name IS NOT NULL THEN '✅ Available' ELSE '❌ Missing' END as status
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('products', 'recommendations', 'categories')
UNION ALL
SELECT
    'Auth Schema Check' as verification_type,
    'auth.users' as table_name,
    CASE WHEN EXISTS (SELECT 1 FROM auth.users LIMIT 1) THEN '✅ Available' ELSE '❌ Missing' END as status
UNION ALL
SELECT
    'Function Check' as verification_type,
    'update_updated_at_column' as table_name,
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.routines
        WHERE routine_name = 'update_updated_at_column'
    ) THEN '✅ Available' ELSE '❌ Missing' END as status;
```

**Expected Results:** All items should show "✅ Available" status.

---

## 🛠️ Deployment Procedures

### Step 1: Execute Main Deployment Script

1. **Open Supabase SQL Editor**
   - Navigate to: https://supabase.com/dashboard/project/YOUR_PROJECT_ID/sql
   - Create new query tab

2. **Load Deployment Script**
   - Copy the entire contents of `/database/03_deploy_missing_tables_corrected.sql`
   - Paste into SQL Editor

3. **Execute Deployment**
   ```sql
   -- Execute the complete deployment script
   -- This is a zero-downtime deployment using IF NOT EXISTS patterns
   ```
   - Click "Run" button
   - Monitor execution progress
   - Verify no errors in output

### Step 2: Immediate Verification

Run the built-in verification queries (included in deployment script):

```sql
-- Table Creation Verification
SELECT
    'Table Creation Verification' as check_type,
    tablename,
    CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'RLS Disabled' END as rls_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tablename;
```

**Expected Results:**
```
affiliate_clicks         | RLS Enabled
product_views           | RLS Enabled
recommendation_feedback | RLS Enabled
session_analytics       | RLS Enabled
user_preferences        | RLS Enabled
```

### Step 3: RLS Policy Verification

```sql
-- RLS Policy Verification
SELECT
    'RLS Policy Verification' as check_type,
    tablename,
    COUNT(*) as policy_count,
    STRING_AGG(policyname, ', ') as policy_names
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
GROUP BY tablename
ORDER BY tablename;
```

**Expected Results:** Each table should have 2-3 policies including service role access.

### Step 4: Index Performance Verification

```sql
-- Index Creation Verification
SELECT
    'Index Verification' as check_type,
    tablename,
    COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
GROUP BY tablename
ORDER BY tablename;
```

**Expected Results:** Each table should have multiple indexes for performance.

---

## 🔧 Post-Deployment Configuration

### Performance Monitoring Setup

1. **Enable Query Performance Tracking**
   ```sql
   -- Enable pg_stat_statements for monitoring (if not already enabled)
   CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
   ```

2. **Set Up Monitoring Queries**
   - Use queries from `/database/performance_monitoring.sql`
   - Schedule regular performance checks
   - Set up alerts for slow queries

### Analytics Configuration

1. **Verify Table Access Patterns**
   ```sql
   -- Test service role access
   SELECT COUNT(*) FROM affiliate_clicks;
   SELECT COUNT(*) FROM user_preferences;
   SELECT COUNT(*) FROM session_analytics;
   SELECT COUNT(*) FROM product_views;
   SELECT COUNT(*) FROM recommendation_feedback;
   ```

2. **Test RLS Policies**
   ```sql
   -- Test authenticated user access (replace with actual user ID)
   SET ROLE authenticated;
   SET request.jwt.claims TO '{"sub": "actual-user-id-here"}';

   -- These should return appropriate user-scoped results
   SELECT COUNT(*) FROM affiliate_clicks WHERE user_id = auth.uid();
   SELECT * FROM user_preferences WHERE user_id = auth.uid();

   -- Reset to default role
   RESET ROLE;
   ```

---

## 🧪 Testing and Validation

### Functional Testing

1. **Test Data Insertion**
   ```sql
   -- Test affiliate clicks insertion (replace with actual product ID)
   INSERT INTO affiliate_clicks (
       user_id, product_id, session_id, source_page,
       affiliate_network, affiliate_url
   ) VALUES (
       auth.uid(), 'actual-product-id', 'test-session-123',
       'discover', 'amazon', 'https://example.com/affiliate-link'
   );
   ```

2. **Test User Preferences**
   ```sql
   -- Test user preferences insertion
   INSERT INTO user_preferences (
       user_id, category_preferences, total_swipes, right_swipes
   ) VALUES (
       auth.uid(), '{"electronics": 0.8, "fashion": 0.6}', 10, 7
   );
   ```

3. **Test Session Analytics**
   ```sql
   -- Test session analytics insertion
   INSERT INTO session_analytics (
       session_id, user_id, landing_page, device_type
   ) VALUES (
       'test-session-456', auth.uid(), '/discover', 'desktop'
   );
   ```

### Performance Testing

1. **Query Performance Baseline**
   ```sql
   -- Measure baseline query performance
   EXPLAIN ANALYZE SELECT * FROM affiliate_clicks
   WHERE user_id = auth.uid()
   ORDER BY click_timestamp DESC LIMIT 10;
   ```

2. **Index Usage Verification**
   ```sql
   -- Verify indexes are being used
   EXPLAIN (ANALYZE, BUFFERS) SELECT * FROM product_views
   WHERE product_id = 'some-product-id'
   ORDER BY view_timestamp DESC;
   ```

---

## 🔄 Rollback Procedures

### Emergency Rollback (if needed)

1. **Drop New Tables** (only if absolutely necessary)
   ```sql
   -- WARNING: This will permanently delete all data in new tables
   DROP TABLE IF EXISTS recommendation_feedback CASCADE;
   DROP TABLE IF EXISTS product_views CASCADE;
   DROP TABLE IF EXISTS session_analytics CASCADE;
   DROP TABLE IF EXISTS user_preferences CASCADE;
   DROP TABLE IF EXISTS affiliate_clicks CASCADE;
   ```

2. **Verify Rollback**
   ```sql
   -- Confirm tables are removed
   SELECT tablename FROM pg_tables
   WHERE schemaname = 'public'
     AND tablename IN (
       'affiliate_clicks', 'user_preferences', 'session_analytics',
       'product_views', 'recommendation_feedback'
     );
   ```

### Partial Rollback (table-specific)

```sql
-- Drop specific table if issues identified
DROP TABLE IF EXISTS specific_table_name CASCADE;

-- Verify existing functionality still works
SELECT COUNT(*) FROM products;
SELECT COUNT(*) FROM users;
```

---

## 📊 Success Criteria

### ✅ Deployment Success Indicators

- [ ] All 5 tables created successfully
- [ ] RLS policies active on all tables (2-3 policies each)
- [ ] Performance indexes created (6+ indexes per table)
- [ ] Foreign key constraints functioning
- [ ] Update triggers operational
- [ ] Test data insertion/retrieval working
- [ ] No existing functionality broken

### 📈 Performance Targets

- [ ] Query response times under 100ms for indexed lookups
- [ ] RLS policy overhead under 10ms per query
- [ ] Index usage confirmed in query plans
- [ ] No sequential scans on large tables

### 🔒 Security Validation

- [ ] User data properly isolated by RLS policies
- [ ] Service role access functioning for admin operations
- [ ] Anonymous user support working for pre-registration
- [ ] No unauthorised cross-user data access possible

---

## 🚨 Troubleshooting

### Common Issues and Solutions

#### Issue: Foreign Key Constraint Errors
```sql
-- Check if referenced tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('products', 'recommendations');

-- Verify auth.users access
SELECT COUNT(*) FROM auth.users LIMIT 1;
```

#### Issue: RLS Policy Problems
```sql
-- Check current user context
SELECT current_user, session_user, auth.uid();

-- Verify policy configuration
SELECT * FROM pg_policies WHERE tablename = 'problematic_table';
```

#### Issue: Index Creation Failures
```sql
-- Check for naming conflicts
SELECT indexname FROM pg_indexes
WHERE indexname LIKE 'idx_affiliate%';

-- Verify table structure
\d affiliate_clicks
```

#### Issue: Permission Denied Errors
```sql
-- Verify user role permissions
SELECT current_user, current_setting('role');

-- Check table ownership
SELECT tableowner FROM pg_tables WHERE tablename = 'affiliate_clicks';
```

---

## 📞 Support and Escalation

### Deployment Support Contacts

- **Primary:** Database Administrator
- **Secondary:** Development Team Lead
- **Escalation:** Platform Architecture Team

### Documentation References

- **Supabase RLS Documentation:** https://supabase.com/docs/guides/auth/row-level-security
- **PostgreSQL Performance Tuning:** https://www.postgresql.org/docs/current/performance-tips.html
- **aclue Platform Architecture:** `/docs/architecture.md`

### Monitoring and Alerts

- **Performance Monitoring:** `/database/performance_monitoring.sql`
- **Business Metrics:** Included in deployment verification queries
- **Error Tracking:** Check Supabase dashboard logs

---

## ✅ Deployment Sign-off

### Pre-Deployment Approval

- [ ] **Database Administrator:** Schema review completed
- [ ] **Development Team:** Integration requirements confirmed
- [ ] **DevOps Team:** Monitoring and backup procedures ready
- [ ] **Product Team:** Business requirements validated

### Post-Deployment Verification

- [ ] **Deployment Executed:** Date/Time: _______________
- [ ] **Verification Tests Passed:** All success criteria met
- [ ] **Performance Baseline Established:** Monitoring active
- [ ] **Documentation Updated:** Team notifications sent

### Production Readiness

- [ ] **Backend Integration:** API endpoints ready for new tables
- [ ] **Frontend Integration:** Data collection implementations planned
- [ ] **Analytics Setup:** Dashboard configurations prepared
- [ ] **ML Pipeline:** Preference calculation jobs scheduled

---

**Deployment Completed By:** _______________
**Date:** _______________
**Verification Completed:** _______________

**Next Steps:** Update backend API endpoints to utilise new tables and implement data collection in user interaction flows.