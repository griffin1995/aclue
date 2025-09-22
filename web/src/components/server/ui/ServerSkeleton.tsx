interface ServerSkeletonProps {
  className?: string
  lines?: number
  width?: 'full' | 'half' | 'quarter' | 'three-quarters'
  height?: 'sm' | 'md' | 'lg' | 'xl'
  variant?: 'text' | 'circular' | 'rectangular' | 'card'
}

/**
 * Server Skeleton Component
 *
 * Loading placeholder rendered on the server for consistent UI.
 * Provides visual feedback while content loads.
 *
 * Features:
 * - Server-side rendering for instant display
 * - Multiple variants (text, card, circular, rectangular)
 * - Customisable dimensions
 * - Accessibility support
 *
 * @param className - Additional CSS classes
 * @param lines - Number of skeleton lines (for text variant)
 * @param width - Skeleton width preset
 * @param height - Skeleton height preset
 * @param variant - Skeleton style variant
 */
export default function ServerSkeleton({
  className = '',
  lines = 3,
  width = 'full',
  height = 'md',
  variant = 'text'
}: ServerSkeletonProps) {
  const widthClasses = {
    'full': 'w-full',
    'half': 'w-1/2',
    'quarter': 'w-1/4',
    'three-quarters': 'w-3/4'
  }

  const heightClasses = {
    'sm': 'h-4',
    'md': 'h-6',
    'lg': 'h-8',
    'xl': 'h-12'
  }

  const baseClasses = 'animate-pulse bg-gray-200 rounded'

  if (variant === 'text') {
    return (
      <div className={`space-y-2 ${className}`} role="status" aria-label="Loading content">
        {Array.from({ length: lines }, (_, index) => {
          const lineWidth = index === lines - 1 ? 'three-quarters' : 'full'
          return (
            <div
              key={index}
              className={`${baseClasses} ${widthClasses[lineWidth]} ${heightClasses[height]}`}
            />
          )
        })}
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === 'circular') {
    return (
      <div className={className} role="status" aria-label="Loading content">
        <div className={`${baseClasses} rounded-full ${heightClasses[height]} ${heightClasses[height]}`} />
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  if (variant === 'card') {
    return (
      <div className={`${baseClasses} p-6 ${className}`} role="status" aria-label="Loading content">
        <div className="space-y-4">
          <div className={`${baseClasses} h-6 w-3/4`} />
          <div className={`${baseClasses} h-4 w-full`} />
          <div className={`${baseClasses} h-4 w-5/6`} />
          <div className={`${baseClasses} h-4 w-2/3`} />
        </div>
        <span className="sr-only">Loading...</span>
      </div>
    )
  }

  // Default rectangular variant
  return (
    <div className={className} role="status" aria-label="Loading content">
      <div className={`${baseClasses} ${widthClasses[width]} ${heightClasses[height]}`} />
      <span className="sr-only">Loading...</span>
    </div>
  )
}