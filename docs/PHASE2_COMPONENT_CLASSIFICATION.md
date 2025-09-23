# Phase 2: Component Classification Architecture
## aclue Platform - Server/Client Component Analysis

### Document Version
- **Version**: 1.0.0
- **Date**: September 2025
- **Status**: Initial Classification
- **Author**: Architecture Team

---

## Executive Summary

This document provides the comprehensive classification of aclue platform components following the Next.js Foundation Consensus three-tier architecture. Components are categorised based on server-side rendering requirements, data sensitivity, and performance considerations.

### Classification Tiers
- **Tier 1 (85% Server)**: Core business logic, authentication, user data
- **Tier 2 (75% Server)**: Product catalogue, recommendations, search functionality
- **Tier 3 (50% Server)**: Marketing, static content, UI library components

---

## Tier 1: Core Business Components (85% Server)

### Authentication System
**Server Components (85%)**
```
/src/components/auth/
├── AuthProvider.server.tsx       # Server-side auth context
├── SessionManager.server.tsx     # JWT validation & refresh
├── UserMetadata.server.tsx      # User data fetching
├── PermissionGuard.server.tsx   # Role-based access control
└── TokenValidator.server.tsx    # Token verification logic
```

**Client Components (15%)**
```
/src/components/auth/
├── LoginForm.client.tsx         # Interactive login UI
├── RegisterForm.client.tsx      # Interactive registration UI
├── AuthGuard.client.tsx         # Client-side route protection
└── LogoutButton.client.tsx      # User action trigger
```

### User Profile Management
**Server Components (85%)**
```
/src/components/profile/
├── ProfileData.server.tsx       # User data fetching
├── PreferencesManager.server.tsx # Preference data handling
├── AccountSettings.server.tsx   # Settings data processing
├── ActivityHistory.server.tsx   # User activity logs
└── PrivacySettings.server.tsx  # Privacy configuration
```

**Client Components (15%)**
```
/src/components/profile/
├── ProfileEditor.client.tsx     # Interactive editing
├── AvatarUpload.client.tsx     # File upload handling
└── PreferenceToggle.client.tsx # Interactive toggles
```

### Data Security Layer
**Server Components (100%)**
```
/src/lib/security/
├── Encryption.server.ts         # Data encryption
├── Validation.server.ts        # Input validation
├── Sanitization.server.ts      # Data sanitisation
└── AuditLog.server.ts         # Security audit logging
```

---

## Tier 2: Product & Discovery Components (75% Server)

### Product Catalogue
**Server Components (75%)**
```
/src/components/products/
├── ProductList.server.tsx       # Product data fetching
├── ProductDetail.server.tsx     # Detailed product info
├── CategoryBrowser.server.tsx   # Category navigation
├── PriceDisplay.server.tsx     # Price calculations
├── AvailabilityStatus.server.tsx # Stock information
└── ProductMetadata.server.tsx   # SEO metadata
```

**Client Components (25%)**
```
/src/components/products/
├── ProductGallery.client.tsx    # Interactive image viewer
├── AddToCart.client.tsx        # Cart interactions
├── WishlistToggle.client.tsx   # Wishlist management
├── ProductZoom.client.tsx      # Image zoom functionality
└── VariantSelector.client.tsx  # Product variant selection
```

### Recommendation Engine
**Server Components (80%)**
```
/src/components/recommendations/
├── RecommendationEngine.server.tsx  # AI processing
├── PersonalisedList.server.tsx     # User-specific recommendations
├── TrendingProducts.server.tsx     # Trending algorithm
├── SimilarItems.server.tsx        # Related product logic
└── GiftMatcher.server.tsx         # Gift matching algorithm
```

**Client Components (20%)**
```
/src/components/recommendations/
├── SwipeInterface.client.tsx      # Swipe interactions
├── FeedbackButtons.client.tsx     # User feedback
└── RefreshButton.client.tsx       # Manual refresh trigger
```

### Search Functionality
**Server Components (70%)**
```
/src/components/search/
├── SearchEngine.server.tsx        # Search processing
├── SearchResults.server.tsx       # Results rendering
├── FilterLogic.server.tsx        # Filter processing
├── SearchSuggestions.server.tsx  # Auto-suggestions
└── SearchAnalytics.server.tsx    # Search tracking
```

**Client Components (30%)**
```
/src/components/search/
├── SearchBar.client.tsx          # Interactive search input
├── SearchFilters.client.tsx      # Interactive filters
├── InstantSearch.client.tsx      # Real-time search
└── SearchHistory.client.tsx      # Recent searches
```

