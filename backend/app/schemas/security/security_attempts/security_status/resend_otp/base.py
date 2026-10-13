# app/schemas/security/security_attempts/security_status/resend_otp/base.py

from pydantic import EmailStr, BaseModel


from app.schemas.security.security_attempts.base import (
    SecurityAttemptStatus,
    SecurityOperation,
    SecurityAttemptReason,
)


class ResendOtpSecurityStatusBase(BaseModel):
    user_id: str | None = None
    security_attempts_id: str | None = None

    email: EmailStr
    operation: SecurityOperation = SecurityOperation.RESEND_OTP

    status: SecurityAttemptStatus
    reason: SecurityAttemptReason | None = None
