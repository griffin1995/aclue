/**
 * WorkingSwipeInterface Component Test Suite
 * 
 * Comprehensive tests for the swipe interface component that handles
 * product swiping, user interactions, and recommendation workflows.
 * 
 * Test Coverage:
 * - Product card rendering and data display
 * - Swipe gesture handling and direction detection
 * - Session management and progress tracking
 * - API integration for swipe recording
 * - Loading states and error handling
 * - User interaction flows and state transitions
 * 
 * Testing Strategy:
 * User-centric testing focusing on interaction behaviour, visual feedback,
 * and proper integration with backend services for swipe data collection.
 * 
 * Business Context:
 * The swipe interface is the core user interaction for gathering preference
 * signals and must handle gestures reliably while providing smooth UX.
 */
// @ts-nocheck


// ==============================================================================
// IMPORTS AND DEPENDENCIES
// ==============================================================================

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WorkingSwipeInterface } from '../WorkingSwipeInterface';
import { useAuth } from '@/hooks/useAuth';
import * as api from '@/lib/api';

// Mock authentication hook
jest.mock('@/hooks/useAuth', () => ({
  useAuth: jest.fn(),
}));

// Mock API functions
jest.mock('@/lib/api', () => ({
  recordSwipe: jest.fn(),
  getProducts: jest.fn(),
}));

// Mock framer-motion for simpler testing
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>,
}));

// ==============================================================================
// TEST SETUP AND UTILITIES
// ==============================================================================

// Mock product data
const mockProducts = [
  {
    id: 'product-1',
    title: 'iPhone 15 Pro',
    description: 'Latest Apple smartphone with advanced features',
    price_min: 999,
    price_max: 1199,
    currency: 'GBP',
    brand: 'Apple',
    image_url: 'https://example.com/iphone15.jpg',
    affiliate_url: 'https://amazon.co.uk/dp/B123?tag=aclue-21',
    rating: 4.8,
    review_count: 1500,
    categories: { name: 'Electronics', slug: 'electronics' },
  },
  {
    id: 'product-2',
    title: 'Nike Air Max 90',
    description: 'Classic running shoes with modern comfort',
    price_min: 120,
    price_max: 180,
    currency: 'GBP',
    brand: 'Nike',
    image_url: 'https://example.com/nike-airmax.jpg',
    affiliate_url: 'https://nike.com/air-max-90',
    rating: 4.5,
    review_count: 800,
    categories: { name: 'Fashion', slug: 'fashion' },
  },
  {
    id: 'product-3',
    title: 'Sony WH-1000XM5',
    description: 'Premium noise-cancelling headphones',
    price_min: 350,
    price_max: 380,
    currency: 'GBP',
    brand: 'Sony',
    image_url: 'https://example.com/sony-headphones.jpg',
    affiliate_url: 'https://sony.com/headphones/wh-1000xm5',
    rating: 4.9,
    review_count: 2300,
    categories: { name: 'Electronics', slug: 'electronics' },
  },
];

// Mock authenticated user
const mockUser = {
  id: 'user-123',
  email: 'test@aclue.app',
  firstName: 'Test',
  lastName: 'User',
  subscriptionTier: 'free',
};

// ==============================================================================
// SWIPE INTERFACE COMPONENT TESTS
// ==============================================================================

