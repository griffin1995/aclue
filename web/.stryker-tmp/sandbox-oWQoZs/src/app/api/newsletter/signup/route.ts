// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';
import WelcomeEmail from '@/components/emails/WelcomeEmail';

/**
 * Newsletter Signup API Route - Direct Resend Integration
 * 
 * This API route handles newsletter signups using Resend directly from Next.js,
 * bypassing the FastAPI backend for improved reliability and performance.
 * 
 * Features:
 * - Direct Resend SDK integration
 * - React email templates with aclue branding
 * - Input validation with Zod
 * - Comprehensive error handling
 * - Source tracking for analytics
 * - British English content and responses
 * 
 * Based on official Resend documentation patterns:
 * https://resend.com/docs/send-with-nextjs
 */

// Initialize Resend client
const resend = new Resend(process.env.RESEND_API_KEY);

// Input validation schema
const newsletterSchema = z.object(stryMutAct_9fa48("2412") ? {} : (stryCov_9fa48("2412"), {
  email: stryMutAct_9fa48("2414") ? z.string().max(1, 'Email is required').email('Please enter a valid email address').max(320, 'Email address is too long').transform(email => email.toLowerCase().trim()) : stryMutAct_9fa48("2413") ? z.string().min(1, 'Email is required').email('Please enter a valid email address').min(320, 'Email address is too long').transform(email => email.toLowerCase().trim()) : (stryCov_9fa48("2413", "2414"), z.string().min(1, stryMutAct_9fa48("2415") ? "" : (stryCov_9fa48("2415"), 'Email is required')).email(stryMutAct_9fa48("2416") ? "" : (stryCov_9fa48("2416"), 'Please enter a valid email address')).max(320, stryMutAct_9fa48("2417") ? "" : (stryCov_9fa48("2417"), 'Email address is too long')).transform(stryMutAct_9fa48("2418") ? () => undefined : (stryCov_9fa48("2418"), email => stryMutAct_9fa48("2420") ? email.toUpperCase().trim() : stryMutAct_9fa48("2419") ? email.toLowerCase() : (stryCov_9fa48("2419", "2420"), email.toLowerCase().trim())))),
  source: z.string().optional().default(stryMutAct_9fa48("2421") ? "" : (stryCov_9fa48("2421"), 'maintenance_page_direct'))
}));

/**
 * POST /api/newsletter/signup
 * 
 * Handles newsletter signup requests with direct Resend integration.
 * Sends welcome email using React email template.
 */
