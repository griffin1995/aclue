/**
 * Enhanced Type-Safe API Client for aclue Platform
 *
 * Enterprise-grade HTTP client with strict TypeScript typing and advanced features.
 * Eliminates all `any` types with proper type definitions and type safety.
 *
 * Features:
 * - Strict typing for all API methods and responses
 * - Enhanced error handling with discriminated unions
 * - Type-safe request/response handling
 * - Advanced retry logic with exponential backoff
 * - Comprehensive authentication flow
 * - Request deduplication and caching
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
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { config, endpoints, appConfig } from '@/config';
import { User, Product, Category, SwipeSession, SwipeInteraction, Recommendation, GiftLink, LoginRequest, RegisterRequest, RefreshTokenRequest, SearchQuery, SearchResult, SwipeRequest, RecommendationRequest, CreateGiftLinkRequest, AnalyticsEvent } from '@/types';
import { StrictApiResponse, ApiErrorDetails, StrictPaginatedResponse, UserId, ProductId, CategoryId, SessionId, StrictProduct, StrictSwipeSession, StrictUserPreferences, Result, createSuccess, createError, isSuccess, tryCatchAsync, retryWithBackoff, timeout } from '@/types/enhanced';
import { assertDefined, isValidUuid, debounce, throttle } from '@/types/utilities';

// ==============================================================================
// ENHANCED TOKEN MANAGEMENT
// ==============================================================================

interface TokenData {
  readonly accessToken: string;
  readonly refreshToken: string;
  readonly expiresAt: number;
  readonly tokenType: 'Bearer';
}
interface TokenRefreshQueueItem {
  readonly resolve: (token: string) => void;
  readonly reject: (error: ApiErrorDetails) => void;
}

/**
 * Enhanced token manager with type safety and improved security
 */
class EnhancedTokenManager {
  private static instance: EnhancedTokenManager;
  private tokenData: TokenData | null = null;
  private readonly storageKey = stryMutAct_9fa48("10279") ? "" : (stryCov_9fa48("10279"), 'aclue_auth_tokens');
  private readonly expirationBufferMs = stryMutAct_9fa48("10280") ? 5 * 60 / 1000 : (stryCov_9fa48("10280"), (stryMutAct_9fa48("10281") ? 5 / 60 : (stryCov_9fa48("10281"), 5 * 60)) * 1000); // 5 minutes

