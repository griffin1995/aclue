#!/usr/bin/env node

/**
 * aclue Save Process Manager
 * Handles discovery and graceful termination of aclue-related processes
 *
 * Features:
 * - Process discovery and classification
 * - Graceful termination with SIGTERM → SIGKILL escalation
 * - Port-based process identification
 * - Emergency shutdown capabilities
 * - Cross-platform compatibility
 */

const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SaveProcessManager {
    constructor(projectRoot = '/home/jack/Documents/aclue-preprod', options = {}) {
        this.projectRoot = projectRoot;
        this.options = {
            verbose: false,
            gracefulTimeout: 10000,  // 10 seconds for graceful shutdown
            forceTimeout: 5000,      // 5 seconds before force kill
            ...options
        };

        this.discoveredProcesses = new Map();
        this.terminationAttempts = new Map();
        this.maxTerminationAttempts = 3;
    }

    async discoverProcesses() {
        try {
            this.log('🔍 Discovering aclue-related processes...', 'info');

            const allProcesses = await this.getAllProcesses();
            const aclueProcesses = this.filterAclueProcesses(allProcesses);
            
            // Create process map for tracking
            const processMap = new Map();
            aclueProcesses.forEach(proc => {
                processMap.set(proc.pid, {
                    ...proc,
                    isAclue: true,
                    discovered: new Date().toISOString()
                });
            });

            this.discoveredProcesses = processMap;

            return {
                processMap,
                aclueProcesses,
                totalProcesses: allProcesses.length,
                aclueCount: aclueProcesses.length
            };

        } catch (error) {
            throw new Error(`Process discovery failed: ${error.message}`);
        }
    }

    async getAllProcesses() {
        try {
            let command, parseFunction;

            if (process.platform === 'win32') {
                command = 'wmic process get processid,commandline,name /format:csv';
                parseFunction = this.parseWindowsProcesses.bind(this);
            } else if (process.platform === 'darwin') {
                command = 'ps -ax -o pid,command';
                parseFunction = this.parseUnixProcesses.bind(this);
            } else {
                command = 'ps -aux --no-headers';
                parseFunction = this.parseLinuxProcesses.bind(this);
            }

            const { stdout } = await execAsync(command);
            return parseFunction(stdout);

        } catch (error) {
            throw new Error(`Failed to get process list: ${error.message}`);
        }
    }

    parseLinuxProcesses(output) {
        const lines = output.trim().split('\n');
        const processes = [];

        for (const line of lines) {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 11) {
                const pid = parseInt(parts[1]);
                const command = parts.slice(10).join(' ');
                
                if (!isNaN(pid) && command) {
                    processes.push({
                        pid,
                        command: command.trim(),
                        user: parts[0],
                        cpu: parseFloat(parts[2]) || 0,
                        memory: parseFloat(parts[3]) || 0
                    });
                }
            }
        }

        return processes;
    }

    parseUnixProcesses(output) {
        const lines = output.trim().split('\n');
        const processes = [];

        // Skip header line
        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            const match = line.match(/^\s*(\d+)\s+(.+)$/);
            
            if (match) {
                const pid = parseInt(match[1]);
                const command = match[2].trim();
                
                if (!isNaN(pid) && command) {
                    processes.push({
                        pid,
                        command,
                        user: 'unknown',
                        cpu: 0,
                        memory: 0
                    });
                }
            }
        }

        return processes;
    }

    parseWindowsProcesses(output) {
        const lines = output.trim().split('\n');
        const processes = [];

        // Skip header lines
        for (let i = 2; i < lines.length; i++) {
            const parts = lines[i].split(',');
            if (parts.length >= 4) {
                const pid = parseInt(parts[3]);
                const command = (parts[1] || '').replace(/"/g, '');
                
                if (!isNaN(pid) && command) {
                    processes.push({
                        pid,
                        command: command.trim(),
                        user: 'unknown',
                        cpu: 0,
                        memory: 0
                    });
                }
            }
        }

        return processes;
    }

    filterAclueProcesses(processes) {
        const aclueProcesses = [];

        for (const proc of processes) {
            const command = proc.command.toLowerCase();
            
            // Check for aclue-related indicators
            const isAclueRelated = 
                // Node.js processes running in aclue directory
                (command.includes('node') && command.includes('aclue')) ||
                
                // npm dev server
                (command.includes('npm') && command.includes('dev')) ||
                
                // Next.js development server
                command.includes('next-dev') ||
                command.includes('next dev') ||
                
                // Python/uvicorn processes
                (command.includes('python') && (
                    command.includes('uvicorn') || 
                    command.includes('aclue') ||
                    command.includes('main:app')
                )) ||
                
                // Direct uvicorn processes
                command.includes('uvicorn') ||
                
                // Processes with aclue-specific ports
                command.includes(':3000') ||
                command.includes(':8000') ||
                
                // Development servers
                command.includes('vite') ||
                command.includes('webpack') ||
                
                // Process running from aclue directories
                command.includes('aclue-preprod') ||
                command.includes('/web/') ||
                command.includes('/backend/') ||
                
                // Claude Code processes related to aclue
                (command.includes('claude') && command.includes('aclue'));

            if (isAclueRelated) {
                // Try to determine port and service type
                const port = this.extractPort(command);
                const serviceType = this.determineServiceType(command, port);
                
                aclueProcesses.push({
                    ...proc,
                    port,
                    serviceType,
                    priority: this.getTerminationPriority(serviceType)
                });
            }
        }

        // Sort by termination priority (higher priority terminated first)
        return aclueProcesses.sort((a, b) => b.priority - a.priority);
    }

    extractPort(command) {
        // Common port patterns
        const portPatterns = [
            /:(\d{4,5})/g,                    // :3000, :8000
            /--port[= ](\d{4,5})/g,          // --port=3000, --port 3000
            /port[= ](\d{4,5})/g,            // port=3000, port 3000
            /localhost:(\d{4,5})/g,          // localhost:3000
            /0\.0\.0\.0:(\d{4,5})/g         // 0.0.0.0:8000
        ];

        for (const pattern of portPatterns) {
            const matches = Array.from(command.matchAll(pattern));
            for (const match of matches) {
                const port = parseInt(match[1]);
                if (port >= 1000 && port <= 65535) {
                    return port;
                }
            }
        }

        return null;
    }

    determineServiceType(command, port) {
        const cmd = command.toLowerCase();

        // Frontend indicators
        if (cmd.includes('npm') && cmd.includes('dev') ||
            cmd.includes('next') ||
            cmd.includes('react') ||
            cmd.includes('webpack') ||
            cmd.includes('vite') ||
            port === 3000) {
            return 'frontend';
        }

        // Backend indicators
        if (cmd.includes('uvicorn') ||
            cmd.includes('fastapi') ||
            cmd.includes('python') && cmd.includes('main:app') ||
            port === 8000) {
            return 'backend';
        }

        // Other development tools
        if (cmd.includes('claude') ||
            cmd.includes('mcp') ||
            cmd.includes('playwright') ||
            cmd.includes('puppeteer')) {
            return 'tools';
        }

        return 'unknown';
    }

    getTerminationPriority(serviceType) {
        const priorities = {
            'frontend': 2,    // Terminate frontend first
            'backend': 3,     // Then backend
            'tools': 1,       // Tools last
            'unknown': 1      // Unknown processes last
        };

        return priorities[serviceType] || 1;
    }

    async gracefulTermination() {
        try {
            this.log('🔄 Starting graceful process termination...', 'info');

            const aclueProcesses = Array.from(this.discoveredProcesses.values())
                .filter(proc => proc.isAclue);

            if (aclueProcesses.length === 0) {
                return {
                    success: true,
                    terminated: 0,
                    forcedKills: 0,
                    message: 'No processes to terminate'
                };
            }

            const terminationResults = [];

            // Phase 1: Graceful termination (SIGTERM)
            this.log(`📤 Phase 1: Sending SIGTERM to ${aclueProcesses.length} process(es)`, 'info');
            
            for (const proc of aclueProcesses) {
                try {
                    const result = await this.terminateProcessGracefully(proc);
                    terminationResults.push(result);
                } catch (error) {
                    terminationResults.push({
                        pid: proc.pid,
                        success: false,
                        method: 'graceful',
                        error: error.message
                    });
                }
            }

            // Wait for graceful termination
            await this.wait(this.options.gracefulTimeout);

            // Phase 2: Check for remaining processes and force kill if needed
            const remainingProcesses = await this.getRemainingProcesses(aclueProcesses);
            let forcedKills = 0;

            if (remainingProcesses.length > 0) {
                this.log(`⚡ Phase 2: Force terminating ${remainingProcesses.length} remaining process(es)`, 'warning');
                
                for (const proc of remainingProcesses) {
                    try {
                        const result = await this.forceTerminateProcess(proc);
                        if (result.success) forcedKills++;
                        terminationResults.push(result);
                    } catch (error) {
                        terminationResults.push({
                            pid: proc.pid,
                            success: false,
                            method: 'force',
                            error: error.message
                        });
                    }
                }
            }

            const successful = terminationResults.filter(r => r.success).length;
            const total = aclueProcesses.length;

            return {
                success: successful === total,
                terminated: successful,
                forcedKills,
                total,
                results: terminationResults,
                message: `Terminated ${successful}/${total} processes (${forcedKills} forced)`
            };

        } catch (error) {
            throw new Error(`Graceful termination failed: ${error.message}`);
        }
    }

    async terminateProcessGracefully(proc) {
        try {
            this.log(`📤 Sending SIGTERM to PID ${proc.pid} (${proc.serviceType})`, this.options.verbose ? 'info' : null);

            if (process.platform === 'win32') {
                // Windows: Try taskkill with graceful flag first
                await execAsync(`taskkill /pid ${proc.pid}`);
            } else {
                // Unix: Send SIGTERM
                process.kill(proc.pid, 'SIGTERM');
            }

            return {
                pid: proc.pid,
                success: true,
                method: 'graceful',
                signal: 'SIGTERM'
            };

        } catch (error) {
            // Process might already be dead
            if (error.code === 'ESRCH') {
                return {
                    pid: proc.pid,
                    success: true,
                    method: 'graceful',
                    note: 'Process already terminated'
                };
            }

            throw new Error(`Failed to terminate PID ${proc.pid}: ${error.message}`);
        }
    }

    async forceTerminateProcess(proc) {
        try {
            this.log(`⚡ Force terminating PID ${proc.pid}`, this.options.verbose ? 'warning' : null);

            if (process.platform === 'win32') {
                // Windows: Force kill
                await execAsync(`taskkill /f /pid ${proc.pid}`);
            } else {
                // Unix: Send SIGKILL
                process.kill(proc.pid, 'SIGKILL');
            }

            return {
                pid: proc.pid,
                success: true,
                method: 'force',
                signal: process.platform === 'win32' ? 'TASKKILL' : 'SIGKILL'
            };

        } catch (error) {
            // Process might already be dead
            if (error.code === 'ESRCH') {
                return {
                    pid: proc.pid,
                    success: true,
                    method: 'force',
                    note: 'Process already terminated'
                };
            }

            throw new Error(`Failed to force terminate PID ${proc.pid}: ${error.message}`);
        }
    }

    async forceTerminateAll() {
        try {
            this.log('⚡ Starting force termination of all processes', 'warning');

            const aclueProcesses = Array.from(this.discoveredProcesses.values())
                .filter(proc => proc.isAclue);

            const results = [];

            for (const proc of aclueProcesses) {
                try {
                    const result = await this.forceTerminateProcess(proc);
                    results.push(result);
                } catch (error) {
                    results.push({
                        pid: proc.pid,
                        success: false,
                        method: 'force',
                        error: error.message
                    });
                }
            }

            const successful = results.filter(r => r.success).length;

            return {
                success: successful === aclueProcesses.length,
                terminated: successful,
                total: aclueProcesses.length,
                results,
                message: `Force terminated ${successful}/${aclueProcesses.length} processes`
            };

        } catch (error) {
            throw new Error(`Force termination failed: ${error.message}`);
        }
    }

    async emergencyShutdown() {
        try {
            this.log('🚨 Emergency shutdown initiated', 'error');

            // Kill all processes immediately without discovery
            const emergencyCommands = [];

            if (process.platform === 'win32') {
                // Windows emergency commands
                emergencyCommands.push(
                    'taskkill /f /im node.exe',
                    'taskkill /f /im python.exe',
                    `for /f "tokens=5" %a in ('netstat -aon ^| findstr :3000') do taskkill /f /pid %a`,
                    `for /f "tokens=5" %a in ('netstat -aon ^| findstr :8000') do taskkill /f /pid %a`
                );
            } else {
                // Unix emergency commands
                emergencyCommands.push(
                    'pkill -f "npm.*dev"',
                    'pkill -f "uvicorn"',
                    'pkill -f "next-dev"',
                    'lsof -ti:3000 | xargs -r kill -9',
                    'lsof -ti:8000 | xargs -r kill -9'
                );
            }

            const results = [];

            for (const command of emergencyCommands) {
                try {
                    await execAsync(command);
                    results.push({ command, success: true });
                } catch (error) {
                    // Don't fail on individual command errors in emergency mode
                    results.push({ command, success: false, error: error.message });
                }
            }

            const successful = results.filter(r => r.success).length;

            return {
                success: successful > 0,
                terminated: successful,
                commands: emergencyCommands.length,
                results,
                message: `Emergency shutdown: ${successful}/${emergencyCommands.length} commands succeeded`
            };

        } catch (error) {
            throw new Error(`Emergency shutdown failed: ${error.message}`);
        }
    }

    async getRemainingProcesses(originalProcesses) {
        try {
            const remainingProcesses = [];

            for (const proc of originalProcesses) {
                const exists = await this.processExists(proc.pid);
                if (exists) {
                    remainingProcesses.push(proc);
                }
            }

            return remainingProcesses;

        } catch (error) {
            this.log(`⚠️  Failed to check remaining processes: ${error.message}`, 'warning');
            return [];
        }
    }

    async processExists(pid) {
        try {
            if (process.platform === 'win32') {
                const { stdout } = await execAsync(`tasklist /fi "pid eq ${pid}"`);
                return stdout.includes(pid.toString());
            } else {
                process.kill(pid, 0); // Signal 0 checks if process exists without terminating
                return true;
            }
        } catch (error) {
            if (error.code === 'ESRCH') {
                return false; // Process doesn't exist
            }
            return true; // Assume exists if we can't determine
        }
    }

    async verifyTermination() {
        try {
            this.log('🔍 Verifying process termination...', 'info');

            // Re-discover processes to check what's still running
            const currentDiscovery = await this.discoverProcesses();
            const remainingProcesses = currentDiscovery.aclueProcesses;

            if (remainingProcesses.length === 0) {
                return {
                    success: true,
                    remainingProcesses: 0,
                    message: 'All processes terminated successfully'
                };
            } else {
                return {
                    success: false,
                    remainingProcesses: remainingProcesses.length,
                    processes: remainingProcesses,
                    message: `${remainingProcesses.length} process(es) still running`
                };
            }

        } catch (error) {
            return {
                success: false,
                error: error.message,
                message: 'Verification failed'
            };
        }
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    log(message, level = 'info') {
        if (level === null && !this.options.verbose) {
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
        // Clear any tracking data
        this.discoveredProcesses.clear();
        this.terminationAttempts.clear();
    }
}

module.exports = SaveProcessManager;

// CLI usage
if (require.main === module) {
    const manager = new SaveProcessManager();

    const command = process.argv[2];

    switch (command) {
        case 'discover':
            manager.discoverProcesses()
                .then(result => {
                    console.log(`Found ${result.aclueCount} aclue-related processes:`);
                    result.aclueProcesses.forEach(proc => {
                        console.log(`  PID ${proc.pid}: ${proc.command} (${proc.serviceType}, port: ${proc.port || 'N/A'})`);
                    });
                })
                .catch(console.error);
            break;

        case 'graceful':
            manager.discoverProcesses()
                .then(() => manager.gracefulTermination())
                .then(result => console.log(result))
                .catch(console.error);
            break;

        case 'force':
            manager.discoverProcesses()
                .then(() => manager.forceTerminateAll())
                .then(result => console.log(result))
                .catch(console.error);
            break;

        case 'emergency':
            manager.emergencyShutdown()
                .then(result => console.log(result))
                .catch(console.error);
            break;

        default:
            console.log('Available commands: discover, graceful, force, emergency');
    }
}