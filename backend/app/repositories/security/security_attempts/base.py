# app/repositories/security/security_attempts/base.py
from abc import ABC, abstractmethod
from typing import Optional

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)
from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)

from app.core.database import (
    get_security_attempts_collection
)


class SecurityAttemptsRepositoryBase(ABC):

    @property
    def collection(self):
        return get_security_attempts_collection()

    @abstractmethod
    async def create(
        self,
        data: SecurityAttemptsCreate
    ) -> SecurityAttemptsModel:
        pass

    @abstractmethod
    async def get_by_user_and_operation(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        pass

    @abstractmethod
    async def get_current_by_context(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        pass

    @abstractmethod
    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate
    ) -> bool:
        pass

    @abstractmethod
    async def update(
        self,
        data: SecurityAttemptsUpdate
    ) -> bool:
        pass
