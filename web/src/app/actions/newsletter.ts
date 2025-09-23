'use server'

import { z } from 'zod'

/**
 * Newsletter Server Actions - Direct Resend Implementation
 *
 * Optimised server action with direct Resend integration, eliminating
 * external API calls for maximum reliability and performance.
 *
 * Features:
 * - Server-side form processing with Zod validation
 * - Direct Resend SDK integration (no external API calls)
 * - Enhanced error handling and logging
 * - User agent and source tracking
 * - GDPR-compliant data handling
 * - Production-ready reliability
 * - React email templates with aclue branding
 *
 * Implementation:
 * - Direct function calls within server action
 * - No network overhead or self-referential requests
 * - Optimal performance and reliability
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
 * Direct email sending function (bypasses external API call)
 * Uses Resend directly from server action for better reliability
 */
async function sendNewsletterEmailDirect(
  email: string,
  source: string,
  marketingConsent: boolean
): Promise<NewsletterResult> {
  try {
    console.log('📧 Sending newsletter email directly via Resend')

    // Import Resend and components
    const { Resend } = await import('resend')
    const WelcomeEmail = (await import('@/components/emails/WelcomeEmail')).default

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured in server action')
      return {
        success: false,
        error: 'Email service not configured. Please try again later.',
        code: 'CONFIGURATION_ERROR'
      }
    }

    // Initialize Resend client
    const resend = new Resend(process.env.RESEND_API_KEY)
    const timestamp = new Date().toISOString()

    console.log('🌐 Sending welcome email via Resend to:', email)

    // Send welcome email using React template
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'aclue <noreply@aclue.app>',
      to: [email],
      subject: 'Welcome to aclue - AI-Powered Gift Discovery! 🎁',
      react: WelcomeEmail({
        email,
        source
      }),
      headers: {
        'List-Unsubscribe': '<mailto:unsubscribe@aclue.app>',
        'X-Source': source,
        'X-Signup-Method': 'server-action-direct',
        'X-Marketing-Consent': marketingConsent.toString(),
      },
    })

    if (emailError) {
      console.error('❌ Resend welcome email failed:', emailError)
      return {
        success: false,
        error: 'Failed to send welcome email. Please try again.',
        code: 'EMAIL_SEND_ERROR',
        details: emailError,
      }
    }

    console.log('✅ Welcome email sent successfully:', emailData?.id)

    // Send admin notification (optional - don't fail main request if this fails)
    try {
      const { error: adminEmailError } = await resend.emails.send({
        from: 'aclue <noreply@aclue.app>',
        to: ['contact@aclue.app'],
        subject: `🎉 New Newsletter Signup: ${email}`,
        html: `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 20px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
              <h1 style="margin: 0; font-size: 28px; font-weight: 600;">🎉 New Newsletter Signup</h1>
              <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Server action direct implementation</p>
            </div>

            <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
              <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Signup Details</h2>
              <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
              <p style="margin: 5px 0;"><strong>Source:</strong> ${source}</p>
              <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
              <p style="margin: 5px 0;"><strong>Marketing Consent:</strong> ${marketingConsent ? 'Yes' : 'No'}</p>
              <p style="margin: 5px 0;"><strong>Welcome Email ID:</strong> ${emailData?.id}</p>
            </div>

            <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
              <h3 style="color: #1565c0; margin-top: 0; font-size: 18px;">📊 Implementation Details</h3>
              <p style="margin: 5px 0;"><strong>Method:</strong> Server action direct (no external API call)</p>
              <p style="margin: 5px 0;"><strong>Service:</strong> Direct Resend integration</p>
              <p style="margin: 5px 0;"><strong>Template:</strong> React Email component</p>
              <p style="margin: 5px 0;"><strong>Status:</strong> Fully operational</p>
            </div>

            <div style="border-top: 2px solid #e9ecef; padding-top: 20px; text-align: center;">
              <p style="margin: 0; color: #6c757d; font-size: 14px;">
                This notification was sent via server action direct integration<br>
                <strong>aclue</strong> - AI-powered gifting platform
              </p>
            </div>
          </div>
        `,
        headers: {
          'X-Notification-Type': 'admin-newsletter-signup',
          'X-Source': source,
        },
      })

      if (adminEmailError) {
        console.warn('⚠️ Admin notification failed (non-critical):', adminEmailError)
      } else {
        console.log('✅ Admin notification sent successfully')
      }
    } catch (adminError) {
      console.warn('⚠️ Admin notification error (non-critical):', adminError)
    }

    return {
      success: true,
      message: "Thank you! You're now on our mailing list and will be among the first to experience our AI-powered gift discovery platform.",
      code: 'DIRECT_SUCCESS',
      details: {
        email,
        source,
        timestamp,
        emailId: emailData?.id,
        marketing_consent: marketingConsent,
      },
    }

  } catch (error: any) {
    console.error('💥 Direct email sending failed:', error)

    return {
      success: false,
      error: 'Failed to send welcome email. Please try again.',
      code: 'DIRECT_EMAIL_ERROR',
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
  console.log('📧 Newsletter signup server action started (direct Resend integration)')

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

    // Send email directly using Resend (no external API call)
    return await sendNewsletterEmailDirect(
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
 * Uses direct Resend integration (no external API calls)
 * @param email - Email address to subscribe
 * @param source - Source of the signup (default: 'direct')
 */
export async function subscribeEmailAction(
  email: string,
  source: string = 'direct_api'
): Promise<NewsletterResult> {
  console.log('📧 Direct email subscription started (direct Resend):', email)

  const formData = new FormData()
  formData.append('email', email)
  formData.append('source', source)
  formData.append('marketing_consent', 'true')

  return newsletterSignupAction(formData)
}