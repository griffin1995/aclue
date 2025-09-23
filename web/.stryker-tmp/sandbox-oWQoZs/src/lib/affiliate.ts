/**
 * Amazon Affiliate Links Service
 * 
 * Production-ready implementation for Amazon Associates UK affiliate link generation,
 * tracking, analytics, and revenue optimization. Implements industry-standard
 * practices for affiliate marketing compliance and performance tracking.
 */
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
import { amazonConfig, config } from '@/config';
import { analytics } from '@/lib/analytics';
export interface AffiliateClickEvent {
  productId?: string;
  asin?: string;
  category?: string;
  price?: number;
  currency?: string;
  affiliateUrl: string;
  originalUrl?: string;
  source: 'recommendation' | 'search' | 'category' | 'direct';
  userId?: string;
  sessionId?: string;
  timestamp: number;
  referrer?: string;
  userAgent?: string;
}
export interface AffiliateConversionEvent {
  orderId: string;
  productId?: string;
  asin?: string;
  revenue: number;
  commission: number;
  currency: string;
  quantity: number;
  category?: string;
  affiliateUrl: string;
  clickTimestamp: number;
  conversionTimestamp: number;
  userId?: string;
  sessionId?: string;
}
export interface AffiliateProduct {
  id: string;
  asin?: string;
  title: string;
  description?: string;
  price?: number;
  currency?: string;
  category?: string;
  imageUrl?: string;
  originalUrl: string;
  affiliateUrl?: string;
  commissionRate?: number;
  estimatedCommission?: number;
  brand?: string;
  availability?: string;
  rating?: number;
  reviewCount?: number;
  features?: string[];
  lastUpdated: Date;
}
export interface AffiliateLinkOptions {
  associateTag?: string;
  ref?: string;
  campaign?: string;
  medium?: string;
  source?: string;
  term?: string;
  content?: string;
  customParameters?: Record<string, string>;
}
export interface AffiliateAnalytics {
  totalClicks: number;
  totalConversions: number;
  totalRevenue: number;
  totalCommission: number;
  conversionRate: number;
  averageOrderValue: number;
  clicksByCategory: Record<string, number>;
  revenueByCategory: Record<string, number>;
  topPerformingProducts: AffiliateProduct[];
  performanceBySource: Record<string, {
    clicks: number;
    conversions: number;
    revenue: number;
    conversionRate: number;
  }>;
}

/**
 * Comprehensive Amazon Affiliate Links Service
 * Handles link generation, tracking, analytics, and compliance
 */
export class AmazonAffiliateService {
  private static instance: AmazonAffiliateService;
  private clickEvents: AffiliateClickEvent[] = stryMutAct_9fa48("9759") ? ["Stryker was here"] : (stryCov_9fa48("9759"), []);
  private conversionEvents: AffiliateConversionEvent[] = stryMutAct_9fa48("9760") ? ["Stryker was here"] : (stryCov_9fa48("9760"), []);
  private constructor() {
    if (stryMutAct_9fa48("9761")) {
      {}
    } else {
      stryCov_9fa48("9761");
      this.initializeTracking();
    }
  }
  static getInstance(): AmazonAffiliateService {
    if (stryMutAct_9fa48("9762")) {
      {}
    } else {
      stryCov_9fa48("9762");
      if (stryMutAct_9fa48("9765") ? false : stryMutAct_9fa48("9764") ? true : stryMutAct_9fa48("9763") ? AmazonAffiliateService.instance : (stryCov_9fa48("9763", "9764", "9765"), !AmazonAffiliateService.instance)) {
        if (stryMutAct_9fa48("9766")) {
          {}
        } else {
          stryCov_9fa48("9766");
          AmazonAffiliateService.instance = new AmazonAffiliateService();
        }
      }
      return AmazonAffiliateService.instance;
    }
  }

