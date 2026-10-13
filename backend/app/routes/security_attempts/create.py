# app/routes/security_attempts/create.py

from fastapi import APIRouter, Depends

from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.routes.security_attempts.base import (
    SecurityAttemptsRouteBase
)
from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate
)


class SecurityAttemptsRouteCreate:

    def __init__(self):
        self.router = APIRouter()

        self.router.add_api_route(
            "/create",
            self.create,
            methods=["POST"]
        )

    async def create(
        self,
        data: SecurityAttemptsCreate,
        service: SecurityAttemptsService = Depends(
            SecurityAttemptsRouteBase().get_service
        )
    ):
        return await service.create(
            data=data
        )
