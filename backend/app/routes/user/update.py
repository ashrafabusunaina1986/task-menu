# app/routes/user/update.py

from fastapi import APIRouter, Depends, HTTPException, status

from app.core.container.user import get_user_service
from app.schemas.user.update import UserUpdate
from app.models.user.user import User

from app.security.permissions.permissions import Permission

from app.core.container.security import (
    get_current_user_dependency,
    get_security_service
)

from app.security.dependencies.service import DependencyService
from app.services.user.service import UserService

from app.security.constants import PROTECTED_USER_ID


router = APIRouter()


@router.put("/{user_id}")
async def update_user(
    user_id: str,
    data: UserUpdate,
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    service: UserService = Depends(get_user_service)
):

    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.USERS_UPDATE
    )

    if user_id == PROTECTED_USER_ID:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user cannot be modified"
        )

    await service.update(
        user_id=user_id,
        data=data
    )

    return {
        "message": "User updated successfully"
    }
