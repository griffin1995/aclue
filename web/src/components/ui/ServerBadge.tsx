/**
 * Server Badge Component - Server-First UI Pattern
 *
 * Server-rendered badge component for status indicators, tags, and labels.
 * Optimized for immediate visibility and semantic clarity.
 *
 * Features:
 * - Server-side rendering for instant display
 * - Multiple variants and sizes
 * - Icon support
 * - Accessibility built-in
 * - Semantic HTML structure
 */

interface ServerBadgeProps {
  children: React.ReactNode
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral'
  size?: 'sm' | 'md' | 'lg'
  icon?: React.ReactNode
  className?: string
}

export default function ServerBadge({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  className = ''
}: ServerBadgeProps) {
  const baseStyles = 'inline-flex items-center gap-2 font-medium rounded-full'

  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
    info: 'bg-blue-100 text-blue-800',
    neutral: 'bg-gray-100 text-gray-800'
  }

  const sizeStyles = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  }

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  }

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`.trim()

  return (
    <span className={classes}>
      {icon && (
        <span className={iconSizes[size]}>
          {icon}
        </span>
      )}
      {children}
    </span>
  )
}