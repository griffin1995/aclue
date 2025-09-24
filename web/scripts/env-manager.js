#!/usr/bin/env node

/**
 * Environment management CLI for aclue web application.
 *
 * This script provides utilities for managing environment variables,
 * validation, and deployment configuration for the Next.js frontend.
 *
 * Usage:
 *   node scripts/env-manager.js <command> [options]
 *   npm run env:validate
 *   npm run env:setup
 *   npm run env:health
 */

const fs = require('fs').promises
const path = require('path')
const { execSync } = require('child_process')
const crypto = require('crypto')

// ANSI color codes for terminal output
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  reset: '\x1b[0m',
  bold: '\x1b[1m',
}

class EnvironmentManager {
  constructor() {
    this.projectRoot = this.findProjectRoot()
    this.loadedFiles = []
  }

  /**
   * Find the project root directory
   */
  findProjectRoot() {
    let current = __dirname
    const markers = ['package.json', 'next.config.js', '.git']

    for (let i = 0; i < 10; i++) {
      for (const marker of markers) {
        if (this.fileExists(path.join(current, marker))) {
          return current
        }
      }
      current = path.dirname(current)
    }

    return process.cwd()
  }

  /**
   * Check if file exists synchronously
   */
  fileExists(filePath) {
    try {
      require('fs').accessSync(filePath)
      return true
    } catch {
      return false
    }
  }

  /**
   * Log with color and formatting
   */
  log(message, color = 'white', prefix = '') {
    const prefixStr = prefix ? `${prefix} ` : ''
    console.log(`${colors[color]}${prefixStr}${message}${colors.reset}`)
  }

  /**
   * Log error message
   */
  logError(message) {
    this.log(message, 'red', '❌')
  }

  /**
   * Log success message
   */
  logSuccess(message) {
    this.log(message, 'green', '✅')
  }

  /**
   * Log warning message
   */
  logWarning(message) {
    this.log(message, 'yellow', '⚠️')
  }

  /**
   * Log info message
   */
  logInfo(message) {
    this.log(message, 'blue', 'ℹ️')
  }

  /**
   * Load environment files in order of precedence
   */
  async loadEnvironmentFiles(environment = 'development', verbose = false) {
    const envFiles = [
      '.env.default',
      '.env',
      `.env.${environment}`,
      '.env.local'
    ]

    this.loadedFiles = []

    for (const envFile of envFiles) {
      const filePath = path.join(this.projectRoot, envFile)

      if (this.fileExists(filePath)) {
        try {
          const content = await fs.readFile(filePath, 'utf8')
          this.parseEnvContent(content)
          this.loadedFiles.push(envFile)

          if (verbose) {
            this.logSuccess(`Loaded environment file: ${envFile}`)
          }
        } catch (error) {
          this.logError(`Error loading ${envFile}: ${error.message}`)
          return false
        }
      }
    }

    return true
  }

