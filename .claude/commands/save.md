---
name: save
description: Graceful development environment shutdown with state preservation
category: development
---

# /save - aclue Development Environment Shutdown

Graceful development environment shutdown with comprehensive state preservation.

## Usage
```
/save [options]
```

## Options
- `--quick` / `-q`: Quick shutdown - skip comprehensive checks
- `--force` / `-f`: Force shutdown - kill all processes immediately
- `--status-only`: Save session state without shutting down processes
- `--dry-run`: Preview what would be done without executing
- `--commit`: Auto-commit uncommitted changes before shutdown
- `--stash`: Stash uncommitted changes for later recovery
- `--verbose` / `-v`: Enable verbose logging and detailed output
- `--clean`: Perform resource cleanup (temp files, caches, logs)
- `--help` / `-h`: Show detailed help information

## Examples
- `/save` - Standard graceful shutdown with state preservation
- `/save --commit --clean` - Commit changes and cleanup before shutdown
- `/save --quick --verbose` - Quick shutdown with detailed logging
- `/save --force` - Emergency force shutdown (last resort)
- `/save --stash --status-only` - Stash changes and save state without shutdown
- `/save --dry-run` - Preview shutdown operations without executing

## Execution
$CLAUDE_EXEC .claude/scripts/save-command.sh $ARGUMENTS