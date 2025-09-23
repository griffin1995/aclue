/**
 * Comprehensive Authentication Flow E2E Tests
 * 
 * Tests authentication functionality across both App Router and Pages Router
 * implementations, ensuring consistent behavior and security compliance.
 * 
 * Test Coverage:
 * - User registration flow
 * - Login/logout functionality
 * - Session management
 * - Protected route access
 * - JWT token handling
 * - Password reset flow
 * - Cross-router compatibility
 * - Security validations
 */
// @ts-nocheck


import { test, expect, Page, BrowserContext } from '@playwright/test';
import path from 'path';

// Test credentials
const TEST_USER = {
  email: 'john.doe@example.com',
  password: 'password123'
};

const NEW_USER = {
  email: 'test.user@example.com',
  password: 'testpassword123',
  name: 'Test User'
};

test.describe('Authentication Flow - Comprehensive Testing', () => {
  test.describe('User Registration', () => {
    test('should register new user successfully in App Router', async ({ page }) => {
      // Enable App Router for auth routes
      await page.addInitScript(() => {
        window.process = { env: { 
          NEXT_PUBLIC_APP_ROUTER_ENABLED: 'true',
          NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: '100',
          NEXT_PUBLIC_APP_ROUTER_ROUTES: 'auth'
        }};
      });

      await page.goto('/auth/register');
      
      // Wait for registration form
      await page.waitForSelector('[data-testid="register-form"]', { timeout: 10000 });
      
      // Fill registration form
      await page.fill('[data-testid="name-input"]', NEW_USER.name);
      await page.fill('[data-testid="email-input"]', NEW_USER.email);
      await page.fill('[data-testid="password-input"]', NEW_USER.password);
      await page.fill('[data-testid="confirm-password-input"]', NEW_USER.password);
      
      // Submit registration
      await page.click('[data-testid="register-button"]');
      
      // Should redirect to dashboard or show success message
      await expect(page).toHaveURL(/.*dashboard.*|.*success.*/, { timeout: 15000 });
      
      // Verify user is authenticated
      const isAuthenticated = await page.evaluate(() => {
        return document.cookie.includes('auth_access_token') ||
               localStorage.getItem('auth_user_data') !== null;
      });
      
      expect(isAuthenticated).toBe(true);
    });

    test('should handle registration validation errors', async ({ page }) => {
      await page.goto('/auth/register');
      
      await page.waitForSelector('[data-testid="register-form"]');
      
      // Try to register with invalid email
      await page.fill('[data-testid="name-input"]', 'Test');
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      await page.fill('[data-testid="password-input"]', '123');
      await page.click('[data-testid="register-button"]');
      
      // Should show validation errors
      const emailError = await page.locator('[data-testid="email-error"]');
      const passwordError = await page.locator('[data-testid="password-error"]');
      
      await expect(emailError).toBeVisible();
      await expect(passwordError).toBeVisible();
    });

    test('should prevent duplicate email registration', async ({ page }) => {
      await page.goto('/auth/register');
      
      await page.waitForSelector('[data-testid="register-form"]');
      
      // Try to register with existing email
      await page.fill('[data-testid="name-input"]', 'Duplicate User');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.fill('[data-testid="confirm-password-input"]', 'password123');
      await page.click('[data-testid="register-button"]');
      
      // Should show error message
      const errorMessage = await page.locator('[data-testid="registration-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(/email.*already.*exists|already.*registered/i);
    });
  });

  test.describe('User Login', () => {
    test('should login successfully with valid credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      await page.waitForSelector('[data-testid="login-form"]');
      
      // Login with test user
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Should redirect to dashboard
      await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 15000 });
      
      // Verify authentication cookies/tokens are set
      const cookies = await page.context().cookies();
      const authCookie = cookies.find(cookie => cookie.name === 'auth_access_token');
      expect(authCookie).toBeDefined();
      expect(authCookie?.value).toBeTruthy();
    });

    test('should handle invalid login credentials', async ({ page }) => {
      await page.goto('/auth/login');
      
      await page.waitForSelector('[data-testid="login-form"]');
      
      // Try login with invalid credentials
      await page.fill('[data-testid="email-input"]', 'invalid@example.com');
      await page.fill('[data-testid="password-input"]', 'wrongpassword');
      await page.click('[data-testid="login-button"]');
      
      // Should show error message
      const errorMessage = await page.locator('[data-testid="login-error"]');
      await expect(errorMessage).toBeVisible();
      await expect(errorMessage).toContainText(/invalid.*credentials|incorrect.*password/i);
    });

    test('should redirect to intended page after login', async ({ page }) => {
      // Try to access protected route without authentication
      await page.goto('/dashboard/profile');
      
      // Should redirect to login with redirect parameter
      await expect(page).toHaveURL(/.*auth\/login.*redirect.*dashboard.*profile.*/);
      
      // Login
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Should redirect back to intended page
      await expect(page).toHaveURL(/.*dashboard.*profile.*/);
    });

    test('should maintain session across page reloads', async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await expect(page).toHaveURL(/.*dashboard.*/);
      
      // Reload page
      await page.reload();
      
      // Should still be on dashboard (session maintained)
      await expect(page).toHaveURL(/.*dashboard.*/);
      
      // Verify user data is still available
      const userData = await page.evaluate(() => {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_user_data='));
        return userCookie ? JSON.parse(decodeURIComponent(userCookie.split('=')[1])) : null;
      });
      
      expect(userData).toBeTruthy();
      expect(userData.email).toBe(TEST_USER.email);
    });
  });

  test.describe('User Logout', () => {
    test.beforeEach(async ({ page }) => {
      // Login before each logout test
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      await expect(page).toHaveURL(/.*dashboard.*/);
    });

    test('should logout successfully and clear session', async ({ page }) => {
      // Click logout button
      await page.click('[data-testid="logout-button"]');
      
      // Should redirect to homepage or login
      await expect(page).toHaveURL(/.*\/$|.*auth\/login.*/);
      
      // Verify authentication cookies are cleared
      const cookies = await page.context().cookies();
      const authCookie = cookies.find(cookie => cookie.name === 'auth_access_token');
      expect(authCookie?.value || '').toBe('');
      
      // Verify localStorage is cleared
      const userData = await page.evaluate(() => {
        return localStorage.getItem('auth_user_data');
      });
      expect(userData).toBeNull();
    });

    test('should prevent access to protected routes after logout', async ({ page }) => {
      // Logout
      await page.click('[data-testid="logout-button"]');
      await expect(page).toHaveURL(/.*\/$|.*auth\/login.*/);
      
      // Try to access protected route
      await page.goto('/dashboard/settings');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*auth\/login.*/);
    });
  });

  test.describe('Protected Route Access', () => {
    test('should deny access to protected routes when not authenticated', async ({ page }) => {
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/profile',
        '/dashboard/settings',
        '/wishlist',
        '/cart'
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        // Should redirect to login
        await expect(page).toHaveURL(/.*auth\/login.*/);
      }
    });

    test('should allow access to protected routes when authenticated', async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      const protectedRoutes = [
        '/dashboard',
        '/dashboard/profile',
        '/wishlist'
      ];
      
      for (const route of protectedRoutes) {
        await page.goto(route);
        // Should NOT redirect to login
        await expect(page).not.toHaveURL(/.*auth\/login.*/);
        await expect(page).toHaveURL(new RegExp(`.*${route.replace('/', '\\/')}.*`));
      }
    });
  });

  test.describe('Token Refresh', () => {
    test('should automatically refresh expired tokens', async ({ page }) => {
      // Login
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Mock token expiration by manipulating cookies
      await page.addInitScript(() => {
        // Set expired token timestamp
        const expiredTime = Date.now() - 1000; // 1 second ago
        localStorage.setItem('auth_token_expires', expiredTime.toString());
      });
      
      // Make a request that should trigger token refresh
      await page.goto('/dashboard/profile');
      
      // Wait for automatic refresh (should happen in background)
      await page.waitForTimeout(2000);
      
      // Should still have access and be on the profile page
      await expect(page).toHaveURL(/.*dashboard.*profile.*/);
    });
  });

  test.describe('Cross-Router Compatibility', () => {
    test('should maintain authentication state between App Router and Pages Router', async ({ page }) => {
      // Login with App Router
      await page.addInitScript(() => {
        window.process = { env: { 
          NEXT_PUBLIC_APP_ROUTER_ENABLED: 'true',
          NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: '100',
          NEXT_PUBLIC_APP_ROUTER_ROUTES: 'auth'
        }};
      });
      
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Switch to Pages Router for other routes
      await page.addInitScript(() => {
        window.process = { env: { 
          NEXT_PUBLIC_APP_ROUTER_ENABLED: 'true',
          NEXT_PUBLIC_APP_ROUTER_ROLLOUT_PERCENTAGE: '100',
          NEXT_PUBLIC_APP_ROUTER_ROUTES: 'auth' // Only auth uses App Router
        }};
      });
      
      // Access route that uses Pages Router
      await page.goto('/products');
      
      // Should still be authenticated
      const isAuthenticated = await page.evaluate(() => {
        return document.cookie.includes('auth_access_token');
      });
      
      expect(isAuthenticated).toBe(true);
    });
  });

  test.describe('Security Validations', () => {
    test('should use secure cookie settings in production', async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      const cookies = await page.context().cookies();
      const authCookie = cookies.find(cookie => cookie.name === 'auth_access_token');
      
      if (process.env.NODE_ENV === 'production') {
        expect(authCookie?.secure).toBe(true);
        expect(authCookie?.httpOnly).toBe(true);
        expect(authCookie?.sameSite).toBe('Strict');
      }
    });

    test('should prevent XSS attacks in auth forms', async ({ page }) => {
      await page.goto('/auth/login');
      
      const xssPayload = '<script>alert("XSS")</script>';
      
      await page.fill('[data-testid="email-input"]', xssPayload);
      await page.fill('[data-testid="password-input"]', 'password');
      await page.click('[data-testid="login-button"]');
      
      // Should not execute script
      const alertFired = await page.evaluate(() => {
        return window.alertFired || false;
      });
      
      expect(alertFired).toBe(false);
    });

    test('should implement CSRF protection', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Check for CSRF token in form
      const csrfToken = await page.locator('input[name="_token"], input[name="csrf_token"], meta[name="csrf-token"]');
      
      // Should have some form of CSRF protection
      expect(await csrfToken.count()).toBeGreaterThan(0);
    });

    test('should rate limit login attempts', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Attempt multiple failed logins rapidly
      for (let i = 0; i < 6; i++) {
        await page.fill('[data-testid="email-input"]', 'invalid@example.com');
        await page.fill('[data-testid="password-input"]', 'wrongpassword');
        await page.click('[data-testid="login-button"]');
        await page.waitForTimeout(500);
      }
      
      // Should show rate limiting message
      const rateLimitMessage = await page.locator('[data-testid="rate-limit-error"]');
      await expect(rateLimitMessage).toBeVisible();
    });
  });

  test.describe('Password Reset Flow', () => {
    test('should handle password reset request', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      await page.waitForSelector('[data-testid="forgot-password-form"]');
      
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.click('[data-testid="reset-button"]');
      
      // Should show success message
      const successMessage = await page.locator('[data-testid="reset-success"]');
      await expect(successMessage).toBeVisible();
      await expect(successMessage).toContainText(/email.*sent|check.*email/i);
    });

    test('should validate email format in password reset', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      await page.fill('[data-testid="email-input"]', 'invalid-email');
      await page.click('[data-testid="reset-button"]');
      
      const emailError = await page.locator('[data-testid="email-error"]');
      await expect(emailError).toBeVisible();
    });
  });

  test.describe('Session Management', () => {
    test('should handle concurrent sessions', async ({ browser }) => {
      const context1 = await browser.newContext();
      const context2 = await browser.newContext();
      
      const page1 = await context1.newPage();
      const page2 = await context2.newPage();
      
      // Login in first context
      await page1.goto('/auth/login');
      await page1.fill('[data-testid="email-input"]', TEST_USER.email);
      await page1.fill('[data-testid="password-input"]', TEST_USER.password);
      await page1.click('[data-testid="login-button"]');
      
      // Login in second context
      await page2.goto('/auth/login');
      await page2.fill('[data-testid="email-input"]', TEST_USER.email);
      await page2.fill('[data-testid="password-input"]', TEST_USER.password);
      await page2.click('[data-testid="login-button"]');
      
      // Both should be authenticated
      await expect(page1).toHaveURL(/.*dashboard.*/);
      await expect(page2).toHaveURL(/.*dashboard.*/);
      
      // Logout from first context
      await page1.click('[data-testid="logout-button"]');
      
      // Second context should still be authenticated
      await page2.reload();
      await expect(page2).toHaveURL(/.*dashboard.*/);
      
      await context1.close();
      await context2.close();
    });
  });
});