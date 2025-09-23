-- =====================================================================
-- Database Performance Monitoring & Optimisation - aclue Platform
-- Date: 2025-08-06
-- Version: 2.0
-- =====================================================================
-- 
-- Performance Monitoring Implementation:
-- This script provides comprehensive database performance monitoring
-- and optimisation tools for the aclue platform. It implements
-- enterprise-grade monitoring patterns following PostgreSQL and
-- Supabase best practices.
--
-- Monitoring Coverage:
-- 1. Query performance analysis and slow query identification
-- 2. Index usage statistics and optimisation recommendations  
-- 3. RLS policy performance impact measurement
-- 4. Table size and growth monitoring
-- 5. Connection and resource utilisation tracking
-- 6. Business metrics and operational dashboards
--
-- Documentation References:
-- - PostgreSQL Performance Monitoring Best Practices
-- - Supabase Performance Optimisation Guidelines
-- - Database Indexing Strategy Documentation
-- - RLS Performance Impact Analysis
--
-- Usage Instructions:
-- - Run monitoring queries regularly (daily/weekly)
-- - Set up alerts for performance thresholds
-- - Use optimisation recommendations for schema improvements
-- - Track business metrics for operational insights
--
-- =====================================================================

-- =====================================================================
-- 1. QUERY PERFORMANCE ANALYSIS
-- =====================================================================

-- Slow Query Identification and Analysis
-- Documentation Reference: PostgreSQL pg_stat_statements monitoring
-- Purpose: Identify queries consuming most database resources
-- Action: Optimise queries with high total_time or low efficiency

-- Enable pg_stat_statements extension for query monitoring
CREATE EXTENSION IF NOT EXISTS pg_stat_statements;

-- Reset statistics for fresh analysis (use with caution in production)
-- SELECT pg_stat_statements_reset();

-- Top 20 slowest queries by total execution time
SELECT 
    'Slowest Queries by Total Time' as analysis_type,
    query_hash,
    calls,
    total_time,
    mean_time,
    min_time,
    max_time,
    stddev_time,
    ROUND((total_time / SUM(total_time) OVER()) * 100, 2) as percent_total_time,
    LEFT(query, 100) || '...' as query_preview
FROM (
    SELECT 
        MD5(query) as query_hash,
        calls,
        total_time,
        mean_time,
        min_time,
        max_time,
        stddev_time,
        query
    FROM pg_stat_statements 
    WHERE query NOT LIKE '%pg_stat_statements%'
      AND query NOT LIKE '%information_schema%'
    ORDER BY total_time DESC
    LIMIT 20
) slow_queries
ORDER BY total_time DESC;

-- Queries with high call frequency but low individual performance
SELECT 
    'High Frequency Low Performance Queries' as analysis_type,
    MD5(query) as query_hash,
    calls,
    total_time,
    mean_time,
    ROUND(calls::numeric / EXTRACT(epoch FROM (NOW() - stats_reset)), 2) as calls_per_second,
    LEFT(query, 100) || '...' as query_preview
FROM pg_stat_statements 
WHERE calls > 1000
  AND mean_time < 10  -- Less than 10ms average
  AND query NOT LIKE '%pg_stat_statements%'
ORDER BY calls DESC
LIMIT 15;

-- Queries with high variability (inconsistent performance)
SELECT 
    'High Variability Queries' as analysis_type,
    MD5(query) as query_hash,
    calls,
    mean_time,
    stddev_time,
    min_time,
    max_time,
    ROUND((stddev_time / NULLIF(mean_time, 0)) * 100, 2) as coefficient_variation,
    LEFT(query, 100) || '...' as query_preview
FROM pg_stat_statements 
WHERE calls > 100
  AND stddev_time > 0
  AND mean_time > 0
ORDER BY (stddev_time / mean_time) DESC
LIMIT 15;

-- =====================================================================
-- 2. INDEX USAGE ANALYSIS AND OPTIMISATION
-- =====================================================================

