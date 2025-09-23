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
// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import type { UserId, ProductId, CategoryId, SessionId, CurrencyAmount, ISODateTime, EmailAddress, URL, StrictApiResponse, ApiErrorDetails, Result, Option, Maybe, TypePredicate, AsyncFunction, StrictProduct, StrictSwipeSession, SwipeDirection, SessionType, ProductAvailability, Gender, SubscriptionTier, OccasionType, InteractionType, SWIPE_DIRECTIONS, SESSION_TYPES, PRODUCT_AVAILABILITY, GENDER_OPTIONS, SUBSCRIPTION_TIERS, OCCASION_TYPES, INTERACTION_TYPES } from './enhanced';

// ==============================================================================
// BRANDED TYPE UTILITIES
// ==============================================================================

/**
 * Create a branded type value with runtime validation
 */
export function createBrandedId<T extends string>(value: string, validator: (value: string) => boolean): T {
  if (stryMutAct_9fa48("14540")) {
    {}
  } else {
    stryCov_9fa48("14540");
    if (stryMutAct_9fa48("14543") ? false : stryMutAct_9fa48("14542") ? true : stryMutAct_9fa48("14541") ? validator(value) : (stryCov_9fa48("14541", "14542", "14543"), !validator(value))) {
      if (stryMutAct_9fa48("14544")) {
        {}
      } else {
        stryCov_9fa48("14544");
        throw new Error(stryMutAct_9fa48("14545") ? `` : (stryCov_9fa48("14545"), `Invalid branded ID: ${value}`));
      }
    }
    return value as T;
  }
}

/**
 * Validate and create UserId
 */
export function createUserId(value: string): UserId {
  if (stryMutAct_9fa48("14546")) {
    {}
  } else {
    stryCov_9fa48("14546");
    return createBrandedId<UserId>(value, isValidUuid);
  }
}

/**
 * Validate and create ProductId
 */
export function createProductId(value: string): ProductId {
  if (stryMutAct_9fa48("14547")) {
    {}
  } else {
    stryCov_9fa48("14547");
    return createBrandedId<ProductId>(value, isValidUuid);
  }
}

/**
 * Validate and create CategoryId
 */
export function createCategoryId(value: string): CategoryId {
  if (stryMutAct_9fa48("14548")) {
    {}
  } else {
    stryCov_9fa48("14548");
    return createBrandedId<CategoryId>(value, isValidUuid);
  }
}

/**
 * Validate and create SessionId
 */
export function createSessionId(value: string): SessionId {
  if (stryMutAct_9fa48("14549")) {
    {}
  } else {
    stryCov_9fa48("14549");
    return createBrandedId<SessionId>(value, isValidUuid);
  }
}

/**
 * Create currency amount in smallest denomination
 */
export function createCurrencyAmount(value: number): CurrencyAmount {
  if (stryMutAct_9fa48("14550")) {
    {}
  } else {
    stryCov_9fa48("14550");
    if (stryMutAct_9fa48("14553") ? !Number.isInteger(value) && value < 0 : stryMutAct_9fa48("14552") ? false : stryMutAct_9fa48("14551") ? true : (stryCov_9fa48("14551", "14552", "14553"), (stryMutAct_9fa48("14554") ? Number.isInteger(value) : (stryCov_9fa48("14554"), !Number.isInteger(value))) || (stryMutAct_9fa48("14557") ? value >= 0 : stryMutAct_9fa48("14556") ? value <= 0 : stryMutAct_9fa48("14555") ? false : (stryCov_9fa48("14555", "14556", "14557"), value < 0)))) {
      if (stryMutAct_9fa48("14558")) {
        {}
      } else {
        stryCov_9fa48("14558");
        throw new Error(stryMutAct_9fa48("14559") ? `` : (stryCov_9fa48("14559"), `Invalid currency amount: ${value}`));
      }
    }
    return value as CurrencyAmount;
  }
}

/**
 * Create ISO datetime string
 */
export function createISODateTime(date?: Date): ISODateTime {
  if (stryMutAct_9fa48("14560")) {
    {}
  } else {
    stryCov_9fa48("14560");
    const isoString = (stryMutAct_9fa48("14561") ? date && new Date() : (stryCov_9fa48("14561"), date ?? new Date())).toISOString();
    return isoString as ISODateTime;
  }
}

/**
 * Create email address with validation
 */
export function createEmailAddress(value: string): EmailAddress {
  if (stryMutAct_9fa48("14562")) {
    {}
  } else {
    stryCov_9fa48("14562");
    if (stryMutAct_9fa48("14565") ? false : stryMutAct_9fa48("14564") ? true : stryMutAct_9fa48("14563") ? isValidEmail(value) : (stryCov_9fa48("14563", "14564", "14565"), !isValidEmail(value))) {
      if (stryMutAct_9fa48("14566")) {
        {}
      } else {
        stryCov_9fa48("14566");
        throw new Error(stryMutAct_9fa48("14567") ? `` : (stryCov_9fa48("14567"), `Invalid email address: ${value}`));
      }
    }
    return value as EmailAddress;
  }
}

/**
 * Create URL with validation
 */
