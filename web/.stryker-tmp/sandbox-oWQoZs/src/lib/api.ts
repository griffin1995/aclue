/**
 * aclue API Client
 * 
 * Centralised HTTP client for all backend API communication.
 * Provides type-safe methods for authentication, data fetching,
 * and real-time interactions with the aclue backend.
 * 
 * Key Features:
 *   - Automatic JWT token management with refresh
 *   - Request/response interceptors for auth and error handling
 *   - Type-safe API methods with full TypeScript support
 *   - Automatic retry logic for failed requests
 *   - Comprehensive error handling and user feedback
 * 
 * Architecture:
 *   - TokenManager: Secure storage and management of JWT tokens
 *   - ApiClient: Main HTTP client with interceptors and methods
 *   - Convenience exports: Simplified API for common operations
 * 
 * Usage:
 *   import { api } from '@/lib/api';
 *   const user = await api.getCurrentUser();
 *   const products = await api.getProducts({ category: 'electronics' });
 */
// @ts-nocheck


// ==============================================================================
// IMPORTS AND DEPENDENCIES
// ==============================================================================
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
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { config, endpoints, appConfig } from '@/config';
import { ApiResponse, PaginatedResponse, ApiError, AuthResponse, LoginRequest, RegisterRequest, RefreshTokenRequest, User, Product, Category, SearchQuery, SearchResult, SwipeSession, SwipeRequest, SwipeInteraction, Recommendation, RecommendationRequest, RecommendationResponse, GiftLink, CreateGiftLinkRequest, GiftLinkInteraction, AnalyticsEvent } from '@/types';

// ==============================================================================
// TOKEN MANAGEMENT
// ==============================================================================
// Singleton class for secure JWT token storage and management

/**
 * Secure JWT token manager with localStorage persistence.
 * 
 * Manages access and refresh tokens for API authentication:
 *   - Singleton pattern ensures consistent token state
 *   - Automatic localStorage synchronisation
 *   - Secure token cleanup on logout
 *   - Server-side rendering safe (checks for window)
 * 
 * Token Lifecycle:
 *   1. Tokens received from authentication endpoints
 *   2. Stored in localStorage and memory
 *   3. Access token used for API requests
 *   4. Refresh token used to renew expired access tokens
 *   5. Cleared on logout or authentication errors
 */
class TokenManager {
  private static instance: TokenManager; // Singleton instance
  private accessToken: string | null = null; // In-memory access token cache
  private refreshToken: string | null = null; // In-memory refresh token cache

  /**
   * Get singleton TokenManager instance.
   * 
   * Creates new instance on first call and initialises tokens
   * from localStorage if available.
   * 
   * Returns:
   *   TokenManager: Singleton instance
   */
  static getInstance(): TokenManager {
    if (stryMutAct_9fa48("10605")) {
      {}
    } else {
      stryCov_9fa48("10605");
      if (stryMutAct_9fa48("10608") ? false : stryMutAct_9fa48("10607") ? true : stryMutAct_9fa48("10606") ? TokenManager.instance : (stryCov_9fa48("10606", "10607", "10608"), !TokenManager.instance)) {
        if (stryMutAct_9fa48("10609")) {
          {}
        } else {
          stryCov_9fa48("10609");
          TokenManager.instance = new TokenManager();
          // Initialize tokens from localStorage on first creation
          TokenManager.instance.initializeFromStorage();
        }
      }
      return TokenManager.instance;
    }
  }

  /**
   * Initialise tokens from localStorage on browser load.
   * 
   * Safely checks for browser environment and loads previously
   * stored tokens into memory cache.
   * 
   * Note: Only runs in browser environment (SSR safe)
   */
  private initializeFromStorage(): void {
    if (stryMutAct_9fa48("10610")) {
      {}
    } else {
      stryCov_9fa48("10610");
      if (stryMutAct_9fa48("10613") ? typeof window === 'undefined' : stryMutAct_9fa48("10612") ? false : stryMutAct_9fa48("10611") ? true : (stryCov_9fa48("10611", "10612", "10613"), typeof window !== (stryMutAct_9fa48("10614") ? "" : (stryCov_9fa48("10614"), 'undefined')))) {
        if (stryMutAct_9fa48("10615")) {
          {}
        } else {
          stryCov_9fa48("10615");
          this.accessToken = localStorage.getItem(appConfig.storage.authToken);
          this.refreshToken = localStorage.getItem(appConfig.storage.refreshToken);
        }
      }
    }
  }

  /**
   * Store new JWT tokens in memory and localStorage.
   * 
   * Updates both in-memory cache and persistent storage
   * for session continuity across browser reloads.
   * 
   * Parameters:
   *   accessToken: JWT access token for API requests
   *   refreshToken: JWT refresh token for session renewal
   */
  setTokens(accessToken: string, refreshToken: string): void {
    if (stryMutAct_9fa48("10616")) {
      {}
    } else {
      stryCov_9fa48("10616");
      this.accessToken = accessToken;
      this.refreshToken = refreshToken;

      // Persist to localStorage for session continuity
      if (stryMutAct_9fa48("10619") ? typeof window === 'undefined' : stryMutAct_9fa48("10618") ? false : stryMutAct_9fa48("10617") ? true : (stryCov_9fa48("10617", "10618", "10619"), typeof window !== (stryMutAct_9fa48("10620") ? "" : (stryCov_9fa48("10620"), 'undefined')))) {
        if (stryMutAct_9fa48("10621")) {
          {}
        } else {
          stryCov_9fa48("10621");
          localStorage.setItem(appConfig.storage.authToken, accessToken);
          localStorage.setItem(appConfig.storage.refreshToken, refreshToken);
        }
      }
    }
  }

