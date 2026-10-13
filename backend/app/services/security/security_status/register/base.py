# app/services/security/security_status/register/base.py

from typing import Optional
from abc import ABC, abstractmethod

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.register.read import (
    RegisterSecurityStatusRead
)
from app.schemas.security.security_attempts.security_status.register.create import (
    RegisterSecurityStatusCreate
)


class RegisterSecurityStatusServiceBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: RegisterSecurityStatusCreate
    ) -> RegisterSecurityStatusModel:
        pass

    @abstractmethod
    async def get_register_status(
        self,
        data: RegisterSecurityStatusRead
    ) -> Optional[RegisterSecurityStatusModel]:
        pass
