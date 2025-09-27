---
name: start
description: Launch the aclue development environment
category: development
---

# /start - aclue Development Environment Launcher

Launch the aclue development environment with comprehensive setup and health checks.

## Usage
```
/start [options]
```

## Options
- `--quick` / `-q`: Quick startup - skip dependency installation checks
- `--backend-only`: Start only the FastAPI backend server
- `--frontend-only`: Start only the Next.js frontend development server
- `--verbose` / `-v`: Enable verbose logging and detailed output
- `--skip-checks`: Skip environment validation and port conflict checks
- `--no-browser`: Don't automatically launch browser after startup
- `--help` / `-h`: Show detailed help information

## Examples
- `/start` - Full startup with all checks
- `/start --quick` - Quick startup, skip dependency checks
- `/start --verbose --backend-only` - Start only backend with detailed logging
- `/start --frontend-only --no-browser` - Start only frontend without browser
- `/start --skip-checks --quick` - Fastest startup, skip all validation

## Execution
$CLAUDE_EXEC .claude/scripts/start-command.sh $ARGUMENTS