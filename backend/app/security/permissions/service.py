# app/security/permissions/service.py

from app.security.permissions.authorize import AuthorizationService
from app.security.permissions.roles import Role
from app.security.permissions.permissions import Permission


class PermissionService:

    def __init__(
        self,
        authorization: AuthorizationService
    ):
        self.authorization = authorization

    def has_role(
        self,
        user_role: str,
        required_role: str
    ) -> bool:
        return self.authorization.has_role(
            user_role=user_role,
            require_role=required_role
        )

    def has_permission(
        self,
        role: Role,
        permission: Permission
    ) -> bool:
        return self.authorization.has_permission(
            role=role,
            permission=permission
        )
