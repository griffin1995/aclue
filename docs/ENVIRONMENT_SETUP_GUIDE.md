# Environment Setup Guide for aclue Platform

## Overview

This guide provides step-by-step instructions for setting up environment variables for the aclue platform. It covers both backend (Python/FastAPI) and frontend (Next.js) components with comprehensive validation and security considerations.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Prerequisites](#prerequisites)
3. [Backend Environment Setup](#backend-environment-setup)
4. [Frontend Environment Setup](#frontend-environment-setup)
5. [Validation and Testing](#validation-and-testing)
6. [Platform-Specific Deployment](#platform-specific-deployment)
7. [Troubleshooting](#troubleshooting)
8. [Security Checklist](#security-checklist)

## Quick Start

### For Impatient Developers 🚀

```bash
# 1. Clone and navigate to project
git clone <repository-url> aclue-platform
cd aclue-platform

# 2. Setup backend environment
cd backend
cp .env.example .env
python -m app.core.env_loader setup
python -m app.core.config validate

# 3. Setup frontend environment
cd ../web
npm run env:setup
npm run env:validate

# 4. Start development servers
cd ../backend && python -m uvicorn app.main:app --reload &
cd ../web && npm run dev

# 5. Verify everything works
curl http://localhost:8000/health
curl http://localhost:3000/api/health
```

## Prerequisites

### System Requirements

- **Node.js**: 18.0.0 or higher
- **Python**: 3.11 or higher
- **PostgreSQL**: 15 or higher (for local development)
- **Redis**: 6.0 or higher (optional, for caching)
- **Git**: Latest version

### Development Tools

```bash
# Install required tools
npm install -g vercel@latest
pip install python-dotenv pydantic
```

### External Service Accounts

You'll need accounts for:

- [Supabase](https://supabase.com) - Database and authentication
- [Resend](https://resend.com) - Email delivery
- [PostHog](https://posthog.com) - Analytics (optional)
- [Sentry](https://sentry.io) - Error monitoring (optional)

## Backend Environment Setup

### Step 1: Copy Template

```bash
cd backend
cp .env.example .env
```

### Step 2: Generate Secure Keys

```bash
# Generate SECRET_KEY
python -c "import secrets; print(f'SECRET_KEY={secrets.token_urlsafe(64)}')"

# Or use the built-in generator
python -m app.core.config generate-key
```

### Step 3: Configure Database

#### Option A: Local PostgreSQL

```bash
# Install PostgreSQL
# Ubuntu/Debian:
sudo apt-get install postgresql postgresql-contrib

# macOS:
brew install postgresql

# Create development database
sudo -u postgres createuser -s aclue
sudo -u postgres createdb aclue_dev
sudo -u postgres psql -c "ALTER USER aclue PASSWORD 'aclue_dev_password';"
```

Update `.env`:
```bash
DATABASE_URL=postgresql://aclue:aclue_dev_password@localhost:5432/aclue_dev
```

#### Option B: Supabase (Recommended)

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings → API
3. Copy the configuration:

```bash
# In backend/.env
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...

# Database URL from Settings → Database
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres
```

### Step 4: Configure Email Service

#### Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Verify your domain (for production)

```bash
# In backend/.env
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=hello@yourdomain.com
FROM_NAME=aclue
```

### Step 5: Optional Services

#### PostHog Analytics

```bash
# In backend/.env
POSTHOG_API_KEY=phc_your_posthog_key_here
POSTHOG_HOST=https://app.posthog.com
```

#### Sentry Error Tracking

```bash
# In backend/.env
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=development
```

### Step 6: Complete Backend Configuration

Your `backend/.env` should look like:

```bash
# ===============================================================================
# REQUIRED CONFIGURATION
# ===============================================================================

ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# Security
SECRET_KEY=your-generated-64-char-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/aclue_dev

# Supabase
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-key

# Email
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=hello@yourdomain.com

# CORS
CORS_ORIGINS=["http://localhost:3000"]
ALLOWED_HOSTS=["localhost", "127.0.0.1"]

# ===============================================================================
# OPTIONAL CONFIGURATION
# ===============================================================================

# Analytics
POSTHOG_API_KEY=phc_your_key
ENABLE_ANALYTICS=true

# Monitoring
SENTRY_DSN=your-sentry-dsn
ENABLE_CACHING=true

# Feature Flags
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_ML_RECOMMENDATIONS=true
```

### Step 7: Validate Backend Environment

```bash
# Test environment loading
python -m app.core.env_loader load --verbose

# Validate configuration
python -m app.core.config validate

# Check environment health
python -m app.core.env_loader health
```

## Frontend Environment Setup

### Step 1: Copy Template

```bash
cd web
cp .env.example .env.local
```

### Step 2: Configure API Connection

```bash
# In web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
```

### Step 3: Configure Supabase (Client-side)

```bash
# In web/.env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Server-side only (no NEXT_PUBLIC_ prefix)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### Step 4: Configure Email (Server Actions)

```bash
# In web/.env.local - Server-side only
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=hello@yourdomain.com
FROM_NAME=aclue
```

### Step 5: Optional Services

#### Analytics

```bash
# In web/.env.local
NEXT_PUBLIC_POSTHOG_KEY=phc_your_posthog_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com

NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

#### Error Monitoring

```bash
# In web/.env.local
NEXT_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
NEXT_PUBLIC_SENTRY_ENVIRONMENT=development
```

#### Payments (if needed)

```bash
# In web/.env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key
STRIPE_SECRET_KEY=sk_test_your_secret_key
```

### Step 6: Complete Frontend Configuration

Your `web/.env.local` should look like:

```bash
# ===============================================================================
# REQUIRED CONFIGURATION
# ===============================================================================

NODE_ENV=development
NEXT_TELEMETRY_DISABLED=1

# Application URLs
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000

# Supabase (Public)
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Supabase (Private - Server-side only)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Email (Server-side only)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=hello@yourdomain.com

# ===============================================================================
# OPTIONAL CONFIGURATION
# ===============================================================================

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=phc_your_key
NEXT_PUBLIC_ENABLE_ANALYTICS=true

# Feature Flags
NEXT_PUBLIC_ENABLE_PWA=true
NEXT_PUBLIC_ENABLE_DARK_MODE=true
NEXT_PUBLIC_MAINTENANCE_MODE=false

# Development
NEXT_PUBLIC_DEBUG=false
FAST_REFRESH=true
```

### Step 7: Validate Frontend Environment

```bash
# Use environment manager
npm run env:validate

# Verbose validation
npm run env:validate:verbose

# Health check
npm run env:health

# Display current configuration
npm run env:info
```

## Validation and Testing

### Backend Validation

```bash
cd backend

# Environment validation
python -m app.core.config validate

# Load test with specific environment
python -m app.core.env_loader load --environment development --verbose

# Health check
python -m app.core.env_loader health

# Test database connection
python -c "
from app.core.config import get_settings
from sqlalchemy import create_engine
settings = get_settings()
engine = create_engine(settings.database_url_sync)
with engine.connect() as conn:
    result = conn.execute('SELECT 1')
    print('Database connection successful!')
"

# Test Supabase connection
python -c "
from supabase import create_client
from app.core.config import get_settings
settings = get_settings()
supabase = create_client(str(settings.SUPABASE_URL), settings.SUPABASE_ANON_KEY)
print('Supabase connection successful!')
"
```

### Frontend Validation

```bash
cd web

# Environment validation
npm run env:validate

# Check for security issues
npm run env:health

# Test API connection
curl http://localhost:3000/api/health

# Test environment loading in development
npm run dev
# Check browser console for any environment-related errors
```

### Integration Testing

```bash
# Start both services
cd backend && python -m uvicorn app.main:app --reload --port 8000 &
cd web && npm run dev &

# Test backend health
curl http://localhost:8000/health

# Test frontend health
curl http://localhost:3000/api/health

# Test API integration
curl -X POST http://localhost:3000/api/newsletter \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

## Platform-Specific Deployment

### Vercel Deployment (Frontend)

#### Step 1: Install Vercel CLI

```bash
npm i -g vercel
vercel login
```

#### Step 2: Configure Environment Variables

```bash
# Set production environment variables
vercel env add NEXT_PUBLIC_API_URL production
# Enter: https://your-backend-url.com

vercel env add SUPABASE_SERVICE_ROLE_KEY production
# Enter: your-service-role-key (mark as sensitive)

vercel env add RESEND_API_KEY production
# Enter: re_your_production_key (mark as sensitive)

# Generate and set for all environments
npm run env:generate:vercel > vercel-env-config.txt
# Copy and paste variables to Vercel dashboard
```

#### Step 3: Deploy

```bash
vercel --prod
```

### Railway Deployment (Backend)

#### Step 1: Install Railway CLI

```bash
# Install Railway CLI
curl -fsSL https://railway.app/install.sh | sh
railway login
```

#### Step 2: Create and Configure Project

```bash
cd backend
railway init
railway add postgresql

# Set environment variables
railway variables:set ENVIRONMENT=production
railway variables:set DEBUG=false
railway variables:set SECRET_KEY="$(python -c 'import secrets; print(secrets.token_urlsafe(64))')"

# Database URL is automatically provided by Railway as $PGURL
railway variables:set DATABASE_URL='${{PGURL}}'

# Set other required variables
railway variables:set SUPABASE_URL=https://your-project-id.supabase.co
railway variables:set SUPABASE_SERVICE_ROLE_KEY=your-service-key
railway variables:set RESEND_API_KEY=re_your_api_key
```

#### Step 3: Deploy

```bash
railway up
```

### Docker Deployment (Self-hosted)

#### Step 1: Prepare Environment Files

```bash
# Create production environment files
cp backend/.env.example backend/.env.production
cp web/.env.example web/.env.production

# Edit with production values
vim backend/.env.production
vim web/.env.production
```

#### Step 2: Use Docker Compose

```yaml
# docker-compose.prod.yml
version: '3.8'

services:
  backend:
    build: ./backend
    env_file:
      - ./backend/.env.production
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  frontend:
    build: ./web
    env_file:
      - ./web/.env.production
    ports:
      - "3000:3000"
    depends_on:
      - backend

  postgres:
    image: postgres:15
    environment:
      POSTGRES_DB: aclue_prod
      POSTGRES_USER: aclue
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

#### Step 3: Deploy

```bash
docker-compose -f docker-compose.prod.yml up -d
```

## Troubleshooting

### Common Issues

#### Backend Issues

**Issue**: `ValidationError: SECRET_KEY is required`

```bash
# Solution: Generate and set SECRET_KEY
python -c "import secrets; print(f'SECRET_KEY={secrets.token_urlsafe(64)}')"
# Copy output to .env file
```

**Issue**: `Database connection failed`

```bash
# Check database is running
pg_isready -h localhost -p 5432

# Test connection manually
psql postgresql://user:pass@localhost:5432/database_name

# Verify DATABASE_URL format
echo $DATABASE_URL
```

**Issue**: `Supabase authentication failed`

```bash
# Verify keys are correct
python -c "
import os
print('URL:', os.getenv('SUPABASE_URL'))
print('Anon key starts with:', os.getenv('SUPABASE_ANON_KEY', '')[:10])
print('Service key starts with:', os.getenv('SUPABASE_SERVICE_ROLE_KEY', '')[:10])
"

# Test connection
curl -H "apikey: $SUPABASE_ANON_KEY" "$SUPABASE_URL/rest/v1/"
```

#### Frontend Issues

**Issue**: `Environment validation failed`

```bash
# Run detailed validation
npm run env:validate:verbose

# Check for missing required variables
npm run env:health
```

**Issue**: `API connection failed`

```bash
# Verify API URL is correct
echo $NEXT_PUBLIC_API_URL

# Test backend is running
curl $NEXT_PUBLIC_API_URL/health

# Check CORS configuration
curl -H "Origin: http://localhost:3000" $NEXT_PUBLIC_API_URL/health
```

**Issue**: `Build failed with environment errors`

```bash
# Check build-time environment variables
npm run build 2>&1 | grep -i env

# Verify all NEXT_PUBLIC_ variables are set
printenv | grep NEXT_PUBLIC_
```

### Debug Commands

#### Backend Debugging

```bash
# Check environment loading
python -c "
from app.core.config import get_settings
try:
    settings = get_settings()
    print('✅ Environment loaded successfully')
    print(f'Environment: {settings.ENVIRONMENT}')
    print(f'Debug: {settings.DEBUG}')
    print(f'Database: {settings.DATABASE_URL.host}')
except Exception as e:
    print(f'❌ Error: {e}')
"

# Test all environment variables
python -m app.core.env_loader health
```

#### Frontend Debugging

```bash
# Check environment variables in build
npm run build -- --debug

# Test environment loading
node -e "
const { env, clientEnv } = require('./lib/env.ts');
console.log('Server env loaded:', Object.keys(env).length, 'variables');
console.log('Client env loaded:', Object.keys(clientEnv).length, 'variables');
"
```

### Performance Issues

#### Backend Performance

```bash
# Check database connection pool
python -c "
from app.core.config import get_settings
settings = get_settings()
print(f'Pool size: {settings.DB_POOL_SIZE}')
print(f'Max overflow: {settings.DB_MAX_OVERFLOW}')
"

# Monitor database connections
psql $DATABASE_URL -c "
SELECT count(*) as active_connections,
       state
FROM pg_stat_activity
WHERE datname = current_database()
GROUP BY state;
"
```

#### Frontend Performance

```bash
# Analyze bundle size
npm run build:analyze

# Check environment variable usage
grep -r "process.env" src/ | wc -l
grep -r "clientEnv\." src/ | wc -l
```

## Security Checklist

### Pre-Deployment Security Review

#### ✅ Required Checks

- [ ] No hardcoded secrets in code
- [ ] All sensitive variables are server-side only
- [ ] SECRET_KEY is at least 64 characters
- [ ] Database credentials are environment-specific
- [ ] API keys are production-ready
- [ ] CORS origins are restrictive
- [ ] Debug mode is disabled in production
- [ ] Error tracking is configured
- [ ] Access logging is enabled

#### ✅ Frontend Security

- [ ] No NEXT_PUBLIC_ prefix on sensitive variables
- [ ] Client environment validation passes
- [ ] CSP headers are configured (if applicable)
- [ ] API URLs use HTTPS in production
- [ ] Analytics keys are read-only

#### ✅ Backend Security

- [ ] Database connections use TLS
- [ ] JWT secrets are secure and rotated
- [ ] Rate limiting is enabled
- [ ] Input validation is in place
- [ ] Error messages don't leak sensitive information

### Security Testing

```bash
# Test for secret leakage
cd backend
grep -r "sk_live_" . --exclude-dir=.git
grep -r "re_[a-zA-Z0-9]" . --exclude-dir=.git --exclude="*.example"

cd web
grep -r "NEXT_PUBLIC_.*SECRET" .
grep -r "NEXT_PUBLIC_.*PRIVATE" .
```

## Best Practices Summary

### Development

1. **Use template files**: Always start with `.env.example`
2. **Generate secure keys**: Use cryptographically secure random generators
3. **Validate early**: Run validation before starting development
4. **Test locally**: Verify all services work before deploying
5. **Document changes**: Update this guide when adding new variables

### Deployment

1. **Environment separation**: Use different keys for dev/staging/production
2. **Platform-specific config**: Use platform environment variable systems
3. **Validation in CI/CD**: Include environment validation in build pipelines
4. **Monitor deployments**: Check environment health after deployment
5. **Rollback plans**: Have procedures for reverting bad configurations

### Security

1. **Never commit secrets**: Use `.gitignore` and pre-commit hooks
2. **Rotate keys regularly**: Implement key rotation schedules
3. **Monitor access**: Log environment variable access
4. **Audit configurations**: Regularly review all environment variables
5. **Incident response**: Have plans for credential compromise

## Additional Resources

- [Environment Security Guide](./ENVIRONMENT_SECURITY_GUIDE.md)
- [Supabase Documentation](https://supabase.com/docs)
- [Resend Documentation](https://resend.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Pydantic Settings](https://pydantic-docs.helpmanual.io/usage/settings/)

## Support

For help with environment setup:

1. Check this guide and the troubleshooting section
2. Run the validation tools to identify specific issues
3. Review the security guide for security-related questions
4. Contact the development team for platform-specific issues

---

**Document Version**: 1.0
**Last Updated**: September 2025
**Tested With**: Python 3.11, Node.js 18, Next.js 14
**Owner**: Engineering Team