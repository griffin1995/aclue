import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { z } from 'zod'
import WelcomeEmail from '@/components/emails/WelcomeEmail'

/**
 * Newsletter Signup API Route - Direct Resend Integration
 * 
 * This API route handles newsletter signups using Resend directly from Next.js,
 * bypassing the FastAPI backend for improved reliability and performance.
 * 
 * Features:
 * - Direct Resend SDK integration
 * - React email templates with Aclue branding
 * - Input validation with Zod
 * - Comprehensive error handling
 * - Source tracking for analytics
 * - British English content and responses
 * 
 * Based on official Resend documentation patterns:
 * https://resend.com/docs/send-with-nextjs
 */

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY)

// Input validation schema
const newsletterSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(320, 'Email address is too long')
    .transform(email => email.toLowerCase().trim()),
  source: z.string().optional().default('maintenance_page_direct'),
})

/**
 * POST /api/newsletter/signup
 * 
 * Handles newsletter signup requests with direct Resend integration.
 * Sends welcome email using React email template.
 */
export async function POST(request: NextRequest) {
  try {
    console.log('📧 Newsletter signup API route called')

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
    console.log('📋 Newsletter signup data:', { email: body.email, source: body.source })

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

    const { email, source } = validationResult.data

    // Get user agent for tracking
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    
    console.log('🌐 Sending welcome email via Resend to:', email)

    // Send welcome email using Resend
    const { data: emailData, error: emailError } = await resend.emails.send({
      from: 'Aclue <noreply@aclue.app>',
      to: [email],
      subject: 'Welcome to Aclue - AI-Powered Gift Discovery! 🎁',
      react: WelcomeEmail({ email, source }),
      // Also provide HTML fallback for email clients that don't support React
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center;">
            <h2>Welcome to Aclue! 🚀</h2>
            <p>AI-Powered Gift Discovery</p>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h3>Thank you for joining our community!</h3>
            <p>You're among the first to experience how AI can revolutionise gift-giving.</p>
            <p>We'll keep you updated on our progress and notify you when our AI is ready to transform your gift-giving experience.</p>
            <p>Excited to have you on board,<br>The Aclue Team</p>
          </div>
        </div>
      `,
    })

    if (emailError) {
      console.error('❌ Resend email sending failed:', emailError)
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

    console.log('✅ Welcome email sent successfully:', emailData)

    // Optional: Store subscriber in database
    // This could be added later if local storage is needed
    // await storeNewsletterSubscriber(email, source, userAgent)

    // Send admin notification (optional)
    try {
      const { error: adminEmailError } = await resend.emails.send({
        from: 'Aclue <noreply@aclue.app>',
        to: ['contact@aclue.app'],
        subject: `New Newsletter Signup: ${email}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
              <h2>🎉 New Newsletter Signup - Aclue</h2>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <p>A new user has signed up for the Aclue newsletter!</p>
              <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Source:</strong> ${source}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p><strong>User Agent:</strong> ${userAgent}</p>
              </div>
              <p>The subscriber has been automatically sent a welcome email.</p>
            </div>
          </div>
        `,
      })

      if (adminEmailError) {
        console.warn('⚠️ Admin notification failed:', adminEmailError)
        // Don't fail the main request if admin notification fails
      } else {
        console.log('✅ Admin notification sent successfully')
      }
    } catch (adminError) {
      console.warn('⚠️ Admin notification error:', adminError)
      // Don't fail the main request if admin notification fails
    }

    // Return success response
    return NextResponse.json(
      {
        success: true,
        message: "Thank you! You're now on our mailing list and will be among the first to experience our AI-powered gift discovery platform.",
        code: 'SIGNUP_SUCCESS',
        data: {
          email,
          source,
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    )

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
 * GET /api/newsletter/signup
 * 
 * Returns information about the newsletter signup endpoint.
 * Useful for health checks and documentation.
 */
export async function GET() {
  return NextResponse.json(
    {
      endpoint: '/api/newsletter/signup',
      method: 'POST',
      description: 'Newsletter signup with direct Resend integration',
      version: '1.0.0',
      status: 'operational',
      provider: 'Resend',
      features: [
        'Direct Resend SDK integration',
        'React email templates',
        'Input validation with Zod',
        'Admin notifications',
        'Source tracking',
      ],
    },
    { status: 200 }
  )
}