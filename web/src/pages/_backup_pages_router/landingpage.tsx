/**
 * Landing Page for Aclue Application
 *
 * This page serves as the main application entry point.
 * It bypasses maintenance mode to provide access to the full Aclue application.
 */

import React from 'react';
import HomePage from './index';

const LandingPage: React.FC = () => {
  // Simply return the main homepage component
  // This allows users to access the full application when maintenance mode is active
  return <HomePage />;
};

export default LandingPage;