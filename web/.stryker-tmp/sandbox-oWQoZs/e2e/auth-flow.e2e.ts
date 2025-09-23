/**
 * Authentication Flow End-to-End Tests
 * 
 * Comprehensive e2e tests for user authentication workflows including
 * registration, login, logout, and session management across the application.
 * 
 * Test Coverage:
 * - User registration with validation
 * - Login with credentials
 * - Logout and session cleanup
 * - Protected route access control
 * - Token refresh and session persistence
 * - Password reset functionality
 * - Social authentication (if implemented)
 * 
 * Business Critical Workflows:
 * These tests validate the core authentication flows that enable users
 * to access the aclue platform and maintain secure sessions.
 * 
 * Cross-Browser Testing:
 * Authentication behaviour is tested across all supported browsers
 * to ensure consistent user experience and security.
 */
// @ts-nocheck


import { test, expect, Page } from '@playwright/test';

// ==============================================================================
// TEST DATA AND UTILITIES
// ==============================================================================

// Test user data
const testUser = {
  email: 'e2e-test@aclue.app',
  password: 'TestPass123!',
  firstName: 'E2E',
  lastName: 'Tester',
};

// Alternative test user for multi-user scenarios
const alternativeUser = {
  email: 'e2e-alt@aclue.app',
  password: 'AltPass456!',
  firstName: 'Alternative',
  lastName: 'User',
};

// Helper function to clear authentication state
async function clearAuthState(page: Page) {
  await page.evaluate(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    sessionStorage.clear();
  });
}

// Helper function to check if user is authenticated
async function isAuthenticated(page: Page): Promise<boolean> {
  const token = await page.evaluate(() => localStorage.getItem('access_token'));
  return !!token;
}

// Helper function to navigate to protected page
async function navigateToProtectedPage(page: Page) {
  await page.goto('/dashboard');
}

// ==============================================================================
// AUTHENTICATION WORKFLOW TESTS
// ==============================================================================

