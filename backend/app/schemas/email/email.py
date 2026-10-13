# app/schemas/email/email.py

from pydantic import BaseModel, EmailStr


class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    detail: str


class EmailUserResponse(BaseModel):
    email: EmailStr


class EmailUserRequest(BaseModel):
    user_id: str
