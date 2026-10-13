# app/services/security/security_attempts/read.py
from typing import Optional

from app.repositories.security.security_attempts.repository import (
    SecurityAttemptsRepository
)
from app.models.security.security_attempts import (
    SecurityAttemptsModel
)

from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)


class SecurityAttemptsServiceRead:

    def __init__(
        self,
        repository: SecurityAttemptsRepository
    ):
        self.security_attempts_repository = repository

    async def get_by_user_and_operation(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        return await self.security_attempts_repository.get_by_user_and_operation(
            data=data
        )

    async def get_current_by_context(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        return await self.security_attempts_repository.get_current_by_context(
            data=data
        )
        
        
    
