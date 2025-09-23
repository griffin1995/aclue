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
import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Star, Zap, ShoppingBag, Share2, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import { generateAffiliateLink, trackAffiliateClick, isValidAmazonUrl, extractASIN } from '@/lib/affiliate';
interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  rating?: number;
  category: string;
  brand?: string;
  features?: string[];
  url?: string;
  currency?: string;
}
interface EnhancedSwipeCardProps {
  product: Product;
  onSwipe: (direction: 'left' | 'right' | 'up') => void;
  style?: React.CSSProperties;
  className?: string;
}
export const EnhancedSwipeCard: React.FC<EnhancedSwipeCardProps> = ({
  product,
  onSwipe,
  className = stryMutAct_9fa48("6416") ? "Stryker was here!" : (stryCov_9fa48("6416"), '')
}) => {
  if (stryMutAct_9fa48("6417")) {
    {}
  } else {
    stryCov_9fa48("6417");
    const [isExiting, setIsExiting] = useState(stryMutAct_9fa48("6418") ? true : (stryCov_9fa48("6418"), false));
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    // Transform values for rotation and opacity based on drag
    const rotate = useTransform(x, stryMutAct_9fa48("6419") ? [] : (stryCov_9fa48("6419"), [stryMutAct_9fa48("6420") ? +200 : (stryCov_9fa48("6420"), -200), 200]), stryMutAct_9fa48("6421") ? [] : (stryCov_9fa48("6421"), [stryMutAct_9fa48("6422") ? +25 : (stryCov_9fa48("6422"), -25), 25]));
    const opacity = useTransform(x, stryMutAct_9fa48("6423") ? [] : (stryCov_9fa48("6423"), [stryMutAct_9fa48("6424") ? +200 : (stryCov_9fa48("6424"), -200), stryMutAct_9fa48("6425") ? +50 : (stryCov_9fa48("6425"), -50), 0, 50, 200]), stryMutAct_9fa48("6426") ? [] : (stryCov_9fa48("6426"), [0, 1, 1, 1, 0]));
    const scale = useTransform(x, stryMutAct_9fa48("6427") ? [] : (stryCov_9fa48("6427"), [stryMutAct_9fa48("6428") ? +150 : (stryCov_9fa48("6428"), -150), 0, 150]), stryMutAct_9fa48("6429") ? [] : (stryCov_9fa48("6429"), [0.9, 1, 0.9]));

    // Color overlays for swipe feedback
    const likeOpacity = useTransform(x, stryMutAct_9fa48("6430") ? [] : (stryCov_9fa48("6430"), [0, 100]), stryMutAct_9fa48("6431") ? [] : (stryCov_9fa48("6431"), [0, 1]));
    const passOpacity = useTransform(x, stryMutAct_9fa48("6432") ? [] : (stryCov_9fa48("6432"), [stryMutAct_9fa48("6433") ? +100 : (stryCov_9fa48("6433"), -100), 0]), stryMutAct_9fa48("6434") ? [] : (stryCov_9fa48("6434"), [1, 0]));
    const superLikeOpacity = useTransform(y, stryMutAct_9fa48("6435") ? [] : (stryCov_9fa48("6435"), [stryMutAct_9fa48("6436") ? +100 : (stryCov_9fa48("6436"), -100), 0]), stryMutAct_9fa48("6437") ? [] : (stryCov_9fa48("6437"), [1, 0]));
    const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
      if (stryMutAct_9fa48("6438")) {
        {}
      } else {
        stryCov_9fa48("6438");
        const threshold = 100;
        const velocity = info.velocity.x;
        if (stryMutAct_9fa48("6441") ? Math.abs(info.offset.x) > threshold && Math.abs(velocity) > 500 : stryMutAct_9fa48("6440") ? false : stryMutAct_9fa48("6439") ? true : (stryCov_9fa48("6439", "6440", "6441"), (stryMutAct_9fa48("6444") ? Math.abs(info.offset.x) <= threshold : stryMutAct_9fa48("6443") ? Math.abs(info.offset.x) >= threshold : stryMutAct_9fa48("6442") ? false : (stryCov_9fa48("6442", "6443", "6444"), Math.abs(info.offset.x) > threshold)) || (stryMutAct_9fa48("6447") ? Math.abs(velocity) <= 500 : stryMutAct_9fa48("6446") ? Math.abs(velocity) >= 500 : stryMutAct_9fa48("6445") ? false : (stryCov_9fa48("6445", "6446", "6447"), Math.abs(velocity) > 500)))) {
          if (stryMutAct_9fa48("6448")) {
            {}
          } else {
            stryCov_9fa48("6448");
            setIsExiting(stryMutAct_9fa48("6449") ? false : (stryCov_9fa48("6449"), true));
            if (stryMutAct_9fa48("6453") ? info.offset.x <= 0 : stryMutAct_9fa48("6452") ? info.offset.x >= 0 : stryMutAct_9fa48("6451") ? false : stryMutAct_9fa48("6450") ? true : (stryCov_9fa48("6450", "6451", "6452", "6453"), info.offset.x > 0)) {
              if (stryMutAct_9fa48("6454")) {
                {}
              } else {
                stryCov_9fa48("6454");
                onSwipe(stryMutAct_9fa48("6455") ? "" : (stryCov_9fa48("6455"), 'right')); // Like
              }
            } else {
              if (stryMutAct_9fa48("6456")) {
                {}
              } else {
                stryCov_9fa48("6456");
                onSwipe(stryMutAct_9fa48("6457") ? "" : (stryCov_9fa48("6457"), 'left')); // Pass
              }
            }
          }
        } else if (stryMutAct_9fa48("6460") ? info.offset.y < -threshold && info.velocity.y < -500 : stryMutAct_9fa48("6459") ? false : stryMutAct_9fa48("6458") ? true : (stryCov_9fa48("6458", "6459", "6460"), (stryMutAct_9fa48("6463") ? info.offset.y >= -threshold : stryMutAct_9fa48("6462") ? info.offset.y <= -threshold : stryMutAct_9fa48("6461") ? false : (stryCov_9fa48("6461", "6462", "6463"), info.offset.y < (stryMutAct_9fa48("6464") ? +threshold : (stryCov_9fa48("6464"), -threshold)))) || (stryMutAct_9fa48("6467") ? info.velocity.y >= -500 : stryMutAct_9fa48("6466") ? info.velocity.y <= -500 : stryMutAct_9fa48("6465") ? false : (stryCov_9fa48("6465", "6466", "6467"), info.velocity.y < (stryMutAct_9fa48("6468") ? +500 : (stryCov_9fa48("6468"), -500)))))) {
          if (stryMutAct_9fa48("6469")) {
            {}
          } else {
            stryCov_9fa48("6469");
            setIsExiting(stryMutAct_9fa48("6470") ? false : (stryCov_9fa48("6470"), true));
            onSwipe(stryMutAct_9fa48("6471") ? "" : (stryCov_9fa48("6471"), 'up')); // Super like
          }
        }
      }
    };
    const handleButtonAction = (action: 'left' | 'right' | 'up') => {
      if (stryMutAct_9fa48("6472")) {
        {}
      } else {
        stryCov_9fa48("6472");
        setIsExiting(stryMutAct_9fa48("6473") ? false : (stryCov_9fa48("6473"), true));
        onSwipe(action);
      }
    };
    const handleProductClick = async () => {
      if (stryMutAct_9fa48("6474")) {
        {}
      } else {
        stryCov_9fa48("6474");
        // Generate affiliate link and track click if it's an Amazon product
        if (stryMutAct_9fa48("6477") ? product.url || isValidAmazonUrl(product.url) : stryMutAct_9fa48("6476") ? false : stryMutAct_9fa48("6475") ? true : (stryCov_9fa48("6475", "6476", "6477"), product.url && isValidAmazonUrl(product.url))) {
          if (stryMutAct_9fa48("6478")) {
            {}
          } else {
            stryCov_9fa48("6478");
            const affiliateUrl = generateAffiliateLink(product.url, stryMutAct_9fa48("6479") ? {} : (stryCov_9fa48("6479"), {
              campaign: stryMutAct_9fa48("6480") ? "" : (stryCov_9fa48("6480"), 'gift_recommendation'),
              medium: stryMutAct_9fa48("6481") ? "" : (stryCov_9fa48("6481"), 'enhanced_swipe_interface'),
              source: stryMutAct_9fa48("6482") ? "" : (stryCov_9fa48("6482"), 'product_click'),
              content: stryMutAct_9fa48("6483") ? "" : (stryCov_9fa48("6483"), 'enhanced_swipe_card')
            }));

            // Track the affiliate click
            await trackAffiliateClick(stryMutAct_9fa48("6484") ? {} : (stryCov_9fa48("6484"), {
              productId: product.id,
              asin: stryMutAct_9fa48("6487") ? extractASIN(product.url) && '' : stryMutAct_9fa48("6486") ? false : stryMutAct_9fa48("6485") ? true : (stryCov_9fa48("6485", "6486", "6487"), extractASIN(product.url) || (stryMutAct_9fa48("6488") ? "Stryker was here!" : (stryCov_9fa48("6488"), ''))),
              category: product.category,
              price: product.price,
              currency: stryMutAct_9fa48("6491") ? product.currency && 'GBP' : stryMutAct_9fa48("6490") ? false : stryMutAct_9fa48("6489") ? true : (stryCov_9fa48("6489", "6490", "6491"), product.currency || (stryMutAct_9fa48("6492") ? "" : (stryCov_9fa48("6492"), 'GBP'))),
              affiliateUrl,
              originalUrl: product.url,
              source: stryMutAct_9fa48("6493") ? "" : (stryCov_9fa48("6493"), 'recommendation')
            }));

            // Open affiliate link in new tab
            window.open(affiliateUrl, stryMutAct_9fa48("6494") ? "" : (stryCov_9fa48("6494"), '_blank'), stryMutAct_9fa48("6495") ? "" : (stryCov_9fa48("6495"), 'noopener,noreferrer'));
          }
        } else if (stryMutAct_9fa48("6497") ? false : stryMutAct_9fa48("6496") ? true : (stryCov_9fa48("6496", "6497"), product.url)) {
          if (stryMutAct_9fa48("6498")) {
            {}
          } else {
            stryCov_9fa48("6498");
            // Open regular product link
            window.open(product.url, stryMutAct_9fa48("6499") ? "" : (stryCov_9fa48("6499"), '_blank'), stryMutAct_9fa48("6500") ? "" : (stryCov_9fa48("6500"), 'noopener,noreferrer'));
          }
        }
      }
    };
    return <div className="relative w-full max-w-sm mx-auto perspective-1000">
      <motion.div className={stryMutAct_9fa48("6501") ? `` : (stryCov_9fa48("6501"), `swipe-card w-full h-[600px] relative bg-white rounded-3xl shadow-glow overflow-hidden cursor-grab active:cursor-grabbing select-none ${className}`)} style={stryMutAct_9fa48("6502") ? {} : (stryCov_9fa48("6502"), {
        x,
        y,
        rotate,
        opacity,
        scale
      })} drag dragConstraints={stryMutAct_9fa48("6503") ? {} : (stryCov_9fa48("6503"), {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
      })} dragElastic={0.7} onDragEnd={handleDragEnd} initial={stryMutAct_9fa48("6504") ? {} : (stryCov_9fa48("6504"), {
        scale: 0.9,
        opacity: 0
      })} animate={stryMutAct_9fa48("6505") ? {} : (stryCov_9fa48("6505"), {
        scale: 1,
        opacity: 1
      })} exit={stryMutAct_9fa48("6506") ? {} : (stryCov_9fa48("6506"), {
        x: isExiting ? (stryMutAct_9fa48("6510") ? x.get() <= 0 : stryMutAct_9fa48("6509") ? x.get() >= 0 : stryMutAct_9fa48("6508") ? false : stryMutAct_9fa48("6507") ? true : (stryCov_9fa48("6507", "6508", "6509", "6510"), x.get() > 0)) ? 300 : stryMutAct_9fa48("6511") ? +300 : (stryCov_9fa48("6511"), -300) : 0,
        y: (stryMutAct_9fa48("6514") ? isExiting || y.get() < -50 : stryMutAct_9fa48("6513") ? false : stryMutAct_9fa48("6512") ? true : (stryCov_9fa48("6512", "6513", "6514"), isExiting && (stryMutAct_9fa48("6517") ? y.get() >= -50 : stryMutAct_9fa48("6516") ? y.get() <= -50 : stryMutAct_9fa48("6515") ? true : (stryCov_9fa48("6515", "6516", "6517"), y.get() < (stryMutAct_9fa48("6518") ? +50 : (stryCov_9fa48("6518"), -50)))))) ? stryMutAct_9fa48("6519") ? +300 : (stryCov_9fa48("6519"), -300) : 0,
        opacity: 0,
        transition: stryMutAct_9fa48("6520") ? {} : (stryCov_9fa48("6520"), {
          duration: 0.3
        })
      })} whileTap={stryMutAct_9fa48("6521") ? {} : (stryCov_9fa48("6521"), {
        scale: 0.95
      })}>
        {/* Swipe Feedback Overlays */}
        <motion.div className="absolute inset-0 bg-green-500 rounded-3xl flex items-center justify-center z-10" style={stryMutAct_9fa48("6522") ? {} : (stryCov_9fa48("6522"), {
          opacity: likeOpacity
        })}>
          <div className="text-white text-4xl font-bold flex items-center gap-3">
            <Heart className="w-12 h-12 fill-current" />
            LOVE IT!
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 bg-red-500 rounded-3xl flex items-center justify-center z-10" style={stryMutAct_9fa48("6523") ? {} : (stryCov_9fa48("6523"), {
          opacity: passOpacity
        })}>
          <div className="text-white text-4xl font-bold flex items-center gap-3">
            <X className="w-12 h-12" />
            NOT FOR ME
          </div>
        </motion.div>

        <motion.div className="absolute inset-0 bg-blue-500 rounded-3xl flex items-center justify-center z-10" style={stryMutAct_9fa48("6524") ? {} : (stryCov_9fa48("6524"), {
          opacity: superLikeOpacity
        })}>
          <div className="text-white text-4xl font-bold flex items-center gap-3">
            <Zap className="w-12 h-12 fill-current" />
            SUPER LIKE!
          </div>
        </motion.div>

        {/* Product Image */}
        <div className="relative h-80 bg-gradient-to-br from-gray-100 to-gray-200">
          {product.imageUrl ? <Image src={product.imageUrl} alt={product.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 400px" /> : <div className="w-full h-full flex items-center justify-center">
              <ShoppingBag className="w-16 h-16 text-gray-400" />
            </div>}
          
          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="glass-light px-3 py-1 rounded-full text-sm font-medium text-gray-800 backdrop-blur-md">
              {product.category}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <span className="bg-primary-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              {new Intl.NumberFormat(stryMutAct_9fa48("6525") ? "" : (stryCov_9fa48("6525"), 'en-GB'), stryMutAct_9fa48("6526") ? {} : (stryCov_9fa48("6526"), {
                style: stryMutAct_9fa48("6527") ? "" : (stryCov_9fa48("6527"), 'currency'),
                currency: stryMutAct_9fa48("6530") ? product.currency && 'GBP' : stryMutAct_9fa48("6529") ? false : stryMutAct_9fa48("6528") ? true : (stryCov_9fa48("6528", "6529", "6530"), product.currency || (stryMutAct_9fa48("6531") ? "" : (stryCov_9fa48("6531"), 'GBP')))
              })).format(product.price)}
            </span>
          </div>

          {/* Product Link Button */}
          {stryMutAct_9fa48("6534") ? product.url || <button onClick={handleProductClick} className="absolute bottom-4 right-4 glass-light p-2 rounded-full hover:bg-white hover:shadow-lg transition-all" title={isValidAmazonUrl(product.url) ? 'View on Amazon (affiliate link)' : 'View product'}>
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </button> : stryMutAct_9fa48("6533") ? false : stryMutAct_9fa48("6532") ? true : (stryCov_9fa48("6532", "6533", "6534"), product.url && <button onClick={handleProductClick} className="absolute bottom-4 right-4 glass-light p-2 rounded-full hover:bg-white hover:shadow-lg transition-all" title={isValidAmazonUrl(product.url) ? stryMutAct_9fa48("6535") ? "" : (stryCov_9fa48("6535"), 'View on Amazon (affiliate link)') : stryMutAct_9fa48("6536") ? "" : (stryCov_9fa48("6536"), 'View product')}>
              <ExternalLink className="w-4 h-4 text-gray-700" />
            </button>)}

          {/* Rating */}
          {stryMutAct_9fa48("6539") ? product.rating || <div className="absolute bottom-4 left-4">
              <div className="glass-light px-3 py-1 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-800">{product.rating}</span>
              </div>
            </div> : stryMutAct_9fa48("6538") ? false : stryMutAct_9fa48("6537") ? true : (stryCov_9fa48("6537", "6538", "6539"), product.rating && <div className="absolute bottom-4 left-4">
              <div className="glass-light px-3 py-1 rounded-full flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <span className="text-sm font-medium text-gray-800">{product.rating}</span>
              </div>
            </div>)}
        </div>

        {/* Product Info */}
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
              {product.title}
            </h3>
            {stryMutAct_9fa48("6542") ? product.brand || <p className="text-sm text-gray-600 font-medium mb-2">{product.brand}</p> : stryMutAct_9fa48("6541") ? false : stryMutAct_9fa48("6540") ? true : (stryCov_9fa48("6540", "6541", "6542"), product.brand && <p className="text-sm text-gray-600 font-medium mb-2">{product.brand}</p>)}
            <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Features */}
          {stryMutAct_9fa48("6545") ? product.features && product.features.length > 0 || <div className="flex flex-wrap gap-2">
              {product.features.slice(0, 3).map((feature, index) => <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                  {feature}
                </span>)}
            </div> : stryMutAct_9fa48("6544") ? false : stryMutAct_9fa48("6543") ? true : (stryCov_9fa48("6543", "6544", "6545"), (stryMutAct_9fa48("6547") ? product.features || product.features.length > 0 : stryMutAct_9fa48("6546") ? true : (stryCov_9fa48("6546", "6547"), product.features && (stryMutAct_9fa48("6550") ? product.features.length <= 0 : stryMutAct_9fa48("6549") ? product.features.length >= 0 : stryMutAct_9fa48("6548") ? true : (stryCov_9fa48("6548", "6549", "6550"), product.features.length > 0)))) && <div className="flex flex-wrap gap-2">
              {stryMutAct_9fa48("6551") ? product.features.map((feature, index) => <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                  {feature}
                </span>) : (stryCov_9fa48("6551"), product.features.slice(0, 3).map(stryMutAct_9fa48("6552") ? () => undefined : (stryCov_9fa48("6552"), (feature, index) => <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded-lg text-xs font-medium">
                  {feature}
                </span>)))}
            </div>)}

          {/* Affiliate Disclosure for Amazon Products */}
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
          <div className="flex items-center gap-4">
            {/* Pass Button */}
            <motion.button whileHover={stryMutAct_9fa48("6553") ? {} : (stryCov_9fa48("6553"), {
              scale: 1.1
            })} whileTap={stryMutAct_9fa48("6554") ? {} : (stryCov_9fa48("6554"), {
              scale: 0.9
            })} onClick={stryMutAct_9fa48("6555") ? () => undefined : (stryCov_9fa48("6555"), () => handleButtonAction(stryMutAct_9fa48("6556") ? "" : (stryCov_9fa48("6556"), 'left')))} className="w-14 h-14 bg-white border-2 border-red-200 rounded-full flex items-center justify-center shadow-medium hover:border-red-300 hover:bg-red-50 transition-colors group">
              <X className="w-6 h-6 text-red-500 group-hover:text-red-600" />
            </motion.button>

            {/* Super Like Button */}
            <motion.button whileHover={stryMutAct_9fa48("6557") ? {} : (stryCov_9fa48("6557"), {
              scale: 1.1
            })} whileTap={stryMutAct_9fa48("6558") ? {} : (stryCov_9fa48("6558"), {
              scale: 0.9
            })} onClick={stryMutAct_9fa48("6559") ? () => undefined : (stryCov_9fa48("6559"), () => handleButtonAction(stryMutAct_9fa48("6560") ? "" : (stryCov_9fa48("6560"), 'up')))} className="w-12 h-12 bg-white border-2 border-blue-200 rounded-full flex items-center justify-center shadow-medium hover:border-blue-300 hover:bg-blue-50 transition-colors group">
              <Zap className="w-5 h-5 text-blue-500 group-hover:text-blue-600" />
            </motion.button>

            {/* Like Button */}
            <motion.button whileHover={stryMutAct_9fa48("6561") ? {} : (stryCov_9fa48("6561"), {
              scale: 1.1
            })} whileTap={stryMutAct_9fa48("6562") ? {} : (stryCov_9fa48("6562"), {
              scale: 0.9
            })} onClick={stryMutAct_9fa48("6563") ? () => undefined : (stryCov_9fa48("6563"), () => handleButtonAction(stryMutAct_9fa48("6564") ? "" : (stryCov_9fa48("6564"), 'right')))} className="w-14 h-14 bg-white border-2 border-green-200 rounded-full flex items-center justify-center shadow-medium hover:border-green-300 hover:bg-green-50 transition-colors group">
              <Heart className="w-6 h-6 text-green-500 group-hover:text-green-600" />
            </motion.button>
          </div>
        </div>

        {/* Share Button */}
        <motion.button whileHover={stryMutAct_9fa48("6565") ? {} : (stryCov_9fa48("6565"), {
          scale: 1.1
        })} whileTap={stryMutAct_9fa48("6566") ? {} : (stryCov_9fa48("6566"), {
          scale: 0.9
        })} className="absolute top-6 right-6 w-10 h-10 glass-light rounded-full flex items-center justify-center hover:bg-white hover:shadow-lg transition-all">
          <Share2 className="w-5 h-5 text-gray-700" />
        </motion.button>
      </motion.div>
    </div>;
  }
};