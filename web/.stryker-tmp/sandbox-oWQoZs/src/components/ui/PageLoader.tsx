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
import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Sparkles } from 'lucide-react';
interface PageLoaderProps {
  text?: string;
  className?: string;
}
export const PageLoader: React.FC<PageLoaderProps> = ({
  text = stryMutAct_9fa48("7809") ? "" : (stryCov_9fa48("7809"), 'Loading aclue...'),
  className = stryMutAct_9fa48("7810") ? "Stryker was here!" : (stryCov_9fa48("7810"), '')
}) => {
  if (stryMutAct_9fa48("7811")) {
    {}
  } else {
    stryCov_9fa48("7811");
    return <div className={stryMutAct_9fa48("7812") ? `` : (stryCov_9fa48("7812"), `min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center ${className}`)}>
      <motion.div initial={stryMutAct_9fa48("7813") ? {} : (stryCov_9fa48("7813"), {
        opacity: 0,
        scale: 0.9
      })} animate={stryMutAct_9fa48("7814") ? {} : (stryCov_9fa48("7814"), {
        opacity: 1,
        scale: 1
      })} transition={stryMutAct_9fa48("7815") ? {} : (stryCov_9fa48("7815"), {
        duration: 0.5
      })} className="text-center">
        {/* Logo Animation */}
        <motion.div className="relative mb-8" animate={stryMutAct_9fa48("7816") ? {} : (stryCov_9fa48("7816"), {
          scale: stryMutAct_9fa48("7817") ? [] : (stryCov_9fa48("7817"), [1, 1.1, 1])
        })} transition={stryMutAct_9fa48("7818") ? {} : (stryCov_9fa48("7818"), {
          duration: 2,
          repeat: Infinity,
          ease: stryMutAct_9fa48("7819") ? "" : (stryCov_9fa48("7819"), "easeInOut")
        })}>
          <div className="w-20 h-20 gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-glow-lg">
            <Gift className="w-10 h-10 text-white" />
          </div>
          
          {/* Orbiting sparkles */}
          <motion.div className="absolute inset-0" animate={stryMutAct_9fa48("7820") ? {} : (stryCov_9fa48("7820"), {
            rotate: 360
          })} transition={stryMutAct_9fa48("7821") ? {} : (stryCov_9fa48("7821"), {
            duration: 8,
            repeat: Infinity,
            ease: stryMutAct_9fa48("7822") ? "" : (stryCov_9fa48("7822"), "linear")
          })}>
            <Sparkles className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-primary-400" />
            <Sparkles className="absolute top-1/2 -right-2 transform -translate-y-1/2 w-3 h-3 text-secondary-400" />
            <Sparkles className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 text-primary-400" />
            <Sparkles className="absolute top-1/2 -left-2 transform -translate-y-1/2 w-3 h-3 text-secondary-400" />
          </motion.div>
        </motion.div>

        {/* Loading Text */}
        <motion.div initial={stryMutAct_9fa48("7823") ? {} : (stryCov_9fa48("7823"), {
          opacity: 0
        })} animate={stryMutAct_9fa48("7824") ? {} : (stryCov_9fa48("7824"), {
          opacity: 1
        })} transition={stryMutAct_9fa48("7825") ? {} : (stryCov_9fa48("7825"), {
          delay: 0.3,
          duration: 0.5
        })}>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">aclue</h2>
          <p className="text-gray-600 loading-dots">{text}</p>
        </motion.div>

        {/* Progress Dots */}
        <motion.div initial={stryMutAct_9fa48("7826") ? {} : (stryCov_9fa48("7826"), {
          opacity: 0
        })} animate={stryMutAct_9fa48("7827") ? {} : (stryCov_9fa48("7827"), {
          opacity: 1
        })} transition={stryMutAct_9fa48("7828") ? {} : (stryCov_9fa48("7828"), {
          delay: 0.5,
          duration: 0.5
        })} className="flex gap-2 justify-center mt-8">
          {(stryMutAct_9fa48("7829") ? [] : (stryCov_9fa48("7829"), [0, 1, 2])).map(stryMutAct_9fa48("7830") ? () => undefined : (stryCov_9fa48("7830"), i => <motion.div key={i} className="w-2 h-2 bg-primary-600 rounded-full" animate={stryMutAct_9fa48("7831") ? {} : (stryCov_9fa48("7831"), {
            scale: stryMutAct_9fa48("7832") ? [] : (stryCov_9fa48("7832"), [1, 1.5, 1]),
            opacity: stryMutAct_9fa48("7833") ? [] : (stryCov_9fa48("7833"), [0.5, 1, 0.5])
          })} transition={stryMutAct_9fa48("7834") ? {} : (stryCov_9fa48("7834"), {
            duration: 1.5,
            repeat: Infinity,
            delay: stryMutAct_9fa48("7835") ? i / 0.2 : (stryCov_9fa48("7835"), i * 0.2),
            ease: stryMutAct_9fa48("7836") ? "" : (stryCov_9fa48("7836"), "easeInOut")
          })} />))}
        </motion.div>
      </motion.div>
    </div>;
  }
};
export const MiniLoader: React.FC<{
  size?: 'sm' | 'md' | 'lg';
}> = ({
  size = stryMutAct_9fa48("7837") ? "" : (stryCov_9fa48("7837"), 'md')
}) => {
  if (stryMutAct_9fa48("7838")) {
    {}
  } else {
    stryCov_9fa48("7838");
    const sizeClasses = stryMutAct_9fa48("7839") ? {} : (stryCov_9fa48("7839"), {
      sm: stryMutAct_9fa48("7840") ? "" : (stryCov_9fa48("7840"), 'w-4 h-4'),
      md: stryMutAct_9fa48("7841") ? "" : (stryCov_9fa48("7841"), 'w-6 h-6'),
      lg: stryMutAct_9fa48("7842") ? "" : (stryCov_9fa48("7842"), 'w-8 h-8')
    });
    return <motion.div animate={stryMutAct_9fa48("7843") ? {} : (stryCov_9fa48("7843"), {
      rotate: 360
    })} transition={stryMutAct_9fa48("7844") ? {} : (stryCov_9fa48("7844"), {
      duration: 1,
      repeat: Infinity,
      ease: stryMutAct_9fa48("7845") ? "" : (stryCov_9fa48("7845"), "linear")
    })} className={stryMutAct_9fa48("7846") ? `` : (stryCov_9fa48("7846"), `${sizeClasses[size]} border-2 border-primary-200 border-t-primary-600 rounded-full`)} />;
  }
};