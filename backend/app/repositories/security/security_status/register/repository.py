# app/repositories/security/security_status/register/repository.py

from typing import Optional

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.repositories.security.security_status.register.base import (
    RegisterSecurityStatusRepositoryBase
)
from app.repositories.security.security_status.register.create import (
    RegisterSecurityStatusRepositoryCreate
)
from app.repositories.security.security_status.register.read import (
    RegisterSecurityStatusRepositoryRead
)
from app.schemas.security.security_attempts.security_status.register.create import (
    RegisterSecurityStatusCreate
)
from app.schemas.security.security_attempts.security_status.register.read import (
    RegisterSecurityStatusRead
)


class RegisterSecurityStatusRepository(
    RegisterSecurityStatusRepositoryBase
):
    def __init__(
        self,
        create: RegisterSecurityStatusRepositoryCreate,
        read: RegisterSecurityStatusRepositoryRead
    ):
        self.repository_create = create
        self.repository_read = read

    async def create(
        self,
        data: RegisterSecurityStatusCreate
    ) -> RegisterSecurityStatusModel:
        return await self.repository_create.create(
            data=data
        )

    async def get_register_status(
        self,
        data: RegisterSecurityStatusRead
    ) -> Optional[RegisterSecurityStatusModel]:
        return await self.repository_read.get_register_status(
            data=data
        )