  /**
   * Retrieve current access token for API requests.
   *
   * Checks memory cache first, then falls back to localStorage.
   * Returns null if no token is available.
   *
   * Returns:
   *   string | null: Current access token or null if not available
   */
  getAccessToken(): string | null {
    if (stryMutAct_9fa48("10622")) {
      {}
    } else {
      stryCov_9fa48("10622");
      // Return cached token if available
      if (stryMutAct_9fa48("10624") ? false : stryMutAct_9fa48("10623") ? true : (stryCov_9fa48("10623", "10624"), this.accessToken)) return this.accessToken;

      // Fallback to localStorage (handles page reloads)
      if (stryMutAct_9fa48("10627") ? typeof window === 'undefined' : stryMutAct_9fa48("10626") ? false : stryMutAct_9fa48("10625") ? true : (stryCov_9fa48("10625", "10626", "10627"), typeof window !== (stryMutAct_9fa48("10628") ? "" : (stryCov_9fa48("10628"), 'undefined')))) {
        if (stryMutAct_9fa48("10629")) {
          {}
        } else {
          stryCov_9fa48("10629");
          const token = localStorage.getItem(appConfig.storage.authToken);
          return stryMutAct_9fa48("10632") ? token && null : stryMutAct_9fa48("10631") ? false : stryMutAct_9fa48("10630") ? true : (stryCov_9fa48("10630", "10631", "10632"), token || null); // Ensure we return null instead of undefined
        }
      }
      return null;
    }
  }

  /**
   * Retrieve current refresh token for session renewal.
   *
   * Checks memory cache first, then falls back to localStorage.
   * Returns null if no token is available.
   *
   * Returns:
   *   string | null: Current refresh token or null if not available
   */
  getRefreshToken(): string | null {
    if (stryMutAct_9fa48("10633")) {
      {}
    } else {
      stryCov_9fa48("10633");
      // Return cached token if available
      if (stryMutAct_9fa48("10635") ? false : stryMutAct_9fa48("10634") ? true : (stryCov_9fa48("10634", "10635"), this.refreshToken)) return this.refreshToken;

      // Fallback to localStorage (handles page reloads)
      if (stryMutAct_9fa48("10638") ? typeof window === 'undefined' : stryMutAct_9fa48("10637") ? false : stryMutAct_9fa48("10636") ? true : (stryCov_9fa48("10636", "10637", "10638"), typeof window !== (stryMutAct_9fa48("10639") ? "" : (stryCov_9fa48("10639"), 'undefined')))) {
        if (stryMutAct_9fa48("10640")) {
          {}
        } else {
          stryCov_9fa48("10640");
          const token = localStorage.getItem(appConfig.storage.refreshToken);
          return stryMutAct_9fa48("10643") ? token && null : stryMutAct_9fa48("10642") ? false : stryMutAct_9fa48("10641") ? true : (stryCov_9fa48("10641", "10642", "10643"), token || null); // Ensure we return null instead of undefined
        }
      }
      return null;
    }
  }

  /**
   * Clear all stored tokens and user data.
   * 
   * Removes tokens from both memory and localStorage.
   * Called during logout or authentication errors.
   * 
   * Security:
   *   - Clears all authentication-related data
   *   - Prevents token reuse after logout
   *   - Ensures clean state for new authentication
   */
  clearTokens(): void {
    if (stryMutAct_9fa48("10644")) {
      {}
    } else {
      stryCov_9fa48("10644");
      // Clear memory cache
      this.accessToken = null;
      this.refreshToken = null;

      // Clear persistent storage
      if (stryMutAct_9fa48("10647") ? typeof window === 'undefined' : stryMutAct_9fa48("10646") ? false : stryMutAct_9fa48("10645") ? true : (stryCov_9fa48("10645", "10646", "10647"), typeof window !== (stryMutAct_9fa48("10648") ? "" : (stryCov_9fa48("10648"), 'undefined')))) {
        if (stryMutAct_9fa48("10649")) {
          {}
        } else {
          stryCov_9fa48("10649");
          localStorage.removeItem(appConfig.storage.authToken);
          localStorage.removeItem(appConfig.storage.refreshToken);
          localStorage.removeItem(appConfig.storage.user);
        }
      }
    }
  }
}

// ==============================================================================
// API CLIENT
// ==============================================================================
// Main HTTP client with authentication and error handling

/**
 * Comprehensive HTTP client for aclue API communication.
 * 
 * Features:
 *   - Automatic JWT token attachment to requests
 *   - Token refresh on 401 errors with request retry
 *   - Consistent error handling and user feedback
 *   - Request/response interceptors for common patterns
 *   - Type-safe methods for all API endpoints
 * 
 * Request Flow:
 *   1. Add Authorization header with current access token
 *   2. Send request to backend API
 *   3. Handle successful response or error
 *   4. On 401 error: refresh token and retry original request
 *   5. On refresh failure: clear tokens and redirect to login
 */
class ApiClient {
  private client: AxiosInstance; // Axios HTTP client instance
  private tokenManager: TokenManager; // Token storage and management
  private isRefreshing = stryMutAct_9fa48("10650") ? true : (stryCov_9fa48("10650"), false); // Flag to prevent concurrent refresh attempts
  private failedQueue: Array<{
    // Queue for requests waiting on token refresh
    resolve: (value: any) => void;
    reject: (error: any) => void;
  }> = stryMutAct_9fa48("10651") ? ["Stryker was here"] : (stryCov_9fa48("10651"), []);

  /**
   * Initialise API client with configuration and interceptors.
   * 
   * Sets up:
   *   - Base URL from configuration
   *   - Request/response timeouts
   *   - Default headers
   *   - Authentication and error interceptors
   */
  constructor() {
    if (stryMutAct_9fa48("10652")) {
      {}
    } else {
      stryCov_9fa48("10652");
      this.tokenManager = TokenManager.getInstance();

      // Create axios instance with base configuration
      this.client = axios.create(stryMutAct_9fa48("10653") ? {} : (stryCov_9fa48("10653"), {
        baseURL: config.apiUrl,
        // Backend API base URL
        timeout: 30000,
        // 30 second timeout for requests
        headers: stryMutAct_9fa48("10654") ? {} : (stryCov_9fa48("10654"), {
          'Content-Type': stryMutAct_9fa48("10655") ? "" : (stryCov_9fa48("10655"), 'application/json'),
          // JSON request body format
          'Accept': stryMutAct_9fa48("10656") ? "" : (stryCov_9fa48("10656"), 'application/json') // Expected response format
        })
      }));

      // Set up request/response interceptors
      this.setupInterceptors();
    }
  }

