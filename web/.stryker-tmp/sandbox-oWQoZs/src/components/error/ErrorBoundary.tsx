/**
 * Enterprise Error Boundary Component for aclue Platform
 *
 * Provides comprehensive error handling and recovery mechanisms for React components.
 * Implements fallback UI, error reporting, and graceful degradation patterns.
 *
 * Key Features:
 *   - Catches JavaScript errors anywhere in the component tree
 *   - Displays fallback UI instead of crashing the entire application
 *   - Reports errors to monitoring services (Sentry, PostHog)
 *   - Provides error recovery mechanisms
 *   - Includes development mode error details
 *
 * Usage:
 *   <ErrorBoundary fallback={<CustomFallback />}>
 *     <YourComponent />
 *   </ErrorBoundary>
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
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, Bug } from 'lucide-react';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  children: ReactNode; // Child components to wrap
  fallback?: ReactNode; // Custom fallback UI (optional)
  onError?: (error: Error, errorInfo: ErrorInfo) => void; // Custom error handler
  level?: 'page' | 'component' | 'critical'; // Error severity level
  resetOnPropsChange?: boolean; // Reset error state when props change
  resetKeys?: Array<string | number>; // Keys that trigger error state reset
}

/**
 * State interface for ErrorBoundary component.
 */
interface ErrorBoundaryState {
  hasError: boolean; // Whether an error has occurred
  error: Error | null; // The error object
  errorInfo: ErrorInfo | null; // React error information
  errorId: string | null; // Unique error identifier
  retryCount: number; // Number of retry attempts
}

// ==============================================================================
// ERROR BOUNDARY COMPONENT
// ==============================================================================

