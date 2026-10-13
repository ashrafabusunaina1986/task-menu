# app/services/security/security_status/resend_otp/create.py

from datetime import datetime, timezone

from app.models.security.security_status.resend_otp import (
    ResendOtpSecurityStatusModel
)

from app.repositories.security.security_status.resend_otp.repository import ResendOtpSecurityStatusRepository

from app.schemas.security.security_attempts.security_status.resend_otp.create import (
    ResendOtpSecurityStatusCreate
)

class ResendOtpSecurityStatusServiceCreate:

    def __init__(
        self,
        repository: ResendOtpSecurityStatusRepository
    ):
        self.repository = repository

    async def create(
        self,
        data: ResendOtpSecurityStatusCreate
    ) -> ResendOtpSecurityStatusModel:

        now = datetime.now(timezone.utc)

        data_model = data.model_dump()

        data_model = ResendOtpSecurityStatusModel(
            **data_model,
            created_at=now,
            updated_at=now
        )

        return await self.repository.create(
            data=data_model
        )
