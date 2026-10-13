# app/repositories/security/security_status/otp/base.py

from abc import ABC, abstractmethod
from typing import Optional
from datetime import datetime

from app.models.security.security_status.otp import (
    OTPStatusModel
)


class OTPRepositoryBase(ABC):

    @abstractmethod
    async def create(
        self,
        otp: OTPStatusModel
    ) -> OTPStatusModel:
        pass

    @abstractmethod
    async def get_active_by_user_id(
        self,
        user_id: str
    ) -> Optional[OTPStatusModel]:
        pass

    @abstractmethod
    async def mark_used(
        self,
        otp_id: str
    ) -> bool:
        pass

    @abstractmethod
    async def resend(
        self,
        otp_id: str,
        otp_hash: str,
        expires_at: datetime
    ) -> bool:
        pass
