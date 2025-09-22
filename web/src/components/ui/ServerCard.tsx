/**
 * Server Card Component - Server-First UI Pattern
 *
 * Server-rendered card component for displaying content blocks.
 * Optimized for performance with server-side rendering and clean semantics.
 *
 * Features:
 * - Server-side rendering for immediate visibility
 * - Multiple variants and layouts
 * - Responsive design built-in
 * - Accessibility optimized
 * - Performance focused
 */

interface ServerCardProps {
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  className?: string
  hover?: boolean
}

export default function ServerCard({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  hover = false
}: ServerCardProps) {
  const baseStyles = 'rounded-2xl transition-all duration-200'

  const variantStyles = {
    default: 'bg-white',
    elevated: 'bg-white shadow-lg',
    bordered: 'bg-white border border-gray-200',
    gradient: 'bg-gradient-to-br from-primary-50 to-secondary-50'
  }

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8'
  }

  const hoverStyles = hover ? 'hover:shadow-lg hover:-translate-y-1' : ''

  const classes = `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`.trim()

  return (
    <div className={classes}>
      {children}
    </div>
  )
}

/**
 * Server Card Header - Card section component
 */
interface ServerCardHeaderProps {
  children: React.ReactNode
  className?: string
}

export function ServerCardHeader({ children, className = '' }: ServerCardHeaderProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {children}
    </div>
  )
}

/**
 * Server Card Content - Card section component
 */
interface ServerCardContentProps {
  children: React.ReactNode
  className?: string
}

export function ServerCardContent({ children, className = '' }: ServerCardContentProps) {
  return (
    <div className={`${className}`}>
      {children}
    </div>
  )
}

/**
 * Server Card Footer - Card section component
 */
interface ServerCardFooterProps {
  children: React.ReactNode
  className?: string
}

export function ServerCardFooter({ children, className = '' }: ServerCardFooterProps) {
  return (
    <div className={`mt-4 ${className}`}>
      {children}
    </div>
  )
}