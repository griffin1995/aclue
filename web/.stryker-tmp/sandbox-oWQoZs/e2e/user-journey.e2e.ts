/**
 * Complete User Journey End-to-End Tests
 * 
 * Comprehensive e2e tests covering complete user workflows from registration
 * through product discovery, swiping, recommendations, and affiliate interactions.
 * 
 * Test Coverage:
 * - Complete onboarding flow
 * - Product discovery and swiping workflows
 * - Recommendation generation and display
 * - Affiliate click tracking
 * - User preference development
 * - Session management across workflows
 * - Cross-device consistency
 * 
 * Business Critical Journeys:
 * These tests validate the core user experience that drives engagement
 * and revenue generation through the aclue platform.
 * 
 * Performance Validation:
 * Includes performance assertions for critical user interactions
 * to ensure smooth user experience across all journeys.
 */
// @ts-nocheck


import { test, expect, Page } from '@playwright/test';

// ==============================================================================
// TEST DATA AND UTILITIES
// ==============================================================================

// Test user for complete journey
const journeyUser = {
  email: 'journey-test@aclue.app',
  password: 'JourneyTest123!',
  firstName: 'Journey',
  lastName: 'Tester',
};

// Mock product data expectations
const expectedProductFields = [
  'title',
  'description', 
  'price',
  'brand',
  'rating',
  'category',
];

// Helper function to complete user registration
async function registerUser(page: Page, user: any) {
  await page.goto('/auth/register');
  await page.fill('[name="firstName"]', user.firstName);
  await page.fill('[name="lastName"]', user.lastName);
  await page.fill('[name="email"]', user.email);
  await page.fill('[name="password"]', user.password);
  await page.check('[name="termsAccepted"]');
  await page.click('[type="submit"]');
  await page.waitForURL('/dashboard');
}

// Helper function to navigate to discover page
async function navigateToDiscover(page: Page) {
  await page.goto('/discover');
  await page.waitForSelector('[data-testid="swipe-interface"]');
}

// Helper function to perform swipe action
async function performSwipe(page: Page, direction: 'left' | 'right' | 'up') {
  const buttonMap = {
    'left': '[data-testid="dislike-button"]',
    'right': '[data-testid="like-button"]', 
    'up': '[data-testid="super-like-button"]',
  };
  
  await page.click(buttonMap[direction]);
  await page.waitForTimeout(500); // Wait for swipe animation
}

// Helper function to wait for recommendations to load
async function waitForRecommendations(page: Page) {
  await page.waitForSelector('[data-testid="recommendations-list"]');
  await page.waitForFunction(() => {
    const recommendations = document.querySelectorAll('[data-testid="product-card"]');
    return recommendations.length > 0;
  });
}

// ==============================================================================
// COMPLETE USER JOURNEY TESTS
// ==============================================================================

