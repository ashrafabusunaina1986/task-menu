from datetime import datetime, timezone
from enum import Enum

from app.models.security.security_status.otp import (
    OTPStatusModel
)

from app.repositories.security.security_status.otp.repository import (
    OTPRepository
)

from app.security.otp.generator import OTPGenerator
from app.security.otp.hasher import OTPHasher
from app.security.otp.verifier import OTPVerifier


class OTPVerificationResult(str, Enum):
    VALID = "valid"
    NOT_FOUND = "otp_not_found"
    EXPIRED = "otp_expired"
    INVALID = "invalid_otp"
    INVALID_RECORD = "otp_invalid_record"


class OTPService:

    def __init__(
        self,
        otp_repository: OTPRepository,
    ):
        self.otp_repository = otp_repository

    async def create(
        self,
        expires_at: datetime,
        user_id: str | None = None,
        register_id: str | None = None,

    ) -> str:

        otp = OTPGenerator.generate()

        otp_hash = OTPHasher.hash(
            otp=otp
        )
        if (bool(user_id) == bool(register_id)):
            raise ValueError(
                "Provide exactly one of user_id or register_id"
            )

        otp_model = OTPStatusModel(
            user_id=user_id,
            register_id=register_id,
            otp_hash=otp_hash,
            expires_at=expires_at
        )

        await self.otp_repository.create(
            otp=otp_model
        )

        return otp

    async def verify(
        self,
        otp: str,
        user_id: str | None = None,
        register_id: str | None = None,

    ) -> OTPVerificationResult:
        if bool(user_id) == bool(register_id):
            raise ValueError(
                "Provide exactly one of user_id or register_id"
            )
        otp_record = (
            await self.otp_repository.get_active_by_user_id(
                user_id=user_id,
                register_id=register_id
            )
        )

        if not otp_record:
            return OTPVerificationResult.NOT_FOUND

        now = datetime.now(timezone.utc)

        if now >= otp_record.expires_at:
            return OTPVerificationResult.EXPIRED

        if otp_record.id is None:
            return OTPVerificationResult.INVALID_RECORD

        valid = OTPVerifier.verify(
            otp=otp,
            otp_hash=otp_record.otp_hash
        )

        if not valid:
            return OTPVerificationResult.INVALID

        await self.otp_repository.mark_used(
            otp_id=otp_record.id
        )

        return OTPVerificationResult.VALID
