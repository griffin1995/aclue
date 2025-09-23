'use server'

import { z } from 'zod'

/**
 * Newsletter Server Actions - Frontend-Only Implementation
 *
 * Clean frontend-only newsletter signup using official Resend patterns.
 * Routes requests to frontend API endpoint eliminating backend dependencies.
 *
 * Features:
 * - Server-side form processing with Zod validation
 * - Frontend API route integration (/api/send)
 * - Direct Resend integration following official patterns
 * - Enhanced error handling and logging
 * - User agent and source tracking
 * - GDPR-compliant data handling
 * - Production-ready reliability
 *
 * Frontend Integration:
 * - Primary: POST /api/send (frontend API route)
 * - Direct Resend SDK integration
 * - React email templates
 * - Preserves source tracking for analytics
 */

// =============================================================================
// VALIDATION SCHEMAS
// =============================================================================

/**
 * Newsletter signup validation schema
 */
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(320, 'Email address is too long')
    .transform(email => email.toLowerCase().trim()),
  source: z.string().optional().default('app_router_page'),
  marketing_consent: z.boolean().optional().default(true),
})

export type NewsletterFormData = z.infer<typeof newsletterSchema>

/**
 * Newsletter signup result interface
 */
export interface NewsletterResult {
  success: boolean
  error?: string
  code?: string
  details?: Record<string, any>
  message?: string
}

/**
 * API configuration for frontend-only newsletter service
 */
const NEWSLETTER_CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_WEB_URL || 'https://aclue.app',
    timeout: 15000, // 15 seconds for frontend API
    endpoint: '/api/send', // Frontend API route
  },
} as const

// =============================================================================
// FRONTEND API FUNCTIONS
// =============================================================================

/**
 * Call frontend API route for newsletter signup
 * Uses direct Resend integration via /api/send endpoint
 */
async function callFrontendNewsletterAPI(
  email: string,
  source: string,
  marketingConsent: boolean
): Promise<NewsletterResult> {
  try {
    console.log('🌐 Calling frontend newsletter API:', `${NEWSLETTER_CONFIG.api.baseUrl}${NEWSLETTER_CONFIG.api.endpoint}`)

    const response = await fetch(`${NEWSLETTER_CONFIG.api.baseUrl}${NEWSLETTER_CONFIG.api.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'aclue-Server-Action/2.0',
      },
      body: JSON.stringify({
        email,
        source,
        marketing_consent: marketingConsent,
      }),
      signal: AbortSignal.timeout(NEWSLETTER_CONFIG.api.timeout),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        error: 'Newsletter signup failed'
      }))

      console.error('❌ Frontend API newsletter signup failed:', response.status, errorData)

      return {
        success: false,
        error: errorData.error || 'Unable to process signup. Please try again.',
        code: response.status === 400 ? 'VALIDATION_ERROR' : 'API_ERROR',
        details: errorData,
      }
    }

    const responseData = await response.json()
    console.log('✅ Frontend API newsletter signup successful:', responseData)

    return {
      success: true,
      message: responseData.message || 'Thank you! You\'re now on our mailing list.',
      code: 'FRONTEND_API_SUCCESS',
      details: responseData.data,
    }

  } catch (error: any) {
    console.error('💥 Frontend API call failed:', error)

    // Enhanced error classification
    if (error.name === 'AbortError') {
      return {
        success: false,
        error: 'Request timeout. Please try again.',
        code: 'TIMEOUT_ERROR',
      }
    }

    if (error.message?.includes('fetch')) {
      return {
        success: false,
        error: 'Unable to connect to our service. Please check your connection and try again.',
        code: 'NETWORK_ERROR',
      }
    }

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      code: 'FRONTEND_API_ERROR',
      details: { message: error.message },
    }
  }
}

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Server action for newsletter signup
 * Routes to frontend API endpoint with direct Resend integration
 * @param formData - Form data containing email and optional fields
 */
export async function newsletterSignupAction(formData: FormData): Promise<NewsletterResult> {
  console.log('📧 Newsletter signup server action started (frontend-only)')

  try {
    // Extract and validate form data
    const rawData = {
      email: formData.get('email') as string,
      source: formData.get('source') as string || 'server_action',
      marketing_consent: formData.get('marketing_consent') !== 'false', // Default to true
    }

    console.log('📋 Newsletter form data:', {
      email: rawData.email,
      source: rawData.source,
      marketing_consent: rawData.marketing_consent
    })

    // Validate using Zod schema
    const validationResult = newsletterSchema.safeParse(rawData)

    if (!validationResult.success) {
      console.error('❌ Newsletter validation failed:', validationResult.error.errors)
      return {
        success: false,
        error: 'Invalid email address',
        code: 'VALIDATION_ERROR',
        details: validationResult.error.errors,
      }
    }

    const validatedData = validationResult.data

    // Call frontend API route with direct Resend integration
    return await callFrontendNewsletterAPI(
      validatedData.email,
      validatedData.source,
      validatedData.marketing_consent
    )

  } catch (error: any) {
    console.error('💥 Newsletter signup server action error:', error)

    return {
      success: false,
      error: 'An unexpected error occurred. Please try again.',
      code: 'SERVER_ACTION_ERROR',
      details: { message: error.message },
    }
  }
}

/**
 * Alternative action with direct email parameter for simpler usage
 * Routes to frontend API endpoint with direct Resend integration
 * @param email - Email address to subscribe
 * @param source - Source of the signup (default: 'direct')
 */
export async function subscribeEmailAction(
  email: string,
  source: string = 'direct_api'
): Promise<NewsletterResult> {
  console.log('📧 Direct email subscription started (frontend-only):', email)

  const formData = new FormData()
  formData.append('email', email)
  formData.append('source', source)
  formData.append('marketing_consent', 'true')

  return newsletterSignupAction(formData)
}