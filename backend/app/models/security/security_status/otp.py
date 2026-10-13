# app/models/security/security_status/otp.py

from datetime import datetime, timezone
from typing import Optional

from pydantic import BaseModel, ConfigDict, Field


class OTPStatusModel(BaseModel):

    id: Optional[str] = Field(
        default=None,
        alias="_id"
    )

    user_id: Optional[str] = None

    register_id: Optional[str] = None

    otp_hash: str

    expires_at: datetime

    used: bool = False

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
