# aclue /start Command - Comprehensive Development Environment

The `/start` command is a comprehensive development environment launcher for the aclue platform that automates the complete setup and launch process for both frontend and backend services. Works seamlessly with the `/save` command for complete session management.

## 🎯 Overview

This command provides a one-stop solution for:
- **Environment validation** and prerequisite checking
- **Dependency management** and installation
- **Configuration file generation** from templates
- **Service health monitoring** and port conflict resolution
- **Development server startup** with process management
- **Browser automation** for quick access to development URLs
- **Production deployment monitoring** via MCP integrations
- **Session restoration** from `/save` preserved state

## 🏗️ Architecture

### Core Components

1. **Main Implementation** (`scripts/start.js`)
   - Node.js-based orchestrator
   - Comprehensive service management
   - Real-time process monitoring
   - Advanced error handling and recovery

2. **Shell Wrapper** (`scripts/start-command.sh`)  
   - Bash-based command-line interface
   - Signal handling and process cleanup
   - Argument parsing and validation
   - Integration with existing project scripts

3. **MCP Integration** (`scripts/mcp-integration.js`)
   - Railway deployment monitoring
   - Vercel deployment status checking
   - Enhanced browser automation with Playwright
   - Advanced file operations

4. **Configuration** (`slash-commands.json`, `workflows.json`)
   - Command definitions and parameters
   - Integration with Claude Code slash command system
   - Workflow automation and scheduling

### Integration Points

```
aclue /start Command Architecture

┌─────────────────────────────────────────┐
│            Claude Code                  │
│         Slash Command System            │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│         start-command.sh                │
│    • Argument parsing                   │
│    • Signal handling                    │
│    • Process management                 │
└─────────────┬───────────────────────────┘
              │
┌─────────────▼───────────────────────────┐
│           start.js                      │
│    • Environment validation            │
│    • Service orchestration             │
│    • Health monitoring                 │
│    • Status reporting                  │
└─────────────┬───────────────────────────┘
              │
    ┌─────────┼─────────┐
    │         │         │
┌───▼──┐ ┌───▼──┐ ┌────▼────┐
│ MCP  │ │ Existing│ │ System  │
│Tools │ │Scripts │ │Commands │
└──────┘ └───────┘ └─────────┘
```

## 🚀 Usage

### Basic Usage

```bash
# Full startup with all services
/start

# Quick startup (skip dependency checks)  
/start --quick

# Verbose logging
/start --verbose

# Help information
/start --help
```

### Service-Specific Startup

```bash
# Backend only (FastAPI server)
/start --backend-only

# Frontend only (Next.js dev server)
/start --frontend-only
```

### Advanced Options

```bash
# Skip all validation checks
/start --skip-checks

# No browser launch
/start --no-browser

# Combined options
/start --quick --verbose --no-browser
```

### Integration with /save Command

```bash
# Complete development session workflow
/start                    # Start development environment
# ... development work ...
/save --commit --clean    # Save state and shutdown gracefully

# Next session - fast restart with preserved state
/start --quick           # Utilizes saved state for faster startup
```

The `/start` command automatically detects and utilizes session state preserved by the `/save` command, enabling:
- **Faster startup times** by skipping redundant checks
- **Automatic port reuse** from previous session
- **Environment restoration** with preserved configurations
- **Context continuity** across development sessions

## 🔧 Command Parameters

| Parameter | Alias | Description | Default |
|-----------|-------|-------------|---------|
| `--quick` | `-q` | Skip dependency installation checks | `false` |
| `--verbose` | `-v` | Enable detailed logging | `false` |
| `--skip-checks` | | Skip environment validation | `false` |
| `--no-browser` | | Don't launch browser | `false` |
| `--backend-only` | | Start only backend service | `false` |
| `--frontend-only` | | Start only frontend service | `false` |
| `--help` | `-h` | Show detailed help | `false` |

## 📋 Startup Phases

