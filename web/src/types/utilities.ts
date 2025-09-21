/**
 * Advanced TypeScript Utility Functions and Type Guards
 *
 * Enterprise-grade utility functions that leverage advanced TypeScript features
 * for type-safe operations, validation, and data transformation.
 *
 * Features:
 * - Type guards for runtime type checking
 * - Assertion functions for type narrowing
 * - Utility functions for branded types
 * - Result and Option type helpers
 * - Form validation utilities
 */

import type {
  UserId,
  ProductId,
  CategoryId,
  SessionId,
  CurrencyAmount,
  ISODateTime,
  EmailAddress,
  URL,
  StrictApiResponse,
  ApiErrorDetails,
  Result,
  Option,
  Maybe,
  TypePredicate,
  AsyncFunction,
  StrictProduct,
  StrictSwipeSession,
  SwipeDirection,
  SessionType,
  ProductAvailability,
  Gender,
  SubscriptionTier,
  OccasionType,
  InteractionType,
  SWIPE_DIRECTIONS,
  SESSION_TYPES,
  PRODUCT_AVAILABILITY,
  GENDER_OPTIONS,
  SUBSCRIPTION_TIERS,
  OCCASION_TYPES,
  INTERACTION_TYPES,
} from './enhanced';

// ==============================================================================
// BRANDED TYPE UTILITIES
// ==============================================================================

/**
 * Create a branded type value with runtime validation
 */
export function createBrandedId<T extends string>(
  value: string,
  validator: (value: string) => boolean,
): T {
  if (!validator(value)) {
    throw new Error(`Invalid branded ID: ${value}`);
  }
  return value as T;
}

/**
 * Validate and create UserId
 */
export function createUserId(value: string): UserId {
  return createBrandedId<UserId>(value, isValidUuid);
}

/**
 * Validate and create ProductId
 */
export function createProductId(value: string): ProductId {
  return createBrandedId<ProductId>(value, isValidUuid);
}

/**
 * Validate and create CategoryId
 */
export function createCategoryId(value: string): CategoryId {
  return createBrandedId<CategoryId>(value, isValidUuid);
}

/**
 * Validate and create SessionId
 */
export function createSessionId(value: string): SessionId {
  return createBrandedId<SessionId>(value, isValidUuid);
}

/**
 * Create currency amount in smallest denomination
 */
export function createCurrencyAmount(value: number): CurrencyAmount {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`Invalid currency amount: ${value}`);
  }
  return value as CurrencyAmount;
}

/**
 * Create ISO datetime string
 */
export function createISODateTime(date?: Date): ISODateTime {
  const isoString = (date ?? new Date()).toISOString();
  return isoString as ISODateTime;
}

/**
 * Create email address with validation
 */
export function createEmailAddress(value: string): EmailAddress {
  if (!isValidEmail(value)) {
    throw new Error(`Invalid email address: ${value}`);
  }
  return value as EmailAddress;
}

/**
 * Create URL with validation
 */
export function createURL(value: string): URL {
  try {
    new globalThis.URL(value);
    return value as URL;
  } catch {
    throw new Error(`Invalid URL: ${value}`);
  }
}

// ==============================================================================
// TYPE GUARDS
// ==============================================================================

/**
 * Type guard for UUID strings
 */
