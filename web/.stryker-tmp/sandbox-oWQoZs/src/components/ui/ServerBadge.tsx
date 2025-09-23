/**
 * Server Badge Component - Server-First UI Pattern
 *
 * Server-rendered badge component for status indicators, tags, and labels.
 * Optimized for immediate visibility and semantic clarity.
 *
 * Features:
 * - Server-side rendering for instant display
 * - Multiple variants and sizes
 * - Icon support
 * - Accessibility built-in
 * - Semantic HTML structure
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
interface ServerBadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  className?: string;
}
export default function ServerBadge({
  children,
  variant = stryMutAct_9fa48("7847") ? "" : (stryCov_9fa48("7847"), 'primary'),
  size = stryMutAct_9fa48("7848") ? "" : (stryCov_9fa48("7848"), 'md'),
  icon,
  className = stryMutAct_9fa48("7849") ? "Stryker was here!" : (stryCov_9fa48("7849"), '')
}: ServerBadgeProps) {
  if (stryMutAct_9fa48("7850")) {
    {}
  } else {
    stryCov_9fa48("7850");
    const baseStyles = stryMutAct_9fa48("7851") ? "" : (stryCov_9fa48("7851"), 'inline-flex items-center gap-2 font-medium rounded-full');
    const variantStyles = stryMutAct_9fa48("7852") ? {} : (stryCov_9fa48("7852"), {
      primary: stryMutAct_9fa48("7853") ? "" : (stryCov_9fa48("7853"), 'bg-primary-100 text-primary-800'),
      secondary: stryMutAct_9fa48("7854") ? "" : (stryCov_9fa48("7854"), 'bg-secondary-100 text-secondary-800'),
      success: stryMutAct_9fa48("7855") ? "" : (stryCov_9fa48("7855"), 'bg-green-100 text-green-800'),
      warning: stryMutAct_9fa48("7856") ? "" : (stryCov_9fa48("7856"), 'bg-yellow-100 text-yellow-800'),
      error: stryMutAct_9fa48("7857") ? "" : (stryCov_9fa48("7857"), 'bg-red-100 text-red-800'),
      info: stryMutAct_9fa48("7858") ? "" : (stryCov_9fa48("7858"), 'bg-blue-100 text-blue-800'),
      neutral: stryMutAct_9fa48("7859") ? "" : (stryCov_9fa48("7859"), 'bg-gray-100 text-gray-800')
    });
    const sizeStyles = stryMutAct_9fa48("7860") ? {} : (stryCov_9fa48("7860"), {
      sm: stryMutAct_9fa48("7861") ? "" : (stryCov_9fa48("7861"), 'px-2 py-1 text-xs'),
      md: stryMutAct_9fa48("7862") ? "" : (stryCov_9fa48("7862"), 'px-3 py-1 text-sm'),
      lg: stryMutAct_9fa48("7863") ? "" : (stryCov_9fa48("7863"), 'px-4 py-2 text-base')
    });
    const iconSizes = stryMutAct_9fa48("7864") ? {} : (stryCov_9fa48("7864"), {
      sm: stryMutAct_9fa48("7865") ? "" : (stryCov_9fa48("7865"), 'w-3 h-3'),
      md: stryMutAct_9fa48("7866") ? "" : (stryCov_9fa48("7866"), 'w-4 h-4'),
      lg: stryMutAct_9fa48("7867") ? "" : (stryCov_9fa48("7867"), 'w-5 h-5')
    });
    const classes = stryMutAct_9fa48("7868") ? `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}` : (stryCov_9fa48("7868"), (stryMutAct_9fa48("7869") ? `` : (stryCov_9fa48("7869"), `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`)).trim());
    return <span className={classes}>
      {stryMutAct_9fa48("7872") ? icon || <span className={iconSizes[size]}>
          {icon}
        </span> : stryMutAct_9fa48("7871") ? false : stryMutAct_9fa48("7870") ? true : (stryCov_9fa48("7870", "7871", "7872"), icon && <span className={iconSizes[size]}>
          {icon}
        </span>)}
      {children}
    </span>;
  }
}