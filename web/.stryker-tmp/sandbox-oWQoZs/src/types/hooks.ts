/**
 * Enhanced Hook Type Definitions for aclue Platform
 *
 * Enterprise-grade type definitions for React hooks that eliminate 'any' types
 * and provide strict typing for state management and side effects.
 *
 * Features:
 * - Strict typing for hook return values and parameters
 * - Generic hook types for reusable patterns
 * - Type-safe event handlers and callbacks
 * - Advanced state management types
 * - Form handling with comprehensive validation
 */
// @ts-nocheck


import { RefObject, MutableRefObject, Dispatch, SetStateAction } from 'react';
import { User, Product, Category, SwipeSession, SwipeInteraction, Recommendation, GiftLink, SearchQuery, SearchResult, NotificationSettings, PrivacySettings, LoadingState, ErrorState, ToastMessage, FormState, FormValidationError, AnalyticsEvent } from '@/types';
import { StrictApiResponse, ApiErrorDetails, StrictPaginatedResponse, Result, Maybe, StrictProduct, StrictSwipeSession, StrictUserPreferences, SwipeDirection, SessionType, ProductId, CategoryId, SessionId, UserId, ISODateTime } from './enhanced';

// ==============================================================================
// GENERIC HOOK TYPES
// ==============================================================================

/**
 * Generic async hook state with loading, error, and data states
 */
export interface AsyncHookState<TData, TError = ApiErrorDetails> {
  readonly data: TData | null;
  readonly loading: boolean;
  readonly error: TError | null;
  readonly lastUpdated: ISODateTime | null;
}

/**
 * Generic async hook return type with state and control methods
 */
export interface AsyncHookReturn<TData, TParams = void, TError = ApiErrorDetails> {
  readonly state: AsyncHookState<TData, TError>;
  readonly execute: (params: TParams) => Promise<Result<TData, TError>>;
  readonly reset: () => void;
  readonly refresh: () => Promise<Result<TData, TError>>;
}

/**
 * Generic mutation hook for data modifications
 */
export interface MutationHookReturn<TData, TVariables, TError = ApiErrorDetails> {
  readonly data: TData | null;
  readonly loading: boolean;
  readonly error: TError | null;
  readonly mutate: (variables: TVariables) => Promise<Result<TData, TError>>;
  readonly reset: () => void;
}

/**
 * Paginated data hook state
 */
export interface PaginatedHookState<TData, TError = ApiErrorDetails> {
  readonly items: readonly TData[];
  readonly pagination: {
    readonly currentPage: number;
    readonly pageSize: number;
    readonly totalItems: number;
    readonly totalPages: number;
    readonly hasNextPage: boolean;
    readonly hasPreviousPage: boolean;
  };
  readonly loading: boolean;
  readonly error: TError | null;
  readonly lastUpdated: ISODateTime | null;
}

/**
 * Paginated data hook return type
 */
export interface PaginatedHookReturn<TData, TParams = void, TError = ApiErrorDetails> {
  readonly state: PaginatedHookState<TData, TError>;
  readonly loadMore: () => Promise<Result<readonly TData[], TError>>;
  readonly refresh: () => Promise<Result<readonly TData[], TError>>;
  readonly goToPage: (page: number) => Promise<Result<readonly TData[], TError>>;
  readonly search: (params: TParams) => Promise<Result<readonly TData[], TError>>;
  readonly reset: () => void;
}

// ==============================================================================
// AUTHENTICATION HOOK TYPES
// ==============================================================================

/**
 * Authentication context state
 */
export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly isLoading: boolean;
  readonly error: ApiErrorDetails | null;
  readonly tokenExpiry: ISODateTime | null;
}

/**
 * Login credentials for authentication
 */
export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
}

/**
 * Registration data for new users
 */
export interface RegistrationData {
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
  readonly dateOfBirth?: string;
  readonly marketingConsent?: boolean;
}

/**
 * Password reset request data
 */
export interface PasswordResetData {
  readonly email: string;
}

/**
 * Password change data
 */
export interface PasswordChangeData {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
}

/**
 * useAuth hook return type
 */
export interface UseAuthReturn {
  readonly state: AuthState;
  readonly login: (credentials: LoginCredentials) => Promise<Result<User, ApiErrorDetails>>;
  readonly register: (data: RegistrationData) => Promise<Result<User, ApiErrorDetails>>;
  readonly logout: () => Promise<void>;
  readonly forgotPassword: (data: PasswordResetData) => Promise<Result<void, ApiErrorDetails>>;
  readonly changePassword: (data: PasswordChangeData) => Promise<Result<void, ApiErrorDetails>>;
  readonly refreshUser: () => Promise<Result<User, ApiErrorDetails>>;
  readonly updateProfile: (data: Partial<User>) => Promise<Result<User, ApiErrorDetails>>;
}

