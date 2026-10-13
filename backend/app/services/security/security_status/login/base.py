# app/services/security/security_status/login/base.py

from typing import Optional
from abc import ABC, abstractmethod

from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)

from app.schemas.security.security_attempts.security_status.login.read import (
    LoginSecurityStatusRead
)
from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)


class LoginSecurityStatusServiceBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: LoginSecurityStatusCreate
    ) -> LoginSecurityStatusModel:
        pass

    @abstractmethod
    async def get_login_status(
        self,
        data: LoginSecurityStatusRead
    ) -> Optional[LoginSecurityStatusModel]:
        pass
