/**
 * Environment configuration with Zod validation for aclue web application.
 *
 * This module provides comprehensive environment variable management with:
 * - Type-safe environment variable access
 * - Runtime validation and type conversion
 * - Client vs server-side variable separation
 * - Development vs production configuration
 * - Security validation for sensitive variables
 *
 * Usage:
 *   import { env, clientEnv } from '@/lib/env'
 *
 *   // Server-side (API routes, Server Actions, SSR)
 *   const apiUrl = env.API_BASE_URL
 *   const resendKey = env.RESEND_API_KEY
 *
 *   // Client-side (browser code)
 *   const publicApiUrl = clientEnv.NEXT_PUBLIC_API_URL
 *   const isAnalyticsEnabled = clientEnv.NEXT_PUBLIC_ENABLE_ANALYTICS
 */

import { z } from 'zod'

// =============================================================================
// ENVIRONMENT TYPE DEFINITIONS
// =============================================================================

const Environment = z.enum(['development', 'test', 'production'])
const LogLevel = z.enum(['debug', 'info', 'warn', 'error'])

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Helper to create optional string with minimum length validation
 */
const optionalString = (minLength = 1) =>
  z.string().min(minLength).optional().or(z.literal(''))

/**
 * Helper to create required string with minimum length validation
 */
const requiredString = (minLength = 1) =>
  z.string().min(minLength, `String must be at least ${minLength} characters`)

/**
 * Helper to validate URL format
 */
const urlString = (required = false) => {
  const schema = z.string().url('Must be a valid URL')
  return required ? schema : schema.optional().or(z.literal(''))
}

/**
 * Helper to validate email format
 */
const emailString = (required = false) => {
  const schema = z.string().email('Must be a valid email address')
  return required ? schema : schema.optional().or(z.literal(''))
}

/**
 * Helper to validate JSON array string
 */
const jsonArrayString = <T>(itemSchema: z.ZodSchema<T>, defaultValue: T[] = []) =>
  z.string()
    .transform((str, ctx) => {
      try {
        const parsed = JSON.parse(str)
        if (!Array.isArray(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Must be a valid JSON array'
          })
          return z.NEVER
        }
        return parsed
      } catch {
        // Fallback to comma-separated values
        return str.split(',').map(item => item.trim()).filter(Boolean)
      }
    })
    .pipe(z.array(itemSchema))
    .default(defaultValue)

/**
 * Helper to validate boolean from string
 */
const booleanString = (defaultValue = false) =>
  z.string()
    .transform(val => val === 'true' || val === '1' || val === 'yes')
    .default(String(defaultValue))
    .transform(val => typeof val === 'string' ? val === 'true' : val)

/**
 * Helper to validate positive integer from string
 */
const positiveIntString = (defaultValue?: number) => {
  const schema = z.string()
    .transform((val, ctx) => {
      const parsed = parseInt(val, 10)
      if (isNaN(parsed) || parsed <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a positive integer'
        })
        return z.NEVER
      }
      return parsed
    })

  return defaultValue !== undefined ? schema.default(String(defaultValue)) : schema
}

// =============================================================================
// SERVER-SIDE ENVIRONMENT SCHEMA
// =============================================================================