  /**
   * Initialize affiliate tracking and analytics
   */
  private initializeTracking(): void {
    if (stryMutAct_9fa48("9767")) {
      {}
    } else {
      stryCov_9fa48("9767");
      if (stryMutAct_9fa48("9770") ? typeof window === 'undefined' : stryMutAct_9fa48("9769") ? false : stryMutAct_9fa48("9768") ? true : (stryCov_9fa48("9768", "9769", "9770"), typeof window !== (stryMutAct_9fa48("9771") ? "" : (stryCov_9fa48("9771"), 'undefined')))) {
        if (stryMutAct_9fa48("9772")) {
          {}
        } else {
          stryCov_9fa48("9772");
          // Load existing events from localStorage
          const storedClicks = localStorage.getItem(stryMutAct_9fa48("9773") ? "" : (stryCov_9fa48("9773"), 'aclue_affiliate_clicks'));
          const storedConversions = localStorage.getItem(stryMutAct_9fa48("9774") ? "" : (stryCov_9fa48("9774"), 'aclue_affiliate_conversions'));
          if (stryMutAct_9fa48("9776") ? false : stryMutAct_9fa48("9775") ? true : (stryCov_9fa48("9775", "9776"), storedClicks)) {
            if (stryMutAct_9fa48("9777")) {
              {}
            } else {
              stryCov_9fa48("9777");
              try {
                if (stryMutAct_9fa48("9778")) {
                  {}
                } else {
                  stryCov_9fa48("9778");
                  this.clickEvents = JSON.parse(storedClicks);
                }
              } catch (error) {
                if (stryMutAct_9fa48("9779")) {
                  {}
                } else {
                  stryCov_9fa48("9779");
                  console.error(stryMutAct_9fa48("9780") ? "" : (stryCov_9fa48("9780"), 'Error loading affiliate click events:'), error);
                }
              }
            }
          }
          if (stryMutAct_9fa48("9782") ? false : stryMutAct_9fa48("9781") ? true : (stryCov_9fa48("9781", "9782"), storedConversions)) {
            if (stryMutAct_9fa48("9783")) {
              {}
            } else {
              stryCov_9fa48("9783");
              try {
                if (stryMutAct_9fa48("9784")) {
                  {}
                } else {
                  stryCov_9fa48("9784");
                  this.conversionEvents = JSON.parse(storedConversions);
                }
              } catch (error) {
                if (stryMutAct_9fa48("9785")) {
                  {}
                } else {
                  stryCov_9fa48("9785");
                  console.error(stryMutAct_9fa48("9786") ? "" : (stryCov_9fa48("9786"), 'Error loading affiliate conversion events:'), error);
                }
              }
            }
          }

          // Clean up old events (older than 30 days)
          this.cleanupOldEvents();

          // Set up periodic cleanup
          setInterval(stryMutAct_9fa48("9787") ? () => undefined : (stryCov_9fa48("9787"), () => this.cleanupOldEvents()), stryMutAct_9fa48("9788") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("9788"), (stryMutAct_9fa48("9789") ? 24 * 60 / 60 : (stryCov_9fa48("9789"), (stryMutAct_9fa48("9790") ? 24 / 60 : (stryCov_9fa48("9790"), 24 * 60)) * 60)) * 1000)); // Daily cleanup
        }
      }
    }
  }

  /**
   * Generate affiliate link with comprehensive tracking
   */
  generateAffiliateLink(productUrl: string, options: AffiliateLinkOptions = {}): string {
    if (stryMutAct_9fa48("9791")) {
      {}
    } else {
      stryCov_9fa48("9791");
      try {
        if (stryMutAct_9fa48("9792")) {
          {}
        } else {
          stryCov_9fa48("9792");
          const url = new URL(productUrl);

          // Ensure we're using the correct Amazon domain
          if (stryMutAct_9fa48("9795") ? false : stryMutAct_9fa48("9794") ? true : stryMutAct_9fa48("9793") ? this.isValidAmazonUrl(productUrl) : (stryCov_9fa48("9793", "9794", "9795"), !this.isValidAmazonUrl(productUrl))) {
            if (stryMutAct_9fa48("9796")) {
              {}
            } else {
              stryCov_9fa48("9796");
              console.warn(stryMutAct_9fa48("9797") ? "" : (stryCov_9fa48("9797"), 'Invalid Amazon URL provided:'), productUrl);
              return productUrl;
            }
          }

          // Convert to UK domain if needed
          if (stryMutAct_9fa48("9800") ? false : stryMutAct_9fa48("9799") ? true : stryMutAct_9fa48("9798") ? url.hostname.includes('amazon.co.uk') : (stryCov_9fa48("9798", "9799", "9800"), !url.hostname.includes(stryMutAct_9fa48("9801") ? "" : (stryCov_9fa48("9801"), 'amazon.co.uk')))) {
            if (stryMutAct_9fa48("9802")) {
              {}
            } else {
              stryCov_9fa48("9802");
              url.hostname = stryMutAct_9fa48("9803") ? "" : (stryCov_9fa48("9803"), 'amazon.co.uk');
            }
          }

          // Add associate tag
          url.searchParams.set(stryMutAct_9fa48("9804") ? "" : (stryCov_9fa48("9804"), 'tag'), stryMutAct_9fa48("9807") ? options.associateTag && amazonConfig.uk.associateTag : stryMutAct_9fa48("9806") ? false : stryMutAct_9fa48("9805") ? true : (stryCov_9fa48("9805", "9806", "9807"), options.associateTag || amazonConfig.uk.associateTag));

          // Add tracking parameters
          if (stryMutAct_9fa48("9809") ? false : stryMutAct_9fa48("9808") ? true : (stryCov_9fa48("9808", "9809"), options.ref)) {
            if (stryMutAct_9fa48("9810")) {
              {}
            } else {
              stryCov_9fa48("9810");
              url.searchParams.set(stryMutAct_9fa48("9811") ? "" : (stryCov_9fa48("9811"), 'ref_'), options.ref);
            }
          }

          // UTM parameters for analytics
          if (stryMutAct_9fa48("9813") ? false : stryMutAct_9fa48("9812") ? true : (stryCov_9fa48("9812", "9813"), options.campaign)) {
            if (stryMutAct_9fa48("9814")) {
              {}
            } else {
              stryCov_9fa48("9814");
              url.searchParams.set(stryMutAct_9fa48("9815") ? "" : (stryCov_9fa48("9815"), 'utm_campaign'), options.campaign);
            }
          }
          if (stryMutAct_9fa48("9817") ? false : stryMutAct_9fa48("9816") ? true : (stryCov_9fa48("9816", "9817"), options.medium)) {
            if (stryMutAct_9fa48("9818")) {
              {}
            } else {
              stryCov_9fa48("9818");
              url.searchParams.set(stryMutAct_9fa48("9819") ? "" : (stryCov_9fa48("9819"), 'utm_medium'), options.medium);
            }
          }
          if (stryMutAct_9fa48("9821") ? false : stryMutAct_9fa48("9820") ? true : (stryCov_9fa48("9820", "9821"), options.source)) {
            if (stryMutAct_9fa48("9822")) {
              {}
            } else {
              stryCov_9fa48("9822");
              url.searchParams.set(stryMutAct_9fa48("9823") ? "" : (stryCov_9fa48("9823"), 'utm_source'), options.source);
            }
          }
          if (stryMutAct_9fa48("9825") ? false : stryMutAct_9fa48("9824") ? true : (stryCov_9fa48("9824", "9825"), options.term)) {
            if (stryMutAct_9fa48("9826")) {
              {}
            } else {
              stryCov_9fa48("9826");
              url.searchParams.set(stryMutAct_9fa48("9827") ? "" : (stryCov_9fa48("9827"), 'utm_term'), options.term);
            }
          }
          if (stryMutAct_9fa48("9829") ? false : stryMutAct_9fa48("9828") ? true : (stryCov_9fa48("9828", "9829"), options.content)) {
            if (stryMutAct_9fa48("9830")) {
              {}
            } else {
              stryCov_9fa48("9830");
              url.searchParams.set(stryMutAct_9fa48("9831") ? "" : (stryCov_9fa48("9831"), 'utm_content'), options.content);
            }
          }

          // Add custom parameters
          if (stryMutAct_9fa48("9833") ? false : stryMutAct_9fa48("9832") ? true : (stryCov_9fa48("9832", "9833"), options.customParameters)) {
            if (stryMutAct_9fa48("9834")) {
              {}
            } else {
              stryCov_9fa48("9834");
              Object.entries(options.customParameters).forEach(([key, value]) => {
                if (stryMutAct_9fa48("9835")) {
                  {}
                } else {
                  stryCov_9fa48("9835");
                  url.searchParams.set(key, value);
                }
              });
            }
          }

          // Add unique tracking identifier
          const trackingId = this.generateTrackingId();
          url.searchParams.set(stryMutAct_9fa48("9836") ? "" : (stryCov_9fa48("9836"), 'gs_track'), trackingId);

          // Add timestamp
          url.searchParams.set(stryMutAct_9fa48("9837") ? "" : (stryCov_9fa48("9837"), 'timestamp'), Date.now().toString());
          return url.toString();
        }
      } catch (error) {
        if (stryMutAct_9fa48("9838")) {
          {}
        } else {
          stryCov_9fa48("9838");
          console.error(stryMutAct_9fa48("9839") ? "" : (stryCov_9fa48("9839"), 'Error generating affiliate link:'), error);
          return productUrl;
        }
      }
    }
  }

  /**
   * Generate Amazon search link with affiliate tracking
   */
  generateSearchLink(searchTerm: string, category?: string, options: AffiliateLinkOptions = {}): string {
    if (stryMutAct_9fa48("9840")) {
      {}
    } else {
      stryCov_9fa48("9840");
      const baseUrl = stryMutAct_9fa48("9841") ? "" : (stryCov_9fa48("9841"), 'https://amazon.co.uk/s');
      const url = new URL(baseUrl);

      // Search parameters
      url.searchParams.set(stryMutAct_9fa48("9842") ? "" : (stryCov_9fa48("9842"), 'k'), searchTerm);
      url.searchParams.set(stryMutAct_9fa48("9843") ? "" : (stryCov_9fa48("9843"), 'tag'), stryMutAct_9fa48("9846") ? options.associateTag && amazonConfig.uk.associateTag : stryMutAct_9fa48("9845") ? false : stryMutAct_9fa48("9844") ? true : (stryCov_9fa48("9844", "9845", "9846"), options.associateTag || amazonConfig.uk.associateTag));

      // Category filter
      if (stryMutAct_9fa48("9849") ? category || amazonConfig.productCategories[category] : stryMutAct_9fa48("9848") ? false : stryMutAct_9fa48("9847") ? true : (stryCov_9fa48("9847", "9848", "9849"), category && amazonConfig.productCategories[category])) {
        if (stryMutAct_9fa48("9850")) {
          {}
        } else {
          stryCov_9fa48("9850");
          url.searchParams.set(stryMutAct_9fa48("9851") ? "" : (stryCov_9fa48("9851"), 'i'), amazonConfig.productCategories[category]);
        }
      }

      // Tracking parameters
      if (stryMutAct_9fa48("9853") ? false : stryMutAct_9fa48("9852") ? true : (stryCov_9fa48("9852", "9853"), options.ref)) {
        if (stryMutAct_9fa48("9854")) {
          {}
        } else {
          stryCov_9fa48("9854");
          url.searchParams.set(stryMutAct_9fa48("9855") ? "" : (stryCov_9fa48("9855"), 'ref'), options.ref);
        }
      }

      // UTM parameters
      if (stryMutAct_9fa48("9857") ? false : stryMutAct_9fa48("9856") ? true : (stryCov_9fa48("9856", "9857"), options.campaign)) url.searchParams.set(stryMutAct_9fa48("9858") ? "" : (stryCov_9fa48("9858"), 'utm_campaign'), options.campaign);
      if (stryMutAct_9fa48("9860") ? false : stryMutAct_9fa48("9859") ? true : (stryCov_9fa48("9859", "9860"), options.medium)) url.searchParams.set(stryMutAct_9fa48("9861") ? "" : (stryCov_9fa48("9861"), 'utm_medium'), options.medium);
      if (stryMutAct_9fa48("9863") ? false : stryMutAct_9fa48("9862") ? true : (stryCov_9fa48("9862", "9863"), options.source)) url.searchParams.set(stryMutAct_9fa48("9864") ? "" : (stryCov_9fa48("9864"), 'utm_source'), options.source);

      // Add tracking identifier
      const trackingId = this.generateTrackingId();
      url.searchParams.set(stryMutAct_9fa48("9865") ? "" : (stryCov_9fa48("9865"), 'gs_track'), trackingId);
      return url.toString();
    }
  }

  /**
   * Track affiliate link click with comprehensive analytics
   */
  async trackAffiliateClick(event: Omit<AffiliateClickEvent, 'timestamp'>): Promise<void> {
    if (stryMutAct_9fa48("9866")) {
      {}
    } else {
      stryCov_9fa48("9866");
      const clickEvent: AffiliateClickEvent = stryMutAct_9fa48("9867") ? {} : (stryCov_9fa48("9867"), {
        ...event,
        timestamp: Date.now(),
        userAgent: (stryMutAct_9fa48("9870") ? typeof window === 'undefined' : stryMutAct_9fa48("9869") ? false : stryMutAct_9fa48("9868") ? true : (stryCov_9fa48("9868", "9869", "9870"), typeof window !== (stryMutAct_9fa48("9871") ? "" : (stryCov_9fa48("9871"), 'undefined')))) ? navigator.userAgent : undefined,
        referrer: (stryMutAct_9fa48("9874") ? typeof window === 'undefined' : stryMutAct_9fa48("9873") ? false : stryMutAct_9fa48("9872") ? true : (stryCov_9fa48("9872", "9873", "9874"), typeof window !== (stryMutAct_9fa48("9875") ? "" : (stryCov_9fa48("9875"), 'undefined')))) ? document.referrer : undefined
      });

      // Store event locally
      this.clickEvents.push(clickEvent);
      this.persistClickEvents();

      // Send to analytics service
      try {
        if (stryMutAct_9fa48("9876")) {
          {}
        } else {
          stryCov_9fa48("9876");
          await analytics.track(stryMutAct_9fa48("9877") ? "" : (stryCov_9fa48("9877"), 'affiliate_link_clicked'), stryMutAct_9fa48("9878") ? {} : (stryCov_9fa48("9878"), {
            affiliate_product_id: event.productId,
            affiliate_asin: event.asin,
            affiliate_category: event.category,
            affiliate_price: event.price,
            affiliate_currency: event.currency,
            affiliate_source: event.source,
            affiliate_url: event.affiliateUrl,
            original_url: event.originalUrl,
            user_id: event.userId,
            session_id: event.sessionId
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("9879")) {
          {}
        } else {
          stryCov_9fa48("9879");
          console.error(stryMutAct_9fa48("9880") ? "" : (stryCov_9fa48("9880"), 'Error sending affiliate click to analytics:'), error);
        }
      }

      // Send to backend for server-side tracking
      if (stryMutAct_9fa48("9882") ? false : stryMutAct_9fa48("9881") ? true : (stryCov_9fa48("9881", "9882"), config.features.affiliateTracking)) {
        if (stryMutAct_9fa48("9883")) {
          {}
        } else {
          stryCov_9fa48("9883");
          try {
            if (stryMutAct_9fa48("9884")) {
              {}
            } else {
              stryCov_9fa48("9884");
              await fetch(stryMutAct_9fa48("9885") ? `` : (stryCov_9fa48("9885"), `${config.apiUrl}/api/v1/analytics/affiliate/click`), stryMutAct_9fa48("9886") ? {} : (stryCov_9fa48("9886"), {
                method: stryMutAct_9fa48("9887") ? "" : (stryCov_9fa48("9887"), 'POST'),
                headers: stryMutAct_9fa48("9888") ? {} : (stryCov_9fa48("9888"), {
                  'Content-Type': stryMutAct_9fa48("9889") ? "" : (stryCov_9fa48("9889"), 'application/json')
                }),
                body: JSON.stringify(clickEvent)
              }));
            }
          } catch (error) {
            if (stryMutAct_9fa48("9890")) {
              {}
            } else {
              stryCov_9fa48("9890");
              console.error(stryMutAct_9fa48("9891") ? "" : (stryCov_9fa48("9891"), 'Error sending affiliate click to backend:'), error);
            }
          }
        }
      }
    }
  }

  /**
   * Track affiliate conversion (when user makes a purchase)
   */
  async trackAffiliateConversion(event: Omit<AffiliateConversionEvent, 'conversionTimestamp'>): Promise<void> {
    if (stryMutAct_9fa48("9892")) {
      {}
    } else {
      stryCov_9fa48("9892");
      const conversionEvent: AffiliateConversionEvent = stryMutAct_9fa48("9893") ? {} : (stryCov_9fa48("9893"), {
        ...event,
        conversionTimestamp: Date.now()
      });

      // Store event locally
      this.conversionEvents.push(conversionEvent);
      this.persistConversionEvents();

      // Send to analytics service
      try {
        if (stryMutAct_9fa48("9894")) {
          {}
        } else {
          stryCov_9fa48("9894");
          await analytics.track(stryMutAct_9fa48("9895") ? "" : (stryCov_9fa48("9895"), 'affiliate_conversion'), stryMutAct_9fa48("9896") ? {} : (stryCov_9fa48("9896"), {
            affiliate_order_id: event.orderId,
            affiliate_product_id: event.productId,
            affiliate_asin: event.asin,
            affiliate_revenue: event.revenue,
            affiliate_commission: event.commission,
            affiliate_currency: event.currency,
            affiliate_quantity: event.quantity,
            affiliate_category: event.category,
            affiliate_url: event.affiliateUrl,
            conversion_time_minutes: stryMutAct_9fa48("9897") ? (conversionEvent.conversionTimestamp - event.clickTimestamp) * (1000 * 60) : (stryCov_9fa48("9897"), (stryMutAct_9fa48("9898") ? conversionEvent.conversionTimestamp + event.clickTimestamp : (stryCov_9fa48("9898"), conversionEvent.conversionTimestamp - event.clickTimestamp)) / (stryMutAct_9fa48("9899") ? 1000 / 60 : (stryCov_9fa48("9899"), 1000 * 60))),
            user_id: event.userId,
            session_id: event.sessionId
          }));
        }
      } catch (error) {
        if (stryMutAct_9fa48("9900")) {
          {}
        } else {
          stryCov_9fa48("9900");
          console.error(stryMutAct_9fa48("9901") ? "" : (stryCov_9fa48("9901"), 'Error sending affiliate conversion to analytics:'), error);
        }
      }

      // Send to backend
      if (stryMutAct_9fa48("9903") ? false : stryMutAct_9fa48("9902") ? true : (stryCov_9fa48("9902", "9903"), config.features.affiliateTracking)) {
        if (stryMutAct_9fa48("9904")) {
          {}
        } else {
          stryCov_9fa48("9904");
          try {
            if (stryMutAct_9fa48("9905")) {
              {}
            } else {
              stryCov_9fa48("9905");
              await fetch(stryMutAct_9fa48("9906") ? `` : (stryCov_9fa48("9906"), `${config.apiUrl}/api/v1/analytics/affiliate/conversion`), stryMutAct_9fa48("9907") ? {} : (stryCov_9fa48("9907"), {
                method: stryMutAct_9fa48("9908") ? "" : (stryCov_9fa48("9908"), 'POST'),
                headers: stryMutAct_9fa48("9909") ? {} : (stryCov_9fa48("9909"), {
                  'Content-Type': stryMutAct_9fa48("9910") ? "" : (stryCov_9fa48("9910"), 'application/json')
                }),
                body: JSON.stringify(conversionEvent)
              }));
            }
          } catch (error) {
            if (stryMutAct_9fa48("9911")) {
              {}
            } else {
              stryCov_9fa48("9911");
              console.error(stryMutAct_9fa48("9912") ? "" : (stryCov_9fa48("9912"), 'Error sending affiliate conversion to backend:'), error);
            }
          }
        }
      }
    }
  }

  /**
   * Get comprehensive affiliate analytics
   */
  getAnalytics(timeframe: 'day' | 'week' | 'month' | 'year' | 'all' = stryMutAct_9fa48("9913") ? "" : (stryCov_9fa48("9913"), 'month')): AffiliateAnalytics {
    if (stryMutAct_9fa48("9914")) {
      {}
    } else {
      stryCov_9fa48("9914");
      const now = Date.now();
      const timeframMs = stryMutAct_9fa48("9915") ? {} : (stryCov_9fa48("9915"), {
        day: stryMutAct_9fa48("9916") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("9916"), (stryMutAct_9fa48("9917") ? 24 * 60 / 60 : (stryCov_9fa48("9917"), (stryMutAct_9fa48("9918") ? 24 / 60 : (stryCov_9fa48("9918"), 24 * 60)) * 60)) * 1000),
        week: stryMutAct_9fa48("9919") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("9919"), (stryMutAct_9fa48("9920") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("9920"), (stryMutAct_9fa48("9921") ? 7 * 24 / 60 : (stryCov_9fa48("9921"), (stryMutAct_9fa48("9922") ? 7 / 24 : (stryCov_9fa48("9922"), 7 * 24)) * 60)) * 60)) * 1000),
        month: stryMutAct_9fa48("9923") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("9923"), (stryMutAct_9fa48("9924") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("9924"), (stryMutAct_9fa48("9925") ? 30 * 24 / 60 : (stryCov_9fa48("9925"), (stryMutAct_9fa48("9926") ? 30 / 24 : (stryCov_9fa48("9926"), 30 * 24)) * 60)) * 60)) * 1000),
        year: stryMutAct_9fa48("9927") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("9927"), (stryMutAct_9fa48("9928") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("9928"), (stryMutAct_9fa48("9929") ? 365 * 24 / 60 : (stryCov_9fa48("9929"), (stryMutAct_9fa48("9930") ? 365 / 24 : (stryCov_9fa48("9930"), 365 * 24)) * 60)) * 60)) * 1000),
        all: Infinity
      });
      const cutoff = stryMutAct_9fa48("9931") ? now + timeframMs[timeframe] : (stryCov_9fa48("9931"), now - timeframMs[timeframe]);

      // Filter events by timeframe
      const relevantClicks = stryMutAct_9fa48("9932") ? this.clickEvents : (stryCov_9fa48("9932"), this.clickEvents.filter(stryMutAct_9fa48("9933") ? () => undefined : (stryCov_9fa48("9933"), event => stryMutAct_9fa48("9937") ? event.timestamp < cutoff : stryMutAct_9fa48("9936") ? event.timestamp > cutoff : stryMutAct_9fa48("9935") ? false : stryMutAct_9fa48("9934") ? true : (stryCov_9fa48("9934", "9935", "9936", "9937"), event.timestamp >= cutoff))));
      const relevantConversions = stryMutAct_9fa48("9938") ? this.conversionEvents : (stryCov_9fa48("9938"), this.conversionEvents.filter(stryMutAct_9fa48("9939") ? () => undefined : (stryCov_9fa48("9939"), event => stryMutAct_9fa48("9943") ? event.conversionTimestamp < cutoff : stryMutAct_9fa48("9942") ? event.conversionTimestamp > cutoff : stryMutAct_9fa48("9941") ? false : stryMutAct_9fa48("9940") ? true : (stryCov_9fa48("9940", "9941", "9942", "9943"), event.conversionTimestamp >= cutoff))));

      // Calculate metrics
      const totalClicks = relevantClicks.length;
      const totalConversions = relevantConversions.length;
      const totalRevenue = relevantConversions.reduce(stryMutAct_9fa48("9944") ? () => undefined : (stryCov_9fa48("9944"), (sum, event) => stryMutAct_9fa48("9945") ? sum - event.revenue : (stryCov_9fa48("9945"), sum + event.revenue)), 0);
      const totalCommission = relevantConversions.reduce(stryMutAct_9fa48("9946") ? () => undefined : (stryCov_9fa48("9946"), (sum, event) => stryMutAct_9fa48("9947") ? sum - event.commission : (stryCov_9fa48("9947"), sum + event.commission)), 0);
      const conversionRate = (stryMutAct_9fa48("9951") ? totalClicks <= 0 : stryMutAct_9fa48("9950") ? totalClicks >= 0 : stryMutAct_9fa48("9949") ? false : stryMutAct_9fa48("9948") ? true : (stryCov_9fa48("9948", "9949", "9950", "9951"), totalClicks > 0)) ? stryMutAct_9fa48("9952") ? totalConversions * totalClicks : (stryCov_9fa48("9952"), totalConversions / totalClicks) : 0;
      const averageOrderValue = (stryMutAct_9fa48("9956") ? totalConversions <= 0 : stryMutAct_9fa48("9955") ? totalConversions >= 0 : stryMutAct_9fa48("9954") ? false : stryMutAct_9fa48("9953") ? true : (stryCov_9fa48("9953", "9954", "9955", "9956"), totalConversions > 0)) ? stryMutAct_9fa48("9957") ? totalRevenue * totalConversions : (stryCov_9fa48("9957"), totalRevenue / totalConversions) : 0;

      // Clicks by category
      const clicksByCategory: Record<string, number> = {};
      relevantClicks.forEach(event => {
        if (stryMutAct_9fa48("9958")) {
          {}
        } else {
          stryCov_9fa48("9958");
          if (stryMutAct_9fa48("9960") ? false : stryMutAct_9fa48("9959") ? true : (stryCov_9fa48("9959", "9960"), event.category)) {
            if (stryMutAct_9fa48("9961")) {
              {}
            } else {
              stryCov_9fa48("9961");
              clicksByCategory[event.category] = stryMutAct_9fa48("9962") ? (clicksByCategory[event.category] || 0) - 1 : (stryCov_9fa48("9962"), (stryMutAct_9fa48("9965") ? clicksByCategory[event.category] && 0 : stryMutAct_9fa48("9964") ? false : stryMutAct_9fa48("9963") ? true : (stryCov_9fa48("9963", "9964", "9965"), clicksByCategory[event.category] || 0)) + 1);
            }
          }
        }
      });

      // Revenue by category
      const revenueByCategory: Record<string, number> = {};
      relevantConversions.forEach(event => {
        if (stryMutAct_9fa48("9966")) {
          {}
        } else {
          stryCov_9fa48("9966");
          if (stryMutAct_9fa48("9968") ? false : stryMutAct_9fa48("9967") ? true : (stryCov_9fa48("9967", "9968"), event.category)) {
            if (stryMutAct_9fa48("9969")) {
              {}
            } else {
              stryCov_9fa48("9969");
              revenueByCategory[event.category] = stryMutAct_9fa48("9970") ? (revenueByCategory[event.category] || 0) - event.revenue : (stryCov_9fa48("9970"), (stryMutAct_9fa48("9973") ? revenueByCategory[event.category] && 0 : stryMutAct_9fa48("9972") ? false : stryMutAct_9fa48("9971") ? true : (stryCov_9fa48("9971", "9972", "9973"), revenueByCategory[event.category] || 0)) + event.revenue);
            }
          }
        }
      });

      // Performance by source
      const performanceBySource: Record<string, any> = {};
      const clicksBySource: Record<string, number> = {};
      const conversionsBySource: Record<string, number> = {};
      const revenueBySource: Record<string, number> = {};
      relevantClicks.forEach(event => {
        if (stryMutAct_9fa48("9974")) {
          {}
        } else {
          stryCov_9fa48("9974");
          clicksBySource[event.source] = stryMutAct_9fa48("9975") ? (clicksBySource[event.source] || 0) - 1 : (stryCov_9fa48("9975"), (stryMutAct_9fa48("9978") ? clicksBySource[event.source] && 0 : stryMutAct_9fa48("9977") ? false : stryMutAct_9fa48("9976") ? true : (stryCov_9fa48("9976", "9977", "9978"), clicksBySource[event.source] || 0)) + 1);
        }
      });
      relevantConversions.forEach(event => {
        if (stryMutAct_9fa48("9979")) {
          {}
        } else {
          stryCov_9fa48("9979");
          // Find corresponding click event
          const clickEvent = relevantClicks.find(stryMutAct_9fa48("9980") ? () => undefined : (stryCov_9fa48("9980"), click => stryMutAct_9fa48("9983") ? click.productId === event.productId || click.timestamp <= event.clickTimestamp : stryMutAct_9fa48("9982") ? false : stryMutAct_9fa48("9981") ? true : (stryCov_9fa48("9981", "9982", "9983"), (stryMutAct_9fa48("9985") ? click.productId !== event.productId : stryMutAct_9fa48("9984") ? true : (stryCov_9fa48("9984", "9985"), click.productId === event.productId)) && (stryMutAct_9fa48("9988") ? click.timestamp > event.clickTimestamp : stryMutAct_9fa48("9987") ? click.timestamp < event.clickTimestamp : stryMutAct_9fa48("9986") ? true : (stryCov_9fa48("9986", "9987", "9988"), click.timestamp <= event.clickTimestamp)))));
          if (stryMutAct_9fa48("9990") ? false : stryMutAct_9fa48("9989") ? true : (stryCov_9fa48("9989", "9990"), clickEvent)) {
            if (stryMutAct_9fa48("9991")) {
              {}
            } else {
              stryCov_9fa48("9991");
              conversionsBySource[clickEvent.source] = stryMutAct_9fa48("9992") ? (conversionsBySource[clickEvent.source] || 0) - 1 : (stryCov_9fa48("9992"), (stryMutAct_9fa48("9995") ? conversionsBySource[clickEvent.source] && 0 : stryMutAct_9fa48("9994") ? false : stryMutAct_9fa48("9993") ? true : (stryCov_9fa48("9993", "9994", "9995"), conversionsBySource[clickEvent.source] || 0)) + 1);
              revenueBySource[clickEvent.source] = stryMutAct_9fa48("9996") ? (revenueBySource[clickEvent.source] || 0) - event.revenue : (stryCov_9fa48("9996"), (stryMutAct_9fa48("9999") ? revenueBySource[clickEvent.source] && 0 : stryMutAct_9fa48("9998") ? false : stryMutAct_9fa48("9997") ? true : (stryCov_9fa48("9997", "9998", "9999"), revenueBySource[clickEvent.source] || 0)) + event.revenue);
            }
          }
        }
      });
      Object.keys(clicksBySource).forEach(source => {
        if (stryMutAct_9fa48("10000")) {
          {}
        } else {
          stryCov_9fa48("10000");
          const clicks = stryMutAct_9fa48("10003") ? clicksBySource[source] && 0 : stryMutAct_9fa48("10002") ? false : stryMutAct_9fa48("10001") ? true : (stryCov_9fa48("10001", "10002", "10003"), clicksBySource[source] || 0);
          const conversions = stryMutAct_9fa48("10006") ? conversionsBySource[source] && 0 : stryMutAct_9fa48("10005") ? false : stryMutAct_9fa48("10004") ? true : (stryCov_9fa48("10004", "10005", "10006"), conversionsBySource[source] || 0);
          const revenue = stryMutAct_9fa48("10009") ? revenueBySource[source] && 0 : stryMutAct_9fa48("10008") ? false : stryMutAct_9fa48("10007") ? true : (stryCov_9fa48("10007", "10008", "10009"), revenueBySource[source] || 0);
          performanceBySource[source] = stryMutAct_9fa48("10010") ? {} : (stryCov_9fa48("10010"), {
            clicks,
            conversions,
            revenue,
            conversionRate: (stryMutAct_9fa48("10014") ? clicks <= 0 : stryMutAct_9fa48("10013") ? clicks >= 0 : stryMutAct_9fa48("10012") ? false : stryMutAct_9fa48("10011") ? true : (stryCov_9fa48("10011", "10012", "10013", "10014"), clicks > 0)) ? stryMutAct_9fa48("10015") ? conversions * clicks : (stryCov_9fa48("10015"), conversions / clicks) : 0
          });
        }
      });
      return stryMutAct_9fa48("10016") ? {} : (stryCov_9fa48("10016"), {
        totalClicks,
        totalConversions,
        totalRevenue,
        totalCommission,
        conversionRate,
        averageOrderValue,
        clicksByCategory,
        revenueByCategory,
        topPerformingProducts: stryMutAct_9fa48("10017") ? ["Stryker was here"] : (stryCov_9fa48("10017"), []),
        // TODO: Implement based on conversion data
        performanceBySource
      });
    }
  }

  /**
   * Extract ASIN from Amazon product URL
   */
  extractASIN(productUrl: string): string | null {
    if (stryMutAct_9fa48("10018")) {
      {}
    } else {
      stryCov_9fa48("10018");
      try {
        if (stryMutAct_9fa48("10019")) {
          {}
        } else {
          stryCov_9fa48("10019");
          const asinPatterns = stryMutAct_9fa48("10020") ? [] : (stryCov_9fa48("10020"), [stryMutAct_9fa48("10022") ? /\/dp\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("10021") ? /\/dp\/([A-Z0-9])/ : (stryCov_9fa48("10021", "10022"), /\/dp\/([A-Z0-9]{10})/), stryMutAct_9fa48("10024") ? /\/gp\/product\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("10023") ? /\/gp\/product\/([A-Z0-9])/ : (stryCov_9fa48("10023", "10024"), /\/gp\/product\/([A-Z0-9]{10})/), stryMutAct_9fa48("10026") ? /\/product\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("10025") ? /\/product\/([A-Z0-9])/ : (stryCov_9fa48("10025", "10026"), /\/product\/([A-Z0-9]{10})/), stryMutAct_9fa48("10028") ? /\/ASIN\/([^A-Z0-9]{10})/ : stryMutAct_9fa48("10027") ? /\/ASIN\/([A-Z0-9])/ : (stryCov_9fa48("10027", "10028"), /\/ASIN\/([A-Z0-9]{10})/), stryMutAct_9fa48("10030") ? /asin=([^A-Z0-9]{10})/i : stryMutAct_9fa48("10029") ? /asin=([A-Z0-9])/i : (stryCov_9fa48("10029", "10030"), /asin=([A-Z0-9]{10})/i), stryMutAct_9fa48("10033") ? /\/([A-Z0-9]{10})(?:\/|\?)/ : stryMutAct_9fa48("10032") ? /\/([^A-Z0-9]{10})(?:\/|\?|$)/ : stryMutAct_9fa48("10031") ? /\/([A-Z0-9])(?:\/|\?|$)/ : (stryCov_9fa48("10031", "10032", "10033"), /\/([A-Z0-9]{10})(?:\/|\?|$)/)]);
          for (const pattern of asinPatterns) {
            if (stryMutAct_9fa48("10034")) {
              {}
            } else {
              stryCov_9fa48("10034");
              const match = productUrl.match(pattern);
              if (stryMutAct_9fa48("10037") ? match || match[1] : stryMutAct_9fa48("10036") ? false : stryMutAct_9fa48("10035") ? true : (stryCov_9fa48("10035", "10036", "10037"), match && match[1])) {
                if (stryMutAct_9fa48("10038")) {
                  {}
                } else {
                  stryCov_9fa48("10038");
                  return match[1];
                }
              }
            }
          }
          return null;
        }
      } catch (error) {
        if (stryMutAct_9fa48("10039")) {
          {}
        } else {
          stryCov_9fa48("10039");
          console.error(stryMutAct_9fa48("10040") ? "" : (stryCov_9fa48("10040"), 'Error extracting ASIN:'), error);
          return null;
        }
      }
    }
  }

  /**
   * Validate Amazon URL
   */
  isValidAmazonUrl(url: string): boolean {
    if (stryMutAct_9fa48("10041")) {
      {}
    } else {
      stryCov_9fa48("10041");
      try {
        if (stryMutAct_9fa48("10042")) {
          {}
        } else {
          stryCov_9fa48("10042");
          const urlObj = new URL(url);
          const validDomains = stryMutAct_9fa48("10043") ? [] : (stryCov_9fa48("10043"), [stryMutAct_9fa48("10044") ? "" : (stryCov_9fa48("10044"), 'amazon.co.uk'), stryMutAct_9fa48("10045") ? "" : (stryCov_9fa48("10045"), 'amazon.com'), stryMutAct_9fa48("10046") ? "" : (stryCov_9fa48("10046"), 'amazon.de'), stryMutAct_9fa48("10047") ? "" : (stryCov_9fa48("10047"), 'amazon.fr'), stryMutAct_9fa48("10048") ? "" : (stryCov_9fa48("10048"), 'amazon.it'), stryMutAct_9fa48("10049") ? "" : (stryCov_9fa48("10049"), 'amazon.es'), stryMutAct_9fa48("10050") ? "" : (stryCov_9fa48("10050"), 'amazon.ca'), stryMutAct_9fa48("10051") ? "" : (stryCov_9fa48("10051"), 'amazon.com.au'), stryMutAct_9fa48("10052") ? "" : (stryCov_9fa48("10052"), 'amazon.co.jp'), stryMutAct_9fa48("10053") ? "" : (stryCov_9fa48("10053"), 'amazon.com.br'), stryMutAct_9fa48("10054") ? "" : (stryCov_9fa48("10054"), 'amazon.in'), stryMutAct_9fa48("10055") ? "" : (stryCov_9fa48("10055"), 'amazon.com.mx'), stryMutAct_9fa48("10056") ? "" : (stryCov_9fa48("10056"), 'amazon.cn'), stryMutAct_9fa48("10057") ? "" : (stryCov_9fa48("10057"), 'amazon.sg'), stryMutAct_9fa48("10058") ? "" : (stryCov_9fa48("10058"), 'amazon.ae'), stryMutAct_9fa48("10059") ? "" : (stryCov_9fa48("10059"), 'amazon.nl'), stryMutAct_9fa48("10060") ? "" : (stryCov_9fa48("10060"), 'amazon.se'), stryMutAct_9fa48("10061") ? "" : (stryCov_9fa48("10061"), 'amazon.pl')]);
          return stryMutAct_9fa48("10062") ? validDomains.every(domain => urlObj.hostname.includes(domain)) : (stryCov_9fa48("10062"), validDomains.some(stryMutAct_9fa48("10063") ? () => undefined : (stryCov_9fa48("10063"), domain => urlObj.hostname.includes(domain))));
        }
      } catch (error) {
        if (stryMutAct_9fa48("10064")) {
          {}
        } else {
          stryCov_9fa48("10064");
          return stryMutAct_9fa48("10065") ? true : (stryCov_9fa48("10065"), false);
        }
      }
    }
  }

  /**
   * Get commission rate for product category
   */
  getCommissionRate(category: string): number {
    if (stryMutAct_9fa48("10066")) {
      {}
    } else {
      stryCov_9fa48("10066");
      const normalizedCategory = stryMutAct_9fa48("10067") ? category.toUpperCase().replace(/\s+/g, '') : (stryCov_9fa48("10067"), category.toLowerCase().replace(stryMutAct_9fa48("10069") ? /\S+/g : stryMutAct_9fa48("10068") ? /\s/g : (stryCov_9fa48("10068", "10069"), /\s+/g), stryMutAct_9fa48("10070") ? "Stryker was here!" : (stryCov_9fa48("10070"), '')));
      const categoryMappings: Record<string, keyof typeof amazonConfig.commissionRates> = stryMutAct_9fa48("10071") ? {} : (stryCov_9fa48("10071"), {
        'electronics': stryMutAct_9fa48("10072") ? "" : (stryCov_9fa48("10072"), 'electronics'),
        'computers': stryMutAct_9fa48("10073") ? "" : (stryCov_9fa48("10073"), 'electronics'),
        'mobile': stryMutAct_9fa48("10074") ? "" : (stryCov_9fa48("10074"), 'electronics'),
        'fashion': stryMutAct_9fa48("10075") ? "" : (stryCov_9fa48("10075"), 'fashion'),
        'clothing': stryMutAct_9fa48("10076") ? "" : (stryCov_9fa48("10076"), 'fashion'),
        'shoes': stryMutAct_9fa48("10077") ? "" : (stryCov_9fa48("10077"), 'fashion'),
        'accessories': stryMutAct_9fa48("10078") ? "" : (stryCov_9fa48("10078"), 'fashion'),
        'homeandgarden': stryMutAct_9fa48("10079") ? "" : (stryCov_9fa48("10079"), 'homeAndGarden'),
        'home': stryMutAct_9fa48("10080") ? "" : (stryCov_9fa48("10080"), 'homeAndGarden'),
        'garden': stryMutAct_9fa48("10081") ? "" : (stryCov_9fa48("10081"), 'homeAndGarden'),
        'furniture': stryMutAct_9fa48("10082") ? "" : (stryCov_9fa48("10082"), 'homeAndGarden'),
        'kitchen': stryMutAct_9fa48("10083") ? "" : (stryCov_9fa48("10083"), 'homeAndGarden'),
        'sportsandoutdoors': stryMutAct_9fa48("10084") ? "" : (stryCov_9fa48("10084"), 'sportsAndOutdoors'),
        'sports': stryMutAct_9fa48("10085") ? "" : (stryCov_9fa48("10085"), 'sportsAndOutdoors'),
        'fitness': stryMutAct_9fa48("10086") ? "" : (stryCov_9fa48("10086"), 'sportsAndOutdoors'),
        'outdoor': stryMutAct_9fa48("10087") ? "" : (stryCov_9fa48("10087"), 'sportsAndOutdoors'),
        'books': stryMutAct_9fa48("10088") ? "" : (stryCov_9fa48("10088"), 'books'),
        'ebooks': stryMutAct_9fa48("10089") ? "" : (stryCov_9fa48("10089"), 'books'),
        'kindle': stryMutAct_9fa48("10090") ? "" : (stryCov_9fa48("10090"), 'books'),
        'toys': stryMutAct_9fa48("10091") ? "" : (stryCov_9fa48("10091"), 'toys'),
        'toysgames': stryMutAct_9fa48("10092") ? "" : (stryCov_9fa48("10092"), 'toys'),
        'games': stryMutAct_9fa48("10093") ? "" : (stryCov_9fa48("10093"), 'toys'),
        'videogames': stryMutAct_9fa48("10094") ? "" : (stryCov_9fa48("10094"), 'toys'),
        'beauty': stryMutAct_9fa48("10095") ? "" : (stryCov_9fa48("10095"), 'beautyAndPersonalCare'),
        'beautyandpersonalcare': stryMutAct_9fa48("10096") ? "" : (stryCov_9fa48("10096"), 'beautyAndPersonalCare'),
        'personalcare': stryMutAct_9fa48("10097") ? "" : (stryCov_9fa48("10097"), 'beautyAndPersonalCare'),
        'health': stryMutAct_9fa48("10098") ? "" : (stryCov_9fa48("10098"), 'beautyAndPersonalCare'),
        'automotive': stryMutAct_9fa48("10099") ? "" : (stryCov_9fa48("10099"), 'automotive'),
        'car': stryMutAct_9fa48("10100") ? "" : (stryCov_9fa48("10100"), 'automotive'),
        'motorcycle': stryMutAct_9fa48("10101") ? "" : (stryCov_9fa48("10101"), 'automotive'),
        'industrial': stryMutAct_9fa48("10102") ? "" : (stryCov_9fa48("10102"), 'industrial'),
        'tools': stryMutAct_9fa48("10103") ? "" : (stryCov_9fa48("10103"), 'industrial'),
        'business': stryMutAct_9fa48("10104") ? "" : (stryCov_9fa48("10104"), 'industrial')
      });
      const mappedCategory = categoryMappings[normalizedCategory];
      return stryMutAct_9fa48("10107") ? amazonConfig.commissionRates[mappedCategory] && amazonConfig.commissionRates.default : stryMutAct_9fa48("10106") ? false : stryMutAct_9fa48("10105") ? true : (stryCov_9fa48("10105", "10106", "10107"), amazonConfig.commissionRates[mappedCategory] || amazonConfig.commissionRates.default);
    }
  }

  /**
   * Generate unique tracking identifier
   */
  private generateTrackingId(): string {
    if (stryMutAct_9fa48("10108")) {
      {}
    } else {
      stryCov_9fa48("10108");
      const timestamp = Date.now().toString(36);
      const random = stryMutAct_9fa48("10109") ? Math.random().toString(36) : (stryCov_9fa48("10109"), Math.random().toString(36).substr(2, 9));
      return stryMutAct_9fa48("10110") ? `` : (stryCov_9fa48("10110"), `gs_${timestamp}_${random}`);
    }
  }

  /**
   * Persist click events to localStorage
   */
  private persistClickEvents(): void {
    if (stryMutAct_9fa48("10111")) {
      {}
    } else {
      stryCov_9fa48("10111");
      if (stryMutAct_9fa48("10114") ? typeof window === 'undefined' : stryMutAct_9fa48("10113") ? false : stryMutAct_9fa48("10112") ? true : (stryCov_9fa48("10112", "10113", "10114"), typeof window !== (stryMutAct_9fa48("10115") ? "" : (stryCov_9fa48("10115"), 'undefined')))) {
        if (stryMutAct_9fa48("10116")) {
          {}
        } else {
          stryCov_9fa48("10116");
          try {
            if (stryMutAct_9fa48("10117")) {
              {}
            } else {
              stryCov_9fa48("10117");
              localStorage.setItem(stryMutAct_9fa48("10118") ? "" : (stryCov_9fa48("10118"), 'aclue_affiliate_clicks'), JSON.stringify(this.clickEvents));
            }
          } catch (error) {
            if (stryMutAct_9fa48("10119")) {
              {}
            } else {
              stryCov_9fa48("10119");
              console.error(stryMutAct_9fa48("10120") ? "" : (stryCov_9fa48("10120"), 'Error persisting affiliate click events:'), error);
            }
          }
        }
      }
    }
  }

  /**
   * Persist conversion events to localStorage
   */
  private persistConversionEvents(): void {
    if (stryMutAct_9fa48("10121")) {
      {}
    } else {
      stryCov_9fa48("10121");
      if (stryMutAct_9fa48("10124") ? typeof window === 'undefined' : stryMutAct_9fa48("10123") ? false : stryMutAct_9fa48("10122") ? true : (stryCov_9fa48("10122", "10123", "10124"), typeof window !== (stryMutAct_9fa48("10125") ? "" : (stryCov_9fa48("10125"), 'undefined')))) {
        if (stryMutAct_9fa48("10126")) {
          {}
        } else {
          stryCov_9fa48("10126");
          try {
            if (stryMutAct_9fa48("10127")) {
              {}
            } else {
              stryCov_9fa48("10127");
              localStorage.setItem(stryMutAct_9fa48("10128") ? "" : (stryCov_9fa48("10128"), 'aclue_affiliate_conversions'), JSON.stringify(this.conversionEvents));
            }
          } catch (error) {
            if (stryMutAct_9fa48("10129")) {
              {}
            } else {
              stryCov_9fa48("10129");
              console.error(stryMutAct_9fa48("10130") ? "" : (stryCov_9fa48("10130"), 'Error persisting affiliate conversion events:'), error);
            }
          }
        }
      }
    }
  }

  /**
   * Clean up old events (older than 30 days)
   */
  private cleanupOldEvents(): void {
    if (stryMutAct_9fa48("10131")) {
      {}
    } else {
      stryCov_9fa48("10131");
      const thirtyDaysAgo = stryMutAct_9fa48("10132") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("10132"), Date.now() - (stryMutAct_9fa48("10133") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("10133"), (stryMutAct_9fa48("10134") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("10134"), (stryMutAct_9fa48("10135") ? 30 * 24 / 60 : (stryCov_9fa48("10135"), (stryMutAct_9fa48("10136") ? 30 / 24 : (stryCov_9fa48("10136"), 30 * 24)) * 60)) * 60)) * 1000)));
      this.clickEvents = stryMutAct_9fa48("10137") ? this.clickEvents : (stryCov_9fa48("10137"), this.clickEvents.filter(stryMutAct_9fa48("10138") ? () => undefined : (stryCov_9fa48("10138"), event => stryMutAct_9fa48("10142") ? event.timestamp < thirtyDaysAgo : stryMutAct_9fa48("10141") ? event.timestamp > thirtyDaysAgo : stryMutAct_9fa48("10140") ? false : stryMutAct_9fa48("10139") ? true : (stryCov_9fa48("10139", "10140", "10141", "10142"), event.timestamp >= thirtyDaysAgo))));
      this.conversionEvents = stryMutAct_9fa48("10143") ? this.conversionEvents : (stryCov_9fa48("10143"), this.conversionEvents.filter(stryMutAct_9fa48("10144") ? () => undefined : (stryCov_9fa48("10144"), event => stryMutAct_9fa48("10148") ? event.conversionTimestamp < thirtyDaysAgo : stryMutAct_9fa48("10147") ? event.conversionTimestamp > thirtyDaysAgo : stryMutAct_9fa48("10146") ? false : stryMutAct_9fa48("10145") ? true : (stryCov_9fa48("10145", "10146", "10147", "10148"), event.conversionTimestamp >= thirtyDaysAgo))));
      this.persistClickEvents();
      this.persistConversionEvents();
    }
  }
}

