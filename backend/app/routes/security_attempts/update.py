# app/routes/security_attempts/update.py

from fastapi import APIRouter, Depends

from app.routes.security_attempts.base import (
    SecurityAttemptsRouteBase
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)


class SecurityAttemptsRouteUpdate:

    def __init__(self):
        self.router = APIRouter()

        self.router.add_api_route(
            "/update",
            self.update,
            methods=["POST"]
        )

    async def update(
        self,
        data: SecurityAttemptsUpdate,
        service: SecurityAttemptsService = Depends(
            SecurityAttemptsRouteBase().get_service
        )
    ):
        return await service.update(
            security_attempts_id=data.security_attempts_id
        )
