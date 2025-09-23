/**
 * Formatting utilities for the aclue web application
 */
// @ts-nocheck


/**
 * Format a price with currency symbol
 */function stryNS_9fa48() {
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
export function formatPrice(amount: number, currency: string): string {
  if (stryMutAct_9fa48("14829")) {
    {}
  } else {
    stryCov_9fa48("14829");
    const currencySymbol = formatCurrency(currency);
    const formatted = new Intl.NumberFormat(stryMutAct_9fa48("14830") ? "" : (stryCov_9fa48("14830"), 'en-GB'), stryMutAct_9fa48("14831") ? {} : (stryCov_9fa48("14831"), {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })).format(Math.abs(amount));
    return (stryMutAct_9fa48("14835") ? amount >= 0 : stryMutAct_9fa48("14834") ? amount <= 0 : stryMutAct_9fa48("14833") ? false : stryMutAct_9fa48("14832") ? true : (stryCov_9fa48("14832", "14833", "14834", "14835"), amount < 0)) ? stryMutAct_9fa48("14836") ? `` : (stryCov_9fa48("14836"), `-${currencySymbol}${formatted}`) : stryMutAct_9fa48("14837") ? `` : (stryCov_9fa48("14837"), `${currencySymbol}${formatted}`);
  }
}

/**
 * Get currency symbol for a given currency code
 */
export function formatCurrency(currency: string): string {
  if (stryMutAct_9fa48("14838")) {
    {}
  } else {
    stryCov_9fa48("14838");
    const currencyMap: {
      [key: string]: string;
    } = stryMutAct_9fa48("14839") ? {} : (stryCov_9fa48("14839"), {
      USD: stryMutAct_9fa48("14840") ? "" : (stryCov_9fa48("14840"), '$'),
      EUR: stryMutAct_9fa48("14841") ? "" : (stryCov_9fa48("14841"), '€'),
      GBP: stryMutAct_9fa48("14842") ? "" : (stryCov_9fa48("14842"), '£'),
      JPY: stryMutAct_9fa48("14843") ? "" : (stryCov_9fa48("14843"), '¥'),
      CAD: stryMutAct_9fa48("14844") ? "" : (stryCov_9fa48("14844"), 'C$'),
      AUD: stryMutAct_9fa48("14845") ? "" : (stryCov_9fa48("14845"), 'A$'),
      CHF: stryMutAct_9fa48("14846") ? "" : (stryCov_9fa48("14846"), 'CHF'),
      CNY: stryMutAct_9fa48("14847") ? "" : (stryCov_9fa48("14847"), '¥'),
      SEK: stryMutAct_9fa48("14848") ? "" : (stryCov_9fa48("14848"), 'kr'),
      NOK: stryMutAct_9fa48("14849") ? "" : (stryCov_9fa48("14849"), 'kr'),
      DKK: stryMutAct_9fa48("14850") ? "" : (stryCov_9fa48("14850"), 'kr'),
      PLN: stryMutAct_9fa48("14851") ? "" : (stryCov_9fa48("14851"), 'zł'),
      CZK: stryMutAct_9fa48("14852") ? "" : (stryCov_9fa48("14852"), 'Kč'),
      HUF: stryMutAct_9fa48("14853") ? "" : (stryCov_9fa48("14853"), 'Ft'),
      RUB: stryMutAct_9fa48("14854") ? "" : (stryCov_9fa48("14854"), '₽'),
      INR: stryMutAct_9fa48("14855") ? "" : (stryCov_9fa48("14855"), '₹'),
      BRL: stryMutAct_9fa48("14856") ? "" : (stryCov_9fa48("14856"), 'R$'),
      ZAR: stryMutAct_9fa48("14857") ? "" : (stryCov_9fa48("14857"), 'R'),
      KRW: stryMutAct_9fa48("14858") ? "" : (stryCov_9fa48("14858"), '₩'),
      SGD: stryMutAct_9fa48("14859") ? "" : (stryCov_9fa48("14859"), 'S$'),
      HKD: stryMutAct_9fa48("14860") ? "" : (stryCov_9fa48("14860"), 'HK$'),
      MXN: stryMutAct_9fa48("14861") ? "" : (stryCov_9fa48("14861"), '$'),
      NZD: stryMutAct_9fa48("14862") ? "" : (stryCov_9fa48("14862"), 'NZ$')
    });
    return stryMutAct_9fa48("14865") ? currencyMap[currency.toUpperCase()] && currency.toUpperCase() : stryMutAct_9fa48("14864") ? false : stryMutAct_9fa48("14863") ? true : (stryCov_9fa48("14863", "14864", "14865"), currencyMap[stryMutAct_9fa48("14866") ? currency.toLowerCase() : (stryCov_9fa48("14866"), currency.toUpperCase())] || (stryMutAct_9fa48("14867") ? currency.toLowerCase() : (stryCov_9fa48("14867"), currency.toUpperCase())));
  }
}

/**
 * Format a date for display with British format (DD/MM/YYYY)
 */
export function formatDate(date: Date | string): string {
  if (stryMutAct_9fa48("14868")) {
    {}
  } else {
    stryCov_9fa48("14868");
    const targetDate = (stryMutAct_9fa48("14871") ? typeof date !== 'string' : stryMutAct_9fa48("14870") ? false : stryMutAct_9fa48("14869") ? true : (stryCov_9fa48("14869", "14870", "14871"), typeof date === (stryMutAct_9fa48("14872") ? "" : (stryCov_9fa48("14872"), 'string')))) ? new Date(date) : date;
    return targetDate.toLocaleDateString(stryMutAct_9fa48("14873") ? "" : (stryCov_9fa48("14873"), 'en-GB'));
  }
}

/**
 * Format a date as relative time (e.g., "2 hours ago", "in 3 days")
 */
export function formatRelativeTime(date: Date | string): string {
  if (stryMutAct_9fa48("14874")) {
    {}
  } else {
    stryCov_9fa48("14874");
    const targetDate = (stryMutAct_9fa48("14877") ? typeof date !== 'string' : stryMutAct_9fa48("14876") ? false : stryMutAct_9fa48("14875") ? true : (stryCov_9fa48("14875", "14876", "14877"), typeof date === (stryMutAct_9fa48("14878") ? "" : (stryCov_9fa48("14878"), 'string')))) ? new Date(date) : date;
    const now = new Date();
    const diffInSeconds = Math.floor(stryMutAct_9fa48("14879") ? (now.getTime() - targetDate.getTime()) * 1000 : (stryCov_9fa48("14879"), (stryMutAct_9fa48("14880") ? now.getTime() + targetDate.getTime() : (stryCov_9fa48("14880"), now.getTime() - targetDate.getTime())) / 1000));
    const absDiff = Math.abs(diffInSeconds);
    const intervals = stryMutAct_9fa48("14881") ? [] : (stryCov_9fa48("14881"), [stryMutAct_9fa48("14882") ? {} : (stryCov_9fa48("14882"), {
      label: stryMutAct_9fa48("14883") ? "" : (stryCov_9fa48("14883"), 'year'),
      seconds: 31536000
    }), stryMutAct_9fa48("14884") ? {} : (stryCov_9fa48("14884"), {
      label: stryMutAct_9fa48("14885") ? "" : (stryCov_9fa48("14885"), 'month'),
      seconds: 2592000
    }), stryMutAct_9fa48("14886") ? {} : (stryCov_9fa48("14886"), {
      label: stryMutAct_9fa48("14887") ? "" : (stryCov_9fa48("14887"), 'week'),
      seconds: 604800
    }), stryMutAct_9fa48("14888") ? {} : (stryCov_9fa48("14888"), {
      label: stryMutAct_9fa48("14889") ? "" : (stryCov_9fa48("14889"), 'day'),
      seconds: 86400
    }), stryMutAct_9fa48("14890") ? {} : (stryCov_9fa48("14890"), {
      label: stryMutAct_9fa48("14891") ? "" : (stryCov_9fa48("14891"), 'hour'),
      seconds: 3600
    }), stryMutAct_9fa48("14892") ? {} : (stryCov_9fa48("14892"), {
      label: stryMutAct_9fa48("14893") ? "" : (stryCov_9fa48("14893"), 'minute'),
      seconds: 60
    }), stryMutAct_9fa48("14894") ? {} : (stryCov_9fa48("14894"), {
      label: stryMutAct_9fa48("14895") ? "" : (stryCov_9fa48("14895"), 'second'),
      seconds: 1
    })]);
    for (const interval of intervals) {
      if (stryMutAct_9fa48("14896")) {
        {}
      } else {
        stryCov_9fa48("14896");
        const count = Math.floor(stryMutAct_9fa48("14897") ? absDiff * interval.seconds : (stryCov_9fa48("14897"), absDiff / interval.seconds));
        if (stryMutAct_9fa48("14901") ? count < 1 : stryMutAct_9fa48("14900") ? count > 1 : stryMutAct_9fa48("14899") ? false : stryMutAct_9fa48("14898") ? true : (stryCov_9fa48("14898", "14899", "14900", "14901"), count >= 1)) {
          if (stryMutAct_9fa48("14902")) {
            {}
          } else {
            stryCov_9fa48("14902");
            const suffix = (stryMutAct_9fa48("14905") ? count !== 1 : stryMutAct_9fa48("14904") ? false : stryMutAct_9fa48("14903") ? true : (stryCov_9fa48("14903", "14904", "14905"), count === 1)) ? stryMutAct_9fa48("14906") ? "Stryker was here!" : (stryCov_9fa48("14906"), '') : stryMutAct_9fa48("14907") ? "" : (stryCov_9fa48("14907"), 's');
            const timeUnit = stryMutAct_9fa48("14908") ? `` : (stryCov_9fa48("14908"), `${count} ${interval.label}${suffix}`);
            return (stryMutAct_9fa48("14912") ? diffInSeconds >= 0 : stryMutAct_9fa48("14911") ? diffInSeconds <= 0 : stryMutAct_9fa48("14910") ? false : stryMutAct_9fa48("14909") ? true : (stryCov_9fa48("14909", "14910", "14911", "14912"), diffInSeconds < 0)) ? stryMutAct_9fa48("14913") ? `` : (stryCov_9fa48("14913"), `in ${timeUnit}`) : stryMutAct_9fa48("14914") ? `` : (stryCov_9fa48("14914"), `${timeUnit} ago`);
          }
        }
      }
    }
    return (stryMutAct_9fa48("14918") ? diffInSeconds >= 0 : stryMutAct_9fa48("14917") ? diffInSeconds <= 0 : stryMutAct_9fa48("14916") ? false : stryMutAct_9fa48("14915") ? true : (stryCov_9fa48("14915", "14916", "14917", "14918"), diffInSeconds < 0)) ? stryMutAct_9fa48("14919") ? "" : (stryCov_9fa48("14919"), 'in 1 second') : stryMutAct_9fa48("14920") ? "" : (stryCov_9fa48("14920"), '1 second ago');
  }
}

/**
 * Format a number with internationalization options
 */
export function formatNumber(num: number, options: Intl.NumberFormatOptions = {}): string {
  if (stryMutAct_9fa48("14921")) {
    {}
  } else {
    stryCov_9fa48("14921");
    const defaultOptions: Intl.NumberFormatOptions = stryMutAct_9fa48("14922") ? {} : (stryCov_9fa48("14922"), {
      notation: stryMutAct_9fa48("14923") ? "" : (stryCov_9fa48("14923"), 'standard'),
      maximumFractionDigits: 0,
      ...options
    });
    return new Intl.NumberFormat(stryMutAct_9fa48("14924") ? "" : (stryCov_9fa48("14924"), 'en-GB'), defaultOptions).format(num);
  }
}

/**
 * Format a percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  if (stryMutAct_9fa48("14925")) {
    {}
  } else {
    stryCov_9fa48("14925");
    return formatNumber(value, stryMutAct_9fa48("14926") ? {} : (stryCov_9fa48("14926"), {
      style: stryMutAct_9fa48("14927") ? "" : (stryCov_9fa48("14927"), 'percent'),
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }));
  }
}

/**
 * Format file size in human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (stryMutAct_9fa48("14928")) {
    {}
  } else {
    stryCov_9fa48("14928");
    if (stryMutAct_9fa48("14931") ? bytes !== 0 : stryMutAct_9fa48("14930") ? false : stryMutAct_9fa48("14929") ? true : (stryCov_9fa48("14929", "14930", "14931"), bytes === 0)) return stryMutAct_9fa48("14932") ? "" : (stryCov_9fa48("14932"), '0 Bytes');
    const k = 1024;
    const dm = 1;
    const sizes = stryMutAct_9fa48("14933") ? [] : (stryCov_9fa48("14933"), [stryMutAct_9fa48("14934") ? "" : (stryCov_9fa48("14934"), 'Bytes'), stryMutAct_9fa48("14935") ? "" : (stryCov_9fa48("14935"), 'KB'), stryMutAct_9fa48("14936") ? "" : (stryCov_9fa48("14936"), 'MB'), stryMutAct_9fa48("14937") ? "" : (stryCov_9fa48("14937"), 'GB'), stryMutAct_9fa48("14938") ? "" : (stryCov_9fa48("14938"), 'TB'), stryMutAct_9fa48("14939") ? "" : (stryCov_9fa48("14939"), 'PB')]);
    const i = Math.floor(stryMutAct_9fa48("14940") ? Math.log(bytes) * Math.log(k) : (stryCov_9fa48("14940"), Math.log(bytes) / Math.log(k)));
    return parseFloat((stryMutAct_9fa48("14941") ? bytes * Math.pow(k, i) : (stryCov_9fa48("14941"), bytes / Math.pow(k, i))).toFixed(dm)) + (stryMutAct_9fa48("14942") ? "" : (stryCov_9fa48("14942"), ' ')) + sizes[i];
  }
}

/**
 * Format a rating as stars (for display purposes)
 */
export function formatStars(rating: number, maxRating: number = 5): string {
  if (stryMutAct_9fa48("14943")) {
    {}
  } else {
    stryCov_9fa48("14943");
    const fullStars = Math.floor(rating);
    const hasHalfStar = stryMutAct_9fa48("14947") ? rating % 1 < 0.5 : stryMutAct_9fa48("14946") ? rating % 1 > 0.5 : stryMutAct_9fa48("14945") ? false : stryMutAct_9fa48("14944") ? true : (stryCov_9fa48("14944", "14945", "14946", "14947"), (stryMutAct_9fa48("14948") ? rating * 1 : (stryCov_9fa48("14948"), rating % 1)) >= 0.5);
    const emptyStars = stryMutAct_9fa48("14949") ? maxRating - fullStars + (hasHalfStar ? 1 : 0) : (stryCov_9fa48("14949"), (stryMutAct_9fa48("14950") ? maxRating + fullStars : (stryCov_9fa48("14950"), maxRating - fullStars)) - (hasHalfStar ? 1 : 0));
    return stryMutAct_9fa48("14951") ? '★'.repeat(fullStars) + (hasHalfStar ? '☆' : '') - '☆'.repeat(emptyStars) : (stryCov_9fa48("14951"), (stryMutAct_9fa48("14952") ? '★'.repeat(fullStars) - (hasHalfStar ? '☆' : '') : (stryCov_9fa48("14952"), (stryMutAct_9fa48("14953") ? "" : (stryCov_9fa48("14953"), '★')).repeat(fullStars) + (hasHalfStar ? stryMutAct_9fa48("14954") ? "" : (stryCov_9fa48("14954"), '☆') : stryMutAct_9fa48("14955") ? "Stryker was here!" : (stryCov_9fa48("14955"), '')))) + (stryMutAct_9fa48("14956") ? "" : (stryCov_9fa48("14956"), '☆')).repeat(emptyStars));
  }
}

/**
 * Truncate text to a specific length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (stryMutAct_9fa48("14957")) {
    {}
  } else {
    stryCov_9fa48("14957");
    if (stryMutAct_9fa48("14961") ? text.length > maxLength : stryMutAct_9fa48("14960") ? text.length < maxLength : stryMutAct_9fa48("14959") ? false : stryMutAct_9fa48("14958") ? true : (stryCov_9fa48("14958", "14959", "14960", "14961"), text.length <= maxLength)) return text;
    return (stryMutAct_9fa48("14962") ? text : (stryCov_9fa48("14962"), text.slice(0, stryMutAct_9fa48("14963") ? maxLength + 3 : (stryCov_9fa48("14963"), maxLength - 3)))) + (stryMutAct_9fa48("14964") ? "" : (stryCov_9fa48("14964"), '...'));
  }
}

/**
 * Format a phone number
 */
export function formatPhoneNumber(phoneNumber: string): string {
  if (stryMutAct_9fa48("14965")) {
    {}
  } else {
    stryCov_9fa48("14965");
    // Remove all non-digit characters
    const cleaned = phoneNumber.replace(stryMutAct_9fa48("14966") ? /\d/g : (stryCov_9fa48("14966"), /\D/g), stryMutAct_9fa48("14967") ? "Stryker was here!" : (stryCov_9fa48("14967"), ''));

    // Check if the number is a US number
    if (stryMutAct_9fa48("14970") ? cleaned.length !== 10 : stryMutAct_9fa48("14969") ? false : stryMutAct_9fa48("14968") ? true : (stryCov_9fa48("14968", "14969", "14970"), cleaned.length === 10)) {
      if (stryMutAct_9fa48("14971")) {
        {}
      } else {
        stryCov_9fa48("14971");
        return stryMutAct_9fa48("14972") ? `` : (stryCov_9fa48("14972"), `(${stryMutAct_9fa48("14973") ? cleaned : (stryCov_9fa48("14973"), cleaned.slice(0, 3))}) ${stryMutAct_9fa48("14974") ? cleaned : (stryCov_9fa48("14974"), cleaned.slice(3, 6))}-${stryMutAct_9fa48("14975") ? cleaned : (stryCov_9fa48("14975"), cleaned.slice(6))}`);
      }
    } else if (stryMutAct_9fa48("14978") ? cleaned.length === 11 || cleaned[0] === '1' : stryMutAct_9fa48("14977") ? false : stryMutAct_9fa48("14976") ? true : (stryCov_9fa48("14976", "14977", "14978"), (stryMutAct_9fa48("14980") ? cleaned.length !== 11 : stryMutAct_9fa48("14979") ? true : (stryCov_9fa48("14979", "14980"), cleaned.length === 11)) && (stryMutAct_9fa48("14982") ? cleaned[0] !== '1' : stryMutAct_9fa48("14981") ? true : (stryCov_9fa48("14981", "14982"), cleaned[0] === (stryMutAct_9fa48("14983") ? "" : (stryCov_9fa48("14983"), '1')))))) {
      if (stryMutAct_9fa48("14984")) {
        {}
      } else {
        stryCov_9fa48("14984");
        return stryMutAct_9fa48("14985") ? `` : (stryCov_9fa48("14985"), `+1 (${stryMutAct_9fa48("14986") ? cleaned : (stryCov_9fa48("14986"), cleaned.slice(1, 4))}) ${stryMutAct_9fa48("14987") ? cleaned : (stryCov_9fa48("14987"), cleaned.slice(4, 7))}-${stryMutAct_9fa48("14988") ? cleaned : (stryCov_9fa48("14988"), cleaned.slice(7))}`);
      }
    }

    // Return original if not a recognised format
    return phoneNumber;
  }
}

/**
 * Capitalize the first letter of each word
 */
export function formatTitleCase(text: string): string {
  if (stryMutAct_9fa48("14989")) {
    {}
  } else {
    stryCov_9fa48("14989");
    return stryMutAct_9fa48("14990") ? text.toUpperCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : (stryCov_9fa48("14990"), text.toLowerCase().split(stryMutAct_9fa48("14991") ? "" : (stryCov_9fa48("14991"), ' ')).map(stryMutAct_9fa48("14992") ? () => undefined : (stryCov_9fa48("14992"), word => stryMutAct_9fa48("14993") ? word.charAt(0).toUpperCase() - word.slice(1) : (stryCov_9fa48("14993"), (stryMutAct_9fa48("14995") ? word.toUpperCase() : stryMutAct_9fa48("14994") ? word.charAt(0).toLowerCase() : (stryCov_9fa48("14994", "14995"), word.charAt(0).toUpperCase())) + (stryMutAct_9fa48("14996") ? word : (stryCov_9fa48("14996"), word.slice(1)))))).join(stryMutAct_9fa48("14997") ? "" : (stryCov_9fa48("14997"), ' ')));
  }
}

/**
 * Format a URL to display without protocol
 */
export function formatDisplayUrl(url: string): string {
  if (stryMutAct_9fa48("14998")) {
    {}
  } else {
    stryCov_9fa48("14998");
    try {
      if (stryMutAct_9fa48("14999")) {
        {}
      } else {
        stryCov_9fa48("14999");
        const urlObj = new URL(url);
        return stryMutAct_9fa48("15000") ? urlObj.hostname + urlObj.pathname - urlObj.search : (stryCov_9fa48("15000"), (stryMutAct_9fa48("15001") ? urlObj.hostname - urlObj.pathname : (stryCov_9fa48("15001"), urlObj.hostname + urlObj.pathname)) + urlObj.search);
      }
    } catch {
      if (stryMutAct_9fa48("15002")) {
        {}
      } else {
        stryCov_9fa48("15002");
        return url;
      }
    }
  }
}