  /**
   * Set up request and response interceptors for authentication and error handling.
   * 
   * Request Interceptor:
   *   - Automatically adds Authorization header with current access token
   *   - Ensures all API requests are authenticated
   * 
   * Response Interceptor:
   *   - Handles 401 errors with automatic token refresh
   *   - Queues failed requests during refresh process
   *   - Retries original requests after successful refresh
   *   - Redirects to login on refresh failure
   */
  private setupInterceptors(): void {
    if (stryMutAct_9fa48("10657")) {
      {}
    } else {
      stryCov_9fa48("10657");
      // ===========================================================================
      // REQUEST INTERCEPTOR: Add authentication token to all requests
      // ===========================================================================
      this.client.interceptors.request.use(config => {
        if (stryMutAct_9fa48("10658")) {
          {}
        } else {
          stryCov_9fa48("10658");
          const token = this.tokenManager.getAccessToken();
          if (stryMutAct_9fa48("10661") ? token || config.headers : stryMutAct_9fa48("10660") ? false : stryMutAct_9fa48("10659") ? true : (stryCov_9fa48("10659", "10660", "10661"), token && config.headers)) {
            if (stryMutAct_9fa48("10662")) {
              {}
            } else {
              stryCov_9fa48("10662");
              // Add Bearer token to Authorization header
              config.headers.Authorization = stryMutAct_9fa48("10663") ? `` : (stryCov_9fa48("10663"), `Bearer ${token}`);
            }
          }
          return config;
        }
      }, stryMutAct_9fa48("10664") ? () => undefined : (stryCov_9fa48("10664"), error => Promise.reject(error)));

      // ===========================================================================
      // RESPONSE INTERCEPTOR: Handle authentication errors and token refresh
      // ===========================================================================
      this.client.interceptors.response.use(stryMutAct_9fa48("10665") ? () => undefined : (stryCov_9fa48("10665"), response => response),
      // Pass through successful responses
      async error => {
        if (stryMutAct_9fa48("10666")) {
          {}
        } else {
          stryCov_9fa48("10666");
          const originalRequest = error.config;

          // Handle 401 Unauthorized errors with automatic token refresh
          if (stryMutAct_9fa48("10669") ? error.response?.status === 401 || !originalRequest._retry : stryMutAct_9fa48("10668") ? false : stryMutAct_9fa48("10667") ? true : (stryCov_9fa48("10667", "10668", "10669"), (stryMutAct_9fa48("10671") ? error.response?.status !== 401 : stryMutAct_9fa48("10670") ? true : (stryCov_9fa48("10670", "10671"), (stryMutAct_9fa48("10672") ? error.response.status : (stryCov_9fa48("10672"), error.response?.status)) === 401)) && (stryMutAct_9fa48("10673") ? originalRequest._retry : (stryCov_9fa48("10673"), !originalRequest._retry)))) {
            if (stryMutAct_9fa48("10674")) {
              {}
            } else {
              stryCov_9fa48("10674");
              // If already refreshing, queue this request
              if (stryMutAct_9fa48("10676") ? false : stryMutAct_9fa48("10675") ? true : (stryCov_9fa48("10675", "10676"), this.isRefreshing)) {
                if (stryMutAct_9fa48("10677")) {
                  {}
                } else {
                  stryCov_9fa48("10677");
                  return new Promise((resolve, reject) => {
                    if (stryMutAct_9fa48("10678")) {
                      {}
                    } else {
                      stryCov_9fa48("10678");
                      this.failedQueue.push(stryMutAct_9fa48("10679") ? {} : (stryCov_9fa48("10679"), {
                        resolve,
                        reject
                      }));
                    }
                  }).then(token => {
                    if (stryMutAct_9fa48("10680")) {
                      {}
                    } else {
                      stryCov_9fa48("10680");
                      // Retry with new token
                      originalRequest.headers.Authorization = stryMutAct_9fa48("10681") ? `` : (stryCov_9fa48("10681"), `Bearer ${token}`);
                      return this.client(originalRequest);
                    }
                  }).catch(err => {
                    if (stryMutAct_9fa48("10682")) {
                      {}
                    } else {
                      stryCov_9fa48("10682");
                      return Promise.reject(err);
                    }
                  });
                }
              }

              // Mark request as retry to prevent infinite loops
              originalRequest._retry = stryMutAct_9fa48("10683") ? false : (stryCov_9fa48("10683"), true);
              this.isRefreshing = stryMutAct_9fa48("10684") ? false : (stryCov_9fa48("10684"), true);
              try {
                if (stryMutAct_9fa48("10685")) {
                  {}
                } else {
                  stryCov_9fa48("10685");
                  // Attempt to refresh the access token
                  const refreshToken = this.tokenManager.getRefreshToken();
                  if (stryMutAct_9fa48("10688") ? false : stryMutAct_9fa48("10687") ? true : stryMutAct_9fa48("10686") ? refreshToken : (stryCov_9fa48("10686", "10687", "10688"), !refreshToken)) {
                    if (stryMutAct_9fa48("10689")) {
                      {}
                    } else {
                      stryCov_9fa48("10689");
                      throw new Error(stryMutAct_9fa48("10690") ? "" : (stryCov_9fa48("10690"), 'No refresh token available'));
                    }
                  }

                  // Call refresh endpoint
                  const response = await this.refreshAccessToken(stryMutAct_9fa48("10691") ? {} : (stryCov_9fa48("10691"), {
                    refresh_token: refreshToken
                  }));
                  const {
                    access_token,
                    refresh_token: newRefreshToken
                  } = response.data;

                  // Store new tokens
                  this.tokenManager.setTokens(access_token, newRefreshToken);

                  // Process queued requests with new token
                  this.processQueue(access_token, null);

                  // Retry original request with new token
                  originalRequest.headers.Authorization = stryMutAct_9fa48("10692") ? `` : (stryCov_9fa48("10692"), `Bearer ${access_token}`);
                  return this.client(originalRequest);
                }
              } catch (refreshError) {
                if (stryMutAct_9fa48("10693")) {
                  {}
                } else {
                  stryCov_9fa48("10693");
                  // Refresh failed - clear tokens and redirect to login
                  this.processQueue(null, refreshError);
                  this.tokenManager.clearTokens();

                  // Redirect to login if we're in the browser
                  if (stryMutAct_9fa48("10696") ? typeof window === 'undefined' : stryMutAct_9fa48("10695") ? false : stryMutAct_9fa48("10694") ? true : (stryCov_9fa48("10694", "10695", "10696"), typeof window !== (stryMutAct_9fa48("10697") ? "" : (stryCov_9fa48("10697"), 'undefined')))) {
                    if (stryMutAct_9fa48("10698")) {
                      {}
                    } else {
                      stryCov_9fa48("10698");
                      window.location.href = stryMutAct_9fa48("10699") ? "" : (stryCov_9fa48("10699"), '/auth/login');
                    }
                  }
                  return Promise.reject(refreshError);
                }
              } finally {
                if (stryMutAct_9fa48("10700")) {
                  {}
                } else {
                  stryCov_9fa48("10700");
                  this.isRefreshing = stryMutAct_9fa48("10701") ? true : (stryCov_9fa48("10701"), false);
                }
              }
            }
          }

          // Handle other errors with consistent error formatting
          return Promise.reject(this.handleError(error));
        }
      });
    }
  }

