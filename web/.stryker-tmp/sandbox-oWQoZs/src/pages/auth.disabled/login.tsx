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
import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormState } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Eye, EyeOff, Mail, Lock, Gift, ArrowLeft, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { appConfig } from '@/config';
import toast from 'react-hot-toast';

// =============================================================================
// ENTERPRISE-GRADE TYPE DEFINITIONS & VALIDATION
// =============================================================================

/**
 * Comprehensive login form validation schema with enterprise security requirements
 */
const loginSchema = z.object(stryMutAct_9fa48("12693") ? {} : (stryCov_9fa48("12693"), {
  email: stryMutAct_9fa48("12695") ? z.string().max(1, 'Email is required').email('Please enter a valid email address').max(320, 'Email address is too long') // RFC 5321 limit
  .transform(email => email.toLowerCase().trim()) : stryMutAct_9fa48("12694") ? z.string().min(1, 'Email is required').email('Please enter a valid email address').min(320, 'Email address is too long') // RFC 5321 limit
  .transform(email => email.toLowerCase().trim()) : (stryCov_9fa48("12694", "12695"), z.string().min(1, stryMutAct_9fa48("12696") ? "" : (stryCov_9fa48("12696"), 'Email is required')).email(stryMutAct_9fa48("12697") ? "" : (stryCov_9fa48("12697"), 'Please enter a valid email address')).max(320, stryMutAct_9fa48("12698") ? "" : (stryCov_9fa48("12698"), 'Email address is too long')) // RFC 5321 limit
  .transform(stryMutAct_9fa48("12699") ? () => undefined : (stryCov_9fa48("12699"), email => stryMutAct_9fa48("12701") ? email.toUpperCase().trim() : stryMutAct_9fa48("12700") ? email.toLowerCase() : (stryCov_9fa48("12700", "12701"), email.toLowerCase().trim())))),
  // Normalize email
  password: stryMutAct_9fa48("12704") ? z.string().max(1, 'Password is required').min(appConfig.validation.password.minLength, `Password must be at least ${appConfig.validation.password.minLength} characters`).max(128, 'Password is too long') : stryMutAct_9fa48("12703") ? z.string().min(1, 'Password is required').max(appConfig.validation.password.minLength, `Password must be at least ${appConfig.validation.password.minLength} characters`).max(128, 'Password is too long') : stryMutAct_9fa48("12702") ? z.string().min(1, 'Password is required').min(appConfig.validation.password.minLength, `Password must be at least ${appConfig.validation.password.minLength} characters`).min(128, 'Password is too long') : (stryCov_9fa48("12702", "12703", "12704"), z.string().min(1, stryMutAct_9fa48("12705") ? "" : (stryCov_9fa48("12705"), 'Password is required')).min(appConfig.validation.password.minLength, stryMutAct_9fa48("12706") ? `` : (stryCov_9fa48("12706"), `Password must be at least ${appConfig.validation.password.minLength} characters`)).max(128, stryMutAct_9fa48("12707") ? "" : (stryCov_9fa48("12707"), 'Password is too long'))),
  // Security best practice
  remember_me: z.boolean().optional().default(stryMutAct_9fa48("12708") ? true : (stryCov_9fa48("12708"), false))
}));
type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Comprehensive error types for enterprise error handling
 */
interface LoginError {
  type: 'VALIDATION' | 'AUTHENTICATION' | 'NETWORK' | 'SERVER' | 'RATE_LIMIT' | 'UNKNOWN';
  message: string;
  code?: string;
  status?: number;
  details?: Record<string, any>;
  timestamp: string;
  retryable: boolean;
  retryAfter?: number;
}

/**
 * Login attempt tracking for security and analytics
 */
interface LoginAttempt {
  timestamp: string;
  email: string;
  success: boolean;
  errorType?: string;
  userAgent: string;
  ipAddress?: string;
}

/**
 * Form state management for enterprise reliability
 */
interface LoginFormState {
  isSubmitting: boolean;
  hasError: boolean;
  errorCount: number;
  lastAttempt: LoginAttempt | null;
  isLocked: boolean;
  lockUntil: Date | null;
  retryCount: number;
  maxRetries: number;
}

// =============================================================================
// ENTERPRISE LOGIN SECURITY CONSTANTS
// =============================================================================

const SECURITY_CONFIG = {
  maxRetries: 5,
  lockoutDuration: 15 * 60 * 1000,
  // 15 minutes
  rateLimit: {
    window: 60 * 1000,
    // 1 minute
    maxAttempts: 3
  },
  timeouts: {
    submission: 30000,
    // 30 seconds
    retry: 2000,
    // 2 seconds
    navigation: 500 // 0.5 seconds
  }
} as const;

// =============================================================================
// ENTERPRISE-GRADE LOGIN COMPONENT - ERROR HANDLING FIXED 2025-07-05
// =============================================================================
//
// CRITICAL FIXES IMPLEMENTED:
// 1. Removed formState.hasError from submit button disabled condition
// 2. Added error clearing logic when user retries submission
// 3. Disabled PostHog autocapture to prevent form interference
// 4. Removed auto-retry logic that was hiding error messages
// 5. Fixed button state management to allow retry after errors
//
// VERIFIED ERROR HANDLING:
// - Backend returns 401 with "Invalid email or password" (tested 2025-07-05)
// - Error message displays correctly in UI
// - User can retry login after seeing error
// - No unwanted page refresh during error states
// - PostHog analytics doesn't interfere with form submission
//
// =============================================================================

