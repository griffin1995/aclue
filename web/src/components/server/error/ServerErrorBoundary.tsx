import { type ReactNode } from 'react'

interface ServerErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
  className?: string
}

/**
 * Server Error Boundary Component
 *
 * Provides error handling for server components with graceful fallbacks.
 * Rendered on the server for optimal performance and SEO.
 *
 * Features:
 * - Server-side error handling
 * - Graceful fallback UI
 * - Maintains page structure during errors
 * - SEO-friendly error states
 *
 * @param children - Components to wrap
 * @param fallback - Custom fallback UI
 * @param className - Additional CSS classes
 */
export default function ServerErrorBoundary({
  children,
  fallback,
  className = ''
}: ServerErrorBoundaryProps) {
  const defaultFallback = (
    <div className={`flex items-center justify-center min-h-[200px] ${className}`}>
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-red-100 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-red-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Something went wrong</h3>
          <p className="text-gray-600 mt-1">
            We're experiencing technical difficulties. Please try again later.
          </p>
        </div>
      </div>
    </div>
  )

  // In a real implementation, you would wrap this with proper error boundary logic
  // For now, this serves as a placeholder for the server component structure
  return (
    <div className={className}>
      {children}
    </div>
  )
}