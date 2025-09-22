/**
 * Wishlist Server Actions
 *
 * Server-side actions for wishlist operations in the Amazon affiliate model:
 * - Wishlist CRUD operations
 * - Adding/removing products from wishlists
 * - Wishlist sharing and social features
 * - Amazon affiliate link generation
 * - Price tracking and notifications
 *
 * These actions run on the server and provide:
 * - Type safety with TypeScript
 * - Authentication handling
 * - API integration with backend
 * - Error handling and validation
 * - Performance optimisation with caching
 */

'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { generateAffiliateLink } from '@/lib/affiliate';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  share_token?: string;
  created_at: Date;
  updated_at: Date;
  product_count: number;
}

interface WishlistProduct {
  id: string;
  wishlist_id: string;
  product_id: string;
  added_at: Date;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
  price_when_added?: number;
}

interface CreateWishlistData {
  name: string;
  description?: string;
  is_public?: boolean;
}

interface UpdateWishlistData {
  wishlistId: string;
  name?: string;
  description?: string;
  is_public?: boolean;
}

interface AddToWishlistData {
  wishlistId: string;
  productId: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
}

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

/**
 * Get authentication token from cookies
 */
async function getAuthToken(): Promise<string | null> {
  try {
    const cookieStore = cookies();
    return cookieStore.get('access_token')?.value || null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
}

/**
 * Generate unique share token for wishlist
 */
function generateShareToken(): string {
  return Math.random().toString(36).substring(2, 15) +
         Math.random().toString(36).substring(2, 15);
}

// ==============================================================================
// WISHLIST CRUD ACTIONS
// ==============================================================================

/**
 * Create new wishlist
 */
export async function createWishlistAction(data: CreateWishlistData) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Please sign in to create wishlists'
      };
    }

    // Validate input
    if (!data.name || data.name.trim().length === 0) {
      return {
        success: false,
        error: 'Wishlist name is required'
      };
    }

    if (data.name.length > 100) {
      return {
        success: false,
        error: 'Wishlist name must be 100 characters or less'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: data.name.trim(),
          description: data.description?.trim() || null,
          is_public: data.is_public || false,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to create wishlist: ${response.status}`);
    }

    const wishlist = await response.json();

    // Revalidate caches
    revalidateTag('wishlists');
    revalidatePath('/wishlists');

    return {
      success: true,
      data: wishlist,
      message: 'Wishlist created successfully!'
    };
  } catch (error) {
    console.error('Error creating wishlist:', error);
    return {
      success: false,
      error: 'Failed to create wishlist. Please try again.'
    };
  }
}

/**
 * Get all user wishlists
 */
export async function getUserWishlistsAction() {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
        data: []
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['wishlists', `wishlists-user`]
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch wishlists: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data
    };
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    return {
      success: false,
      error: 'Failed to load wishlists. Please try again.',
      data: []
    };
  }
}

/**
 * Get single wishlist by ID
 */
export async function getWishlistByIdAction(wishlistId: string) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
        data: null
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        next: {
          revalidate: 300, // Cache for 5 minutes
          tags: ['wishlists', `wishlist-${wishlistId}`]
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Wishlist not found',
          data: null
        };
      }
      throw new Error(`Failed to fetch wishlist: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data
    };
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    return {
      success: false,
      error: 'Failed to load wishlist. Please try again.',
      data: null
    };
  }
}

/**
 * Update wishlist details
 */
export async function updateWishlistAction(data: UpdateWishlistData) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Please sign in to update wishlists'
      };
    }

    // Validate input
    if (data.name !== undefined && (!data.name || data.name.trim().length === 0)) {
      return {
        success: false,
        error: 'Wishlist name is required'
      };
    }

    if (data.name && data.name.length > 100) {
      return {
        success: false,
        error: 'Wishlist name must be 100 characters or less'
      };
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name.trim();
    if (data.description !== undefined) updateData.description = data.description?.trim() || null;
    if (data.is_public !== undefined) updateData.is_public = data.is_public;

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${data.wishlistId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(updateData),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update wishlist: ${response.status}`);
    }

    const wishlist = await response.json();

    // Revalidate caches
    revalidateTag('wishlists');
    revalidateTag(`wishlist-${data.wishlistId}`);
    revalidatePath('/wishlists');
    revalidatePath(`/wishlists/${data.wishlistId}`);

    return {
      success: true,
      data: wishlist,
      message: 'Wishlist updated successfully!'
    };
  } catch (error) {
    console.error('Error updating wishlist:', error);
    return {
      success: false,
      error: 'Failed to update wishlist. Please try again.'
    };
  }
}

/**
 * Delete wishlist
 */
export async function deleteWishlistAction(wishlistId: string) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete wishlist: ${response.status}`);
    }

    // Revalidate caches
    revalidateTag('wishlists');
    revalidateTag(`wishlist-${wishlistId}`);
    revalidatePath('/wishlists');

    return {
      success: true,
      message: 'Wishlist deleted successfully!'
    };
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    return {
      success: false,
      error: 'Failed to delete wishlist. Please try again.'
    };
  }
}

