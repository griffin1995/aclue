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
import { PostHogConfig } from 'posthog-js';
import { config } from '@/config';

// PostHog configuration factory
export function createPostHogConfig(): PostHogConfig {
  if (stryMutAct_9fa48("11419")) {
    {}
  } else {
    stryCov_9fa48("11419");
    const isDev = config.isDevelopment;
    const isProd = config.isProduction;
    const baseConfig: PostHogConfig = stryMutAct_9fa48("11420") ? {} : (stryCov_9fa48("11420"), {
      // API Configuration
      api_host: isDev ? stryMutAct_9fa48("11421") ? "" : (stryCov_9fa48("11421"), 'http://localhost:3000') : stryMutAct_9fa48("11424") ? config.posthogHost && 'https://eu.i.posthog.com' : stryMutAct_9fa48("11423") ? false : stryMutAct_9fa48("11422") ? true : (stryCov_9fa48("11422", "11423", "11424"), config.posthogHost || (stryMutAct_9fa48("11425") ? "" : (stryCov_9fa48("11425"), 'https://eu.i.posthog.com'))),
      ui_host: stryMutAct_9fa48("11428") ? config.posthogHost && 'https://eu.i.posthog.com' : stryMutAct_9fa48("11427") ? false : stryMutAct_9fa48("11426") ? true : (stryCov_9fa48("11426", "11427", "11428"), config.posthogHost || (stryMutAct_9fa48("11429") ? "" : (stryCov_9fa48("11429"), 'https://eu.i.posthog.com'))),
      // Core Features
      person_profiles: stryMutAct_9fa48("11430") ? "" : (stryCov_9fa48("11430"), 'identified_only'),
      capture_pageview: stryMutAct_9fa48("11431") ? true : (stryCov_9fa48("11431"), false),
      // Manual pageview tracking for better proxy compatibility
      capture_pageleave: stryMutAct_9fa48("11432") ? false : (stryCov_9fa48("11432"), true),
      debug: isDev,
      // Autocapture Configuration
      autocapture: stryMutAct_9fa48("11433") ? {} : (stryCov_9fa48("11433"), {
        dom_event_allowlist: stryMutAct_9fa48("11434") ? [] : (stryCov_9fa48("11434"), [stryMutAct_9fa48("11435") ? "" : (stryCov_9fa48("11435"), 'click'), stryMutAct_9fa48("11436") ? "" : (stryCov_9fa48("11436"), 'change'), stryMutAct_9fa48("11437") ? "" : (stryCov_9fa48("11437"), 'submit'), stryMutAct_9fa48("11438") ? "" : (stryCov_9fa48("11438"), 'input')]),
        css_selector_allowlist: stryMutAct_9fa48("11439") ? [] : (stryCov_9fa48("11439"), [stryMutAct_9fa48("11440") ? "" : (stryCov_9fa48("11440"), '[data-attr]'), stryMutAct_9fa48("11441") ? "" : (stryCov_9fa48("11441"), '[data-testid]'), stryMutAct_9fa48("11442") ? "" : (stryCov_9fa48("11442"), '[data-ph-capture-attribute]'), stryMutAct_9fa48("11443") ? "" : (stryCov_9fa48("11443"), '.btn'), stryMutAct_9fa48("11444") ? "" : (stryCov_9fa48("11444"), '.button'), stryMutAct_9fa48("11445") ? "" : (stryCov_9fa48("11445"), 'button'), stryMutAct_9fa48("11446") ? "" : (stryCov_9fa48("11446"), 'a[href]'), stryMutAct_9fa48("11447") ? "" : (stryCov_9fa48("11447"), 'input[type="submit"]'), stryMutAct_9fa48("11448") ? "" : (stryCov_9fa48("11448"), 'input[type="button"]')]),
        element_allowlist: stryMutAct_9fa48("11449") ? [] : (stryCov_9fa48("11449"), [stryMutAct_9fa48("11450") ? "" : (stryCov_9fa48("11450"), 'a'), stryMutAct_9fa48("11451") ? "" : (stryCov_9fa48("11451"), 'button'), stryMutAct_9fa48("11452") ? "" : (stryCov_9fa48("11452"), 'form'), stryMutAct_9fa48("11453") ? "" : (stryCov_9fa48("11453"), 'input'), stryMutAct_9fa48("11454") ? "" : (stryCov_9fa48("11454"), 'select'), stryMutAct_9fa48("11455") ? "" : (stryCov_9fa48("11455"), 'textarea'), stryMutAct_9fa48("11456") ? "" : (stryCov_9fa48("11456"), 'label')]),
        url_allowlist: isDev ? stryMutAct_9fa48("11457") ? [] : (stryCov_9fa48("11457"), [stryMutAct_9fa48("11458") ? "" : (stryCov_9fa48("11458"), 'localhost:3000')]) : undefined
      }),
      // Session Recording
      session_recording: stryMutAct_9fa48("11459") ? {} : (stryCov_9fa48("11459"), {
        recordCrossOriginIframes: stryMutAct_9fa48("11460") ? true : (stryCov_9fa48("11460"), false),
        maskAllInputs: stryMutAct_9fa48("11461") ? false : (stryCov_9fa48("11461"), true),
        maskInputOptions: stryMutAct_9fa48("11462") ? {} : (stryCov_9fa48("11462"), {
          password: stryMutAct_9fa48("11463") ? false : (stryCov_9fa48("11463"), true),
          email: stryMutAct_9fa48("11464") ? true : (stryCov_9fa48("11464"), false),
          tel: stryMutAct_9fa48("11465") ? false : (stryCov_9fa48("11465"), true),
          credit_card: stryMutAct_9fa48("11466") ? false : (stryCov_9fa48("11466"), true)
        }),
        maskTextSelector: stryMutAct_9fa48("11467") ? "" : (stryCov_9fa48("11467"), '.sensitive, [data-sensitive]'),
        blockSelector: stryMutAct_9fa48("11468") ? "" : (stryCov_9fa48("11468"), '.block-recording, [data-block-recording]'),
        ignoreClass: stryMutAct_9fa48("11469") ? "" : (stryCov_9fa48("11469"), 'ph-ignore'),
        collectFonts: stryMutAct_9fa48("11470") ? true : (stryCov_9fa48("11470"), false),
        inlineStylesheet: stryMutAct_9fa48("11471") ? true : (stryCov_9fa48("11471"), false)
      }),
      disable_session_recording: stryMutAct_9fa48("11472") ? isProd : (stryCov_9fa48("11472"), !isProd),
      // Privacy and Security
      cross_subdomain_cookie: stryMutAct_9fa48("11473") ? true : (stryCov_9fa48("11473"), false),
      secure_cookie: isProd,
      respect_dnt: stryMutAct_9fa48("11474") ? false : (stryCov_9fa48("11474"), true),
      opt_out_capturing_by_default: stryMutAct_9fa48("11475") ? true : (stryCov_9fa48("11475"), false),
      // Performance
      batch_size: isDev ? 10 : 50,
      request_timeout_ms: 30000,
      // Persistence
      persistence: stryMutAct_9fa48("11476") ? "" : (stryCov_9fa48("11476"), 'localStorage+cookie'),
      persistence_name: stryMutAct_9fa48("11477") ? `` : (stryCov_9fa48("11477"), `ph_${config.posthogKey}_posthog`),
      cookie_name: stryMutAct_9fa48("11478") ? `` : (stryCov_9fa48("11478"), `ph_${config.posthogKey}_posthog`),
      cookie_expiration: 365,
      // days
      disable_persistence: stryMutAct_9fa48("11479") ? true : (stryCov_9fa48("11479"), false),
      // Advanced Features
      disable_surveys: stryMutAct_9fa48("11480") ? true : (stryCov_9fa48("11480"), false),
      enable_recording_console_log: isDev,
      capture_performance: isProd,
      // Error Handling
      on_xhr_error: failedRequest => {
        if (stryMutAct_9fa48("11481")) {
          {}
        } else {
          stryCov_9fa48("11481");
          console.warn(stryMutAct_9fa48("11482") ? "" : (stryCov_9fa48("11482"), '[PostHog] XHR request failed:'), failedRequest);
        }
      },
      loaded: posthog => {
        if (stryMutAct_9fa48("11483")) {
          {}
        } else {
          stryCov_9fa48("11483");
          console.log(stryMutAct_9fa48("11484") ? "" : (stryCov_9fa48("11484"), '[PostHog] Analytics service loaded successfully'), stryMutAct_9fa48("11485") ? {} : (stryCov_9fa48("11485"), {
            mode: isDev ? stryMutAct_9fa48("11486") ? "" : (stryCov_9fa48("11486"), 'development') : stryMutAct_9fa48("11487") ? "" : (stryCov_9fa48("11487"), 'production'),
            api_host: posthog.config.api_host,
            distinct_id: posthog.get_distinct_id(),
            version: posthog.LIB_VERSION
          }));

          // Global access for debugging
          if (stryMutAct_9fa48("11489") ? false : stryMutAct_9fa48("11488") ? true : (stryCov_9fa48("11488", "11489"), isDev)) {
            if (stryMutAct_9fa48("11490")) {
              {}
            } else {
              stryCov_9fa48("11490");
              window.posthog = posthog;
              console.log(stryMutAct_9fa48("11491") ? "" : (stryCov_9fa48("11491"), '[PostHog] Available globally as window.posthog for debugging'));
            }
          }

          // Set up error tracking
          if (stryMutAct_9fa48("11493") ? false : stryMutAct_9fa48("11492") ? true : (stryCov_9fa48("11492", "11493"), isProd)) {
            if (stryMutAct_9fa48("11494")) {
              {}
            } else {
              stryCov_9fa48("11494");
              window.addEventListener(stryMutAct_9fa48("11495") ? "" : (stryCov_9fa48("11495"), 'error'), event => {
                if (stryMutAct_9fa48("11496")) {
                  {}
                } else {
                  stryCov_9fa48("11496");
                  posthog.capture(stryMutAct_9fa48("11497") ? "" : (stryCov_9fa48("11497"), 'javascript_error'), stryMutAct_9fa48("11498") ? {} : (stryCov_9fa48("11498"), {
                    error_message: event.message,
                    error_filename: event.filename,
                    error_lineno: event.lineno,
                    error_colno: event.colno,
                    error_stack: stryMutAct_9fa48("11499") ? event.error.stack : (stryCov_9fa48("11499"), event.error?.stack)
                  }));
                }
              });
              window.addEventListener(stryMutAct_9fa48("11500") ? "" : (stryCov_9fa48("11500"), 'unhandledrejection'), event => {
                if (stryMutAct_9fa48("11501")) {
                  {}
                } else {
                  stryCov_9fa48("11501");
                  posthog.capture(stryMutAct_9fa48("11502") ? "" : (stryCov_9fa48("11502"), 'unhandled_promise_rejection'), stryMutAct_9fa48("11503") ? {} : (stryCov_9fa48("11503"), {
                    reason: stryMutAct_9fa48("11504") ? event.reason.toString() : (stryCov_9fa48("11504"), event.reason?.toString()),
                    stack: stryMutAct_9fa48("11505") ? event.reason.stack : (stryCov_9fa48("11505"), event.reason?.stack)
                  }));
                }
              });
            }
          }
        }
      }
    });

    // Development-specific overrides
    if (stryMutAct_9fa48("11507") ? false : stryMutAct_9fa48("11506") ? true : (stryCov_9fa48("11506", "11507"), isDev)) {
      if (stryMutAct_9fa48("11508")) {
        {}
      } else {
        stryCov_9fa48("11508");
        return stryMutAct_9fa48("11509") ? {} : (stryCov_9fa48("11509"), {
          ...baseConfig,
          // Use local proxy endpoints to avoid CORS
          api_endpoint: stryMutAct_9fa48("11510") ? "" : (stryCov_9fa48("11510"), '/api/posthog-proxy'),
          decide_endpoint: stryMutAct_9fa48("11511") ? "" : (stryCov_9fa48("11511"), '/api/posthog-decide'),
          // Development optimizations
          advanced_disable_decide: stryMutAct_9fa48("11512") ? true : (stryCov_9fa48("11512"), false),
          // Enable feature flags in dev
          disable_external_dependency_loading: stryMutAct_9fa48("11513") ? true : (stryCov_9fa48("11513"), false),
          bootstrap: stryMutAct_9fa48("11514") ? {} : (stryCov_9fa48("11514"), {
            distinctID: undefined,
            isIdentifiedID: stryMutAct_9fa48("11515") ? true : (stryCov_9fa48("11515"), false),
            featureFlags: {}
          }),
          // Faster development feedback
          property_blacklist: stryMutAct_9fa48("11516") ? ["Stryker was here"] : (stryCov_9fa48("11516"), []),
          sanitize_properties: null,
          xhr_headers: stryMutAct_9fa48("11517") ? {} : (stryCov_9fa48("11517"), {
            'X-PostHog-Source': stryMutAct_9fa48("11518") ? "" : (stryCov_9fa48("11518"), 'aclue-dev')
          })
        });
      }
    }

    // Production-specific configuration
    return stryMutAct_9fa48("11519") ? {} : (stryCov_9fa48("11519"), {
      ...baseConfig,
      // Production optimizations
      advanced_disable_decide: stryMutAct_9fa48("11520") ? true : (stryCov_9fa48("11520"), false),
      disable_external_dependency_loading: stryMutAct_9fa48("11521") ? true : (stryCov_9fa48("11521"), false),
      // Enhanced security
      mask_all_text: stryMutAct_9fa48("11522") ? true : (stryCov_9fa48("11522"), false),
      mask_all_element_attributes: stryMutAct_9fa48("11523") ? true : (stryCov_9fa48("11523"), false),
      // Performance monitoring
      capture_performance: stryMutAct_9fa48("11524") ? false : (stryCov_9fa48("11524"), true),
      _capture_metrics: stryMutAct_9fa48("11525") ? false : (stryCov_9fa48("11525"), true),
      // Production headers
      xhr_headers: stryMutAct_9fa48("11526") ? {} : (stryCov_9fa48("11526"), {
        'X-PostHog-Source': stryMutAct_9fa48("11527") ? "" : (stryCov_9fa48("11527"), 'aclue-prod')
      })
    });
  }
}

