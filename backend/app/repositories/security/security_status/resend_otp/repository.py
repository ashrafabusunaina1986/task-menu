# app/repositories/security/security_status/resend_otp/repository.py

from app.repositories.security.security_status.resend_otp.base import (
    ResendOtpSecurityStatusRepositoryBase
)
from app.models.security.security_status.resend_otp import (
    ResendOtpSecurityStatusModel
)
from app.repositories.security.security_status.resend_otp.create import (
    ResendOtpSecurityStatusRepositoryCreate
)


class ResendOtpSecurityStatusRepository(ResendOtpSecurityStatusRepositoryBase):

    def __init__(
        self,
        repository_create: ResendOtpSecurityStatusRepositoryCreate
    ):
        self.repository_create = repository_create

    async def create(
        self,
        data: ResendOtpSecurityStatusModel
    ) -> ResendOtpSecurityStatusModel:
        return await self.repository_create.create(
            data=data
        )