const serverEnvSchema = z.object({
  // =========================================================================
  // NEXT.JS CORE CONFIGURATION
  // =========================================================================

  NODE_ENV: Environment.default('development'),

  NEXT_TELEMETRY_DISABLED: booleanString(true),

  ANALYZE: booleanString(false),

  BUNDLE_ANALYZER: booleanString(false),

  // =========================================================================
  // API CONFIGURATION
  // =========================================================================

  API_BASE_URL: urlString(true).default('http://localhost:8000'),

  API_TIMEOUT: positiveIntString(30000),

  API_SECRET_KEY: optionalString(32),

  // =========================================================================
  // SUPABASE CONFIGURATION
  // =========================================================================

  SUPABASE_SERVICE_ROLE_KEY: requiredString(20)
    .refine(
      (val) => val.startsWith('eyJ') || val === 'your-supabase-service-role-key-here',
      'SUPABASE_SERVICE_ROLE_KEY must be a valid JWT token'
    ),

  // =========================================================================
  // EMAIL SERVICES (Server-side only)
  // =========================================================================

  RESEND_API_KEY: z.string()
    .regex(
      /^re_[a-zA-Z0-9_-]+$/,
      'RESEND_API_KEY must start with "re_" and contain only alphanumeric characters, underscores, and hyphens'
    )
    .optional()
    .or(z.literal('')),

  FROM_EMAIL: emailString(false).default('hello@aclue.app'),

  FROM_NAME: z.string().max(100).default('aclue'),

  // =========================================================================
  // EXTERNAL SERVICES (Private Keys)
  // =========================================================================

  STRIPE_SECRET_KEY: z.string()
    .regex(
      /^sk_(test_|live_)[a-zA-Z0-9]+$/,
      'STRIPE_SECRET_KEY must be a valid Stripe secret key'
    )
    .optional()
    .or(z.literal('')),

  STRIPE_WEBHOOK_SECRET: z.string()
    .regex(
      /^whsec_[a-zA-Z0-9]+$/,
      'STRIPE_WEBHOOK_SECRET must start with "whsec_"'
    )
    .optional()
    .or(z.literal('')),

  GOOGLE_CLIENT_SECRET: optionalString(20),

  GITHUB_CLIENT_SECRET: optionalString(20),

  // =========================================================================
  // SECURITY CONFIGURATION
  // =========================================================================

  NEXTAUTH_SECRET: optionalString(32),

  JWT_SECRET: optionalString(32),

  FORCE_HTTPS: booleanString(false),

  SECURE_COOKIES: booleanString(false),

  // =========================================================================
  // BUILD & DEPLOYMENT CONFIGURATION
  // =========================================================================

  DOCKER_BUILDKIT: booleanString(true),

  BUILDKIT_PROGRESS: z.enum(['auto', 'plain', 'tty']).default('plain'),

  NEXT_OUTPUT: z.enum(['standalone', 'export']).default('standalone'),

  NEXT_TRACING: booleanString(true),

  COMPRESS_IMAGES: booleanString(true),

  COMPRESS_FONTS: booleanString(true),

  // =========================================================================
  // SECURITY CONFIGURATION
  // =========================================================================

  CSP_ENABLED: booleanString(false),

  CSP_REPORT_ONLY: booleanString(true),

  CORS_ENABLED: booleanString(true),

  CORS_ORIGINS: jsonArrayString(z.string().url(), ['http://localhost:3000', 'https://aclue.app']),
})

// =============================================================================
// CLIENT-SIDE ENVIRONMENT SCHEMA
// =============================================================================

