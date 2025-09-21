/**
 * Enhanced TypeScript Type Definitions for Aclue Platform
 *
 * Enterprise-grade type safety enhancements that eliminate 'any' types
 * and provide strict typing for complex data structures and API responses.
 *
 * Features:
 * - Branded types for type safety
 * - Discriminated unions for state management
 * - Utility types for data transformation
 * - Strict API response typing
 * - Advanced pattern implementations
 */

// ==============================================================================
// BRANDED TYPES FOR TYPE SAFETY
// ==============================================================================

/**
 * Branded type for unique identifiers to prevent mixing different ID types
 */
declare const __brand: unique symbol;
type Brand<T, TBrand> = T & { [__brand]: TBrand };

export type UserId = Brand<string, 'UserId'>;
export type ProductId = Brand<string, 'ProductId'>;
export type CategoryId = Brand<string, 'CategoryId'>;
export type SessionId = Brand<string, 'SessionId'>;
export type InteractionId = Brand<string, 'InteractionId'>;
export type GiftLinkId = Brand<string, 'GiftLinkId'>;
export type RecommendationId = Brand<string, 'RecommendationId'>;

/**
 * Currency amount in smallest denomination (pence, cents)
 */
export type CurrencyAmount = Brand<number, 'CurrencyAmount'>;

/**
 * ISO 8601 datetime string
 */
export type ISODateTime = Brand<string, 'ISODateTime'>;

/**
 * ISO 4217 currency code
 */
export type CurrencyCode = Brand<string, 'CurrencyCode'>;

/**
 * Email address
 */
export type EmailAddress = Brand<string, 'EmailAddress'>;

/**
 * URL string
 */
export type URL = Brand<string, 'URL'>;

// ==============================================================================
// ENHANCED API RESPONSE TYPES
// ==============================================================================

/**
 * Strict API response wrapper with discriminated unions for success/error states
 */
export type StrictApiResponse<TData = unknown> =
  | {
      readonly success: true;
      readonly data: TData;
      readonly message?: string;
      readonly timestamp: ISODateTime;
    }
  | {
      readonly success: false;
      readonly error: ApiErrorDetails;
      readonly timestamp: ISODateTime;
    };

/**
 * Detailed error information with structured error codes
 */
export interface ApiErrorDetails {
  readonly code: string;
  readonly message: string;
  readonly statusCode: number;
  readonly details?: ReadonlyArray<ValidationError>;
  readonly requestId?: string;
  readonly path?: string;
}

/**
 * Field validation error
 */
export interface ValidationError {
  readonly field: string;
  readonly message: string;
  readonly code: string;
  readonly value?: unknown;
}

/**
 * Enhanced paginated response with strict typing
 */
export interface StrictPaginatedResponse<TData> {
  readonly data: ReadonlyArray<TData>;
  readonly pagination: {
    readonly currentPage: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
  };
  readonly metadata: {
    readonly query: string;
    readonly filters: ReadonlyArray<string>;
    readonly sortBy: string;
    readonly processingTimeMs: number;
  };
}

// ==============================================================================
// ENHANCED PRODUCT TYPES
// ==============================================================================

/**
 * Product availability states as const assertion
 */
export const PRODUCT_AVAILABILITY = {
  IN_STOCK: 'in_stock',
  OUT_OF_STOCK: 'out_of_stock',
  LIMITED: 'limited',
  DISCONTINUED: 'discontinued',
} as const;

export type ProductAvailability = typeof PRODUCT_AVAILABILITY[keyof typeof PRODUCT_AVAILABILITY];

/**
 * Structured product features with type safety
 */
export interface ProductFeatures {
  readonly material?: string;
  readonly colour?: string;
  readonly size?: ProductSize;
  readonly weight?: ProductWeight;
  readonly dimensions?: ProductDimensions;
  readonly careInstructions?: ReadonlyArray<string>;
  readonly warranty?: ProductWarranty;
  readonly certifications?: ReadonlyArray<string>;
  readonly sustainability?: SustainabilityInfo;
}

export interface ProductSize {
  readonly value: number;
  readonly unit: 'cm' | 'inch' | 'mm' | 'm';
  readonly type: 'length' | 'width' | 'height' | 'diameter' | 'volume';
}

export interface ProductWeight {
  readonly value: number;
  readonly unit: 'g' | 'kg' | 'oz' | 'lb';
}

export interface ProductDimensions {
  readonly length: number;
  readonly width: number;
  readonly height: number;
  readonly unit: 'cm' | 'inch' | 'mm' | 'm';
}

