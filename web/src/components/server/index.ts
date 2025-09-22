/**
 * Server Components Library - Export Index
 *
 * This file exports all server components for the Aclue platform.
 * Server components are rendered on the server and provide performance
 * benefits through reduced client-side JavaScript and faster initial page loads.
 *
 * Component Categories:
 * - Layout components (headers, footers, navigation)
 * - Auth components (authentication UI, user data)
 * - Product components (listings, details, recommendations)
 * - Data components (API data fetching, database queries)
 *
 * Usage:
 *   import { ServerHeader, ServerNavigation } from '@/components/server'
 */

// Layout Components
export { default as ServerLayout } from './layout/ServerLayout'
export { default as ServerHeader } from './layout/ServerHeader'
export { default as ServerFooter } from './layout/ServerFooter'
export { default as ServerNavigation } from './layout/ServerNavigation'

// Auth Components
export { default as ServerAuthProvider } from './auth/ServerAuthProvider'
export { default as ServerUserProfile } from './auth/ServerUserProfile'
export { default as ServerSessionManager } from './auth/ServerSessionManager'

// Product Components
export { default as ServerProductList } from './products/ServerProductList'
export { default as ServerProductCard } from './products/ServerProductCard'
export { default as ServerRecommendations } from './products/ServerRecommendations'

// Data Components
export { default as ServerDataFetcher } from './data/ServerDataFetcher'
export { default as ServerErrorBoundary } from './error/ServerErrorBoundary'

// UI Components
export { default as ServerSkeleton } from './ui/ServerSkeleton'
export { default as ServerLoadingSpinner } from './ui/ServerLoadingSpinner'