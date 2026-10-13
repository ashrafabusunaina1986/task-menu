# app/services/security/security_status/login/read.py

from typing import Optional

from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)

from app.repositories.security.security_status.login.read import (
    LoginSecurityStatusRepositoryRead
)
from app.schemas.security.security_attempts.security_status.login.read import (
    LoginSecurityStatusRead
)


class LoginSecurityStatusServiceRead:

    def __init__(
        self,
        repository: LoginSecurityStatusRepositoryRead
    ):
        self.repository = repository

    async def get_login_status(
        self,
        data: LoginSecurityStatusRead
    ) -> Optional[LoginSecurityStatusModel]:
        return await self.repository.get_login_status(
            data=data
        )
