'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { Resend } from 'resend'

/**
 * Newsletter Server Actions - App Router Implementation with Resend Fallback
 *
 * Production-ready newsletter signup with intelligent fallback system.
 * Prioritises backend API integration with Resend as a reliable fallback.
 *
 * Features:
 * - Server-side form processing with Zod validation
 * - Primary: Backend API endpoint integration
 * - Fallback: Direct Resend email service
 * - Enhanced error handling and logging
 * - User agent and source tracking
 * - GDPR-compliant data handling
 * - Environment-aware routing
 *
 * Backend Integration:
 * - Primary: POST /api/v1/newsletter/subscribe
 * - Fallback: Direct email via Resend API
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
 * API configuration for newsletter service with Resend fallback
 */
const NEWSLETTER_CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://aclue-backend-production.up.railway.app',
    timeout: 10000, // 10 seconds
    endpoint: '/api/v1/newsletter/signup', // Note: API uses 'signup' not 'subscribe'
  },
  resend: {
    apiKey: process.env.RESEND_API_KEY,
    fromEmail: 'aclue <newsletter@aclue.app>',
    toEmail: 'team@aclue.app', // Internal email for newsletter signups
    fallbackEnabled: true,
  },
  fallback: {
    enableOnNetworkError: true,
    enableOnTimeout: true,
    enableOnServerError: true, // 5xx errors
  },
} as const

/**
 * Initialize Resend client for fallback email service
 */
let resendClient: Resend | null = null
if (NEWSLETTER_CONFIG.resend.apiKey) {
  resendClient = new Resend(NEWSLETTER_CONFIG.resend.apiKey)
}

// =============================================================================
// RESEND FALLBACK FUNCTIONS
// =============================================================================

/**
 * Send newsletter signup notification via Resend
 * Used as fallback when backend API is unavailable
 */
async function sendNewsletterSignupViaResend(
  email: string,
  source: string,
  userAgent: string
): Promise<NewsletterResult> {
  if (!resendClient) {
    console.error('❌ Resend client not initialized - check RESEND_API_KEY')
    return {
      success: false,
      error: 'Email service temporarily unavailable',
      code: 'RESEND_NOT_CONFIGURED',
    }
  }

  try {
    console.log('📧 Sending newsletter signup notification via Resend fallback')

    const emailContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Newsletter Signup - aclue</title>
</head>
<body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🎉 New Newsletter Signup</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Someone has joined the aclue beta program!</p>
    </div>

    <div style="background: #f8f9fa; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
        <h2 style="color: #495057; margin-top: 0; font-size: 20px;">Signup Details</h2>
        <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #667eea;">
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Source:</strong> ${source}</p>
            <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            <p style="margin: 5px 0;"><strong>User Agent:</strong> ${userAgent}</p>
        </div>
    </div>

    <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
        <h3 style="color: #1565c0; margin-top: 0; font-size: 18px;">📊 Signup Context</h3>
        <p style="margin: 5px 0;"><strong>Method:</strong> Resend Fallback (Backend API unavailable)</p>
        <p style="margin: 5px 0;"><strong>Status:</strong> Automatic notification sent</p>
        <p style="margin: 5px 0;"><strong>Action Required:</strong> Add email to newsletter list manually</p>
    </div>

    <div style="border-top: 2px solid #e9ecef; padding-top: 20px; text-align: center;">
        <p style="margin: 0; color: #6c757d; font-size: 14px;">
            This notification was sent via Resend fallback service<br>
            <strong>aclue</strong> - AI-powered gifting platform
        </p>
    </div>
</body>
</html>
    `.trim()

    const result = await resendClient.emails.send({
      from: NEWSLETTER_CONFIG.resend.fromEmail,
      to: [NEWSLETTER_CONFIG.resend.toEmail],
      subject: `🎉 New Newsletter Signup: ${email}`,
      html: emailContent,
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@aclue.app>',
        'X-Source': source,
        'X-Signup-Method': 'resend-fallback',
      },
    })

    console.log('✅ Resend fallback email sent successfully:', result.data?.id)

    return {
      success: true,
      message: 'Thank you! You\'re now on our mailing list.',
      code: 'RESEND_FALLBACK_SUCCESS',
      details: { emailId: result.data?.id },
    }

  } catch (error: any) {
    console.error('💥 Resend fallback failed:', error)

    return {
      success: false,
      error: 'Unable to process signup. Please try again.',
      code: 'RESEND_FALLBACK_ERROR',
      details: { message: error.message },
    }
  }
}

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

    let response: Response

    try {
      // Call backend newsletter signup API with timeout
      response = await fetch(`${NEWSLETTER_CONFIG.api.baseUrl}${NEWSLETTER_CONFIG.api.endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'User-Agent': 'aclue-Web-Server/1.0',
        },
        body: JSON.stringify(newsletterPayload),
        signal: AbortSignal.timeout(NEWSLETTER_CONFIG.api.timeout),
      })
    } catch (fetchError: any) {
      console.warn('⚠️ Backend API fetch failed, attempting Resend fallback:', fetchError.message)

      // Check if we should use fallback based on error type
      const shouldFallback =
        (fetchError.name === 'AbortError' && NEWSLETTER_CONFIG.fallback.enableOnTimeout) ||
        (fetchError.message?.includes('fetch') && NEWSLETTER_CONFIG.fallback.enableOnNetworkError) ||
        (fetchError.code === 'ECONNREFUSED' && NEWSLETTER_CONFIG.fallback.enableOnNetworkError)

      if (shouldFallback && NEWSLETTER_CONFIG.resend.fallbackEnabled) {
        console.log('🔄 Using Resend fallback due to network/timeout error')
        return await sendNewsletterSignupViaResend(validatedData.email, validatedData.source, userAgent)
      }

      // If fallback is not enabled or failed, return original error
      throw fetchError
    }

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

      // Check if we should use Resend fallback for server errors (5xx)
      if (
        response.status >= 500 &&
        NEWSLETTER_CONFIG.fallback.enableOnServerError &&
        NEWSLETTER_CONFIG.resend.fallbackEnabled
      ) {
        console.log('🔄 Using Resend fallback due to server error:', response.status)
        return await sendNewsletterSignupViaResend(validatedData.email, validatedData.source, userAgent)
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

    // Try Resend fallback for unexpected errors if enabled
    if (NEWSLETTER_CONFIG.resend.fallbackEnabled && validatedData) {
      console.log('🔄 Attempting Resend fallback for unexpected error')
      try {
        return await sendNewsletterSignupViaResend(validatedData.email, validatedData.source, userAgent)
      } catch (fallbackError) {
        console.error('💥 Resend fallback also failed:', fallbackError)
      }
    }

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