# Database Deployment Checklist - Aclue Production Implementation
**Date**: 6 August 2025  
**Version**: 2.0  
**Environment**: Production Deployment  
**Database**: Supabase PostgreSQL

## Pre-Deployment Preparation

### 1. Backup and Safety Measures ✅

- [ ] **Create Full Database Backup**
  ```sql
  -- Run in Supabase SQL Editor
  SELECT 'Database backup initiated at: ' || NOW()::text as backup_status;
  ```

- [ ] **Export Current Schema**
  ```bash
  # Download current schema from Supabase dashboard
  # Navigate to: Database > Schema Visualizer > Export
  ```

- [ ] **Document Current RLS Policies**
  ```sql
  -- Document existing policies
  SELECT tablename, policyname, permissive, roles, cmd, qual, with_check
  FROM pg_policies 
  WHERE schemaname = 'public'
  ORDER BY tablename, policyname;
  ```

- [ ] **Verify Application Dependencies**
  - Test current API endpoints functionality
  - Confirm authentication system operational status
  - Document any critical business processes

### 2. Testing Environment Validation ✅

- [ ] **Set Up Staging Environment**
  - Create Supabase staging project
  - Import current production schema
  - Test migration scripts in staging

- [ ] **Performance Baseline Measurement**
  ```sql
  -- Measure current query performance
  SELECT query, calls, total_time, mean_time
  FROM pg_stat_statements 
  ORDER BY total_time DESC
  LIMIT 10;
  ```

## Deployment Phase 1: Core Schema Enhancements

### 1. Deploy Missing Tables ✅

**File**: `/database/02_create_missing_tables.sql`

- [ ] **Execute Table Creation Script**
  ```sql
  -- Run in Supabase SQL Editor
  -- Execute complete file: database/02_create_missing_tables.sql
  ```

- [ ] **Verify Table Creation**
  ```sql
  -- Verify all tables created successfully
  SELECT tablename, 
         CASE WHEN rowsecurity THEN 'RLS Enabled' ELSE 'RLS Disabled' END as rls_status
  FROM pg_tables 
  WHERE schemaname = 'public' 
    AND tablename IN (
      'affiliate_clicks',
      'user_preferences', 
      'session_analytics',
      'product_views',
      'recommendation_feedback'
    )
  ORDER BY tablename;
  ```

**Expected Results:**
- 5 new tables created
- All tables have RLS enabled
- All indexes created successfully
- All triggers operational

### 2. Deploy Enhanced RLS Policies ✅

**File**: `/database/enhanced_rls_policies.sql`

- [ ] **Execute RLS Enhancement Script**
  ```sql
  -- Run in Supabase SQL Editor
  -- Execute complete file: database/enhanced_rls_policies.sql
  ```

- [ ] **Verify Policy Implementation**
  ```sql
  -- Check policy count per table
  SELECT tablename, COUNT(*) as policy_count
  FROM pg_policies
  WHERE schemaname = 'public'
  GROUP BY tablename
  ORDER BY tablename;
  ```

**Expected Results:**
- All tables have performance-optimised policies
- Service role policies implemented
- Anonymous user support configured
- Auth function calls optimised

### 3. Performance Monitoring Setup ✅

**File**: `/database/performance_monitoring.sql`

- [ ] **Deploy Monitoring Queries**
  - Save monitoring queries as Supabase dashboard queries
  - Set up regular execution schedule
  - Configure alert thresholds

- [ ] **Enable pg_stat_statements**
  ```sql
  -- Verify extension is available
  CREATE EXTENSION IF NOT EXISTS pg_stat_statements;
  ```

**Expected Results:**
- Performance monitoring queries operational
- Extension enabled for query statistics
- Baseline metrics established

## Deployment Phase 2: Application Integration

### 1. Database Service Deployment ✅

**File**: `/backend/app/services/database_service.py`

- [ ] **Deploy Enhanced Service Layer**
  - Update application with enhanced database service
  - Test service layer functionality
  - Verify connection management

- [ ] **Test Core Operations**
  ```python
  # Test user preference calculation
  preferences = await database_service.calculate_user_preferences("test-user-id")
  
  # Test affiliate click recording
  click_id = await database_service.record_affiliate_click(
      user_id="test-user-id",
      product_id="test-product-id",
      session_id="test-session-id",
      affiliate_url="https://example.com/affiliate"
  )
  ```

