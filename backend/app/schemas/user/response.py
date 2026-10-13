# app/schemas/user/response.py

from datetime import (
    datetime
)
from pydantic import (
    BaseModel,
    ConfigDict,
    EmailStr,
    Field
)


class UserResponse(BaseModel):
    id: str = Field(
        alias="_id"
    )

    name: str
    email: EmailStr

    image: str | None = None

    is_active: bool
    is_verified: bool

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid"
    )
