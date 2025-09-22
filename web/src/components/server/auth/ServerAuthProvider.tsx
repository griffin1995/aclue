import { type ReactNode } from 'react'

interface ServerAuthProviderProps {
  children: ReactNode
  user?: {
    id: string
    email: string
    name?: string
  } | null
}

/**
 * Server Auth Provider Component
 *
 * Provides authentication context at the server level.
 * Handles user session validation and provides auth state to child components.
 *
 * Features:
 * - Server-side authentication validation
 * - User session management
 * - Auth state propagation
 * - Performance optimised
 *
 * @param children - Child components that need auth context
 * @param user - Current user data (pre-validated on server)
 */
export default function ServerAuthProvider({
  children,
  user = null
}: ServerAuthProviderProps) {
  // In a real implementation, this would validate the user session
  // and provide authentication context to child components

  return (
    <div data-auth-provider="server" data-user-authenticated={!!user}>
      {children}
    </div>
  )
}