// ==============================================================================
// PRODUCT AND SEARCH HOOK TYPES
// ==============================================================================

/**
 * Product search filters
 */
export interface ProductSearchFilters {
  readonly category?: CategoryId;
  readonly minPrice?: number;
  readonly maxPrice?: number;
  readonly brand?: string;
  readonly rating?: number;
  readonly availability?: readonly string[];
  readonly tags?: readonly string[];
  readonly featured?: boolean;
  readonly trending?: boolean;
  readonly new?: boolean;
}

/**
 * Product search parameters
 */
export interface ProductSearchParams {
  readonly query?: string;
  readonly filters?: ProductSearchFilters;
  readonly sortBy?: 'relevance' | 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'trending';
  readonly page?: number;
  readonly limit?: number;
}

/**
 * useProducts hook return type
 */
export interface UseProductsReturn {
  readonly state: PaginatedHookState<StrictProduct>;
  readonly search: (params: ProductSearchParams) => Promise<Result<readonly StrictProduct[], ApiErrorDetails>>;
  readonly loadMore: () => Promise<Result<readonly StrictProduct[], ApiErrorDetails>>;
  readonly refresh: () => Promise<Result<readonly StrictProduct[], ApiErrorDetails>>;
  readonly getProduct: (id: ProductId) => Promise<Result<StrictProduct, ApiErrorDetails>>;
  readonly reset: () => void;
}

/**
 * useSearch hook state
 */
export interface SearchHookState {
  readonly query: string;
  readonly results: readonly StrictProduct[];
  readonly suggestions: readonly string[];
  readonly facets: {
    readonly categories: ReadonlyArray<{
      readonly name: string;
      readonly count: number;
    }>;
    readonly brands: ReadonlyArray<{
      readonly name: string;
      readonly count: number;
    }>;
    readonly priceRanges: ReadonlyArray<{
      readonly range: string;
      readonly count: number;
    }>;
  };
  readonly loading: boolean;
  readonly error: ApiErrorDetails | null;
  readonly hasSearched: boolean;
}

/**
 * useSearch hook return type
 */
export interface UseSearchReturn {
  readonly state: SearchHookState;
  readonly search: (query: string, filters?: ProductSearchFilters) => Promise<void>;
  readonly clearSearch: () => void;
  readonly setQuery: (query: string) => void;
}

// ==============================================================================
// SWIPE INTERFACE HOOK TYPES
// ==============================================================================

/**
 * Swipe card data structure
 */
export interface SwipeCard {
  readonly id: ProductId;
  readonly product: StrictProduct;
  readonly position: number;
  readonly isVisible: boolean;
  readonly isAnimating: boolean;
  readonly zIndex: number;
}

/**
 * Swipe gesture data
 */
export interface SwipeGesture {
  readonly direction: SwipeDirection;
  readonly velocity: number;
  readonly distance: number;
  readonly duration: number;
  readonly startPosition: {
    readonly x: number;
    readonly y: number;
  };
  readonly endPosition: {
    readonly x: number;
    readonly y: number;
  };
}

/**
 * Swipe session state
 */
export interface SwipeSessionState {
  readonly session: StrictSwipeSession | null;
  readonly cards: readonly SwipeCard[];
  readonly currentIndex: number;
  readonly isLoading: boolean;
  readonly hasMore: boolean;
  readonly analytics: {
    readonly swipeCount: number;
    readonly likeCount: number;
    readonly dislikeCount: number;
    readonly skipCount: number;
    readonly superLikeCount: number;
    readonly sessionDuration: number;
  };
}

/**
 * useSwipeInterface hook return type
 */
export interface UseSwipeInterfaceReturn {
  readonly state: SwipeSessionState;
  readonly startSession: (type: SessionType, context?: Record<string, unknown>) => Promise<Result<StrictSwipeSession, ApiErrorDetails>>;
  readonly swipe: (direction: SwipeDirection, gesture?: SwipeGesture) => Promise<Result<SwipeInteraction, ApiErrorDetails>>;
  readonly loadMoreCards: () => Promise<Result<readonly SwipeCard[], ApiErrorDetails>>;
  readonly resetSession: () => void;
  readonly endSession: () => Promise<Result<void, ApiErrorDetails>>;
}

// ==============================================================================
// NOTIFICATION HOOK TYPES
// ==============================================================================

/**
 * Notification data structure
 */
export interface NotificationData {
  readonly id: string;
  readonly type: 'success' | 'error' | 'warning' | 'info';
  readonly title: string;
  readonly message?: string;
  readonly duration?: number;
  readonly persistent?: boolean;
  readonly action?: {
    readonly label: string;
    readonly onClick: () => void;
  };
  readonly metadata?: Record<string, unknown>;
  readonly timestamp: ISODateTime;
}

