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
import { motion } from 'framer-motion';
import { BellIcon, DevicePhoneMobileIcon, ComputerDesktopIcon, EnvelopeIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useNotifications } from '@/hooks/useNotifications';
interface NotificationSettingsProps {
  className?: string;
}
interface NotificationPreference {
  id: string;
  label: string;
  description: string;
  channels: {
    push: boolean;
    email: boolean;
    browser: boolean;
  };
}
export function NotificationSettings({
  className = stryMutAct_9fa48("4173") ? "Stryker was here!" : (stryCov_9fa48("4173"), '')
}: NotificationSettingsProps) {
  if (stryMutAct_9fa48("4174")) {
    {}
  } else {
    stryCov_9fa48("4174");
    const {
      isSupported,
      permission,
      requestPermission,
      subscribe,
      unsubscribe,
      showNotification
    } = useNotifications();
    const [preferences, setPreferences] = useState<NotificationPreference[]>(stryMutAct_9fa48("4175") ? [] : (stryCov_9fa48("4175"), [stryMutAct_9fa48("4176") ? {} : (stryCov_9fa48("4176"), {
      id: stryMutAct_9fa48("4177") ? "" : (stryCov_9fa48("4177"), 'recommendations'),
      label: stryMutAct_9fa48("4178") ? "" : (stryCov_9fa48("4178"), 'New Recommendations'),
      description: stryMutAct_9fa48("4179") ? "" : (stryCov_9fa48("4179"), 'Get notified when new gift recommendations are available'),
      channels: stryMutAct_9fa48("4180") ? {} : (stryCov_9fa48("4180"), {
        push: stryMutAct_9fa48("4181") ? false : (stryCov_9fa48("4181"), true),
        email: stryMutAct_9fa48("4182") ? false : (stryCov_9fa48("4182"), true),
        browser: stryMutAct_9fa48("4183") ? false : (stryCov_9fa48("4183"), true)
      })
    }), stryMutAct_9fa48("4184") ? {} : (stryCov_9fa48("4184"), {
      id: stryMutAct_9fa48("4185") ? "" : (stryCov_9fa48("4185"), 'gift_links'),
      label: stryMutAct_9fa48("4186") ? "" : (stryCov_9fa48("4186"), 'Gift Link Activity'),
      description: stryMutAct_9fa48("4187") ? "" : (stryCov_9fa48("4187"), 'Updates when someone views or purchases from your gift links'),
      channels: stryMutAct_9fa48("4188") ? {} : (stryCov_9fa48("4188"), {
        push: stryMutAct_9fa48("4189") ? false : (stryCov_9fa48("4189"), true),
        email: stryMutAct_9fa48("4190") ? true : (stryCov_9fa48("4190"), false),
        browser: stryMutAct_9fa48("4191") ? false : (stryCov_9fa48("4191"), true)
      })
    }), stryMutAct_9fa48("4192") ? {} : (stryCov_9fa48("4192"), {
      id: stryMutAct_9fa48("4193") ? "" : (stryCov_9fa48("4193"), 'swipe_sessions'),
      label: stryMutAct_9fa48("4194") ? "" : (stryCov_9fa48("4194"), 'Swipe Reminders'),
      description: stryMutAct_9fa48("4195") ? "" : (stryCov_9fa48("4195"), 'Reminders to continue your preference discovery sessions'),
      channels: stryMutAct_9fa48("4196") ? {} : (stryCov_9fa48("4196"), {
        push: stryMutAct_9fa48("4197") ? true : (stryCov_9fa48("4197"), false),
        email: stryMutAct_9fa48("4198") ? false : (stryCov_9fa48("4198"), true),
        browser: stryMutAct_9fa48("4199") ? true : (stryCov_9fa48("4199"), false)
      })
    }), stryMutAct_9fa48("4200") ? {} : (stryCov_9fa48("4200"), {
      id: stryMutAct_9fa48("4201") ? "" : (stryCov_9fa48("4201"), 'account'),
      label: stryMutAct_9fa48("4202") ? "" : (stryCov_9fa48("4202"), 'Account Updates'),
      description: stryMutAct_9fa48("4203") ? "" : (stryCov_9fa48("4203"), 'Important account and security notifications'),
      channels: stryMutAct_9fa48("4204") ? {} : (stryCov_9fa48("4204"), {
        push: stryMutAct_9fa48("4205") ? false : (stryCov_9fa48("4205"), true),
        email: stryMutAct_9fa48("4206") ? false : (stryCov_9fa48("4206"), true),
        browser: stryMutAct_9fa48("4207") ? false : (stryCov_9fa48("4207"), true)
      })
    }), stryMutAct_9fa48("4208") ? {} : (stryCov_9fa48("4208"), {
      id: stryMutAct_9fa48("4209") ? "" : (stryCov_9fa48("4209"), 'product_updates'),
      label: stryMutAct_9fa48("4210") ? "" : (stryCov_9fa48("4210"), 'Product Updates'),
      description: stryMutAct_9fa48("4211") ? "" : (stryCov_9fa48("4211"), 'New features and platform improvements'),
      channels: stryMutAct_9fa48("4212") ? {} : (stryCov_9fa48("4212"), {
        push: stryMutAct_9fa48("4213") ? true : (stryCov_9fa48("4213"), false),
        email: stryMutAct_9fa48("4214") ? false : (stryCov_9fa48("4214"), true),
        browser: stryMutAct_9fa48("4215") ? true : (stryCov_9fa48("4215"), false)
      })
    }), stryMutAct_9fa48("4216") ? {} : (stryCov_9fa48("4216"), {
      id: stryMutAct_9fa48("4217") ? "" : (stryCov_9fa48("4217"), 'promotions'),
      label: stryMutAct_9fa48("4218") ? "" : (stryCov_9fa48("4218"), 'Promotions & Offers'),
      description: stryMutAct_9fa48("4219") ? "" : (stryCov_9fa48("4219"), 'Special deals and promotional content'),
      channels: stryMutAct_9fa48("4220") ? {} : (stryCov_9fa48("4220"), {
        push: stryMutAct_9fa48("4221") ? true : (stryCov_9fa48("4221"), false),
        email: stryMutAct_9fa48("4222") ? true : (stryCov_9fa48("4222"), false),
        browser: stryMutAct_9fa48("4223") ? true : (stryCov_9fa48("4223"), false)
      })
    })]));
    const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("4224") ? true : (stryCov_9fa48("4224"), false));
    const handlePermissionRequest = async () => {
      if (stryMutAct_9fa48("4225")) {
        {}
      } else {
        stryCov_9fa48("4225");
        if (stryMutAct_9fa48("4228") ? false : stryMutAct_9fa48("4227") ? true : stryMutAct_9fa48("4226") ? isSupported : (stryCov_9fa48("4226", "4227", "4228"), !isSupported)) {
          if (stryMutAct_9fa48("4229")) {
            {}
          } else {
            stryCov_9fa48("4229");
            showNotification(stryMutAct_9fa48("4230") ? {} : (stryCov_9fa48("4230"), {
              type: stryMutAct_9fa48("4231") ? "" : (stryCov_9fa48("4231"), 'error'),
              title: stryMutAct_9fa48("4232") ? "" : (stryCov_9fa48("4232"), 'Not Supported'),
              message: stryMutAct_9fa48("4233") ? "" : (stryCov_9fa48("4233"), 'Push notifications are not supported in this browser.')
            }));
            return;
          }
        }
        setIsLoading(stryMutAct_9fa48("4234") ? false : (stryCov_9fa48("4234"), true));
        try {
          if (stryMutAct_9fa48("4235")) {
            {}
          } else {
            stryCov_9fa48("4235");
            const result = await requestPermission();
            if (stryMutAct_9fa48("4238") ? result !== 'granted' : stryMutAct_9fa48("4237") ? false : stryMutAct_9fa48("4236") ? true : (stryCov_9fa48("4236", "4237", "4238"), result === (stryMutAct_9fa48("4239") ? "" : (stryCov_9fa48("4239"), 'granted')))) {
              if (stryMutAct_9fa48("4240")) {
                {}
              } else {
                stryCov_9fa48("4240");
                await subscribe();
                showNotification(stryMutAct_9fa48("4241") ? {} : (stryCov_9fa48("4241"), {
                  type: stryMutAct_9fa48("4242") ? "" : (stryCov_9fa48("4242"), 'success'),
                  title: stryMutAct_9fa48("4243") ? "" : (stryCov_9fa48("4243"), 'Notifications Enabled'),
                  message: stryMutAct_9fa48("4244") ? "" : (stryCov_9fa48("4244"), 'You will now receive push notifications.')
                }));
              }
            } else {
              if (stryMutAct_9fa48("4245")) {
                {}
              } else {
                stryCov_9fa48("4245");
                showNotification(stryMutAct_9fa48("4246") ? {} : (stryCov_9fa48("4246"), {
                  type: stryMutAct_9fa48("4247") ? "" : (stryCov_9fa48("4247"), 'warning'),
                  title: stryMutAct_9fa48("4248") ? "" : (stryCov_9fa48("4248"), 'Permission Denied'),
                  message: stryMutAct_9fa48("4249") ? "" : (stryCov_9fa48("4249"), 'Please enable notifications in your browser settings.')
                }));
              }
            }
          }
        } catch (error) {
          if (stryMutAct_9fa48("4250")) {
            {}
          } else {
            stryCov_9fa48("4250");
            showNotification(stryMutAct_9fa48("4251") ? {} : (stryCov_9fa48("4251"), {
              type: stryMutAct_9fa48("4252") ? "" : (stryCov_9fa48("4252"), 'error'),
              title: stryMutAct_9fa48("4253") ? "" : (stryCov_9fa48("4253"), 'Setup Failed'),
              message: stryMutAct_9fa48("4254") ? "" : (stryCov_9fa48("4254"), 'Failed to set up notifications. Please try again.')
            }));
          }
        } finally {
          if (stryMutAct_9fa48("4255")) {
            {}
          } else {
            stryCov_9fa48("4255");
            setIsLoading(stryMutAct_9fa48("4256") ? true : (stryCov_9fa48("4256"), false));
          }
        }
      }
    };
    const handleUnsubscribe = async () => {
      if (stryMutAct_9fa48("4257")) {
        {}
      } else {
        stryCov_9fa48("4257");
        setIsLoading(stryMutAct_9fa48("4258") ? false : (stryCov_9fa48("4258"), true));
        try {
          if (stryMutAct_9fa48("4259")) {
            {}
          } else {
            stryCov_9fa48("4259");
            await unsubscribe();
          }
        } catch (error) {
          if (stryMutAct_9fa48("4260")) {
            {}
          } else {
            stryCov_9fa48("4260");
            showNotification(stryMutAct_9fa48("4261") ? {} : (stryCov_9fa48("4261"), {
              type: stryMutAct_9fa48("4262") ? "" : (stryCov_9fa48("4262"), 'error'),
              title: stryMutAct_9fa48("4263") ? "" : (stryCov_9fa48("4263"), 'Error'),
              message: stryMutAct_9fa48("4264") ? "" : (stryCov_9fa48("4264"), 'Failed to disable notifications.')
            }));
          }
        } finally {
          if (stryMutAct_9fa48("4265")) {
            {}
          } else {
            stryCov_9fa48("4265");
            setIsLoading(stryMutAct_9fa48("4266") ? true : (stryCov_9fa48("4266"), false));
          }
        }
      }
    };
    const updatePreference = (preferenceId: string, channel: keyof NotificationPreference['channels'], enabled: boolean) => {
      if (stryMutAct_9fa48("4267")) {
        {}
      } else {
        stryCov_9fa48("4267");
        setPreferences(stryMutAct_9fa48("4268") ? () => undefined : (stryCov_9fa48("4268"), prev => prev.map(stryMutAct_9fa48("4269") ? () => undefined : (stryCov_9fa48("4269"), pref => (stryMutAct_9fa48("4272") ? pref.id !== preferenceId : stryMutAct_9fa48("4271") ? false : stryMutAct_9fa48("4270") ? true : (stryCov_9fa48("4270", "4271", "4272"), pref.id === preferenceId)) ? stryMutAct_9fa48("4273") ? {} : (stryCov_9fa48("4273"), {
          ...pref,
          channels: stryMutAct_9fa48("4274") ? {} : (stryCov_9fa48("4274"), {
            ...pref.channels,
            [channel]: enabled
          })
        }) : pref))));
      }
    };
    const testNotification = () => {
      if (stryMutAct_9fa48("4275")) {
        {}
      } else {
        stryCov_9fa48("4275");
        showNotification(stryMutAct_9fa48("4276") ? {} : (stryCov_9fa48("4276"), {
          type: stryMutAct_9fa48("4277") ? "" : (stryCov_9fa48("4277"), 'info'),
          title: stryMutAct_9fa48("4278") ? "" : (stryCov_9fa48("4278"), 'Test Notification'),
          message: stryMutAct_9fa48("4279") ? "" : (stryCov_9fa48("4279"), 'This is a test notification to verify your settings.')
        }));
      }
    };
    return <div className={stryMutAct_9fa48("4280") ? `` : (stryCov_9fa48("4280"), `bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 ${className}`)}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <BellIcon className="w-6 h-6 text-primary-600" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Notification Settings
          </h2>
        </div>

        {/* Browser Notification Setup */}
        <div className="mb-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
            Browser Notifications
          </h3>
          
          {(stryMutAct_9fa48("4281") ? isSupported : (stryCov_9fa48("4281"), !isSupported)) ? <div className="flex items-center gap-3 text-gray-600 dark:text-gray-300">
              <XMarkIcon className="w-5 h-5 text-red-500" />
              <span>Push notifications are not supported in this browser.</span>
            </div> : <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    Status: <span className="font-medium">{permission}</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Allow browser notifications to stay updated in real-time
                  </p>
                </div>
                
                <div className="flex items-center gap-2">
                  {(stryMutAct_9fa48("4284") ? permission !== 'granted' : stryMutAct_9fa48("4283") ? false : stryMutAct_9fa48("4282") ? true : (stryCov_9fa48("4282", "4283", "4284"), permission === (stryMutAct_9fa48("4285") ? "" : (stryCov_9fa48("4285"), 'granted')))) ? <button onClick={handleUnsubscribe} disabled={isLoading} className="px-4 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg transition-colors disabled:opacity-50">
                      {isLoading ? stryMutAct_9fa48("4286") ? "" : (stryCov_9fa48("4286"), 'Disabling...') : stryMutAct_9fa48("4287") ? "" : (stryCov_9fa48("4287"), 'Disable')}
                    </button> : <button onClick={handlePermissionRequest} disabled={isLoading} className="px-4 py-2 text-sm bg-primary-100 text-primary-700 hover:bg-primary-200 dark:bg-primary-900/30 dark:text-primary-300 dark:hover:bg-primary-900/50 rounded-lg transition-colors disabled:opacity-50">
                      {isLoading ? stryMutAct_9fa48("4288") ? "" : (stryCov_9fa48("4288"), 'Enabling...') : stryMutAct_9fa48("4289") ? "" : (stryCov_9fa48("4289"), 'Enable')}
                    </button>}
                  
                  <button onClick={testNotification} className="px-4 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500 rounded-lg transition-colors">
                    Test
                  </button>
                </div>
              </div>
            </div>}
        </div>

        {/* Notification Preferences */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
            Notification Preferences
          </h3>
          
          <div className="space-y-1">
            {/* Header */}
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-gray-200 dark:border-gray-600">
              <div className="col-span-6">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Notification Type
                </span>
              </div>
              <div className="col-span-2 text-center">
                <DevicePhoneMobileIcon className="w-5 h-5 mx-auto text-gray-500" title="Push Notifications" />
              </div>
              <div className="col-span-2 text-center">
                <EnvelopeIcon className="w-5 h-5 mx-auto text-gray-500" title="Email Notifications" />
              </div>
              <div className="col-span-2 text-center">
                <ComputerDesktopIcon className="w-5 h-5 mx-auto text-gray-500" title="Browser Notifications" />
              </div>
            </div>

            {/* Preference Rows */}
            {preferences.map(stryMutAct_9fa48("4290") ? () => undefined : (stryCov_9fa48("4290"), preference => <motion.div key={preference.id} initial={stryMutAct_9fa48("4291") ? {} : (stryCov_9fa48("4291"), {
              opacity: 0,
              y: 10
            })} animate={stryMutAct_9fa48("4292") ? {} : (stryCov_9fa48("4292"), {
              opacity: 1,
              y: 0
            })} className="grid grid-cols-12 gap-4 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 rounded-lg transition-colors">
                <div className="col-span-6">
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                    {preference.label}
                  </h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {preference.description}
                  </p>
                </div>
                
                {/* Push Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button onClick={stryMutAct_9fa48("4293") ? () => undefined : (stryCov_9fa48("4293"), () => updatePreference(preference.id, stryMutAct_9fa48("4294") ? "" : (stryCov_9fa48("4294"), 'push'), stryMutAct_9fa48("4295") ? preference.channels.push : (stryCov_9fa48("4295"), !preference.channels.push)))} className={stryMutAct_9fa48("4296") ? `` : (stryCov_9fa48("4296"), `w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${preference.channels.push ? stryMutAct_9fa48("4297") ? "" : (stryCov_9fa48("4297"), 'bg-primary-500 border-primary-500 text-white') : stryMutAct_9fa48("4298") ? "" : (stryCov_9fa48("4298"), 'border-gray-300 dark:border-gray-600 hover:border-primary-500')}`)}>
                    {stryMutAct_9fa48("4301") ? preference.channels.push || <CheckIcon className="w-4 h-4" /> : stryMutAct_9fa48("4300") ? false : stryMutAct_9fa48("4299") ? true : (stryCov_9fa48("4299", "4300", "4301"), preference.channels.push && <CheckIcon className="w-4 h-4" />)}
                  </button>
                </div>
                
                {/* Email Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button onClick={stryMutAct_9fa48("4302") ? () => undefined : (stryCov_9fa48("4302"), () => updatePreference(preference.id, stryMutAct_9fa48("4303") ? "" : (stryCov_9fa48("4303"), 'email'), stryMutAct_9fa48("4304") ? preference.channels.email : (stryCov_9fa48("4304"), !preference.channels.email)))} className={stryMutAct_9fa48("4305") ? `` : (stryCov_9fa48("4305"), `w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${preference.channels.email ? stryMutAct_9fa48("4306") ? "" : (stryCov_9fa48("4306"), 'bg-primary-500 border-primary-500 text-white') : stryMutAct_9fa48("4307") ? "" : (stryCov_9fa48("4307"), 'border-gray-300 dark:border-gray-600 hover:border-primary-500')}`)}>
                    {stryMutAct_9fa48("4310") ? preference.channels.email || <CheckIcon className="w-4 h-4" /> : stryMutAct_9fa48("4309") ? false : stryMutAct_9fa48("4308") ? true : (stryCov_9fa48("4308", "4309", "4310"), preference.channels.email && <CheckIcon className="w-4 h-4" />)}
                  </button>
                </div>
                
                {/* Browser Toggle */}
                <div className="col-span-2 flex justify-center">
                  <button onClick={stryMutAct_9fa48("4311") ? () => undefined : (stryCov_9fa48("4311"), () => updatePreference(preference.id, stryMutAct_9fa48("4312") ? "" : (stryCov_9fa48("4312"), 'browser'), stryMutAct_9fa48("4313") ? preference.channels.browser : (stryCov_9fa48("4313"), !preference.channels.browser)))} className={stryMutAct_9fa48("4314") ? `` : (stryCov_9fa48("4314"), `w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${preference.channels.browser ? stryMutAct_9fa48("4315") ? "" : (stryCov_9fa48("4315"), 'bg-primary-500 border-primary-500 text-white') : stryMutAct_9fa48("4316") ? "" : (stryCov_9fa48("4316"), 'border-gray-300 dark:border-gray-600 hover:border-primary-500')}`)}>
                    {stryMutAct_9fa48("4319") ? preference.channels.browser || <CheckIcon className="w-4 h-4" /> : stryMutAct_9fa48("4318") ? false : stryMutAct_9fa48("4317") ? true : (stryCov_9fa48("4317", "4318", "4319"), preference.channels.browser && <CheckIcon className="w-4 h-4" />)}
                  </button>
                </div>
              </motion.div>))}
          </div>
        </div>

        {/* Save Button */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <div className="flex justify-end">
            <button onClick={() => {
              if (stryMutAct_9fa48("4320")) {
                {}
              } else {
                stryCov_9fa48("4320");
                // Save preferences to backend
                showNotification(stryMutAct_9fa48("4321") ? {} : (stryCov_9fa48("4321"), {
                  type: stryMutAct_9fa48("4322") ? "" : (stryCov_9fa48("4322"), 'success'),
                  title: stryMutAct_9fa48("4323") ? "" : (stryCov_9fa48("4323"), 'Settings Saved'),
                  message: stryMutAct_9fa48("4324") ? "" : (stryCov_9fa48("4324"), 'Your notification preferences have been updated.')
                }));
              }
            }} className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
              Save Preferences
            </button>
          </div>
        </div>
      </div>
    </div>;
  }
}