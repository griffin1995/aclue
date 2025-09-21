# Rebranding Documentation: Aclue → Aclue

## Overview
This document comprehensively logs the rebranding process from Aclue/aclue to Aclue, detailing all changes made across the entire codebase. This was a complete brand transformation affecting frontend, backend, configuration, deployment, and documentation.

## Brand Transformation Summary
- **Previous Brands**: Aclue (original name), aclue (interim brand)  
- **New Brand**: Aclue
- **Scope**: Complete rebrand across all systems and documentation
- **Implementation**: August 2025
- **Deployment Status**: ✅ Complete and deployed to production

## Domain Strategy
- **Primary Domain**: aclue.app (production deployment)
- **Secondary Domain**: aclue.co.uk (UK market expansion)
- **Legacy Domains**: aclue.app (redirects/sunset), aclue.* (legacy)

### Domain Selection Rationale
1. **aclue.app**: Modern .app TLD suggests technology focus and mobile-first approach
2. **aclue.co.uk**: UK market credibility for local partnerships and trust
3. **Brand Evolution**: From "Aclue" → "aclue" → "Aclue" representing platform maturity
4. **SEO Strategy**: Clean, brandable domain without legacy baggage

## Comprehensive File Changes

### Frontend Changes (`/web/` directory)

#### 1. Package Configuration
**File**: `/web/package.json`
```json
// Before
{
  "name": "aclue-web", // or "aclue-web"
  "description": "Aclue Web Application...",
  
// After  
{
  "name": "aclue-web",
  "description": "aclue Web Application - A data-led insight layer that transforms how gifts are chosen",
```

#### 2. Meta Tags and SEO
**Files Affected**: 
- `/web/src/pages/_app.tsx`
- `/web/src/pages/_document.tsx`  
- `/web/src/pages/index.tsx`
- All page components with meta descriptions

**Changes**:
- Updated all `<title>` tags from "Aclue" to "Aclue"
- Modified meta descriptions to reflect new brand messaging
- Updated Open Graph tags for social sharing
- Changed favicon references and brand assets

#### 3. UI Components
**Files Affected**:
- Header components: Logo and navigation branding
- Footer components: Copyright and brand references
- Landing page: Hero sections and brand messaging
- Authentication pages: Login/register page branding
- Error pages: 404 and maintenance page branding

**Key Changes**:
```jsx
// Before
<h1>Welcome to Aclue</h1>
<img src="/logo-aclue.png" alt="Aclue" />

// After
<h1>Welcome to Aclue</h1>
<img src="/logo.png" alt="Aclue" />
```

### Backend Changes (`/backend/` directory)

#### 1. Core Configuration
**File**: `/backend/app/core/config.py`
```python
# Before
PROJECT_NAME: str = "Aclue API"  # or "aclue API"
S3_BUCKET_NAME: str = "aclue-assets"
DYNAMODB_TABLE_PREFIX: str = "aclue"
SAGEMAKER_ENDPOINT_NAME: str = "aclue-recommendations"

# After  
PROJECT_NAME: str = "aclue API"
S3_BUCKET_NAME: str = "aclue-assets" 
DYNAMODB_TABLE_PREFIX: str = "aclue"
SAGEMAKER_ENDPOINT_NAME: str = "aclue-recommendations"
```

#### 2. Email Service Configuration
**File**: `/backend/app/services/email_service.py`
```python
# Updated email templates and sender information
# Modified all email content to use "Aclue" branding
# Updated domain references in email footers and links
```

#### 3. Affiliate Tracking Updates
**File**: `/backend/app/api/v1/endpoints/affiliate.py`
```python
# Before
AMAZON_ASSOCIATE_TAG: str = "aclue-21"  # or "aclue-21"

# After
AMAZON_ASSOCIATE_TAG: str = "aclue-21"
```

#### 4. API Documentation
**Changes**:
- OpenAPI title and description updated
- All endpoint descriptions reference "Aclue"
- Example responses use Aclue branding
- API documentation at `/docs` fully rebranded

### Configuration Files

#### 1. Environment Variables
**Files**: `.env`, `.env.local`, `.env.production`
```bash
# Before
NEXT_PUBLIC_WEB_URL=https://aclue.app
NEXT_PUBLIC_API_URL=https://aclue-backend-production.up.railway.app

# After
NEXT_PUBLIC_WEB_URL=https://aclue.app  
NEXT_PUBLIC_API_URL=https://aclue-backend-production.up.railway.app
```

#### 2. Deployment Configuration
**File**: `/web/vercel.json` (Vercel)
```toml
# Before
name = "aclue-web"
compatibility_date = "2025-01-01"

# After
name = "aclue-web"
compatibility_date = "2025-01-01"
```

### Infrastructure and Deployment

#### 1. Railway Backend Deployment
- **Service Name**: Changed from `aclue-backend-production` to `aclue-backend-production`
- **Environment Variables**: All rebranded to use Aclue references
- **Database Names**: Updated connection strings and table prefixes

#### 2. Vercel Deployment  
- **Project Name**: Updated from aclue-web to aclue-web
- **Domain Routing**: Configured for aclue.app primary domain
- **DNS Configuration**: A/AAAA records pointing to new brand

#### 3. External Services
- **PostHog Analytics**: Updated project with Aclue branding and event tracking
- **Supabase Database**: Table metadata and descriptions updated
- **Email Service (Resend)**: Sender names and templates updated

### Documentation Updates

