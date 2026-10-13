# app/security/dependencies/service.py

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


class DependencyService:

    def __init__(
        self,
        current_user_dependency: CurrentUserDependency,
        require_auth_dependency: RequireAuthDependency,
        require_permission_dependency: RequirePermissionDependency,
        require_role_dependency: RequireRoleDependency,
    ):
        self.current_user_dependency = current_user_dependency
        self.require_auth_dependency = require_auth_dependency
        self.require_permission_dependency = require_permission_dependency
        self.require_role_dependency = require_role_dependency
