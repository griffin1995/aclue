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
import { motion, AnimatePresence } from 'framer-motion';
import { BellIcon, XMarkIcon, CheckIcon, TrashIcon, ExclamationTriangleIcon, InformationCircleIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { formatRelativeTime } from '@/utils/formatting';
interface NotificationCenterProps {
  className?: string;
}
export function NotificationCenter({
  className = stryMutAct_9fa48("4042") ? "Stryker was here!" : (stryCov_9fa48("4042"), '')
}: NotificationCenterProps) {
  if (stryMutAct_9fa48("4043")) {
    {}
  } else {
    stryCov_9fa48("4043");
    const {
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    } = useNotifications();
    const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("4044") ? true : (stryCov_9fa48("4044"), false));
    const [filter, setFilter] = useState<'all' | 'unread'>(stryMutAct_9fa48("4045") ? "" : (stryCov_9fa48("4045"), 'all'));
    const filteredNotifications = stryMutAct_9fa48("4046") ? notifications : (stryCov_9fa48("4046"), notifications.filter(stryMutAct_9fa48("4047") ? () => undefined : (stryCov_9fa48("4047"), notification => stryMutAct_9fa48("4050") ? filter === 'all' && !notification.read : stryMutAct_9fa48("4049") ? false : stryMutAct_9fa48("4048") ? true : (stryCov_9fa48("4048", "4049", "4050"), (stryMutAct_9fa48("4052") ? filter !== 'all' : stryMutAct_9fa48("4051") ? false : (stryCov_9fa48("4051", "4052"), filter === (stryMutAct_9fa48("4053") ? "" : (stryCov_9fa48("4053"), 'all')))) || (stryMutAct_9fa48("4054") ? notification.read : (stryCov_9fa48("4054"), !notification.read))))));
    const getNotificationIcon = (type: Notification['type']) => {
      if (stryMutAct_9fa48("4055")) {
        {}
      } else {
        stryCov_9fa48("4055");
        const iconClass = stryMutAct_9fa48("4056") ? "" : (stryCov_9fa48("4056"), "w-5 h-5");
        switch (type) {
          case stryMutAct_9fa48("4058") ? "" : (stryCov_9fa48("4058"), 'success'):
            if (stryMutAct_9fa48("4057")) {} else {
              stryCov_9fa48("4057");
              return <CheckCircleIcon className={stryMutAct_9fa48("4059") ? `` : (stryCov_9fa48("4059"), `${iconClass} text-green-500`)} />;
            }
          case stryMutAct_9fa48("4061") ? "" : (stryCov_9fa48("4061"), 'error'):
            if (stryMutAct_9fa48("4060")) {} else {
              stryCov_9fa48("4060");
              return <ExclamationTriangleIcon className={stryMutAct_9fa48("4062") ? `` : (stryCov_9fa48("4062"), `${iconClass} text-red-500`)} />;
            }
          case stryMutAct_9fa48("4064") ? "" : (stryCov_9fa48("4064"), 'warning'):
            if (stryMutAct_9fa48("4063")) {} else {
              stryCov_9fa48("4063");
              return <ExclamationTriangleIcon className={stryMutAct_9fa48("4065") ? `` : (stryCov_9fa48("4065"), `${iconClass} text-yellow-500`)} />;
            }
          default:
            if (stryMutAct_9fa48("4066")) {} else {
              stryCov_9fa48("4066");
              return <InformationCircleIcon className={stryMutAct_9fa48("4067") ? `` : (stryCov_9fa48("4067"), `${iconClass} text-blue-500`)} />;
            }
        }
      }
    };
    return <div className={stryMutAct_9fa48("4068") ? `` : (stryCov_9fa48("4068"), `relative ${className}`)}>
      {/* Notification Bell Button */}
      <button onClick={stryMutAct_9fa48("4069") ? () => undefined : (stryCov_9fa48("4069"), () => setIsOpen(stryMutAct_9fa48("4070") ? isOpen : (stryCov_9fa48("4070"), !isOpen)))} className="relative p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors" aria-label={stryMutAct_9fa48("4071") ? `` : (stryCov_9fa48("4071"), `Notifications ${(stryMutAct_9fa48("4075") ? unreadCount <= 0 : stryMutAct_9fa48("4074") ? unreadCount >= 0 : stryMutAct_9fa48("4073") ? false : stryMutAct_9fa48("4072") ? true : (stryCov_9fa48("4072", "4073", "4074", "4075"), unreadCount > 0)) ? stryMutAct_9fa48("4076") ? `` : (stryCov_9fa48("4076"), `(${unreadCount} unread)`) : stryMutAct_9fa48("4077") ? "Stryker was here!" : (stryCov_9fa48("4077"), '')}`)}>
        <BellIcon className="w-6 h-6" />
        {stryMutAct_9fa48("4080") ? unreadCount > 0 || <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span> : stryMutAct_9fa48("4079") ? false : stryMutAct_9fa48("4078") ? true : (stryCov_9fa48("4078", "4079", "4080"), (stryMutAct_9fa48("4083") ? unreadCount <= 0 : stryMutAct_9fa48("4082") ? unreadCount >= 0 : stryMutAct_9fa48("4081") ? true : (stryCov_9fa48("4081", "4082", "4083"), unreadCount > 0)) && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {(stryMutAct_9fa48("4087") ? unreadCount <= 99 : stryMutAct_9fa48("4086") ? unreadCount >= 99 : stryMutAct_9fa48("4085") ? false : stryMutAct_9fa48("4084") ? true : (stryCov_9fa48("4084", "4085", "4086", "4087"), unreadCount > 99)) ? stryMutAct_9fa48("4088") ? "" : (stryCov_9fa48("4088"), '99+') : unreadCount}
          </span>)}
      </button>

      {/* Notification Panel */}
      <AnimatePresence>
        {stryMutAct_9fa48("4091") ? isOpen || <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            
            {/* Panel */}
            <motion.div initial={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }} animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }} exit={{
            opacity: 0,
            scale: 0.95,
            y: -10
          }} transition={{
            duration: 0.2
          }} className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {/* Filter Buttons */}
                  <div className="flex rounded-md overflow-hidden">
                    <button onClick={() => setFilter('all')} className={`px-3 py-1 text-sm ${filter === 'all' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'} transition-colors`}>
                      All
                    </button>
                    <button onClick={() => setFilter('unread')} className={`px-3 py-1 text-sm ${filter === 'unread' ? 'bg-primary-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'} transition-colors`}>
                      Unread
                    </button>
                  </div>
                  
                  {/* Actions */}
                  {notifications.length > 0 && <div className="flex items-center gap-1">
                      {unreadCount > 0 && <button onClick={markAllAsRead} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Mark all as read">
                          <CheckIcon className="w-4 h-4" />
                        </button>}
                      <button onClick={clearAll} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" title="Clear all notifications">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {filteredNotifications.length === 0 ? <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      {filter === 'unread' ? 'No unread notifications' : 'No notifications yet'}
                    </p>
                  </div> : <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map(notification => <motion.div key={notification.id} initial={{
                  opacity: 0,
                  y: 20
                }} animate={{
                  opacity: 1,
                  y: 0
                }} exit={{
                  opacity: 0,
                  y: -20
                }} className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${!notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''}`}>
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {formatRelativeTime(notification.timestamp)}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 ml-2">
                                {!notification.read && <button onClick={() => markAsRead(notification.id)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Mark as read">
                                    <CheckIcon className="w-4 h-4" />
                                  </button>}
                                <button onClick={() => deleteNotification(notification.id)} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete notification">
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Action Button */}
                            {notification.actionUrl && notification.actionLabel && <a href={notification.actionUrl} className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors" onClick={() => markAsRead(notification.id)}>
                                {notification.actionLabel} →
                              </a>}
                          </div>

                          {/* Unread Indicator */}
                          {!notification.read && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />}
                        </div>
                      </motion.div>)}
                  </div>}
              </div>

              {/* Footer */}
              {filteredNotifications.length > 0 && <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <button onClick={() => {
                setIsOpen(false);
                // Navigate to full notifications page
                window.location.href = '/notifications';
              }} className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                    View All Notifications
                  </button>
                </div>}
            </motion.div>
          </> : stryMutAct_9fa48("4090") ? false : stryMutAct_9fa48("4089") ? true : (stryCov_9fa48("4089", "4090", "4091"), isOpen && <>
            {/* Backdrop */}
            <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("4092") ? () => undefined : (stryCov_9fa48("4092"), () => setIsOpen(stryMutAct_9fa48("4093") ? true : (stryCov_9fa48("4093"), false)))} />
            
            {/* Panel */}
            <motion.div initial={stryMutAct_9fa48("4094") ? {} : (stryCov_9fa48("4094"), {
            opacity: 0,
            scale: 0.95,
            y: stryMutAct_9fa48("4095") ? +10 : (stryCov_9fa48("4095"), -10)
          })} animate={stryMutAct_9fa48("4096") ? {} : (stryCov_9fa48("4096"), {
            opacity: 1,
            scale: 1,
            y: 0
          })} exit={stryMutAct_9fa48("4097") ? {} : (stryCov_9fa48("4097"), {
            opacity: 0,
            scale: 0.95,
            y: stryMutAct_9fa48("4098") ? +10 : (stryCov_9fa48("4098"), -10)
          })} transition={stryMutAct_9fa48("4099") ? {} : (stryCov_9fa48("4099"), {
            duration: 0.2
          })} className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-96 flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Notifications
                </h3>
                <div className="flex items-center gap-2">
                  {/* Filter Buttons */}
                  <div className="flex rounded-md overflow-hidden">
                    <button onClick={stryMutAct_9fa48("4100") ? () => undefined : (stryCov_9fa48("4100"), () => setFilter(stryMutAct_9fa48("4101") ? "" : (stryCov_9fa48("4101"), 'all')))} className={stryMutAct_9fa48("4102") ? `` : (stryCov_9fa48("4102"), `px-3 py-1 text-sm ${(stryMutAct_9fa48("4105") ? filter !== 'all' : stryMutAct_9fa48("4104") ? false : stryMutAct_9fa48("4103") ? true : (stryCov_9fa48("4103", "4104", "4105"), filter === (stryMutAct_9fa48("4106") ? "" : (stryCov_9fa48("4106"), 'all')))) ? stryMutAct_9fa48("4107") ? "" : (stryCov_9fa48("4107"), 'bg-primary-500 text-white') : stryMutAct_9fa48("4108") ? "" : (stryCov_9fa48("4108"), 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600')} transition-colors`)}>
                      All
                    </button>
                    <button onClick={stryMutAct_9fa48("4109") ? () => undefined : (stryCov_9fa48("4109"), () => setFilter(stryMutAct_9fa48("4110") ? "" : (stryCov_9fa48("4110"), 'unread')))} className={stryMutAct_9fa48("4111") ? `` : (stryCov_9fa48("4111"), `px-3 py-1 text-sm ${(stryMutAct_9fa48("4114") ? filter !== 'unread' : stryMutAct_9fa48("4113") ? false : stryMutAct_9fa48("4112") ? true : (stryCov_9fa48("4112", "4113", "4114"), filter === (stryMutAct_9fa48("4115") ? "" : (stryCov_9fa48("4115"), 'unread')))) ? stryMutAct_9fa48("4116") ? "" : (stryCov_9fa48("4116"), 'bg-primary-500 text-white') : stryMutAct_9fa48("4117") ? "" : (stryCov_9fa48("4117"), 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600')} transition-colors`)}>
                      Unread
                    </button>
                  </div>
                  
                  {/* Actions */}
                  {stryMutAct_9fa48("4120") ? notifications.length > 0 || <div className="flex items-center gap-1">
                      {unreadCount > 0 && <button onClick={markAllAsRead} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Mark all as read">
                          <CheckIcon className="w-4 h-4" />
                        </button>}
                      <button onClick={clearAll} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" title="Clear all notifications">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div> : stryMutAct_9fa48("4119") ? false : stryMutAct_9fa48("4118") ? true : (stryCov_9fa48("4118", "4119", "4120"), (stryMutAct_9fa48("4123") ? notifications.length <= 0 : stryMutAct_9fa48("4122") ? notifications.length >= 0 : stryMutAct_9fa48("4121") ? true : (stryCov_9fa48("4121", "4122", "4123"), notifications.length > 0)) && <div className="flex items-center gap-1">
                      {stryMutAct_9fa48("4126") ? unreadCount > 0 || <button onClick={markAllAsRead} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Mark all as read">
                          <CheckIcon className="w-4 h-4" />
                        </button> : stryMutAct_9fa48("4125") ? false : stryMutAct_9fa48("4124") ? true : (stryCov_9fa48("4124", "4125", "4126"), (stryMutAct_9fa48("4129") ? unreadCount <= 0 : stryMutAct_9fa48("4128") ? unreadCount >= 0 : stryMutAct_9fa48("4127") ? true : (stryCov_9fa48("4127", "4128", "4129"), unreadCount > 0)) && <button onClick={markAllAsRead} className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors" title="Mark all as read">
                          <CheckIcon className="w-4 h-4" />
                        </button>)}
                      <button onClick={clearAll} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors" title="Clear all notifications">
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>)}
                </div>
              </div>

              {/* Notifications List */}
              <div className="flex-1 overflow-y-auto">
                {(stryMutAct_9fa48("4132") ? filteredNotifications.length !== 0 : stryMutAct_9fa48("4131") ? false : stryMutAct_9fa48("4130") ? true : (stryCov_9fa48("4130", "4131", "4132"), filteredNotifications.length === 0)) ? <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                    <BellIcon className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p className="text-sm">
                      {(stryMutAct_9fa48("4135") ? filter !== 'unread' : stryMutAct_9fa48("4134") ? false : stryMutAct_9fa48("4133") ? true : (stryCov_9fa48("4133", "4134", "4135"), filter === (stryMutAct_9fa48("4136") ? "" : (stryCov_9fa48("4136"), 'unread')))) ? stryMutAct_9fa48("4137") ? "" : (stryCov_9fa48("4137"), 'No unread notifications') : stryMutAct_9fa48("4138") ? "" : (stryCov_9fa48("4138"), 'No notifications yet')}
                    </p>
                  </div> : <div className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredNotifications.map(stryMutAct_9fa48("4139") ? () => undefined : (stryCov_9fa48("4139"), notification => <motion.div key={notification.id} initial={stryMutAct_9fa48("4140") ? {} : (stryCov_9fa48("4140"), {
                  opacity: 0,
                  y: 20
                })} animate={stryMutAct_9fa48("4141") ? {} : (stryCov_9fa48("4141"), {
                  opacity: 1,
                  y: 0
                })} exit={stryMutAct_9fa48("4142") ? {} : (stryCov_9fa48("4142"), {
                  opacity: 0,
                  y: stryMutAct_9fa48("4143") ? +20 : (stryCov_9fa48("4143"), -20)
                })} className={stryMutAct_9fa48("4144") ? `` : (stryCov_9fa48("4144"), `p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${(stryMutAct_9fa48("4145") ? notification.read : (stryCov_9fa48("4145"), !notification.read)) ? stryMutAct_9fa48("4146") ? "" : (stryCov_9fa48("4146"), 'bg-blue-50/50 dark:bg-blue-900/10') : stryMutAct_9fa48("4147") ? "Stryker was here!" : (stryCov_9fa48("4147"), '')}`)}>
                        <div className="flex items-start gap-3">
                          {/* Notification Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                  {notification.title}
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                  {formatRelativeTime(notification.timestamp)}
                                </p>
                              </div>

                              {/* Actions */}
                              <div className="flex items-center gap-1 ml-2">
                                {stryMutAct_9fa48("4150") ? !notification.read || <button onClick={() => markAsRead(notification.id)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Mark as read">
                                    <CheckIcon className="w-4 h-4" />
                                  </button> : stryMutAct_9fa48("4149") ? false : stryMutAct_9fa48("4148") ? true : (stryCov_9fa48("4148", "4149", "4150"), (stryMutAct_9fa48("4151") ? notification.read : (stryCov_9fa48("4151"), !notification.read)) && <button onClick={stryMutAct_9fa48("4152") ? () => undefined : (stryCov_9fa48("4152"), () => markAsRead(notification.id))} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" title="Mark as read">
                                    <CheckIcon className="w-4 h-4" />
                                  </button>)}
                                <button onClick={stryMutAct_9fa48("4153") ? () => undefined : (stryCov_9fa48("4153"), () => deleteNotification(notification.id))} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete notification">
                                  <XMarkIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>

                            {/* Action Button */}
                            {stryMutAct_9fa48("4156") ? notification.actionUrl && notification.actionLabel || <a href={notification.actionUrl} className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors" onClick={() => markAsRead(notification.id)}>
                                {notification.actionLabel} →
                              </a> : stryMutAct_9fa48("4155") ? false : stryMutAct_9fa48("4154") ? true : (stryCov_9fa48("4154", "4155", "4156"), (stryMutAct_9fa48("4158") ? notification.actionUrl || notification.actionLabel : stryMutAct_9fa48("4157") ? true : (stryCov_9fa48("4157", "4158"), notification.actionUrl && notification.actionLabel)) && <a href={notification.actionUrl} className="inline-block mt-2 text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors" onClick={stryMutAct_9fa48("4159") ? () => undefined : (stryCov_9fa48("4159"), () => markAsRead(notification.id))}>
                                {notification.actionLabel} →
                              </a>)}
                          </div>

                          {/* Unread Indicator */}
                          {stryMutAct_9fa48("4162") ? !notification.read || <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" /> : stryMutAct_9fa48("4161") ? false : stryMutAct_9fa48("4160") ? true : (stryCov_9fa48("4160", "4161", "4162"), (stryMutAct_9fa48("4163") ? notification.read : (stryCov_9fa48("4163"), !notification.read)) && <div className="w-2 h-2 bg-primary-500 rounded-full flex-shrink-0 mt-2" />)}
                        </div>
                      </motion.div>))}
                  </div>}
              </div>

              {/* Footer */}
              {stryMutAct_9fa48("4166") ? filteredNotifications.length > 0 || <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <button onClick={() => {
                setIsOpen(false);
                // Navigate to full notifications page
                window.location.href = '/notifications';
              }} className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                    View All Notifications
                  </button>
                </div> : stryMutAct_9fa48("4165") ? false : stryMutAct_9fa48("4164") ? true : (stryCov_9fa48("4164", "4165", "4166"), (stryMutAct_9fa48("4169") ? filteredNotifications.length <= 0 : stryMutAct_9fa48("4168") ? filteredNotifications.length >= 0 : stryMutAct_9fa48("4167") ? true : (stryCov_9fa48("4167", "4168", "4169"), filteredNotifications.length > 0)) && <div className="border-t border-gray-200 dark:border-gray-700 p-3">
                  <button onClick={() => {
                if (stryMutAct_9fa48("4170")) {
                  {}
                } else {
                  stryCov_9fa48("4170");
                  setIsOpen(stryMutAct_9fa48("4171") ? true : (stryCov_9fa48("4171"), false));
                  // Navigate to full notifications page
                  window.location.href = stryMutAct_9fa48("4172") ? "" : (stryCov_9fa48("4172"), '/notifications');
                }
              }} className="w-full text-sm text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors">
                    View All Notifications
                  </button>
                </div>)}
            </motion.div>
          </>)}
      </AnimatePresence>
    </div>;
  }
}