# aclue Pages Router to App Router Migration Plan
## 10-Week Comprehensive Migration Strategy

**Current State**: Next.js 14 with Pages Router (100% client-side components)
**Target State**: Tier-based App Router architecture with 70% average server-side components
**Timeline**: 10 weeks (December 2025 - February 2026)
**Critical Constraint**: Zero production downtime

---

## Executive Summary

This migration plan transforms aclue from a client-heavy Pages Router architecture to a performance-optimised App Router system with strategic server-side rendering. The phased approach ensures production stability while achieving significant performance improvements.

### Performance Targets
- **Tier 1** (Authentication/Profiles): 85% server components
- **Tier 2** (Products/Recommendations): 75% server components
- **Tier 3** (Marketing/UI): 50% server components
- **Overall Target**: 70% average server-side components

---

## Phase 1: Foundation & Setup (Weeks 1-2)

### Week 1: Environment Preparation
**Objectives**: Establish dual architecture support

#### Day 1-2: Branch Strategy Setup
```bash
# Create feature branch for migration
git checkout -b feature/app-router-migration
git push -u origin feature/app-router-migration

# Create app directory structure
mkdir -p web/src/app
mkdir -p web/src/app/(auth)
mkdir -p web/src/app/(dashboard)
mkdir -p web/src/app/(marketing)
```

#### Day 3-4: Feature Flag Implementation
- **File**: `web/src/lib/feature-flags.ts`
- **Purpose**: Control gradual rollout of App Router pages
- **Environment Variables**:
  ```env
  NEXT_PUBLIC_APP_ROUTER_ENABLED=false
  NEXT_PUBLIC_APP_ROUTER_ROUTES=[]
  ```

#### Day 5-7: Build Configuration Updates
- **Update**: `web/next.config.js`
- **Add**: Experimental App Router support alongside Pages Router
- **Configure**: Server component optimization settings

### Week 2: Server Component Foundation
**Objectives**: Create reusable server component patterns

#### Day 1-3: Server Component Library
- **Create**: `web/src/components/server/` directory
- **Implement**: Base server components for layouts, headers, footers
- **Establish**: Server-side data fetching patterns

#### Day 4-5: Authentication Server Components
- **Migrate**: Auth context to Server Components + Server Actions
- **Create**: `web/src/app/(auth)/layout.tsx`
- **Implement**: Server-side session validation

#### Day 6-7: Testing Infrastructure
- **Setup**: Cypress for E2E testing App Router pages
- **Configure**: Jest for server component unit tests
- **Create**: Performance testing baseline scripts

**Week 2 Deliverables**:
- ✅ Feature flag system operational
- ✅ Server component architecture established
- ✅ Testing infrastructure ready
- ✅ Baseline performance metrics captured

---

## Phase 2: Tier 1 Migration - Authentication (Weeks 3-4)

### Week 3: Authentication System Migration
**Target**: 85% server components for auth tier

#### Day 1-2: Server Actions Implementation
```typescript
// web/src/app/actions/auth.ts
'use server'

export async function loginAction(formData: FormData) {
  // Server-side authentication logic
}

export async function registerAction(formData: FormData) {
  // Server-side registration logic
}
```

#### Day 3-4: Auth Pages Migration
- **Migrate**: `/pages/auth/login.tsx` → `/app/(auth)/login/page.tsx`
- **Migrate**: `/pages/auth/register.tsx` → `/app/(auth)/register/page.tsx`
- **Implement**: Server-side form validation

#### Day 5-7: Profile System Migration
- **Create**: `/app/(auth)/profile/page.tsx`
- **Implement**: Server-side profile data fetching
- **Setup**: Server component user metadata handling

### Week 4: Authentication Testing & Rollout
**Objectives**: Validate auth tier migration

#### Day 1-3: Comprehensive Testing
- **Unit Tests**: Server component authentication logic
- **Integration Tests**: Auth flow with server actions
- **E2E Tests**: Complete authentication journey

#### Day 4-5: Feature Flag Rollout
- **Environment**: `NEXT_PUBLIC_APP_ROUTER_ROUTES=["auth"]`
- **Monitor**: Performance metrics vs Pages Router baseline
- **Validate**: User authentication flows

