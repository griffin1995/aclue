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
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-hot-toast';
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  actionLabel?: string;
  userId?: string;
  metadata?: Record<string, any>;
}
interface UseNotificationsOptions {
  enablePushNotifications?: boolean;
  enableBrowserNotifications?: boolean;
  pollingInterval?: number;
}
interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isSupported: boolean;
  permission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  deleteNotification: (id: string) => void;
  clearAll: () => void;
  showNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  subscribe: () => Promise<void>;
  unsubscribe: () => Promise<void>;
}
export function useNotifications(options: UseNotificationsOptions = {}): UseNotificationsReturn {
  if (stryMutAct_9fa48("9418")) {
    {}
  } else {
    stryCov_9fa48("9418");
    const {
      enablePushNotifications = stryMutAct_9fa48("9419") ? false : (stryCov_9fa48("9419"), true),
      enableBrowserNotifications = stryMutAct_9fa48("9420") ? false : (stryCov_9fa48("9420"), true),
      pollingInterval = 30000 // 30 seconds
    } = options;
    const [notifications, setNotifications] = useState<Notification[]>(stryMutAct_9fa48("9421") ? ["Stryker was here"] : (stryCov_9fa48("9421"), []));
    const [permission, setPermission] = useState<NotificationPermission>(stryMutAct_9fa48("9422") ? "" : (stryCov_9fa48("9422"), 'default'));
    const [isSupported, setIsSupported] = useState(stryMutAct_9fa48("9423") ? true : (stryCov_9fa48("9423"), false));

    // Check if notifications are supported
    useEffect(() => {
      if (stryMutAct_9fa48("9424")) {
        {}
      } else {
        stryCov_9fa48("9424");
        setIsSupported(stryMutAct_9fa48("9427") ? 'Notification' in window || 'serviceWorker' in navigator : stryMutAct_9fa48("9426") ? false : stryMutAct_9fa48("9425") ? true : (stryCov_9fa48("9425", "9426", "9427"), (stryMutAct_9fa48("9428") ? "" : (stryCov_9fa48("9428"), 'Notification')) in window && (stryMutAct_9fa48("9429") ? "" : (stryCov_9fa48("9429"), 'serviceWorker')) in navigator));
        if (stryMutAct_9fa48("9431") ? false : stryMutAct_9fa48("9430") ? true : (stryCov_9fa48("9430", "9431"), (stryMutAct_9fa48("9432") ? "" : (stryCov_9fa48("9432"), 'Notification')) in window)) {
          if (stryMutAct_9fa48("9433")) {
            {}
          } else {
            stryCov_9fa48("9433");
            setPermission(Notification.permission);
          }
        }
      }
    }, stryMutAct_9fa48("9434") ? ["Stryker was here"] : (stryCov_9fa48("9434"), []));

    // Load notifications from localStorage on mount
    useEffect(() => {
      if (stryMutAct_9fa48("9435")) {
        {}
      } else {
        stryCov_9fa48("9435");
        const savedNotifications = localStorage.getItem(stryMutAct_9fa48("9436") ? "" : (stryCov_9fa48("9436"), 'aclue_notifications'));
        if (stryMutAct_9fa48("9438") ? false : stryMutAct_9fa48("9437") ? true : (stryCov_9fa48("9437", "9438"), savedNotifications)) {
          if (stryMutAct_9fa48("9439")) {
            {}
          } else {
            stryCov_9fa48("9439");
            try {
              if (stryMutAct_9fa48("9440")) {
                {}
              } else {
                stryCov_9fa48("9440");
                const parsed = JSON.parse(savedNotifications);
                setNotifications(parsed.map(stryMutAct_9fa48("9441") ? () => undefined : (stryCov_9fa48("9441"), (n: any) => stryMutAct_9fa48("9442") ? {} : (stryCov_9fa48("9442"), {
                  ...n,
                  timestamp: new Date(n.timestamp)
                }))));
              }
            } catch (error) {
              if (stryMutAct_9fa48("9443")) {
                {}
              } else {
                stryCov_9fa48("9443");
                console.error(stryMutAct_9fa48("9444") ? "" : (stryCov_9fa48("9444"), 'Failed to parse saved notifications:'), error);
              }
            }
          }
        }
      }
    }, stryMutAct_9fa48("9445") ? ["Stryker was here"] : (stryCov_9fa48("9445"), []));

    // Save notifications to localStorage when they change
    useEffect(() => {
      if (stryMutAct_9fa48("9446")) {
        {}
      } else {
        stryCov_9fa48("9446");
        localStorage.setItem(stryMutAct_9fa48("9447") ? "" : (stryCov_9fa48("9447"), 'aclue_notifications'), JSON.stringify(notifications));
      }
    }, stryMutAct_9fa48("9448") ? [] : (stryCov_9fa48("9448"), [notifications]));

    // Request notification permission
    const requestPermission = useCallback(async (): Promise<NotificationPermission> => {
      if (stryMutAct_9fa48("9449")) {
        {}
      } else {
        stryCov_9fa48("9449");
        if (stryMutAct_9fa48("9452") ? false : stryMutAct_9fa48("9451") ? true : stryMutAct_9fa48("9450") ? isSupported : (stryCov_9fa48("9450", "9451", "9452"), !isSupported)) {
          if (stryMutAct_9fa48("9453")) {
            {}
          } else {
            stryCov_9fa48("9453");
            throw new Error(stryMutAct_9fa48("9454") ? "" : (stryCov_9fa48("9454"), 'Notifications are not supported'));
          }
        }
        const result = await Notification.requestPermission();
        setPermission(result);
        return result;
      }
    }, stryMutAct_9fa48("9455") ? [] : (stryCov_9fa48("9455"), [isSupported]));

    // Show browser notification
    const showBrowserNotification = useCallback((notification: Notification) => {
      if (stryMutAct_9fa48("9456")) {
        {}
      } else {
        stryCov_9fa48("9456");
        if (stryMutAct_9fa48("9459") ? !enableBrowserNotifications && permission !== 'granted' : stryMutAct_9fa48("9458") ? false : stryMutAct_9fa48("9457") ? true : (stryCov_9fa48("9457", "9458", "9459"), (stryMutAct_9fa48("9460") ? enableBrowserNotifications : (stryCov_9fa48("9460"), !enableBrowserNotifications)) || (stryMutAct_9fa48("9462") ? permission === 'granted' : stryMutAct_9fa48("9461") ? false : (stryCov_9fa48("9461", "9462"), permission !== (stryMutAct_9fa48("9463") ? "" : (stryCov_9fa48("9463"), 'granted')))))) return;
        const browserNotification = new Notification(notification.title, stryMutAct_9fa48("9464") ? {} : (stryCov_9fa48("9464"), {
          body: notification.message,
          icon: stryMutAct_9fa48("9465") ? "" : (stryCov_9fa48("9465"), '/icons/icon-192x192.png'),
          badge: stryMutAct_9fa48("9466") ? "" : (stryCov_9fa48("9466"), '/icons/icon-72x72.png'),
          tag: notification.id,
          requireInteraction: stryMutAct_9fa48("9469") ? notification.type !== 'error' : stryMutAct_9fa48("9468") ? false : stryMutAct_9fa48("9467") ? true : (stryCov_9fa48("9467", "9468", "9469"), notification.type === (stryMutAct_9fa48("9470") ? "" : (stryCov_9fa48("9470"), 'error'))),
          timestamp: notification.timestamp.getTime(),
          data: stryMutAct_9fa48("9471") ? {} : (stryCov_9fa48("9471"), {
            url: notification.actionUrl,
            notificationId: notification.id
          })
        }));

        // Handle notification click
        browserNotification.onclick = event => {
          if (stryMutAct_9fa48("9472")) {
            {}
          } else {
            stryCov_9fa48("9472");
            event.preventDefault();
            window.focus();
            if (stryMutAct_9fa48("9474") ? false : stryMutAct_9fa48("9473") ? true : (stryCov_9fa48("9473", "9474"), notification.actionUrl)) {
              if (stryMutAct_9fa48("9475")) {
                {}
              } else {
                stryCov_9fa48("9475");
                window.open(notification.actionUrl, stryMutAct_9fa48("9476") ? "" : (stryCov_9fa48("9476"), '_blank'));
              }
            }
            markAsRead(notification.id);
            browserNotification.close();
          }
        };

        // Auto-close after 5 seconds for non-error notifications
        if (stryMutAct_9fa48("9479") ? notification.type === 'error' : stryMutAct_9fa48("9478") ? false : stryMutAct_9fa48("9477") ? true : (stryCov_9fa48("9477", "9478", "9479"), notification.type !== (stryMutAct_9fa48("9480") ? "" : (stryCov_9fa48("9480"), 'error')))) {
          if (stryMutAct_9fa48("9481")) {
            {}
          } else {
            stryCov_9fa48("9481");
            setTimeout(() => {
              if (stryMutAct_9fa48("9482")) {
                {}
              } else {
                stryCov_9fa48("9482");
                browserNotification.close();
              }
            }, 5000);
          }
        }
      }
    }, stryMutAct_9fa48("9483") ? [] : (stryCov_9fa48("9483"), [enableBrowserNotifications, permission]));

    // Show toast notification
    const showToastNotification = useCallback((notification: Notification) => {
      if (stryMutAct_9fa48("9484")) {
        {}
      } else {
        stryCov_9fa48("9484");
        const toastOptions = stryMutAct_9fa48("9485") ? {} : (stryCov_9fa48("9485"), {
          duration: (stryMutAct_9fa48("9488") ? notification.type !== 'error' : stryMutAct_9fa48("9487") ? false : stryMutAct_9fa48("9486") ? true : (stryCov_9fa48("9486", "9487", "9488"), notification.type === (stryMutAct_9fa48("9489") ? "" : (stryCov_9fa48("9489"), 'error')))) ? 10000 : 5000,
          position: 'top-right' as const
        });
        switch (notification.type) {
          case stryMutAct_9fa48("9491") ? "" : (stryCov_9fa48("9491"), 'success'):
            if (stryMutAct_9fa48("9490")) {} else {
              stryCov_9fa48("9490");
              toast.success(stryMutAct_9fa48("9492") ? `` : (stryCov_9fa48("9492"), `${notification.title}\n${notification.message}`), toastOptions);
              break;
            }
          case stryMutAct_9fa48("9494") ? "" : (stryCov_9fa48("9494"), 'error'):
            if (stryMutAct_9fa48("9493")) {} else {
              stryCov_9fa48("9493");
              toast.error(stryMutAct_9fa48("9495") ? `` : (stryCov_9fa48("9495"), `${notification.title}\n${notification.message}`), toastOptions);
              break;
            }
          case stryMutAct_9fa48("9497") ? "" : (stryCov_9fa48("9497"), 'warning'):
            if (stryMutAct_9fa48("9496")) {} else {
              stryCov_9fa48("9496");
              toast(stryMutAct_9fa48("9498") ? `` : (stryCov_9fa48("9498"), `${notification.title}\n${notification.message}`), stryMutAct_9fa48("9499") ? {} : (stryCov_9fa48("9499"), {
                ...toastOptions,
                icon: stryMutAct_9fa48("9500") ? "" : (stryCov_9fa48("9500"), '⚠️')
              }));
              break;
            }
          default:
            if (stryMutAct_9fa48("9501")) {} else {
              stryCov_9fa48("9501");
              toast(stryMutAct_9fa48("9502") ? `` : (stryCov_9fa48("9502"), `${notification.title}\n${notification.message}`), toastOptions);
              break;
            }
        }
      }
    }, stryMutAct_9fa48("9503") ? ["Stryker was here"] : (stryCov_9fa48("9503"), []));

    // Add new notification
    const showNotification = useCallback((notificationData: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
      if (stryMutAct_9fa48("9504")) {
        {}
      } else {
        stryCov_9fa48("9504");
        const notification: Notification = stryMutAct_9fa48("9505") ? {} : (stryCov_9fa48("9505"), {
          ...notificationData,
          id: stryMutAct_9fa48("9506") ? `` : (stryCov_9fa48("9506"), `notification_${Date.now()}_${stryMutAct_9fa48("9507") ? Math.random().toString(36) : (stryCov_9fa48("9507"), Math.random().toString(36).substr(2, 9))}`),
          timestamp: new Date(),
          read: stryMutAct_9fa48("9508") ? true : (stryCov_9fa48("9508"), false)
        });
        setNotifications(stryMutAct_9fa48("9509") ? () => undefined : (stryCov_9fa48("9509"), prev => stryMutAct_9fa48("9510") ? [] : (stryCov_9fa48("9510"), [notification, ...prev])));

        // Show browser notification
        showBrowserNotification(notification);

        // Show toast notification
        showToastNotification(notification);
      }
    }, stryMutAct_9fa48("9511") ? [] : (stryCov_9fa48("9511"), [showBrowserNotification, showToastNotification]));

    // Mark notification as read
    const markAsRead = useCallback((id: string) => {
      if (stryMutAct_9fa48("9512")) {
        {}
      } else {
        stryCov_9fa48("9512");
        setNotifications(stryMutAct_9fa48("9513") ? () => undefined : (stryCov_9fa48("9513"), prev => prev.map(stryMutAct_9fa48("9514") ? () => undefined : (stryCov_9fa48("9514"), notification => (stryMutAct_9fa48("9517") ? notification.id !== id : stryMutAct_9fa48("9516") ? false : stryMutAct_9fa48("9515") ? true : (stryCov_9fa48("9515", "9516", "9517"), notification.id === id)) ? stryMutAct_9fa48("9518") ? {} : (stryCov_9fa48("9518"), {
          ...notification,
          read: stryMutAct_9fa48("9519") ? false : (stryCov_9fa48("9519"), true)
        }) : notification))));
      }
    }, stryMutAct_9fa48("9520") ? ["Stryker was here"] : (stryCov_9fa48("9520"), []));

    // Mark all notifications as read
    const markAllAsRead = useCallback(() => {
      if (stryMutAct_9fa48("9521")) {
        {}
      } else {
        stryCov_9fa48("9521");
        setNotifications(stryMutAct_9fa48("9522") ? () => undefined : (stryCov_9fa48("9522"), prev => prev.map(stryMutAct_9fa48("9523") ? () => undefined : (stryCov_9fa48("9523"), notification => stryMutAct_9fa48("9524") ? {} : (stryCov_9fa48("9524"), {
          ...notification,
          read: stryMutAct_9fa48("9525") ? false : (stryCov_9fa48("9525"), true)
        })))));
      }
    }, stryMutAct_9fa48("9526") ? ["Stryker was here"] : (stryCov_9fa48("9526"), []));

    // Delete notification
    const deleteNotification = useCallback((id: string) => {
      if (stryMutAct_9fa48("9527")) {
        {}
      } else {
        stryCov_9fa48("9527");
        setNotifications(stryMutAct_9fa48("9528") ? () => undefined : (stryCov_9fa48("9528"), prev => stryMutAct_9fa48("9529") ? prev : (stryCov_9fa48("9529"), prev.filter(stryMutAct_9fa48("9530") ? () => undefined : (stryCov_9fa48("9530"), notification => stryMutAct_9fa48("9533") ? notification.id === id : stryMutAct_9fa48("9532") ? false : stryMutAct_9fa48("9531") ? true : (stryCov_9fa48("9531", "9532", "9533"), notification.id !== id))))));
      }
    }, stryMutAct_9fa48("9534") ? ["Stryker was here"] : (stryCov_9fa48("9534"), []));

    // Clear all notifications
    const clearAll = useCallback(() => {
      if (stryMutAct_9fa48("9535")) {
        {}
      } else {
        stryCov_9fa48("9535");
        setNotifications(stryMutAct_9fa48("9536") ? ["Stryker was here"] : (stryCov_9fa48("9536"), []));
      }
    }, stryMutAct_9fa48("9537") ? ["Stryker was here"] : (stryCov_9fa48("9537"), []));

    // Subscribe to push notifications
    const subscribe = useCallback(async () => {
      if (stryMutAct_9fa48("9538")) {
        {}
      } else {
        stryCov_9fa48("9538");
        if (stryMutAct_9fa48("9541") ? !enablePushNotifications && !isSupported : stryMutAct_9fa48("9540") ? false : stryMutAct_9fa48("9539") ? true : (stryCov_9fa48("9539", "9540", "9541"), (stryMutAct_9fa48("9542") ? enablePushNotifications : (stryCov_9fa48("9542"), !enablePushNotifications)) || (stryMutAct_9fa48("9543") ? isSupported : (stryCov_9fa48("9543"), !isSupported)))) return;
        try {
          if (stryMutAct_9fa48("9544")) {
            {}
          } else {
            stryCov_9fa48("9544");
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.subscribe(stryMutAct_9fa48("9545") ? {} : (stryCov_9fa48("9545"), {
              userVisibleOnly: stryMutAct_9fa48("9546") ? false : (stryCov_9fa48("9546"), true),
              applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
            }));

            // Send subscription to server
            await fetch(stryMutAct_9fa48("9547") ? "" : (stryCov_9fa48("9547"), '/api/notifications/subscribe'), stryMutAct_9fa48("9548") ? {} : (stryCov_9fa48("9548"), {
              method: stryMutAct_9fa48("9549") ? "" : (stryCov_9fa48("9549"), 'POST'),
              headers: stryMutAct_9fa48("9550") ? {} : (stryCov_9fa48("9550"), {
                'Content-Type': stryMutAct_9fa48("9551") ? "" : (stryCov_9fa48("9551"), 'application/json')
              }),
              body: JSON.stringify(subscription)
            }));
            showNotification(stryMutAct_9fa48("9552") ? {} : (stryCov_9fa48("9552"), {
              type: stryMutAct_9fa48("9553") ? "" : (stryCov_9fa48("9553"), 'success'),
              title: stryMutAct_9fa48("9554") ? "" : (stryCov_9fa48("9554"), 'Notifications Enabled'),
              message: stryMutAct_9fa48("9555") ? "" : (stryCov_9fa48("9555"), 'You will now receive push notifications for important updates.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9556")) {
            {}
          } else {
            stryCov_9fa48("9556");
            console.error(stryMutAct_9fa48("9557") ? "" : (stryCov_9fa48("9557"), 'Failed to subscribe to push notifications:'), error);
            showNotification(stryMutAct_9fa48("9558") ? {} : (stryCov_9fa48("9558"), {
              type: stryMutAct_9fa48("9559") ? "" : (stryCov_9fa48("9559"), 'error'),
              title: stryMutAct_9fa48("9560") ? "" : (stryCov_9fa48("9560"), 'Notification Setup Failed'),
              message: stryMutAct_9fa48("9561") ? "" : (stryCov_9fa48("9561"), 'Unable to enable push notifications. Please try again.')
            }));
          }
        }
      }
    }, stryMutAct_9fa48("9562") ? [] : (stryCov_9fa48("9562"), [enablePushNotifications, isSupported, showNotification]));

    // Unsubscribe from push notifications
    const unsubscribe = useCallback(async () => {
      if (stryMutAct_9fa48("9563")) {
        {}
      } else {
        stryCov_9fa48("9563");
        if (stryMutAct_9fa48("9566") ? false : stryMutAct_9fa48("9565") ? true : stryMutAct_9fa48("9564") ? isSupported : (stryCov_9fa48("9564", "9565", "9566"), !isSupported)) return;
        try {
          if (stryMutAct_9fa48("9567")) {
            {}
          } else {
            stryCov_9fa48("9567");
            const registration = await navigator.serviceWorker.ready;
            const subscription = await registration.pushManager.getSubscription();
            if (stryMutAct_9fa48("9569") ? false : stryMutAct_9fa48("9568") ? true : (stryCov_9fa48("9568", "9569"), subscription)) {
              if (stryMutAct_9fa48("9570")) {
                {}
              } else {
                stryCov_9fa48("9570");
                await subscription.unsubscribe();

                // Notify server
                await fetch(stryMutAct_9fa48("9571") ? "" : (stryCov_9fa48("9571"), '/api/notifications/unsubscribe'), stryMutAct_9fa48("9572") ? {} : (stryCov_9fa48("9572"), {
                  method: stryMutAct_9fa48("9573") ? "" : (stryCov_9fa48("9573"), 'POST'),
                  headers: stryMutAct_9fa48("9574") ? {} : (stryCov_9fa48("9574"), {
                    'Content-Type': stryMutAct_9fa48("9575") ? "" : (stryCov_9fa48("9575"), 'application/json')
                  }),
                  body: JSON.stringify(stryMutAct_9fa48("9576") ? {} : (stryCov_9fa48("9576"), {
                    endpoint: subscription.endpoint
                  }))
                }));
              }
            }
            showNotification(stryMutAct_9fa48("9577") ? {} : (stryCov_9fa48("9577"), {
              type: stryMutAct_9fa48("9578") ? "" : (stryCov_9fa48("9578"), 'info'),
              title: stryMutAct_9fa48("9579") ? "" : (stryCov_9fa48("9579"), 'Notifications Disabled'),
              message: stryMutAct_9fa48("9580") ? "" : (stryCov_9fa48("9580"), 'You will no longer receive push notifications.')
            }));
          }
        } catch (error) {
          if (stryMutAct_9fa48("9581")) {
            {}
          } else {
            stryCov_9fa48("9581");
            console.error(stryMutAct_9fa48("9582") ? "" : (stryCov_9fa48("9582"), 'Failed to unsubscribe from push notifications:'), error);
          }
        }
      }
    }, stryMutAct_9fa48("9583") ? [] : (stryCov_9fa48("9583"), [isSupported, showNotification]));

    // Poll for new notifications (fallback for real-time)
    useEffect(() => {
      if (stryMutAct_9fa48("9584")) {
        {}
      } else {
        stryCov_9fa48("9584");
        if (stryMutAct_9fa48("9587") ? false : stryMutAct_9fa48("9586") ? true : stryMutAct_9fa48("9585") ? pollingInterval : (stryCov_9fa48("9585", "9586", "9587"), !pollingInterval)) return;
        const interval = setInterval(async () => {
          if (stryMutAct_9fa48("9588")) {
            {}
          } else {
            stryCov_9fa48("9588");
            try {
              if (stryMutAct_9fa48("9589")) {
                {}
              } else {
                stryCov_9fa48("9589");
                const response = await fetch(stryMutAct_9fa48("9590") ? "" : (stryCov_9fa48("9590"), '/api/notifications'));
                if (stryMutAct_9fa48("9592") ? false : stryMutAct_9fa48("9591") ? true : (stryCov_9fa48("9591", "9592"), response.ok)) {
                  if (stryMutAct_9fa48("9593")) {
                    {}
                  } else {
                    stryCov_9fa48("9593");
                    const serverNotifications = await response.json();

                    // Merge with local notifications, avoiding duplicates
                    setNotifications(prev => {
                      if (stryMutAct_9fa48("9594")) {
                        {}
                      } else {
                        stryCov_9fa48("9594");
                        const existingIds = new Set(prev.map(stryMutAct_9fa48("9595") ? () => undefined : (stryCov_9fa48("9595"), n => n.id)));
                        const newNotifications = stryMutAct_9fa48("9596") ? serverNotifications.map((n: any) => ({
                          ...n,
                          timestamp: new Date(n.timestamp)
                        })) : (stryCov_9fa48("9596"), serverNotifications.filter(stryMutAct_9fa48("9597") ? () => undefined : (stryCov_9fa48("9597"), (n: Notification) => stryMutAct_9fa48("9598") ? existingIds.has(n.id) : (stryCov_9fa48("9598"), !existingIds.has(n.id)))).map(stryMutAct_9fa48("9599") ? () => undefined : (stryCov_9fa48("9599"), (n: any) => stryMutAct_9fa48("9600") ? {} : (stryCov_9fa48("9600"), {
                          ...n,
                          timestamp: new Date(n.timestamp)
                        }))));
                        return stryMutAct_9fa48("9601") ? [...newNotifications, ...prev] : (stryCov_9fa48("9601"), (stryMutAct_9fa48("9602") ? [] : (stryCov_9fa48("9602"), [...newNotifications, ...prev])).slice(0, 100)); // Keep max 100 notifications
                      }
                    });
                  }
                }
              }
            } catch (error) {
              if (stryMutAct_9fa48("9603")) {
                {}
              } else {
                stryCov_9fa48("9603");
                // Silently fail - polling is a fallback mechanism
                console.debug(stryMutAct_9fa48("9604") ? "" : (stryCov_9fa48("9604"), 'Notification polling failed:'), error);
              }
            }
          }
        }, pollingInterval);
        return stryMutAct_9fa48("9605") ? () => undefined : (stryCov_9fa48("9605"), () => clearInterval(interval));
      }
    }, stryMutAct_9fa48("9606") ? [] : (stryCov_9fa48("9606"), [pollingInterval]));

    // Listen for service worker messages (for push notifications)
    useEffect(() => {
      if (stryMutAct_9fa48("9607")) {
        {}
      } else {
        stryCov_9fa48("9607");
        if (stryMutAct_9fa48("9610") ? false : stryMutAct_9fa48("9609") ? true : stryMutAct_9fa48("9608") ? isSupported : (stryCov_9fa48("9608", "9609", "9610"), !isSupported)) return;
        const handleMessage = (event: MessageEvent) => {
          if (stryMutAct_9fa48("9611")) {
            {}
          } else {
            stryCov_9fa48("9611");
            if (stryMutAct_9fa48("9614") ? event.data || event.data.type === 'NOTIFICATION_RECEIVED' : stryMutAct_9fa48("9613") ? false : stryMutAct_9fa48("9612") ? true : (stryCov_9fa48("9612", "9613", "9614"), event.data && (stryMutAct_9fa48("9616") ? event.data.type !== 'NOTIFICATION_RECEIVED' : stryMutAct_9fa48("9615") ? true : (stryCov_9fa48("9615", "9616"), event.data.type === (stryMutAct_9fa48("9617") ? "" : (stryCov_9fa48("9617"), 'NOTIFICATION_RECEIVED')))))) {
              if (stryMutAct_9fa48("9618")) {
                {}
              } else {
                stryCov_9fa48("9618");
                const notification = event.data.notification;
                showNotification(notification);
              }
            }
          }
        };
        navigator.serviceWorker.addEventListener(stryMutAct_9fa48("9619") ? "" : (stryCov_9fa48("9619"), 'message'), handleMessage);
        return () => {
          if (stryMutAct_9fa48("9620")) {
            {}
          } else {
            stryCov_9fa48("9620");
            navigator.serviceWorker.removeEventListener(stryMutAct_9fa48("9621") ? "" : (stryCov_9fa48("9621"), 'message'), handleMessage);
          }
        };
      }
    }, stryMutAct_9fa48("9622") ? [] : (stryCov_9fa48("9622"), [isSupported, showNotification]));

    // Calculate unread count
    const unreadCount = stryMutAct_9fa48("9623") ? notifications.length : (stryCov_9fa48("9623"), notifications.filter(stryMutAct_9fa48("9624") ? () => undefined : (stryCov_9fa48("9624"), n => stryMutAct_9fa48("9625") ? n.read : (stryCov_9fa48("9625"), !n.read))).length);
    return stryMutAct_9fa48("9626") ? {} : (stryCov_9fa48("9626"), {
      notifications,
      unreadCount,
      isSupported,
      permission,
      requestPermission,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll,
      showNotification,
      subscribe,
      unsubscribe
    });
  }
}