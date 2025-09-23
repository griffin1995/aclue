/**
 * Enhanced API Integration Type Definitions for aclue Platform
 *
 * Enterprise-grade type definitions for seamless backend integration with
 * strict typing and comprehensive error handling.
 *
 * Features:
 * - Backend API response type mapping
 * - Request/response transformers with type safety
 * - Error handling with discriminated unions
 * - Webhook and real-time event types
 * - GraphQL-style type definitions for flexibility
 */

import {
  StrictApiResponse,
  ApiErrorDetails,
  StrictPaginatedResponse,
  UserId,
  ProductId,
  CategoryId,
  SessionId,
  InteractionId,
  GiftLinkId,
  RecommendationId,
  CurrencyAmount,
  ISODateTime,
  EmailAddress,
  URL,
  StrictProduct,
  StrictSwipeSession,
  StrictUserPreferences,
  SwipeDirection,
  SessionType,
  ProductAvailability,
  Gender,
  SubscriptionTier,
  OccasionType,
  InteractionType,
} from './enhanced';

// ==============================================================================
// BACKEND API RESPONSE MAPPING
// ==============================================================================

/**
 * Backend user response format (matches FastAPI backend)
 */
export interface BackendUserResponse {
  readonly id: string;
  readonly email: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly profile_picture?: string;
  readonly date_of_birth?: string;
  readonly gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  readonly location?: string;
  readonly timezone?: string;
  readonly subscription_tier: 'free' | 'premium' | 'enterprise';
  readonly is_active: boolean;
  readonly is_verified: boolean;
  readonly created_at: string;
  readonly updated_at: string;
  readonly last_login?: string;
}

/**
 * Backend product response format
 */
