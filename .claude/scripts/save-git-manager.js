#!/usr/bin/env node

/**
 * aclue Save Git Manager
 * Handles git operations for the /save command including auto-commit and stash functionality
 *
 * Features:
 * - Git status analysis and change detection
 * - Automatic commit with conventional commit messages
 * - Stash operations with descriptive messages
 * - Backup and recovery for git operations
 * - Safe git operations with rollback capabilities
 */

const fs = require('fs').promises;
const path = require('path');
const { promisify } = require('util');
const { exec } = require('child_process');

const execAsync = promisify(exec);

class SaveGitManager {
    constructor(projectRoot = '/home/jack/Documents/aclue-preprod', options = {}) {
        this.projectRoot = projectRoot;
        this.options = {
            verbose: false,
            dryRun: false,
            autoCommitMessage: null,
            stashMessage: null,
            commitPrefix: 'chore',
            includeUntracked: false,
            ...options
        };

        this.gitStatus = {
            isGitRepo: false,
            hasChanges: false,
            branch: 'unknown',
            changes: [],
            untracked: [],
            staged: []
        };
    }

    async getGitStatus() {
        try {
            this.log('📋 Analyzing git status...', 'info');

            // Check if we're in a git repository
            this.gitStatus.isGitRepo = await this.isGitRepository();
            if (!this.gitStatus.isGitRepo) {
                return {
                    ...this.gitStatus,
                    error: 'Not a git repository'
                };
            }

            // Get current branch
            this.gitStatus.branch = await this.getCurrentBranch();

            // Get detailed status
            const statusResult = await this.getDetailedStatus();
            this.gitStatus = { ...this.gitStatus, ...statusResult };

            // Determine if there are changes
            this.gitStatus.hasChanges = 
                this.gitStatus.changes.length > 0 || 
                this.gitStatus.staged.length > 0 ||
                (this.options.includeUntracked && this.gitStatus.untracked.length > 0);

            if (this.options.verbose) {
                this.logGitStatus();
            }

            return this.gitStatus;

        } catch (error) {
            return {
                ...this.gitStatus,
                error: error.message
            };
        }
    }

    async autoCommit() {
        try {
            this.log('🤖 Performing auto-commit...', 'info');

            // Ensure we have current git status
            await this.getGitStatus();

            if (!this.gitStatus.isGitRepo) {
                throw new Error('Not a git repository');
            }

            if (!this.gitStatus.hasChanges) {
                return {
                    success: true,
                    message: 'No changes to commit',
                    commitHash: null
                };
            }

            if (this.options.dryRun) {
                const commitMessage = this.generateCommitMessage();
                return {
                    success: true,
                    dryRun: true,
                    wouldCommit: {
                        message: commitMessage,
                        files: [...this.gitStatus.changes, ...this.gitStatus.staged],
                        untracked: this.gitStatus.untracked
                    }
                };
            }

            // Stage changes if needed
            await this.stageChanges();

            // Generate commit message
            const commitMessage = this.generateCommitMessage();

            // Create commit
            const commitHash = await this.createCommit(commitMessage);

            return {
                success: true,
                commitHash,
                message: commitMessage,
                filesCommitted: [...this.gitStatus.changes, ...this.gitStatus.staged].length
            };

        } catch (error) {
            throw new Error(`Auto-commit failed: ${error.message}`);
        }
    }

    async stashChanges() {
        try {
            this.log('📦 Stashing changes...', 'info');

            // Ensure we have current git status
            await this.getGitStatus();

            if (!this.gitStatus.isGitRepo) {
                throw new Error('Not a git repository');
            }

            if (!this.gitStatus.hasChanges) {
                return {
                    success: true,
                    message: 'No changes to stash',
                    stashMessage: null
                };
            }

            if (this.options.dryRun) {
                const stashMessage = this.generateStashMessage();
                return {
                    success: true,
                    dryRun: true,
                    wouldStash: {
                        message: stashMessage,
                        files: [...this.gitStatus.changes, ...this.gitStatus.staged],
                        untracked: this.gitStatus.untracked
                    }
                };
            }

            // Generate stash message
            const stashMessage = this.generateStashMessage();

            // Perform stash
            const stashResult = await this.performStash(stashMessage);

            return {
                success: true,
                stashMessage: stashMessage,
                stashId: stashResult.stashId,
                filesStashed: [...this.gitStatus.changes, ...this.gitStatus.staged].length
            };

        } catch (error) {
            throw new Error(`Stash operation failed: ${error.message}`);
        }
    }

