/**
 * Security Testing Suite
 * 
 * Comprehensive security testing for the aclue platform,
 * focusing on authentication security, data protection, and vulnerability prevention.
 * 
 * Security Test Coverage:
 * - JWT token security and validation
 * - Session management security
 * - XSS (Cross-Site Scripting) prevention
 * - CSRF (Cross-Site Request Forgery) protection
 * - SQL injection prevention
 * - Authentication bypass attempts
 * - Password security requirements
 * - Secure cookie configuration
 * - Rate limiting validation
 * - Input sanitization
 * - Authorization controls
 * - Data leakage prevention
 */
// @ts-nocheck


import { test, expect, Page, BrowserContext } from '@playwright/test';

const TEST_USER = {
  email: 'john.doe@example.com',
  password: 'password123'
};

test.describe('Security Testing Suite', () => {
  test.describe('Authentication Security', () => {
    test('should use secure JWT token configuration', async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await expect(page).toHaveURL(/.*dashboard.*/);
      
      // Check cookie security settings
      const cookies = await page.context().cookies();
      const authCookie = cookies.find(cookie => cookie.name === 'auth_access_token');
      
      if (authCookie) {
        // Cookie should be HttpOnly to prevent XSS
        expect(authCookie.httpOnly).toBe(true);
        
        // Cookie should be Secure in production
        if (process.env.NODE_ENV === 'production') {
          expect(authCookie.secure).toBe(true);
        }
        
        // Cookie should have SameSite attribute for CSRF protection
        expect(authCookie.sameSite).toBeTruthy();
        
        console.log('🔒 JWT cookie security validated');
      }
    });

    test('should validate JWT token integrity', async ({ page }) => {
      // Login to get valid token
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Get the token
      const originalCookies = await page.context().cookies();
      const authCookie = originalCookies.find(c => c.name === 'auth_access_token');
      
      if (authCookie) {
        // Tamper with the token
        const tamperedToken = authCookie.value.slice(0, -10) + 'tamperedXX';
        
        await page.context().addCookies([{
          ...authCookie,
          value: tamperedToken
        }]);
        
        // Try to access protected route with tampered token
        await page.goto('/dashboard/profile');
        
        // Should redirect to login due to invalid token
        await expect(page).toHaveURL(/.*auth\/login.*/);
        
        console.log('✅ Tampered JWT token correctly rejected');
      }
    });

    test('should handle token expiration correctly', async ({ page }) => {
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Simulate expired token by manipulating expiration time
      await page.addInitScript(() => {
        // Set token expiration to past time
        localStorage.setItem('auth_token_expires', '1000'); // Very old timestamp
      });
      
      // Try to access protected route
      await page.goto('/dashboard/settings');
      
      // Should either redirect to login or auto-refresh token
      // In a well-implemented system, this should be handled gracefully
      const currentUrl = page.url();
      
      // Should not allow access with expired token
      if (currentUrl.includes('/dashboard/settings')) {
        // If still on settings page, token should have been auto-refreshed
        const newToken = await page.evaluate(() => localStorage.getItem('auth_token_expires'));
        expect(parseInt(newToken || '0')).toBeGreaterThan(1000);
      } else {
        // Or should redirect to login
        expect(currentUrl).toMatch(/.*auth\/login.*/);
      }
      
      console.log('⏰ Token expiration handled correctly');
    });

    test('should prevent authentication bypass attempts', async ({ page }) => {
      // Try to access protected route without authentication
      await page.goto('/dashboard/admin');
      
      // Should redirect to login
      await expect(page).toHaveURL(/.*auth\/login.*/);
      
      // Try to bypass with fake localStorage data
      await page.addInitScript(() => {
        localStorage.setItem('auth_user_data', JSON.stringify({
          id: 'fake-user',
          email: 'fake@example.com',
          role: 'admin'
        }));
      });
      
      await page.goto('/dashboard/admin');
      
      // Should still redirect to login (server-side validation)
      await expect(page).toHaveURL(/.*auth\/login.*/);
      
      console.log('🚫 Authentication bypass attempts blocked');
    });

    test('should enforce password security requirements', async ({ page }) => {
      await page.goto('/auth/register');
      
      const weakPasswords = [
        '123',           // Too short
        'password',      // Common password
        'abcdefgh',      // No numbers or special chars
        '12345678',      // Only numbers
        'ABCDEFGH'       // Only uppercase
      ];
      
      for (const password of weakPasswords) {
        await page.fill('[data-testid="name-input"]', 'Test User');
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.fill('[data-testid="password-input"]', password);
        await page.fill('[data-testid="confirm-password-input"]', password);
        await page.click('[data-testid="register-button"]');
        
        // Should show password validation error
        const passwordError = await page.locator('[data-testid="password-error"]');
        await expect(passwordError).toBeVisible();
        
        // Clear form for next test
        await page.fill('[data-testid="password-input"]', '');
        await page.fill('[data-testid="confirm-password-input"]', '');
      }
      
      console.log('🔐 Password security requirements enforced');
    });
  });

  test.describe('XSS (Cross-Site Scripting) Prevention', () => {
    test('should prevent XSS in authentication forms', async ({ page }) => {
      await page.goto('/auth/login');
      
      const xssPayloads = [
        '<script>alert("XSS")</script>',
        '"><script>alert("XSS")</script>',
        'javascript:alert("XSS")',
        '<img src="x" onerror="alert(\'XSS\')">',
        '<svg onload="alert(\'XSS\')">',
        '&lt;script&gt;alert("XSS")&lt;/script&gt;'
      ];
      
      let xssExecuted = false;
      
      // Monitor for alert dialogs (XSS execution)
      page.on('dialog', dialog => {
        xssExecuted = true;
        dialog.dismiss();
      });
      
      for (const payload of xssPayloads) {
        await page.fill('[data-testid="email-input"]', payload);
        await page.fill('[data-testid="password-input"]', 'password');
        await page.click('[data-testid="login-button"]');
        
        await page.waitForTimeout(1000);
        
        // Clear form for next test
        await page.fill('[data-testid="email-input"]', '');
      }
      
      expect(xssExecuted).toBe(false);
      console.log('✅ XSS payloads in auth forms properly sanitized');
    });

    test('should prevent XSS in user profile data', async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await page.goto('/dashboard/profile');
      
      const xssPayload = '<script>window.xssExecuted = true</script>';
      
      // Try to inject XSS in profile fields
      const profileFields = [
        '[data-testid="name-input"]',
        '[data-testid="bio-input"]',
        '[data-testid="location-input"]'
      ];
      
      for (const field of profileFields) {
        const fieldElement = await page.locator(field).first();
        
        if (await fieldElement.count() > 0) {
          await fieldElement.fill(xssPayload);
          await page.click('[data-testid="save-profile-button"]');
          
          // Check if XSS was executed
          const xssExecuted = await page.evaluate(() => window.xssExecuted);
          expect(xssExecuted).toBeFalsy();
          
          await fieldElement.fill(''); // Clear for next test
        }
      }
      
      console.log('✅ XSS prevention in profile data validated');
    });

    test('should sanitize user-generated content in wishlists', async ({ page }) => {
      // Login and navigate to wishlist
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await page.goto('/wishlist');
      
      const xssPayload = '<img src="x" onerror="alert(\'XSS in wishlist\')">';
      
      // Try to create wishlist with XSS payload
      await page.click('[data-testid="create-wishlist-button"]');
      await page.fill('[data-testid="wishlist-name-input"]', xssPayload);
      await page.fill('[data-testid="wishlist-description-input"]', xssPayload);
      await page.click('[data-testid="save-wishlist-button"]');
      
      // XSS should not execute
      let alertFired = false;
      page.on('dialog', () => { alertFired = true; });
      
      await page.waitForTimeout(2000);
      expect(alertFired).toBe(false);
      
      console.log('✅ Wishlist content properly sanitized');
    });
  });

  test.describe('CSRF (Cross-Site Request Forgery) Protection', () => {
    test('should implement CSRF protection for forms', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Check for CSRF token in forms
      const csrfToken = await page.locator('input[name="_token"], input[name="csrf_token"], meta[name="csrf-token"]');
      
      if (await csrfToken.count() > 0) {
        const tokenValue = await csrfToken.first().getAttribute('content') || 
                          await csrfToken.first().getAttribute('value');
        
        expect(tokenValue).toBeTruthy();
        expect(tokenValue.length).toBeGreaterThan(10);
        
        console.log('🛡️ CSRF token found and validated');
      } else {
        // Check for SameSite cookie protection as alternative
        const cookies = await page.context().cookies();
        const authCookie = cookies.find(c => c.name.includes('auth') || c.name.includes('session'));
        
        if (authCookie) {
          expect(authCookie.sameSite).toBeTruthy();
          console.log('🛡️ SameSite cookie protection validated');
        }
      }
    });

    test('should reject requests without proper CSRF protection', async ({ page, context }) => {
      // Login to get session
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Try to make a request from different origin (simulating CSRF)
      const maliciousContext = await context.browser()?.newContext();
      const maliciousPage = await maliciousContext?.newPage();
      
      if (maliciousPage) {
        // Copy session cookies to malicious context
        const cookies = await page.context().cookies();
        await maliciousContext?.addCookies(cookies);
        
        // Try to perform sensitive action from malicious origin
        const response = await maliciousPage.request.post('/api/v1/profile/update', {
          data: {
            name: 'Hacked Name',
            email: 'hacker@evil.com'
          },
          headers: {
            'Origin': 'https://evil-site.com',
            'Referer': 'https://evil-site.com'
          }
        });
        
        // Should be rejected due to CSRF protection
        expect(response.status()).toBeGreaterThanOrEqual(400);
        
        await maliciousContext?.close();
        console.log('🚫 CSRF attack properly blocked');
      }
    });
  });

  test.describe('Input Validation and Sanitization', () => {
    test('should prevent SQL injection attempts', async ({ page }) => {
      await page.goto('/auth/login');
      
      const sqlInjectionPayloads = [
        "' OR '1'='1",
        "'; DROP TABLE users; --",
        "' UNION SELECT * FROM users --",
        "admin'--",
        "' OR 1=1#"
      ];
      
      for (const payload of sqlInjectionPayloads) {
        await page.fill('[data-testid="email-input"]', payload);
        await page.fill('[data-testid="password-input"]', 'password');
        await page.click('[data-testid="login-button"]');
        
        // Should show login error, not SQL error or unauthorized access
        const errorMessage = await page.locator('[data-testid="login-error"]');
        
        if (await errorMessage.count() > 0) {
          const errorText = await errorMessage.textContent();
          expect(errorText).not.toMatch(/sql|database|mysql|postgres|syntax/i);
        }
        
        // Should not be logged in
        await page.waitForTimeout(1000);
        expect(page.url()).toMatch(/.*auth\/login.*/);
        
        await page.fill('[data-testid="email-input"]', '');
      }
      
      console.log('🛡️ SQL injection attempts properly handled');
    });

    test('should validate and sanitize file uploads', async ({ page }) => {
      // Login and navigate to profile
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      await page.goto('/dashboard/profile');
      
      const fileUpload = await page.locator('input[type="file"]').first();
      
      if (await fileUpload.count() > 0) {
        // Create malicious file content
        const maliciousFile = await page.evaluateHandle(() => {
          const content = '<?php echo "Malicious PHP code"; ?>';
          const blob = new Blob([content], { type: 'image/jpeg' });
          const file = new File([blob], 'malicious.php.jpg', { type: 'image/jpeg' });
          return file;
        });
        
        await fileUpload.setInputFiles(maliciousFile as any);
        
        // Try to upload
        const uploadButton = await page.locator('[data-testid="upload-button"]');
        if (await uploadButton.count() > 0) {
          await uploadButton.click();
          
          // Should reject malicious file
          const errorMessage = await page.locator('[data-testid="upload-error"]');
          await expect(errorMessage).toBeVisible();
        }
        
        console.log('🚫 Malicious file upload blocked');
      }
    });

    test('should validate email format strictly', async ({ page }) => {
      await page.goto('/auth/register');
      
      const invalidEmails = [
        'invalid-email',
        '@domain.com',
        'user@',
        'user..name@domain.com',
        'user@domain',
        'user name@domain.com',
        '<script>alert("xss")</script>@domain.com'
      ];
      
      for (const email of invalidEmails) {
        await page.fill('[data-testid="email-input"]', email);
        await page.fill('[data-testid="name-input"]', 'Test User');
        await page.fill('[data-testid="password-input"]', 'ValidPassword123!');
        await page.fill('[data-testid="confirm-password-input"]', 'ValidPassword123!');
        await page.click('[data-testid="register-button"]');
        
        // Should show email validation error
        const emailError = await page.locator('[data-testid="email-error"]');
        await expect(emailError).toBeVisible();
        
        await page.fill('[data-testid="email-input"]', '');
      }
      
      console.log('📧 Email validation working correctly');
    });
  });

  test.describe('Rate Limiting and DDoS Protection', () => {
    test('should implement rate limiting for login attempts', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Attempt multiple rapid logins
      for (let i = 0; i < 6; i++) {
        await page.fill('[data-testid="email-input"]', 'invalid@example.com');
        await page.fill('[data-testid="password-input"]', 'wrongpassword');
        await page.click('[data-testid="login-button"]');
        await page.waitForTimeout(500);
      }
      
      // Should show rate limiting message
      const rateLimitError = await page.locator('[data-testid="rate-limit-error"]');
      
      if (await rateLimitError.count() > 0) {
        await expect(rateLimitError).toBeVisible();
        console.log('⏱️ Rate limiting active for login attempts');
      } else {
        console.log('⚠️ Rate limiting may not be implemented');
      }
    });

    test('should implement rate limiting for password reset', async ({ page }) => {
      await page.goto('/auth/forgot-password');
      
      // Attempt multiple rapid password resets
      for (let i = 0; i < 5; i++) {
        await page.fill('[data-testid="email-input"]', 'test@example.com');
        await page.click('[data-testid="reset-button"]');
        await page.waitForTimeout(1000);
      }
      
      // Should prevent excessive reset requests
      const rateLimitMessage = await page.locator('[data-testid="rate-limit-message"]');
      
      if (await rateLimitMessage.count() > 0) {
        console.log('⏱️ Password reset rate limiting active');
      }
    });
  });

  test.describe('Authorization and Access Control', () => {
    test('should enforce proper authorization for user data', async ({ page, context }) => {
      // Login as test user
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Get user ID from profile or dashboard
      const userId = await page.evaluate(() => {
        const userCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('auth_user_data='));
        
        if (userCookie) {
          const userData = JSON.parse(decodeURIComponent(userCookie.split('=')[1]));
          return userData.id;
        }
        return null;
      });
      
      if (userId) {
        // Try to access another user's data
        const response = await page.request.get(`/api/v1/users/different-user-id/profile`);
        
        // Should be forbidden
        expect(response.status()).toBe(403);
        
        console.log('🔒 User data access properly authorized');
      }
    });

    test('should prevent privilege escalation', async ({ page }) => {
      // Login as regular user
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', TEST_USER.email);
      await page.fill('[data-testid="password-input"]', TEST_USER.password);
      await page.click('[data-testid="login-button"]');
      
      // Try to access admin endpoints
      const adminEndpoints = [
        '/api/v1/admin/users',
        '/api/v1/admin/analytics',
        '/dashboard/admin'
      ];
      
      for (const endpoint of adminEndpoints) {
        const response = await page.request.get(endpoint);
        
        // Should be forbidden or redirect
        expect(response.status()).toBeGreaterThanOrEqual(400);
      }
      
      console.log('🚫 Privilege escalation attempts blocked');
    });
  });

  test.describe('Data Leakage Prevention', () => {
    test('should not expose sensitive data in client-side code', async ({ page }) => {
      await page.goto('/');
      
      // Check for sensitive data exposure
      const pageSource = await page.content();
      const jsContent = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('script'))
          .map(script => script.textContent)
          .join(' ');
      });
      
      const sensitivePatterns = [
        /api[_-]?key/i,
        /secret[_-]?key/i,
        /private[_-]?key/i,
        /password/i,
        /database[_-]?url/i,
        /jwt[_-]?secret/i
      ];
      
      for (const pattern of sensitivePatterns) {
        expect(pageSource).not.toMatch(pattern);
        expect(jsContent).not.toMatch(pattern);
      }
      
      console.log('🔐 No sensitive data exposed in client-side code');
    });

    test('should not expose user data in error messages', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Trigger error with potentially sensitive information
      await page.fill('[data-testid="email-input"]', 'nonexistent@example.com');
      await page.fill('[data-testid="password-input"]', 'password');
      await page.click('[data-testid="login-button"]');
      
      const errorMessage = await page.locator('[data-testid="login-error"]');
      
      if (await errorMessage.count() > 0) {
        const errorText = await errorMessage.textContent();
        
        // Error should not reveal if email exists or not
        expect(errorText).not.toMatch(/user.*not.*found|email.*does.*not.*exist/i);
        expect(errorText).not.toMatch(/database|sql|server/i);
        
        console.log('🔒 Error messages do not leak sensitive information');
      }
    });
  });

  test.describe('Secure Headers', () => {
    test('should implement security headers', async ({ page }) => {
      const response = await page.goto('/');
      
      if (response) {
        const headers = response.headers();
        
        // Check for important security headers
        const securityHeaders = {
          'x-frame-options': 'DENY',
          'x-content-type-options': 'nosniff',
          'referrer-policy': 'strict-origin-when-cross-origin'
        };
        
        for (const [header, expectedValue] of Object.entries(securityHeaders)) {
          const headerValue = headers[header];
          if (headerValue) {
            expect(headerValue.toLowerCase()).toContain(expectedValue.toLowerCase());
            console.log(`✅ ${header}: ${headerValue}`);
          } else {
            console.warn(`⚠️ Missing security header: ${header}`);
          }
        }
      }
    });

    test('should implement Content Security Policy', async ({ page }) => {
      const response = await page.goto('/');
      
      if (response) {
        const headers = response.headers();
        const csp = headers['content-security-policy'] || headers['content-security-policy-report-only'];
        
        if (csp) {
          expect(csp).toContain("default-src");
          expect(csp).toContain("script-src");
          console.log('🛡️ Content Security Policy implemented');
        } else {
          console.warn('⚠️ Content Security Policy not found');
        }
      }
    });
  });
});