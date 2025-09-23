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
import Head from 'next/head';
import { motion } from 'framer-motion';
import { BellIcon, FunnelIcon, TrashIcon, CheckIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';
import { formatRelativeTime } from '@/utils/formatting';
export default function NotificationsPage() {
  if (stryMutAct_9fa48("14056")) {
    {}
  } else {
    stryCov_9fa48("14056");
    const {
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      deleteNotification,
      clearAll
    } = useNotifications();
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>(stryMutAct_9fa48("14057") ? "" : (stryCov_9fa48("14057"), 'all'));
    const [typeFilter, setTypeFilter] = useState<'all' | Notification['type']>(stryMutAct_9fa48("14058") ? "" : (stryCov_9fa48("14058"), 'all'));
    const [searchQuery, setSearchQuery] = useState(stryMutAct_9fa48("14059") ? "Stryker was here!" : (stryCov_9fa48("14059"), ''));
    const [showSettings, setShowSettings] = useState(stryMutAct_9fa48("14060") ? true : (stryCov_9fa48("14060"), false));

    // Filter notifications
    const filteredNotifications = stryMutAct_9fa48("14061") ? notifications : (stryCov_9fa48("14061"), notifications.filter(notification => {
      if (stryMutAct_9fa48("14062")) {
        {}
      } else {
        stryCov_9fa48("14062");
        // Read status filter
        if (stryMutAct_9fa48("14065") ? filter === 'unread' || notification.read : stryMutAct_9fa48("14064") ? false : stryMutAct_9fa48("14063") ? true : (stryCov_9fa48("14063", "14064", "14065"), (stryMutAct_9fa48("14067") ? filter !== 'unread' : stryMutAct_9fa48("14066") ? true : (stryCov_9fa48("14066", "14067"), filter === (stryMutAct_9fa48("14068") ? "" : (stryCov_9fa48("14068"), 'unread')))) && notification.read)) return stryMutAct_9fa48("14069") ? true : (stryCov_9fa48("14069"), false);
        if (stryMutAct_9fa48("14072") ? filter === 'read' || !notification.read : stryMutAct_9fa48("14071") ? false : stryMutAct_9fa48("14070") ? true : (stryCov_9fa48("14070", "14071", "14072"), (stryMutAct_9fa48("14074") ? filter !== 'read' : stryMutAct_9fa48("14073") ? true : (stryCov_9fa48("14073", "14074"), filter === (stryMutAct_9fa48("14075") ? "" : (stryCov_9fa48("14075"), 'read')))) && (stryMutAct_9fa48("14076") ? notification.read : (stryCov_9fa48("14076"), !notification.read)))) return stryMutAct_9fa48("14077") ? true : (stryCov_9fa48("14077"), false);

        // Type filter
        if (stryMutAct_9fa48("14080") ? typeFilter !== 'all' || notification.type !== typeFilter : stryMutAct_9fa48("14079") ? false : stryMutAct_9fa48("14078") ? true : (stryCov_9fa48("14078", "14079", "14080"), (stryMutAct_9fa48("14082") ? typeFilter === 'all' : stryMutAct_9fa48("14081") ? true : (stryCov_9fa48("14081", "14082"), typeFilter !== (stryMutAct_9fa48("14083") ? "" : (stryCov_9fa48("14083"), 'all')))) && (stryMutAct_9fa48("14085") ? notification.type === typeFilter : stryMutAct_9fa48("14084") ? true : (stryCov_9fa48("14084", "14085"), notification.type !== typeFilter)))) return stryMutAct_9fa48("14086") ? true : (stryCov_9fa48("14086"), false);

        // Search filter
        if (stryMutAct_9fa48("14088") ? false : stryMutAct_9fa48("14087") ? true : (stryCov_9fa48("14087", "14088"), searchQuery)) {
          if (stryMutAct_9fa48("14089")) {
            {}
          } else {
            stryCov_9fa48("14089");
            const query = stryMutAct_9fa48("14090") ? searchQuery.toUpperCase() : (stryCov_9fa48("14090"), searchQuery.toLowerCase());
            return stryMutAct_9fa48("14093") ? notification.title.toLowerCase().includes(query) && notification.message.toLowerCase().includes(query) : stryMutAct_9fa48("14092") ? false : stryMutAct_9fa48("14091") ? true : (stryCov_9fa48("14091", "14092", "14093"), (stryMutAct_9fa48("14094") ? notification.title.toUpperCase().includes(query) : (stryCov_9fa48("14094"), notification.title.toLowerCase().includes(query))) || (stryMutAct_9fa48("14095") ? notification.message.toUpperCase().includes(query) : (stryCov_9fa48("14095"), notification.message.toLowerCase().includes(query))));
          }
        }
        return stryMutAct_9fa48("14096") ? false : (stryCov_9fa48("14096"), true);
      }
    }));
    const getNotificationTypeIcon = (type: Notification['type']) => {
      if (stryMutAct_9fa48("14097")) {
        {}
      } else {
        stryCov_9fa48("14097");
        const iconClass = stryMutAct_9fa48("14098") ? "" : (stryCov_9fa48("14098"), "w-5 h-5");
        switch (type) {
          case stryMutAct_9fa48("14100") ? "" : (stryCov_9fa48("14100"), 'success'):
            if (stryMutAct_9fa48("14099")) {} else {
              stryCov_9fa48("14099");
              return <CheckIcon className={stryMutAct_9fa48("14101") ? `` : (stryCov_9fa48("14101"), `${iconClass} text-green-500`)} />;
            }
          case stryMutAct_9fa48("14103") ? "" : (stryCov_9fa48("14103"), 'error'):
            if (stryMutAct_9fa48("14102")) {} else {
              stryCov_9fa48("14102");
              return <BellIcon className={stryMutAct_9fa48("14104") ? `` : (stryCov_9fa48("14104"), `${iconClass} text-red-500`)} />;
            }
          case stryMutAct_9fa48("14106") ? "" : (stryCov_9fa48("14106"), 'warning'):
            if (stryMutAct_9fa48("14105")) {} else {
              stryCov_9fa48("14105");
              return <BellIcon className={stryMutAct_9fa48("14107") ? `` : (stryCov_9fa48("14107"), `${iconClass} text-yellow-500`)} />;
            }
          default:
            if (stryMutAct_9fa48("14108")) {} else {
              stryCov_9fa48("14108");
              return <BellIcon className={stryMutAct_9fa48("14109") ? `` : (stryCov_9fa48("14109"), `${iconClass} text-blue-500`)} />;
            }
        }
      }
    };
    const getNotificationTypeColor = (type: Notification['type']) => {
      if (stryMutAct_9fa48("14110")) {
        {}
      } else {
        stryCov_9fa48("14110");
        switch (type) {
          case stryMutAct_9fa48("14112") ? "" : (stryCov_9fa48("14112"), 'success'):
            if (stryMutAct_9fa48("14111")) {} else {
              stryCov_9fa48("14111");
              return stryMutAct_9fa48("14113") ? "" : (stryCov_9fa48("14113"), 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300');
            }
          case stryMutAct_9fa48("14115") ? "" : (stryCov_9fa48("14115"), 'error'):
            if (stryMutAct_9fa48("14114")) {} else {
              stryCov_9fa48("14114");
              return stryMutAct_9fa48("14116") ? "" : (stryCov_9fa48("14116"), 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300');
            }
          case stryMutAct_9fa48("14118") ? "" : (stryCov_9fa48("14118"), 'warning'):
            if (stryMutAct_9fa48("14117")) {} else {
              stryCov_9fa48("14117");
              return stryMutAct_9fa48("14119") ? "" : (stryCov_9fa48("14119"), 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300');
            }
          default:
            if (stryMutAct_9fa48("14120")) {} else {
              stryCov_9fa48("14120");
              return stryMutAct_9fa48("14121") ? "" : (stryCov_9fa48("14121"), 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300');
            }
        }
      }
    };
    return <>
      <Head>
        <title>Notifications - aclue</title>
        <meta name="description" content="Manage your notifications and stay updated with aclue" />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Notifications
                </h1>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  Stay updated with your gift recommendations and activity
                  {stryMutAct_9fa48("14124") ? unreadCount > 0 || <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {unreadCount} unread
                    </span> : stryMutAct_9fa48("14123") ? false : stryMutAct_9fa48("14122") ? true : (stryCov_9fa48("14122", "14123", "14124"), (stryMutAct_9fa48("14127") ? unreadCount <= 0 : stryMutAct_9fa48("14126") ? unreadCount >= 0 : stryMutAct_9fa48("14125") ? true : (stryCov_9fa48("14125", "14126", "14127"), unreadCount > 0)) && <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                      {unreadCount} unread
                    </span>)}
                </p>
              </div>
              
              <button onClick={stryMutAct_9fa48("14128") ? () => undefined : (stryCov_9fa48("14128"), () => setShowSettings(stryMutAct_9fa48("14129") ? showSettings : (stryCov_9fa48("14129"), !showSettings)))} className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
                <BellIcon className="w-5 h-5 mr-2" />
                Settings
              </button>
            </div>
          </div>

          {/* Settings Panel */}
          {stryMutAct_9fa48("14132") ? showSettings || <motion.div initial={{
            opacity: 0,
            height: 0
          }} animate={{
            opacity: 1,
            height: 'auto'
          }} exit={{
            opacity: 0,
            height: 0
          }} className="mb-8">
              <NotificationSettings />
            </motion.div> : stryMutAct_9fa48("14131") ? false : stryMutAct_9fa48("14130") ? true : (stryCov_9fa48("14130", "14131", "14132"), showSettings && <motion.div initial={stryMutAct_9fa48("14133") ? {} : (stryCov_9fa48("14133"), {
            opacity: 0,
            height: 0
          })} animate={stryMutAct_9fa48("14134") ? {} : (stryCov_9fa48("14134"), {
            opacity: 1,
            height: stryMutAct_9fa48("14135") ? "" : (stryCov_9fa48("14135"), 'auto')
          })} exit={stryMutAct_9fa48("14136") ? {} : (stryCov_9fa48("14136"), {
            opacity: 0,
            height: 0
          })} className="mb-8">
              <NotificationSettings />
            </motion.div>)}

          {/* Filters and Actions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input type="text" placeholder="Search notifications..." value={searchQuery} onChange={stryMutAct_9fa48("14137") ? () => undefined : (stryCov_9fa48("14137"), e => setSearchQuery(e.target.value))} className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center gap-4">
                {/* Read Status Filter */}
                <select value={filter} onChange={stryMutAct_9fa48("14138") ? () => undefined : (stryCov_9fa48("14138"), e => setFilter(e.target.value as any))} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>

                {/* Type Filter */}
                <select value={typeFilter} onChange={stryMutAct_9fa48("14139") ? () => undefined : (stryCov_9fa48("14139"), e => setTypeFilter(e.target.value as any))} className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="all">All Types</option>
                  <option value="info">Info</option>
                  <option value="success">Success</option>
                  <option value="warning">Warning</option>
                  <option value="error">Error</option>
                </select>

                {/* Actions */}
                {stryMutAct_9fa48("14142") ? notifications.length > 0 || <div className="flex items-center gap-2">
                    {unreadCount > 0 && <button onClick={markAllAsRead} className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 rounded-lg transition-colors">
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Mark All Read
                      </button>}
                    <button onClick={clearAll} className="inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Clear All
                    </button>
                  </div> : stryMutAct_9fa48("14141") ? false : stryMutAct_9fa48("14140") ? true : (stryCov_9fa48("14140", "14141", "14142"), (stryMutAct_9fa48("14145") ? notifications.length <= 0 : stryMutAct_9fa48("14144") ? notifications.length >= 0 : stryMutAct_9fa48("14143") ? true : (stryCov_9fa48("14143", "14144", "14145"), notifications.length > 0)) && <div className="flex items-center gap-2">
                    {stryMutAct_9fa48("14148") ? unreadCount > 0 || <button onClick={markAllAsRead} className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 rounded-lg transition-colors">
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Mark All Read
                      </button> : stryMutAct_9fa48("14147") ? false : stryMutAct_9fa48("14146") ? true : (stryCov_9fa48("14146", "14147", "14148"), (stryMutAct_9fa48("14151") ? unreadCount <= 0 : stryMutAct_9fa48("14150") ? unreadCount >= 0 : stryMutAct_9fa48("14149") ? true : (stryCov_9fa48("14149", "14150", "14151"), unreadCount > 0)) && <button onClick={markAllAsRead} className="inline-flex items-center px-3 py-2 text-sm bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-300 dark:hover:bg-green-900/50 rounded-lg transition-colors">
                        <CheckIcon className="w-4 h-4 mr-1" />
                        Mark All Read
                      </button>)}
                    <button onClick={clearAll} className="inline-flex items-center px-3 py-2 text-sm bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg transition-colors">
                      <TrashIcon className="w-4 h-4 mr-1" />
                      Clear All
                    </button>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Notifications List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {(stryMutAct_9fa48("14154") ? filteredNotifications.length !== 0 : stryMutAct_9fa48("14153") ? false : stryMutAct_9fa48("14152") ? true : (stryCov_9fa48("14152", "14153", "14154"), filteredNotifications.length === 0)) ? <div className="p-12 text-center">
                <BellIcon className="w-16 h-16 mx-auto text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No notifications found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {(stryMutAct_9fa48("14157") ? (searchQuery || filter !== 'all') && typeFilter !== 'all' : stryMutAct_9fa48("14156") ? false : stryMutAct_9fa48("14155") ? true : (stryCov_9fa48("14155", "14156", "14157"), (stryMutAct_9fa48("14159") ? searchQuery && filter !== 'all' : stryMutAct_9fa48("14158") ? false : (stryCov_9fa48("14158", "14159"), searchQuery || (stryMutAct_9fa48("14161") ? filter === 'all' : stryMutAct_9fa48("14160") ? false : (stryCov_9fa48("14160", "14161"), filter !== (stryMutAct_9fa48("14162") ? "" : (stryCov_9fa48("14162"), 'all')))))) || (stryMutAct_9fa48("14164") ? typeFilter === 'all' : stryMutAct_9fa48("14163") ? false : (stryCov_9fa48("14163", "14164"), typeFilter !== (stryMutAct_9fa48("14165") ? "" : (stryCov_9fa48("14165"), 'all')))))) ? stryMutAct_9fa48("14166") ? "" : (stryCov_9fa48("14166"), 'Try adjusting your filters or search query.') : stryMutAct_9fa48("14167") ? "" : (stryCov_9fa48("14167"), 'You\'ll see notifications here when they arrive.')}
                </p>
              </div> : <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredNotifications.map(stryMutAct_9fa48("14168") ? () => undefined : (stryCov_9fa48("14168"), (notification, index) => <motion.div key={notification.id} initial={stryMutAct_9fa48("14169") ? {} : (stryCov_9fa48("14169"), {
                opacity: 0,
                y: 20
              })} animate={stryMutAct_9fa48("14170") ? {} : (stryCov_9fa48("14170"), {
                opacity: 1,
                y: 0
              })} transition={stryMutAct_9fa48("14171") ? {} : (stryCov_9fa48("14171"), {
                delay: stryMutAct_9fa48("14172") ? index / 0.05 : (stryCov_9fa48("14172"), index * 0.05)
              })} className={stryMutAct_9fa48("14173") ? `` : (stryCov_9fa48("14173"), `p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${(stryMutAct_9fa48("14174") ? notification.read : (stryCov_9fa48("14174"), !notification.read)) ? stryMutAct_9fa48("14175") ? "" : (stryCov_9fa48("14175"), 'bg-blue-50/50 dark:bg-blue-900/10 border-l-4 border-primary-500') : stryMutAct_9fa48("14176") ? "Stryker was here!" : (stryCov_9fa48("14176"), '')}`)}>
                    <div className="flex items-start gap-4">
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationTypeIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                {notification.title}
                              </h3>
                              <span className={stryMutAct_9fa48("14177") ? `` : (stryCov_9fa48("14177"), `inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getNotificationTypeColor(notification.type)}`)}>
                                {notification.type}
                              </span>
                              {stryMutAct_9fa48("14180") ? !notification.read || <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                  New
                                </span> : stryMutAct_9fa48("14179") ? false : stryMutAct_9fa48("14178") ? true : (stryCov_9fa48("14178", "14179", "14180"), (stryMutAct_9fa48("14181") ? notification.read : (stryCov_9fa48("14181"), !notification.read)) && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300">
                                  New
                                </span>)}
                            </div>
                            
                            <p className="text-gray-600 dark:text-gray-300 mb-3">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                              <span>{formatRelativeTime(notification.timestamp)}</span>
                              {stryMutAct_9fa48("14184") ? notification.actionUrl && notification.actionLabel || <a href={notification.actionUrl} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors" onClick={() => markAsRead(notification.id)}>
                                  {notification.actionLabel} →
                                </a> : stryMutAct_9fa48("14183") ? false : stryMutAct_9fa48("14182") ? true : (stryCov_9fa48("14182", "14183", "14184"), (stryMutAct_9fa48("14186") ? notification.actionUrl || notification.actionLabel : stryMutAct_9fa48("14185") ? true : (stryCov_9fa48("14185", "14186"), notification.actionUrl && notification.actionLabel)) && <a href={notification.actionUrl} className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors" onClick={stryMutAct_9fa48("14187") ? () => undefined : (stryCov_9fa48("14187"), () => markAsRead(notification.id))}>
                                  {notification.actionLabel} →
                                </a>)}
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 ml-4">
                            {stryMutAct_9fa48("14190") ? !notification.read || <button onClick={() => markAsRead(notification.id)} className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Mark as read">
                                <CheckIcon className="w-5 h-5" />
                              </button> : stryMutAct_9fa48("14189") ? false : stryMutAct_9fa48("14188") ? true : (stryCov_9fa48("14188", "14189", "14190"), (stryMutAct_9fa48("14191") ? notification.read : (stryCov_9fa48("14191"), !notification.read)) && <button onClick={stryMutAct_9fa48("14192") ? () => undefined : (stryCov_9fa48("14192"), () => markAsRead(notification.id))} className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors" title="Mark as read">
                                <CheckIcon className="w-5 h-5" />
                              </button>)}
                            <button onClick={stryMutAct_9fa48("14193") ? () => undefined : (stryCov_9fa48("14193"), () => deleteNotification(notification.id))} className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors" title="Delete notification">
                              <TrashIcon className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>))}
              </div>}
          </div>

          {/* Pagination or Load More */}
          {stryMutAct_9fa48("14196") ? filteredNotifications.length > 0 && filteredNotifications.length >= 20 || <div className="mt-6 text-center">
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Load More Notifications
              </button>
            </div> : stryMutAct_9fa48("14195") ? false : stryMutAct_9fa48("14194") ? true : (stryCov_9fa48("14194", "14195", "14196"), (stryMutAct_9fa48("14198") ? filteredNotifications.length > 0 || filteredNotifications.length >= 20 : stryMutAct_9fa48("14197") ? true : (stryCov_9fa48("14197", "14198"), (stryMutAct_9fa48("14201") ? filteredNotifications.length <= 0 : stryMutAct_9fa48("14200") ? filteredNotifications.length >= 0 : stryMutAct_9fa48("14199") ? true : (stryCov_9fa48("14199", "14200", "14201"), filteredNotifications.length > 0)) && (stryMutAct_9fa48("14204") ? filteredNotifications.length < 20 : stryMutAct_9fa48("14203") ? filteredNotifications.length > 20 : stryMutAct_9fa48("14202") ? true : (stryCov_9fa48("14202", "14203", "14204"), filteredNotifications.length >= 20)))) && <div className="mt-6 text-center">
              <button className="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Load More Notifications
              </button>
            </div>)}
        </div>
      </div>
    </>;
  }
}