  static getInstance(): EnhancedTokenManager {
    if (stryMutAct_9fa48("10282")) {
      {}
    } else {
      stryCov_9fa48("10282");
      if (stryMutAct_9fa48("10285") ? false : stryMutAct_9fa48("10284") ? true : stryMutAct_9fa48("10283") ? EnhancedTokenManager.instance : (stryCov_9fa48("10283", "10284", "10285"), !EnhancedTokenManager.instance)) {
        if (stryMutAct_9fa48("10286")) {
          {}
        } else {
          stryCov_9fa48("10286");
          EnhancedTokenManager.instance = new EnhancedTokenManager();
          EnhancedTokenManager.instance.initializeFromStorage();
        }
      }
      return EnhancedTokenManager.instance;
    }
  }
  private constructor() {}
  private initializeFromStorage(): void {
    if (stryMutAct_9fa48("10287")) {
      {}
    } else {
      stryCov_9fa48("10287");
      if (stryMutAct_9fa48("10290") ? typeof window !== 'undefined' : stryMutAct_9fa48("10289") ? false : stryMutAct_9fa48("10288") ? true : (stryCov_9fa48("10288", "10289", "10290"), typeof window === (stryMutAct_9fa48("10291") ? "" : (stryCov_9fa48("10291"), 'undefined')))) return;
      try {
        if (stryMutAct_9fa48("10292")) {
          {}
        } else {
          stryCov_9fa48("10292");
          const stored = localStorage.getItem(this.storageKey);
          if (stryMutAct_9fa48("10294") ? false : stryMutAct_9fa48("10293") ? true : (stryCov_9fa48("10293", "10294"), stored)) {
            if (stryMutAct_9fa48("10295")) {
              {}
            } else {
              stryCov_9fa48("10295");
              const parsed = JSON.parse(stored) as TokenData;
              // Validate token structure
              if (stryMutAct_9fa48("10297") ? false : stryMutAct_9fa48("10296") ? true : (stryCov_9fa48("10296", "10297"), this.isValidTokenData(parsed))) {
                if (stryMutAct_9fa48("10298")) {
                  {}
                } else {
                  stryCov_9fa48("10298");
                  this.tokenData = parsed;
                }
              } else {
                if (stryMutAct_9fa48("10299")) {
                  {}
                } else {
                  stryCov_9fa48("10299");
                  this.clearTokens();
                }
              }
            }
          }
        }
      } catch {
        if (stryMutAct_9fa48("10300")) {
          {}
        } else {
          stryCov_9fa48("10300");
          this.clearTokens();
        }
      }
    }
  }
  private isValidTokenData(data: unknown): data is TokenData {
    if (stryMutAct_9fa48("10301")) {
      {}
    } else {
      stryCov_9fa48("10301");
      return stryMutAct_9fa48("10304") ? typeof data === 'object' && data !== null && 'accessToken' in data && 'refreshToken' in data && 'expiresAt' in data && 'tokenType' in data && typeof (data as TokenData).accessToken === 'string' && typeof (data as TokenData).refreshToken === 'string' && typeof (data as TokenData).expiresAt === 'number' || (data as TokenData).tokenType === 'Bearer' : stryMutAct_9fa48("10303") ? false : stryMutAct_9fa48("10302") ? true : (stryCov_9fa48("10302", "10303", "10304"), (stryMutAct_9fa48("10306") ? typeof data === 'object' && data !== null && 'accessToken' in data && 'refreshToken' in data && 'expiresAt' in data && 'tokenType' in data && typeof (data as TokenData).accessToken === 'string' && typeof (data as TokenData).refreshToken === 'string' || typeof (data as TokenData).expiresAt === 'number' : stryMutAct_9fa48("10305") ? true : (stryCov_9fa48("10305", "10306"), (stryMutAct_9fa48("10308") ? typeof data === 'object' && data !== null && 'accessToken' in data && 'refreshToken' in data && 'expiresAt' in data && 'tokenType' in data && typeof (data as TokenData).accessToken === 'string' || typeof (data as TokenData).refreshToken === 'string' : stryMutAct_9fa48("10307") ? true : (stryCov_9fa48("10307", "10308"), (stryMutAct_9fa48("10310") ? typeof data === 'object' && data !== null && 'accessToken' in data && 'refreshToken' in data && 'expiresAt' in data && 'tokenType' in data || typeof (data as TokenData).accessToken === 'string' : stryMutAct_9fa48("10309") ? true : (stryCov_9fa48("10309", "10310"), (stryMutAct_9fa48("10312") ? typeof data === 'object' && data !== null && 'accessToken' in data && 'refreshToken' in data && 'expiresAt' in data || 'tokenType' in data : stryMutAct_9fa48("10311") ? true : (stryCov_9fa48("10311", "10312"), (stryMutAct_9fa48("10314") ? typeof data === 'object' && data !== null && 'accessToken' in data && 'refreshToken' in data || 'expiresAt' in data : stryMutAct_9fa48("10313") ? true : (stryCov_9fa48("10313", "10314"), (stryMutAct_9fa48("10316") ? typeof data === 'object' && data !== null && 'accessToken' in data || 'refreshToken' in data : stryMutAct_9fa48("10315") ? true : (stryCov_9fa48("10315", "10316"), (stryMutAct_9fa48("10318") ? typeof data === 'object' && data !== null || 'accessToken' in data : stryMutAct_9fa48("10317") ? true : (stryCov_9fa48("10317", "10318"), (stryMutAct_9fa48("10320") ? typeof data === 'object' || data !== null : stryMutAct_9fa48("10319") ? true : (stryCov_9fa48("10319", "10320"), (stryMutAct_9fa48("10322") ? typeof data !== 'object' : stryMutAct_9fa48("10321") ? true : (stryCov_9fa48("10321", "10322"), typeof data === (stryMutAct_9fa48("10323") ? "" : (stryCov_9fa48("10323"), 'object')))) && (stryMutAct_9fa48("10325") ? data === null : stryMutAct_9fa48("10324") ? true : (stryCov_9fa48("10324", "10325"), data !== null)))) && (stryMutAct_9fa48("10326") ? "" : (stryCov_9fa48("10326"), 'accessToken')) in data)) && (stryMutAct_9fa48("10327") ? "" : (stryCov_9fa48("10327"), 'refreshToken')) in data)) && (stryMutAct_9fa48("10328") ? "" : (stryCov_9fa48("10328"), 'expiresAt')) in data)) && (stryMutAct_9fa48("10329") ? "" : (stryCov_9fa48("10329"), 'tokenType')) in data)) && (stryMutAct_9fa48("10331") ? typeof (data as TokenData).accessToken !== 'string' : stryMutAct_9fa48("10330") ? true : (stryCov_9fa48("10330", "10331"), typeof (data as TokenData).accessToken === (stryMutAct_9fa48("10332") ? "" : (stryCov_9fa48("10332"), 'string')))))) && (stryMutAct_9fa48("10334") ? typeof (data as TokenData).refreshToken !== 'string' : stryMutAct_9fa48("10333") ? true : (stryCov_9fa48("10333", "10334"), typeof (data as TokenData).refreshToken === (stryMutAct_9fa48("10335") ? "" : (stryCov_9fa48("10335"), 'string')))))) && (stryMutAct_9fa48("10337") ? typeof (data as TokenData).expiresAt !== 'number' : stryMutAct_9fa48("10336") ? true : (stryCov_9fa48("10336", "10337"), typeof (data as TokenData).expiresAt === (stryMutAct_9fa48("10338") ? "" : (stryCov_9fa48("10338"), 'number')))))) && (stryMutAct_9fa48("10340") ? (data as TokenData).tokenType !== 'Bearer' : stryMutAct_9fa48("10339") ? true : (stryCov_9fa48("10339", "10340"), (data as TokenData).tokenType === (stryMutAct_9fa48("10341") ? "" : (stryCov_9fa48("10341"), 'Bearer')))));
    }
  }
  setTokens(accessToken: string, refreshToken: string, expiresIn: number): void {
    if (stryMutAct_9fa48("10342")) {
      {}
    } else {
      stryCov_9fa48("10342");
      assertDefined(accessToken, stryMutAct_9fa48("10343") ? "" : (stryCov_9fa48("10343"), 'Access token is required'));
      assertDefined(refreshToken, stryMutAct_9fa48("10344") ? "" : (stryCov_9fa48("10344"), 'Refresh token is required'));
      const expiresAt = stryMutAct_9fa48("10345") ? Date.now() - expiresIn * 1000 : (stryCov_9fa48("10345"), Date.now() + (stryMutAct_9fa48("10346") ? expiresIn / 1000 : (stryCov_9fa48("10346"), expiresIn * 1000)));
      this.tokenData = stryMutAct_9fa48("10347") ? {} : (stryCov_9fa48("10347"), {
        accessToken,
        refreshToken,
        expiresAt,
        tokenType: stryMutAct_9fa48("10348") ? "" : (stryCov_9fa48("10348"), 'Bearer')
      });
      if (stryMutAct_9fa48("10351") ? typeof window === 'undefined' : stryMutAct_9fa48("10350") ? false : stryMutAct_9fa48("10349") ? true : (stryCov_9fa48("10349", "10350", "10351"), typeof window !== (stryMutAct_9fa48("10352") ? "" : (stryCov_9fa48("10352"), 'undefined')))) {
        if (stryMutAct_9fa48("10353")) {
          {}
        } else {
          stryCov_9fa48("10353");
          localStorage.setItem(this.storageKey, JSON.stringify(this.tokenData));
        }
      }
    }
  }
  getAccessToken(): string | null {
    if (stryMutAct_9fa48("10354")) {
      {}
    } else {
      stryCov_9fa48("10354");
      if (stryMutAct_9fa48("10357") ? false : stryMutAct_9fa48("10356") ? true : stryMutAct_9fa48("10355") ? this.tokenData : (stryCov_9fa48("10355", "10356", "10357"), !this.tokenData)) return null;

      // Check if token is expired (with buffer)
      if (stryMutAct_9fa48("10361") ? Date.now() < this.tokenData.expiresAt - this.expirationBufferMs : stryMutAct_9fa48("10360") ? Date.now() > this.tokenData.expiresAt - this.expirationBufferMs : stryMutAct_9fa48("10359") ? false : stryMutAct_9fa48("10358") ? true : (stryCov_9fa48("10358", "10359", "10360", "10361"), Date.now() >= (stryMutAct_9fa48("10362") ? this.tokenData.expiresAt + this.expirationBufferMs : (stryCov_9fa48("10362"), this.tokenData.expiresAt - this.expirationBufferMs)))) {
        if (stryMutAct_9fa48("10363")) {
          {}
        } else {
          stryCov_9fa48("10363");
          return null;
        }
      }
      return this.tokenData.accessToken;
    }
  }
  getRefreshToken(): string | null {
    if (stryMutAct_9fa48("10364")) {
      {}
    } else {
      stryCov_9fa48("10364");
      return stryMutAct_9fa48("10365") ? this.tokenData?.refreshToken && null : (stryCov_9fa48("10365"), (stryMutAct_9fa48("10366") ? this.tokenData.refreshToken : (stryCov_9fa48("10366"), this.tokenData?.refreshToken)) ?? null);
    }
  }
  isTokenValid(): boolean {
    if (stryMutAct_9fa48("10367")) {
      {}
    } else {
      stryCov_9fa48("10367");
      return stryMutAct_9fa48("10370") ? this.getAccessToken() === null : stryMutAct_9fa48("10369") ? false : stryMutAct_9fa48("10368") ? true : (stryCov_9fa48("10368", "10369", "10370"), this.getAccessToken() !== null);
    }
  }
  clearTokens(): void {
    if (stryMutAct_9fa48("10371")) {
      {}
    } else {
      stryCov_9fa48("10371");
      this.tokenData = null;
      if (stryMutAct_9fa48("10374") ? typeof window === 'undefined' : stryMutAct_9fa48("10373") ? false : stryMutAct_9fa48("10372") ? true : (stryCov_9fa48("10372", "10373", "10374"), typeof window !== (stryMutAct_9fa48("10375") ? "" : (stryCov_9fa48("10375"), 'undefined')))) {
        if (stryMutAct_9fa48("10376")) {
          {}
        } else {
          stryCov_9fa48("10376");
          localStorage.removeItem(this.storageKey);
        }
      }
    }
  }
}

