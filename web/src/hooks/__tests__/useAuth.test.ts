/**
 * useAuth Hook Test Suite
 * 
 * Comprehensive tests for the authentication hook that manages user
 * authentication state, token handling, and authentication workflows.
 * 
 * Test Coverage:
 * - Authentication state management
 * - Login and logout functionality
 * - Token refresh and validation
 * - Error handling and recovery
 * - Local storage integration
 * - API integration with backend
 * 
 * Testing Strategy:
 * Hook testing with React Testing Library's renderHook utility,
 * focusing on state transitions, side effects, and integration
 * with authentication services.
 * 
 * Business Context:
 * Authentication is critical for user experience and security,
 * requiring robust testing of all authentication flows and edge cases.
 */

// ==============================================================================
// IMPORTS AND DEPENDENCIES
// ==============================================================================

import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';
import * as api from '@/lib/api';

// Mock API functions
jest.mock('@/lib/api', () => ({
  login: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  getCurrentUser: jest.fn(),
}));

// Mock localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
});

// ==============================================================================
// TEST UTILITIES
// ==============================================================================

// Mock user data
const mockUser = {
  id: 'user-123',
  email: 'test@aclue.app',
  firstName: 'Test',
  lastName: 'User',
  subscriptionTier: 'free',
  createdAt: '2025-01-01T00:00:00Z',
  emailVerified: true,
};

// Mock authentication response
const mockAuthResponse = {
  access_token: 'mock-access-token',
  refresh_token: 'mock-refresh-token',
  user: mockUser,
};

// Mock login credentials
const mockCredentials = {
  email: 'test@aclue.app',
  password: 'testpassword123',
};

// Mock registration data
const mockRegistrationData = {
  email: 'new@aclue.app',
  password: 'newpassword123',
  firstName: 'New',
  lastName: 'User',
  marketingConsent: false,
};

// ==============================================================================
// AUTHENTICATION HOOK TESTS
// ==============================================================================

