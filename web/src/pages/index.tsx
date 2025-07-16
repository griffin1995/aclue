import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();
  const [showAlpha, setShowAlpha] = useState(false);

  // Check if user wants to see alpha version
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const alphaParam = urlParams.get('alpha');
    
    if (alphaParam === 'true') {
      setShowAlpha(true);
    } else {
      // Redirect to maintenance page by default
      router.push('/maintenance');
    }
  }, [router]);

  // If showing alpha version, render a simple message for now
  if (showAlpha) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Alpha Version</h1>
          <p className="text-lg text-gray-600 mb-8">
            This is the alpha version of prznt. The full app is currently in development.
          </p>
          <a 
            href="/maintenance" 
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Maintenance Page
          </a>
        </div>
      </div>
    );
  }

  return null;
}