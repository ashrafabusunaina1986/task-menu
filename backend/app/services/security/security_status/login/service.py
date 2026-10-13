# app/services/security/security_status/login/service.py

from typing import Optional

from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)
from app.services.security.security_status.login.base import (
    LoginSecurityStatusServiceBase
)
from app.repositories.security.security_status.login.create import (
    LoginSecurityStatusRepositoryCreate
)
from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)
from app.repositories.security.security_status.login.read import (
    LoginSecurityStatusRepositoryRead
)
from app.schemas.security.security_attempts.security_status.login.read import (
    LoginSecurityStatusRead
)


class LoginSecurityStatusService(
    LoginSecurityStatusServiceBase
):

    def __init__(
        self,
        create: LoginSecurityStatusRepositoryCreate,
        read: LoginSecurityStatusRepositoryRead
    ):
        self.repository_create = create
        self.repository_read = read

    async def create(
        self,
        data: LoginSecurityStatusCreate
    ) -> LoginSecurityStatusModel:
        return await self.repository_create.create(
            data=data
        )

    async def get_login_status(
        self,
        data: LoginSecurityStatusRead
    ) -> Optional[LoginSecurityStatusModel]:
        return await self.repository_read.get_login_status(
            data=data
        )
