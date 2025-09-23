/**
 * Server Icon Component - Server-First UI Pattern
 *
 * Server-rendered icon wrapper component with consistent sizing and styling.
 * Provides a unified approach to icon usage across the application.
 *
 * Features:
 * - Server-side rendering for immediate display
 * - Consistent sizing system
 * - Color variants
 * - Accessibility attributes
 * - Performance optimized
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
interface ServerIconProps {
  icon: React.ReactNode;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  background?: boolean;
  className?: string;
  'aria-label'?: string;
}
export default function ServerIcon({
  icon,
  size = stryMutAct_9fa48("7939") ? "" : (stryCov_9fa48("7939"), 'md'),
  variant = stryMutAct_9fa48("7940") ? "" : (stryCov_9fa48("7940"), 'default'),
  background = stryMutAct_9fa48("7941") ? true : (stryCov_9fa48("7941"), false),
  className = stryMutAct_9fa48("7942") ? "Stryker was here!" : (stryCov_9fa48("7942"), ''),
  'aria-label': ariaLabel
}: ServerIconProps) {
  if (stryMutAct_9fa48("7943")) {
    {}
  } else {
    stryCov_9fa48("7943");
    const sizeStyles = stryMutAct_9fa48("7944") ? {} : (stryCov_9fa48("7944"), {
      xs: stryMutAct_9fa48("7945") ? "" : (stryCov_9fa48("7945"), 'w-4 h-4'),
      sm: stryMutAct_9fa48("7946") ? "" : (stryCov_9fa48("7946"), 'w-5 h-5'),
      md: stryMutAct_9fa48("7947") ? "" : (stryCov_9fa48("7947"), 'w-6 h-6'),
      lg: stryMutAct_9fa48("7948") ? "" : (stryCov_9fa48("7948"), 'w-8 h-8'),
      xl: stryMutAct_9fa48("7949") ? "" : (stryCov_9fa48("7949"), 'w-10 h-10'),
      '2xl': stryMutAct_9fa48("7950") ? "" : (stryCov_9fa48("7950"), 'w-12 h-12')
    });
    const backgroundSizes = stryMutAct_9fa48("7951") ? {} : (stryCov_9fa48("7951"), {
      xs: stryMutAct_9fa48("7952") ? "" : (stryCov_9fa48("7952"), 'w-8 h-8 p-1'),
      sm: stryMutAct_9fa48("7953") ? "" : (stryCov_9fa48("7953"), 'w-10 h-10 p-1.5'),
      md: stryMutAct_9fa48("7954") ? "" : (stryCov_9fa48("7954"), 'w-12 h-12 p-1.5'),
      lg: stryMutAct_9fa48("7955") ? "" : (stryCov_9fa48("7955"), 'w-16 h-16 p-2'),
      xl: stryMutAct_9fa48("7956") ? "" : (stryCov_9fa48("7956"), 'w-20 h-20 p-2.5'),
      '2xl': stryMutAct_9fa48("7957") ? "" : (stryCov_9fa48("7957"), 'w-24 h-24 p-3')
    });
    const variantStyles = stryMutAct_9fa48("7958") ? {} : (stryCov_9fa48("7958"), {
      default: stryMutAct_9fa48("7959") ? "" : (stryCov_9fa48("7959"), 'text-gray-600'),
      primary: stryMutAct_9fa48("7960") ? "" : (stryCov_9fa48("7960"), 'text-primary-600'),
      secondary: stryMutAct_9fa48("7961") ? "" : (stryCov_9fa48("7961"), 'text-secondary-600'),
      success: stryMutAct_9fa48("7962") ? "" : (stryCov_9fa48("7962"), 'text-green-600'),
      warning: stryMutAct_9fa48("7963") ? "" : (stryCov_9fa48("7963"), 'text-yellow-600'),
      error: stryMutAct_9fa48("7964") ? "" : (stryCov_9fa48("7964"), 'text-red-600')
    });
    const backgroundVariants = stryMutAct_9fa48("7965") ? {} : (stryCov_9fa48("7965"), {
      default: stryMutAct_9fa48("7966") ? "" : (stryCov_9fa48("7966"), 'bg-gray-100'),
      primary: stryMutAct_9fa48("7967") ? "" : (stryCov_9fa48("7967"), 'bg-primary-100'),
      secondary: stryMutAct_9fa48("7968") ? "" : (stryCov_9fa48("7968"), 'bg-secondary-100'),
      success: stryMutAct_9fa48("7969") ? "" : (stryCov_9fa48("7969"), 'bg-green-100'),
      warning: stryMutAct_9fa48("7970") ? "" : (stryCov_9fa48("7970"), 'bg-yellow-100'),
      error: stryMutAct_9fa48("7971") ? "" : (stryCov_9fa48("7971"), 'bg-red-100')
    });
    if (stryMutAct_9fa48("7973") ? false : stryMutAct_9fa48("7972") ? true : (stryCov_9fa48("7972", "7973"), background)) {
      if (stryMutAct_9fa48("7974")) {
        {}
      } else {
        stryCov_9fa48("7974");
        const backgroundClasses = stryMutAct_9fa48("7975") ? `inline-flex items-center justify-center rounded-2xl ${backgroundSizes[size]} ${backgroundVariants[variant]} ${variantStyles[variant]} ${className}` : (stryCov_9fa48("7975"), (stryMutAct_9fa48("7976") ? `` : (stryCov_9fa48("7976"), `inline-flex items-center justify-center rounded-2xl ${backgroundSizes[size]} ${backgroundVariants[variant]} ${variantStyles[variant]} ${className}`)).trim());
        return <div className={backgroundClasses} aria-label={ariaLabel}>
        <span className={sizeStyles[size]}>
          {icon}
        </span>
      </div>;
      }
    }
    const iconClasses = stryMutAct_9fa48("7977") ? `inline-flex ${sizeStyles[size]} ${variantStyles[variant]} ${className}` : (stryCov_9fa48("7977"), (stryMutAct_9fa48("7978") ? `` : (stryCov_9fa48("7978"), `inline-flex ${sizeStyles[size]} ${variantStyles[variant]} ${className}`)).trim());
    return <span className={iconClasses} aria-label={ariaLabel}>
      {icon}
    </span>;
  }
}