### Phase 1: Environment Validation (10-15s)
- Project directory structure validation
- Required binary verification (Node.js 18+, Python 3.8+, Git)
- Version compatibility checking
- Working directory confirmation

### Phase 2: Project Setup (30-120s)
- **Backend Setup:**
  - Python virtual environment creation/validation
  - Requirements.txt dependency installation
  - .env file generation from template
  
- **Frontend Setup:**
  - Node.js dependencies installation/update
  - .env.local file generation
  - Next.js configuration validation

### Phase 3: Service Health Checks (5-10s)
- Port availability checking (3000, 8000)
- Process conflict detection and resolution
- Database connectivity validation
- Production deployment status (via MCP)

### Phase 4: Server Startup (10-20s)
- **Backend:** FastAPI server with Uvicorn (port 8000)
- **Frontend:** Next.js development server (port 3000)
- Process monitoring and health validation
- Real-time log streaming (optional)

### Phase 5: Service Verification (5-10s)
- HTTP health endpoint testing
- API documentation accessibility
- Frontend page load validation
- Service readiness confirmation

### Phase 6: Browser Launch (2-5s)
- Automated browser opening (optional)
- Multiple URL launching:
  - Frontend: http://localhost:3000
  - API Docs: http://localhost:8000/docs
- Playwright MCP integration (when available)

### Phase 7: Status Report (1-2s)
- Comprehensive service status dashboard
- Quick access links and commands
- Process monitoring information
- Next steps guidance

## 🛠️ MCP Integration

The command leverages Model Context Protocol (MCP) servers for enhanced functionality:

### Railway MCP Integration
- Backend deployment monitoring
- Service logs retrieval
- Environment variable management
- Container health checking

```javascript
// Example Railway integration
await railwayMcp.checkStatus();
await railwayMcp.getLogs('aclue-backend', 'production');
```

### Vercel MCP Integration  
- Frontend deployment status
- Build logs access
- Environment configuration
- Performance monitoring

```javascript
// Example Vercel integration
await vercelMcp.getDeployment('aclue-frontend');
await vercelMcp.getDeploymentEvents();
```

### Filesystem MCP Integration
- Enhanced file operations
- Configuration file management
- Project structure validation
- Code editing capabilities

### Playwright MCP Integration
- Advanced browser automation
- Screenshot capture
- End-to-end testing setup
- UI interaction recording

## 📊 Status Reporting

The command provides a comprehensive status dashboard:

```
🎉 aclue Development Environment Ready!
⏱️  Total startup time: 45.2s

🔧 Service Status:
   ✅ Backend       http://localhost:8000 (PID: 12345)
   ✅ Frontend      http://localhost:3000 (PID: 12346)

🔗 Quick Links:
   Frontend:     http://localhost:3000
   API Docs:     http://localhost:8000/docs
   Health:       http://localhost:8000/health

⌨️  Useful Commands:
   Stop all:     Ctrl+C (in this terminal)
   Backend logs: tail -f backend/logs/*.log
   Frontend logs: npm run dev (in web/)

🚀 Next Steps:
   1. Visit http://localhost:3000 to see the app
   2. Explore API at http://localhost:8000/docs
   3. Check the Quick Start Guide for testing
```

## 🔍 Health Monitoring

### Local Service Health
- HTTP endpoint testing for backend (/health)
- Frontend accessibility validation
- Database connection verification
- Service responsiveness checking

### Production Deployment Health
- Railway service status (via MCP)
- Vercel deployment status (via MCP)
- Database connectivity monitoring
- Performance metrics collection

## 🚨 Error Handling & Recovery

### Port Conflicts
- Automatic detection of port usage
- Interactive process termination prompts
- Graceful service restart
- Alternative port suggestions

### Dependency Issues
- Automatic dependency installation
- Version compatibility checking
- Missing file recreation
- Environment setup validation

### Service Failures
- Process crash detection
- Automatic restart mechanisms
- Error log collection
- Recovery suggestions

## 🧪 Testing

