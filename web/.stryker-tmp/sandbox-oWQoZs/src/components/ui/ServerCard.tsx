/**
 * Server Card Component - Server-First UI Pattern
 *
 * Server-rendered card component for displaying content blocks.
 * Optimized for performance with server-side rendering and clean semantics.
 *
 * Features:
 * - Server-side rendering for immediate visibility
 * - Multiple variants and layouts
 * - Responsive design built-in
 * - Accessibility optimized
 * - Performance focused
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
interface ServerCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  hover?: boolean;
}
export default function ServerCard({
  children,
  variant = stryMutAct_9fa48("7910") ? "" : (stryCov_9fa48("7910"), 'default'),
  padding = stryMutAct_9fa48("7911") ? "" : (stryCov_9fa48("7911"), 'md'),
  className = stryMutAct_9fa48("7912") ? "Stryker was here!" : (stryCov_9fa48("7912"), ''),
  hover = stryMutAct_9fa48("7913") ? true : (stryCov_9fa48("7913"), false)
}: ServerCardProps) {
  if (stryMutAct_9fa48("7914")) {
    {}
  } else {
    stryCov_9fa48("7914");
    const baseStyles = stryMutAct_9fa48("7915") ? "" : (stryCov_9fa48("7915"), 'rounded-2xl transition-all duration-200');
    const variantStyles = stryMutAct_9fa48("7916") ? {} : (stryCov_9fa48("7916"), {
      default: stryMutAct_9fa48("7917") ? "" : (stryCov_9fa48("7917"), 'bg-white'),
      elevated: stryMutAct_9fa48("7918") ? "" : (stryCov_9fa48("7918"), 'bg-white shadow-lg'),
      bordered: stryMutAct_9fa48("7919") ? "" : (stryCov_9fa48("7919"), 'bg-white border border-gray-200'),
      gradient: stryMutAct_9fa48("7920") ? "" : (stryCov_9fa48("7920"), 'bg-gradient-to-br from-primary-50 to-secondary-50')
    });
    const paddingStyles = stryMutAct_9fa48("7921") ? {} : (stryCov_9fa48("7921"), {
      none: stryMutAct_9fa48("7922") ? "Stryker was here!" : (stryCov_9fa48("7922"), ''),
      sm: stryMutAct_9fa48("7923") ? "" : (stryCov_9fa48("7923"), 'p-4'),
      md: stryMutAct_9fa48("7924") ? "" : (stryCov_9fa48("7924"), 'p-6'),
      lg: stryMutAct_9fa48("7925") ? "" : (stryCov_9fa48("7925"), 'p-8')
    });
    const hoverStyles = hover ? stryMutAct_9fa48("7926") ? "" : (stryCov_9fa48("7926"), 'hover:shadow-lg hover:-translate-y-1') : stryMutAct_9fa48("7927") ? "Stryker was here!" : (stryCov_9fa48("7927"), '');
    const classes = stryMutAct_9fa48("7928") ? `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}` : (stryCov_9fa48("7928"), (stryMutAct_9fa48("7929") ? `` : (stryCov_9fa48("7929"), `${baseStyles} ${variantStyles[variant]} ${paddingStyles[padding]} ${hoverStyles} ${className}`)).trim());
    return <div className={classes}>
      {children}
    </div>;
  }
}

/**
 * Server Card Header - Card section component
 */
interface ServerCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}
export function ServerCardHeader({
  children,
  className = stryMutAct_9fa48("7930") ? "Stryker was here!" : (stryCov_9fa48("7930"), '')
}: ServerCardHeaderProps) {
  if (stryMutAct_9fa48("7931")) {
    {}
  } else {
    stryCov_9fa48("7931");
    return <div className={stryMutAct_9fa48("7932") ? `` : (stryCov_9fa48("7932"), `mb-4 ${className}`)}>
      {children}
    </div>;
  }
}

/**
 * Server Card Content - Card section component
 */
interface ServerCardContentProps {
  children: React.ReactNode;
  className?: string;
}
export function ServerCardContent({
  children,
  className = stryMutAct_9fa48("7933") ? "Stryker was here!" : (stryCov_9fa48("7933"), '')
}: ServerCardContentProps) {
  if (stryMutAct_9fa48("7934")) {
    {}
  } else {
    stryCov_9fa48("7934");
    return <div className={stryMutAct_9fa48("7935") ? `` : (stryCov_9fa48("7935"), `${className}`)}>
      {children}
    </div>;
  }
}

/**
 * Server Card Footer - Card section component
 */
interface ServerCardFooterProps {
  children: React.ReactNode;
  className?: string;
}
export function ServerCardFooter({
  children,
  className = stryMutAct_9fa48("7936") ? "Stryker was here!" : (stryCov_9fa48("7936"), '')
}: ServerCardFooterProps) {
  if (stryMutAct_9fa48("7937")) {
    {}
  } else {
    stryCov_9fa48("7937");
    return <div className={stryMutAct_9fa48("7938") ? `` : (stryCov_9fa48("7938"), `mt-4 ${className}`)}>
      {children}
    </div>;
  }
}