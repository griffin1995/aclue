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
import type { AppProps } from 'next/app';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { PostHogProvider } from '@/components/providers/PostHogProvider';
import { PWAManager } from '@/components/pwa/PWAManager';
import { useMobileOptimizations } from '@/hooks/useMobileOptimizations';
import { AppErrorBoundary } from '@/components/error/ErrorBoundary';
import { PerformanceMonitor } from '@/components/performance/PerformanceMonitor';
import MaintenanceWrapper from '@/components/MaintenanceWrapper';
import '@/styles/globals.css';
export default function App({
  Component,
  pageProps
}: AppProps) {
  if (stryMutAct_9fa48("11924")) {
    {}
  } else {
    stryCov_9fa48("11924");
    const router = useRouter();
    // Initialize mobile optimizations
    const mobileOptimizations = useMobileOptimizations();

    // No more redirect logic needed - handled by MaintenanceWrapper

    useEffect(() => {
      if (stryMutAct_9fa48("11925")) {
        {}
      } else {
        stryCov_9fa48("11925");
        // Add custom cursor for better UX
        document.body.style.cursor = stryMutAct_9fa48("11926") ? "" : (stryCov_9fa48("11926"), 'default');

        // Add scroll restoration
        if (stryMutAct_9fa48("11928") ? false : stryMutAct_9fa48("11927") ? true : (stryCov_9fa48("11927", "11928"), (stryMutAct_9fa48("11929") ? "" : (stryCov_9fa48("11929"), 'scrollRestoration')) in history)) {
          if (stryMutAct_9fa48("11930")) {
            {}
          } else {
            stryCov_9fa48("11930");
            history.scrollRestoration = stryMutAct_9fa48("11931") ? "" : (stryCov_9fa48("11931"), 'manual');
          }
        }

        // Mobile-specific optimizations
        if (stryMutAct_9fa48("11933") ? false : stryMutAct_9fa48("11932") ? true : (stryCov_9fa48("11932", "11933"), mobileOptimizations.isMobile)) {
          if (stryMutAct_9fa48("11934")) {
            {}
          } else {
            stryCov_9fa48("11934");
            // Disable pull-to-refresh on mobile
            document.body.style.overscrollBehavior = stryMutAct_9fa48("11935") ? "" : (stryCov_9fa48("11935"), 'none');

            // Prevent text selection on mobile for better touch experience
            document.body.style.webkitUserSelect = stryMutAct_9fa48("11936") ? "" : (stryCov_9fa48("11936"), 'none');
            document.body.style.userSelect = stryMutAct_9fa48("11937") ? "" : (stryCov_9fa48("11937"), 'none');

            // Enable hardware acceleration
            document.body.style.transform = stryMutAct_9fa48("11938") ? "" : (stryCov_9fa48("11938"), 'translateZ(0)');
          }
        }
      }
    }, stryMutAct_9fa48("11939") ? [] : (stryCov_9fa48("11939"), [mobileOptimizations.isMobile]));
    return <AppErrorBoundary>
      <PerformanceMonitor enabled={stryMutAct_9fa48("11940") ? false : (stryCov_9fa48("11940"), true)} trackWebVitals={stryMutAct_9fa48("11941") ? false : (stryCov_9fa48("11941"), true)} trackMemory={stryMutAct_9fa48("11942") ? false : (stryCov_9fa48("11942"), true)} reportingInterval={30000}>
        <PostHogProvider>
          <ThemeProvider>
            <AuthProvider>
              <MaintenanceWrapper>
                <AuthGuard>
                  <Component {...pageProps} />
                  <PWAManager />
                </AuthGuard>
              </MaintenanceWrapper>
              <Toaster position="top-right" toastOptions={stryMutAct_9fa48("11943") ? {} : (stryCov_9fa48("11943"), {
                duration: 5000,
                style: stryMutAct_9fa48("11944") ? {} : (stryCov_9fa48("11944"), {
                  background: stryMutAct_9fa48("11945") ? "" : (stryCov_9fa48("11945"), '#ffffff'),
                  color: stryMutAct_9fa48("11946") ? "" : (stryCov_9fa48("11946"), '#1f2937'),
                  border: stryMutAct_9fa48("11947") ? "" : (stryCov_9fa48("11947"), '1px solid #e5e7eb'),
                  borderRadius: stryMutAct_9fa48("11948") ? "" : (stryCov_9fa48("11948"), '12px'),
                  boxShadow: stryMutAct_9fa48("11949") ? "" : (stryCov_9fa48("11949"), '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'),
                  padding: stryMutAct_9fa48("11950") ? "" : (stryCov_9fa48("11950"), '16px'),
                  fontSize: stryMutAct_9fa48("11951") ? "" : (stryCov_9fa48("11951"), '14px'),
                  fontWeight: stryMutAct_9fa48("11952") ? "" : (stryCov_9fa48("11952"), '500')
                }),
                success: stryMutAct_9fa48("11953") ? {} : (stryCov_9fa48("11953"), {
                  iconTheme: stryMutAct_9fa48("11954") ? {} : (stryCov_9fa48("11954"), {
                    primary: stryMutAct_9fa48("11955") ? "" : (stryCov_9fa48("11955"), '#22c55e'),
                    secondary: stryMutAct_9fa48("11956") ? "" : (stryCov_9fa48("11956"), '#ffffff')
                  })
                }),
                error: stryMutAct_9fa48("11957") ? {} : (stryCov_9fa48("11957"), {
                  iconTheme: stryMutAct_9fa48("11958") ? {} : (stryCov_9fa48("11958"), {
                    primary: stryMutAct_9fa48("11959") ? "" : (stryCov_9fa48("11959"), '#ef4444'),
                    secondary: stryMutAct_9fa48("11960") ? "" : (stryCov_9fa48("11960"), '#ffffff')
                  })
                })
              })} />
            </AuthProvider>
          </ThemeProvider>
        </PostHogProvider>
      </PerformanceMonitor>
    </AppErrorBoundary>;
  }
}