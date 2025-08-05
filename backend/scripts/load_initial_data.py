#!/usr/bin/env python3
"""
Load initial data into the aclue database.
This script creates sample categories, brands, and featured products.
"""

import asyncio
import os
import sys
from typing import List

# Add the parent directory to the path so we can import our app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.database import AsyncSessionLocal, create_tables
from app.models.product import Category, Brand, Retailer, Product
from sqlalchemy import select


async def create_categories() -> List[Category]:
    """Create initial product categories."""
    categories_data = [
        # Root categories
        {"name": "Electronics", "slug": "electronics", "level": 0, "sort_order": 1, "color_hex": "#2196F3"},
        {"name": "Fashion", "slug": "fashion", "level": 0, "sort_order": 2, "color_hex": "#E91E63"},
        {"name": "Home & Garden", "slug": "home-garden", "level": 0, "sort_order": 3, "color_hex": "#4CAF50"},
        {"name": "Sports & Outdoors", "slug": "sports-outdoors", "level": 0, "sort_order": 4, "color_hex": "#FF9800"},
        {"name": "Books & Media", "slug": "books-media", "level": 0, "sort_order": 5, "color_hex": "#9C27B0"},
        {"name": "Health & Beauty", "slug": "health-beauty", "level": 0, "sort_order": 6, "color_hex": "#00BCD4"},
        {"name": "Toys & Games", "slug": "toys-games", "level": 0, "sort_order": 7, "color_hex": "#FFC107"},
        {"name": "Food & Drink", "slug": "food-drink", "level": 0, "sort_order": 8, "color_hex": "#795548"},
    ]
    
    categories = []
    async with AsyncSessionLocal() as session:
        for cat_data in categories_data:
            category = Category(**cat_data)
            session.add(category)
            categories.append(category)
        
        await session.commit()
        for category in categories:
            await session.refresh(category)
    
    print(f"✅ Created {len(categories)} root categories")
    return categories


async def create_brands() -> List[Brand]:
    """Create initial brands."""
    brands_data = [
        {"name": "Apple", "slug": "apple", "is_featured": True},
        {"name": "Samsung", "slug": "samsung", "is_featured": True},
        {"name": "Nike", "slug": "nike", "is_featured": True},
        {"name": "Adidas", "slug": "adidas", "is_featured": True},
        {"name": "Sony", "slug": "sony", "is_featured": True},
        {"name": "IKEA", "slug": "ikea", "is_featured": True},
        {"name": "Amazon Basics", "slug": "amazon-basics", "is_featured": False},
        {"name": "Levi's", "slug": "levis", "is_featured": True},
        {"name": "KitchenAid", "slug": "kitchenaid", "is_featured": True},
        {"name": "Fitbit", "slug": "fitbit", "is_featured": True},
    ]
    
    brands = []
    async with AsyncSessionLocal() as session:
        for brand_data in brands_data:
            brand = Brand(**brand_data)
            session.add(brand)
            brands.append(brand)
        
        await session.commit()
        for brand in brands:
            await session.refresh(brand)
    
    print(f"✅ Created {len(brands)} brands")
    return brands


async def create_retailers() -> List[Retailer]:
    """Create initial retailers."""
    retailers_data = [
        {
            "name": "Amazon",
            "slug": "amazon",
            "website_url": "https://amazon.com",
            "affiliate_network": "amazon",
            "commission_rate": 0.05,
            "is_featured": True,
        },
        {
            "name": "Best Buy",
            "slug": "best-buy",
            "website_url": "https://bestbuy.com",
            "affiliate_network": "cj",
            "commission_rate": 0.04,
            "is_featured": True,
        },
        {
            "name": "Target",
            "slug": "target",
            "website_url": "https://target.com",
            "affiliate_network": "cj",
            "commission_rate": 0.08,
            "is_featured": True,
        },
        {
            "name": "Walmart",
            "slug": "walmart",
            "website_url": "https://walmart.com",
            "affiliate_network": "cj",
            "commission_rate": 0.04,
            "is_featured": True,
        },
    ]
    
    retailers = []
    async with AsyncSessionLocal() as session:
        for retailer_data in retailers_data:
            retailer = Retailer(**retailer_data)
            session.add(retailer)
            retailers.append(retailer)
        
        await session.commit()
        for retailer in retailers:
            await session.refresh(retailer)
    
    print(f"✅ Created {len(retailers)} retailers")
    return retailers


