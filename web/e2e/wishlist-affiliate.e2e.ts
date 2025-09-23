/**
 * Amazon Affiliate Model & Wishlist Functionality E2E Tests
 * 
 * Comprehensive testing of the Aclue business model focusing on:
 * - Wishlist creation and management
 * - Amazon affiliate link generation
 * - Social sharing functionality
 * - Product discovery and recommendation
 * - Revenue tracking and analytics
 * 
 * Business Model Validation:
 * - Users create and share wishlists
 * - Friends/family purchase via Amazon affiliate links
 * - Aclue earns commission from successful purchases
 * - Newsletter integration drives engagement
 */

import { test, expect, Page } from '@playwright/test';

const TEST_USER = {
  email: 'john.doe@example.com',
  password: 'password123'
};

const SAMPLE_PRODUCTS = [
  {
    name: 'Wireless Headphones',
    price: '£79.99',
    category: 'Electronics'
  },
  {
    name: 'Coffee Maker',
    price: '£149.99',
    category: 'Home & Kitchen'
  },
  {
    name: 'Running Shoes',
    price: '£89.99',
    category: 'Sports & Outdoors'
  }
];

test.describe('Amazon Affiliate Model & Wishlist Functionality', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/auth/login');
    await page.fill('[data-testid="email-input"]', TEST_USER.email);
    await page.fill('[data-testid="password-input"]', TEST_USER.password);
    await page.click('[data-testid="login-button"]');
    await expect(page).toHaveURL(/.*dashboard.*/);
  });

  test.describe('Wishlist Creation and Management', () => {
    test('should create a new wishlist successfully', async ({ page }) => {
      await page.goto('/wishlist');
      
      // Create new wishlist
      await page.click('[data-testid="create-wishlist-button"]');
      
      await page.waitForSelector('[data-testid="wishlist-form"]');
      
      await page.fill('[data-testid="wishlist-name-input"]', 'My Birthday Wishlist');
      await page.fill('[data-testid="wishlist-description-input"]', 'Items I would love for my birthday');
      await page.selectOption('[data-testid="wishlist-privacy-select"]', 'public');
      
      await page.click('[data-testid="save-wishlist-button"]');
      
      // Should show success message and redirect to wishlist view
      const successMessage = await page.locator('[data-testid="success-message"]');
      await expect(successMessage).toBeVisible();
      await expect(successMessage).toContainText(/wishlist.*created.*successfully/i);
      
      // Verify wishlist appears in user's wishlist collection
      await page.goto('/dashboard/wishlists');
      const wishlistCard = await page.locator('[data-testid="wishlist-card"]').first();
      await expect(wishlistCard).toBeVisible();
      await expect(wishlistCard).toContainText('My Birthday Wishlist');
    });

    test('should add products to wishlist', async ({ page }) => {
      // Go to product discovery
      await page.goto('/discover');
      
      // Add first product to wishlist
      const firstProduct = await page.locator('[data-testid="product-card"]').first();
      await firstProduct.hover();
      await firstProduct.locator('[data-testid="add-to-wishlist-button"]').click();
      
      // Select wishlist from modal
      await page.waitForSelector('[data-testid="wishlist-selector-modal"]');
      await page.click('[data-testid="wishlist-option"]');
      await page.click('[data-testid="confirm-add-to-wishlist"]');
      
      // Should show success feedback
      const notification = await page.locator('[data-testid="notification"]');
      await expect(notification).toBeVisible();
      await expect(notification).toContainText(/added.*to.*wishlist/i);
      
      // Verify product appears in wishlist
      await page.goto('/wishlist');
      const wishlistProduct = await page.locator('[data-testid="wishlist-product"]').first();
      await expect(wishlistProduct).toBeVisible();
    });

    test('should remove products from wishlist', async ({ page }) => {
      await page.goto('/wishlist');
      
      // Assume there's at least one product in the wishlist
      const firstProduct = await page.locator('[data-testid="wishlist-product"]').first();
      
      if (await firstProduct.count() > 0) {
        await firstProduct.hover();
        await firstProduct.locator('[data-testid="remove-from-wishlist-button"]').click();
        
        // Confirm removal
        await page.click('[data-testid="confirm-remove-button"]');
        
        // Product should be removed
        await expect(firstProduct).not.toBeVisible();
        
        // Should show confirmation message
        const notification = await page.locator('[data-testid="notification"]');
        await expect(notification).toContainText(/removed.*from.*wishlist/i);
      }
    });

    test('should edit wishlist details', async ({ page }) => {
      await page.goto('/dashboard/wishlists');
      
      const wishlistCard = await page.locator('[data-testid="wishlist-card"]').first();
      await wishlistCard.locator('[data-testid="edit-wishlist-button"]').click();
      
      await page.waitForSelector('[data-testid="edit-wishlist-form"]');
      
      // Update wishlist details
      await page.fill('[data-testid="wishlist-name-input"]', 'Updated Wishlist Name');
      await page.fill('[data-testid="wishlist-description-input"]', 'Updated description');
      
      await page.click('[data-testid="save-changes-button"]');
      
      // Should show success message
      const successMessage = await page.locator('[data-testid="success-message"]');
      await expect(successMessage).toContainText(/wishlist.*updated/i);
      
      // Verify changes are reflected
      await page.goto('/dashboard/wishlists');
      const updatedWishlist = await page.locator('[data-testid="wishlist-card"]').first();
      await expect(updatedWishlist).toContainText('Updated Wishlist Name');
    });

    test('should delete wishlist', async ({ page }) => {
      await page.goto('/dashboard/wishlists');
      
      const wishlistCard = await page.locator('[data-testid="wishlist-card"]').first();
      await wishlistCard.locator('[data-testid="delete-wishlist-button"]').click();
      
      // Confirm deletion
      await page.waitForSelector('[data-testid="delete-confirmation-modal"]');
      await page.fill('[data-testid="delete-confirmation-input"]', 'DELETE');
      await page.click('[data-testid="confirm-delete-button"]');
      
      // Wishlist should be removed
      const notification = await page.locator('[data-testid="notification"]');
      await expect(notification).toContainText(/wishlist.*deleted/i);
    });
  });

  test.describe('Amazon Affiliate Link Generation', () => {
    test('should generate Amazon affiliate links for products', async ({ page }) => {
      await page.goto('/discover');
      
      // Click on a product to view details
      await page.click('[data-testid="product-card"]');
      
      await page.waitForSelector('[data-testid="product-details"]');
      
      // Check for "Buy on Amazon" button with affiliate link
      const buyButton = await page.locator('[data-testid="buy-amazon-button"]');
      await expect(buyButton).toBeVisible();
      await expect(buyButton).toContainText(/buy.*on.*amazon/i);
      
      // Verify affiliate link format
      const affiliateLink = await buyButton.getAttribute('href');
      expect(affiliateLink).toContain('amazon.co.uk');
      expect(affiliateLink).toContain('tag='); // Amazon affiliate tag
      
      // Link should open in new tab
      expect(await buyButton.getAttribute('target')).toBe('_blank');
      expect(await buyButton.getAttribute('rel')).toContain('noopener');
    });

    test('should track affiliate link clicks', async ({ page }) => {
      await page.goto('/discover');
      
      // Click on product
      await page.click('[data-testid="product-card"]');
      
      // Click affiliate link
      const buyButton = await page.locator('[data-testid="buy-amazon-button"]');
      
      // Mock the click to prevent actual navigation
      await page.addInitScript(() => {
        window.affiliateLinkClicks = [];
        window.addEventListener('click', (e) => {
          if (e.target?.getAttribute('data-testid') === 'buy-amazon-button') {
            e.preventDefault();
            window.affiliateLinkClicks.push({
              productId: e.target.getAttribute('data-product-id'),
              timestamp: Date.now()
            });
          }
        });
      });
      
      await buyButton.click();
      
      // Verify click was tracked
      const clickTracked = await page.evaluate(() => {
        return window.affiliateLinkClicks.length > 0;
      });
      
      expect(clickTracked).toBe(true);
    });

    test('should display correct pricing and availability', async ({ page }) => {
      await page.goto('/discover');
      
      const productCard = await page.locator('[data-testid="product-card"]').first();
      
      // Should display price
      const price = await productCard.locator('[data-testid="product-price"]');
      await expect(price).toBeVisible();
      await expect(price).toMatch(/£\d+\.\d{2}/); // UK pricing format
      
      // Should display availability status
      const availability = await productCard.locator('[data-testid="product-availability"]');
      await expect(availability).toBeVisible();
    });
  });

  test.describe('Social Sharing Functionality', () => {
    test('should generate shareable wishlist links', async ({ page }) => {
      await page.goto('/dashboard/wishlists');
      
      const wishlistCard = await page.locator('[data-testid="wishlist-card"]').first();
      await wishlistCard.locator('[data-testid="share-wishlist-button"]').click();
      
      await page.waitForSelector('[data-testid="share-modal"]');
      
      // Should display shareable link
      const shareLink = await page.locator('[data-testid="share-link-input"]');
      await expect(shareLink).toBeVisible();
      
      const linkValue = await shareLink.inputValue();
      expect(linkValue).toContain('/wishlist/share/');
      expect(linkValue).toMatch(/^https?:\/\//); // Valid URL format
      
      // Copy link functionality
      await page.click('[data-testid="copy-link-button"]');
      
      const notification = await page.locator('[data-testid="notification"]');
      await expect(notification).toContainText(/link.*copied/i);
    });

    test('should share wishlist via social media', async ({ page }) => {
      await page.goto('/dashboard/wishlists');
      
      const wishlistCard = await page.locator('[data-testid="wishlist-card"]').first();
      await wishlistCard.locator('[data-testid="share-wishlist-button"]').click();
      
      await page.waitForSelector('[data-testid="share-modal"]');
      
      // Check social sharing buttons
      const facebookShare = await page.locator('[data-testid="share-facebook"]');
      const twitterShare = await page.locator('[data-testid="share-twitter"]');
      const whatsappShare = await page.locator('[data-testid="share-whatsapp"]');
      
      await expect(facebookShare).toBeVisible();
      await expect(twitterShare).toBeVisible();
      await expect(whatsappShare).toBeVisible();
      
      // Verify share URLs contain correct parameters
      const facebookUrl = await facebookShare.getAttribute('href');
      expect(facebookUrl).toContain('facebook.com/sharer');
      
      const twitterUrl = await twitterShare.getAttribute('href');
      expect(twitterUrl).toContain('twitter.com/intent/tweet');
    });

    test('should allow anonymous viewing of shared wishlists', async ({ page, context }) => {
      // First, get a share link (as authenticated user)
      await page.goto('/dashboard/wishlists');
      
      const wishlistCard = await page.locator('[data-testid="wishlist-card"]').first();
      await wishlistCard.locator('[data-testid="share-wishlist-button"]').click();
      
      const shareLink = await page.locator('[data-testid="share-link-input"]').inputValue();
      
      // Open new incognito context (anonymous user)
      const anonymousContext = await context.browser()?.newContext();
      const anonymousPage = await anonymousContext?.newPage();
      
      if (anonymousPage) {
        await anonymousPage.goto(shareLink);
        
        // Should be able to view wishlist without authentication
        await expect(anonymousPage).not.toHaveURL(/.*auth\/login.*/);
        
        // Should display wishlist products
        const productList = await anonymousPage.locator('[data-testid="shared-wishlist-products"]');
        await expect(productList).toBeVisible();
        
        // Should show "Buy on Amazon" buttons for each product
        const buyButtons = await anonymousPage.locator('[data-testid="buy-amazon-button"]');
        expect(await buyButtons.count()).toBeGreaterThan(0);
        
        await anonymousContext?.close();
      }
    });
  });

  test.describe('Product Discovery and Recommendations', () => {
    test('should display curated product recommendations', async ({ page }) => {
      await page.goto('/discover');
      
      // Should display product grid
      const productGrid = await page.locator('[data-testid="product-grid"]');
      await expect(productGrid).toBeVisible();
      
      // Should have multiple product categories
      const categoryFilters = await page.locator('[data-testid="category-filter"]');
      expect(await categoryFilters.count()).toBeGreaterThan(1);
      
      // Products should have required information
      const firstProduct = await page.locator('[data-testid="product-card"]').first();
      await expect(firstProduct.locator('[data-testid="product-image"]')).toBeVisible();
      await expect(firstProduct.locator('[data-testid="product-name"]')).toBeVisible();
      await expect(firstProduct.locator('[data-testid="product-price"]')).toBeVisible();
    });

    test('should filter products by category', async ({ page }) => {
      await page.goto('/discover');
      
      // Click on a category filter
      await page.click('[data-testid="category-filter"]:has-text("Electronics")');
      
      // Products should be filtered
      const productCards = await page.locator('[data-testid="product-card"]');
      const productCount = await productCards.count();
      
      expect(productCount).toBeGreaterThan(0);
      
      // Verify all visible products are from selected category
      for (let i = 0; i < Math.min(productCount, 5); i++) {
        const category = await productCards.nth(i).locator('[data-testid="product-category"]').textContent();
        expect(category).toContain('Electronics');
      }
    });

    test('should search for specific products', async ({ page }) => {
      await page.goto('/discover');
      
      // Use search functionality
      await page.fill('[data-testid="product-search-input"]', 'headphones');
      await page.click('[data-testid="search-button"]');
      
      // Should display search results
      const searchResults = await page.locator('[data-testid="search-results"]');
      await expect(searchResults).toBeVisible();
      
      // Results should be relevant to search term
      const firstResult = await page.locator('[data-testid="product-card"]').first();
      const productName = await firstResult.locator('[data-testid="product-name"]').textContent();
      expect(productName?.toLowerCase()).toContain('headphones');
    });

    test('should provide personalized recommendations', async ({ page }) => {
      await page.goto('/dashboard');
      
      // Should display recommended products section
      const recommendations = await page.locator('[data-testid="recommended-products"]');
      await expect(recommendations).toBeVisible();
      
      // Should have personalized heading
      const heading = await recommendations.locator('h2, h3').first();
      await expect(heading).toContainText(/recommended.*for.*you|suggested.*products/i);
      
      // Should display multiple recommendations
      const recommendedProducts = await recommendations.locator('[data-testid="product-card"]');
      expect(await recommendedProducts.count()).toBeGreaterThan(2);
    });
  });

  test.describe('Newsletter Integration', () => {
    test('should integrate newsletter signup with wishlist sharing', async ({ page }) => {
      // Test anonymous user visiting shared wishlist
      await page.goto('/wishlist/share/example-wishlist-id', { 
        waitUntil: 'networkidle' 
      });
      
      // Should display newsletter signup prompt
      const newsletterSignup = await page.locator('[data-testid="newsletter-signup"]');
      await expect(newsletterSignup).toBeVisible();
      
      // Should have compelling call-to-action
      const cta = await newsletterSignup.locator('[data-testid="newsletter-cta"]');
      await expect(cta).toContainText(/get.*notified|stay.*updated|join.*newsletter/i);
      
      // Test signup functionality
      await page.fill('[data-testid="newsletter-email-input"]', 'friend@example.com');
      await page.click('[data-testid="newsletter-signup-button"]');
      
      // Should show success message
      const successMessage = await page.locator('[data-testid="success-message"]');
      await expect(successMessage).toBeVisible();
      await expect(successMessage).toContainText(/subscribed.*successfully|thank.*you/i);
    });

    test('should track newsletter conversion from wishlist sharing', async ({ page }) => {
      // Mock analytics tracking
      await page.addInitScript(() => {
        window.analyticsEvents = [];
        window.trackEvent = (event, properties) => {
          window.analyticsEvents.push({ event, properties, timestamp: Date.now() });
        };
      });
      
      await page.goto('/wishlist/share/example-wishlist-id');
      
      // Subscribe to newsletter
      await page.fill('[data-testid="newsletter-email-input"]', 'tracker@example.com');
      await page.click('[data-testid="newsletter-signup-button"]');
      
      // Verify tracking event was fired
      const trackingEvents = await page.evaluate(() => window.analyticsEvents);
      const newsletterEvent = trackingEvents.find(event => 
        event.event === 'newsletter_signup' || 
        event.event === 'newsletter_subscription'
      );
      
      expect(newsletterEvent).toBeDefined();
      expect(newsletterEvent.properties).toHaveProperty('source', 'wishlist_share');
    });
  });

  test.describe('Revenue Tracking and Analytics', () => {
    test('should track affiliate link performance in dashboard', async ({ page }) => {
      await page.goto('/dashboard/analytics');
      
      // Should display affiliate performance metrics
      const affiliateStats = await page.locator('[data-testid="affiliate-stats"]');
      await expect(affiliateStats).toBeVisible();
      
      // Should show key metrics
      const metrics = [
        'total-clicks',
        'conversion-rate', 
        'estimated-earnings',
        'top-products'
      ];
      
      for (const metric of metrics) {
        const element = await page.locator(`[data-testid="${metric}"]`);
        await expect(element).toBeVisible();
      }
    });

    test('should display wishlist engagement metrics', async ({ page }) => {
      await page.goto('/dashboard/analytics');
      
      // Should show wishlist performance
      const wishlistMetrics = await page.locator('[data-testid="wishlist-metrics"]');
      await expect(wishlistMetrics).toBeVisible();
      
      // Should include engagement data
      const engagementMetrics = [
        'wishlist-views',
        'products-added',
        'social-shares',
        'conversion-rate'
      ];
      
      for (const metric of engagementMetrics) {
        const element = await page.locator(`[data-testid="${metric}"]`);
        await expect(element).toBeVisible();
      }
    });
  });

  test.describe('Business Model Validation', () => {
    test('should complete full user journey: discover → wishlist → share → purchase', async ({ page, context }) => {
      // Step 1: Discover products
      await page.goto('/discover');
      await page.click('[data-testid="product-card"]');
      
      // Step 2: Add to wishlist
      await page.click('[data-testid="add-to-wishlist-button"]');
      await page.click('[data-testid="wishlist-option"]');
      await page.click('[data-testid="confirm-add-to-wishlist"]');
      
      // Step 3: Share wishlist
      await page.goto('/dashboard/wishlists');
      await page.click('[data-testid="share-wishlist-button"]');
      const shareLink = await page.locator('[data-testid="share-link-input"]').inputValue();
      
      // Step 4: Simulate friend visiting and purchasing
      const friendContext = await context.browser()?.newContext();
      const friendPage = await friendContext?.newPage();
      
      if (friendPage) {
        await friendPage.goto(shareLink);
        
        // Friend can see wishlist
        await expect(friendPage.locator('[data-testid="shared-wishlist-products"]')).toBeVisible();
        
        // Friend clicks affiliate link
        const buyButton = await friendPage.locator('[data-testid="buy-amazon-button"]').first();
        const affiliateLink = await buyButton.getAttribute('href');
        
        // Verify it's a proper affiliate link
        expect(affiliateLink).toContain('amazon.co.uk');
        expect(affiliateLink).toContain('tag=');
        
        await friendContext?.close();
      }
      
      // This completes the business model flow:
      // User creates wishlist → Shares with friends → Friends purchase via affiliate links → Aclue earns commission
    });
  });
});