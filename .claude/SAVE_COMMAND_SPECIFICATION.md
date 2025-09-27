# aclue /save Command Comprehensive Specification

## Overview

The `/save` slash command serves as the perfect counterpart to the existing `/start` command, providing enterprise-grade session closure, state preservation, and graceful shutdown capabilities for the aclue development environment.

## Design Philosophy

**Core Principles:**
- **Safe & Graceful**: All processes terminated safely with proper cleanup
- **State Preservation**: Complete session state saved for seamless restart
- **Zero Data Loss**: Uncommitted work automatically saved or stashed
- **Fast & Reliable**: Sub-30 second shutdown with 99%+ success rate
- **Intelligent**: Context-aware cleanup with recovery mechanisms
- **Compatible**: Perfect integration with existing `/start` command

## Command Structure

### Basic Syntax
```bash
/save [MODE] [OPTIONS] [FLAGS]
```

### Command Modes
```bash
/save                     # Full graceful shutdown with state preservation
/save --quick            # Fast shutdown (skip comprehensive checks)
/save --force            # Force shutdown (kill all processes immediately)
/save --status-only      # Save session state without shutting down
/save --dry-run          # Show what would be done without executing
```

### Command Options
```bash
# Git Operations
--commit                 # Auto-commit staged changes before shutdown
--commit-message "msg"   # Custom commit message
--stash                  # Stash uncommitted changes
--no-git                 # Skip all git operations

# Cleanup Operations  
--clean                  # Deep cleanup (caches, logs, temp files)
--preserve-logs          # Keep log files during cleanup
--preserve-cache         # Keep npm/pip caches during cleanup

# Service Management
--backend-only           # Shutdown only FastAPI backend
--frontend-only          # Shutdown only Next.js frontend
--keep-services          # Don't shutdown external services (Railway/Vercel)

# Advanced Options
--timeout 60             # Custom shutdown timeout in seconds
--verbose                # Detailed shutdown logging
--silent                 # Minimal output
--no-verify              # Skip post-shutdown verification
```

## Architecture Overview

### Core Components

1. **Process Discovery Engine**: Intelligent detection of aclue-related processes
2. **Graceful Shutdown Manager**: Orchestrates safe service termination  
3. **State Preservation System**: Captures and stores session context
4. **Resource Cleanup Engine**: Comprehensive cleanup with rollback
5. **Git Integration Manager**: Automated version control operations
6. **Health Monitoring System**: Pre/post-shutdown validation
7. **Error Recovery System**: Handles failures and stuck processes
8. **MCP Integration Layer**: Leverages existing MCP infrastructure

### File Structure
```
.claude/scripts/
├── save-command.sh         # Main slash command entry point
├── save.js                 # Core implementation (mirrors start.js)
├── save-process-manager.js # Process discovery and termination
├── save-state-manager.js   # Session state preservation
├── save-cleanup-manager.js # Resource cleanup operations
├── save-git-manager.js     # Git operations and state management
└── shared/
    ├── mcp-integration.js  # Shared MCP helper (existing)
    ├── error-recovery.js   # Shared error recovery (existing)
    └── logger.js           # Shared logging utilities (existing)
```

## Functional Specifications

### Phase 1: Pre-Shutdown Validation
```javascript
// Validate current environment state
- Check for running aclue processes
- Identify unsaved work and uncommitted changes  
- Verify MCP services are accessible
- Check for critical processes that shouldn't be terminated
- Estimate shutdown time and resource requirements
```

### Phase 2: Session State Preservation
```javascript
// Capture complete session context
- Current working directory and file states
- Running process PIDs, ports, and configurations
- Environment variables and service states
- Git branch, commits, and working tree status
- MCP server states and active connections
- User preferences and command history
```

### Phase 3: Git State Management
```javascript
// Handle version control operations
- Auto-detect staged vs unstaged changes
- Offer commit, stash, or abort options
- Generate descriptive commit messages
- Handle merge conflicts and repository states
- Preserve branch information and remote state
```

### Phase 4: Process Termination
```javascript
// Graceful shutdown sequence
1. Send SIGTERM to identified processes
2. Wait for graceful shutdown (configurable timeout)
3. Monitor process termination status
4. Escalate to SIGKILL if processes don't respond
5. Clean up process artifacts (PID files, sockets)
6. Verify port availability post-termination
```

