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
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { RotateCcw, Settings, Info, Zap, Gift } from 'lucide-react';
import { SwipeCard } from './SwipeCard';
import { Product, SwipeGesture, SwipeSession, SwipeState } from '@/types';
import { api } from '@/lib/api';
import { appConfig } from '@/config';
import toast from 'react-hot-toast';
interface SwipeInterfaceProps {
  sessionType?: 'onboarding' | 'discovery' | 'category_exploration' | 'gift_selection';
  categoryFocus?: string;
  targetRecipient?: string;
  onSessionComplete?: (session: SwipeSession) => void;
  onRecommendationsReady?: () => void;
  className?: string;
}
export const SwipeInterface: React.FC<SwipeInterfaceProps> = ({
  sessionType = stryMutAct_9fa48("6815") ? "" : (stryCov_9fa48("6815"), 'discovery'),
  categoryFocus,
  targetRecipient,
  onSessionComplete,
  onRecommendationsReady,
  className = stryMutAct_9fa48("6816") ? "Stryker was here!" : (stryCov_9fa48("6816"), '')
}) => {
  if (stryMutAct_9fa48("6817")) {
    {}
  } else {
    stryCov_9fa48("6817");
    const [swipeState, setSwipeState] = useState<SwipeState>(stryMutAct_9fa48("6818") ? {} : (stryCov_9fa48("6818"), {
      cards: stryMutAct_9fa48("6819") ? ["Stryker was here"] : (stryCov_9fa48("6819"), []),
      currentIndex: 0,
      isLoading: stryMutAct_9fa48("6820") ? false : (stryCov_9fa48("6820"), true),
      hasMore: stryMutAct_9fa48("6821") ? false : (stryCov_9fa48("6821"), true),
      sessionId: null,
      swipeCount: 0,
      likeCount: 0,
      dislikeCount: 0
    }));
    const [session, setSession] = useState<SwipeSession | null>(null);
    const [showProgress, setShowProgress] = useState(stryMutAct_9fa48("6822") ? true : (stryCov_9fa48("6822"), false));
    const sessionStartTime = useRef<number>(Date.now());
    const lastSwipeTime = useRef<number>(Date.now());

    // Initialize swipe session
    const initializeSession = useCallback(async () => {
      if (stryMutAct_9fa48("6823")) {
        {}
      } else {
        stryCov_9fa48("6823");
        try {
          if (stryMutAct_9fa48("6824")) {
            {}
          } else {
            stryCov_9fa48("6824");
            setSwipeState(stryMutAct_9fa48("6825") ? () => undefined : (stryCov_9fa48("6825"), prev => stryMutAct_9fa48("6826") ? {} : (stryCov_9fa48("6826"), {
              ...prev,
              isLoading: stryMutAct_9fa48("6827") ? false : (stryCov_9fa48("6827"), true)
            })));
            const sessionData = stryMutAct_9fa48("6828") ? {} : (stryCov_9fa48("6828"), {
              session_type: sessionType,
              category_focus: categoryFocus,
              target_recipient: targetRecipient,
              context: stryMutAct_9fa48("6829") ? {} : (stryCov_9fa48("6829"), {
                user_agent: navigator.userAgent,
                screen_size: stryMutAct_9fa48("6830") ? `` : (stryCov_9fa48("6830"), `${window.innerWidth}x${window.innerHeight}`),
                started_at: new Date().toISOString()
              })
            });
            const response = await api.swipes.createSession(sessionData);
            const newSession = response.data;
            setSession(newSession);
            setSwipeState(stryMutAct_9fa48("6831") ? () => undefined : (stryCov_9fa48("6831"), prev => stryMutAct_9fa48("6832") ? {} : (stryCov_9fa48("6832"), {
              ...prev,
              sessionId: newSession.id
            })));
            sessionStartTime.current = Date.now();
            await loadMoreProducts(newSession.id);
          }
        } catch (error) {
          if (stryMutAct_9fa48("6833")) {
            {}
          } else {
            stryCov_9fa48("6833");
            console.error(stryMutAct_9fa48("6834") ? "" : (stryCov_9fa48("6834"), 'Failed to initialize swipe session:'), error);
            toast.error(stryMutAct_9fa48("6835") ? "" : (stryCov_9fa48("6835"), 'Failed to start swipe session. Please try again.'));
          }
        }
      }
    }, stryMutAct_9fa48("6836") ? [] : (stryCov_9fa48("6836"), [sessionType, categoryFocus, targetRecipient]));

    // Load more products for swiping
    const loadMoreProducts = useCallback(async (sessionId: string) => {
      if (stryMutAct_9fa48("6837")) {
        {}
      } else {
        stryCov_9fa48("6837");
        try {
          if (stryMutAct_9fa48("6838")) {
            {}
          } else {
            stryCov_9fa48("6838");
            const params: any = stryMutAct_9fa48("6839") ? {} : (stryCov_9fa48("6839"), {
              limit: appConfig.swipe.cardPreloadCount,
              exclude_seen: stryMutAct_9fa48("6840") ? false : (stryCov_9fa48("6840"), true),
              session_id: sessionId
            });
            if (stryMutAct_9fa48("6842") ? false : stryMutAct_9fa48("6841") ? true : (stryCov_9fa48("6841", "6842"), categoryFocus)) {
              if (stryMutAct_9fa48("6843")) {
                {}
              } else {
                stryCov_9fa48("6843");
                params.category = categoryFocus;
              }
            }
            const response = await api.products.getProducts(params);
            const products = response.data;
            if (stryMutAct_9fa48("6846") ? products.length !== 0 : stryMutAct_9fa48("6845") ? false : stryMutAct_9fa48("6844") ? true : (stryCov_9fa48("6844", "6845", "6846"), products.length === 0)) {
              if (stryMutAct_9fa48("6847")) {
                {}
              } else {
                stryCov_9fa48("6847");
                setSwipeState(stryMutAct_9fa48("6848") ? () => undefined : (stryCov_9fa48("6848"), prev => stryMutAct_9fa48("6849") ? {} : (stryCov_9fa48("6849"), {
                  ...prev,
                  hasMore: stryMutAct_9fa48("6850") ? true : (stryCov_9fa48("6850"), false),
                  isLoading: stryMutAct_9fa48("6851") ? true : (stryCov_9fa48("6851"), false)
                })));
                return;
              }
            }
            const newCards = products.map(stryMutAct_9fa48("6852") ? () => undefined : (stryCov_9fa48("6852"), (product: Product, index: number) => stryMutAct_9fa48("6853") ? {} : (stryCov_9fa48("6853"), {
              id: product.id,
              product,
              position: stryMutAct_9fa48("6854") ? swipeState.cards.length - index : (stryCov_9fa48("6854"), swipeState.cards.length + index),
              isVisible: stryMutAct_9fa48("6855") ? false : (stryCov_9fa48("6855"), true),
              isAnimating: stryMutAct_9fa48("6856") ? true : (stryCov_9fa48("6856"), false)
            })));
            setSwipeState(stryMutAct_9fa48("6857") ? () => undefined : (stryCov_9fa48("6857"), prev => stryMutAct_9fa48("6858") ? {} : (stryCov_9fa48("6858"), {
              ...prev,
              cards: stryMutAct_9fa48("6859") ? [] : (stryCov_9fa48("6859"), [...prev.cards, ...newCards]),
              isLoading: stryMutAct_9fa48("6860") ? true : (stryCov_9fa48("6860"), false),
              hasMore: stryMutAct_9fa48("6863") ? products.length !== appConfig.swipe.cardPreloadCount : stryMutAct_9fa48("6862") ? false : stryMutAct_9fa48("6861") ? true : (stryCov_9fa48("6861", "6862", "6863"), products.length === appConfig.swipe.cardPreloadCount)
            })));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6864")) {
            {}
          } else {
            stryCov_9fa48("6864");
            console.error(stryMutAct_9fa48("6865") ? "" : (stryCov_9fa48("6865"), 'Failed to load products:'), error);
            setSwipeState(stryMutAct_9fa48("6866") ? () => undefined : (stryCov_9fa48("6866"), prev => stryMutAct_9fa48("6867") ? {} : (stryCov_9fa48("6867"), {
              ...prev,
              isLoading: stryMutAct_9fa48("6868") ? true : (stryCov_9fa48("6868"), false)
            })));
            toast.error(stryMutAct_9fa48("6869") ? "" : (stryCov_9fa48("6869"), 'Failed to load products. Please try again.'));
          }
        }
      }
    }, stryMutAct_9fa48("6870") ? [] : (stryCov_9fa48("6870"), [categoryFocus, swipeState.cards.length]));

    // Handle swipe action
    const handleSwipe = useCallback(async (direction: 'left' | 'right' | 'up' | 'down', gesture: SwipeGesture) => {
      if (stryMutAct_9fa48("6871")) {
        {}
      } else {
        stryCov_9fa48("6871");
        if (stryMutAct_9fa48("6874") ? (!session?.id || !swipeState.sessionId) && swipeState.currentIndex >= swipeState.cards.length : stryMutAct_9fa48("6873") ? false : stryMutAct_9fa48("6872") ? true : (stryCov_9fa48("6872", "6873", "6874"), (stryMutAct_9fa48("6876") ? !session?.id && !swipeState.sessionId : stryMutAct_9fa48("6875") ? false : (stryCov_9fa48("6875", "6876"), (stryMutAct_9fa48("6877") ? session?.id : (stryCov_9fa48("6877"), !(stryMutAct_9fa48("6878") ? session.id : (stryCov_9fa48("6878"), session?.id)))) || (stryMutAct_9fa48("6879") ? swipeState.sessionId : (stryCov_9fa48("6879"), !swipeState.sessionId)))) || (stryMutAct_9fa48("6882") ? swipeState.currentIndex < swipeState.cards.length : stryMutAct_9fa48("6881") ? swipeState.currentIndex > swipeState.cards.length : stryMutAct_9fa48("6880") ? false : (stryCov_9fa48("6880", "6881", "6882"), swipeState.currentIndex >= swipeState.cards.length)))) {
          if (stryMutAct_9fa48("6883")) {
            {}
          } else {
            stryCov_9fa48("6883");
            return;
          }
        }
        const currentCard = swipeState.cards[swipeState.currentIndex];
        const currentTime = Date.now();
        const timeSinceLastSwipe = stryMutAct_9fa48("6884") ? currentTime + lastSwipeTime.current : (stryCov_9fa48("6884"), currentTime - lastSwipeTime.current);
        try {
          if (stryMutAct_9fa48("6885")) {
            {}
          } else {
            stryCov_9fa48("6885");
            // Record the swipe interaction
            if (stryMutAct_9fa48("6888") ? false : stryMutAct_9fa48("6887") ? true : stryMutAct_9fa48("6886") ? currentCard : (stryCov_9fa48("6886", "6887", "6888"), !currentCard)) return;
            const swipeData = stryMutAct_9fa48("6889") ? {} : (stryCov_9fa48("6889"), {
              product_id: currentCard.product.id,
              direction,
              content_type: 'product' as const,
              session_context: stryMutAct_9fa48("6890") ? {} : (stryCov_9fa48("6890"), {
                gesture,
                timing_ms: timeSinceLastSwipe,
                card_position: swipeState.currentIndex,
                session_duration: stryMutAct_9fa48("6891") ? currentTime + sessionStartTime.current : (stryCov_9fa48("6891"), currentTime - sessionStartTime.current)
              })
            });
            await api.swipes.recordSwipe(session.id, swipeData);

            // Update local state
            const newSwipeCount = stryMutAct_9fa48("6892") ? swipeState.swipeCount - 1 : (stryCov_9fa48("6892"), swipeState.swipeCount + 1);
            const newLikeCount = stryMutAct_9fa48("6893") ? swipeState.likeCount - (direction === 'right' || direction === 'up' ? 1 : 0) : (stryCov_9fa48("6893"), swipeState.likeCount + ((stryMutAct_9fa48("6896") ? direction === 'right' && direction === 'up' : stryMutAct_9fa48("6895") ? false : stryMutAct_9fa48("6894") ? true : (stryCov_9fa48("6894", "6895", "6896"), (stryMutAct_9fa48("6898") ? direction !== 'right' : stryMutAct_9fa48("6897") ? false : (stryCov_9fa48("6897", "6898"), direction === (stryMutAct_9fa48("6899") ? "" : (stryCov_9fa48("6899"), 'right')))) || (stryMutAct_9fa48("6901") ? direction !== 'up' : stryMutAct_9fa48("6900") ? false : (stryCov_9fa48("6900", "6901"), direction === (stryMutAct_9fa48("6902") ? "" : (stryCov_9fa48("6902"), 'up')))))) ? 1 : 0));
            const newDislikeCount = stryMutAct_9fa48("6903") ? swipeState.dislikeCount - (direction === 'left' || direction === 'down' ? 1 : 0) : (stryCov_9fa48("6903"), swipeState.dislikeCount + ((stryMutAct_9fa48("6906") ? direction === 'left' && direction === 'down' : stryMutAct_9fa48("6905") ? false : stryMutAct_9fa48("6904") ? true : (stryCov_9fa48("6904", "6905", "6906"), (stryMutAct_9fa48("6908") ? direction !== 'left' : stryMutAct_9fa48("6907") ? false : (stryCov_9fa48("6907", "6908"), direction === (stryMutAct_9fa48("6909") ? "" : (stryCov_9fa48("6909"), 'left')))) || (stryMutAct_9fa48("6911") ? direction !== 'down' : stryMutAct_9fa48("6910") ? false : (stryCov_9fa48("6910", "6911"), direction === (stryMutAct_9fa48("6912") ? "" : (stryCov_9fa48("6912"), 'down')))))) ? 1 : 0));
            setSwipeState(stryMutAct_9fa48("6913") ? () => undefined : (stryCov_9fa48("6913"), prev => stryMutAct_9fa48("6914") ? {} : (stryCov_9fa48("6914"), {
              ...prev,
              currentIndex: stryMutAct_9fa48("6915") ? prev.currentIndex - 1 : (stryCov_9fa48("6915"), prev.currentIndex + 1),
              swipeCount: newSwipeCount,
              likeCount: newLikeCount,
              dislikeCount: newDislikeCount
            })));
            lastSwipeTime.current = currentTime;

            // Show progress after 10 swipes
            if (stryMutAct_9fa48("6918") ? newSwipeCount >= 10 || !showProgress : stryMutAct_9fa48("6917") ? false : stryMutAct_9fa48("6916") ? true : (stryCov_9fa48("6916", "6917", "6918"), (stryMutAct_9fa48("6921") ? newSwipeCount < 10 : stryMutAct_9fa48("6920") ? newSwipeCount > 10 : stryMutAct_9fa48("6919") ? true : (stryCov_9fa48("6919", "6920", "6921"), newSwipeCount >= 10)) && (stryMutAct_9fa48("6922") ? showProgress : (stryCov_9fa48("6922"), !showProgress)))) {
              if (stryMutAct_9fa48("6923")) {
                {}
              } else {
                stryCov_9fa48("6923");
                setShowProgress(stryMutAct_9fa48("6924") ? false : (stryCov_9fa48("6924"), true));
              }
            }

            // Check if we need to load more cards
            const remainingCards = stryMutAct_9fa48("6925") ? swipeState.cards.length - swipeState.currentIndex + 1 : (stryCov_9fa48("6925"), (stryMutAct_9fa48("6926") ? swipeState.cards.length + swipeState.currentIndex : (stryCov_9fa48("6926"), swipeState.cards.length - swipeState.currentIndex)) - 1);
            if (stryMutAct_9fa48("6929") ? remainingCards <= 2 && swipeState.hasMore || !swipeState.isLoading : stryMutAct_9fa48("6928") ? false : stryMutAct_9fa48("6927") ? true : (stryCov_9fa48("6927", "6928", "6929"), (stryMutAct_9fa48("6931") ? remainingCards <= 2 || swipeState.hasMore : stryMutAct_9fa48("6930") ? true : (stryCov_9fa48("6930", "6931"), (stryMutAct_9fa48("6934") ? remainingCards > 2 : stryMutAct_9fa48("6933") ? remainingCards < 2 : stryMutAct_9fa48("6932") ? true : (stryCov_9fa48("6932", "6933", "6934"), remainingCards <= 2)) && swipeState.hasMore)) && (stryMutAct_9fa48("6935") ? swipeState.isLoading : (stryCov_9fa48("6935"), !swipeState.isLoading)))) {
              if (stryMutAct_9fa48("6936")) {
                {}
              } else {
                stryCov_9fa48("6936");
                await loadMoreProducts(session.id);
              }
            }

            // Check if session is complete
            if (stryMutAct_9fa48("6939") ? newSwipeCount >= appConfig.swipe.maxSwipesPerSession && remainingCards === 0 : stryMutAct_9fa48("6938") ? false : stryMutAct_9fa48("6937") ? true : (stryCov_9fa48("6937", "6938", "6939"), (stryMutAct_9fa48("6942") ? newSwipeCount < appConfig.swipe.maxSwipesPerSession : stryMutAct_9fa48("6941") ? newSwipeCount > appConfig.swipe.maxSwipesPerSession : stryMutAct_9fa48("6940") ? false : (stryCov_9fa48("6940", "6941", "6942"), newSwipeCount >= appConfig.swipe.maxSwipesPerSession)) || (stryMutAct_9fa48("6944") ? remainingCards !== 0 : stryMutAct_9fa48("6943") ? false : (stryCov_9fa48("6943", "6944"), remainingCards === 0)))) {
              if (stryMutAct_9fa48("6945")) {
                {}
              } else {
                stryCov_9fa48("6945");
                await completeSession(newSwipeCount, newLikeCount, newDislikeCount);
              }
            }

            // Generate recommendations after sufficient swipes
            if (stryMutAct_9fa48("6948") ? newSwipeCount >= 10 || newSwipeCount % 10 === 0 : stryMutAct_9fa48("6947") ? false : stryMutAct_9fa48("6946") ? true : (stryCov_9fa48("6946", "6947", "6948"), (stryMutAct_9fa48("6951") ? newSwipeCount < 10 : stryMutAct_9fa48("6950") ? newSwipeCount > 10 : stryMutAct_9fa48("6949") ? true : (stryCov_9fa48("6949", "6950", "6951"), newSwipeCount >= 10)) && (stryMutAct_9fa48("6953") ? newSwipeCount % 10 !== 0 : stryMutAct_9fa48("6952") ? true : (stryCov_9fa48("6952", "6953"), (stryMutAct_9fa48("6954") ? newSwipeCount * 10 : (stryCov_9fa48("6954"), newSwipeCount % 10)) === 0)))) {
              if (stryMutAct_9fa48("6955")) {
                {}
              } else {
                stryCov_9fa48("6955");
                if (stryMutAct_9fa48("6957") ? false : stryMutAct_9fa48("6956") ? true : (stryCov_9fa48("6956", "6957"), onRecommendationsReady)) {
                  if (stryMutAct_9fa48("6958")) {
                    {}
                  } else {
                    stryCov_9fa48("6958");
                    onRecommendationsReady();
                  }
                }
                toast.success(stryMutAct_9fa48("6959") ? "" : (stryCov_9fa48("6959"), 'New recommendations are ready!'));
              }
            }

            // Enhanced haptic feedback for mobile
            if (stryMutAct_9fa48("6962") ? typeof window !== 'undefined' || 'vibrate' in navigator : stryMutAct_9fa48("6961") ? false : stryMutAct_9fa48("6960") ? true : (stryCov_9fa48("6960", "6961", "6962"), (stryMutAct_9fa48("6964") ? typeof window === 'undefined' : stryMutAct_9fa48("6963") ? true : (stryCov_9fa48("6963", "6964"), typeof window !== (stryMutAct_9fa48("6965") ? "" : (stryCov_9fa48("6965"), 'undefined')))) && (stryMutAct_9fa48("6966") ? "" : (stryCov_9fa48("6966"), 'vibrate')) in navigator)) {
              if (stryMutAct_9fa48("6967")) {
                {}
              } else {
                stryCov_9fa48("6967");
                const vibrationPattern = stryMutAct_9fa48("6970") ? {
                  'right': 50,
                  // Like - short pleasant buzz
                  'up': [30, 20, 30],
                  // Super like - double buzz
                  'left': 100,
                  // Dislike - longer buzz
                  'down': 75 // Down swipe
                }[direction] && 50 : stryMutAct_9fa48("6969") ? false : stryMutAct_9fa48("6968") ? true : (stryCov_9fa48("6968", "6969", "6970"), (stryMutAct_9fa48("6971") ? {} : (stryCov_9fa48("6971"), {
                  'right': 50,
                  // Like - short pleasant buzz
                  'up': stryMutAct_9fa48("6972") ? [] : (stryCov_9fa48("6972"), [30, 20, 30]),
                  // Super like - double buzz
                  'left': 100,
                  // Dislike - longer buzz
                  'down': 75 // Down swipe
                }))[direction] || 50);
                navigator.vibrate(vibrationPattern);
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("6973")) {
            {}
          } else {
            stryCov_9fa48("6973");
            console.error(stryMutAct_9fa48("6974") ? "" : (stryCov_9fa48("6974"), 'Failed to record swipe:'), error);
            toast.error(stryMutAct_9fa48("6975") ? "" : (stryCov_9fa48("6975"), 'Failed to record swipe. Please try again.'));
          }
        }
      }
    }, stryMutAct_9fa48("6976") ? [] : (stryCov_9fa48("6976"), [session, swipeState, showProgress, onRecommendationsReady, loadMoreProducts]));

    // Complete the session
    const completeSession = useCallback(async (finalSwipeCount: number, finalLikeCount: number, finalDislikeCount: number) => {
      if (stryMutAct_9fa48("6977")) {
        {}
      } else {
        stryCov_9fa48("6977");
        if (stryMutAct_9fa48("6980") ? false : stryMutAct_9fa48("6979") ? true : stryMutAct_9fa48("6978") ? session : (stryCov_9fa48("6978", "6979", "6980"), !session)) return;
        try {
          if (stryMutAct_9fa48("6981")) {
            {}
          } else {
            stryCov_9fa48("6981");
            const sessionDuration = stryMutAct_9fa48("6982") ? Date.now() + sessionStartTime.current : (stryCov_9fa48("6982"), Date.now() - sessionStartTime.current);

            // The session completion is handled by the backend
            // We just need to notify our parent component
            const completedSession: SwipeSession = stryMutAct_9fa48("6983") ? {} : (stryCov_9fa48("6983"), {
              ...session,
              is_completed: stryMutAct_9fa48("6984") ? false : (stryCov_9fa48("6984"), true),
              completed_at: new Date().toISOString(),
              swipe_count: finalSwipeCount,
              like_count: finalLikeCount,
              dislike_count: finalDislikeCount,
              session_duration: sessionDuration
            });
            if (stryMutAct_9fa48("6986") ? false : stryMutAct_9fa48("6985") ? true : (stryCov_9fa48("6985", "6986"), onSessionComplete)) {
              if (stryMutAct_9fa48("6987")) {
                {}
              } else {
                stryCov_9fa48("6987");
                onSessionComplete(completedSession);
              }
            }
            toast.success(stryMutAct_9fa48("6988") ? "" : (stryCov_9fa48("6988"), 'Swipe session completed! Generating your recommendations...'));
          }
        } catch (error) {
          if (stryMutAct_9fa48("6989")) {
            {}
          } else {
            stryCov_9fa48("6989");
            console.error(stryMutAct_9fa48("6990") ? "" : (stryCov_9fa48("6990"), 'Failed to complete session:'), error);
          }
        }
      }
    }, stryMutAct_9fa48("6991") ? [] : (stryCov_9fa48("6991"), [session, onSessionComplete]));

    // Handle product click (open product details)
    const handleProductClick = useCallback((product: Product) => {
      if (stryMutAct_9fa48("6992")) {
        {}
      } else {
        stryCov_9fa48("6992");
        // Track product view
        api.analytics.trackEvent(stryMutAct_9fa48("6993") ? {} : (stryCov_9fa48("6993"), {
          event_name: stryMutAct_9fa48("6994") ? "" : (stryCov_9fa48("6994"), 'product_viewed'),
          properties: stryMutAct_9fa48("6995") ? {} : (stryCov_9fa48("6995"), {
            product_id: product.id,
            product_name: product.name,
            source: stryMutAct_9fa48("6996") ? "" : (stryCov_9fa48("6996"), 'swipe_interface'),
            session_id: stryMutAct_9fa48("6997") ? session.id : (stryCov_9fa48("6997"), session?.id)
          })
        }));

        // Open product in new tab
        window.open(product.affiliate_url, stryMutAct_9fa48("6998") ? "" : (stryCov_9fa48("6998"), '_blank'), stryMutAct_9fa48("6999") ? "" : (stryCov_9fa48("6999"), 'noopener,noreferrer'));
      }
    }, stryMutAct_9fa48("7000") ? [] : (stryCov_9fa48("7000"), [session]));

    // Reset session
    const resetSession = useCallback(async () => {
      if (stryMutAct_9fa48("7001")) {
        {}
      } else {
        stryCov_9fa48("7001");
        setSwipeState(stryMutAct_9fa48("7002") ? {} : (stryCov_9fa48("7002"), {
          cards: stryMutAct_9fa48("7003") ? ["Stryker was here"] : (stryCov_9fa48("7003"), []),
          currentIndex: 0,
          isLoading: stryMutAct_9fa48("7004") ? false : (stryCov_9fa48("7004"), true),
          hasMore: stryMutAct_9fa48("7005") ? false : (stryCov_9fa48("7005"), true),
          sessionId: null,
          swipeCount: 0,
          likeCount: 0,
          dislikeCount: 0
        }));
        setSession(null);
        setShowProgress(stryMutAct_9fa48("7006") ? true : (stryCov_9fa48("7006"), false));
        await initializeSession();
      }
    }, stryMutAct_9fa48("7007") ? [] : (stryCov_9fa48("7007"), [initializeSession]));

    // Initialize on mount
    useEffect(() => {
      if (stryMutAct_9fa48("7008")) {
        {}
      } else {
        stryCov_9fa48("7008");
        initializeSession();
      }
    }, stryMutAct_9fa48("7009") ? [] : (stryCov_9fa48("7009"), [initializeSession]));

    // Keyboard shortcuts
    useEffect(() => {
      if (stryMutAct_9fa48("7010")) {
        {}
      } else {
        stryCov_9fa48("7010");
        const handleKeyPress = (event: KeyboardEvent) => {
          if (stryMutAct_9fa48("7011")) {
            {}
          } else {
            stryCov_9fa48("7011");
            if (stryMutAct_9fa48("7015") ? swipeState.currentIndex < swipeState.cards.length : stryMutAct_9fa48("7014") ? swipeState.currentIndex > swipeState.cards.length : stryMutAct_9fa48("7013") ? false : stryMutAct_9fa48("7012") ? true : (stryCov_9fa48("7012", "7013", "7014", "7015"), swipeState.currentIndex >= swipeState.cards.length)) return;
            const gesture: SwipeGesture = stryMutAct_9fa48("7016") ? {} : (stryCov_9fa48("7016"), {
              direction: stryMutAct_9fa48("7017") ? "" : (stryCov_9fa48("7017"), 'right'),
              velocity: 1,
              distance: 200,
              duration: 100,
              startPosition: stryMutAct_9fa48("7018") ? {} : (stryCov_9fa48("7018"), {
                x: 0,
                y: 0
              }),
              endPosition: stryMutAct_9fa48("7019") ? {} : (stryCov_9fa48("7019"), {
                x: 0,
                y: 0
              })
            });
            switch (event.key) {
              case stryMutAct_9fa48("7020") ? "" : (stryCov_9fa48("7020"), 'ArrowLeft'):
              case stryMutAct_9fa48("7021") ? "" : (stryCov_9fa48("7021"), 'X'):
              case stryMutAct_9fa48("7023") ? "" : (stryCov_9fa48("7023"), 'x'):
                if (stryMutAct_9fa48("7022")) {} else {
                  stryCov_9fa48("7022");
                  event.preventDefault();
                  handleSwipe(stryMutAct_9fa48("7024") ? "" : (stryCov_9fa48("7024"), 'left'), stryMutAct_9fa48("7025") ? {} : (stryCov_9fa48("7025"), {
                    ...gesture,
                    direction: stryMutAct_9fa48("7026") ? "" : (stryCov_9fa48("7026"), 'left'),
                    endPosition: stryMutAct_9fa48("7027") ? {} : (stryCov_9fa48("7027"), {
                      x: stryMutAct_9fa48("7028") ? +200 : (stryCov_9fa48("7028"), -200),
                      y: 0
                    })
                  }));
                  break;
                }
              case stryMutAct_9fa48("7029") ? "" : (stryCov_9fa48("7029"), 'ArrowRight'):
              case stryMutAct_9fa48("7030") ? "" : (stryCov_9fa48("7030"), 'L'):
              case stryMutAct_9fa48("7032") ? "" : (stryCov_9fa48("7032"), 'l'):
                if (stryMutAct_9fa48("7031")) {} else {
                  stryCov_9fa48("7031");
                  event.preventDefault();
                  handleSwipe(stryMutAct_9fa48("7033") ? "" : (stryCov_9fa48("7033"), 'right'), stryMutAct_9fa48("7034") ? {} : (stryCov_9fa48("7034"), {
                    ...gesture,
                    direction: stryMutAct_9fa48("7035") ? "" : (stryCov_9fa48("7035"), 'right'),
                    endPosition: stryMutAct_9fa48("7036") ? {} : (stryCov_9fa48("7036"), {
                      x: 200,
                      y: 0
                    })
                  }));
                  break;
                }
              case stryMutAct_9fa48("7037") ? "" : (stryCov_9fa48("7037"), 'ArrowUp'):
              case stryMutAct_9fa48("7038") ? "" : (stryCov_9fa48("7038"), 'S'):
              case stryMutAct_9fa48("7040") ? "" : (stryCov_9fa48("7040"), 's'):
                if (stryMutAct_9fa48("7039")) {} else {
                  stryCov_9fa48("7039");
                  event.preventDefault();
                  handleSwipe(stryMutAct_9fa48("7041") ? "" : (stryCov_9fa48("7041"), 'up'), stryMutAct_9fa48("7042") ? {} : (stryCov_9fa48("7042"), {
                    ...gesture,
                    direction: stryMutAct_9fa48("7043") ? "" : (stryCov_9fa48("7043"), 'up'),
                    endPosition: stryMutAct_9fa48("7044") ? {} : (stryCov_9fa48("7044"), {
                      x: 0,
                      y: stryMutAct_9fa48("7045") ? +200 : (stryCov_9fa48("7045"), -200)
                    })
                  }));
                  break;
                }
              case stryMutAct_9fa48("7047") ? "" : (stryCov_9fa48("7047"), ' '):
                if (stryMutAct_9fa48("7046")) {} else {
                  stryCov_9fa48("7046");
                  event.preventDefault();
                  const currentCard = swipeState.cards[swipeState.currentIndex];
                  if (stryMutAct_9fa48("7049") ? false : stryMutAct_9fa48("7048") ? true : (stryCov_9fa48("7048", "7049"), currentCard)) {
                    if (stryMutAct_9fa48("7050")) {
                      {}
                    } else {
                      stryCov_9fa48("7050");
                      handleProductClick(currentCard.product);
                    }
                  }
                  break;
                }
            }
          }
        };
        window.addEventListener(stryMutAct_9fa48("7051") ? "" : (stryCov_9fa48("7051"), 'keydown'), handleKeyPress);
        return stryMutAct_9fa48("7052") ? () => undefined : (stryCov_9fa48("7052"), () => window.removeEventListener(stryMutAct_9fa48("7053") ? "" : (stryCov_9fa48("7053"), 'keydown'), handleKeyPress));
      }
    }, stryMutAct_9fa48("7054") ? [] : (stryCov_9fa48("7054"), [handleSwipe, handleProductClick, swipeState.currentIndex, swipeState.cards]));
    const currentCard = swipeState.cards[swipeState.currentIndex];
    const nextCards = stryMutAct_9fa48("7055") ? swipeState.cards : (stryCov_9fa48("7055"), swipeState.cards.slice(stryMutAct_9fa48("7056") ? swipeState.currentIndex - 1 : (stryCov_9fa48("7056"), swipeState.currentIndex + 1), stryMutAct_9fa48("7057") ? swipeState.currentIndex - 4 : (stryCov_9fa48("7057"), swipeState.currentIndex + 4)));
    const progress = stryMutAct_9fa48("7058") ? Math.max(swipeState.swipeCount / appConfig.swipe.maxSwipesPerSession * 100, 100) : (stryCov_9fa48("7058"), Math.min(stryMutAct_9fa48("7059") ? swipeState.swipeCount / appConfig.swipe.maxSwipesPerSession / 100 : (stryCov_9fa48("7059"), (stryMutAct_9fa48("7060") ? swipeState.swipeCount * appConfig.swipe.maxSwipesPerSession : (stryCov_9fa48("7060"), swipeState.swipeCount / appConfig.swipe.maxSwipesPerSession)) * 100), 100));
    return <div className={stryMutAct_9fa48("7061") ? `` : (stryCov_9fa48("7061"), `relative w-full h-full flex flex-col touch-none select-none ${className}`)} style={stryMutAct_9fa48("7062") ? {} : (stryCov_9fa48("7062"), {
      touchAction: stryMutAct_9fa48("7063") ? "" : (stryCov_9fa48("7063"), 'none')
    })}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="flex items-center gap-3">
          <Gift className="w-6 h-6 text-primary-600" />
          <div>
            <h2 className="font-semibold text-gray-900">
              {stryMutAct_9fa48("7066") ? sessionType === 'onboarding' || 'Tell us what you like' : stryMutAct_9fa48("7065") ? false : stryMutAct_9fa48("7064") ? true : (stryCov_9fa48("7064", "7065", "7066"), (stryMutAct_9fa48("7068") ? sessionType !== 'onboarding' : stryMutAct_9fa48("7067") ? true : (stryCov_9fa48("7067", "7068"), sessionType === (stryMutAct_9fa48("7069") ? "" : (stryCov_9fa48("7069"), 'onboarding')))) && (stryMutAct_9fa48("7070") ? "" : (stryCov_9fa48("7070"), 'Tell us what you like')))}
              {stryMutAct_9fa48("7073") ? sessionType === 'discovery' || 'Discover products' : stryMutAct_9fa48("7072") ? false : stryMutAct_9fa48("7071") ? true : (stryCov_9fa48("7071", "7072", "7073"), (stryMutAct_9fa48("7075") ? sessionType !== 'discovery' : stryMutAct_9fa48("7074") ? true : (stryCov_9fa48("7074", "7075"), sessionType === (stryMutAct_9fa48("7076") ? "" : (stryCov_9fa48("7076"), 'discovery')))) && (stryMutAct_9fa48("7077") ? "" : (stryCov_9fa48("7077"), 'Discover products')))}
              {stryMutAct_9fa48("7080") ? sessionType === 'category_exploration' || `Explore ${categoryFocus}` : stryMutAct_9fa48("7079") ? false : stryMutAct_9fa48("7078") ? true : (stryCov_9fa48("7078", "7079", "7080"), (stryMutAct_9fa48("7082") ? sessionType !== 'category_exploration' : stryMutAct_9fa48("7081") ? true : (stryCov_9fa48("7081", "7082"), sessionType === (stryMutAct_9fa48("7083") ? "" : (stryCov_9fa48("7083"), 'category_exploration')))) && (stryMutAct_9fa48("7084") ? `` : (stryCov_9fa48("7084"), `Explore ${categoryFocus}`)))}
              {stryMutAct_9fa48("7087") ? sessionType === 'gift_selection' || `Gifts for ${targetRecipient}` : stryMutAct_9fa48("7086") ? false : stryMutAct_9fa48("7085") ? true : (stryCov_9fa48("7085", "7086", "7087"), (stryMutAct_9fa48("7089") ? sessionType !== 'gift_selection' : stryMutAct_9fa48("7088") ? true : (stryCov_9fa48("7088", "7089"), sessionType === (stryMutAct_9fa48("7090") ? "" : (stryCov_9fa48("7090"), 'gift_selection')))) && (stryMutAct_9fa48("7091") ? `` : (stryCov_9fa48("7091"), `Gifts for ${targetRecipient}`)))}
            </h2>
            {stryMutAct_9fa48("7094") ? showProgress || <p className="text-sm text-gray-600">
                {swipeState.swipeCount} swipes • {swipeState.likeCount} likes
              </p> : stryMutAct_9fa48("7093") ? false : stryMutAct_9fa48("7092") ? true : (stryCov_9fa48("7092", "7093", "7094"), showProgress && <p className="text-sm text-gray-600">
                {swipeState.swipeCount} swipes • {swipeState.likeCount} likes
              </p>)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button onClick={resetSession} className="p-2 text-gray-600 hover:text-primary-600 transition-colors" title="Reset session">
            <RotateCcw className="w-5 h-5" />
          </button>
          <button className="p-2 text-gray-600 hover:text-primary-600 transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      {stryMutAct_9fa48("7097") ? showProgress || <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div className="bg-primary-600 h-2 rounded-full" initial={{
            width: 0
          }} animate={{
            width: `${progress}%`
          }} transition={{
            duration: 0.5
          }} />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{swipeState.swipeCount} swipes</span>
            <span>{appConfig.swipe.maxSwipesPerSession} max</span>
          </div>
        </div> : stryMutAct_9fa48("7096") ? false : stryMutAct_9fa48("7095") ? true : (stryCov_9fa48("7095", "7096", "7097"), showProgress && <div className="px-4 py-2 bg-white/80 backdrop-blur-sm border-b border-gray-200">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div className="bg-primary-600 h-2 rounded-full" initial={stryMutAct_9fa48("7098") ? {} : (stryCov_9fa48("7098"), {
            width: 0
          })} animate={stryMutAct_9fa48("7099") ? {} : (stryCov_9fa48("7099"), {
            width: stryMutAct_9fa48("7100") ? `` : (stryCov_9fa48("7100"), `${progress}%`)
          })} transition={stryMutAct_9fa48("7101") ? {} : (stryCov_9fa48("7101"), {
            duration: 0.5
          })} />
          </div>
          <div className="flex justify-between text-xs text-gray-600 mt-1">
            <span>{swipeState.swipeCount} swipes</span>
            <span>{appConfig.swipe.maxSwipesPerSession} max</span>
          </div>
        </div>)}

      {/* Swipe Area */}
      <div className="flex-1 relative overflow-hidden bg-gradient-to-br from-primary-50 to-secondary-50">

        {(stryMutAct_9fa48("7104") ? swipeState.isLoading || swipeState.cards.length === 0 : stryMutAct_9fa48("7103") ? false : stryMutAct_9fa48("7102") ? true : (stryCov_9fa48("7102", "7103", "7104"), swipeState.isLoading && (stryMutAct_9fa48("7106") ? swipeState.cards.length !== 0 : stryMutAct_9fa48("7105") ? true : (stryCov_9fa48("7105", "7106"), swipeState.cards.length === 0)))) ?
        // Loading state
        <div className="absolute inset-0 flex items-center justify-center bg-yellow-200 border-4 border-purple-500">
            <div className="text-center">
              <h1 className="text-black text-2xl">DEBUG: LOADING STATE</h1>
              <p className="text-black">isLoading: {swipeState.isLoading.toString()}</p>
              <p className="text-black">cards.length: {swipeState.cards.length}</p>
              <motion.div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full mx-auto" animate={stryMutAct_9fa48("7107") ? {} : (stryCov_9fa48("7107"), {
              rotate: 360
            })} transition={stryMutAct_9fa48("7108") ? {} : (stryCov_9fa48("7108"), {
              duration: 1,
              repeat: Infinity,
              ease: stryMutAct_9fa48("7109") ? "" : (stryCov_9fa48("7109"), 'linear')
            })} />
              <p className="mt-4 text-gray-600">Loading products...</p>
            </div>
          </div> : currentCard ?
        // Swipe cards
        <div className="absolute inset-4">
            {/* DEBUG: Simple visible test */}
            <div className="absolute inset-0 bg-blue-200 border-4 border-red-500 z-50 p-4">
              <h1 className="text-black text-2xl">DEBUG: SwipeInterface Rendering</h1>
              <p className="text-black">Current card exists: {currentCard ? stryMutAct_9fa48("7110") ? "" : (stryCov_9fa48("7110"), 'YES') : stryMutAct_9fa48("7111") ? "" : (stryCov_9fa48("7111"), 'NO')}</p>
              <p className="text-black">Product title: {stryMutAct_9fa48("7114") ? currentCard?.product?.name && 'NO TITLE' : stryMutAct_9fa48("7113") ? false : stryMutAct_9fa48("7112") ? true : (stryCov_9fa48("7112", "7113", "7114"), (stryMutAct_9fa48("7116") ? currentCard.product?.name : stryMutAct_9fa48("7115") ? currentCard?.product.name : (stryCov_9fa48("7115", "7116"), currentCard?.product?.name)) || (stryMutAct_9fa48("7117") ? "" : (stryCov_9fa48("7117"), 'NO TITLE')))}</p>
              <p className="text-black">Product ID: {stryMutAct_9fa48("7120") ? currentCard?.product?.id && 'NO ID' : stryMutAct_9fa48("7119") ? false : stryMutAct_9fa48("7118") ? true : (stryCov_9fa48("7118", "7119", "7120"), (stryMutAct_9fa48("7122") ? currentCard.product?.id : stryMutAct_9fa48("7121") ? currentCard?.product.id : (stryCov_9fa48("7121", "7122"), currentCard?.product?.id)) || (stryMutAct_9fa48("7123") ? "" : (stryCov_9fa48("7123"), 'NO ID')))}</p>
              <p className="text-black">Cards length: {swipeState.cards.length}</p>
              <pre className="text-black text-xs mt-2">{JSON.stringify(stryMutAct_9fa48("7124") ? currentCard.product : (stryCov_9fa48("7124"), currentCard?.product), null, 2)}</pre>
            </div>
            
            {/* Current Card */}
            <SwipeCard key={currentCard.id} product={currentCard.product} index={0} isActive={stryMutAct_9fa48("7125") ? false : (stryCov_9fa48("7125"), true)} onSwipe={handleSwipe} onProductClick={handleProductClick} className="z-30" />
            
            {/* Next Cards (background stack) */}
            {nextCards.map(stryMutAct_9fa48("7126") ? () => undefined : (stryCov_9fa48("7126"), (card, index) => <SwipeCard key={card.id} product={card.product} index={stryMutAct_9fa48("7127") ? index - 1 : (stryCov_9fa48("7127"), index + 1)} isActive={stryMutAct_9fa48("7128") ? true : (stryCov_9fa48("7128"), false)} onSwipe={handleSwipe} onProductClick={handleProductClick} className={stryMutAct_9fa48("7129") ? `` : (stryCov_9fa48("7129"), `z-${stryMutAct_9fa48("7130") ? 20 + index : (stryCov_9fa48("7130"), 20 - index)}`)} />))}
          </div> :
        // No more cards
        <div className="absolute inset-0 flex items-center justify-center bg-green-200 border-4 border-orange-500">
            <div className="text-center max-w-md">
              <h1 className="text-black text-2xl">DEBUG: NO MORE CARDS</h1>
              <p className="text-black">isLoading: {swipeState.isLoading.toString()}</p>
              <p className="text-black">cards.length: {swipeState.cards.length}</p>
              <p className="text-black">currentIndex: {swipeState.currentIndex}</p>
              <p className="text-black">hasMore: {swipeState.hasMore.toString()}</p>
              <Zap className="w-16 h-16 text-primary-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Session Complete!
              </h3>
              <p className="text-gray-600 mb-6">
                Great job! We've learned about your preferences. Your personalized recommendations are being generated.
              </p>
              <motion.button onClick={resetSession} className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors" whileHover={stryMutAct_9fa48("7131") ? {} : (stryCov_9fa48("7131"), {
              scale: 1.05
            })} whileTap={stryMutAct_9fa48("7132") ? {} : (stryCov_9fa48("7132"), {
              scale: 0.95
            })}>
                Start New Session
              </motion.button>
            </div>
          </div>}
      </div>

      {/* Instructions */}
      {stryMutAct_9fa48("7135") ? swipeState.swipeCount < 5 && currentCard || <motion.div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs" initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} exit={{
        opacity: 0,
        y: 20
      }}>
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4" />
            <span className="font-medium">How to swipe</span>
          </div>
          <p>← Dislike • ↑ Super like • → Like</p>
          <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
        </motion.div> : stryMutAct_9fa48("7134") ? false : stryMutAct_9fa48("7133") ? true : (stryCov_9fa48("7133", "7134", "7135"), (stryMutAct_9fa48("7137") ? swipeState.swipeCount < 5 || currentCard : stryMutAct_9fa48("7136") ? true : (stryCov_9fa48("7136", "7137"), (stryMutAct_9fa48("7140") ? swipeState.swipeCount >= 5 : stryMutAct_9fa48("7139") ? swipeState.swipeCount <= 5 : stryMutAct_9fa48("7138") ? true : (stryCov_9fa48("7138", "7139", "7140"), swipeState.swipeCount < 5)) && currentCard)) && <motion.div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg text-sm text-center max-w-xs" initial={stryMutAct_9fa48("7141") ? {} : (stryCov_9fa48("7141"), {
        opacity: 0,
        y: 20
      })} animate={stryMutAct_9fa48("7142") ? {} : (stryCov_9fa48("7142"), {
        opacity: 1,
        y: 0
      })} exit={stryMutAct_9fa48("7143") ? {} : (stryCov_9fa48("7143"), {
        opacity: 0,
        y: 20
      })}>
          <div className="flex items-center gap-2 mb-1">
            <Info className="w-4 h-4" />
            <span className="font-medium">How to swipe</span>
          </div>
          <p>← Dislike • ↑ Super like • → Like</p>
          <p className="text-xs opacity-75 mt-1">Or use the buttons below</p>
        </motion.div>)}
    </div>;
  }
};
export default SwipeInterface;