# app/models/security/security_attempts.py

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field
from app.schemas.security.security_attempts.base import (
    SecurityOperation,
)


class SecurityAttemptsModel(BaseModel):
    id: Optional[str] = Field(
        default=None,
        alias="_id"

    )

    user_id: Optional[str] = None
    ip_id: Optional[str] = None
    device_id: Optional[str] = None
    session_id: Optional[str] = None
    register_id: Optional[str] = None

    type_operation: SecurityOperation  # لاحقا enum

    attempts: int = Field(
        default=0,
        ge=0
    )
    max_attempts: int = Field(
        default=5,
        gt=0
    )
    is_blocked: bool = False

    is_current: bool = True

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    last_attempt_at: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        extra='forbid',
        str_strip_whitespace=True
    )
