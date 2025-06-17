from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from sqlalchemy import select, func, desc, and_
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload
from typing import List, Optional
from datetime import datetime, timedelta
import uuid
import hashlib

from app.core.database import get_db
from app.models.user import User
from app.models.product import Product
from app.models.gift_link import GiftLink, GiftLinkInteraction, GiftLinkAnalytics
from app.models.recommendation import Recommendation, RecommendationStatus
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.post("/", summary="Create a new gift link")
async def create_gift_link(
    link_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Create a new shareable gift link based on user's recommendations."""
    
    # Generate unique link token
    link_token = GiftLink.generate_link_token()
    
    # Create gift link
    gift_link = GiftLink(
        user_id=current_user.id,
        link_token=link_token,
        title=link_data.get('title'),
        description=link_data.get('description'),
        custom_message=link_data.get('custom_message'),
        privacy_level=link_data.get('privacy_level', 'public'),
        password_protected=link_data.get('password_protected', False),
        access_code=GiftLink.generate_access_code() if link_data.get('access_code_required') else None,
        max_recommendations=link_data.get('max_recommendations', 20),
        category_filter=link_data.get('category_filter'),
        price_min=link_data.get('price_min'),
        price_max=link_data.get('price_max'),
        expiry_date=datetime.fromisoformat(link_data['expiry_date']) if link_data.get('expiry_date') else None,
        max_views=link_data.get('max_views'),
        allow_comments=link_data.get('allow_comments', True),
        allow_votes=link_data.get('allow_votes', True),
        occasion=link_data.get('occasion'),
        occasion_date=datetime.fromisoformat(link_data['occasion_date']) if link_data.get('occasion_date') else None,
        recipient_name=link_data.get('recipient_name'),
        recipient_gender=link_data.get('recipient_gender'),
        recipient_age_range=link_data.get('recipient_age_range'),
    )
    
    # Handle password protection
    if gift_link.password_protected and link_data.get('password'):
        gift_link.password_hash = hashlib.sha256(link_data['password'].encode()).hexdigest()
    
    db.add(gift_link)
    await db.commit()
    await db.refresh(gift_link)
    
    # TODO: Generate QR code and store URL
    # gift_link.qr_code_url = generate_qr_code(gift_link.full_url)
    
    return gift_link.to_dict()


@router.get("/", summary="Get user's gift links")
async def get_user_gift_links(
    limit: int = Query(20, le=100),
    offset: int = Query(0),
    active_only: bool = Query(True, description="Only return active gift links"),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get all gift links created by the authenticated user."""
    
    stmt = select(GiftLink).where(GiftLink.user_id == current_user.id)
    
    if active_only:
        stmt = stmt.where(GiftLink.is_active == True)
    
    stmt = stmt.order_by(desc(GiftLink.created_at))
    stmt = stmt.limit(limit).offset(offset)
    
    result = await db.execute(stmt)
    gift_links = result.scalars().all()
    
    return [gift_link.to_dict() for gift_link in gift_links]


@router.get("/{link_token}", summary="Access a gift link by token")
async def access_gift_link(
    link_token: str,
    password: Optional[str] = Query(None, description="Password for protected links"),
    access_code: Optional[str] = Query(None, description="Access code for protected links"),
    request: Request = None,
    db: AsyncSession = Depends(get_db)
):
    """Access a gift link by its token (public endpoint)."""
    
    # Find gift link by token
    stmt = select(GiftLink).where(GiftLink.link_token == link_token)
    result = await db.execute(stmt)
    gift_link = result.scalar_one_or_none()
    
    if not gift_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift link not found"
        )
    
    # Check if link is accessible
    if not gift_link.is_accessible:
        if gift_link.is_expired:
            raise HTTPException(
                status_code=status.HTTP_410_GONE,
                detail="Gift link has expired"
            )
        elif gift_link.is_view_limit_reached:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Gift link view limit reached"
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Gift link is not accessible"
            )
    
    # Check password protection
    if gift_link.password_protected:
        if not password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Password required for this gift link"
            )
        
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        if password_hash != gift_link.password_hash:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid password"
            )
    
    # Check access code
    if gift_link.access_code and access_code != gift_link.access_code:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid access code"
        )
    
    # Record view interaction
    await _record_gift_link_view(gift_link, request, db)
    
    # Get recommendations for this gift link
    recommendations = await _get_gift_link_recommendations(gift_link, db)
    
    return {
        **gift_link.to_dict(),
        "recommendations": recommendations,
        "access_granted": True
    }


@router.post("/{link_token}/interact", summary="Record interaction with gift link")
async def record_gift_link_interaction(
    link_token: str,
    interaction_data: dict,
    request: Request = None,
    db: AsyncSession = Depends(get_db)
):
    """Record an interaction with a gift link (public endpoint)."""
    
    # Find gift link
    stmt = select(GiftLink).where(GiftLink.link_token == link_token)
    result = await db.execute(stmt)
    gift_link = result.scalar_one_or_none()
    
    if not gift_link or not gift_link.is_accessible:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift link not found or not accessible"
        )
    
    # Create interaction record
    interaction = GiftLinkInteraction(
        gift_link_id=gift_link.id,
        visitor_id=uuid.uuid4(),  # Generate anonymous visitor ID
        session_id=interaction_data.get('session_id'),
        interaction_type=interaction_data.get('interaction_type', 'click'),
        product_id=uuid.UUID(interaction_data['product_id']) if interaction_data.get('product_id') else None,
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get('user-agent') if request else None,
        referrer=request.headers.get('referer') if request else None,
        device_type=interaction_data.get('device_type'),
        page_position=interaction_data.get('page_position'),
        interaction_value=interaction_data.get('interaction_value'),
        time_on_page=interaction_data.get('time_on_page'),
        purchase_amount=interaction_data.get('purchase_amount'),
        commission_earned=interaction_data.get('commission_earned'),
    )
    
    db.add(interaction)
    
    # Update gift link counters
    if interaction.interaction_type == 'click':
        gift_link.click_count += 1
    elif interaction.interaction_type == 'purchase':
        gift_link.purchase_count += 1
        if interaction.purchase_amount:
            gift_link.total_revenue += interaction.purchase_amount
    
    await db.commit()
    await db.refresh(interaction)
    
    return interaction.to_dict()


@router.get("/{link_token}/analytics", summary="Get gift link analytics")
async def get_gift_link_analytics(
    link_token: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get analytics for a specific gift link (owner only)."""
    
    # Find gift link and verify ownership
    stmt = (
        select(GiftLink)
        .where(
            GiftLink.link_token == link_token,
            GiftLink.user_id == current_user.id
        )
        .options(selectinload(GiftLink.interactions))
    )
    result = await db.execute(stmt)
    gift_link = result.scalar_one_or_none()
    
    if not gift_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift link not found"
        )
    
    # Get comprehensive analytics
    performance_summary = GiftLinkAnalytics.get_performance_summary(gift_link)
    popular_products = GiftLinkAnalytics.get_popular_products(gift_link)
    
    return {
        "gift_link": gift_link.to_dict(),
        "performance_summary": performance_summary,
        "popular_products": popular_products,
        "total_interactions": len(gift_link.interactions),
    }


@router.put("/{link_token}", summary="Update gift link")
async def update_gift_link(
    link_token: str,
    update_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update a gift link (owner only)."""
    
    # Find gift link and verify ownership
    stmt = select(GiftLink).where(
        GiftLink.link_token == link_token,
        GiftLink.user_id == current_user.id
    )
    result = await db.execute(stmt)
    gift_link = result.scalar_one_or_none()
    
    if not gift_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift link not found"
        )
    
    # Update allowed fields
    updatable_fields = [
        'title', 'description', 'custom_message', 'privacy_level',
        'is_active', 'expiry_date', 'max_views', 'allow_comments',
        'allow_votes', 'occasion', 'occasion_date', 'recipient_name'
    ]
    
    for field, value in update_data.items():
        if field in updatable_fields and hasattr(gift_link, field):
            if field in ['expiry_date', 'occasion_date'] and value:
                value = datetime.fromisoformat(value)
            setattr(gift_link, field, value)
    
    await db.commit()
    await db.refresh(gift_link)
    
    return gift_link.to_dict()


@router.delete("/{link_token}", summary="Delete gift link")
async def delete_gift_link(
    link_token: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Delete a gift link (owner only)."""
    
    # Find gift link and verify ownership
    stmt = select(GiftLink).where(
        GiftLink.link_token == link_token,
        GiftLink.user_id == current_user.id
    )
    result = await db.execute(stmt)
    gift_link = result.scalar_one_or_none()
    
    if not gift_link:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Gift link not found"
        )
    
    # Soft delete by deactivating
    gift_link.is_active = False
    
    await db.commit()
    
    return {"message": "Gift link deleted successfully"}


# Helper functions

async def _record_gift_link_view(gift_link: GiftLink, request: Request, db: AsyncSession):
    """Record a view interaction for a gift link."""
    
    # Create view interaction
    view_interaction = GiftLinkInteraction(
        gift_link_id=gift_link.id,
        visitor_id=uuid.uuid4(),
        interaction_type='view',
        ip_address=request.client.host if request else None,
        user_agent=request.headers.get('user-agent') if request else None,
        referrer=request.headers.get('referer') if request else None,
    )
    
    db.add(view_interaction)
    
    # Update gift link counters
    gift_link.view_count += 1
    gift_link.last_accessed_at = datetime.utcnow()
    
    await db.commit()


async def _get_gift_link_recommendations(gift_link: GiftLink, db: AsyncSession) -> List[dict]:
    """Get recommendations for a gift link based on its filters."""
    
    # Get user's active recommendations
    stmt = (
        select(Recommendation)
        .where(
            Recommendation.user_id == gift_link.user_id,
            Recommendation.status == RecommendationStatus.ACTIVE
        )
        .options(selectinload(Recommendation.product))
        .order_by(desc(Recommendation.confidence_score))
        .limit(gift_link.max_recommendations)
    )
    
    # Apply filters if specified
    if gift_link.occasion:
        stmt = stmt.where(Recommendation.occasion == gift_link.occasion)
    
    if gift_link.price_min or gift_link.price_max:
        stmt = stmt.join(Product)
        if gift_link.price_min:
            stmt = stmt.where(Product.price >= gift_link.price_min)
        if gift_link.price_max:
            stmt = stmt.where(Product.price <= gift_link.price_max)
    
    result = await db.execute(stmt)
    recommendations = result.scalars().all()
    
    return [
        {
            **rec.to_dict(),
            "product": rec.product.to_dict() if rec.product else None,
        }
        for rec in recommendations
    ]