---

## Tier 3: Marketing & UI Components (50% Server)

### Marketing Pages
**Server Components (60%)**
```
/src/components/marketing/
├── HomePage.server.tsx           # Static homepage content
├── AboutPage.server.tsx         # About content
├── PricingTable.server.tsx     # Pricing information
├── TestimonialList.server.tsx  # Customer testimonials
├── FeatureList.server.tsx      # Feature descriptions
└── SEOContent.server.tsx       # SEO optimised content
```

**Client Components (40%)**
```
/src/components/marketing/
├── HeroAnimation.client.tsx     # Animated hero section
├── NewsletterForm.client.tsx   # Email signup
├── ContactForm.client.tsx      # Contact interactions
├── VideoPlayer.client.tsx      # Video embeds
└── InteractiveDemo.client.tsx  # Product demos
```

### UI Library
**Server Components (30%)**
```
/src/components/ui/
├── Layout.server.tsx            # Page layouts
├── Navigation.server.tsx        # Navigation structure
├── Footer.server.tsx           # Footer content
└── Breadcrumbs.server.tsx     # Breadcrumb navigation
```

**Client Components (70%)**
```
/src/components/ui/
├── Button.client.tsx           # Interactive buttons
├── Modal.client.tsx           # Modal dialogs
├── Dropdown.client.tsx        # Dropdown menus
├── Tooltip.client.tsx         # Hover tooltips
├── Accordion.client.tsx       # Collapsible content
├── Tabs.client.tsx           # Tab navigation
├── LoadingSpinner.client.tsx # Loading states
├── Toast.client.tsx          # Notifications
└── NeuralNetworkBackground.client.tsx # Animated backgrounds
```

### Static Content
**Server Components (90%)**
```
/src/components/static/
├── PrivacyPolicy.server.tsx    # Legal content
├── TermsOfService.server.tsx   # Terms content
├── CookiePolicy.server.tsx     # Cookie information
├── Documentation.server.tsx    # Help documentation
└── FAQ.server.tsx              # Frequently asked questions
```

**Client Components (10%)**
```
/src/components/static/
├── CookieConsent.client.tsx    # Cookie acceptance
└── PrintButton.client.tsx      # Print functionality
```

---

## Repository Structure

### Proposed Multi-Repository Architecture

```
aclue-platform/
├── packages/
│   ├── core-auth/              # Tier 1: Authentication
│   ├── core-user/              # Tier 1: User management
│   ├── product-catalog/        # Tier 2: Products
│   ├── recommendation-engine/  # Tier 2: AI recommendations
│   ├── search-service/         # Tier 2: Search
│   ├── marketing-web/          # Tier 3: Marketing site
│   ├── ui-library/            # Tier 3: Shared UI components
│   └── shared-types/          # Shared TypeScript types
├── apps/
│   ├── web/                   # Main Next.js application
│   ├── admin/                 # Admin dashboard
│   └── mobile/                # React Native app
└── infrastructure/
    ├── docker/                # Docker configurations
    ├── k8s/                  # Kubernetes manifests
    └── terraform/            # Infrastructure as code
```

### Component Migration Strategy

#### Phase 2.1: Repository Setup
1. Create monorepo structure using Turborepo
2. Configure shared TypeScript configurations
3. Set up shared ESLint and Prettier configs
4. Establish CI/CD pipelines for each package

#### Phase 2.2: Component Migration Order
1. **Week 1-2**: Migrate UI library (least dependencies)
2. **Week 3-4**: Migrate authentication components
3. **Week 5-6**: Migrate product catalogue
4. **Week 7-8**: Migrate recommendation engine
5. **Week 9-10**: Integration testing and optimisation

#### Phase 2.3: Cross-Repository Coordination
```typescript
// packages/shared-types/index.ts
export interface CrossRepoConfig {
  authentication: {
    endpoint: string;
    timeout: number;
    retry: RetryConfig;
  };
  products: {
    endpoint: string;
    cacheStrategy: CacheStrategy;
  };
  recommendations: {
    endpoint: string;
    mlModelVersion: string;
  };
}
```

---

## Implementation Guidelines

### Server Component Best Practices
```typescript
// Example: Product listing server component
// packages/product-catalog/src/ProductList.server.tsx

import { Suspense } from 'react';
import { getProducts } from '@/lib/api';
import { ProductCard } from './ProductCard.server';
import { ProductSkeleton } from './ProductSkeleton';

export default async function ProductList({
  category,
  filters
}: ProductListProps) {
  const products = await getProducts({ category, filters });

  return (
    <Suspense fallback={<ProductSkeleton count={12} />}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            priority={product.featured}
          />
        ))}
      </div>
    </Suspense>
  );
}
```