  /**
   * Process queued requests after token refresh attempt.
   * 
   * During token refresh, multiple requests may fail with 401 errors.
   * These requests are queued and processed once refresh completes.
   * 
   * Parameters:
   *   token: New access token (null if refresh failed)
   *   error: Refresh error (null if refresh succeeded)
   */
  private processQueue(token: string | null, error: any): void {
    if (stryMutAct_9fa48("10702")) {
      {}
    } else {
      stryCov_9fa48("10702");
      this.failedQueue.forEach(({
        resolve,
        reject
      }) => {
        if (stryMutAct_9fa48("10703")) {
          {}
        } else {
          stryCov_9fa48("10703");
          if (stryMutAct_9fa48("10705") ? false : stryMutAct_9fa48("10704") ? true : (stryCov_9fa48("10704", "10705"), error)) {
            if (stryMutAct_9fa48("10706")) {
              {}
            } else {
              stryCov_9fa48("10706");
              // Refresh failed - reject all queued requests
              reject(error);
            }
          } else {
            if (stryMutAct_9fa48("10707")) {
              {}
            } else {
              stryCov_9fa48("10707");
              // Refresh succeeded - resolve with new token
              resolve(token);
            }
          }
        }
      });

      // Clear the queue
      this.failedQueue = stryMutAct_9fa48("10708") ? ["Stryker was here"] : (stryCov_9fa48("10708"), []);
    }
  }

  /**
   * Convert axios errors to standardised ApiError format.
   * 
   * Provides consistent error handling across all API methods
   * with user-friendly messages and debugging information.
   * 
   * Error Types:
   *   - Response errors: Server returned error status (400, 500, etc.)
   *   - Network errors: Request failed to reach server
   *   - Request errors: Invalid request configuration
   * 
   * Parameters:
   *   error: Axios error object
   * 
   * Returns:
   *   ApiError: Standardised error with message, code, and details
   */
  private handleError(error: any): ApiError {
    if (stryMutAct_9fa48("10709")) {
      {}
    } else {
      stryCov_9fa48("10709");
      const apiError: ApiError = stryMutAct_9fa48("10710") ? {} : (stryCov_9fa48("10710"), {
        message: appConfig.errors.unknown,
        code: stryMutAct_9fa48("10711") ? "" : (stryCov_9fa48("10711"), 'UNKNOWN_ERROR'),
        status: 500,
        timestamp: new Date().toISOString()
      });
      if (stryMutAct_9fa48("10713") ? false : stryMutAct_9fa48("10712") ? true : (stryCov_9fa48("10712", "10713"), error.response)) {
        if (stryMutAct_9fa48("10714")) {
          {}
        } else {
          stryCov_9fa48("10714");
          // Server responded with error status (4xx, 5xx)
          apiError.status = error.response.status;
          apiError.message = stryMutAct_9fa48("10717") ? error.response.data?.message && this.getErrorMessageByStatus(error.response.status) : stryMutAct_9fa48("10716") ? false : stryMutAct_9fa48("10715") ? true : (stryCov_9fa48("10715", "10716", "10717"), (stryMutAct_9fa48("10718") ? error.response.data.message : (stryCov_9fa48("10718"), error.response.data?.message)) || this.getErrorMessageByStatus(error.response.status));
          apiError.code = stryMutAct_9fa48("10721") ? error.response.data?.code && `HTTP_${error.response.status}` : stryMutAct_9fa48("10720") ? false : stryMutAct_9fa48("10719") ? true : (stryCov_9fa48("10719", "10720", "10721"), (stryMutAct_9fa48("10722") ? error.response.data.code : (stryCov_9fa48("10722"), error.response.data?.code)) || (stryMutAct_9fa48("10723") ? `` : (stryCov_9fa48("10723"), `HTTP_${error.response.status}`)));
          apiError.details = stryMutAct_9fa48("10724") ? error.response.data.details : (stryCov_9fa48("10724"), error.response.data?.details);
        }
      } else if (stryMutAct_9fa48("10726") ? false : stryMutAct_9fa48("10725") ? true : (stryCov_9fa48("10725", "10726"), error.request)) {
        if (stryMutAct_9fa48("10727")) {
          {}
        } else {
          stryCov_9fa48("10727");
          // Network error - request made but no response received
          apiError.message = appConfig.errors.network;
          apiError.code = stryMutAct_9fa48("10728") ? "" : (stryCov_9fa48("10728"), 'NETWORK_ERROR');
          apiError.status = 0;
        }
      } else {
        if (stryMutAct_9fa48("10729")) {
          {}
        } else {
          stryCov_9fa48("10729");
          // Request setup error - something wrong with request configuration
          apiError.message = stryMutAct_9fa48("10732") ? error.message && appConfig.errors.unknown : stryMutAct_9fa48("10731") ? false : stryMutAct_9fa48("10730") ? true : (stryCov_9fa48("10730", "10731", "10732"), error.message || appConfig.errors.unknown);
          apiError.code = stryMutAct_9fa48("10733") ? "" : (stryCov_9fa48("10733"), 'REQUEST_ERROR');
        }
      }
      return apiError;
    }
  }

