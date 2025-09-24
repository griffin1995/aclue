#!/usr/bin/env node

/**
 * aclue /start Command Implementation
 * Comprehensive development environment setup and launch
 *
 * Integrates with existing project infrastructure:
 * - QUICK_START_GUIDE.md automation
 * - backend/start.sh script
 * - MCP optimized configuration
 * - Production-ready status checks
 */

const fs = require('fs').promises;
const path = require('path');
const { spawn, exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

// Import MCP Integration Helper
const MCPIntegration = require('./mcp-integration.js');

// Import Error Recovery System
const ErrorRecoverySystem = require('./error-recovery.js');

class AclueStartCommand {
    constructor(options = {}) {
        this.projectRoot = '/home/jack/Documents/aclue-preprod';
        this.options = {
            skipChecks: false,
            verbose: false,
            quick: false,
            browser: true,
            services: ['backend', 'frontend'],
            ...options
        };

        this.status = {
            environment: 'unknown',
            backend: { status: 'pending', port: 8000, pid: null },
            frontend: { status: 'pending', port: 3000, pid: null },
            database: { status: 'pending', connected: false },
            services: { vercel: 'unknown', railway: 'unknown' }
        };

        this.processes = new Map();
        this.startTime = Date.now();
        this.mcpIntegration = new MCPIntegration(this.projectRoot);
        this.errorRecovery = new ErrorRecoverySystem(this.projectRoot);
    }

    async execute() {
        try {
            this.log('\n🚀 aclue Development Environment Startup', 'title');
            this.log('━'.repeat(60), 'divider');

            // Initialize MCP Integration
            await this.mcpIntegration.initialize();
            this.log('🔌 MCP integration initialized', 'info');

            // Phase 1: Environment Validation
            await this.validateEnvironment();

            // Phase 2: Project Setup
            if (!this.options.quick) {
                await this.setupProject();
            }

            // Phase 3: Service Health Checks
            await this.performHealthChecks();

            // Phase 4: Start Development Servers
            await this.startServices();

            // Phase 5: Post-startup Verification
            await this.verifyServices();

            // Phase 6: Launch Browser (optional)
            if (this.options.browser) {
                await this.launchBrowser();
            }

            // Phase 7: Status Report
            await this.generateStatusReport();

            // Phase 8: Store Startup Context
            await this.storeStartupContext();

            return this.status;

        } catch (error) {
            this.log(`❌ Startup failed: ${error.message}`, 'error');

            // Attempt error recovery
            const recoveryResult = await this.errorRecovery.handleError(error, {
                phase: 'startup',
                options: this.options,
                autoResolve: true
            });

            if (recoveryResult.success) {
                this.log(`🔧 Recovery successful: ${recoveryResult.message}`, 'success');
                this.log('🔄 Retrying startup after recovery...', 'info');

                // Retry startup after successful recovery
                try {
                    return await this.execute();
                } catch (retryError) {
                    this.log(`❌ Startup retry failed: ${retryError.message}`, 'error');
                    await this.cleanup();
                    throw retryError;
                }
            } else {
                this.log(`💥 Recovery failed: ${recoveryResult.message}`, 'error');
                await this.cleanup();
                throw error;
            }
        }
    }

    async validateEnvironment() {
        this.log('\n📋 Phase 1: Environment Validation', 'phase');

        // Check project directory
        try {
            await fs.access(this.projectRoot);
            this.log('✅ Project directory found', 'success');
        } catch {
            throw new Error(`Project directory not found: ${this.projectRoot}`);
        }

        // Enhanced project structure validation with MCP
        const structureValidation = await this.mcpIntegration.validateProjectStructure();
        if (structureValidation.success) {
            this.log('✅ Project structure validation passed', 'success');
        } else {
            this.log(`⚠️  Project structure issues: ${structureValidation.message}`, 'warning');
            if (structureValidation.missingItems.length > 0) {
                this.log(`   Missing: ${structureValidation.missingItems.join(', ')}`, 'warning');
            }
        }

        // Check for required binaries
        const requiredBinaries = [
            { name: 'node', cmd: 'node --version', min: 'v18' },
            { name: 'npm', cmd: 'npm --version' },
            { name: 'python3', cmd: 'python3 --version', min: '3.8' },
            { name: 'git', cmd: 'git --version' }
        ];

        for (const binary of requiredBinaries) {
            try {
                const { stdout } = await execAsync(binary.cmd);
                this.log(`✅ ${binary.name}: ${stdout.trim()}`, 'success');

                if (binary.min && !this.checkVersion(stdout, binary.min)) {
                    this.log(`⚠️  ${binary.name} version may be too old (minimum: ${binary.min})`, 'warning');
                }
            } catch {
                throw new Error(`Required binary not found: ${binary.name}`);
            }
        }

        // Check working directory
        const cwd = process.cwd();
        if (!cwd.includes('aclue-preprod')) {
            this.log(`⚠️  Not in aclue project directory. Current: ${cwd}`, 'warning');
        }

        this.log('✅ Environment validation complete', 'success');
    }

    async setupProject() {
        this.log('\n🔧 Phase 2: Project Setup', 'phase');

        // Create missing environment files using MCP integration
        const envSetup = await this.mcpIntegration.createMissingEnvironmentFiles();
        if (envSetup.success) {
            this.log('✅ Environment files verified/created', 'success');
        } else {
            this.log(`⚠️  Environment file setup issues: ${envSetup.message}`, 'warning');
        }

        // Setup backend
        if (this.options.services.includes('backend')) {
            await this.setupBackend();
        }

        // Setup frontend
        if (this.options.services.includes('frontend')) {
            await this.setupFrontend();
        }

        this.log('✅ Project setup complete', 'success');
    }

    async setupBackend() {
        this.log('🐍 Setting up backend...', 'info');
        const backendPath = path.join(this.projectRoot, 'backend');

        try {
            // Check if virtual environment exists
            const venvPath = path.join(backendPath, 'venv');
            let venvExists = false;

            try {
                await fs.access(venvPath);
                venvExists = true;
                this.log('✅ Virtual environment found', 'success');
            } catch {
                this.log('📦 Creating virtual environment...', 'info');
                await execAsync('python3 -m venv venv', { cwd: backendPath });
                this.log('✅ Virtual environment created', 'success');
            }

            // Install/update dependencies
            const requirementsPath = path.join(backendPath, 'requirements.txt');
            try {
                await fs.access(requirementsPath);
                this.log('📦 Installing Python dependencies...', 'info');

                const pipCmd = process.platform === 'win32' ?
                    'venv\\Scripts\\pip' : 'venv/bin/pip';

                await execAsync(`${pipCmd} install -r requirements.txt`, {
                    cwd: backendPath,
                    timeout: 120000 // 2 minutes
                });

                this.log('✅ Python dependencies installed', 'success');
            } catch (error) {
                if (error.code === 'ENOENT') {
                    this.log('⚠️  requirements.txt not found', 'warning');
                } else {
                    throw error;
                }
            }

            // Check/create .env file
            await this.ensureEnvironmentFile(backendPath, '.env', {
                'PROJECT_NAME': '"aclue API"',
                'ENVIRONMENT': 'development',
                'DEBUG': 'true',
                'SECRET_KEY': 'dev-secret-key-change-in-production',
                'ALGORITHM': 'HS256',
                'ACCESS_TOKEN_EXPIRE_MINUTES': '30',
                'SUPABASE_URL': 'https://xchsarvamppwephulylt.supabase.co',
                'ALLOWED_HOSTS': '["http://localhost:3000"]',
                'ENABLE_REGISTRATION': 'true'
            });

        } catch (error) {
            throw new Error(`Backend setup failed: ${error.message}`);
        }
    }

    async setupFrontend() {
        this.log('⚛️ Setting up frontend...', 'info');
        const frontendPath = path.join(this.projectRoot, 'web');

        try {
            // Check if node_modules exists and install if needed
            const nodeModulesPath = path.join(frontendPath, 'node_modules');

            try {
                await fs.access(nodeModulesPath);
                this.log('✅ Node modules found', 'success');

                // Check if package.json has been modified since last install
                const packageJsonStat = await fs.stat(path.join(frontendPath, 'package.json'));
                const nodeModulesStat = await fs.stat(nodeModulesPath);

                if (packageJsonStat.mtime > nodeModulesStat.mtime) {
                    this.log('📦 Package.json updated, reinstalling dependencies...', 'info');
                    await execAsync('npm install', {
                        cwd: frontendPath,
                        timeout: 180000 // 3 minutes
                    });
                    this.log('✅ Dependencies updated', 'success');
                }
            } catch {
                this.log('📦 Installing Node.js dependencies...', 'info');
                await execAsync('npm install', {
                    cwd: frontendPath,
                    timeout: 180000 // 3 minutes
                });
                this.log('✅ Node.js dependencies installed', 'success');
            }

            // Check/create .env.local file
            await this.ensureEnvironmentFile(frontendPath, '.env.local', {
                'NEXT_PUBLIC_API_URL': 'http://localhost:8000',
                'NEXT_PUBLIC_WEB_URL': 'http://localhost:3000',
                'NEXT_PUBLIC_MAINTENANCE_MODE': 'false',
                'NEXT_PUBLIC_SUPABASE_URL': 'https://xchsarvamppwephulylt.supabase.co',
                'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'your_supabase_anon_key_here', // pragma: allowlist secret
                'RESEND_API_KEY': 'your_resend_api_key_here'
            });

        } catch (error) {
            throw new Error(`Frontend setup failed: ${error.message}`);
        }
    }

    async performHealthChecks() {
        this.log('\n🏥 Phase 3: Service Health Checks', 'phase');

        // Check port availability
        const ports = [
            { port: 8000, service: 'backend' },
            { port: 3000, service: 'frontend' }
        ];

        for (const { port, service } of ports) {
            const isAvailable = await this.checkPortAvailability(port);
            if (!isAvailable) {
                this.log(`⚠️  Port ${port} is in use (${service})`, 'warning');

                if (!this.options.skipChecks) {
                    const response = await this.promptUser(
                        `Kill process on port ${port}? [y/N]: `
                    );

                    if (response.toLowerCase() === 'y') {
                        await this.killProcessOnPort(port);
                        this.log(`✅ Port ${port} freed`, 'success');
                    }
                }
            } else {
                this.log(`✅ Port ${port} available (${service})`, 'success');
            }
        }

        // Check Supabase connectivity (if configured)
        await this.checkDatabaseConnectivity();

        // Check deployment services status
        await this.checkDeploymentServices();

        this.log('✅ Health checks complete', 'success');
    }

    async startServices() {
        this.log('\n🚀 Phase 4: Starting Development Servers', 'phase');

        const startPromises = [];

        // Start backend
        if (this.options.services.includes('backend')) {
            startPromises.push(this.startBackend());
        }

        // Start frontend (with delay to ensure backend is ready)
        if (this.options.services.includes('frontend')) {
            setTimeout(() => {
                startPromises.push(this.startFrontend());
            }, 3000);
        }

        // Wait for services to start
        try {
            await Promise.allSettled(startPromises);
        } catch (error) {
            this.log(`⚠️  Some services failed to start: ${error.message}`, 'warning');
        }
    }

    async startBackend() {
        this.log('🐍 Starting backend server...', 'info');
        const backendPath = path.join(this.projectRoot, 'backend');

        return new Promise((resolve, reject) => {
            const startScript = path.join(backendPath, 'start.sh');

            // Check if start.sh exists, otherwise use direct uvicorn command
            fs.access(startScript).then(() => {
                // Use existing start.sh script
                const backendProcess = spawn('bash', ['start.sh'], {
                    cwd: backendPath,
                    env: { ...process.env, ENVIRONMENT: 'development' },
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                this.handleServiceProcess('backend', backendProcess, 8000);
                resolve();

            }).catch(() => {
                // Fallback to direct uvicorn command
                const pythonCmd = process.platform === 'win32' ?
                    'venv\\Scripts\\python' : 'venv/bin/python';

                const backendProcess = spawn(pythonCmd, [
                    '-m', 'uvicorn', 'app.main:app',
                    '--reload', '--host', '0.0.0.0', '--port', '8000'
                ], {
                    cwd: backendPath,
                    stdio: ['pipe', 'pipe', 'pipe']
                });

                this.handleServiceProcess('backend', backendProcess, 8000);
                resolve();
            });
        });
    }

    async startFrontend() {
        this.log('⚛️ Starting frontend server...', 'info');
        const frontendPath = path.join(this.projectRoot, 'web');

        return new Promise((resolve) => {
            const frontendProcess = spawn('npm', ['run', 'dev'], {
                cwd: frontendPath,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            this.handleServiceProcess('frontend', frontendProcess, 3000);
            resolve();
        });
    }

    handleServiceProcess(serviceName, process, port) {
        this.processes.set(serviceName, process);
        this.status[serviceName].pid = process.pid;
        this.status[serviceName].port = port;

        let outputBuffer = '';
        let errorBuffer = '';

        process.stdout.on('data', (data) => {
            const output = data.toString();
            outputBuffer += output;

            if (this.options.verbose) {
                this.log(`[${serviceName.toUpperCase()}] ${output.trim()}`, 'service');
            }

            // Check for startup indicators
            if (serviceName === 'backend') {
                if (output.includes('Application startup complete') ||
                    output.includes('Uvicorn running on')) {
                    this.status.backend.status = 'running';
                    this.log('✅ Backend server started', 'success');
                }
            } else if (serviceName === 'frontend') {
                if (output.includes('Ready in') ||
                    output.includes('ready - started server on')) {
                    this.status.frontend.status = 'running';
                    this.log('✅ Frontend server started', 'success');
                }
            }
        });

        process.stderr.on('data', (data) => {
            const error = data.toString();
            errorBuffer += error;

            if (this.options.verbose) {
                this.log(`[${serviceName.toUpperCase()} ERROR] ${error.trim()}`, 'error');
            }

            // Check for critical errors and attempt recovery
            if (error.includes('Address already in use') ||
                error.includes('EADDRINUSE')) {
                this.status[serviceName].status = 'error';
                this.log(`❌ ${serviceName} failed: Port ${port} in use`, 'error');

                // Attempt automatic recovery
                this.attemptServiceRecovery(serviceName, new Error(`Port ${port} in use`), { port, service: serviceName });
            }

            // Check for other recoverable errors
            if (error.includes('MODULE_NOT_FOUND') || error.includes('command not found')) {
                this.status[serviceName].status = 'error';
                this.log(`❌ ${serviceName} failed: Dependencies missing`, 'error');

                this.attemptServiceRecovery(serviceName, new Error(error.trim()), { service: serviceName });
            }
        });

        process.on('close', (code) => {
            if (code !== 0) {
                this.status[serviceName].status = 'error';
                this.log(`❌ ${serviceName} exited with code ${code}`, 'error');

                // Create error from process output for better context
                const processError = new Error(`Process ${serviceName} exited with code ${code}`);
                processError.code = code;
                processError.stderr = errorBuffer;
                processError.stdout = outputBuffer;

                this.attemptServiceRecovery(serviceName, processError, {
                    service: serviceName,
                    port,
                    exitCode: code
                });
            }
        });
    }

    async verifyServices() {
        this.log('\n🔍 Phase 5: Service Verification', 'phase');

        // Wait for services to fully start
        await this.wait(5000);

        // Verify backend
        if (this.options.services.includes('backend')) {
            await this.verifyBackend();
        }

        // Verify frontend
        if (this.options.services.includes('frontend')) {
            await this.verifyFrontend();
        }

        this.log('✅ Service verification complete', 'success');
    }

    async verifyBackend() {
        try {
            const response = await this.httpGet('http://localhost:8000/health');
            if (response) {
                this.status.backend.status = 'healthy';
                this.log('✅ Backend health check passed', 'success');
            }
        } catch (error) {
            this.status.backend.status = 'unhealthy';
            this.log('⚠️  Backend health check failed', 'warning');
        }
    }

    async verifyFrontend() {
        try {
            const response = await this.httpGet('http://localhost:3000');
            if (response) {
                this.status.frontend.status = 'healthy';
                this.log('✅ Frontend health check passed', 'success');
            }
        } catch (error) {
            this.status.frontend.status = 'unhealthy';
            this.log('⚠️  Frontend health check failed', 'warning');
        }
    }

    async launchBrowser() {
        this.log('\n🌐 Phase 6: Browser Launch', 'phase');

        try {
            // Use MCP Puppeteer if available, fallback to system browser
            const urls = [
                'http://localhost:3000',      // Frontend
                'http://localhost:8000/docs'  // API Documentation
            ];

            for (const url of urls) {
                await this.openUrl(url);
                this.log(`🔗 Opened: ${url}`, 'info');
            }

            this.log('✅ Browser launch complete', 'success');
        } catch (error) {
            this.log(`⚠️  Browser launch failed: ${error.message}`, 'warning');
        }
    }

    async generateStatusReport() {
        const elapsed = ((Date.now() - this.startTime) / 1000).toFixed(1);

        this.log('\n📊 Phase 7: Status Report', 'phase');
        this.log('━'.repeat(60), 'divider');

        // Header
        this.log('🎉 aclue Development Environment Ready!', 'title');
        this.log(`⏱️  Total startup time: ${elapsed}s`, 'info');
        this.log('', 'divider');

        // Service status
        this.log('🔧 Service Status:', 'subtitle');
        this.logServiceStatus('Backend', this.status.backend, 'http://localhost:8000');
        this.logServiceStatus('Frontend', this.status.frontend, 'http://localhost:3000');
        this.logServiceStatus('Database', this.status.database, 'Supabase');
        this.log('', 'divider');

        // Production deployment status
        this.log('☁️  Production Status:', 'subtitle');
        this.logDeploymentStatus('Vercel (aclue.app)', this.status.services.vercel, 'https://aclue.app');
        this.logDeploymentStatus('Railway (API)', this.status.services.railway, 'https://aclue-backend-production.up.railway.app');
        this.log('', 'divider');

        // Quick links
        this.log('🔗 Quick Links:', 'subtitle');
        this.log('   Frontend:     http://localhost:3000', 'link');
        this.log('   API Docs:     http://localhost:8000/docs', 'link');
        this.log('   Health:       http://localhost:8000/health', 'link');
        this.log('', 'divider');

        // Commands
        this.log('⌨️  Useful Commands:', 'subtitle');
        this.log('   Stop all:       Ctrl+C (in this terminal)', 'command');
        this.log('   Backend only:   /start --backend-only', 'command');
        this.log('   Frontend only:  /start --frontend-only', 'command');
        this.log('   Quick restart:  /start --quick', 'command');
        this.log('   Verbose mode:   /start --verbose', 'command');
        this.log('', 'divider');

        // Next steps
        this.log('🚀 Next Steps:', 'subtitle');
        this.log('   1. Visit http://localhost:3000 to see the app', 'step');
        this.log('   2. Explore API at http://localhost:8000/docs', 'step');
        this.log('   3. Check the Quick Start Guide for testing', 'step');
        this.log('   4. Compare with production at https://aclue.app', 'step');
        this.log('   5. Review deployment status above', 'step');
        this.log('', 'divider');

        // Environment summary
        this.log('🌍 Environment Summary:', 'subtitle');
        this.log(`   Mode: Development (local)`, 'info');
        this.log(`   Project: ${this.projectRoot}`, 'info');
        this.log(`   Started: ${new Date().toLocaleString()}`, 'info');
        this.log('', 'divider');

        // Error recovery status
        const errorReport = this.errorRecovery.generateDiagnosticReport();
        if (errorReport.errorHistory.length > 0) {
            this.log('🚨 Recovery Summary:', 'subtitle');
            this.log(`   Errors handled: ${errorReport.errorHistory.length}`, 'info');
            this.log(`   Recovery attempts: ${Object.keys(errorReport.recoveryAttempts).length}`, 'info');
            const successfulRecoveries = errorReport.errorHistory.filter(e => e.recovered).length;
            this.log(`   Successful recoveries: ${successfulRecoveries}`, successfulRecoveries > 0 ? 'success' : 'info');
            this.log('', 'divider');
        }

        this.log('Happy coding! 🎉', 'title');
    }

    // Helper methods
    logServiceStatus(name, status, url) {
        const emoji = status.status === 'healthy' ? '✅' :
                     status.status === 'running' ? '🟡' :
                     status.status === 'connected' ? '✅' :
                     status.status === 'not_configured' ? '⚪' : '❌';
        const pid = status.pid ? `(PID: ${status.pid})` : '';
        const connection = status.connected !== undefined ?
            (status.connected ? ' [Connected]' : ' [Disconnected]') : '';
        this.log(`   ${emoji} ${name.padEnd(12)} ${url}${connection} ${pid}`, 'status');
    }

    logDeploymentStatus(name, status, url) {
        const emoji = status === 'operational' ? '✅' :
                     status === 'degraded' ? '⚠️ ' :
                     status === 'not_checked' ? '⚪' : '❌';
        const statusText = status === 'operational' ? 'Operational' :
                          status === 'degraded' ? 'Degraded' :
                          status === 'not_checked' ? 'Not Checked' : 'Error';
        this.log(`   ${emoji} ${name.padEnd(20)} ${statusText.padEnd(12)} ${url}`, 'status');
    }

    async ensureEnvironmentFile(dir, filename, defaults) {
        const filePath = path.join(dir, filename);

        try {
            await fs.access(filePath);
            this.log(`✅ ${filename} found`, 'success');
        } catch {
            this.log(`📝 Creating ${filename}...`, 'info');

            const content = Object.entries(defaults)
                .map(([key, value]) => `${key}=${value}`)
                .join('\n');

            await fs.writeFile(filePath, content + '\n');
            this.log(`✅ ${filename} created`, 'success');
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

    async killProcessOnPort(port) {
        try {
            if (process.platform === 'win32') {
                await execAsync(`netstat -ano | findstr :${port} | for /f "tokens=5" %i in ('more') do taskkill /f /pid %i`);
            } else {
                await execAsync(`lsof -ti :${port} | xargs kill -9`);
            }
        } catch (error) {
            this.log(`Failed to kill process on port ${port}: ${error.message}`, 'warning');
        }
    }

    async checkDatabaseConnectivity() {
        this.log('🗄️  Checking database connectivity...', 'info');

        try {
            // Check if we have Supabase configuration
            const envFiles = [
                path.join(this.projectRoot, 'backend', '.env'),
                path.join(this.projectRoot, 'web', '.env.local')
            ];

            let hasSupabaseConfig = false;
            for (const envFile of envFiles) {
                try {
                    const content = await fs.readFile(envFile, 'utf8');
                    if (content.includes('SUPABASE_URL') && content.includes('supabase.co')) {
                        hasSupabaseConfig = true;
                        break;
                    }
                } catch {
                    // File doesn't exist, continue
                }
            }

            if (hasSupabaseConfig) {
                // Try to ping Supabase health endpoint
                try {
                    const response = await this.httpGet('https://xchsarvamppwephulylt.supabase.co/rest/v1/', 5000);
                    this.status.database.status = response ? 'connected' : 'unreachable';
                    this.status.database.connected = !!response;
                    this.log(`✅ Database connection ${response ? 'verified' : 'failed'}`, response ? 'success' : 'warning');
                } catch (error) {
                    this.status.database.status = 'error';
                    this.status.database.connected = false;
                    this.log(`⚠️  Database ping failed: ${error.message}`, 'warning');
                }
            } else {
                this.status.database.status = 'not_configured';
                this.log('⚠️  Supabase configuration not found', 'warning');
            }
        } catch (error) {
            this.status.database.status = 'error';
            this.log(`❌ Database check failed: ${error.message}`, 'error');
        }
    }

    async checkDeploymentServices() {
        this.log('☁️  Checking deployment services status...', 'info');

        try {
            // Check Vercel deployment
            await this.checkVercelStatus();

            // Check Railway deployment
            await this.checkRailwayStatus();

        } catch (error) {
            this.log(`⚠️  Deployment services check failed: ${error.message}`, 'warning');
        }
    }

    async checkVercelStatus() {
        try {
            // Use MCP integration for enhanced Vercel checking
            const vercelStatus = await this.mcpIntegration.checkVercelDeploymentStatus();
            this.status.services.vercel = vercelStatus.status;

            if (vercelStatus.status === 'operational') {
                this.log('✅ Vercel deployment (aclue.app) is operational', 'success');
            } else if (vercelStatus.status === 'degraded') {
                this.log('⚠️  Vercel deployment is degraded', 'warning');
            } else if (vercelStatus.status === 'not_configured') {
                this.log('ℹ️  Vercel MCP not configured', 'info');
                // Fallback to simple HTTP check
                const response = await this.httpGet('https://aclue.app', 10000);
                this.status.services.vercel = response ? 'operational' : 'degraded';
            } else {
                this.log(`❌ Vercel check error: ${vercelStatus.message}`, 'error');
            }
        } catch (error) {
            this.status.services.vercel = 'error';
            this.log(`⚠️  Vercel status check failed: ${error.message}`, 'warning');
        }
    }

    async checkRailwayStatus() {
        try {
            // Use MCP integration for enhanced Railway checking
            const railwayStatus = await this.mcpIntegration.checkRailwayDeploymentStatus();
            this.status.services.railway = railwayStatus.status;

            if (railwayStatus.status === 'operational') {
                this.log('✅ Railway deployment (backend API) is operational', 'success');
            } else if (railwayStatus.status === 'degraded') {
                this.log('⚠️  Railway deployment is degraded', 'warning');
            } else if (railwayStatus.status === 'not_configured') {
                this.log('ℹ️  Railway MCP not configured', 'info');
                // Fallback to simple HTTP check
                const response = await this.httpGet('https://aclue-backend-production.up.railway.app/health', 10000);
                this.status.services.railway = response ? 'operational' : 'degraded';
            } else {
                this.log(`❌ Railway check error: ${railwayStatus.message}`, 'error');
            }
        } catch (error) {
            this.status.services.railway = 'error';
            this.log(`⚠️  Railway status check failed: ${error.message}`, 'warning');
        }
    }

    async httpGet(url, timeout = 5000) {
        return new Promise((resolve, reject) => {
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
                    'User-Agent': 'aclue-start-command/1.0.0'
                }
            };

            const req = httpModule.request(options, (res) => {
                // Consider 2xx and 3xx as successful
                resolve(res.statusCode >= 200 && res.statusCode < 400);
            });

            req.on('error', (error) => {
                reject(error);
            });

            req.on('timeout', () => {
                req.destroy();
                reject(new Error(`Request timeout after ${timeout}ms`));
            });

            req.end();
        });
    }

    async openUrl(url) {
        try {
            // Try to use MCP Playwright for browser automation if available
            if (await this.tryPlaywrightBrowser(url)) {
                return;
            }

            // Fallback to system browser
            await this.openSystemBrowser(url);

        } catch (error) {
            throw new Error(`Failed to open ${url}: ${error.message}`);
        }
    }

    async tryPlaywrightBrowser(url) {
        try {
            // Use MCP integration for Playwright browser automation
            const playwrightResult = await this.mcpIntegration.openUrlWithPlaywright(url);

            if (playwrightResult.success) {
                this.log(`🎭 Opened with Playwright: ${url}`, 'success');
                return true;
            } else {
                this.log(`ℹ️  Playwright not available: ${playwrightResult.message}`, 'info');
                return false;
            }
        } catch (error) {
            this.log(`⚠️  Playwright failed: ${error.message}`, 'warning');
            return false;
        }
    }

    async openSystemBrowser(url) {
        const open = process.platform === 'darwin' ? 'open' :
                     process.platform === 'win32' ? 'start' : 'xdg-open';

        await execAsync(`${open} ${url}`);
    }

    async promptUser(question) {
        const readline = require('readline');
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question(question, (answer) => {
                rl.close();
                resolve(answer);
            });
        });
    }

    checkVersion(output, minimum) {
        // Simple version comparison - enhance as needed
        const version = output.match(/v?(\d+)\.(\d+)\.(\d+)/);
        const minVersion = minimum.match(/v?(\d+)\.(\d+)/);

        if (!version || !minVersion) return true;

        const [, major, minor] = version.map(Number);
        const [, minMajor, minMinor] = minVersion.map(Number);

        return major > minMajor || (major === minMajor && minor >= minMinor);
    }

    async wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async attemptServiceRecovery(serviceName, error, context) {
        try {
            this.log(`🔧 Attempting recovery for ${serviceName}...`, 'info');

            const recoveryResult = await this.errorRecovery.handleError(error, {
                ...context,
                serviceName,
                autoResolve: true
            });

            if (recoveryResult.success) {
                this.log(`✅ Recovery successful for ${serviceName}: ${recoveryResult.message}`, 'success');

                // Could implement service restart here
                this.log(`ℹ️  Consider restarting ${serviceName} service`, 'info');
            } else {
                this.log(`❌ Recovery failed for ${serviceName}: ${recoveryResult.message}`, 'error');
            }
        } catch (recoveryError) {
            this.log(`💥 Recovery attempt failed for ${serviceName}: ${recoveryError.message}`, 'error');
        }
    }

    async storeStartupContext() {
        try {
            const errorReport = this.errorRecovery.generateDiagnosticReport();

            const startupData = {
                services: this.status,
                startupTime: (Date.now() - this.startTime) / 1000,
                errors: errorReport.errorHistory || [],
                recoveryAttempts: errorReport.recoveryAttempts || {},
                options: this.options
            };

            const contextResult = await this.mcpIntegration.storeStartupContext(startupData);
            if (contextResult.success) {
                this.log('💾 Startup context and error history saved', 'info');
            }
        } catch (error) {
            this.log(`⚠️  Failed to store startup context: ${error.message}`, 'warning');
        }
    }

    async cleanup() {
        this.log('\n🧹 Cleaning up...', 'info');

        for (const [name, process] of this.processes) {
            try {
                process.kill('SIGTERM');
                this.log(`Terminated ${name} process`, 'info');
            } catch (error) {
                this.log(`Failed to terminate ${name}: ${error.message}`, 'warning');
            }
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
            service: '\x1b[90m',           // Gray
            status: '\x1b[37m',            // White
            link: '\x1b[94m',              // Light blue
            command: '\x1b[90m',           // Gray
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
}

// Command-line interface
if (require.main === module) {
    const args = process.argv.slice(2);

    const options = {
        skipChecks: args.includes('--skip-checks'),
        verbose: args.includes('--verbose') || args.includes('-v'),
        quick: args.includes('--quick') || args.includes('-q'),
        browser: !args.includes('--no-browser'),
        services: []
    };

    // Parse service selection
    if (args.includes('--backend-only')) {
        options.services = ['backend'];
    } else if (args.includes('--frontend-only')) {
        options.services = ['frontend'];
    } else {
        options.services = ['backend', 'frontend'];
    }

    const startCommand = new AclueStartCommand(options);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        console.log('\n\n🛑 Shutting down...');
        await startCommand.cleanup();
        process.exit(0);
    });

    startCommand.execute()
        .then(() => {
            // Keep process alive for service monitoring
            process.stdin.resume();
        })
        .catch((error) => {
            console.error(`\n❌ Startup failed: ${error.message}`);
            process.exit(1);
        });
}

module.exports = AclueStartCommand;