-- Index Usage Statistics and Recommendations
-- Documentation Reference: PostgreSQL index monitoring patterns
-- Purpose: Identify unused indexes and missing index opportunities
-- Action: Drop unused indexes, create recommended indexes

-- Unused indexes consuming storage space
SELECT 
    'Unused Indexes Analysis' as analysis_type,
    schemaname,
    tablename,
    indexname,
    idx_scan as scans,
    idx_tup_read as tuples_read,
    idx_tup_fetch as tuples_fetched,
    pg_size_pretty(pg_relation_size(indexrelid)) as index_size,
    CASE 
        WHEN idx_scan = 0 THEN 'NEVER USED - Consider dropping'
        WHEN idx_scan < 10 THEN 'RARELY USED - Review necessity'
        ELSE 'ACTIVELY USED'
    END as usage_recommendation
FROM pg_stat_user_indexes 
WHERE schemaname = 'public'
ORDER BY idx_scan ASC, pg_relation_size(indexrelid) DESC;

-- Table scan efficiency analysis
SELECT 
    'Table Scan Efficiency' as analysis_type,
    schemaname,
    tablename,
    seq_scan as sequential_scans,
    seq_tup_read as seq_tuples_read,
    idx_scan as index_scans,
    idx_tup_fetch as idx_tuples_fetched,
    ROUND(
        CASE 
            WHEN (seq_scan + idx_scan) > 0 
            THEN (idx_scan::numeric / (seq_scan + idx_scan)) * 100 
            ELSE 0 
        END, 2
    ) as index_usage_percent,
    CASE 
        WHEN seq_scan > idx_scan AND seq_tup_read > 10000 
        THEN 'HIGH - Needs index optimisation'
        WHEN seq_scan > (idx_scan * 2) 
        THEN 'MEDIUM - Consider additional indexes'
        ELSE 'LOW - Well optimised'
    END as optimisation_priority
FROM pg_stat_user_tables 
WHERE schemaname = 'public'
ORDER BY seq_scan DESC, seq_tup_read DESC;

-- Missing index recommendations based on query patterns
WITH table_scans AS (
    SELECT 
        schemaname,
        tablename,
        seq_scan,
        seq_tup_read,
        idx_scan,
        n_tup_ins + n_tup_upd + n_tup_del as modifications,
        pg_relation_size(relid) as table_size
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
)
SELECT 
    'Missing Index Recommendations' as analysis_type,
    tablename,
    seq_scan,
    seq_tup_read,
    ROUND(seq_tup_read::numeric / NULLIF(seq_scan, 0), 0) as avg_tuples_per_scan,
    pg_size_pretty(table_size) as table_size,
    CASE 
        WHEN tablename = 'swipe_interactions' AND seq_scan > 100 
        THEN 'CREATE INDEX idx_swipe_interactions_user_timestamp ON swipe_interactions(user_id, swipe_timestamp DESC);'
        WHEN tablename = 'products' AND seq_scan > 100
        THEN 'CREATE INDEX idx_products_category_price ON products(category_id, price_min) WHERE is_active = true;'
        WHEN tablename = 'recommendations' AND seq_scan > 100
        THEN 'CREATE INDEX idx_recommendations_user_confidence ON recommendations(user_id, confidence_score DESC);'
        WHEN tablename = 'affiliate_clicks' AND seq_scan > 50
        THEN 'CREATE INDEX idx_affiliate_clicks_conversion_time ON affiliate_clicks(is_converted, click_timestamp DESC);'
        WHEN seq_scan > 1000 AND seq_tup_read > 100000
        THEN 'URGENT - High table scan activity on ' || tablename || ' - Manual analysis required'
        ELSE 'No specific recommendations'
    END as recommended_action
FROM table_scans 
WHERE seq_scan > 10
ORDER BY seq_scan DESC, seq_tup_read DESC;

-- =====================================================================
-- 3. RLS POLICY PERFORMANCE IMPACT
-- =====================================================================