test.describe('Complete User Journeys', () => {
  
  test.describe('New User Onboarding Journey', () => {
    /**
     * Test complete new user onboarding experience.
     * 
     * Validates the entire flow from landing page discovery
     * through registration, onboarding, and first product interactions.
     * 
     * User Journey Steps:
     * 1. Land on homepage as anonymous user
     * 2. Navigate to application / discover page
     * 3. Hit authentication prompt
     * 4. Complete registration process
     * 5. Complete onboarding flow
     * 6. Reach first swipe session
     * 7. Complete initial preference collection
     */
    test('should guide new user through complete onboarding', async ({ page }) => {
      // Step 1: Land on homepage
      await page.goto('/');
      
      // Verify homepage content and branding
      await expect(page.locator('h1')).toContainText('aclue');
      await expect(page.locator('.hero-section')).toBeVisible();
      
      // Step 2: Navigate to application
      await page.click('[data-testid="app-entry-button"]');
      await page.waitForURL('/landingpage');
      
      // Verify landing page content
      await expect(page.locator('.landing-content')).toBeVisible();
      
      // Step 3: Try to access discover (should prompt for auth)
      await page.click('[data-testid="start-discovering-button"]');
      
      // Should redirect to login with return URL
      await page.waitForURL(/auth\/login/);
      expect(page.url()).toContain('returnUrl');
      
      // Step 4: Navigate to registration instead
      await page.click('[data-testid="register-link"]');
      await page.waitForURL('/auth/register');
      
      // Complete registration
      await page.fill('[name="firstName"]', journeyUser.firstName);
      await page.fill('[name="lastName"]', journeyUser.lastName);
      await page.fill('[name="email"]', journeyUser.email);
      await page.fill('[name="password"]', journeyUser.password);
      await page.check('[name="termsAccepted"]');
      await page.check('[name="marketingConsent"]'); // Opt into marketing for better UX
      await page.click('[type="submit"]');
      
      // Step 5: Should redirect to onboarding flow
      await page.waitForURL('/onboarding');
      
      // Complete onboarding steps
      // Preference setup
      await expect(page.locator('h1')).toContainText('Set Your Preferences');
      await page.click('[data-testid="category-electronics"]');
      await page.click('[data-testid="category-fashion"]');
      await page.click('[data-testid="price-range-100-500"]');
      await page.click('[data-testid="onboarding-continue"]');
      
      // Welcome to swiping tutorial
      await expect(page.locator('h1')).toContainText('How Swiping Works');
      await page.click('[data-testid="tutorial-next"]');
      await page.click('[data-testid="tutorial-next"]');
      await page.click('[data-testid="start-swiping"]');
      
      // Step 6: Should arrive at discover page
      await page.waitForURL('/discover');
      
      // Verify swipe interface is loaded
      await expect(page.locator('[data-testid="swipe-interface"]')).toBeVisible();
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
      
      // Step 7: Complete first swipe session (3-5 swipes)
      const initialSwipeCount = 5;
      for (let i = 0; i < initialSwipeCount; i++) {
        // Alternate between likes and dislikes for variety
        const direction = i % 2 === 0 ? 'right' : 'left';
        await performSwipe(page, direction);
        
        // Verify progress indicator updates
        await expect(page.locator('[data-testid="swipe-progress"]')).toBeVisible();
      }
      
      // Verify session completion
      await expect(page.locator('[data-testid="session-complete"]')).toBeVisible();
      await expect(page.locator('[data-testid="session-summary"]')).toContainText('Great start!');
      
      // Navigate to recommendations
      await page.click('[data-testid="view-recommendations"]');
      await page.waitForURL('/dashboard/recommendations');
      
      // Verify first recommendations are displayed
      await waitForRecommendations(page);
      await expect(page.locator('[data-testid="recommendation-card"]').first()).toBeVisible();
    });

    /**
     * Test onboarding skip functionality.
     * 
     * Validates that users can skip onboarding steps while still
     * getting a functional experience with default preferences.
     */
    test('should handle onboarding skip gracefully', async ({ page }) => {
      // Register user
      await registerUser(page, journeyUser);
      
      // Should redirect to onboarding
      await page.waitForURL('/onboarding');
      
      // Skip onboarding
      await page.click('[data-testid="skip-onboarding"]');
      
      // Should arrive at dashboard with default experience
      await page.waitForURL('/dashboard');
      
      // Verify default dashboard state
      await expect(page.locator('[data-testid="user-greeting"]')).toContainText(journeyUser.firstName);
      await expect(page.locator('[data-testid="getting-started-tips"]')).toBeVisible();
      
      // Verify discover is accessible
      await page.goto('/discover');
      await expect(page.locator('[data-testid="swipe-interface"]')).toBeVisible();
    });
  });

  test.describe('Product Discovery and Swiping Journey', () => {
    /**
     * Test comprehensive swiping experience.
     * 
     * Validates the core swiping functionality including gesture recognition,
     * preference tracking, session management, and recommendation impact.
     */
    test('should provide complete swiping experience', async ({ page }) => {
      // Setup authenticated user
      await registerUser(page, journeyUser);
      await navigateToDiscover(page);
      
      // Verify initial swipe interface
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
      
      // Verify product information is complete
      for (const field of expectedProductFields) {
        await expect(page.locator(`[data-testid="product-${field}"]`)).toBeVisible();
      }
      
      // Test different swipe interactions
      const swipeSequence = [
        { direction: 'right', expectedFeedback: 'Liked!' },
        { direction: 'left', expectedFeedback: 'Passed' },
        { direction: 'up', expectedFeedback: 'Super Liked!' },
        { direction: 'right', expectedFeedback: 'Liked!' },
        { direction: 'right', expectedFeedback: 'Liked!' },
      ] as const;
      
      for (let i = 0; i < swipeSequence.length; i++) {
        const { direction, expectedFeedback } = swipeSequence[i];
        
        // Record current product for verification
        const productTitle = await page.locator('[data-testid="product-title"]').textContent();
        
        // Perform swipe
        await performSwipe(page, direction);
        
        // Verify feedback animation
        await expect(page.locator('[data-testid="swipe-feedback"]')).toContainText(expectedFeedback);
        
        // Verify progress to next product (if not last swipe)
        if (i < swipeSequence.length - 1) {
          await expect(page.locator('[data-testid="product-title"]')).not.toContainText(productTitle!);
        }
      }
      
      // Verify session completion
      await expect(page.locator('[data-testid="session-complete"]')).toBeVisible();
      
      // Verify session statistics
      await expect(page.locator('[data-testid="total-swipes"]')).toContainText('5');
      await expect(page.locator('[data-testid="liked-products"]')).toContainText('3'); // 2 right + 1 super
      await expect(page.locator('[data-testid="passed-products"]')).toContainText('1'); // 1 left
      await expect(page.locator('[data-testid="super-likes"]')).toContainText('1'); // 1 up
    });

    /**
     * Test swipe session progression and management.
     * 
     * Validates that multiple swipe sessions work correctly with
     * progress tracking and session state management.
     */
    test('should handle multiple swipe sessions', async ({ page }) => {
      await registerUser(page, journeyUser);
      await navigateToDiscover(page);
      
      // Complete first session
      for (let i = 0; i < 3; i++) {
        await performSwipe(page, 'right');
      }
      
      // Verify first session completion
      await expect(page.locator('[data-testid="session-complete"]')).toBeVisible();
      
      // Start new session
      await page.click('[data-testid="start-new-session"]');
      
      // Verify new products loaded
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
      await expect(page.locator('[data-testid="session-progress"]')).toContainText('1 of');
      
      // Complete second session with different pattern
      const secondSessionSwipes = ['left', 'left', 'right', 'up'] as const;
      for (const direction of secondSessionSwipes) {
        await performSwipe(page, direction);
      }
      
      // Verify second session completion
      await expect(page.locator('[data-testid="session-complete"]')).toBeVisible();
      
      // Verify cumulative statistics
      await expect(page.locator('[data-testid="total-sessions"]')).toContainText('2');
    });

    /**
     * Test offline/error handling during swiping.
     * 
     * Validates that network errors don't break the swiping experience
     * and that swipes are queued for retry when connection returns.
     */
    test('should handle network errors during swiping', async ({ page }) => {
      await registerUser(page, journeyUser);
      await navigateToDiscover(page);
      
      // Simulate network failure
      await page.route('**/api/v1/swipes', (route) => route.abort('failed'));
      
      // Perform swipe during network failure
      await performSwipe(page, 'right');
      
      // Verify error handling doesn't break UI
      await expect(page.locator('[data-testid="product-card"]')).toBeVisible();
      
      // Verify error notification
      await expect(page.locator('[data-testid="network-error"]')).toContainText('Connection issue');
      
      // Restore network
      await page.unroute('**/api/v1/swipes');
      
      // Verify retry functionality
      await page.click('[data-testid="retry-swipe"]');
      await expect(page.locator('[data-testid="network-error"]')).not.toBeVisible();
    });
  });

  test.describe('Recommendation and Purchase Journey', () => {
    /**
     * Test recommendation generation and interaction.
     * 
     * Validates that user preferences generate appropriate recommendations
     * and that users can interact with recommendations effectively.
     */
    test('should generate and display personalized recommendations', async ({ page }) => {
      await registerUser(page, journeyUser);
      
      // Build preferences through swiping
      await navigateToDiscover(page);
      
      // Create preference pattern - like electronics, dislike fashion
      const preferenceSwipes = [
        { category: 'electronics', direction: 'right' },
        { category: 'electronics', direction: 'up' },
        { category: 'fashion', direction: 'left' },
        { category: 'electronics', direction: 'right' },
      ] as const;
      
      for (const { direction } of preferenceSwipes) {
        await performSwipe(page, direction);
      }
      
      // Navigate to recommendations
      await page.click('[data-testid="view-recommendations"]');
      await page.waitForURL('/dashboard/recommendations');
      
      // Wait for personalized recommendations to load
      await waitForRecommendations(page);
      
      // Verify recommendations are displayed
      const recommendationCards = page.locator('[data-testid="recommendation-card"]');
      await expect(recommendationCards.first()).toBeVisible();
      
      // Verify recommendation metadata
      await expect(page.locator('[data-testid="personalized-badge"]')).toBeVisible();
      await expect(page.locator('[data-testid="recommendation-score"]')).toBeVisible();
      
      // Verify recommendations match preferences (should favor electronics)
      const firstRecommendation = recommendationCards.first();
      await expect(firstRecommendation.locator('[data-testid="product-category"]')).toContainText(/electronics/i);
      
      // Test recommendation interaction
      await firstRecommendation.click();
      
      // Verify product detail view
      await expect(page.locator('[data-testid="product-detail"]')).toBeVisible();
      await expect(page.locator('[data-testid="add-to-wishlist"]')).toBeVisible();
    });

    /**
     * Test affiliate click tracking and purchase flow.
     * 
     * Validates that affiliate links are properly tracked and
     * users are guided through purchase intentions.
     */
    test('should track affiliate clicks and guide purchase flow', async ({ page }) => {
      await registerUser(page, journeyUser);
      
      // Navigate to recommendations
      await page.goto('/dashboard/recommendations');
      await waitForRecommendations(page);
      
      // Click on first recommendation
      const firstRecommendation = page.locator('[data-testid="recommendation-card"]').first();
      await firstRecommendation.click();
      
      // Verify product detail page
      await expect(page.locator('[data-testid="product-detail"]')).toBeVisible();
      
      // Record product title for tracking
      const productTitle = await page.locator('[data-testid="product-title"]').textContent();
      
      // Mock affiliate click tracking
      let affiliateClickTracked = false;
      await page.route('**/api/v1/affiliate/click', (route) => {
        affiliateClickTracked = true;
        route.fulfill({ 
          status: 201,
          body: JSON.stringify({
            click_id: 'test-click-123',
            recorded_at: new Date().toISOString(),
            affiliate_network: 'amazon'
          })
        });
      });
      
      // Click purchase button
      await page.click('[data-testid="purchase-button"]');
      
      // Verify purchase intent modal
      await expect(page.locator('[data-testid="purchase-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="affiliate-disclosure"]')).toContainText('affiliate commission');
      
      // Confirm purchase intent
      await page.click('[data-testid="confirm-purchase"]');
      
      // Verify affiliate click was tracked
      expect(affiliateClickTracked).toBe(true);
      
      // Verify new tab would open with affiliate link (we'll mock this)
      await expect(page.locator('[data-testid="purchase-success"]')).toContainText('Opening purchase page');
      
      // Verify purchase history tracking
      await page.goto('/dashboard/purchases');
      await expect(page.locator('[data-testid="purchase-history"]')).toBeVisible();
      await expect(page.locator('[data-testid="recent-purchase"]')).toContainText(productTitle!);
    });

    /**
     * Test wishlist functionality.
     * 
     * Validates that users can save products to wishlist and
     * manage their saved items effectively.
     */
    test('should manage wishlist functionality', async ({ page }) => {
      await registerUser(page, journeyUser);
      await page.goto('/dashboard/recommendations');
      await waitForRecommendations(page);
      
      // Add first recommendation to wishlist
      const firstRecommendation = page.locator('[data-testid="recommendation-card"]').first();
      const productTitle = await firstRecommendation.locator('[data-testid="product-title"]').textContent();
      
      await firstRecommendation.locator('[data-testid="wishlist-button"]').click();
      
      // Verify wishlist confirmation
      await expect(page.locator('[data-testid="wishlist-added"]')).toContainText('Added to wishlist');
      
      // Navigate to wishlist
      await page.goto('/dashboard/wishlist');
      
      // Verify product is in wishlist
      await expect(page.locator('[data-testid="wishlist-item"]')).toBeVisible();
      await expect(page.locator('[data-testid="wishlist-item"]')).toContainText(productTitle!);
      
      // Test wishlist item management
      await page.click('[data-testid="wishlist-item-options"]');
      await page.click('[data-testid="remove-from-wishlist"]');
      
      // Verify removal confirmation
      await expect(page.locator('[data-testid="wishlist-empty"]')).toBeVisible();
    });
  });

  test.describe('User Profile and Preferences Journey', () => {
    /**
     * Test user profile management and preference updates.
     * 
     * Validates that users can manage their profile information
     * and preference settings with real-time impact on recommendations.
     */
    test('should manage user profile and preferences', async ({ page }) => {
      await registerUser(page, journeyUser);
      
      // Navigate to profile
      await page.goto('/dashboard/profile');
      
      // Verify profile information
      await expect(page.locator('[data-testid="profile-email"]')).toContainText(journeyUser.email);
      await expect(page.locator('[data-testid="profile-name"]')).toContainText(journeyUser.firstName);
      
      // Update profile information
      await page.click('[data-testid="edit-profile"]');
      await page.fill('[name="firstName"]', 'Updated');
      await page.fill('[name="lastName"]', 'Name');
      await page.click('[data-testid="save-profile"]');
      
      // Verify profile update
      await expect(page.locator('[data-testid="profile-name"]')).toContainText('Updated Name');
      
      // Navigate to preferences
      await page.click('[data-testid="preferences-tab"]');
      
      // Verify current preferences (based on swipe history)
      await expect(page.locator('[data-testid="preference-summary"]')).toBeVisible();
      
      // Update preferences manually
      await page.click('[data-testid="edit-preferences"]');
      await page.click('[data-testid="category-home-garden"]');
      await page.drag('[data-testid="price-range-slider"]', { x: 100, y: 0 });
      await page.click('[data-testid="save-preferences"]');
      
      // Verify preferences updated
      await expect(page.locator('[data-testid="preference-updated"]')).toContainText('Preferences saved');
      
      // Verify impact on recommendations
      await page.goto('/dashboard/recommendations');
      await waitForRecommendations(page);
      
      // Should show updated recommendations based on new preferences
      await expect(page.locator('[data-testid="recommendations-updated"]')).toBeVisible();
    });

    /**
     * Test subscription management (if applicable).
     * 
     * Validates subscription tier features and upgrade flows.
     */
    test('should handle subscription tier features', async ({ page }) => {
      await registerUser(page, journeyUser);
      await page.goto('/dashboard/profile');
      
      // Verify free tier status
      await expect(page.locator('[data-testid="subscription-tier"]')).toContainText('Free');
      
      // Test premium feature access restriction
      await page.goto('/dashboard/analytics');
      await expect(page.locator('[data-testid="premium-required"]')).toBeVisible();
      
      // Click upgrade button
      await page.click('[data-testid="upgrade-premium"]');
      
      // Verify upgrade modal
      await expect(page.locator('[data-testid="upgrade-modal"]')).toBeVisible();
      await expect(page.locator('[data-testid="premium-features"]')).toContainText('Advanced Analytics');
      
      // For testing, we'll mock the upgrade process
      await page.click('[data-testid="mock-upgrade"]');
      
      // Verify premium access
      await expect(page.locator('[data-testid="subscription-tier"]')).toContainText('Premium');
      
      // Test premium feature access
      await page.goto('/dashboard/analytics');
      await expect(page.locator('[data-testid="analytics-dashboard"]')).toBeVisible();
    });
  });

  test.describe('Performance and Mobile Journey', () => {
    /**
     * Test critical performance metrics during user journey.
     * 
     * Validates that key user interactions meet performance
     * requirements for good user experience.
     */
    test('should meet performance requirements for critical flows', async ({ page }) => {
      // Register user and measure performance
      const startTime = Date.now();
      
      await registerUser(page, journeyUser);
      
      const registrationTime = Date.now() - startTime;
      expect(registrationTime).toBeLessThan(5000); // Registration should complete in 5s
      
      // Measure discover page load time
      const discoverStartTime = Date.now();
      await navigateToDiscover(page);
      const discoverLoadTime = Date.now() - discoverStartTime;
      expect(discoverLoadTime).toBeLessThan(3000); // Discover should load in 3s
      
      // Measure swipe response time
      const swipeStartTime = Date.now();
      await performSwipe(page, 'right');
      const swipeResponseTime = Date.now() - swipeStartTime;
      expect(swipeResponseTime).toBeLessThan(500); // Swipe should respond in 500ms
      
      // Measure recommendation generation time
      await page.click('[data-testid="view-recommendations"]');
      const recStartTime = Date.now();
      await waitForRecommendations(page);
      const recLoadTime = Date.now() - recStartTime;
      expect(recLoadTime).toBeLessThan(2000); // Recommendations should load in 2s
    });

    /**
     * Test mobile-specific user journey.
     * 
     * Validates that the complete user journey works correctly
     * on mobile devices with touch interactions.
     */
    test('should work correctly on mobile devices', async ({ page, isMobile }) => {
      // Skip if not running mobile test
      test.skip(!isMobile, 'This test is for mobile devices only');
      
      await registerUser(page, journeyUser);
      await navigateToDiscover(page);
      
      // Verify mobile swipe interface
      await expect(page.locator('[data-testid="mobile-swipe-interface"]')).toBeVisible();
      
      // Test touch swipe gestures
      const productCard = page.locator('[data-testid="product-card"]');
      
      // Swipe left (dislike)
      await productCard.swipeLeft();
      await expect(page.locator('[data-testid="swipe-feedback"]')).toContainText('Passed');
      
      // Swipe right (like)
      await productCard.swipeRight();
      await expect(page.locator('[data-testid="swipe-feedback"]')).toContainText('Liked!');
      
      // Test mobile navigation
      await page.click('[data-testid="mobile-menu-toggle"]');
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
      
      // Navigate to recommendations via mobile menu
      await page.click('[data-testid="mobile-recommendations-link"]');
      await page.waitForURL('/dashboard/recommendations');
      
      // Verify mobile recommendations layout
      await expect(page.locator('[data-testid="mobile-recommendations"]')).toBeVisible();
    });
  });
});