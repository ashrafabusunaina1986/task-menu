# app/services/otp/service.py

from typing import Optional
from datetime import datetime

from app.models.security.security_status.otp import (
    OTPStatusModel
)

from app.services.security.security_status.otp.read import OTPServiceRead
from app.services.security.security_status.otp.update import OTPServiceUpdate
from app.services.security.security_status.otp.resend import OTPServiceResend


class OTPService:
    def __init__(
        self,
        otp_service_read: OTPServiceRead,
        otp_service_update: OTPServiceUpdate,
        otp_service_resend: OTPServiceResend,
    ):
        self.otp_service_read = otp_service_read
        self.otp_service_update = otp_service_update
        self.otp_service_resend = otp_service_resend

    async def get_active_by_user_id(
        self,
        user_id: str
    ) -> Optional[OTPStatusModel]:
        return await self.otp_service_read.get_active_by_user_id(
            user_id=user_id
        )

    async def mark_used(
        self,
        otp_id: str
    ) -> bool:
        return await self.otp_service_update.mark_used(
            otp_id=otp_id
        )

    async def resend(
        self,
        otp_id: str,
        otp_hash: str,
        expires_at: datetime
    ) -> bool:
        return await self.otp_service_resend.resend(
            otp_id=otp_id,
            otp_hash=otp_hash,
            expires_at=expires_at
        )
