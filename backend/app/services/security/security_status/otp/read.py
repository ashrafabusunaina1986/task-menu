# app/services/security/security_status/otp/read.py

from typing import Optional

from app.models.security.security_status.otp import (
    OTPStatusModel
)
from app.repositories.security.security_status.otp.repository import OTPRepository


class OTPServiceRead:
    def __init__(
        self,
        repository: OTPRepository
    ):
        self.repository = repository

    async def get_active_by_user_id(
        self,
        user_id: str
    ) -> Optional[OTPStatusModel]:
        return await self.repository.get_active_by_user_id(
            user_id=user_id
        )