export function createURL(value: string): URL {
  if (stryMutAct_9fa48("14568")) {
    {}
  } else {
    stryCov_9fa48("14568");
    try {
      if (stryMutAct_9fa48("14569")) {
        {}
      } else {
        stryCov_9fa48("14569");
        new globalThis.URL(value);
        return value as URL;
      }
    } catch {
      if (stryMutAct_9fa48("14570")) {
        {}
      } else {
        stryCov_9fa48("14570");
        throw new Error(stryMutAct_9fa48("14571") ? `` : (stryCov_9fa48("14571"), `Invalid URL: ${value}`));
      }
    }
  }
}

// ==============================================================================
// TYPE GUARDS
// ==============================================================================

/**
 * Type guard for UUID strings
 */
export function isValidUuid(value: string): boolean {
  if (stryMutAct_9fa48("14572")) {
    {}
  } else {
    stryCov_9fa48("14572");
    const uuidRegex = stryMutAct_9fa48("14586") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[^0-9a-f]{12}$/i : stryMutAct_9fa48("14585") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]$/i : stryMutAct_9fa48("14584") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][^0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14583") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]-[0-9a-f]{12}$/i : stryMutAct_9fa48("14582") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[^89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14581") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][^0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14580") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14579") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[^1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14578") ? /^[0-9a-f]{8}-[^0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14577") ? /^[0-9a-f]{8}-[0-9a-f]-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14576") ? /^[^0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14575") ? /^[0-9a-f]-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : stryMutAct_9fa48("14574") ? /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}/i : stryMutAct_9fa48("14573") ? /[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i : (stryCov_9fa48("14573", "14574", "14575", "14576", "14577", "14578", "14579", "14580", "14581", "14582", "14583", "14584", "14585", "14586"), /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    return uuidRegex.test(value);
  }
}

/**
 * Type guard for email addresses
 */