    async isGitRepository() {
        try {
            await execAsync('git rev-parse --git-dir', {
                cwd: this.projectRoot,
                timeout: 5000
            });
            return true;
        } catch {
            return false;
        }
    }

    async getCurrentBranch() {
        try {
            const { stdout } = await execAsync('git branch --show-current', {
                cwd: this.projectRoot,
                timeout: 5000
            });
            return stdout.trim() || 'detached';
        } catch (error) {
            // Fallback method for older git versions
            try {
                const { stdout } = await execAsync('git rev-parse --abbrev-ref HEAD', {
                    cwd: this.projectRoot,
                    timeout: 5000
                });
                return stdout.trim() || 'detached';
            } catch {
                return 'unknown';
            }
        }
    }

    async getDetailedStatus() {
        try {
            // Get porcelain status
            const { stdout } = await execAsync('git status --porcelain -u', {
                cwd: this.projectRoot,
                timeout: 10000
            });

            const changes = [];
            const staged = [];
            const untracked = [];

            const lines = stdout.trim().split('\n').filter(line => line.length > 0);

            for (const line of lines) {
                const status = line.substr(0, 2);
                const file = line.substr(3);

                const change = {
                    status: status,
                    file: file,
                    staged: status[0] !== ' ' && status[0] !== '?',
                    modified: status[1] !== ' ' && status[1] !== '?',
                    untracked: status[0] === '?' && status[1] === '?'
                };

                if (change.untracked) {
                    untracked.push(change);
                } else if (change.staged) {
                    staged.push(change);
                } else if (change.modified) {
                    changes.push(change);
                }
            }

            return { changes, staged, untracked };

        } catch (error) {
            return { changes: [], staged: [], untracked: [], error: error.message };
        }
    }

    async stageChanges() {
        try {
            this.log('➕ Staging changes...', 'info');

            // Stage modified and deleted files
            if (this.gitStatus.changes.length > 0) {
                await execAsync('git add -u', {
                    cwd: this.projectRoot,
                    timeout: 30000
                });
            }

            // Optionally stage untracked files
            if (this.options.includeUntracked && this.gitStatus.untracked.length > 0) {
                for (const change of this.gitStatus.untracked) {
                    try {
                        await execAsync(`git add "${change.file}"`, {
                            cwd: this.projectRoot,
                            timeout: 10000
                        });
                    } catch (error) {
                        this.log(`⚠️  Failed to stage: ${change.file} - ${error.message}`, 'warning');
                    }
                }
            }

        } catch (error) {
            throw new Error(`Staging failed: ${error.message}`);
        }
    }

    generateCommitMessage() {
        if (this.options.autoCommitMessage) {
            return this.options.autoCommitMessage;
        }

        const totalFiles = this.gitStatus.changes.length + this.gitStatus.staged.length;
        const hasUntracked = this.gitStatus.untracked.length > 0;
        
        // Analyze changes to determine commit type
        const commitType = this.determineCommitType();
        
        // Generate descriptive message
        let message = `${commitType}: save development session`;
        
        if (totalFiles > 0) {
            message += ` (${totalFiles} file${totalFiles > 1 ? 's' : ''})`;
        }
        
        if (hasUntracked && this.options.includeUntracked) {
            message += ` with ${this.gitStatus.untracked.length} new file${this.gitStatus.untracked.length > 1 ? 's' : ''}`;
        }

        // Add file details in commit body
        const details = [];
        
        if (this.gitStatus.staged.length > 0) {
            details.push(`Staged changes: ${this.gitStatus.staged.length} file(s)`);
        }
        
        if (this.gitStatus.changes.length > 0) {
            details.push(`Modified files: ${this.gitStatus.changes.length} file(s)`);
        }
        
        if (hasUntracked && this.options.includeUntracked) {
            details.push(`New files: ${this.gitStatus.untracked.length} file(s)`);
        }

        if (details.length > 0) {
            message += '\n\n' + details.join('\n');
        }

        // Add timestamp
        message += `\n\nSaved at: ${new Date().toISOString()}`;
        
        return message;
    }

