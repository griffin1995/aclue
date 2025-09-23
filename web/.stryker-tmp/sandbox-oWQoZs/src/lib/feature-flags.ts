/**
 * Feature Flag System for App Router Migration - Phase 4
 *
 * This system provides gradual rollout control for the Pages Router to App Router migration.
 * It allows for safe, incremental deployment of App Router pages while maintaining
 * fallback to Pages Router for stability.
 *
 * Phase 4 Features:
 * - Product discovery and search routes
 * - 50% user rollout with consistent hashing
 * - Enhanced route matching for shop sections
 * - Server component optimization tracking
 *
 * Features:
 * - Environment-based feature flagging
 * - Route-specific App Router enablement
 * - Runtime feature flag evaluation
 * - Rollback capability through environment variables
 *
 * Usage:
 *   const enabled = isAppRouterEnabled()
 *   const routeEnabled = isRouteAppRouter('discover')
 *   const userEnabled = isAppRouterEnabledForUser(userId)
 *
 * Environment Variables:
 *   NEXT_PUBLIC_APP_ROUTER_ENABLED=true|false
 *   NEXT_PUBLIC_APP_ROUTER_ROUTES=auth,profile,discover,products,search
 *   NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE=50
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
export interface FeatureFlagConfig {
  appRouterEnabled: boolean;
  enabledRoutes: string[];
  rolloutPercentage: number;
  debugMode: boolean;
}

/**
 * Get the current feature flag configuration from environment variables
 */
export function getFeatureFlagConfig(): FeatureFlagConfig {
  if (stryMutAct_9fa48("10854")) {
    {}
  } else {
    stryCov_9fa48("10854");
    const appRouterEnabled = stryMutAct_9fa48("10857") ? process.env.NEXT_PUBLIC_APP_ROUTER_ENABLED !== 'true' : stryMutAct_9fa48("10856") ? false : stryMutAct_9fa48("10855") ? true : (stryCov_9fa48("10855", "10856", "10857"), process.env.NEXT_PUBLIC_APP_ROUTER_ENABLED === (stryMutAct_9fa48("10858") ? "" : (stryCov_9fa48("10858"), 'true')));
    const enabledRoutesEnv = stryMutAct_9fa48("10861") ? process.env.NEXT_PUBLIC_APP_ROUTER_ROUTES && '' : stryMutAct_9fa48("10860") ? false : stryMutAct_9fa48("10859") ? true : (stryCov_9fa48("10859", "10860", "10861"), process.env.NEXT_PUBLIC_APP_ROUTER_ROUTES || (stryMutAct_9fa48("10862") ? "Stryker was here!" : (stryCov_9fa48("10862"), '')));
    const enabledRoutes = stryMutAct_9fa48("10863") ? enabledRoutesEnv.split(',') : (stryCov_9fa48("10863"), enabledRoutesEnv.split(stryMutAct_9fa48("10864") ? "" : (stryCov_9fa48("10864"), ',')).filter(stryMutAct_9fa48("10865") ? () => undefined : (stryCov_9fa48("10865"), route => stryMutAct_9fa48("10868") ? route.trim() === '' : stryMutAct_9fa48("10867") ? false : stryMutAct_9fa48("10866") ? true : (stryCov_9fa48("10866", "10867", "10868"), (stryMutAct_9fa48("10869") ? route : (stryCov_9fa48("10869"), route.trim())) !== (stryMutAct_9fa48("10870") ? "Stryker was here!" : (stryCov_9fa48("10870"), ''))))));
    const rolloutPercentage = parseInt(stryMutAct_9fa48("10873") ? process.env.NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE && '0' : stryMutAct_9fa48("10872") ? false : stryMutAct_9fa48("10871") ? true : (stryCov_9fa48("10871", "10872", "10873"), process.env.NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE || (stryMutAct_9fa48("10874") ? "" : (stryCov_9fa48("10874"), '0'))), 10);
    const debugMode = stryMutAct_9fa48("10877") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("10876") ? false : stryMutAct_9fa48("10875") ? true : (stryCov_9fa48("10875", "10876", "10877"), process.env.NODE_ENV === (stryMutAct_9fa48("10878") ? "" : (stryCov_9fa48("10878"), 'development')));
    return stryMutAct_9fa48("10879") ? {} : (stryCov_9fa48("10879"), {
      appRouterEnabled,
      enabledRoutes,
      rolloutPercentage: stryMutAct_9fa48("10880") ? Math.min(0, Math.min(100, rolloutPercentage)) : (stryCov_9fa48("10880"), Math.max(0, stryMutAct_9fa48("10881") ? Math.max(100, rolloutPercentage) : (stryCov_9fa48("10881"), Math.min(100, rolloutPercentage)))),
      debugMode
    });
  }
}