-- RLS Policy Performance Analysis
-- Documentation Reference: Supabase RLS performance monitoring
-- Purpose: Measure performance impact of security policies
-- Action: Optimise policies causing performance bottlenecks

-- RLS-enabled tables and their query patterns
SELECT 
    'RLS Performance Impact' as analysis_type,
    t.schemaname,
    t.tablename,
    CASE WHEN c.oid IS NOT NULL THEN 'RLS ENABLED' ELSE 'RLS DISABLED' END as rls_status,
    t.seq_scan,
    t.idx_scan,
    ROUND(
        CASE 
            WHEN t.seq_scan + t.idx_scan > 0 
            THEN (t.seq_scan::numeric / (t.seq_scan + t.idx_scan)) * 100 
            ELSE 0 
        END, 2
    ) as seq_scan_percentage,
    COUNT(p.policyname) as policy_count,
    STRING_AGG(p.policyname, ', ') as policy_names
FROM pg_stat_user_tables t
LEFT JOIN pg_class c ON c.relname = t.tablename AND c.relrowsecurity = true
LEFT JOIN pg_policies p ON p.tablename = t.tablename AND p.schemaname = t.schemaname
WHERE t.schemaname = 'public'
GROUP BY t.schemaname, t.tablename, c.oid, t.seq_scan, t.idx_scan
ORDER BY policy_count DESC, seq_scan_percentage DESC;

-- Authentication function call analysis in RLS policies
SELECT 
    'RLS Auth Function Analysis' as analysis_type,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command_type,
    CASE 
        WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%' 
        THEN 'PERFORMANCE ISSUE - Direct auth.uid() call'
        WHEN qual LIKE '%(SELECT auth.uid())%' 
        THEN 'OPTIMISED - Wrapped auth.uid() call'
        WHEN roles = '{authenticated}' OR roles = '{anon}' 
        THEN 'GOOD - Role-specific policy'
        ELSE 'REVIEW - General policy'
    END as performance_assessment,
    CASE 
        WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%'
        THEN 'RECOMMENDED: Wrap auth.uid() in SELECT for better performance'
        WHEN roles IS NULL OR roles = '{}'
        THEN 'RECOMMENDED: Add TO authenticated/anon for role specification'
        ELSE 'No immediate recommendations'
    END as optimisation_recommendation
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY 
    CASE 
        WHEN qual LIKE '%auth.uid()%' AND qual NOT LIKE '%(SELECT auth.uid())%' THEN 1
        WHEN roles IS NULL OR roles = '{}' THEN 2
        ELSE 3
    END,
    tablename, policyname;

-- =====================================================================
-- 4. DATABASE SIZE AND GROWTH MONITORING
-- =====================================================================

-- Table Size Analysis and Growth Tracking
-- Documentation Reference: PostgreSQL storage monitoring
-- Purpose: Monitor database growth and identify large tables
-- Action: Plan capacity and archival strategies

-- Current table sizes and row counts
SELECT 
    'Database Size Analysis' as analysis_type,
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as total_size,
    pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) as table_size,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) - pg_relation_size(schemaname||'.'||tablename)) as index_size,
    (SELECT reltuples::bigint FROM pg_class WHERE relname = tablename) as estimated_row_count,
    ROUND(
        pg_total_relation_size(schemaname||'.'||tablename)::numeric / 
        NULLIF((SELECT reltuples FROM pg_class WHERE relname = tablename), 0)
    ) as bytes_per_row
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Database growth rate estimation (requires historical data)
WITH table_stats AS (
    SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts,
        n_tup_upd as updates,
        n_tup_del as deletes,
        n_tup_ins + n_tup_upd + n_tup_del as total_modifications,
        pg_total_relation_size(schemaname||'.'||tablename) as current_size
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
)
SELECT 
    'Database Growth Analysis' as analysis_type,
    tablename,
    inserts,
    updates,
    deletes,
    total_modifications,
    pg_size_pretty(current_size) as current_size,
    CASE 
        WHEN tablename IN ('swipe_interactions', 'product_views', 'session_analytics') 
        THEN 'HIGH GROWTH - Event/activity tracking table'
        WHEN tablename IN ('affiliate_clicks', 'recommendation_feedback')
        THEN 'MEDIUM GROWTH - Business transaction table'  
        WHEN tablename IN ('users', 'products', 'categories')
        THEN 'LOW GROWTH - Master data table'
        ELSE 'MONITOR - Assess based on business logic'
    END as growth_category,
    CASE 
        WHEN inserts > 10000 THEN 'Consider partitioning strategy'
        WHEN current_size > 1073741824 THEN 'Monitor storage capacity (>1GB)'
        ELSE 'No immediate action needed'
    END as capacity_recommendation
