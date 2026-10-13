# app/routes/security_attempts/deactivate.py

from fastapi import APIRouter, Depends

from app.routes.security_attempts.base import (
    SecurityAttemptsRouteBase
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)


class SecurityAttemptsRouteDeactivate:

    def __init__(self):
        self.router = APIRouter()

        self.router.add_api_route(
            "/deactivate",
            self.deactivate,
            methods=["POST"]
        )

    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate,
        service: SecurityAttemptsService = Depends(
            SecurityAttemptsRouteBase().get_service
        )
    ):
        return await service.deactivate(
            type_operation=data.type_operation
        )