/**
 * ErrorBoundary class component for catching and handling React errors.
 *
 * Implements React's error boundary API with enhanced error reporting,
 * recovery mechanisms, and user-friendly fallback interfaces.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimeoutId: number | null = null;
  private maxRetries = 3;
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = stryMutAct_9fa48("3426") ? {} : (stryCov_9fa48("3426"), {
      hasError: stryMutAct_9fa48("3427") ? true : (stryCov_9fa48("3427"), false),
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0
    });
  }

  /**
   * Static method to derive state from error.
   * Called when an error is caught by the boundary.
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    if (stryMutAct_9fa48("3428")) {
      {}
    } else {
      stryCov_9fa48("3428");
      // Generate unique error ID for tracking
      const errorId = stryMutAct_9fa48("3429") ? `` : (stryCov_9fa48("3429"), `error_${Date.now()}_${stryMutAct_9fa48("3430") ? Math.random().toString(36) : (stryCov_9fa48("3430"), Math.random().toString(36).substr(2, 9))}`);
      return stryMutAct_9fa48("3431") ? {} : (stryCov_9fa48("3431"), {
        hasError: stryMutAct_9fa48("3432") ? false : (stryCov_9fa48("3432"), true),
        error,
        errorId
      });
    }
  }

  /**
   * Lifecycle method called when an error is caught.
   * Used for error reporting and logging.
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (stryMutAct_9fa48("3433")) {
      {}
    } else {
      stryCov_9fa48("3433");
      this.setState(stryMutAct_9fa48("3434") ? {} : (stryCov_9fa48("3434"), {
        errorInfo
      }));

      // Report error to monitoring services
      this.reportError(error, errorInfo);

      // Call custom error handler if provided
      if (stryMutAct_9fa48("3436") ? false : stryMutAct_9fa48("3435") ? true : (stryCov_9fa48("3435", "3436"), this.props.onError)) {
        if (stryMutAct_9fa48("3437")) {
          {}
        } else {
          stryCov_9fa48("3437");
          this.props.onError(error, errorInfo);
        }
      }
    }
  }

  /**
   * Check if component should reset error state based on prop changes.
   */
  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    if (stryMutAct_9fa48("3438")) {
      {}
    } else {
      stryCov_9fa48("3438");
      const {
        resetOnPropsChange,
        resetKeys
      } = this.props;
      const {
        hasError
      } = this.state;
      if (stryMutAct_9fa48("3441") ? hasError && prevProps.resetOnPropsChange || resetOnPropsChange : stryMutAct_9fa48("3440") ? false : stryMutAct_9fa48("3439") ? true : (stryCov_9fa48("3439", "3440", "3441"), (stryMutAct_9fa48("3443") ? hasError || prevProps.resetOnPropsChange : stryMutAct_9fa48("3442") ? true : (stryCov_9fa48("3442", "3443"), hasError && prevProps.resetOnPropsChange)) && resetOnPropsChange)) {
        if (stryMutAct_9fa48("3444")) {
          {}
        } else {
          stryCov_9fa48("3444");
          this.resetErrorBoundary();
        }
      }
      if (stryMutAct_9fa48("3447") ? hasError && resetKeys || prevProps.resetKeys : stryMutAct_9fa48("3446") ? false : stryMutAct_9fa48("3445") ? true : (stryCov_9fa48("3445", "3446", "3447"), (stryMutAct_9fa48("3449") ? hasError || resetKeys : stryMutAct_9fa48("3448") ? true : (stryCov_9fa48("3448", "3449"), hasError && resetKeys)) && prevProps.resetKeys)) {
        if (stryMutAct_9fa48("3450")) {
          {}
        } else {
          stryCov_9fa48("3450");
          const hasResetKeyChanged = stryMutAct_9fa48("3451") ? resetKeys.every((key, idx) => prevProps.resetKeys?.[idx] !== key) : (stryCov_9fa48("3451"), resetKeys.some(stryMutAct_9fa48("3452") ? () => undefined : (stryCov_9fa48("3452"), (key, idx) => stryMutAct_9fa48("3455") ? prevProps.resetKeys?.[idx] === key : stryMutAct_9fa48("3454") ? false : stryMutAct_9fa48("3453") ? true : (stryCov_9fa48("3453", "3454", "3455"), (stryMutAct_9fa48("3456") ? prevProps.resetKeys[idx] : (stryCov_9fa48("3456"), prevProps.resetKeys?.[idx])) !== key))));
          if (stryMutAct_9fa48("3458") ? false : stryMutAct_9fa48("3457") ? true : (stryCov_9fa48("3457", "3458"), hasResetKeyChanged)) {
            if (stryMutAct_9fa48("3459")) {
              {}
            } else {
              stryCov_9fa48("3459");
              this.resetErrorBoundary();
            }
          }
        }
      }
    }
  }

  /**
   * Report error to external monitoring services.
   */
  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    if (stryMutAct_9fa48("3460")) {
      {}
    } else {
      stryCov_9fa48("3460");
      const {
        level = stryMutAct_9fa48("3461") ? "" : (stryCov_9fa48("3461"), 'component')
      } = this.props;
      const {
        errorId
      } = this.state;
      try {
        if (stryMutAct_9fa48("3462")) {
          {}
        } else {
          stryCov_9fa48("3462");
          // Create comprehensive error report
          const errorReport = stryMutAct_9fa48("3463") ? {} : (stryCov_9fa48("3463"), {
            errorId,
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            level,
            timestamp: new Date().toISOString(),
            userAgent: (stryMutAct_9fa48("3466") ? typeof window === 'undefined' : stryMutAct_9fa48("3465") ? false : stryMutAct_9fa48("3464") ? true : (stryCov_9fa48("3464", "3465", "3466"), typeof window !== (stryMutAct_9fa48("3467") ? "" : (stryCov_9fa48("3467"), 'undefined')))) ? window.navigator.userAgent : stryMutAct_9fa48("3468") ? "" : (stryCov_9fa48("3468"), 'Unknown'),
            url: (stryMutAct_9fa48("3471") ? typeof window === 'undefined' : stryMutAct_9fa48("3470") ? false : stryMutAct_9fa48("3469") ? true : (stryCov_9fa48("3469", "3470", "3471"), typeof window !== (stryMutAct_9fa48("3472") ? "" : (stryCov_9fa48("3472"), 'undefined')))) ? window.location.href : stryMutAct_9fa48("3473") ? "" : (stryCov_9fa48("3473"), 'Unknown')
          });

          // Report to PostHog
          if (stryMutAct_9fa48("3476") ? typeof window === 'undefined' : stryMutAct_9fa48("3475") ? false : stryMutAct_9fa48("3474") ? true : (stryCov_9fa48("3474", "3475", "3476"), typeof window !== (stryMutAct_9fa48("3477") ? "" : (stryCov_9fa48("3477"), 'undefined')))) {
            if (stryMutAct_9fa48("3478")) {
              {}
            } else {
              stryCov_9fa48("3478");
              const {
                trackEvent
              } = await import(stryMutAct_9fa48("3479") ? "" : (stryCov_9fa48("3479"), '@/lib/analytics'));
              trackEvent(stryMutAct_9fa48("3480") ? "" : (stryCov_9fa48("3480"), 'error_boundary_triggered'), errorReport);
            }
          }

          // Report to console in development
          if (stryMutAct_9fa48("3483") ? process.env.NODE_ENV !== 'development' : stryMutAct_9fa48("3482") ? false : stryMutAct_9fa48("3481") ? true : (stryCov_9fa48("3481", "3482", "3483"), process.env.NODE_ENV === (stryMutAct_9fa48("3484") ? "" : (stryCov_9fa48("3484"), 'development')))) {
            if (stryMutAct_9fa48("3485")) {
              {}
            } else {
              stryCov_9fa48("3485");
              console.group(stryMutAct_9fa48("3486") ? `` : (stryCov_9fa48("3486"), `🚨 Error Boundary Triggered [${level}]`));
              console.error(stryMutAct_9fa48("3487") ? "" : (stryCov_9fa48("3487"), 'Error:'), error);
              console.error(stryMutAct_9fa48("3488") ? "" : (stryCov_9fa48("3488"), 'Error Info:'), errorInfo);
              console.error(stryMutAct_9fa48("3489") ? "" : (stryCov_9fa48("3489"), 'Error Report:'), errorReport);
              console.groupEnd();
            }
          }

          // Report to Sentry if configured
          if (stryMutAct_9fa48("3492") ? process.env['NEXT_PUBLIC_SENTRY_DSN'] || typeof window !== 'undefined' : stryMutAct_9fa48("3491") ? false : stryMutAct_9fa48("3490") ? true : (stryCov_9fa48("3490", "3491", "3492"), process.env[stryMutAct_9fa48("3493") ? "" : (stryCov_9fa48("3493"), 'NEXT_PUBLIC_SENTRY_DSN')] && (stryMutAct_9fa48("3495") ? typeof window === 'undefined' : stryMutAct_9fa48("3494") ? true : (stryCov_9fa48("3494", "3495"), typeof window !== (stryMutAct_9fa48("3496") ? "" : (stryCov_9fa48("3496"), 'undefined')))))) {
            if (stryMutAct_9fa48("3497")) {
              {}
            } else {
              stryCov_9fa48("3497");
              // Dynamic import to avoid bundle bloat if Sentry not used
              const Sentry = await import(stryMutAct_9fa48("3498") ? "" : (stryCov_9fa48("3498"), '@sentry/react'));
              Sentry.withScope(scope => {
                if (stryMutAct_9fa48("3499")) {
                  {}
                } else {
                  stryCov_9fa48("3499");
                  scope.setTag(stryMutAct_9fa48("3500") ? "" : (stryCov_9fa48("3500"), 'errorBoundary'), stryMutAct_9fa48("3501") ? false : (stryCov_9fa48("3501"), true));
                  scope.setLevel(stryMutAct_9fa48("3502") ? "" : (stryCov_9fa48("3502"), 'error'));
                  scope.setContext(stryMutAct_9fa48("3503") ? "" : (stryCov_9fa48("3503"), 'errorInfo'), stryMutAct_9fa48("3504") ? {} : (stryCov_9fa48("3504"), {
                    componentStack: errorInfo.componentStack
                  }));
                  scope.setContext(stryMutAct_9fa48("3505") ? "" : (stryCov_9fa48("3505"), 'errorReport'), errorReport);
                  Sentry.captureException(error);
                }
              });
            }
          }
        }
      } catch (reportingError) {
        if (stryMutAct_9fa48("3506")) {
          {}
        } else {
          stryCov_9fa48("3506");
          console.error(stryMutAct_9fa48("3507") ? "" : (stryCov_9fa48("3507"), 'Failed to report error:'), reportingError);
        }
      }
    }
  };

  /**
   * Reset the error boundary state to allow retry.
   */
  private resetErrorBoundary = () => {
    if (stryMutAct_9fa48("3508")) {
      {}
    } else {
      stryCov_9fa48("3508");
      if (stryMutAct_9fa48("3510") ? false : stryMutAct_9fa48("3509") ? true : (stryCov_9fa48("3509", "3510"), this.retryTimeoutId)) {
        if (stryMutAct_9fa48("3511")) {
          {}
        } else {
          stryCov_9fa48("3511");
          clearTimeout(this.retryTimeoutId);
        }
      }
      this.setState(stryMutAct_9fa48("3512") ? {} : (stryCov_9fa48("3512"), {
        hasError: stryMutAct_9fa48("3513") ? true : (stryCov_9fa48("3513"), false),
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: 0
      }));
    }
  };

  /**
   * Retry rendering the component with exponential backoff.
   */
  private retryRender = () => {
    if (stryMutAct_9fa48("3514")) {
      {}
    } else {
      stryCov_9fa48("3514");
      const {
        retryCount
      } = this.state;
      if (stryMutAct_9fa48("3518") ? retryCount < this.maxRetries : stryMutAct_9fa48("3517") ? retryCount > this.maxRetries : stryMutAct_9fa48("3516") ? false : stryMutAct_9fa48("3515") ? true : (stryCov_9fa48("3515", "3516", "3517", "3518"), retryCount >= this.maxRetries)) {
        if (stryMutAct_9fa48("3519")) {
          {}
        } else {
          stryCov_9fa48("3519");
          return;
        }
      }

      // Exponential backoff: 1s, 2s, 4s
      const delay = stryMutAct_9fa48("3520") ? Math.pow(2, retryCount) / 1000 : (stryCov_9fa48("3520"), Math.pow(2, retryCount) * 1000);
      this.retryTimeoutId = window.setTimeout(() => {
        if (stryMutAct_9fa48("3521")) {
          {}
        } else {
          stryCov_9fa48("3521");
          this.setState(stryMutAct_9fa48("3522") ? () => undefined : (stryCov_9fa48("3522"), prevState => stryMutAct_9fa48("3523") ? {} : (stryCov_9fa48("3523"), {
            hasError: stryMutAct_9fa48("3524") ? true : (stryCov_9fa48("3524"), false),
            error: null,
            errorInfo: null,
            errorId: null,
            retryCount: stryMutAct_9fa48("3525") ? prevState.retryCount - 1 : (stryCov_9fa48("3525"), prevState.retryCount + 1)
          })));
        }
      }, delay);
    }
  };

  /**
   * Navigate to home page as recovery action.
   */
  private goHome = () => {
    if (stryMutAct_9fa48("3526")) {
      {}
    } else {
      stryCov_9fa48("3526");
      if (stryMutAct_9fa48("3529") ? typeof window === 'undefined' : stryMutAct_9fa48("3528") ? false : stryMutAct_9fa48("3527") ? true : (stryCov_9fa48("3527", "3528", "3529"), typeof window !== (stryMutAct_9fa48("3530") ? "" : (stryCov_9fa48("3530"), 'undefined')))) {
        if (stryMutAct_9fa48("3531")) {
          {}
        } else {
          stryCov_9fa48("3531");
          window.location.href = stryMutAct_9fa48("3532") ? "" : (stryCov_9fa48("3532"), '/');
        }
      }
    }
  };

  /**
   * Reload the current page as recovery action.
   */
  private reloadPage = () => {
    if (stryMutAct_9fa48("3533")) {
      {}
    } else {
      stryCov_9fa48("3533");
      if (stryMutAct_9fa48("3536") ? typeof window === 'undefined' : stryMutAct_9fa48("3535") ? false : stryMutAct_9fa48("3534") ? true : (stryCov_9fa48("3534", "3535", "3536"), typeof window !== (stryMutAct_9fa48("3537") ? "" : (stryCov_9fa48("3537"), 'undefined')))) {
        if (stryMutAct_9fa48("3538")) {
          {}
        } else {
          stryCov_9fa48("3538");
          window.location.reload();
        }
      }
    }
  };

  /**
   * Render fallback UI when error occurs.
   */
  private renderFallback = () => {
    if (stryMutAct_9fa48("3539")) {
      {}
    } else {
      stryCov_9fa48("3539");
      const {
        fallback,
        level = stryMutAct_9fa48("3540") ? "" : (stryCov_9fa48("3540"), 'component')
      } = this.props;
      const {
        error,
        errorId,
        retryCount
      } = this.state;

      // Use custom fallback if provided
      if (stryMutAct_9fa48("3542") ? false : stryMutAct_9fa48("3541") ? true : (stryCov_9fa48("3541", "3542"), fallback)) {
        if (stryMutAct_9fa48("3543")) {
          {}
        } else {
          stryCov_9fa48("3543");
          return fallback;
        }
      }

      // Default fallback UI based on error level
      const isProductionMode = stryMutAct_9fa48("3546") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("3545") ? false : stryMutAct_9fa48("3544") ? true : (stryCov_9fa48("3544", "3545", "3546"), process.env.NODE_ENV === (stryMutAct_9fa48("3547") ? "" : (stryCov_9fa48("3547"), 'production')));
      const canRetry = stryMutAct_9fa48("3551") ? retryCount >= this.maxRetries : stryMutAct_9fa48("3550") ? retryCount <= this.maxRetries : stryMutAct_9fa48("3549") ? false : stryMutAct_9fa48("3548") ? true : (stryCov_9fa48("3548", "3549", "3550", "3551"), retryCount < this.maxRetries);
      if (stryMutAct_9fa48("3554") ? level !== 'critical' : stryMutAct_9fa48("3553") ? false : stryMutAct_9fa48("3552") ? true : (stryCov_9fa48("3552", "3553", "3554"), level === (stryMutAct_9fa48("3555") ? "" : (stryCov_9fa48("3555"), 'critical')))) {
        if (stryMutAct_9fa48("3556")) {
          {}
        } else {
          stryCov_9fa48("3556");
          return <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
          <div className="max-w-md w-full">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>

              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Something went wrong
              </h1>

              <p className="text-gray-600 mb-6">
                We're experiencing technical difficulties. Our team has been notified and is working on a fix.
              </p>

              {stryMutAct_9fa48("3559") ? !isProductionMode && errorId || <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">Error ID:</p>
                  <p className="text-sm text-gray-600 font-mono break-all">{errorId}</p>
                  {error && <>
                      <p className="text-sm font-medium text-gray-700 mt-3 mb-1">Error Message:</p>
                      <p className="text-sm text-gray-600">{error.message}</p>
                    </>}
                </div> : stryMutAct_9fa48("3558") ? false : stryMutAct_9fa48("3557") ? true : (stryCov_9fa48("3557", "3558", "3559"), (stryMutAct_9fa48("3561") ? !isProductionMode || errorId : stryMutAct_9fa48("3560") ? true : (stryCov_9fa48("3560", "3561"), (stryMutAct_9fa48("3562") ? isProductionMode : (stryCov_9fa48("3562"), !isProductionMode)) && errorId)) && <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">Error ID:</p>
                  <p className="text-sm text-gray-600 font-mono break-all">{errorId}</p>
                  {stryMutAct_9fa48("3565") ? error || <>
                      <p className="text-sm font-medium text-gray-700 mt-3 mb-1">Error Message:</p>
                      <p className="text-sm text-gray-600">{error.message}</p>
                    </> : stryMutAct_9fa48("3564") ? false : stryMutAct_9fa48("3563") ? true : (stryCov_9fa48("3563", "3564", "3565"), error && <>
                      <p className="text-sm font-medium text-gray-700 mt-3 mb-1">Error Message:</p>
                      <p className="text-sm text-gray-600">{error.message}</p>
                    </>)}
                </div>)}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button onClick={this.reloadPage} className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </button>

                <button onClick={this.goHome} className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>;
        }
      }
      if (stryMutAct_9fa48("3568") ? level !== 'page' : stryMutAct_9fa48("3567") ? false : stryMutAct_9fa48("3566") ? true : (stryCov_9fa48("3566", "3567", "3568"), level === (stryMutAct_9fa48("3569") ? "" : (stryCov_9fa48("3569"), 'page')))) {
        if (stryMutAct_9fa48("3570")) {
          {}
        } else {
          stryCov_9fa48("3570");
          return <div className="min-h-[400px] flex items-center justify-center px-4">
          <div className="max-w-md w-full text-center">
            <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>

            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Page Error
            </h2>

            <p className="text-gray-600 mb-6">
              This page encountered an error. Please try again.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {stryMutAct_9fa48("3573") ? canRetry || <button onClick={this.retryRender} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button> : stryMutAct_9fa48("3572") ? false : stryMutAct_9fa48("3571") ? true : (stryCov_9fa48("3571", "3572", "3573"), canRetry && <button onClick={this.retryRender} className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>)}

              <button onClick={this.goHome} className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>;
        }
      }

      // Component level error
      return <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Component Error
            </h3>
            <p className="mt-1 text-sm text-red-700">
              This component failed to load. {stryMutAct_9fa48("3576") ? canRetry || 'Retrying automatically...' : stryMutAct_9fa48("3575") ? false : stryMutAct_9fa48("3574") ? true : (stryCov_9fa48("3574", "3575", "3576"), canRetry && (stryMutAct_9fa48("3577") ? "" : (stryCov_9fa48("3577"), 'Retrying automatically...')))}
            </p>
            {stryMutAct_9fa48("3580") ? canRetry || <div className="mt-3">
                <button onClick={this.retryRender} className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                  Retry Now
                </button>
              </div> : stryMutAct_9fa48("3579") ? false : stryMutAct_9fa48("3578") ? true : (stryCov_9fa48("3578", "3579", "3580"), canRetry && <div className="mt-3">
                <button onClick={this.retryRender} className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors">
                  Retry Now
                </button>
              </div>)}
          </div>
        </div>
      </div>;
    }
  };
  override render() {
    if (stryMutAct_9fa48("3581")) {
      {}
    } else {
      stryCov_9fa48("3581");
      if (stryMutAct_9fa48("3583") ? false : stryMutAct_9fa48("3582") ? true : (stryCov_9fa48("3582", "3583"), this.state.hasError)) {
        if (stryMutAct_9fa48("3584")) {
          {}
        } else {
          stryCov_9fa48("3584");
          return this.renderFallback();
        }
      }
      return this.props.children;
    }
  }
}

