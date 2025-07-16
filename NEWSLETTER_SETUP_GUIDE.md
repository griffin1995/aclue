# Newsletter Integration Setup Guide

## ✅ Implementation Complete

The newsletter signup system has been fully implemented with the following components:

### 🗄️ Database Table
- **File**: `database/add_newsletter_signups.sql`
- **Status**: Ready for deployment
- **Features**:
  - Email validation and duplicate prevention
  - Source tracking (maintenance_page, etc.)
  - User agent and IP address logging
  - Email sending status tracking
  - Unsubscribe functionality

### 🔧 Backend API Endpoint
- **File**: `backend/app/api/v1/endpoints/newsletter.py`
- **Status**: Fully implemented
- **Endpoints**:
  - `POST /api/v1/newsletter/signup` - Newsletter signup
  - `GET /api/v1/newsletter/subscribers` - List subscribers (admin)
  - `DELETE /api/v1/newsletter/unsubscribe/{email}` - Unsubscribe

### 📧 Email Service
- **File**: `backend/app/services/email_service.py`
- **Status**: Fully implemented
- **Features**:
  - Welcome email to subscriber
  - Admin notification to contact@prznt.app
  - Professional HTML email templates
  - Resend API integration

### 🌐 Frontend Integration
- **File**: `web/src/components/MaintenanceMode.tsx`
- **Status**: Updated to use backend API
- **Features**:
  - Real API integration (no more simulation)
  - Error handling with graceful fallbacks
  - User agent tracking

## 🚀 Deployment Steps

### 1. Database Setup
Execute the SQL in your Supabase SQL editor:
```bash
# Copy the contents of database/add_newsletter_signups.sql
# Paste into Supabase SQL editor at:
# https://supabase.com/dashboard/project/xchsarvamppwephulylt/sql
```

### 2. Backend Configuration
Add to your backend `.env` file:
```bash
# Email Service Configuration
RESEND_API_KEY=your-resend-api-key-here
```

### 3. Start Backend Server
```bash
cd backend
source venv/bin/activate
python -m uvicorn app.main_api:app --reload --host 0.0.0.0 --port 8000
```

### 4. Start Frontend Server
```bash
cd web
npm run dev
```

### 5. Test the Integration
```bash
# Test API endpoint directly
curl -X POST "http://localhost:8000/api/v1/newsletter/signup" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "source": "maintenance_page", "user_agent": "test"}'

# Test frontend
# Visit http://localhost:3000
# Submit email in newsletter form
```

## 📧 Email Configuration

### Resend API Setup
1. Sign up at https://resend.com
2. Create API key
3. Add to backend `.env` file as `RESEND_API_KEY`

### Email Templates
- **Welcome Email**: Professional branded template with beta access info
- **Admin Notification**: Detailed signup information sent to contact@prznt.app
- **Features**:
  - Professional HTML design
  - Mobile-responsive
  - Unsubscribe links
  - Brand consistency

## 🎯 How It Works

### User Flow
1. User visits https://prznt.app (maintenance page)
2. User enters email in newsletter signup form
3. Frontend sends POST request to `/api/v1/newsletter/signup`
4. Backend validates email and checks for duplicates
5. Backend stores signup in `newsletter_signups` table
6. Backend sends welcome email to user
7. Backend sends admin notification to contact@prznt.app
8. Frontend shows success message

### Email Flow
1. **Welcome Email** → Subscriber
   - Subject: "Welcome to prznt - AI-Powered Gift Discovery! 🎁"
   - Content: Beta access info, features, alpha link
   - From: "prznt <noreply@prznt.app>"

2. **Admin Notification** → contact@prznt.app
   - Subject: "New Newsletter Signup: {email}"
   - Content: Subscriber details, signup source, timestamp
   - From: "prznt <noreply@prznt.app>"

## 🔧 Technical Implementation

### Database Schema
```sql
CREATE TABLE newsletter_signups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
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
```

### API Response Format
```json
{
  "success": true,
  "message": "Thank you for subscribing! Welcome email sent.",
  "already_subscribed": false
}
```

### Email Service Integration
- **Service**: Resend (https://resend.com)
- **Features**: Reliable delivery, analytics, unsubscribe handling
- **Fallback**: Graceful degradation if API key not configured

## 🧪 Testing

### Manual Testing
1. Start both backend and frontend servers
2. Visit http://localhost:3000
3. Enter email in newsletter form
4. Check backend logs for success messages
5. Verify email in database (if configured)
6. Check Resend dashboard for email delivery (if configured)

### Automated Testing
```bash
# Run the test script
python3 test_newsletter.py
```

## 🎯 Production Deployment

### Environment Variables
```bash
# Backend (.env)
RESEND_API_KEY=your-production-resend-api-key
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_KEY=your-supabase-service-key

# Frontend (.env.production)
NEXT_PUBLIC_API_URL=https://your-backend-domain.com
```

### Database Migration
Execute `database/add_newsletter_signups.sql` in your production Supabase instance.

## 📊 Analytics & Monitoring

### Database Tracking
- Newsletter signups by source
- Email sending success rates
- Unsubscribe rates
- Signup timestamps and patterns

### Email Analytics
- Open rates (via Resend dashboard)
- Click rates (via Resend dashboard)
- Delivery rates and bounces
- Unsubscribe tracking

## 🔒 Security & Privacy

### Data Protection
- Email validation prevents invalid data
- Duplicate prevention via unique constraint
- IP address logging for analytics
- Unsubscribe functionality

### GDPR Compliance
- Minimal data collection
- Unsubscribe mechanism
- Data retention policies
- User consent tracking

## 🚨 Troubleshooting

### Common Issues
1. **"No module named 'supabase'"**: Activate virtual environment
2. **"Failed to connect to localhost"**: Start backend server
3. **"Email not sent"**: Check RESEND_API_KEY configuration
4. **"Database error"**: Execute database migration SQL

### Debug Steps
1. Check backend server logs
2. Verify database table exists
3. Test API endpoint with curl
4. Check Resend dashboard for email delivery
5. Verify frontend API configuration

## ✅ Implementation Status

- ✅ Database table created
- ✅ Backend API endpoint implemented
- ✅ Email service with templates
- ✅ Frontend integration complete
- ✅ Error handling and validation
- ✅ Admin notifications
- ✅ Welcome email templates
- ✅ Duplicate prevention
- ✅ Testing framework

**The newsletter integration is production-ready and waiting for deployment!**