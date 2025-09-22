/**
 * Product Server Actions
 *
 * Server-side actions for product operations including:
 * - Product fetching and search
 * - Cart management
 * - Wishlist operations
 * - Recommendation generation
 * - User preference tracking
 *
 * These actions run on the server and provide:
 * - Type safety
 * - Authentication handling
 * - API integration
 * - Error handling
 * - Performance optimisation
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { api } from '@/lib/api';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

interface ProductSearchParams {
  query?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'relevance';
  page?: number;
  limit?: number;
}

interface SwipeData {
  productId: string;
  direction: 'like' | 'dislike' | 'super_like';
  sessionType?: string;
  timestamp?: Date;
}


// ==============================================================================
// PRODUCT FETCHING ACTIONS
// ==============================================================================

/**
 * Get products with server-side caching
 *
 * Fetches products from the backend API with caching for performance.
 * Uses Next.js cache tags for selective revalidation.
 */
export async function getProducts(params: ProductSearchParams = {}) {
  try {
    const {
      query = '',
      category = '',
      minPrice,
      maxPrice,
      sortBy = 'relevance',
      page = 1,
      limit = 20
    } = params;

    // Build API request parameters
    const apiParams = {
      q: query,
      category,
      min_price: minPrice,
      max_price: maxPrice,
      sort_by: sortBy,
      page,
      limit,
    };

    // Remove undefined values
    const cleanParams = Object.fromEntries(
      Object.entries(apiParams).filter(([_, value]) => value !== undefined && value !== '')
    );

    // Fetch with caching
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/?${new URLSearchParams(cleanParams)}`,
      {
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['products', `products-${category}`, `products-page-${page}`]
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('Error fetching products:', error);
    return {
      success: false,
      error: 'Failed to load products. Please try again.',
      data: []
    };
  }
}

/**
 * Get single product by ID with caching
 */
export async function getProductById(productId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`,
      {
        next: {
          revalidate: 600, // Cache for 10 minutes
          tags: ['products', `product-${productId}`]
        },
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return { success: false, error: 'Product not found', data: null };
      }
      throw new Error(`Failed to fetch product: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('Error fetching product:', error);
    return {
      success: false,
      error: 'Failed to load product. Please try again.',
      data: null
    };
  }
}

/**
 * Search products with enhanced server-side processing
 */
export async function searchProducts(searchParams: ProductSearchParams) {
  try {
    const results = await getProducts(searchParams);

    // Revalidate search cache
    revalidateTag('search');

    return results;
  } catch (error) {
    console.error('Error searching products:', error);
    return {
      success: false,
      error: 'Search failed. Please try again.',
      data: []
    };
  }
}

// ==============================================================================
// RECOMMENDATION ACTIONS
// ==============================================================================

/**
 * Get AI recommendations with authentication check
 */
export async function getRecommendations(params: {
  limit?: number;
  category?: string;
  budget_min?: number;
  budget_max?: number;
} = {}) {
  try {
    // Get authentication token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Authentication required for recommendations',
        data: []
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/recommendations/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(params),
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['recommendations', `recommendations-${token.slice(-8)}`]
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch recommendations: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data: data.data || data };
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    return {
      success: false,
      error: 'Failed to load recommendations. Please try again.',
      data: []
    };
  }
}

// ==============================================================================
// USER INTERACTION ACTIONS
// ==============================================================================

/**
 * Record user swipe preference
 */
export async function recordSwipe(swipeData: SwipeData) {
  try {
    // Get authentication token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Authentication required to save preferences'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/swipes/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: swipeData.productId,
          direction: swipeData.direction,
          session_type: swipeData.sessionType || 'discovery',
          timestamp: swipeData.timestamp || new Date(),
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to record swipe: ${response.status}`);
    }

    // Revalidate recommendations cache as preferences have changed
    revalidateTag('recommendations');

    return { success: true };
  } catch (error) {
    console.error('Error recording swipe:', error);
    return {
      success: false,
      error: 'Failed to save preference. Please try again.'
    };
  }
}


// ==============================================================================
// WISHLIST ACTIONS
// ==============================================================================

/**
 * Toggle wishlist item
 */
export async function toggleWishlistAction(productId: string) {
  try {
    // Get authentication token from cookies
    const cookieStore = cookies();
    const token = cookieStore.get('access_token')?.value;

    if (!token) {
      return {
        success: false,
        error: 'Please sign in to save items to wishlist'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlist/${productId}`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update wishlist: ${response.status}`);
    }

    const data = await response.json();

    // Revalidate wishlist cache
    revalidateTag('wishlist');
    revalidatePath('/wishlist');

    return {
      success: true,
      added: data.added,
      message: data.added ? 'Added to wishlist!' : 'Removed from wishlist!'
    };
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return {
      success: false,
      error: 'Failed to update wishlist. Please try again.'
    };
  }
}

// ==============================================================================
// CACHE MANAGEMENT
// ==============================================================================

/**
 * Refresh product data cache
 */
export async function refreshProductCache() {
  try {
    revalidateTag('products');
    revalidateTag('recommendations');
    revalidatePath('/discover');
    revalidatePath('/search');

    return { success: true, message: 'Cache refreshed successfully!' };
  } catch (error) {
    console.error('Error refreshing cache:', error);
    return {
      success: false,
      error: 'Failed to refresh cache. Please try again.'
    };
  }
}