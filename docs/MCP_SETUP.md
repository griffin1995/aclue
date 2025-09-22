# MCP (Model Context Protocol) Server Setup for Aclue

## Overview
This document details the MCP server configuration for the Aclue project, enabling Claude Code to interact with Vercel and Railway deployment platforms.

## Installed MCP Servers

### 1. Vercel MCP Server
- **Package**: `vercel-mcp` (v1.0.7)
- **Installation**: `npm install -g vercel-mcp`
- **Purpose**: Manages Vercel deployments, environment variables, and project configuration
- **Authentication**: Uses Vercel API token

### 2. Railway MCP Server
- **Package**: `@railway/mcp-server` (latest)
- **Installation**: `npm install -g @railway/mcp-server`
- **Purpose**: Manages Railway deployments, services, environments, and logs
- **Authentication**: Uses Railway CLI authentication (already configured)

## Configuration Location
The MCP servers are configured in: `/home/jack/.claude.json`

## Configuration Structure

### Vercel MCP Configuration
```json
"vercel": {
  "type": "stdio",
  "command": "npx",
  "args": ["vercel-mcp", "VERCEL_API_KEY=<YOUR_TOKEN>"],
  "env": {}
}
```

**Key Details:**
- Uses `npx` to run the server
- API key passed as argument (required format per documentation)
- Connects to Vercel project: `prj_sdJnObPzA8DJNqXyziukom25tqlJ`
- Organisation ID: `team_y92C6ejUue5Xhz3Hdu4eHkN8`

### Railway MCP Configuration
```json
"railway": {
  "type": "stdio",
  "command": "npx",
  "args": ["-y", "@railway/mcp-server"],
  "env": {}
}
```

**Key Details:**
- Uses `npx` with `-y` flag for automatic installation
- Leverages existing Railway CLI authentication
- Project ID: `6ecc7e6d-96b8-4cf7-ab5e-9cd776d49051`
- Service ID: `877fcd1f-1430-427b-a3e7-cc192e4b605f`

## Available Tools

### Vercel MCP Tools
Based on documentation:
- `list_teams` - List Vercel teams
- `list_projects` - List Vercel projects
- `get_project` - Get project details
- `list_deployments` - List deployments
- `get_deployment` - Get deployment details
- `get_deployment_build_logs` - Get build logs
- `deploy_to_vercel` - Deploy to Vercel
- `use_vercel_cli` - Execute Vercel CLI commands

### Railway MCP Tools
Based on documentation:
- `check-railway-status` - Check Railway service status
- `list-projects` - List Railway projects
- `create-project-and-link` - Create and link new projects
- `deploy` - Deploy to Railway
- `create-environment` - Create new environments
- `list-variables` - List environment variables
- `set-variables` - Set environment variables
- `get-logs` - Retrieve service logs

## Authentication Setup

### Vercel Authentication
- **Token Location**: `/home/jack/.local/share/com.vercel.cli/auth.json`
- **User**: griffin1995
- **Status**: ✅ Authenticated

### Railway Authentication
- **CLI Status**: ✅ Authenticated
- **User**: Jack Griffin (jtgriffin95@gmail.com)
- **Method**: Railway CLI authentication

## Project Integration

The MCP servers are integrated with the Aclue project:
- **Frontend**: Deployed on Vercel at https://aclue.app
- **Backend**: Deployed on Railway at https://aclue-backend-production.up.railway.app
- **Database**: Supabase PostgreSQL (managed separately)

## Testing the Configuration

To verify MCP servers are working:

1. **Restart Claude Code** to load the new configuration
2. **Check MCP status** using the `/mcp` command in Claude Code
3. **Verify servers** appear in the MCP list

## Troubleshooting

### If Vercel MCP fails:
1. Verify API token is correct
2. Check Vercel CLI is authenticated: `vercel whoami`
3. Ensure `vercel-mcp` package is installed globally

### If Railway MCP fails:
1. Verify Railway CLI authentication: `railway whoami`
2. Ensure `@railway/mcp-server` package is installed globally
3. Check Railway project is linked in the current directory

## Security Notes

- **Never commit** API tokens to version control
- **Keep tokens secure** in local configuration files only
- **Rotate tokens** periodically for security
- **Use environment variables** where possible

## Implementation Notes

The implementation follows:
1. Official Claude MCP documentation format
2. Vercel MCP documentation at https://vercel.com/docs/mcp/vercel-mcp/tools
3. Railway MCP documentation at https://docs.railway.com/reference/mcp-server
4. Standard stdio protocol for MCP communication

Both servers are configured to work with the specific Aclue project IDs and authentication tokens, ensuring proper integration with the deployment platforms.