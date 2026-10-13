# app/schemas/security/security_attempts/security_status/otp/otp.py

from pydantic import BaseModel, EmailStr, Field


class OTPRequest(BaseModel):
    email: EmailStr


class OTPVerify(BaseModel):
    user_id: str | None = None
    register_token: str | None = None
    otp: str = Field(
        min_length=6,
        max_length=6,
        pattern=r"^\d{6}$"
    )
