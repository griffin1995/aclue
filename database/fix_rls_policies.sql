-- Fix Supabase RLS Security Issues
-- This script addresses all security vulnerabilities identified by Supabase linter

-- =============================================================================
-- FIX 1: Enable RLS on categories and products tables
-- =============================================================================

-- Enable RLS on categories table (currently has policies but RLS disabled)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Enable RLS on products table (currently has policies but RLS disabled)  
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- =============================================================================
-- FIX 2: Update function security with immutable search paths
-- =============================================================================

-- Drop triggers that depend on the function first
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;

-- Now drop the function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Recreate with security definer and immutable search path
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Recreate the triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create update_name_fields function with secure search path (if it exists)
CREATE OR REPLACE FUNCTION update_name_fields()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
BEGIN
    -- Update full_name based on first_name and last_name
    IF TG_TABLE_NAME = 'users' THEN
        NEW.full_name := TRIM(COALESCE(NEW.first_name, '') || ' ' || COALESCE(NEW.last_name, ''));
    END IF;
    RETURN NEW;
END;
$$;

-- =============================================================================
-- FIX 3: Optimize RLS policies for performance and service role access
-- =============================================================================

-- Drop existing user policies and recreate with optimized auth calls
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Allow anon registration" ON users;
DROP POLICY IF EXISTS "Service role can access all users" ON users;

-- Create comprehensive user policies with optimized auth.uid() calls
CREATE POLICY "Service role can access all users" ON users 
    FOR ALL TO service_role USING (true);

CREATE POLICY "Users can view own profile" ON users 
    FOR SELECT USING ((select auth.uid()) = id);

CREATE POLICY "Users can update own profile" ON users 
    FOR UPDATE USING ((select auth.uid()) = id);

CREATE POLICY "Allow anon registration" ON users 
    FOR INSERT TO anon WITH CHECK (true);

-- Drop and recreate other table policies with optimized auth calls
DROP POLICY IF EXISTS "Users can view own swipe sessions" ON swipe_sessions;
DROP POLICY IF EXISTS "Users can view own swipe interactions" ON swipe_interactions;
DROP POLICY IF EXISTS "Users can view own recommendations" ON recommendations;
DROP POLICY IF EXISTS "Users can view own gift links" ON gift_links;

-- Recreate with optimized auth.uid() calls for performance
CREATE POLICY "Users can view own swipe sessions" ON swipe_sessions 
    FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own swipe interactions" ON swipe_interactions 
    FOR ALL USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own recommendations" ON recommendations 
    FOR SELECT USING ((select auth.uid()) = user_id);

CREATE POLICY "Users can view own gift links" ON gift_links 
    FOR ALL USING ((select auth.uid()) = user_id);

-- Ensure categories and products policies exist and are properly configured
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Service role can manage categories" ON categories;
DROP POLICY IF EXISTS "Service role can manage products" ON products;

-- Recreate policies with service role access
CREATE POLICY "Service role can manage categories" ON categories 
    FOR ALL TO service_role USING (true);

CREATE POLICY "Anyone can view categories" ON categories 
    FOR SELECT TO authenticated, anon USING (true);

CREATE POLICY "Service role can manage products" ON products 
    FOR ALL TO service_role USING (true);

CREATE POLICY "Anyone can view active products" ON products 
    FOR SELECT TO authenticated, anon USING (is_active = true);

-- =============================================================================
-- FIX 4: Add missing foreign key indexes for performance
-- =============================================================================

-- Categories table - parent_id foreign key index
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories(parent_id);

-- Gift_links table - foreign key indexes
CREATE INDEX IF NOT EXISTS idx_gift_links_user_id ON gift_links(user_id);
CREATE INDEX IF NOT EXISTS idx_gift_links_session_id ON gift_links(session_id);

-- Recommendations table - foreign key indexes
CREATE INDEX IF NOT EXISTS idx_recommendations_product_id ON recommendations(product_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_session_id ON recommendations(session_id);

-- Swipe_interactions table - foreign key indexes
CREATE INDEX IF NOT EXISTS idx_swipe_interactions_category_id ON swipe_interactions(category_id);
CREATE INDEX IF NOT EXISTS idx_swipe_interactions_product_id ON swipe_interactions(product_id);

-- Swipe_sessions table - foreign key index
CREATE INDEX IF NOT EXISTS idx_swipe_sessions_user_id ON swipe_sessions(user_id);

-- =============================================================================
-- FIX 5: Optimize existing indexes based on usage patterns
-- =============================================================================

-- Replace unused composite price index with more targeted indexes
DROP INDEX IF EXISTS idx_products_price;

-- Create more specific indexes based on likely query patterns
CREATE INDEX IF NOT EXISTS idx_products_price_min ON products(price_min) WHERE price_min IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_price_max ON products(price_max) WHERE price_max IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_price_range ON products(price_min, price_max) WHERE price_min IS NOT NULL AND price_max IS NOT NULL;

-- Replace unused score index with more practical composite indexes
DROP INDEX IF EXISTS idx_recommendations_score;

-- Create composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_recommendations_user_score ON recommendations(user_id, confidence_score DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_user_created ON recommendations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_active ON recommendations(user_id, expires_at) WHERE expires_at IS NOT NULL;

-- =============================================================================
-- FIX 6: Add additional performance indexes for common queries
-- =============================================================================

-- Products filtering and search indexes
CREATE INDEX IF NOT EXISTS idx_products_active_category ON products(category_id, is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand) WHERE brand IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_products_rating ON products(rating DESC) WHERE rating IS NOT NULL;

-- User activity tracking indexes
CREATE INDEX IF NOT EXISTS idx_swipe_interactions_timestamp ON swipe_interactions(swipe_timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_swipe_sessions_completed ON swipe_sessions(user_id, completed_at DESC) WHERE is_completed = true;

-- Categories hierarchical queries
CREATE INDEX IF NOT EXISTS idx_categories_active_sort ON categories(is_active, sort_order) WHERE is_active = true;

-- Gift links sharing and analytics
CREATE INDEX IF NOT EXISTS idx_gift_links_active_token ON gift_links(link_token) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_gift_links_user_created ON gift_links(user_id, created_at DESC);

-- =============================================================================
-- VERIFICATION QUERIES (Uncomment to test)
-- =============================================================================

-- SELECT 'RLS Status Check:' as verification;
-- SELECT schemaname, tablename, rowsecurity, hasrls 
-- FROM pg_tables 
-- WHERE schemaname = 'public' 
-- AND tablename IN ('users', 'categories', 'products');

-- SELECT 'Function Security Check:' as verification;
-- SELECT proname, prosecdef, proconfig 
-- FROM pg_proc 
-- WHERE proname IN ('update_updated_at_column', 'update_name_fields');

-- SELECT 'Foreign Key Index Check:' as verification;
-- SELECT schemaname, tablename, indexname 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- AND indexname LIKE 'idx_%_fkey' OR indexname LIKE 'idx_%_id';

-- SELECT 'Unused Index Check:' as verification;
-- SELECT schemaname, tablename, indexname, idx_scan as usage_count
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY idx_scan;
