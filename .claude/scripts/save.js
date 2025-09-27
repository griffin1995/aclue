#!/usr/bin/env node

/**
 * aclue /save Command Implementation
 * Comprehensive development environment shutdown and state preservation
 *
 * Integrates with existing project infrastructure:
 * - MCP optimized configuration
 * - Error recovery system
 * - Session state preservation
 * - Graceful process termination
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Import existing infrastructure
const MCPIntegration = require('./mcp-integration.js');
const ErrorRecoverySystem = require('./error-recovery.js');

// Import specialized save managers
const SaveProcessManager = require('./save-process-manager.js');
const SaveStateManager = require('./save-state-manager.js');
const SaveCleanupManager = require('./save-cleanup-manager.js');
const SaveGitManager = require('./save-git-manager.js');

class AclueSaveCommand {
    constructor(options = {}) {
        this.projectRoot = '/home/jack/Documents/aclue-preprod';
        this.options = {
            quick: false,
            force: false,
            commit: false,
            stash: false,
            clean: false,
            statusOnly: false,
            dryRun: false,
            verbose: false,
            ...options
        };

        this.status = {
            processes: new Map(),
            services: { backend: 'unknown', frontend: 'unknown' },
            git: { hasChanges: false, branch: 'unknown' },
            cleanup: { tempFiles: 0, cacheSize: 0 },
            session: { preserved: false, contextSaved: false }
        };

        this.startTime = Date.now();
        this.mcpIntegration = new MCPIntegration(this.projectRoot);
        this.errorRecovery = new ErrorRecoverySystem(this.projectRoot);

        // Initialize specialized managers
        this.processManager = new SaveProcessManager(this.projectRoot, this.options);
        this.stateManager = new SaveStateManager(this.projectRoot, this.options);
        this.cleanupManager = new SaveCleanupManager(this.projectRoot, this.options);
        this.gitManager = new SaveGitManager(this.projectRoot, this.options);
    }

    async execute() {
        try {
            this.log('\n💾 aclue Development Environment Shutdown', 'title');
            this.log('━'.repeat(60), 'divider');

            // Initialize MCP Integration
            await this.mcpIntegration.initialize();
            this.log('🔌 MCP integration initialized', 'info');

            if (this.options.dryRun) {
                this.log('🔍 DRY RUN MODE - No changes will be made', 'warning');
                return await this.performDryRun();
            }

            if (this.options.statusOnly) {
                this.log('📊 STATUS ONLY MODE - Capturing state without shutdown', 'info');
                return await this.captureStatusOnly();
            }

            // Phase 1: Process Discovery and Analysis
            await this.discoverProcesses();

            // Phase 2: Git State Management (before shutdown)
            if (this.options.commit || this.options.stash) {
                await this.handleGitOperations();
            }

            // Phase 3: Session State Preservation
            await this.preserveSessionState();

            // Phase 4: Service Status Capture
            await this.captureServiceStatus();

            // Phase 5: Graceful Process Termination
            await this.terminateProcesses();

            // Phase 6: Resource Cleanup (if requested)
            if (this.options.clean) {
                await this.performCleanup();
            }

            // Phase 7: Final Verification
            await this.verifyShutdown();

            // Phase 8: Generate Shutdown Report
            await this.generateShutdownReport();

            return this.status;

        } catch (error) {
            this.log(`❌ Shutdown failed: ${error.message}`, 'error');

            // Attempt error recovery
            const recoveryResult = await this.errorRecovery.handleError(error, {
                phase: 'shutdown',
                options: this.options,
                autoResolve: this.options.force
            });

            if (recoveryResult.success) {
                this.log(`🔧 Recovery successful: ${recoveryResult.message}`, 'success');

                if (this.options.force) {
                    this.log('🚨 Force mode enabled - attempting emergency shutdown', 'warning');
                    return await this.performEmergencyShutdown();
                }
            } else {
                this.log(`💥 Recovery failed: ${recoveryResult.message}`, 'error');
            }

            throw error;
        }
    }

    async performDryRun() {
        this.log('\n🔍 Phase 1: Dry Run Analysis', 'phase');

        // Discover what would be affected
        const processes = await this.processManager.discoverProcesses();
        const gitStatus = await this.gitManager.getGitStatus();
        const cleanupItems = await this.cleanupManager.analyzeCleanupItems();

        // Generate dry run report
        this.log('\n📋 Dry Run Report:', 'subtitle');
        this.log('━'.repeat(40), 'divider');

        // Processes that would be terminated
        if (processes.aclueProcesses.length > 0) {
            this.log('🔄 Processes that would be terminated:', 'info');
            processes.aclueProcesses.forEach(proc => {
                this.log(`   • PID ${proc.pid}: ${proc.command} (Port: ${proc.port || 'N/A'})`, 'process');
            });
        } else {
            this.log('✅ No aclue processes found running', 'success');
        }

        // Git operations that would be performed
        if (gitStatus.hasChanges) {
            this.log('📝 Git operations that would be performed:', 'info');
            if (this.options.commit) {
                this.log('   • Auto-commit uncommitted changes', 'git');
            } else if (this.options.stash) {
                this.log('   • Stash uncommitted changes', 'git');
            } else {
                this.log('   • ⚠️  Uncommitted changes would remain', 'warning');
            }
        }

        // Cleanup that would be performed
        if (this.options.clean && cleanupItems.totalSize > 0) {
            this.log('🧹 Cleanup that would be performed:', 'info');
            this.log(`   • Remove ${cleanupItems.tempFiles} temporary files`, 'cleanup');
            this.log(`   • Clear ${this.formatBytes(cleanupItems.cacheSize)} of cache`, 'cleanup');
        }

        this.log('\n✅ Dry run complete - no changes made', 'success');
        return { dryRun: true, wouldAffect: { processes, gitStatus, cleanupItems } };
    }

    async captureStatusOnly() {
        this.log('\n📊 Phase 1: Status Capture Only', 'phase');

        // Capture current state without shutdown
        await this.discoverProcesses();
        await this.preserveSessionState();
        await this.captureServiceStatus();

        this.log('\n💾 Session state captured successfully', 'success');
        this.log('ℹ️  Development environment remains running', 'info');

        return { statusOnly: true, state: this.status };
    }

    async discoverProcesses() {
        this.log('\n🔍 Phase 1: Process Discovery', 'phase');

        try {
            const discoveredProcesses = await this.processManager.discoverProcesses();
            this.status.processes = discoveredProcesses.processMap;

            if (discoveredProcesses.aclueProcesses.length > 0) {
                this.log(`✅ Found ${discoveredProcesses.aclueProcesses.length} aclue-related process(es)`, 'success');

                if (this.options.verbose) {
                    discoveredProcesses.aclueProcesses.forEach(proc => {
                        this.log(`   • PID ${proc.pid}: ${proc.command} (Port: ${proc.port || 'N/A'})`, 'process');
                    });
                }
            } else {
                this.log('ℹ️  No aclue processes currently running', 'info');
            }

            // Update service status based on discovered processes
            this.updateServiceStatus(discoveredProcesses);

        } catch (error) {
            this.log(`⚠️  Process discovery failed: ${error.message}`, 'warning');
            throw new Error(`Process discovery failed: ${error.message}`);
        }
    }

    async handleGitOperations() {
        this.log('\n📝 Phase 2: Git State Management', 'phase');

        try {
            const gitStatus = await this.gitManager.getGitStatus();
            this.status.git = gitStatus;

            if (!gitStatus.hasChanges) {
                this.log('✅ No uncommitted changes found', 'success');
                return;
            }

            this.log('📋 Uncommitted changes detected:', 'info');
            if (this.options.verbose && gitStatus.changes) {
                gitStatus.changes.forEach(change => {
                    this.log(`   ${change.status} ${change.file}`, 'git');
                });
            }

            if (this.options.commit) {
                const commitResult = await this.gitManager.autoCommit();
                if (commitResult.success) {
                    this.log(`✅ Auto-commit successful: ${commitResult.commitHash}`, 'success');
                } else {
                    this.log(`⚠️  Auto-commit failed: ${commitResult.message}`, 'warning');
                }
            } else if (this.options.stash) {
                const stashResult = await this.gitManager.stashChanges();
                if (stashResult.success) {
                    this.log(`✅ Changes stashed: ${stashResult.stashMessage}`, 'success');
                } else {
                    this.log(`⚠️  Stash failed: ${stashResult.message}`, 'warning');
                }
            } else {
                this.log('⚠️  Uncommitted changes will remain', 'warning');
            }

        } catch (error) {
            this.log(`❌ Git operations failed: ${error.message}`, 'error');
            throw new Error(`Git operations failed: ${error.message}`);
        }
    }

    async preserveSessionState() {
        this.log('\n💾 Phase 3: Session State Preservation', 'phase');

        try {
            const sessionData = {
                timestamp: new Date().toISOString(),
                processes: Object.fromEntries(this.status.processes),
                services: this.status.services,
                git: this.status.git,
                environment: {
                    cwd: process.cwd(),
                    nodeVersion: process.version,
                    platform: process.platform
                },
                options: this.options
            };

            const preservationResult = await this.stateManager.preserveSession(sessionData);

            if (preservationResult.success) {
                this.status.session.preserved = true;
                this.log(`✅ Session state preserved: ${preservationResult.location}`, 'success');
            } else {
                this.log(`⚠️  Session preservation failed: ${preservationResult.message}`, 'warning');
            }

            // Store context using MCP integration
            const contextResult = await this.mcpIntegration.storeStartupContext({
                shutdownData: sessionData,
                shutdownTime: (Date.now() - this.startTime) / 1000
            });

            if (contextResult.success) {
                this.status.session.contextSaved = true;
                this.log('💾 Shutdown context stored in MCP', 'info');
            }

        } catch (error) {
            this.log(`❌ Session preservation failed: ${error.message}`, 'error');
            throw new Error(`Session preservation failed: ${error.message}`);
        }
    }

    async captureServiceStatus() {
        this.log('\n📊 Phase 4: Service Status Capture', 'phase');

        try {
            // Capture deployment service status before shutdown
            const vercelStatus = await this.mcpIntegration.checkVercelDeploymentStatus();
            const railwayStatus = await this.mcpIntegration.checkRailwayDeploymentStatus();

            const serviceCapture = {
                timestamp: new Date().toISOString(),
                vercel: vercelStatus,
                railway: railwayStatus,
                localServices: this.status.services
            };

            const captureResult = await this.stateManager.captureServiceStatus(serviceCapture);

            if (captureResult.success) {
                this.log('✅ Service status captured', 'success');
            } else {
                this.log(`⚠️  Service status capture failed: ${captureResult.message}`, 'warning');
            }

        } catch (error) {
            this.log(`⚠️  Service status capture error: ${error.message}`, 'warning');
            // Don't throw - this is not critical for shutdown
        }
    }

    async terminateProcesses() {
        this.log('\n🛑 Phase 5: Process Termination', 'phase');

        try {
            const aclueProcesses = Array.from(this.status.processes.values())
                .filter(proc => proc.isAclue);

            if (aclueProcesses.length === 0) {
                this.log('ℹ️  No processes to terminate', 'info');
                return;
            }

            this.log(`🔄 Terminating ${aclueProcesses.length} process(es)...`, 'info');

            if (this.options.force) {
                // Force termination
                const forceResult = await this.processManager.forceTerminateAll();
                if (forceResult.success) {
                    this.log(`✅ Force termination completed: ${forceResult.terminated} process(es)`, 'success');
                } else {
                    this.log(`❌ Force termination failed: ${forceResult.message}`, 'error');
                }
            } else {
                // Graceful termination with escalation
                const gracefulResult = await this.processManager.gracefulTermination();

                if (gracefulResult.success) {
                    this.log(`✅ Graceful termination completed: ${gracefulResult.terminated} process(es)`, 'success');

                    if (gracefulResult.forcedKills > 0) {
                        this.log(`⚠️  ${gracefulResult.forcedKills} process(es) required force termination`, 'warning');
                    }
                } else {
                    this.log(`❌ Graceful termination failed: ${gracefulResult.message}`, 'error');
                    throw new Error(`Process termination failed: ${gracefulResult.message}`);
                }
            }

        } catch (error) {
            this.log(`❌ Process termination failed: ${error.message}`, 'error');
            throw new Error(`Process termination failed: ${error.message}`);
        }
    }

    async performCleanup() {
        this.log('\n🧹 Phase 6: Resource Cleanup', 'phase');

        try {
            const cleanupResult = await this.cleanupManager.performCleanup();

            if (cleanupResult.success) {
                this.status.cleanup = cleanupResult.stats;
                this.log(`✅ Cleanup completed:`, 'success');
                this.log(`   • Removed ${cleanupResult.stats.tempFiles} temporary files`, 'cleanup');
                this.log(`   • Cleared ${this.formatBytes(cleanupResult.stats.cacheSize)} of cache`, 'cleanup');

                if (cleanupResult.stats.logFiles > 0) {
                    this.log(`   • Archived ${cleanupResult.stats.logFiles} log files`, 'cleanup');
                }
            } else {
                this.log(`⚠️  Cleanup partially failed: ${cleanupResult.message}`, 'warning');
            }

        } catch (error) {
            this.log(`❌ Cleanup failed: ${error.message}`, 'error');
            // Don't throw - cleanup failure shouldn't stop shutdown
        }
    }

    async verifyShutdown() {
        this.log('\n🔍 Phase 7: Shutdown Verification', 'phase');

        try {
            // Re-discover processes to ensure they're terminated
            const verificationResult = await this.processManager.verifyTermination();

            if (verificationResult.success) {
                this.log(`✅ Shutdown verification passed`, 'success');
                if (verificationResult.remainingProcesses === 0) {
                    this.log('   All aclue processes terminated successfully', 'success');
                }
            } else {
                this.log(`⚠️  Shutdown verification issues:`, 'warning');
                this.log(`   ${verificationResult.remainingProcesses} process(es) still running`, 'warning');

                if (this.options.verbose && verificationResult.processes) {
                    verificationResult.processes.forEach(proc => {
                        this.log(`   • PID ${proc.pid}: ${proc.command}`, 'process');
                    });
                }
            }

            // Check port availability
            const portCheck = await this.verifyPortsFreed();
            if (portCheck.success) {
                this.log('✅ Development ports freed', 'success');
            } else {
                this.log(`⚠️  Some ports still in use: ${portCheck.busyPorts.join(', ')}`, 'warning');
            }

        } catch (error) {
            this.log(`⚠️  Shutdown verification error: ${error.message}`, 'warning');
            // Don't throw - verification failure shouldn't stop shutdown completion
        }
    }

    async performEmergencyShutdown() {
        this.log('\n🚨 Emergency Shutdown Mode', 'phase');

        try {
            // Force kill all aclue processes immediately
            const emergencyResult = await this.processManager.emergencyShutdown();

            // Basic state preservation
            const basicState = {
                timestamp: new Date().toISOString(),
                emergencyShutdown: true,
                processes: emergencyResult.terminatedProcesses || [],
                reason: 'Emergency shutdown due to normal shutdown failure'
            };

            await this.stateManager.preserveEmergencyState(basicState);

            this.log(`⚡ Emergency shutdown completed: ${emergencyResult.terminated} process(es) terminated`, 'warning');
            return { emergency: true, ...emergencyResult };

        } catch (error) {
            this.log(`💥 Emergency shutdown failed: ${error.message}`, 'error');
            throw error;
        }
    }

    async generateShutdownReport() {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

        this.log('\n📊 Phase 8: Shutdown Report', 'phase');
        this.log('━'.repeat(60), 'divider');

        // Header
        this.log('✅ aclue Development Environment Shutdown Complete!', 'title');
        this.log(`⏱️  Total shutdown time: ${elapsed}s`, 'info');
        this.log('', 'divider');

        // Process summary
        this.log('🔄 Process Summary:', 'subtitle');
        const processCount = Array.from(this.status.processes.values())
            .filter(proc => proc.isAclue).length;
        this.log(`   Terminated: ${processCount} aclue process(es)`, 'info');
        this.log('', 'divider');

        // Git operations summary
        if (this.options.commit || this.options.stash) {
            this.log('📝 Git Operations:', 'subtitle');
            if (this.status.git.hasChanges) {
                if (this.options.commit) {
                    this.log('   ✅ Changes committed automatically', 'success');
                } else if (this.options.stash) {
                    this.log('   ✅ Changes stashed for later', 'success');
                }
            } else {
                this.log('   ℹ️  No changes required saving', 'info');
            }
            this.log('', 'divider');
        }

        // Session preservation
        this.log('💾 Session State:', 'subtitle');
        if (this.status.session.preserved) {
            this.log('   ✅ Session state preserved', 'success');
        } else {
            this.log('   ⚠️  Session preservation failed', 'warning');
        }
        this.log('', 'divider');

        // Cleanup summary
        if (this.options.clean) {
            this.log('🧹 Cleanup Summary:', 'subtitle');
            this.log(`   Files removed: ${this.status.cleanup.tempFiles || 0}`, 'info');
            this.log(`   Cache cleared: ${this.formatBytes(this.status.cleanup.cacheSize || 0)}`, 'info');
            this.log('', 'divider');
        }

        // Next steps
        this.log('🚀 Next Steps:', 'subtitle');
        this.log('   1. Development environment is now stopped', 'step');
        this.log('   2. Use /start to resume development', 'step');
        if (this.status.session.preserved) {
            this.log('   3. Previous session state will be restored', 'step');
        }
        if (this.status.git.hasChanges && !this.options.commit && !this.options.stash) {
            this.log('   4. ⚠️  Remember: Uncommitted changes remain', 'step');
        }
        this.log('', 'divider');

        // Environment summary
        this.log('🌍 Environment Summary:', 'subtitle');
        this.log(`   Project: ${this.projectRoot}`, 'info');
        this.log(`   Stopped: ${new Date().toLocaleString()}`, 'info');
        if (this.options.quick) {
            this.log('   Mode: Quick shutdown', 'info');
        } else if (this.options.force) {
            this.log('   Mode: Force shutdown', 'info');
        } else {
            this.log('   Mode: Graceful shutdown', 'info');
        }
        this.log('', 'divider');

        this.log('Thank you for using aclue! 👋', 'title');
    }

    // Helper methods
    updateServiceStatus(discoveredProcesses) {
        const backendProcess = discoveredProcesses.aclueProcesses
            .find(p => p.port === 8000 || p.command.includes('uvicorn'));

        const frontendProcess = discoveredProcesses.aclueProcesses
            .find(p => p.port === 3000 || p.command.includes('npm'));

        this.status.services.backend = backendProcess ? 'running' : 'stopped';
        this.status.services.frontend = frontendProcess ? 'running' : 'stopped';
    }

    async verifyPortsFreed() {
        try {
            const ports = [3000, 8000];
            const busyPorts = [];

            for (const port of ports) {
                const isAvailable = await this.checkPortAvailability(port);
                if (!isAvailable) {
                    busyPorts.push(port);
                }
            }

            return {
                success: busyPorts.length === 0,
                busyPorts,
                freedPorts: ports.filter(p => !busyPorts.includes(p))
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async checkPortAvailability(port) {
        try {
            const { stdout } = await execAsync(
                process.platform === 'win32' ?
                    `netstat -an | findstr :${port}` :
                    `lsof -i :${port}`
            );
            return stdout.trim() === '';
        } catch {
            return true; // Port is available
        }
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = `[${timestamp}]`;

        const colors = {
            title: '\x1b[1m\x1b[36m',      // Bold cyan
            phase: '\x1b[1m\x1b[35m',      // Bold magenta
            subtitle: '\x1b[1m\x1b[33m',   // Bold yellow
            success: '\x1b[32m',           // Green
            error: '\x1b[31m',             // Red
            warning: '\x1b[33m',           // Yellow
            info: '\x1b[36m',              // Cyan
            process: '\x1b[90m',           // Gray
            git: '\x1b[94m',               // Light blue
            cleanup: '\x1b[92m',           // Light green
            step: '\x1b[37m',              // White
            divider: '\x1b[90m',           // Gray
            reset: '\x1b[0m'               // Reset
        };

        const color = colors[type] || colors.info;
        const reset = colors.reset;

        if (type === 'divider' && message === '') {
            console.log();
        } else if (type === 'divider') {
            console.log(`${color}${message}${reset}`);
        } else {
            console.log(`${prefix} ${color}${message}${reset}`);
        }
    }

    async cleanup() {
        this.log('\n🧹 Final cleanup...', 'info');

        // Cleanup managers
        if (this.processManager) {
            this.processManager.cleanup();
        }
        if (this.stateManager) {
            this.stateManager.cleanup();
        }
        if (this.cleanupManager) {
            this.cleanupManager.cleanup();
        }
        if (this.gitManager) {
            this.gitManager.cleanup();
        }

        // Cleanup MCP integration
        if (this.mcpIntegration) {
            this.mcpIntegration.cleanup();
        }

        // Cleanup error recovery system
        if (this.errorRecovery) {
            this.errorRecovery.cleanup();
        }
    }
}

// Command-line interface
if (require.main === module) {
    const args = process.argv.slice(2);

    const options = {
        quick: args.includes('--quick'),
        force: args.includes('--force'),
        commit: args.includes('--commit'),
        stash: args.includes('--stash'),
        clean: args.includes('--clean'),
        statusOnly: args.includes('--status-only'),
        dryRun: args.includes('--dry-run'),
        verbose: args.includes('--verbose') || args.includes('-v')
    };

    const saveCommand = new AclueSaveCommand(options);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Save command interrupted...');
        await saveCommand.cleanup();
        process.exit(130);
    });

    process.on('SIGTERM', async () => {
        console.log('\n\n🛑 Save command terminated...');
        await saveCommand.cleanup();
        process.exit(143);
    });

    saveCommand.execute()
        .then((result) => {
            console.log('\n✅ Save command completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error(`\n❌ Save command failed: ${error.message}`);
            process.exit(1);
        });
}

module.exports = AclueSaveCommand;
