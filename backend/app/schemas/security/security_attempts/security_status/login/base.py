# app/schemas/security/security_attempts/security_status/login/base.py

from typing import Optional

from pydantic import BaseModel, EmailStr
from app.schemas.security.security_attempts.base import (
    SecurityOperation,
    SecurityAttemptReason,
    SecurityAttemptStatus
)
from app.security.otp.service import OTPVerificationResult


class LoginSecurityStatusBase(BaseModel):

    security_attempts_id: Optional[str] = None

    user_id: Optional[str] = None

    email: EmailStr

    operation: SecurityOperation = SecurityOperation.LOGIN

    status: SecurityAttemptStatus

    reason: Optional[SecurityAttemptReason | OTPVerificationResult] = None
