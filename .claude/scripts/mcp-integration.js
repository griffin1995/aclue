#!/usr/bin/env node

/**
 * aclue MCP Integration Helper
 * Provides integration with MCP servers for enhanced /start command functionality
 *
 * Supports:
 * - Railway deployment monitoring
 * - Vercel deployment status
 * - Playwright browser automation
 * - Memory context management
 * - File system operations
 */

const { spawn, exec } = require('child_process');
const { promisify } = require('util');
const path = require('path');
const fs = require('fs').promises;

const execAsync = promisify(exec);

class MCPIntegration {
    constructor(projectRoot = '/home/jack/Documents/aclue-preprod') {
        this.projectRoot = projectRoot;
        this.mcpConfig = null;
        this.activeConnections = new Map();
    }

    async initialize() {
        try {
            // Load MCP configuration
            const mcpConfigPath = path.join(this.projectRoot, '.claude', 'mcp.optimized.json');
            const configContent = await fs.readFile(mcpConfigPath, 'utf8');
            this.mcpConfig = JSON.parse(configContent);

            return true;
        } catch (error) {
            console.warn(`Warning: Could not load MCP config: ${error.message}`);
            return false;
        }
    }

    /**
     * Railway MCP Integration
     */
    async checkRailwayDeploymentStatus() {
        if (!this.mcpConfig?.mcpServers?.railway) {
            return { status: 'not_configured', message: 'Railway MCP not configured' };
        }

        try {
            // Use Railway MCP to check deployment status
            const projectId = this.mcpConfig.project?.railwayProjectId;
            const serviceId = this.mcpConfig.project?.railwayServiceId;

            if (!projectId || !serviceId) {
                return { status: 'not_configured', message: 'Railway project IDs not configured' };
            }

            // This would integrate with actual Railway MCP server
            // For now, we'll do a simple HTTP health check
            const backendUrl = this.mcpConfig.project?.backendUrl;
            if (backendUrl) {
                const isHealthy = await this.httpHealthCheck(`${backendUrl}/health`);
                return {
                    status: isHealthy ? 'operational' : 'degraded',
                    message: isHealthy ? 'Railway deployment is healthy' : 'Railway deployment health check failed',
                    url: backendUrl
                };
            }

            return { status: 'unknown', message: 'No backend URL configured' };
        } catch (error) {
            return { status: 'error', message: `Railway check failed: ${error.message}` };
        }
    }

    async getRailwayLogs(lines = 100) {
        if (!this.mcpConfig?.mcpServers?.railway) {
            throw new Error('Railway MCP not configured');
        }

        try {
            // This would integrate with Railway MCP to fetch logs
            // For now, return a placeholder
            return {
                success: false,
                message: 'Railway MCP log integration not yet implemented',
                logs: []
            };
        } catch (error) {
            throw new Error(`Failed to fetch Railway logs: ${error.message}`);
        }
    }

    /**
     * Vercel MCP Integration
     */
    async checkVercelDeploymentStatus() {
        if (!this.mcpConfig?.mcpServers?.vercel) {
            return { status: 'not_configured', message: 'Vercel MCP not configured' };
        }

        try {
            const domain = this.mcpConfig.project?.domain;
            if (!domain) {
                return { status: 'not_configured', message: 'Domain not configured' };
            }

            const isHealthy = await this.httpHealthCheck(`https://${domain}`);
            return {
                status: isHealthy ? 'operational' : 'degraded',
                message: isHealthy ? 'Vercel deployment is healthy' : 'Vercel deployment health check failed',
                url: `https://${domain}`
            };
        } catch (error) {
            return { status: 'error', message: `Vercel check failed: ${error.message}` };
        }
    }

    /**
     * Playwright MCP Integration
     */
    async openUrlWithPlaywright(url) {
        if (!this.mcpConfig?.mcpServers?.playwright) {
            return { success: false, message: 'Playwright MCP not configured' };
        }

        try {
            // This would integrate with Playwright MCP server
            // For now, we'll check if Playwright is available locally
            const hasPlaywright = await this.checkPlaywrightAvailable();

            if (!hasPlaywright) {
                return { success: false, message: 'Playwright not available locally' };
            }

            // Basic Playwright automation
            return await this.launchPlaywrightBrowser(url);
        } catch (error) {
            return { success: false, message: `Playwright launch failed: ${error.message}` };
        }
    }

