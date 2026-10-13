# app/services/security/security_attempts/create.py

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)
from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate,
)

from app.schemas.security.security_attempts.base import (
    SecurityOperation,
)

from app.repositories.security.security_attempts.repository import (
    SecurityAttemptsRepository
)


class SecurityAttemptsServiceCreate:

    def __init__(
        self,
        repository: SecurityAttemptsRepository
    ):
        self.security_attempts_repository = repository

    async def create(
        self,
        data: SecurityAttemptsCreate
    ) -> SecurityAttemptsModel:
        
        
        return await self.security_attempts_repository.create(
            data=data
        )
