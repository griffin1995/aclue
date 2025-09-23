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

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle, Home, Bug } from 'lucide-react';

// ==============================================================================
// TYPE DEFINITIONS
// ==============================================================================

/**
 * Props for the ErrorBoundary component.
 */
interface ErrorBoundaryProps {
  children: ReactNode;                    // Child components to wrap
  fallback?: ReactNode;                   // Custom fallback UI (optional)
  onError?: (error: Error, errorInfo: ErrorInfo) => void; // Custom error handler
  level?: 'page' | 'component' | 'critical'; // Error severity level
  resetOnPropsChange?: boolean;           // Reset error state when props change
  resetKeys?: Array<string | number>;     // Keys that trigger error state reset
}

/**
 * State interface for ErrorBoundary component.
 */
interface ErrorBoundaryState {
  hasError: boolean;                      // Whether an error has occurred
  error: Error | null;                    // The error object
  errorInfo: ErrorInfo | null;            // React error information
  errorId: string | null;                 // Unique error identifier
  retryCount: number;                     // Number of retry attempts
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

    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    };
  }

  /**
   * Static method to derive state from error.
   * Called when an error is caught by the boundary.
   */
  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    // Generate unique error ID for tracking
    const errorId = `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    return {
      hasError: true,
      error,
      errorId,
    };
  }

  /**
   * Lifecycle method called when an error is caught.
   * Used for error reporting and logging.
   */
  override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo });

    // Report error to monitoring services
    this.reportError(error, errorInfo);

    // Call custom error handler if provided
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  /**
   * Check if component should reset error state based on prop changes.
   */
  override componentDidUpdate(prevProps: ErrorBoundaryProps) {
    const { resetOnPropsChange, resetKeys } = this.props;
    const { hasError } = this.state;

    if (hasError && prevProps.resetOnPropsChange && resetOnPropsChange) {
      this.resetErrorBoundary();
    }

    if (hasError && resetKeys && prevProps.resetKeys) {
      const hasResetKeyChanged = resetKeys.some(
        (key, idx) => prevProps.resetKeys?.[idx] !== key
      );

      if (hasResetKeyChanged) {
        this.resetErrorBoundary();
      }
    }
  }

  /**
   * Report error to external monitoring services.
   */
  private reportError = async (error: Error, errorInfo: ErrorInfo) => {
    const { level = 'component' } = this.props;
    const { errorId } = this.state;

    try {
      // Create comprehensive error report
      const errorReport = {
        errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        level,
        timestamp: new Date().toISOString(),
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'Unknown',
        url: typeof window !== 'undefined' ? window.location.href : 'Unknown',
      };

      // Report to PostHog
      if (typeof window !== 'undefined') {
        const { trackEvent } = await import('@/lib/analytics');
        trackEvent('error_boundary_triggered', errorReport);
      }

      // Report to console in development
      if (process.env.NODE_ENV === 'development') {
        console.group(`🚨 Error Boundary Triggered [${level}]`);
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
        console.error('Error Report:', errorReport);
        console.groupEnd();
      }

      // Report to Sentry if configured
      if (process.env['NEXT_PUBLIC_SENTRY_DSN'] && typeof window !== 'undefined') {
        // Dynamic import to avoid bundle bloat if Sentry not used
        const Sentry = await import('@sentry/react');
        Sentry.withScope((scope) => {
          scope.setTag('errorBoundary', true);
          scope.setLevel('error');
          scope.setContext('errorInfo', { componentStack: errorInfo.componentStack });
          scope.setContext('errorReport', errorReport);
          Sentry.captureException(error);
        });
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  };

  /**
   * Reset the error boundary state to allow retry.
   */
  private resetErrorBoundary = () => {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: null,
      retryCount: 0,
    });
  };

  /**
   * Retry rendering the component with exponential backoff.
   */
  private retryRender = () => {
    const { retryCount } = this.state;

    if (retryCount >= this.maxRetries) {
      return;
    }

    // Exponential backoff: 1s, 2s, 4s
    const delay = Math.pow(2, retryCount) * 1000;

    this.retryTimeoutId = window.setTimeout(() => {
      this.setState(prevState => ({
        hasError: false,
        error: null,
        errorInfo: null,
        errorId: null,
        retryCount: prevState.retryCount + 1,
      }));
    }, delay);
  };

  /**
   * Navigate to home page as recovery action.
   */
  private goHome = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  /**
   * Reload the current page as recovery action.
   */
  private reloadPage = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  /**
   * Render fallback UI when error occurs.
   */
  private renderFallback = () => {
    const { fallback, level = 'component' } = this.props;
    const { error, errorId, retryCount } = this.state;

    // Use custom fallback if provided
    if (fallback) {
      return fallback;
    }

    // Default fallback UI based on error level
    const isProductionMode = process.env.NODE_ENV === 'production';
    const canRetry = retryCount < this.maxRetries;

    if (level === 'critical') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
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

              {!isProductionMode && errorId && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
                  <p className="text-sm font-medium text-gray-700 mb-1">Error ID:</p>
                  <p className="text-sm text-gray-600 font-mono break-all">{errorId}</p>
                  {error && (
                    <>
                      <p className="text-sm font-medium text-gray-700 mt-3 mb-1">Error Message:</p>
                      <p className="text-sm text-gray-600">{error.message}</p>
                    </>
                  )}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={this.reloadPage}
                  className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reload Page
                </button>

                <button
                  onClick={this.goHome}
                  className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (level === 'page') {
      return (
        <div className="min-h-[400px] flex items-center justify-center px-4">
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
              {canRetry && (
                <button
                  onClick={this.retryRender}
                  className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </button>
              )}

              <button
                onClick={this.goHome}
                className="inline-flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                <Home className="w-4 h-4 mr-2" />
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    // Component level error
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <Bug className="w-5 h-5 text-red-400" />
          </div>
          <div className="ml-3 flex-1">
            <h3 className="text-sm font-medium text-red-800">
              Component Error
            </h3>
            <p className="mt-1 text-sm text-red-700">
              This component failed to load. {canRetry && 'Retrying automatically...'}
            </p>
            {canRetry && (
              <div className="mt-3">
                <button
                  onClick={this.retryRender}
                  className="text-sm bg-red-100 text-red-800 px-3 py-1 rounded hover:bg-red-200 transition-colors"
                >
                  Retry Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  override render() {
    if (this.state.hasError) {
      return this.renderFallback();
    }

    return this.props.children;
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

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  const WrappedComponent = (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );

  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;

  return WrappedComponent;
};

// ==============================================================================
// SPECIALIZED ERROR BOUNDARIES
// ==============================================================================

/**
 * Page-level error boundary for route components.
 */
export const PageErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="page" resetOnPropsChange={true}>
    {children}
  </ErrorBoundary>
);

/**
 * Critical error boundary for the entire application.
 */
export const AppErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="critical">
    {children}
  </ErrorBoundary>
);

/**
 * Component-level error boundary for individual UI elements.
 */
export const ComponentErrorBoundary: React.FC<{ children: ReactNode }> = ({ children }) => (
  <ErrorBoundary level="component">
    {children}
  </ErrorBoundary>
);

export default ErrorBoundary;