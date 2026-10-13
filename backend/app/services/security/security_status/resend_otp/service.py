# app/services/security/security_status/resend_otp/service.py

from app.services.security.security_status.resend_otp.base import (
    ResendOtpSecurityStatusServiceBase
)
from app.models.security.security_status.resend_otp import (
    ResendOtpSecurityStatusModel
)
from app.services.security.security_status.resend_otp.create import (
    ResendOtpSecurityStatusServiceCreate
)

from app.schemas.security.security_attempts.security_status.resend_otp.create import (
    ResendOtpSecurityStatusCreate
)

class ResendOtpSecurityStatusServices(ResendOtpSecurityStatusServiceBase):

    def __init__(
        self,
        service_create: ResendOtpSecurityStatusServiceCreate
    ):
        self.service_create = service_create

    async def create(
        self,
        data: ResendOtpSecurityStatusCreate
    ) -> ResendOtpSecurityStatusModel:
        return await self.service_create.create(
            data=data
        )