export default function LoginPage() {
  if (stryMutAct_9fa48("12709")) {
    {}
  } else {
    stryCov_9fa48("12709");
    const router = useRouter();
    const {
      login
    } = useAuth();

    // =============================================================================
    // ENTERPRISE STATE MANAGEMENT
    // =============================================================================

    const [showPassword, setShowPassword] = useState<boolean>(stryMutAct_9fa48("12710") ? true : (stryCov_9fa48("12710"), false));
    const [currentError, setCurrentError] = useState<LoginError | null>(null);
    const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>(stryMutAct_9fa48("12711") ? ["Stryker was here"] : (stryCov_9fa48("12711"), []));

    // Advanced form state with enterprise security features
    const [formState, setFormState] = useState<LoginFormState>(stryMutAct_9fa48("12712") ? {} : (stryCov_9fa48("12712"), {
      isSubmitting: stryMutAct_9fa48("12713") ? true : (stryCov_9fa48("12713"), false),
      hasError: stryMutAct_9fa48("12714") ? true : (stryCov_9fa48("12714"), false),
      errorCount: 0,
      lastAttempt: null,
      isLocked: stryMutAct_9fa48("12715") ? true : (stryCov_9fa48("12715"), false),
      lockUntil: null,
      retryCount: 0,
      maxRetries: SECURITY_CONFIG.maxRetries
    }));

    // Simplified router event handling - removed complex debugging
    useEffect(() => {
      if (stryMutAct_9fa48("12716")) {
        {}
      } else {
        stryCov_9fa48("12716");
        const handleRouteChange = (url: string) => {
          if (stryMutAct_9fa48("12717")) {
            {}
          } else {
            stryCov_9fa48("12717");
            console.log(stryMutAct_9fa48("12718") ? "" : (stryCov_9fa48("12718"), 'Route change:'), url);
          }
        };
        router.events.on(stryMutAct_9fa48("12719") ? "" : (stryCov_9fa48("12719"), 'routeChangeComplete'), handleRouteChange);
        return () => {
          if (stryMutAct_9fa48("12720")) {
            {}
          } else {
            stryCov_9fa48("12720");
            router.events.off(stryMutAct_9fa48("12721") ? "" : (stryCov_9fa48("12721"), 'routeChangeComplete'), handleRouteChange);
          }
        };
      }
    }, stryMutAct_9fa48("12722") ? [] : (stryCov_9fa48("12722"), [router]));

    // Refs for enterprise-grade form management
    const formRef = useRef<HTMLFormElement>(null);
    const submitAttemptRef = useRef<number>(0);
    const lastSubmissionRef = useRef<number>(0);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const lockoutTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Security: Track browser fingerprint for analytics
    const browserFingerprint = useMemo(() => {
      if (stryMutAct_9fa48("12723")) {
        {}
      } else {
        stryCov_9fa48("12723");
        if (stryMutAct_9fa48("12726") ? typeof window !== 'undefined' : stryMutAct_9fa48("12725") ? false : stryMutAct_9fa48("12724") ? true : (stryCov_9fa48("12724", "12725", "12726"), typeof window === (stryMutAct_9fa48("12727") ? "" : (stryCov_9fa48("12727"), 'undefined')))) return stryMutAct_9fa48("12728") ? "" : (stryCov_9fa48("12728"), 'server');
        return stryMutAct_9fa48("12729") ? {} : (stryCov_9fa48("12729"), {
          userAgent: navigator.userAgent,
          language: navigator.language,
          platform: navigator.platform,
          cookieEnabled: navigator.cookieEnabled,
          onLine: navigator.onLine,
          screen: stryMutAct_9fa48("12730") ? {} : (stryCov_9fa48("12730"), {
            width: screen.width,
            height: screen.height,
            colorDepth: screen.colorDepth
          }),
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        });
      }
    }, stryMutAct_9fa48("12731") ? ["Stryker was here"] : (stryCov_9fa48("12731"), []));

    // =============================================================================
    // ENTERPRISE SECURITY HOOKS
    // =============================================================================

    // Cleanup timeouts on component unmount
    useEffect(() => {
      if (stryMutAct_9fa48("12732")) {
        {}
      } else {
        stryCov_9fa48("12732");
        return () => {
          if (stryMutAct_9fa48("12733")) {
            {}
          } else {
            stryCov_9fa48("12733");
            if (stryMutAct_9fa48("12735") ? false : stryMutAct_9fa48("12734") ? true : (stryCov_9fa48("12734", "12735"), timeoutRef.current)) clearTimeout(timeoutRef.current);
            if (stryMutAct_9fa48("12737") ? false : stryMutAct_9fa48("12736") ? true : (stryCov_9fa48("12736", "12737"), lockoutTimerRef.current)) clearTimeout(lockoutTimerRef.current);
          }
        };
      }
    }, stryMutAct_9fa48("12738") ? ["Stryker was here"] : (stryCov_9fa48("12738"), []));

    // Simplified lockout management
    useEffect(() => {
      if (stryMutAct_9fa48("12739")) {
        {}
      } else {
        stryCov_9fa48("12739");
        if (stryMutAct_9fa48("12742") ? formState.isLocked || formState.lockUntil : stryMutAct_9fa48("12741") ? false : stryMutAct_9fa48("12740") ? true : (stryCov_9fa48("12740", "12741", "12742"), formState.isLocked && formState.lockUntil)) {
          if (stryMutAct_9fa48("12743")) {
            {}
          } else {
            stryCov_9fa48("12743");
            const now = Date.now();
            const lockDuration = stryMutAct_9fa48("12744") ? formState.lockUntil.getTime() + now : (stryCov_9fa48("12744"), formState.lockUntil.getTime() - now);
            if (stryMutAct_9fa48("12748") ? lockDuration <= 0 : stryMutAct_9fa48("12747") ? lockDuration >= 0 : stryMutAct_9fa48("12746") ? false : stryMutAct_9fa48("12745") ? true : (stryCov_9fa48("12745", "12746", "12747", "12748"), lockDuration > 0)) {
              if (stryMutAct_9fa48("12749")) {
                {}
              } else {
                stryCov_9fa48("12749");
                lockoutTimerRef.current = setTimeout(() => {
                  if (stryMutAct_9fa48("12750")) {
                    {}
                  } else {
                    stryCov_9fa48("12750");
                    setFormState(stryMutAct_9fa48("12751") ? () => undefined : (stryCov_9fa48("12751"), prev => stryMutAct_9fa48("12752") ? {} : (stryCov_9fa48("12752"), {
                      ...prev,
                      isLocked: stryMutAct_9fa48("12753") ? true : (stryCov_9fa48("12753"), false),
                      lockUntil: null,
                      retryCount: 0,
                      errorCount: 0
                    })));
                    setCurrentError(null);
                  }
                }, lockDuration);
              }
            }
          }
        }
        return () => {
          if (stryMutAct_9fa48("12754")) {
            {}
          } else {
            stryCov_9fa48("12754");
            if (stryMutAct_9fa48("12756") ? false : stryMutAct_9fa48("12755") ? true : (stryCov_9fa48("12755", "12756"), lockoutTimerRef.current)) {
              if (stryMutAct_9fa48("12757")) {
                {}
              } else {
                stryCov_9fa48("12757");
                clearTimeout(lockoutTimerRef.current);
              }
            }
          }
        };
      }
    }, stryMutAct_9fa48("12758") ? [] : (stryCov_9fa48("12758"), [formState.isLocked, formState.lockUntil]));

    // =============================================================================
    // ENTERPRISE REACT-HOOK-FORM CONFIGURATION
    // =============================================================================

    const {
      register,
      handleSubmit,
      formState: {
        errors,
        isSubmitting,
        isDirty,
        isValid
      },
      setError,
      clearErrors,
      reset,
      watch,
      getValues,
      trigger
    } = useForm<LoginFormData>(stryMutAct_9fa48("12759") ? {} : (stryCov_9fa48("12759"), {
      resolver: zodResolver(loginSchema),
      mode: stryMutAct_9fa48("12760") ? "" : (stryCov_9fa48("12760"), 'onChange'),
      // Real-time validation for enterprise UX
      reValidateMode: stryMutAct_9fa48("12761") ? "" : (stryCov_9fa48("12761"), 'onChange'),
      defaultValues: stryMutAct_9fa48("12762") ? {} : (stryCov_9fa48("12762"), {
        email: stryMutAct_9fa48("12763") ? "Stryker was here!" : (stryCov_9fa48("12763"), ''),
        password: stryMutAct_9fa48("12764") ? "Stryker was here!" : (stryCov_9fa48("12764"), ''),
        remember_me: stryMutAct_9fa48("12765") ? true : (stryCov_9fa48("12765"), false)
      }),
      shouldFocusError: stryMutAct_9fa48("12766") ? false : (stryCov_9fa48("12766"), true),
      shouldUnregister: stryMutAct_9fa48("12767") ? true : (stryCov_9fa48("12767"), false),
      shouldUseNativeValidation: stryMutAct_9fa48("12768") ? true : (stryCov_9fa48("12768"), false),
      criteriaMode: stryMutAct_9fa48("12769") ? "" : (stryCov_9fa48("12769"), 'all') // Show all validation errors
    }));

    // Watch form fields for enterprise-grade real-time validation
    const watchedEmail = watch(stryMutAct_9fa48("12770") ? "" : (stryCov_9fa48("12770"), 'email'));
    const watchedPassword = watch(stryMutAct_9fa48("12771") ? "" : (stryCov_9fa48("12771"), 'password'));

    // =============================================================================
    // ENTERPRISE ERROR ANALYSIS & CLASSIFICATION
    // =============================================================================

    /**
     * Enterprise-grade error classification and analysis
     */
    const classifyError = useCallback((error: any): LoginError => {
      if (stryMutAct_9fa48("12772")) {
        {}
      } else {
        stryCov_9fa48("12772");
        const timestamp = new Date().toISOString();

        // Network errors
        if (stryMutAct_9fa48("12775") ? error.code === 'NETWORK_ERROR' && !navigator.onLine : stryMutAct_9fa48("12774") ? false : stryMutAct_9fa48("12773") ? true : (stryCov_9fa48("12773", "12774", "12775"), (stryMutAct_9fa48("12777") ? error.code !== 'NETWORK_ERROR' : stryMutAct_9fa48("12776") ? false : (stryCov_9fa48("12776", "12777"), error.code === (stryMutAct_9fa48("12778") ? "" : (stryCov_9fa48("12778"), 'NETWORK_ERROR')))) || (stryMutAct_9fa48("12779") ? navigator.onLine : (stryCov_9fa48("12779"), !navigator.onLine)))) {
          if (stryMutAct_9fa48("12780")) {
            {}
          } else {
            stryCov_9fa48("12780");
            return stryMutAct_9fa48("12781") ? {} : (stryCov_9fa48("12781"), {
              type: stryMutAct_9fa48("12782") ? "" : (stryCov_9fa48("12782"), 'NETWORK'),
              message: stryMutAct_9fa48("12783") ? "" : (stryCov_9fa48("12783"), 'Network connection failed. Please check your internet connection and try again.'),
              code: stryMutAct_9fa48("12784") ? "" : (stryCov_9fa48("12784"), 'NETWORK_ERROR'),
              timestamp,
              retryable: stryMutAct_9fa48("12785") ? false : (stryCov_9fa48("12785"), true),
              retryAfter: SECURITY_CONFIG.timeouts.retry
            });
          }
        }

        // Rate limiting errors
        if (stryMutAct_9fa48("12788") ? error.status === 429 && error.code === 'RATE_LIMITED' : stryMutAct_9fa48("12787") ? false : stryMutAct_9fa48("12786") ? true : (stryCov_9fa48("12786", "12787", "12788"), (stryMutAct_9fa48("12790") ? error.status !== 429 : stryMutAct_9fa48("12789") ? false : (stryCov_9fa48("12789", "12790"), error.status === 429)) || (stryMutAct_9fa48("12792") ? error.code !== 'RATE_LIMITED' : stryMutAct_9fa48("12791") ? false : (stryCov_9fa48("12791", "12792"), error.code === (stryMutAct_9fa48("12793") ? "" : (stryCov_9fa48("12793"), 'RATE_LIMITED')))))) {
          if (stryMutAct_9fa48("12794")) {
            {}
          } else {
            stryCov_9fa48("12794");
            return stryMutAct_9fa48("12795") ? {} : (stryCov_9fa48("12795"), {
              type: stryMutAct_9fa48("12796") ? "" : (stryCov_9fa48("12796"), 'RATE_LIMIT'),
              message: stryMutAct_9fa48("12797") ? "" : (stryCov_9fa48("12797"), 'Too many login attempts. Please wait before trying again.'),
              code: stryMutAct_9fa48("12798") ? "" : (stryCov_9fa48("12798"), 'RATE_LIMITED'),
              status: 429,
              timestamp,
              retryable: stryMutAct_9fa48("12799") ? false : (stryCov_9fa48("12799"), true),
              retryAfter: stryMutAct_9fa48("12802") ? error.retryAfter && SECURITY_CONFIG.rateLimit.window : stryMutAct_9fa48("12801") ? false : stryMutAct_9fa48("12800") ? true : (stryCov_9fa48("12800", "12801", "12802"), error.retryAfter || SECURITY_CONFIG.rateLimit.window)
            });
          }
        }

        // Authentication errors
        if (stryMutAct_9fa48("12805") ? error.status === 401 && error.message?.includes('Invalid email or password') : stryMutAct_9fa48("12804") ? false : stryMutAct_9fa48("12803") ? true : (stryCov_9fa48("12803", "12804", "12805"), (stryMutAct_9fa48("12807") ? error.status !== 401 : stryMutAct_9fa48("12806") ? false : (stryCov_9fa48("12806", "12807"), error.status === 401)) || (stryMutAct_9fa48("12808") ? error.message.includes('Invalid email or password') : (stryCov_9fa48("12808"), error.message?.includes(stryMutAct_9fa48("12809") ? "" : (stryCov_9fa48("12809"), 'Invalid email or password')))))) {
          if (stryMutAct_9fa48("12810")) {
            {}
          } else {
            stryCov_9fa48("12810");
            return stryMutAct_9fa48("12811") ? {} : (stryCov_9fa48("12811"), {
              type: stryMutAct_9fa48("12812") ? "" : (stryCov_9fa48("12812"), 'AUTHENTICATION'),
              message: stryMutAct_9fa48("12813") ? "" : (stryCov_9fa48("12813"), 'Invalid email or password. Please check your credentials and try again.'),
              code: stryMutAct_9fa48("12814") ? "" : (stryCov_9fa48("12814"), 'INVALID_CREDENTIALS'),
              status: 401,
              timestamp,
              retryable: stryMutAct_9fa48("12815") ? false : (stryCov_9fa48("12815"), true),
              details: error.details
            });
          }
        }

        // Validation errors
        if (stryMutAct_9fa48("12818") ? error.status === 422 && error.type === 'VALIDATION_ERROR' : stryMutAct_9fa48("12817") ? false : stryMutAct_9fa48("12816") ? true : (stryCov_9fa48("12816", "12817", "12818"), (stryMutAct_9fa48("12820") ? error.status !== 422 : stryMutAct_9fa48("12819") ? false : (stryCov_9fa48("12819", "12820"), error.status === 422)) || (stryMutAct_9fa48("12822") ? error.type !== 'VALIDATION_ERROR' : stryMutAct_9fa48("12821") ? false : (stryCov_9fa48("12821", "12822"), error.type === (stryMutAct_9fa48("12823") ? "" : (stryCov_9fa48("12823"), 'VALIDATION_ERROR')))))) {
          if (stryMutAct_9fa48("12824")) {
            {}
          } else {
            stryCov_9fa48("12824");
            return stryMutAct_9fa48("12825") ? {} : (stryCov_9fa48("12825"), {
              type: stryMutAct_9fa48("12826") ? "" : (stryCov_9fa48("12826"), 'VALIDATION'),
              message: stryMutAct_9fa48("12827") ? "" : (stryCov_9fa48("12827"), 'Please check your input and try again.'),
              code: stryMutAct_9fa48("12828") ? "" : (stryCov_9fa48("12828"), 'VALIDATION_ERROR'),
              status: 422,
              timestamp,
              retryable: stryMutAct_9fa48("12829") ? false : (stryCov_9fa48("12829"), true),
              details: error.details
            });
          }
        }

        // Server errors
        if (stryMutAct_9fa48("12833") ? error.status < 500 : stryMutAct_9fa48("12832") ? error.status > 500 : stryMutAct_9fa48("12831") ? false : stryMutAct_9fa48("12830") ? true : (stryCov_9fa48("12830", "12831", "12832", "12833"), error.status >= 500)) {
          if (stryMutAct_9fa48("12834")) {
            {}
          } else {
            stryCov_9fa48("12834");
            return stryMutAct_9fa48("12835") ? {} : (stryCov_9fa48("12835"), {
              type: stryMutAct_9fa48("12836") ? "" : (stryCov_9fa48("12836"), 'SERVER'),
              message: stryMutAct_9fa48("12837") ? "" : (stryCov_9fa48("12837"), 'Server error occurred. Our team has been notified. Please try again later.'),
              code: stryMutAct_9fa48("12838") ? "" : (stryCov_9fa48("12838"), 'SERVER_ERROR'),
              status: error.status,
              timestamp,
              retryable: stryMutAct_9fa48("12839") ? false : (stryCov_9fa48("12839"), true),
              retryAfter: stryMutAct_9fa48("12840") ? SECURITY_CONFIG.timeouts.retry / 2 : (stryCov_9fa48("12840"), SECURITY_CONFIG.timeouts.retry * 2)
            });
          }
        }

        // Unknown errors
        return stryMutAct_9fa48("12841") ? {} : (stryCov_9fa48("12841"), {
          type: stryMutAct_9fa48("12842") ? "" : (stryCov_9fa48("12842"), 'UNKNOWN'),
          message: stryMutAct_9fa48("12843") ? "" : (stryCov_9fa48("12843"), 'An unexpected error occurred. Please try again.'),
          code: stryMutAct_9fa48("12844") ? "" : (stryCov_9fa48("12844"), 'UNKNOWN_ERROR'),
          timestamp,
          retryable: stryMutAct_9fa48("12845") ? false : (stryCov_9fa48("12845"), true),
          details: stryMutAct_9fa48("12846") ? {} : (stryCov_9fa48("12846"), {
            originalError: error
          })
        });
      }
    }, stryMutAct_9fa48("12847") ? ["Stryker was here"] : (stryCov_9fa48("12847"), []));

    /**
     * Enterprise-grade rate limiting check
     */
    const checkRateLimit = useCallback((): boolean => {
      if (stryMutAct_9fa48("12848")) {
        {}
      } else {
        stryCov_9fa48("12848");
        const now = Date.now();
        const recentAttempts = stryMutAct_9fa48("12849") ? loginHistory : (stryCov_9fa48("12849"), loginHistory.filter(stryMutAct_9fa48("12850") ? () => undefined : (stryCov_9fa48("12850"), attempt => stryMutAct_9fa48("12854") ? now - new Date(attempt.timestamp).getTime() >= SECURITY_CONFIG.rateLimit.window : stryMutAct_9fa48("12853") ? now - new Date(attempt.timestamp).getTime() <= SECURITY_CONFIG.rateLimit.window : stryMutAct_9fa48("12852") ? false : stryMutAct_9fa48("12851") ? true : (stryCov_9fa48("12851", "12852", "12853", "12854"), (stryMutAct_9fa48("12855") ? now + new Date(attempt.timestamp).getTime() : (stryCov_9fa48("12855"), now - new Date(attempt.timestamp).getTime())) < SECURITY_CONFIG.rateLimit.window))));
        return stryMutAct_9fa48("12859") ? recentAttempts.length < SECURITY_CONFIG.rateLimit.maxAttempts : stryMutAct_9fa48("12858") ? recentAttempts.length > SECURITY_CONFIG.rateLimit.maxAttempts : stryMutAct_9fa48("12857") ? false : stryMutAct_9fa48("12856") ? true : (stryCov_9fa48("12856", "12857", "12858", "12859"), recentAttempts.length >= SECURITY_CONFIG.rateLimit.maxAttempts);
      }
    }, stryMutAct_9fa48("12860") ? [] : (stryCov_9fa48("12860"), [loginHistory]));

    /**
     * Enterprise security lockout check
     */
    const shouldLockAccount = useCallback((): boolean => {
      if (stryMutAct_9fa48("12861")) {
        {}
      } else {
        stryCov_9fa48("12861");
        return stryMutAct_9fa48("12865") ? formState.errorCount < formState.maxRetries : stryMutAct_9fa48("12864") ? formState.errorCount > formState.maxRetries : stryMutAct_9fa48("12863") ? false : stryMutAct_9fa48("12862") ? true : (stryCov_9fa48("12862", "12863", "12864", "12865"), formState.errorCount >= formState.maxRetries);
      }
    }, stryMutAct_9fa48("12866") ? [] : (stryCov_9fa48("12866"), [formState.errorCount, formState.maxRetries]));

    // =============================================================================
    // ENTERPRISE-GRADE FORM SUBMISSION HANDLER
    // =============================================================================

    /**
     * Simplified login form submission - PostHog removed to fix page refresh issue
     */
    const onSubmit = useCallback(async (data: LoginFormData): Promise<void> => {
      if (stryMutAct_9fa48("12867")) {
        {}
      } else {
        stryCov_9fa48("12867");
        console.log(stryMutAct_9fa48("12868") ? "" : (stryCov_9fa48("12868"), '🔐 Login form submission started'));
        console.log(stryMutAct_9fa48("12869") ? "" : (stryCov_9fa48("12869"), 'Form data:'), stryMutAct_9fa48("12870") ? {} : (stryCov_9fa48("12870"), {
          email: data.email,
          remember_me: data.remember_me
        }));
        try {
          if (stryMutAct_9fa48("12871")) {
            {}
          } else {
            stryCov_9fa48("12871");
            // Clear previous errors
            setCurrentError(null);
            setFormState(stryMutAct_9fa48("12872") ? () => undefined : (stryCov_9fa48("12872"), prev => stryMutAct_9fa48("12873") ? {} : (stryCov_9fa48("12873"), {
              ...prev,
              isSubmitting: stryMutAct_9fa48("12874") ? false : (stryCov_9fa48("12874"), true),
              hasError: stryMutAct_9fa48("12875") ? true : (stryCov_9fa48("12875"), false)
            })));
            clearErrors();

            // Attempt login
            await login(data);

            // Success - login function will handle navigation
            console.log(stryMutAct_9fa48("12876") ? "" : (stryCov_9fa48("12876"), '✅ Login successful'));
          }
        } catch (error: any) {
          if (stryMutAct_9fa48("12877")) {
            {}
          } else {
            stryCov_9fa48("12877");
            console.error(stryMutAct_9fa48("12878") ? "" : (stryCov_9fa48("12878"), '❌ Login error:'), error);

            // Stop loading
            setFormState(stryMutAct_9fa48("12879") ? () => undefined : (stryCov_9fa48("12879"), prev => stryMutAct_9fa48("12880") ? {} : (stryCov_9fa48("12880"), {
              ...prev,
              isSubmitting: stryMutAct_9fa48("12881") ? true : (stryCov_9fa48("12881"), false),
              hasError: stryMutAct_9fa48("12882") ? false : (stryCov_9fa48("12882"), true)
            })));

            // Classify and display error
            const classifiedError = classifyError(error);
            setCurrentError(classifiedError);

            // Set field-level errors for better UX
            if (stryMutAct_9fa48("12885") ? classifiedError.type !== 'AUTHENTICATION' : stryMutAct_9fa48("12884") ? false : stryMutAct_9fa48("12883") ? true : (stryCov_9fa48("12883", "12884", "12885"), classifiedError.type === (stryMutAct_9fa48("12886") ? "" : (stryCov_9fa48("12886"), 'AUTHENTICATION')))) {
              if (stryMutAct_9fa48("12887")) {
                {}
              } else {
                stryCov_9fa48("12887");
                setError(stryMutAct_9fa48("12888") ? "" : (stryCov_9fa48("12888"), 'email'), stryMutAct_9fa48("12889") ? {} : (stryCov_9fa48("12889"), {
                  message: stryMutAct_9fa48("12890") ? "" : (stryCov_9fa48("12890"), 'Invalid email or password'),
                  type: stryMutAct_9fa48("12891") ? "" : (stryCov_9fa48("12891"), 'manual')
                }));
                setError(stryMutAct_9fa48("12892") ? "" : (stryCov_9fa48("12892"), 'password'), stryMutAct_9fa48("12893") ? {} : (stryCov_9fa48("12893"), {
                  message: stryMutAct_9fa48("12894") ? "" : (stryCov_9fa48("12894"), 'Invalid email or password'),
                  type: stryMutAct_9fa48("12895") ? "" : (stryCov_9fa48("12895"), 'manual')
                }));
              }
            } else {
              if (stryMutAct_9fa48("12896")) {
                {}
              } else {
                stryCov_9fa48("12896");
                setError(stryMutAct_9fa48("12897") ? "" : (stryCov_9fa48("12897"), 'password'), stryMutAct_9fa48("12898") ? {} : (stryCov_9fa48("12898"), {
                  message: classifiedError.message,
                  type: stryMutAct_9fa48("12899") ? "" : (stryCov_9fa48("12899"), 'manual')
                }));
              }
            }

            // CRITICAL: Stay on login page to show error
            console.log(stryMutAct_9fa48("12900") ? "" : (stryCov_9fa48("12900"), '🛑 Error displayed - staying on login page'));
          }
        }
      }
    }, stryMutAct_9fa48("12901") ? [] : (stryCov_9fa48("12901"), [login, classifyError, clearErrors, setError]));
    return <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex flex-col">
      {/* Header */}
      <header className="p-6">
        <Link href="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          {/* Logo and Title */}
          <motion.div className="text-center mb-8" initial={stryMutAct_9fa48("12902") ? {} : (stryCov_9fa48("12902"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("12903") ? {} : (stryCov_9fa48("12903"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12904") ? {} : (stryCov_9fa48("12904"), {
            duration: 0.5
          })}>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center border border-gray-200">
                <Image src="/logo.png" alt="aclue logo" width={24} height={24} className="rounded-lg" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">aclue</h1>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Welcome back
            </h2>
            <p className="text-gray-600">
              Sign in to continue discovering amazing gifts
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div className="bg-white rounded-2xl shadow-xl p-8" initial={stryMutAct_9fa48("12905") ? {} : (stryCov_9fa48("12905"), {
            opacity: 0,
            y: 20
          })} animate={stryMutAct_9fa48("12906") ? {} : (stryCov_9fa48("12906"), {
            opacity: 1,
            y: 0
          })} transition={stryMutAct_9fa48("12907") ? {} : (stryCov_9fa48("12907"), {
            duration: 0.5,
            delay: 0.1
          })}>
            <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register(stryMutAct_9fa48("12908") ? "" : (stryCov_9fa48("12908"), 'email'))} type="email" id="email" className={stryMutAct_9fa48("12909") ? `` : (stryCov_9fa48("12909"), `block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 ${errors.email ? stryMutAct_9fa48("12910") ? "" : (stryCov_9fa48("12910"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("12911") ? "" : (stryCov_9fa48("12911"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Enter your email" disabled={formState.isSubmitting} autoComplete="email" autoCapitalize="none" autoCorrect="off" />
                </div>
                {stryMutAct_9fa48("12914") ? errors.email || <p className="mt-1 text-sm text-red-600">{errors.email.message}</p> : stryMutAct_9fa48("12913") ? false : stryMutAct_9fa48("12912") ? true : (stryCov_9fa48("12912", "12913", "12914"), errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>)}
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input {...register(stryMutAct_9fa48("12915") ? "" : (stryCov_9fa48("12915"), 'password'))} type={showPassword ? stryMutAct_9fa48("12916") ? "" : (stryCov_9fa48("12916"), 'text') : stryMutAct_9fa48("12917") ? "" : (stryCov_9fa48("12917"), 'password')} id="password" className={stryMutAct_9fa48("12918") ? `` : (stryCov_9fa48("12918"), `block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-gray-900 ${errors.password ? stryMutAct_9fa48("12919") ? "" : (stryCov_9fa48("12919"), 'border-red-300 bg-red-50') : stryMutAct_9fa48("12920") ? "" : (stryCov_9fa48("12920"), 'border-gray-300 hover:border-gray-400')}`)} placeholder="Enter your password" disabled={formState.isSubmitting} autoComplete="current-password" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={stryMutAct_9fa48("12921") ? () => undefined : (stryCov_9fa48("12921"), () => setShowPassword(stryMutAct_9fa48("12922") ? showPassword : (stryCov_9fa48("12922"), !showPassword)))}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
                {stryMutAct_9fa48("12925") ? errors.password || <p className="mt-1 text-sm text-red-600">{errors.password.message}</p> : stryMutAct_9fa48("12924") ? false : stryMutAct_9fa48("12923") ? true : (stryCov_9fa48("12923", "12924", "12925"), errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>)}
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input {...register(stryMutAct_9fa48("12926") ? "" : (stryCov_9fa48("12926"), 'remember_me'))} id="remember_me" type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" disabled={formState.isSubmitting} />
                  <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-500 font-medium">
                  Forgot password?
                </Link>
              </div>

              {/* Enterprise Error Display */}
              <AnimatePresence mode="wait">
                {stryMutAct_9fa48("12929") ? currentError || <motion.div initial={{
                  opacity: 0,
                  y: -10
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -10
                }} className={`p-4 rounded-lg flex items-start gap-3 ${currentError.type === 'RATE_LIMIT' || currentError.type === 'SERVER' ? 'bg-red-50 border border-red-200' : 'bg-amber-50 border border-amber-200'}`}>
                    <AlertCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${currentError.type === 'RATE_LIMIT' || currentError.type === 'SERVER' ? 'text-red-600' : 'text-amber-600'}`} />
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${currentError.type === 'RATE_LIMIT' || currentError.type === 'SERVER' ? 'text-red-800' : 'text-amber-800'}`}>
                        {currentError.message}
                      </p>
                      {currentError.retryAfter && <p className="text-xs text-gray-600 mt-1">
                          Retry in {Math.ceil(currentError.retryAfter / 1000)} seconds
                        </p>}
                    </div>
                  </motion.div> : stryMutAct_9fa48("12928") ? false : stryMutAct_9fa48("12927") ? true : (stryCov_9fa48("12927", "12928", "12929"), currentError && <motion.div initial={stryMutAct_9fa48("12930") ? {} : (stryCov_9fa48("12930"), {
                  opacity: 0,
                  y: stryMutAct_9fa48("12931") ? +10 : (stryCov_9fa48("12931"), -10)
                })} animate={stryMutAct_9fa48("12932") ? {} : (stryCov_9fa48("12932"), {
                  opacity: 1,
                  y: 0
                })} exit={stryMutAct_9fa48("12933") ? {} : (stryCov_9fa48("12933"), {
                  opacity: 0,
                  y: stryMutAct_9fa48("12934") ? +10 : (stryCov_9fa48("12934"), -10)
                })} className={stryMutAct_9fa48("12935") ? `` : (stryCov_9fa48("12935"), `p-4 rounded-lg flex items-start gap-3 ${(stryMutAct_9fa48("12938") ? currentError.type === 'RATE_LIMIT' && currentError.type === 'SERVER' : stryMutAct_9fa48("12937") ? false : stryMutAct_9fa48("12936") ? true : (stryCov_9fa48("12936", "12937", "12938"), (stryMutAct_9fa48("12940") ? currentError.type !== 'RATE_LIMIT' : stryMutAct_9fa48("12939") ? false : (stryCov_9fa48("12939", "12940"), currentError.type === (stryMutAct_9fa48("12941") ? "" : (stryCov_9fa48("12941"), 'RATE_LIMIT')))) || (stryMutAct_9fa48("12943") ? currentError.type !== 'SERVER' : stryMutAct_9fa48("12942") ? false : (stryCov_9fa48("12942", "12943"), currentError.type === (stryMutAct_9fa48("12944") ? "" : (stryCov_9fa48("12944"), 'SERVER')))))) ? stryMutAct_9fa48("12945") ? "" : (stryCov_9fa48("12945"), 'bg-red-50 border border-red-200') : stryMutAct_9fa48("12946") ? "" : (stryCov_9fa48("12946"), 'bg-amber-50 border border-amber-200')}`)}>
                    <AlertCircle className={stryMutAct_9fa48("12947") ? `` : (stryCov_9fa48("12947"), `w-5 h-5 mt-0.5 flex-shrink-0 ${(stryMutAct_9fa48("12950") ? currentError.type === 'RATE_LIMIT' && currentError.type === 'SERVER' : stryMutAct_9fa48("12949") ? false : stryMutAct_9fa48("12948") ? true : (stryCov_9fa48("12948", "12949", "12950"), (stryMutAct_9fa48("12952") ? currentError.type !== 'RATE_LIMIT' : stryMutAct_9fa48("12951") ? false : (stryCov_9fa48("12951", "12952"), currentError.type === (stryMutAct_9fa48("12953") ? "" : (stryCov_9fa48("12953"), 'RATE_LIMIT')))) || (stryMutAct_9fa48("12955") ? currentError.type !== 'SERVER' : stryMutAct_9fa48("12954") ? false : (stryCov_9fa48("12954", "12955"), currentError.type === (stryMutAct_9fa48("12956") ? "" : (stryCov_9fa48("12956"), 'SERVER')))))) ? stryMutAct_9fa48("12957") ? "" : (stryCov_9fa48("12957"), 'text-red-600') : stryMutAct_9fa48("12958") ? "" : (stryCov_9fa48("12958"), 'text-amber-600')}`)} />
                    <div className="flex-1">
                      <p className={stryMutAct_9fa48("12959") ? `` : (stryCov_9fa48("12959"), `text-sm font-medium ${(stryMutAct_9fa48("12962") ? currentError.type === 'RATE_LIMIT' && currentError.type === 'SERVER' : stryMutAct_9fa48("12961") ? false : stryMutAct_9fa48("12960") ? true : (stryCov_9fa48("12960", "12961", "12962"), (stryMutAct_9fa48("12964") ? currentError.type !== 'RATE_LIMIT' : stryMutAct_9fa48("12963") ? false : (stryCov_9fa48("12963", "12964"), currentError.type === (stryMutAct_9fa48("12965") ? "" : (stryCov_9fa48("12965"), 'RATE_LIMIT')))) || (stryMutAct_9fa48("12967") ? currentError.type !== 'SERVER' : stryMutAct_9fa48("12966") ? false : (stryCov_9fa48("12966", "12967"), currentError.type === (stryMutAct_9fa48("12968") ? "" : (stryCov_9fa48("12968"), 'SERVER')))))) ? stryMutAct_9fa48("12969") ? "" : (stryCov_9fa48("12969"), 'text-red-800') : stryMutAct_9fa48("12970") ? "" : (stryCov_9fa48("12970"), 'text-amber-800')}`)}>
                        {currentError.message}
                      </p>
                      {stryMutAct_9fa48("12973") ? currentError.retryAfter || <p className="text-xs text-gray-600 mt-1">
                          Retry in {Math.ceil(currentError.retryAfter / 1000)} seconds
                        </p> : stryMutAct_9fa48("12972") ? false : stryMutAct_9fa48("12971") ? true : (stryCov_9fa48("12971", "12972", "12973"), currentError.retryAfter && <p className="text-xs text-gray-600 mt-1">
                          Retry in {Math.ceil(stryMutAct_9fa48("12974") ? currentError.retryAfter * 1000 : (stryCov_9fa48("12974"), currentError.retryAfter / 1000))} seconds
                        </p>)}
                    </div>
                  </motion.div>)}
              </AnimatePresence>

              {/* Submit Button - Simplified */}
              <motion.button type="submit" disabled={formState.isSubmitting} className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" whileHover={stryMutAct_9fa48("12975") ? {} : (stryCov_9fa48("12975"), {
                scale: formState.isSubmitting ? 1 : 1.02
              })} whileTap={stryMutAct_9fa48("12976") ? {} : (stryCov_9fa48("12976"), {
                scale: formState.isSubmitting ? 1 : 0.98
              })}>
                {formState.isSubmitting ? <div className="flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Signing in...
                  </div> : stryMutAct_9fa48("12977") ? "" : (stryCov_9fa48("12977"), 'Sign in')}
              </motion.button>
            </form>

            {/* Login Information */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-900">
                    Secure Email Login
                  </h4>
                  <p className="mt-1 text-sm text-blue-700">
                    Log in with your email and password to access your personalised gift recommendations.
                    Social sign-in options coming soon!
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div className="text-center mt-8" initial={stryMutAct_9fa48("12978") ? {} : (stryCov_9fa48("12978"), {
            opacity: 0
          })} animate={stryMutAct_9fa48("12979") ? {} : (stryCov_9fa48("12979"), {
            opacity: 1
          })} transition={stryMutAct_9fa48("12980") ? {} : (stryCov_9fa48("12980"), {
            duration: 0.5,
            delay: 0.2
          })}>
            <p className="text-gray-600">
              Don't have an account?{stryMutAct_9fa48("12981") ? "" : (stryCov_9fa48("12981"), ' ')}
              <Link href="/auth/register" className="text-primary-600 hover:text-primary-500 font-medium">
                Sign up for free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>;
  }
}