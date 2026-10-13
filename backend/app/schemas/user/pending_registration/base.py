# app/schemas/user/pending_registration/base.py

from pydantic import EmailStr, BaseModel, Field


class PendingRegisterBase(BaseModel):

    name: str

    email: EmailStr

    password: str = Field(min_length=8, max_length=100)

    image: str | None = None