export async function POST(request: NextRequest) {
  if (stryMutAct_9fa48("2422")) {
    {}
  } else {
    stryCov_9fa48("2422");
    try {
      if (stryMutAct_9fa48("2423")) {
        {}
      } else {
        stryCov_9fa48("2423");
        console.log(stryMutAct_9fa48("2424") ? "" : (stryCov_9fa48("2424"), '📧 Newsletter signup API route called'));

        // Check if Resend API key is configured
        if (stryMutAct_9fa48("2427") ? false : stryMutAct_9fa48("2426") ? true : stryMutAct_9fa48("2425") ? process.env.RESEND_API_KEY : (stryCov_9fa48("2425", "2426", "2427"), !process.env.RESEND_API_KEY)) {
          if (stryMutAct_9fa48("2428")) {
            {}
          } else {
            stryCov_9fa48("2428");
            console.error(stryMutAct_9fa48("2429") ? "" : (stryCov_9fa48("2429"), '❌ RESEND_API_KEY not configured'));
            return NextResponse.json(stryMutAct_9fa48("2430") ? {} : (stryCov_9fa48("2430"), {
              success: stryMutAct_9fa48("2431") ? true : (stryCov_9fa48("2431"), false),
              error: stryMutAct_9fa48("2432") ? "" : (stryCov_9fa48("2432"), 'Email service not configured. Please try again later.'),
              code: stryMutAct_9fa48("2433") ? "" : (stryCov_9fa48("2433"), 'CONFIGURATION_ERROR')
            }), stryMutAct_9fa48("2434") ? {} : (stryCov_9fa48("2434"), {
              status: 500
            }));
          }
        }

        // Parse and validate request body
        const body = await request.json();
        console.log(stryMutAct_9fa48("2435") ? "" : (stryCov_9fa48("2435"), '📋 Newsletter signup data:'), stryMutAct_9fa48("2436") ? {} : (stryCov_9fa48("2436"), {
          email: body.email,
          source: body.source
        }));
        const validationResult = newsletterSchema.safeParse(body);
        if (stryMutAct_9fa48("2439") ? false : stryMutAct_9fa48("2438") ? true : stryMutAct_9fa48("2437") ? validationResult.success : (stryCov_9fa48("2437", "2438", "2439"), !validationResult.success)) {
          if (stryMutAct_9fa48("2440")) {
            {}
          } else {
            stryCov_9fa48("2440");
            console.error(stryMutAct_9fa48("2441") ? "" : (stryCov_9fa48("2441"), '❌ Newsletter validation failed:'), validationResult.error.errors);
            return NextResponse.json(stryMutAct_9fa48("2442") ? {} : (stryCov_9fa48("2442"), {
              success: stryMutAct_9fa48("2443") ? true : (stryCov_9fa48("2443"), false),
              error: stryMutAct_9fa48("2444") ? "" : (stryCov_9fa48("2444"), 'Invalid email address format'),
              code: stryMutAct_9fa48("2445") ? "" : (stryCov_9fa48("2445"), 'VALIDATION_ERROR'),
              details: validationResult.error.errors
            }), stryMutAct_9fa48("2446") ? {} : (stryCov_9fa48("2446"), {
              status: 400
            }));
          }
        }
        const {
          email,
          source
        } = validationResult.data;

        // Get user agent for tracking
        const userAgent = stryMutAct_9fa48("2449") ? request.headers.get('user-agent') && 'Unknown' : stryMutAct_9fa48("2448") ? false : stryMutAct_9fa48("2447") ? true : (stryCov_9fa48("2447", "2448", "2449"), request.headers.get(stryMutAct_9fa48("2450") ? "" : (stryCov_9fa48("2450"), 'user-agent')) || (stryMutAct_9fa48("2451") ? "" : (stryCov_9fa48("2451"), 'Unknown')));
        console.log(stryMutAct_9fa48("2452") ? "" : (stryCov_9fa48("2452"), '🌐 Sending welcome email via Resend to:'), email);

        // Send welcome email using Resend
        const {
          data: emailData,
          error: emailError
        } = await resend.emails.send(stryMutAct_9fa48("2453") ? {} : (stryCov_9fa48("2453"), {
          from: stryMutAct_9fa48("2454") ? "" : (stryCov_9fa48("2454"), 'aclue <noreply@aclue.app>'),
          to: stryMutAct_9fa48("2455") ? [] : (stryCov_9fa48("2455"), [email]),
          subject: stryMutAct_9fa48("2456") ? "" : (stryCov_9fa48("2456"), 'Welcome to aclue - AI-Powered Gift Discovery! 🎁'),
          react: WelcomeEmail(stryMutAct_9fa48("2457") ? {} : (stryCov_9fa48("2457"), {
            email,
            source
          })),
          // Also provide HTML fallback for email clients that don't support React
          html: stryMutAct_9fa48("2458") ? `` : (stryCov_9fa48("2458"), `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); color: white; padding: 30px; text-align: center;">
            <h2>Welcome to aclue! 🚀</h2>
            <p>AI-Powered Gift Discovery</p>
          </div>
          <div style="padding: 30px; background: #f8fafc;">
            <h3>Thank you for joining our community!</h3>
            <p>You're among the first to experience how AI can revolutionise gift-giving.</p>
            <p>We'll keep you updated on our progress and notify you when our AI is ready to transform your gift-giving experience.</p>
            <p>Excited to have you on board,<br>The aclue Team</p>
          </div>
        </div>
      `)
        }));
        if (stryMutAct_9fa48("2460") ? false : stryMutAct_9fa48("2459") ? true : (stryCov_9fa48("2459", "2460"), emailError)) {
          if (stryMutAct_9fa48("2461")) {
            {}
          } else {
            stryCov_9fa48("2461");
            console.error(stryMutAct_9fa48("2462") ? "" : (stryCov_9fa48("2462"), '❌ Resend email sending failed:'), emailError);
            return NextResponse.json(stryMutAct_9fa48("2463") ? {} : (stryCov_9fa48("2463"), {
              success: stryMutAct_9fa48("2464") ? true : (stryCov_9fa48("2464"), false),
              error: stryMutAct_9fa48("2465") ? "" : (stryCov_9fa48("2465"), 'Failed to send welcome email. Please try again.'),
              code: stryMutAct_9fa48("2466") ? "" : (stryCov_9fa48("2466"), 'EMAIL_SEND_ERROR'),
              details: emailError
            }), stryMutAct_9fa48("2467") ? {} : (stryCov_9fa48("2467"), {
              status: 500
            }));
          }
        }
        console.log(stryMutAct_9fa48("2468") ? "" : (stryCov_9fa48("2468"), '✅ Welcome email sent successfully:'), emailData);

        // Optional: Store subscriber in database
        // This could be added later if local storage is needed
        // await storeNewsletterSubscriber(email, source, userAgent)

        // Send admin notification (optional)
        try {
          if (stryMutAct_9fa48("2469")) {
            {}
          } else {
            stryCov_9fa48("2469");
            const {
              error: adminEmailError
            } = await resend.emails.send(stryMutAct_9fa48("2470") ? {} : (stryCov_9fa48("2470"), {
              from: stryMutAct_9fa48("2471") ? "" : (stryCov_9fa48("2471"), 'aclue <noreply@aclue.app>'),
              to: stryMutAct_9fa48("2472") ? [] : (stryCov_9fa48("2472"), [stryMutAct_9fa48("2473") ? "" : (stryCov_9fa48("2473"), 'contact@aclue.app')]),
              subject: stryMutAct_9fa48("2474") ? `` : (stryCov_9fa48("2474"), `New Newsletter Signup: ${email}`),
              html: stryMutAct_9fa48("2475") ? `` : (stryCov_9fa48("2475"), `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: #1f2937; color: white; padding: 20px; text-align: center;">
              <h2>🎉 New Newsletter Signup - aclue</h2>
            </div>
            <div style="padding: 20px; background: #f9fafb;">
              <p>A new user has signed up for the aclue newsletter!</p>
              <div style="background: white; padding: 15px; border-left: 4px solid #3b82f6; margin: 15px 0;">
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Source:</strong> ${source}</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
                <p><strong>User Agent:</strong> ${userAgent}</p>
              </div>
              <p>The subscriber has been automatically sent a welcome email.</p>
            </div>
          </div>
        `)
            }));
            if (stryMutAct_9fa48("2477") ? false : stryMutAct_9fa48("2476") ? true : (stryCov_9fa48("2476", "2477"), adminEmailError)) {
              if (stryMutAct_9fa48("2478")) {
                {}
              } else {
                stryCov_9fa48("2478");
                console.warn(stryMutAct_9fa48("2479") ? "" : (stryCov_9fa48("2479"), '⚠️ Admin notification failed:'), adminEmailError);
                // Don't fail the main request if admin notification fails
              }
            } else {
              if (stryMutAct_9fa48("2480")) {
                {}
              } else {
                stryCov_9fa48("2480");
                console.log(stryMutAct_9fa48("2481") ? "" : (stryCov_9fa48("2481"), '✅ Admin notification sent successfully'));
              }
            }
          }
        } catch (adminError) {
          if (stryMutAct_9fa48("2482")) {
            {}
          } else {
            stryCov_9fa48("2482");
            console.warn(stryMutAct_9fa48("2483") ? "" : (stryCov_9fa48("2483"), '⚠️ Admin notification error:'), adminError);
            // Don't fail the main request if admin notification fails
          }
        }

        // Return success response
        return NextResponse.json(stryMutAct_9fa48("2484") ? {} : (stryCov_9fa48("2484"), {
          success: stryMutAct_9fa48("2485") ? false : (stryCov_9fa48("2485"), true),
          message: stryMutAct_9fa48("2486") ? "" : (stryCov_9fa48("2486"), "Thank you! You're now on our mailing list and will be among the first to experience our AI-powered gift discovery platform."),
          code: stryMutAct_9fa48("2487") ? "" : (stryCov_9fa48("2487"), 'SIGNUP_SUCCESS'),
          data: stryMutAct_9fa48("2488") ? {} : (stryCov_9fa48("2488"), {
            email,
            source,
            timestamp: new Date().toISOString()
          })
        }), stryMutAct_9fa48("2489") ? {} : (stryCov_9fa48("2489"), {
          status: 200
        }));
      }
    } catch (error: any) {
      if (stryMutAct_9fa48("2490")) {
        {}
      } else {
        stryCov_9fa48("2490");
        console.error(stryMutAct_9fa48("2491") ? "" : (stryCov_9fa48("2491"), '💥 Newsletter signup error:'), error);

        // Enhanced error classification
        if (stryMutAct_9fa48("2494") ? error.name !== 'SyntaxError' : stryMutAct_9fa48("2493") ? false : stryMutAct_9fa48("2492") ? true : (stryCov_9fa48("2492", "2493", "2494"), error.name === (stryMutAct_9fa48("2495") ? "" : (stryCov_9fa48("2495"), 'SyntaxError')))) {
          if (stryMutAct_9fa48("2496")) {
            {}
          } else {
            stryCov_9fa48("2496");
            return NextResponse.json(stryMutAct_9fa48("2497") ? {} : (stryCov_9fa48("2497"), {
              success: stryMutAct_9fa48("2498") ? true : (stryCov_9fa48("2498"), false),
              error: stryMutAct_9fa48("2499") ? "" : (stryCov_9fa48("2499"), 'Invalid request format'),
              code: stryMutAct_9fa48("2500") ? "" : (stryCov_9fa48("2500"), 'INVALID_JSON')
            }), stryMutAct_9fa48("2501") ? {} : (stryCov_9fa48("2501"), {
              status: 400
            }));
          }
        }
        return NextResponse.json(stryMutAct_9fa48("2502") ? {} : (stryCov_9fa48("2502"), {
          success: stryMutAct_9fa48("2503") ? true : (stryCov_9fa48("2503"), false),
          error: stryMutAct_9fa48("2504") ? "" : (stryCov_9fa48("2504"), 'An unexpected error occurred. Please try again.'),
          code: stryMutAct_9fa48("2505") ? "" : (stryCov_9fa48("2505"), 'UNKNOWN_ERROR'),
          details: (stryMutAct_9fa48("2508") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("2507") ? false : stryMutAct_9fa48("2506") ? true : (stryCov_9fa48("2506", "2507", "2508"), process.env.NODE_ENV === (stryMutAct_9fa48("2509") ? "" : (stryCov_9fa48("2509"), 'development')))) ? error.message : undefined
        }), stryMutAct_9fa48("2510") ? {} : (stryCov_9fa48("2510"), {
          status: 500
        }));
      }
    }
  }
}

