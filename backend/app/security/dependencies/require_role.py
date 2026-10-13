# app/security/dependencies/require_role.py

from fastapi import HTTPException

from app.models.user.user import User
from app.security.permissions.roles import Role


class RequireRoleDependency:

    def require_role(
        self,
        user: User,
        required_role: Role
    ) -> User:

        if user.role != required_role:
            raise HTTPException(
                status_code=403,
                detail="Access denied."
            )

        return user
