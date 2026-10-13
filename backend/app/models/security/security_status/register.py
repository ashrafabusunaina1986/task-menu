# app/models/security/security_status/register.py

from datetime import datetime, timezone
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    Field,
    EmailStr
)
from app.schemas.security.security_attempts.base import(
    SecurityAttemptStatus, 
    SecurityOperation,
    SecurityAttemptReason
)
class RegisterSecurityStatusModel(BaseModel):

    id: Optional[str] = Field(
        default=None,
        alias="_id"
    )

    security_attempts_id: Optional[str] = None

    email: EmailStr

    operation: SecurityOperation = SecurityOperation.REGISTER

    status: SecurityAttemptStatus

    reason: Optional[SecurityAttemptReason] = None

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
