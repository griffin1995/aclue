/**
 * Breadcrumb Navigation - Server/Client Component
 *
 * Provides navigation breadcrumbs for better user orientation.
 * Can be used as both server and client component.
 */

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbNavigationProps {
  items: BreadcrumbItem[];
}

export function BreadcrumbNavigation({ items }: BreadcrumbNavigationProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-sm">
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
          )}

          {index === items.length - 1 ? (
            // Current page (not linked)
            <span className="text-gray-900 font-medium truncate">
              {item.label}
            </span>
          ) : (
            // Linked breadcrumb item
            <Link
              href={item.href}
              className="text-gray-600 hover:text-primary-600 transition-colors truncate"
            >
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}