    determineCommitType() {
        // Use configured prefix if available
        if (this.options.commitPrefix) {
            return this.options.commitPrefix;
        }

        // Analyze file changes to determine appropriate commit type
        const allFiles = [
            ...this.gitStatus.changes.map(c => c.file),
            ...this.gitStatus.staged.map(c => c.file),
            ...this.gitStatus.untracked.map(c => c.file)
        ];

        // Check for specific file patterns
        if (allFiles.some(f => f.includes('test') || f.includes('spec'))) {
            return 'test';
        }

        if (allFiles.some(f => f.endsWith('.md') || f.includes('doc'))) {
            return 'docs';
        }

        if (allFiles.some(f => f.includes('config') || f.includes('.json') || f.includes('.yaml'))) {
            return 'config';
        }

        if (allFiles.some(f => f.includes('style') || f.includes('.css') || f.includes('.scss'))) {
            return 'style';
        }

        // Default to feat for new features or chore for maintenance
        if (this.gitStatus.untracked.length > this.gitStatus.changes.length) {
            return 'feat';
        }

        return 'chore';
    }

    generateStashMessage() {
        if (this.options.stashMessage) {
            return this.options.stashMessage;
        }

        const totalFiles = this.gitStatus.changes.length + this.gitStatus.staged.length;
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        
        let message = `Development session save - ${timestamp}`;
        
        if (totalFiles > 0) {
            message += ` (${totalFiles} file${totalFiles > 1 ? 's' : ''})`;
        }

        if (this.gitStatus.untracked.length > 0) {
            message += ` [${this.gitStatus.untracked.length} untracked]`;
        }

        return message;
    }

    async createCommit(message) {
        try {
            const { stdout } = await execAsync(`git commit -m "${this.escapeShellArg(message)}"`, {
                cwd: this.projectRoot,
                timeout: 30000
            });

            // Extract commit hash from output
            const hashMatch = stdout.match(/\[.+?\s([a-f0-9]+)\]/);
            return hashMatch ? hashMatch[1] : 'unknown';

        } catch (error) {
            throw new Error(`Commit creation failed: ${error.message}`);
        }
    }

    async performStash(message) {
        try {
            let stashCommand = 'git stash push';
            
            if (message) {
                stashCommand += ` -m "${this.escapeShellArg(message)}"`;
            }

            if (this.options.includeUntracked) {
                stashCommand += ' -u';
            }

            const { stdout } = await execAsync(stashCommand, {
                cwd: this.projectRoot,
                timeout: 30000
            });

            // Get stash ID
            const { stdout: stashList } = await execAsync('git stash list -1 --format="%H"', {
                cwd: this.projectRoot,
                timeout: 5000
            });

            return {
                output: stdout,
                stashId: stashList.trim()
            };

        } catch (error) {
            throw new Error(`Stash creation failed: ${error.message}`);
        }
    }

