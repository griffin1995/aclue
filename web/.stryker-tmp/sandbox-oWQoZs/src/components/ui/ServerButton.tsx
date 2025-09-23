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
import Link from 'next/link';
import { ArrowRight, ExternalLink } from 'lucide-react';

/**
 * Server Button Component - Server-First UI Pattern
 *
 * Server-rendered button component with support for both internal links and external links.
 * Optimized for performance with server-side rendering and progressive enhancement.
 *
 * Features:
 * - Server-side rendering for immediate visibility
 * - Multiple variants and sizes
 * - Link and button modes
 * - Accessibility built-in
 * - Performance optimized
 */

interface ServerButtonProps {
  children: React.ReactNode;
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  icon?: 'arrow' | 'external' | React.ReactNode;
  className?: string;
  disabled?: boolean;
  external?: boolean;
}
export default function ServerButton({
  children,
  href,
  variant = stryMutAct_9fa48("7873") ? "" : (stryCov_9fa48("7873"), 'primary'),
  size = stryMutAct_9fa48("7874") ? "" : (stryCov_9fa48("7874"), 'md'),
  icon,
  className = stryMutAct_9fa48("7875") ? "Stryker was here!" : (stryCov_9fa48("7875"), ''),
  disabled = stryMutAct_9fa48("7876") ? true : (stryCov_9fa48("7876"), false),
  external = stryMutAct_9fa48("7877") ? true : (stryCov_9fa48("7877"), false)
}: ServerButtonProps) {
  if (stryMutAct_9fa48("7878")) {
    {}
  } else {
    stryCov_9fa48("7878");
    const baseStyles = stryMutAct_9fa48("7879") ? "" : (stryCov_9fa48("7879"), 'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2');
    const variantStyles = stryMutAct_9fa48("7880") ? {} : (stryCov_9fa48("7880"), {
      primary: stryMutAct_9fa48("7881") ? "" : (stryCov_9fa48("7881"), 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500'),
      secondary: stryMutAct_9fa48("7882") ? "" : (stryCov_9fa48("7882"), 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500'),
      outline: stryMutAct_9fa48("7883") ? "" : (stryCov_9fa48("7883"), 'border-2 border-primary-600 text-primary-600 bg-white hover:bg-primary-50 focus:ring-primary-500'),
      ghost: stryMutAct_9fa48("7884") ? "" : (stryCov_9fa48("7884"), 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500')
    });
    const sizeStyles = stryMutAct_9fa48("7885") ? {} : (stryCov_9fa48("7885"), {
      sm: stryMutAct_9fa48("7886") ? "" : (stryCov_9fa48("7886"), 'px-4 py-2 text-sm rounded-lg'),
      md: stryMutAct_9fa48("7887") ? "" : (stryCov_9fa48("7887"), 'px-6 py-3 text-base rounded-lg'),
      lg: stryMutAct_9fa48("7888") ? "" : (stryCov_9fa48("7888"), 'px-8 py-4 text-lg rounded-xl')
    });
    const disabledStyles = disabled ? stryMutAct_9fa48("7889") ? "" : (stryCov_9fa48("7889"), 'opacity-50 cursor-not-allowed') : stryMutAct_9fa48("7890") ? "Stryker was here!" : (stryCov_9fa48("7890"), '');
    const classes = stryMutAct_9fa48("7891") ? `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}` : (stryCov_9fa48("7891"), (stryMutAct_9fa48("7892") ? `` : (stryCov_9fa48("7892"), `${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${disabledStyles} ${className}`)).trim());
    const renderIcon = () => {
      if (stryMutAct_9fa48("7893")) {
        {}
      } else {
        stryCov_9fa48("7893");
        if (stryMutAct_9fa48("7896") ? icon !== 'arrow' : stryMutAct_9fa48("7895") ? false : stryMutAct_9fa48("7894") ? true : (stryCov_9fa48("7894", "7895", "7896"), icon === (stryMutAct_9fa48("7897") ? "" : (stryCov_9fa48("7897"), 'arrow')))) return <ArrowRight className="w-5 h-5" />;
        if (stryMutAct_9fa48("7900") ? icon !== 'external' : stryMutAct_9fa48("7899") ? false : stryMutAct_9fa48("7898") ? true : (stryCov_9fa48("7898", "7899", "7900"), icon === (stryMutAct_9fa48("7901") ? "" : (stryCov_9fa48("7901"), 'external')))) return <ExternalLink className="w-5 h-5" />;
        if (stryMutAct_9fa48("7903") ? false : stryMutAct_9fa48("7902") ? true : (stryCov_9fa48("7902", "7903"), React.isValidElement(icon))) return icon;
        return null;
      }
    };
    if (stryMutAct_9fa48("7905") ? false : stryMutAct_9fa48("7904") ? true : (stryCov_9fa48("7904", "7905"), href)) {
      if (stryMutAct_9fa48("7906")) {
        {}
      } else {
        stryCov_9fa48("7906");
        if (stryMutAct_9fa48("7908") ? false : stryMutAct_9fa48("7907") ? true : (stryCov_9fa48("7907", "7908"), external)) {
          if (stryMutAct_9fa48("7909")) {
            {}
          } else {
            stryCov_9fa48("7909");
            return <a href={href} className={classes} target="_blank" rel="noopener noreferrer" aria-disabled={disabled}>
          {children}
          {renderIcon()}
        </a>;
          }
        }
        return <Link href={href} className={classes} aria-disabled={disabled}>
        {children}
        {renderIcon()}
      </Link>;
      }
    }
    return <button className={classes} disabled={disabled} type="button">
      {children}
      {renderIcon()}
    </button>;
  }
}