**Expected Results:**
- All database operations functional
- Error handling working correctly
- Logging operational

### 2. API Endpoint Updates ✅

- [ ] **Update Recommendation Endpoints**
  - Verify real data integration
  - Test preference-based recommendations
  - Confirm mock data removal

- [ ] **Test Authentication Integration**
  - Verify RLS policy enforcement
  - Test user-scoped data access
  - Confirm service role operations

**Expected Results:**
- Endpoints returning real data
- Authentication working with RLS
- Performance within acceptable limits

## Deployment Phase 3: Monitoring and Validation

### 1. Performance Validation ✅

- [ ] **Execute Performance Tests**
  ```sql
  -- Run complete performance monitoring suite
  -- Execute: database/performance_monitoring.sql
  ```

- [ ] **Compare Performance Metrics**
  - Query execution times improved
  - Index usage optimised
  - RLS policy performance enhanced

- [ ] **Load Testing**
  - Simulate concurrent user load
  - Test database connection limits
  - Verify response time targets

**Performance Targets:**
- Query response time: <100ms (90th percentile)
- Index usage ratio: >80%
- Connection utilisation: <70%

### 2. Business Metrics Validation ✅

- [ ] **Test Business Operations**
  ```python
  # Test user registration and preference calculation
  user_id = await create_test_user()
  await simulate_swipe_interactions(user_id)
  preferences = await database_service.calculate_user_preferences(user_id)
  
  # Test affiliate tracking
  click_id = await record_test_affiliate_click(user_id)
  
  # Test analytics collection
  analytics = await database_service.get_user_analytics_summary(user_id)
  ```

- [ ] **Verify Data Integrity**
  - User preference calculations accurate
  - Affiliate attribution working
  - Analytics data consistent

**Expected Results:**
- All business operations functional
- Data relationships maintained
- Analytics producing meaningful results

### 3. Security Validation ✅

- [ ] **Test RLS Policy Enforcement**
  ```sql
  -- Test user isolation
  SET ROLE authenticated;
  SET request.jwt.claim.sub TO 'test-user-id';
  
  -- Should only return user's own data
  SELECT COUNT(*) FROM swipe_interactions;
  SELECT COUNT(*) FROM affiliate_clicks;
  SELECT COUNT(*) FROM user_preferences;
  ```

- [ ] **Test Service Role Access**
  ```sql
  SET ROLE service_role;
  
  -- Should access all data
  SELECT COUNT(*) FROM swipe_interactions;
  SELECT COUNT(*) FROM affiliate_clicks;
  ```

- [ ] **Test Anonymous User Support**
  ```sql
  SET ROLE anon;
  
  -- Should access public data only
  SELECT COUNT(*) FROM products WHERE is_active = true;
  SELECT COUNT(*) FROM categories WHERE is_active = true;
  ```

**Expected Results:**
- User data properly isolated
- Service role has full access
- Anonymous access restricted to public data

## Post-Deployment Monitoring

### 1. Immediate Monitoring (First 24 Hours) ✅

- [ ] **Query Performance Monitoring**
  ```sql
  -- Monitor query performance hourly
  SELECT 
    query, calls, total_time, mean_time,
    calls_per_hour,
    performance_grade
  FROM performance_monitoring_view
  ORDER BY total_time DESC
  LIMIT 20;
  ```

- [ ] **Error Rate Monitoring**
  - Monitor application error logs
  - Track database connection errors
  - Watch for RLS policy violations

- [ ] **Business Metrics Tracking**
  - User registration rates
  - Swipe interaction volumes
  - Affiliate click conversions

### 2. Ongoing Monitoring (First Week) ✅

- [ ] **Daily Performance Reviews**
  - Execute daily monitoring queries
  - Review slow query reports
  - Analyse index usage statistics

- [ ] **Capacity Planning**
  - Monitor database growth rates
  - Track connection usage patterns
  - Plan scaling requirements

- [ ] **User Experience Metrics**
  - API response time monitoring
  - User engagement analytics
  - Recommendation system performance

### 3. Long-term Optimisation (First Month) ✅