#### Day 6-7: Performance Optimisation
- **Analyse**: Core Web Vitals improvements
- **Optimise**: Server component bundle sizes
- **Document**: Migration patterns for next tier

**Week 4 Success Metrics**:
- ✅ Auth tier achieves 85% server components
- ✅ Authentication performance improves by 40%
- ✅ Zero authentication-related production issues
- ✅ Server actions handle 100% of auth operations

---

## Phase 3: Tier 2 Migration - Products & Recommendations (Weeks 5-6)

### Week 5: Product System Migration
**Target**: 75% server components for product tier

#### Day 1-2: Product Data Layer
```typescript
// web/src/app/actions/products.ts
'use server'

export async function getProducts(filters: ProductFilters) {
  // Server-side product fetching with caching
}

export async function getRecommendations(userId: string) {
  // Server-side ML recommendations
}
```

#### Day 3-4: Product Pages Migration
- **Migrate**: `/pages/discover.tsx` → `/app/(dashboard)/discover/page.tsx`
- **Migrate**: `/pages/dashboard/recommendations.tsx` → `/app/(dashboard)/recommendations/page.tsx`
- **Implement**: Server-side product filtering

#### Day 5-7: Interactive Components
- **Create**: Client components for swipe interactions
- **Implement**: Server components for product listings
- **Setup**: Hybrid rendering for optimal performance

### Week 6: Recommendations System Migration
**Objectives**: Complete product tier migration

#### Day 1-3: Recommendation Engine Integration
- **Server Components**: Product recommendation cards
- **Client Components**: Swipe gesture handling
- **Caching**: Server-side recommendation caching strategy

#### Day 4-5: Search & Filtering
- **Migrate**: Search functionality to server actions
- **Implement**: Server-side filtering with client-side UI
- **Optimise**: Search result rendering performance

#### Day 6-7: Feature Flag Rollout
- **Environment**: `NEXT_PUBLIC_APP_ROUTER_ROUTES=["auth", "products"]`
- **Monitor**: Product discovery performance metrics
- **Validate**: Recommendation algorithm performance

**Week 6 Success Metrics**:
- ✅ Product tier achieves 75% server components
- ✅ Product loading time improves by 35%
- ✅ Recommendation response time under 200ms
- ✅ Search performance improves by 50%

---

## Phase 4: Tier 3 Migration - Marketing & UI (Weeks 7-8)

### Week 7: Marketing Pages Migration
**Target**: 50% server components for marketing tier

#### Day 1-2: Static Marketing Pages
- **Migrate**: Landing pages to App Router
- **Implement**: Server-side content rendering
- **Setup**: Static generation for marketing content

#### Day 3-4: Interactive Marketing Components
- **Create**: Client components for animations
- **Server Components**: Content blocks and forms
- **Implement**: Newsletter signup with server actions

#### Day 5-7: UI Component Migration
- **Migrate**: Shared UI components
- **Optimise**: Component bundle splitting
- **Implement**: Progressive enhancement patterns

### Week 8: Complete Marketing Tier
**Objectives**: Finalise marketing tier migration

#### Day 1-3: Content Management
- **Server Components**: CMS content rendering
- **Client Components**: Interactive content widgets
- **Caching**: Static content caching strategy

#### Day 4-5: Performance Optimisation
- **Analyse**: Marketing page Core Web Vitals
- **Optimise**: Image loading and content delivery
- **Implement**: Progressive loading strategies

#### Day 6-7: Feature Flag Rollout
- **Environment**: `NEXT_PUBLIC_APP_ROUTER_ROUTES=["auth", "products", "marketing"]`
- **Monitor**: Marketing conversion rates
- **Validate**: SEO performance improvements

**Week 8 Success Metrics**:
- ✅ Marketing tier achieves 50% server components
- ✅ Marketing page load time improves by 30%
- ✅ SEO scores improve across all marketing pages
- ✅ Conversion rates maintain or improve

---

## Phase 5: Migration Completion & Optimisation (Weeks 9-10)

### Week 9: Full Migration & Cleanup
**Objectives**: Complete migration and remove Pages Router