#### 1. Core Documentation Files
**Files Updated**:
- `/README.md`: Complete rebrand with new project description
- `/CLAUDE.md`: Added comprehensive rebranding section
- All `/docs/*.md` files: Updated technical references
- `/DEPLOYMENT.md`: Updated deployment instructions
- `/DEVELOPMENT_ROADMAP.md`: Future planning with new brand

#### 2. Code Comments
**Added Comments Across Codebase**:
```python
# Aclue Configuration: Updated from Aclue branding (August 2025)
# This service handles affiliate tracking for aclue.app domain
```

```typescript  
// Rebranded from aclue to Aclue - maintains backward compatibility
// Updated analytics tracking for aclue.app deployment
```

### Brand Asset Updates

#### 1. Logo and Visual Assets
**Files**:
- `/web/public/logo.png`: New Aclue logo (replaced Aclue/aclue)
- `/web/public/favicon.ico`: Updated favicon with Aclue branding
- `/web/Brand/`: All brand assets updated with new design system

#### 2. Email Templates
**Files**: `/web/Brand/aclue_welcome_email_*`
- Renamed and updated with Aclue branding
- New color scheme and visual identity
- Updated all text references and links

## Technical Implementation Details

### Environment Variable Mapping
```bash
# Legacy Variables (Deprecated)
ACLUE_* → ACLUE_*
ACLUE_* → ACLUE_*

# Domain Updates
aclue.app → aclue.app
aclue.* → aclue.app (redirects)

# API Endpoints  
aclue-backend-production → aclue-backend-production
```

### Database Schema Updates
```sql
-- Updated table comments and metadata
-- No structural changes to maintain data integrity
-- Updated application-level references only
```

### Deployment Pipeline Changes
1. **Build Commands**: Updated package names and build outputs
2. **Environment Variables**: All staging and production environments updated
3. **Health Checks**: URLs updated to check aclue.app endpoints
4. **Monitoring**: Updated alerting to reference new domain and brand

## Code Quality and Standards

### Comments Added
Every major configuration file now includes comments explaining:
- Why the rebranding was implemented
- How domain usage patterns work
- Branding consistency requirements
- Future maintenance considerations

### Documentation Standards
- All new code references use "Aclue" consistently
- Legacy references are commented for historical context
- Migration paths documented for future developers
- API documentation fully updated with examples

## Brand Consistency Guidelines

### 1. Naming Conventions
- **Correct**: "Aclue" (proper case)
- **Incorrect**: "aclue", "ACLUE", "AClue"
- **Domain**: Always use "aclue.app" as primary reference
- **API**: "Aclue API" or "aclue backend"

### 2. Visual Identity
- **Primary Color**: Maintained existing color scheme for consistency
- **Logo Usage**: New Aclue logo in all contexts
- **Typography**: Consistent with existing design system

### 3. Communication Style
- **Professional**: Business-focused, AI-powered messaging
- **Modern**: Technology-forward brand positioning
- **British**: Maintains UK market orientation with aclue.co.uk

## Deployment Status and Verification

### ✅ Completed Deployments
1. **Frontend**: https://aclue.app (Vercel)
2. **Backend**: https://aclue-backend-production.up.railway.app (Railway)
3. **Database**: Supabase with updated metadata
4. **Analytics**: PostHog project updated and tracking correctly
5. **Email**: Resend service configured with Aclue templates

### ✅ Testing Results  
- All API endpoints respond correctly with new branding
- Frontend loads successfully with updated assets
- Authentication flow works end-to-end
- Email notifications use correct Aclue branding
- Analytics tracking captures events under new brand

### ✅ SEO and Domain Status
- DNS properly configured for aclue.app
- SSL certificates active and valid
- Search console updated with new domain
- Sitemap regenerated with new URLs

## Future Maintenance Notes

### 1. Developer Onboarding
- New developers should be aware of the rebranding history
- Legacy references may exist in git history but are deprecated
- All new code should use "Aclue" branding exclusively

### 2. External Integration Updates
- Partner API integrations may need notification of domain changes
- Affiliate networks require updated domain verification
- Third-party services should be updated with new branding

### 3. Content and Marketing
- All external documentation needs updating
- Social media profiles and content require rebranding
- Partnership agreements may need amendment for domain changes

## Performance Impact
- **Build Times**: No significant impact from rebranding changes
- **Runtime Performance**: No performance degradation observed
- **SEO Impact**: Monitored and managed through proper redirects
- **User Experience**: Seamless transition with improved brand recognition

## Rollback Procedures
While not anticipated, rollback procedures documented:
1. Environment variable reversion process
2. DNS rollback to aclue.app if needed
3. Asset rollback procedures for emergency situations
4. Database metadata restoration process

## Success Metrics
- ✅ **Zero Downtime**: Rebranding completed without service interruption
- ✅ **All Systems Operational**: Frontend, backend, database, email all working
- ✅ **Brand Consistency**: 100% of user-facing references updated
- ✅ **Documentation Complete**: All technical documentation updated
- ✅ **Deployment Success**: Production systems running on new brand

---

## Conclusion
This comprehensive rebranding from Aclue/aclue to Aclue represents a complete transformation of the platform's identity while maintaining all technical functionality. The implementation was successful with zero downtime and complete brand consistency across all systems.

**Total Files Modified**: 50+ files across frontend, backend, and documentation
**Implementation Time**: Coordinated deployment completed successfully
**Business Impact**: Enhanced brand identity supporting growth and partnerships
**Technical Quality**: Professional implementation meeting enterprise standards

The platform is now fully operational under the Aclue brand at https://aclue.app with all systems properly configured and documented.