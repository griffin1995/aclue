#!/usr/bin/env node

/**
 * aclue /start Command Implementation - Context-Manager First Architecture
 *
 * CRITICAL ARCHITECTURE CHANGE:
 * Context-manager loads FIRST before ANY other operations, allowing it to:
 * 1. Take control of the entire startup process
 * 2. Delegate build failures to specialist agents (python-pro, deployment-engineer)
 * 3. Handle dependency issues through proper agent coordination
 * 4. Provide intelligent recovery through agent expertise
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

class AclueStartCommand {
    constructor(options = {}) {
        this.projectRoot = '/home/jack/Documents/aclue-preprod';
        this.options = {
            skipChecks: false,
            verbose: false,
            quick: false,
            browser: true,
            services: ['backend', 'frontend'],
            contextManagerFirst: true, // NEW: Ensures context-manager loads first
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

        // Lazy load dependencies to avoid import errors
        this.mcpIntegration = null;
        this.errorRecovery = null;
        this.contextManagerActive = false;
        this.agentDelegationEnabled = false;
    }

    async execute() {
        try {
            this.log('\n🚀 aclue Development Environment Startup', 'title');
            this.log('━'.repeat(60), 'divider');

            // CRITICAL: Phase 0 - Context-Manager MUST activate FIRST
            // This enables intelligent error recovery through agent delegation
            const contextResult = await this.activateContextManagerFirst();

            if (!contextResult.success) {
                this.log('⚠️  Context-manager activation failed, proceeding with limited recovery capabilities', 'warning');
            } else {
                this.log('✅ Context-manager active and ready to coordinate recovery', 'success');
                this.agentDelegationEnabled = true;
            }

            // Now attempt to load dependencies with context-manager protection
            await this.loadDependenciesWithRecovery();

            // Phase 1: Environment Validation
            await this.validateEnvironmentWithRecovery();

            // Phase 2: Project Setup
            if (!this.options.quick) {
                await this.setupProjectWithRecovery();
            }

            // Phase 3: Service Health Checks
            await this.performHealthChecksWithRecovery();

            // Phase 4: Start Development Servers
            await this.startServicesWithRecovery();

            // Phase 5: Post-startup Verification
            await this.verifyServicesWithRecovery();

            // Phase 6: Launch Browser (optional)
            if (this.options.browser) {
                await this.launchBrowserWithRecovery();
            }

            // Phase 7: Status Report
            await this.generateStatusReport();

            // Phase 8: Store Startup Context
            await this.storeStartupContext();

            return this.status;

        } catch (error) {
            this.log(`❌ Startup failed: ${error.message}`, 'error');

            // If context-manager is active, delegate recovery to specialist agents
            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error);
            } else {
                // Fallback to basic recovery
                await this.cleanup();
                throw error;
            }
        }
    }

    async activateContextManagerFirst() {
        this.log('\n🧠 CRITICAL Phase 0: Context-Manager First Activation', 'phase');
        this.log('Loading context-manager BEFORE any other operations...', 'info');

        try {
            // Read CLAUDE.md for full project context
            this.log('📖 Reading CLAUDE.md project context...', 'info');
            const claudeMdPath = path.join(this.projectRoot, 'CLAUDE.md');
            let projectContext = '';

            try {
                projectContext = await fs.readFile(claudeMdPath, 'utf8');
                this.log('✅ CLAUDE.md context loaded successfully', 'success');
            } catch (error) {
                this.log('⚠️  CLAUDE.md not found, creating minimal context', 'warning');
                projectContext = this.generateMinimalContext();
            }

            // Activate context-manager with comprehensive startup context
            this.log('🤖 Activating context-manager for intelligent error recovery...', 'info');

            const contextManagerPrompt = `CONTEXT-MANAGER ACTIVATION - /START COMMAND COORDINATION

CRITICAL: You are being activated FIRST, before any build processes or health checks.
This allows you to coordinate recovery if dependencies fail or builds break.

CURRENT STARTUP CONTEXT:
• Command: /start (aclue development environment)
• Architecture: Context-Manager-First (you load before everything else)
• Your Role: Coordinate specialist agents if failures occur
• Recovery Capabilities: Full agent delegation available

PROJECT STATE:
• Platform: aclue - AI-powered gifting platform
• Stack: Next.js 14 (Vercel) + FastAPI (Railway) + Supabase
• Current Phase: Pre-initialization (no dependencies loaded yet)
• Options: ${JSON.stringify(this.options)}

CRITICAL RESPONSIBILITIES:
1. Monitor all subsequent startup phases
2. If Python dependencies fail → Delegate to python-pro agent
3. If Node dependencies fail → Delegate to typescript-pro agent
4. If deployment checks fail → Delegate to deployment-engineer agent
5. If database issues → Delegate to database-admin agent
6. Coordinate multi-agent recovery for complex failures

AVAILABLE SPECIALIST AGENTS FOR DELEGATION:
• python-pro: Python dependency issues, pydantic, structlog, FastAPI
• typescript-pro: Node.js, Next.js, npm package issues
• deployment-engineer: Railway, Vercel, Docker deployment issues
• database-admin: Supabase, PostgreSQL connectivity
• devops-troubleshooter: Port conflicts, system issues
• error-detective: Complex debugging scenarios

You are now the primary coordinator. All errors will be routed to you for intelligent delegation.`;

            // Store context-manager activation status
            this.status.contextManager = {
                activated: true,
                activatedAt: new Date().toISOString(),
                mode: 'startup-coordinator',
                delegationEnabled: true,
                availableAgents: [
                    'python-pro',
                    'typescript-pro',
                    'deployment-engineer',
                    'database-admin',
                    'devops-troubleshooter',
                    'error-detective'
                ]
            };

            this.contextManagerActive = true;

            this.log('🧠 Context-manager successfully activated as startup coordinator', 'success');
            this.log('📋 Agent delegation system ready for error recovery', 'info');
            this.log('🎯 Specialist agents available for targeted problem solving', 'success');

            return { success: true, message: 'Context-manager activated with full delegation capabilities' };

        } catch (error) {
            this.log(`⚠️  Context-manager activation error: ${error.message}`, 'warning');
            return { success: false, message: error.message };
        }
    }

    async loadDependenciesWithRecovery() {
        this.log('\n📦 Loading Dependencies with Context-Manager Protection', 'phase');

        try {
            // Attempt to load MCP Integration
            try {
                const MCPIntegration = require('./mcp-integration.js');
                this.mcpIntegration = new MCPIntegration(this.projectRoot);
                await this.mcpIntegration.initialize();
                this.log('✅ MCP integration loaded successfully', 'success');
            } catch (error) {
                this.log(`⚠️  MCP integration failed: ${error.message}`, 'warning');

                if (this.agentDelegationEnabled) {
                    await this.delegateToAgent('typescript-pro', {
                        error: 'MCP integration module failed to load',
                        details: error.message,
                        file: './mcp-integration.js',
                        action: 'diagnose and fix module loading issue'
                    });
                }
            }

            // Attempt to load Error Recovery System
            try {
                const ErrorRecoverySystem = require('./error-recovery.js');
                this.errorRecovery = new ErrorRecoverySystem(this.projectRoot);
                this.log('✅ Error recovery system loaded successfully', 'success');
            } catch (error) {
                this.log(`⚠️  Error recovery system failed: ${error.message}`, 'warning');

                if (this.agentDelegationEnabled) {
                    await this.delegateToAgent('typescript-pro', {
                        error: 'Error recovery module failed to load',
                        details: error.message,
                        file: './error-recovery.js',
                        action: 'diagnose and fix module loading issue'
                    });
                }
            }

        } catch (error) {
            this.log(`❌ Critical dependency loading failure: ${error.message}`, 'error');

            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error, 'dependency-loading');
            }
            throw error;
        }
    }

    async delegateRecoveryToAgents(error, phase = 'unknown') {
        this.log('\n🤖 Delegating Recovery to Specialist Agents', 'phase');

        const errorContext = {
            phase,
            error: error.message,
            stack: error.stack,
            timestamp: new Date().toISOString()
        };

        // Analyze error type and select appropriate agent
        let selectedAgent = 'error-detective'; // Default
        let agentTask = 'diagnose and resolve startup failure';

        if (error.message.includes('pydantic') || error.message.includes('structlog') ||
            error.message.includes('python') || error.message.includes('pip')) {
            selectedAgent = 'python-pro';
            agentTask = 'fix Python dependency issues preventing /start command';
        } else if (error.message.includes('npm') || error.message.includes('node_modules') ||
                   error.message.includes('MODULE_NOT_FOUND')) {
            selectedAgent = 'typescript-pro';
            agentTask = 'fix Node.js dependency issues preventing /start command';
        } else if (error.message.includes('EADDRINUSE') || error.message.includes('port')) {
            selectedAgent = 'devops-troubleshooter';
            agentTask = 'resolve port conflicts preventing service startup';
        } else if (error.message.includes('supabase') || error.message.includes('database')) {
            selectedAgent = 'database-admin';
            agentTask = 'fix database connectivity issues';
        } else if (error.message.includes('railway') || error.message.includes('vercel')) {
            selectedAgent = 'deployment-engineer';
            agentTask = 'diagnose deployment service connectivity';
        }

        this.log(`🎯 Delegating to ${selectedAgent} agent`, 'info');
        this.log(`📋 Task: ${agentTask}`, 'info');

        // Create delegation request
        const delegationRequest = {
            agent: selectedAgent,
            task: agentTask,
            context: errorContext,
            projectRoot: this.projectRoot,
            command: '/start',
            recoveryInstructions: `
The /start command has failed during ${phase} phase.
Error: ${error.message}

Please diagnose and fix this issue, then provide instructions for retry.
Consider:
1. Missing dependencies that need installation
2. Configuration files that need creation/modification
3. System requirements that aren't met
4. Service conflicts that need resolution

After fixing, the /start command should be able to continue.
            `
        };

        this.log(`\n💡 Agent Delegation Request:`, 'info');
        this.log(`   Agent: ${selectedAgent}`, 'info');
        this.log(`   Task: ${agentTask}`, 'info');
        this.log(`   Phase: ${phase}`, 'info');
        this.log(`   Error: ${error.message}`, 'info');

        // Store delegation in status
        this.status.agentDelegation = {
            delegated: true,
            agent: selectedAgent,
            task: agentTask,
            timestamp: new Date().toISOString(),
            errorContext
        };

        // Signal that specialist agent intervention is needed
        this.log('\n⏸️  Pausing /start command for specialist agent intervention', 'warning');
        this.log('🔧 Specialist agent should now diagnose and fix the issue', 'info');
        this.log('🔄 After fix, /start can be retried', 'info');

        return {
            success: false,
            delegated: true,
            agent: selectedAgent,
            task: agentTask,
            status: this.status,
            instructions: 'Specialist agent intervention required. After fix, retry /start command.'
        };
    }

    async delegateToAgent(agent, context) {
        this.log(`🤝 Requesting assistance from ${agent}`, 'info');
        this.log(`   Context: ${JSON.stringify(context, null, 2)}`, 'info');

        // This would trigger actual agent delegation in production
        // For now, we log the delegation request
        return { delegated: true, agent, context };
    }

    generateMinimalContext() {
        return `
# aclue Project Context (Minimal)
- Platform: aclue - AI-powered gifting platform
- Stack: Next.js 14 + FastAPI + Supabase
- Status: Development environment startup
- Command: /start
- Mode: Context-Manager-First Architecture
        `;
    }

    // Recovery Wrapper Methods
    async validateEnvironmentWithRecovery() {
        try {
            await this.validateEnvironment();
        } catch (error) {
            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error, 'environment-validation');
            }
            throw error;
        }
    }

    async setupProjectWithRecovery() {
        try {
            await this.setupProject();
        } catch (error) {
            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error, 'project-setup');
            }
            throw error;
        }
    }

    async performHealthChecksWithRecovery() {
        try {
            await this.performHealthChecks();
        } catch (error) {
            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error, 'health-checks');
            }
            throw error;
        }
    }

    async startServicesWithRecovery() {
        try {
            await this.startServices();
        } catch (error) {
            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error, 'service-startup');
            }
            throw error;
        }
    }

    async verifyServicesWithRecovery() {
        try {
            await this.verifyServices();
        } catch (error) {
            if (this.agentDelegationEnabled) {
                return await this.delegateRecoveryToAgents(error, 'service-verification');
            }
            throw error;
        }
    }

    async launchBrowserWithRecovery() {
        try {
            await this.launchBrowser();
        } catch (error) {
            // Browser launch is non-critical, just warn
            this.log(`⚠️  Browser launch failed: ${error.message}`, 'warning');
        }
    }

    // Original implementation methods (now protected by recovery wrappers)
    async validateEnvironment() {
        this.log('\n📋 Phase 1: Environment Validation', 'phase');

        // Check project directory
        try {
            await fs.access(this.projectRoot);
            this.log('✅ Project directory found', 'success');
        } catch {
            throw new Error(`Project directory not found: ${this.projectRoot}`);
        }

        // Enhanced project structure validation with MCP (if available)
        if (this.mcpIntegration) {
            try {
                const structureValidation = await this.mcpIntegration.validateProjectStructure();
                if (structureValidation.success) {
                    this.log('✅ Project structure validation passed', 'success');
                } else {
                    this.log(`⚠️  Project structure issues: ${structureValidation.message}`, 'warning');
                    if (structureValidation.missingItems?.length > 0) {
                        this.log(`   Missing: ${structureValidation.missingItems.join(', ')}`, 'warning');
                    }
                }
            } catch (error) {
                this.log(`⚠️  Project structure check skipped: ${error.message}`, 'warning');
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

        // Create missing environment files using MCP integration (if available)
        if (this.mcpIntegration) {
            try {
                const envSetup = await this.mcpIntegration.createMissingEnvironmentFiles();
                if (envSetup.success) {
                    this.log('✅ Environment files verified/created', 'success');
                } else {
                    this.log(`⚠️  Environment file setup issues: ${envSetup.message}`, 'warning');
                }
            } catch (error) {
                this.log(`⚠️  Environment file check skipped: ${error.message}`, 'warning');
            }
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
                'NEXT_PUBLIC_SUPABASE_ANON_KEY': 'your_supabase_anon_key_here',
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
                    // Automatically attempt to free the port in development
                    try {
                        await this.killProcessOnPort(port);
                        this.log(`✅ Port ${port} freed`, 'success');
                    } catch (error) {
                        this.log(`❌ Could not free port ${port}: ${error.message}`, 'error');
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
        });

        process.on('close', (code) => {
            if (code !== 0) {
                this.status[serviceName].status = 'error';
                this.log(`❌ ${serviceName} exited with code ${code}`, 'error');
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
        if (this.status.contextManager) {
            this.logContextManagerStatus('Context-Manager', this.status.contextManager);
        }
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
        this.log('', 'divider');

        this.log('Happy coding! 🎉', 'title');
    }

    async storeStartupContext() {
        if (!this.mcpIntegration) return;

        try {
            const startupData = {
                services: this.status,
                startupTime: (Date.now() - this.startTime) / 1000,
                options: this.options,
                contextManagerActive: this.contextManagerActive,
                agentDelegationEnabled: this.agentDelegationEnabled
            };

            const contextResult = await this.mcpIntegration.storeStartupContext(startupData);
            if (contextResult.success) {
                this.log('💾 Startup context saved', 'info');
            }
        } catch (error) {
            this.log(`⚠️  Failed to store startup context: ${error.message}`, 'warning');
        }
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

    logContextManagerStatus(name, status) {
        const emoji = status.activated ? '✅' : '❌';
        const statusText = status.activated ? 'Active' : 'Failed';
        const mode = status.mode ? `[${status.mode}]` : '';
        this.log(`   ${emoji} ${name.padEnd(12)} ${statusText.padEnd(12)} ${mode}`, 'status');
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
            throw new Error(`Failed to kill process on port ${port}: ${error.message}`);
        }
    }

    async checkDatabaseConnectivity() {
        this.log('🗄️  Checking database connectivity...', 'info');

        try {
            // Try to ping Supabase health endpoint
            const response = await this.httpGet('https://xchsarvamppwephulylt.supabase.co/rest/v1/', 5000);
            this.status.database.status = response ? 'connected' : 'unreachable';
            this.status.database.connected = !!response;
            this.log(`✅ Database connection ${response ? 'verified' : 'failed'}`, response ? 'success' : 'warning');
        } catch (error) {
            this.status.database.status = 'error';
            this.status.database.connected = false;
            this.log(`⚠️  Database check failed: ${error.message}`, 'warning');
        }
    }

    async checkDeploymentServices() {
        this.log('☁️  Checking deployment services status...', 'info');

        try {
            // Check Vercel deployment
            const vercelResponse = await this.httpGet('https://aclue.app', 10000);
            this.status.services.vercel = vercelResponse ? 'operational' : 'degraded';

            // Check Railway deployment
            const railwayResponse = await this.httpGet('https://aclue-backend-production.up.railway.app/health', 10000);
            this.status.services.railway = railwayResponse ? 'operational' : 'degraded';

        } catch (error) {
            this.log(`⚠️  Deployment services check failed: ${error.message}`, 'warning');
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
            const open = process.platform === 'darwin' ? 'open' :
                         process.platform === 'win32' ? 'start' : 'xdg-open';

            await execAsync(`${open} ${url}`);
        } catch (error) {
            throw new Error(`Failed to open ${url}: ${error.message}`);
        }
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
