'use server'

import { z } from 'zod'
import { headers } from 'next/headers'

/**
 * Newsletter Server Actions - App Router Implementation
 *
 * Server-side newsletter signup actions for optimal performance and security.
 * Integrates with existing FastAPI backend newsletter endpoint.
 *
 * Features:
 * - Server-side form processing with Zod validation
 * - Integration with backend API endpoint
 * - Enhanced error handling and logging
 * - User agent and source tracking
 * - GDPR-compliant data handling
 *
 * Backend Integration:
 * - Endpoint: POST /api/v1/newsletter/subscribe
 * - Maintains compatibility with existing API structure
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
 * API configuration for newsletter service
 */
const NEWSLETTER_CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://aclue-backend-production.up.railway.app',
    timeout: 10000, // 10 seconds
    endpoint: '/api/v1/newsletter/signup', // Note: API uses 'signup' not 'subscribe'
  },
} as const

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Server action for newsletter signup
 * @param formData - Form data containing email and optional fields
 */
export async function newsletterSignupAction(formData: FormData): Promise<NewsletterResult> {
  console.log('📧 Newsletter signup server action started')

  try {
    // Get user agent from headers for tracking
    const headersList = headers()
    const userAgent = headersList.get('user-agent') || 'Unknown'

    // Extract and validate form data
    const rawData = {
      email: formData.get('email') as string,
      source: formData.get('source') as string || 'app_router_page',
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

    // Prepare API payload (match existing backend expectations)
    const newsletterPayload = {
      email: validatedData.email,
      source: validatedData.source,
      user_agent: userAgent,
      marketing_consent: validatedData.marketing_consent,
    }

    console.log('🌐 Calling backend newsletter API:', NEWSLETTER_CONFIG.api.baseUrl)

    // Call backend newsletter signup API
    const response = await fetch(`${NEWSLETTER_CONFIG.api.baseUrl}${NEWSLETTER_CONFIG.api.endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Aclue-Web-Server/1.0',
      },
      body: JSON.stringify(newsletterPayload),
      signal: AbortSignal.timeout(NEWSLETTER_CONFIG.api.timeout),
    })

    // Handle API response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        detail: 'Newsletter signup failed'
      }))

      console.error('❌ Backend newsletter signup failed:', response.status, errorData)

      // Handle specific error cases
      if (response.status === 409) {
        return {
          success: true, // Show success to user for better UX (already subscribed)
          message: 'Thank you! You\'re now on our mailing list.',
          code: 'ALREADY_SUBSCRIBED',
        }
      }

      return {
        success: false,
        error: errorData.detail || 'Unable to process signup. Please try again.',
        code: response.status === 400 ? 'INVALID_DATA' : 'SIGNUP_ERROR',
        details: errorData,
      }
    }

    const responseData = await response.json()
    console.log('✅ Newsletter signup successful:', responseData)

    return {
      success: true,
      message: responseData.message || 'Thank you! You\'re now on our mailing list.',
      code: 'SIGNUP_SUCCESS',
    }

  } catch (error: any) {
    console.error('💥 Newsletter signup error:', error)

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
      code: 'UNKNOWN_ERROR',
      details: { message: error.message },
    }
  }
}

/**
 * Alternative action with direct email parameter for simpler usage
 * @param email - Email address to subscribe
 * @param source - Source of the signup (default: 'direct')
 */
export async function subscribeEmailAction(
  email: string,
  source: string = 'direct'
): Promise<NewsletterResult> {
  console.log('📧 Direct email subscription started for:', email)

  const formData = new FormData()
  formData.append('email', email)
  formData.append('source', source)
  formData.append('marketing_consent', 'true')

  return newsletterSignupAction(formData)
}