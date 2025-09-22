# Vercel MCP Configuration for Aclue Project

## Overview
This directory contains Model Context Protocol (MCP) configuration for integrating Vercel deployment management with AI development tools, specifically Claude Code.

## Configuration Files

### mcp.json
Primary MCP server configuration for the Aclue project:
- **Vercel Project ID**: `prj_sdJnObPzA8DJNqXyziukom25tqlJ`
- **Organisation ID**: `team_y92C6ejUue5Xhz3Hdu4eHkN8`
- **Production Domain**: `aclue.app`

## MCP Capabilities
- Deployment management and monitoring
- Environment variable configuration
- Build log access
- Project configuration updates

## Authentication
MCP requires Vercel authentication to access project resources. Authentication tokens should be stored securely and not committed to version control.

## Usage with Claude Code
The configuration enables Claude Code to:
1. Monitor deployment status
2. Access build logs for debugging
3. Manage environment variables
4. Trigger deployments when needed

## Security Notes
- Authentication files (`auth.json`, `tokens.json`) are excluded from git
- MCP configuration files are included for transparency
- Only project-specific, non-sensitive data is stored in configuration

## Integration Status
✅ MCP configuration files created
✅ Git ignore rules updated
✅ Project-specific Vercel MCP URL configured
⏳ Authentication setup required

## Next Steps
1. Authenticate with Vercel through MCP client
2. Test MCP connection and capabilities
3. Verify deployment management functions