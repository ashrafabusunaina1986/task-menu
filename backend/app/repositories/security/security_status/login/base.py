# app/repositories/security/security_status/login/base.py

from abc import ABC, abstractmethod
from typing import Optional


from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)
from app.schemas.security.security_attempts.security_status.login.read import (
    LoginSecurityStatusRead
)


class LoginSecurityStatusBase(ABC):

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
