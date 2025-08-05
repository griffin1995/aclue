# GitHub Secrets Configuration Guide

This guide provides step-by-step instructions for setting up the required GitHub secrets for the GiftSync deployment pipeline.

## Overview

The deployment pipeline requires the following secrets to be configured in your GitHub repository settings. These secrets provide secure access to various services used in the deployment process.

## Required Secrets

### 🔐 Core API Secrets

#### Cloudflare API Credentials
- **`CLOUDFLARE_API_TOKEN`**
  - **Purpose**: Manages DNS, security settings, and cache purging
  - **Value**: Your Cloudflare API token with these permissions:
    - Zone:Edit, DNS:Edit, SSL and Certificates:Edit
    - Zone Settings:Edit, Cache Purge:Edit, Analytics:Read
    - Transform Rules:Edit
  - **How to get**: Cloudflare Dashboard > My Profile > API Tokens > Create Token
  - **Example**: `KVJrO9PFELh1Qw_KonkieGPp90WkSx8t1v6hb9wa`

- **`CLOUDFLARE_ACCOUNT_ID`**
  - **Purpose**: Identifies your Cloudflare account for API operations
  - **Value**: Your Cloudflare Account ID
  - **How to get**: Cloudflare Dashboard > Right sidebar > Account ID
  - **Example**: `73d611ed81c304799d355645ef453a2a`

#### Vercel Deployment Credentials
- **`VERCEL_TOKEN`**
  - **Purpose**: Deploys the frontend application to Vercel
  - **Value**: Your Vercel API token
  - **How to get**: Vercel Dashboard > Settings > Tokens > Create
  - **Example**: `vercel_token_abc123xyz789`

- **`VERCEL_ORG_ID`**
  - **Purpose**: Identifies your Vercel organisation
  - **Value**: Your Vercel organisation ID
  - **How to get**: Vercel project settings > General > Project ID section
  - **Example**: `team_abc123xyz789`

- **`VERCEL_PROJECT_ID`**
  - **Purpose**: Identifies the specific Vercel project to deploy
  - **Value**: Your Vercel project ID
  - **How to get**: Vercel project settings > General > Project ID
  - **Example**: `prj_abc123xyz789`

#### Supabase Database Credentials
- **`SUPABASE_URL`**
  - **Purpose**: Backend database connection
  - **Value**: Your Supabase project URL
  - **How to get**: Supabase Dashboard > Settings > API > Project URL
  - **Example**: `https://your-project.supabase.co`

- **`SUPABASE_ANON_KEY`**
  - **Purpose**: Public API access for frontend
  - **Value**: Your Supabase anonymous key
  - **How to get**: Supabase Dashboard > Settings > API > anon public
  - **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

- **`SUPABASE_SERVICE_ROLE_KEY`**
  - **Purpose**: Backend administrative access to database
  - **Value**: Your Supabase service role key
  - **How to get**: Supabase Dashboard > Settings > API > service_role secret
  - **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
  - **⚠️ Keep this secret safe**: This key has full database access

#### Railway Backend URL
- **`RAILWAY_BACKEND_URL`**
  - **Purpose**: Backend API endpoint for health checks and frontend integration
  - **Value**: Your Railway deployment URL
  - **How to get**: Railway Dashboard > Your Service > Settings > Domains
  - **Example**: `https://giftsync-backend-production.up.railway.app`

## How to Add Secrets to GitHub

### Step 1: Navigate to Repository Settings
1. Go to your GitHub repository
2. Click **Settings** tab
3. In the left sidebar, click **Secrets and variables**
4. Click **Actions**

### Step 2: Add Each Secret
1. Click **New repository secret**
2. Enter the **Name** (exactly as listed above, case-sensitive)
3. Enter the **Value** (the actual secret value)
4. Click **Add secret**

### Step 3: Verify Secrets
Ensure all required secrets are added:
- [ ] CLOUDFLARE_API_TOKEN
- [ ] CLOUDFLARE_ACCOUNT_ID
- [ ] VERCEL_TOKEN
- [ ] VERCEL_ORG_ID
- [ ] VERCEL_PROJECT_ID
- [ ] SUPABASE_URL
- [ ] SUPABASE_ANON_KEY
- [ ] SUPABASE_SERVICE_ROLE_KEY
- [ ] RAILWAY_BACKEND_URL

## Environment-Specific Configuration

### Development Environment
For development deployments, you may want to use different values:
- Different Vercel project for staging
- Separate Supabase database for testing
- Development Railway instance

### Production Environment
Production uses the main values configured above. Ensure these point to your production services.

## Security Best Practices

### 🔒 Secret Management
- **Never commit secrets to git**: Use GitHub secrets exclusively
- **Rotate tokens regularly**: Update API tokens quarterly
- **Monitor access**: Review secret usage in Actions logs
- **Limit permissions**: Give tokens only the minimum required permissions

### 🛡️ Access Control
- **Team access**: Only repository administrators should manage secrets
- **Audit trail**: GitHub logs all secret access and changes
- **Environment protection**: Use GitHub environments for production deployments

## Troubleshooting

### Common Issues

#### ❌ Cloudflare API Token Issues
- **Problem**: "Authentication failed" in deployment logs
- **Solution**: Verify token has all required permissions listed above
- **Check**: Token hasn't expired (check expiration date)

#### ❌ Vercel Deployment Fails
- **Problem**: "Project not found" or "Insufficient permissions"
- **Solution**: Verify VERCEL_ORG_ID and VERCEL_PROJECT_ID are correct
- **Check**: Vercel token has deployment permissions

#### ❌ Backend Health Checks Fail
- **Problem**: Health checks return 404 or timeout
- **Solution**: Verify RAILWAY_BACKEND_URL is correct and accessible
- **Check**: Railway service is running and healthy

#### ❌ Database Connection Issues
- **Problem**: Backend tests fail with database errors
- **Solution**: Verify Supabase credentials are correct
- **Check**: Supabase project is active and accessible

### Testing Secrets

You can test individual secrets by running parts of the deployment pipeline:

```bash
# Test Cloudflare connection
curl -H "Authorization: Bearer YOUR_TOKEN" \
  "https://api.cloudflare.com/client/v4/user/tokens/verify"

# Test Vercel connection
vercel whoami --token YOUR_TOKEN

# Test Supabase connection
curl -H "apikey: YOUR_ANON_KEY" \
  "YOUR_SUPABASE_URL/rest/v1/"
```

## Environment Variables Reference

These secrets are automatically available as environment variables in GitHub Actions:

```yaml
env:
  CLOUDFLARE_API_TOKEN: ${{ secrets.CLOUDFLARE_API_TOKEN }}
  RAILWAY_BACKEND_URL: ${{ secrets.RAILWAY_BACKEND_URL }}
  # ... etc
```

## Contact Information

If you need assistance with secret configuration:
- **Repository Owner**: Check with project maintainers
- **Cloudflare Support**: For API token issues
- **Vercel Support**: For deployment credential issues
- **Supabase Support**: For database credential issues

## Updates and Maintenance

### Quarterly Review
- [ ] Review and rotate API tokens
- [ ] Verify all services are still active
- [ ] Update any changed URLs or credentials
- [ ] Test deployment pipeline end-to-end

### When to Update
- **Service migrations**: When moving between providers
- **Security incidents**: Immediately rotate affected tokens
- **Permission changes**: When modifying API access levels
- **New environments**: When adding staging/development environments

---

**⚠️ Important**: Keep this document updated when secrets change. All team members with deployment responsibilities should have access to this guide.