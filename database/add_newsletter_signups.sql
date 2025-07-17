-- Newsletter Signups Table
-- Add this to your existing Supabase database

-- Newsletter signups table
CREATE TABLE IF NOT EXISTS newsletter_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL,
    source VARCHAR(50) DEFAULT 'maintenance_page',
    user_agent TEXT,
    ip_address INET,
    signup_timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    email_sent BOOLEAN DEFAULT false,
    welcome_email_sent BOOLEAN DEFAULT false,
    admin_notification_sent BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_email ON newsletter_signups(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_created_at ON newsletter_signups(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_newsletter_signups_active ON newsletter_signups(is_active);

-- Create unique constraint on email to prevent duplicates
ALTER TABLE newsletter_signups ADD CONSTRAINT unique_newsletter_email UNIQUE (email);

-- Add trigger for updated_at
CREATE TRIGGER update_newsletter_signups_updated_at 
    BEFORE UPDATE ON newsletter_signups
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security for newsletter_signups (admin access only)
ALTER TABLE newsletter_signups ENABLE ROW LEVEL SECURITY;

-- Only service role can access newsletter signups (for backend API)
CREATE POLICY "Service role can manage newsletter signups" 
    ON newsletter_signups 
    FOR ALL 
    USING (auth.role() = 'service_role');

-- Grant necessary permissions
GRANT ALL ON newsletter_signups TO service_role;
GRANT USAGE ON SCHEMA public TO service_role;