    async checkPlaywrightAvailable() {
        try {
            await execAsync('npx playwright --version');
            return true;
        } catch {
            return false;
        }
    }

    async launchPlaywrightBrowser(url) {
        try {
            // Create a simple Playwright script to open the URL
            const scriptContent = `
const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();
    await page.goto('${url}');

    // Keep browser open for development
    console.log('Browser launched successfully');

    // Don't close browser automatically in development
    // await browser.close();
})().catch(console.error);
`;

            const tempScriptPath = path.join(this.projectRoot, '.tmp-playwright-launch.js');
            await fs.writeFile(tempScriptPath, scriptContent);

            // Execute the script
            spawn('node', [tempScriptPath], {
                detached: true,
                stdio: 'ignore'
            });

            // Clean up script after a delay
            setTimeout(async () => {
                try {
                    await fs.unlink(tempScriptPath);
                } catch {
                    // Ignore cleanup errors
                }
            }, 5000);

            return { success: true, message: `Browser launched with URL: ${url}` };
        } catch (error) {
            throw new Error(`Playwright browser launch failed: ${error.message}`);
        }
    }

    /**
     * Memory MCP Integration
     */
    async storeStartupContext(startupData) {
        if (!this.mcpConfig?.mcpServers?.memory) {
            return { success: false, message: 'Memory MCP not configured' };
        }

        try {
            // This would integrate with Memory MCP to store startup context
            // For now, we'll store it locally
            const contextPath = path.join(this.projectRoot, '.claude', 'context', 'last-startup.json');

            const contextData = {
                timestamp: new Date().toISOString(),
                services: startupData.services || {},
                performance: {
                    startupTime: startupData.startupTime || 0,
                    errors: startupData.errors || []
                },
                environment: {
                    nodeVersion: process.version,
                    platform: process.platform,
                    projectRoot: this.projectRoot
                }
            };

            await fs.writeFile(contextPath, JSON.stringify(contextData, null, 2));

            return { success: true, message: 'Startup context stored successfully' };
        } catch (error) {
            return { success: false, message: `Failed to store startup context: ${error.message}` };
        }
    }

    async getLastStartupContext() {
        try {
            const contextPath = path.join(this.projectRoot, '.claude', 'context', 'last-startup.json');
            const content = await fs.readFile(contextPath, 'utf8');
            return { success: true, data: JSON.parse(content) };
        } catch (error) {
            return { success: false, message: `No previous startup context found: ${error.message}` };
        }
    }

    /**
     * File System MCP Integration
     */
    async validateProjectStructure() {
        try {
            const requiredStructure = [
                'backend',
                'web',
                'backend/requirements.txt',
                'web/package.json',
                '.claude',
                'CLAUDE.md',
                'QUICK_START_GUIDE.md'
            ];

            const validationResults = [];

            for (const item of requiredStructure) {
                const itemPath = path.join(this.projectRoot, item);
                try {
                    await fs.access(itemPath);
                    validationResults.push({ path: item, exists: true, type: 'ok' });
                } catch {
                    validationResults.push({ path: item, exists: false, type: 'error' });
                }
            }

            const missingItems = validationResults.filter(r => !r.exists);

            return {
                success: missingItems.length === 0,
                validationResults,
                missingItems: missingItems.map(r => r.path),
                message: missingItems.length === 0 ?
                    'Project structure validation passed' :
                    `Missing items: ${missingItems.map(r => r.path).join(', ')}`
            };
        } catch (error) {
            return { success: false, message: `Project structure validation failed: ${error.message}` };
        }
    }

    async createMissingEnvironmentFiles() {
        try {
            const environmentTemplates = [
                {
                    path: 'backend/.env',
                    template: 'backend/.env.example',
                    required: true
                },
                {
                    path: 'web/.env.local',
                    template: 'web/.env.example',
                    required: true
                }
            ];

            const results = [];

            for (const env of environmentTemplates) {
                const envPath = path.join(this.projectRoot, env.path);
                const templatePath = path.join(this.projectRoot, env.template);

                try {
                    // Check if env file exists
                    await fs.access(envPath);
                    results.push({ path: env.path, action: 'exists', success: true });
                } catch {
                    // Try to create from template
                    try {
                        const templateContent = await fs.readFile(templatePath, 'utf8');
                        await fs.writeFile(envPath, templateContent);
                        results.push({ path: env.path, action: 'created', success: true });
                    } catch (templateError) {
                        results.push({
                            path: env.path,
                            action: 'failed',
                            success: false,
                            error: templateError.message
                        });
                    }
                }
            }

            return {
                success: results.every(r => r.success),
                results,
                message: `Environment file setup: ${results.length} files processed`
            };
        } catch (error) {
            return { success: false, message: `Environment file creation failed: ${error.message}` };
        }
    }