export interface ProductWarranty {
  readonly duration: number;
  readonly unit: 'months' | 'years';
  readonly type: 'manufacturer' | 'retailer' | 'extended';
  readonly coverage: ReadonlyArray<string>;
}

export interface SustainabilityInfo {
  readonly ecoFriendly: boolean;
  readonly recycled: boolean;
  readonly carbonNeutral: boolean;
  readonly certifications: ReadonlyArray<string>;
}

/**
 * Enhanced product with strict typing
 */
export interface StrictProduct {
  readonly id: ProductId;
  readonly name: string;
  readonly description: string;
  readonly brand: string;
  readonly categoryId: CategoryId;
  readonly pricing: ProductPricing;
  readonly images: ProductImages;
  readonly affiliate: AffiliateInfo;
  readonly availability: ProductAvailability;
  readonly features: ProductFeatures;
  readonly tags: ReadonlyArray<string>;
  readonly flags: ProductFlags;
  readonly metadata: ProductMetadata;
}

export interface ProductPricing {
  readonly current: CurrencyAmount;
  readonly original?: CurrencyAmount;
  readonly currency: CurrencyCode;
  readonly discountPercentage?: number;
}

export interface ProductImages {
  readonly primary: URL;
  readonly additional: ReadonlyArray<URL>;
  readonly thumbnails: ReadonlyArray<URL>;
}

export interface AffiliateInfo {
  readonly url: URL;
  readonly source: 'amazon' | 'ebay' | 'shopify' | 'custom';
  readonly commission?: number;
  readonly trackingId?: string;
}

export interface ProductFlags {
  readonly isFeatured: boolean;
  readonly isTrending: boolean;
  readonly isNew: boolean;
  readonly isDiscounted: boolean;
}

export interface ProductMetadata {
  readonly rating?: ProductRating;
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly viewCount?: number;
  readonly purchaseCount?: number;
}

export interface ProductRating {
  readonly average: number;
  readonly count: number;
  readonly distribution: ReadonlyArray<{
    readonly stars: 1 | 2 | 3 | 4 | 5;
    readonly count: number;
  }>;
}

// ==============================================================================
// ENHANCED USER TYPES
// ==============================================================================

/**
 * User subscription tiers as const assertion
 */
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise',
} as const;

export type SubscriptionTier = typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS];

/**
 * Gender options as const assertion
 */
export const GENDER_OPTIONS = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say',
} as const;

export type Gender = typeof GENDER_OPTIONS[keyof typeof GENDER_OPTIONS];

/**
 * Enhanced user preferences with structured types
 */
export interface StrictUserPreferences {
  readonly id: string;
  readonly userId: UserId;
  readonly budget: BudgetRange;
  readonly categories: CategoryPreferences;
  readonly brands: BrandPreferences;
  readonly style: StylePreferences;
  readonly notifications: StrictNotificationSettings;
  readonly privacy: StrictPrivacySettings;
  readonly metadata: PreferencesMetadata;
}

export interface BudgetRange {
  readonly min?: CurrencyAmount;
  readonly max?: CurrencyAmount;
  readonly currency: CurrencyCode;
  readonly flexibility: 'strict' | 'flexible' | 'very_flexible';
}

export interface CategoryPreferences {
  readonly preferred: ReadonlyArray<CategoryId>;
  readonly excluded: ReadonlyArray<CategoryId>;
  readonly weights: ReadonlyMap<CategoryId, number>;
}

export interface BrandPreferences {
  readonly preferred: ReadonlyArray<string>;
  readonly excluded: ReadonlyArray<string>;
  readonly luxury: boolean;
  readonly sustainable: boolean;
}

export interface StylePreferences {
  readonly colours: ReadonlyArray<string>;
  readonly materials: ReadonlyArray<string>;
  readonly patterns: ReadonlyArray<string>;
  readonly occasions: ReadonlyArray<OccasionType>;
}

export const OCCASION_TYPES = {
  BIRTHDAY: 'birthday',
  ANNIVERSARY: 'anniversary',
  WEDDING: 'wedding',
  GRADUATION: 'graduation',
  CHRISTMAS: 'christmas',
  VALENTINES: 'valentines',
  MOTHERS_DAY: 'mothers_day',
  FATHERS_DAY: 'fathers_day',
  HOUSEWARMING: 'housewarming',
  RETIREMENT: 'retirement',
  OTHER: 'other',
} as const;

export type OccasionType = typeof OCCASION_TYPES[keyof typeof OCCASION_TYPES];

export interface StrictNotificationSettings {
  readonly email: EmailNotificationSettings;
  readonly push: PushNotificationSettings;
  readonly sms: SmsNotificationSettings;
}

