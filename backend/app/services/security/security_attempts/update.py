# app/services/security/security_attempts/update.py

from app.repositories.security.security_attempts.repository import (
    SecurityAttemptsRepository
)

from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)


class SecurityAttemptsServiceUpdate:

    def __init__(
        self,
        repository: SecurityAttemptsRepository
    ):
        self.security_attempts_repository = repository

    async def update(
        self,
        data: SecurityAttemptsUpdate
    ) -> bool:

        return await self.security_attempts_repository.update(
            data=data
        )
