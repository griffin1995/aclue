-- =====================================================================
-- Aclue Database Migration: Create Missing Critical Tables
-- Date: 2025-08-06
-- Version: 2.0
-- =====================================================================
-- 
-- Migration Overview:
-- This migration creates critical missing tables identified in the database audit.
-- These tables are required for core functionality including affiliate tracking,
-- user preference aggregation, and analytics collection.
--
-- Tables Created:
-- 1. affiliate_clicks - Track affiliate link clicks and conversions
-- 2. user_preferences - Aggregated user preference profiles for ML
-- 3. session_analytics - User session behaviour tracking
-- 4. product_views - Product engagement metrics
-- 5. recommendation_feedback - ML training data from user feedback
--
-- Design Patterns Applied:
-- - Normalised schema design for data integrity
-- - JSONB fields for flexible schema evolution
-- - Proper indexing for query performance
-- - Row Level Security (RLS) for data isolation
-- - Audit fields for compliance tracking
--
-- =====================================================================

-- Enable required extensions if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search optimisation

-- =====================================================================
-- 1. AFFILIATE CLICKS TABLE
-- =====================================================================
-- Purpose: Track all affiliate link clicks for revenue attribution
-- Business Logic: Each click generates a tracking record that can be
-- matched with purchases for commission calculation
-- 
-- Design Decision: Using session_id as TEXT to support both authenticated
-- and anonymous users, enabling pre-registration tracking
--
-- Performance Optimisation: Indexes on user_id, product_id, and timestamp
-- for efficient query patterns in analytics dashboards

