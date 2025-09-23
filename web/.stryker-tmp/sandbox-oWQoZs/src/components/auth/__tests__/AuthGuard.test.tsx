/**
 * AuthGuard Component Test Suite
 * 
 * Comprehensive tests for the authentication guard component that protects
 * routes and ensures proper access control throughout the application.
 * 
 * Test Coverage:
 * - Authentication state validation
 * - Route protection and redirection logic
 * - Loading states and user experience
 * - Error handling and edge cases
 * - Integration with authentication context
 * 
 * Testing Strategy:
 * Based on React Testing Library patterns for user-centric testing,
 * focusing on behaviour rather than implementation details.
 * 
 * Authentication Context:
 * Tests the integration with AuthContext and proper handling of
 * authenticated vs unauthenticated states for route protection.
 */
// @ts-nocheck


// ==============================================================================
// IMPORTS AND DEPENDENCIES
// ==============================================================================

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/router';
import { AuthGuard } from '../AuthGuard';
import { useAuth } from '@/hooks/useAuth';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

// Mock authentication hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// ==============================================================================
// TEST SETUP AND UTILITIES
// ==============================================================================

// Mock router implementation
const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  pathname: '/dashboard',
  query: {},
  asPath: '/dashboard',
};

// Mock child component for testing
const MockChildComponent = () => <div>Protected Content</div>;

// Test wrapper component
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <div data-testid="test-wrapper">{children}</div>;
};

// ==============================================================================
// AUTHENTICATION GUARD TESTS
// ==============================================================================