/**
 * GET /api/newsletter/signup
 * 
 * Returns information about the newsletter signup endpoint.
 * Useful for health checks and documentation.
 */
export async function GET() {
  if (stryMutAct_9fa48("2511")) {
    {}
  } else {
    stryCov_9fa48("2511");
    return NextResponse.json(stryMutAct_9fa48("2512") ? {} : (stryCov_9fa48("2512"), {
      endpoint: stryMutAct_9fa48("2513") ? "" : (stryCov_9fa48("2513"), '/api/newsletter/signup'),
      method: stryMutAct_9fa48("2514") ? "" : (stryCov_9fa48("2514"), 'POST'),
      description: stryMutAct_9fa48("2515") ? "" : (stryCov_9fa48("2515"), 'Newsletter signup with direct Resend integration'),
      version: stryMutAct_9fa48("2516") ? "" : (stryCov_9fa48("2516"), '1.0.0'),
      status: stryMutAct_9fa48("2517") ? "" : (stryCov_9fa48("2517"), 'operational'),
      provider: stryMutAct_9fa48("2518") ? "" : (stryCov_9fa48("2518"), 'Resend'),
      features: stryMutAct_9fa48("2519") ? [] : (stryCov_9fa48("2519"), [stryMutAct_9fa48("2520") ? "" : (stryCov_9fa48("2520"), 'Direct Resend SDK integration'), stryMutAct_9fa48("2521") ? "" : (stryCov_9fa48("2521"), 'React email templates'), stryMutAct_9fa48("2522") ? "" : (stryCov_9fa48("2522"), 'Input validation with Zod'), stryMutAct_9fa48("2523") ? "" : (stryCov_9fa48("2523"), 'Admin notifications'), stryMutAct_9fa48("2524") ? "" : (stryCov_9fa48("2524"), 'Source tracking')])
    }), stryMutAct_9fa48("2525") ? {} : (stryCov_9fa48("2525"), {
      status: 200
    }));
  }
}