/**
 * Notification settings state
 */
export interface NotificationSettingsState {
  readonly email: boolean;
  readonly push: boolean;
  readonly sms: boolean;
  readonly marketing: boolean;
  readonly recommendations: boolean;
  readonly giftLinks: boolean;
  readonly security: boolean;
}

/**
 * useNotifications hook return type
 */
export interface UseNotificationsReturn {
  readonly notifications: readonly NotificationData[];
  readonly unreadCount: number;
  readonly settings: NotificationSettingsState;
  readonly add: (notification: Omit<NotificationData, 'id' | 'timestamp'>) => string;
  readonly remove: (id: string) => void;
  readonly clear: () => void;
  readonly markAsRead: (id: string) => void;
  readonly markAllAsRead: () => void;
  readonly updateSettings: (settings: Partial<NotificationSettingsState>) => Promise<Result<NotificationSettingsState, ApiErrorDetails>>;
}

// ==============================================================================
// FORM HOOK TYPES
// ==============================================================================

/**
 * Form field definition
 */
export interface FormFieldDefinition<T> {
  readonly name: string;
  readonly label: string;
  readonly type: 'text' | 'email' | 'password' | 'number' | 'select' | 'checkbox' | 'textarea' | 'date';
  readonly required?: boolean;
  readonly placeholder?: string;
  readonly options?: ReadonlyArray<{
    readonly value: T;
    readonly label: string;
  }>;
  readonly validation?: {
    readonly min?: number;
    readonly max?: number;
    readonly pattern?: RegExp;
    readonly custom?: (value: T) => string | null;
  };
}

/**
 * Form state with validation
 */
export interface FormHookState<T extends Record<string, unknown>> {
  readonly values: T;
  readonly errors: Record<keyof T, string | null>;
  readonly touched: Record<keyof T, boolean>;
  readonly isValid: boolean;
  readonly isSubmitting: boolean;
  readonly isDirty: boolean;
}

/**
 * useForm hook return type
 */
export interface UseFormReturn<T extends Record<string, unknown>> {
  readonly state: FormHookState<T>;
  readonly setValue: <K extends keyof T>(field: K, value: T[K]) => void;
  readonly setError: <K extends keyof T>(field: K, error: string | null) => void;
  readonly setTouched: <K extends keyof T>(field: K, touched: boolean) => void;
  readonly validateField: <K extends keyof T>(field: K) => string | null;
  readonly validateForm: () => boolean;
  readonly reset: (values?: Partial<T>) => void;
  readonly submit: (onSubmit: (values: T) => Promise<Result<unknown, ApiErrorDetails>>) => Promise<void>;
}

// ==============================================================================
// PREFERENCE HOOK TYPES
// ==============================================================================

/**
 * User preferences state
 */
export interface UserPreferencesState {
  readonly preferences: StrictUserPreferences | null;
  readonly isLoading: boolean;
  readonly error: ApiErrorDetails | null;
  readonly hasUnsavedChanges: boolean;
}

/**
 * useUserPreferences hook return type
 */
export interface UseUserPreferencesReturn {
  readonly state: UserPreferencesState;
  readonly updatePreferences: (updates: Partial<StrictUserPreferences>) => Promise<Result<StrictUserPreferences, ApiErrorDetails>>;
  readonly savePreferences: () => Promise<Result<StrictUserPreferences, ApiErrorDetails>>;
  readonly resetPreferences: () => void;
  readonly refreshPreferences: () => Promise<Result<StrictUserPreferences, ApiErrorDetails>>;
}

// ==============================================================================
// ANALYTICS HOOK TYPES
// ==============================================================================

/**
 * Analytics event properties
 */
export interface AnalyticsEventProperties {
  readonly [key: string]: string | number | boolean | null | undefined;
}

/**
 * User identification properties
 */
export interface UserIdentificationProperties {
  readonly userId: UserId;
  readonly email?: string;
  readonly firstName?: string;
  readonly lastName?: string;
  readonly subscriptionTier?: string;
  readonly signupDate?: ISODateTime;
}

/**
 * useAnalytics hook return type
 */
export interface UseAnalyticsReturn {
  readonly track: (eventName: string, properties?: AnalyticsEventProperties) => void;
  readonly identify: (userId: UserId, properties?: UserIdentificationProperties) => void;
  readonly page: (pageName: string, properties?: AnalyticsEventProperties) => void;
  readonly group: (groupId: string, properties?: AnalyticsEventProperties) => void;
  readonly reset: () => void;
  readonly getSessionId: () => string;
}

