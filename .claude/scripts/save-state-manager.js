#!/usr/bin/env node

/**
 * aclue Save State Manager
 * Handles session state preservation and context capture for the /save command
 *
 * Features:
 * - Session state serialization and storage
 * - Development environment context capture
 * - Service status preservation
 * - Recovery state for /start command
 * - Emergency state handling
 */

const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

class SaveStateManager {
    constructor(projectRoot = '/home/jack/Documents/aclue-preprod', options = {}) {
        this.projectRoot = projectRoot;
        this.options = {
            verbose: false,
            includeEnvironment: true,
            includeProcessDetails: true,
            includeGitState: true,
            includeServiceStatus: true,
            ...options
        };

        this.stateDirectory = path.join(projectRoot, '.claude', 'context');
        this.sessionStateFile = path.join(this.stateDirectory, 'last-session.json');
        this.serviceStateFile = path.join(this.stateDirectory, 'service-status.json');
        this.emergencyStateFile = path.join(this.stateDirectory, 'emergency-state.json');
    }

    async preserveSession(sessionData) {
        try {
            this.log('💾 Preserving session state...', 'info');

            // Ensure context directory exists
            await this.ensureStateDirectory();

            // Enrich session data with additional context
            const enrichedData = await this.enrichSessionData(sessionData);

            // Store session state
            const sessionResult = await this.storeSessionState(enrichedData);

            // Store MCP-compatible context
            const mcpResult = await this.storeMCPContext(enrichedData);

            // Create recovery metadata
            const recoveryResult = await this.createRecoveryMetadata(enrichedData);

            return {
                success: sessionResult.success && recoveryResult.success,
                location: this.sessionStateFile,
                mcpStored: mcpResult.success,
                size: await this.getFileSize(this.sessionStateFile),
                message: 'Session state preserved successfully'
            };

        } catch (error) {
            throw new Error(`Session preservation failed: ${error.message}`);
        }
    }

    async enrichSessionData(baseData) {
        try {
            const enrichedData = {
                ...baseData,
                metadata: {
                    version: '1.0.0',
                    saveCommand: 'aclue-save',
                    preservedAt: new Date().toISOString(),
                    preservationDuration: Date.now() - (baseData.startTime || Date.now())
                }
            };

            // Add environment details if enabled
            if (this.options.includeEnvironment) {
                enrichedData.environment = {
                    ...enrichedData.environment,
                    ...(await this.captureEnvironmentState())
                };
            }

            // Add process details if enabled
            if (this.options.includeProcessDetails && baseData.processes) {
                enrichedData.processes = await this.enrichProcessData(baseData.processes);
            }

            // Add git state if enabled
            if (this.options.includeGitState) {
                enrichedData.git = {
                    ...enrichedData.git,
                    ...(await this.captureGitState())
                };
            }

            // Add service status if enabled
            if (this.options.includeServiceStatus) {
                enrichedData.services = {
                    ...enrichedData.services,
                    ...(await this.captureLocalServiceState())
                };
            }

            // Add project metadata
            enrichedData.project = await this.captureProjectMetadata();

            return enrichedData;

        } catch (error) {
            this.log(`⚠️  State enrichment failed: ${error.message}`, 'warning');
            // Return base data if enrichment fails
            return {
                ...baseData,
                enrichmentError: error.message,
                metadata: {
                    version: '1.0.0',
                    saveCommand: 'aclue-save',
                    preservedAt: new Date().toISOString(),
                    enrichmentFailed: true
                }
            };
        }
    }

    async captureEnvironmentState() {
        try {
            const envState = {
                cwd: process.cwd(),
                nodeVersion: process.version,
                platform: process.platform,
                architecture: process.arch,
                pid: process.pid,
                uptime: process.uptime(),
                memoryUsage: process.memoryUsage(),
                loadAverage: process.platform !== 'win32' ? require('os').loadavg() : null,
                freeMemory: require('os').freemem(),
                totalMemory: require('os').totalmem(),
                timestamp: new Date().toISOString()
            };

            // Add environment variables (filtered for security)
            envState.environmentVariables = this.filterEnvironmentVariables(process.env);

            // Add system information
            if (process.platform !== 'win32') {
                try {
                    const { stdout: unameOutput } = await execAsync('uname -a');
                    envState.systemInfo = unameOutput.trim();
                } catch {
                    // Ignore if uname fails
                }
            }

            return envState;

        } catch (error) {
            return { error: error.message, timestamp: new Date().toISOString() };
        }
    }