### Phase 5: Resource Cleanup
```javascript
// Comprehensive cleanup operations
- Remove temporary files and lock files
- Clean build artifacts and cache directories
- Close database connections and file handles
- Clear memory-mapped files and shared memory
- Remove stale UNIX sockets and named pipes
- Optional cache cleanup (npm, pip, Docker)
```

### Phase 6: Service Integration
```javascript
// External service management
- Capture Railway deployment status
- Document Vercel deployment state
- Close Supabase database connections
- Preserve MCP server configurations
- Update service health monitoring
```

### Phase 7: Post-Shutdown Verification
```javascript
// Verify successful shutdown
- Confirm all processes terminated
- Validate port availability
- Check resource cleanup completion
- Verify state preservation integrity
- Test environment readiness for next startup
```

## Error Handling & Recovery

### Stuck Process Recovery
```javascript
// Multi-tier termination strategy
1. SIGTERM with 10s timeout
2. SIGTERM with 30s timeout  
3. SIGKILL with forced cleanup
4. Manual intervention prompts
5. System-level process cleanup
```

### Git Conflict Resolution
```javascript
// Automated conflict handling
- Detect merge conflicts and dirty working tree
- Offer interactive resolution options
- Automatic stashing with descriptive names
- Rollback mechanisms for failed operations
- Branch state preservation
```

### Resource Cleanup Failures
```javascript
// Resilient cleanup system
- Retry failed operations with exponential backoff
- Skip non-critical cleanup on persistent failures
- Log cleanup failures for manual resolution
- Preserve partial cleanup state
- Generate recovery instructions
```

### Network Service Failures
```javascript
// Service integration error handling
- Handle Railway/Vercel API timeouts gracefully
- Preserve local state even if remote services fail
- Provide manual intervention instructions
- Cache service states locally as backup
```

## State Preservation Format

### Session Context Schema
```json
{
  "timestamp": "2025-01-24T15:30:00.000Z",
  "version": "1.0.0",
  "projectRoot": "/home/jack/Documents/aclue-preprod",
  "session": {
    "id": "session_20250124_153000",
    "duration": 7200000,
    "shutdownReason": "user_initiated"
  },
  "processes": {
    "backend": {
      "pid": 12345,
      "port": 8000,
      "status": "running",
      "uptime": 3600000,
      "healthEndpoint": "/health"
    },
    "frontend": {
      "pid": 12346,
      "port": 3000,
      "status": "running",
      "uptime": 3600000
    }
  },
  "git": {
    "branch": "main",
    "commit": "abc123def",
    "status": "clean",
    "staged": [],
    "unstaged": [],
    "untracked": []
  },
  "services": {
    "railway": {
      "status": "deployed",
      "url": "https://aclue-backend-production.up.railway.app",
      "lastDeployment": "2025-01-24T10:00:00.000Z"
    },
    "vercel": {
      "status": "deployed", 
      "url": "https://aclue.app",
      "lastDeployment": "2025-01-24T09:00:00.000Z"
    }
  },
  "environment": {
    "variables": ["NODE_ENV", "SUPABASE_URL"],
    "workingDirectory": "/home/jack/Documents/aclue-preprod",
    "nodeVersion": "18.20.8",
    "pythonVersion": "3.11.5"
  },
  "cleanup": {
    "performed": true,
    "operations": ["temp_files", "lock_files", "log_rotation"],
    "skipped": ["npm_cache", "pip_cache"],
    "errors": []
  }
}
```

### MCP Integration State
```json
{
  "mcpServers": {
    "filesystem": {
      "status": "active",
      "lastActivity": "2025-01-24T15:29:45.000Z",
      "operations": 145
    },
    "railway": {
      "status": "active",
      "lastDeploymentCheck": "2025-01-24T15:28:00.000Z"
    },
    "vercel": {
      "status": "active",
      "lastStatusCheck": "2025-01-24T15:25:00.000Z"
    },
    "memory": {
      "status": "active",
      "entitiesStored": 23,
      "lastUpdate": "2025-01-24T15:29:30.000Z"
    }
  }
}
```

## Integration Points

### Perfect /start Compatibility
```javascript
// State restoration for next startup
- Process configuration restoration
- Environment variable preservation  
- Service state awareness
- MCP server configuration
- Git state continuation
- Port preference memory
```

### MCP Service Integration
```javascript
// Leverage existing MCP infrastructure
- Use filesystem MCP for file operations
- Railway MCP for deployment status
- Vercel MCP for frontend monitoring
- Memory MCP for persistent state storage
- Puppeteer MCP for final health checks
```