  /**
   * Get user-friendly error message for HTTP status codes.
   * 
   * Maps common HTTP status codes to localised error messages
   * from application configuration.
   * 
   * Parameters:
   *   status: HTTP status code
   * 
   * Returns:
   *   string: User-friendly error message
   */
  private getErrorMessageByStatus(status: number): string {
    if (stryMutAct_9fa48("10734")) {
      {}
    } else {
      stryCov_9fa48("10734");
      switch (status) {
        case 400:
          if (stryMutAct_9fa48("10735")) {} else {
            stryCov_9fa48("10735");
            return appConfig.errors.validation;
          }
        // "Please check your input and try again"
        case 401:
          if (stryMutAct_9fa48("10736")) {} else {
            stryCov_9fa48("10736");
            return appConfig.errors.unauthorized;
          }
        // "Please log in to continue"
        case 403:
          if (stryMutAct_9fa48("10737")) {} else {
            stryCov_9fa48("10737");
            return appConfig.errors.forbidden;
          }
        // "You don't have permission to do this"
        case 404:
          if (stryMutAct_9fa48("10738")) {} else {
            stryCov_9fa48("10738");
            return appConfig.errors.notFound;
          }
        // "The requested item was not found"
        case 500:
          if (stryMutAct_9fa48("10739")) {} else {
            stryCov_9fa48("10739");
            return appConfig.errors.server;
          }
        // "Something went wrong on our end"
        default:
          if (stryMutAct_9fa48("10740")) {} else {
            stryCov_9fa48("10740");
            return appConfig.errors.unknown;
          }
        // "An unexpected error occurred"
      }
    }
  }

