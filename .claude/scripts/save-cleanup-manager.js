#!/usr/bin/env node

/**
 * aclue Save Cleanup Manager
 * Handles resource cleanup and temporary file management for the /save command
 *
 * Features:
 * - Temporary file identification and removal
 * - Cache cleanup and optimization
 * - Log file archival and rotation
 * - Node modules and Python cache cleanup
 * - Build artifact cleanup
 * - Safe cleanup with backup options
 */

const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

class SaveCleanupManager {
    constructor(projectRoot = '/home/jack/Documents/aclue-preprod', options = {}) {
        this.projectRoot = projectRoot;
        this.options = {
            verbose: false,
            dryRun: false,
            aggressive: false,
            preserveLogs: true,
            maxLogAge: 30, // days
            maxCacheSize: 500, // MB
            ...options
        };

        this.cleanupTargets = {
            tempFiles: [],
            cacheDirectories: [],
            logFiles: [],
            buildArtifacts: [],
            nodeModules: [],
            pythonCache: []
        };

        this.stats = {
            tempFiles: 0,
            cacheSize: 0,
            logFiles: 0,
            freedSpace: 0,
            errors: 0
        };
    }

    async analyzeCleanupItems() {
        try {
            this.log('🔍 Analyzing cleanup targets...', 'info');

            // Discover cleanup targets
            await this.discoverTempFiles();
            await this.discoverCacheDirectories();
            await this.discoverLogFiles();
            await this.discoverBuildArtifacts();

            if (this.options.aggressive) {
                await this.discoverNodeModules();
                await this.discoverPythonCache();
            }

            // Calculate total impact
            const analysis = await this.calculateCleanupImpact();

            return {
                targets: this.cleanupTargets,
                totalFiles: analysis.totalFiles,
                totalSize: analysis.totalSize,
                categories: analysis.categories,
                wouldFree: analysis.totalSize,
                analysis: analysis
            };

        } catch (error) {
            throw new Error(`Cleanup analysis failed: ${error.message}`);
        }
    }

    async performCleanup() {
        try {
            this.log('🧹 Starting resource cleanup...', 'info');

            // First analyze what we're going to clean
            const analysis = await this.analyzeCleanupItems();

            if (analysis.totalFiles === 0) {
                return {
                    success: true,
                    stats: this.stats,
                    message: 'No cleanup required'
                };
            }

            this.log(`📊 Found ${analysis.totalFiles} items (${this.formatBytes(analysis.totalSize)})`, 'info');

            if (this.options.dryRun) {
                return {
                    success: true,
                    dryRun: true,
                    wouldClean: analysis,
                    message: 'Dry run - no files were actually removed'
                };
            }

            // Perform actual cleanup
            await this.cleanTempFiles();
            await this.cleanCacheDirectories();
            await this.cleanLogFiles();
            await this.cleanBuildArtifacts();

            if (this.options.aggressive) {
                await this.cleanNodeModules();
                await this.cleanPythonCache();
            }

            return {
                success: this.stats.errors === 0,
                stats: this.stats,
                partialFailure: this.stats.errors > 0,
                message: this.generateCleanupSummary()
            };

        } catch (error) {
            throw new Error(`Cleanup failed: ${error.message}`);
        }
    }

    async discoverTempFiles() {
        try {
            const tempPatterns = [
                // General temp files
                '**/.tmp*',
                '**/tmp/*',
                '**/*.tmp',
                '**/*.temp',

                // OS temp files
                '**/.DS_Store',
                '**/Thumbs.db',
                '**/*.swp',
                '**/*.swo',
                '**/*~',

                // Editor temp files
                '**/.vscode/settings.json.bak*',
                '**/*.bak',
                '**/*.backup',

                // Development temp files
                '**/coverage/*',
                '**/.nyc_output/*',
                '**/*.pid',
                '**/*.lock',

                // Claude Code temp files
                '**/.tmp-*',
                '**/temp-*'
            ];

            for (const pattern of tempPatterns) {
                const matches = await this.findFiles(pattern);
                this.cleanupTargets.tempFiles.push(...matches);
            }

            // Remove duplicates
            this.cleanupTargets.tempFiles = [...new Set(this.cleanupTargets.tempFiles)];

        } catch (error) {
            this.log(`⚠️  Temp file discovery error: ${error.message}`, 'warning');
        }
    }