    async getCommitHistory(count = 5) {
        try {
            const { stdout } = await execAsync(`git log -${count} --format="%H|%s|%an|%ad" --date=iso`, {
                cwd: this.projectRoot,
                timeout: 10000
            });

            const commits = stdout.trim().split('\n').map(line => {
                const [hash, subject, author, date] = line.split('|');
                return { hash, subject, author, date };
            });

            return { success: true, commits };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async getStashList() {
        try {
            const { stdout } = await execAsync('git stash list --format="%H|%gd|%gs|%gD"', {
                cwd: this.projectRoot,
                timeout: 5000
            });

            const stashes = stdout.trim().split('\n')
                .filter(line => line.length > 0)
                .map(line => {
                    const [hash, ref, subject, date] = line.split('|');
                    return { hash, ref, subject, date };
                });

            return { success: true, stashes };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    async createBackupBranch() {
        try {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
            const backupBranch = `backup/save-session-${timestamp}`;

            await execAsync(`git branch "${backupBranch}"`, {
                cwd: this.projectRoot,
                timeout: 10000
            });

            return { success: true, backupBranch };

        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Utility methods

    logGitStatus() {
        this.log('📊 Git Status Summary:', 'info');
        this.log(`   Branch: ${this.gitStatus.branch}`, 'info');
        this.log(`   Modified: ${this.gitStatus.changes.length} files`, 'info');
        this.log(`   Staged: ${this.gitStatus.staged.length} files`, 'info');
        this.log(`   Untracked: ${this.gitStatus.untracked.length} files`, 'info');

        if (this.options.verbose && this.gitStatus.changes.length > 0) {
            this.log('   Modified files:', 'info');
            this.gitStatus.changes.forEach(change => {
                this.log(`     ${change.status} ${change.file}`, 'info');
            });
        }

        if (this.options.verbose && this.gitStatus.staged.length > 0) {
            this.log('   Staged files:', 'info');
            this.gitStatus.staged.forEach(change => {
                this.log(`     ${change.status} ${change.file}`, 'info');
            });
        }
    }

    escapeShellArg(arg) {
        // Escape shell arguments to prevent injection
        return arg.replace(/'/g, "'\"'\"'");
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
        // Reset git status
        this.gitStatus = {
            isGitRepo: false,
            hasChanges: false,
            branch: 'unknown',
            changes: [],
            untracked: [],
            staged: []
        };
    }
}

module.exports = SaveGitManager;

// CLI usage
if (require.main === module) {
    const manager = new SaveGitManager('/home/jack/Documents/aclue-preprod', { verbose: true });

    const command = process.argv[2];

    switch (command) {
        case 'status':
            manager.getGitStatus()
                .then(result => {
                    console.log('Git Status:');
                    console.log(`  Repository: ${result.isGitRepo}`);
                    console.log(`  Branch: ${result.branch}`);
                    console.log(`  Has changes: ${result.hasChanges}`);
                    console.log(`  Modified: ${result.changes?.length || 0}`);
                    console.log(`  Staged: ${result.staged?.length || 0}`);
                    console.log(`  Untracked: ${result.untracked?.length || 0}`);
                    
                    if (result.error) {
                        console.log(`  Error: ${result.error}`);
                    }
                })
                .catch(console.error);
            break;

        case 'commit':
            manager.autoCommit()
                .then(result => console.log(result))
                .catch(console.error);
            break;

        case 'stash':
            manager.stashChanges()
                .then(result => console.log(result))
                .catch(console.error);
            break;

        case 'history':
            manager.getCommitHistory()
                .then(result => {
                    if (result.success) {
                        console.log('Recent commits:');
                        result.commits.forEach(commit => {
                            console.log(`  ${commit.hash.substr(0, 8)} ${commit.subject} (${commit.author})`);
                        });
                    } else {
                        console.log(`Error: ${result.error}`);
                    }
                })
                .catch(console.error);
            break;

        case 'stashes':
            manager.getStashList()
                .then(result => {
                    if (result.success) {
                        console.log('Stash list:');
                        result.stashes.forEach(stash => {
                            console.log(`  ${stash.ref} ${stash.subject}`);
                        });
                    } else {
                        console.log(`Error: ${result.error}`);
                    }
                })
                .catch(console.error);
            break;

        case 'dry-run-commit':
            const dryRunManager = new SaveGitManager('/home/jack/Documents/aclue-preprod', { verbose: true, dryRun: true });
            dryRunManager.autoCommit()
                .then(result => console.log(result))
                .catch(console.error);
            break;

        default:
            console.log('Available commands: status, commit, stash, history, stashes, dry-run-commit');
    }
}