/**
 * Check if App Router is globally enabled
 */
export function isAppRouterEnabled(): boolean {
  if (stryMutAct_9fa48("10882")) {
    {}
  } else {
    stryCov_9fa48("10882");
    const config = getFeatureFlagConfig();
    return config.appRouterEnabled;
  }
}

/**
 * Check if a specific route should use App Router
 * @param route - The route to check (e.g., 'auth', 'products', 'marketing')
 */
export function isRouteAppRouter(route: string): boolean {
  if (stryMutAct_9fa48("10883")) {
    {}
  } else {
    stryCov_9fa48("10883");
    const config = getFeatureFlagConfig();

    // If App Router is disabled globally, return false
    if (stryMutAct_9fa48("10886") ? false : stryMutAct_9fa48("10885") ? true : stryMutAct_9fa48("10884") ? config.appRouterEnabled : (stryCov_9fa48("10884", "10885", "10886"), !config.appRouterEnabled)) {
      if (stryMutAct_9fa48("10887")) {
        {}
      } else {
        stryCov_9fa48("10887");
        return stryMutAct_9fa48("10888") ? true : (stryCov_9fa48("10888"), false);
      }
    }

    // Check if the specific route is enabled
    return config.enabledRoutes.includes(stryMutAct_9fa48("10889") ? route.toUpperCase() : (stryCov_9fa48("10889"), route.toLowerCase()));
  }
}

/**
 * Check if App Router should be enabled for a specific user (percentage rollout)
 * @param userId - User identifier for consistent rollout
 */
export function isAppRouterEnabledForUser(userId: string): boolean {
  if (stryMutAct_9fa48("10890")) {
    {}
  } else {
    stryCov_9fa48("10890");
    const config = getFeatureFlagConfig();

    // If App Router is disabled globally, return false
    if (stryMutAct_9fa48("10893") ? false : stryMutAct_9fa48("10892") ? true : stryMutAct_9fa48("10891") ? config.appRouterEnabled : (stryCov_9fa48("10891", "10892", "10893"), !config.appRouterEnabled)) {
      if (stryMutAct_9fa48("10894")) {
        {}
      } else {
        stryCov_9fa48("10894");
        return stryMutAct_9fa48("10895") ? true : (stryCov_9fa48("10895"), false);
      }
    }

    // If rollout percentage is 100%, always enable
    if (stryMutAct_9fa48("10899") ? config.rolloutPercentage < 100 : stryMutAct_9fa48("10898") ? config.rolloutPercentage > 100 : stryMutAct_9fa48("10897") ? false : stryMutAct_9fa48("10896") ? true : (stryCov_9fa48("10896", "10897", "10898", "10899"), config.rolloutPercentage >= 100)) {
      if (stryMutAct_9fa48("10900")) {
        {}
      } else {
        stryCov_9fa48("10900");
        return stryMutAct_9fa48("10901") ? false : (stryCov_9fa48("10901"), true);
      }
    }

    // If rollout percentage is 0%, never enable
    if (stryMutAct_9fa48("10905") ? config.rolloutPercentage > 0 : stryMutAct_9fa48("10904") ? config.rolloutPercentage < 0 : stryMutAct_9fa48("10903") ? false : stryMutAct_9fa48("10902") ? true : (stryCov_9fa48("10902", "10903", "10904", "10905"), config.rolloutPercentage <= 0)) {
      if (stryMutAct_9fa48("10906")) {
        {}
      } else {
        stryCov_9fa48("10906");
        return stryMutAct_9fa48("10907") ? true : (stryCov_9fa48("10907"), false);
      }
    }

    // Use consistent hash-based rollout
    const hash = simpleHash(userId);
    const userPercentage = stryMutAct_9fa48("10908") ? hash * 100 : (stryCov_9fa48("10908"), hash % 100);
    return stryMutAct_9fa48("10912") ? userPercentage >= config.rolloutPercentage : stryMutAct_9fa48("10911") ? userPercentage <= config.rolloutPercentage : stryMutAct_9fa48("10910") ? false : stryMutAct_9fa48("10909") ? true : (stryCov_9fa48("10909", "10910", "10911", "10912"), userPercentage < config.rolloutPercentage);
  }
}