describe('useAuth Hook', () => {
  // Clear mocks and storage before each test
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  describe('Initial State', () => {
    /**
     * Test initial authentication state.
     * 
     * Validates that the hook initializes with proper default
     * state before any authentication operations.
     */
    it('should initialize with default unauthenticated state', () => {
      const { result } = renderHook(() => useAuth());
      
      expect(result.current.user).toBeNull();
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
      expect(result.current.tokens).toBeNull();
    });

    /**
     * Test automatic authentication restoration from storage.
     * 
     * Validates that valid tokens stored in localStorage
     * are automatically used to restore authentication state.
     */
    it('should restore authentication from stored tokens', async () => {
      // Mock stored tokens
      mockLocalStorage.setItem('access_token', 'stored-access-token');
      mockLocalStorage.setItem('refresh_token', 'stored-refresh-token');
      
      // Mock successful user retrieval
      (api.getCurrentUser as jest.Mock).mockResolvedValue(mockUser);
      
      const { result } = renderHook(() => useAuth());
      
      // Should start loading
      expect(result.current.isLoading).toBe(true);
      
      // Wait for authentication restoration
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Verify authenticated state
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.tokens).toEqual({
        accessToken: 'stored-access-token',
        refreshToken: 'stored-refresh-token',
      });
      
      // Verify API call
      expect(api.getCurrentUser).toHaveBeenCalledWith('stored-access-token');
    });

    /**
     * Test handling of invalid stored tokens.
     * 
     * Validates that invalid or expired tokens are properly
     * cleared and the user remains unauthenticated.
     */
    it('should handle invalid stored tokens gracefully', async () => {
      // Mock stored tokens
      mockLocalStorage.setItem('access_token', 'invalid-token');
      mockLocalStorage.setItem('refresh_token', 'invalid-refresh');
      
      // Mock API error for invalid token
      (api.getCurrentUser as jest.Mock).mockRejectedValue(
        new Error('Invalid token')
      );
      
      const { result } = renderHook(() => useAuth());
      
      // Wait for token validation to fail
      await waitFor(() => {
        expect(result.current.isLoading).toBe(false);
      });
      
      // Verify tokens were cleared
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.tokens).toBeNull();
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Login Functionality', () => {
    /**
     * Test successful user login.
     * 
     * Validates that login credentials are properly processed,
     * tokens are stored, and authentication state is updated.
     */
    it('should handle successful login', async () => {
      // Mock successful login response
      (api.login as jest.Mock).mockResolvedValue(mockAuthResponse);
      
      const { result } = renderHook(() => useAuth());
      
      // Perform login
      await act(async () => {
        await result.current.login(mockCredentials);
      });
      
      // Verify authentication state
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
      expect(result.current.tokens).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      expect(result.current.error).toBeNull();
      
      // Verify tokens were stored
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('access_token', 'mock-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh_token', 'mock-refresh-token');
      
      // Verify API call
      expect(api.login).toHaveBeenCalledWith(mockCredentials);
    });

    /**
     * Test login with invalid credentials.
     * 
     * Validates that login errors are properly handled with
     * appropriate error messages and state management.
     */
    it('should handle login errors appropriately', async () => {
      const loginError = new Error('Invalid credentials');
      (api.login as jest.Mock).mockRejectedValue(loginError);
      
      const { result } = renderHook(() => useAuth());
      
      // Attempt login with invalid credentials
      await act(async () => {
        try {
          await result.current.login({
            email: 'invalid@email.com',
            password: 'wrongpassword',
          });
        } catch (error) {
          // Expected to throw
        }
      });
      
      // Verify error state
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.error).toEqual(loginError);
      
      // Verify no tokens were stored
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    /**
     * Test login loading state management.
     * 
     * Validates that loading states are properly managed
     * during asynchronous login operations.
     */
    it('should manage loading state during login', async () => {
      let resolveLogin: (value: any) => void;
      const loginPromise = new Promise((resolve) => {
        resolveLogin = resolve;
      });
      
      (api.login as jest.Mock).mockImplementation(() => loginPromise);
      
      const { result } = renderHook(() => useAuth());
      
      // Start login
      act(() => {
        result.current.login(mockCredentials);
      });
      
      // Verify loading state
      expect(result.current.isLoading).toBe(true);
      
      // Resolve login
      await act(async () => {
        resolveLogin(mockAuthResponse);
        await loginPromise;
      });
      
      // Verify loading completed
      expect(result.current.isLoading).toBe(false);
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  describe('Registration Functionality', () => {
    /**
     * Test successful user registration.
     * 
     * Validates that registration data is properly processed
     * and user is automatically authenticated after registration.
     */
    it('should handle successful registration', async () => {
      const registrationResponse = {
        ...mockAuthResponse,
        user: {
          ...mockUser,
          email: mockRegistrationData.email,
          firstName: mockRegistrationData.firstName,
          lastName: mockRegistrationData.lastName,
        },
      };
      
      (api.register as jest.Mock).mockResolvedValue(registrationResponse);
      
      const { result } = renderHook(() => useAuth());
      
      // Perform registration
      await act(async () => {
        await result.current.register(mockRegistrationData);
      });
      
      // Verify authentication state
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user?.email).toBe(mockRegistrationData.email);
      expect(result.current.user?.firstName).toBe(mockRegistrationData.firstName);
      expect(result.current.tokens).toEqual({
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      });
      
      // Verify API call
      expect(api.register).toHaveBeenCalledWith(mockRegistrationData);
    });

    /**
     * Test registration validation errors.
     * 
     * Validates that registration validation errors are
     * properly handled and displayed to users.
     */
    it('should handle registration validation errors', async () => {
      const validationError = new Error('Email already exists');
      (api.register as jest.Mock).mockRejectedValue(validationError);
      
      const { result } = renderHook(() => useAuth());
      
      // Attempt registration with existing email
      await act(async () => {
        try {
          await result.current.register(mockRegistrationData);
        } catch (error) {
          // Expected to throw
        }
      });
      
      // Verify error state
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.error).toEqual(validationError);
    });
  });

  describe('Token Management', () => {
    /**
     * Test automatic token refresh functionality.
     * 
     * Validates that expired tokens are automatically refreshed
     * without requiring user re-authentication.
     */
    it('should refresh tokens automatically', async () => {
      // Set up initial authenticated state
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        (api.login as jest.Mock).mockResolvedValue(mockAuthResponse);
        await result.current.login(mockCredentials);
      });
      
      // Mock refresh response
      const refreshResponse = {
        access_token: 'new-access-token',
        refresh_token: 'new-refresh-token',
      };
      (api.refreshToken as jest.Mock).mockResolvedValue(refreshResponse);
      
      // Trigger token refresh
      await act(async () => {
        await result.current.refreshTokens();
      });
      
      // Verify tokens were updated
      expect(result.current.tokens).toEqual({
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token',
      });
      
      // Verify new tokens were stored
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('access_token', 'new-access-token');
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith('refresh_token', 'new-refresh-token');
    });

    /**
     * Test handling of refresh token failures.
     * 
     * Validates that when token refresh fails, user is
     * properly logged out and redirected to login.
     */
    it('should handle refresh token failure by logging out', async () => {
      // Set up initial authenticated state
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        (api.login as jest.Mock).mockResolvedValue(mockAuthResponse);
        await result.current.login(mockCredentials);
      });
      
      // Mock refresh failure
      (api.refreshToken as jest.Mock).mockRejectedValue(
        new Error('Refresh token expired')
      );
      
      // Attempt token refresh
      await act(async () => {
        try {
          await result.current.refreshTokens();
        } catch (error) {
          // Expected to fail
        }
      });
      
      // Verify user was logged out
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.tokens).toBeNull();
      
      // Verify tokens were cleared
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Logout Functionality', () => {
    /**
     * Test successful user logout.
     * 
     * Validates that logout clears all authentication state
     * and removes tokens from storage.
     */
    it('should handle logout properly', async () => {
      // Set up initial authenticated state
      const { result } = renderHook(() => useAuth());
      
      await act(async () => {
        (api.login as jest.Mock).mockResolvedValue(mockAuthResponse);
        await result.current.login(mockCredentials);
      });
      
      // Verify initially authenticated
      expect(result.current.isAuthenticated).toBe(true);
      
      // Perform logout
      act(() => {
        result.current.logout();
      });
      
      // Verify authentication cleared
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
      expect(result.current.tokens).toBeNull();
      expect(result.current.error).toBeNull();
      
      // Verify tokens were cleared from storage
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('access_token');
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('refresh_token');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    /**
     * Test network error handling.
     * 
     * Validates that network errors during authentication
     * operations are properly handled and communicated.
     */
    it('should handle network errors gracefully', async () => {
      const networkError = new Error('Network request failed');
      (api.login as jest.Mock).mockRejectedValue(networkError);
      
      const { result } = renderHook(() => useAuth());
      
      // Attempt login with network error
      await act(async () => {
        try {
          await result.current.login(mockCredentials);
        } catch (error) {
          // Expected to throw
        }
      });
      
      // Verify error is properly set
      expect(result.current.error).toEqual(networkError);
      expect(result.current.isAuthenticated).toBe(false);
    });

    /**
     * Test concurrent authentication operations.
     * 
     * Validates that concurrent authentication operations
     * are properly handled without state corruption.
     */
    it('should handle concurrent authentication operations', async () => {
      (api.login as jest.Mock).mockImplementation(() => 
        new Promise((resolve) => setTimeout(() => resolve(mockAuthResponse), 100))
      );
      
      const { result } = renderHook(() => useAuth());
      
      // Start two concurrent login attempts
      const loginPromise1 = act(async () => {
        await result.current.login(mockCredentials);
      });
      
      const loginPromise2 = act(async () => {
        await result.current.login({
          email: 'other@example.com',
          password: 'otherpassword',
        });
      });
      
      // Wait for both to complete
      await Promise.all([loginPromise1, loginPromise2]);
      
      // Verify final state is consistent
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.user).toEqual(mockUser);
    });

    /**
     * Test error recovery functionality.
     * 
     * Validates that users can recover from authentication
     * errors by clearing error state and retrying.
     */
    it('should allow error recovery', async () => {
      const { result } = renderHook(() => useAuth());
      
      // Cause an error
      (api.login as jest.Mock).mockRejectedValue(new Error('Login failed'));
      
      await act(async () => {
        try {
          await result.current.login(mockCredentials);
        } catch (error) {
          // Expected to fail
        }
      });
      
      // Verify error state
      expect(result.current.error).toBeTruthy();
      
      // Clear error
      act(() => {
        result.current.clearError();
      });
      
      // Verify error cleared
      expect(result.current.error).toBeNull();
      
      // Successful retry
      (api.login as jest.Mock).mockResolvedValue(mockAuthResponse);
      
      await act(async () => {
        await result.current.login(mockCredentials);
      });
      
      // Verify successful authentication
      expect(result.current.isAuthenticated).toBe(true);
      expect(result.current.error).toBeNull();
    });
  });

  describe('Integration Tests', () => {
    /**
     * Test complete authentication flow.
     * 
     * Validates end-to-end authentication workflow including
     * registration, login, token refresh, and logout.
     */
    it('should handle complete authentication workflow', async () => {
      const { result } = renderHook(() => useAuth());
      
      // 1. Registration
      const registrationResponse = {
        ...mockAuthResponse,
        user: {
          ...mockUser,
          email: mockRegistrationData.email,
          firstName: mockRegistrationData.firstName,
        },
      };
      (api.register as jest.Mock).mockResolvedValue(registrationResponse);
      
      await act(async () => {
        await result.current.register(mockRegistrationData);
      });
      
      expect(result.current.isAuthenticated).toBe(true);
      
      // 2. Logout
      act(() => {
        result.current.logout();
      });
      
      expect(result.current.isAuthenticated).toBe(false);
      
      // 3. Login
      (api.login as jest.Mock).mockResolvedValue(mockAuthResponse);
      
      await act(async () => {
        await result.current.login(mockCredentials);
      });
      
      expect(result.current.isAuthenticated).toBe(true);
      
      // 4. Token refresh
      const refreshResponse = {
        access_token: 'refreshed-token',
        refresh_token: 'refreshed-refresh',
      };
      (api.refreshToken as jest.Mock).mockResolvedValue(refreshResponse);
      
      await act(async () => {
        await result.current.refreshTokens();
      });
      
      expect(result.current.tokens?.accessToken).toBe('refreshed-token');
      
      // 5. Final logout
      act(() => {
        result.current.logout();
      });
      
      expect(result.current.isAuthenticated).toBe(false);
      expect(result.current.user).toBeNull();
    });
  });
});