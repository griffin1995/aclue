# Phase 4 Wishlist System Redesign - Amazon Affiliate Platform

## Business Model Alignment

### **aclue's Actual Model:**
- **Amazon affiliate platform** using referral links for revenue
- **Wishlist creation and sharing** between friends/family
- **AI recommendations** from Amazon's product catalog
- **No direct sales** - redirects to Amazon for purchases
- **Example products** currently used for MVP testing before Amazon integration

## Phase 4 Redesign Strategy

### **Target: 75% Server Components Architecture**

**Server Components (75%):**
- Wishlist management pages (create, edit, view)
- Wishlist sharing pages (public wishlist views)
- Product discovery for wishlists (server-side filtering)
- Amazon affiliate link generation (server-side for security)
- Wishlist data fetching and caching
- SEO-optimised wishlist sharing pages

**Client Components (25%):**
- Add/remove from wishlist buttons
- Wishlist privacy toggle controls
- Social sharing interactions
- Product discovery swipe interface (existing)

## New Directory Structure

```
/src/app/(wishlists)/
├── wishlists/
│   ├── page.tsx                    # User's wishlist collection (server)
│   ├── create/page.tsx             # Create new wishlist (server)
│   └── [id]/
│       ├── page.tsx                # Individual wishlist view (server)
│       ├── edit/page.tsx           # Edit wishlist (server)
│       └── share/page.tsx          # Public shared wishlist (server)
├── discover-for-wishlist/
│   └── [wishlistId]/page.tsx       # Add products to specific wishlist
└── layout.tsx                      # Wishlist section layout

/src/app/actions/
└── wishlists.ts                    # Server actions for wishlist operations

/src/components/wishlists/
├── WishlistCard.tsx                # Wishlist preview card (server)
├── WishlistGrid.tsx                # Grid of user's wishlists (server)
├── WishlistActions.tsx             # Add/remove/share buttons (client)
├── CreateWishlistForm.tsx          # Create wishlist form (client)
├── WishlistProductGrid.tsx         # Products in wishlist (server)
└── WishlistShareOptions.tsx        # Social sharing controls (client)

/src/components/amazon/
├── AffiliateLink.tsx               # Amazon referral link component
├── AmazonRedirect.tsx              # Redirect to Amazon with tracking
└── PriceTracker.tsx                # Amazon price tracking display
```

## Data Models

### **Wishlist Schema**
```typescript
interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  is_public: boolean;
  share_token?: string;           // For public sharing
  created_at: Date;
  updated_at: Date;
  product_count: number;          // Denormalised for performance
}

interface WishlistProduct {
  id: string;
  wishlist_id: string;
  product_id: string;
  added_at: Date;
  notes?: string;                 // Personal notes about the product
  priority?: 'low' | 'medium' | 'high';
  price_when_added?: number;      // Price tracking
}
```

### **Amazon Integration Schema**
```typescript
interface AmazonProductLink {
  product_id: string;
  amazon_asin?: string;           // Amazon product identifier
  affiliate_url: string;          // Generated affiliate link
  base_amazon_url: string;        // Original Amazon URL
  affiliate_tag: string;          // aclue's affiliate tag
  last_updated: Date;
  price_history?: PricePoint[];   // Price tracking
}

interface PricePoint {
  price: number;
  currency: string;
  timestamp: Date;
  source: 'amazon' | 'manual';
}
```

## Server Actions Implementation

### **Wishlist Management Actions**
```typescript
// /src/app/actions/wishlists.ts

'use server';

// Create new wishlist
export async function createWishlistAction(data: {
  name: string;
  description?: string;
  is_public: boolean;
})

// Add product to wishlist
export async function addToWishlistAction(data: {
  wishlistId: string;
  productId: string;
  notes?: string;
  priority?: 'low' | 'medium' | 'high';
})

// Remove product from wishlist
export async function removeFromWishlistAction(data: {
  wishlistId: string;
  productId: string;
})

// Update wishlist details
export async function updateWishlistAction(data: {
  wishlistId: string;
  name?: string;
  description?: string;
  is_public?: boolean;
})

// Generate sharing link
export async function generateShareLinkAction(wishlistId: string)

// Generate Amazon affiliate links
export async function generateAffiliateLinksAction(productIds: string[])
```

