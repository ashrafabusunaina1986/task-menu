# app/schemas/user/update.py

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field
)
from app.models.user.validators import (
    UserValidators
)

from app.security.permissions.roles import Role


class UserUpdate(UserValidators, BaseModel):
    name: str | None = Field(
        default=None,
        min_length=3,
        max_length=100
    )

    email: EmailStr | None = None
    role: Role | None = None

    password: str | None = Field(
        default=None,
        min_length=8,
        max_length=120
    )

    image: str | None = None

    is_active: bool | None = None

    is_verified: bool | None = None

    model_config = ConfigDict(
        validate_assignment=True,
        str_strip_whitespace=True,
        extra='forbid'
    )
