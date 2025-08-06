/**
 * Admin Maintenance Mode Toggle
 * 
 * This is a simple admin interface to toggle maintenance mode
 * for testing and production control.
 * 
 * NOTE: In production, this should be protected with proper authentication
 */

import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion } from 'framer-motion';
import { Settings, ToggleLeft, ToggleRight, CheckCircle, AlertTriangle } from 'lucide-react';

const MaintenanceAdmin: React.FC = () => {
  const [maintenanceMode, setMaintenanceMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Get current maintenance mode status from environment variable
    const currentMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
    setMaintenanceMode(currentMode);
    setLoading(false);
  }, []);

  const handleToggle = async () => {
    // Note: This is a demo interface. In a real implementation,
    // you would make an API call to update the environment variable
    // or database setting, then restart the application.
    
    alert(`To toggle maintenance mode:\n\n1. Update NEXT_PUBLIC_MAINTENANCE_MODE in .env.local\n2. Restart the development server\n\nCurrent value: ${maintenanceMode ? 'true' : 'false'}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Maintenance Mode Admin - Aclue</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      <div className="min-h-screen bg-gray-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 text-white rounded-full mb-4">
              <Settings className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Maintenance Mode Control</h1>
            <p className="text-gray-600">Manage site maintenance status and user access</p>
          </motion.div>

          {/* Status Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Current Status</h2>
                <p className="text-gray-600">
                  Environment variable: <code className="bg-gray-100 px-2 py-1 rounded text-sm">NEXT_PUBLIC_MAINTENANCE_MODE</code>
                </p>
              </div>
              <div className={`flex items-center gap-3 px-4 py-2 rounded-full ${
                maintenanceMode 
                  ? 'bg-orange-100 text-orange-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {maintenanceMode ? (
                  <AlertTriangle className="w-5 h-5" />
                ) : (
                  <CheckCircle className="w-5 h-5" />
                )}
                <span className="font-medium">
                  {maintenanceMode ? 'Maintenance Active' : 'Site Active'}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">When Enabled</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Users see maintenance page by default</li>
                  <li>• <code>/landingpage</code> allows alpha access</li>
                  <li>• API routes remain functional</li>
                  <li>• No content flashing or redirects</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-3">When Disabled</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Full site access for all users</li>
                  <li>• All routes work normally</li>
                  <li>• Maintenance page redirects to home</li>
                  <li>• Standard production behavior</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Control Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Toggle Maintenance Mode</h2>
            
            <div className="flex items-center justify-between p-6 bg-gray-50 rounded-xl">
              <div>
                <div className="font-medium text-gray-900 mb-1">Maintenance Mode</div>
                <div className="text-sm text-gray-600">
                  {maintenanceMode ? 'Site is in maintenance mode' : 'Site is fully operational'}
                </div>
              </div>
              
              <button
                onClick={handleToggle}
                className="flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
              >
                {maintenanceMode ? <ToggleRight /> : <ToggleLeft />}
                <span>{maintenanceMode ? 'Disable' : 'Enable'}</span>
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> This is a demo interface. To actually toggle maintenance mode, 
                update the <code>NEXT_PUBLIC_MAINTENANCE_MODE</code> environment variable and restart the server.
              </p>
            </div>
          </motion.div>

          {/* Test Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 grid md:grid-cols-3 gap-4"
          >
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="font-medium text-gray-900 mb-1">Home Page</div>
              <div className="text-sm text-gray-600">Test main route behavior</div>
            </a>
            <a
              href="/landingpage"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="font-medium text-gray-900 mb-1">Landing Page</div>
              <div className="text-sm text-gray-600">Alpha version access</div>
            </a>
            <a
              href="/maintenance"
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow text-center"
            >
              <div className="font-medium text-gray-900 mb-1">Maintenance</div>
              <div className="text-sm text-gray-600">Maintenance page direct</div>
            </a>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default MaintenanceAdmin;