/**
 * Get the appropriate route path based on feature flags
 * @param route - The base route (e.g., 'auth/login')
 * @param appRouterPath - The App Router path
 * @param pagesRouterPath - The Pages Router path (fallback)
 */
export function getRoutePath(route: string, appRouterPath: string, pagesRouterPath: string): string {
  if (stryMutAct_9fa48("10913")) {
    {}
  } else {
    stryCov_9fa48("10913");
    const routeCategory = route.split(stryMutAct_9fa48("10914") ? "" : (stryCov_9fa48("10914"), '/'))[0];
    if (stryMutAct_9fa48("10916") ? false : stryMutAct_9fa48("10915") ? true : (stryCov_9fa48("10915", "10916"), isRouteAppRouter(routeCategory))) {
      if (stryMutAct_9fa48("10917")) {
        {}
      } else {
        stryCov_9fa48("10917");
        return appRouterPath;
      }
    }
    return pagesRouterPath;
  }
}

/**
 * Check if the current request should use App Router
 * @param pathname - The current pathname
 * @param userId - Optional user ID for percentage rollout
 */
export function shouldUseAppRouter(pathname: string, userId?: string): boolean {
  if (stryMutAct_9fa48("10918")) {
    {}
  } else {
    stryCov_9fa48("10918");
    const config = getFeatureFlagConfig();

    // If App Router is disabled globally, return false
    if (stryMutAct_9fa48("10921") ? false : stryMutAct_9fa48("10920") ? true : stryMutAct_9fa48("10919") ? config.appRouterEnabled : (stryCov_9fa48("10919", "10920", "10921"), !config.appRouterEnabled)) {
      if (stryMutAct_9fa48("10922")) {
        {}
      } else {
        stryCov_9fa48("10922");
        return stryMutAct_9fa48("10923") ? true : (stryCov_9fa48("10923"), false);
      }
    }

    // Extract route category from pathname
    const pathSegments = stryMutAct_9fa48("10924") ? pathname.split('/') : (stryCov_9fa48("10924"), pathname.split(stryMutAct_9fa48("10925") ? "" : (stryCov_9fa48("10925"), '/')).filter(stryMutAct_9fa48("10926") ? () => undefined : (stryCov_9fa48("10926"), segment => stryMutAct_9fa48("10929") ? segment === '' : stryMutAct_9fa48("10928") ? false : stryMutAct_9fa48("10927") ? true : (stryCov_9fa48("10927", "10928", "10929"), segment !== (stryMutAct_9fa48("10930") ? "Stryker was here!" : (stryCov_9fa48("10930"), ''))))));
    const routeCategory = pathSegments[0];

    // Check if this route category is enabled
    if (stryMutAct_9fa48("10933") ? false : stryMutAct_9fa48("10932") ? true : stryMutAct_9fa48("10931") ? config.enabledRoutes.includes(routeCategory) : (stryCov_9fa48("10931", "10932", "10933"), !config.enabledRoutes.includes(routeCategory))) {
      if (stryMutAct_9fa48("10934")) {
        {}
      } else {
        stryCov_9fa48("10934");
        return stryMutAct_9fa48("10935") ? true : (stryCov_9fa48("10935"), false);
      }
    }

    // If user ID is provided, check percentage rollout
    if (stryMutAct_9fa48("10938") ? userId || config.rolloutPercentage < 100 : stryMutAct_9fa48("10937") ? false : stryMutAct_9fa48("10936") ? true : (stryCov_9fa48("10936", "10937", "10938"), userId && (stryMutAct_9fa48("10941") ? config.rolloutPercentage >= 100 : stryMutAct_9fa48("10940") ? config.rolloutPercentage <= 100 : stryMutAct_9fa48("10939") ? true : (stryCov_9fa48("10939", "10940", "10941"), config.rolloutPercentage < 100)))) {
      if (stryMutAct_9fa48("10942")) {
        {}
      } else {
        stryCov_9fa48("10942");
        return isAppRouterEnabledForUser(userId);
      }
    }
    return stryMutAct_9fa48("10943") ? false : (stryCov_9fa48("10943"), true);
  }
}

/**
 * Log feature flag decision for debugging
 * @param context - Context information for logging
 * @param decision - The feature flag decision
 */
