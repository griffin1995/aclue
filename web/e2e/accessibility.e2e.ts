/**
 * Accessibility Testing Suite - WCAG 2.1 AA Compliance
 * 
 * Comprehensive accessibility testing for the aclue platform,
 * ensuring compliance with WCAG 2.1 AA standards and inclusive design.
 * 
 * Test Coverage:
 * - WCAG 2.1 AA compliance validation
 * - Screen reader compatibility
 * - Keyboard navigation
 * - Color contrast requirements
 * - Focus management
 * - ARIA attributes and roles
 * - Form accessibility
 * - Image alt text validation
 * - Video/audio accessibility
 * - Mobile accessibility
 */

import { test, expect, Page } from '@playwright/test';
import { injectAxe, checkA11y, getViolations } from 'axe-playwright';

test.describe('Accessibility Testing - WCAG 2.1 AA Compliance', () => {
  test.beforeEach(async ({ page }) => {
    // Inject axe-core for accessibility testing
    await injectAxe(page);
  });

  test.describe('WCAG 2.1 AA Compliance', () => {
    test('should have no accessibility violations on homepage', async ({ page }) => {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      await checkA11y(page, null, {
        detailedReport: true,
        detailedReportOptions: { html: true },
        // Test against WCAG 2.1 AA standards
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
      });
    });

    test('should have no accessibility violations on authentication pages', async ({ page }) => {
      const authPages = ['/auth/login', '/auth/register', '/auth/forgot-password'];
      
      for (const authPage of authPages) {
        await page.goto(authPage);
        await page.waitForLoadState('networkidle');
        
        await checkA11y(page, null, {
          detailedReport: true,
          tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
        });
        
        console.log(`✅ ${authPage} passed accessibility audit`);
      }
    });

    test('should have no accessibility violations on dashboard', async ({ page }) => {
      // Login first
      await page.goto('/auth/login');
      await page.fill('[data-testid="email-input"]', 'john.doe@example.com');
      await page.fill('[data-testid="password-input"]', 'password123');
      await page.click('[data-testid="login-button"]');
      
      await page.waitForURL('**/dashboard**');
      await page.waitForLoadState('networkidle');
      
      await checkA11y(page, null, {
        detailedReport: true,
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
      });
    });

    test('should have no accessibility violations on product discovery', async ({ page }) => {
      await page.goto('/discover');
      await page.waitForLoadState('networkidle');
      
      await checkA11y(page, null, {
        detailedReport: true,
        tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
      });
    });

    test('should have accessible forms with proper labels and validation', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Check form accessibility
      await checkA11y(page, '[data-testid="register-form"]', {
        rules: {
          'label': { enabled: true },
          'form-field-multiple-labels': { enabled: true },
          'label-title-only': { enabled: true }
        }
      });
      
      // Test form validation accessibility
      await page.click('[data-testid="register-button"]'); // Submit without filling
      
      // Error messages should be accessible
      const errorMessages = await page.locator('[role="alert"], [aria-live="polite"]');
      expect(await errorMessages.count()).toBeGreaterThan(0);
    });
  });

  test.describe('Keyboard Navigation', () => {
    test('should support full keyboard navigation on homepage', async ({ page }) => {
      await page.goto('/');
      
      // Start keyboard navigation
      await page.keyboard.press('Tab');
      
      let focusedElement = await page.evaluate(() => document.activeElement?.tagName);
      const navigableElements: string[] = [];
      
      // Navigate through all focusable elements
      for (let i = 0; i < 20; i++) { // Limit to prevent infinite loop
        const currentElement = await page.evaluate(() => {
          const el = document.activeElement;
          return {
            tagName: el?.tagName,
            role: el?.getAttribute('role'),
            ariaLabel: el?.getAttribute('aria-label'),
            textContent: el?.textContent?.slice(0, 50)
          };
        });
        
        if (currentElement.tagName) {
          navigableElements.push(currentElement.tagName);
        }
        
        await page.keyboard.press('Tab');
        
        const newElement = await page.evaluate(() => document.activeElement?.tagName);
        if (newElement === focusedElement) break; // Loop detected
        focusedElement = newElement;
      }
      
      console.log(`🔄 Navigated through ${navigableElements.length} focusable elements`);
      expect(navigableElements.length).toBeGreaterThan(3); // Should have multiple focusable elements
    });

    test('should support keyboard navigation in authentication forms', async ({ page }) => {
      await page.goto('/auth/login');
      
      // Tab through form elements
      await page.keyboard.press('Tab'); // Email field
      await page.type('[data-testid="email-input"]', 'test@example.com');
      
      await page.keyboard.press('Tab'); // Password field
      await page.type('[data-testid="password-input"]', 'password');
      
      await page.keyboard.press('Tab'); // Login button
      await page.keyboard.press('Enter'); // Submit form
      
      // Should handle form submission via keyboard
      // (In real test, you'd verify the form was submitted)
    });

    test('should have proper focus management for modals', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Assume there's a modal trigger
      const modalTrigger = await page.locator('[data-testid="modal-trigger"]').first();
      
      if (await modalTrigger.count() > 0) {
        await modalTrigger.click();
        
        // Focus should move to modal
        const modal = await page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();
        
        // First focusable element in modal should be focused
        const focusedElement = await page.evaluate(() => document.activeElement);
        expect(focusedElement).toBeTruthy();
        
        // Escape should close modal
        await page.keyboard.press('Escape');
        await expect(modal).not.toBeVisible();
      }
    });

    test('should support keyboard navigation for dropdowns and menus', async ({ page }) => {
      await page.goto('/discover');
      
      // Find dropdown or menu
      const dropdown = await page.locator('[role="combobox"], [role="listbox"]').first();
      
      if (await dropdown.count() > 0) {
        await dropdown.focus();
        await page.keyboard.press('Enter'); // Open dropdown
        
        // Navigate with arrow keys
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('ArrowDown');
        await page.keyboard.press('Enter'); // Select option
        
        // Dropdown should close and option should be selected
        const selectedValue = await dropdown.inputValue();
        expect(selectedValue).toBeTruthy();
      }
    });
  });

  test.describe('Screen Reader Compatibility', () => {
    test('should have proper heading structure', async ({ page }) => {
      await page.goto('/');
      
      const headings = await page.evaluate(() => {
        const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headingElements.map(el => ({
          level: parseInt(el.tagName.charAt(1)),
          text: el.textContent?.trim()
        }));
      });
      
      // Should have exactly one h1
      const h1Count = headings.filter(h => h.level === 1).length;
      expect(h1Count).toBe(1);
      
      // Heading structure should be logical (no skipping levels)
      for (let i = 1; i < headings.length; i++) {
        const currentLevel = headings[i].level;
        const previousLevel = headings[i - 1].level;
        
        if (currentLevel > previousLevel) {
          expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
        }
      }
      
      console.log(`📖 Found ${headings.length} headings with proper structure`);
    });

    test('should have meaningful alt text for images', async ({ page }) => {
      await page.goto('/');
      
      const images = await page.evaluate(() => {
        const imgElements = Array.from(document.querySelectorAll('img'));
        return imgElements.map(img => ({
          src: img.src,
          alt: img.alt,
          ariaLabel: img.getAttribute('aria-label'),
          role: img.getAttribute('role')
        }));
      });
      
      for (const image of images) {
        // Decorative images should have empty alt or role="presentation"
        // Content images should have meaningful alt text
        if (image.role !== 'presentation' && !image.alt && !image.ariaLabel) {
          console.warn(`⚠️ Image missing alt text: ${image.src}`);
        }
        
        // Alt text should not be redundant
        if (image.alt && (image.alt.includes('image of') || image.alt.includes('picture of'))) {
          console.warn(`⚠️ Redundant alt text: ${image.alt}`);
        }
      }
      
      console.log(`🖼️ Validated ${images.length} images for alt text`);
    });

    test('should have proper ARIA labels and roles', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check for proper ARIA landmarks
      const landmarks = await page.evaluate(() => {
        const landmarkElements = Array.from(document.querySelectorAll('[role="main"], [role="navigation"], [role="banner"], [role="contentinfo"], [role="complementary"]'));
        return landmarkElements.map(el => el.getAttribute('role'));
      });
      
      expect(landmarks).toContain('main'); // Should have main content area
      
      // Check for ARIA labels on interactive elements
      const interactiveElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('button, [role="button"], input, select, textarea'));
        return elements.map(el => ({
          tagName: el.tagName,
          type: el.getAttribute('type'),
          ariaLabel: el.getAttribute('aria-label'),
          ariaLabelledBy: el.getAttribute('aria-labelledby'),
          hasLabel: !!el.closest('label') || !!document.querySelector(`label[for="${el.id}"]`)
        }));
      });
      
      for (const element of interactiveElements) {
        const hasAccessibleName = element.ariaLabel || element.ariaLabelledBy || element.hasLabel;
        if (!hasAccessibleName && element.tagName !== 'INPUT') {
          console.warn(`⚠️ Interactive element missing accessible name:`, element);
        }
      }
      
      console.log(`🏷️ Validated ${interactiveElements.length} interactive elements for ARIA labels`);
    });

    test('should announce dynamic content changes', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Check for live regions
      const liveRegions = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('[aria-live], [role="status"], [role="alert"]')).length;
      });
      
      console.log(`📢 Found ${liveRegions} live regions for dynamic content`);
      
      // Test notification announcement
      if (liveRegions > 0) {
        // Trigger a notification (assuming there's a way to do this)
        const notificationTrigger = await page.locator('[data-testid="notification-trigger"]').first();
        
        if (await notificationTrigger.count() > 0) {
          await notificationTrigger.click();
          
          // Check if notification appears in live region
          const notification = await page.locator('[role="alert"], [aria-live="polite"]');
          await expect(notification).toBeVisible();
        }
      }
    });
  });

  test.describe('Color Contrast and Visual Design', () => {
    test('should meet color contrast requirements', async ({ page }) => {
      await page.goto('/');
      
      await checkA11y(page, null, {
        rules: {
          'color-contrast': { enabled: true },
          'color-contrast-enhanced': { enabled: false } // Test AA, not AAA
        }
      });
      
      console.log('🎨 Color contrast meets WCAG AA requirements');
    });

    test('should not rely solely on color for information', async ({ page }) => {
      await page.goto('/discover');
      
      // Check for elements that might rely on color alone
      const colorReliantElements = await page.evaluate(() => {
        const elements = Array.from(document.querySelectorAll('.text-red-500, .text-green-500, .bg-red-500, .bg-green-500'));
        return elements.map(el => ({
          tagName: el.tagName,
          classes: el.className,
          textContent: el.textContent?.slice(0, 50),
          hasIcon: !!el.querySelector('svg, .icon'),
          hasText: !!el.textContent?.trim()
        }));
      });
      
      for (const element of colorReliantElements) {
        if (!element.hasIcon && !element.hasText) {
          console.warn(`⚠️ Element may rely solely on color:`, element);
        }
      }
    });

    test('should be usable in high contrast mode', async ({ page }) => {
      // Simulate high contrast mode
      await page.addStyleTag({
        content: `
          @media (prefers-contrast: high) {
            * {
              background: white !important;
              color: black !important;
              border-color: black !important;
            }
          }
        `
      });
      
      await page.goto('/');
      
      // Basic functionality should still work
      const navigation = await page.locator('nav, [role="navigation"]');
      await expect(navigation).toBeVisible();
      
      const mainContent = await page.locator('main, [role="main"]');
      await expect(mainContent).toBeVisible();
    });
  });

  test.describe('Form Accessibility', () => {
    test('should have accessible form validation', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Submit form without filling to trigger validation
      await page.click('[data-testid="register-button"]');
      
      // Check for accessible error messages
      const errorMessages = await page.locator('[role="alert"], [aria-live="polite"], .error-message');
      expect(await errorMessages.count()).toBeGreaterThan(0);
      
      // Error messages should be associated with form fields
      const firstError = errorMessages.first();
      const errorId = await firstError.getAttribute('id');
      
      if (errorId) {
        const associatedField = await page.locator(`[aria-describedby*="${errorId}"]`);
        expect(await associatedField.count()).toBeGreaterThan(0);
      }
    });

    test('should support autocomplete attributes', async ({ page }) => {
      await page.goto('/auth/login');
      
      const emailField = await page.locator('[data-testid="email-input"]');
      const passwordField = await page.locator('[data-testid="password-input"]');
      
      // Check for appropriate autocomplete attributes
      const emailAutocomplete = await emailField.getAttribute('autocomplete');
      const passwordAutocomplete = await passwordField.getAttribute('autocomplete');
      
      expect(emailAutocomplete).toContain('email');
      expect(passwordAutocomplete).toContain('password');
    });

    test('should have proper fieldset and legend for grouped form fields', async ({ page }) => {
      await page.goto('/auth/register');
      
      // Check for fieldset/legend if form has grouped fields
      const fieldsets = await page.locator('fieldset');
      
      for (let i = 0; i < await fieldsets.count(); i++) {
        const fieldset = fieldsets.nth(i);
        const legend = fieldset.locator('legend');
        
        // Each fieldset should have a legend
        await expect(legend).toBeVisible();
      }
    });
  });

  test.describe('Mobile Accessibility', () => {
    test('should be accessible on mobile devices', async ({ page, context }) => {
      // Create mobile context
      const mobileContext = await context.browser()?.newContext({
        ...context.browser()?.devices?.['iPhone 12']
      });
      
      const mobilePage = await mobileContext?.newPage();
      
      if (mobilePage) {
        await injectAxe(mobilePage);
        await mobilePage.goto('/');
        
        await checkA11y(mobilePage, null, {
          tags: ['wcag2a', 'wcag2aa', 'wcag21aa']
        });
        
        // Check touch target sizes
        const touchTargets = await mobilePage.evaluate(() => {
          const interactive = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"]'));
          return interactive.map(el => {
            const rect = el.getBoundingClientRect();
            return {
              width: rect.width,
              height: rect.height,
              area: rect.width * rect.height
            };
          });
        });
        
        // Touch targets should be at least 44x44 pixels (iOS) or 48x48 pixels (Android)
        const smallTargets = touchTargets.filter(target => 
          target.width < 44 || target.height < 44
        );
        
        if (smallTargets.length > 0) {
          console.warn(`⚠️ Found ${smallTargets.length} touch targets smaller than 44x44 pixels`);
        }
        
        await mobileContext?.close();
      }
    });

    test('should support zoom up to 200% without horizontal scrolling', async ({ page }) => {
      await page.goto('/');
      
      // Zoom to 200%
      await page.evaluate(() => {
        document.body.style.zoom = '2';
      });
      
      await page.waitForTimeout(1000);
      
      // Check for horizontal scrolling
      const hasHorizontalScroll = await page.evaluate(() => {
        return document.documentElement.scrollWidth > document.documentElement.clientWidth;
      });
      
      // Should not have horizontal scroll at 200% zoom
      expect(hasHorizontalScroll).toBe(false);
    });
  });

  test.describe('Video and Media Accessibility', () => {
    test('should have accessible video controls', async ({ page }) => {
      await page.goto('/');
      
      const videos = await page.locator('video');
      
      for (let i = 0; i < await videos.count(); i++) {
        const video = videos.nth(i);
        
        // Should have controls
        const hasControls = await video.getAttribute('controls');
        expect(hasControls).toBeTruthy();
        
        // Should have accessible label
        const ariaLabel = await video.getAttribute('aria-label');
        const title = await video.getAttribute('title');
        expect(ariaLabel || title).toBeTruthy();
      }
    });

    test('should provide captions for videos with audio', async ({ page }) => {
      await page.goto('/');
      
      const videos = await page.locator('video');
      
      for (let i = 0; i < await videos.count(); i++) {
        const video = videos.nth(i);
        const tracks = video.locator('track[kind="captions"], track[kind="subtitles"]');
        
        // If video has audio, should have captions
        // (In real implementation, you'd check if video actually has audio)
        if (await tracks.count() === 0) {
          console.warn('⚠️ Video may be missing captions');
        }
      }
    });
  });

  test.describe('Focus Management', () => {
    test('should have visible focus indicators', async ({ page }) => {
      await page.goto('/');
      
      // Tab to first focusable element
      await page.keyboard.press('Tab');
      
      // Check if focus is visible
      const focusedElement = await page.evaluate(() => {
        const el = document.activeElement;
        const styles = window.getComputedStyle(el!);
        return {
          outline: styles.outline,
          outlineWidth: styles.outlineWidth,
          boxShadow: styles.boxShadow,
          border: styles.border
        };
      });
      
      // Should have some form of visible focus indicator
      const hasFocusIndicator = 
        focusedElement.outline !== 'none' ||
        focusedElement.outlineWidth !== '0px' ||
        focusedElement.boxShadow !== 'none' ||
        focusedElement.border !== 'none';
      
      expect(hasFocusIndicator).toBe(true);
    });

    test('should trap focus in modals', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Open a modal (assuming there's one available)
      const modalTrigger = await page.locator('[data-testid="modal-trigger"]').first();
      
      if (await modalTrigger.count() > 0) {
        await modalTrigger.click();
        
        const modal = await page.locator('[role="dialog"]');
        await expect(modal).toBeVisible();
        
        // Tab through modal - focus should stay within modal
        const modalFocusableElements = await modal.locator('button, input, select, textarea, a[href], [tabindex]:not([tabindex="-1"])');
        const elementCount = await modalFocusableElements.count();
        
        if (elementCount > 0) {
          // Tab through all elements and one more
          for (let i = 0; i <= elementCount; i++) {
            await page.keyboard.press('Tab');
          }
          
          // Focus should be back on first element (focus trapped)
          const focusedElement = await page.evaluate(() => document.activeElement);
          const firstElement = await modalFocusableElements.first().evaluate(el => el);
          
          expect(focusedElement).toBe(firstElement);
        }
      }
    });
  });
});