export function isValidUuid(value: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

/**
 * Type guard for email addresses
 */
export function isValidEmail(value: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
}

/**
 * Type guard for ISO datetime strings
 */
export function isISODateTime(value: string): value is ISODateTime {
  try {
    const date = new Date(value);
    return date.toISOString() === value;
  } catch {
    return false;
  }
}

/**
 * Type guard for swipe directions
 */
export function isSwipeDirection(value: string): value is SwipeDirection {
  return Object.values(SWIPE_DIRECTIONS).includes(value as SwipeDirection);
}

/**
 * Type guard for session types
 */
export function isSessionType(value: string): value is SessionType {
  return Object.values(SESSION_TYPES).includes(value as SessionType);
}

/**
 * Type guard for product availability
 */
export function isProductAvailability(value: string): value is ProductAvailability {
  return Object.values(PRODUCT_AVAILABILITY).includes(value as ProductAvailability);
}

/**
 * Type guard for gender options
 */
export function isGender(value: string): value is Gender {
  return Object.values(GENDER_OPTIONS).includes(value as Gender);
}

/**
 * Type guard for subscription tiers
 */
export function isSubscriptionTier(value: string): value is SubscriptionTier {
  return Object.values(SUBSCRIPTION_TIERS).includes(value as SubscriptionTier);
}

/**
 * Type guard for occasion types
 */
export function isOccasionType(value: string): value is OccasionType {
  return Object.values(OCCASION_TYPES).includes(value as OccasionType);
}

/**
 * Type guard for interaction types
 */
export function isInteractionType(value: string): value is InteractionType {
  return Object.values(INTERACTION_TYPES).includes(value as InteractionType);
}

/**
 * Type guard for successful API responses
 */
export function isSuccessResponse<T>(
  response: StrictApiResponse<T>,
): response is { success: true; data: T; message?: string; timestamp: ISODateTime } {
  return response.success === true;
}

/**
 * Type guard for error API responses
 */
export function isErrorResponse<T>(
  response: StrictApiResponse<T>,
): response is { success: false; error: ApiErrorDetails; timestamp: ISODateTime } {
  return response.success === false;
}

/**
 * Type guard for non-null values
 */
export function isNotNull<T>(value: T | null): value is T {
  return value !== null;
}

/**
 * Type guard for non-undefined values
 */
export function isNotUndefined<T>(value: T | undefined): value is T {
  return value !== undefined;
}

/**
 * Type guard for defined values (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  return value !== null && value !== undefined;
}

/**
 * Type guard for non-empty arrays
 */
export function isNonEmptyArray<T>(array: readonly T[]): array is readonly [T, ...T[]] {
  return array.length > 0;
}

/**
 * Type guard for non-empty strings
 */
export function isNonEmptyString(value: string): value is string {
  return value.length > 0 && value.trim().length > 0;
}

// ==============================================================================
// ASSERTION FUNCTIONS
// ==============================================================================

/**
 * Assert that a value is defined (throws if null or undefined)
 */
export function assertDefined<T>(
  value: T | null | undefined,
  message = 'Value must be defined',
): asserts value is T {
  if (!isDefined(value)) {
    throw new Error(message);
  }
}

/**
 * Assert that a value is a valid UUID
 */
export function assertValidUuid(value: string, message = 'Invalid UUID'): asserts value is string {
  if (!isValidUuid(value)) {
    throw new Error(`${message}: ${value}`);
  }
}

/**
 * Assert that a value is a valid email
 */
export function assertValidEmail(
  value: string,
  message = 'Invalid email address',
): asserts value is EmailAddress {
  if (!isValidEmail(value)) {
    throw new Error(`${message}: ${value}`);
  }
}

/**
 * Assert that an API response is successful
 */
export function assertSuccessResponse<T>(
  response: StrictApiResponse<T>,
  message = 'API request failed',
): asserts response is { success: true; data: T; message?: string; timestamp: ISODateTime } {
  if (!isSuccessResponse(response)) {
    throw new Error(`${message}: ${response.error.message}`);
  }
}

// ==============================================================================
// RESULT TYPE UTILITIES
// ==============================================================================

/**
 * Create a successful result
 */
export function createSuccess<T>(value: T): Result<T, never> {
  return { success: true, value };
}

/**
 * Create an error result
 */
export function createError<E>(error: E): Result<never, E> {
  return { success: false, error };
}

/**
 * Check if result is successful
 */
export function isSuccess<T, E>(result: Result<T, E>): result is { success: true; value: T } {
  return result.success === true;
}

/**
 * Check if result is an error
 */
export function isError<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false;
}

/**
 * Map over a successful result
 */
export function mapResult<T, U, E>(
  result: Result<T, E>,
  mapper: (value: T) => U,
): Result<U, E> {
  return isSuccess(result) ? createSuccess(mapper(result.value)) : result;
}

/**
 * Chain results together
 */
export function chainResult<T, U, E>(
  result: Result<T, E>,
  next: (value: T) => Result<U, E>,
): Result<U, E> {
  return isSuccess(result) ? next(result.value) : result;
}

/**
 * Convert a throwing function to a Result
 */
export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
  try {
    return createSuccess(fn());
  } catch (error) {
    return createError(error as E);
  }
}

/**
 * Convert an async throwing function to a Result
 */
export async function tryCatchAsync<T, E = Error>(fn: () => Promise<T>): Promise<Result<T, E>> {
  try {
    const value = await fn();
    return createSuccess(value);
  } catch (error) {
    return createError(error as E);
  }
}

// ==============================================================================
// OPTION TYPE UTILITIES
// ==============================================================================

/**
 * Create Some value
 */
export function createSome<T>(value: T): Maybe<T> {
  return { hasValue: true, value };
}

/**
 * Create None value
 */
export function createNone<T>(): Maybe<T> {
  return { hasValue: false };
}

/**
 * Convert nullable to Maybe
 */
export function fromNullable<T>(value: T | null | undefined): Maybe<T> {
  return isDefined(value) ? createSome(value) : createNone();
}

/**
 * Convert Maybe to nullable
 */
export function toNullable<T>(maybe: Maybe<T>): T | null {
  return maybe.hasValue ? maybe.value : null;
}

/**
 * Map over a Maybe value
 */
export function mapMaybe<T, U>(maybe: Maybe<T>, mapper: (value: T) => U): Maybe<U> {
  return maybe.hasValue ? createSome(mapper(maybe.value)) : createNone();
}

/**
 * Chain Maybe values together
 */
export function chainMaybe<T, U>(maybe: Maybe<T>, next: (value: T) => Maybe<U>): Maybe<U> {
  return maybe.hasValue ? next(maybe.value) : createNone();
}

