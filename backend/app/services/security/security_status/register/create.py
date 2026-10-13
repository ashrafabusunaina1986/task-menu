# app/services/security/security_status/register/create.py

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.register.create import (
    RegisterSecurityStatusCreate
)
from app.repositories.security.security_status.register.create import (
    RegisterSecurityStatusRepositoryCreate
)


class RegisterSecurityStatusServiceCreate:

    def __init__(
        self,
        service_create: RegisterSecurityStatusRepositoryCreate
    ):
        self.service_create = service_create

    async def create(
        self,
        data: RegisterSecurityStatusCreate
    ) -> RegisterSecurityStatusModel:
        return await self.service_create.create(
            data=data
        )