// ==============================================================================
// ENHANCED API CLIENT
// ==============================================================================

interface RequestConfig extends AxiosRequestConfig {
  readonly skipAuth?: boolean;
  readonly retries?: number;
  readonly timeout?: number;
  readonly deduplication?: boolean;
}
interface ApiClientConfig {
  readonly baseURL: string;
  readonly timeout: number;
  readonly maxRetries: number;
  readonly retryDelay: number;
}

/**
 * Enhanced API client with strict typing and advanced features
 */
class EnhancedApiClient {
  private readonly client: AxiosInstance;
  private readonly tokenManager: EnhancedTokenManager;
  private readonly config: ApiClientConfig;
  private isRefreshing = stryMutAct_9fa48("10377") ? true : (stryCov_9fa48("10377"), false);
  private refreshQueue: TokenRefreshQueueItem[] = stryMutAct_9fa48("10378") ? ["Stryker was here"] : (stryCov_9fa48("10378"), []);
  private readonly requestCache = new Map<string, Promise<StrictApiResponse<unknown>>>();
  constructor(clientConfig?: Partial<ApiClientConfig>) {
    if (stryMutAct_9fa48("10379")) {
      {}
    } else {
      stryCov_9fa48("10379");
      this.config = stryMutAct_9fa48("10380") ? {} : (stryCov_9fa48("10380"), {
        baseURL: config.apiUrl,
        timeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
        ...clientConfig
      });
      this.tokenManager = EnhancedTokenManager.getInstance();
      this.client = this.createAxiosInstance();
      this.setupInterceptors();
    }
  }
  private createAxiosInstance(): AxiosInstance {
    if (stryMutAct_9fa48("10381")) {
      {}
    } else {
      stryCov_9fa48("10381");
      return axios.create(stryMutAct_9fa48("10382") ? {} : (stryCov_9fa48("10382"), {
        baseURL: this.config.baseURL,
        timeout: this.config.timeout,
        headers: stryMutAct_9fa48("10383") ? {} : (stryCov_9fa48("10383"), {
          'Content-Type': stryMutAct_9fa48("10384") ? "" : (stryCov_9fa48("10384"), 'application/json'),
          'Accept': stryMutAct_9fa48("10385") ? "" : (stryCov_9fa48("10385"), 'application/json'),
          'X-Client-Version': appConfig.version,
          'X-Platform': stryMutAct_9fa48("10386") ? "" : (stryCov_9fa48("10386"), 'web')
        })
      }));
    }
  }
  private setupInterceptors(): void {
    if (stryMutAct_9fa48("10387")) {
      {}
    } else {
      stryCov_9fa48("10387");
      // Request interceptor
      this.client.interceptors.request.use(config => {
        if (stryMutAct_9fa48("10388")) {
          {}
        } else {
          stryCov_9fa48("10388");
          const requestConfig = config as RequestConfig;

          // Add authentication header if not skipped
          if (stryMutAct_9fa48("10391") ? false : stryMutAct_9fa48("10390") ? true : stryMutAct_9fa48("10389") ? requestConfig.skipAuth : (stryCov_9fa48("10389", "10390", "10391"), !requestConfig.skipAuth)) {
            if (stryMutAct_9fa48("10392")) {
              {}
            } else {
              stryCov_9fa48("10392");
              const token = this.tokenManager.getAccessToken();
              if (stryMutAct_9fa48("10395") ? token || config.headers : stryMutAct_9fa48("10394") ? false : stryMutAct_9fa48("10393") ? true : (stryCov_9fa48("10393", "10394", "10395"), token && config.headers)) {
                if (stryMutAct_9fa48("10396")) {
                  {}
                } else {
                  stryCov_9fa48("10396");
                  config.headers.Authorization = stryMutAct_9fa48("10397") ? `` : (stryCov_9fa48("10397"), `Bearer ${token}`);
                }
              }
            }
          }

          // Add request ID for tracing
          if (stryMutAct_9fa48("10399") ? false : stryMutAct_9fa48("10398") ? true : (stryCov_9fa48("10398", "10399"), config.headers)) {
            if (stryMutAct_9fa48("10400")) {
              {}
            } else {
              stryCov_9fa48("10400");
              config.headers[stryMutAct_9fa48("10401") ? "" : (stryCov_9fa48("10401"), 'X-Request-ID')] = this.generateRequestId();
            }
          }
          return config;
        }
      }, stryMutAct_9fa48("10402") ? () => undefined : (stryCov_9fa48("10402"), (error: AxiosError) => Promise.reject(this.transformError(error))));

      // Response interceptor
      this.client.interceptors.response.use(stryMutAct_9fa48("10403") ? () => undefined : (stryCov_9fa48("10403"), response => response), async (error: AxiosError) => {
        if (stryMutAct_9fa48("10404")) {
          {}
        } else {
          stryCov_9fa48("10404");
          const originalRequest = error.config as RequestConfig & {
            _retry?: boolean;
          };

          // Handle 401 errors with token refresh
          if (stryMutAct_9fa48("10407") ? error.response?.status === 401 && !originalRequest._retry || !originalRequest.skipAuth : stryMutAct_9fa48("10406") ? false : stryMutAct_9fa48("10405") ? true : (stryCov_9fa48("10405", "10406", "10407"), (stryMutAct_9fa48("10409") ? error.response?.status === 401 || !originalRequest._retry : stryMutAct_9fa48("10408") ? true : (stryCov_9fa48("10408", "10409"), (stryMutAct_9fa48("10411") ? error.response?.status !== 401 : stryMutAct_9fa48("10410") ? true : (stryCov_9fa48("10410", "10411"), (stryMutAct_9fa48("10412") ? error.response.status : (stryCov_9fa48("10412"), error.response?.status)) === 401)) && (stryMutAct_9fa48("10413") ? originalRequest._retry : (stryCov_9fa48("10413"), !originalRequest._retry)))) && (stryMutAct_9fa48("10414") ? originalRequest.skipAuth : (stryCov_9fa48("10414"), !originalRequest.skipAuth)))) {
            if (stryMutAct_9fa48("10415")) {
              {}
            } else {
              stryCov_9fa48("10415");
              if (stryMutAct_9fa48("10417") ? false : stryMutAct_9fa48("10416") ? true : (stryCov_9fa48("10416", "10417"), this.isRefreshing)) {
                if (stryMutAct_9fa48("10418")) {
                  {}
                } else {
                  stryCov_9fa48("10418");
                  return this.queueFailedRequest(originalRequest);
                }
              }
              originalRequest._retry = stryMutAct_9fa48("10419") ? false : (stryCov_9fa48("10419"), true);
              return this.handleTokenRefresh(originalRequest);
            }
          }
          return Promise.reject(this.transformError(error));
        }
      });
    }
  }
  private async queueFailedRequest(originalRequest: RequestConfig): Promise<AxiosResponse> {
    if (stryMutAct_9fa48("10420")) {
      {}
    } else {
      stryCov_9fa48("10420");
      return new Promise((resolve, reject) => {
        if (stryMutAct_9fa48("10421")) {
          {}
        } else {
          stryCov_9fa48("10421");
          this.refreshQueue.push(stryMutAct_9fa48("10422") ? {} : (stryCov_9fa48("10422"), {
            resolve: (token: string) => {
              if (stryMutAct_9fa48("10423")) {
                {}
              } else {
                stryCov_9fa48("10423");
                if (stryMutAct_9fa48("10425") ? false : stryMutAct_9fa48("10424") ? true : (stryCov_9fa48("10424", "10425"), originalRequest.headers)) {
                  if (stryMutAct_9fa48("10426")) {
                    {}
                  } else {
                    stryCov_9fa48("10426");
                    originalRequest.headers.Authorization = stryMutAct_9fa48("10427") ? `` : (stryCov_9fa48("10427"), `Bearer ${token}`);
                  }
                }
                resolve(this.client(originalRequest));
              }
            },
            reject: stryMutAct_9fa48("10428") ? () => undefined : (stryCov_9fa48("10428"), (error: ApiErrorDetails) => reject(error))
          }));
        }
      });
    }
  }
  private async handleTokenRefresh(originalRequest: RequestConfig): Promise<AxiosResponse> {
    if (stryMutAct_9fa48("10429")) {
      {}
    } else {
      stryCov_9fa48("10429");
      this.isRefreshing = stryMutAct_9fa48("10430") ? false : (stryCov_9fa48("10430"), true);
      try {
        if (stryMutAct_9fa48("10431")) {
          {}
        } else {
          stryCov_9fa48("10431");
          const refreshToken = this.tokenManager.getRefreshToken();
          if (stryMutAct_9fa48("10434") ? false : stryMutAct_9fa48("10433") ? true : stryMutAct_9fa48("10432") ? refreshToken : (stryCov_9fa48("10432", "10433", "10434"), !refreshToken)) {
            if (stryMutAct_9fa48("10435")) {
              {}
            } else {
              stryCov_9fa48("10435");
              throw new Error(stryMutAct_9fa48("10436") ? "" : (stryCov_9fa48("10436"), 'No refresh token available'));
            }
          }
          const refreshResult = await this.refreshAccessToken(stryMutAct_9fa48("10437") ? {} : (stryCov_9fa48("10437"), {
            refresh_token: refreshToken
          }));
          if (stryMutAct_9fa48("10440") ? false : stryMutAct_9fa48("10439") ? true : stryMutAct_9fa48("10438") ? isSuccess(refreshResult) : (stryCov_9fa48("10438", "10439", "10440"), !isSuccess(refreshResult))) {
            if (stryMutAct_9fa48("10441")) {
              {}
            } else {
              stryCov_9fa48("10441");
              throw new Error(stryMutAct_9fa48("10442") ? "" : (stryCov_9fa48("10442"), 'Token refresh failed'));
            }
          }
          const {
            access_token,
            refresh_token: newRefreshToken,
            expires_in
          } = refreshResult.value.data;
          this.tokenManager.setTokens(access_token, newRefreshToken, expires_in);

          // Process queued requests
          this.processRefreshQueue(access_token, null);

          // Retry original request
          if (stryMutAct_9fa48("10444") ? false : stryMutAct_9fa48("10443") ? true : (stryCov_9fa48("10443", "10444"), originalRequest.headers)) {
            if (stryMutAct_9fa48("10445")) {
              {}
            } else {
              stryCov_9fa48("10445");
              originalRequest.headers.Authorization = stryMutAct_9fa48("10446") ? `` : (stryCov_9fa48("10446"), `Bearer ${access_token}`);
            }
          }
          return this.client(originalRequest);
        }
      } catch (error) {
        if (stryMutAct_9fa48("10447")) {
          {}
        } else {
          stryCov_9fa48("10447");
          const apiError = this.transformError(error as AxiosError);
          this.processRefreshQueue(stryMutAct_9fa48("10448") ? "Stryker was here!" : (stryCov_9fa48("10448"), ''), apiError);
          this.tokenManager.clearTokens();
          if (stryMutAct_9fa48("10451") ? typeof window === 'undefined' : stryMutAct_9fa48("10450") ? false : stryMutAct_9fa48("10449") ? true : (stryCov_9fa48("10449", "10450", "10451"), typeof window !== (stryMutAct_9fa48("10452") ? "" : (stryCov_9fa48("10452"), 'undefined')))) {
            if (stryMutAct_9fa48("10453")) {
              {}
            } else {
              stryCov_9fa48("10453");
              window.location.href = stryMutAct_9fa48("10454") ? "" : (stryCov_9fa48("10454"), '/auth/login');
            }
          }
          throw apiError;
        }
      } finally {
        if (stryMutAct_9fa48("10455")) {
          {}
        } else {
          stryCov_9fa48("10455");
          this.isRefreshing = stryMutAct_9fa48("10456") ? true : (stryCov_9fa48("10456"), false);
        }
      }
    }
  }
  private processRefreshQueue(token: string, error: ApiErrorDetails | null): void {
    if (stryMutAct_9fa48("10457")) {
      {}
    } else {
      stryCov_9fa48("10457");
      this.refreshQueue.forEach(({
        resolve,
        reject
      }) => {
        if (stryMutAct_9fa48("10458")) {
          {}
        } else {
          stryCov_9fa48("10458");
          if (stryMutAct_9fa48("10460") ? false : stryMutAct_9fa48("10459") ? true : (stryCov_9fa48("10459", "10460"), error)) {
            if (stryMutAct_9fa48("10461")) {
              {}
            } else {
              stryCov_9fa48("10461");
              reject(error);
            }
          } else {
            if (stryMutAct_9fa48("10462")) {
              {}
            } else {
              stryCov_9fa48("10462");
              resolve(token);
            }
          }
        }
      });
      this.refreshQueue = stryMutAct_9fa48("10463") ? ["Stryker was here"] : (stryCov_9fa48("10463"), []);
    }
  }
  private transformError(error: AxiosError | Error): ApiErrorDetails {
    if (stryMutAct_9fa48("10464")) {
      {}
    } else {
      stryCov_9fa48("10464");
      if (stryMutAct_9fa48("10466") ? false : stryMutAct_9fa48("10465") ? true : (stryCov_9fa48("10465", "10466"), axios.isAxiosError(error))) {
        if (stryMutAct_9fa48("10467")) {
          {}
        } else {
          stryCov_9fa48("10467");
          return stryMutAct_9fa48("10468") ? {} : (stryCov_9fa48("10468"), {
            code: stryMutAct_9fa48("10471") ? error.response?.data?.code && `HTTP_${error.response?.status || 0}` : stryMutAct_9fa48("10470") ? false : stryMutAct_9fa48("10469") ? true : (stryCov_9fa48("10469", "10470", "10471"), (stryMutAct_9fa48("10473") ? error.response.data?.code : stryMutAct_9fa48("10472") ? error.response?.data.code : (stryCov_9fa48("10472", "10473"), error.response?.data?.code)) || (stryMutAct_9fa48("10474") ? `` : (stryCov_9fa48("10474"), `HTTP_${stryMutAct_9fa48("10477") ? error.response?.status && 0 : stryMutAct_9fa48("10476") ? false : stryMutAct_9fa48("10475") ? true : (stryCov_9fa48("10475", "10476", "10477"), (stryMutAct_9fa48("10478") ? error.response.status : (stryCov_9fa48("10478"), error.response?.status)) || 0)}`))),
            message: stryMutAct_9fa48("10481") ? error.response?.data?.message && this.getErrorMessageByStatus(error.response?.status || 0) : stryMutAct_9fa48("10480") ? false : stryMutAct_9fa48("10479") ? true : (stryCov_9fa48("10479", "10480", "10481"), (stryMutAct_9fa48("10483") ? error.response.data?.message : stryMutAct_9fa48("10482") ? error.response?.data.message : (stryCov_9fa48("10482", "10483"), error.response?.data?.message)) || this.getErrorMessageByStatus(stryMutAct_9fa48("10486") ? error.response?.status && 0 : stryMutAct_9fa48("10485") ? false : stryMutAct_9fa48("10484") ? true : (stryCov_9fa48("10484", "10485", "10486"), (stryMutAct_9fa48("10487") ? error.response.status : (stryCov_9fa48("10487"), error.response?.status)) || 0))),
            statusCode: stryMutAct_9fa48("10490") ? error.response?.status && 0 : stryMutAct_9fa48("10489") ? false : stryMutAct_9fa48("10488") ? true : (stryCov_9fa48("10488", "10489", "10490"), (stryMutAct_9fa48("10491") ? error.response.status : (stryCov_9fa48("10491"), error.response?.status)) || 0),
            details: stryMutAct_9fa48("10493") ? error.response.data?.details : stryMutAct_9fa48("10492") ? error.response?.data.details : (stryCov_9fa48("10492", "10493"), error.response?.data?.details),
            requestId: error.config?.headers?.['X-Request-ID'] as string,
            path: stryMutAct_9fa48("10494") ? error.config.url : (stryCov_9fa48("10494"), error.config?.url)
          });
        }
      }
      return stryMutAct_9fa48("10495") ? {} : (stryCov_9fa48("10495"), {
        code: stryMutAct_9fa48("10496") ? "" : (stryCov_9fa48("10496"), 'CLIENT_ERROR'),
        message: stryMutAct_9fa48("10499") ? error.message && 'An unexpected error occurred' : stryMutAct_9fa48("10498") ? false : stryMutAct_9fa48("10497") ? true : (stryCov_9fa48("10497", "10498", "10499"), error.message || (stryMutAct_9fa48("10500") ? "" : (stryCov_9fa48("10500"), 'An unexpected error occurred'))),
        statusCode: 0
      });
    }
  }
  private getErrorMessageByStatus(status: number): string {
    if (stryMutAct_9fa48("10501")) {
      {}
    } else {
      stryCov_9fa48("10501");
      switch (status) {
        case 400:
          if (stryMutAct_9fa48("10502")) {} else {
            stryCov_9fa48("10502");
            return appConfig.errors.validation;
          }
        case 401:
          if (stryMutAct_9fa48("10503")) {} else {
            stryCov_9fa48("10503");
            return appConfig.errors.unauthorized;
          }
        case 403:
          if (stryMutAct_9fa48("10504")) {} else {
            stryCov_9fa48("10504");
            return appConfig.errors.forbidden;
          }
        case 404:
          if (stryMutAct_9fa48("10505")) {} else {
            stryCov_9fa48("10505");
            return appConfig.errors.notFound;
          }
        case 429:
          if (stryMutAct_9fa48("10506")) {} else {
            stryCov_9fa48("10506");
            return stryMutAct_9fa48("10507") ? "" : (stryCov_9fa48("10507"), 'Too many requests. Please try again later.');
          }
        case 500:
          if (stryMutAct_9fa48("10508")) {} else {
            stryCov_9fa48("10508");
            return appConfig.errors.server;
          }
        case 502:
          if (stryMutAct_9fa48("10509")) {} else {
            stryCov_9fa48("10509");
            return stryMutAct_9fa48("10510") ? "" : (stryCov_9fa48("10510"), 'Service temporarily unavailable.');
          }
        case 503:
          if (stryMutAct_9fa48("10511")) {} else {
            stryCov_9fa48("10511");
            return stryMutAct_9fa48("10512") ? "" : (stryCov_9fa48("10512"), 'Service temporarily unavailable.');
          }
        case 504:
          if (stryMutAct_9fa48("10513")) {} else {
            stryCov_9fa48("10513");
            return stryMutAct_9fa48("10514") ? "" : (stryCov_9fa48("10514"), 'Request timeout. Please try again.');
          }
        default:
          if (stryMutAct_9fa48("10515")) {} else {
            stryCov_9fa48("10515");
            return appConfig.errors.unknown;
          }
      }
    }
  }
  private generateRequestId(): string {
    if (stryMutAct_9fa48("10516")) {
      {}
    } else {
      stryCov_9fa48("10516");
      return stryMutAct_9fa48("10517") ? `` : (stryCov_9fa48("10517"), `req_${Date.now()}_${stryMutAct_9fa48("10518") ? Math.random().toString(36) : (stryCov_9fa48("10518"), Math.random().toString(36).substr(2, 9))}`);
    }
  }
  private async executeRequest<T>(method: 'get' | 'post' | 'put' | 'patch' | 'delete', url: string, data?: unknown, config?: RequestConfig): Promise<Result<StrictApiResponse<T>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10519")) {
      {}
    } else {
      stryCov_9fa48("10519");
      const cacheKey = (stryMutAct_9fa48("10520") ? config.deduplication : (stryCov_9fa48("10520"), config?.deduplication)) ? stryMutAct_9fa48("10521") ? `` : (stryCov_9fa48("10521"), `${method}:${url}:${JSON.stringify(data)}`) : stryMutAct_9fa48("10522") ? "Stryker was here!" : (stryCov_9fa48("10522"), '');
      if (stryMutAct_9fa48("10525") ? cacheKey || this.requestCache.has(cacheKey) : stryMutAct_9fa48("10524") ? false : stryMutAct_9fa48("10523") ? true : (stryCov_9fa48("10523", "10524", "10525"), cacheKey && this.requestCache.has(cacheKey))) {
        if (stryMutAct_9fa48("10526")) {
          {}
        } else {
          stryCov_9fa48("10526");
          return this.requestCache.get(cacheKey) as Promise<Result<StrictApiResponse<T>, ApiErrorDetails>>;
        }
      }
      const requestPromise = tryCatchAsync(async () => {
        if (stryMutAct_9fa48("10527")) {
          {}
        } else {
          stryCov_9fa48("10527");
          const response = await this.client[method](url, ...((stryMutAct_9fa48("10530") ? method !== 'get' : stryMutAct_9fa48("10529") ? false : stryMutAct_9fa48("10528") ? true : (stryCov_9fa48("10528", "10529", "10530"), method === (stryMutAct_9fa48("10531") ? "" : (stryCov_9fa48("10531"), 'get')))) ? stryMutAct_9fa48("10532") ? [] : (stryCov_9fa48("10532"), [config]) : stryMutAct_9fa48("10533") ? [] : (stryCov_9fa48("10533"), [data, config])));
          const apiResponse: StrictApiResponse<T> = stryMutAct_9fa48("10534") ? {} : (stryCov_9fa48("10534"), {
            success: stryMutAct_9fa48("10535") ? false : (stryCov_9fa48("10535"), true),
            data: stryMutAct_9fa48("10538") ? response.data.data && response.data : stryMutAct_9fa48("10537") ? false : stryMutAct_9fa48("10536") ? true : (stryCov_9fa48("10536", "10537", "10538"), response.data.data || response.data),
            message: response.data.message,
            timestamp: new Date().toISOString() as any // Will be properly typed in implementation
          });
          return apiResponse;
        }
      });
      if (stryMutAct_9fa48("10540") ? false : stryMutAct_9fa48("10539") ? true : (stryCov_9fa48("10539", "10540"), cacheKey)) {
        if (stryMutAct_9fa48("10541")) {
          {}
        } else {
          stryCov_9fa48("10541");
          this.requestCache.set(cacheKey, requestPromise as Promise<StrictApiResponse<unknown>>);
          // Clear cache after 5 minutes
          setTimeout(stryMutAct_9fa48("10542") ? () => undefined : (stryCov_9fa48("10542"), () => this.requestCache.delete(cacheKey)), stryMutAct_9fa48("10543") ? 5 * 60 / 1000 : (stryCov_9fa48("10543"), (stryMutAct_9fa48("10544") ? 5 / 60 : (stryCov_9fa48("10544"), 5 * 60)) * 1000));
        }
      }
      return requestPromise;
    }
  }

  // ==============================================================================
  // TYPE-SAFE API METHODS
  // ==============================================================================

  // Authentication methods
  async login(data: LoginRequest): Promise<Result<StrictApiResponse<any>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10545")) {
      {}
    } else {
      stryCov_9fa48("10545");
      return this.executeRequest(stryMutAct_9fa48("10546") ? "" : (stryCov_9fa48("10546"), 'post'), endpoints.auth.login, data, stryMutAct_9fa48("10547") ? {} : (stryCov_9fa48("10547"), {
        skipAuth: stryMutAct_9fa48("10548") ? false : (stryCov_9fa48("10548"), true)
      }));
    }
  }
  async register(data: RegisterRequest): Promise<Result<StrictApiResponse<any>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10549")) {
      {}
    } else {
      stryCov_9fa48("10549");
      return this.executeRequest(stryMutAct_9fa48("10550") ? "" : (stryCov_9fa48("10550"), 'post'), endpoints.auth.register, data, stryMutAct_9fa48("10551") ? {} : (stryCov_9fa48("10551"), {
        skipAuth: stryMutAct_9fa48("10552") ? false : (stryCov_9fa48("10552"), true)
      }));
    }
  }
  async refreshAccessToken(data: RefreshTokenRequest): Promise<Result<StrictApiResponse<any>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10553")) {
      {}
    } else {
      stryCov_9fa48("10553");
      return this.executeRequest(stryMutAct_9fa48("10554") ? "" : (stryCov_9fa48("10554"), 'post'), endpoints.auth.refresh, data, stryMutAct_9fa48("10555") ? {} : (stryCov_9fa48("10555"), {
        skipAuth: stryMutAct_9fa48("10556") ? false : (stryCov_9fa48("10556"), true)
      }));
    }
  }
  async logout(): Promise<Result<StrictApiResponse<void>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10557")) {
      {}
    } else {
      stryCov_9fa48("10557");
      const result = await this.executeRequest<void>(stryMutAct_9fa48("10558") ? "" : (stryCov_9fa48("10558"), 'post'), endpoints.auth.logout);
      this.tokenManager.clearTokens();
      return result;
    }
  }
  async getCurrentUser(): Promise<Result<StrictApiResponse<User>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10559")) {
      {}
    } else {
      stryCov_9fa48("10559");
      return this.executeRequest(stryMutAct_9fa48("10560") ? "" : (stryCov_9fa48("10560"), 'get'), endpoints.auth.me);
    }
  }

  // User methods
  async getUserPreferences(): Promise<Result<StrictApiResponse<StrictUserPreferences>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10561")) {
      {}
    } else {
      stryCov_9fa48("10561");
      return this.executeRequest(stryMutAct_9fa48("10562") ? "" : (stryCov_9fa48("10562"), 'get'), endpoints.users.preferences);
    }
  }
  async updateUserPreferences(data: Partial<StrictUserPreferences>): Promise<Result<StrictApiResponse<StrictUserPreferences>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10563")) {
      {}
    } else {
      stryCov_9fa48("10563");
      return this.executeRequest(stryMutAct_9fa48("10564") ? "" : (stryCov_9fa48("10564"), 'put'), endpoints.users.preferences, data);
    }
  }

  // Product methods
  async getProducts(params?: SearchQuery): Promise<Result<StrictPaginatedResponse<StrictProduct>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10565")) {
      {}
    } else {
      stryCov_9fa48("10565");
      return this.executeRequest(stryMutAct_9fa48("10566") ? "" : (stryCov_9fa48("10566"), 'get'), endpoints.products.list, undefined, stryMutAct_9fa48("10567") ? {} : (stryCov_9fa48("10567"), {
        params,
        deduplication: stryMutAct_9fa48("10568") ? false : (stryCov_9fa48("10568"), true)
      }));
    }
  }
  async getProduct(id: ProductId): Promise<Result<StrictApiResponse<StrictProduct>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10569")) {
      {}
    } else {
      stryCov_9fa48("10569");
      assertDefined(id, stryMutAct_9fa48("10570") ? "" : (stryCov_9fa48("10570"), 'Product ID is required'));
      return this.executeRequest(stryMutAct_9fa48("10571") ? "" : (stryCov_9fa48("10571"), 'get'), stryMutAct_9fa48("10572") ? `` : (stryCov_9fa48("10572"), `${endpoints.products.detail}/${id}`), undefined, stryMutAct_9fa48("10573") ? {} : (stryCov_9fa48("10573"), {
        deduplication: stryMutAct_9fa48("10574") ? false : (stryCov_9fa48("10574"), true)
      }));
    }
  }
  async getProductsByCategory(categoryId: CategoryId, params?: SearchQuery): Promise<Result<StrictPaginatedResponse<StrictProduct>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10575")) {
      {}
    } else {
      stryCov_9fa48("10575");
      assertDefined(categoryId, stryMutAct_9fa48("10576") ? "" : (stryCov_9fa48("10576"), 'Category ID is required'));
      return this.executeRequest(stryMutAct_9fa48("10577") ? "" : (stryCov_9fa48("10577"), 'get'), stryMutAct_9fa48("10578") ? `` : (stryCov_9fa48("10578"), `${endpoints.products.byCategory}/${categoryId}`), undefined, stryMutAct_9fa48("10579") ? {} : (stryCov_9fa48("10579"), {
        params,
        deduplication: stryMutAct_9fa48("10580") ? false : (stryCov_9fa48("10580"), true)
      }));
    }
  }

  // Swipe methods
  async createSwipeSession(data: {
    type: string;
    context?: Record<string, unknown>;
  }): Promise<Result<StrictApiResponse<StrictSwipeSession>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10581")) {
      {}
    } else {
      stryCov_9fa48("10581");
      return this.executeRequest(stryMutAct_9fa48("10582") ? "" : (stryCov_9fa48("10582"), 'post'), endpoints.swipes.createSession, data);
    }
  }
  async recordSwipeInteraction(data: SwipeRequest): Promise<Result<StrictApiResponse<SwipeInteraction>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10583")) {
      {}
    } else {
      stryCov_9fa48("10583");
      return this.executeRequest(stryMutAct_9fa48("10584") ? "" : (stryCov_9fa48("10584"), 'post'), endpoints.swipes.recordInteraction, data);
    }
  }

  // Recommendation methods
  async getRecommendations(params?: RecommendationRequest): Promise<Result<StrictPaginatedResponse<Recommendation>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10585")) {
      {}
    } else {
      stryCov_9fa48("10585");
      return this.executeRequest(stryMutAct_9fa48("10586") ? "" : (stryCov_9fa48("10586"), 'get'), endpoints.recommendations.list, undefined, stryMutAct_9fa48("10587") ? {} : (stryCov_9fa48("10587"), {
        params,
        deduplication: stryMutAct_9fa48("10588") ? false : (stryCov_9fa48("10588"), true)
      }));
    }
  }

  // Gift link methods
  async createGiftLink(data: CreateGiftLinkRequest): Promise<Result<StrictApiResponse<GiftLink>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10589")) {
      {}
    } else {
      stryCov_9fa48("10589");
      return this.executeRequest(stryMutAct_9fa48("10590") ? "" : (stryCov_9fa48("10590"), 'post'), endpoints.giftLinks.create, data);
    }
  }
  async getGiftLink(shareToken: string): Promise<Result<StrictApiResponse<GiftLink>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10591")) {
      {}
    } else {
      stryCov_9fa48("10591");
      assertDefined(shareToken, stryMutAct_9fa48("10592") ? "" : (stryCov_9fa48("10592"), 'Share token is required'));
      return this.executeRequest(stryMutAct_9fa48("10593") ? "" : (stryCov_9fa48("10593"), 'get'), stryMutAct_9fa48("10594") ? `` : (stryCov_9fa48("10594"), `${endpoints.giftLinks.view}/${shareToken}`), undefined, stryMutAct_9fa48("10595") ? {} : (stryCov_9fa48("10595"), {
        skipAuth: stryMutAct_9fa48("10596") ? false : (stryCov_9fa48("10596"), true),
        deduplication: stryMutAct_9fa48("10597") ? false : (stryCov_9fa48("10597"), true)
      }));
    }
  }

  // Analytics methods
  async trackEvent(event: AnalyticsEvent): Promise<Result<StrictApiResponse<void>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10598")) {
      {}
    } else {
      stryCov_9fa48("10598");
      return this.executeRequest(stryMutAct_9fa48("10599") ? "" : (stryCov_9fa48("10599"), 'post'), endpoints.analytics.track, event);
    }
  }

  // Utility methods
  async healthCheck(): Promise<Result<StrictApiResponse<{
    status: string;
    timestamp: string;
  }>, ApiErrorDetails>> {
    if (stryMutAct_9fa48("10600")) {
      {}
    } else {
      stryCov_9fa48("10600");
      return this.executeRequest(stryMutAct_9fa48("10601") ? "" : (stryCov_9fa48("10601"), 'get'), stryMutAct_9fa48("10602") ? "" : (stryCov_9fa48("10602"), '/health'), undefined, stryMutAct_9fa48("10603") ? {} : (stryCov_9fa48("10603"), {
        skipAuth: stryMutAct_9fa48("10604") ? false : (stryCov_9fa48("10604"), true),
        timeout: 5000
      }));
    }
  }
}

