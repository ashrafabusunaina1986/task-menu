# app/routes/security_attempts/read.py

from fastapi import APIRouter, Depends
from typing import Optional

from app.routes.security_attempts.base import (
    SecurityAttemptsRouteBase
)
from app.services.security.security_attempts.service import (
    SecurityAttemptsService
)
from app.schemas.security.security_attempts.response import (
    SecurityAttemptsResponse
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)


class SecurityAttemptsRouteRead:

    def __init__(self):
        self.router = APIRouter()

        self.router.add_api_route(
            '/read',
            self.get_by_user_and_operation,
            methods=["POST"],
            response_model=Optional[SecurityAttemptsResponse]
        )

    async def get_by_user_and_operation(
        self,
        data: SecurityAttemptsRead,
        service: SecurityAttemptsService = Depends(
            SecurityAttemptsRouteBase().get_service
        )
    ):
        return await service.get_by_user_and_operation(
            user_id=data.user_id,
            type_operation=data.type_operation
        )
