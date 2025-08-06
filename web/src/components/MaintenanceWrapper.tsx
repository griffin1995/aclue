/**
 * Maintenance Mode Wrapper
 * 
 * This component handles maintenance mode logic at the component level
 * to prevent any content flashing by checking maintenance mode before rendering
 */

import React, { ReactNode } from 'react';
import { useRouter } from 'next/router';
import MaintenanceMode from '@/components/MaintenanceMode';

interface MaintenanceWrapperProps {
  children: ReactNode;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const router = useRouter();
  // CRITICAL FIX: Hardcode maintenance mode until Vercel environment variables are properly configured
  // The environment variable isn't being passed to runtime in production
  const maintenanceMode = true; // Previously: process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const currentPath = router.pathname;

  // Routes that are allowed even in maintenance mode
  const allowedInMaintenance = [
    '/maintenance',
    '/maintenance/index',
    '/landingpage', // Allow alpha version access
    '/api', // Allow API routes
  ];

  // Check if current path is allowed in maintenance mode
  const isAllowedPath = allowedInMaintenance.some(path => 
    currentPath.startsWith(path)
  );

  // If maintenance mode is active and we're not on an allowed path
  if (maintenanceMode && !isAllowedPath) {
    return <MaintenanceMode />;
  }

  // Otherwise render the normal content
  return <>{children}</>;
};

export default MaintenanceWrapper;