  // Generic request methods
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (stryMutAct_9fa48("10741")) {
      {}
    } else {
      stryCov_9fa48("10741");
      const response: AxiosResponse<any> = await this.client.get(url, config);
      // Handle direct response from backend (not wrapped in ApiResponse)
      if (stryMutAct_9fa48("10744") ? response.data || !response.data.hasOwnProperty('data') : stryMutAct_9fa48("10743") ? false : stryMutAct_9fa48("10742") ? true : (stryCov_9fa48("10742", "10743", "10744"), response.data && (stryMutAct_9fa48("10745") ? response.data.hasOwnProperty('data') : (stryCov_9fa48("10745"), !response.data.hasOwnProperty(stryMutAct_9fa48("10746") ? "" : (stryCov_9fa48("10746"), 'data')))))) {
        if (stryMutAct_9fa48("10747")) {
          {}
        } else {
          stryCov_9fa48("10747");
          return stryMutAct_9fa48("10748") ? {} : (stryCov_9fa48("10748"), {
            data: response.data,
            success: stryMutAct_9fa48("10749") ? false : (stryCov_9fa48("10749"), true)
          });
        }
      }
      return response.data;
    }
  }
  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (stryMutAct_9fa48("10750")) {
      {}
    } else {
      stryCov_9fa48("10750");
      const response: AxiosResponse<any> = await this.client.post(url, data, config);
      // Handle direct response from backend (not wrapped in ApiResponse)
      if (stryMutAct_9fa48("10753") ? response.data || !response.data.hasOwnProperty('data') : stryMutAct_9fa48("10752") ? false : stryMutAct_9fa48("10751") ? true : (stryCov_9fa48("10751", "10752", "10753"), response.data && (stryMutAct_9fa48("10754") ? response.data.hasOwnProperty('data') : (stryCov_9fa48("10754"), !response.data.hasOwnProperty(stryMutAct_9fa48("10755") ? "" : (stryCov_9fa48("10755"), 'data')))))) {
        if (stryMutAct_9fa48("10756")) {
          {}
        } else {
          stryCov_9fa48("10756");
          return stryMutAct_9fa48("10757") ? {} : (stryCov_9fa48("10757"), {
            data: response.data,
            success: stryMutAct_9fa48("10758") ? false : (stryCov_9fa48("10758"), true)
          });
        }
      }
      return response.data;
    }
  }
  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (stryMutAct_9fa48("10759")) {
      {}
    } else {
      stryCov_9fa48("10759");
      const response: AxiosResponse<ApiResponse<T>> = await this.client.put(url, data, config);
      return response.data;
    }
  }
  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (stryMutAct_9fa48("10760")) {
      {}
    } else {
      stryCov_9fa48("10760");
      const response: AxiosResponse<ApiResponse<T>> = await this.client.patch(url, data, config);
      return response.data;
    }
  }
  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    if (stryMutAct_9fa48("10761")) {
      {}
    } else {
      stryCov_9fa48("10761");
      const response: AxiosResponse<ApiResponse<T>> = await this.client.delete(url, config);
      return response.data;
    }
  }

  // Authentication methods
  async login(data: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    if (stryMutAct_9fa48("10762")) {
      {}
    } else {
      stryCov_9fa48("10762");
      return this.post<AuthResponse>(endpoints.auth.login, data);
    }
  }
  async register(data: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    if (stryMutAct_9fa48("10763")) {
      {}
    } else {
      stryCov_9fa48("10763");
      return this.post<AuthResponse>(endpoints.auth.register, data);
    }
  }
  async refreshAccessToken(data: RefreshTokenRequest): Promise<ApiResponse<AuthResponse>> {
    if (stryMutAct_9fa48("10764")) {
      {}
    } else {
      stryCov_9fa48("10764");
      return this.post<AuthResponse>(endpoints.auth.refresh, data);
    }
  }
  async logout(): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10765")) {
      {}
    } else {
      stryCov_9fa48("10765");
      const response = await this.post<void>(endpoints.auth.logout);
      this.tokenManager.clearTokens();
      return response;
    }
  }
  async getCurrentUser(): Promise<ApiResponse<User>> {
    if (stryMutAct_9fa48("10766")) {
      {}
    } else {
      stryCov_9fa48("10766");
      return this.get<User>(endpoints.auth.me);
    }
  }
  async forgotPassword(email: string): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10767")) {
      {}
    } else {
      stryCov_9fa48("10767");
      return this.post<void>(endpoints.auth.forgotPassword, stryMutAct_9fa48("10768") ? {} : (stryCov_9fa48("10768"), {
        email
      }));
    }
  }
  async resetPassword(token: string, password: string): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10769")) {
      {}
    } else {
      stryCov_9fa48("10769");
      return this.post<void>(endpoints.auth.resetPassword, stryMutAct_9fa48("10770") ? {} : (stryCov_9fa48("10770"), {
        token,
        password
      }));
    }
  }
  async verifyEmail(token: string): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10771")) {
      {}
    } else {
      stryCov_9fa48("10771");
      return this.post<void>(endpoints.auth.verifyEmail, stryMutAct_9fa48("10772") ? {} : (stryCov_9fa48("10772"), {
        token
      }));
    }
  }

  // User methods
  async updateProfile(data: Partial<User>): Promise<ApiResponse<User>> {
    if (stryMutAct_9fa48("10773")) {
      {}
    } else {
      stryCov_9fa48("10773");
      return this.put<User>(endpoints.users.updateProfile, data);
    }
  }
  async getUserPreferences(): Promise<ApiResponse<any>> {
    if (stryMutAct_9fa48("10774")) {
      {}
    } else {
      stryCov_9fa48("10774");
      return this.get(endpoints.users.preferences);
    }
  }
  async updateUserPreferences(data: any): Promise<ApiResponse<any>> {
    if (stryMutAct_9fa48("10775")) {
      {}
    } else {
      stryCov_9fa48("10775");
      return this.put(endpoints.users.preferences, data);
    }
  }
  async getUserStatistics(): Promise<ApiResponse<any>> {
    if (stryMutAct_9fa48("10776")) {
      {}
    } else {
      stryCov_9fa48("10776");
      return this.get(endpoints.users.statistics);
    }
  }
  async deleteAccount(): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10777")) {
      {}
    } else {
      stryCov_9fa48("10777");
      return this.delete<void>(endpoints.users.deleteAccount);
    }
  }

  // Product methods
  async getProducts(params?: any): Promise<ApiResponse<Product[]>> {
    if (stryMutAct_9fa48("10778")) {
      {}
    } else {
      stryCov_9fa48("10778");
      return this.get<Product[]>(endpoints.products.list, stryMutAct_9fa48("10779") ? {} : (stryCov_9fa48("10779"), {
        params
      }));
    }
  }
  async searchProducts(query: SearchQuery): Promise<ApiResponse<SearchResult>> {
    if (stryMutAct_9fa48("10780")) {
      {}
    } else {
      stryCov_9fa48("10780");
      return this.post<SearchResult>(endpoints.products.search, query);
    }
  }
  async getProduct(id: string): Promise<ApiResponse<Product>> {
    if (stryMutAct_9fa48("10781")) {
      {}
    } else {
      stryCov_9fa48("10781");
      return this.get<Product>(endpoints.products.byId(id));
    }
  }
  async getCategories(): Promise<ApiResponse<Category[]>> {
    if (stryMutAct_9fa48("10782")) {
      {}
    } else {
      stryCov_9fa48("10782");
      return this.get<Category[]>(endpoints.products.categories);
    }
  }
  async getFeaturedProducts(): Promise<ApiResponse<Product[]>> {
    if (stryMutAct_9fa48("10783")) {
      {}
    } else {
      stryCov_9fa48("10783");
      return this.get<Product[]>(endpoints.products.featured);
    }
  }
  async getTrendingProducts(): Promise<ApiResponse<Product[]>> {
    if (stryMutAct_9fa48("10784")) {
      {}
    } else {
      stryCov_9fa48("10784");
      return this.get<Product[]>(endpoints.products.trending);
    }
  }
  async getProductsByCategory(categoryId: string, params?: any): Promise<PaginatedResponse<Product>> {
    if (stryMutAct_9fa48("10785")) {
      {}
    } else {
      stryCov_9fa48("10785");
      return this.get<Product[]>(endpoints.products.byCategory(categoryId), stryMutAct_9fa48("10786") ? {} : (stryCov_9fa48("10786"), {
        params
      }));
    }
  }

  // Swipe methods
  async createSwipeSession(data: any): Promise<ApiResponse<SwipeSession>> {
    if (stryMutAct_9fa48("10787")) {
      {}
    } else {
      stryCov_9fa48("10787");
      return this.post<SwipeSession>(endpoints.swipes.createSession, data);
    }
  }
  async getCurrentSwipeSession(): Promise<ApiResponse<SwipeSession>> {
    if (stryMutAct_9fa48("10788")) {
      {}
    } else {
      stryCov_9fa48("10788");
      return this.get<SwipeSession>(endpoints.swipes.currentSession);
    }
  }
  async recordSwipe(sessionId: string, data: SwipeRequest): Promise<ApiResponse<SwipeInteraction>> {
    if (stryMutAct_9fa48("10789")) {
      {}
    } else {
      stryCov_9fa48("10789");
      return this.post<SwipeInteraction>(endpoints.swipes.interactions(sessionId), data);
    }
  }
  async getSwipeAnalytics(): Promise<ApiResponse<any>> {
    if (stryMutAct_9fa48("10790")) {
      {}
    } else {
      stryCov_9fa48("10790");
      return this.get(endpoints.swipes.analytics);
    }
  }

  // Recommendation methods
  async generateRecommendations(data: RecommendationRequest): Promise<ApiResponse<RecommendationResponse>> {
    if (stryMutAct_9fa48("10791")) {
      {}
    } else {
      stryCov_9fa48("10791");
      return this.post<RecommendationResponse>(endpoints.recommendations.generate, data);
    }
  }
  async getRecommendations(params?: any): Promise<PaginatedResponse<Recommendation>> {
    if (stryMutAct_9fa48("10792")) {
      {}
    } else {
      stryCov_9fa48("10792");
      return this.get<Recommendation[]>(endpoints.recommendations.list, stryMutAct_9fa48("10793") ? {} : (stryCov_9fa48("10793"), {
        params
      }));
    }
  }
  async getRecommendation(id: string): Promise<ApiResponse<Recommendation>> {
    if (stryMutAct_9fa48("10794")) {
      {}
    } else {
      stryCov_9fa48("10794");
      return this.get<Recommendation>(endpoints.recommendations.byId(id));
    }
  }
  async provideFeedback(id: string, feedback: any): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10795")) {
      {}
    } else {
      stryCov_9fa48("10795");
      return this.post<void>(endpoints.recommendations.feedback(id), feedback);
    }
  }
  async refreshRecommendations(): Promise<ApiResponse<RecommendationResponse>> {
    if (stryMutAct_9fa48("10796")) {
      {}
    } else {
      stryCov_9fa48("10796");
      return this.post<RecommendationResponse>(endpoints.recommendations.refresh);
    }
  }

  // Gift Link methods
  async createGiftLink(data: CreateGiftLinkRequest): Promise<ApiResponse<GiftLink>> {
    if (stryMutAct_9fa48("10797")) {
      {}
    } else {
      stryCov_9fa48("10797");
      return this.post<GiftLink>(endpoints.giftLinks.create, data);
    }
  }
  async getGiftLinks(): Promise<ApiResponse<GiftLink[]>> {
    if (stryMutAct_9fa48("10798")) {
      {}
    } else {
      stryCov_9fa48("10798");
      return this.get<GiftLink[]>(endpoints.giftLinks.list);
    }
  }
  async getGiftLink(id: string): Promise<ApiResponse<GiftLink>> {
    if (stryMutAct_9fa48("10799")) {
      {}
    } else {
      stryCov_9fa48("10799");
      return this.get<GiftLink>(endpoints.giftLinks.byId(id));
    }
  }
  async getGiftLinkByToken(token: string): Promise<ApiResponse<GiftLink>> {
    if (stryMutAct_9fa48("10800")) {
      {}
    } else {
      stryCov_9fa48("10800");
      return this.get<GiftLink>(endpoints.giftLinks.byToken(token));
    }
  }
  async deleteGiftLink(id: string): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10801")) {
      {}
    } else {
      stryCov_9fa48("10801");
      return this.delete<void>(endpoints.giftLinks.delete(id));
    }
  }
  async getGiftLinkAnalytics(id: string): Promise<ApiResponse<GiftLinkInteraction[]>> {
    if (stryMutAct_9fa48("10802")) {
      {}
    } else {
      stryCov_9fa48("10802");
      return this.get<GiftLinkInteraction[]>(endpoints.giftLinks.analytics(id));
    }
  }

  // Analytics methods
  async trackEvent(event: AnalyticsEvent): Promise<ApiResponse<void>> {
    if (stryMutAct_9fa48("10803")) {
      {}
    } else {
      stryCov_9fa48("10803");
      return this.post<void>(endpoints.analytics.track, event);
    }
  }
  async getAnalyticsDashboard(): Promise<ApiResponse<any>> {
    if (stryMutAct_9fa48("10804")) {
      {}
    } else {
      stryCov_9fa48("10804");
      return this.get(endpoints.analytics.dashboard);
    }
  }

  // Health check
  async healthCheck(): Promise<ApiResponse<any>> {
    if (stryMutAct_9fa48("10805")) {
      {}
    } else {
      stryCov_9fa48("10805");
      return this.get(endpoints.health);
    }
  }
}