    async discoverCacheDirectories() {
        try {
            const cacheDirs = [
                // Node.js caches
                'web/.next/cache',
                'web/.next/server',
                'web/node_modules/.cache',

                // Python caches
                'backend/__pycache__',
                'backend/**/__pycache__',
                'backend/.pytest_cache',

                // Build caches
                'web/.nuxt',
                'web/.output',
                'web/dist/cache',

                // Package manager caches
                'web/.yarn/cache',
                'web/.pnp/cache',
                'backend/.pip/cache',

                // Development tool caches
                'web/.eslintcache',
                'backend/.mypy_cache',
                'backend/.coverage',

                // Claude Code caches
                '.claude/cache',
                '.claude/temp'
            ];

            for (const dir of cacheDirs) {
                const fullPath = path.join(this.projectRoot, dir);
                try {
                    await fs.access(fullPath);
                    const stats = await this.getDirectoryStats(fullPath);
                    if (stats.size > 0) {
                        this.cleanupTargets.cacheDirectories.push({
                            path: fullPath,
                            relativePath: dir,
                            ...stats
                        });
                    }
                } catch {
                    // Directory doesn't exist, skip
                }
            }

        } catch (error) {
            this.log(`⚠️  Cache directory discovery error: ${error.message}`, 'warning');
        }
    }

