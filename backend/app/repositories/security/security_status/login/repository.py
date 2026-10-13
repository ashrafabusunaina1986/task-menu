# app/repositories/security/security_status/login/repository.py

from typing import Optional

from app.repositories.security.security_status.login.base import (
    LoginSecurityStatusBase
)

from app.repositories.security.security_status.login.create import (
    LoginSecurityStatusRepositoryCreate
)

from app.repositories.security.security_status.login.read import (
    LoginSecurityStatusRepositoryRead
)


from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.login.read import (
    LoginSecurityStatusRead
)

from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)


class LoginSecurityStatusRepository(
    LoginSecurityStatusBase
):

    def __init__(
        self,
        create: LoginSecurityStatusRepositoryCreate,
        read: LoginSecurityStatusRepositoryRead
    ):
        self.login_status_repository_create = create
        self.login_status_repository_read = read

    async def create(
        self,
        data: LoginSecurityStatusCreate
    ) -> LoginSecurityStatusModel:
        return await self.login_status_repository_create.create(
            data=data
        )

    async def get_login_status(
        self,
        data: LoginSecurityStatusRead
    ) -> Optional[LoginSecurityStatusModel]:
        return await self.login_status_repository_read.get_login_status(
            data=data
        )
