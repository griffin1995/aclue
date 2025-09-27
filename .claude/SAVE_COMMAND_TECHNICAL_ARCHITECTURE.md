# /save Command - Technical Architecture Documentation

## 🏗️ System Architecture Overview

The `/save` command implements a sophisticated multi-phase shutdown orchestration system with state preservation, process lifecycle management, and comprehensive error recovery. Built on Node.js with modular manager architecture for maintainability and extensibility.

## 📐 Architecture Principles

### Design Philosophy
1. **Safety First**: Non-destructive operations with multiple safeguards
2. **Graceful Degradation**: Fallback strategies for every operation
3. **State Preservation**: Complete session context capture
4. **Modular Design**: Specialized managers for separation of concerns
5. **Error Recovery**: Intelligent handling with automatic remediation
6. **Performance Optimization**: Parallel operations where safe

### Core Components

```
┌─────────────────────────────────────────────────────────────┐
│                     save-command.sh                         │
│                    (Shell Entry Point)                      │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                        save.js                              │
│                  (Orchestration Engine)                     │
├─────────────────────────────────────────────────────────────┤
│  • Command parsing and validation                           │
│  • Phase orchestration and timing                           │
│  • Error handling coordination                              │
│  • Report generation                                        │
└──────┬──────────┬──────────┬──────────┬────────────────────┘
       │          │          │          │
       ▼          ▼          ▼          ▼
┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐
│ Process  │ │  State   │ │ Cleanup  │ │   Git    │
│ Manager  │ │ Manager  │ │ Manager  │ │ Manager  │
└──────────┘ └──────────┘ └──────────┘ └──────────┘
       │          │          │          │
       └──────────┴──────────┴──────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   Shared Infrastructure                     │
├─────────────────────────────────────────────────────────────┤
│  • mcp-integration.js - MCP server communication           │
│  • error-recovery.js - Error handling and recovery         │
│  • Node.js stdlib - Process, filesystem, child_process     │
└─────────────────────────────────────────────────────────────┘
```

## 🔧 Component Deep Dive

### 1. save-command.sh (Entry Point)

**Purpose**: Bridge between Claude Code slash command system and Node.js implementation

**Implementation**:
```bash
#!/bin/bash
# Parse arguments and forward to Node.js
node /path/to/save.js "$@"
```

**Responsibilities**:
- Argument parsing and validation
- Environment setup
- Node.js process invocation
- Exit code propagation

### 2. save.js (Orchestration Engine)

**Class**: `AclueSaveCommand`

**Core Properties**:
```javascript
class AclueSaveCommand {
    constructor(options) {
        this.projectRoot = '/home/jack/Documents/aclue-preprod';
        this.options = { /* parsed options */ };
        this.status = { /* tracking object */ };
        this.managers = { /* specialized managers */ };
    }
}
```

**Phase Orchestration**:
```javascript
async execute() {
    // Phase 1: Discovery
    await this.discoverProcesses();

    // Phase 2: Git Operations
    if (this.options.commit || this.options.stash) {
        await this.handleGitOperations();
    }

    // Phase 3: State Preservation
    await this.preserveSessionState();

    // Phase 4: Service Status
    await this.captureServiceStatus();

    // Phase 5: Termination
    await this.terminateProcesses();

    // Phase 6: Cleanup
    if (this.options.clean) {
        await this.performCleanup();
    }

    // Phase 7: Verification
    await this.verifyShutdown();

    // Phase 8: Reporting
    await this.generateShutdownReport();
}
```

### 3. save-process-manager.js

**Purpose**: Process lifecycle management with graceful termination

**Key Methods**:

```javascript
class SaveProcessManager {
    async discoverProcesses() {
        // Find all aclue-related processes
        const processes = await this.findProcessesByPattern([
            'node.*next',
            'python.*uvicorn',
            'node.*start.js'
        ]);
        return this.mapProcessRelationships(processes);
    }

    async terminateProcess(pid, options = {}) {
        const strategy = options.force ? 'immediate' : 'graceful';

        if (strategy === 'graceful') {
            // Step 1: SIGTERM with 10s timeout
            process.kill(pid, 'SIGTERM');
            await this.waitForTermination(pid, 10000);

            // Step 2: Retry SIGTERM with 5s timeout
            if (await this.isProcessRunning(pid)) {
                process.kill(pid, 'SIGTERM');
                await this.waitForTermination(pid, 5000);
            }

            // Step 3: Force with SIGKILL
            if (await this.isProcessRunning(pid)) {
                process.kill(pid, 'SIGKILL');
            }
        } else {
            process.kill(pid, 'SIGKILL');
        }
    }
}
```

**Process Discovery Algorithm**:
1. Parse `ps aux` output for pattern matching
2. Build process tree relationships
3. Identify service processes (backend/frontend)
4. Determine safe termination order

### 4. save-state-manager.js

**Purpose**: Session state preservation and context management

**State Structure**:
```javascript
{
    session: {
        id: 'save_20250124_140230',
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        mode: options.mode,
        user: process.env.USER
    },
    environment: {
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd(),
        env: this.sanitizeEnv(process.env)
    },
    processes: {
        backend: { pid, port, status, uptime },
        frontend: { pid, port, status, uptime }
    },
    git: {
        branch: 'main',
        hasChanges: false,
        lastCommit: 'sha',
        uncommittedFiles: []
    },
    services: {
        railway: { /* deployment info */ },
        vercel: { /* deployment info */ },
        database: { /* connection info */ }
    },
    mcp: {
        servers: ['filesystem', 'memory', 'railway', 'vercel'],
        states: { /* server-specific states */ }
    }
}
```

**Persistence Strategy**:
```javascript
async preserveState(state) {
    const contextDir = path.join(this.projectRoot, '.claude/context');

    // Ensure directory exists
    await fs.mkdir(contextDir, { recursive: true });

    // Write current state
    const stateFile = path.join(contextDir, 'session.json');
    await fs.writeFile(stateFile, JSON.stringify(state, null, 2));

    // Archive previous states
    const archiveDir = path.join(contextDir, 'archive');
    await this.archivePreviousStates(archiveDir);

    // Update symlink to latest
    const latestLink = path.join(contextDir, 'latest');
    await fs.symlink(stateFile, latestLink);
}
```

### 5. save-cleanup-manager.js

**Purpose**: Resource cleanup and storage optimization

**Cleanup Categories**:

```javascript
const CLEANUP_TARGETS = {
    tempFiles: {
        patterns: ['*.tmp', '*.log.old', '*.swp'],
        directories: ['/tmp', '.claude/temp']
    },
    buildCaches: {
        node: ['.next', 'node_modules/.cache'],
        python: ['__pycache__', '.pytest_cache', '*.pyc']
    },
    logs: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        compress: true,
        archiveDir: '.claude/logs/archive'
    }
};
```

**Safe Cleanup Algorithm**:
```javascript
async performCleanup() {
    const items = await this.scanForCleanup();

    for (const item of items) {
        if (await this.isSafeToDelete(item)) {
            await this.deleteItem(item);
        } else {
            this.log(`Skipping protected item: ${item}`);
        }
    }

    // Optimize remaining storage
    await this.optimizeCaches();
    await this.compressLogs();
}
```

### 6. save-git-manager.js

**Purpose**: Git repository state management

**Operations**:

```javascript
class SaveGitManager {
    async handleGitOperations(options) {
        const status = await this.getGitStatus();

        if (options.commit && status.hasChanges) {
            await this.autoCommit(status);
        } else if (options.stash && status.hasChanges) {
            await this.stashChanges();
        }

        // Always create safety backup ref
        await this.createBackupRef();
    }

    async autoCommit(status) {
        const message = this.generateCommitMessage(status);
        await execAsync('git add -A');
        await execAsync(`git commit -m "${message}"`);
    }

    async stashChanges() {
        const timestamp = new Date().toISOString();
        const message = `Auto-stash by /save at ${timestamp}`;
        await execAsync(`git stash push -m "${message}"`);
    }

    async createBackupRef() {
        const ref = `refs/backup/save-${Date.now()}`;
        await execAsync(`git update-ref ${ref} HEAD`);
    }
}
```