export function isValidEmail(value: string): boolean {
  if (stryMutAct_9fa48("14587")) {
    {}
  } else {
    stryCov_9fa48("14587");
    const emailRegex = stryMutAct_9fa48("14598") ? /^[^\s@]+@[^\s@]+\.[^\S@]+$/ : stryMutAct_9fa48("14597") ? /^[^\s@]+@[^\s@]+\.[\s@]+$/ : stryMutAct_9fa48("14596") ? /^[^\s@]+@[^\s@]+\.[^\s@]$/ : stryMutAct_9fa48("14595") ? /^[^\s@]+@[^\S@]+\.[^\s@]+$/ : stryMutAct_9fa48("14594") ? /^[^\s@]+@[\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("14593") ? /^[^\s@]+@[^\s@]\.[^\s@]+$/ : stryMutAct_9fa48("14592") ? /^[^\S@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("14591") ? /^[\s@]+@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("14590") ? /^[^\s@]@[^\s@]+\.[^\s@]+$/ : stryMutAct_9fa48("14589") ? /^[^\s@]+@[^\s@]+\.[^\s@]+/ : stryMutAct_9fa48("14588") ? /[^\s@]+@[^\s@]+\.[^\s@]+$/ : (stryCov_9fa48("14588", "14589", "14590", "14591", "14592", "14593", "14594", "14595", "14596", "14597", "14598"), /^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    return emailRegex.test(value);
  }
}

/**
 * Type guard for ISO datetime strings
 */
export function isISODateTime(value: string): value is ISODateTime {
  if (stryMutAct_9fa48("14599")) {
    {}
  } else {
    stryCov_9fa48("14599");
    try {
      if (stryMutAct_9fa48("14600")) {
        {}
      } else {
        stryCov_9fa48("14600");
        const date = new Date(value);
        return stryMutAct_9fa48("14603") ? date.toISOString() !== value : stryMutAct_9fa48("14602") ? false : stryMutAct_9fa48("14601") ? true : (stryCov_9fa48("14601", "14602", "14603"), date.toISOString() === value);
      }
    } catch {
      if (stryMutAct_9fa48("14604")) {
        {}
      } else {
        stryCov_9fa48("14604");
        return stryMutAct_9fa48("14605") ? true : (stryCov_9fa48("14605"), false);
      }
    }
  }
}

/**
 * Type guard for swipe directions
 */
export function isSwipeDirection(value: string): value is SwipeDirection {
  if (stryMutAct_9fa48("14606")) {
    {}
  } else {
    stryCov_9fa48("14606");
    return Object.values(SWIPE_DIRECTIONS).includes(value as SwipeDirection);
  }
}

/**
 * Type guard for session types
 */
export function isSessionType(value: string): value is SessionType {
  if (stryMutAct_9fa48("14607")) {
    {}
  } else {
    stryCov_9fa48("14607");
    return Object.values(SESSION_TYPES).includes(value as SessionType);
  }
}

/**
 * Type guard for product availability
 */
export function isProductAvailability(value: string): value is ProductAvailability {
  if (stryMutAct_9fa48("14608")) {
    {}
  } else {
    stryCov_9fa48("14608");
    return Object.values(PRODUCT_AVAILABILITY).includes(value as ProductAvailability);
  }
}

/**
 * Type guard for gender options
 */
export function isGender(value: string): value is Gender {
  if (stryMutAct_9fa48("14609")) {
    {}
  } else {
    stryCov_9fa48("14609");
    return Object.values(GENDER_OPTIONS).includes(value as Gender);
  }
}

/**
 * Type guard for subscription tiers
 */
export function isSubscriptionTier(value: string): value is SubscriptionTier {
  if (stryMutAct_9fa48("14610")) {
    {}
  } else {
    stryCov_9fa48("14610");
    return Object.values(SUBSCRIPTION_TIERS).includes(value as SubscriptionTier);
  }
}

/**
 * Type guard for occasion types
 */
export function isOccasionType(value: string): value is OccasionType {
  if (stryMutAct_9fa48("14611")) {
    {}
  } else {
    stryCov_9fa48("14611");
    return Object.values(OCCASION_TYPES).includes(value as OccasionType);
  }
}

/**
 * Type guard for interaction types
 */
export function isInteractionType(value: string): value is InteractionType {
  if (stryMutAct_9fa48("14612")) {
    {}
  } else {
    stryCov_9fa48("14612");
    return Object.values(INTERACTION_TYPES).includes(value as InteractionType);
  }
}

/**
 * Type guard for successful API responses
 */
export function isSuccessResponse<T>(response: StrictApiResponse<T>): response is {
  success: true;
  data: T;
  message?: string;
  timestamp: ISODateTime;
} {
  if (stryMutAct_9fa48("14613")) {
    {}
  } else {
    stryCov_9fa48("14613");
    return stryMutAct_9fa48("14616") ? response.success !== true : stryMutAct_9fa48("14615") ? false : stryMutAct_9fa48("14614") ? true : (stryCov_9fa48("14614", "14615", "14616"), response.success === (stryMutAct_9fa48("14617") ? false : (stryCov_9fa48("14617"), true)));
  }
}

/**
 * Type guard for error API responses
 */
export function isErrorResponse<T>(response: StrictApiResponse<T>): response is {
  success: false;
  error: ApiErrorDetails;
  timestamp: ISODateTime;
} {
  if (stryMutAct_9fa48("14618")) {
    {}
  } else {
    stryCov_9fa48("14618");
    return stryMutAct_9fa48("14621") ? response.success !== false : stryMutAct_9fa48("14620") ? false : stryMutAct_9fa48("14619") ? true : (stryCov_9fa48("14619", "14620", "14621"), response.success === (stryMutAct_9fa48("14622") ? true : (stryCov_9fa48("14622"), false)));
  }
}

/**
 * Type guard for non-null values
 */
export function isNotNull<T>(value: T | null): value is T {
  if (stryMutAct_9fa48("14623")) {
    {}
  } else {
    stryCov_9fa48("14623");
    return stryMutAct_9fa48("14626") ? value === null : stryMutAct_9fa48("14625") ? false : stryMutAct_9fa48("14624") ? true : (stryCov_9fa48("14624", "14625", "14626"), value !== null);
  }
}

/**
 * Type guard for non-undefined values
 */
export function isNotUndefined<T>(value: T | undefined): value is T {
  if (stryMutAct_9fa48("14627")) {
    {}
  } else {
    stryCov_9fa48("14627");
    return stryMutAct_9fa48("14630") ? value === undefined : stryMutAct_9fa48("14629") ? false : stryMutAct_9fa48("14628") ? true : (stryCov_9fa48("14628", "14629", "14630"), value !== undefined);
  }
}

/**
 * Type guard for defined values (not null or undefined)
 */
export function isDefined<T>(value: T | null | undefined): value is T {
  if (stryMutAct_9fa48("14631")) {
    {}
  } else {
    stryCov_9fa48("14631");
    return stryMutAct_9fa48("14634") ? value !== null || value !== undefined : stryMutAct_9fa48("14633") ? false : stryMutAct_9fa48("14632") ? true : (stryCov_9fa48("14632", "14633", "14634"), (stryMutAct_9fa48("14636") ? value === null : stryMutAct_9fa48("14635") ? true : (stryCov_9fa48("14635", "14636"), value !== null)) && (stryMutAct_9fa48("14638") ? value === undefined : stryMutAct_9fa48("14637") ? true : (stryCov_9fa48("14637", "14638"), value !== undefined)));
  }
}

/**
 * Type guard for non-empty arrays
 */
export function isNonEmptyArray<T>(array: readonly T[]): array is readonly [T, ...T[]] {
  if (stryMutAct_9fa48("14639")) {
    {}
  } else {
    stryCov_9fa48("14639");
    return stryMutAct_9fa48("14643") ? array.length <= 0 : stryMutAct_9fa48("14642") ? array.length >= 0 : stryMutAct_9fa48("14641") ? false : stryMutAct_9fa48("14640") ? true : (stryCov_9fa48("14640", "14641", "14642", "14643"), array.length > 0);
  }
}

/**
 * Type guard for non-empty strings
 */
export function isNonEmptyString(value: string): value is string {
  if (stryMutAct_9fa48("14644")) {
    {}
  } else {
    stryCov_9fa48("14644");
    return stryMutAct_9fa48("14647") ? value.length > 0 || value.trim().length > 0 : stryMutAct_9fa48("14646") ? false : stryMutAct_9fa48("14645") ? true : (stryCov_9fa48("14645", "14646", "14647"), (stryMutAct_9fa48("14650") ? value.length <= 0 : stryMutAct_9fa48("14649") ? value.length >= 0 : stryMutAct_9fa48("14648") ? true : (stryCov_9fa48("14648", "14649", "14650"), value.length > 0)) && (stryMutAct_9fa48("14653") ? value.trim().length <= 0 : stryMutAct_9fa48("14652") ? value.trim().length >= 0 : stryMutAct_9fa48("14651") ? true : (stryCov_9fa48("14651", "14652", "14653"), (stryMutAct_9fa48("14654") ? value.length : (stryCov_9fa48("14654"), value.trim().length)) > 0)));
  }
}

// ==============================================================================
// ASSERTION FUNCTIONS
// ==============================================================================

/**
 * Assert that a value is defined (throws if null or undefined)
 */
export function assertDefined<T>(value: T | null | undefined, message = stryMutAct_9fa48("14655") ? "" : (stryCov_9fa48("14655"), 'Value must be defined')): asserts value is T {
  if (stryMutAct_9fa48("14656")) {
    {}
  } else {
    stryCov_9fa48("14656");
    if (stryMutAct_9fa48("14659") ? false : stryMutAct_9fa48("14658") ? true : stryMutAct_9fa48("14657") ? isDefined(value) : (stryCov_9fa48("14657", "14658", "14659"), !isDefined(value))) {
      if (stryMutAct_9fa48("14660")) {
        {}
      } else {
        stryCov_9fa48("14660");
        throw new Error(message);
      }
    }
  }
}

/**
 * Assert that a value is a valid UUID
 */
export function assertValidUuid(value: string, message = stryMutAct_9fa48("14661") ? "" : (stryCov_9fa48("14661"), 'Invalid UUID')): asserts value is string {
  if (stryMutAct_9fa48("14662")) {
    {}
  } else {
    stryCov_9fa48("14662");
    if (stryMutAct_9fa48("14665") ? false : stryMutAct_9fa48("14664") ? true : stryMutAct_9fa48("14663") ? isValidUuid(value) : (stryCov_9fa48("14663", "14664", "14665"), !isValidUuid(value))) {
      if (stryMutAct_9fa48("14666")) {
        {}
      } else {
        stryCov_9fa48("14666");
        throw new Error(stryMutAct_9fa48("14667") ? `` : (stryCov_9fa48("14667"), `${message}: ${value}`));
      }
    }
  }
}

/**
 * Assert that a value is a valid email
 */
export function assertValidEmail(value: string, message = stryMutAct_9fa48("14668") ? "" : (stryCov_9fa48("14668"), 'Invalid email address')): asserts value is EmailAddress {
  if (stryMutAct_9fa48("14669")) {
    {}
  } else {
    stryCov_9fa48("14669");
    if (stryMutAct_9fa48("14672") ? false : stryMutAct_9fa48("14671") ? true : stryMutAct_9fa48("14670") ? isValidEmail(value) : (stryCov_9fa48("14670", "14671", "14672"), !isValidEmail(value))) {
      if (stryMutAct_9fa48("14673")) {
        {}
      } else {
        stryCov_9fa48("14673");
        throw new Error(stryMutAct_9fa48("14674") ? `` : (stryCov_9fa48("14674"), `${message}: ${value}`));
      }
    }
  }
}

/**
 * Assert that an API response is successful
 */
export function assertSuccessResponse<T>(response: StrictApiResponse<T>, message = stryMutAct_9fa48("14675") ? "" : (stryCov_9fa48("14675"), 'API request failed')): asserts response is {
  success: true;
  data: T;
  message?: string;
  timestamp: ISODateTime;
} {
  if (stryMutAct_9fa48("14676")) {
    {}
  } else {
    stryCov_9fa48("14676");
    if (stryMutAct_9fa48("14679") ? false : stryMutAct_9fa48("14678") ? true : stryMutAct_9fa48("14677") ? isSuccessResponse(response) : (stryCov_9fa48("14677", "14678", "14679"), !isSuccessResponse(response))) {
      if (stryMutAct_9fa48("14680")) {
        {}
      } else {
        stryCov_9fa48("14680");
        throw new Error(stryMutAct_9fa48("14681") ? `` : (stryCov_9fa48("14681"), `${message}: ${response.error.message}`));
      }
    }
  }
}

// ==============================================================================
// RESULT TYPE UTILITIES
// ==============================================================================

/**
 * Create a successful result
 */
export function createSuccess<T>(value: T): Result<T, never> {
  if (stryMutAct_9fa48("14682")) {
    {}
  } else {
    stryCov_9fa48("14682");
    return stryMutAct_9fa48("14683") ? {} : (stryCov_9fa48("14683"), {
      success: stryMutAct_9fa48("14684") ? false : (stryCov_9fa48("14684"), true),
      value
    });
  }
}

/**
 * Create an error result
 */
export function createError<E>(error: E): Result<never, E> {
  if (stryMutAct_9fa48("14685")) {
    {}
  } else {
    stryCov_9fa48("14685");
    return stryMutAct_9fa48("14686") ? {} : (stryCov_9fa48("14686"), {
      success: stryMutAct_9fa48("14687") ? true : (stryCov_9fa48("14687"), false),
      error
    });
  }
}

/**
 * Check if result is successful
 */
export function isSuccess<T, E>(result: Result<T, E>): result is {
  success: true;
  value: T;
} {
  if (stryMutAct_9fa48("14688")) {
    {}
  } else {
    stryCov_9fa48("14688");
    return stryMutAct_9fa48("14691") ? result.success !== true : stryMutAct_9fa48("14690") ? false : stryMutAct_9fa48("14689") ? true : (stryCov_9fa48("14689", "14690", "14691"), result.success === (stryMutAct_9fa48("14692") ? false : (stryCov_9fa48("14692"), true)));
  }
}

/**
 * Check if result is an error
 */
export function isError<T, E>(result: Result<T, E>): result is {
  success: false;
  error: E;
} {
  if (stryMutAct_9fa48("14693")) {
    {}
  } else {
    stryCov_9fa48("14693");
    return stryMutAct_9fa48("14696") ? result.success !== false : stryMutAct_9fa48("14695") ? false : stryMutAct_9fa48("14694") ? true : (stryCov_9fa48("14694", "14695", "14696"), result.success === (stryMutAct_9fa48("14697") ? true : (stryCov_9fa48("14697"), false)));
  }
}

/**
 * Map over a successful result
 */
export function mapResult<T, U, E>(result: Result<T, E>, mapper: (value: T) => U): Result<U, E> {
  if (stryMutAct_9fa48("14698")) {
    {}
  } else {
    stryCov_9fa48("14698");
    return isSuccess(result) ? createSuccess(mapper(result.value)) : result;
  }
}

/**
 * Chain results together
 */
export function chainResult<T, U, E>(result: Result<T, E>, next: (value: T) => Result<U, E>): Result<U, E> {
  if (stryMutAct_9fa48("14699")) {
    {}
  } else {
    stryCov_9fa48("14699");
    return isSuccess(result) ? next(result.value) : result;
  }
}

/**
 * Convert a throwing function to a Result
 */
export function tryCatch<T, E = Error>(fn: () => T): Result<T, E> {
  if (stryMutAct_9fa48("14700")) {
    {}
  } else {
    stryCov_9fa48("14700");
    try {
      if (stryMutAct_9fa48("14701")) {
        {}
      } else {
        stryCov_9fa48("14701");
        return createSuccess(fn());
      }
    } catch (error) {
      if (stryMutAct_9fa48("14702")) {
        {}
      } else {
        stryCov_9fa48("14702");
        return createError(error as E);
      }
    }
  }
}

/**
 * Convert an async throwing function to a Result
 */
export async function tryCatchAsync<T, E = Error>(fn: () => Promise<T>): Promise<Result<T, E>> {
  if (stryMutAct_9fa48("14703")) {
    {}
  } else {
    stryCov_9fa48("14703");
    try {
      if (stryMutAct_9fa48("14704")) {
        {}
      } else {
        stryCov_9fa48("14704");
        const value = await fn();
        return createSuccess(value);
      }
    } catch (error) {
      if (stryMutAct_9fa48("14705")) {
        {}
      } else {
        stryCov_9fa48("14705");
        return createError(error as E);
      }
    }
  }
}

// ==============================================================================
// OPTION TYPE UTILITIES
// ==============================================================================

/**
 * Create Some value
 */
export function createSome<T>(value: T): Maybe<T> {
  if (stryMutAct_9fa48("14706")) {
    {}
  } else {
    stryCov_9fa48("14706");
    return stryMutAct_9fa48("14707") ? {} : (stryCov_9fa48("14707"), {
      hasValue: stryMutAct_9fa48("14708") ? false : (stryCov_9fa48("14708"), true),
      value
    });
  }
}

/**
 * Create None value
 */
export function createNone<T>(): Maybe<T> {
  if (stryMutAct_9fa48("14709")) {
    {}
  } else {
    stryCov_9fa48("14709");
    return stryMutAct_9fa48("14710") ? {} : (stryCov_9fa48("14710"), {
      hasValue: stryMutAct_9fa48("14711") ? true : (stryCov_9fa48("14711"), false)
    });
  }
}

/**
 * Convert nullable to Maybe
 */
export function fromNullable<T>(value: T | null | undefined): Maybe<T> {
  if (stryMutAct_9fa48("14712")) {
    {}
  } else {
    stryCov_9fa48("14712");
    return isDefined(value) ? createSome(value) : createNone();
  }
}

/**
 * Convert Maybe to nullable
 */
export function toNullable<T>(maybe: Maybe<T>): T | null {
  if (stryMutAct_9fa48("14713")) {
    {}
  } else {
    stryCov_9fa48("14713");
    return maybe.hasValue ? maybe.value : null;
  }
}

/**
 * Map over a Maybe value
 */
export function mapMaybe<T, U>(maybe: Maybe<T>, mapper: (value: T) => U): Maybe<U> {
  if (stryMutAct_9fa48("14714")) {
    {}
  } else {
    stryCov_9fa48("14714");
    return maybe.hasValue ? createSome(mapper(maybe.value)) : createNone();
  }
}

/**
 * Chain Maybe values together
 */
export function chainMaybe<T, U>(maybe: Maybe<T>, next: (value: T) => Maybe<U>): Maybe<U> {
  if (stryMutAct_9fa48("14715")) {
    {}
  } else {
    stryCov_9fa48("14715");
    return maybe.hasValue ? next(maybe.value) : createNone();
  }
}

/**
 * Get value or default
 */
export function getOrElse<T>(maybe: Maybe<T>, defaultValue: T): T {
  if (stryMutAct_9fa48("14716")) {
    {}
  } else {
    stryCov_9fa48("14716");
    return maybe.hasValue ? maybe.value : defaultValue;
  }
}

// ==============================================================================
// ARRAY UTILITIES
// ==============================================================================

/**
 * Type-safe array filter that narrows types
 */
export function filterDefined<T>(array: readonly (T | null | undefined)[]): T[] {
  if (stryMutAct_9fa48("14717")) {
    {}
  } else {
    stryCov_9fa48("14717");
    return stryMutAct_9fa48("14718") ? array : (stryCov_9fa48("14718"), array.filter(isDefined));
  }
}

/**
 * Type-safe array find with type predicate
 */
export function findWithPredicate<T, U extends T>(array: readonly T[], predicate: TypePredicate<T, U>): U | undefined {
  if (stryMutAct_9fa48("14719")) {
    {}
  } else {
    stryCov_9fa48("14719");
    return array.find(predicate);
  }
}

/**
 * Group array by key with type safety
 */
export function groupBy<T, K extends string | number | symbol>(array: readonly T[], keyFn: (item: T) => K): Record<K, T[]> {
  if (stryMutAct_9fa48("14720")) {
    {}
  } else {
    stryCov_9fa48("14720");
    return array.reduce((groups, item) => {
      if (stryMutAct_9fa48("14721")) {
        {}
      } else {
        stryCov_9fa48("14721");
        const key = keyFn(item);
        if (stryMutAct_9fa48("14724") ? false : stryMutAct_9fa48("14723") ? true : stryMutAct_9fa48("14722") ? groups[key] : (stryCov_9fa48("14722", "14723", "14724"), !groups[key])) {
          if (stryMutAct_9fa48("14725")) {
            {}
          } else {
            stryCov_9fa48("14725");
            groups[key] = stryMutAct_9fa48("14726") ? ["Stryker was here"] : (stryCov_9fa48("14726"), []);
          }
        }
        groups[key].push(item);
        return groups;
      }
    }, {} as Record<K, T[]>);
  }
}

/**
 * Create a unique array based on a key function
 */
export function uniqueBy<T, K>(array: readonly T[], keyFn: (item: T) => K): T[] {
  if (stryMutAct_9fa48("14727")) {
    {}
  } else {
    stryCov_9fa48("14727");
    const seen = new Set<K>();
    return stryMutAct_9fa48("14728") ? array : (stryCov_9fa48("14728"), array.filter(item => {
      if (stryMutAct_9fa48("14729")) {
        {}
      } else {
        stryCov_9fa48("14729");
        const key = keyFn(item);
        if (stryMutAct_9fa48("14731") ? false : stryMutAct_9fa48("14730") ? true : (stryCov_9fa48("14730", "14731"), seen.has(key))) {
          if (stryMutAct_9fa48("14732")) {
            {}
          } else {
            stryCov_9fa48("14732");
            return stryMutAct_9fa48("14733") ? true : (stryCov_9fa48("14733"), false);
          }
        }
        seen.add(key);
        return stryMutAct_9fa48("14734") ? false : (stryCov_9fa48("14734"), true);
      }
    }));
  }
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
export function combineValidations<T>(...validations: readonly ValidationResult<T>[]): ValidationResult<T> {
  if (stryMutAct_9fa48("14735")) {
    {}
  } else {
    stryCov_9fa48("14735");
    const errors: string[] = stryMutAct_9fa48("14736") ? ["Stryker was here"] : (stryCov_9fa48("14736"), []);
    let lastSuccess: T | undefined;
    for (const validation of validations) {
      if (stryMutAct_9fa48("14737")) {
        {}
      } else {
        stryCov_9fa48("14737");
        if (stryMutAct_9fa48("14739") ? false : stryMutAct_9fa48("14738") ? true : (stryCov_9fa48("14738", "14739"), isError(validation))) {
          if (stryMutAct_9fa48("14740")) {
            {}
          } else {
            stryCov_9fa48("14740");
            errors.push(...validation.error);
          }
        } else {
          if (stryMutAct_9fa48("14741")) {
            {}
          } else {
            stryCov_9fa48("14741");
            lastSuccess = validation.value;
          }
        }
      }
    }
    return (stryMutAct_9fa48("14745") ? errors.length <= 0 : stryMutAct_9fa48("14744") ? errors.length >= 0 : stryMutAct_9fa48("14743") ? false : stryMutAct_9fa48("14742") ? true : (stryCov_9fa48("14742", "14743", "14744", "14745"), errors.length > 0)) ? createError(errors) : createSuccess(lastSuccess as T);
  }
}

/**
 * Validate required field
 */
export function validateRequired<T>(value: T | null | undefined, fieldName: string): ValidationResult<T> {
  if (stryMutAct_9fa48("14746")) {
    {}
  } else {
    stryCov_9fa48("14746");
    return isDefined(value) ? createSuccess(value) : createError(stryMutAct_9fa48("14747") ? [] : (stryCov_9fa48("14747"), [stryMutAct_9fa48("14748") ? `` : (stryCov_9fa48("14748"), `${fieldName} is required`)]));
  }
}

/**
 * Validate string length
 */
export function validateStringLength(value: string, min: number, max: number, fieldName: string): ValidationResult<string> {
  if (stryMutAct_9fa48("14749")) {
    {}
  } else {
    stryCov_9fa48("14749");
    if (stryMutAct_9fa48("14753") ? value.length >= min : stryMutAct_9fa48("14752") ? value.length <= min : stryMutAct_9fa48("14751") ? false : stryMutAct_9fa48("14750") ? true : (stryCov_9fa48("14750", "14751", "14752", "14753"), value.length < min)) {
      if (stryMutAct_9fa48("14754")) {
        {}
      } else {
        stryCov_9fa48("14754");
        return createError(stryMutAct_9fa48("14755") ? [] : (stryCov_9fa48("14755"), [stryMutAct_9fa48("14756") ? `` : (stryCov_9fa48("14756"), `${fieldName} must be at least ${min} characters`)]));
      }
    }
    if (stryMutAct_9fa48("14760") ? value.length <= max : stryMutAct_9fa48("14759") ? value.length >= max : stryMutAct_9fa48("14758") ? false : stryMutAct_9fa48("14757") ? true : (stryCov_9fa48("14757", "14758", "14759", "14760"), value.length > max)) {
      if (stryMutAct_9fa48("14761")) {
        {}
      } else {
        stryCov_9fa48("14761");
        return createError(stryMutAct_9fa48("14762") ? [] : (stryCov_9fa48("14762"), [stryMutAct_9fa48("14763") ? `` : (stryCov_9fa48("14763"), `${fieldName} must be no more than ${max} characters`)]));
      }
    }
    return createSuccess(value);
  }
}

/**
 * Validate email format
 */
export function validateEmail(value: string, fieldName = stryMutAct_9fa48("14764") ? "" : (stryCov_9fa48("14764"), 'Email')): ValidationResult<EmailAddress> {
  if (stryMutAct_9fa48("14765")) {
    {}
  } else {
    stryCov_9fa48("14765");
    return isValidEmail(value) ? createSuccess(value as EmailAddress) : createError(stryMutAct_9fa48("14766") ? [] : (stryCov_9fa48("14766"), [stryMutAct_9fa48("14767") ? `` : (stryCov_9fa48("14767"), `${fieldName} must be a valid email address`)]));
  }
}

/**
 * Validate number range
 */
export function validateNumberRange(value: number, min: number, max: number, fieldName: string): ValidationResult<number> {
  if (stryMutAct_9fa48("14768")) {
    {}
  } else {
    stryCov_9fa48("14768");
    if (stryMutAct_9fa48("14772") ? value >= min : stryMutAct_9fa48("14771") ? value <= min : stryMutAct_9fa48("14770") ? false : stryMutAct_9fa48("14769") ? true : (stryCov_9fa48("14769", "14770", "14771", "14772"), value < min)) {
      if (stryMutAct_9fa48("14773")) {
        {}
      } else {
        stryCov_9fa48("14773");
        return createError(stryMutAct_9fa48("14774") ? [] : (stryCov_9fa48("14774"), [stryMutAct_9fa48("14775") ? `` : (stryCov_9fa48("14775"), `${fieldName} must be at least ${min}`)]));
      }
    }
    if (stryMutAct_9fa48("14779") ? value <= max : stryMutAct_9fa48("14778") ? value >= max : stryMutAct_9fa48("14777") ? false : stryMutAct_9fa48("14776") ? true : (stryCov_9fa48("14776", "14777", "14778", "14779"), value > max)) {
      if (stryMutAct_9fa48("14780")) {
        {}
      } else {
        stryCov_9fa48("14780");
        return createError(stryMutAct_9fa48("14781") ? [] : (stryCov_9fa48("14781"), [stryMutAct_9fa48("14782") ? `` : (stryCov_9fa48("14782"), `${fieldName} must be no more than ${max}`)]));
      }
    }
    return createSuccess(value);
  }
}

// ==============================================================================
// ASYNC UTILITIES
// ==============================================================================

/**
 * Create a debounced function with type safety
 */
export function debounce<T extends readonly unknown[]>(fn: (...args: T) => void, delay: number): (...args: T) => void {
  if (stryMutAct_9fa48("14783")) {
    {}
  } else {
    stryCov_9fa48("14783");
    let timeoutId: NodeJS.Timeout | undefined;
    return (...args: T) => {
      if (stryMutAct_9fa48("14784")) {
        {}
      } else {
        stryCov_9fa48("14784");
        if (stryMutAct_9fa48("14787") ? timeoutId === undefined : stryMutAct_9fa48("14786") ? false : stryMutAct_9fa48("14785") ? true : (stryCov_9fa48("14785", "14786", "14787"), timeoutId !== undefined)) {
          if (stryMutAct_9fa48("14788")) {
            {}
          } else {
            stryCov_9fa48("14788");
            clearTimeout(timeoutId);
          }
        }
        timeoutId = setTimeout(stryMutAct_9fa48("14789") ? () => undefined : (stryCov_9fa48("14789"), () => fn(...args)), delay);
      }
    };
  }
}

/**
 * Create a throttled function with type safety
 */
export function throttle<T extends readonly unknown[]>(fn: (...args: T) => void, interval: number): (...args: T) => void {
  if (stryMutAct_9fa48("14790")) {
    {}
  } else {
    stryCov_9fa48("14790");
    let lastCall = 0;
    return (...args: T) => {
      if (stryMutAct_9fa48("14791")) {
        {}
      } else {
        stryCov_9fa48("14791");
        const now = Date.now();
        if (stryMutAct_9fa48("14795") ? now - lastCall < interval : stryMutAct_9fa48("14794") ? now - lastCall > interval : stryMutAct_9fa48("14793") ? false : stryMutAct_9fa48("14792") ? true : (stryCov_9fa48("14792", "14793", "14794", "14795"), (stryMutAct_9fa48("14796") ? now + lastCall : (stryCov_9fa48("14796"), now - lastCall)) >= interval)) {
          if (stryMutAct_9fa48("14797")) {
            {}
          } else {
            stryCov_9fa48("14797");
            lastCall = now;
            fn(...args);
          }
        }
      }
    };
  }
}

/**
 * Retry an async function with exponential backoff
 */
export async function retryWithBackoff<T>(fn: AsyncFunction<[], T>, maxAttempts = 3, baseDelay = 1000): Promise<Result<T, Error>> {
  if (stryMutAct_9fa48("14798")) {
    {}
  } else {
    stryCov_9fa48("14798");
    for (let attempt = 1; stryMutAct_9fa48("14801") ? attempt > maxAttempts : stryMutAct_9fa48("14800") ? attempt < maxAttempts : stryMutAct_9fa48("14799") ? false : (stryCov_9fa48("14799", "14800", "14801"), attempt <= maxAttempts); stryMutAct_9fa48("14802") ? attempt-- : (stryCov_9fa48("14802"), attempt++)) {
      if (stryMutAct_9fa48("14803")) {
        {}
      } else {
        stryCov_9fa48("14803");
        const result = await tryCatchAsync(fn);
        if (stryMutAct_9fa48("14806") ? isSuccess(result) && attempt === maxAttempts : stryMutAct_9fa48("14805") ? false : stryMutAct_9fa48("14804") ? true : (stryCov_9fa48("14804", "14805", "14806"), isSuccess(result) || (stryMutAct_9fa48("14808") ? attempt !== maxAttempts : stryMutAct_9fa48("14807") ? false : (stryCov_9fa48("14807", "14808"), attempt === maxAttempts)))) {
          if (stryMutAct_9fa48("14809")) {
            {}
          } else {
            stryCov_9fa48("14809");
            return result;
          }
        }
        const delay = stryMutAct_9fa48("14810") ? baseDelay / Math.pow(2, attempt - 1) : (stryCov_9fa48("14810"), baseDelay * Math.pow(2, stryMutAct_9fa48("14811") ? attempt + 1 : (stryCov_9fa48("14811"), attempt - 1)));
        await new Promise(stryMutAct_9fa48("14812") ? () => undefined : (stryCov_9fa48("14812"), resolve => setTimeout(resolve, delay)));
      }
    }
    return createError(new Error(stryMutAct_9fa48("14813") ? "" : (stryCov_9fa48("14813"), 'Max retry attempts exceeded')));
  }
}

/**
 * Create a timeout promise
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  if (stryMutAct_9fa48("14814")) {
    {}
  } else {
    stryCov_9fa48("14814");
    return Promise.race(stryMutAct_9fa48("14815") ? [] : (stryCov_9fa48("14815"), [promise, new Promise<never>(stryMutAct_9fa48("14816") ? () => undefined : (stryCov_9fa48("14816"), (_, reject) => setTimeout(stryMutAct_9fa48("14817") ? () => undefined : (stryCov_9fa48("14817"), () => reject(new Error(stryMutAct_9fa48("14818") ? `` : (stryCov_9fa48("14818"), `Operation timed out after ${ms}ms`)))), ms)))]));
  }
}

// ==============================================================================
// OBJECT UTILITIES
// ==============================================================================

/**
 * Type-safe object keys
 */
export function getTypedKeys<T extends Record<string, unknown>>(obj: T): Array<keyof T> {
  if (stryMutAct_9fa48("14819")) {
    {}
  } else {
    stryCov_9fa48("14819");
    return Object.keys(obj) as Array<keyof T>;
  }
}

/**
 * Type-safe object entries
 */
export function getTypedEntries<T extends Record<string, unknown>>(obj: T): Array<[keyof T, T[keyof T]]> {
  if (stryMutAct_9fa48("14820")) {
    {}
  } else {
    stryCov_9fa48("14820");
    return Object.entries(obj) as Array<[keyof T, T[keyof T]]>;
  }
}

/**
 * Pick properties with type safety
 */
export function pick<T, K extends keyof T>(obj: T, keys: readonly K[]): Pick<T, K> {
  if (stryMutAct_9fa48("14821")) {
    {}
  } else {
    stryCov_9fa48("14821");
    const result = {} as Pick<T, K>;
    for (const key of keys) {
      if (stryMutAct_9fa48("14822")) {
        {}
      } else {
        stryCov_9fa48("14822");
        if (stryMutAct_9fa48("14824") ? false : stryMutAct_9fa48("14823") ? true : (stryCov_9fa48("14823", "14824"), key in obj)) {
          if (stryMutAct_9fa48("14825")) {
            {}
          } else {
            stryCov_9fa48("14825");
            result[key] = obj[key];
          }
        }
      }
    }
    return result;
  }
}

/**
 * Omit properties with type safety
 */
export function omit<T, K extends keyof T>(obj: T, keys: readonly K[]): Omit<T, K> {
  if (stryMutAct_9fa48("14826")) {
    {}
  } else {
    stryCov_9fa48("14826");
    const result = stryMutAct_9fa48("14827") ? {} : (stryCov_9fa48("14827"), {
      ...obj
    });
    for (const key of keys) {
      if (stryMutAct_9fa48("14828")) {
        {}
      } else {
        stryCov_9fa48("14828");
        delete result[key];
      }
    }
    return result;
  }
}