    /**
     * Utility Methods
     */
    async httpHealthCheck(url, timeout = 10000) {
        return new Promise((resolve) => {
            try {
                const urlObj = new URL(url);
                const isHttps = urlObj.protocol === 'https:';
                const httpModule = isHttps ? require('https') : require('http');

                const options = {
                    hostname: urlObj.hostname,
                    port: urlObj.port || (isHttps ? 443 : 80),
                    path: urlObj.pathname + urlObj.search,
                    method: 'GET',
                    timeout: timeout,
                    headers: {
                        'User-Agent': 'aclue-mcp-integration/1.0.0'
                    }
                };

                const req = httpModule.request(options, (res) => {
                    resolve(res.statusCode >= 200 && res.statusCode < 400);
                });

                req.on('error', () => resolve(false));
                req.on('timeout', () => {
                    req.destroy();
                    resolve(false);
                });

                req.end();
            } catch {
                resolve(false);
            }
        });
    }

    async getProjectMetadata() {
        try {
            const packageJsonPath = path.join(this.projectRoot, 'web', 'package.json');
            const requirementsPath = path.join(this.projectRoot, 'backend', 'requirements.txt');

            const metadata = {
                project: 'aclue-preprod',
                timestamp: new Date().toISOString()
            };

            // Get frontend metadata
            try {
                const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
                metadata.frontend = {
                    name: packageJson.name,
                    version: packageJson.version,
                    framework: packageJson.dependencies?.next ? 'Next.js' : 'Unknown',
                    nodeVersion: process.version
                };
            } catch {
                metadata.frontend = { error: 'Could not read package.json' };
            }

            // Get backend metadata
            try {
                const requirements = await fs.readFile(requirementsPath, 'utf8');
                const pythonVersion = await execAsync('python3 --version');
                metadata.backend = {
                    framework: requirements.includes('fastapi') ? 'FastAPI' : 'Unknown',
                    pythonVersion: pythonVersion.stdout.trim(),
                    dependencies: requirements.split('\n').length
                };
            } catch {
                metadata.backend = { error: 'Could not read requirements.txt' };
            }

            return { success: true, metadata };
        } catch (error) {
            return { success: false, message: `Failed to get project metadata: ${error.message}` };
        }
    }

    // Cleanup method
    cleanup() {
        for (const [name, connection] of this.activeConnections) {
            try {
                if (connection && typeof connection.close === 'function') {
                    connection.close();
                }
            } catch (error) {
                console.warn(`Warning: Failed to close ${name} connection:`, error.message);
            }
        }
        this.activeConnections.clear();
    }
}

module.exports = MCPIntegration;

// CLI usage
if (require.main === module) {
    const integration = new MCPIntegration();

    (async () => {
        await integration.initialize();

        const command = process.argv[2];

        switch (command) {
            case 'check-deployments':
                const railwayStatus = await integration.checkRailwayDeploymentStatus();
                const vercelStatus = await integration.checkVercelDeploymentStatus();
                console.log('Railway:', railwayStatus);
                console.log('Vercel:', vercelStatus);
                break;

            case 'validate-structure':
                const validation = await integration.validateProjectStructure();
                console.log(JSON.stringify(validation, null, 2));
                break;

            case 'create-env':
                const envSetup = await integration.createMissingEnvironmentFiles();
                console.log(JSON.stringify(envSetup, null, 2));
                break;

            case 'metadata':
                const metadata = await integration.getProjectMetadata();
                console.log(JSON.stringify(metadata, null, 2));
                break;

            default:
                console.log('Available commands: check-deployments, validate-structure, create-env, metadata');
        }

        integration.cleanup();
    })().catch(console.error);
}
