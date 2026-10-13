# app/services/security/security_status/register/service.py

from typing import Optional

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.register.create import (
    RegisterSecurityStatusCreate
)
from app.schemas.security.security_attempts.security_status.register.read import (
    RegisterSecurityStatusRead
)
from app.repositories.security.security_status.register.create import (
    RegisterSecurityStatusRepositoryCreate
)

from app.repositories.security.security_status.register.read import (
    RegisterSecurityStatusRepositoryRead
)


class RegisterSecurityStatusService:

    def __init__(
        self,
        service_create: RegisterSecurityStatusRepositoryCreate,
        service_read: RegisterSecurityStatusRepositoryRead
    ):
        self.service_create = service_create
        self.service_read = service_read

    async def create(
        self,
        data: RegisterSecurityStatusCreate
    ) -> Optional[RegisterSecurityStatusModel]:
        return await self.service_create.create(
            data=data
        )

    async def get_register_status(
        self,
        data: RegisterSecurityStatusRead
    ) -> Optional[RegisterSecurityStatusModel]:
        return await self.service_read.get_register_status(
            data=data
        )
