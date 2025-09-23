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
import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, PanInfo } from 'framer-motion';
import { Heart, X, Star, ExternalLink, Sparkles } from 'lucide-react';
import Image from 'next/image';
import { Product, SwipeGesture } from '@/types';
import { appConfig } from '@/config';
import { generateAffiliateLink, trackAffiliateClick, isValidAmazonUrl, extractASIN } from '@/lib/affiliate';
interface SwipeCardProps {
  product: Product;
  index: number;
  isActive: boolean;
  onSwipe: (direction: 'left' | 'right' | 'up' | 'down', gesture: SwipeGesture) => void;
  onProductClick?: (product: Product) => void;
  className?: string;
}
export const SwipeCard: React.FC<SwipeCardProps> = ({
  product,
  index,
  isActive,
  onSwipe,
  onProductClick,
  className = stryMutAct_9fa48("6570") ? "Stryker was here!" : (stryCov_9fa48("6570"), '')
}) => {
  if (stryMutAct_9fa48("6571")) {
    {}
  } else {
    stryCov_9fa48("6571");
    const [isDragging, setIsDragging] = useState(stryMutAct_9fa48("6572") ? true : (stryCov_9fa48("6572"), false));
    const [gestureStartTime, setGestureStartTime] = useState(0);
    const cardRef = useRef<HTMLDivElement>(null);

    // Motion values for drag tracking - enhanced for mobile
    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const rotate = useTransform(x, stryMutAct_9fa48("6573") ? [] : (stryCov_9fa48("6573"), [stryMutAct_9fa48("6574") ? +300 : (stryCov_9fa48("6574"), -300), 300]), stryMutAct_9fa48("6575") ? [] : (stryCov_9fa48("6575"), [stryMutAct_9fa48("6576") ? +30 : (stryCov_9fa48("6576"), -30), 30]));
    const opacity = useTransform(x, stryMutAct_9fa48("6577") ? [] : (stryCov_9fa48("6577"), [stryMutAct_9fa48("6578") ? +300 : (stryCov_9fa48("6578"), -300), stryMutAct_9fa48("6579") ? +150 : (stryCov_9fa48("6579"), -150), 0, 150, 300]), stryMutAct_9fa48("6580") ? [] : (stryCov_9fa48("6580"), [0, 1, 1, 1, 0]));
    const scale = useTransform(x, stryMutAct_9fa48("6581") ? [] : (stryCov_9fa48("6581"), [stryMutAct_9fa48("6582") ? +150 : (stryCov_9fa48("6582"), -150), 0, 150]), stryMutAct_9fa48("6583") ? [] : (stryCov_9fa48("6583"), [0.95, 1, 0.95]));

    // Transform values for overlay indicators
    const likeOpacity = useTransform(x, stryMutAct_9fa48("6584") ? [] : (stryCov_9fa48("6584"), [0, 150]), stryMutAct_9fa48("6585") ? [] : (stryCov_9fa48("6585"), [0, 1]));
    const dislikeOpacity = useTransform(x, stryMutAct_9fa48("6586") ? [] : (stryCov_9fa48("6586"), [0, stryMutAct_9fa48("6587") ? +150 : (stryCov_9fa48("6587"), -150)]), stryMutAct_9fa48("6588") ? [] : (stryCov_9fa48("6588"), [0, 1]));
    const superlikeOpacity = useTransform(y, stryMutAct_9fa48("6589") ? [] : (stryCov_9fa48("6589"), [0, stryMutAct_9fa48("6590") ? +150 : (stryCov_9fa48("6590"), -150)]), stryMutAct_9fa48("6591") ? [] : (stryCov_9fa48("6591"), [0, 1]));

    // Format price with currency
    const formatPrice = (price: number, currency: string = stryMutAct_9fa48("6592") ? "" : (stryCov_9fa48("6592"), 'USD')) => {
      if (stryMutAct_9fa48("6593")) {
        {}
      } else {
        stryCov_9fa48("6593");
        return new Intl.NumberFormat(stryMutAct_9fa48("6594") ? "" : (stryCov_9fa48("6594"), 'en-US'), stryMutAct_9fa48("6595") ? {} : (stryCov_9fa48("6595"), {
          style: stryMutAct_9fa48("6596") ? "" : (stryCov_9fa48("6596"), 'currency'),
          currency: currency
        })).format(price);
      }
    };

    // Calculate discount percentage
    const discountPercentage = product.original_price ? Math.round(stryMutAct_9fa48("6597") ? (product.original_price - product.price) / product.original_price / 100 : (stryCov_9fa48("6597"), (stryMutAct_9fa48("6598") ? (product.original_price - product.price) * product.original_price : (stryCov_9fa48("6598"), (stryMutAct_9fa48("6599") ? product.original_price + product.price : (stryCov_9fa48("6599"), product.original_price - product.price)) / product.original_price)) * 100)) : 0;

    // Handle pan start - enhanced for mobile
    const handlePanStart = () => {
      if (stryMutAct_9fa48("6600")) {
        {}
      } else {
        stryCov_9fa48("6600");
        setIsDragging(stryMutAct_9fa48("6601") ? false : (stryCov_9fa48("6601"), true));
        setGestureStartTime(Date.now());

        // Haptic feedback on touch start (mobile)
        if (stryMutAct_9fa48("6604") ? typeof window !== 'undefined' || 'vibrate' in navigator : stryMutAct_9fa48("6603") ? false : stryMutAct_9fa48("6602") ? true : (stryCov_9fa48("6602", "6603", "6604"), (stryMutAct_9fa48("6606") ? typeof window === 'undefined' : stryMutAct_9fa48("6605") ? true : (stryCov_9fa48("6605", "6606"), typeof window !== (stryMutAct_9fa48("6607") ? "" : (stryCov_9fa48("6607"), 'undefined')))) && (stryMutAct_9fa48("6608") ? "" : (stryCov_9fa48("6608"), 'vibrate')) in navigator)) {
          if (stryMutAct_9fa48("6609")) {
            {}
          } else {
            stryCov_9fa48("6609");
            navigator.vibrate(10);
          }
        }

        // Prevent scroll on mobile during drag
        if (stryMutAct_9fa48("6612") ? typeof document === 'undefined' : stryMutAct_9fa48("6611") ? false : stryMutAct_9fa48("6610") ? true : (stryCov_9fa48("6610", "6611", "6612"), typeof document !== (stryMutAct_9fa48("6613") ? "" : (stryCov_9fa48("6613"), 'undefined')))) {
          if (stryMutAct_9fa48("6614")) {
            {}
          } else {
            stryCov_9fa48("6614");
            document.body.style.overflow = stryMutAct_9fa48("6615") ? "" : (stryCov_9fa48("6615"), 'hidden');
          }
        }
      }
    };

    // Handle pan end - enhanced for mobile
    const handlePanEnd = (_event: any, info: PanInfo) => {
      if (stryMutAct_9fa48("6616")) {
        {}
      } else {
        stryCov_9fa48("6616");
        setIsDragging(stryMutAct_9fa48("6617") ? true : (stryCov_9fa48("6617"), false));

        // Re-enable scroll
        if (stryMutAct_9fa48("6620") ? typeof document === 'undefined' : stryMutAct_9fa48("6619") ? false : stryMutAct_9fa48("6618") ? true : (stryCov_9fa48("6618", "6619", "6620"), typeof document !== (stryMutAct_9fa48("6621") ? "" : (stryCov_9fa48("6621"), 'undefined')))) {
          if (stryMutAct_9fa48("6622")) {
            {}
          } else {
            stryCov_9fa48("6622");
            document.body.style.overflow = stryMutAct_9fa48("6623") ? "" : (stryCov_9fa48("6623"), 'auto');
          }
        }
        const {
          offset,
          velocity
        } = info;
        const swipeThreshold = appConfig.swipe.distanceThreshold;
        const velocityThreshold = appConfig.swipe.velocityThreshold;
        const gestureEndTime = Date.now();
        const duration = stryMutAct_9fa48("6624") ? gestureEndTime + gestureStartTime : (stryCov_9fa48("6624"), gestureEndTime - gestureStartTime);
        const gesture: SwipeGesture = stryMutAct_9fa48("6625") ? {} : (stryCov_9fa48("6625"), {
          direction: stryMutAct_9fa48("6626") ? "" : (stryCov_9fa48("6626"), 'right'),
          // Will be updated below
          velocity: Math.sqrt(stryMutAct_9fa48("6627") ? velocity.x ** 2 - velocity.y ** 2 : (stryCov_9fa48("6627"), velocity.x ** 2 + velocity.y ** 2)),
          distance: Math.sqrt(stryMutAct_9fa48("6628") ? offset.x ** 2 - offset.y ** 2 : (stryCov_9fa48("6628"), offset.x ** 2 + offset.y ** 2)),
          duration,
          startPosition: stryMutAct_9fa48("6629") ? {} : (stryCov_9fa48("6629"), {
            x: 0,
            y: 0
          }),
          // Relative to card center
          endPosition: stryMutAct_9fa48("6630") ? {} : (stryCov_9fa48("6630"), {
            x: offset.x,
            y: offset.y
          })
        });

        // Determine swipe direction
        const isHorizontalSwipe = stryMutAct_9fa48("6634") ? Math.abs(offset.x) <= Math.abs(offset.y) : stryMutAct_9fa48("6633") ? Math.abs(offset.x) >= Math.abs(offset.y) : stryMutAct_9fa48("6632") ? false : stryMutAct_9fa48("6631") ? true : (stryCov_9fa48("6631", "6632", "6633", "6634"), Math.abs(offset.x) > Math.abs(offset.y));
        const isVerticalSwipe = stryMutAct_9fa48("6638") ? Math.abs(offset.y) <= Math.abs(offset.x) : stryMutAct_9fa48("6637") ? Math.abs(offset.y) >= Math.abs(offset.x) : stryMutAct_9fa48("6636") ? false : stryMutAct_9fa48("6635") ? true : (stryCov_9fa48("6635", "6636", "6637", "6638"), Math.abs(offset.y) > Math.abs(offset.x));
        let shouldSwipe = stryMutAct_9fa48("6639") ? true : (stryCov_9fa48("6639"), false);
        let direction: 'left' | 'right' | 'up' | 'down' = stryMutAct_9fa48("6640") ? "" : (stryCov_9fa48("6640"), 'right');
        if (stryMutAct_9fa48("6642") ? false : stryMutAct_9fa48("6641") ? true : (stryCov_9fa48("6641", "6642"), isHorizontalSwipe)) {
          if (stryMutAct_9fa48("6643")) {
            {}
          } else {
            stryCov_9fa48("6643");
            if (stryMutAct_9fa48("6646") ? Math.abs(offset.x) > swipeThreshold && Math.abs(velocity.x) > velocityThreshold : stryMutAct_9fa48("6645") ? false : stryMutAct_9fa48("6644") ? true : (stryCov_9fa48("6644", "6645", "6646"), (stryMutAct_9fa48("6649") ? Math.abs(offset.x) <= swipeThreshold : stryMutAct_9fa48("6648") ? Math.abs(offset.x) >= swipeThreshold : stryMutAct_9fa48("6647") ? false : (stryCov_9fa48("6647", "6648", "6649"), Math.abs(offset.x) > swipeThreshold)) || (stryMutAct_9fa48("6652") ? Math.abs(velocity.x) <= velocityThreshold : stryMutAct_9fa48("6651") ? Math.abs(velocity.x) >= velocityThreshold : stryMutAct_9fa48("6650") ? false : (stryCov_9fa48("6650", "6651", "6652"), Math.abs(velocity.x) > velocityThreshold)))) {
              if (stryMutAct_9fa48("6653")) {
                {}
              } else {
                stryCov_9fa48("6653");
                shouldSwipe = stryMutAct_9fa48("6654") ? false : (stryCov_9fa48("6654"), true);
                direction = (stryMutAct_9fa48("6658") ? offset.x <= 0 : stryMutAct_9fa48("6657") ? offset.x >= 0 : stryMutAct_9fa48("6656") ? false : stryMutAct_9fa48("6655") ? true : (stryCov_9fa48("6655", "6656", "6657", "6658"), offset.x > 0)) ? stryMutAct_9fa48("6659") ? "" : (stryCov_9fa48("6659"), 'right') : stryMutAct_9fa48("6660") ? "" : (stryCov_9fa48("6660"), 'left');
              }
            }
          }
        } else if (stryMutAct_9fa48("6662") ? false : stryMutAct_9fa48("6661") ? true : (stryCov_9fa48("6661", "6662"), isVerticalSwipe)) {
          if (stryMutAct_9fa48("6663")) {
            {}
          } else {
            stryCov_9fa48("6663");
            if (stryMutAct_9fa48("6666") ? Math.abs(offset.y) > swipeThreshold && Math.abs(velocity.y) > velocityThreshold : stryMutAct_9fa48("6665") ? false : stryMutAct_9fa48("6664") ? true : (stryCov_9fa48("6664", "6665", "6666"), (stryMutAct_9fa48("6669") ? Math.abs(offset.y) <= swipeThreshold : stryMutAct_9fa48("6668") ? Math.abs(offset.y) >= swipeThreshold : stryMutAct_9fa48("6667") ? false : (stryCov_9fa48("6667", "6668", "6669"), Math.abs(offset.y) > swipeThreshold)) || (stryMutAct_9fa48("6672") ? Math.abs(velocity.y) <= velocityThreshold : stryMutAct_9fa48("6671") ? Math.abs(velocity.y) >= velocityThreshold : stryMutAct_9fa48("6670") ? false : (stryCov_9fa48("6670", "6671", "6672"), Math.abs(velocity.y) > velocityThreshold)))) {
              if (stryMutAct_9fa48("6673")) {
                {}
              } else {
                stryCov_9fa48("6673");
                shouldSwipe = stryMutAct_9fa48("6674") ? false : (stryCov_9fa48("6674"), true);
                direction = (stryMutAct_9fa48("6678") ? offset.y <= 0 : stryMutAct_9fa48("6677") ? offset.y >= 0 : stryMutAct_9fa48("6676") ? false : stryMutAct_9fa48("6675") ? true : (stryCov_9fa48("6675", "6676", "6677", "6678"), offset.y > 0)) ? stryMutAct_9fa48("6679") ? "" : (stryCov_9fa48("6679"), 'down') : stryMutAct_9fa48("6680") ? "" : (stryCov_9fa48("6680"), 'up');
              }
            }
          }
        }
        if (stryMutAct_9fa48("6682") ? false : stryMutAct_9fa48("6681") ? true : (stryCov_9fa48("6681", "6682"), shouldSwipe)) {
          if (stryMutAct_9fa48("6683")) {
            {}
          } else {
            stryCov_9fa48("6683");
            gesture.direction = direction;

            // Enhanced haptic feedback for mobile
            if (stryMutAct_9fa48("6686") ? typeof window !== 'undefined' || 'vibrate' in navigator : stryMutAct_9fa48("6685") ? false : stryMutAct_9fa48("6684") ? true : (stryCov_9fa48("6684", "6685", "6686"), (stryMutAct_9fa48("6688") ? typeof window === 'undefined' : stryMutAct_9fa48("6687") ? true : (stryCov_9fa48("6687", "6688"), typeof window !== (stryMutAct_9fa48("6689") ? "" : (stryCov_9fa48("6689"), 'undefined')))) && (stryMutAct_9fa48("6690") ? "" : (stryCov_9fa48("6690"), 'vibrate')) in navigator)) {
              if (stryMutAct_9fa48("6691")) {
                {}
              } else {
                stryCov_9fa48("6691");
                const vibrationPattern = stryMutAct_9fa48("6694") ? {
                  'right': 50,
                  // Like - short pleasant buzz
                  'up': [30, 20, 30],
                  // Super like - double buzz
                  'left': 100,
                  // Dislike - longer buzz
                  'down': 75 // Down swipe
                }[direction] && 50 : stryMutAct_9fa48("6693") ? false : stryMutAct_9fa48("6692") ? true : (stryCov_9fa48("6692", "6693", "6694"), (stryMutAct_9fa48("6695") ? {} : (stryCov_9fa48("6695"), {
                  'right': 50,
                  // Like - short pleasant buzz
                  'up': stryMutAct_9fa48("6696") ? [] : (stryCov_9fa48("6696"), [30, 20, 30]),
                  // Super like - double buzz
                  'left': 100,
                  // Dislike - longer buzz
                  'down': 75 // Down swipe
                }))[direction] || 50);
                navigator.vibrate(vibrationPattern);
              }
            }
            onSwipe(direction, gesture);
          }
        } else {
          if (stryMutAct_9fa48("6697")) {
            {}
          } else {
            stryCov_9fa48("6697");
            // Snap back to center
            x.set(0);
            y.set(0);
          }
        }
      }
    };

    // Handle button clicks
    const handleDislike = () => {
      if (stryMutAct_9fa48("6698")) {
        {}
      } else {
        stryCov_9fa48("6698");
        const gesture: SwipeGesture = stryMutAct_9fa48("6699") ? {} : (stryCov_9fa48("6699"), {
          direction: stryMutAct_9fa48("6700") ? "" : (stryCov_9fa48("6700"), 'left'),
          velocity: 1,
          distance: 200,
          duration: 300,
          startPosition: stryMutAct_9fa48("6701") ? {} : (stryCov_9fa48("6701"), {
            x: 0,
            y: 0
          }),
          endPosition: stryMutAct_9fa48("6702") ? {} : (stryCov_9fa48("6702"), {
            x: stryMutAct_9fa48("6703") ? +200 : (stryCov_9fa48("6703"), -200),
            y: 0
          })
        });
        onSwipe(stryMutAct_9fa48("6704") ? "" : (stryCov_9fa48("6704"), 'left'), gesture);
      }
    };
    const handleLike = () => {
      if (stryMutAct_9fa48("6705")) {
        {}
      } else {
        stryCov_9fa48("6705");
        const gesture: SwipeGesture = stryMutAct_9fa48("6706") ? {} : (stryCov_9fa48("6706"), {
          direction: stryMutAct_9fa48("6707") ? "" : (stryCov_9fa48("6707"), 'right'),
          velocity: 1,
          distance: 200,
          duration: 300,
          startPosition: stryMutAct_9fa48("6708") ? {} : (stryCov_9fa48("6708"), {
            x: 0,
            y: 0
          }),
          endPosition: stryMutAct_9fa48("6709") ? {} : (stryCov_9fa48("6709"), {
            x: 200,
            y: 0
          })
        });
        onSwipe(stryMutAct_9fa48("6710") ? "" : (stryCov_9fa48("6710"), 'right'), gesture);
      }
    };
    const handleSuperlike = () => {
      if (stryMutAct_9fa48("6711")) {
        {}
      } else {
        stryCov_9fa48("6711");
        const gesture: SwipeGesture = stryMutAct_9fa48("6712") ? {} : (stryCov_9fa48("6712"), {
          direction: stryMutAct_9fa48("6713") ? "" : (stryCov_9fa48("6713"), 'up'),
          velocity: 1,
          distance: 200,
          duration: 300,
          startPosition: stryMutAct_9fa48("6714") ? {} : (stryCov_9fa48("6714"), {
            x: 0,
            y: 0
          }),
          endPosition: stryMutAct_9fa48("6715") ? {} : (stryCov_9fa48("6715"), {
            x: 0,
            y: stryMutAct_9fa48("6716") ? +200 : (stryCov_9fa48("6716"), -200)
          })
        });
        onSwipe(stryMutAct_9fa48("6717") ? "" : (stryCov_9fa48("6717"), 'up'), gesture);
      }
    };
    const handleProductClick = async () => {
      if (stryMutAct_9fa48("6718")) {
        {}
      } else {
        stryCov_9fa48("6718");
        if (stryMutAct_9fa48("6720") ? false : stryMutAct_9fa48("6719") ? true : (stryCov_9fa48("6719", "6720"), onProductClick)) {
          if (stryMutAct_9fa48("6721")) {
            {}
          } else {
            stryCov_9fa48("6721");
            onProductClick(product);
          }
        }

        // Generate affiliate link and track click if it's an Amazon product
        if (stryMutAct_9fa48("6724") ? (product as any).url || isValidAmazonUrl((product as any).url) : stryMutAct_9fa48("6723") ? false : stryMutAct_9fa48("6722") ? true : (stryCov_9fa48("6722", "6723", "6724"), (product as any).url && isValidAmazonUrl((product as any).url))) {
          if (stryMutAct_9fa48("6725")) {
            {}
          } else {
            stryCov_9fa48("6725");
            const affiliateUrl = generateAffiliateLink((product as any).url, stryMutAct_9fa48("6726") ? {} : (stryCov_9fa48("6726"), {
              campaign: stryMutAct_9fa48("6727") ? "" : (stryCov_9fa48("6727"), 'gift_recommendation'),
              medium: stryMutAct_9fa48("6728") ? "" : (stryCov_9fa48("6728"), 'swipe_interface'),
              source: stryMutAct_9fa48("6729") ? "" : (stryCov_9fa48("6729"), 'product_click'),
              content: stryMutAct_9fa48("6730") ? "" : (stryCov_9fa48("6730"), 'swipe_card')
            }));

            // Track the affiliate click
            await trackAffiliateClick(stryMutAct_9fa48("6731") ? {} : (stryCov_9fa48("6731"), {
              productId: product.id,
              asin: stryMutAct_9fa48("6734") ? extractASIN((product as any).url) && '' : stryMutAct_9fa48("6733") ? false : stryMutAct_9fa48("6732") ? true : (stryCov_9fa48("6732", "6733", "6734"), extractASIN((product as any).url) || (stryMutAct_9fa48("6735") ? "Stryker was here!" : (stryCov_9fa48("6735"), ''))),
              category: product.category.name,
              price: product.price,
              currency: stryMutAct_9fa48("6738") ? product.currency && 'GBP' : stryMutAct_9fa48("6737") ? false : stryMutAct_9fa48("6736") ? true : (stryCov_9fa48("6736", "6737", "6738"), product.currency || (stryMutAct_9fa48("6739") ? "" : (stryCov_9fa48("6739"), 'GBP'))),
              affiliateUrl,
              originalUrl: (product as any).url,
              source: stryMutAct_9fa48("6740") ? "" : (stryCov_9fa48("6740"), 'recommendation')
            }));

            // Open affiliate link in new tab
            window.open(affiliateUrl, stryMutAct_9fa48("6741") ? "" : (stryCov_9fa48("6741"), '_blank'), stryMutAct_9fa48("6742") ? "" : (stryCov_9fa48("6742"), 'noopener,noreferrer'));
          }
        } else if (stryMutAct_9fa48("6744") ? false : stryMutAct_9fa48("6743") ? true : (stryCov_9fa48("6743", "6744"), (product as any).url)) {
          if (stryMutAct_9fa48("6745")) {
            {}
          } else {
            stryCov_9fa48("6745");
            // Open regular product link
            window.open((product as any).url, stryMutAct_9fa48("6746") ? "" : (stryCov_9fa48("6746"), '_blank'), stryMutAct_9fa48("6747") ? "" : (stryCov_9fa48("6747"), 'noopener,noreferrer'));
          }
        }
      }
    };

    // Reset position when card becomes active
    useEffect(() => {
      if (stryMutAct_9fa48("6748")) {
        {}
      } else {
        stryCov_9fa48("6748");
        if (stryMutAct_9fa48("6750") ? false : stryMutAct_9fa48("6749") ? true : (stryCov_9fa48("6749", "6750"), isActive)) {
          if (stryMutAct_9fa48("6751")) {
            {}
          } else {
            stryCov_9fa48("6751");
            x.set(0);
            y.set(0);
          }
        }
      }
    }, stryMutAct_9fa48("6752") ? [] : (stryCov_9fa48("6752"), [isActive, x, y]));
    return <motion.div ref={cardRef} className={stryMutAct_9fa48("6753") ? `` : (stryCov_9fa48("6753"), `absolute inset-0 cursor-grab active:cursor-grabbing ${className}`)} style={stryMutAct_9fa48("6754") ? {} : (stryCov_9fa48("6754"), {
      x,
      y,
      rotate,
      opacity,
      scale,
      zIndex: isActive ? 20 : stryMutAct_9fa48("6755") ? 10 + index : (stryCov_9fa48("6755"), 10 - index)
    })} drag={isActive} dragConstraints={stryMutAct_9fa48("6756") ? {} : (stryCov_9fa48("6756"), {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0
    })} dragElastic={0.2} dragMomentum={stryMutAct_9fa48("6757") ? false : (stryCov_9fa48("6757"), true)} whileDrag={stryMutAct_9fa48("6758") ? {} : (stryCov_9fa48("6758"), {
      scale: 1.05,
      cursor: stryMutAct_9fa48("6759") ? "" : (stryCov_9fa48("6759"), 'grabbing'),
      transition: stryMutAct_9fa48("6760") ? {} : (stryCov_9fa48("6760"), {
        type: stryMutAct_9fa48("6761") ? "" : (stryCov_9fa48("6761"), 'spring'),
        stiffness: 400,
        damping: 30
      })
    })} onPanStart={handlePanStart} onPanEnd={handlePanEnd} initial={stryMutAct_9fa48("6762") ? {} : (stryCov_9fa48("6762"), {
      scale: 0.9,
      opacity: 0
    })} animate={stryMutAct_9fa48("6763") ? {} : (stryCov_9fa48("6763"), {
      scale: isActive ? 1 : stryMutAct_9fa48("6764") ? 0.95 + index * 0.05 : (stryCov_9fa48("6764"), 0.95 - (stryMutAct_9fa48("6765") ? index / 0.05 : (stryCov_9fa48("6765"), index * 0.05))),
      opacity: isActive ? 1 : stryMutAct_9fa48("6766") ? 0.7 + index * 0.2 : (stryCov_9fa48("6766"), 0.7 - (stryMutAct_9fa48("6767") ? index / 0.2 : (stryCov_9fa48("6767"), index * 0.2))),
      y: isActive ? 0 : stryMutAct_9fa48("6768") ? index / 10 : (stryCov_9fa48("6768"), index * 10)
    })} transition={stryMutAct_9fa48("6769") ? {} : (stryCov_9fa48("6769"), {
      type: stryMutAct_9fa48("6770") ? "" : (stryCov_9fa48("6770"), 'spring'),
      stiffness: 300,
      damping: 30
    })}>
      {/* Main Card */}
      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Product Image */}
        <div className="relative w-full h-2/3">
          <Image src={product.image_url} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" priority={stryMutAct_9fa48("6774") ? index >= 2 : stryMutAct_9fa48("6773") ? index <= 2 : stryMutAct_9fa48("6772") ? false : stryMutAct_9fa48("6771") ? true : (stryCov_9fa48("6771", "6772", "6773", "6774"), index < 2)} />
          
          {/* Image Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
          
          {/* Product Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {stryMutAct_9fa48("6777") ? product.is_featured || <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </div> : stryMutAct_9fa48("6776") ? false : stryMutAct_9fa48("6775") ? true : (stryCov_9fa48("6775", "6776", "6777"), product.is_featured && <div className="bg-primary-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Featured
              </div>)}
            {stryMutAct_9fa48("6780") ? product.is_trending || <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                🔥 Trending
              </div> : stryMutAct_9fa48("6779") ? false : stryMutAct_9fa48("6778") ? true : (stryCov_9fa48("6778", "6779", "6780"), product.is_trending && <div className="bg-orange-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                🔥 Trending
              </div>)}
            {stryMutAct_9fa48("6783") ? product.is_new || <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✨ New
              </div> : stryMutAct_9fa48("6782") ? false : stryMutAct_9fa48("6781") ? true : (stryCov_9fa48("6781", "6782", "6783"), product.is_new && <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                ✨ New
              </div>)}
            {stryMutAct_9fa48("6786") ? discountPercentage > 0 || <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{discountPercentage}%
              </div> : stryMutAct_9fa48("6785") ? false : stryMutAct_9fa48("6784") ? true : (stryCov_9fa48("6784", "6785", "6786"), (stryMutAct_9fa48("6789") ? discountPercentage <= 0 : stryMutAct_9fa48("6788") ? discountPercentage >= 0 : stryMutAct_9fa48("6787") ? true : (stryCov_9fa48("6787", "6788", "6789"), discountPercentage > 0)) && <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                -{discountPercentage}%
              </div>)}
          </div>

          {/* Product Rating */}
          {stryMutAct_9fa48("6792") ? product.rating || <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-medium">
                {product.rating.toFixed(1)}
              </span>
              {product.review_count && <span className="text-white/70 text-xs">
                  ({product.review_count})
                </span>}
            </div> : stryMutAct_9fa48("6791") ? false : stryMutAct_9fa48("6790") ? true : (stryCov_9fa48("6790", "6791", "6792"), product.rating && <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-white text-xs font-medium">
                {product.rating.toFixed(1)}
              </span>
              {stryMutAct_9fa48("6795") ? product.review_count || <span className="text-white/70 text-xs">
                  ({product.review_count})
                </span> : stryMutAct_9fa48("6794") ? false : stryMutAct_9fa48("6793") ? true : (stryCov_9fa48("6793", "6794", "6795"), product.review_count && <span className="text-white/70 text-xs">
                  ({product.review_count})
                </span>)}
            </div>)}

          {/* Swipe Indicators */}
          <motion.div className="absolute inset-0 bg-green-500/90 flex items-center justify-center" style={stryMutAct_9fa48("6796") ? {} : (stryCov_9fa48("6796"), {
            opacity: likeOpacity
          })}>
            <div className="bg-white rounded-full p-4">
              <Heart className="w-8 h-8 text-green-500 fill-green-500" />
            </div>
          </motion.div>

          <motion.div className="absolute inset-0 bg-red-500/90 flex items-center justify-center" style={stryMutAct_9fa48("6797") ? {} : (stryCov_9fa48("6797"), {
            opacity: dislikeOpacity
          })}>
            <div className="bg-white rounded-full p-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
          </motion.div>

          <motion.div className="absolute inset-0 bg-blue-500/90 flex items-center justify-center" style={stryMutAct_9fa48("6798") ? {} : (stryCov_9fa48("6798"), {
            opacity: superlikeOpacity
          })}>
            <div className="bg-white rounded-full p-4">
              <Star className="w-8 h-8 text-blue-500 fill-blue-500" />
            </div>
          </motion.div>
        </div>

        {/* Product Information */}
        <div className="p-6 h-1/3 flex flex-col justify-between">
          {/* Product Details */}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 cursor-pointer hover:text-primary-600 transition-colors" onClick={handleProductClick}>
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{product.brand}</p>
              </div>
              <button onClick={handleProductClick} className="ml-2 p-2 text-gray-400 hover:text-primary-600 transition-colors" title={(stryMutAct_9fa48("6801") ? (product as any).url || isValidAmazonUrl((product as any).url) : stryMutAct_9fa48("6800") ? false : stryMutAct_9fa48("6799") ? true : (stryCov_9fa48("6799", "6800", "6801"), (product as any).url && isValidAmazonUrl((product as any).url))) ? stryMutAct_9fa48("6802") ? "" : (stryCov_9fa48("6802"), 'View on Amazon (affiliate link)') : stryMutAct_9fa48("6803") ? "" : (stryCov_9fa48("6803"), 'View product')}>
                <ExternalLink className="w-4 h-4" />
              </button>
            </div>

            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl font-bold text-gray-900">
                {formatPrice(product.price, product.currency)}
              </span>
              {stryMutAct_9fa48("6806") ? product.original_price && product.original_price > product.price || <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.original_price, product.currency)}
                </span> : stryMutAct_9fa48("6805") ? false : stryMutAct_9fa48("6804") ? true : (stryCov_9fa48("6804", "6805", "6806"), (stryMutAct_9fa48("6808") ? product.original_price || product.original_price > product.price : stryMutAct_9fa48("6807") ? true : (stryCov_9fa48("6807", "6808"), product.original_price && (stryMutAct_9fa48("6811") ? product.original_price <= product.price : stryMutAct_9fa48("6810") ? product.original_price >= product.price : stryMutAct_9fa48("6809") ? true : (stryCov_9fa48("6809", "6810", "6811"), product.original_price > product.price)))) && <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.original_price, product.currency)}
                </span>)}
            </div>

            {/* Category */}
            <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {product.category.name}
              </span>
              <span className="px-2 py-1 bg-gray-100 rounded-full">
                {product.availability}
              </span>
            </div>

          </div>

          {/* Action Buttons */}
          {stryMutAct_9fa48("6814") ? isActive || <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={handleDislike} className="w-12 h-12 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group" disabled={isDragging}>
                <X className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
              </button>

              <button onClick={handleSuperlike} className="w-12 h-12 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors group" disabled={isDragging}>
                <Star className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
              </button>

              <button onClick={handleLike} className="w-12 h-12 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors group" disabled={isDragging}>
                <Heart className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
              </button>
            </div> : stryMutAct_9fa48("6813") ? false : stryMutAct_9fa48("6812") ? true : (stryCov_9fa48("6812", "6813", "6814"), isActive && <div className="flex items-center justify-center gap-4 mt-4">
              <button onClick={handleDislike} className="w-12 h-12 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-colors group" disabled={isDragging}>
                <X className="w-6 h-6 text-gray-600 group-hover:text-red-500 transition-colors" />
              </button>

              <button onClick={handleSuperlike} className="w-12 h-12 bg-gray-100 hover:bg-blue-100 rounded-full flex items-center justify-center transition-colors group" disabled={isDragging}>
                <Star className="w-6 h-6 text-gray-600 group-hover:text-blue-500 transition-colors" />
              </button>

              <button onClick={handleLike} className="w-12 h-12 bg-gray-100 hover:bg-green-100 rounded-full flex items-center justify-center transition-colors group" disabled={isDragging}>
                <Heart className="w-6 h-6 text-gray-600 group-hover:text-green-500 transition-colors" />
              </button>
            </div>)}
        </div>
      </div>
    </motion.div>;
  }
};
export default SwipeCard;