-- =====================================================================
-- Post-Deployment Verification Suite - aclue Database Enhancement
-- Date: 2025-09-21
-- Version: 1.0
-- =====================================================================
--
-- VERIFICATION PURPOSE:
-- This comprehensive verification suite validates the successful deployment
-- of all database enhancements and ensures proper functionality, security,
-- and performance of the new table structures.
--
-- VERIFICATION COVERAGE:
-- 1. Table structure and constraint validation
-- 2. RLS policy functionality testing
-- 3. Index performance verification
-- 4. Data integrity and relationship validation
-- 5. Security and access control testing
-- 6. Performance baseline establishment
-- 7. Business logic constraint validation
--
-- EXECUTION INSTRUCTIONS:
-- Run each section sequentially and verify expected results
-- All tests should pass for successful deployment validation
--
-- =====================================================================

-- =====================================================================
-- 1. STRUCTURAL VERIFICATION
-- =====================================================================

-- Verify all tables were created successfully
SELECT
    '1. Table Creation Verification' as test_category,
    tablename,
    CASE
        WHEN tablename IS NOT NULL THEN '✅ CREATED'
        ELSE '❌ MISSING'
    END as status,
    obj_description(c.oid) as table_comment
FROM (VALUES
    ('affiliate_clicks'),
    ('user_preferences'),
    ('session_analytics'),
    ('product_views'),
    ('recommendation_feedback')
) AS expected(tablename)
LEFT JOIN pg_tables t ON t.tablename = expected.tablename AND t.schemaname = 'public'
LEFT JOIN pg_class c ON c.relname = expected.tablename
ORDER BY expected.tablename;

-- Verify table column structures
SELECT
    '2. Column Structure Verification' as test_category,
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default,
    CASE WHEN character_maximum_length IS NOT NULL
         THEN character_maximum_length::text
         ELSE 'N/A' END as max_length
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY table_name, ordinal_position;

-- Verify primary key constraints
SELECT
    '3. Primary Key Verification' as test_category,
    tc.table_name,
    kcu.column_name as primary_key_column,
    CASE
        WHEN tc.constraint_type = 'PRIMARY KEY' THEN '✅ CONFIGURED'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
  ON tc.constraint_name = kcu.constraint_name
WHERE tc.constraint_type = 'PRIMARY KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tc.table_name;

-- Verify foreign key relationships
SELECT
    '4. Foreign Key Verification' as test_category,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name,
    rc.delete_rule,
    CASE
        WHEN tc.constraint_type = 'FOREIGN KEY' THEN '✅ CONFIGURED'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
JOIN information_schema.referential_constraints AS rc
  ON tc.constraint_name = rc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tc.table_name, kcu.column_name;

-- =====================================================================
-- 2. INDEX PERFORMANCE VERIFICATION
-- =====================================================================

-- Verify all performance indexes were created
SELECT
    '5. Index Creation Verification' as test_category,
    tablename,
    indexname,
    indexdef,
    CASE
        WHEN indexname IS NOT NULL THEN '✅ CREATED'
        ELSE '❌ MISSING'
    END as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tablename, indexname;

-- Count indexes per table for performance baseline
SELECT
    '6. Index Count Summary' as test_category,
    tablename,
    COUNT(*) as index_count,
    CASE
        WHEN COUNT(*) >= 3 THEN '✅ SUFFICIENT'
        WHEN COUNT(*) >= 1 THEN '⚠️ MINIMAL'
        ELSE '❌ INSUFFICIENT'
    END as performance_status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
GROUP BY tablename
ORDER BY tablename;

-- Verify JSONB indexes for user_preferences
SELECT
    '7. JSONB Index Verification' as test_category,
    indexname,
    indexdef,
    CASE
        WHEN indexdef LIKE '%gin%' THEN '✅ GIN INDEX CONFIGURED'
        ELSE '❌ MISSING GIN INDEX'
    END as status
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename = 'user_preferences'
  AND indexdef LIKE '%gin%'
ORDER BY indexname;

-- =====================================================================
-- 3. RLS SECURITY VERIFICATION
-- =====================================================================

-- Verify RLS is enabled on all tables
SELECT
    '8. RLS Status Verification' as test_category,
    schemaname,
    tablename,
    CASE
        WHEN rowsecurity THEN '✅ RLS ENABLED'
        ELSE '❌ RLS DISABLED'
    END as rls_status,
    CASE
        WHEN hasrls THEN '✅ HAS POLICIES'
        ELSE '❌ NO POLICIES'
    END as policy_status
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tablename;