// ==============================================================================
// UTILITY HOOK TYPES
// ==============================================================================

/**
 * Dark mode state and controls
 */
export interface DarkModeState {
  readonly isDark: boolean;
  readonly systemPreference: boolean;
  readonly userPreference: 'light' | 'dark' | 'system';
}

/**
 * useDarkMode hook return type
 */
export interface UseDarkModeReturn {
  readonly state: DarkModeState;
  readonly setTheme: (theme: 'light' | 'dark' | 'system') => void;
  readonly toggle: () => void;
}

/**
 * Debounced value hook return type
 */
export interface UseDebounceReturn<T> {
  readonly debouncedValue: T;
  readonly isDebouncing: boolean;
}

/**
 * Local storage hook return type
 */
export interface UseLocalStorageReturn<T> {
  readonly value: T;
  readonly setValue: (value: T | ((prev: T) => T)) => void;
  readonly removeValue: () => void;
}

/**
 * Intersection observer hook return type
 */
export interface UseIntersectionObserverReturn {
  readonly ref: RefObject<HTMLElement>;
  readonly isIntersecting: boolean;
  readonly entry: IntersectionObserverEntry | null;
}

/**
 * Window size hook return type
 */
export interface UseWindowSizeReturn {
  readonly width: number;
  readonly height: number;
  readonly isMobile: boolean;
  readonly isTablet: boolean;
  readonly isDesktop: boolean;
}

/**
 * Previous value hook return type
 */
export interface UsePreviousReturn<T> {
  readonly previousValue: T | undefined;
}

/**
 * Click outside hook return type
 */
export interface UseClickOutsideReturn {
  readonly ref: RefObject<HTMLElement>;
}

/**
 * Copy to clipboard hook return type
 */
export interface UseCopyToClipboardReturn {
  readonly copy: (text: string) => Promise<boolean>;
  readonly isCopied: boolean;
  readonly error: Error | null;
}

// ==============================================================================
// ADVANCED HOOK PATTERNS
// ==============================================================================

/**
 * Resource hook for managing CRUD operations
 */
export interface UseResourceReturn<TData, TCreateData, TUpdateData, TError = ApiErrorDetails> {
  readonly data: TData | null;
  readonly loading: boolean;
  readonly error: TError | null;
  readonly create: (data: TCreateData) => Promise<Result<TData, TError>>;
  readonly read: (id: string) => Promise<Result<TData, TError>>;
  readonly update: (id: string, data: TUpdateData) => Promise<Result<TData, TError>>;
  readonly delete: (id: string) => Promise<Result<void, TError>>;
  readonly refresh: () => Promise<Result<TData, TError>>;
}

/**
 * Optimistic update hook for immediate UI feedback
 */
export interface UseOptimisticUpdateReturn<TData, TUpdateData, TError = ApiErrorDetails> {
  readonly data: TData;
  readonly loading: boolean;
  readonly error: TError | null;
  readonly update: (updateData: TUpdateData, optimisticData: TData) => Promise<Result<TData, TError>>;
  readonly rollback: () => void;
}

/**
 * Infinite scroll hook for paginated data
 */
export interface UseInfiniteScrollReturn<TData, TError = ApiErrorDetails> {
  readonly data: readonly TData[];
  readonly loading: boolean;
  readonly error: TError | null;
  readonly hasMore: boolean;
  readonly loadMore: () => Promise<Result<readonly TData[], TError>>;
  readonly refresh: () => Promise<Result<readonly TData[], TError>>;
  readonly observerRef: RefObject<HTMLElement>;
}

// ==============================================================================
// HOOK CONFIGURATION TYPES
// ==============================================================================

/**
 * Configuration for async hooks
 */
export interface AsyncHookConfig {
  readonly immediate?: boolean;
  readonly retries?: number;
  readonly retryDelay?: number;
  readonly timeout?: number;
  readonly cacheKey?: string;
  readonly cacheTTL?: number;
}

/**
 * Configuration for debounce hooks
 */
export interface DebounceConfig {
  readonly delay: number;
  readonly immediate?: boolean;
  readonly maxWait?: number;
}

/**
 * Configuration for intersection observer hooks
 */
export interface IntersectionObserverConfig {
  readonly threshold?: number | number[];
  readonly rootMargin?: string;
  readonly root?: Element | null;
  readonly triggerOnce?: boolean;
}

/**
 * Configuration for local storage hooks
 */
export interface LocalStorageConfig<T> {
  readonly defaultValue: T;
  readonly serializer?: {
    readonly read: (value: string) => T;
    readonly write: (value: T) => string;
  };
}
export type {
// Re-export hook state types for convenience
AsyncHookState, AsyncHookReturn, MutationHookReturn, PaginatedHookState, PaginatedHookReturn };