export function logFeatureFlagDecision(context: {
  route?: string;
  userId?: string;
  pathname?: string;
}, decision: boolean): void {
  if (stryMutAct_9fa48("10944")) {
    {}
  } else {
    stryCov_9fa48("10944");
    const config = getFeatureFlagConfig();
    if (stryMutAct_9fa48("10946") ? false : stryMutAct_9fa48("10945") ? true : (stryCov_9fa48("10945", "10946"), config.debugMode)) {
      if (stryMutAct_9fa48("10947")) {
        {}
      } else {
        stryCov_9fa48("10947");
        console.log(stryMutAct_9fa48("10948") ? "" : (stryCov_9fa48("10948"), '[Feature Flag]'), stryMutAct_9fa48("10949") ? {} : (stryCov_9fa48("10949"), {
          decision,
          config,
          context,
          timestamp: new Date().toISOString()
        }));
      }
    }
  }
}

/**
 * Simple hash function for consistent user rollout
 * @param str - String to hash
 */
function simpleHash(str: string): number {
  if (stryMutAct_9fa48("10950")) {
    {}
  } else {
    stryCov_9fa48("10950");
    let hash = 0;
    for (let i = 0; stryMutAct_9fa48("10953") ? i >= str.length : stryMutAct_9fa48("10952") ? i <= str.length : stryMutAct_9fa48("10951") ? false : (stryCov_9fa48("10951", "10952", "10953"), i < str.length); stryMutAct_9fa48("10954") ? i-- : (stryCov_9fa48("10954"), i++)) {
      if (stryMutAct_9fa48("10955")) {
        {}
      } else {
        stryCov_9fa48("10955");
        const char = str.charCodeAt(i);
        hash = stryMutAct_9fa48("10956") ? (hash << 5) - hash - char : (stryCov_9fa48("10956"), (stryMutAct_9fa48("10957") ? (hash << 5) + hash : (stryCov_9fa48("10957"), (hash << 5) - hash)) + char);
        hash = hash & hash; // Convert to 32-bit integer
      }
    }
    return Math.abs(hash);
  }
}

/**
 * Feature flag hook for React components
 */
export function useAppRouterFeatureFlag(route?: string, userId?: string) {
  if (stryMutAct_9fa48("10958")) {
    {}
  } else {
    stryCov_9fa48("10958");
    const isEnabled = isAppRouterEnabled();
    const isRouteEnabled = route ? isRouteAppRouter(route) : stryMutAct_9fa48("10959") ? true : (stryCov_9fa48("10959"), false);
    const isUserEnabled = userId ? isAppRouterEnabledForUser(userId) : stryMutAct_9fa48("10960") ? false : (stryCov_9fa48("10960"), true);
    const shouldUse = stryMutAct_9fa48("10963") ? isEnabled && isRouteEnabled || isUserEnabled : stryMutAct_9fa48("10962") ? false : stryMutAct_9fa48("10961") ? true : (stryCov_9fa48("10961", "10962", "10963"), (stryMutAct_9fa48("10965") ? isEnabled || isRouteEnabled : stryMutAct_9fa48("10964") ? true : (stryCov_9fa48("10964", "10965"), isEnabled && isRouteEnabled)) && isUserEnabled);
    return stryMutAct_9fa48("10966") ? {} : (stryCov_9fa48("10966"), {
      isAppRouterEnabled: isEnabled,
      isRouteEnabled,
      isUserEnabled,
      shouldUseAppRouter: shouldUse,
      config: getFeatureFlagConfig()
    });
  }
}

/**
 * Middleware helper for feature flag evaluation
 */