CREATE TABLE IF NOT EXISTS affiliate_clicks (
    -- Primary identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- User tracking (nullable for anonymous users)
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    anonymous_id TEXT, -- For tracking pre-registration users
    
    -- Product and session tracking
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    session_id TEXT NOT NULL, -- Browser session identifier
    
    -- Click details
    click_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    source_page TEXT, -- Where the click originated ('discover', 'recommendations', etc.)
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    
    -- Affiliate network details
    affiliate_network TEXT NOT NULL, -- 'amazon', 'commission_junction', etc.
    affiliate_url TEXT NOT NULL, -- Full redirect URL with tracking parameters
    commission_rate DECIMAL(5,4), -- Expected commission rate (0.0000 to 1.0000)
    expected_commission DECIMAL(10,2), -- Expected commission in currency
    
    -- Conversion tracking
    is_converted BOOLEAN DEFAULT false,
    conversion_timestamp TIMESTAMP WITH TIME ZONE,
    actual_commission DECIMAL(10,2), -- Actual commission received
    order_id TEXT, -- External order ID from affiliate network
    
    -- Analytics metadata
    user_agent TEXT,
    ip_address INET,
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for affiliate_clicks
CREATE INDEX idx_affiliate_clicks_user_id ON affiliate_clicks(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_affiliate_clicks_product_id ON affiliate_clicks(product_id);
CREATE INDEX idx_affiliate_clicks_timestamp ON affiliate_clicks(click_timestamp DESC);
CREATE INDEX idx_affiliate_clicks_conversion ON affiliate_clicks(is_converted, conversion_timestamp) WHERE is_converted = true;
CREATE INDEX idx_affiliate_clicks_session ON affiliate_clicks(session_id);
CREATE INDEX idx_affiliate_clicks_anonymous ON affiliate_clicks(anonymous_id) WHERE anonymous_id IS NOT NULL;

-- Add comments for documentation
COMMENT ON TABLE affiliate_clicks IS 'Tracks all affiliate link clicks for revenue attribution and conversion tracking';
COMMENT ON COLUMN affiliate_clicks.anonymous_id IS 'Tracks pre-registration users via browser fingerprint or cookie';
COMMENT ON COLUMN affiliate_clicks.commission_rate IS 'Decimal rate where 0.05 = 5% commission';

-- =====================================================================
-- 2. USER PREFERENCES TABLE
-- =====================================================================
-- Purpose: Aggregated user preferences for ML recommendation engine
-- Business Logic: Calculated from swipe interactions and user behaviour,
-- updated periodically by background jobs
--
-- Design Decision: Using JSONB for flexible preference storage allows
-- schema evolution without migrations as ML models evolve
--
-- Performance: Primary key on user_id ensures single row per user,
-- JSONB indexes enable efficient querying of nested preferences

CREATE TABLE IF NOT EXISTS user_preferences (
    -- User identification (one row per user)
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Category preferences (calculated from swipe data)
    -- Structure: {"electronics": 0.8, "fashion": 0.6, "books": 0.3}
    category_preferences JSONB DEFAULT '{}',
    category_confidence JSONB DEFAULT '{}', -- Confidence scores for each category
    
    -- Price preferences
    -- Structure: {"min": 1000, "max": 10000, "sweet_spot": 5000, "currency": "GBP"}
    price_range JSONB DEFAULT '{}',
    
    -- Brand affinities
    liked_brands TEXT[] DEFAULT '{}',
    disliked_brands TEXT[] DEFAULT '{}',
    brand_scores JSONB DEFAULT '{}', -- {"apple": 0.9, "samsung": 0.7}
    
    -- Style and aesthetic preferences
    -- Structure: {"modern": 0.8, "vintage": 0.2, "minimalist": 0.6}
    style_scores JSONB DEFAULT '{}',
    
    -- Occasion preferences
    -- Structure: {"birthday": 0.7, "christmas": 0.9, "anniversary": 0.5}
    occasion_preferences JSONB DEFAULT '{}',
    
    -- Behavioural metrics
    total_swipes INTEGER DEFAULT 0,
    right_swipes INTEGER DEFAULT 0,
    left_swipes INTEGER DEFAULT 0,
    super_likes INTEGER DEFAULT 0,
    engagement_rate DECIMAL(5,4) DEFAULT 0.0, -- right_swipes / total_swipes
    
    -- ML model features
    -- Flexible structure for model-specific features
    ml_features JSONB DEFAULT '{}',
    embedding_vector FLOAT[], -- User embedding for neural networks
    cluster_id INTEGER, -- User cluster for collaborative filtering
    
    -- Calculation metadata
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    calculation_version TEXT DEFAULT 'v1.0',
    data_quality_score DECIMAL(3,2) DEFAULT 0.0, -- 0.00 to 1.00
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for user_preferences
CREATE INDEX idx_user_preferences_calculated ON user_preferences(last_calculated DESC);
CREATE INDEX idx_user_preferences_quality ON user_preferences(data_quality_score) WHERE data_quality_score > 0.5;
CREATE INDEX idx_user_preferences_cluster ON user_preferences(cluster_id) WHERE cluster_id IS NOT NULL;

-- JSONB indexes for efficient querying
CREATE INDEX idx_user_pref_categories ON user_preferences USING gin(category_preferences);
CREATE INDEX idx_user_pref_brands ON user_preferences USING gin(brand_scores);

-- Add comments
COMMENT ON TABLE user_preferences IS 'Aggregated user preferences calculated from behaviour for ML recommendations';
COMMENT ON COLUMN user_preferences.ml_features IS 'Flexible JSON storage for evolving ML model features';
COMMENT ON COLUMN user_preferences.embedding_vector IS 'Dense vector representation for neural network models';

-- =====================================================================
-- 3. SESSION ANALYTICS TABLE
-- =====================================================================
-- Purpose: Track user session behaviour for analytics and optimisation
-- Business Logic: Captures complete user journey through the application
-- for funnel analysis and conversion optimisation
--
-- Design Decision: Separate from swipe_sessions to track all user activity,
-- not just swipe-specific sessions

CREATE TABLE IF NOT EXISTS session_analytics (
    -- Session identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id TEXT NOT NULL UNIQUE, -- Browser session identifier
    
    -- User tracking
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    anonymous_id TEXT, -- For pre-registration tracking
    
    -- Session timing
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    ended_at TIMESTAMP WITH TIME ZONE,
    duration_seconds INTEGER,
    last_activity_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Page tracking
    landing_page TEXT,
    exit_page TEXT,
    pages_viewed INTEGER DEFAULT 1,
    page_sequence TEXT[], -- Ordered list of pages visited
    
    -- Interaction metrics
    total_clicks INTEGER DEFAULT 0,
    total_swipes INTEGER DEFAULT 0,
    products_viewed INTEGER DEFAULT 0,
    recommendations_viewed INTEGER DEFAULT 0,
    affiliate_clicks INTEGER DEFAULT 0,
    
    -- Conversion tracking
    has_registered BOOLEAN DEFAULT false,
    registration_timestamp TIMESTAMP WITH TIME ZONE,
    has_converted BOOLEAN DEFAULT false,
    conversion_timestamp TIMESTAMP WITH TIME ZONE,
    conversion_value DECIMAL(10,2),
    
    -- Device and location
    device_type TEXT, -- 'mobile', 'tablet', 'desktop'
    browser TEXT,
    os TEXT,
    screen_resolution TEXT,
    country_code TEXT,
    city TEXT,
    
    -- Traffic source
    referrer_url TEXT,
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    utm_content TEXT,
    utm_term TEXT,
    
    -- Session metadata
    is_bounce BOOLEAN DEFAULT false, -- Single page visit
    is_active BOOLEAN DEFAULT true,
    session_quality_score DECIMAL(3,2), -- ML-calculated quality score
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for session_analytics
CREATE INDEX idx_session_analytics_session_id ON session_analytics(session_id);
CREATE INDEX idx_session_analytics_user_id ON session_analytics(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_session_analytics_anonymous ON session_analytics(anonymous_id) WHERE anonymous_id IS NOT NULL;
CREATE INDEX idx_session_analytics_started ON session_analytics(started_at DESC);
CREATE INDEX idx_session_analytics_conversion ON session_analytics(has_converted, conversion_timestamp) WHERE has_converted = true;
CREATE INDEX idx_session_analytics_active ON session_analytics(is_active, last_activity_at DESC) WHERE is_active = true;

-- Add comments
COMMENT ON TABLE session_analytics IS 'Comprehensive session tracking for user behaviour analytics';
COMMENT ON COLUMN session_analytics.page_sequence IS 'Ordered array of page paths for funnel analysis';

-- =====================================================================
-- 4. PRODUCT VIEWS TABLE
-- =====================================================================
-- Purpose: Track individual product view events for engagement metrics
-- Business Logic: Records every product impression and interaction for
-- popularity algorithms and recommendation feedback
--
-- Design Decision: Separate table for views allows high-volume writes
-- without affecting product table performance

CREATE TABLE IF NOT EXISTS product_views (
    -- View identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core relationships
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    session_id TEXT NOT NULL,
    
    -- View context
    view_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    view_source TEXT NOT NULL, -- 'swipe', 'recommendations', 'search', 'category', 'direct'
    view_position INTEGER, -- Position in list (for CTR analysis)
    view_duration_seconds INTEGER, -- Time spent viewing
    
    -- Interaction tracking
    interaction_type TEXT, -- 'impression', 'click', 'detail_view', 'add_to_wishlist'
    has_clicked_affiliate BOOLEAN DEFAULT false,
    has_shared BOOLEAN DEFAULT false,
    has_saved BOOLEAN DEFAULT false,
    
    -- Context data
    recommendation_id UUID REFERENCES recommendations(id) ON DELETE SET NULL,
    search_query TEXT,
    filter_criteria JSONB DEFAULT '{}',
    
    -- Device context
    device_type TEXT,
    viewport_size TEXT,
    
    -- ML feedback
    relevance_score DECIMAL(3,2), -- How relevant was this view (for training)
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for product_views
CREATE INDEX idx_product_views_product_id ON product_views(product_id);
CREATE INDEX idx_product_views_user_id ON product_views(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_product_views_timestamp ON product_views(view_timestamp DESC);
CREATE INDEX idx_product_views_session ON product_views(session_id);
CREATE INDEX idx_product_views_source ON product_views(view_source);
CREATE INDEX idx_product_views_recommendation ON product_views(recommendation_id) WHERE recommendation_id IS NOT NULL;

-- Add comments
COMMENT ON TABLE product_views IS 'Tracks all product view events for engagement analytics and ML training';
COMMENT ON COLUMN product_views.view_source IS 'Origin of the product view for attribution analysis';

-- =====================================================================
-- 5. RECOMMENDATION FEEDBACK TABLE
-- =====================================================================
-- Purpose: Collect explicit and implicit feedback on recommendations
-- Business Logic: Used to train and improve ML models based on user
-- satisfaction with recommendations
--
-- Design Decision: Separate from recommendations table to allow multiple
-- feedback events per recommendation

CREATE TABLE IF NOT EXISTS recommendation_feedback (
    -- Feedback identification
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Core relationships
    recommendation_id UUID REFERENCES recommendations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    
    -- Feedback type and value
    feedback_type TEXT NOT NULL, -- 'explicit', 'implicit'
    feedback_action TEXT NOT NULL, -- 'like', 'dislike', 'click', 'purchase', 'ignore', 'report'
    feedback_value DECIMAL(3,2), -- -1.00 to 1.00 scale
    
    -- Explicit feedback details
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    tags TEXT[], -- ['too_expensive', 'not_my_style', 'perfect']
    
    -- Implicit feedback metrics
    time_to_action_seconds INTEGER, -- Time from display to action
    dwell_time_seconds INTEGER, -- Time spent viewing
    scroll_depth DECIMAL(3,2), -- How far user scrolled (0.00 to 1.00)
    
    -- Context
    feedback_source TEXT, -- 'recommendation_list', 'email', 'push_notification'
    session_id TEXT,
    position_in_list INTEGER,
    
    -- ML training metadata
    model_version TEXT, -- Which model generated the recommendation
    confidence_score DECIMAL(3,2), -- Original confidence of recommendation
    training_weight DECIMAL(3,2) DEFAULT 1.0, -- Weight for training (boost important feedback)
    is_processed BOOLEAN DEFAULT false, -- Has been used in training
    
    -- Audit fields
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for recommendation_feedback
CREATE INDEX idx_rec_feedback_recommendation ON recommendation_feedback(recommendation_id);
CREATE INDEX idx_rec_feedback_user ON recommendation_feedback(user_id);
CREATE INDEX idx_rec_feedback_product ON recommendation_feedback(product_id);
CREATE INDEX idx_rec_feedback_created ON recommendation_feedback(created_at DESC);
CREATE INDEX idx_rec_feedback_unprocessed ON recommendation_feedback(is_processed, created_at) WHERE is_processed = false;
CREATE INDEX idx_rec_feedback_action ON recommendation_feedback(feedback_action);

-- Add comments
COMMENT ON TABLE recommendation_feedback IS 'Collects user feedback on recommendations for ML model training';
COMMENT ON COLUMN recommendation_feedback.feedback_value IS 'Normalised feedback score: -1.0 (strong negative) to 1.0 (strong positive)';
COMMENT ON COLUMN recommendation_feedback.training_weight IS 'Importance weight for ML training, higher for more valuable feedback';

-- =====================================================================
-- ROW LEVEL SECURITY POLICIES
-- =====================================================================
-- Apply RLS to all new tables following Supabase best practices
-- Reference: Supabase RLS documentation - User-scoped access pattern

-- Enable RLS on all new tables
ALTER TABLE affiliate_clicks ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_feedback ENABLE ROW LEVEL SECURITY;

-- Affiliate Clicks Policies
-- Users can only see their own affiliate clicks
CREATE POLICY "Users view own affiliate clicks" ON affiliate_clicks
    FOR SELECT USING ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- Service role has full access
CREATE POLICY "Service role manages affiliate clicks" ON affiliate_clicks
    FOR ALL TO service_role USING (true);

-- User Preferences Policies
-- Users can view and update their own preferences
CREATE POLICY "Users view own preferences" ON user_preferences
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users update own preferences" ON user_preferences
    FOR UPDATE USING ((SELECT auth.uid()) = user_id);

-- Service role can manage all preferences
CREATE POLICY "Service role manages preferences" ON user_preferences
    FOR ALL TO service_role USING (true);

-- Session Analytics Policies
-- Users can view their own sessions
CREATE POLICY "Users view own sessions" ON session_analytics
    FOR SELECT USING ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- Service role has full access for analytics
CREATE POLICY "Service role manages sessions" ON session_analytics
    FOR ALL TO service_role USING (true);

-- Product Views Policies
-- Users can view their own product views
CREATE POLICY "Users view own product views" ON product_views
    FOR SELECT USING ((SELECT auth.uid()) = user_id OR user_id IS NULL);

-- Service role manages all views
CREATE POLICY "Service role manages product views" ON product_views
    FOR ALL TO service_role USING (true);

-- Recommendation Feedback Policies
-- Users can view and create their own feedback
CREATE POLICY "Users view own feedback" ON recommendation_feedback
    FOR SELECT USING ((SELECT auth.uid()) = user_id);

CREATE POLICY "Users create own feedback" ON recommendation_feedback
    FOR INSERT WITH CHECK ((SELECT auth.uid()) = user_id);

-- Service role manages all feedback
CREATE POLICY "Service role manages feedback" ON recommendation_feedback
    FOR ALL TO service_role USING (true);

-- =====================================================================
-- TRIGGERS FOR AUTOMATIC TIMESTAMP UPDATES
-- =====================================================================
-- Reuse the existing update_updated_at_column function for consistency

-- Apply update triggers to tables with updated_at columns
CREATE TRIGGER update_affiliate_clicks_updated_at
    BEFORE UPDATE ON affiliate_clicks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at
    BEFORE UPDATE ON user_preferences
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_session_analytics_updated_at
    BEFORE UPDATE ON session_analytics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================================
-- VERIFICATION QUERIES
-- =====================================================================
-- Run these after migration to verify successful creation

-- Check all tables exist
SELECT 'Table Creation Verification:' as check_type,
       tablename, 
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

-- Check indexes were created
SELECT 'Index Creation Verification:' as check_type,
       tablename,
       COUNT(*) as index_count
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks',
    'user_preferences',
    'session_analytics', 
    'product_views',
    'recommendation_feedback'
  )
GROUP BY tablename
ORDER BY tablename;

-- Check RLS policies exist
SELECT 'RLS Policy Verification:' as check_type,
       tablename,
       COUNT(*) as policy_count
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'affiliate_clicks',
    'user_preferences',
    'session_analytics',
    'product_views', 
    'recommendation_feedback'
  )
GROUP BY tablename
ORDER BY tablename;

-- =====================================================================
-- END OF MIGRATION
-- =====================================================================
-- 
-- Next Steps:
-- 1. Run this migration in Supabase SQL editor
-- 2. Verify all tables and indexes created successfully
-- 3. Update backend code to use these new tables
-- 4. Implement data recording in API endpoints
-- 5. Set up background jobs for preference calculation
--
-- Documentation References:
-- - Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
-- - PostgreSQL JSONB: https://www.postgresql.org/docs/current/datatype-json.html
-- - Index Design: https://www.postgresql.org/docs/current/indexes.html
--
-- =====================================================================