# /save Command - Troubleshooting Guide

## 🚨 Common Issues and Solutions

### 1. Process Won't Terminate Gracefully

**Symptoms:**
- Command hangs during shutdown phase
- "Waiting for process termination..." message persists
- Processes remain active after command completion

**Solutions:**

```bash
# Solution 1: Use force mode for immediate termination
/save --force

# Solution 2: Manually check and kill processes
ps aux | grep -E "node|python|uvicorn"
kill -9 <PID>

# Solution 3: Use quick mode to skip some checks
/save --quick
```

**Root Cause:**
- Process ignoring SIGTERM signals
- Child processes not properly managed
- Resource locks preventing termination

---

### 2. Git Operations Failing

**Symptoms:**
- "Git operation failed" error
- Unable to commit or stash changes
- Repository state conflicts

**Solutions:**

```bash
# Solution 1: Check git status first
git status
git diff

# Solution 2: Use stash instead of commit
/save --stash

# Solution 3: Skip git operations entirely
/save --quick  # or just /save without git flags

# Solution 4: Manual git cleanup
git reset --soft HEAD
/save
```

**Root Cause:**
- Merge conflicts present
- Unstaged changes in ignored files
- Git hooks preventing commits

---

### 3. State Preservation Fails

**Symptoms:**
- "Failed to save session state" error
- Missing .claude/context directory
- Permission denied errors

**Solutions:**

```bash
# Solution 1: Fix permissions
chmod -R 755 .claude/
mkdir -p .claude/context

# Solution 2: Use verbose mode for diagnostics
/save --verbose

# Solution 3: Clear corrupted state files
rm -rf .claude/context/*.json
/save

# Solution 4: Run with elevated permissions (last resort)
sudo /save
```

**Root Cause:**
- Insufficient file permissions
- Disk space issues
- Corrupted state files

---

### 4. MCP Server Connection Issues

**Symptoms:**
- "MCP server unavailable" warnings
- Service status capture fails
- Incomplete state preservation

**Solutions:**

```bash
# Solution 1: Check MCP configuration
cat .claude/mcp-settings.json

# Solution 2: Continue without MCP
/save --quick  # Skips optional MCP operations

# Solution 3: Restart MCP servers
# Check Railway/Vercel CLI login status
railway status
vercel whoami

# Solution 4: Use dry-run to diagnose
/save --dry-run --verbose
```

**Root Cause:**
- MCP servers not running
- Authentication expired
- Network connectivity issues

---

### 5. Cleanup Operations Timeout

**Symptoms:**
- Command hangs during cleanup phase
- "Cleaning resources..." message persists
- Excessive execution time

**Solutions:**

```bash
# Solution 1: Skip cleanup
/save --quick  # or just /save without --clean

# Solution 2: Run cleanup separately
/save --status-only --clean

# Solution 3: Manual cleanup
rm -rf web/.next/cache
rm -rf backend/__pycache__
find . -name "*.tmp" -delete

# Solution 4: Use force mode
/save --force  # Skips cleanup entirely
```

**Root Cause:**
- Large cache directories
- File system locks
- Slow disk I/O

---

### 6. Command Not Found

**Symptoms:**
- "/save: command not found"
- "Unknown slash command"
- Command not recognized

**Solutions:**

```bash
# Solution 1: Check command registration
cat .claude/slash-commands.json | grep save

# Solution 2: Use alternative aliases
/stop
/shutdown
/halt

# Solution 3: Execute directly
node .claude/scripts/save.js

# Solution 4: Re-register command
# Restart Claude Code session
```

**Root Cause:**
- Command not registered
- Claude Code session issue
- Configuration corruption

---

### 7. Partial Shutdown

**Symptoms:**
- Some processes remain active
- Incomplete termination
- Mixed success/failure status

**Solutions:**

```bash
# Solution 1: Identify remaining processes
ps aux | grep -E "3000|8000"
lsof -i :3000
lsof -i :8000

# Solution 2: Force complete shutdown
/save --force

# Solution 3: Manual cleanup
pkill -f "node.*next"
pkill -f "python.*uvicorn"

# Solution 4: Verify and retry
/save --dry-run  # Check what would happen
/save --verbose  # Detailed execution
```

**Root Cause:**
- Orphaned child processes
- Process spawning during shutdown
- Race conditions

---

### 8. Session State Corruption

**Symptoms:**
- Invalid JSON in session files
- "Cannot read session state" errors
- /start fails to use saved state

**Solutions:**

```bash
# Solution 1: Clear corrupted state
rm .claude/context/session.json
rm .claude/context/latest

# Solution 2: Create fresh state
/save --status-only

# Solution 3: Validate JSON manually
cat .claude/context/session.json | jq .

# Solution 4: Use backup state
ls .claude/context/archive/
cp .claude/context/archive/session_*.json .claude/context/session.json
```

**Root Cause:**
- Interrupted write operation
- Disk errors
- Concurrent access

---

## 🔍 Diagnostic Commands

### Check Process Status
```bash
# View all related processes
ps aux | grep -E "aclue|node|python|uvicorn"

# Check port usage
lsof -i :3000
lsof -i :8000
netstat -tulpn | grep -E "3000|8000"

# Process tree view
pstree -p | grep -E "node|python"
```

### Verify File System
```bash
# Check permissions
ls -la .claude/
ls -la .claude/context/

# Disk space
df -h .
du -sh .claude/

# File locks
lsof | grep .claude
```

### Git Repository Status
```bash
# Full status check
git status --porcelain
git stash list
git log --oneline -5

# Check for locks
ls .git/*.lock
```

### MCP Server Status
```bash
# Railway status
railway status
railway whoami

# Vercel status
vercel whoami
vercel ls

# Check MCP configuration
cat .claude/mcp-settings.json
```

---

## 🎯 Quick Fixes

### Emergency Shutdown
```bash
/save --force
```

### Skip Everything
```bash
/save --quick --force
```

### State Only (No Shutdown)
```bash
/save --status-only
```

### Preview Without Action
```bash
/save --dry-run --verbose
```

---

## 📊 Error Codes and Meanings

| Code | Meaning | Solution |
|------|---------|----------|
| 0 | Success | None needed |
| 1 | Partial success | Check logs |
| 2 | Process termination failed | Use --force |
| 3 | State preservation failed | Check permissions |
| 4 | Critical error | See error message |

---

## 🔄 Recovery Procedures

### After Failed Shutdown

1. **Assess the situation:**
```bash
ps aux | grep -E "node|python"
/save --dry-run
```

2. **Force cleanup:**
```bash
/save --force
```

3. **Verify cleanup:**
```bash
lsof -i :3000
lsof -i :8000
```

4. **Fresh start:**
```bash
/start --skip-checks
```

### After State Corruption

1. **Backup current state:**
```bash
cp -r .claude/context .claude/context.backup
```

2. **Clear corrupted files:**
```bash
rm .claude/context/*.json
```

3. **Regenerate state:**
```bash
/save --status-only
```

4. **Verify recovery:**
```bash
cat .claude/context/session.json | jq .
```

---

## 🛠️ Advanced Debugging

### Enable Debug Logging
```bash
# Set environment variable
export DEBUG=save:*

# Run with verbose output
/save --verbose
```

### Trace Execution
```bash
# Use Node.js debugging
node --inspect .claude/scripts/save.js --verbose
```

### Monitor in Real-time
```bash
# In one terminal
tail -f .claude/logs/save.log

# In another terminal
/save --verbose
```

---

## 📞 Getting Help

### Self-Diagnosis
```bash
# Run comprehensive diagnostic
/save --dry-run --verbose > save-diagnostic.log 2>&1
```

### Information to Provide
- Full error message
- Command used
- Output of `ps aux | grep -E "node|python"`
- Content of `.claude/logs/save.log`
- Git status output

### Quick Support Checklist
- [ ] Tried force mode?
- [ ] Checked file permissions?
- [ ] Verified disk space?
- [ ] Tested with dry-run?
- [ ] Reviewed verbose output?

---

## 🎓 Prevention Tips

1. **Regular Maintenance:**
   - Use `/save --clean` weekly
   - Clear old logs monthly
   - Update dependencies regularly

2. **Best Practices:**
   - Always commit or stash before major changes
   - Use dry-run to preview complex operations
   - Keep verbose logs for debugging

3. **Session Hygiene:**
   - End sessions with `/save --commit --clean`
   - Start fresh with `/start --quick`
   - Don't force-kill unless necessary

---

**Remember:** The `/save` command is designed to be safe and recoverable. When in doubt, use `--dry-run` first, then `--verbose` for details, and `--force` only as a last resort.

*For additional help, see [SAVE_COMMAND_DOCUMENTATION.md](./SAVE_COMMAND_DOCUMENTATION.md)*