export function evaluateAppRouterForRequest(pathname: string, userId?: string): {
  shouldUseAppRouter: boolean;
  reason: string;
} {
  if (stryMutAct_9fa48("10967")) {
    {}
  } else {
    stryCov_9fa48("10967");
    const config = getFeatureFlagConfig();
    if (stryMutAct_9fa48("10970") ? false : stryMutAct_9fa48("10969") ? true : stryMutAct_9fa48("10968") ? config.appRouterEnabled : (stryCov_9fa48("10968", "10969", "10970"), !config.appRouterEnabled)) {
      if (stryMutAct_9fa48("10971")) {
        {}
      } else {
        stryCov_9fa48("10971");
        return stryMutAct_9fa48("10972") ? {} : (stryCov_9fa48("10972"), {
          shouldUseAppRouter: stryMutAct_9fa48("10973") ? true : (stryCov_9fa48("10973"), false),
          reason: stryMutAct_9fa48("10974") ? "" : (stryCov_9fa48("10974"), 'App Router globally disabled')
        });
      }
    }
    const pathSegments = stryMutAct_9fa48("10975") ? pathname.split('/') : (stryCov_9fa48("10975"), pathname.split(stryMutAct_9fa48("10976") ? "" : (stryCov_9fa48("10976"), '/')).filter(stryMutAct_9fa48("10977") ? () => undefined : (stryCov_9fa48("10977"), segment => stryMutAct_9fa48("10980") ? segment === '' : stryMutAct_9fa48("10979") ? false : stryMutAct_9fa48("10978") ? true : (stryCov_9fa48("10978", "10979", "10980"), segment !== (stryMutAct_9fa48("10981") ? "Stryker was here!" : (stryCov_9fa48("10981"), ''))))));
    const routeCategory = pathSegments[0];

    // Special handling for root route (/) - always use App Router when globally enabled
    if (stryMutAct_9fa48("10984") ? !routeCategory && routeCategory === '' : stryMutAct_9fa48("10983") ? false : stryMutAct_9fa48("10982") ? true : (stryCov_9fa48("10982", "10983", "10984"), (stryMutAct_9fa48("10985") ? routeCategory : (stryCov_9fa48("10985"), !routeCategory)) || (stryMutAct_9fa48("10987") ? routeCategory !== '' : stryMutAct_9fa48("10986") ? false : (stryCov_9fa48("10986", "10987"), routeCategory === (stryMutAct_9fa48("10988") ? "Stryker was here!" : (stryCov_9fa48("10988"), '')))))) {
      if (stryMutAct_9fa48("10989")) {
        {}
      } else {
        stryCov_9fa48("10989");
        return stryMutAct_9fa48("10990") ? {} : (stryCov_9fa48("10990"), {
          shouldUseAppRouter: stryMutAct_9fa48("10991") ? false : (stryCov_9fa48("10991"), true),
          reason: stryMutAct_9fa48("10992") ? "" : (stryCov_9fa48("10992"), 'Root route always uses App Router when globally enabled')
        });
      }
    }
    if (stryMutAct_9fa48("10995") ? false : stryMutAct_9fa48("10994") ? true : stryMutAct_9fa48("10993") ? config.enabledRoutes.includes(routeCategory) : (stryCov_9fa48("10993", "10994", "10995"), !config.enabledRoutes.includes(routeCategory))) {
      if (stryMutAct_9fa48("10996")) {
        {}
      } else {
        stryCov_9fa48("10996");
        return stryMutAct_9fa48("10997") ? {} : (stryCov_9fa48("10997"), {
          shouldUseAppRouter: stryMutAct_9fa48("10998") ? true : (stryCov_9fa48("10998"), false),
          reason: stryMutAct_9fa48("10999") ? `` : (stryCov_9fa48("10999"), `Route category '${routeCategory}' not enabled`)
        });
      }
    }
    if (stryMutAct_9fa48("11002") ? userId || config.rolloutPercentage < 100 : stryMutAct_9fa48("11001") ? false : stryMutAct_9fa48("11000") ? true : (stryCov_9fa48("11000", "11001", "11002"), userId && (stryMutAct_9fa48("11005") ? config.rolloutPercentage >= 100 : stryMutAct_9fa48("11004") ? config.rolloutPercentage <= 100 : stryMutAct_9fa48("11003") ? true : (stryCov_9fa48("11003", "11004", "11005"), config.rolloutPercentage < 100)))) {
      if (stryMutAct_9fa48("11006")) {
        {}
      } else {
        stryCov_9fa48("11006");
        const userEnabled = isAppRouterEnabledForUser(userId);
        if (stryMutAct_9fa48("11009") ? false : stryMutAct_9fa48("11008") ? true : stryMutAct_9fa48("11007") ? userEnabled : (stryCov_9fa48("11007", "11008", "11009"), !userEnabled)) {
          if (stryMutAct_9fa48("11010")) {
            {}
          } else {
            stryCov_9fa48("11010");
            return stryMutAct_9fa48("11011") ? {} : (stryCov_9fa48("11011"), {
              shouldUseAppRouter: stryMutAct_9fa48("11012") ? true : (stryCov_9fa48("11012"), false),
              reason: stryMutAct_9fa48("11013") ? `` : (stryCov_9fa48("11013"), `User not in rollout percentage (${config.rolloutPercentage}%)`)
            });
          }
        }
      }
    }
    return stryMutAct_9fa48("11014") ? {} : (stryCov_9fa48("11014"), {
      shouldUseAppRouter: stryMutAct_9fa48("11015") ? false : (stryCov_9fa48("11015"), true),
      reason: stryMutAct_9fa48("11016") ? "" : (stryCov_9fa48("11016"), 'All feature flag conditions met')
    });
  }
}