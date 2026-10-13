# app/services/otp/update.py


from app.repositories.security.security_status.otp.repository import OTPRepository


class OTPServiceUpdate:

    def __init__(
        self,
        repository: OTPRepository
    ):
        self.repository = repository

    async def increment_attempts(
        self,
        otp_id: str
    ) -> bool:
        return await self.repository.increment_attempts(
            otp_id=otp_id
        )

    async def mark_used(
        self,
        otp_id: str
    ) -> bool:
        return await self.repository.mark_used(
            otp_id=otp_id
        )