const clientEnvSchema = z.object({
  // =========================================================================
  // APPLICATION CONFIGURATION
  // =========================================================================

  NEXT_PUBLIC_API_URL: urlString(true).default('http://localhost:8000'),

  NEXT_PUBLIC_WEB_URL: urlString(true).default('http://localhost:3000'),

  NEXT_PUBLIC_APP_NAME: z.string().default('aclue'),

  NEXT_PUBLIC_APP_DESCRIPTION: z.string().default('AI-powered gifting platform'),

  NEXT_PUBLIC_APP_VERSION: z.string().default('2.1.0'),

  // =========================================================================
  // SUPABASE CONFIGURATION (Public)
  // =========================================================================

  NEXT_PUBLIC_SUPABASE_URL: urlString(true).refine(
    (val) => val.includes('.supabase.co') || val.includes('localhost'),
    'NEXT_PUBLIC_SUPABASE_URL must be a valid Supabase URL'
  ),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: requiredString(20).refine(
    (val) => val.startsWith('eyJ') || val === 'your-supabase-anon-key-here',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid JWT token'
  ),

  // =========================================================================
  // EXTERNAL SERVICES (Public Keys)
  // =========================================================================

  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string()
    .regex(
      /^pk_(test_|live_)[a-zA-Z0-9]+$/,
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY must be a valid Stripe publishable key'
    )
    .optional()
    .or(z.literal('')),

  NEXT_PUBLIC_GOOGLE_ANALYTICS_ID: z.string()
    .regex(
      /^G-[A-Z0-9]+$/,
      'NEXT_PUBLIC_GOOGLE_ANALYTICS_ID must be in format G-XXXXXXXXXX'
    )
    .optional()
    .or(z.literal('')),

  NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: optionalString(20),

  // =========================================================================
  // ANALYTICS & MONITORING (Public Keys)
  // =========================================================================

  NEXT_PUBLIC_POSTHOG_KEY: z.string()
    .regex(
      /^phc_[a-zA-Z0-9]+$/,
      'NEXT_PUBLIC_POSTHOG_KEY must start with "phc_"'
    )
    .optional()
    .or(z.literal('')),

  NEXT_PUBLIC_POSTHOG_HOST: urlString(false).default('https://app.posthog.com'),

  NEXT_PUBLIC_SENTRY_DSN: urlString(false),

  NEXT_PUBLIC_SENTRY_ENVIRONMENT: z.string().default('development'),

  NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: z.string()
    .transform((val, ctx) => {
      const parsed = parseFloat(val)
      if (isNaN(parsed) || parsed < 0 || parsed > 1) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Must be a number between 0 and 1'
        })
        return z.NEVER
      }
      return parsed
    })
    .default('1.0'),

  NEXT_PUBLIC_MIXPANEL_TOKEN: optionalString(20),

  NEXT_PUBLIC_HOTJAR_ID: optionalString(1),

  NEXT_PUBLIC_HOTJAR_SV: optionalString(1),

  // =========================================================================
  // CDN & ASSET CONFIGURATION
  // =========================================================================

  NEXT_PUBLIC_IMAGE_DOMAINS: jsonArrayString(z.string(), ['images.aclue.app', 'cdn.aclue.app']),

  NEXT_PUBLIC_CDN_URL: urlString(false),

  NEXT_PUBLIC_ASSET_PREFIX: z.string().default(''),

  NEXT_PUBLIC_BASE_PATH: z.string().default(''),

  // =========================================================================
  // FEATURE FLAGS (Public)
  // =========================================================================

  NEXT_PUBLIC_ENABLE_ANALYTICS: booleanString(true),

  NEXT_PUBLIC_ENABLE_SOCIAL_LOGIN: booleanString(true),

  NEXT_PUBLIC_ENABLE_PWA: booleanString(true),

  NEXT_PUBLIC_ENABLE_PAYMENTS: booleanString(false),

  NEXT_PUBLIC_ENABLE_BETA_FEATURES: booleanString(false),

  NEXT_PUBLIC_ENABLE_DARK_MODE: booleanString(true),

  NEXT_PUBLIC_ENABLE_OFFLINE_MODE: booleanString(false),

  NEXT_PUBLIC_MAINTENANCE_MODE: booleanString(false),

  NEXT_PUBLIC_MAINTENANCE_MESSAGE: z.string().default("We'll be back soon"),

  // =========================================================================
  // PWA CONFIGURATION
  // =========================================================================

  NEXT_PUBLIC_PWA_ENABLED: booleanString(true),

  NEXT_PUBLIC_PWA_START_URL: z.string().default('/'),

  NEXT_PUBLIC_PWA_THEME_COLOR: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex colour')
    .default('#000000'),

  NEXT_PUBLIC_PWA_BACKGROUND_COLOR: z.string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex colour')
    .default('#ffffff'),

  // =========================================================================
  // DEVELOPMENT CONFIGURATION
  // =========================================================================

  NEXT_PUBLIC_DEBUG: booleanString(false),

  NEXT_PUBLIC_VERBOSE_LOGGING: booleanString(false),

  // =========================================================================
  // EXTERNAL API INTEGRATIONS (Public)
  // =========================================================================

  NEXT_PUBLIC_AMAZON_ASSOCIATE_TAG: optionalString(5),

  NEXT_PUBLIC_AMAZON_REGION: z.string()
    .regex(/^[a-z]{2}-[a-z]+-[0-9]$/, 'Must be a valid AWS region')
    .default('us-east-1'),

  NEXT_PUBLIC_DEFAULT_CURRENCY: z.string()
    .length(3, 'Must be a 3-letter currency code')
    .default('GBP'),

  NEXT_PUBLIC_DEFAULT_LOCALE: z.string()
    .regex(/^[a-z]{2}-[A-Z]{2}$/, 'Must be in format xx-XX')
    .default('en-GB'),

  NEXT_PUBLIC_SUPPORTED_LOCALES: jsonArrayString(
    z.string().regex(/^[a-z]{2}-[A-Z]{2}$/),
    ['en-GB', 'en-US']
  ),

  // =========================================================================
  // PERFORMANCE & OPTIMISATION
  // =========================================================================

  NEXT_PUBLIC_IMAGE_QUALITY: positiveIntString(75).refine(
    (val) => val >= 1 && val <= 100,
    'Image quality must be between 1 and 100'
  ),

  NEXT_PUBLIC_IMAGE_FORMATS: jsonArrayString(
    z.enum(['webp', 'avif', 'jpeg', 'png']),
    ['webp', 'avif']
  ),

  NEXT_PUBLIC_CACHE_TTL: positiveIntString(3600),

  NEXT_PUBLIC_ENABLE_SW_CACHING: booleanString(true),

  NEXT_PUBLIC_ENABLE_WEB_VITALS: booleanString(true),

  NEXT_PUBLIC_PERFORMANCE_MONITORING: booleanString(false),

  // =========================================================================
  // SECURITY CONFIGURATION
  // =========================================================================

  NEXT_PUBLIC_RATE_LIMIT_ENABLED: booleanString(true),

  NEXT_PUBLIC_RATE_LIMIT_REQUESTS: positiveIntString(100),

  NEXT_PUBLIC_RATE_LIMIT_WINDOW: positiveIntString(60000),
})