// PostHog event validation
export function validateEvent(eventName: string, properties?: Record<string, any>): boolean {
  if (stryMutAct_9fa48("11528")) {
    {}
  } else {
    stryCov_9fa48("11528");
    if (stryMutAct_9fa48("11531") ? !eventName && typeof eventName !== 'string' : stryMutAct_9fa48("11530") ? false : stryMutAct_9fa48("11529") ? true : (stryCov_9fa48("11529", "11530", "11531"), (stryMutAct_9fa48("11532") ? eventName : (stryCov_9fa48("11532"), !eventName)) || (stryMutAct_9fa48("11534") ? typeof eventName === 'string' : stryMutAct_9fa48("11533") ? false : (stryCov_9fa48("11533", "11534"), typeof eventName !== (stryMutAct_9fa48("11535") ? "" : (stryCov_9fa48("11535"), 'string')))))) {
      if (stryMutAct_9fa48("11536")) {
        {}
      } else {
        stryCov_9fa48("11536");
        console.warn(stryMutAct_9fa48("11537") ? "" : (stryCov_9fa48("11537"), '[PostHog] Invalid event name:'), eventName);
        return stryMutAct_9fa48("11538") ? true : (stryCov_9fa48("11538"), false);
      }
    }
    if (stryMutAct_9fa48("11542") ? eventName.length <= 200 : stryMutAct_9fa48("11541") ? eventName.length >= 200 : stryMutAct_9fa48("11540") ? false : stryMutAct_9fa48("11539") ? true : (stryCov_9fa48("11539", "11540", "11541", "11542"), eventName.length > 200)) {
      if (stryMutAct_9fa48("11543")) {
        {}
      } else {
        stryCov_9fa48("11543");
        console.warn(stryMutAct_9fa48("11544") ? "" : (stryCov_9fa48("11544"), '[PostHog] Event name too long:'), eventName);
        return stryMutAct_9fa48("11545") ? true : (stryCov_9fa48("11545"), false);
      }
    }
    if (stryMutAct_9fa48("11548") ? properties || typeof properties !== 'object' : stryMutAct_9fa48("11547") ? false : stryMutAct_9fa48("11546") ? true : (stryCov_9fa48("11546", "11547", "11548"), properties && (stryMutAct_9fa48("11550") ? typeof properties === 'object' : stryMutAct_9fa48("11549") ? true : (stryCov_9fa48("11549", "11550"), typeof properties !== (stryMutAct_9fa48("11551") ? "" : (stryCov_9fa48("11551"), 'object')))))) {
      if (stryMutAct_9fa48("11552")) {
        {}
      } else {
        stryCov_9fa48("11552");
        console.warn(stryMutAct_9fa48("11553") ? "" : (stryCov_9fa48("11553"), '[PostHog] Invalid event properties:'), properties);
        return stryMutAct_9fa48("11554") ? true : (stryCov_9fa48("11554"), false);
      }
    }
    return stryMutAct_9fa48("11555") ? false : (stryCov_9fa48("11555"), true);
  }
}

// Common event properties
export function getCommonEventProperties(): Record<string, any> {
  if (stryMutAct_9fa48("11556")) {
    {}
  } else {
    stryCov_9fa48("11556");
    return stryMutAct_9fa48("11557") ? {} : (stryCov_9fa48("11557"), {
      app_version: config.version,
      environment: config.isDevelopment ? stryMutAct_9fa48("11558") ? "" : (stryCov_9fa48("11558"), 'development') : stryMutAct_9fa48("11559") ? "" : (stryCov_9fa48("11559"), 'production'),
      timestamp: new Date().toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: navigator.language,
      user_agent: navigator.userAgent,
      viewport_width: window.innerWidth,
      viewport_height: window.innerHeight,
      screen_width: window.screen.width,
      screen_height: window.screen.height,
      referrer: document.referrer,
      url: window.location.href
    });
  }
}