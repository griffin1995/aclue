/**
 * Server Icon Component - Server-First UI Pattern
 *
 * Server-rendered icon wrapper component with consistent sizing and styling.
 * Provides a unified approach to icon usage across the application.
 *
 * Features:
 * - Server-side rendering for immediate display
 * - Consistent sizing system
 * - Color variants
 * - Accessibility attributes
 * - Performance optimized
 */

interface ServerIconProps {
  icon: React.ReactNode
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
  background?: boolean
  className?: string
  'aria-label'?: string
}

export default function ServerIcon({
  icon,
  size = 'md',
  variant = 'default',
  background = false,
  className = '',
  'aria-label': ariaLabel
}: ServerIconProps) {
  const sizeStyles = {
    xs: 'w-4 h-4',
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-10 h-10',
    '2xl': 'w-12 h-12'
  }

  const backgroundSizes = {
    xs: 'w-8 h-8 p-1',
    sm: 'w-10 h-10 p-1.5',
    md: 'w-12 h-12 p-1.5',
    lg: 'w-16 h-16 p-2',
    xl: 'w-20 h-20 p-2.5',
    '2xl': 'w-24 h-24 p-3'
  }

  const variantStyles = {
    default: 'text-gray-600',
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600'
  }

  const backgroundVariants = {
    default: 'bg-gray-100',
    primary: 'bg-primary-100',
    secondary: 'bg-secondary-100',
    success: 'bg-green-100',
    warning: 'bg-yellow-100',
    error: 'bg-red-100'
  }

  if (background) {
    const backgroundClasses = `inline-flex items-center justify-center rounded-2xl ${backgroundSizes[size]} ${backgroundVariants[variant]} ${variantStyles[variant]} ${className}`.trim()

    return (
      <div className={backgroundClasses} aria-label={ariaLabel}>
        <span className={sizeStyles[size]}>
          {icon}
        </span>
      </div>
    )
  }

  const iconClasses = `inline-flex ${sizeStyles[size]} ${variantStyles[variant]} ${className}`.trim()

  return (
    <span className={iconClasses} aria-label={ariaLabel}>
      {icon}
    </span>
  )
}