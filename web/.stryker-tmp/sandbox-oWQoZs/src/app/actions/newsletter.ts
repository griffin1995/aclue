// @ts-nocheck
'use server';

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
import { z } from 'zod';
import { headers } from 'next/headers';

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
const newsletterSchema = z.object(stryMutAct_9fa48("1643") ? {} : (stryCov_9fa48("1643"), {
  email: stryMutAct_9fa48("1645") ? z.string().max(1, 'Email is required').email('Please enter a valid email address').max(320, 'Email address is too long').transform(email => email.toLowerCase().trim()) : stryMutAct_9fa48("1644") ? z.string().min(1, 'Email is required').email('Please enter a valid email address').min(320, 'Email address is too long').transform(email => email.toLowerCase().trim()) : (stryCov_9fa48("1644", "1645"), z.string().min(1, stryMutAct_9fa48("1646") ? "" : (stryCov_9fa48("1646"), 'Email is required')).email(stryMutAct_9fa48("1647") ? "" : (stryCov_9fa48("1647"), 'Please enter a valid email address')).max(320, stryMutAct_9fa48("1648") ? "" : (stryCov_9fa48("1648"), 'Email address is too long')).transform(stryMutAct_9fa48("1649") ? () => undefined : (stryCov_9fa48("1649"), email => stryMutAct_9fa48("1651") ? email.toUpperCase().trim() : stryMutAct_9fa48("1650") ? email.toLowerCase() : (stryCov_9fa48("1650", "1651"), email.toLowerCase().trim())))),
  source: z.string().optional().default(stryMutAct_9fa48("1652") ? "" : (stryCov_9fa48("1652"), 'app_router_page')),
  marketing_consent: z.boolean().optional().default(stryMutAct_9fa48("1653") ? false : (stryCov_9fa48("1653"), true))
}));
export type NewsletterFormData = z.infer<typeof newsletterSchema>;

/**
 * Newsletter signup result interface
 */
export interface NewsletterResult {
  success: boolean;
  error?: string;
  code?: string;
  details?: Record<string, any>;
  message?: string;
}

/**
 * API configuration for newsletter service
 */
const NEWSLETTER_CONFIG = {
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://aclue-backend-production.up.railway.app',
    timeout: 10000,
    // 10 seconds
    endpoint: '/api/v1/newsletter/signup' // Note: API uses 'signup' not 'subscribe'
  }
} as const;

// =============================================================================
// SERVER ACTIONS
// =============================================================================

/**
 * Server action for newsletter signup
 * @param formData - Form data containing email and optional fields
 */
