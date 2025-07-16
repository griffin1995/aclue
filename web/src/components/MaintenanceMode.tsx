import React from 'react';
import Head from 'next/head';

const MaintenanceMode: React.FC = () => {
  return (
    <>
      <Head>
        <title>Maintenance - prznt</title>
        <meta name="description" content="prznt is currently undergoing maintenance. We'll be back soon with exciting new features." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Under Maintenance
            </h1>
            <p className="text-gray-600">
              We're currently updating prznt to serve you better. We'll be back soon with exciting new features!
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-sm text-gray-500">
              Estimated completion: Soon
            </div>
            <div className="text-xs text-gray-400">
              Thank you for your patience
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MaintenanceMode;