from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
import uuid

from app.core.database import get_db
from app.models.user import User
from app.api.v1.endpoints.auth import get_current_user

router = APIRouter()


@router.get("/me", summary="Get current user profile")
async def get_current_user_profile(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Get the current authenticated user's profile."""
    return current_user.to_dict()


@router.put("/me", summary="Update current user profile")
async def update_current_user_profile(
    profile_data: dict,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Update the current authenticated user's profile."""
    # Update allowed fields
    updatable_fields = ['first_name', 'last_name', 'phone_number', 'date_of_birth', 
                       'gender', 'location', 'preferences', 'notification_settings']
    
    for field, value in profile_data.items():
        if field in updatable_fields and hasattr(current_user, field):
            setattr(current_user, field, value)
    
    await db.commit()
    await db.refresh(current_user)
    
    return current_user.to_dict()


@router.delete("/me", summary="Delete current user account")
async def delete_current_user_account(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """Soft delete the current authenticated user's account."""
    from datetime import datetime
    
    current_user.deleted_at = datetime.utcnow()
    current_user.is_active = False
    
    await db.commit()
    
    return {"message": "Account deleted successfully"}


@router.get("/{user_id}", summary="Get user by ID")
async def get_user_by_id(
    user_id: str,
    db: AsyncSession = Depends(get_db)
):
    """Get user by ID (public profile only)."""
    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid user ID format"
        )
    
    stmt = select(User).where(User.id == user_uuid, User.is_active == True)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Return public profile only
    return {
        "id": str(user.id),
        "first_name": user.first_name,
        "full_name": user.full_name,
        "subscription_tier": user.subscription_tier.value,
        "created_at": user.created_at.isoformat(),
    }