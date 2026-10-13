# app/repositories/security/security_status/resend_otp/base.py

from typing import Optional

from abc import ABC, abstractmethod

from app.models.security.security_status.resend_otp import (
    ResendOtpSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.resend_otp.read import (
    ResendOtpSecurityStatusRead
)

class ResendOtpSecurityStatusRepositoryBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: ResendOtpSecurityStatusModel
    ) -> ResendOtpSecurityStatusModel:
        pass