## 🔌 MCP Integration Architecture

### MCP Server Communication

```javascript
class MCPIntegration {
    async queryServer(server, method, params) {
        try {
            const client = await this.getClient(server);
            return await client.call(method, params);
        } catch (error) {
            return this.handleMCPError(error, server, method);
        }
    }

    async captureServiceStates() {
        const states = {};

        // Railway deployment status
        if (this.hasServer('railway')) {
            states.railway = await this.queryServer('railway',
                'list-services', { workspacePath: this.projectRoot });
        }

        // Vercel deployment status
        if (this.hasServer('vercel')) {
            states.vercel = await this.queryServer('vercel',
                'getDeployments', { limit: 1 });
        }

        return states;
    }
}
```

### MCP State Persistence

```javascript
async preserveMCPStates(states) {
    // Use filesystem MCP for persistence
    await this.mcpClient.filesystem.write_file({
        path: '.claude/context/mcp-states.json',
        content: JSON.stringify(states, null, 2)
    });

    // Update memory graph if available
    if (this.hasServer('memory')) {
        await this.updateMemoryGraph(states);
    }
}
```

## 🛡️ Error Recovery System

### Error Classification

```javascript
const ERROR_TYPES = {
    PROCESS_TERMINATION_FAILED: {
        severity: 'high',
        recovery: 'force_terminate',
        userAction: 'Use --force flag'
    },
    GIT_OPERATION_FAILED: {
        severity: 'medium',
        recovery: 'skip_git_ops',
        userAction: 'Check git status manually'
    },
    STATE_PRESERVATION_FAILED: {
        severity: 'medium',
        recovery: 'use_temp_location',
        userAction: 'Check filesystem permissions'
    },
    MCP_SERVER_UNAVAILABLE: {
        severity: 'low',
        recovery: 'continue_without',
        userAction: 'Optional - check MCP config'
    }
};
```

### Recovery Strategies

```javascript
class ErrorRecoverySystem {
    async handleError(error, context) {
        const errorType = this.classifyError(error);
        const strategy = ERROR_TYPES[errorType];

        switch (strategy.recovery) {
            case 'force_terminate':
                return await this.forceTerminateAll();

            case 'skip_git_ops':
                return { success: true, skipped: ['git'] };

            case 'use_temp_location':
                return await this.useAlternateStorage();

            case 'continue_without':
                return { success: true, degraded: true };

            default:
                return this.fallbackRecovery(error);
        }
    }
}
```

## 🎯 Performance Optimizations

### Parallel Operations

```javascript
async executePhasesConcurrently() {
    // Run independent operations in parallel
    const [gitStatus, processes, mcpStates] = await Promise.all([
        this.gitManager.getGitStatus(),
        this.processManager.discoverProcesses(),
        this.mcpIntegration.captureServiceStates()
    ]);

    return { gitStatus, processes, mcpStates };
}
```

### Caching Strategy

```javascript
class CacheManager {
    constructor() {
        this.cache = new Map();
        this.ttl = 60000; // 1 minute
    }

    async getCached(key, fetcher) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.time < this.ttl) {
            return cached.value;
        }

        const value = await fetcher();
        this.cache.set(key, { value, time: Date.now() });
        return value;
    }
}
```

### Resource Management

```javascript
// Stream processing for large files
async processLargeLogFile(filepath) {
    const readStream = fs.createReadStream(filepath);
    const writeStream = fs.createWriteStream(`${filepath}.gz`);
    const gzip = zlib.createGzip();

    return new Promise((resolve, reject) => {
        readStream
            .pipe(gzip)
            .pipe(writeStream)
            .on('finish', resolve)
            .on('error', reject);
    });
}
```

## 🔒 Security Considerations

### Sensitive Data Handling

