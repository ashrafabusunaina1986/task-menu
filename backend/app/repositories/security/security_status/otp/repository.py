# app/repositories/otp/repository.py

from app.models.security.security_status.otp import (
    OTPStatusModel
)

from app.repositories.security.security_status.otp.base import OTPRepositoryBase
from app.repositories.security.security_status.otp.create import OTPCreateRepository
from app.repositories.security.security_status.otp.read import OTPReadRepository
from app.repositories.security.security_status.otp.update import OTPUpdateRepository

from typing import Optional
from datetime import datetime


class OTPRepository(OTPRepositoryBase):

    def __init__(self):
        self.create_repository = OTPCreateRepository()
        self.read_repository = OTPReadRepository()
        self.update_repository = OTPUpdateRepository()

    async def create(
        self,
        otp: OTPStatusModel
    ) -> OTPStatusModel:
        return await self.create_repository.create(
            otp=otp
        )

    async def get_active_by_user_id(
        self,
        register_id: str | None,
        user_id: str | None
    ) -> Optional[OTPStatusModel]:
        return await self.read_repository.get_active_by_user_id(
            user_id=user_id,
            register_id=register_id
        )

    async def mark_used(
        self,
        otp_id: str
    ) -> bool:
        return await self.update_repository.mark_used(otp_id)

    async def resend(
        self,
        otp_id: str,
        otp_hash: str,
        expires_at: datetime
    ) -> bool:
        return await self.update_repository.resend(
            otp_id=otp_id,
            otp_hash=otp_hash,
            expires_at=expires_at
        )