    async enrichProcessData(processes) {
        try {
            const enrichedProcesses = new Map();

            for (const [pid, processData] of processes) {
                const enriched = {
                    ...processData,
                    capturedAt: new Date().toISOString()
                };

                // Add process details if available
                try {
                    const processDetails = await this.getProcessDetails(pid);
                    enriched.details = processDetails;
                } catch {
                    enriched.details = { error: 'Could not capture process details' };
                }

                enrichedProcesses.set(pid, enriched);
            }

            return Object.fromEntries(enrichedProcesses);

        } catch (error) {
            return { error: error.message, originalData: Object.fromEntries(processes) };
        }
    }

    async captureGitState() {
        try {
            const gitState = {
                capturedAt: new Date().toISOString()
            };

            // Current branch
            try {
                const { stdout: branchOutput } = await execAsync('git branch --show-current', {
                    cwd: this.projectRoot
                });
                gitState.currentBranch = branchOutput.trim();
            } catch {
                gitState.currentBranch = 'unknown';
            }

            // Latest commit
            try {
                const { stdout: commitOutput } = await execAsync('git log -1 --format="%H|%s|%an|%ad"', {
                    cwd: this.projectRoot
                });
                const [hash, subject, author, date] = commitOutput.trim().split('|');
                gitState.latestCommit = { hash, subject, author, date };
            } catch {
                gitState.latestCommit = null;
            }

            // Status summary
            try {
                const { stdout: statusOutput } = await execAsync('git status --porcelain', {
                    cwd: this.projectRoot
                });
                gitState.hasUncommittedChanges = statusOutput.trim().length > 0;
                gitState.changedFiles = statusOutput.trim().split('\n').filter(line => line.length > 0);
            } catch {
                gitState.hasUncommittedChanges = false;
                gitState.changedFiles = [];
            }

            // Remote status
            try {
                const { stdout: remoteOutput } = await execAsync('git remote -v', {
                    cwd: this.projectRoot
                });
                gitState.remotes = remoteOutput.trim().split('\n').filter(line => line.includes('(fetch)'));
            } catch {
                gitState.remotes = [];
            }

            return gitState;

        } catch (error) {
            return { error: error.message, capturedAt: new Date().toISOString() };
        }
    }

    async captureLocalServiceState() {
        try {
            const serviceState = {
                capturedAt: new Date().toISOString()
            };

            // Port status
            const ports = [3000, 8000];
            serviceState.ports = {};

            for (const port of ports) {
                try {
                    const isInUse = await this.isPortInUse(port);
                    serviceState.ports[port] = {
                        inUse: isInUse,
                        service: port === 3000 ? 'frontend' : 'backend'
                    };
                } catch {
                    serviceState.ports[port] = { inUse: false, error: 'Could not check port' };
                }
            }

            // Check for lock files
            serviceState.lockFiles = await this.checkLockFiles();

            // Check for running development servers
            serviceState.developmentServers = await this.detectDevelopmentServers();

            return serviceState;

        } catch (error) {
            return { error: error.message, capturedAt: new Date().toISOString() };
        }
    }

    async captureProjectMetadata() {
        try {
            const metadata = {
                capturedAt: new Date().toISOString(),
                projectRoot: this.projectRoot
            };

            // Package.json information
            try {
                const packageJsonPath = path.join(this.projectRoot, 'web', 'package.json');
                const packageContent = await fs.readFile(packageJsonPath, 'utf8');
                const packageData = JSON.parse(packageContent);

                metadata.frontend = {
                    name: packageData.name,
                    version: packageData.version,
                    scripts: Object.keys(packageData.scripts || {}),
                    dependencies: Object.keys(packageData.dependencies || {}),
                    devDependencies: Object.keys(packageData.devDependencies || {})
                };
            } catch {
                metadata.frontend = { error: 'Could not read package.json' };
            }

            // Requirements.txt information
            try {
                const requirementsPath = path.join(this.projectRoot, 'backend', 'requirements.txt');
                const requirementsContent = await fs.readFile(requirementsPath, 'utf8');
                metadata.backend = {
                    dependencies: requirementsContent.split('\n')
                        .filter(line => line.trim() && !line.startsWith('#'))
                        .map(line => line.split('==')[0].split('>=')[0].split('~=')[0].trim())
                };
            } catch {
                metadata.backend = { error: 'Could not read requirements.txt' };
            }

            // Claude configuration
            try {
                const claudeConfigPath = path.join(this.projectRoot, '.claude', 'settings.optimized.json');
                const claudeConfigContent = await fs.readFile(claudeConfigPath, 'utf8');
                const claudeConfig = JSON.parse(claudeConfigContent);
                metadata.claudeConfig = {
                    hasOptimizedSettings: true,
                    mcpServers: Object.keys(claudeConfig.mcpServers || {})
                };
            } catch {
                metadata.claudeConfig = { hasOptimizedSettings: false };
            }

            return metadata;

        } catch (error) {
            return { error: error.message, capturedAt: new Date().toISOString() };
        }
    }