### Shared Component Reuse
```javascript
// Reuse existing /start infrastructure
- mcp-integration.js for MCP operations
- error-recovery.js for error handling
- logger.js for consistent logging
- Configuration files and helpers
```

## Performance Requirements

### Execution Time Targets
- **Quick Mode**: < 15 seconds
- **Standard Mode**: < 30 seconds  
- **Deep Clean Mode**: < 60 seconds
- **Force Mode**: < 5 seconds

### Resource Efficiency
- **Memory Usage**: < 50MB peak
- **CPU Usage**: < 10% during shutdown
- **Disk I/O**: Minimal during normal operation
- **Network**: Only for service status checks

### Reliability Metrics
- **Process Termination**: 99.5% success rate
- **State Preservation**: 100% data integrity
- **Resource Cleanup**: 99% completion rate
- **Git Operations**: 100% safety (no data loss)

## Command Examples

### Basic Usage
```bash
# Standard shutdown with state preservation
/save

# Quick shutdown for urgent situations  
/save --quick

# Force shutdown for stuck processes
/save --force

# Save state without shutting down
/save --status-only
```

### Git Integration Examples
```bash
# Commit changes before shutdown
/save --commit --commit-message "WIP: feature implementation"

# Stash uncommitted changes
/save --stash

# Skip git operations entirely
/save --no-git
```

### Cleanup Examples
```bash
# Deep cleanup including caches
/save --clean

# Preserve logs during cleanup
/save --clean --preserve-logs

# Clean shutdown with custom timeout
/save --timeout 45 --verbose
```

### Service Management Examples  
```bash
# Shutdown only backend service
/save --backend-only

# Shutdown with external service preservation
/save --keep-services

# Dry run to see planned operations
/save --dry-run --verbose
```

## Output Format

### Standard Output
```
🛑 aclue Development Environment Shutdown
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⏳ Phase 1: Pre-shutdown validation...
   ✅ Process discovery complete (2 processes found)  
   ✅ Git status clean (no uncommitted changes)
   ✅ MCP services responsive

⏳ Phase 2: Session state preservation...
   ✅ Process states captured
   ✅ Environment context saved
   ✅ Service states documented

⏳ Phase 3: Process termination... 
   ✅ Backend (PID 12345) terminated gracefully
   ✅ Frontend (PID 12346) terminated gracefully
   ✅ All ports released

⏳ Phase 4: Resource cleanup...
   ✅ Temporary files removed (45 files)
   ✅ Lock files cleared (3 files)
   ✅ Log rotation completed

⏳ Phase 5: Post-shutdown verification...
   ✅ All processes terminated
   ✅ Ports 3000, 8000 available
   ✅ State preservation verified

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎉 Shutdown completed successfully in 23.4s

📊 Session Summary:
   Duration: 2h 15m 30s
   Processes terminated: 2
   Files cleaned: 45
   State preserved: ✅

🚀 Ready for next /start command
   Preserved state will enable faster startup
   Estimated next startup time: ~45s
```

### JSON Output (with --json flag)
```json
{
  "status": "success",
  "duration": 23.4,
  "timestamp": "2025-01-24T15:30:23.400Z",
  "phases": {
    "validation": { "status": "success", "duration": 2.1 },
    "preservation": { "status": "success", "duration": 3.2 },
    "termination": { "status": "success", "duration": 8.7 },
    "cleanup": { "status": "success", "duration": 6.3 },
    "verification": { "status": "success", "duration": 3.1 }
  },
  "processes": {
    "terminated": 2,
    "forced": 0,
    "failed": 0
  },
  "cleanup": {
    "files": 45,
    "size": "15.2MB",
    "errors": []
  },
  "nextStartup": {
    "estimatedTime": 45,
    "optimizations": ["preserved_state", "clean_environment"]
  }
}
```

## Testing & Validation

### Unit Test Coverage
- Process discovery accuracy
- Graceful termination logic
- State preservation integrity  
- Git operations safety
- Cleanup completeness
- Error recovery mechanisms

### Integration Test Scenarios
- Full startup/shutdown cycle
- Force shutdown with stuck processes
- Git conflict resolution
- MCP service integration
- Network failure handling
- Resource constraint testing

### Performance Benchmarks
- Shutdown time under various loads
- Memory usage during cleanup
- State preservation accuracy
- Recovery from failures
- Compatibility with /start command

## Deployment & Configuration

