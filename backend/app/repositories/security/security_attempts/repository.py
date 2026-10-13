# app/repositories/security/security_attempts/repository.py

from typing import Optional

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)
from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate
)
from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)


from app.repositories.security.security_attempts.base import (
    SecurityAttemptsRepositoryBase
)

from app.repositories.security.security_attempts.create import (
    SecurityAttemptsRepositoryCreate
)
from app.repositories.security.security_attempts.read import (
    SecurityAttemptsRepositoryRead
)
from app.repositories.security.security_attempts.update import (
    SecurityAttemptsRepositoryUpdate
)
from app.repositories.security.security_attempts.deactivate import (
    SecurityAttemptsRepositoryDeactivate
)


class SecurityAttemptsRepository(
    SecurityAttemptsRepositoryBase
):

    def __init__(
        self,
        repository_create: SecurityAttemptsRepositoryCreate,
        repository_read: SecurityAttemptsRepositoryRead,
        repository_update: SecurityAttemptsRepositoryUpdate,
        repository_deactivate: SecurityAttemptsRepositoryDeactivate
    ):
        self.repository_create = repository_create
        self.repository_read = repository_read
        self.repository_update = repository_update
        self.repository_deactivate = repository_deactivate

    async def create(
        self,
        data: SecurityAttemptsCreate
    ) -> SecurityAttemptsModel:
        return await self.repository_create.create(
            data=data
        )

    async def get_by_user_and_operation(
            self,
            data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        return await self.repository_read.get_by_user_and_operation(
            data=data
        )

    async def get_current_by_context(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        return await self.repository_read.get_current_by_context(
            data=data
        )

    async def update(
        self,
        data: SecurityAttemptsUpdate
    ) -> bool:
        return await self.repository_update.update(
            data=data
        )

    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate
    ) -> bool:
        return await self.repository_deactivate.deactivate(
            data=data
        )