// Create and export API client instance
export const apiClient = new ApiClient();

// Export token manager for external use
export const tokenManager = TokenManager.getInstance();

// Export convenience methods with nested structure for better organisation
export const api = stryMutAct_9fa48("10806") ? {} : (stryCov_9fa48("10806"), {
  // Authentication methods
  auth: stryMutAct_9fa48("10807") ? {} : (stryCov_9fa48("10807"), {
    login: stryMutAct_9fa48("10808") ? () => undefined : (stryCov_9fa48("10808"), (data: LoginRequest) => apiClient.login(data)),
    register: stryMutAct_9fa48("10809") ? () => undefined : (stryCov_9fa48("10809"), (data: RegisterRequest) => apiClient.register(data)),
    logout: stryMutAct_9fa48("10810") ? () => undefined : (stryCov_9fa48("10810"), () => apiClient.logout()),
    getCurrentUser: stryMutAct_9fa48("10811") ? () => undefined : (stryCov_9fa48("10811"), () => apiClient.getCurrentUser()),
    refresh: stryMutAct_9fa48("10812") ? () => undefined : (stryCov_9fa48("10812"), (data: RefreshTokenRequest) => apiClient.refreshAccessToken(data)),
    forgotPassword: stryMutAct_9fa48("10813") ? () => undefined : (stryCov_9fa48("10813"), (email: string) => apiClient.forgotPassword(email)),
    resetPassword: stryMutAct_9fa48("10814") ? () => undefined : (stryCov_9fa48("10814"), (token: string, password: string) => apiClient.resetPassword(token, password)),
    verifyEmail: stryMutAct_9fa48("10815") ? () => undefined : (stryCov_9fa48("10815"), (token: string) => apiClient.verifyEmail(token))
  }),
  // User management methods
  users: stryMutAct_9fa48("10816") ? {} : (stryCov_9fa48("10816"), {
    updateProfile: stryMutAct_9fa48("10817") ? () => undefined : (stryCov_9fa48("10817"), (data: Partial<User>) => apiClient.updateProfile(data)),
    getPreferences: stryMutAct_9fa48("10818") ? () => undefined : (stryCov_9fa48("10818"), () => apiClient.getUserPreferences()),
    updatePreferences: stryMutAct_9fa48("10819") ? () => undefined : (stryCov_9fa48("10819"), (data: any) => apiClient.updateUserPreferences(data)),
    getStatistics: stryMutAct_9fa48("10820") ? () => undefined : (stryCov_9fa48("10820"), () => apiClient.getUserStatistics()),
    deleteAccount: stryMutAct_9fa48("10821") ? () => undefined : (stryCov_9fa48("10821"), () => apiClient.deleteAccount())
  }),
  // Product methods
  products: stryMutAct_9fa48("10822") ? {} : (stryCov_9fa48("10822"), {
    getProducts: stryMutAct_9fa48("10823") ? () => undefined : (stryCov_9fa48("10823"), (params?: any) => apiClient.getProducts(params)),
    searchProducts: stryMutAct_9fa48("10824") ? () => undefined : (stryCov_9fa48("10824"), (query: SearchQuery) => apiClient.searchProducts(query)),
    getProduct: stryMutAct_9fa48("10825") ? () => undefined : (stryCov_9fa48("10825"), (id: string) => apiClient.getProduct(id)),
    getCategories: stryMutAct_9fa48("10826") ? () => undefined : (stryCov_9fa48("10826"), () => apiClient.getCategories()),
    getFeatured: stryMutAct_9fa48("10827") ? () => undefined : (stryCov_9fa48("10827"), () => apiClient.getFeaturedProducts()),
    getTrending: stryMutAct_9fa48("10828") ? () => undefined : (stryCov_9fa48("10828"), () => apiClient.getTrendingProducts()),
    getByCategory: stryMutAct_9fa48("10829") ? () => undefined : (stryCov_9fa48("10829"), (categoryId: string, params?: any) => apiClient.getProductsByCategory(categoryId, params))
  }),
  // Swipe methods
  swipes: stryMutAct_9fa48("10830") ? {} : (stryCov_9fa48("10830"), {
    createSession: stryMutAct_9fa48("10831") ? () => undefined : (stryCov_9fa48("10831"), (data: any) => apiClient.createSwipeSession(data)),
    getCurrentSession: stryMutAct_9fa48("10832") ? () => undefined : (stryCov_9fa48("10832"), () => apiClient.getCurrentSwipeSession()),
    recordSwipe: stryMutAct_9fa48("10833") ? () => undefined : (stryCov_9fa48("10833"), (sessionId: string, data: SwipeRequest) => apiClient.recordSwipe(sessionId, data)),
    getAnalytics: stryMutAct_9fa48("10834") ? () => undefined : (stryCov_9fa48("10834"), () => apiClient.getSwipeAnalytics()),
    // Alternative method names for backward compatibility
    startSession: stryMutAct_9fa48("10835") ? () => undefined : (stryCov_9fa48("10835"), (data: any) => apiClient.createSwipeSession(data))
  }),
  // Recommendation methods
  recommendations: stryMutAct_9fa48("10836") ? {} : (stryCov_9fa48("10836"), {
    generate: stryMutAct_9fa48("10837") ? () => undefined : (stryCov_9fa48("10837"), (data: RecommendationRequest) => apiClient.generateRecommendations(data)),
    getRecommendations: stryMutAct_9fa48("10838") ? () => undefined : (stryCov_9fa48("10838"), (params?: any) => apiClient.getRecommendations(params)),
    getRecommendation: stryMutAct_9fa48("10839") ? () => undefined : (stryCov_9fa48("10839"), (id: string) => apiClient.getRecommendation(id)),
    provideFeedback: stryMutAct_9fa48("10840") ? () => undefined : (stryCov_9fa48("10840"), (id: string, feedback: any) => apiClient.provideFeedback(id, feedback)),
    refresh: stryMutAct_9fa48("10841") ? () => undefined : (stryCov_9fa48("10841"), () => apiClient.refreshRecommendations()),
    // Alternative method name for compatibility with tests
    createRecommendationRequest: stryMutAct_9fa48("10842") ? () => undefined : (stryCov_9fa48("10842"), (data: RecommendationRequest) => apiClient.generateRecommendations(data))
  }),
  // Gift Link methods
  giftLinks: stryMutAct_9fa48("10843") ? {} : (stryCov_9fa48("10843"), {
    create: stryMutAct_9fa48("10844") ? () => undefined : (stryCov_9fa48("10844"), (data: CreateGiftLinkRequest) => apiClient.createGiftLink(data)),
    getAll: stryMutAct_9fa48("10845") ? () => undefined : (stryCov_9fa48("10845"), () => apiClient.getGiftLinks()),
    getById: stryMutAct_9fa48("10846") ? () => undefined : (stryCov_9fa48("10846"), (id: string) => apiClient.getGiftLink(id)),
    getByToken: stryMutAct_9fa48("10847") ? () => undefined : (stryCov_9fa48("10847"), (token: string) => apiClient.getGiftLinkByToken(token)),
    delete: stryMutAct_9fa48("10848") ? () => undefined : (stryCov_9fa48("10848"), (id: string) => apiClient.deleteGiftLink(id)),
    getAnalytics: stryMutAct_9fa48("10849") ? () => undefined : (stryCov_9fa48("10849"), (id: string) => apiClient.getGiftLinkAnalytics(id))
  }),
  // Analytics methods
  analytics: stryMutAct_9fa48("10850") ? {} : (stryCov_9fa48("10850"), {
    trackEvent: stryMutAct_9fa48("10851") ? () => undefined : (stryCov_9fa48("10851"), (event: AnalyticsEvent) => apiClient.trackEvent(event)),
    getDashboard: stryMutAct_9fa48("10852") ? () => undefined : (stryCov_9fa48("10852"), () => apiClient.getAnalyticsDashboard())
  }),
  // Health check
  health: stryMutAct_9fa48("10853") ? () => undefined : (stryCov_9fa48("10853"), () => apiClient.healthCheck())
});
export default apiClient;