### Client Component Best Practices
```typescript
// Example: Interactive swipe component
// packages/recommendation-engine/src/SwipeInterface.client.tsx

'use client';

import { useState, useCallback } from 'react';
import { useSwipeable } from 'react-swipeable';
import { trackSwipe } from '@/lib/analytics';

export function SwipeInterface({
  items,
  onSwipe
}: SwipeInterfaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSwipe = useCallback((direction: 'left' | 'right') => {
    trackSwipe({ itemId: items[currentIndex].id, direction });
    onSwipe(items[currentIndex], direction);
    setCurrentIndex(prev => prev + 1);
  }, [currentIndex, items, onSwipe]);

  const handlers = useSwipeable({
    onSwipedLeft: () => handleSwipe('left'),
    onSwipedRight: () => handleSwipe('right'),
    preventScrollOnSwipe: true,
    trackMouse: true
  });

  return (
    <div {...handlers} className="swipe-container">
      {/* Swipe UI implementation */}
    </div>
  );
}
```

---

## Performance Metrics

### Target Metrics by Tier

#### Tier 1 (85% Server)
- **Server Rendering**: 85% of components
- **Initial Load Time**: < 1.5s
- **Time to Interactive**: < 2.5s
- **Core Web Vitals**: All green
- **SEO Score**: 95+

#### Tier 2 (75% Server)
- **Server Rendering**: 75% of components
- **Initial Load Time**: < 2.0s
- **Time to Interactive**: < 3.0s
- **Core Web Vitals**: All green
- **SEO Score**: 90+

#### Tier 3 (50% Server)
- **Server Rendering**: 50% of components
- **Initial Load Time**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Core Web Vitals**: Mostly green
- **SEO Score**: 85+

### Monitoring Strategy
```typescript
// Performance monitoring configuration
export const performanceConfig = {
  tier1: {
    serverRenderThreshold: 0.85,
    maxLoadTime: 1500,
    criticalAlerts: true
  },
  tier2: {
    serverRenderThreshold: 0.75,
    maxLoadTime: 2000,
    criticalAlerts: true
  },
  tier3: {
    serverRenderThreshold: 0.50,
    maxLoadTime: 2500,
    criticalAlerts: false
  }
};
```

---

## Migration Checklist

### Pre-Migration
- [ ] Complete component audit
- [ ] Document all component dependencies
- [ ] Create migration branches
- [ ] Set up testing environments
- [ ] Establish rollback procedures

### During Migration
- [ ] Migrate components by tier priority
- [ ] Update import paths progressively
- [ ] Run integration tests after each migration
- [ ] Monitor performance metrics
- [ ] Document any issues or blockers

### Post-Migration
- [ ] Complete end-to-end testing
- [ ] Update documentation
- [ ] Performance benchmarking
- [ ] Security audit
- [ ] Deploy to staging environment
- [ ] Production deployment plan

---

## Risk Mitigation

### Identified Risks
1. **Component Interdependencies**: Complex dependency chains between components
   - **Mitigation**: Detailed dependency mapping before migration

2. **Performance Degradation**: Potential slowdown during migration
   - **Mitigation**: Progressive migration with performance monitoring

3. **Breaking Changes**: API incompatibilities between versions
   - **Mitigation**: Comprehensive testing and feature flags

4. **Development Velocity**: Slower development during migration
   - **Mitigation**: Parallel development tracks for new features

### Contingency Plans
- Maintain complete backup of current architecture
- Feature flags for progressive rollout
- Ability to quickly revert to monolithic structure
- Clear communication channels for issue escalation

---

## Next Steps

1. **Review and Approval**: Architecture team review of classification
2. **Tooling Setup**: Configure Turborepo and build tools
3. **Pilot Migration**: Start with UI library as proof of concept
4. **Team Training**: Educate development team on new structure
5. **Begin Migration**: Execute phased migration plan

---

## Appendix

### A. Component Dependency Matrix
[Detailed matrix showing component dependencies - to be generated]

### B. API Contract Definitions
[Detailed API contracts between services - to be defined]

### C. Testing Strategy
[Comprehensive testing approach for migrated components - to be documented]

### D. Performance Benchmarks
[Baseline performance metrics for comparison - to be measured]