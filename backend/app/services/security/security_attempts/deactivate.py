# app/services/security/security_attempts/deactivate.py


from app.repositories.security.security_attempts.repository import (
    SecurityAttemptsRepository
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)


class SecurityAttemptsServiceDeactivate:
    def __init__(
        self,
        repository: SecurityAttemptsRepository
    ):
        self.security_attempts_repository = repository

    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate
    ) -> bool:
        return await self.security_attempts_repository.deactivate(
            data=data
        )
