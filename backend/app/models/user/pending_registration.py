# app/models/user/pending_registration.py

from datetime import datetime, timezone
from app.models.user.validators import UserValidators
from typing import Optional

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)


class PendingRegistrationModel(UserValidators, BaseModel):

    id: Optional[str] = Field(
        default=None,
        alias="_id"
    )

    name: str
    email: EmailStr
    hashed_password: str = Field(min_length=8, max_length=100)
    image: Optional[str] = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    expires_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        extra="forbid",
        str_strip_whitespace=True,
    )