### Installation Requirements
```bash
# Prerequisites (same as /start)
- Node.js >= 18.0.0
- Python >= 3.8.0
- Git
- MCP servers configured

# No additional dependencies beyond existing /start requirements
```

### Configuration Files
```bash
# Leverage existing configuration
.claude/settings.optimized.json     # MCP settings
.claude/mcp.optimized.json         # MCP server config
.claude/slash-commands.json        # Command registration
```

### Environment Variables
```bash
# Optional configuration
ACLUE_SAVE_TIMEOUT=30              # Default shutdown timeout
ACLUE_SAVE_FORCE_TIMEOUT=5         # Force shutdown timeout  
ACLUE_SAVE_STATE_DIR=.claude/state # State preservation directory
ACLUE_SAVE_CLEANUP_LEVEL=standard  # standard|deep|minimal
```

## Security Considerations

### Process Termination Safety
- Only terminate processes owned by current user
- Validate process ownership before termination
- Prevent termination of critical system processes
- Secure handling of process credentials

### State Preservation Security  
- Sanitize sensitive data from preserved state
- Encrypt state files containing secrets
- Validate state file integrity on restoration
- Secure temporary file handling during cleanup

### Git Operation Security
- Validate git repository integrity
- Prevent malicious commit message injection
- Secure handling of git credentials
- Validate stash operations for safety

## Troubleshooting Guide

### Common Issues & Solutions

1. **Stuck Process Won't Terminate**
   ```bash
   # Automatic escalation sequence
   /save --force                    # Force immediate termination
   /save --verbose                  # Detailed process information
   ```

2. **State Preservation Fails**
   ```bash
   # Fallback options
   /save --no-state                 # Skip state preservation
   /save --minimal                  # Basic state only
   ```

3. **Git Operations Blocked**
   ```bash
   # Git-specific options  
   /save --no-git                   # Skip git entirely
   /save --force --no-git           # Force without git
   ```

4. **Cleanup Permission Errors**
   ```bash
   # Permission handling
   /save --preserve-logs            # Skip log cleanup
   /save --minimal-cleanup          # Essential cleanup only
   ```

5. **MCP Service Unresponsive**
   ```bash
   # Service bypass options
   /save --no-mcp                   # Skip MCP integration
   /save --offline                  # Offline shutdown mode
   ```

## Future Enhancements

### Phase 2 Features (Future)
- **Docker Integration**: Container cleanup and state preservation
- **Database Snapshots**: Automated database state capture
- **Log Analytics**: Shutdown pattern analysis and optimization
- **Remote State Sync**: Cloud-based state preservation backup
- **Team Collaboration**: Shared shutdown notifications and state

### Advanced Features (Future)
- **Predictive Shutdown**: ML-based optimal shutdown timing
- **Resource Optimization**: Dynamic cleanup based on system resources  
- **Health Scoring**: Shutdown health metrics and recommendations
- **Integration Webhooks**: External service notifications
- **Batch Operations**: Multiple project shutdown coordination

## Success Metrics

### Operational Metrics
- **Shutdown Success Rate**: Target 99.5%
- **Average Shutdown Time**: Target < 30s
- **State Preservation Accuracy**: Target 100%
- **Zero Data Loss**: Target 100%
- **User Satisfaction**: Target > 95%

### Technical Metrics  
- **Process Termination Success**: Target 99.9%
- **Resource Cleanup Completion**: Target 99%
- **Git Operation Safety**: Target 100%
- **MCP Integration Reliability**: Target 98%
- **Error Recovery Success**: Target 90%

---

## Implementation Priority

### Phase 1: Core Implementation
1. **Basic Process Termination** (Week 1)
2. **State Preservation System** (Week 1-2)
3. **Resource Cleanup Engine** (Week 2)
4. **Git Integration** (Week 2-3)
5. **Error Recovery** (Week 3)

### Phase 2: Advanced Features
1. **MCP Integration** (Week 3-4)
2. **Performance Optimization** (Week 4)
3. **Comprehensive Testing** (Week 4-5)
4. **Documentation & Examples** (Week 5)

### Phase 3: Polish & Deployment
1. **User Experience Refinement** (Week 5-6)
2. **Production Testing** (Week 6)
3. **Final Integration Testing** (Week 6)
4. **Release & Documentation** (Week 6)

This specification provides a comprehensive foundation for implementing the `/save` command as the perfect counterpart to the existing `/start` command, ensuring seamless development workflow management for the aclue project.