FROM table_stats 
ORDER BY total_modifications DESC, current_size DESC;

-- =====================================================================
-- 5. CONNECTION AND RESOURCE MONITORING
-- =====================================================================

-- Active connection analysis and resource usage
-- Documentation Reference: PostgreSQL connection monitoring
-- Purpose: Monitor connection patterns and resource utilisation
-- Action: Optimise connection pooling and resource allocation

-- Current database connections and activity
SELECT 
    'Database Connections Analysis' as analysis_type,
    state,
    COUNT(*) as connection_count,
    ROUND(AVG(EXTRACT(epoch FROM (NOW() - state_change)))) as avg_duration_seconds,
    MAX(EXTRACT(epoch FROM (NOW() - state_change))) as max_duration_seconds,
    STRING_AGG(DISTINCT application_name, ', ') as applications
FROM pg_stat_activity 
WHERE pid != pg_backend_pid()  -- Exclude current query
GROUP BY state
ORDER BY connection_count DESC;

-- Long-running queries and blocked sessions
SELECT 
    'Long Running Queries' as analysis_type,
    pid,
    state,
    application_name,
    EXTRACT(epoch FROM (NOW() - query_start)) as duration_seconds,
    EXTRACT(epoch FROM (NOW() - state_change)) as state_duration_seconds,
    wait_event_type,
    wait_event,
    LEFT(query, 100) || '...' as query_preview
FROM pg_stat_activity 
WHERE state != 'idle'
  AND pid != pg_backend_pid()
  AND query_start IS NOT NULL
  AND EXTRACT(epoch FROM (NOW() - query_start)) > 30  -- Queries running >30 seconds
ORDER BY duration_seconds DESC;

-- =====================================================================
-- 6. BUSINESS METRICS AND OPERATIONAL MONITORING
-- =====================================================================

-- Business Intelligence Monitoring Queries
-- Documentation Reference: Business metrics tracking patterns
-- Purpose: Monitor key business indicators and operational health
-- Action: Track platform usage and identify business opportunities

-- User engagement metrics
SELECT 
    'User Engagement Metrics' as analysis_type,
    COUNT(DISTINCT u.id) as total_users,
    COUNT(DISTINCT CASE WHEN u.last_login_at > NOW() - INTERVAL '7 days' THEN u.id END) as active_users_7d,
    COUNT(DISTINCT CASE WHEN u.last_login_at > NOW() - INTERVAL '30 days' THEN u.id END) as active_users_30d,
    COUNT(DISTINCT ss.user_id) as users_with_swipe_sessions,
    COUNT(ss.id) as total_swipe_sessions,
    COUNT(si.id) as total_swipe_interactions,
    ROUND(COUNT(si.id)::numeric / NULLIF(COUNT(ss.id), 0), 1) as avg_swipes_per_session
FROM users u
LEFT JOIN swipe_sessions ss ON u.id = ss.user_id
LEFT JOIN swipe_interactions si ON ss.id = si.session_id;