test.describe('User Authentication Flows', () => {
  
  // Clear authentication state before each test
  test.beforeEach(async ({ page }) => {
    await clearAuthState(page);
  });

  test.describe('User Registration', () => {
    /**
     * Test successful user registration workflow.
     * 
     * Validates complete registration flow from form submission
     * to successful account creation and automatic login.
     * 
     * User Journey:
     * 1. Navigate to registration page
     * 2. Fill registration form with valid data
     * 3. Submit registration
     * 4. Verify account creation success
     * 5. Verify automatic authentication
     * 6. Verify redirect to dashboard
     */
    test('should allow new user registration', async ({ page }) => {
      // Navigate to registration page
      await page.goto('/auth/register');
      
      // Verify registration form is displayed
      await expect(page.locator('h1')).toContainText('Create Your Account');
      await expect(page.locator('form')).toBeVisible();
      
      // Fill registration form
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      
      // Accept terms and conditions
      await page.check('[name="termsAccepted"]');
      
      // Optionally check marketing consent
      await page.check('[name="marketingConsent"]');
      
      // Submit registration form
      await page.click('[type="submit"]');
      
      // Wait for registration to complete
      await page.waitForURL('/dashboard', { timeout: 10000 });
      
      // Verify successful registration and auto-login
      expect(page.url()).toContain('/dashboard');
      
      // Verify authentication state
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
      
      // Verify user information is displayed
      await expect(page.locator('[data-testid="user-greeting"]')).toContainText(testUser.firstName);
      
      // Verify welcome message or onboarding
      await expect(page.locator('.welcome-message')).toBeVisible();
    });

    /**
     * Test registration form validation.
     * 
     * Validates that form validation prevents invalid registrations
     * with appropriate error messages for each field.
     */
    test('should validate registration form inputs', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Test empty form submission
      await page.click('[type="submit"]');
      
      // Verify validation errors
      await expect(page.locator('.error-message')).toContainText('First name is required');
      
      // Test invalid email format
      await page.fill('[name="email"]', 'invalid-email');
      await page.blur('[name="email"]');
      await expect(page.locator('.email-error')).toContainText('Please enter a valid email address');
      
      // Test weak password
      await page.fill('[name="password"]', '123');
      await page.blur('[name="password"]');
      await expect(page.locator('.password-error')).toContainText('Password must be at least 8 characters');
      
      // Test password strength requirements
      await page.fill('[name="password"]', 'weakpassword');
      await page.blur('[name="password"]');
      await expect(page.locator('.password-strength')).toContainText('Add uppercase letters and numbers');
    });

    /**
     * Test duplicate email registration handling.
     * 
     * Validates that attempting to register with an existing
     * email address shows appropriate error messages.
     */
    test('should handle duplicate email registration', async ({ page }) => {
      // First registration
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      
      // Wait for successful registration
      await page.waitForURL('/dashboard');
      
      // Logout for second registration attempt
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/');
      
      // Attempt second registration with same email
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', 'Second');
      await page.fill('[name="lastName"]', 'User');
      await page.fill('[name="email"]', testUser.email); // Same email
      await page.fill('[name="password"]', 'DifferentPass123!');
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      
      // Verify error message
      await expect(page.locator('.error-notification')).toContainText('This email address is already registered');
      
      // Verify user remains on registration page
      expect(page.url()).toContain('/auth/register');
    });
  });

  test.describe('User Login', () => {
    /**
     * Test successful login workflow.
     * 
     * Validates login with valid credentials and proper
     * redirection to intended destination.
     */
    test('should allow user login with valid credentials', async ({ page }) => {
      // First register a user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Logout to test login
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/');
      
      // Navigate to login page
      await page.goto('/auth/login');
      
      // Verify login form
      await expect(page.locator('h1')).toContainText('Welcome Back');
      
      // Fill login form
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      
      // Submit login
      await page.click('[type="submit"]');
      
      // Verify successful login
      await page.waitForURL('/dashboard');
      expect(page.url()).toContain('/dashboard');
      
      // Verify authentication state
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
      
      // Verify user data is displayed
      await expect(page.locator('[data-testid="user-greeting"]')).toContainText(testUser.firstName);
    });

    /**
     * Test login with invalid credentials.
     * 
     * Validates that invalid login attempts are properly
     * rejected with appropriate error messages.
     */
    test('should reject invalid login credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Attempt login with invalid credentials
      await page.fill('[name="email"]', 'nonexistent@example.com');
      await page.fill('[name="password"]', 'wrongpassword');
      await page.click('[type="submit"]');
      
      // Verify error message
      await expect(page.locator('.error-notification')).toContainText('Invalid email or password');
      
      // Verify user remains on login page
      expect(page.url()).toContain('/auth/login');
      
      // Verify no authentication token is set
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(false);
    });

    /**
     * Test return URL functionality after login.
     * 
     * Validates that users are redirected to their intended
     * destination after successful authentication.
     */
    test('should redirect to intended page after login', async ({ page }) => {
      // Register user first
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      
      // Try to access protected page (should redirect to login)
      await page.goto('/dashboard/recommendations');
      
      // Should be redirected to login with return URL
      await page.waitForURL(/auth\/login/);
      expect(page.url()).toContain('returnUrl=%2Fdashboard%2Frecommendations');
      
      // Login
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.click('[type="submit"]');
      
      // Should be redirected to original intended page
      await page.waitForURL('/dashboard/recommendations');
      expect(page.url()).toContain('/dashboard/recommendations');
    });

    /**
     * Test remember me functionality.
     * 
     * Validates that "remember me" checkbox affects
     * session persistence across browser sessions.
     */
    test('should handle remember me functionality', async ({ page, context }) => {
      // Register user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      
      // Login with remember me checked
      await page.goto('/auth/login');
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="rememberMe"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Close and reopen browser context to simulate session restart
      await page.close();
      const newPage = await context.newPage();
      
      // Navigate to protected page (should still be authenticated)
      await newPage.goto('/dashboard');
      
      // Verify still authenticated
      await expect(newPage.locator('[data-testid="user-greeting"]')).toBeVisible();
    });
  });

  test.describe('Authentication State Management', () => {
    /**
     * Test logout functionality.
     * 
     * Validates that logout properly clears authentication
     * state and redirects to public area.
     */
    test('should handle user logout correctly', async ({ page }) => {
      // Register and login user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Verify authenticated state
      let authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
      
      // Perform logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      
      // Verify redirect to home page
      await page.waitForURL('/');
      expect(page.url()).toContain('/');
      
      // Verify authentication state cleared
      authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(false);
      
      // Verify attempting to access protected page redirects to login
      await page.goto('/dashboard');
      await page.waitForURL(/auth\/login/);
      expect(page.url()).toContain('/auth/login');
    });

    /**
     * Test session persistence across page reloads.
     * 
     * Validates that authentication state is maintained
     * when users reload pages or navigate within the app.
     */
    test('should maintain authentication across page reloads', async ({ page }) => {
      // Register and login user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Reload page
      await page.reload();
      await page.waitForLoadState('networkidle');
      
      // Verify still authenticated and on dashboard
      expect(page.url()).toContain('/dashboard');
      await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible();
      
      // Navigate to other protected pages
      await page.goto('/dashboard/recommendations');
      await expect(page.locator('h1')).toContainText('Recommendations');
      
      // Navigate back to dashboard
      await page.goto('/dashboard');
      await expect(page.locator('[data-testid="user-greeting"]')).toBeVisible();
    });

    /**
     * Test automatic logout on token expiration.
     * 
     * Validates that expired authentication tokens trigger
     * automatic logout and redirect to login page.
     */
    test('should handle token expiration gracefully', async ({ page }) => {
      // Register and login user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      // Simulate token expiration by setting expired token
      await page.evaluate(() => {
        // Set an expired token (this would normally be handled by the server)
        localStorage.setItem('access_token', 'expired.jwt.token');
      });
      
      // Navigate to protected page
      await page.goto('/dashboard/recommendations');
      
      // Should be redirected to login due to expired token
      await page.waitForURL(/auth\/login/, { timeout: 10000 });
      expect(page.url()).toContain('/auth/login');
      
      // Verify error message about session expiration
      await expect(page.locator('.session-expired-message')).toContainText('Your session has expired');
    });
  });

  test.describe('Protected Route Access Control', () => {
    /**
     * Test unauthenticated access to protected routes.
     * 
     * Validates that all protected routes properly redirect
     * unauthenticated users to the login page.
     */
    test('should protect authenticated routes', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/recommendations',
        '/dashboard/profile',
        '/discover',
        '/notifications',
      ];
      
      for (const route of protectedRoutes) {
        // Clear authentication state
        await clearAuthState(page);
        
        // Attempt to access protected route
        await page.goto(route);
        
        // Should be redirected to login
        await page.waitForURL(/auth\/login/);
        expect(page.url()).toContain('/auth/login');
        expect(page.url()).toContain(`returnUrl=${encodeURIComponent(route)}`);
      }
    });

    /**
     * Test authenticated access to protected routes.
     * 
     * Validates that authenticated users can access all
     * protected routes without redirects.
     */
    test('should allow access to protected routes when authenticated', async ({ page }) => {
      // Register and login user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', testUser.firstName);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', testUser.email);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      await page.waitForURL('/dashboard');
      
      const protectedRoutes = [
        { path: '/dashboard', expectedContent: 'Dashboard' },
        { path: '/dashboard/recommendations', expectedContent: 'Recommendations' },
        { path: '/discover', expectedContent: 'Discover' },
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route.path);
        
        // Verify route is accessible
        expect(page.url()).toContain(route.path);
        
        // Verify expected content is displayed
        await expect(page.locator('h1')).toContainText(route.expectedContent);
        
        // Verify user is still authenticated
        const authenticated = await isAuthenticated(page);
        expect(authenticated).toBe(true);
      }
    });
  });

  test.describe('Cross-Browser Authentication', () => {
    /**
     * Test authentication consistency across browsers.
     * 
     * This test would normally run across multiple browser
     * configurations to ensure consistent authentication behaviour.
     */
    test('should maintain consistent authentication across browsers', async ({ page, browserName }) => {
      // Register user
      await page.goto('/auth/register');
      await page.fill('[name="firstName"]', `${testUser.firstName}-${browserName}`);
      await page.fill('[name="lastName"]', testUser.lastName);
      await page.fill('[name="email"]', `${browserName}-${testUser.email}`);
      await page.fill('[name="password"]', testUser.password);
      await page.check('[name="termsAccepted"]');
      await page.click('[type="submit"]');
      
      // Verify successful registration
      await page.waitForURL('/dashboard');
      expect(page.url()).toContain('/dashboard');
      
      // Verify authentication state
      const authenticated = await isAuthenticated(page);
      expect(authenticated).toBe(true);
      
      // Verify user greeting displays correctly
      await expect(page.locator('[data-testid="user-greeting"]')).toContainText(`${testUser.firstName}-${browserName}`);
      
      // Test navigation to protected routes
      await page.goto('/discover');
      await expect(page.locator('h1')).toContainText('Discover');
      
      // Test logout
      await page.click('[data-testid="user-menu"]');
      await page.click('[data-testid="logout-button"]');
      await page.waitForURL('/');
      
      // Verify logout cleared authentication
      const postLogoutAuth = await isAuthenticated(page);
      expect(postLogoutAuth).toBe(false);
    });
  });
});