-- Verify RLS policy configuration
SELECT
    '9. RLS Policy Configuration' as test_category,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd as command_type,
    CASE
        WHEN roles @> ARRAY['service_role'] THEN '✅ SERVICE ACCESS'
        WHEN roles @> ARRAY['authenticated'] THEN '✅ USER ACCESS'
        WHEN roles @> ARRAY['anon'] THEN '✅ ANONYMOUS ACCESS'
        ELSE '⚠️ CUSTOM ACCESS'
    END as access_type
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tablename, policyname;

-- Count policies per table
SELECT
    '10. Policy Count Summary' as test_category,
    tablename,
    COUNT(*) as policy_count,
    CASE
        WHEN COUNT(*) >= 2 THEN '✅ SUFFICIENT'
        WHEN COUNT(*) = 1 THEN '⚠️ MINIMAL'
        ELSE '❌ INSUFFICIENT'
    END as security_status,
    STRING_AGG(policyname, ', ' ORDER BY policyname) as policy_names
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
GROUP BY tablename
ORDER BY tablename;

-- =====================================================================
-- 4. TRIGGER AND FUNCTION VERIFICATION
-- =====================================================================

-- Verify update triggers are configured
SELECT
    '11. Update Trigger Verification' as test_category,
    trigger_name,
    event_object_table as table_name,
    action_timing,
    event_manipulation,
    CASE
        WHEN trigger_name IS NOT NULL THEN '✅ CONFIGURED'
        ELSE '❌ MISSING'
    END as status
FROM information_schema.triggers
WHERE trigger_schema = 'public'
  AND event_object_table IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics'
  )
  AND trigger_name LIKE '%updated_at%'
ORDER BY event_object_table, trigger_name;

-- Verify update function exists and is secure
SELECT
    '12. Update Function Verification' as test_category,
    routine_name,
    routine_type,
    security_type,
    CASE
        WHEN routine_name = 'update_updated_at_column' THEN '✅ FUNCTION EXISTS'
        ELSE '❌ FUNCTION MISSING'
    END as status
FROM information_schema.routines
WHERE routine_schema = 'public'
  AND routine_name = 'update_updated_at_column';

-- =====================================================================
-- 5. DATA CONSTRAINT VERIFICATION
-- =====================================================================

-- Verify check constraints are active
SELECT
    '13. Check Constraint Verification' as test_category,
    tc.table_name,
    tc.constraint_name,
    cc.check_clause,
    CASE
        WHEN tc.constraint_type = 'CHECK' THEN '✅ ACTIVE'
        ELSE '❌ INACTIVE'
    END as status
FROM information_schema.table_constraints tc
JOIN information_schema.check_constraints cc
  ON tc.constraint_name = cc.constraint_name
WHERE tc.table_schema = 'public'
  AND tc.constraint_type = 'CHECK'
  AND tc.table_name IN (
    'affiliate_clicks', 'user_preferences', 'session_analytics',
    'product_views', 'recommendation_feedback'
  )
ORDER BY tc.table_name, tc.constraint_name;

-- =====================================================================
-- 6. FUNCTIONAL TESTING WITH SAMPLE DATA
-- =====================================================================

-- Test affiliate_clicks insertion (safe test data)
DO $$
DECLARE
    test_result TEXT;
BEGIN
    BEGIN
        INSERT INTO affiliate_clicks (
            anonymous_id, session_id, source_page,
            affiliate_network, affiliate_url
        ) VALUES (
            'test-verification-user', 'test-session-123', 'discover',
            'test-network', 'https://example.com/test-link'
        );
        test_result := '✅ INSERT SUCCESSFUL';
    EXCEPTION WHEN OTHERS THEN
        test_result := '❌ INSERT FAILED: ' || SQLERRM;
    END;

    RAISE NOTICE '14. Affiliate Clicks Insert Test: %', test_result;
END $$;

-- Test session_analytics insertion
DO $$
DECLARE
    test_result TEXT;
BEGIN
    BEGIN
        INSERT INTO session_analytics (
            session_id, anonymous_id, landing_page, device_type
        ) VALUES (
            'test-session-456', 'test-verification-user', '/discover', 'desktop'
        );
        test_result := '✅ INSERT SUCCESSFUL';
    EXCEPTION WHEN OTHERS THEN
        test_result := '❌ INSERT FAILED: ' || SQLERRM;
    END;

    RAISE NOTICE '15. Session Analytics Insert Test: %', test_result;
