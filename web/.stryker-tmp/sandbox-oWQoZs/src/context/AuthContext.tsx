/**
 * aclue Authentication Context
 * 
 * Centralised authentication state management for the entire application.
 * Provides secure user session handling, JWT token management, and
 * authentication flows for login, registration, and logout.
 * 
 * Key Features:
 *   - Automatic token refresh and session persistence
 *   - Protected route authentication guards
 *   - Real-time user state synchronisation
 *   - PostHog analytics integration for user events
 *   - Comprehensive error handling and user feedback
 * 
 * State Management:
 *   - Uses useReducer for predictable state updates
 *   - Persists user data to localStorage for session continuity
 *   - Handles loading states during authentication operations
 * 
 * Usage:
 *   // In _app.tsx
 *   <AuthProvider>
 *     <Component {...pageProps} />
 *   </AuthProvider>
 * 
 *   // In components
 *   const { user, login, logout, isAuthenticated } = useAuth();
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
import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { api, tokenManager } from '@/lib/api';
import { appConfig } from '@/config';
import { User, LoginRequest, RegisterRequest } from '@/types';
import toast from 'react-hot-toast';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Authentication state interface defining the current auth status.
 * 
 * Tracks user session, loading states, and error conditions to
 * provide comprehensive authentication state to the application.
 */
interface AuthState {
  user: User | null; // Current authenticated user (null if not logged in)
  isAuthenticated: boolean; // Authentication status (true if user logged in)
  isLoading: boolean; // Loading state during auth operations
  isInitialized: boolean; // Whether auth state has been initialized from storage
  isLoggingOut: boolean; // Logout in progress flag
  error: string | null; // Current error message (null if no error)
}

/**
 * Authentication context interface providing auth methods and state.
 * 
 * Extends AuthState with methods for authentication operations.
 * All methods are async and handle loading states automatically.
 */
interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>; // Authenticate user with email/password
  register: (userData: RegisterRequest) => Promise<void>; // Create new user account
  logout: () => Promise<void>; // End user session and clear tokens
  refreshToken: () => Promise<void>; // Refresh expired access token
  clearError: () => void; // Clear current error state
  updateUser: (userData: Partial<User>) => void; // Update user profile data
}

/**
 * Authentication action types for state management.
 * 
 * Defines all possible state changes that can occur during
 * authentication flows. Used with useReducer for predictable
 * state updates.
 */
type AuthAction = {
  type: 'SET_LOADING';
  payload: boolean;
} // Update loading state
| {
  type: 'SET_USER';
  payload: User | null;
} // Set authenticated user
| {
  type: 'SET_ERROR';
  payload: string | null;
} // Set error message
| {
  type: 'SET_INITIALIZED';
  payload: boolean;
} // Mark auth as initialized
| {
  type: 'SET_LOGGING_OUT';
  payload: boolean;
} // Set logout in progress
| {
  type: 'LOGOUT';
} // Clear user and reset state
| {
  type: 'UPDATE_USER';
  payload: Partial<User>;
}; // Update user profile data

/**
 * Initial authentication state on application load.
 * 
 * Sets default values for all auth state properties.
 * isLoading starts as true to prevent flash of unauthenticated content.
 */
const initialState: AuthState = stryMutAct_9fa48("8698") ? {} : (stryCov_9fa48("8698"), {
  user: null,
  // No user authenticated initially
  isAuthenticated: stryMutAct_9fa48("8699") ? true : (stryCov_9fa48("8699"), false),
  // Not authenticated until proven otherwise
  isLoading: stryMutAct_9fa48("8700") ? false : (stryCov_9fa48("8700"), true),
  // Loading while checking stored tokens
  isInitialized: stryMutAct_9fa48("8701") ? true : (stryCov_9fa48("8701"), false),
  // Not initialized until storage check complete
  isLoggingOut: stryMutAct_9fa48("8702") ? true : (stryCov_9fa48("8702"), false),
  // No logout in progress
  error: null // No error initially
});

// ==============================================================================
// STATE REDUCER
// ==============================================================================