// ==============================================================================
// FUNCTIONAL WRAPPER COMPONENT
// ==============================================================================

/**
 * Functional wrapper for ErrorBoundary with default props.
 */
// interface ErrorBoundaryWrapperProps extends Omit<ErrorBoundaryProps, 'children'> {
//   children: ReactNode;
// }

export const withErrorBoundary = <P extends object,>(Component: React.ComponentType<P>, errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>) => {
  if (stryMutAct_9fa48("3585")) {
    {}
  } else {
    stryCov_9fa48("3585");
    const WrappedComponent = stryMutAct_9fa48("3586") ? () => undefined : (stryCov_9fa48("3586"), (() => {
      const WrappedComponent = (props: P) => <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>;
      return WrappedComponent;
    })());
    WrappedComponent.displayName = stryMutAct_9fa48("3587") ? `` : (stryCov_9fa48("3587"), `withErrorBoundary(${stryMutAct_9fa48("3590") ? Component.displayName && Component.name : stryMutAct_9fa48("3589") ? false : stryMutAct_9fa48("3588") ? true : (stryCov_9fa48("3588", "3589", "3590"), Component.displayName || Component.name)})`);
    return WrappedComponent;
  }
};

// ==============================================================================
// SPECIALIZED ERROR BOUNDARIES
// ==============================================================================