## Component Redesign Strategy

### **1. Remove E-commerce Components**

**Files to Modify:**
- `ProductActions.tsx` - Remove "Add to Cart" button, enhance wishlist functionality
- `products.ts` actions - Remove `addToCartAction`, `removeFromCartAction`
- Backend API endpoints - Remove cart-related endpoints

### **2. Enhanced Wishlist Components**

**ProductActions.tsx Changes:**
```typescript
// BEFORE (E-commerce model):
- Add to Cart button
- Shopping cart functionality
- Checkout redirect

// AFTER (Wishlist/Affiliate model):
+ Add to Wishlist (with wishlist selection)
+ View on Amazon (with affiliate tracking)
+ Share product functionality
+ Wishlist management options
```

### **3. New Wishlist Pages**

**Wishlist Collection Page (`/wishlists/page.tsx`):**
- Server-rendered grid of user's wishlists
- Create new wishlist action
- Search/filter wishlists
- Quick statistics (product counts, etc.)

**Individual Wishlist Page (`/wishlists/[id]/page.tsx`):**
- Server-rendered wishlist details
- Product grid with Amazon affiliate links
- Share wishlist options
- Add more products to wishlist

**Shared Wishlist Page (`/wishlists/[id]/share/page.tsx`):**
- Public view of shared wishlist
- SEO-optimised for social sharing
- Amazon affiliate links for revenue
- Option to copy wishlist (if authenticated)

## Migration Strategy

### **Phase 4A: Foundation (Week 5)**
1. ✅ Remove cart functionality from existing components
2. ✅ Create wishlist data models and database schema
3. ✅ Implement basic wishlist CRUD operations
4. ✅ Update ProductActions component for wishlist model

### **Phase 4B: Social & Affiliate (Week 6)**
1. ✅ Implement wishlist sharing functionality
2. ✅ Create Amazon affiliate link generation system
3. ✅ Build social sharing components
4. ✅ Add wishlist discovery and management UI

## Amazon Affiliate Integration

### **Server-Side Affiliate Link Generation**
```typescript
// Secure affiliate link generation on server
export function generateAmazonAffiliateLink(
  amazonUrl: string,
  affiliateTag: string,
  trackingData: {
    campaign: string;
    source: string;
    medium: string;
  }
): string
```

### **Revenue Tracking**
- Track affiliate link clicks
- Monitor conversion rates
- Analyse wishlist sharing effectiveness
- Optimise product recommendations for affiliate revenue

## Performance Optimisations

### **Server-Side Caching Strategy**
- Cache wishlist data with Next.js `revalidateTag`
- Static generation for public shared wishlists
- Server-side product recommendation caching
- Optimised database queries for wishlist operations

### **SEO Benefits**
- Server-rendered wishlist sharing pages
- Rich meta tags for social sharing
- Structured data for gift wishlist schema
- Amazon product integration with proper attribution

## Success Metrics

### **Functionality Requirements**
- ✅ Create and manage multiple wishlists
- ✅ Add products from discovery to wishlists
- ✅ Share wishlists with friends/family
- ✅ Generate Amazon affiliate links
- ✅ Track affiliate link performance
- ✅ Search and filter wishlists

### **Performance Targets**
- 75% server components architecture
- Sub-200ms wishlist page load times
- Effective Amazon affiliate link generation
- High social sharing conversion rates

## Implementation Priority

1. **High Priority** - Remove cart functionality, implement basic wishlist CRUD
2. **High Priority** - Create wishlist management pages with server components
3. **Medium Priority** - Amazon affiliate link generation system
4. **Medium Priority** - Wishlist sharing and social features
5. **Low Priority** - Advanced features (price tracking, wishlist analytics)

This redesign aligns Phase 4 with aclue's actual business model as an Amazon affiliate platform while maintaining the 75% server components architecture target.