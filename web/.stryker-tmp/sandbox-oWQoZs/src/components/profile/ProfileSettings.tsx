// @ts-nocheck
'use client';

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
import { User, Mail, Calendar, Shield, Settings, Bell, CreditCard } from 'lucide-react';

/**
 * Enhanced Profile Settings Component - Client Component
 *
 * Interactive profile settings with server action integration.
 * Part of Phase 3: Tier 1 Migration (85% server components).
 *
 * Features:
 * - Interactive settings interface
 * - Server action form submissions
 * - Real-time validation feedback
 * - Responsive design with accessibility features
 * - Enhanced security indicators
 */

interface ProfileSettingsProps {
  user: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    subscription_tier: string;
    created_at: string;
    updated_at: string;
  };
}
export function ProfileSettings({
  user
}: ProfileSettingsProps) {
  if (stryMutAct_9fa48("4788")) {
    {}
  } else {
    stryCov_9fa48("4788");
    const [activeTab, setActiveTab] = useState(stryMutAct_9fa48("4789") ? "" : (stryCov_9fa48("4789"), 'profile'));
    const tabs = stryMutAct_9fa48("4790") ? [] : (stryCov_9fa48("4790"), [stryMutAct_9fa48("4791") ? {} : (stryCov_9fa48("4791"), {
      id: stryMutAct_9fa48("4792") ? "" : (stryCov_9fa48("4792"), 'profile'),
      label: stryMutAct_9fa48("4793") ? "" : (stryCov_9fa48("4793"), 'Profile Information'),
      icon: User
    }), stryMutAct_9fa48("4794") ? {} : (stryCov_9fa48("4794"), {
      id: stryMutAct_9fa48("4795") ? "" : (stryCov_9fa48("4795"), 'security'),
      label: stryMutAct_9fa48("4796") ? "" : (stryCov_9fa48("4796"), 'Security'),
      icon: Shield
    }), stryMutAct_9fa48("4797") ? {} : (stryCov_9fa48("4797"), {
      id: stryMutAct_9fa48("4798") ? "" : (stryCov_9fa48("4798"), 'notifications'),
      label: stryMutAct_9fa48("4799") ? "" : (stryCov_9fa48("4799"), 'Notifications'),
      icon: Bell
    }), stryMutAct_9fa48("4800") ? {} : (stryCov_9fa48("4800"), {
      id: stryMutAct_9fa48("4801") ? "" : (stryCov_9fa48("4801"), 'billing'),
      label: stryMutAct_9fa48("4802") ? "" : (stryCov_9fa48("4802"), 'Billing'),
      icon: CreditCard
    })]);
    const formatDate = (dateString: string) => {
      if (stryMutAct_9fa48("4803")) {
        {}
      } else {
        stryCov_9fa48("4803");
        return new Date(dateString).toLocaleDateString(stryMutAct_9fa48("4804") ? "" : (stryCov_9fa48("4804"), 'en-GB'), stryMutAct_9fa48("4805") ? {} : (stryCov_9fa48("4805"), {
          year: stryMutAct_9fa48("4806") ? "" : (stryCov_9fa48("4806"), 'numeric'),
          month: stryMutAct_9fa48("4807") ? "" : (stryCov_9fa48("4807"), 'long'),
          day: stryMutAct_9fa48("4808") ? "" : (stryCov_9fa48("4808"), 'numeric')
        }));
      }
    };
    return <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6">
          {tabs.map(tab => {
            if (stryMutAct_9fa48("4809")) {
              {}
            } else {
              stryCov_9fa48("4809");
              const IconComponent = tab.icon;
              return <button key={tab.id} onClick={stryMutAct_9fa48("4810") ? () => undefined : (stryCov_9fa48("4810"), () => setActiveTab(tab.id))} className={stryMutAct_9fa48("4811") ? `` : (stryCov_9fa48("4811"), `flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${(stryMutAct_9fa48("4814") ? activeTab !== tab.id : stryMutAct_9fa48("4813") ? false : stryMutAct_9fa48("4812") ? true : (stryCov_9fa48("4812", "4813", "4814"), activeTab === tab.id)) ? stryMutAct_9fa48("4815") ? "" : (stryCov_9fa48("4815"), 'border-primary-500 text-primary-600') : stryMutAct_9fa48("4816") ? "" : (stryCov_9fa48("4816"), 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')}`)}>
                <IconComponent className="w-4 h-4" />
                {tab.label}
              </button>;
            }
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* Profile Information Tab */}
        {stryMutAct_9fa48("4819") ? activeTab === 'profile' || <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <p className="text-gray-600 mb-6">
                Update your personal information and account details.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="first_name" name="first_name" defaultValue={user.first_name} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="last_name" name="last_name" defaultValue={user.last_name} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="email" id="email" name="email" defaultValue={user.email} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your email address is used for sign-in and important account notifications.
                </p>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subscription Tier:</span>
                    <span className="font-medium text-gray-900 capitalize">{user.subscription_tier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium text-gray-900">{formatDate(user.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">{formatDate(user.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button type="submit" className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div> : stryMutAct_9fa48("4818") ? false : stryMutAct_9fa48("4817") ? true : (stryCov_9fa48("4817", "4818", "4819"), (stryMutAct_9fa48("4821") ? activeTab !== 'profile' : stryMutAct_9fa48("4820") ? true : (stryCov_9fa48("4820", "4821"), activeTab === (stryMutAct_9fa48("4822") ? "" : (stryCov_9fa48("4822"), 'profile')))) && <motion.div initial={stryMutAct_9fa48("4823") ? {} : (stryCov_9fa48("4823"), {
          opacity: 0,
          y: 20
        })} animate={stryMutAct_9fa48("4824") ? {} : (stryCov_9fa48("4824"), {
          opacity: 1,
          y: 0
        })} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Profile Information</h3>
              <p className="text-gray-600 mb-6">
                Update your personal information and account details.
              </p>
            </div>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-2">
                    First name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="first_name" name="first_name" defaultValue={user.first_name} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
                  </div>
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Last name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input type="text" id="last_name" name="last_name" defaultValue={user.last_name} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input type="email" id="email" name="email" defaultValue={user.email} className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors" />
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  Your email address is used for sign-in and important account notifications.
                </p>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">Account Information</h4>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subscription Tier:</span>
                    <span className="font-medium text-gray-900 capitalize">{user.subscription_tier}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Member Since:</span>
                    <span className="font-medium text-gray-900">{formatDate(user.created_at)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Last Updated:</span>
                    <span className="font-medium text-gray-900">{formatDate(user.updated_at)}</span>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">
                <button type="submit" className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors">
                  Save Changes
                </button>
              </div>
            </form>
          </motion.div>)}

        {/* Security Tab */}
        {stryMutAct_9fa48("4827") ? activeTab === 'security' || <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              <p className="text-gray-600 mb-6">
                Manage your account security and authentication preferences.
              </p>
            </div>

            {/* Security Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Account Security Status</h4>
                  <p className="text-sm text-green-700">
                    Your account is secured with industry-standard encryption and protection.
                  </p>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Change Password</h4>
              <p className="text-sm text-gray-600 mb-4">
                Update your password to keep your account secure.
              </p>
              <button className="text-primary-600 hover:text-primary-500 font-medium text-sm">
                Change Password
              </button>
            </div>

            {/* Session Management */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h4>
              <p className="text-sm text-gray-600 mb-4">
                Manage devices that are currently signed in to your account.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Session</p>
                    <p className="text-xs text-gray-500">Web Browser • Active now</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Current
                  </span>
                </div>
              </div>
            </div>
          </motion.div> : stryMutAct_9fa48("4826") ? false : stryMutAct_9fa48("4825") ? true : (stryCov_9fa48("4825", "4826", "4827"), (stryMutAct_9fa48("4829") ? activeTab !== 'security' : stryMutAct_9fa48("4828") ? true : (stryCov_9fa48("4828", "4829"), activeTab === (stryMutAct_9fa48("4830") ? "" : (stryCov_9fa48("4830"), 'security')))) && <motion.div initial={stryMutAct_9fa48("4831") ? {} : (stryCov_9fa48("4831"), {
          opacity: 0,
          y: 20
        })} animate={stryMutAct_9fa48("4832") ? {} : (stryCov_9fa48("4832"), {
          opacity: 1,
          y: 0
        })} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              <p className="text-gray-600 mb-6">
                Manage your account security and authentication preferences.
              </p>
            </div>

            {/* Security Status */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <h4 className="text-sm font-medium text-green-900">Account Security Status</h4>
                  <p className="text-sm text-green-700">
                    Your account is secured with industry-standard encryption and protection.
                  </p>
                </div>
              </div>
            </div>

            {/* Password Change */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Change Password</h4>
              <p className="text-sm text-gray-600 mb-4">
                Update your password to keep your account secure.
              </p>
              <button className="text-primary-600 hover:text-primary-500 font-medium text-sm">
                Change Password
              </button>
            </div>

            {/* Session Management */}
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-900 mb-3">Active Sessions</h4>
              <p className="text-sm text-gray-600 mb-4">
                Manage devices that are currently signed in to your account.
              </p>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Session</p>
                    <p className="text-xs text-gray-500">Web Browser • Active now</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Current
                  </span>
                </div>
              </div>
            </div>
          </motion.div>)}

        {/* Notifications Tab */}
        {stryMutAct_9fa48("4835") ? activeTab === 'notifications' || <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <p className="text-gray-600 mb-6">
                Control how and when you receive notifications from aclue.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Gift Recommendations</h4>
                  <p className="text-sm text-gray-600">Receive personalised gift suggestions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Product Updates</h4>
                  <p className="text-sm text-gray-600">Stay informed about new features and improvements</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Marketing Communications</h4>
                  <p className="text-sm text-gray-600">Receive special offers and promotional content</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Security Alerts</h4>
                  <p className="text-sm text-gray-600">Important security notifications and alerts</p>
                </div>
                <input type="checkbox" defaultChecked disabled className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded opacity-50" />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </motion.div> : stryMutAct_9fa48("4834") ? false : stryMutAct_9fa48("4833") ? true : (stryCov_9fa48("4833", "4834", "4835"), (stryMutAct_9fa48("4837") ? activeTab !== 'notifications' : stryMutAct_9fa48("4836") ? true : (stryCov_9fa48("4836", "4837"), activeTab === (stryMutAct_9fa48("4838") ? "" : (stryCov_9fa48("4838"), 'notifications')))) && <motion.div initial={stryMutAct_9fa48("4839") ? {} : (stryCov_9fa48("4839"), {
          opacity: 0,
          y: 20
        })} animate={stryMutAct_9fa48("4840") ? {} : (stryCov_9fa48("4840"), {
          opacity: 1,
          y: 0
        })} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <p className="text-gray-600 mb-6">
                Control how and when you receive notifications from aclue.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Gift Recommendations</h4>
                  <p className="text-sm text-gray-600">Receive personalised gift suggestions</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Product Updates</h4>
                  <p className="text-sm text-gray-600">Stay informed about new features and improvements</p>
                </div>
                <input type="checkbox" defaultChecked className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Marketing Communications</h4>
                  <p className="text-sm text-gray-600">Receive special offers and promotional content</p>
                </div>
                <input type="checkbox" className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">Security Alerts</h4>
                  <p className="text-sm text-gray-600">Important security notifications and alerts</p>
                </div>
                <input type="checkbox" defaultChecked disabled className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded opacity-50" />
              </div>
            </div>

            <div className="flex justify-end">
              <button className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Save Preferences
              </button>
            </div>
          </motion.div>)}

        {/* Billing Tab */}
        {stryMutAct_9fa48("4843") ? activeTab === 'billing' || <motion.div initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing & Subscription</h3>
              <p className="text-gray-600 mb-6">
                Manage your subscription and billing information.
              </p>
            </div>

            {/* Current Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 capitalize">
                    {user.subscription_tier} Plan
                  </h4>
                  <p className="text-gray-600 mt-1">
                    {user.subscription_tier === 'free' ? 'Enjoy basic gift recommendations and features' : 'Access to premium features and unlimited recommendations'}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  Current Plan
                </span>
              </div>

              {user.subscription_tier === 'free' && <div className="mt-4">
                  <button className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Upgrade to Premium
                  </button>
                </div>}
            </div>

            {/* Billing History */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Billing History</h4>
              <p className="text-gray-600 text-sm">
                No billing history available for free accounts.
              </p>
            </div>
          </motion.div> : stryMutAct_9fa48("4842") ? false : stryMutAct_9fa48("4841") ? true : (stryCov_9fa48("4841", "4842", "4843"), (stryMutAct_9fa48("4845") ? activeTab !== 'billing' : stryMutAct_9fa48("4844") ? true : (stryCov_9fa48("4844", "4845"), activeTab === (stryMutAct_9fa48("4846") ? "" : (stryCov_9fa48("4846"), 'billing')))) && <motion.div initial={stryMutAct_9fa48("4847") ? {} : (stryCov_9fa48("4847"), {
          opacity: 0,
          y: 20
        })} animate={stryMutAct_9fa48("4848") ? {} : (stryCov_9fa48("4848"), {
          opacity: 1,
          y: 0
        })} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Billing & Subscription</h3>
              <p className="text-gray-600 mb-6">
                Manage your subscription and billing information.
              </p>
            </div>

            {/* Current Plan */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-lg font-medium text-gray-900 capitalize">
                    {user.subscription_tier} Plan
                  </h4>
                  <p className="text-gray-600 mt-1">
                    {(stryMutAct_9fa48("4851") ? user.subscription_tier !== 'free' : stryMutAct_9fa48("4850") ? false : stryMutAct_9fa48("4849") ? true : (stryCov_9fa48("4849", "4850", "4851"), user.subscription_tier === (stryMutAct_9fa48("4852") ? "" : (stryCov_9fa48("4852"), 'free')))) ? stryMutAct_9fa48("4853") ? "" : (stryCov_9fa48("4853"), 'Enjoy basic gift recommendations and features') : stryMutAct_9fa48("4854") ? "" : (stryCov_9fa48("4854"), 'Access to premium features and unlimited recommendations')}
                  </p>
                </div>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
                  Current Plan
                </span>
              </div>

              {stryMutAct_9fa48("4857") ? user.subscription_tier === 'free' || <div className="mt-4">
                  <button className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Upgrade to Premium
                  </button>
                </div> : stryMutAct_9fa48("4856") ? false : stryMutAct_9fa48("4855") ? true : (stryCov_9fa48("4855", "4856", "4857"), (stryMutAct_9fa48("4859") ? user.subscription_tier !== 'free' : stryMutAct_9fa48("4858") ? true : (stryCov_9fa48("4858", "4859"), user.subscription_tier === (stryMutAct_9fa48("4860") ? "" : (stryCov_9fa48("4860"), 'free')))) && <div className="mt-4">
                  <button className="bg-primary-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Upgrade to Premium
                  </button>
                </div>)}
            </div>

            {/* Billing History */}
            <div className="border border-gray-200 rounded-lg p-6">
              <h4 className="text-lg font-medium text-gray-900 mb-4">Billing History</h4>
              <p className="text-gray-600 text-sm">
                No billing history available for free accounts.
              </p>
            </div>
          </motion.div>)}
      </div>
    </div>;
  }
}