/**
 * Page-level error boundary for route components.
 */
export const PageErrorBoundary: React.FC<{
  children: ReactNode;
}> = stryMutAct_9fa48("3591") ? () => undefined : (stryCov_9fa48("3591"), (() => {
  const PageErrorBoundary: React.FC<{
    children: ReactNode;
  }> = ({
    children
  }) => <ErrorBoundary level="page" resetOnPropsChange={stryMutAct_9fa48("3592") ? false : (stryCov_9fa48("3592"), true)}>
    {children}
  </ErrorBoundary>;
  return PageErrorBoundary;
})());

/**
 * Critical error boundary for the entire application.
 */
export const AppErrorBoundary: React.FC<{
  children: ReactNode;
}> = stryMutAct_9fa48("3593") ? () => undefined : (stryCov_9fa48("3593"), (() => {
  const AppErrorBoundary: React.FC<{
    children: ReactNode;
  }> = ({
    children
  }) => <ErrorBoundary level="critical">
    {children}
  </ErrorBoundary>;
  return AppErrorBoundary;
})());

/**
 * Component-level error boundary for individual UI elements.
 */
export const ComponentErrorBoundary: React.FC<{
  children: ReactNode;
}> = stryMutAct_9fa48("3594") ? () => undefined : (stryCov_9fa48("3594"), (() => {
  const ComponentErrorBoundary: React.FC<{
    children: ReactNode;
  }> = ({
    children
  }) => <ErrorBoundary level="component">
    {children}
  </ErrorBoundary>;
  return ComponentErrorBoundary;
})());
export default ErrorBoundary;