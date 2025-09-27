# aclue Development Workflow Guide - /start and /save Integration

## 🔄 Complete Development Lifecycle

The `/start` and `/save` commands form a comprehensive development environment management system, providing seamless session continuity and state preservation across your entire development workflow.

## 🎯 Core Workflow Patterns

### 1. Daily Development Cycle

```bash
# Morning - Start fresh or resume
/start --quick              # Uses yesterday's saved state for fast startup

# During development
# ... write code, test features, debug issues ...

# Lunch break - Preserve work
/save --stash              # Quick stash and shutdown

# After lunch - Resume exactly where you left off
/start --quick             # Restores stashed state

# End of day - Complete shutdown
/save --commit --clean     # Commit work, clean resources, preserve state
```

### 2. Feature Development Workflow

```bash
# Start new feature branch
git checkout -b feature/new-authentication
/start                     # Fresh environment for new feature

# Development iterations
# ... implement feature ...
/save --status-only        # Checkpoint state without stopping

# Testing phase
/save --stash              # Save work in progress
git checkout main
/start                     # Test against main branch
/save --quick              # Quick shutdown

# Resume feature work
git checkout feature/new-authentication
git stash pop
/start --quick             # Resume with preserved context

# Feature complete
/save --commit             # Commit and preserve final state
```

### 3. Context Switching Workflow

```bash
# Working on Feature A
/save --stash              # Preserve current work

# Switch to urgent bugfix
git checkout -b hotfix/critical-bug
/start                     # Fresh environment for bugfix

# Complete bugfix
/save --commit             # Commit fix

# Return to Feature A
git checkout feature/feature-a
git stash pop
/start --quick             # Resume with saved context
```

### 4. Debugging Workflow

```bash
# Start with verbose logging
/start --verbose           # Detailed startup information

# Capture current state for analysis
/save --status-only --verbose  # Detailed state snapshot

# Try different configurations
/save --quick              # Fast shutdown
# ... modify configurations ...
/start --skip-checks       # Bypass validation for testing

# Emergency shutdown if needed
/save --force              # Immediate termination
```

## 📊 State Preservation Benefits

### What Gets Preserved

The `/save` command captures comprehensive session state that `/start` can utilize:

```json
{
  "session": {
    "lastShutdown": "2025-01-24T14:30:00Z",
    "mode": "standard",
    "cleanShutdown": true
  },
  "environment": {
    "nodeVersion": "18.20.8",
    "pythonVersion": "3.11.5",
    "workingDirectory": "/home/jack/Documents/aclue-preprod"
  },
  "services": {
    "backend": {
      "port": 8000,
      "lastHealth": "healthy",
      "environment": { /* env vars */ }
    },
    "frontend": {
      "port": 3000,
      "lastHealth": "healthy",
      "buildCache": "preserved"
    }
  },
  "git": {
    "branch": "main",
    "lastCommit": "abc123",
    "uncommittedChanges": false
  },
  "mcp": {
    "railway": { /* deployment state */ },
    "vercel": { /* deployment state */ }
  }
}
```

### Startup Optimization

When `/start --quick` detects saved state:

1. **Skip Redundant Checks** (saves 10-15s)
   - Dependency verification bypassed
   - Environment validation skipped
   - Configuration assumed valid

2. **Reuse Port Assignments** (saves 5-10s)
   - Previous ports automatically reused
   - No port conflict resolution needed
   - Service discovery accelerated

3. **Restore Environment** (saves 5-10s)
   - Environment variables restored
   - Configuration files preserved
   - Debug settings maintained

4. **Cache Utilization** (saves 20-30s)
   - Build caches preserved
   - Dependencies cached
   - Compilation artifacts reused

## 🚀 Command Combinations

### Optimal Patterns

```bash
# Standard development session
/start                     # Full startup with checks
/save --commit --clean     # Complete shutdown with cleanup

# Quick iteration cycles
/start --quick             # Fast startup
/save --quick              # Fast shutdown

# Safe experimentation
/save --status-only        # Snapshot current state
# ... experimental changes ...
/save --force              # Emergency exit if needed
/start --skip-checks       # Resume without validation

# Production preparation
/save --clean              # Clean all caches
/start --verbose           # Verify clean startup
/save --commit             # Final commit
```

### Performance Comparison

| Workflow | Without State | With Saved State | Time Saved |
|----------|--------------|------------------|------------|
| Full startup | 60-180s | 30-60s | 50-67% |
| Quick startup | 30-60s | 15-30s | 50% |
| Service restart | 45-90s | 20-40s | 55% |
| Context switch | 90-120s | 40-60s | 50-55% |

## 🎭 Workflow Scenarios

### Scenario 1: Multi-Day Feature Development

```bash
# Day 1 - Setup and initial development
/start                     # Full environment setup
# ... initial implementation ...
/save --stash --clean      # Preserve WIP state

# Day 2 - Continue development
/start --quick             # Resume with saved state (30s vs 90s)
git stash pop              # Restore work in progress
# ... continue implementation ...
/save --stash              # Quick save

# Day 3 - Testing and refinement
/start --quick             # Fast resume
git stash pop
# ... testing and debugging ...
/save --commit --clean     # Feature complete
```

