# app/security/permissions/authorize.py

from app.security.permissions.policy import PermissionPolicy
from app.security.permissions.permissions import Permission
from app.security.permissions.roles import Role


class AuthorizationService:
    def __init__(
        self,
        policy: PermissionPolicy
    ):
        self.policy = policy

    def has_permission(
        self,
        role: Role,
        permission: Permission
    ) -> bool:
        return self.policy.has_permission(
            role=role,
            permission=permission
        )
