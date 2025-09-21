-- Fix Newsletter Signups Table Issues
-- Execute this in your Supabase SQL Editor

-- Step 1: Create the missing update function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Step 2: Add missing columns if they don't exist
DO $$
BEGIN
    -- Add signup_timestamp if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_signups' AND column_name = 'signup_timestamp') THEN
        ALTER TABLE newsletter_signups ADD COLUMN signup_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW();
    END IF;

    -- Add email_sent if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_signups' AND column_name = 'email_sent') THEN
        ALTER TABLE newsletter_signups ADD COLUMN email_sent BOOLEAN DEFAULT false;
    END IF;

    -- Add welcome_email_sent if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_signups' AND column_name = 'welcome_email_sent') THEN
        ALTER TABLE newsletter_signups ADD COLUMN welcome_email_sent BOOLEAN DEFAULT false;
    END IF;

    -- Add admin_notification_sent if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_signups' AND column_name = 'admin_notification_sent') THEN
        ALTER TABLE newsletter_signups ADD COLUMN admin_notification_sent BOOLEAN DEFAULT false;
    END IF;

    -- Add is_active if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_signups' AND column_name = 'is_active') THEN
        ALTER TABLE newsletter_signups ADD COLUMN is_active BOOLEAN DEFAULT true;
    END IF;

    -- Add unsubscribed_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'newsletter_signups' AND column_name = 'unsubscribed_at') THEN
        ALTER TABLE newsletter_signups ADD COLUMN unsubscribed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Step 3: Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created_at ON newsletter_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_active ON newsletter_signups(is_active);

-- Step 4: Add trigger for updated_at (drop and recreate to avoid conflicts)
DROP TRIGGER IF EXISTS update_newsletter_signups_updated_at ON newsletter_signups;
CREATE TRIGGER update_newsletter_signups_updated_at
    BEFORE UPDATE ON newsletter_signups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Step 5: Ensure Row Level Security
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Step 6: Drop and recreate policy to avoid conflicts
DROP POLICY IF EXISTS "Service role can manage newsletter signups" ON newsletter_signups;
CREATE POLICY "Service role can manage newsletter signups"
    ON newsletter_signups
    FOR ALL
    USING (auth.role() = 'service_role');

-- Step 7: Grant permissions
GRANT ALL ON newsletter_signups TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;

-- Step 8: Test the table structure
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'newsletter_signups'
ORDER BY ordinal_position;