export async function newsletterSignupAction(formData: FormData): Promise<NewsletterResult> {
  if (stryMutAct_9fa48("1654")) {
    {}
  } else {
    stryCov_9fa48("1654");
    console.log(stryMutAct_9fa48("1655") ? "" : (stryCov_9fa48("1655"), '📧 Newsletter signup server action started'));
    try {
      if (stryMutAct_9fa48("1656")) {
        {}
      } else {
        stryCov_9fa48("1656");
        // Get user agent from headers for tracking
        const headersList = headers();
        const userAgent = stryMutAct_9fa48("1659") ? headersList.get('user-agent') && 'Unknown' : stryMutAct_9fa48("1658") ? false : stryMutAct_9fa48("1657") ? true : (stryCov_9fa48("1657", "1658", "1659"), headersList.get(stryMutAct_9fa48("1660") ? "" : (stryCov_9fa48("1660"), 'user-agent')) || (stryMutAct_9fa48("1661") ? "" : (stryCov_9fa48("1661"), 'Unknown')));

        // Extract and validate form data
        const rawData = stryMutAct_9fa48("1662") ? {} : (stryCov_9fa48("1662"), {
          email: formData.get('email') as string,
          source: stryMutAct_9fa48("1665") ? formData.get('source') as string && 'app_router_page' : stryMutAct_9fa48("1664") ? false : stryMutAct_9fa48("1663") ? true : (stryCov_9fa48("1663", "1664", "1665"), formData.get('source') as string || (stryMutAct_9fa48("1666") ? "" : (stryCov_9fa48("1666"), 'app_router_page'))),
          marketing_consent: stryMutAct_9fa48("1669") ? formData.get('marketing_consent') === 'false' : stryMutAct_9fa48("1668") ? false : stryMutAct_9fa48("1667") ? true : (stryCov_9fa48("1667", "1668", "1669"), formData.get(stryMutAct_9fa48("1670") ? "" : (stryCov_9fa48("1670"), 'marketing_consent')) !== (stryMutAct_9fa48("1671") ? "" : (stryCov_9fa48("1671"), 'false'))) // Default to true
        });
        console.log(stryMutAct_9fa48("1672") ? "" : (stryCov_9fa48("1672"), '📋 Newsletter form data:'), stryMutAct_9fa48("1673") ? {} : (stryCov_9fa48("1673"), {
          email: rawData.email,
          source: rawData.source,
          marketing_consent: rawData.marketing_consent
        }));

        // Validate using Zod schema
        const validationResult = newsletterSchema.safeParse(rawData);
        if (stryMutAct_9fa48("1676") ? false : stryMutAct_9fa48("1675") ? true : stryMutAct_9fa48("1674") ? validationResult.success : (stryCov_9fa48("1674", "1675", "1676"), !validationResult.success)) {
          if (stryMutAct_9fa48("1677")) {
            {}
          } else {
            stryCov_9fa48("1677");
            console.error(stryMutAct_9fa48("1678") ? "" : (stryCov_9fa48("1678"), '❌ Newsletter validation failed:'), validationResult.error.errors);
            return stryMutAct_9fa48("1679") ? {} : (stryCov_9fa48("1679"), {
              success: stryMutAct_9fa48("1680") ? true : (stryCov_9fa48("1680"), false),
              error: stryMutAct_9fa48("1681") ? "" : (stryCov_9fa48("1681"), 'Invalid email address'),
              code: stryMutAct_9fa48("1682") ? "" : (stryCov_9fa48("1682"), 'VALIDATION_ERROR'),
              details: validationResult.error.errors
            });
          }
        }
        const validatedData = validationResult.data;

        // Prepare API payload (match existing backend expectations)
        const newsletterPayload = stryMutAct_9fa48("1683") ? {} : (stryCov_9fa48("1683"), {
          email: validatedData.email,
          source: validatedData.source,
          user_agent: userAgent,
          marketing_consent: validatedData.marketing_consent
        });
        console.log(stryMutAct_9fa48("1684") ? "" : (stryCov_9fa48("1684"), '🌐 Calling backend newsletter API:'), NEWSLETTER_CONFIG.api.baseUrl);

        // Call backend newsletter signup API
        const response = await fetch(stryMutAct_9fa48("1685") ? `` : (stryCov_9fa48("1685"), `${NEWSLETTER_CONFIG.api.baseUrl}${NEWSLETTER_CONFIG.api.endpoint}`), stryMutAct_9fa48("1686") ? {} : (stryCov_9fa48("1686"), {
          method: stryMutAct_9fa48("1687") ? "" : (stryCov_9fa48("1687"), 'POST'),
          headers: stryMutAct_9fa48("1688") ? {} : (stryCov_9fa48("1688"), {
            'Content-Type': stryMutAct_9fa48("1689") ? "" : (stryCov_9fa48("1689"), 'application/json'),
            'Accept': stryMutAct_9fa48("1690") ? "" : (stryCov_9fa48("1690"), 'application/json'),
            'User-Agent': stryMutAct_9fa48("1691") ? "" : (stryCov_9fa48("1691"), 'aclue-Web-Server/1.0')
          }),
          body: JSON.stringify(newsletterPayload)
          // Temporarily remove AbortSignal.timeout to test if this is causing the issue
          // signal: AbortSignal.timeout(NEWSLETTER_CONFIG.api.timeout),
        }));

        // Handle API response
        if (stryMutAct_9fa48("1694") ? false : stryMutAct_9fa48("1693") ? true : stryMutAct_9fa48("1692") ? response.ok : (stryCov_9fa48("1692", "1693", "1694"), !response.ok)) {
          if (stryMutAct_9fa48("1695")) {
            {}
          } else {
            stryCov_9fa48("1695");
            const errorData = await response.json().catch(stryMutAct_9fa48("1696") ? () => undefined : (stryCov_9fa48("1696"), () => stryMutAct_9fa48("1697") ? {} : (stryCov_9fa48("1697"), {
              detail: stryMutAct_9fa48("1698") ? "" : (stryCov_9fa48("1698"), 'Newsletter signup failed')
            })));
            console.error(stryMutAct_9fa48("1699") ? "" : (stryCov_9fa48("1699"), '❌ Backend newsletter signup failed:'), response.status, errorData);

            // Handle specific error cases
            if (stryMutAct_9fa48("1702") ? response.status !== 409 : stryMutAct_9fa48("1701") ? false : stryMutAct_9fa48("1700") ? true : (stryCov_9fa48("1700", "1701", "1702"), response.status === 409)) {
              if (stryMutAct_9fa48("1703")) {
                {}
              } else {
                stryCov_9fa48("1703");
                return stryMutAct_9fa48("1704") ? {} : (stryCov_9fa48("1704"), {
                  success: stryMutAct_9fa48("1705") ? false : (stryCov_9fa48("1705"), true),
                  // Show success to user for better UX (already subscribed)
                  message: stryMutAct_9fa48("1706") ? "" : (stryCov_9fa48("1706"), 'Thank you! You\'re now on our mailing list.'),
                  code: stryMutAct_9fa48("1707") ? "" : (stryCov_9fa48("1707"), 'ALREADY_SUBSCRIBED')
                });
              }
            }
            return stryMutAct_9fa48("1708") ? {} : (stryCov_9fa48("1708"), {
              success: stryMutAct_9fa48("1709") ? true : (stryCov_9fa48("1709"), false),
              error: stryMutAct_9fa48("1712") ? errorData.detail && 'Unable to process signup. Please try again.' : stryMutAct_9fa48("1711") ? false : stryMutAct_9fa48("1710") ? true : (stryCov_9fa48("1710", "1711", "1712"), errorData.detail || (stryMutAct_9fa48("1713") ? "" : (stryCov_9fa48("1713"), 'Unable to process signup. Please try again.'))),
              code: (stryMutAct_9fa48("1716") ? response.status !== 400 : stryMutAct_9fa48("1715") ? false : stryMutAct_9fa48("1714") ? true : (stryCov_9fa48("1714", "1715", "1716"), response.status === 400)) ? stryMutAct_9fa48("1717") ? "" : (stryCov_9fa48("1717"), 'INVALID_DATA') : stryMutAct_9fa48("1718") ? "" : (stryCov_9fa48("1718"), 'SIGNUP_ERROR'),
              details: errorData
            });
          }
        }
        const responseData = await response.json();
        console.log(stryMutAct_9fa48("1719") ? "" : (stryCov_9fa48("1719"), '✅ Newsletter signup successful:'), responseData);
        return stryMutAct_9fa48("1720") ? {} : (stryCov_9fa48("1720"), {
          success: stryMutAct_9fa48("1721") ? false : (stryCov_9fa48("1721"), true),
          message: stryMutAct_9fa48("1724") ? responseData.message && 'Thank you! You\'re now on our mailing list.' : stryMutAct_9fa48("1723") ? false : stryMutAct_9fa48("1722") ? true : (stryCov_9fa48("1722", "1723", "1724"), responseData.message || (stryMutAct_9fa48("1725") ? "" : (stryCov_9fa48("1725"), 'Thank you! You\'re now on our mailing list.'))),
          code: stryMutAct_9fa48("1726") ? "" : (stryCov_9fa48("1726"), 'SIGNUP_SUCCESS')
        });
      }
    } catch (error: any) {
      if (stryMutAct_9fa48("1727")) {
        {}
      } else {
        stryCov_9fa48("1727");
        console.error(stryMutAct_9fa48("1728") ? "" : (stryCov_9fa48("1728"), '💥 Newsletter signup error:'), error);

        // Enhanced error classification
        if (stryMutAct_9fa48("1731") ? error.name !== 'AbortError' : stryMutAct_9fa48("1730") ? false : stryMutAct_9fa48("1729") ? true : (stryCov_9fa48("1729", "1730", "1731"), error.name === (stryMutAct_9fa48("1732") ? "" : (stryCov_9fa48("1732"), 'AbortError')))) {
          if (stryMutAct_9fa48("1733")) {
            {}
          } else {
            stryCov_9fa48("1733");
            return stryMutAct_9fa48("1734") ? {} : (stryCov_9fa48("1734"), {
              success: stryMutAct_9fa48("1735") ? true : (stryCov_9fa48("1735"), false),
              error: stryMutAct_9fa48("1736") ? "" : (stryCov_9fa48("1736"), 'Request timeout. Please try again.'),
              code: stryMutAct_9fa48("1737") ? "" : (stryCov_9fa48("1737"), 'TIMEOUT_ERROR')
            });
          }
        }
        if (stryMutAct_9fa48("1740") ? error.message.includes('fetch') : stryMutAct_9fa48("1739") ? false : stryMutAct_9fa48("1738") ? true : (stryCov_9fa48("1738", "1739", "1740"), error.message?.includes(stryMutAct_9fa48("1741") ? "" : (stryCov_9fa48("1741"), 'fetch')))) {
          if (stryMutAct_9fa48("1742")) {
            {}
          } else {
            stryCov_9fa48("1742");
            return stryMutAct_9fa48("1743") ? {} : (stryCov_9fa48("1743"), {
              success: stryMutAct_9fa48("1744") ? true : (stryCov_9fa48("1744"), false),
              error: stryMutAct_9fa48("1745") ? "" : (stryCov_9fa48("1745"), 'Unable to connect to our service. Please check your connection and try again.'),
              code: stryMutAct_9fa48("1746") ? "" : (stryCov_9fa48("1746"), 'NETWORK_ERROR')
            });
          }
        }
        return stryMutAct_9fa48("1747") ? {} : (stryCov_9fa48("1747"), {
          success: stryMutAct_9fa48("1748") ? true : (stryCov_9fa48("1748"), false),
          error: stryMutAct_9fa48("1749") ? "" : (stryCov_9fa48("1749"), 'An unexpected error occurred. Please try again.'),
          code: stryMutAct_9fa48("1750") ? "" : (stryCov_9fa48("1750"), 'UNKNOWN_ERROR'),
          details: stryMutAct_9fa48("1751") ? {} : (stryCov_9fa48("1751"), {
            message: error.message
          })
        });
      }
    }
  }
}

/**
 * Alternative action with direct email parameter for simpler usage
 * @param email - Email address to subscribe
 * @param source - Source of the signup (default: 'direct')
 */
export async function subscribeEmailAction(email: string, source: string = stryMutAct_9fa48("1752") ? "" : (stryCov_9fa48("1752"), 'direct')): Promise<NewsletterResult> {
  if (stryMutAct_9fa48("1753")) {
    {}
  } else {
    stryCov_9fa48("1753");
    console.log(stryMutAct_9fa48("1754") ? "" : (stryCov_9fa48("1754"), '📧 Direct email subscription started for:'), email);
    const formData = new FormData();
    formData.append(stryMutAct_9fa48("1755") ? "" : (stryCov_9fa48("1755"), 'email'), email);
    formData.append(stryMutAct_9fa48("1756") ? "" : (stryCov_9fa48("1756"), 'source'), source);
    formData.append(stryMutAct_9fa48("1757") ? "" : (stryCov_9fa48("1757"), 'marketing_consent'), stryMutAct_9fa48("1758") ? "" : (stryCov_9fa48("1758"), 'true'));
    return newsletterSignupAction(formData);
  }
}