### Scenario 2: Collaborative Development

```bash
# Developer A - Morning work
/start
# ... implement API endpoints ...
/save --commit             # Commit and push changes

# Developer B - Afternoon work
git pull                   # Get Developer A's changes
/start --quick             # Use cached dependencies
# ... implement frontend ...
/save --commit             # Commit and push

# Developer A - Next day
git pull                   # Get Developer B's changes
/start --quick             # Fast startup with state
```

### Scenario 3: Production Debugging

```bash
# Replicate production environment
/save --clean              # Clean local environment
/start --verbose           # Fresh start with logging
# ... reproduce issue ...

# Capture state for analysis
/save --status-only --verbose

# Try fix
# ... apply potential fix ...
/save --quick
/start --quick             # Test fix

# Deploy fix
/save --commit --clean     # Prepare for deployment
```

## 📈 Best Practices

### 1. Session Management

**DO:**
- Use `/save --commit --clean` at end of day
- Use `/save --stash` for work in progress
- Use `/start --quick` for faster resumption
- Use `/save --status-only` for state snapshots

**DON'T:**
- Use `/save --force` unless necessary
- Skip `/save` and manually kill processes
- Ignore state preservation benefits
- Commit without proper testing

### 2. Performance Optimization

```bash
# Fastest startup
/start --quick --skip-checks

# Fastest shutdown
/save --quick

# Balanced approach
/start --quick
/save --commit

# Complete cleanup
/save --clean --commit
/start --verbose
```

### 3. Error Recovery

```bash
# If /start fails
/save --force              # Force cleanup
rm -rf .claude/context/locks/*
/start --skip-checks       # Bypass validation

# If /save fails
ps aux | grep -E "node|python"
/save --force              # Emergency shutdown

# If state corrupted
rm .claude/context/session.json
/save --status-only        # Regenerate state
```

## 🔒 Safety Mechanisms

### Automatic Safeguards

1. **Process Safety**
   - Graceful termination attempted first
   - Force termination only when necessary
   - Orphaned process detection

2. **Data Safety**
   - No user code deletion
   - Git operations create backup refs
   - State files archived before overwrite

3. **Environment Safety**
   - Configuration files preserved
   - Environment variables backed up
   - Critical settings never modified

### Manual Overrides

```bash
# Preview operations
/save --dry-run
/start --help

# Force operations (use carefully)
/save --force
/start --skip-checks

# Verbose diagnostics
/save --verbose
/start --verbose
```

## 📊 Monitoring and Metrics

### Session Metrics

```bash
# View last session duration
cat .claude/context/session.json | jq .session.duration

# Check startup time
/start --verbose | grep "Total time"

# Monitor shutdown time
time /save --verbose
```

### Resource Usage

```bash
# Before cleanup
du -sh web/.next backend/__pycache__

# After cleanup
/save --clean
du -sh web/.next backend/__pycache__
```

## 🎯 Quick Reference Matrix

| Task | Command | Time | Notes |
|------|---------|------|-------|
| Start fresh | `/start` | 60-180s | Full validation |
| Start quick | `/start --quick` | 30-60s | Uses saved state |
| Save and exit | `/save` | 15-30s | Standard shutdown |
| Quick save | `/save --quick` | 5-15s | Skip checks |
| Emergency stop | `/save --force` | <5s | Last resort |
| Checkpoint only | `/save --status-only` | 5-10s | No shutdown |
| Clean exit | `/save --clean --commit` | 30-60s | End of day |

## 🚦 Status Indicators

### Healthy Workflow
```
✅ Clean startup in <60s
✅ Clean shutdown in <30s
✅ State preserved successfully
✅ No orphaned processes
✅ Cache utilization >50%
```

### Warning Signs
```
⚠️ Startup taking >3 minutes
⚠️ Shutdown requiring --force
⚠️ State preservation failures
⚠️ Repeated port conflicts
⚠️ Cache not being utilized
```

### Critical Issues
```
❌ Processes won't terminate
❌ State corruption errors
❌ Git operations failing
❌ MCP servers unavailable
❌ Disk space exhausted
```

## 📚 Related Documentation

- [/start Command Documentation](./START_COMMAND_DOCUMENTATION.md)
- [/save Command Documentation](./SAVE_COMMAND_DOCUMENTATION.md)
- [Quick Reference Guide](./SAVE_COMMAND_QUICK_REFERENCE.md)
- [Troubleshooting Guide](./SAVE_COMMAND_TROUBLESHOOTING.md)
- [Technical Architecture](./SAVE_COMMAND_TECHNICAL_ARCHITECTURE.md)

---

**Remember:** The `/start` and `/save` commands are designed to work together as a complete development environment management system. Use them consistently for the best development experience.

*Version 1.0.0 - Part of the aclue Development Environment Infrastructure*