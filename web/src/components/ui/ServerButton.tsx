import Link from 'next/link'
import { ArrowRight, ExternalLink } from 'lucide-react'

/**
 * Server Button Component - Server-First UI Pattern
 *
 * Server-rendered button component with support for both internal links and external links.
 * Optimized for performance with server-side rendering and progressive enhancement.
 *
 * Features:
 * - Server-side rendering for immediate visibility
 * - Multiple variants and sizes
 * - Link and button modes
 * - Accessibility built-in
 * - Performance optimized
 */

interface ServerButtonProps {
  children: React.ReactNode
  href?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  icon?: 'arrow' | 'external' | React.ReactNode
  className?: string
  disabled?: boolean
  external?: boolean
}

export default function ServerButton({
  children,
  href,
  variant = 'primary',
  size = 'md',
  icon,
  className = '',
  disabled = false,
  external = false
}: ServerButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2'

  const variantStyles = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50 focus:ring-primary-500',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500'
  }

  const sizeStyles = {
    sm: 'px-4 py-2 text-sm rounded-lg',
    md: 'px-6 py-3 text-base rounded-lg',
    lg: 'px-8 py-4 text-lg rounded-xl'
  }

  const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : ''

  const classes = `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`.trim()

  const renderIcon = () => {
    if (icon === 'arrow') return <ArrowRight className="w-5 h-5" />
    if (icon === 'external') return <ExternalLink className="w-5 h-5" />
    if (React.isValidElement(icon)) return icon
    return null
  }

  if (href) {
    if (external) {
      return (
        <a
          href={href}
          className={classes}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={disabled}
        >
          {children}
          {renderIcon()}
        </a>
      )
    }

    return (
      <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
        {renderIcon()}
      </Link>
    )
  }

  return (
    <button
      className={classes}
      disabled={disabled}
      type="button"
    >
      {children}
      {renderIcon()}
    </button>
  )
}