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
interface ServerSkeletonProps {
  className?: string;
  lines?: number;
  width?: 'full' | 'half' | 'quarter' | 'three-quarters';
  height?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
}

/**
 * Server Skeleton Component
 *
 * Loading placeholder rendered on the server for consistent UI.
 * Provides visual feedback while content loads.
 *
 * Features:
 * - Server-side rendering for instant display
 * - Multiple variants (text, card, circular, rectangular)
 * - Customisable dimensions
 * - Accessibility support
 *
 * @param className - Additional CSS classes
 * @param lines - Number of skeleton lines (for text variant)
 * @param width - Skeleton width preset
 * @param height - Skeleton height preset
 * @param variant - Skeleton style variant
 */
export default function ServerSkeleton({
  className = stryMutAct_9fa48("5610") ? "Stryker was here!" : (stryCov_9fa48("5610"), ''),
  lines = 3,
  width = stryMutAct_9fa48("5611") ? "" : (stryCov_9fa48("5611"), 'full'),
  height = stryMutAct_9fa48("5612") ? "" : (stryCov_9fa48("5612"), 'md'),
  variant = stryMutAct_9fa48("5613") ? "" : (stryCov_9fa48("5613"), 'text')
}: ServerSkeletonProps) {
  if (stryMutAct_9fa48("5614")) {
    {}
  } else {
    stryCov_9fa48("5614");
    const widthClasses = stryMutAct_9fa48("5615") ? {} : (stryCov_9fa48("5615"), {
      'full': stryMutAct_9fa48("5616") ? "" : (stryCov_9fa48("5616"), 'w-full'),
      'half': stryMutAct_9fa48("5617") ? "" : (stryCov_9fa48("5617"), 'w-1/2'),
      'quarter': stryMutAct_9fa48("5618") ? "" : (stryCov_9fa48("5618"), 'w-1/4'),
      'three-quarters': stryMutAct_9fa48("5619") ? "" : (stryCov_9fa48("5619"), 'w-3/4')
    });
    const heightClasses = stryMutAct_9fa48("5620") ? {} : (stryCov_9fa48("5620"), {
      'sm': stryMutAct_9fa48("5621") ? "" : (stryCov_9fa48("5621"), 'h-4'),
      'md': stryMutAct_9fa48("5622") ? "" : (stryCov_9fa48("5622"), 'h-6'),
      'lg': stryMutAct_9fa48("5623") ? "" : (stryCov_9fa48("5623"), 'h-8'),
      'xl': stryMutAct_9fa48("5624") ? "" : (stryCov_9fa48("5624"), 'h-12')
    });
    const baseClasses = stryMutAct_9fa48("5625") ? "" : (stryCov_9fa48("5625"), 'animate-pulse bg-gray-200 rounded');
    if (stryMutAct_9fa48("5628") ? variant !== 'text' : stryMutAct_9fa48("5627") ? false : stryMutAct_9fa48("5626") ? true : (stryCov_9fa48("5626", "5627", "5628"), variant === (stryMutAct_9fa48("5629") ? "" : (stryCov_9fa48("5629"), 'text')))) {
      if (stryMutAct_9fa48("5630")) {
        {}
      } else {
        stryCov_9fa48("5630");
        return <div className={stryMutAct_9fa48("5631") ? `` : (stryCov_9fa48("5631"), `space-y-2 ${className}`)} role="status" aria-label="Loading content">
        {Array.from(stryMutAct_9fa48("5632") ? {} : (stryCov_9fa48("5632"), {
            length: lines
          }), (_, index) => {
            if (stryMutAct_9fa48("5633")) {
              {}
            } else {
              stryCov_9fa48("5633");
              const lineWidth = (stryMutAct_9fa48("5636") ? index !== lines - 1 : stryMutAct_9fa48("5635") ? false : stryMutAct_9fa48("5634") ? true : (stryCov_9fa48("5634", "5635", "5636"), index === (stryMutAct_9fa48("5637") ? lines + 1 : (stryCov_9fa48("5637"), lines - 1)))) ? stryMutAct_9fa48("5638") ? "" : (stryCov_9fa48("5638"), 'three-quarters') : stryMutAct_9fa48("5639") ? "" : (stryCov_9fa48("5639"), 'full');
              return <div key={index} className={stryMutAct_9fa48("5640") ? `` : (stryCov_9fa48("5640"), `${baseClasses} ${widthClasses[lineWidth]} ${heightClasses[height]}`)} />;
            }
          })}
        <span className="sr-only">Loading...</span>
      </div>;
      }
    }
    if (stryMutAct_9fa48("5643") ? variant !== 'circular' : stryMutAct_9fa48("5642") ? false : stryMutAct_9fa48("5641") ? true : (stryCov_9fa48("5641", "5642", "5643"), variant === (stryMutAct_9fa48("5644") ? "" : (stryCov_9fa48("5644"), 'circular')))) {
      if (stryMutAct_9fa48("5645")) {
        {}
      } else {
        stryCov_9fa48("5645");
        return <div className={className} role="status" aria-label="Loading content">
        <div className={stryMutAct_9fa48("5646") ? `` : (stryCov_9fa48("5646"), `${baseClasses} rounded-full ${heightClasses[height]} ${heightClasses[height]}`)} />
        <span className="sr-only">Loading...</span>
      </div>;
      }
    }
    if (stryMutAct_9fa48("5649") ? variant !== 'card' : stryMutAct_9fa48("5648") ? false : stryMutAct_9fa48("5647") ? true : (stryCov_9fa48("5647", "5648", "5649"), variant === (stryMutAct_9fa48("5650") ? "" : (stryCov_9fa48("5650"), 'card')))) {
      if (stryMutAct_9fa48("5651")) {
        {}
      } else {
        stryCov_9fa48("5651");
        return <div className={stryMutAct_9fa48("5652") ? `` : (stryCov_9fa48("5652"), `${baseClasses} p-6 ${className}`)} role="status" aria-label="Loading content">
        <div className="space-y-4">
          <div className={stryMutAct_9fa48("5653") ? `` : (stryCov_9fa48("5653"), `${baseClasses} h-6 w-3/4`)} />
          <div className={stryMutAct_9fa48("5654") ? `` : (stryCov_9fa48("5654"), `${baseClasses} h-4 w-full`)} />
          <div className={stryMutAct_9fa48("5655") ? `` : (stryCov_9fa48("5655"), `${baseClasses} h-4 w-5/6`)} />
          <div className={stryMutAct_9fa48("5656") ? `` : (stryCov_9fa48("5656"), `${baseClasses} h-4 w-2/3`)} />
        </div>
        <span className="sr-only">Loading...</span>
      </div>;
      }
    }

    // Default rectangular variant
    return <div className={className} role="status" aria-label="Loading content">
      <div className={stryMutAct_9fa48("5657") ? `` : (stryCov_9fa48("5657"), `${baseClasses} ${widthClasses[width]} ${heightClasses[height]}`)} />
      <span className="sr-only">Loading...</span>
    </div>;
  }
}