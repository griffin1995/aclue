import { type ReactNode } from 'react'
import ServerHeader from './ServerHeader'
import ServerFooter from './ServerFooter'

interface ServerLayoutProps {
  children: ReactNode
  showHeader?: boolean
  showFooter?: boolean
  className?: string
}

/**
 * Server Layout Component
 *
 * Main layout wrapper that provides consistent structure across all pages.
 * This component is rendered on the server for optimal performance.
 *
 * Features:
 * - Server-side rendering for faster initial load
 * - Consistent header/footer structure
 * - Flexible content area
 * - SEO-optimised structure
 *
 * @param children - Page content
 * @param showHeader - Whether to show the header (default: true)
 * @param showFooter - Whether to show the footer (default: true)
 * @param className - Additional CSS classes
 */
export default function ServerLayout({
  children,
  showHeader = true,
  showFooter = true,
  className = ''
}: ServerLayoutProps) {
  return (
    <div className={`min-h-screen flex flex-col ${className}`}>
      {showHeader && <ServerHeader />}

      <main className="flex-1 w-full">
        {children}
      </main>

      {showFooter && <ServerFooter />}
    </div>
  )
}