# app/routes/security_attempts/deactivate.py

from fastapi import APIRouter, Depends

from app.routes.security_attempts.base import (
    SecurityAttemptsRouteBase
)
from app.routes.security_attempts.update import (
    SecurityAttemptsRouteUpdate
)
from app.routes.security_attempts.deactivate import (
    SecurityAttemptsRouteDeactivate
)
from app.routes.security_attempts.create import (
    SecurityAttemptsRouteCreate
)
from app.routes.security_attempts.read import (
    SecurityAttemptsRouteRead
)


class SecurityAttemptsRoute:
    def __init__(self):
        self.router = APIRouter(
            prefix=SecurityAttemptsRouteBase().get_prefix,
            tags=SecurityAttemptsRouteBase().tags
        )

        self.router.include_router(
            SecurityAttemptsRouteRead().router
        )

        self.router.include_router(
            SecurityAttemptsRouteUpdate().router
        )

        self.router.include_router(
            SecurityAttemptsRouteDeactivate().router
        )

        self.router.include_router(
            SecurityAttemptsRouteCreate().router
        )