async def create_sample_products(categories: List[Category], retailers: List[Retailer]) -> List[Product]:
    """Create sample products for testing."""
    
    # Find specific categories and retailers
    electronics = next((c for c in categories if c.slug == "electronics"), None)
    fashion = next((c for c in categories if c.slug == "fashion"), None)
    home = next((c for c in categories if c.slug == "home-garden"), None)
    amazon = next((r for r in retailers if r.slug == "amazon"), None)
    
    if not all([electronics, fashion, home, amazon]):
        print("❌ Could not find required categories or retailers for sample products")
        return []
    
    products_data = [
        {
            "external_id": "B08N5WRWNW",
            "title": "Apple AirPods Pro (2nd Generation)",
            "description": "Active Noise Cancelling wireless earbuds with spatial audio",
            "brand": "Apple",
            "price": 249.99,
            "currency": "USD",
            "category_path": "Electronics/Audio/Headphones",
            "primary_category": "Electronics",
            "sub_category": "Audio",
            "tags": ["wireless", "noise-cancelling", "premium", "apple"],
            "image_urls": ["https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg"],
            "primary_image_url": "https://m.media-amazon.com/images/I/61SUj2aKoEL._AC_SL1500_.jpg",
            "product_url": "https://amazon.com/dp/B08N5WRWNW",
            "affiliate_url": "https://amazon.com/dp/B08N5WRWNW?tag=aclue-20",
            "average_rating": 4.5,
            "review_count": 12543,
            "availability_status": "in_stock",
            "is_featured": True,
            "retailer_id": amazon.id,
            "attributes": {"color": "White", "connectivity": "Bluetooth", "battery_life": "6 hours"},
        },
        {
            "external_id": "B08G9J44ST",
            "title": "Levi's Men's 501 Original Fit Jeans",
            "description": "Classic straight leg jeans with button fly",
            "brand": "Levi's",
            "price": 59.99,
            "currency": "USD",
            "category_path": "Fashion/Men/Jeans",
            "primary_category": "Fashion",
            "sub_category": "Men",
            "tags": ["classic", "denim", "casual", "straight-fit"],
            "image_urls": ["https://m.media-amazon.com/images/I/81-Q8XCa2JL._AC_UL1500_.jpg"],
            "primary_image_url": "https://m.media-amazon.com/images/I/81-Q8XCa2JL._AC_UL1500_.jpg",
            "product_url": "https://amazon.com/dp/B08G9J44ST",
            "affiliate_url": "https://amazon.com/dp/B08G9J44ST?tag=aclue-20",
            "average_rating": 4.3,
            "review_count": 8967,
            "availability_status": "in_stock",
            "is_featured": True,
            "retailer_id": amazon.id,
            "attributes": {"size": "32x34", "color": "Dark Blue", "material": "100% Cotton"},
        },
        {
            "external_id": "B083JXMPB7",
            "title": "Instant Pot Duo 7-in-1 Electric Pressure Cooker",
            "description": "Multi-use programmable pressure cooker, slow cooker, rice cooker",
            "brand": "Instant Pot",
            "price": 79.99,
            "original_price": 99.99,
            "currency": "USD",
            "category_path": "Home & Garden/Kitchen/Small Appliances",
            "primary_category": "Home & Garden",
            "sub_category": "Kitchen",
            "tags": ["kitchen", "cooking", "pressure-cooker", "multi-use"],
            "image_urls": ["https://m.media-amazon.com/images/I/71xiHR7VdUL._AC_SL1500_.jpg"],
            "primary_image_url": "https://m.media-amazon.com/images/I/71xiHR7VdUL._AC_SL1500_.jpg",
            "product_url": "https://amazon.com/dp/B083JXMPB7",
            "affiliate_url": "https://amazon.com/dp/B083JXMPB7?tag=aclue-20",
            "average_rating": 4.7,
            "review_count": 15632,
            "availability_status": "in_stock",
            "is_featured": True,
            "retailer_id": amazon.id,
            "attributes": {"capacity": "6 quarts", "power": "1000W", "programs": "13"},
        },
    ]
    
    products = []
    async with AsyncSessionLocal() as session:
        for product_data in products_data:
            product = Product(**product_data)
            session.add(product)
            products.append(product)
        
        await session.commit()
        for product in products:
            await session.refresh(product)
    
    print(f"✅ Created {len(products)} sample products")
    return products


async def main():
    """Main function to load all initial data."""
    print("🚀 Loading initial data for aclue...")
    
    try:
        # Ensure tables exist
        await create_tables()
        print("✅ Database tables verified")
        
        # Check if data already exists
        async with AsyncSessionLocal() as session:
            result = await session.execute(select(Category))
            existing_categories = result.scalars().all()
            
            if existing_categories:
                print("⚠️  Initial data already exists. Skipping data creation.")
                print(f"   Found {len(existing_categories)} existing categories")
                return
        
        # Create initial data
        categories = await create_categories()
        brands = await create_brands()
        retailers = await create_retailers()
        products = await create_sample_products(categories, retailers)
        
        print("\n🎉 Initial data loading complete!")
        print(f"   Categories: {len(categories)}")
        print(f"   Brands: {len(brands)}")
        print(f"   Retailers: {len(retailers)}")
        print(f"   Products: {len(products)}")
        print("\nYour aclue database is ready for use! 🎁")
        
    except Exception as e:
        print(f"❌ Error loading initial data: {e}")
        raise


if __name__ == "__main__":
    asyncio.run(main())