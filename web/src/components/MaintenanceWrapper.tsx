/**
 * Maintenance Mode Wrapper
 * 
 * This component handles maintenance mode logic at the component level
 * to prevent any content flashing by checking maintenance mode before rendering
 */

import React, { type ReactNode } from 'react';
import { useRouter } from 'next/router';
import MaintenanceMode from '@/components/MaintenanceMode';

interface MaintenanceWrapperProps {
  children: ReactNode;
}

const MaintenanceWrapper: React.FC<MaintenanceWrapperProps> = ({ children }) => {
  const router = useRouter();
  // Check maintenance mode from environment variable (now properly configured in vercel.json)
  const maintenanceMode = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === 'true';
  const currentPath = router.pathname;

  // Routes that are allowed even in maintenance mode
  const allowedInMaintenance = [
    '/maintenance',
    '/maintenance/index',
    '/landingpage', // Allow alpha version access
    '/api', // Allow API routes
    '/auth', // Allow authentication routes for testing
    '/dashboard', // Allow dashboard routes for testing
    '/profile', // Allow profile routes for testing
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