// =============================================================================
// ENVIRONMENT VALIDATION AND PARSING
// =============================================================================

/**
 * Parse and validate server-side environment variables
 */
function parseServerEnv() {
  const parsed = serverEnvSchema.safeParse(process.env)

  if (!parsed.success) {
    console.error('❌ Invalid server environment variables:')
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    throw new Error('Invalid server environment configuration')
  }

  return parsed.data
}

/**
 * Parse and validate client-side environment variables
 */
function parseClientEnv() {
  const clientEnv: Record<string, string | undefined> = {}

  // Extract only NEXT_PUBLIC_ variables for client-side
  for (const [key, value] of Object.entries(process.env)) {
    if (key.startsWith('NEXT_PUBLIC_')) {
      clientEnv[key] = value
    }
  }

  const parsed = clientEnvSchema.safeParse(clientEnv)

  if (!parsed.success) {
    console.error('❌ Invalid client environment variables:')
    console.error(JSON.stringify(parsed.error.flatten().fieldErrors, null, 2))
    throw new Error('Invalid client environment configuration')
  }

  return parsed.data
}

/**
 * Validate environment configuration and return detailed results
 */
export function validateEnvironment() {
  const results = {
    valid: true,
    errors: [] as string[],
    warnings: [] as string[],
    environment: process.env.NODE_ENV || 'development',
    missingRequired: [] as string[],
    recommendations: [] as string[],
  }

  try {
    // Validate server environment
    const serverValidation = serverEnvSchema.safeParse(process.env)
    if (!serverValidation.success) {
      results.valid = false
      const errors = serverValidation.error.flatten().fieldErrors
      for (const [field, fieldErrors] of Object.entries(errors)) {
        results.errors.push(`${field}: ${fieldErrors?.join(', ')}`)
        if (fieldErrors?.some(err => err.includes('required'))) {
          results.missingRequired.push(field)
        }
      }
    }

    // Validate client environment
    const clientEnv: Record<string, string | undefined> = {}
    for (const [key, value] of Object.entries(process.env)) {
      if (key.startsWith('NEXT_PUBLIC_')) {
        clientEnv[key] = value
      }
    }

    const clientValidation = clientEnvSchema.safeParse(clientEnv)
    if (!clientValidation.success) {
      results.valid = false
      const errors = clientValidation.error.flatten().fieldErrors
      for (const [field, fieldErrors] of Object.entries(errors)) {
        results.errors.push(`${field}: ${fieldErrors?.join(', ')}`)
        if (fieldErrors?.some(err => err.includes('required'))) {
          results.missingRequired.push(field)
        }
      }
    }

    // Production-specific validations
    if (process.env.NODE_ENV === 'production') {
      const serverEnv = serverValidation.success ? serverValidation.data : null
      const clientEnvData = clientValidation.success ? clientValidation.data : null

      if (serverEnv?.NEXT_TELEMETRY_DISABLED !== true) {
        results.warnings.push('Consider disabling Next.js telemetry in production')
      }

      if (clientEnvData?.NEXT_PUBLIC_DEBUG === true) {
        results.warnings.push('Debug mode should be disabled in production')
      }

      if (clientEnvData?.NEXT_PUBLIC_API_URL?.includes('localhost')) {
        results.errors.push('API URL should not contain localhost in production')
      }

      if (!serverEnv?.RESEND_API_KEY) {
        results.recommendations.push('Set up Resend for email functionality')
      }

      if (!clientEnvData?.NEXT_PUBLIC_SENTRY_DSN) {
        results.recommendations.push('Set up Sentry for error tracking')
      }
    }

    // Security validations
    if (process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
      results.errors.push('STRIPE_SECRET_KEY should not have NEXT_PUBLIC_ prefix (security risk)')
    }

    if (process.env.NEXT_PUBLIC_RESEND_API_KEY) {
      results.errors.push('RESEND_API_KEY should not have NEXT_PUBLIC_ prefix (security risk)')
    }

  } catch (error) {
    results.valid = false
    results.errors.push(`Validation error: ${error instanceof Error ? error.message : String(error)}`)
  }

  return results
}

