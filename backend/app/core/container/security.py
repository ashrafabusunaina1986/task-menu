# app/core/container/security.py

from fastapi import Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from app.models.user.user import User
from app.security.dependencies.service import DependencyService

from app.security.dependencies.current_user import (
    CurrentUserDependency
)

from app.security.dependencies.require_auth import (
    RequireAuthDependency
)

from app.security.dependencies.require_permission import (
    RequirePermissionDependency
)

from app.security.dependencies.require_role import (
    RequireRoleDependency
)


from app.security.auth.current_user import (
    CurrentUserService
)

from app.security.token.service import (
    TokenService
)
from app.security.permissions.policy import PermissionPolicy
from app.security.permissions.authorize import AuthorizationService
from app.security.permissions.service import (
    PermissionService
)


from app.core.config import settings
from app.core.container.user import get_user_service


def get_security_service() -> DependencyService:

    token_service = TokenService(
        secret_key=settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )

    current_user_service = CurrentUserService(
        token_service=token_service,
        user_service=get_user_service()
    )

    current_user_dependency = CurrentUserDependency(
        current_user_service=current_user_service
    )

    require_auth = RequireAuthDependency()

    permission_policy = PermissionPolicy()

    authorization_service = AuthorizationService(
        policy=permission_policy
    )

    permission_service = PermissionService(
        authorization=authorization_service
    )

    require_permission = RequirePermissionDependency(
        permission_service=permission_service
    )

    require_role = RequireRoleDependency()

    return DependencyService(
        current_user_dependency=current_user_dependency,
        require_auth_dependency=require_auth,
        require_permission_dependency=require_permission,
        require_role_dependency=require_role
    )


bearer_scheme = HTTPBearer()


async def get_current_user_dependency(
    credentials: HTTPAuthorizationCredentials
    = Depends(
        bearer_scheme
    )
) -> User:

    security = get_security_service()
    return await security.current_user_dependency(
        token=credentials.credentials
    )


def get_token_service() -> TokenService:
    return TokenService(
        secret_key=settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
    )