#### Day 1-3: API Routes Migration
- **Migrate**: All API routes to App Router API handlers
- **Implement**: Route handlers with proper caching
- **Optimise**: API response times

#### Day 4-5: Pages Router Removal
- **Remove**: All pages from `/pages` directory
- **Cleanup**: Pages Router specific configurations
- **Update**: Build configurations for App Router only

#### Day 6-7: Configuration Cleanup
- **Update**: `next.config.js` for App Router optimisation
- **Remove**: Pages Router specific middleware
- **Cleanup**: Unused dependencies

### Week 10: Performance Optimisation & Launch
**Objectives**: Final optimisation and production deployment

#### Day 1-3: Performance Tuning
- **Optimise**: Server component rendering performance
- **Fine-tune**: Caching strategies across all tiers
- **Implement**: Advanced performance monitoring

#### Day 4-5: Production Deployment
- **Deploy**: Full App Router version to production
- **Monitor**: Real-time performance metrics
- **Validate**: All user journeys working correctly

#### Day 6-7: Post-Launch Optimisation
- **Analyse**: Production performance data
- **Optimise**: Based on real user metrics
- **Document**: Migration lessons learned

**Week 10 Success Metrics**:
- ✅ Overall 70% server component target achieved
- ✅ Production performance improves by 45%
- ✅ Zero critical production issues
- ✅ User satisfaction maintains or improves

---

## Risk Mitigation Strategies

### Critical Risks & Solutions

#### 1. Authentication Breaking in Production
**Risk**: User authentication failures during migration
**Mitigation**:
- Dual authentication system during transition
- Feature flag instant rollback capability
- Comprehensive auth testing before each rollout

#### 2. Performance Regression
**Risk**: App Router performing worse than Pages Router
**Mitigation**:
- Baseline performance metrics established
- Real-time performance monitoring
- Automatic rollback triggers for performance degradation

#### 3. SEO Impact
**Risk**: Search rankings affected by migration
**Mitigation**:
- Server-side rendering maintains SEO benefits
- Gradual rollout preserves search rankings
- SEO monitoring throughout migration

#### 4. User Experience Disruption
**Risk**: Users experiencing interface inconsistencies
**Mitigation**:
- Feature flags ensure consistent experience
- A/B testing for user acceptance
- Immediate rollback capability

### Rollback Procedures

#### Immediate Rollback (< 5 minutes)
```bash
# Emergency rollback via feature flags
NEXT_PUBLIC_APP_ROUTER_ENABLED=false
NEXT_PUBLIC_APP_ROUTER_ROUTES=[]
```

#### Tier-Specific Rollback (< 10 minutes)
```bash
# Rollback specific tier
NEXT_PUBLIC_APP_ROUTER_ROUTES=["auth"] # Remove problematic tier
```

#### Complete Rollback (< 30 minutes)
```bash
# Revert to Pages Router branch
git checkout main
vercel --prod
```

---

## Success Metrics & Monitoring

### Performance Benchmarks

#### Core Web Vitals Targets
- **LCP (Largest Contentful Paint)**: < 1.5s (improve from ~3.2s)
- **FID (First Input Delay)**: < 100ms (improve from ~180ms)
- **CLS (Cumulative Layout Shift)**: < 0.1 (improve from ~0.25)

#### Tier-Specific Metrics
- **Tier 1 (Auth)**: 85% server components, 40% performance improvement
- **Tier 2 (Products)**: 75% server components, 35% performance improvement
- **Tier 3 (Marketing)**: 50% server components, 30% performance improvement

#### Business Metrics
- **User Engagement**: Maintain or improve current levels
- **Conversion Rates**: Maintain or improve current rates
- **Bounce Rate**: Reduce by 15% due to faster loading
- **Session Duration**: Increase by 10% due to better performance

### Monitoring Dashboard

#### Real-Time Alerts
- Performance degradation > 20%
- Error rate increase > 5%
- User authentication failures > 1%
- Core Web Vitals regression

#### Weekly Reporting
- Server component adoption percentage
- Performance improvement metrics
- User satisfaction scores
- Business metric impacts

---