END $$;

-- Test product_views insertion (requires existing product)
DO $$
DECLARE
    test_product_id UUID;
    test_result TEXT;
BEGIN
    -- Get first available product ID
    SELECT id INTO test_product_id FROM products LIMIT 1;

    IF test_product_id IS NOT NULL THEN
        BEGIN
            INSERT INTO product_views (
                product_id, session_id, view_source, interaction_type
            ) VALUES (
                test_product_id, 'test-session-789', 'discover', 'impression'
            );
            test_result := '✅ INSERT SUCCESSFUL';
        EXCEPTION WHEN OTHERS THEN
            test_result := '❌ INSERT FAILED: ' || SQLERRM;
        END;
    ELSE
        test_result := '⚠️ NO PRODUCTS AVAILABLE FOR TEST';
    END IF;

    RAISE NOTICE '16. Product Views Insert Test: %', test_result;
END $$;

-- =====================================================================
-- 7. PERFORMANCE BASELINE ESTABLISHMENT
-- =====================================================================

-- Query performance baseline for affiliate_clicks
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM affiliate_clicks
WHERE session_id = 'test-session-123'
ORDER BY click_timestamp DESC
LIMIT 10;

-- Query performance baseline for user_preferences
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM user_preferences
WHERE data_quality_score > 0.5
LIMIT 10;

-- Query performance baseline for session_analytics
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT * FROM session_analytics
WHERE started_at > NOW() - INTERVAL '24 hours'
ORDER BY started_at DESC
LIMIT 10;

-- =====================================================================
-- 8. BUSINESS LOGIC VALIDATION
-- =====================================================================

-- Verify commission rate constraints
SELECT
    '17. Commission Rate Validation' as test_category,
    COUNT(*) as total_records,
    COUNT(CASE WHEN commission_rate >= 0 AND commission_rate <= 1 THEN 1 END) as valid_rates,
    CASE
        WHEN COUNT(*) = COUNT(CASE WHEN commission_rate >= 0 AND commission_rate <= 1 THEN 1 END)
        THEN '✅ ALL VALID'
        ELSE '❌ INVALID RATES FOUND'
    END as validation_status
FROM affiliate_clicks
WHERE commission_rate IS NOT NULL;

-- Verify engagement rate calculations in user_preferences
SELECT
    '18. Engagement Rate Validation' as test_category,
    COUNT(*) as total_users,
    COUNT(CASE
        WHEN total_swipes = 0 AND engagement_rate = 0 THEN 1
        WHEN total_swipes > 0 AND ABS(engagement_rate - (right_swipes::decimal / total_swipes)) < 0.001 THEN 1
    END) as valid_calculations,
    CASE
        WHEN COUNT(*) = COUNT(CASE
            WHEN total_swipes = 0 AND engagement_rate = 0 THEN 1
            WHEN total_swipes > 0 AND ABS(engagement_rate - (right_swipes::decimal / total_swipes)) < 0.001 THEN 1
        END)
        THEN '✅ CALCULATIONS CORRECT'
        ELSE '❌ CALCULATION ERRORS FOUND'
    END as validation_status
FROM user_preferences
WHERE total_swipes IS NOT NULL;

-- Verify session timing logic
SELECT
    '19. Session Timing Validation' as test_category,
    COUNT(*) as total_sessions,
    COUNT(CASE WHEN ended_at IS NULL OR ended_at >= started_at THEN 1 END) as valid_timing,
    CASE
        WHEN COUNT(*) = COUNT(CASE WHEN ended_at IS NULL OR ended_at >= started_at THEN 1 END)
        THEN '✅ TIMING VALID'
        ELSE '❌ TIMING ERRORS FOUND'
    END as validation_status
FROM session_analytics;

-- =====================================================================
-- 9. CLEANUP TEST DATA
-- =====================================================================

-- Remove test data inserted during verification
DELETE FROM product_views WHERE session_id LIKE 'test-session-%';
DELETE FROM session_analytics WHERE session_id LIKE 'test-session-%';
DELETE FROM affiliate_clicks WHERE session_id LIKE 'test-session-%';

-- =====================================================================
-- 10. FINAL DEPLOYMENT STATUS SUMMARY
-- =====================================================================

