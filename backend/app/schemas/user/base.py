# app/schemas/user/base.py

from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field
)

from app.models.user.validators import UserValidators


class UserBase(UserValidators, BaseModel):
    name: str = Field(
        min_length=3,
        max_length=100
    )

    email: EmailStr

    image: str | None = Field(
        default=None,
        max_length=500
    )

    model_config = ConfigDict(
        validate_assignment=True,
        str_strip_whitespace=True,
        extra='forbid'
    )