export interface EmailNotificationSettings {
  readonly general: boolean;
  readonly marketing: boolean;
  readonly recommendations: boolean;
  readonly security: boolean;
  readonly frequency: 'immediate' | 'daily' | 'weekly';
}

export interface PushNotificationSettings {
  readonly enabled: boolean;
  readonly recommendations: boolean;
  readonly giftLinks: boolean;
  readonly security: boolean;
}

export interface SmsNotificationSettings {
  readonly enabled: boolean;
  readonly security: boolean;
  readonly urgent: boolean;
}

export interface StrictPrivacySettings {
  readonly profileVisibility: 'public' | 'friends' | 'private';
  readonly activitySharing: boolean;
  readonly dataAnalytics: boolean;
  readonly marketingOptIn: boolean;
  readonly thirdPartySharing: boolean;
}

export interface PreferencesMetadata {
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly version: number;
  readonly source: 'manual' | 'inferred' | 'imported';
}

// ==============================================================================
// ENHANCED SWIPE TYPES
// ==============================================================================

/**
 * Swipe directions as const assertion
 */
export const SWIPE_DIRECTIONS = {
  LEFT: 'left',
  RIGHT: 'right',
  UP: 'up',
  DOWN: 'down',
} as const;

export type SwipeDirection = typeof SWIPE_DIRECTIONS[keyof typeof SWIPE_DIRECTIONS];

/**
 * Session types as const assertion
 */
export const SESSION_TYPES = {
  ONBOARDING: 'onboarding',
  DISCOVERY: 'discovery',
  CATEGORY_EXPLORATION: 'category_exploration',
  GIFT_SELECTION: 'gift_selection',
  RESEARCH: 'research',
} as const;

export type SessionType = typeof SESSION_TYPES[keyof typeof SESSION_TYPES];

/**
 * Enhanced swipe session with strict typing
 */
export interface StrictSwipeSession {
  readonly id: SessionId;
  readonly userId: UserId;
  readonly type: SessionType;
  readonly context: SessionContext;
  readonly state: SessionState;
  readonly analytics: SessionAnalytics;
  readonly metadata: SessionMetadata;
}

export type SessionContext =
  | OnboardingContext
  | DiscoveryContext
  | CategoryExplorationContext
  | GiftSelectionContext
  | ResearchContext;

export interface OnboardingContext {
  readonly type: 'onboarding';
  readonly step: number;
  readonly totalSteps: number;
  readonly completed: ReadonlyArray<string>;
}

export interface DiscoveryContext {
  readonly type: 'discovery';
  readonly filters: SessionFilters;
  readonly preferences: UserPreferenceSnapshot;
}

export interface CategoryExplorationContext {
  readonly type: 'category_exploration';
  readonly categoryId: CategoryId;
  readonly subcategories: ReadonlyArray<CategoryId>;
}

export interface GiftSelectionContext {
  readonly type: 'gift_selection';
  readonly recipient: RecipientProfile;
  readonly occasion: OccasionType;
  readonly budget: BudgetRange;
}

export interface ResearchContext {
  readonly type: 'research';
  readonly query: string;
  readonly filters: SessionFilters;
}

export interface SessionFilters {
  readonly priceRange?: BudgetRange;
  readonly categories?: ReadonlyArray<CategoryId>;
  readonly brands?: ReadonlyArray<string>;
  readonly availability?: ReadonlyArray<ProductAvailability>;
}

export interface UserPreferenceSnapshot {
  readonly budget: BudgetRange;
  readonly categories: ReadonlyArray<CategoryId>;
  readonly brands: ReadonlyArray<string>;
  readonly styles: ReadonlyArray<string>;
}

export interface RecipientProfile {
  readonly name?: string;
  readonly age?: number;
  readonly gender?: Gender;
  readonly relationship: 'family' | 'friend' | 'colleague' | 'partner' | 'other';
  readonly interests: ReadonlyArray<string>;
}

export interface SessionState {
  readonly status: 'active' | 'paused' | 'completed' | 'abandoned';
  readonly currentIndex: number;
  readonly totalProducts: number;
  readonly completedAt?: ISODateTime;
}

export interface SessionAnalytics {
  readonly swipeCount: number;
  readonly likeCount: number;
  readonly dislikeCount: number;
  readonly skipCount: number;
  readonly superLikeCount: number;
  readonly averageTimePerProduct: number;
  readonly engagementScore: number;
}

export interface SessionMetadata {
  readonly createdAt: ISODateTime;
  readonly updatedAt: ISODateTime;
  readonly deviceType: 'mobile' | 'tablet' | 'desktop';
  readonly platform: 'web' | 'ios' | 'android';
  readonly version: string;
}