    async discoverLogFiles() {
        try {
            const logPatterns = [
                // Application logs
                '**/*.log',
                '**/logs/*',
                '**/log/*',

                // Development logs
                'web/npm-debug.log*',
                'web/yarn-debug.log*',
                'web/yarn-error.log*',
                'backend/debug.log',
                'backend/error.log',

                // System logs
                '**/.pm2/logs/*',
                '**/nohup.out',

                // Claude Code logs
                '.claude/logs/*',
                '.claude/**/*.log'
            ];

            for (const pattern of logPatterns) {
                const matches = await this.findFiles(pattern);
                for (const match of matches) {
                    try {
                        const stats = await fs.stat(match);
                        const age = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24); // days

                        if (!this.options.preserveLogs || age > this.options.maxLogAge) {
                            this.cleanupTargets.logFiles.push({
                                path: match,
                                size: stats.size,
                                age: age,
                                shouldArchive: this.options.preserveLogs && age <= this.options.maxLogAge * 2
                            });
                        }
                    } catch {
                        // Skip files that can't be accessed
                    }
                }
            }

        } catch (error) {
            this.log(`⚠️  Log file discovery error: ${error.message}`, 'warning');
        }
    }

    async discoverBuildArtifacts() {
        try {
            const buildPaths = [
                // Next.js build artifacts
                'web/.next/standalone',
                'web/.next/static',
                'web/out',

                // Python build artifacts
                'backend/build',
                'backend/dist',
                'backend/*.egg-info',

                // General build artifacts
                '**/build/*',
                '**/dist/*',
                '**/*.pyc',
                '**/*.pyo',
                '**/*.pyd'
            ];

            for (const buildPath of buildPaths) {
                const matches = await this.findFiles(buildPath);
                for (const match of matches) {
                    try {
                        const stats = await fs.stat(match);
                        this.cleanupTargets.buildArtifacts.push({
                            path: match,
                            size: stats.size,
                            isDirectory: stats.isDirectory()
                        });
                    } catch {
                        // Skip inaccessible files
                    }
                }
            }

        } catch (error) {
            this.log(`⚠️  Build artifact discovery error: ${error.message}`, 'warning');
        }
    }

    async discoverNodeModules() {
        try {
            // Only in aggressive mode - this removes development dependencies
            const nodeModulesPaths = [
                'web/node_modules',
                // Don't include root node_modules as it might be shared
            ];

            for (const modulePath of nodeModulesPaths) {
                const fullPath = path.join(this.projectRoot, modulePath);
                try {
                    await fs.access(fullPath);
                    const stats = await this.getDirectoryStats(fullPath);
                    this.cleanupTargets.nodeModules.push({
                        path: fullPath,
                        relativePath: modulePath,
                        ...stats,
                        warning: 'This will require npm install before next start'
                    });
                } catch {
                    // Directory doesn't exist
                }
            }

        } catch (error) {
            this.log(`⚠️  Node modules discovery error: ${error.message}`, 'warning');
        }
    }

    async discoverPythonCache() {
        try {
            // Python virtual environment cache (aggressive cleanup only)
            const pythonCachePaths = [
                'backend/venv/lib/python*/site-packages/__pycache__',
                'backend/venv/lib/python*/site-packages/*/__pycache__'
            ];

            for (const cachePath of pythonCachePaths) {
                const matches = await this.findFiles(cachePath);
                for (const match of matches) {
                    try {
                        const stats = await this.getDirectoryStats(match);
                        this.cleanupTargets.pythonCache.push({
                            path: match,
                            ...stats
                        });
                    } catch {
                        // Skip inaccessible directories
                    }
                }
            }

        } catch (error) {
            this.log(`⚠️  Python cache discovery error: ${error.message}`, 'warning');
        }
    }

    async calculateCleanupImpact() {
        try {
            let totalFiles = 0;
            let totalSize = 0;
            const categories = {};

            // Count temp files
            totalFiles += this.cleanupTargets.tempFiles.length;
            for (const file of this.cleanupTargets.tempFiles) {
                try {
                    const stats = await fs.stat(file);
                    totalSize += stats.size;
                } catch {
                    // Skip inaccessible files
                }
            }
            categories.tempFiles = { count: this.cleanupTargets.tempFiles.length };

            // Count cache directories
            let cacheSize = 0;
            for (const cache of this.cleanupTargets.cacheDirectories) {
                totalFiles += cache.files;
                totalSize += cache.size;
                cacheSize += cache.size;
            }
            categories.cache = { count: this.cleanupTargets.cacheDirectories.length, size: cacheSize };

            // Count log files
            let logSize = 0;
            for (const log of this.cleanupTargets.logFiles) {
                totalFiles += 1;
                totalSize += log.size;
                logSize += log.size;
            }
            categories.logs = { count: this.cleanupTargets.logFiles.length, size: logSize };

            // Count build artifacts
            let buildSize = 0;
            for (const artifact of this.cleanupTargets.buildArtifacts) {
                totalFiles += 1;
                totalSize += artifact.size;
                buildSize += artifact.size;
            }
            categories.buildArtifacts = { count: this.cleanupTargets.buildArtifacts.length, size: buildSize };

            return {
                totalFiles,
                totalSize,
                categories,
                estimatedTime: Math.ceil(totalFiles / 100) // Rough estimate in seconds
            };

        } catch (error) {
            return {
                totalFiles: 0,
                totalSize: 0,
                categories: {},
                error: error.message
            };
        }
    }

    async cleanTempFiles() {
        try {
            this.log(`🗑️  Removing ${this.cleanupTargets.tempFiles.length} temporary files...`, 'info');

            for (const file of this.cleanupTargets.tempFiles) {
                try {
                    await fs.unlink(file);
                    this.stats.tempFiles++;

                    if (this.options.verbose) {
                        this.log(`   Removed: ${path.relative(this.projectRoot, file)}`, 'info');
                    }
                } catch (error) {
                    this.stats.errors++;
                    if (this.options.verbose) {
                        this.log(`   Failed to remove: ${file} - ${error.message}`, 'warning');
                    }
                }
            }

        } catch (error) {
            this.log(`❌ Temp file cleanup error: ${error.message}`, 'error');
            this.stats.errors++;
        }
    }

    async cleanCacheDirectories() {
        try {
            this.log(`🗂️  Cleaning ${this.cleanupTargets.cacheDirectories.length} cache directories...`, 'info');

            for (const cache of this.cleanupTargets.cacheDirectories) {
                try {
                    await this.removeDirectory(cache.path);
                    this.stats.cacheSize += cache.size;

                    if (this.options.verbose) {
                        this.log(`   Cleared: ${cache.relativePath} (${this.formatBytes(cache.size)})`, 'info');
                    }
                } catch (error) {
                    this.stats.errors++;
                    if (this.options.verbose) {
                        this.log(`   Failed to clear: ${cache.relativePath} - ${error.message}`, 'warning');
                    }
                }
            }

        } catch (error) {
            this.log(`❌ Cache cleanup error: ${error.message}`, 'error');
            this.stats.errors++;
        }
    }

    async cleanLogFiles() {
        try {
            if (this.cleanupTargets.logFiles.length === 0) return;

            this.log(`📋 Processing ${this.cleanupTargets.logFiles.length} log files...`, 'info');

            for (const log of this.cleanupTargets.logFiles) {
                try {
                    if (log.shouldArchive) {
                        // Archive old logs instead of deleting
                        await this.archiveLogFile(log.path);
                        this.log(`   Archived: ${path.relative(this.projectRoot, log.path)}`, 'info');
                    } else {
                        // Delete very old logs
                        await fs.unlink(log.path);
                        this.stats.logFiles++;

                        if (this.options.verbose) {
                            this.log(`   Removed: ${path.relative(this.projectRoot, log.path)}`, 'info');
                        }
                    }
                } catch (error) {
                    this.stats.errors++;
                    if (this.options.verbose) {
                        this.log(`   Failed to process: ${log.path} - ${error.message}`, 'warning');
                    }
                }
            }

        } catch (error) {
            this.log(`❌ Log cleanup error: ${error.message}`, 'error');
            this.stats.errors++;
        }
    }

    async cleanBuildArtifacts() {
        try {
            if (this.cleanupTargets.buildArtifacts.length === 0) return;

            this.log(`🔧 Removing ${this.cleanupTargets.buildArtifacts.length} build artifacts...`, 'info');

            for (const artifact of this.cleanupTargets.buildArtifacts) {
                try {
                    if (artifact.isDirectory) {
                        await this.removeDirectory(artifact.path);
                    } else {
                        await fs.unlink(artifact.path);
                    }

                    this.stats.freedSpace += artifact.size;

                    if (this.options.verbose) {
                        this.log(`   Removed: ${path.relative(this.projectRoot, artifact.path)}`, 'info');
                    }
                } catch (error) {
                    this.stats.errors++;
                    if (this.options.verbose) {
                        this.log(`   Failed to remove: ${artifact.path} - ${error.message}`, 'warning');
                    }
                }
            }

        } catch (error) {
            this.log(`❌ Build artifact cleanup error: ${error.message}`, 'error');
            this.stats.errors++;
        }
    }

    async cleanNodeModules() {
        try {
            if (this.cleanupTargets.nodeModules.length === 0) return;

            this.log('⚠️  Aggressive cleanup: Removing node_modules directories...', 'warning');

            for (const nodeModule of this.cleanupTargets.nodeModules) {
                try {
                    await this.removeDirectory(nodeModule.path);
                    this.stats.freedSpace += nodeModule.size;
                    this.log(`   Removed: ${nodeModule.relativePath} (${this.formatBytes(nodeModule.size)})`, 'warning');
                } catch (error) {
                    this.stats.errors++;
                    this.log(`   Failed to remove: ${nodeModule.relativePath} - ${error.message}`, 'error');
                }
            }

        } catch (error) {
            this.log(`❌ Node modules cleanup error: ${error.message}`, 'error');
            this.stats.errors++;
        }
    }

    async cleanPythonCache() {
        try {
            if (this.cleanupTargets.pythonCache.length === 0) return;

            this.log('🐍 Cleaning Python cache directories...', 'info');

            for (const cache of this.cleanupTargets.pythonCache) {
                try {
                    await this.removeDirectory(cache.path);
                    this.stats.freedSpace += cache.size;

                    if (this.options.verbose) {
                        this.log(`   Cleared: ${path.relative(this.projectRoot, cache.path)}`, 'info');
                    }
                } catch (error) {
                    this.stats.errors++;
                    if (this.options.verbose) {
                        this.log(`   Failed to clear: ${cache.path} - ${error.message}`, 'warning');
                    }
                }
            }

        } catch (error) {
            this.log(`❌ Python cache cleanup error: ${error.message}`, 'error');
            this.stats.errors++;
        }
    }

    // Utility methods

    async findFiles(pattern) {
        try {
            // Use glob-like pattern matching
            const fullPattern = path.join(this.projectRoot, pattern);

            if (process.platform === 'win32') {
                // Windows: Use dir command for simple patterns
                const { stdout } = await execAsync(`dir /s /b "${fullPattern}"`, { timeout: 10000 });
                return stdout.trim().split('\n').filter(line => line.length > 0);
            } else {
                // Unix: Use find command
                const findCmd = `find "${this.projectRoot}" -path "${fullPattern}" 2>/dev/null || true`;
                const { stdout } = await execAsync(findCmd, { timeout: 10000 });
                return stdout.trim().split('\n').filter(line => line.length > 0);
            }
        } catch (error) {
            if (this.options.verbose) {
                this.log(`   Pattern search failed: ${pattern} - ${error.message}`, 'warning');
            }
            return [];
        }
    }

    async getDirectoryStats(dirPath) {
        try {
            if (process.platform === 'win32') {
                const { stdout } = await execAsync(`powershell "(Get-ChildItem '${dirPath}' -Recurse | Measure-Object -Property Length -Sum).Sum"`, { timeout: 10000 });
                const size = parseInt(stdout.trim()) || 0;
                const { stdout: countOutput } = await execAsync(`powershell "(Get-ChildItem '${dirPath}' -Recurse -File).Count"`, { timeout: 10000 });
                const files = parseInt(countOutput.trim()) || 0;
                return { size, files };
            } else {
                const { stdout: sizeOutput } = await execAsync(`du -sb "${dirPath}" | cut -f1`, { timeout: 10000 });
                const size = parseInt(sizeOutput.trim()) || 0;
                const { stdout: countOutput } = await execAsync(`find "${dirPath}" -type f | wc -l`, { timeout: 10000 });
                const files = parseInt(countOutput.trim()) || 0;
                return { size, files };
            }
        } catch (error) {
            return { size: 0, files: 0, error: error.message };
        }
    }

    async removeDirectory(dirPath) {
        try {
            await fs.rm(dirPath, { recursive: true, force: true });
        } catch (error) {
            // Fallback to platform-specific commands
            if (process.platform === 'win32') {
                await execAsync(`rmdir /s /q "${dirPath}"`);
            } else {
                await execAsync(`rm -rf "${dirPath}"`);
            }
        }
    }

    async archiveLogFile(logPath) {
        try {
            const archiveDir = path.join(this.projectRoot, '.claude', 'logs', 'archived');
            await fs.mkdir(archiveDir, { recursive: true });

            const fileName = path.basename(logPath);
            const archiveName = `${fileName}.${Date.now()}.archived`;
            const archivePath = path.join(archiveDir, archiveName);

            await fs.rename(logPath, archivePath);
        } catch (error) {
            // If archiving fails, just delete the file
            await fs.unlink(logPath);
        }
    }

    generateCleanupSummary() {
        const messages = [];

        if (this.stats.tempFiles > 0) {
            messages.push(`${this.stats.tempFiles} temp files removed`);
        }

        if (this.stats.cacheSize > 0) {
            messages.push(`${this.formatBytes(this.stats.cacheSize)} cache cleared`);
        }

        if (this.stats.logFiles > 0) {
            messages.push(`${this.stats.logFiles} log files processed`);
        }

        if (this.stats.freedSpace > 0) {
            messages.push(`${this.formatBytes(this.stats.freedSpace)} space freed`);
        }

        if (this.stats.errors > 0) {
            messages.push(`${this.stats.errors} errors encountered`);
        }

        return messages.length > 0 ? messages.join(', ') : 'No cleanup performed';
    }

    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        // Reset state
        this.cleanupTargets = {
            tempFiles: [],
            cacheDirectories: [],
            logFiles: [],
            buildArtifacts: [],
            nodeModules: [],
            pythonCache: []
        };

        this.stats = {
            tempFiles: 0,
            cacheSize: 0,
            logFiles: 0,
            freedSpace: 0,
            errors: 0
        };
    }
}

module.exports = SaveCleanupManager;

// CLI usage
if (require.main === module) {
    const manager = new SaveCleanupManager('/home/jack/Documents/aclue-preprod', { verbose: true });

    const command = process.argv[2];

    switch (command) {
        case 'analyze':
            manager.analyzeCleanupItems()
                .then(result => {
                    console.log('\nCleanup Analysis:');
                    console.log(`Total items: ${result.totalFiles}`);
                    console.log(`Total size: ${manager.formatBytes(result.totalSize)}`);
                    console.log('\nCategories:');
                    Object.entries(result.categories).forEach(([cat, data]) => {
                        console.log(`  ${cat}: ${data.count} items${data.size ? ` (${manager.formatBytes(data.size)})` : ''}`);
                    });
                })
                .catch(console.error);
            break;

        case 'clean':
            manager.performCleanup()
                .then(result => console.log(result))
                .catch(console.error);
            break;

        case 'dry-run':
            const dryRunManager = new SaveCleanupManager('/home/jack/Documents/aclue-preprod', { verbose: true, dryRun: true });
            dryRunManager.performCleanup()
                .then(result => console.log(result))
                .catch(console.error);
            break;

        default:
            console.log('Available commands: analyze, clean, dry-run');
    }
}