export interface BackendProductResponse {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly currency: string;
  readonly original_price?: number;
  readonly discount_percentage?: number;
  readonly brand: string;
  readonly category_id: string;
  readonly category?: BackendCategoryResponse;
  readonly image_url: string;
  readonly additional_images: readonly string[];
  readonly affiliate_url: string;
  readonly affiliate_source: string;
  readonly availability: 'in_stock' | 'out_of_stock' | 'limited' | 'discontinued';
  readonly rating?: number;
  readonly review_count?: number;
  readonly features: Record<string, unknown>;
  readonly tags: readonly string[];
  readonly is_featured: boolean;
  readonly is_trending: boolean;
  readonly is_new: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * Backend category response format
 */
export interface BackendCategoryResponse {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly parent_id?: string;
  readonly parent?: BackendCategoryResponse;
  readonly children?: readonly BackendCategoryResponse[];
  readonly icon?: string;
  readonly image_url?: string;
  readonly sort_order: number;
  readonly is_active: boolean;
  readonly product_count?: number;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * Backend swipe session response format
 */
export interface BackendSwipeSessionResponse {
  readonly id: string;
  readonly user_id: string;
  readonly session_type: 'onboarding' | 'discovery' | 'category_exploration' | 'gift_selection';
  readonly category_focus?: string;
  readonly target_recipient?: string;
  readonly context?: Record<string, unknown>;
  readonly is_completed: boolean;
  readonly completed_at?: string;
  readonly swipe_count: number;
  readonly like_count: number;
  readonly dislike_count: number;
  readonly skip_count: number;
  readonly session_duration?: number;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * Backend swipe interaction response format
 */
export interface BackendSwipeInteractionResponse {
  readonly id: string;
  readonly session_id: string;
  readonly product_id: string;
  readonly product?: BackendProductResponse;
  readonly direction: 'left' | 'right' | 'up' | 'down';
  readonly interaction_type: 'swipe' | 'click' | 'keyboard';
  readonly timing_ms: number;
  readonly context?: Record<string, unknown>;
  readonly created_at: string;
}

/**
 * Backend recommendation response format
 */
export interface BackendRecommendationResponse {
  readonly id: string;
  readonly user_id: string;
  readonly product_id: string;
  readonly product?: BackendProductResponse;
  readonly score: number;
  readonly confidence: number;
  readonly reasoning: readonly string[];
  readonly algorithm_used: string;
  readonly category_match: number;
  readonly price_match: number;
  readonly style_match: number;
  readonly popularity_score: number;
  readonly is_viewed: boolean;
  readonly is_clicked: boolean;
  readonly is_shared: boolean;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * Backend gift link response format
 */
export interface BackendGiftLinkResponse {
  readonly id: string;
  readonly user_id: string;
  readonly title: string;
  readonly description?: string;
  readonly recipient_name?: string;
  readonly occasion?: string;
  readonly budget_range?: string;
  readonly products: readonly BackendProductResponse[];
  readonly custom_message?: string;
  readonly share_token: string;
  readonly qr_code_url: string;
  readonly is_public: boolean;
  readonly expires_at?: string;
  readonly view_count: number;
  readonly click_count: number;
  readonly share_count: number;
  readonly created_at: string;
  readonly updated_at: string;
}

/**
 * Backend authentication response format
 */
export interface BackendAuthResponse {
  readonly access_token: string;
  readonly refresh_token: string;
  readonly token_type: 'Bearer';
  readonly expires_in: number;
  readonly user: BackendUserResponse;
}

/**
 * Backend paginated response format
 */
export interface BackendPaginatedResponse<T> {
  readonly data: readonly T[];
  readonly pagination: {
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly total_pages: number;
    readonly has_next: boolean;
    readonly has_previous: boolean;
  };
  readonly meta?: {
    readonly query?: string;
    readonly filters?: Record<string, unknown>;
    readonly sort_by?: string;
    readonly processing_time_ms?: number;
  };
}

/**
 * Backend error response format
 */
export interface BackendErrorResponse {
  readonly error: {
    readonly code: string;
    readonly message: string;
    readonly details?: readonly {
      readonly field: string;
      readonly message: string;
      readonly code: string;
    }[];
  };
  readonly request_id?: string;
  readonly timestamp: string;
}

// ==============================================================================
// REQUEST/RESPONSE TRANSFORMERS
// ==============================================================================

/**
 * Transform backend user response to frontend User type
 */
export function transformBackendUser(backendUser: BackendUserResponse): import('@/types').User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    first_name: backendUser.first_name,
    last_name: backendUser.last_name,
    profile_picture: backendUser.profile_picture,
    date_of_birth: backendUser.date_of_birth,
    gender: backendUser.gender,
    location: backendUser.location,
    timezone: backendUser.timezone,
    subscription_tier: backendUser.subscription_tier,
    is_active: backendUser.is_active,
    is_verified: backendUser.is_verified,
    created_at: backendUser.created_at,
    updated_at: backendUser.updated_at,
    last_login: backendUser.last_login,
  };
}

/**
 * Transform backend product response to frontend StrictProduct type
 */
export function transformBackendProduct(backendProduct: BackendProductResponse): StrictProduct {
  return {
    id: backendProduct.id as ProductId,
    name: backendProduct.name,
    description: backendProduct.description,
    brand: backendProduct.brand,
    categoryId: backendProduct.category_id as CategoryId,
    pricing: {
      current: backendProduct.price as CurrencyAmount,
      original: backendProduct.original_price as CurrencyAmount | undefined,
      currency: backendProduct.currency as any, // Will be properly typed in implementation
      discountPercentage: backendProduct.discount_percentage,
    },
    images: {
      primary: backendProduct.image_url as URL,
      additional: backendProduct.additional_images as readonly URL[],
      thumbnails: [], // Backend doesn't provide thumbnails yet
    },
    affiliate: {
      url: backendProduct.affiliate_url as URL,
      source: backendProduct.affiliate_source as 'amazon' | 'ebay' | 'shopify' | 'custom',
    },
    availability: backendProduct.availability,
    features: transformProductFeatures(backendProduct.features),
    tags: backendProduct.tags,
    flags: {
      isFeatured: backendProduct.is_featured,
      isTrending: backendProduct.is_trending,
      isNew: backendProduct.is_new,
      isDiscounted: Boolean(backendProduct.discount_percentage),
    },
    metadata: {
      rating: backendProduct.rating ? {
        average: backendProduct.rating,
        count: backendProduct.review_count || 0,
        distribution: [], // Backend doesn't provide distribution yet
      } : undefined,
      createdAt: backendProduct.created_at as ISODateTime,
      updatedAt: backendProduct.updated_at as ISODateTime,
    },
  };
}

/**
 * Transform backend category response to frontend Category type
 */
export function transformBackendCategory(backendCategory: BackendCategoryResponse): import('@/types').Category {
  return {
    id: backendCategory.id,
    name: backendCategory.name,
    description: backendCategory.description,
    parent_id: backendCategory.parent_id,
    parent: backendCategory.parent ? transformBackendCategory(backendCategory.parent) : undefined,
    children: backendCategory.children?.map(transformBackendCategory),
    icon: backendCategory.icon,
    image_url: backendCategory.image_url,
    sort_order: backendCategory.sort_order,
    is_active: backendCategory.is_active,
    product_count: backendCategory.product_count,
    created_at: backendCategory.created_at,
    updated_at: backendCategory.updated_at,
  };
}

/**
 * Transform backend swipe session response to frontend StrictSwipeSession type
 */
export function transformBackendSwipeSession(backendSession: BackendSwipeSessionResponse): StrictSwipeSession {
  return {
    id: backendSession.id as SessionId,
    userId: backendSession.user_id as UserId,
    type: backendSession.session_type,
    context: transformSessionContext(backendSession.session_type, backendSession.context || {}),
    state: {
      status: backendSession.is_completed ? 'completed' : 'active',
      currentIndex: 0, // Backend doesn't track current index
      totalProducts: 0, // Backend doesn't track total products
      completedAt: backendSession.completed_at as ISODateTime | undefined,
    },
    analytics: {
      swipeCount: backendSession.swipe_count,
      likeCount: backendSession.like_count,
      dislikeCount: backendSession.dislike_count,
      skipCount: backendSession.skip_count,
      superLikeCount: 0, // Backend doesn't track super likes yet
      averageTimePerProduct: backendSession.session_duration ?
        backendSession.session_duration / Math.max(1, backendSession.swipe_count) : 0,
      engagementScore: calculateEngagementScore(backendSession),
    },
    metadata: {
      createdAt: backendSession.created_at as ISODateTime,
      updatedAt: backendSession.updated_at as ISODateTime,
      deviceType: 'web', // Default to web
      platform: 'web',   // Default to web
      version: '1.0.0',  // Default version
    },
  };
}

/**
 * Transform backend error response to frontend ApiErrorDetails type
 */
export function transformBackendError(backendError: BackendErrorResponse): ApiErrorDetails {
  return {
    code: backendError.error.code,
    message: backendError.error.message,
    statusCode: 400, // Default status code if not provided
    details: backendError.error.details?.map(detail => ({
      field: detail.field,
      message: detail.message,
      code: detail.code,
      value: undefined,
    })),
    requestId: backendError.request_id,
  };
}

// ==============================================================================
// HELPER FUNCTIONS
// ==============================================================================

/**
 * Transform product features from backend format
 */
function transformProductFeatures(features: Record<string, unknown>): import('./enhanced').ProductFeatures {
  return {
    material: features.material as string | undefined,
    colour: features.colour as string | undefined,
    // Add more feature transformations as needed
  };
}

/**
 * Transform session context based on session type
 */
function transformSessionContext(
  sessionType: string,
  context: Record<string, unknown>
): import('./enhanced').SessionContext {
  switch (sessionType) {
    case 'onboarding':
      return {
        type: 'onboarding',
        step: context.step as number || 1,
        totalSteps: context.totalSteps as number || 5,
        completed: context.completed as string[] || [],
      };
    case 'discovery':
      return {
        type: 'discovery',
        filters: context.filters as any || {},
        preferences: context.preferences as any || {},
      };
    case 'category_exploration':
      return {
        type: 'category_exploration',
        categoryId: context.categoryId as CategoryId || ('' as CategoryId),
        subcategories: context.subcategories as CategoryId[] || [],
      };
    case 'gift_selection':
      return {
        type: 'gift_selection',
        recipient: context.recipient as any || {},
        occasion: context.occasion as OccasionType || 'other',
        budget: context.budget as any || {},
      };
    default:
      return {
        type: 'research',
        query: context.query as string || '',
        filters: context.filters as any || {},
      };
  }
}

/**
 * Calculate engagement score from session data
 */
function calculateEngagementScore(session: BackendSwipeSessionResponse): number {
  const totalInteractions = session.swipe_count;
  if (totalInteractions === 0) return 0;

  const likeRatio = session.like_count / totalInteractions;
  const avgTimePerSwipe = session.session_duration ?
    session.session_duration / totalInteractions : 0;

  // Engagement score based on interaction rate and time spent
  const timeScore = Math.min(avgTimePerSwipe / 5000, 1); // Normalize to 5 seconds max
  const interactionScore = Math.min(totalInteractions / 50, 1); // Normalize to 50 interactions max

  return Math.round((likeRatio * 40 + timeScore * 30 + interactionScore * 30) * 100) / 100;
}

// ==============================================================================
// API ENDPOINT TYPES
// ==============================================================================

/**
 * API endpoint configuration with strict typing
 */
export interface ApiEndpointConfig {
  readonly method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  readonly path: string;
  readonly requiresAuth: boolean;
  readonly rateLimit?: {
    readonly requests: number;
    readonly windowMs: number;
  };
  readonly cache?: {
    readonly ttl: number;
    readonly key: string;
  };
}

/**
 * Complete API endpoint definitions
 */
export const API_ENDPOINTS = {
  auth: {
    login: { method: 'POST', path: '/api/v1/auth/login', requiresAuth: false } as const,
    register: { method: 'POST', path: '/api/v1/auth/register', requiresAuth: false } as const,
    refresh: { method: 'POST', path: '/api/v1/auth/refresh', requiresAuth: false } as const,
    logout: { method: 'POST', path: '/api/v1/auth/logout', requiresAuth: true } as const,
    me: { method: 'GET', path: '/api/v1/auth/me', requiresAuth: true } as const,
    forgotPassword: { method: 'POST', path: '/api/v1/auth/forgot-password', requiresAuth: false } as const,
    resetPassword: { method: 'POST', path: '/api/v1/auth/reset-password', requiresAuth: false } as const,
    verifyEmail: { method: 'POST', path: '/api/v1/auth/verify-email', requiresAuth: false } as const,
  },
  users: {
    profile: { method: 'GET', path: '/api/v1/users/profile', requiresAuth: true } as const,
    updateProfile: { method: 'PUT', path: '/api/v1/users/profile', requiresAuth: true } as const,
    preferences: { method: 'GET', path: '/api/v1/users/preferences', requiresAuth: true } as const,
    updatePreferences: { method: 'PUT', path: '/api/v1/users/preferences', requiresAuth: true } as const,
    statistics: { method: 'GET', path: '/api/v1/users/statistics', requiresAuth: true } as const,
    deleteAccount: { method: 'DELETE', path: '/api/v1/users/account', requiresAuth: true } as const,
  },
  products: {
    list: { method: 'GET', path: '/api/v1/products', requiresAuth: false, cache: { ttl: 300000, key: 'products-list' } } as const,
    detail: { method: 'GET', path: '/api/v1/products', requiresAuth: false, cache: { ttl: 600000, key: 'product-detail' } } as const,
    byCategory: { method: 'GET', path: '/api/v1/products/category', requiresAuth: false, cache: { ttl: 300000, key: 'products-category' } } as const,
    search: { method: 'GET', path: '/api/v1/products/search', requiresAuth: false } as const,
  },
  categories: {
    list: { method: 'GET', path: '/api/v1/categories', requiresAuth: false, cache: { ttl: 600000, key: 'categories-list' } } as const,
    detail: { method: 'GET', path: '/api/v1/categories', requiresAuth: false, cache: { ttl: 600000, key: 'category-detail' } } as const,
  },
  swipes: {
    createSession: { method: 'POST', path: '/api/v1/swipes/sessions', requiresAuth: true } as const,
    getSession: { method: 'GET', path: '/api/v1/swipes/sessions', requiresAuth: true } as const,
    recordInteraction: { method: 'POST', path: '/api/v1/swipes/interactions', requiresAuth: true, rateLimit: { requests: 100, windowMs: 60000 } } as const,
    getInteractions: { method: 'GET', path: '/api/v1/swipes/interactions', requiresAuth: true } as const,
  },
  recommendations: {
    list: { method: 'GET', path: '/api/v1/recommendations', requiresAuth: true, cache: { ttl: 180000, key: 'recommendations-list' } } as const,
    feedback: { method: 'POST', path: '/api/v1/recommendations/feedback', requiresAuth: true } as const,
  },
  giftLinks: {
    create: { method: 'POST', path: '/api/v1/gift-links', requiresAuth: true } as const,
    list: { method: 'GET', path: '/api/v1/gift-links', requiresAuth: true } as const,
    view: { method: 'GET', path: '/api/v1/gift-links', requiresAuth: false } as const,
    update: { method: 'PUT', path: '/api/v1/gift-links', requiresAuth: true } as const,
    delete: { method: 'DELETE', path: '/api/v1/gift-links', requiresAuth: true } as const,
    track: { method: 'POST', path: '/api/v1/gift-links/track', requiresAuth: false } as const,
  },
  analytics: {
    track: { method: 'POST', path: '/api/v1/analytics/events', requiresAuth: false, rateLimit: { requests: 200, windowMs: 60000 } } as const,
    batch: { method: 'POST', path: '/api/v1/analytics/batch', requiresAuth: false, rateLimit: { requests: 50, windowMs: 60000 } } as const,
  },
} as const;

// ==============================================================================
// WEBHOOK AND REAL-TIME EVENT TYPES
// ==============================================================================

/**
 * Webhook event types from backend
 */
export type WebhookEventType =
  | 'user.created'
  | 'user.updated'
  | 'user.deleted'
  | 'product.created'
  | 'product.updated'
  | 'product.deleted'
  | 'swipe.recorded'
  | 'recommendation.generated'
  | 'gift_link.created'
  | 'gift_link.viewed'
  | 'payment.succeeded'
  | 'payment.failed';

/**
 * Webhook payload structure
 */
export interface WebhookPayload<TData = unknown> {
  readonly id: string;
  readonly type: WebhookEventType;
  readonly data: TData;
  readonly timestamp: ISODateTime;
  readonly source: 'api' | 'admin' | 'system';
  readonly version: string;
}

/**
 * Real-time notification types
 */
export interface RealtimeNotification {
  readonly id: string;
  readonly userId: UserId;
  readonly type: 'recommendation' | 'gift_link' | 'system' | 'marketing';
  readonly title: string;
  readonly message: string;
  readonly data?: Record<string, unknown>;
  readonly read: boolean;
  readonly timestamp: ISODateTime;
  readonly expiresAt?: ISODateTime;
}

export type {
  // Re-export backend types for convenience
  BackendUserResponse,
  BackendProductResponse,
  BackendCategoryResponse,
  BackendSwipeSessionResponse,
  BackendSwipeInteractionResponse,
  BackendRecommendationResponse,
  BackendGiftLinkResponse,
  BackendAuthResponse,
  BackendPaginatedResponse,
  BackendErrorResponse,
};