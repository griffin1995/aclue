# DEPRECATED: Cloudflare Automation Directory

## ⚠️ DEPRECATED - DO NOT USE ⚠️

**Date Deprecated**: August 6, 2025  
**Reason**: aclue project has migrated from Cloudflare Pages to Vercel hosting

## Migration Status

The aclue project has completed migration to Vercel for frontend hosting:

- **From**: Cloudflare Pages hosting
- **To**: Vercel hosting  
- **Current Frontend URL**: https://aclue.app (hosted on Vercel)
- **Backend**: https://aclue-backend-production.up.railway.app (Railway - unchanged)

## Directory Contents

This directory contains outdated Cloudflare automation scripts that are **NO LONGER FUNCTIONAL** including:

- DNS management scripts
- Deployment pipelines
- Security automation
- Health monitoring
- Cache management

## Current Deployment Process

The current deployment process uses:

1. **Frontend**: Auto-deployment to Vercel from GitHub main branch
2. **Backend**: Auto-deployment to Railway from GitHub main branch
3. **Configuration**: Standard Next.js and FastAPI configurations

## Action Required

This directory should be:
- ❌ Marked as deprecated (completed)
- ❌ Not used for any active deployment processes
- ❌ Eventually removed from the repository (pending confirmation)

## Replacement

All deployment automation is now handled by:
- **Vercel**: Automatic GitHub integration for frontend
- **Railway**: Automatic GitHub integration for backend
- **Standard CI/CD**: Through platform-native solutions

## Contact

If you need assistance with current deployment processes, refer to:
- `/DEPLOYMENT.md` - Current deployment documentation
- `/CLAUDE.md` - Development notes and current architecture