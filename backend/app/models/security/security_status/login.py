# app/models/security/security_status/login.py

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, EmailStr

from app.schemas.security.security_attempts.base import (
    SecurityAttemptStatus,
    SecurityOperation,
    SecurityAttemptReason
)
from app.security.otp.service import OTPVerificationResult


class LoginSecurityStatusModel(BaseModel):

    id: Optional[str] = Field(
        default=None,
        alias="_id"
    )

    security_attempts_id: Optional[str] = None

    user_id: Optional[str] = None

    email: EmailStr

    operation: SecurityOperation = SecurityOperation.LOGIN

    status: SecurityAttemptStatus

    reason: Optional[SecurityAttemptReason | OTPVerificationResult] = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        extra='forbid',
        str_strip_whitespace=True
    )
