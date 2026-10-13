# app/schemas/security/security_attempts/security_status/register/base.py

from typing import Optional

from pydantic import BaseModel, EmailStr
from app.schemas.security.security_attempts.base import (
    SecurityAttemptReason,
    SecurityAttemptStatus,
    SecurityOperation
)


class RegisterSecurityStatusBase(BaseModel):

    security_attempts_id: Optional[str] = None

    email: EmailStr

    operation: SecurityOperation = SecurityOperation.REGISTER

    status: SecurityAttemptStatus

    reason: Optional[SecurityAttemptReason] = None
