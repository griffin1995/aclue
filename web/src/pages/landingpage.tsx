/**
 * Landing Page for Alpha Version Access
 * 
 * This page serves as the main application when users click "Explore Alpha Version"
 * from the maintenance page. It bypasses maintenance mode to provide access
 * to the full Aclue application.
 */

import React from 'react';
import HomePage from './index';

const LandingPage: React.FC = () => {
  // Simply return the main homepage component
  // This allows users to access the full application when maintenance mode is active
  return <HomePage />;
};

export default LandingPage;