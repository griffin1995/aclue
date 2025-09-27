# /save Command - Quick Reference Guide

## 🚀 Quick Start

```bash
/save              # Standard graceful shutdown
/save --quick      # Fast shutdown (skip checks)
/save --force      # Emergency shutdown
```

## 📋 Common Use Cases

### End of Day
```bash
/save --commit --clean
# Commits changes, cleans resources, preserves state
```

### Quick Context Switch
```bash
/save --stash --quick
# Stash work and shutdown quickly
```

### Emergency Shutdown
```bash
/save --force
# Immediate termination (use as last resort)
```

### Save State Only
```bash
/save --status-only
# Capture state without shutdown
```

## ⚙️ All Options

| Option | Short | Description | Time |
|--------|-------|-------------|------|
| `--quick` | `-q` | Skip comprehensive checks | 5-15s |
| `--force` | `-f` | Force immediate shutdown | <5s |
| `--status-only` | | Save state, no shutdown | 5-10s |
| `--dry-run` | | Preview without execution | 2-5s |
| `--commit` | | Auto-commit changes | +5s |
| `--stash` | | Stash uncommitted work | +3s |
| `--clean` | | Clean temp files & caches | +15s |
| `--verbose` | `-v` | Detailed output | - |
| `--help` | `-h` | Show help | - |

## 🔄 Aliases

All these commands do the same thing:
- `/save`
- `/stop`
- `/shutdown`
- `/halt`
- `/down`
- `/exit`

## 📊 Shutdown Phases

1. **Process Discovery** (2-5s)
2. **Git Operations** (3-10s) *if requested*
3. **State Preservation** (5-10s)
4. **Service Status** (2-5s)
5. **Process Termination** (5-15s)
6. **Resource Cleanup** (5-20s) *if requested*
7. **Verification** (2-3s)
8. **Report Generation** (1-2s)

## 💾 What Gets Saved

### Session State
- Process IDs and ports
- Git branch and status
- Environment variables
- Service configurations
- MCP server states

### Service Status
- Railway deployment info
- Vercel deployment status
- Database connections
- API endpoint health

### Development Context
- Active directory paths
- Recent commands
- Debug configurations
- Error logs

## 🧹 Cleanup Operations

When using `--clean`:

### Removed
- Node.js `.next/` cache
- Python `__pycache__/`
- Temporary build files
- Old log files (archived)

### Preserved
- User code and data
- Git repository
- Configuration files
- Environment settings

## 🚨 Emergency Procedures

### Process Won't Stop
```bash
/save --force
```

### Git Has Conflicts
```bash
/save --stash  # Or use --force to skip git
```

### Permission Errors
```bash
sudo chmod 755 .claude/context/
/save
```

### Complete Reset
```bash
/save --force --clean
rm -rf .claude/context/locks/*
```

## 🔄 Integration with /start

### Perfect Workflow
```bash
# End session
/save --commit --clean

# Resume session (uses saved state)
/start --quick
```

### State Benefits
- Faster startup (skip checks)
- Preserved configurations
- Automatic port reuse
- Context restoration

## 📈 Performance Guide

### Fastest Shutdown
```bash
/save --force        # <5 seconds
```

### Balanced Shutdown
```bash
/save --quick        # 5-15 seconds
```

### Complete Shutdown
```bash
/save --clean --commit  # 30-60 seconds
```

## 🎯 Command Examples

### Development Workflows

```bash
# Feature complete
/save --commit --clean

# Quick break
/save --quick

# Debugging session
/save --status-only --verbose

# Branch switch
/save --stash
git checkout new-feature
/start

# End of sprint
/save --commit --clean --verbose
```

### Troubleshooting

```bash
# See what would happen
/save --dry-run

# Debug shutdown issues
/save --verbose

# Force with details
/save --force --verbose
```

## 📊 Status Output

```
💾 aclue Development Environment Shutdown
════════════════════════════════════════

✅ Backend terminated (PID: 12345)
✅ Frontend terminated (PID: 12346)
✅ State preserved to .claude/context/
✅ 2 processes terminated
⏱️ Duration: 18.5 seconds

🚀 Quick Restart: /start --quick
```

## ❓ Common Questions

### Q: What's the difference between --quick and --force?
**A:** `--quick` skips checks but remains safe. `--force` is emergency only.

### Q: Do I need to commit before shutdown?
**A:** No, use `--commit` only when work is ready. Use `--stash` for WIP.

### Q: Will --clean delete my code?
**A:** Never. Only removes caches, temp files, and build artifacts.

### Q: Can I use multiple options?
**A:** Yes! Example: `/save --quick --stash --clean`

### Q: What if shutdown fails?
**A:** Try `/save --force` or check troubleshooting guide.

## 🔗 Related Commands

| Command | Purpose |
|---------|---------|
| `/start` | Launch development environment |
| `/start --quick` | Fast restart with saved state |
| `git status` | Check before `/save --commit` |
| `ps aux \| grep node` | Manual process check |

## 💡 Pro Tips

1. **Daily Routine**: End with `/save --commit --clean` for clean next-day startup
2. **Quick Switches**: Use `/save --stash` for fast branch changes
3. **Debug Sessions**: `/save --status-only` to snapshot without stopping
4. **CI/CD Prep**: Always `/save --clean` before deployments
5. **Emergency Kit**: Remember `/save --force` when things go wrong

---

**Quick Help**: `/save --help`
**Full Documentation**: [SAVE_COMMAND_DOCUMENTATION.md](./SAVE_COMMAND_DOCUMENTATION.md)

*Part of the aclue Development Environment - Version 1.0.0*