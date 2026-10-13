# app/schemas/user/create.py
from pydantic import Field
from app.schemas.user.base import UserBase


class UserCreate(UserBase):
    password: str = Field(
        min_length=8,
        max_length=128
    )
    
