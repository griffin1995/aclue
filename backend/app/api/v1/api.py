from fastapi import APIRouter

from app.api.v1.endpoints import auth, users, swipes, recommendations, products, gift_links

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(auth.router, prefix="/auth", tags=["authentication"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(swipes.router, prefix="/swipes", tags=["swipes"])
api_router.include_router(recommendations.router, prefix="/recommendations", tags=["recommendations"])
api_router.include_router(products.router, prefix="/products", tags=["products"])
api_router.include_router(gift_links.router, prefix="/gift-links", tags=["gift-links"])