describe('WorkingSwipeInterface Component', () => {
  // Setup mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock successful authentication
    (useAuth as jest.Mock).mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      isLoading: false,
      error: null,
    });
    
    // Mock successful API calls
    (api.getProducts as jest.Mock).mockResolvedValue(mockProducts);
    (api.recordSwipe as jest.Mock).mockResolvedValue({
      interaction_id: 'swipe-123',
      recorded_at: new Date().toISOString(),
    });
  });

  describe('Component Initialization', () => {
    /**
     * Test initial component rendering and setup.
     * 
     * Validates that the swipe interface properly initializes
     * with loading states and fetches product data.
     */
    it('should render loading state initially', () => {
      render(<WorkingSwipeInterface />);
      
      // Verify loading indicator
      expect(screen.getByText('Loading products...')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    /**
     * Test successful product loading and display.
     * 
     * Validates that products are properly fetched and the first
     * product card is displayed with correct information.
     */
    it('should load and display products successfully', async () => {
      render(<WorkingSwipeInterface />);
      
      // Wait for products to load
      await waitFor(() => {
        expect(screen.queryByText('Loading products...')).not.toBeInTheDocument();
      });
      
      // Verify first product is displayed
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Latest Apple smartphone with advanced features')).toBeInTheDocument();
      expect(screen.getByText('£999 - £1,199')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('★ 4.8 (1,500 reviews)')).toBeInTheDocument();
      
      // Verify progress indicator
      expect(screen.getByText('1 of 3')).toBeInTheDocument();
      
      // Verify API was called
      expect(api.getProducts).toHaveBeenCalledTimes(1);
    });

    /**
     * Test error handling during product loading.
     * 
     * Validates that API errors are properly handled with
     * appropriate error messages and recovery options.
     */
    it('should handle product loading errors gracefully', async () => {
      // Mock API error
      (api.getProducts as jest.Mock).mockRejectedValue(
        new Error('Failed to fetch products')
      );
      
      render(<WorkingSwipeInterface />);
      
      // Wait for error state
      await waitFor(() => {
        expect(screen.getByText('Failed to load products')).toBeInTheDocument();
      });
      
      // Verify retry button is available
      const retryButton = screen.getByRole('button', { name: /retry/i });
      expect(retryButton).toBeInTheDocument();
      
      // Test retry functionality
      (api.getProducts as jest.Mock).mockResolvedValueOnce(mockProducts);
      
      await userEvent.click(retryButton);
      
      // Verify retry attempt
      expect(api.getProducts).toHaveBeenCalledTimes(2);
    });
  });

  describe('Product Card Display', () => {
    /**
     * Test product card information rendering.
     * 
     * Validates that all product details are correctly displayed
     * with proper formatting and visual hierarchy.
     */
    it('should display complete product information', async () => {
      render(<WorkingSwipeInterface />);
      
      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Verify all product details are displayed
      expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      expect(screen.getByText('Latest Apple smartphone with advanced features')).toBeInTheDocument();
      expect(screen.getByText('£999 - £1,199')).toBeInTheDocument();
      expect(screen.getByText('Apple')).toBeInTheDocument();
      expect(screen.getByText('Electronics')).toBeInTheDocument();
      expect(screen.getByText('★ 4.8 (1,500 reviews)')).toBeInTheDocument();
      
      // Verify product image
      const productImage = screen.getByAltText('iPhone 15 Pro');
      expect(productImage).toBeInTheDocument();
      expect(productImage).toHaveAttribute('src', 'https://example.com/iphone15.jpg');
    });

    /**
     * Test price formatting for different price ranges.
     * 
     * Validates that product prices are displayed with proper
     * formatting for single prices vs price ranges.
     */
    it('should format prices correctly for different scenarios', async () => {
      // Mock products with different price structures
      const priceTestProducts = [
        {
          ...mockProducts[0],
          price_min: 99,
          price_max: 99, // Same price
        },
        {
          ...mockProducts[1],
          price_min: null,
          price_max: 150, // Max price only
        },
        {
          ...mockProducts[2],
          price_min: 200,
          price_max: null, // Min price only
        },
      ];
      
      (api.getProducts as jest.Mock).mockResolvedValue(priceTestProducts);
      
      render(<WorkingSwipeInterface />);
      
      // Wait for first product (single price)
      await waitFor(() => {
        expect(screen.getByText('£99')).toBeInTheDocument();
      });
      
      // Test navigation to other products to verify price formatting
      const rightButton = screen.getByRole('button', { name: /like/i });
      await userEvent.click(rightButton);
      
      await waitFor(() => {
        expect(screen.getByText('£150')).toBeInTheDocument(); // Max only
      });
      
      await userEvent.click(rightButton);
      
      await waitFor(() => {
        expect(screen.getByText('From £200')).toBeInTheDocument(); // Min only
      });
    });
  });

  describe('Swipe Gesture Handling', () => {
    /**
     * Test left swipe (dislike) functionality.
     * 
     * Validates that left swipes are properly handled with
     * visual feedback and API recording.
     */
    it('should handle left swipe (dislike) gestures', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Perform left swipe using button
      const leftButton = screen.getByRole('button', { name: /dislike/i });
      await user.click(leftButton);
      
      // Verify swipe was recorded
      await waitFor(() => {
        expect(api.recordSwipe).toHaveBeenCalledWith({
          product_id: 'product-1',
          direction: 'left',
          session_id: expect.any(String),
          time_spent_seconds: expect.any(Number),
          preference_strength: expect.any(Number),
          interaction_context: expect.any(Object),
        });
      });
      
      // Verify progress to next product
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      expect(screen.getByText('2 of 3')).toBeInTheDocument();
    });

    /**
     * Test right swipe (like) functionality.
     * 
     * Validates that right swipes are properly handled with
     * positive preference signals and smooth transitions.
     */
    it('should handle right swipe (like) gestures', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Perform right swipe using button
      const rightButton = screen.getByRole('button', { name: /like/i });
      await user.click(rightButton);
      
      // Verify swipe was recorded with higher preference strength
      await waitFor(() => {
        expect(api.recordSwipe).toHaveBeenCalledWith({
          product_id: 'product-1',
          direction: 'right',
          session_id: expect.any(String),
          time_spent_seconds: expect.any(Number),
          preference_strength: expect.any(Number),
          interaction_context: expect.any(Object),
        });
      });
      
      // Verify preference strength is higher for likes
      const recordCall = (api.recordSwipe as jest.Mock).mock.calls[0][0];
      expect(recordCall.preference_strength).toBeGreaterThan(0.5);
      
      // Verify transition to next product
      expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
    });

    /**
     * Test super like (up swipe) functionality.
     * 
     * Validates that super likes generate strongest preference
     * signals and provide appropriate visual feedback.
     */
    it('should handle super like gestures', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Perform super like (double-tap or special button)
      const superLikeButton = screen.getByRole('button', { name: /super like/i });
      await user.click(superLikeButton);
      
      // Verify super like was recorded
      await waitFor(() => {
        expect(api.recordSwipe).toHaveBeenCalledWith({
          product_id: 'product-1',
          direction: 'up',
          session_id: expect.any(String),
          time_spent_seconds: expect.any(Number),
          preference_strength: expect.any(Number),
          interaction_context: expect.any(Object),
        });
      });
      
      // Verify highest preference strength for super likes
      const recordCall = (api.recordSwipe as jest.Mock).mock.calls[0][0];
      expect(recordCall.preference_strength).toBeGreaterThan(0.8);
      
      // Verify visual feedback for super like
      expect(screen.getByText('Super Liked!')).toBeInTheDocument();
    });

    /**
     * Test swipe context data recording.
     * 
     * Validates that rich context information is captured
     * with each swipe for ML algorithm training.
     */
    it('should record rich context data with swipes', async () => {
      const user = userEvent.setup();
      
      // Mock viewport size
      Object.defineProperty(window, 'innerWidth', { value: 1920 });
      Object.defineProperty(window, 'innerHeight', { value: 1080 });
      
      render(<WorkingSwipeInterface />);
      
      // Wait for products to load
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Perform swipe
      const rightButton = screen.getByRole('button', { name: /like/i });
      await user.click(rightButton);
      
      // Verify context data was recorded
      await waitFor(() => {
        const recordCall = (api.recordSwipe as jest.Mock).mock.calls[0][0];
        expect(recordCall.interaction_context).toEqual({
          viewport_size: { width: 1920, height: 1080 },
          session_position: 1,
          device_type: 'desktop',
          interaction_method: 'button',
        });
      });
    });
  });

  describe('Session Management', () => {
    /**
     * Test session progress tracking.
     * 
     * Validates that session progress is accurately tracked
     * and displayed throughout the swiping experience.
     */
    it('should track session progress accurately', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      // Wait for initial load
      await waitFor(() => {
        expect(screen.getByText('1 of 3')).toBeInTheDocument();
      });
      
      // First swipe
      const rightButton = screen.getByRole('button', { name: /like/i });
      await user.click(rightButton);
      
      await waitFor(() => {
        expect(screen.getByText('2 of 3')).toBeInTheDocument();
      });
      
      // Second swipe
      await user.click(rightButton);
      
      await waitFor(() => {
        expect(screen.getByText('3 of 3')).toBeInTheDocument();
      });
      
      // Final swipe should complete session
      await user.click(rightButton);
      
      await waitFor(() => {
        expect(screen.getByText('Session Complete!')).toBeInTheDocument();
        expect(screen.getByText('Great job! You\'ve completed your swipe session.')).toBeInTheDocument();
      });
    });

    /**
     * Test session completion handling.
     * 
     * Validates that session completion is properly handled
     * with appropriate messaging and next steps.
     */
    it('should handle session completion with summary', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      // Complete all swipes
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Swipe through all products
      const rightButton = screen.getByRole('button', { name: /like/i });
      const leftButton = screen.getByRole('button', { name: /dislike/i });
      
      await user.click(rightButton); // Like iPhone
      await user.click(leftButton);  // Dislike Nike
      await user.click(rightButton); // Like Sony
      
      // Verify session completion
      await waitFor(() => {
        expect(screen.getByText('Session Complete!')).toBeInTheDocument();
        expect(screen.getByText('Products Viewed: 3')).toBeInTheDocument();
        expect(screen.getByText('Products Liked: 2')).toBeInTheDocument();
        expect(screen.getByText('Products Disliked: 1')).toBeInTheDocument();
      });
      
      // Verify restart option
      const restartButton = screen.getByRole('button', { name: /start new session/i });
      expect(restartButton).toBeInTheDocument();
    });

    /**
     * Test session restart functionality.
     * 
     * Validates that users can restart swiping sessions
     * with fresh product sets and reset progress.
     */
    it('should allow session restart', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      // Complete session quickly
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      const rightButton = screen.getByRole('button', { name: /like/i });
      await user.click(rightButton);
      await user.click(rightButton);
      await user.click(rightButton);
      
      // Wait for completion
      await waitFor(() => {
        expect(screen.getByText('Session Complete!')).toBeInTheDocument();
      });
      
      // Mock new products for restart
      const newProducts = [
        { ...mockProducts[0], id: 'product-4', title: 'New Product 1' },
        { ...mockProducts[1], id: 'product-5', title: 'New Product 2' },
        { ...mockProducts[2], id: 'product-6', title: 'New Product 3' },
      ];
      (api.getProducts as jest.Mock).mockResolvedValueOnce(newProducts);
      
      // Click restart button
      const restartButton = screen.getByRole('button', { name: /start new session/i });
      await user.click(restartButton);
      
      // Verify new session started
      await waitFor(() => {
        expect(screen.getByText('New Product 1')).toBeInTheDocument();
        expect(screen.getByText('1 of 3')).toBeInTheDocument();
      });
      
      // Verify products were refetched
      expect(api.getProducts).toHaveBeenCalledTimes(2);
    });
  });

  describe('Error Handling and Edge Cases', () => {
    /**
     * Test swipe recording error handling.
     * 
     * Validates that swipe recording errors don't break
     * the user experience and provide appropriate feedback.
     */
    it('should handle swipe recording errors gracefully', async () => {
      const user = userEvent.setup();
      
      // Mock swipe recording error
      (api.recordSwipe as jest.Mock).mockRejectedValue(
        new Error('Network error')
      );
      
      render(<WorkingSwipeInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Perform swipe that will fail
      const rightButton = screen.getByRole('button', { name: /like/i });
      await user.click(rightButton);
      
      // Verify error is handled (should still progress)
      await waitFor(() => {
        expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      });
      
      // Verify error was logged but didn't break flow
      expect(api.recordSwipe).toHaveBeenCalled();
    });

    /**
     * Test empty product list handling.
     * 
     * Validates that empty product responses are handled
     * with appropriate messaging and recovery options.
     */
    it('should handle empty product list gracefully', async () => {
      // Mock empty products response
      (api.getProducts as jest.Mock).mockResolvedValue([]);
      
      render(<WorkingSwipeInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('No products available')).toBeInTheDocument();
        expect(screen.getByText('Check back later for new products')).toBeInTheDocument();
      });
      
      // Verify refresh option
      const refreshButton = screen.getByRole('button', { name: /refresh/i });
      expect(refreshButton).toBeInTheDocument();
    });

    /**
     * Test unauthenticated user handling.
     * 
     * Validates that unauthenticated users receive appropriate
     * messaging and are guided to authentication.
     */
    it('should handle unauthenticated users', () => {
      // Mock unauthenticated state
      (useAuth as jest.Mock).mockReturnValue({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
      
      render(<WorkingSwipeInterface />);
      
      // Verify authentication prompt
      expect(screen.getByText('Please sign in to start swiping')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    });
  });

  describe('Performance and Accessibility', () => {
    /**
     * Test keyboard navigation support.
     * 
     * Validates that the swipe interface is accessible
     * via keyboard navigation for all users.
     */
    it('should support keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<WorkingSwipeInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Test keyboard swipe controls
      const rightButton = screen.getByRole('button', { name: /like/i });
      rightButton.focus();
      
      await user.keyboard('{Enter}');
      
      // Verify swipe was triggered
      await waitFor(() => {
        expect(api.recordSwipe).toHaveBeenCalled();
        expect(screen.getByText('Nike Air Max 90')).toBeInTheDocument();
      });
    });

    /**
     * Test screen reader compatibility.
     * 
     * Validates that all interactive elements have proper
     * ARIA labels and semantic markup for screen readers.
     */
    it('should have proper accessibility attributes', async () => {
      render(<WorkingSwipeInterface />);
      
      await waitFor(() => {
        expect(screen.getByText('iPhone 15 Pro')).toBeInTheDocument();
      });
      
      // Verify ARIA labels
      expect(screen.getByRole('button', { name: /dislike/i })).toHaveAttribute('aria-label', 'Dislike this product');
      expect(screen.getByRole('button', { name: /like/i })).toHaveAttribute('aria-label', 'Like this product');
      expect(screen.getByRole('button', { name: /super like/i })).toHaveAttribute('aria-label', 'Super like this product');
      
      // Verify progress indicator is accessible
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuemax', '3');
    });
  });
});