// ==============================================================================
// ENHANCED INTERACTION TYPES
// ==============================================================================

/**
 * Interaction types as const assertion
 */
export const INTERACTION_TYPES = {
  SWIPE: 'swipe',
  CLICK: 'click',
  KEYBOARD: 'keyboard',
  VOICE: 'voice',
  GESTURE: 'gesture',
} as const;

export type InteractionType = typeof INTERACTION_TYPES[keyof typeof INTERACTION_TYPES];

/**
 * Enhanced swipe interaction with detailed analytics
 */
export interface StrictSwipeInteraction {
  readonly id: InteractionId;
  readonly sessionId: SessionId;
  readonly productId: ProductId;
  readonly gesture: SwipeGesture;
  readonly analytics: InteractionAnalytics;
  readonly context: InteractionContext;
  readonly metadata: InteractionMetadata;
}

export interface SwipeGesture {
  readonly direction: SwipeDirection;
  readonly type: InteractionType;
  readonly velocity: number;
  readonly distance: number;
  readonly duration: number;
  readonly confidence: number;
}

export interface InteractionAnalytics {
  readonly viewDuration: number;
  readonly scrollPosition: number;
  readonly imageViews: ReadonlyArray<number>;
  readonly descriptionRead: boolean;
  readonly featuresViewed: ReadonlyArray<string>;
}

export interface InteractionContext {
  readonly productPosition: number;
  readonly sessionProgress: number;
  readonly timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  readonly previousInteractions: ReadonlyArray<SwipeDirection>;
}

export interface InteractionMetadata {
  readonly timestamp: ISODateTime;
  readonly deviceId: string;
  readonly sessionId: SessionId;
  readonly ip?: string;
  readonly userAgent?: string;
}

// ==============================================================================
// ADVANCED UTILITY TYPES
// ==============================================================================

/**
 * Deep readonly type for immutable data structures
 */
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

/**
 * Exact type that prevents excess properties
 */
export type Exact<T, U extends T> = T & Record<Exclude<keyof U, keyof T>, never>;

/**
 * Non-empty array type
 */
export type NonEmptyArray<T> = readonly [T, ...T[]];

/**
 * Finite string type for tagged unions
 */
export type FiniteString<T extends string> = T extends string
  ? string extends T
    ? never
    : T
  : never;

/**
 * Type-safe object keys
 */
export type StrictKeys<T> = T extends unknown ? keyof T : never;

/**
 * Conditional type for optional fields
 */
export type OptionalIfUndefined<T, K extends keyof T> = undefined extends T[K]
  ? Partial<Pick<T, K>>
  : Required<Pick<T, K>>;

/**
 * Type-safe event handler
 */
export type EventHandler<T extends Event = Event> = (event: T) => void;

/**
 * Async function type
 */
export type AsyncFunction<TArgs extends ReadonlyArray<unknown> = [], TReturn = void> =
  (...args: TArgs) => Promise<TReturn>;

/**
 * Type predicate function
 */
export type TypePredicate<T, U extends T = T> = (value: T) => value is U;

/**
 * Discriminated union helper
 */
export type DiscriminatedUnion<T, K extends keyof T, V extends T[K]> =
  T extends Record<K, V> ? T : never;

// ==============================================================================
// RESULT AND OPTION TYPES
// ==============================================================================

/**
 * Result type for error handling without exceptions
 */
export type Result<TValue, TError = Error> =
  | { readonly success: true; readonly value: TValue }
  | { readonly success: false; readonly error: TError };

/**
 * Option type for nullable values
 */
export type Option<T> = T | null | undefined;

/**
 * Maybe type for optional computations
 */
export type Maybe<T> =
  | { readonly hasValue: true; readonly value: T }
  | { readonly hasValue: false };

// ==============================================================================
// FORM AND VALIDATION TYPES
// ==============================================================================

/**
 * Form field state with strict typing
 */
export interface FormField<T> {
  readonly value: T;
  readonly error: string | null;
  readonly touched: boolean;
  readonly dirty: boolean;
  readonly valid: boolean;
}

/**
 * Form validation rules
 */
export interface ValidationRule<T> {
  readonly name: string;
  readonly message: string;
  readonly validator: (value: T) => boolean;
}

/**
 * Form state with strict typing
 */
export interface StrictFormState<T extends Record<string, unknown>> {
  readonly fields: { readonly [K in keyof T]: FormField<T[K]> };
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
  readonly isDirty: boolean;
  readonly errors: ReadonlyArray<ValidationError>;
}