```javascript
sanitizeEnvironment(env) {
    const sensitive = ['API_KEY', 'TOKEN', 'SECRET', 'PASSWORD'];
    const sanitized = { ...env };

    for (const key of Object.keys(sanitized)) {
        if (sensitive.some(s => key.includes(s))) {
            sanitized[key] = '***REDACTED***';
        }
    }

    return sanitized;
}
```

### File System Safety

```javascript
async isSafeToDelete(path) {
    // Never delete these
    const protected = [
        '/home', '/usr', '/etc', '/var',
        '.git', 'node_modules', 'venv'
    ];

    const resolved = path.resolve(path);
    return !protected.some(p => resolved.includes(p));
}
```

## 📊 Metrics and Monitoring

### Performance Tracking

```javascript
class MetricsCollector {
    constructor() {
        this.metrics = {
            phaseDurations: {},
            operationCounts: {},
            errorCounts: {},
            resourceUsage: {}
        };
    }

    async trackPhase(name, operation) {
        const start = Date.now();
        try {
            const result = await operation();
            this.metrics.phaseDurations[name] = Date.now() - start;
            return result;
        } catch (error) {
            this.metrics.errorCounts[name] =
                (this.metrics.errorCounts[name] || 0) + 1;
            throw error;
        }
    }
}
```

### Diagnostic Output

```javascript
generateDiagnostics() {
    return {
        timestamp: new Date().toISOString(),
        duration: this.getDuration(),
        phases: this.getPhaseMetrics(),
        resources: this.getResourceMetrics(),
        errors: this.getErrorSummary(),
        recommendations: this.generateRecommendations()
    };
}
```

## 🔄 Integration Points

### With /start Command

```javascript
// State handoff format
const startStateFormat = {
    version: '1.0.0',
    lastShutdown: {
        timestamp: Date.now(),
        clean: true,
        mode: 'standard'
    },
    quickStart: {
        skipChecks: ['dependencies', 'ports'],
        useCache: true,
        restoreEnv: true
    },
    services: {
        backend: { port: 8000, env: {} },
        frontend: { port: 3000, env: {} }
    }
};
```

### With CI/CD Systems

```javascript
// Exit codes for CI/CD integration
const EXIT_CODES = {
    SUCCESS: 0,
    PARTIAL_SUCCESS: 1,
    TERMINATION_FAILED: 2,
    STATE_PRESERVATION_FAILED: 3,
    CRITICAL_ERROR: 4
};
```

## 🧪 Testing Architecture

### Test Coverage Strategy

```javascript
describe('SaveCommand', () => {
    describe('Process Management', () => {
        test('graceful termination');
        test('force termination');
        test('orphaned process cleanup');
    });

    describe('State Preservation', () => {
        test('session state capture');
        test('MCP state integration');
        test('corruption recovery');
    });

    describe('Error Handling', () => {
        test('graceful degradation');
        test('recovery strategies');
        test('force mode bypass');
    });
});
```

## 📝 Development Guidelines

### Adding New Features

1. **Create Manager**: Extend base manager class
2. **Register Phase**: Add to orchestration flow
3. **Add Options**: Update argument parser
4. **Error Handling**: Define recovery strategy
5. **Documentation**: Update all docs
6. **Testing**: Add comprehensive tests

### Code Standards

```javascript
// Manager template
class SaveCustomManager extends BaseManager {
    constructor(projectRoot, options) {
        super(projectRoot, options);
        this.validateOptions(options);
    }

    async execute() {
        try {
            return await this.performOperation();
        } catch (error) {
            return await this.handleError(error);
        }
    }
}
```

## 🚀 Future Enhancements

### Planned Features

1. **Cloud Backup**: State backup to cloud storage
2. **Team Sync**: Share states across team
3. **Analytics**: Usage metrics and optimization
4. **Plugins**: Extensible manager system
5. **GUI**: Web-based shutdown dashboard

### Architecture Evolution

- Microservice architecture for managers
- WebSocket for real-time status
- Container orchestration support
- Distributed state management
- Machine learning for optimization

---

**Technical Contact**: Backend System Architect
**Version**: 1.0.0
**Last Updated**: January 2025

*Part of the aclue Development Environment Infrastructure*