## Technical Implementation Details

### Directory Structure (Post-Migration)
```
web/src/
├── app/                          # App Router pages and layouts
│   ├── (auth)/                   # Auth tier (85% server)
│   │   ├── layout.tsx
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (dashboard)/              # Product tier (75% server)
│   │   ├── layout.tsx
│   │   ├── discover/page.tsx
│   │   └── recommendations/page.tsx
│   ├── (marketing)/              # Marketing tier (50% server)
│   │   ├── layout.tsx
│   │   ├── about/page.tsx
│   │   └── contact/page.tsx
│   ├── actions/                  # Server actions
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   └── marketing.ts
│   ├── api/                      # App Router API handlers
│   └── globals.css
├── components/
│   ├── server/                   # Server components
│   └── client/                   # Client components
└── lib/
    ├── feature-flags.ts
    └── migration-utils.ts
```

### Server Action Examples
```typescript
// auth.ts
'use server'
import { redirect } from 'next/navigation'
import { createUser, validateUser } from '@/lib/auth'

export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = await validateUser(email, password)
  if (user) {
    redirect('/dashboard')
  }

  return { error: 'Invalid credentials' }
}

// products.ts
'use server'
import { getProductsByCategory, getUserRecommendations } from '@/lib/products'

export async function getProducts(category: string) {
  return await getProductsByCategory(category)
}

export async function getRecommendations(userId: string) {
  return await getUserRecommendations(userId)
}
```

### Feature Flag Configuration
```typescript
// feature-flags.ts
export const isAppRouterEnabled = () => {
  return process.env.NEXT_PUBLIC_APP_ROUTER_ENABLED === 'true'
}

export const isRouteAppRouter = (route: string) => {
  const enabledRoutes = process.env.NEXT_PUBLIC_APP_ROUTER_ROUTES?.split(',') || []
  return enabledRoutes.includes(route)
}
```

---

## Team Coordination & Communication

### Daily Standups (Weeks 1-10)
- **Focus**: Migration progress, blockers, testing results
- **Duration**: 15 minutes
- **Key Topics**:
  - Previous day's achievements
  - Current day's migration targets
  - Any technical blockers
  - Performance metric updates

### Weekly Reviews
- **Performance Metrics**: Compare against baseline
- **User Feedback**: Monitor support tickets and user reports
- **Technical Debt**: Address any migration-related technical debt
- **Risk Assessment**: Evaluate and adjust risk mitigation strategies

### Communication Channels
- **Slack Channel**: #app-router-migration
- **Documentation**: Real-time migration progress documentation
- **Metrics Dashboard**: Live performance monitoring dashboard

---

## Post-Migration Benefits

### Performance Improvements
- **Overall Performance**: 45% improvement in page load times
- **Server-Side Rendering**: 70% of components server-rendered
- **Bundle Size**: Reduced client-side JavaScript by 40%
- **Core Web Vitals**: Significant improvements across all metrics

### Developer Experience
- **Simplified Architecture**: Cleaner component organisation
- **Better Performance**: Built-in optimisations
- **Modern React Features**: Latest React server components
- **Improved Testing**: Better testing patterns for server components

### Business Benefits
- **User Experience**: Faster, more responsive application
- **SEO Performance**: Better search engine rankings
- **Conversion Rates**: Improved due to faster loading times
- **Operational Costs**: Reduced server costs due to optimisation

---

## Conclusion

This comprehensive 10-week migration plan transforms aclue from a client-heavy Pages Router architecture to a performance-optimised App Router system. The phased approach ensures production stability while achieving significant performance improvements across all tiers.

The migration strategy prioritises:
1. **Zero downtime** through feature flags and gradual rollouts
2. **Performance optimization** with 70% server-side rendering target
3. **Risk mitigation** with comprehensive testing and rollback procedures
4. **Business continuity** with maintained user experience throughout migration

**Expected Outcomes**:
- 45% overall performance improvement
- 70% server component adoption
- Improved Core Web Vitals scores
- Enhanced user experience and engagement
- Modern, maintainable codebase architecture

This migration positions aclue for future scalability and performance while maintaining the current production stability and user experience that users expect from the platform.