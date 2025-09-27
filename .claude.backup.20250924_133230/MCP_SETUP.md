# MCP Configuration for aclue Project

## Overview
This directory contains Model Context Protocol (MCP) configuration for integrating deployment management platforms with AI development tools, specifically Claude Code. Supports both Vercel (frontend) and Railway (backend) deployment management.

## Configuration Files

### mcp.json
Primary MCP server configuration for the aclue project:

**Vercel Configuration (Frontend)**:
- **Project ID**: `prj_sdJnObPzA8DJNqXyziukom25tqlJ`
- **Organisation ID**: `team_y92C6ejUue5Xhz3Hdu4eHkN8`
- **Production Domain**: `aclue.app`

**Railway Configuration (Backend)**:
- **Project**: `aclue-backend`
- **Service**: `aclue-backend`
- **Environment**: `production`
- **Backend URL**: `https://aclue-backend-production.up.railway.app`

## MCP Capabilities

### Vercel MCP Server
- Frontend deployment management and monitoring
- Environment variable configuration
- Build log access
- Project configuration updates

### Railway MCP Server
- Backend deployment management
- Service monitoring and health checks
- Environment variable management
- Container logs access
- Database management integration

## Authentication

### Vercel MCP Authentication
MCP requires Vercel authentication to access project resources. Authentication tokens should be stored securely and not committed to version control.

### Railway MCP Authentication
Railway MCP uses the Railway CLI authentication. Ensure the Railway CLI is authenticated with `railway login` before using MCP features.

## Usage with Claude Code
The configuration enables Claude Code to:

### Frontend (Vercel)
1. Monitor Vercel deployment status
2. Access build logs for debugging
3. Manage environment variables
4. Trigger deployments when needed

### Backend (Railway)
1. Monitor Railway service health and deployments
2. Access container logs for debugging
3. Manage environment variables
4. Monitor database connections
5. Scale services as needed

## Security Notes
- Authentication files (`auth.json`, `tokens.json`) are excluded from git
- MCP configuration files are included for transparency
- Only project-specific, non-sensitive data is stored in configuration

## Integration Status

### Vercel MCP
✅ MCP configuration files created
✅ Git ignore rules updated
✅ Project-specific Vercel MCP URL configured
⏳ Authentication setup required

### Railway MCP
✅ Railway MCP server configuration added
✅ Railway CLI authentication verified
✅ Project information configured
✅ Capabilities documented
⏳ MCP server testing required

## Next Steps

### Vercel MCP
1. Authenticate with Vercel through MCP client
2. Test MCP connection and capabilities
3. Verify deployment management functions

### Railway MCP
1. Test Railway MCP server installation (`npx @railway/mcp-server`)
2. Verify Railway CLI integration works with MCP
3. Test deployment monitoring capabilities
4. Validate environment variable management
5. Confirm container log access functionality

## Troubleshooting

### Railway MCP Issues
- Ensure Railway CLI is authenticated: `railway login`
- Verify project context: `railway status`
- Check Node.js/NPX availability for MCP server
- Note: Railway MCP is experimental - expect bugs and missing features