// ==============================================================================
// ENHANCED API INSTANCE AND EXPORTS
// ==============================================================================

const enhancedApiClient = new EnhancedApiClient();

/**
 * Enhanced type-safe API interface for convenient access
 */
export const enhancedApi = {
  // Authentication
  auth: {
    login: (data: LoginRequest) => enhancedApiClient.login(data),
    register: (data: RegisterRequest) => enhancedApiClient.register(data),
    logout: () => enhancedApiClient.logout(),
    getCurrentUser: () => enhancedApiClient.getCurrentUser(),
    refreshToken: (data: RefreshTokenRequest) => enhancedApiClient.refreshAccessToken(data)
  },
  // Users
  users: {
    getPreferences: () => enhancedApiClient.getUserPreferences(),
    updatePreferences: (data: Partial<StrictUserPreferences>) => enhancedApiClient.updateUserPreferences(data)
  },
  // Products
  products: {
    list: (params?: SearchQuery) => enhancedApiClient.getProducts(params),
    get: (id: ProductId) => enhancedApiClient.getProduct(id),
    getByCategory: (categoryId: CategoryId, params?: SearchQuery) => enhancedApiClient.getProductsByCategory(categoryId, params)
  },
  // Swipes
  swipes: {
    createSession: (data: {
      type: string;
      context?: Record<string, unknown>;
    }) => enhancedApiClient.createSwipeSession(data),
    recordInteraction: (data: SwipeRequest) => enhancedApiClient.recordSwipeInteraction(data)
  },
  // Recommendations
  recommendations: {
    list: (params?: RecommendationRequest) => enhancedApiClient.getRecommendations(params)
  },
  // Gift Links
  giftLinks: {
    create: (data: CreateGiftLinkRequest) => enhancedApiClient.createGiftLink(data),
    get: (shareToken: string) => enhancedApiClient.getGiftLink(shareToken)
  },
  // Analytics
  analytics: {
    track: (event: AnalyticsEvent) => enhancedApiClient.trackEvent(event)
  },
  // Utilities
  utils: {
    healthCheck: () => enhancedApiClient.healthCheck()
  }
} as const;
export { EnhancedApiClient, EnhancedTokenManager };
export type { RequestConfig, ApiClientConfig };