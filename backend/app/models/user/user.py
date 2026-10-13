# app/models/user/user.py

from datetime import datetime, timezone
from typing import Optional
from app.models.user.validators import UserValidators
from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field,
)

from app.security.permissions.roles import Role


class User(UserValidators, BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")

    name: str
    email: EmailStr

    hashed_password: Optional[str] = None

    auth_providers: list[str] = Field(
        default_factory=list
    )
    google_id: Optional[str] = None

    role: Role = Role.USER

    image: Optional[str] = None

    is_active: bool = True
    is_verified: bool = False

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        validate_assignment=True,
        extra='forbid',
        str_strip_whitespace=True,
    )

