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
import { Html, Head, Main, NextScript } from 'next/document';
export default function Document() {
  if (stryMutAct_9fa48("12145")) {
    {}
  } else {
    stryCov_9fa48("12145");
    return <Html lang="en" className="scroll-smooth">
      <Head>
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Meta tags for PWA */}
        <meta name="theme-color" content="#f03dff" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="aclue" />
        
        {/* Optimize font loading */}
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        
        {/* Preload critical resources */}
        
        {/* Analytics placeholder */}
        {stryMutAct_9fa48("12148") ? process.env.NODE_ENV === 'production' || <>
            {/* Google Analytics - replace with actual ID */}
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} />
            <script dangerouslySetInnerHTML={{
            __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `
          }} />
            
            {/* Mixpanel */}
            {process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && <script dangerouslySetInnerHTML={{
            __html: `
                    (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
                    mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}', {
                      debug: false,
                      track_pageview: true,
                      persistence: 'localStorage'
                    });
                  `
          }} />}
          </> : stryMutAct_9fa48("12147") ? false : stryMutAct_9fa48("12146") ? true : (stryCov_9fa48("12146", "12147", "12148"), (stryMutAct_9fa48("12150") ? process.env.NODE_ENV !== 'production' : stryMutAct_9fa48("12149") ? true : (stryCov_9fa48("12149", "12150"), process.env.NODE_ENV === (stryMutAct_9fa48("12151") ? "" : (stryCov_9fa48("12151"), 'production')))) && <>
            {/* Google Analytics - replace with actual ID */}
            <script async src={stryMutAct_9fa48("12152") ? `` : (stryCov_9fa48("12152"), `https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`)} />
            <script dangerouslySetInnerHTML={stryMutAct_9fa48("12153") ? {} : (stryCov_9fa48("12153"), {
            __html: stryMutAct_9fa48("12154") ? `` : (stryCov_9fa48("12154"), `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}');
                `)
          })} />
            
            {/* Mixpanel */}
            {stryMutAct_9fa48("12157") ? process.env.NEXT_PUBLIC_MIXPANEL_TOKEN || <script dangerouslySetInnerHTML={{
            __html: `
                    (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
                    mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}', {
                      debug: false,
                      track_pageview: true,
                      persistence: 'localStorage'
                    });
                  `
          }} /> : stryMutAct_9fa48("12156") ? false : stryMutAct_9fa48("12155") ? true : (stryCov_9fa48("12155", "12156", "12157"), process.env.NEXT_PUBLIC_MIXPANEL_TOKEN && <script dangerouslySetInnerHTML={stryMutAct_9fa48("12158") ? {} : (stryCov_9fa48("12158"), {
            __html: stryMutAct_9fa48("12159") ? `` : (stryCov_9fa48("12159"), `
                    (function(f,b){if(!b.__SV){var e,g,i,h;window.mixpanel=b;b._i=[];b.init=function(e,f,c){function g(a,d){var b=d.split(".");2==b.length&&(a=a[b[0]],d=b[1]);a[d]=function(){a.push([d].concat(Array.prototype.slice.call(arguments,0)))}}var a=b;"undefined"!==typeof c?a=b[c]=[]:c="mixpanel";a.people=a.people||[];a.toString=function(a){var d="mixpanel";"mixpanel"!==c&&(d+="."+c);a||(d+=" (stub)");return d};a.people.toString=function(){return a.toString(1)+".people (stub)"};i="disable time_event track track_pageview track_links track_forms track_with_groups add_group set_group remove_group register register_once alias unregister identify name_tag set_config reset opt_in_tracking opt_out_tracking has_opted_in_tracking has_opted_out_tracking clear_opt_in_out_tracking start_batch_senders people.set people.set_once people.unset people.increment people.append people.union people.track_charge people.clear_charges people.delete_user people.remove".split(" ");for(h=0;h<i.length;h++)g(a,i[h]);var j="set set_once union unset remove delete".split(" ");a.get_group=function(){function b(c){d[c]=function(){call2_args=arguments;call2=[c].concat(Array.prototype.slice.call(call2_args,0));a.push([e,call2])}}for(var d={},e=["get_group"].concat(Array.prototype.slice.call(arguments,0)),c=0;c<j.length;c++)b(j[c]);return d};b._i.push([e,f,c])};b.__SV=1.2;e=f.createElement("script");e.type="text/javascript";e.async=!0;e.src="undefined"!==typeof MIXPANEL_CUSTOM_LIB_URL?MIXPANEL_CUSTOM_LIB_URL:"file:"===f.location.protocol&&"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js".match(/^\\/\\//)?"https://cdn.mxpnl.com/libs/mixpanel-2-latest.min.js":"//cdn.mxpnl.com/libs/mixpanel-2-latest.min.js";g=f.getElementsByTagName("script")[0];g.parentNode.insertBefore(e,g)}})(document,window.mixpanel||[]);
                    mixpanel.init('${process.env.NEXT_PUBLIC_MIXPANEL_TOKEN}', {
                      debug: false,
                      track_pageview: true,
                      persistence: 'localStorage'
                    });
                  `)
          })} />)}
          </>)}
      </Head>
      <body className="antialiased bg-gray-50">
        <Main />
        <NextScript />
        
        {/* Enhanced Service Worker Registration */}
        {stryMutAct_9fa48("12162") ? typeof window !== 'undefined' || <script dangerouslySetInnerHTML={{
          __html: `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', function() {
                          const newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', function() {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Show update available notification
                                if (window.confirm('A new version is available. Refresh to update?')) {
                                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                                  window.location.reload();
                                }
                              }
                            });
                          }
                        });
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                      
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', function(event) {
                      if (event.data && event.data.type === 'navigate') {
                        window.location.href = event.data.url;
                      }
                    });
                  });
                  
                  // Listen for service worker updates
                  navigator.serviceWorker.addEventListener('controllerchange', function() {
                    window.location.reload();
                  });
                }
                
                // Preload critical routes for better performance
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(function() {
                    const criticalRoutes = ['/discover', '/dashboard', '/auth/login'];
                    criticalRoutes.forEach(function(route) {
                      const link = document.createElement('link');
                      link.rel = 'prefetch';
                      link.href = route;
                      document.head.appendChild(link);
                    });
                  });
                }
              `
        }} /> : stryMutAct_9fa48("12161") ? false : stryMutAct_9fa48("12160") ? true : (stryCov_9fa48("12160", "12161", "12162"), (stryMutAct_9fa48("12164") ? typeof window === 'undefined' : stryMutAct_9fa48("12163") ? true : (stryCov_9fa48("12163", "12164"), typeof window !== (stryMutAct_9fa48("12165") ? "" : (stryCov_9fa48("12165"), 'undefined')))) && <script dangerouslySetInnerHTML={stryMutAct_9fa48("12166") ? {} : (stryCov_9fa48("12166"), {
          __html: stryMutAct_9fa48("12167") ? `` : (stryCov_9fa48("12167"), `
                if ('serviceWorker' in navigator) {
                  window.addEventListener('load', function() {
                    navigator.serviceWorker.register('/sw.js')
                      .then(function(registration) {
                        console.log('SW registered: ', registration);
                        
                        // Check for updates
                        registration.addEventListener('updatefound', function() {
                          const newWorker = registration.installing;
                          if (newWorker) {
                            newWorker.addEventListener('statechange', function() {
                              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                // Show update available notification
                                if (window.confirm('A new version is available. Refresh to update?')) {
                                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                                  window.location.reload();
                                }
                              }
                            });
                          }
                        });
                      })
                      .catch(function(registrationError) {
                        console.log('SW registration failed: ', registrationError);
                      });
                      
                    // Listen for service worker messages
                    navigator.serviceWorker.addEventListener('message', function(event) {
                      if (event.data && event.data.type === 'navigate') {
                        window.location.href = event.data.url;
                      }
                    });
                  });
                  
                  // Listen for service worker updates
                  navigator.serviceWorker.addEventListener('controllerchange', function() {
                    window.location.reload();
                  });
                }
                
                // Preload critical routes for better performance
                if ('requestIdleCallback' in window) {
                  requestIdleCallback(function() {
                    const criticalRoutes = ['/discover', '/dashboard', '/auth/login'];
                    criticalRoutes.forEach(function(route) {
                      const link = document.createElement('link');
                      link.rel = 'prefetch';
                      link.href = route;
                      document.head.appendChild(link);
                    });
                  });
                }
              `)
        })} />)}
      </body>
    </Html>;
  }
}