/**
 * Get environment type with validation
 */
export function getEnvironment(): 'development' | 'test' | 'production' {
  const env = process.env.NODE_ENV
  if (env === 'development' || env === 'test' || env === 'production') {
    return env
  }
  return 'development'
}

/**
 * Check if running in production
 */
export function isProduction(): boolean {
  return getEnvironment() === 'production'
}

/**
 * Check if running in development
 */
export function isDevelopment(): boolean {
  return getEnvironment() === 'development'
}

/**
 * Check if running in test environment
 */
export function isTest(): boolean {
  return getEnvironment() === 'test'
}

// =============================================================================
// EXPORTED CONFIGURATION OBJECTS
// =============================================================================

/**
 * Server-side environment variables
 * Available in API routes, Server Actions, and SSR
 */
export const env = parseServerEnv()

/**
 * Client-side environment variables
 * Available in browser code (only NEXT_PUBLIC_ variables)
 */
export const clientEnv = parseClientEnv()

/**
 * Type definitions for environment variables
 */
export type ServerEnv = z.infer<typeof serverEnvSchema>
export type ClientEnv = z.infer<typeof clientEnvSchema>

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

/**
 * Get a type-safe environment variable with fallback
 */
export function getEnvVar<T extends keyof ServerEnv>(
  key: T,
  fallback?: ServerEnv[T]
): ServerEnv[T] {
  const value = env[key]
  if (value === undefined || value === '') {
    if (fallback !== undefined) {
      return fallback
    }
    throw new Error(`Environment variable ${String(key)} is required but not set`)
  }
  return value
}

/**
 * Get a type-safe client environment variable with fallback
 */
export function getClientEnvVar<T extends keyof ClientEnv>(
  key: T,
  fallback?: ClientEnv[T]
): ClientEnv[T] {
  const value = clientEnv[key]
  if (value === undefined || value === '') {
    if (fallback !== undefined) {
      return fallback
    }
    throw new Error(`Client environment variable ${String(key)} is required but not set`)
  }
  return value
}

/**
 * Create configuration object for specific service
 */
export function createServiceConfig<T>(
  serviceConfig: (env: ServerEnv, clientEnv: ClientEnv) => T
): T {
  return serviceConfig(env, clientEnv)
}

/**
 * Print environment information for debugging
 */
export function printEnvironmentInfo(): void {
  const envInfo = {
    environment: getEnvironment(),
    api_url: clientEnv.NEXT_PUBLIC_API_URL,
    web_url: clientEnv.NEXT_PUBLIC_WEB_URL,
    supabase_url: clientEnv.NEXT_PUBLIC_SUPABASE_URL,
    analytics_enabled: clientEnv.NEXT_PUBLIC_ENABLE_ANALYTICS,
    maintenance_mode: clientEnv.NEXT_PUBLIC_MAINTENANCE_MODE,
    pwa_enabled: clientEnv.NEXT_PUBLIC_PWA_ENABLED,
  }

  console.log('🔧 Environment Configuration:')
  console.table(envInfo)
}

// Development helper: print environment info if not in production
if (isDevelopment() && typeof window === 'undefined') {
  const validation = validateEnvironment()
  if (!validation.valid) {
    console.warn('⚠️  Environment validation issues detected:')
    validation.errors.forEach(error => console.error(`  ❌ ${error}`))
    validation.warnings.forEach(warning => console.warn(`  ⚠️  ${warning}`))
  }
}