/**
 * Authentication state reducer for predictable state management.
 * 
 * Handles all authentication state changes through well-defined actions.
 * Ensures immutable state updates and consistent state transitions.
 * 
 * Parameters:
 *   state: Current authentication state
 *   action: Action to perform with optional payload
 * 
 * Returns:
 *   AuthState: New state after applying action
 */
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  if (stryMutAct_9fa48("8703")) {
    {}
  } else {
    stryCov_9fa48("8703");
    switch (action.type) {
      case stryMutAct_9fa48("8705") ? "" : (stryCov_9fa48("8705"), 'SET_LOADING'):
        if (stryMutAct_9fa48("8704")) {} else {
          stryCov_9fa48("8704");
          return stryMutAct_9fa48("8706") ? {} : (stryCov_9fa48("8706"), {
            ...state,
            isLoading: action.payload
          });
        }
      case stryMutAct_9fa48("8708") ? "" : (stryCov_9fa48("8708"), 'SET_USER'):
        if (stryMutAct_9fa48("8707")) {} else {
          stryCov_9fa48("8707");
          return stryMutAct_9fa48("8709") ? {} : (stryCov_9fa48("8709"), {
            ...state,
            user: action.payload,
            // Set user data
            isAuthenticated: stryMutAct_9fa48("8710") ? !action.payload : (stryCov_9fa48("8710"), !(stryMutAct_9fa48("8711") ? action.payload : (stryCov_9fa48("8711"), !action.payload))),
            // Authenticated if user exists
            isLoading: stryMutAct_9fa48("8712") ? true : (stryCov_9fa48("8712"), false),
            // No longer loading
            error: null // Clear any errors
          });
        }
      case stryMutAct_9fa48("8714") ? "" : (stryCov_9fa48("8714"), 'SET_ERROR'):
        if (stryMutAct_9fa48("8713")) {} else {
          stryCov_9fa48("8713");
          return stryMutAct_9fa48("8715") ? {} : (stryCov_9fa48("8715"), {
            ...state,
            error: action.payload,
            // Set error message
            isLoading: stryMutAct_9fa48("8716") ? true : (stryCov_9fa48("8716"), false) // Stop loading on error
          });
        }
      case stryMutAct_9fa48("8718") ? "" : (stryCov_9fa48("8718"), 'SET_INITIALIZED'):
        if (stryMutAct_9fa48("8717")) {} else {
          stryCov_9fa48("8717");
          return stryMutAct_9fa48("8719") ? {} : (stryCov_9fa48("8719"), {
            ...state,
            isInitialized: action.payload,
            // Mark as initialized
            isLoading: stryMutAct_9fa48("8720") ? action.payload : (stryCov_9fa48("8720"), !action.payload) // Stop loading when initialized
          });
        }
      case stryMutAct_9fa48("8722") ? "" : (stryCov_9fa48("8722"), 'SET_LOGGING_OUT'):
        if (stryMutAct_9fa48("8721")) {} else {
          stryCov_9fa48("8721");
          return stryMutAct_9fa48("8723") ? {} : (stryCov_9fa48("8723"), {
            ...state,
            isLoggingOut: action.payload // Set logout in progress flag
          });
        }
      case stryMutAct_9fa48("8725") ? "" : (stryCov_9fa48("8725"), 'LOGOUT'):
        if (stryMutAct_9fa48("8724")) {} else {
          stryCov_9fa48("8724");
          return stryMutAct_9fa48("8726") ? {} : (stryCov_9fa48("8726"), {
            ...initialState,
            // Reset to initial state
            isInitialized: stryMutAct_9fa48("8727") ? false : (stryCov_9fa48("8727"), true),
            // Keep initialized flag
            isLoading: stryMutAct_9fa48("8728") ? true : (stryCov_9fa48("8728"), false),
            // Not loading after logout
            isLoggingOut: stryMutAct_9fa48("8729") ? true : (stryCov_9fa48("8729"), false) // Logout complete
          });
        }
      case stryMutAct_9fa48("8731") ? "" : (stryCov_9fa48("8731"), 'UPDATE_USER'):
        if (stryMutAct_9fa48("8730")) {} else {
          stryCov_9fa48("8730");
          return stryMutAct_9fa48("8732") ? {} : (stryCov_9fa48("8732"), {
            ...state,
            user: state.user ? stryMutAct_9fa48("8733") ? {} : (stryCov_9fa48("8733"), {
              ...state.user,
              ...action.payload
            }) : null // Merge user updates
          });
        }
      default:
        if (stryMutAct_9fa48("8734")) {} else {
          stryCov_9fa48("8734");
          return state;
        }
      // No change for unknown actions
    }
  }
};

// ==============================================================================
// CONTEXT CREATION
// ==============================================================================

/**
 * Authentication context for sharing auth state across the application.
 * 
 * Created with undefined default to force proper provider usage.
 * Components must be wrapped in AuthProvider to access context.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ==============================================================================
// PROVIDER COMPONENT
// ==============================================================================

/**
 * Props for AuthProvider component.
 */
