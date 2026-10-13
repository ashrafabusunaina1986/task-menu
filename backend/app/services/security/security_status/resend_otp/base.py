# app/services/security/security_status/resend_otp/base.py

from abc import ABC, abstractmethod

from app.models.security.security_status.resend_otp import (
    ResendOtpSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.resend_otp.create import (
    ResendOtpSecurityStatusCreate
)


class ResendOtpSecurityStatusServiceBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: ResendOtpSecurityStatusCreate
    ) -> ResendOtpSecurityStatusModel:
        pass