  /**
   * Parse environment file content and set variables
   */
  parseEnvContent(content) {
    const lines = content.split('\n')

    for (const line of lines) {
      const trimmed = line.trim()

      // Skip comments and empty lines
      if (trimmed.startsWith('#') || !trimmed || !trimmed.includes('=')) {
        continue
      }

      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').trim()

      // Remove quotes if present
      const cleanValue = value.replace(/^["']|["']$/g, '')

      // Only set if not already defined (respect precedence)
      if (!process.env[key.trim()]) {
        process.env[key.trim()] = cleanValue
      }
    }
  }

  /**
   * Validate environment variables using our validation schema
   */
  async validateEnvironment() {
    const validation = {
      valid: true,
      errors: [],
      warnings: [],
      environment: process.env.NODE_ENV || 'development',
      missingRequired: [],
      recommendations: []
    }

    try {
      // Check required variables
      const requiredVars = [
        'NEXT_PUBLIC_API_URL',
        'NEXT_PUBLIC_WEB_URL',
        'NEXT_PUBLIC_SUPABASE_URL',
        'NEXT_PUBLIC_SUPABASE_ANON_KEY',
        'SUPABASE_SERVICE_ROLE_KEY'
      ]

      for (const varName of requiredVars) {
        if (!process.env[varName] || process.env[varName] === '') {
          validation.errors.push(`${varName} is required but not set`)
          validation.missingRequired.push(varName)
          validation.valid = false
        }
      }

      // Validate URL formats
      const urlVars = [
        'NEXT_PUBLIC_API_URL',
        'NEXT_PUBLIC_WEB_URL',
        'NEXT_PUBLIC_SUPABASE_URL'
      ]

      for (const varName of urlVars) {
        const value = process.env[varName]
        if (value && !this.isValidUrl(value)) {
          validation.errors.push(`${varName} must be a valid URL`)
          validation.valid = false
        }
      }

      // Production-specific validations
      if (validation.environment === 'production') {
        if (process.env.NEXT_PUBLIC_API_URL?.includes('localhost')) {
          validation.errors.push('API URL should not contain localhost in production')
          validation.valid = false
        }

        if (process.env.NEXT_PUBLIC_DEBUG === 'true') {
          validation.warnings.push('Debug mode should be disabled in production')
        }

        if (!process.env.RESEND_API_KEY) {
          validation.recommendations.push('Set up Resend for email functionality')
        }

        if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
          validation.recommendations.push('Set up Sentry for error tracking')
        }
      }

      // Security validations
      const sensitiveVarsWithPublicPrefix = Object.keys(process.env)
        .filter(key => key.startsWith('NEXT_PUBLIC_') &&
          (key.includes('SECRET') || key.includes('PRIVATE') || key.includes('KEY')))
        .filter(key => !['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY', 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'].includes(key))

      for (const varName of sensitiveVarsWithPublicPrefix) {
        validation.errors.push(`${varName} should not have NEXT_PUBLIC_ prefix (security risk)`)
        validation.valid = false
      }

      // Check API key formats
      if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith('re_')) {
        validation.errors.push('RESEND_API_KEY must start with "re_"')
        validation.valid = false
      }

      if (process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY &&
          !process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.match(/^pk_(test_|live_)/)) {
        validation.errors.push('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a valid Stripe publishable key')
        validation.valid = false
      }

    } catch (error) {
      validation.valid = false
      validation.errors.push(`Validation error: ${error.message}`)
    }

    return validation
  }

  /**
   * Check if a string is a valid URL
   */
  isValidUrl(string) {
    try {
      new URL(string)
      return true
    } catch {
      return false
    }
  }

  /**
   * Create environment file from template
   */
  async createEnvFile(environment = 'development', force = false) {
    const templatePath = path.join(this.projectRoot, '.env.example')

    if (!this.fileExists(templatePath)) {
      throw new Error('Template file .env.example not found')
    }

    const outputFile = environment === 'development'
      ? path.join(this.projectRoot, '.env.local')
      : path.join(this.projectRoot, `.env.${environment}`)

    if (this.fileExists(outputFile) && !force) {
      throw new Error(`Environment file already exists: ${path.basename(outputFile)}. Use --force to overwrite.`)
    }

    let content = await fs.readFile(templatePath, 'utf8')

    // Apply development defaults
    if (environment === 'development') {
      content = this.applyDevelopmentDefaults(content)
    }

    await fs.writeFile(outputFile, content, 'utf8')

    this.logSuccess(`Created environment file: ${path.basename(outputFile)}`)
    this.logInfo('Please review and update the values before using')

    return outputFile
  }

  /**
   * Apply development-specific defaults
   */
  applyDevelopmentDefaults(content) {
    const replacements = {
      'your-api-secret-key-for-server-side-requests': this.generateSecretKey(),
      'your-nextauth-secret-key-here': this.generateSecretKey(),
      'your-jwt-secret-for-client-side-validation': this.generateSecretKey(),
    }

    for (const [placeholder, replacement] of Object.entries(replacements)) {
      content = content.replace(placeholder, replacement)
    }

    return content
  }

  /**
   * Generate a secure random key
   */
  generateSecretKey(length = 64) {
    return crypto.randomBytes(length).toString('hex')
  }

  /**
   * Perform environment health check
   */
  async performHealthCheck() {
    const health = {
      status: 'healthy',
      environment: process.env.NODE_ENV || 'development',
      loadedFiles: this.loadedFiles,
      validation: null,
      requiredMissing: [],
      securityIssues: [],
      warnings: [],
      recommendations: []
    }

    try {
      // Load environment files
      await this.loadEnvironmentFiles(health.environment, false)

      // Validate environment
      health.validation = await this.validateEnvironment()

      // Extract specific issues
      health.requiredMissing = health.validation.missingRequired || []
      health.warnings = health.validation.warnings || []
      health.recommendations = health.validation.recommendations || []

      // Check for security issues
      health.securityIssues = health.validation.errors?.filter(error =>
        error.includes('security risk') || error.includes('SECRET')
      ) || []

      // Determine overall status
      if (health.requiredMissing.length > 0 || health.securityIssues.length > 0) {
        health.status = 'unhealthy'
      } else if (health.warnings.length > 0) {
        health.status = 'warning'
      }

    } catch (error) {
      health.status = 'error'
      health.error = error.message
    }

    return health
  }

  /**
   * Generate deployment configuration for Vercel
   */
  generateVercelConfig(environment = 'production') {
    const envVars = Object.keys(process.env)
      .filter(key => key.startsWith('NEXT_PUBLIC_') ||
        ['RESEND_API_KEY', 'SUPABASE_SERVICE_ROLE_KEY', 'STRIPE_SECRET_KEY'].includes(key))
      .map(key => `${key}=${process.env[key] || '<set-in-vercel-dashboard>'}`)

    return `# Vercel Environment Variables
# Set these in Vercel Dashboard -> Project -> Settings -> Environment Variables

${envVars.join('\n')}

# Build Settings
NODE_VERSION=18
NEXT_TELEMETRY_DISABLED=1

# Production optimizations
NODE_ENV=production
NEXT_OUTPUT=standalone`
  }

  /**
   * Print environment information
   */
  printEnvironmentInfo() {
    const info = {
      Environment: process.env.NODE_ENV || 'development',
      'API URL': process.env.NEXT_PUBLIC_API_URL || 'not set',
      'Web URL': process.env.NEXT_PUBLIC_WEB_URL || 'not set',
      'Supabase URL': process.env.NEXT_PUBLIC_SUPABASE_URL || 'not set',
      'Analytics Enabled': process.env.NEXT_PUBLIC_ENABLE_ANALYTICS || 'false',
      'Maintenance Mode': process.env.NEXT_PUBLIC_MAINTENANCE_MODE || 'false',
      'PWA Enabled': process.env.NEXT_PUBLIC_PWA_ENABLED || 'false',
    }

    this.log('\n🔧 Environment Configuration:', 'cyan', '')
    console.table(info)
  }
}

// CLI Commands

async function validateCommand(options = {}) {
  const manager = new EnvironmentManager()

  try {
    await manager.loadEnvironmentFiles(options.environment, options.verbose)
    const validation = await manager.validateEnvironment()

    manager.log('\n📋 Environment Validation Results:', 'cyan')
    manager.log(`Valid: ${validation.valid}`, validation.valid ? 'green' : 'red')
    manager.log(`Environment: ${validation.environment}`, 'blue')

    if (validation.errors.length > 0) {
      manager.log('\n❌ Errors:', 'red')
      validation.errors.forEach(error => manager.log(`  • ${error}`, 'red'))
    }

    if (validation.warnings.length > 0) {
      manager.log('\n⚠️  Warnings:', 'yellow')
      validation.warnings.forEach(warning => manager.log(`  • ${warning}`, 'yellow'))
    }

    if (validation.recommendations.length > 0) {
      manager.log('\n💡 Recommendations:', 'cyan')
      validation.recommendations.forEach(rec => manager.log(`  • ${rec}`, 'cyan'))
    }

    process.exit(validation.valid ? 0 : 1)

  } catch (error) {
    manager.logError(`Validation failed: ${error.message}`)
    process.exit(1)
  }
}

async function setupCommand(options = {}) {
  const manager = new EnvironmentManager()

  try {
    await manager.createEnvFile(options.environment || 'development', options.force)

    manager.log('\n📋 Next steps:', 'cyan')
    manager.log('1. Review the generated environment file', 'white')
    manager.log('2. Update placeholder values with real configuration', 'white')
    manager.log('3. Run validation: npm run env:validate', 'white')
    manager.log('4. Start your development server', 'white')

  } catch (error) {
    manager.logError(`Setup failed: ${error.message}`)
    process.exit(1)
  }
}

async function healthCommand() {
  const manager = new EnvironmentManager()

  try {
    const health = await manager.performHealthCheck()

    manager.log('\n🏥 Environment Health Check:', 'cyan')

    const statusColor = health.status === 'healthy' ? 'green' :
                       health.status === 'warning' ? 'yellow' : 'red'
    manager.log(`Status: ${health.status}`, statusColor)
    manager.log(`Environment: ${health.environment}`, 'blue')
    manager.log(`Loaded Files: ${health.loadedFiles.length}`, 'blue')

    if (health.requiredMissing.length > 0) {
      manager.log('\n🔑 Missing Required Variables:', 'red')
      health.requiredMissing.forEach(missing => manager.log(`  • ${missing}`, 'red'))
    }

    if (health.securityIssues.length > 0) {
      manager.log('\n🔒 Security Issues:', 'red')
      health.securityIssues.forEach(issue => manager.log(`  • ${issue}`, 'red'))
    }

    if (health.warnings.length > 0) {
      manager.log('\n⚠️  Warnings:', 'yellow')
      health.warnings.forEach(warning => manager.log(`  • ${warning}`, 'yellow'))
    }

    process.exit(health.status === 'healthy' ? 0 : 1)

  } catch (error) {
    manager.logError(`Health check failed: ${error.message}`)
    process.exit(1)
  }
}

async function infoCommand() {
  const manager = new EnvironmentManager()

  try {
    await manager.loadEnvironmentFiles(process.env.NODE_ENV, false)
    manager.printEnvironmentInfo()
  } catch (error) {
    manager.logError(`Info command failed: ${error.message}`)
    process.exit(1)
  }
}

async function generateCommand(platform, options = {}) {
  const manager = new EnvironmentManager()

  try {
    if (platform === 'vercel') {
      await manager.loadEnvironmentFiles(options.environment || 'production', false)
      const config = manager.generateVercelConfig(options.environment || 'production')
      console.log(config)
    } else {
      throw new Error(`Unsupported platform: ${platform}`)
    }
  } catch (error) {
    manager.logError(`Generate command failed: ${error.message}`)
    process.exit(1)
  }
}

// CLI Interface
async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  const options = {}

  // Parse options
  for (let i = 1; i < args.length; i++) {
    const arg = args[i]
    if (arg === '--verbose' || arg === '-v') {
      options.verbose = true
    } else if (arg === '--force' || arg === '-f') {
      options.force = true
    } else if (arg === '--environment' || arg === '-e') {
      options.environment = args[++i]
    }
  }

  switch (command) {
    case 'validate':
      await validateCommand(options)
      break

    case 'setup':
      await setupCommand(options)
      break

    case 'health':
      await healthCommand()
      break

    case 'info':
      await infoCommand()
      break

    case 'generate':
      await generateCommand(args[1], options)
      break

    default:
      console.log(`
🔧 aclue Environment Manager

Usage: node scripts/env-manager.js <command> [options]

Commands:
  validate    Validate environment variables
  setup       Create environment file from template
  health      Perform environment health check
  info        Display current environment information
  generate    Generate deployment configuration

Options:
  --verbose, -v        Enable verbose output
  --force, -f          Force overwrite existing files
  --environment, -e    Specify environment (development/production)

Examples:
  node scripts/env-manager.js validate
  node scripts/env-manager.js setup --force
  node scripts/env-manager.js health
  node scripts/env-manager.js generate vercel
`)
      process.exit(1)
  }
}

// Run CLI if called directly
if (require.main === module) {
  main().catch(error => {
    console.error('❌ Unexpected error:', error.message)
    process.exit(1)
  })
}

module.exports = { EnvironmentManager }
