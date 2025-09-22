/**
 * Feature Flag System for App Router Migration
 *
 * This system provides gradual rollout control for the Pages Router to App Router migration.
 * It allows for safe, incremental deployment of App Router pages while maintaining
 * fallback to Pages Router for stability.
 *
 * Features:
 * - Environment-based feature flagging
 * - Route-specific App Router enablement
 * - Runtime feature flag evaluation
 * - Rollback capability through environment variables
 *
 * Usage:
 *   const enabled = isAppRouterEnabled()
 *   const routeEnabled = isRouteAppRouter('auth')
 *   const userEnabled = isAppRouterEnabledForUser(userId)
 *
 * Environment Variables:
 *   NEXT_PUBLIC_APP_ROUTER_ENABLED=true|false
 *   NEXT_PUBLIC_APP_ROUTER_ROUTES=auth,products,marketing
 *   NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE=25
 */

export interface FeatureFlagConfig {
  appRouterEnabled: boolean
  enabledRoutes: string[]
  rolloutPercentage: number
  debugMode: boolean
}

/**
 * Get the current feature flag configuration from environment variables
 */
export function getFeatureFlagConfig(): FeatureFlagConfig {
  const appRouterEnabled = process.env.NEXT_PUBLIC_APP_ROUTER_ENABLED === 'true'
  const enabledRoutesEnv = process.env.NEXT_PUBLIC_APP_ROUTER_ROUTES || ''
  const enabledRoutes = enabledRoutesEnv.split(',').filter(route => route.trim() !== '')
  const rolloutPercentage = parseInt(process.env.NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE || '0', 10)
  const debugMode = process.env.NODE_ENV === 'development'

  return {
    appRouterEnabled,
    enabledRoutes,
    rolloutPercentage: Math.max(0, Math.min(100, rolloutPercentage)),
    debugMode
  }
}

/**
 * Check if App Router is globally enabled
 */
export function isAppRouterEnabled(): boolean {
  const config = getFeatureFlagConfig()
  return config.appRouterEnabled
}

/**
 * Check if a specific route should use App Router
 * @param route - The route to check (e.g., 'auth', 'products', 'marketing')
 */
export function isRouteAppRouter(route: string): boolean {
  const config = getFeatureFlagConfig()

  // If App Router is disabled globally, return false
  if (!config.appRouterEnabled) {
    return false
  }

  // Check if the specific route is enabled
  return config.enabledRoutes.includes(route.toLowerCase())
}

/**
 * Check if App Router should be enabled for a specific user (percentage rollout)
 * @param userId - User identifier for consistent rollout
 */
export function isAppRouterEnabledForUser(userId: string): boolean {
  const config = getFeatureFlagConfig()

  // If App Router is disabled globally, return false
  if (!config.appRouterEnabled) {
    return false
  }

  // If rollout percentage is 100%, always enable
  if (config.rolloutPercentage >= 100) {
    return true
  }

  // If rollout percentage is 0%, never enable
  if (config.rolloutPercentage <= 0) {
    return false
  }

  // Use consistent hash-based rollout
  const hash = simpleHash(userId)
  const userPercentage = hash % 100

  return userPercentage < config.rolloutPercentage
}

/**
 * Get the appropriate route path based on feature flags
 * @param route - The base route (e.g., 'auth/login')
 * @param appRouterPath - The App Router path
 * @param pagesRouterPath - The Pages Router path (fallback)
 */
export function getRoutePath(
  route: string,
  appRouterPath: string,
  pagesRouterPath: string
): string {
  const routeCategory = route.split('/')[0]

  if (isRouteAppRouter(routeCategory)) {
    return appRouterPath
  }

  return pagesRouterPath
}

/**
 * Check if the current request should use App Router
 * @param pathname - The current pathname
 * @param userId - Optional user ID for percentage rollout
 */
export function shouldUseAppRouter(pathname: string, userId?: string): boolean {
  const config = getFeatureFlagConfig()

  // If App Router is disabled globally, return false
  if (!config.appRouterEnabled) {
    return false
  }

  // Extract route category from pathname
  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const routeCategory = pathSegments[0]

  // Check if this route category is enabled
  if (!config.enabledRoutes.includes(routeCategory)) {
    return false
  }

  // If user ID is provided, check percentage rollout
  if (userId && config.rolloutPercentage < 100) {
    return isAppRouterEnabledForUser(userId)
  }

  return true
}

/**
 * Log feature flag decision for debugging
 * @param context - Context information for logging
 * @param decision - The feature flag decision
 */
export function logFeatureFlagDecision(
  context: {
    route?: string
    userId?: string
    pathname?: string
  },
  decision: boolean
): void {
  const config = getFeatureFlagConfig()

  if (config.debugMode) {
    console.log('[Feature Flag]', {
      decision,
      config,
      context,
      timestamp: new Date().toISOString()
    })
  }
}

/**
 * Simple hash function for consistent user rollout
 * @param str - String to hash
 */
function simpleHash(str: string): number {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // Convert to 32-bit integer
  }
  return Math.abs(hash)
}

/**
 * Feature flag hook for React components
 */
export function useAppRouterFeatureFlag(route?: string, userId?: string) {
  const isEnabled = isAppRouterEnabled()
  const isRouteEnabled = route ? isRouteAppRouter(route) : false
  const isUserEnabled = userId ? isAppRouterEnabledForUser(userId) : true

  const shouldUse = isEnabled && isRouteEnabled && isUserEnabled

  return {
    isAppRouterEnabled: isEnabled,
    isRouteEnabled,
    isUserEnabled,
    shouldUseAppRouter: shouldUse,
    config: getFeatureFlagConfig()
  }
}

/**
 * Middleware helper for feature flag evaluation
 */
export function evaluateAppRouterForRequest(
  pathname: string,
  userId?: string
): {
  shouldUseAppRouter: boolean
  reason: string
} {
  const config = getFeatureFlagConfig()

  if (!config.appRouterEnabled) {
    return {
      shouldUseAppRouter: false,
      reason: 'App Router globally disabled'
    }
  }

  const pathSegments = pathname.split('/').filter(segment => segment !== '')
  const routeCategory = pathSegments[0]

  if (!config.enabledRoutes.includes(routeCategory)) {
    return {
      shouldUseAppRouter: false,
      reason: `Route category '${routeCategory}' not enabled`
    }
  }

  if (userId && config.rolloutPercentage < 100) {
    const userEnabled = isAppRouterEnabledForUser(userId)
    if (!userEnabled) {
      return {
        shouldUseAppRouter: false,
        reason: `User not in rollout percentage (${config.rolloutPercentage}%)`
      }
    }
  }

  return {
    shouldUseAppRouter: true,
    reason: 'All feature flag conditions met'
  }
}