### Manual Testing
```bash
# Test full startup
/start --verbose

# Test individual services
/start --backend-only
/start --frontend-only

# Test error conditions
/start --skip-checks  # Should still validate critical items
```

### Automated Testing
```bash
# Run integration tests
cd .claude/scripts
node start.js --quick --no-browser --verbose

# Verify MCP integration
node mcp-integration.js
```

## 🔧 Configuration

### Environment Files Generated

**Backend (.env)**
```env
PROJECT_NAME="aclue API"
ENVIRONMENT=development
DEBUG=true
SECRET_KEY=dev-secret-key-change-in-production
SUPABASE_URL=https://xchsarvamppwephulylt.supabase.co
ALLOWED_HOSTS=["http://localhost:3000"]
ENABLE_REGISTRATION=true
```

**Frontend (.env.local)**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WEB_URL=http://localhost:3000
NEXT_PUBLIC_MAINTENANCE_MODE=false
```

### MCP Configuration
The command reads from `.claude/mcp.optimized.json` for server definitions and capabilities.

## 📈 Performance

### Timing Estimates
- **Quick mode:** 30-60 seconds
- **Full mode:** 60-180 seconds  
- **First run:** 120-300 seconds (includes dependency installation)

### Optimization Features
- Parallel dependency installation
- Smart caching of validated environments
- Incremental health checking
- Efficient process management

## 🔒 Security

### Best Practices
- Environment files are not committed to Git
- Default secrets are marked for production change
- Port binding is restricted to localhost
- Process isolation and cleanup

### Production Considerations
- Never use development secrets in production
- Validate all environment variables before deployment
- Monitor service health continuously
- Implement proper logging and alerting

## 🐛 Troubleshooting

### Common Issues

**"Port already in use"**
```bash
# Command will offer to kill conflicting processes
/start
# Or manually check ports:
lsof -i :3000 :8000
```

**"Dependencies not installed"**
```bash
# Use full installation mode
/start  # (without --quick)
```

**"Environment files missing"**
```bash
# Command automatically recreates from templates
# Or manually check:
ls backend/.env web/.env.local
```

**"MCP integration failed"**
```bash
# Check MCP configuration
cat .claude/mcp.optimized.json
node .claude/scripts/mcp-integration.js
```

### Debug Mode
```bash
# Enable maximum verbosity
/start --verbose --skip-checks
```

## 🔄 Integration with Existing Tools

### Quick Start Guide Integration
- Automates the manual steps from `QUICK_START_GUIDE.md`
- Uses the same configuration patterns
- Maintains compatibility with manual setup

### Backend start.sh Integration
- Leverages existing `backend/start.sh` script
- Respects environment variable settings
- Maintains production deployment compatibility

### Git Workflow Integration
- Respects existing repository structure
- Works with current branch configurations
- Supports development and production modes

## 📚 Related Documentation

- **Quick Start Guide:** `/home/jack/Documents/aclue-preprod/QUICK_START_GUIDE.md`
- **Project Instructions:** `/home/jack/Documents/aclue-preprod/CLAUDE.md`
- **MCP Setup:** `/home/jack/Documents/aclue-preprod/.claude/MCP_SETUP.md`
- **Backend Documentation:** `/home/jack/Documents/aclue-preprod/backend/README.md`
- **Frontend Documentation:** `/home/jack/Documents/aclue-preprod/web/README.md`

## 🎯 Next Steps

1. **Test the implementation:**
   ```bash
   /start --verbose
   ```

2. **Customize for your environment:**
   - Update Supabase credentials in generated .env files
   - Configure MCP servers in `mcp.optimized.json`
   - Adjust service ports if needed

3. **Integrate with your workflow:**
   - Add to your development routine
   - Create custom aliases
   - Set up monitoring dashboards

4. **Contribute improvements:**
   - Report issues and enhancement requests
   - Submit performance optimizations
   - Extend MCP integrations

The `/start` command represents a comprehensive solution for aclue development environment management, designed for efficiency, reliability, and developer experience.