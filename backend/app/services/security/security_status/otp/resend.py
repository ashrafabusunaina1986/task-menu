# app/services/otp/resend.py

from datetime import datetime

from app.repositories.security.security_status.otp.repository import OTPRepository


class OTPServiceResend:

    def __init__(
        self,
        repository: OTPRepository
    ):
        self.repository = repository

    async def resend(
        self,
        otp_id: str,
        otp_hash: str,
        expires_at: datetime
    ) -> bool:
        return await self.repository.resend(
            otp_id=otp_id,
            otp_hash=otp_hash,
            expires_at=expires_at
        )
