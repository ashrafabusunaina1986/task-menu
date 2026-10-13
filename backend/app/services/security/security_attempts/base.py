# app/services/security/security_attempts/base.py

from typing import Optional
from abc import ABC, abstractmethod

from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)
from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)


class SecurityAttemptsServiceBase(ABC):

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
    async def update(
        self,
        data: SecurityAttemptsUpdate
    ) -> bool:
        pass

    @abstractmethod
    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate
    ) -> bool:
        pass