// Export singleton instance
export const affiliateService = AmazonAffiliateService.getInstance();

// Export convenience functions
export const generateAffiliateLink = stryMutAct_9fa48("10149") ? () => undefined : (stryCov_9fa48("10149"), (() => {
  const generateAffiliateLink = (url: string, options?: AffiliateLinkOptions) => affiliateService.generateAffiliateLink(url, options);
  return generateAffiliateLink;
})());
export const generateSearchLink = stryMutAct_9fa48("10150") ? () => undefined : (stryCov_9fa48("10150"), (() => {
  const generateSearchLink = (searchTerm: string, category?: string, options?: AffiliateLinkOptions) => affiliateService.generateSearchLink(searchTerm, category, options);
  return generateSearchLink;
})());
export const trackAffiliateClick = stryMutAct_9fa48("10151") ? () => undefined : (stryCov_9fa48("10151"), (() => {
  const trackAffiliateClick = (event: Omit<AffiliateClickEvent, 'timestamp'>) => affiliateService.trackAffiliateClick(event);
  return trackAffiliateClick;
})());
export const trackAffiliateConversion = stryMutAct_9fa48("10152") ? () => undefined : (stryCov_9fa48("10152"), (() => {
  const trackAffiliateConversion = (event: Omit<AffiliateConversionEvent, 'conversionTimestamp'>) => affiliateService.trackAffiliateConversion(event);
  return trackAffiliateConversion;
})());
export const extractASIN = stryMutAct_9fa48("10153") ? () => undefined : (stryCov_9fa48("10153"), (() => {
  const extractASIN = (url: string) => affiliateService.extractASIN(url);
  return extractASIN;
})());
export const isValidAmazonUrl = stryMutAct_9fa48("10154") ? () => undefined : (stryCov_9fa48("10154"), (() => {
  const isValidAmazonUrl = (url: string) => affiliateService.isValidAmazonUrl(url);
  return isValidAmazonUrl;
})());
export const getCommissionRate = stryMutAct_9fa48("10155") ? () => undefined : (stryCov_9fa48("10155"), (() => {
  const getCommissionRate = (category: string) => affiliateService.getCommissionRate(category);
  return getCommissionRate;
})());
export const getAffiliateAnalytics = stryMutAct_9fa48("10156") ? () => undefined : (stryCov_9fa48("10156"), (() => {
  const getAffiliateAnalytics = (timeframe?: 'day' | 'week' | 'month' | 'year' | 'all') => affiliateService.getAnalytics(timeframe);
  return getAffiliateAnalytics;
})());