import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import WelcomeEmail from '@/components/emails/WelcomeEmail'

/**
 * Newsletter Signup API Route - Frontend-Only Resend Implementation
 *
 * Clean frontend-only implementation following official Resend Next.js App Router patterns.
 * This route handles newsletter signups using Resend directly from the Next.js frontend,
 * eliminating backend dependencies for improved reliability and performance.
 *
 * Official Pattern Reference:
 * https://resend.com/docs/send-with-nextjs
 * https://github.com/resend/resend-nextjs-app-router-example
 *
 * Features:
 * - Direct Resend SDK integration using official patterns
 * - React email templates with aclue branding
 * - Input validation with Zod
 * - Comprehensive error handling
 * - Source tracking for analytics
 * - British English content and responses
 * - Admin notifications
 * - Production-ready implementation
 */

// Initialize Resend client following official pattern
const resend = new Resend(process.env.RESEND_API_KEY)

// Input validation schema with enhanced validation
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(320, 'Email address is too long')
    .transform(email => email.toLowerCase().trim()),
  source: z.string().optional().default('frontend_api_route'),
  marketing_consent: z.boolean().optional().default(true),
})

/**
 * POST /api/send
 *
 * Handles newsletter signup requests with frontend-only Resend integration.
 * Sends welcome email using React email template and admin notification.
 *
 * Following official Resend Next.js App Router patterns:
 * - Uses Resend SDK directly in API route
 * - Implements proper error handling
 * - Returns standardised JSON responses
 * - Uses React email templates
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Newsletter signup API route called (frontend-only)')

    // Check if Resend API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.error('❌ RESEND_API_KEY not configured')
      return NextResponse.json(
        {
          success: false,
          error: 'Email service not configured. Please try again later.',
          code: 'CONFIGURATION_ERROR'
        },
        { status: 500 }
      )
    }

    // Parse and validate request body
    const body = await request.json()
    console.log('📋 Newsletter signup data:', {
      email: body.email,
      source: body.source || 'frontend_api_route'
    })

    const validationResult = newsletterSchema.safeParse(body)

    if (!validationResult.success) {
      console.error('❌ Newsletter validation failed:', validationResult.error.errors)
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid email address format',
          code: 'VALIDATION_ERROR',
          details: validationResult.error.errors,
        },
        { status: 400 }
      )
    }

    const { email, source, marketing_consent } = validationResult.data

    // Get user agent and timestamp for tracking
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const timestamp = new Date().toISOString()

    console.log('🌐 Sending welcome email via Resend to:', email)

    try {
      // Send welcome email using React template (following official pattern)
      const { data: emailData, error: emailError } = await resend.emails.send({
        from: 'aclue <noreply@aclue.app>',
        to: [email],
        subject: 'Welcome to aclue - AI-Powered Gift Discovery! 🎁',
        react: WelcomeEmail({
          email,
          source
        }),
        // Headers for better email management
        headers: {
          'List-Unsubscribe': '<mailto:unsubscribe@aclue.app>',
          'X-Source': source,
          'X-Signup-Method': 'frontend-api-route',
          'X-Marketing-Consent': marketing_consent.toString(),
        },
      })

      if (emailError) {
        console.error('❌ Resend welcome email failed:', emailError)
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to send welcome email. Please try again.',
            code: 'EMAIL_SEND_ERROR',
            details: emailError,
          },
          { status: 500 }
        )
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
                <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Frontend-only implementation via Resend</p>
              </div>

              <div style="background: white; padding: 25px; border-radius: 8px; margin-bottom: 25px; border-left: 4px solid #3b82f6;">
                <h2 style="color: #1f2937; margin-top: 0; font-size: 20px;">Signup Details</h2>
                <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
                <p style="margin: 5px 0;"><strong>Source:</strong> ${source}</p>
                <p style="margin: 5px 0;"><strong>Timestamp:</strong> ${timestamp}</p>
                <p style="margin: 5px 0;"><strong>User Agent:</strong> ${userAgent}</p>
                <p style="margin: 5px 0;"><strong>Marketing Consent:</strong> ${marketing_consent ? 'Yes' : 'No'}</p>
                <p style="margin: 5px 0;"><strong>Welcome Email ID:</strong> ${emailData?.id}</p>
              </div>

              <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin-bottom: 25px;">
                <h3 style="color: #1565c0; margin-top: 0; font-size: 18px;">📊 Implementation Details</h3>
                <p style="margin: 5px 0;"><strong>Method:</strong> Frontend-only API route (/api/send)</p>
                <p style="margin: 5px 0;"><strong>Service:</strong> Direct Resend integration</p>
                <p style="margin: 5px 0;"><strong>Template:</strong> React Email component</p>
                <p style="margin: 5px 0;"><strong>Status:</strong> Fully operational</p>
              </div>

              <div style="border-top: 2px solid #e9ecef; padding-top: 20px; text-align: center;">
                <p style="margin: 0; color: #6c757d; font-size: 14px;">
                  This notification was sent via frontend Resend integration<br>
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
          // Don't fail the main request if admin notification fails
        } else {
          console.log('✅ Admin notification sent successfully')
        }
      } catch (adminError) {
        console.warn('⚠️ Admin notification error (non-critical):', adminError)
        // Don't fail the main request if admin notification fails
      }

      // Return success response following official patterns
      return NextResponse.json(
        {
          success: true,
          message: "Thank you! You're now on our mailing list and will be among the first to experience our AI-powered gift discovery platform.",
          code: 'SIGNUP_SUCCESS',
          data: {
            email,
            source,
            timestamp,
            emailId: emailData?.id,
            marketing_consent,
          },
        },
        { status: 200 }
      )

    } catch (resendError: any) {
      console.error('💥 Resend API error:', resendError)

      return NextResponse.json(
        {
          success: false,
          error: 'Failed to send welcome email. Please try again.',
          code: 'RESEND_API_ERROR',
          details: process.env.NODE_ENV === 'development' ? resendError.message : undefined,
        },
        { status: 500 }
      )
    }

  } catch (error: any) {
    console.error('💥 Newsletter signup error:', error)

    // Enhanced error classification
    if (error.name === 'SyntaxError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid request format',
          code: 'INVALID_JSON',
        },
        { status: 400 }
      )
    }

    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred. Please try again.',
        code: 'UNKNOWN_ERROR',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/send
 *
 * Returns information about the newsletter signup endpoint.
 * Useful for health checks and documentation.
 * Following official Resend patterns for API route documentation.
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/send',
      method: 'POST',
      description: 'Frontend-only newsletter signup with direct Resend integration',
      version: '2.0.0',
      status: 'operational',
      provider: 'Resend',
      implementation: 'Frontend-only (Next.js App Router)',
      features: [
        'Direct Resend SDK integration',
        'React email templates',
        'Input validation with Zod',
        'Admin notifications',
        'Source tracking',
        'Error handling',
        'British English content',
      ],
      pattern: 'Official Next.js App Router implementation',
      reference: [
        'https://resend.com/docs/send-with-nextjs',
        'https://github.com/resend/resend-nextjs-app-router-example'
      ],
    },
    { status: 200 }
  )
}