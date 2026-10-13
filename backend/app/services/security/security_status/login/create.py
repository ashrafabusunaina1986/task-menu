# app/services/security/security_status/login/create.py


from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)

from app.repositories.security.security_status.login.create import (
    LoginSecurityStatusRepositoryCreate
)
from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)


class LoginSecurityStatusServiceCreate:

    def __init__(
        self,
        repository: LoginSecurityStatusRepositoryCreate
    ):
        self.repository = repository

    async def create(
        self,
        data: LoginSecurityStatusCreate
    ) -> LoginSecurityStatusModel:
        return await self.repository.create(
            data=data
        )