describe('AuthGuard Component', () => {
  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Authenticated User Access', () => {
    /**
     * Test authenticated user can access protected content.
     * 
     * Validates that when user is properly authenticated,
     * the AuthGuard renders children without redirecting.
     * 
     * Business Context:
     * Authenticated users should have seamless access to protected
     * routes without unnecessary redirects or loading states.
     */
    it('should render protected content for authenticated users', async () => {
      // Mock authenticated user state
      (useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-123',
          email: 'test@aclue.app',
          firstName: 'Test',
          lastName: 'User',
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Render AuthGuard with protected content
      render(
        <AuthGuard>
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify protected content is rendered
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      
      // Verify no redirect occurred
      expect(mockPush).not.toHaveBeenCalled();
    });

    /**
     * Test AuthGuard handles user data properly.
     * 
     * Validates that user information is correctly processed
     * and available to child components through context.
     */
    it('should provide user context to protected components', async () => {
      const mockUser = {
        id: 'user-456',
        email: 'premium@aclue.app',
        firstName: 'Premium',
        lastName: 'User',
        subscriptionTier: 'premium',
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // Test component that uses auth context
      const TestChildComponent = () => {
        const { user } = useAuth();
        return (
          <div>
            <span data-testid="user-email">{user?.email}</span>
            <span data-testid="user-name">{user?.firstName} {user?.lastName}</span>
          </div>
        );
      };

      render(
        <AuthGuard>
          <TestChildComponent />
        </AuthGuard>
      );

      // Verify user data is accessible
      expect(screen.getByTestId('user-email')).toHaveTextContent('premium@aclue.app');
      expect(screen.getByTestId('user-name')).toHaveTextContent('Premium User');
    });
  });

  describe('Unauthenticated User Handling', () => {
    /**
     * Test unauthenticated user redirection to login.
     * 
     * Validates that users without valid authentication
     * are redirected to the login page with proper return URL.
     * 
     * Security Context:
     * Critical security feature ensuring protected routes
     * are not accessible without proper authentication.
     */
    it('should redirect unauthenticated users to login', async () => {
      // Mock unauthenticated state
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      // Render AuthGuard
      render(
        <AuthGuard>
          <MockChildComponent />
        </AuthGuard>
      );

      // Wait for redirect to occur
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login?returnUrl=/dashboard');
      });

      // Verify protected content is not rendered
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    /**
     * Test proper return URL construction for redirects.
     * 
     * Validates that users are redirected back to their original
     * destination after successful authentication.
     */
    it('should preserve return URL for post-login redirect', async () => {
      // Mock complex route with query parameters
      (useRouter as jest.Mock).mockReturnValue({
        ...mockRouter,
        asPath: '/dashboard/recommendations?category=electronics&price=100-500',
      });

      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      render(
        <AuthGuard>
          <MockChildComponent />
        </AuthGuard>
      );

      // Wait for redirect with encoded return URL
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith(
          '/auth/login?returnUrl=' + 
          encodeURIComponent('/dashboard/recommendations?category=electronics&price=100-500')
        );
      });
    });
  });

  describe('Loading States', () => {
    /**
     * Test loading state display during authentication check.
     * 
     * Validates that appropriate loading UI is shown while
     * authentication status is being determined.
     * 
     * User Experience Context:
     * Prevents flash of unauthenticated content and provides
     * smooth loading experience during auth state resolution.
     */
    it('should display loading state during authentication check', () => {
      // Mock loading authentication state
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
      });

      render(
        <AuthGuard>
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify loading indicator is displayed
      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
      
      // Verify no redirect during loading
      expect(mockPush).not.toHaveBeenCalled();
    });

    /**
     * Test loading state with custom loading component.
     * 
     * Validates that custom loading components can be provided
     * for branded loading experiences.
     */
    it('should render custom loading component when provided', () => {
      const CustomLoader = () => (
        <div data-testid="custom-loader">
          <div className="spinner" />
          <span>Authenticating...</span>
        </div>
      );

      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: true,
        error: null,
      });

      render(
        <AuthGuard loadingComponent={<CustomLoader />}>
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify custom loading component is rendered
      expect(screen.getByTestId('custom-loader')).toBeInTheDocument();
      expect(screen.getByText('Authenticating...')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    /**
     * Test authentication error handling and display.
     * 
     * Validates that authentication errors are properly handled
     * with appropriate error messages and recovery options.
     * 
     * Error Handling Context:
     * Users should be informed of authentication failures
     * with clear next steps for resolution.
     */
    it('should handle and display authentication errors', () => {
      const authError = {
        message: 'Authentication failed',
        code: 'AUTH_ERROR',
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: authError,
      });

      render(
        <AuthGuard>
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify error message is displayed
      expect(screen.getByText('Authentication Error')).toBeInTheDocument();
      expect(screen.getByText('Authentication failed')).toBeInTheDocument();
      
      // Verify protected content is not rendered
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    /**
     * Test token expiration handling.
     * 
     * Validates that expired tokens are handled gracefully
     * with automatic redirect to login for re-authentication.
     */
    it('should handle token expiration gracefully', async () => {
      const tokenExpiredError = {
        message: 'Token has expired',
        code: 'TOKEN_EXPIRED',
      };

      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: tokenExpiredError,
      });

      render(
        <AuthGuard>
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify redirect to login occurs
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login?returnUrl=/dashboard');
      });
    });
  });

  describe('Role-Based Access Control', () => {
    /**
     * Test role-based access restrictions.
     * 
     * Validates that users with insufficient permissions
     * are properly restricted from accessing protected content.
     * 
     * Authorization Context:
     * Different user roles (free, premium, admin) should have
     * appropriate access controls for feature gating.
     */
    it('should restrict access based on required roles', () => {
      // Mock user with basic role
      (useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-789',
          email: 'basic@aclue.app',
          firstName: 'Basic',
          lastName: 'User',
          subscriptionTier: 'free',
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // AuthGuard with premium role requirement
      render(
        <AuthGuard requiredRole="premium">
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify access denied message
      expect(screen.getByText('Access Denied')).toBeInTheDocument();
      expect(screen.getByText('Upgrade to Premium')).toBeInTheDocument();
      expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    });

    /**
     * Test successful role-based access.
     * 
     * Validates that users with sufficient permissions
     * can access role-protected content.
     */
    it('should grant access to users with sufficient roles', () => {
      // Mock user with premium role
      (useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-890',
          email: 'premium@aclue.app',
          firstName: 'Premium',
          lastName: 'User',
          subscriptionTier: 'premium',
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      // AuthGuard with premium role requirement
      render(
        <AuthGuard requiredRole="premium">
          <MockChildComponent />
        </AuthGuard>
      );

      // Verify access granted
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(screen.queryByText('Access Denied')).not.toBeInTheDocument();
    });
  });

  describe('Integration Tests', () => {
    /**
     * Test integration with authentication context changes.
     * 
     * Validates that AuthGuard properly responds to changes
     * in authentication state during component lifecycle.
     */
    it('should respond to authentication state changes', async () => {
      // Start with unauthenticated state
      const { rerender } = render(
        <TestWrapper>
          <AuthGuard>
            <MockChildComponent />
          </AuthGuard>
        </TestWrapper>
      );

      // Initially unauthenticated
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });

      rerender(
        <TestWrapper>
          <AuthGuard>
            <MockChildComponent />
          </AuthGuard>
        </TestWrapper>
      );

      // Should redirect to login
      await waitFor(() => {
        expect(mockPush).toHaveBeenCalledWith('/auth/login?returnUrl=/dashboard');
      });

      // Clear the mock and update to authenticated state
      mockPush.mockClear();
      (useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-991',
          email: 'newauth@aclue.app',
          firstName: 'New',
          lastName: 'User',
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      rerender(
        <TestWrapper>
          <AuthGuard>
            <MockChildComponent />
          </AuthGuard>
        </TestWrapper>
      );

      // Should now render protected content
      expect(screen.getByText('Protected Content')).toBeInTheDocument();
      expect(mockPush).not.toHaveBeenCalled();
    });

    /**
     * Test AuthGuard with multiple children components.
     * 
     * Validates that complex component trees are properly
     * handled within authentication protection.
     */
    it('should handle complex component trees', () => {
      (useAuth as jest.Mock).mockReturnValue({
        user: {
          id: 'user-992',
          email: 'complex@aclue.app',
          firstName: 'Complex',
          lastName: 'User',
        },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });

      const ComplexChildren = () => (
        <div>
          <header data-testid="protected-header">Protected Header</header>
          <main data-testid="protected-main">
            <section data-testid="protected-section">Protected Section</section>
          </main>
          <footer data-testid="protected-footer">Protected Footer</footer>
        </div>
      );

      render(
        <AuthGuard>
          <ComplexChildren />
        </AuthGuard>
      );

      // Verify all protected elements are rendered
      expect(screen.getByTestId('protected-header')).toBeInTheDocument();
      expect(screen.getByTestId('protected-main')).toBeInTheDocument();
      expect(screen.getByTestId('protected-section')).toBeInTheDocument();
      expect(screen.getByTestId('protected-footer')).toBeInTheDocument();
    });
  });
});