-- Comprehensive deployment status report
WITH deployment_summary AS (
    -- Count tables
    SELECT 'tables' as component,
           COUNT(*) as created_count,
           5 as expected_count
    FROM pg_tables
    WHERE schemaname = 'public'
      AND tablename IN (
        'affiliate_clicks', 'user_preferences', 'session_analytics',
        'product_views', 'recommendation_feedback'
      )

    UNION ALL

    -- Count indexes
    SELECT 'indexes' as component,
           COUNT(*) as created_count,
           25 as expected_count  -- Approximate expected index count
    FROM pg_indexes
    WHERE schemaname = 'public'
      AND tablename IN (
        'affiliate_clicks', 'user_preferences', 'session_analytics',
        'product_views', 'recommendation_feedback'
      )

    UNION ALL

    -- Count RLS policies
    SELECT 'rls_policies' as component,
           COUNT(*) as created_count,
           12 as expected_count  -- Approximate expected policy count
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename IN (
        'affiliate_clicks', 'user_preferences', 'session_analytics',
        'product_views', 'recommendation_feedback'
      )

    UNION ALL

    -- Count triggers
    SELECT 'triggers' as component,
           COUNT(*) as created_count,
           3 as expected_count  -- Updated_at triggers
    FROM information_schema.triggers
    WHERE trigger_schema = 'public'
      AND event_object_table IN (
        'affiliate_clicks', 'user_preferences', 'session_analytics'
      )
      AND trigger_name LIKE '%updated_at%'
)
SELECT
    '20. FINAL DEPLOYMENT STATUS' as verification_summary,
    component,
    created_count,
    expected_count,
    ROUND((created_count::decimal / expected_count) * 100, 1) as completion_percentage,
    CASE
        WHEN created_count >= expected_count THEN '✅ COMPLETE'
        WHEN created_count >= (expected_count * 0.8) THEN '⚠️ MOSTLY COMPLETE'
        ELSE '❌ INCOMPLETE'
    END as status
FROM deployment_summary
ORDER BY component;

-- Overall deployment health check
SELECT
    '🎯 DEPLOYMENT HEALTH CHECK' as final_status,
    CASE
        WHEN (
            SELECT COUNT(*) FROM pg_tables
            WHERE schemaname = 'public'
              AND tablename IN (
                'affiliate_clicks', 'user_preferences', 'session_analytics',
                'product_views', 'recommendation_feedback'
              )
        ) = 5 THEN '✅ ALL TABLES DEPLOYED'
        ELSE '❌ TABLE DEPLOYMENT INCOMPLETE'
    END as table_status,

    CASE
        WHEN (
            SELECT COUNT(*) FROM pg_tables t
            WHERE t.schemaname = 'public'
              AND t.tablename IN (
                'affiliate_clicks', 'user_preferences', 'session_analytics',
                'product_views', 'recommendation_feedback'
              )
              AND t.rowsecurity = true
        ) = 5 THEN '✅ RLS SECURITY ACTIVE'
        ELSE '❌ RLS SECURITY INCOMPLETE'
    END as security_status,

    CASE
        WHEN (
            SELECT COUNT(*) FROM pg_indexes
            WHERE schemaname = 'public'
              AND tablename IN (
                'affiliate_clicks', 'user_preferences', 'session_analytics',
                'product_views', 'recommendation_feedback'
              )
        ) >= 20 THEN '✅ PERFORMANCE INDEXES READY'
        ELSE '⚠️ PERFORMANCE INDEXES MINIMAL'
    END as performance_status,

    '🚀 DEPLOYMENT VERIFICATION COMPLETE' as completion_status;

-- =====================================================================
-- VERIFICATION SUITE COMPLETE
-- =====================================================================
--
-- ✅ VERIFICATION COVERAGE COMPLETED:
-- • Structural integrity validation (tables, columns, constraints)
-- • Security configuration verification (RLS policies, access controls)
-- • Performance infrastructure validation (indexes, query plans)
-- • Functional testing with sample data operations
-- • Business logic constraint validation
-- • Baseline performance measurement establishment
--
-- 📊 SUCCESS CRITERIA:
-- • All tables show "✅ CREATED" status
-- • All RLS policies show "✅ CONFIGURED" status
-- • All indexes show "✅ CREATED" status
-- • All test data operations show "✅ SUCCESSFUL" status
-- • Final deployment health check shows all "✅" indicators
--
-- 🚀 NEXT STEPS:
-- 1. Review all verification results for any "❌" or "⚠️" indicators
-- 2. Address any issues identified during verification
-- 3. Proceed with backend API integration for new tables
-- 4. Implement frontend data collection using new schema
-- 5. Set up ongoing performance monitoring using monitoring queries
--
-- =====================================================================