// ==============================================================================
// WISHLIST PRODUCT ACTIONS
// ==============================================================================

/**
 * Add product to wishlist
 */
export async function addToWishlistAction(data: AddToWishlistData) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Please sign in to add items to wishlists'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${data.wishlistId}/products`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: data.productId,
          notes: data.notes?.trim() || null,
          priority: data.priority || 'medium',
        }),
      }
    );

    if (!response.ok) {
      if (response.status === 409) {
        return {
          success: false,
          error: 'Product is already in this wishlist'
        };
      }
      throw new Error(`Failed to add to wishlist: ${response.status}`);
    }

    // Revalidate caches
    revalidateTag('wishlists');
    revalidateTag(`wishlist-${data.wishlistId}`);
    revalidatePath(`/wishlists/${data.wishlistId}`);

    return {
      success: true,
      message: 'Product added to wishlist!'
    };
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    return {
      success: false,
      error: 'Failed to add product to wishlist. Please try again.'
    };
  }
}

/**
 * Remove product from wishlist
 */
export async function removeFromWishlistAction(wishlistId: string, productId: string) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}/products/${productId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to remove from wishlist: ${response.status}`);
    }

    // Revalidate caches
    revalidateTag('wishlists');
    revalidateTag(`wishlist-${wishlistId}`);
    revalidatePath(`/wishlists/${wishlistId}`);

    return {
      success: true,
      message: 'Product removed from wishlist!'
    };
  } catch (error) {
    console.error('Error removing from wishlist:', error);
    return {
      success: false,
      error: 'Failed to remove product from wishlist. Please try again.'
    };
  }
}

// ==============================================================================
// WISHLIST SHARING ACTIONS
// ==============================================================================

/**
 * Generate sharing link for wishlist
 */
export async function generateShareLinkAction(wishlistId: string) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Authentication required'
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}/share`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate share link: ${response.status}`);
    }

    const data = await response.json();

    // Revalidate wishlist cache
    revalidateTag(`wishlist-${wishlistId}`);

    return {
      success: true,
      data: {
        shareToken: data.share_token,
        shareUrl: `${process.env.NEXT_PUBLIC_WEB_URL}/wishlists/${wishlistId}/share/${data.share_token}`
      },
      message: 'Share link generated successfully!'
    };
  } catch (error) {
    console.error('Error generating share link:', error);
    return {
      success: false,
      error: 'Failed to generate share link. Please try again.'
    };
  }
}

/**
 * Get public shared wishlist (no authentication required)
 */
export async function getSharedWishlistAction(wishlistId: string, shareToken: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/wishlists/${wishlistId}/shared/${shareToken}`,
      {
        next: {
          revalidate: 600, // Cache for 10 minutes
          tags: ['shared-wishlist', `shared-wishlist-${wishlistId}`]
        },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        return {
          success: false,
          error: 'Shared wishlist not found or link has expired',
          data: null
        };
      }
      throw new Error(`Failed to fetch shared wishlist: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.data || data
    };
  } catch (error) {
    console.error('Error fetching shared wishlist:', error);
    return {
      success: false,
      error: 'Failed to load shared wishlist. Please try again.',
      data: null
    };
  }
}

// ==============================================================================
// AMAZON AFFILIATE ACTIONS
// ==============================================================================

/**
 * Generate Amazon affiliate links for wishlist products
 */
export async function generateAffiliateLinksAction(productIds: string[]) {
  try {
    const token = await getAuthToken();

    if (!token) {
      return {
        success: false,
        error: 'Authentication required',
        data: {}
      };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/affiliate/generate`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_ids: productIds,
          affiliate_tag: process.env.AMAZON_AFFILIATE_TAG,
          campaign: 'wishlist_sharing',
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to generate affiliate links: ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      data: data.affiliate_links || {}
    };
  } catch (error) {
    console.error('Error generating affiliate links:', error);
    return {
      success: false,
      error: 'Failed to generate affiliate links. Using direct links instead.',
      data: {}
    };
  }
}

/**
 * Track affiliate click for analytics
 */
export async function trackAffiliateClickAction(data: {
  productId: string;
  wishlistId?: string;
  source: string;
  campaign: string;
}) {
  try {
    // This is fire-and-forget analytics tracking
    fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/affiliate/track`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: data.productId,
          wishlist_id: data.wishlistId,
          source: data.source,
          campaign: data.campaign,
          timestamp: new Date().toISOString(),
        }),
      }
    ).catch(error => {
      console.error('Error tracking affiliate click:', error);
    });

    return { success: true };
  } catch (error) {
    console.error('Error tracking affiliate click:', error);
    return { success: false };
  }
}

// ==============================================================================
// CACHE MANAGEMENT
// ==============================================================================

/**
 * Refresh wishlist caches
 */
export async function refreshWishlistCacheAction() {
  try {
    revalidateTag('wishlists');
    revalidateTag('shared-wishlist');
    revalidatePath('/wishlists');

    return { success: true, message: 'Wishlist cache refreshed successfully!' };
  } catch (error) {
    console.error('Error refreshing wishlist cache:', error);
    return {
      success: false,
      error: 'Failed to refresh cache. Please try again.'
    };
  }
}