interface AuthProviderProps {
  children: ReactNode; // Child components that need access to auth context
}

/**
 * Authentication Provider component.
 * 
 * Provides authentication state and methods to all child components.
 * Handles session initialization, token refresh, and user state persistence.
 * 
 * Initialization Flow:
 *   1. Check for stored tokens in localStorage
 *   2. Validate tokens with backend
 *   3. Restore user session or clear invalid tokens
 *   4. Mark authentication as initialized
 * 
 * Props:
 *   children: React components that need auth context
 */
export const AuthProvider: React.FC<AuthProviderProps> = ({
  children
}) => {
  if (stryMutAct_9fa48("8735")) {
    {}
  } else {
    stryCov_9fa48("8735");
    const [state, dispatch] = useReducer(authReducer, initialState);
    const router = useRouter();

    // ===========================================================================
    // AUTHENTICATION INITIALIZATION
    // ===========================================================================

    /**
     * Initialize authentication state on component mount.
     * 
     * Runs once when the app loads to:
     *   - Check for stored authentication tokens
     *   - Restore user session from localStorage
     *   - Verify tokens with backend
     *   - Handle token refresh if needed
     *   - Clear invalid sessions
     */
    useEffect(() => {
      if (stryMutAct_9fa48("8736")) {
        {}
      } else {
        stryCov_9fa48("8736");
        const initializeAuth = async () => {
          if (stryMutAct_9fa48("8737")) {
            {}
          } else {
            stryCov_9fa48("8737");
            try {
              if (stryMutAct_9fa48("8738")) {
                {}
              } else {
                stryCov_9fa48("8738");
                dispatch(stryMutAct_9fa48("8739") ? {} : (stryCov_9fa48("8739"), {
                  type: stryMutAct_9fa48("8740") ? "" : (stryCov_9fa48("8740"), 'SET_LOADING'),
                  payload: stryMutAct_9fa48("8741") ? false : (stryCov_9fa48("8741"), true)
                }));

                // Check for stored access token
                const token = tokenManager.getAccessToken();
                if (stryMutAct_9fa48("8744") ? false : stryMutAct_9fa48("8743") ? true : stryMutAct_9fa48("8742") ? token : (stryCov_9fa48("8742", "8743", "8744"), !token)) {
                  if (stryMutAct_9fa48("8745")) {
                    {}
                  } else {
                    stryCov_9fa48("8745");
                    // No token found - user not logged in
                    dispatch(stryMutAct_9fa48("8746") ? {} : (stryCov_9fa48("8746"), {
                      type: stryMutAct_9fa48("8747") ? "" : (stryCov_9fa48("8747"), 'SET_INITIALIZED'),
                      payload: stryMutAct_9fa48("8748") ? false : (stryCov_9fa48("8748"), true)
                    }));
                    return;
                  }
                }

                // Restore user data from localStorage for immediate UI update
                const storedUser = localStorage.getItem(appConfig.storage.user);
                if (stryMutAct_9fa48("8750") ? false : stryMutAct_9fa48("8749") ? true : (stryCov_9fa48("8749", "8750"), storedUser)) {
                  if (stryMutAct_9fa48("8751")) {
                    {}
                  } else {
                    stryCov_9fa48("8751");
                    try {
                      if (stryMutAct_9fa48("8752")) {
                        {}
                      } else {
                        stryCov_9fa48("8752");
                        const user = JSON.parse(storedUser) as User;
                        dispatch(stryMutAct_9fa48("8753") ? {} : (stryCov_9fa48("8753"), {
                          type: stryMutAct_9fa48("8754") ? "" : (stryCov_9fa48("8754"), 'SET_USER'),
                          payload: user
                        }));
                      }
                    } catch (parseError) {
                      if (stryMutAct_9fa48("8755")) {
                        {}
                      } else {
                        stryCov_9fa48("8755");
                        console.warn(stryMutAct_9fa48("8756") ? "" : (stryCov_9fa48("8756"), 'Invalid stored user data, clearing localStorage:'), parseError);
                        // Clear corrupted data
                        localStorage.removeItem(appConfig.storage.user);
                      }
                    }
                  }
                }

                // Verify token with backend and get fresh user data
                try {
                  if (stryMutAct_9fa48("8757")) {
                    {}
                  } else {
                    stryCov_9fa48("8757");
                    const response = await api.auth.getCurrentUser();
                    // Handle different response formats - sometimes data is wrapped, sometimes direct
                    const userData = stryMutAct_9fa48("8760") ? response.data && response : stryMutAct_9fa48("8759") ? false : stryMutAct_9fa48("8758") ? true : (stryCov_9fa48("8758", "8759", "8760"), response.data || response);
                    dispatch(stryMutAct_9fa48("8761") ? {} : (stryCov_9fa48("8761"), {
                      type: stryMutAct_9fa48("8762") ? "" : (stryCov_9fa48("8762"), 'SET_USER'),
                      payload: userData
                    }));

                    // Update stored user data with fresh backend data
                    localStorage.setItem(appConfig.storage.user, JSON.stringify(userData));
                  }
                } catch (error: any) {
                  if (stryMutAct_9fa48("8763")) {
                    {}
                  } else {
                    stryCov_9fa48("8763");
                    console.error(stryMutAct_9fa48("8764") ? "" : (stryCov_9fa48("8764"), 'Token verification failed:'), error);

                    // Only try to refresh if we have a refresh token
                    const refreshToken = tokenManager.getRefreshToken();
                    if (stryMutAct_9fa48("8766") ? false : stryMutAct_9fa48("8765") ? true : (stryCov_9fa48("8765", "8766"), refreshToken)) {
                      if (stryMutAct_9fa48("8767")) {
                        {}
                      } else {
                        stryCov_9fa48("8767");
                        try {
                          if (stryMutAct_9fa48("8768")) {
                            {}
                          } else {
                            stryCov_9fa48("8768");
                            await refreshTokenInternal();
                          }
                        } catch (refreshError) {
                          if (stryMutAct_9fa48("8769")) {
                            {}
                          } else {
                            stryCov_9fa48("8769");
                            console.error(stryMutAct_9fa48("8770") ? "" : (stryCov_9fa48("8770"), 'Token refresh failed:'), refreshError);
                            await logoutInternal();
                          }
                        }
                      }
                    } else {
                      if (stryMutAct_9fa48("8771")) {
                        {}
                      } else {
                        stryCov_9fa48("8771");
                        console.warn(stryMutAct_9fa48("8772") ? "" : (stryCov_9fa48("8772"), 'No refresh token available, clearing session'));
                        await logoutInternal();
                      }
                    }
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("8773")) {
                {}
              } else {
                stryCov_9fa48("8773");
                console.error(stryMutAct_9fa48("8774") ? "" : (stryCov_9fa48("8774"), 'Auth initialization failed:'), error);
                await logoutInternal();
              }
            } finally {
              if (stryMutAct_9fa48("8775")) {
                {}
              } else {
                stryCov_9fa48("8775");
                dispatch(stryMutAct_9fa48("8776") ? {} : (stryCov_9fa48("8776"), {
                  type: stryMutAct_9fa48("8777") ? "" : (stryCov_9fa48("8777"), 'SET_INITIALIZED'),
                  payload: stryMutAct_9fa48("8778") ? false : (stryCov_9fa48("8778"), true)
                }));
              }
            }
          }
        };
        initializeAuth();
      }
    }, stryMutAct_9fa48("8779") ? ["Stryker was here"] : (stryCov_9fa48("8779"), []));

    // ===========================================================================
    // INTERNAL HELPER FUNCTIONS
    // ===========================================================================

    /**
     * Internal logout function for cleanup without API calls.
     * 
     * Used during error recovery and session cleanup.
     * Clears all stored data and resets auth state.
     */
    const logoutInternal = async () => {
      if (stryMutAct_9fa48("8780")) {
        {}
      } else {
        stryCov_9fa48("8780");
        try {
          if (stryMutAct_9fa48("8781")) {
            {}
          } else {
            stryCov_9fa48("8781");
            // Clear tokens from memory and localStorage
            tokenManager.clearTokens();

            // Clear all stored authentication data
            Object.values(appConfig.storage).forEach(key => {
              if (stryMutAct_9fa48("8782")) {
                {}
              } else {
                stryCov_9fa48("8782");
                localStorage.removeItem(key);
              }
            });

            // Reset auth state
            dispatch(stryMutAct_9fa48("8783") ? {} : (stryCov_9fa48("8783"), {
              type: stryMutAct_9fa48("8784") ? "" : (stryCov_9fa48("8784"), 'LOGOUT')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("8785")) {
            {}
          } else {
            stryCov_9fa48("8785");
            console.error(stryMutAct_9fa48("8786") ? "" : (stryCov_9fa48("8786"), 'Logout error:'), error);
          }
        }
      }
    };

    /**
     * Internal token refresh function for session renewal.
     * 
     * Uses stored refresh token to obtain new access token.
     * Updates stored tokens with new values.
     */
    const refreshTokenInternal = async () => {
      if (stryMutAct_9fa48("8787")) {
        {}
      } else {
        stryCov_9fa48("8787");
        const refreshToken = tokenManager.getRefreshToken();
        if (stryMutAct_9fa48("8790") ? false : stryMutAct_9fa48("8789") ? true : stryMutAct_9fa48("8788") ? refreshToken : (stryCov_9fa48("8788", "8789", "8790"), !refreshToken)) {
          if (stryMutAct_9fa48("8791")) {
            {}
          } else {
            stryCov_9fa48("8791");
            throw new Error(stryMutAct_9fa48("8792") ? "" : (stryCov_9fa48("8792"), 'No refresh token available'));
          }
        }

        // Call refresh endpoint
        const response = await api.auth.refresh(stryMutAct_9fa48("8793") ? {} : (stryCov_9fa48("8793"), {
          refresh_token: refreshToken
        }));
        const {
          access_token,
          refresh_token: newRefreshToken
        } = response.data;

        // Store new tokens
        tokenManager.setTokens(access_token, newRefreshToken);
      }
    };

    // Login function
    const login = async (credentials: LoginRequest) => {
      if (stryMutAct_9fa48("8794")) {
        {}
      } else {
        stryCov_9fa48("8794");
        try {
          if (stryMutAct_9fa48("8795")) {
            {}
          } else {
            stryCov_9fa48("8795");
            dispatch(stryMutAct_9fa48("8796") ? {} : (stryCov_9fa48("8796"), {
              type: stryMutAct_9fa48("8797") ? "" : (stryCov_9fa48("8797"), 'SET_LOADING'),
              payload: stryMutAct_9fa48("8798") ? false : (stryCov_9fa48("8798"), true)
            }));
            dispatch(stryMutAct_9fa48("8799") ? {} : (stryCov_9fa48("8799"), {
              type: stryMutAct_9fa48("8800") ? "" : (stryCov_9fa48("8800"), 'SET_ERROR'),
              payload: null
            }));
            const response = await api.auth.login(credentials);
            const {
              access_token,
              refresh_token,
              user
            } = response.data;

            // Store tokens
            tokenManager.setTokens(access_token, refresh_token);

            // Store user data
            localStorage.setItem(appConfig.storage.user, JSON.stringify(user));

            // Update state
            dispatch(stryMutAct_9fa48("8801") ? {} : (stryCov_9fa48("8801"), {
              type: stryMutAct_9fa48("8802") ? "" : (stryCov_9fa48("8802"), 'SET_USER'),
              payload: user
            }));

            // Track login event with PostHog
            try {
              if (stryMutAct_9fa48("8803")) {
                {}
              } else {
                stryCov_9fa48("8803");
                const {
                  trackEvent,
                  identifyUser
                } = await import(stryMutAct_9fa48("8804") ? "" : (stryCov_9fa48("8804"), '@/lib/analytics'));

                // Identify the user
                identifyUser(user.id, stryMutAct_9fa48("8805") ? {} : (stryCov_9fa48("8805"), {
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  subscription_tier: user.subscription_tier
                }));

                // Track login event
                trackEvent(stryMutAct_9fa48("8806") ? "" : (stryCov_9fa48("8806"), 'user_login'), stryMutAct_9fa48("8807") ? {} : (stryCov_9fa48("8807"), {
                  method: stryMutAct_9fa48("8808") ? "" : (stryCov_9fa48("8808"), 'email'),
                  user_id: user.id,
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (trackingError) {
              if (stryMutAct_9fa48("8809")) {
                {}
              } else {
                stryCov_9fa48("8809");
                console.warn(stryMutAct_9fa48("8810") ? "" : (stryCov_9fa48("8810"), 'Failed to track login event:'), trackingError);
              }
            }
            toast.success(appConfig.success.login);
          }
        } catch (error: any) {
          if (stryMutAct_9fa48("8811")) {
            {}
          } else {
            stryCov_9fa48("8811");
            console.error(stryMutAct_9fa48("8812") ? "" : (stryCov_9fa48("8812"), 'Login error:'), error);
            const errorMessage = stryMutAct_9fa48("8815") ? error.message && appConfig.errors.unknown : stryMutAct_9fa48("8814") ? false : stryMutAct_9fa48("8813") ? true : (stryCov_9fa48("8813", "8814", "8815"), error.message || appConfig.errors.unknown);
            dispatch(stryMutAct_9fa48("8816") ? {} : (stryCov_9fa48("8816"), {
              type: stryMutAct_9fa48("8817") ? "" : (stryCov_9fa48("8817"), 'SET_ERROR'),
              payload: errorMessage
            }));
            toast.error(errorMessage);
            throw error;
          }
        }
      }
    };

    // Register function
    const register = async (userData: RegisterRequest) => {
      if (stryMutAct_9fa48("8818")) {
        {}
      } else {
        stryCov_9fa48("8818");
        try {
          if (stryMutAct_9fa48("8819")) {
            {}
          } else {
            stryCov_9fa48("8819");
            dispatch(stryMutAct_9fa48("8820") ? {} : (stryCov_9fa48("8820"), {
              type: stryMutAct_9fa48("8821") ? "" : (stryCov_9fa48("8821"), 'SET_LOADING'),
              payload: stryMutAct_9fa48("8822") ? false : (stryCov_9fa48("8822"), true)
            }));
            dispatch(stryMutAct_9fa48("8823") ? {} : (stryCov_9fa48("8823"), {
              type: stryMutAct_9fa48("8824") ? "" : (stryCov_9fa48("8824"), 'SET_ERROR'),
              payload: null
            }));
            const response = await api.auth.register(userData);
            const {
              access_token,
              refresh_token,
              user
            } = response.data;

            // Store tokens
            tokenManager.setTokens(access_token, refresh_token);

            // Store user data
            localStorage.setItem(appConfig.storage.user, JSON.stringify(user));

            // Update state
            dispatch(stryMutAct_9fa48("8825") ? {} : (stryCov_9fa48("8825"), {
              type: stryMutAct_9fa48("8826") ? "" : (stryCov_9fa48("8826"), 'SET_USER'),
              payload: user
            }));

            // Track registration event with PostHog
            try {
              if (stryMutAct_9fa48("8827")) {
                {}
              } else {
                stryCov_9fa48("8827");
                const {
                  trackEvent,
                  identifyUser
                } = await import(stryMutAct_9fa48("8828") ? "" : (stryCov_9fa48("8828"), '@/lib/analytics'));

                // Identify the user
                identifyUser(user.id, stryMutAct_9fa48("8829") ? {} : (stryCov_9fa48("8829"), {
                  email: user.email,
                  first_name: user.first_name,
                  last_name: user.last_name,
                  created_at: user.created_at,
                  subscription_tier: user.subscription_tier
                }));

                // Track registration event
                trackEvent(stryMutAct_9fa48("8830") ? "" : (stryCov_9fa48("8830"), 'user_register'), stryMutAct_9fa48("8831") ? {} : (stryCov_9fa48("8831"), {
                  method: stryMutAct_9fa48("8832") ? "" : (stryCov_9fa48("8832"), 'email'),
                  marketing_consent: userData.marketing_consent,
                  user_id: user.id,
                  source: stryMutAct_9fa48("8833") ? "" : (stryCov_9fa48("8833"), 'web'),
                  timestamp: new Date().toISOString()
                }));
              }
            } catch (trackingError) {
              if (stryMutAct_9fa48("8834")) {
                {}
              } else {
                stryCov_9fa48("8834");
                console.warn(stryMutAct_9fa48("8835") ? "" : (stryCov_9fa48("8835"), 'Failed to track registration event:'), trackingError);
              }
            }
            toast.success(appConfig.success.register);
          }
        } catch (error: any) {
          if (stryMutAct_9fa48("8836")) {
            {}
          } else {
            stryCov_9fa48("8836");
            console.error(stryMutAct_9fa48("8837") ? "" : (stryCov_9fa48("8837"), 'Registration error:'), error);
            const errorMessage = stryMutAct_9fa48("8840") ? error.message && appConfig.errors.unknown : stryMutAct_9fa48("8839") ? false : stryMutAct_9fa48("8838") ? true : (stryCov_9fa48("8838", "8839", "8840"), error.message || appConfig.errors.unknown);
            dispatch(stryMutAct_9fa48("8841") ? {} : (stryCov_9fa48("8841"), {
              type: stryMutAct_9fa48("8842") ? "" : (stryCov_9fa48("8842"), 'SET_ERROR'),
              payload: errorMessage
            }));
            toast.error(errorMessage);
            throw error;
          }
        }
      }
    };

    // Logout function
    const logout = async () => {
      if (stryMutAct_9fa48("8843")) {
        {}
      } else {
        stryCov_9fa48("8843");
        try {
          if (stryMutAct_9fa48("8844")) {
            {}
          } else {
            stryCov_9fa48("8844");
            dispatch(stryMutAct_9fa48("8845") ? {} : (stryCov_9fa48("8845"), {
              type: stryMutAct_9fa48("8846") ? "" : (stryCov_9fa48("8846"), 'SET_LOGGING_OUT'),
              payload: stryMutAct_9fa48("8847") ? false : (stryCov_9fa48("8847"), true)
            }));
            dispatch(stryMutAct_9fa48("8848") ? {} : (stryCov_9fa48("8848"), {
              type: stryMutAct_9fa48("8849") ? "" : (stryCov_9fa48("8849"), 'SET_LOADING'),
              payload: stryMutAct_9fa48("8850") ? false : (stryCov_9fa48("8850"), true)
            }));

            // Call logout API
            try {
              if (stryMutAct_9fa48("8851")) {
                {}
              } else {
                stryCov_9fa48("8851");
                await api.auth.logout();
              }
            } catch (error) {
              if (stryMutAct_9fa48("8852")) {
                {}
              } else {
                stryCov_9fa48("8852");
                console.warn(stryMutAct_9fa48("8853") ? "" : (stryCov_9fa48("8853"), 'Logout API call failed:'), error);
              }
            }

            // Track logout event with PostHog
            if (stryMutAct_9fa48("8855") ? false : stryMutAct_9fa48("8854") ? true : (stryCov_9fa48("8854", "8855"), state.user)) {
              if (stryMutAct_9fa48("8856")) {
                {}
              } else {
                stryCov_9fa48("8856");
                try {
                  if (stryMutAct_9fa48("8857")) {
                    {}
                  } else {
                    stryCov_9fa48("8857");
                    const {
                      trackEvent,
                      analytics
                    } = await import(stryMutAct_9fa48("8858") ? "" : (stryCov_9fa48("8858"), '@/lib/analytics'));
                    trackEvent(stryMutAct_9fa48("8859") ? "" : (stryCov_9fa48("8859"), 'user_logout'), stryMutAct_9fa48("8860") ? {} : (stryCov_9fa48("8860"), {
                      user_id: state.user.id,
                      timestamp: new Date().toISOString()
                    }));

                    // Reset PostHog user session
                    analytics.reset();
                  }
                } catch (trackingError) {
                  if (stryMutAct_9fa48("8861")) {
                    {}
                  } else {
                    stryCov_9fa48("8861");
                    console.warn(stryMutAct_9fa48("8862") ? "" : (stryCov_9fa48("8862"), 'Failed to track logout event:'), trackingError);
                  }
                }
              }
            }
            await logoutInternal();
            console.log(stryMutAct_9fa48("8863") ? "" : (stryCov_9fa48("8863"), '🚪 Logout completed, redirecting to homepage...'));
            toast.success(appConfig.success.logout);

            // Small delay to ensure state update completes before redirect
            setTimeout(() => {
              if (stryMutAct_9fa48("8864")) {
                {}
              } else {
                stryCov_9fa48("8864");
                console.log(stryMutAct_9fa48("8865") ? "" : (stryCov_9fa48("8865"), '🚪 Executing redirect to homepage'));
                router.replace(stryMutAct_9fa48("8866") ? "" : (stryCov_9fa48("8866"), '/'));
              }
            }, 100);
          }
        } catch (error: any) {
          if (stryMutAct_9fa48("8867")) {
            {}
          } else {
            stryCov_9fa48("8867");
            console.error(stryMutAct_9fa48("8868") ? "" : (stryCov_9fa48("8868"), 'Logout error:'), error);
            // Force logout even if API call fails
            await logoutInternal();
            setTimeout(() => {
              if (stryMutAct_9fa48("8869")) {
                {}
              } else {
                stryCov_9fa48("8869");
                router.replace(stryMutAct_9fa48("8870") ? "" : (stryCov_9fa48("8870"), '/'));
              }
            }, 100);
          }
        }
      }
    };

    // Refresh token function
    const refreshToken = async () => {
      if (stryMutAct_9fa48("8871")) {
        {}
      } else {
        stryCov_9fa48("8871");
        try {
          if (stryMutAct_9fa48("8872")) {
            {}
          } else {
            stryCov_9fa48("8872");
            await refreshTokenInternal();
          }
        } catch (error: any) {
          if (stryMutAct_9fa48("8873")) {
            {}
          } else {
            stryCov_9fa48("8873");
            console.error(stryMutAct_9fa48("8874") ? "" : (stryCov_9fa48("8874"), 'Token refresh failed:'), error);
            await logoutInternal();
            throw error;
          }
        }
      }
    };

    // Clear error function
    const clearError = () => {
      if (stryMutAct_9fa48("8875")) {
        {}
      } else {
        stryCov_9fa48("8875");
        dispatch(stryMutAct_9fa48("8876") ? {} : (stryCov_9fa48("8876"), {
          type: stryMutAct_9fa48("8877") ? "" : (stryCov_9fa48("8877"), 'SET_ERROR'),
          payload: null
        }));
      }
    };

    // Update user function
    const updateUser = (userData: Partial<User>) => {
      if (stryMutAct_9fa48("8878")) {
        {}
      } else {
        stryCov_9fa48("8878");
        if (stryMutAct_9fa48("8880") ? false : stryMutAct_9fa48("8879") ? true : (stryCov_9fa48("8879", "8880"), state.user)) {
          if (stryMutAct_9fa48("8881")) {
            {}
          } else {
            stryCov_9fa48("8881");
            const updatedUser = stryMutAct_9fa48("8882") ? {} : (stryCov_9fa48("8882"), {
              ...state.user,
              ...userData
            });
            localStorage.setItem(appConfig.storage.user, JSON.stringify(updatedUser));
            dispatch(stryMutAct_9fa48("8883") ? {} : (stryCov_9fa48("8883"), {
              type: stryMutAct_9fa48("8884") ? "" : (stryCov_9fa48("8884"), 'UPDATE_USER'),
              payload: userData
            }));
          }
        }
      }
    };
    const value: AuthContextType = stryMutAct_9fa48("8885") ? {} : (stryCov_9fa48("8885"), {
      ...state,
      login,
      register,
      logout,
      refreshToken,
      clearError,
      updateUser
    });
    return <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>;
  }
};

// Hook to use auth context
export const useAuth = (): AuthContextType => {
  if (stryMutAct_9fa48("8886")) {
    {}
  } else {
    stryCov_9fa48("8886");
    const context = useContext(AuthContext);
    if (stryMutAct_9fa48("8889") ? context !== undefined : stryMutAct_9fa48("8888") ? false : stryMutAct_9fa48("8887") ? true : (stryCov_9fa48("8887", "8888", "8889"), context === undefined)) {
      if (stryMutAct_9fa48("8890")) {
        {}
      } else {
        stryCov_9fa48("8890");
        throw new Error(stryMutAct_9fa48("8891") ? "" : (stryCov_9fa48("8891"), 'useAuth must be used within an AuthProvider'));
      }
    }
    return context;
  }
};

// Hook for protected routes
export const useRequireAuth = (redirectTo: string = stryMutAct_9fa48("8892") ? "" : (stryCov_9fa48("8892"), '/auth/login')) => {
  if (stryMutAct_9fa48("8893")) {
    {}
  } else {
    stryCov_9fa48("8893");
    const {
      isAuthenticated,
      isInitialized
    } = useAuth();
    const router = useRouter();
    useEffect(() => {
      if (stryMutAct_9fa48("8894")) {
        {}
      } else {
        stryCov_9fa48("8894");
        if (stryMutAct_9fa48("8897") ? isInitialized || !isAuthenticated : stryMutAct_9fa48("8896") ? false : stryMutAct_9fa48("8895") ? true : (stryCov_9fa48("8895", "8896", "8897"), isInitialized && (stryMutAct_9fa48("8898") ? isAuthenticated : (stryCov_9fa48("8898"), !isAuthenticated)))) {
          if (stryMutAct_9fa48("8899")) {
            {}
          } else {
            stryCov_9fa48("8899");
            const currentPath = router.asPath;
            const redirectUrl = stryMutAct_9fa48("8900") ? `` : (stryCov_9fa48("8900"), `${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
            router.replace(redirectUrl);
          }
        }
      }
    }, stryMutAct_9fa48("8901") ? [] : (stryCov_9fa48("8901"), [isAuthenticated, isInitialized, router, redirectTo]));
    return stryMutAct_9fa48("8902") ? {} : (stryCov_9fa48("8902"), {
      isAuthenticated,
      isInitialized
    });
  }
};
export default AuthContext;