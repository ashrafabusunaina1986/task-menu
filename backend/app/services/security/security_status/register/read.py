# app/services/security/security_status/register/read.py

from typing import Optional

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.register.read import (
    RegisterSecurityStatusRead
)
from app.repositories.security.security_status.register.read import (
    RegisterSecurityStatusRepositoryRead
)


class RegisterSecurityStatusServiceRead:

    def __init__(
        self,
        service_read: RegisterSecurityStatusRepositoryRead
    ):
        self.service_read = service_read

    async def get_register_status(
        self,
        data: RegisterSecurityStatusRead
    ) -> Optional[RegisterSecurityStatusModel]:
        return await self.service_read.get_register_status(
            data=data
        )