/**
 * Get value or default
 */
export function getOrElse<T>(maybe: Maybe<T>, defaultValue: T): T {
  return maybe.hasValue ? maybe.value : defaultValue;
}

// ==============================================================================
// ARRAY UTILITIES
// ==============================================================================

/**
 * Type-safe array filter that narrows types
 */
export function filterDefined<T>(array: readonly (T | null | undefined)[]): T[] {
  return array.filter(isDefined);
}

/**
 * Type-safe array find with type predicate
 */
export function findWithPredicate<T, U extends T>(
  array: readonly T[],
  predicate: TypePredicate<T, U>,
): U | undefined {
  return array.find(predicate);
}

/**
 * Group array by key with type safety
 */
export function groupBy<T, K extends string | number | symbol>(
  array: readonly T[],
  keyFn: (item: T) => K,
): Record<K, T[]> {
  return array.reduce(
    (groups, item) => {
      const key = keyFn(item);
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(item);
      return groups;
    },
    {} as Record<K, T[]>,
  );
}

/**
 * Create a unique array based on a key function
 */
export function uniqueBy<T, K>(array: readonly T[], keyFn: (item: T) => K): T[] {
  const seen = new Set<K>();
  return array.filter((item) => {
    const key = keyFn(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

// ==============================================================================
// VALIDATION UTILITIES
// ==============================================================================

/**
 * Validation result type
 */
export type ValidationResult<T> = Result<T, readonly string[]>;

/**
 * Combine multiple validation results
 */
export function combineValidations<T>(
  ...validations: readonly ValidationResult<T>[]
): ValidationResult<T> {
  const errors: string[] = [];
  let lastSuccess: T | undefined;

  for (const validation of validations) {
    if (isError(validation)) {
      errors.push(...validation.error);
    } else {
      lastSuccess = validation.value;
    }
  }

  return errors.length > 0
    ? createError(errors)
    : createSuccess(lastSuccess as T);
}

/**
 * Validate required field
 */
export function validateRequired<T>(value: T | null | undefined, fieldName: string): ValidationResult<T> {
  return isDefined(value)
    ? createSuccess(value)
    : createError([`${fieldName} is required`]);
}

/**
 * Validate string length
 */
export function validateStringLength(
  value: string,
  min: number,
  max: number,
  fieldName: string,
): ValidationResult<string> {
  if (value.length < min) {
    return createError([`${fieldName} must be at least ${min} characters`]);
  }
  if (value.length > max) {
    return createError([`${fieldName} must be no more than ${max} characters`]);
  }
  return createSuccess(value);
}

/**
 * Validate email format
 */
export function validateEmail(value: string, fieldName = 'Email'): ValidationResult<EmailAddress> {
  return isValidEmail(value)
    ? createSuccess(value as EmailAddress)
    : createError([`${fieldName} must be a valid email address`]);
}

/**
 * Validate number range
 */
export function validateNumberRange(
  value: number,
  min: number,
  max: number,
  fieldName: string,
): ValidationResult<number> {
  if (value < min) {
    return createError([`${fieldName} must be at least ${min}`]);
  }
  if (value > max) {
    return createError([`${fieldName} must be no more than ${max}`]);
  }
  return createSuccess(value);
}

// ==============================================================================
// ASYNC UTILITIES
// ==============================================================================

/**
 * Create a debounced function with type safety
 */
export function debounce<T extends readonly unknown[]>(
  fn: (...args: T) => void,
  delay: number,
): (...args: T) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...args: T) => {
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Create a throttled function with type safety
 */
export function throttle<T extends readonly unknown[]>(
  fn: (...args: T) => void,
  interval: number,
): (...args: T) => void {
  let lastCall = 0;

  return (...args: T) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Retry an async function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: AsyncFunction<[], T>,
  maxAttempts = 3,
  baseDelay = 1000,
): Promise<Result<T, Error>> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const result = await tryCatchAsync(fn);

    if (isSuccess(result) || attempt === maxAttempts) {
      return result;
    }

    const delay = baseDelay * Math.pow(2, attempt - 1);
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  return createError(new Error('Max retry attempts exceeded'));
}

/**
 * Create a timeout promise
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    ),
  ]);
}

// ==============================================================================
// OBJECT UTILITIES
// ==============================================================================

/**
 * Type-safe object keys
 */
export function getTypedKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>;
}

/**
 * Type-safe object entries
 */
export function getTypedEntries<T extends Record<string, unknown>>(
  obj: T,
): Array<[keyof T, T[keyof T]]> {
  return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
}

/**
 * Pick properties with type safety
 */
export function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  const result = {} as Pick<T, K>;
  for (const key of keys) {
    if (key in obj) {
      result[key] = obj[key];
    }
  }
  return result;
}

/**
 * Omit properties with type safety
 */
export function omit<T, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  const result = { ...obj };
  for (const key of keys) {
    delete result[key];
  }
  return result;
}