- [ ] **Performance Tuning**
  - Optimise identified slow queries
  - Adjust indexes based on usage patterns
  - Refine RLS policies for performance

- [ ] **Capacity Management**
  - Scale database resources as needed
  - Implement read replica if required
  - Plan data archival strategies

- [ ] **Feature Enhancement**
  - Implement advanced ML features
  - Add new business intelligence queries
  - Enhance monitoring dashboards

## Rollback Procedures

### 1. Emergency Rollback Plan ✅

**Critical Issue Detection:**
- Query performance degradation >300%
- Authentication system failures
- Data integrity violations
- RLS policy security breaches

**Immediate Actions:**
```sql
-- 1. Disable new features immediately
ALTER TABLE affiliate_clicks DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences DISABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback DISABLE ROW LEVEL SECURITY;

-- 2. Revert to original RLS policies
-- Execute: database/fix_rls_policies.sql (original version)

-- 3. Drop new tables if causing issues
-- Note: Only as absolute last resort
-- DROP TABLE IF EXISTS affiliate_clicks CASCADE;
-- DROP TABLE IF EXISTS user_preferences CASCADE;
-- DROP TABLE IF EXISTS session_analytics CASCADE;
-- DROP TABLE IF EXISTS product_views CASCADE;
-- DROP TABLE IF EXISTS recommendation_feedback CASCADE;
```

### 2. Partial Rollback Options ✅

**RLS Policy Rollback:**
```sql
-- Revert to simple RLS policies
DROP POLICY "Users view own affiliate clicks" ON affiliate_clicks;
CREATE POLICY "Simple user policy" ON affiliate_clicks
    FOR ALL USING (auth.uid() = user_id);
```

**Service Layer Rollback:**
- Revert database service to previous version
- Use feature flags to disable new functionality
- Fallback to mock data for recommendations

### 3. Recovery Procedures ✅

**Data Recovery:**
- Restore from backup if data corruption detected
- Re-run preference calculations if needed
- Rebuild indexes if performance issues persist

**Performance Recovery:**
- Revert to original indexes
- Disable expensive monitoring queries
- Reduce connection limits temporarily

## Success Criteria

### 1. Technical Success Metrics ✅

- [ ] **Performance**
  - 95th percentile query response time <200ms
  - Index usage ratio >75%
  - Zero critical security vulnerabilities

- [ ] **Reliability**
  - 99.9% database uptime
  - Zero data integrity issues
  - All RLS policies functioning correctly

- [ ] **Scalability**
  - Support 10x current user load
  - Database growth <20% of capacity
  - Connection pooling optimised

### 2. Business Success Metrics ✅

- [ ] **User Experience**
  - Recommendation accuracy improved
  - Page load times <2 seconds
  - Zero authentication failures

- [ ] **Revenue Tracking**
  - Affiliate attribution working 100%
  - Conversion tracking operational
  - Revenue reporting accurate

- [ ] **Analytics**
  - User behaviour insights available
  - Business intelligence dashboards functional
  - ML training data collection operational

## Final Deployment Sign-off

### Pre-Production Checklist ✅
- [ ] All migration scripts tested in staging
- [ ] Performance benchmarks met
- [ ] Security validation complete
- [ ] Monitoring systems operational
- [ ] Rollback procedures tested
- [ ] Team training completed

### Production Deployment Authorisation ✅
- [ ] **Database Administrator**: _________________ Date: _______
- [ ] **Lead Developer**: _______________________ Date: _______
- [ ] **DevOps Engineer**: ______________________ Date: _______
- [ ] **Product Owner**: ________________________ Date: _______

### Post-Deployment Confirmation ✅
- [ ] All systems operational
- [ ] Performance metrics within targets
- [ ] Business operations confirmed
- [ ] Monitoring alerts configured
- [ ] Documentation updated
- [ ] Team notified of completion

---

## Emergency Contacts

**Database Issues:**
- Database Administrator: [Contact Information]
- Supabase Support: support@supabase.io

**Application Issues:**
- Lead Developer: [Contact Information]
- DevOps Team: [Contact Information]

**Business Impact:**
- Product Owner: [Contact Information]
- CTO: [Contact Information]

---

**Deployment Status**: ⏳ Ready for Implementation  
**Next Review Date**: 7 days post-deployment  
**Documentation Version**: 2.0