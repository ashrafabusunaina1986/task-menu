# app/routes/user/read.py

from fastapi import APIRouter, Depends
from pydantic import EmailStr
from app.models.user.user import User
from app.services.user.service import UserService
from app.schemas.email.email import EmailUserResponse
from app.schemas.user.response import UserResponseForSelect
from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.core.container.user import get_user_service
from app.core.container.security import (
    get_current_user_dependency,
    get_security_service
)

router = APIRouter()

# ============================================================================
# 🔒 ADMIN GATEWAY: OWNER-LIST MINIFIED PROJECTION NODE
# ============================================================================
# ممتاز! تم الحفاظ عليه في أعلى الهرم لتفادي أي تداخل برمي صامت مع {user_id}


@router.get("/owner-list", response_model=list[UserResponseForSelect])
async def get_users_for_select_endpoint(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    service: UserService = Depends(get_user_service)
):
    """
    Exposes a minified operator registry mapping gate under the dynamic prefix. 
    Enforces authorization matrices and returns light projection dictionary nodes.
    """
    # جدار حماية الصلاحيات: التحقق الصارم من امتلاك المشرف لصلاحية USERS_READ لقطع الاتصال عن الدخلاء
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.USERS_READ
    )

    # استدعاء نفق معالجة الحزم المصفاة والمحمية من الـ Infinite Loop عبر الـ Service والـ Repository
    return await service.get_users_for_select()


@router.get("/")
async def get_users(
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    service: UserService = Depends(get_user_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.USERS_READ
    )
    return await service.get_all()


@router.get("/{user_id}")
async def get_user_by_id(
    user_id: str,
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    service: UserService = Depends(get_user_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.USERS_READ
    )
    result = await service.get_by_id(user_id=user_id)
    return result


@router.get("/email/{user_id}", response_model=EmailUserResponse)
async def get_email(
    user_id: str,
    service: UserService = Depends(get_user_service)
):
    return await service.get_by_id(user_id=user_id)


@router.get("/email/{email}")
async def get_user_by_email(
    email: EmailStr,
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    service: UserService = Depends(get_user_service)
):
    security.require_permission_dependency.require_permission(
        user=user,
        permission=Permission.USERS_READ
    )
    return await service.get_by_email(email=email)
