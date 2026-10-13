# app/security/dependencies/require_permission.py

from app.models.user.user import User
from app.security.permissions.service import PermissionService
from app.security.permissions.permissions import Permission

from fastapi import HTTPException


class RequirePermissionDependency:

    def __init__(
        self,
        permission_service: PermissionService
    ):
        self.permission_service = permission_service

    def require_permission(
        self,
        user: User,
        permission: Permission
    ) -> User:
        allowed = self.permission_service.has_permission(
            role=user.role,
            permission=permission
        )

        if not allowed:
            raise HTTPException(
                status_code=403,
                detail="Permission denied."
            )
        return user
