# app/models/security/security_status/resend_otp.py

from datetime import datetime, timezone

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.schemas.security.security_attempts.base import (
    SecurityAttemptStatus,
    SecurityOperation,
    SecurityAttemptReason
)


class ResendOtpSecurityStatusModel(BaseModel):

    id: str | None = Field(default=None, alias="_id")
    security_attempts_id: str 

    user_id: str 

    email: EmailStr
    operation: SecurityOperation = SecurityOperation.RESEND_OTP

    status: SecurityAttemptStatus

    reason: SecurityAttemptReason | None = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        extra="forbid",
        str_strip_whitespace=True,
    )
