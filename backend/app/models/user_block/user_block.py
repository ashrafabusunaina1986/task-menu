# app/models/user_block/user_block.py

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field

from enum import Enum

from app.schemas.security.security_attempts.base import (
    SecurityAttemptReason,
)


class BlockType(str, Enum):
    USER = "user"
    IP = "ip"
    DEVICE = "device"
    REGISTER = "register"


class UserBlockModel(BaseModel):

    id: Optional[str] = Field(
        default=None,
        alias="_id"
    )
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    register_id: Optional[str] = None
    ip_id: Optional[str] = None
    device_id: Optional[str] = None

    block_type: BlockType

    reason: SecurityAttemptReason

    blocked_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    blocked_until: datetime

    is_active: bool = True

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