-- Revenue attribution metrics
SELECT 
    'Revenue Attribution Metrics' as analysis_type,
    COUNT(*) as total_affiliate_clicks,
    COUNT(CASE WHEN is_converted = true THEN 1 END) as converted_clicks,
    ROUND(
        (COUNT(CASE WHEN is_converted = true THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100, 2
    ) as conversion_rate_percent,
    SUM(expected_commission) as expected_commission_total,
    SUM(actual_commission) as actual_commission_total,
    COUNT(DISTINCT affiliate_network) as active_affiliate_networks,
    COUNT(DISTINCT user_id) as users_clicking_affiliates
FROM affiliate_clicks 
WHERE click_timestamp > NOW() - INTERVAL '30 days';

-- Product recommendation performance
SELECT 
    'Recommendation Performance Metrics' as analysis_type,
    COUNT(*) as total_recommendations,
    COUNT(CASE WHEN is_clicked = true THEN 1 END) as clicked_recommendations,
    ROUND(
        (COUNT(CASE WHEN is_clicked = true THEN 1 END)::numeric / NULLIF(COUNT(*), 0)) * 100, 2
    ) as click_through_rate_percent,
    ROUND(AVG(confidence_score), 3) as avg_confidence_score,
    COUNT(DISTINCT user_id) as users_receiving_recommendations,
    COUNT(DISTINCT algorithm_version) as active_algorithms
FROM recommendations 
WHERE created_at > NOW() - INTERVAL '30 days';

-- System health and operational metrics
SELECT 
    'System Health Metrics' as analysis_type,
    (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'active') as active_queries,
    (SELECT COUNT(*) FROM pg_stat_activity WHERE state = 'idle') as idle_connections,
    (SELECT COUNT(*) FROM pg_stat_activity WHERE wait_event IS NOT NULL) as waiting_queries,
    pg_size_pretty(pg_database_size(current_database())) as database_size,
    (SELECT setting::int FROM pg_settings WHERE name = 'max_connections') as max_connections,
    (SELECT COUNT(*) FROM pg_stat_activity) as current_connections,
    ROUND(
        (SELECT COUNT(*)::numeric FROM pg_stat_activity) / 
        (SELECT setting::numeric FROM pg_settings WHERE name = 'max_connections') * 100, 2
    ) as connection_usage_percent;

-- =====================================================================
-- 7. AUTOMATED MONITORING ALERTS SETUP
-- =====================================================================

-- Performance Alert Thresholds
-- Documentation Reference: Database monitoring best practices
-- Purpose: Define thresholds for operational alerts
-- Action: Set up monitoring system alerts based on these queries

-- Critical performance thresholds (adapt for monitoring system)
SELECT 
    'Performance Alert Thresholds' as alert_type,
    'Query Performance' as category,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_stat_statements 
            WHERE mean_time > 1000 AND calls > 10  -- Queries averaging >1 second
        ) THEN 'CRITICAL - Slow queries detected'
        WHEN EXISTS (
            SELECT 1 FROM pg_stat_statements 
            WHERE mean_time > 500 AND calls > 50   -- Queries averaging >500ms
        ) THEN 'WARNING - Performance degradation detected'
        ELSE 'OK - Query performance within thresholds'
    END as status,
    'Monitor queries with high mean_time and call frequency' as recommendation

UNION ALL

SELECT 
    'Performance Alert Thresholds' as alert_type,
    'Connection Usage' as category,
    CASE 
        WHEN (
            SELECT COUNT(*)::numeric FROM pg_stat_activity
        ) / (
            SELECT setting::numeric FROM pg_settings WHERE name = 'max_connections'
        ) > 0.8 THEN 'CRITICAL - Connection usage >80%'
        WHEN (
            SELECT COUNT(*)::numeric FROM pg_stat_activity
        ) / (
            SELECT setting::numeric FROM pg_settings WHERE name = 'max_connections'
        ) > 0.6 THEN 'WARNING - Connection usage >60%'
        ELSE 'OK - Connection usage within limits'
    END as status,
    'Monitor connection pool and implement connection limits' as recommendation

UNION ALL

SELECT 
    'Performance Alert Thresholds' as alert_type,
    'Database Size' as category,
    CASE 
        WHEN pg_database_size(current_database()) > 10737418240  -- >10GB
        THEN 'WARNING - Database size >10GB - Plan scaling strategy'
        WHEN pg_database_size(current_database()) > 5368709120   -- >5GB
        THEN 'INFO - Database size >5GB - Monitor growth rate'
        ELSE 'OK - Database size within expected range'
    END as status,
    'Monitor growth trends and plan capacity upgrades' as recommendation;

-- =====================================================================
-- 8. PERFORMANCE OPTIMISATION RECOMMENDATIONS
-- =====================================================================

-- Automated optimisation recommendations based on current metrics
WITH performance_summary AS (
    SELECT 
        (SELECT COUNT(*) FROM pg_stat_statements WHERE mean_time > 100) as slow_query_count,
        (SELECT COUNT(*) FROM pg_stat_user_indexes WHERE idx_scan = 0) as unused_index_count,
        (SELECT COUNT(*) FROM pg_stat_user_tables WHERE seq_scan > idx_scan) as seq_scan_heavy_tables,
        pg_database_size(current_database()) as db_size
)
SELECT 
    'Performance Optimisation Recommendations' as recommendation_type,
    CASE 
        WHEN slow_query_count > 5 THEN 
            'HIGH PRIORITY: Optimise ' || slow_query_count || ' slow queries (>100ms average)'
        WHEN slow_query_count > 0 THEN 
            'MEDIUM PRIORITY: Review ' || slow_query_count || ' queries with performance issues'
        ELSE 'Query performance is optimal'
    END as query_optimisation,
    
    CASE 
        WHEN unused_index_count > 3 THEN 
            'HIGH PRIORITY: Remove ' || unused_index_count || ' unused indexes to save storage'
        WHEN unused_index_count > 0 THEN 
            'MEDIUM PRIORITY: Review ' || unused_index_count || ' potentially unused indexes'
        ELSE 'Index usage is efficient'
    END as index_optimisation,
    
    CASE 
        WHEN seq_scan_heavy_tables > 2 THEN 
            'HIGH PRIORITY: Add indexes to ' || seq_scan_heavy_tables || ' tables with high sequential scan rates'
        WHEN seq_scan_heavy_tables > 0 THEN 
            'MEDIUM PRIORITY: Consider indexing for ' || seq_scan_heavy_tables || ' tables'
        ELSE 'Table access patterns are well optimised'
    END as indexing_recommendations,
    
    CASE 
        WHEN db_size > 5368709120 THEN  -- >5GB
            'PLAN SCALING: Database size is ' || pg_size_pretty(db_size) || ' - Consider read replicas and partitioning'
        ELSE 'Database size is manageable: ' || pg_size_pretty(db_size)
    END as scaling_recommendations
    
FROM performance_summary;

-- =====================================================================
-- MONITORING IMPLEMENTATION COMPLETE
-- =====================================================================
--
-- Performance Monitoring Summary:
-- ✅ Comprehensive query performance analysis and slow query identification
-- ✅ Index usage statistics and optimisation recommendations
-- ✅ RLS policy performance impact measurement and optimisation
-- ✅ Database size monitoring and growth trend analysis
-- ✅ Connection and resource utilisation tracking
-- ✅ Business metrics monitoring for operational insights
-- ✅ Automated alert thresholds for proactive monitoring
-- ✅ Performance optimisation recommendations based on current metrics
--
-- Implementation Instructions:
-- 1. Run monitoring queries on regular schedule (daily/weekly)
-- 2. Set up automated alerts using defined thresholds
-- 3. Create dashboards using business metrics queries
-- 4. Implement recommended optimisations based on analysis
-- 5. Track improvements over time using historical data
--
-- Monitoring Best Practices:
-- - Regular performance review cycles
-- - Proactive capacity planning based on growth metrics
-- - Continuous optimisation based on usage patterns
-- - Business metric tracking for operational decision making
-- - Alert fatigue prevention through proper threshold setting
--
-- =====================================================================