# app/routes/user/delete.py

from fastapi import APIRouter, Depends, HTTPException, status

from app.security.constants import PROTECTED_USER_ID

from app.models.user.user import User

from app.core.container.user import get_user_service
from app.core.container.security import (
    get_current_user_dependency,
    get_security_service
)

from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.services.user.service import UserService


router = APIRouter()


@router.delete("/{user_id}")
async def delete_user(
    user_id: str,
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    service: UserService = Depends(get_user_service)
):

    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.USERS_DELETE
    )
    if user_id == PROTECTED_USER_ID:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This user cannot be deleted"
        )
    await service.delete(
        user_id=user_id
    )

    return {
        "message": "User deleted successfully"
    }
