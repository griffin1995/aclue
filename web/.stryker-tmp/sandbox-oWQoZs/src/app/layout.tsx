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
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import '@/styles/globals.css';
const inter = Inter(stryMutAct_9fa48("2577") ? {} : (stryCov_9fa48("2577"), {
  subsets: stryMutAct_9fa48("2578") ? [] : (stryCov_9fa48("2578"), [stryMutAct_9fa48("2579") ? "" : (stryCov_9fa48("2579"), 'latin')])
}));
export const metadata: Metadata = stryMutAct_9fa48("2580") ? {} : (stryCov_9fa48("2580"), {
  title: stryMutAct_9fa48("2581") ? "" : (stryCov_9fa48("2581"), 'aclue - AI-Powered Gifting Platform'),
  description: stryMutAct_9fa48("2582") ? "" : (stryCov_9fa48("2582"), 'Discover perfect gifts with AI-powered recommendations'),
  keywords: stryMutAct_9fa48("2583") ? [] : (stryCov_9fa48("2583"), [stryMutAct_9fa48("2584") ? "" : (stryCov_9fa48("2584"), 'gifts'), stryMutAct_9fa48("2585") ? "" : (stryCov_9fa48("2585"), 'AI'), stryMutAct_9fa48("2586") ? "" : (stryCov_9fa48("2586"), 'recommendations'), stryMutAct_9fa48("2587") ? "" : (stryCov_9fa48("2587"), 'personalised shopping')]),
  authors: stryMutAct_9fa48("2588") ? [] : (stryCov_9fa48("2588"), [stryMutAct_9fa48("2589") ? {} : (stryCov_9fa48("2589"), {
    name: stryMutAct_9fa48("2590") ? "" : (stryCov_9fa48("2590"), 'aclue Team')
  })]),
  creator: stryMutAct_9fa48("2591") ? "" : (stryCov_9fa48("2591"), 'aclue Ltd'),
  publisher: stryMutAct_9fa48("2592") ? "" : (stryCov_9fa48("2592"), 'aclue Ltd'),
  metadataBase: new URL(stryMutAct_9fa48("2595") ? process.env.NEXT_PUBLIC_WEB_URL && 'https://aclue.app' : stryMutAct_9fa48("2594") ? false : stryMutAct_9fa48("2593") ? true : (stryCov_9fa48("2593", "2594", "2595"), process.env.NEXT_PUBLIC_WEB_URL || (stryMutAct_9fa48("2596") ? "" : (stryCov_9fa48("2596"), 'https://aclue.app')))),
  alternates: stryMutAct_9fa48("2597") ? {} : (stryCov_9fa48("2597"), {
    canonical: stryMutAct_9fa48("2598") ? "" : (stryCov_9fa48("2598"), '/')
  }),
  openGraph: stryMutAct_9fa48("2599") ? {} : (stryCov_9fa48("2599"), {
    title: stryMutAct_9fa48("2600") ? "" : (stryCov_9fa48("2600"), 'aclue - AI-Powered Gifting Platform'),
    description: stryMutAct_9fa48("2601") ? "" : (stryCov_9fa48("2601"), 'Discover perfect gifts with AI-powered recommendations'),
    url: stryMutAct_9fa48("2602") ? "" : (stryCov_9fa48("2602"), '/'),
    siteName: stryMutAct_9fa48("2603") ? "" : (stryCov_9fa48("2603"), 'aclue'),
    images: stryMutAct_9fa48("2604") ? [] : (stryCov_9fa48("2604"), [stryMutAct_9fa48("2605") ? {} : (stryCov_9fa48("2605"), {
      url: stryMutAct_9fa48("2606") ? "" : (stryCov_9fa48("2606"), '/aclue_text_clean.png'),
      width: 1200,
      height: 630,
      alt: stryMutAct_9fa48("2607") ? "" : (stryCov_9fa48("2607"), 'aclue Logo')
    })]),
    locale: stryMutAct_9fa48("2608") ? "" : (stryCov_9fa48("2608"), 'en_GB'),
    type: stryMutAct_9fa48("2609") ? "" : (stryCov_9fa48("2609"), 'website')
  }),
  twitter: stryMutAct_9fa48("2610") ? {} : (stryCov_9fa48("2610"), {
    card: stryMutAct_9fa48("2611") ? "" : (stryCov_9fa48("2611"), 'summary_large_image'),
    title: stryMutAct_9fa48("2612") ? "" : (stryCov_9fa48("2612"), 'aclue - AI-Powered Gifting Platform'),
    description: stryMutAct_9fa48("2613") ? "" : (stryCov_9fa48("2613"), 'Discover perfect gifts with AI-powered recommendations'),
    images: stryMutAct_9fa48("2614") ? [] : (stryCov_9fa48("2614"), [stryMutAct_9fa48("2615") ? "" : (stryCov_9fa48("2615"), '/aclue_text_clean.png')])
  }),
  robots: stryMutAct_9fa48("2616") ? {} : (stryCov_9fa48("2616"), {
    index: stryMutAct_9fa48("2617") ? false : (stryCov_9fa48("2617"), true),
    follow: stryMutAct_9fa48("2618") ? false : (stryCov_9fa48("2618"), true),
    googleBot: stryMutAct_9fa48("2619") ? {} : (stryCov_9fa48("2619"), {
      index: stryMutAct_9fa48("2620") ? false : (stryCov_9fa48("2620"), true),
      follow: stryMutAct_9fa48("2621") ? false : (stryCov_9fa48("2621"), true),
      'max-video-preview': stryMutAct_9fa48("2622") ? +1 : (stryCov_9fa48("2622"), -1),
      'max-image-preview': stryMutAct_9fa48("2623") ? "" : (stryCov_9fa48("2623"), 'large'),
      'max-snippet': stryMutAct_9fa48("2624") ? +1 : (stryCov_9fa48("2624"), -1)
    })
  })
});
export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  if (stryMutAct_9fa48("2625")) {
    {}
  } else {
    stryCov_9fa48("2625");
    return <html lang="en-GB" className={inter.className}>
      <body className="antialiased">
        {children}
      </body>
    </html>;
  }
}