    async captureServiceStatus(serviceData) {
        try {
            this.log('📊 Capturing service status...', 'info');

            // Ensure context directory exists
            await this.ensureStateDirectory();

            // Store service status
            await fs.writeFile(this.serviceStateFile, JSON.stringify(serviceData, null, 2));

            return {
                success: true,
                location: this.serviceStateFile,
                size: await this.getFileSize(this.serviceStateFile),
                message: 'Service status captured successfully'
            };

        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Service status capture failed'
            };
        }
    }

    async preserveEmergencyState(emergencyData) {
        try {
            this.log('🚨 Preserving emergency state...', 'warning');

            // Ensure context directory exists
            await this.ensureStateDirectory();

            const emergencyState = {
                ...emergencyData,
                emergencyPreservedAt: new Date().toISOString(),
                recoveryInstructions: this.generateEmergencyRecoveryInstructions()
            };

            // Store emergency state
            await fs.writeFile(this.emergencyStateFile, JSON.stringify(emergencyState, null, 2));

            return {
                success: true,
                location: this.emergencyStateFile,
                message: 'Emergency state preserved'
            };

        } catch (error) {
            throw new Error(`Emergency state preservation failed: ${error.message}`);
        }
    }

    async storeSessionState(sessionData) {
        try {
            await fs.writeFile(this.sessionStateFile, JSON.stringify(sessionData, null, 2));
            return { success: true, location: this.sessionStateFile };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async storeMCPContext(sessionData) {
        try {
            const mcpContextPath = path.join(this.stateDirectory, 'mcp-context.json');

            const mcpContext = {
                timestamp: new Date().toISOString(),
                sessionData: {
                    services: sessionData.services,
                    processes: sessionData.processes ? Object.keys(sessionData.processes).length : 0,
                    git: sessionData.git,
                    environment: {
                        nodeVersion: sessionData.environment?.nodeVersion,
                        platform: sessionData.environment?.platform,
                        cwd: sessionData.environment?.cwd
                    }
                },
                mcpCompatible: true,
                version: '1.0.0'
            };

            await fs.writeFile(mcpContextPath, JSON.stringify(mcpContext, null, 2));
            return { success: true, location: mcpContextPath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createRecoveryMetadata(sessionData) {
        try {
            const recoveryMetadataPath = path.join(this.stateDirectory, 'recovery-metadata.json');

            const recoveryData = {
                timestamp: new Date().toISOString(),
                canRecover: true,
                services: {
                    backend: sessionData.services?.backend === 'running',
                    frontend: sessionData.services?.frontend === 'running'
                },
                ports: {
                    backend: 8000,
                    frontend: 3000
                },
                startCommand: '/start',
                notes: this.generateRecoveryNotes(sessionData)
            };

            await fs.writeFile(recoveryMetadataPath, JSON.stringify(recoveryData, null, 2));
            return { success: true, location: recoveryMetadataPath };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Utility methods

    async ensureStateDirectory() {
        try {
            await fs.mkdir(this.stateDirectory, { recursive: true });
        } catch (error) {
            if (error.code !== 'EEXIST') {
                throw error;
            }
        }
    }

    async getFileSize(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.size;
        } catch {
            return 0;
        }
    }

    filterEnvironmentVariables(env) {
        const safeEnvVars = {};
        const sensitivePatterns = [
            /password/i,
            /secret/i,
            /key/i,
            /token/i,
            /auth/i,
            /credential/i
        ];

        for (const [key, value] of Object.entries(env)) {
            const isSensitive = sensitivePatterns.some(pattern => pattern.test(key));

            if (isSensitive) {
                safeEnvVars[key] = '[REDACTED]';
            } else if (key.startsWith('NEXT_PUBLIC_') ||
                      key.startsWith('npm_') ||
                      ['NODE_VERSION', 'PATH', 'HOME', 'USER', 'TERM'].includes(key)) {
                safeEnvVars[key] = value;
            }
        }

        return safeEnvVars;
    }

    async getProcessDetails(pid) {
        try {
            if (process.platform === 'win32') {
                const { stdout } = await execAsync(`wmic process where processid=${pid} get creationdate,commandline`);
                return { raw: stdout.trim() };
            } else {
                const { stdout } = await execAsync(`ps -p ${pid} -o pid,ppid,etime,pcpu,pmem,command`);
                return { raw: stdout.trim() };
            }
        } catch (error) {
            return { error: error.message };
        }
    }

    async isPortInUse(port) {
        try {
            const command = process.platform === 'win32' ?
                `netstat -an | findstr :${port}` :
                `lsof -i :${port}`;

            const { stdout } = await execAsync(command);
            return stdout.trim().length > 0;
        } catch {
            return false;
        }
    }

    async checkLockFiles() {
        const lockFiles = [
            'web/package-lock.json',
            'web/yarn.lock',
            'backend/poetry.lock',
            'backend/Pipfile.lock'
        ];

        const lockFileStatus = {};

        for (const lockFile of lockFiles) {
            const fullPath = path.join(this.projectRoot, lockFile);
            try {
                await fs.access(fullPath);
                const stats = await fs.stat(fullPath);
                lockFileStatus[lockFile] = {
                    exists: true,
                    size: stats.size,
                    modified: stats.mtime.toISOString()
                };
            } catch {
                lockFileStatus[lockFile] = { exists: false };
            }
        }

        return lockFileStatus;
    }

    async detectDevelopmentServers() {
        const servers = {
            nextjs: false,
            fastapi: false,
            vite: false,
            webpack: false
        };

        try {
            // Check for Next.js dev server
            const { stdout: nextCheck } = await execAsync('ps aux | grep next-dev', { timeout: 2000 });
            servers.nextjs = nextCheck.includes('next-dev');
        } catch {}

        try {
            // Check for FastAPI/Uvicorn
            const { stdout: uvicornCheck } = await execAsync('ps aux | grep uvicorn', { timeout: 2000 });
            servers.fastapi = uvicornCheck.includes('uvicorn');
        } catch {}

        return servers;
    }

    generateRecoveryNotes(sessionData) {
        const notes = [];

        if (sessionData.git?.hasUncommittedChanges) {
            notes.push('Warning: Uncommitted changes were present when session was saved');
        }

        if (sessionData.services?.backend === 'running') {
            notes.push('Backend service was running on port 8000');
        }

        if (sessionData.services?.frontend === 'running') {
            notes.push('Frontend service was running on port 3000');
        }

        if (notes.length === 0) {
            notes.push('Clean shutdown - no special recovery requirements');
        }

        return notes;
    }

    generateEmergencyRecoveryInstructions() {
        return [
            'This was an emergency shutdown - normal shutdown process failed',
            'Check for any remaining processes manually',
            'Verify ports 3000 and 8000 are free before restarting',
            'Review any uncommitted git changes',
            'Run /start to attempt normal recovery'
        ];
    }

    // State retrieval methods

    async getLastSessionState() {
        try {
            const content = await fs.readFile(this.sessionStateFile, 'utf8');
            return { success: true, data: JSON.parse(content) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getServiceStatus() {
        try {
            const content = await fs.readFile(this.serviceStateFile, 'utf8');
            return { success: true, data: JSON.parse(content) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getEmergencyState() {
        try {
            const content = await fs.readFile(this.emergencyStateFile, 'utf8');
            return { success: true, data: JSON.parse(content) };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    log(message, level = 'info') {
        if (!this.options.verbose && level === 'info') {
            return;
        }

        const colors = {
            info: '\x1b[36m',     // Cyan
            warning: '\x1b[33m',  // Yellow
            error: '\x1b[31m',    // Red
            success: '\x1b[32m',  // Green
            reset: '\x1b[0m'
        };

        const color = colors[level] || colors.info;
        const reset = colors.reset;
        const timestamp = new Date().toLocaleTimeString();

        console.log(`[${timestamp}] ${color}${message}${reset}`);
    }

    cleanup() {
        // Nothing to clean up for file-based state manager
    }
}

module.exports = SaveStateManager;

// CLI usage
if (require.main === module) {
    const manager = new SaveStateManager();

    const command = process.argv[2];

    switch (command) {
        case 'preserve':
            const mockSession = {
                timestamp: new Date().toISOString(),
                services: { backend: 'running', frontend: 'running' },
                processes: new Map([['1234', { pid: 1234, command: 'test', isAclue: true }]]),
                git: { hasChanges: false, branch: 'main' }
            };
            manager.preserveSession(mockSession)
                .then(result => console.log(result))
                .catch(console.error);
            break;

        case 'get-last':
            manager.getLastSessionState()
                .then(result => console.log(JSON.stringify(result, null, 2)))
                .catch(console.error);
            break;

        case 'get-services':
            manager.getServiceStatus()
                .then(result => console.log(JSON.stringify(result, null, 2)))
                .catch(console.error);
            break;

        default:
            console.log('Available commands: preserve, get-last, get-services');
    }
}
