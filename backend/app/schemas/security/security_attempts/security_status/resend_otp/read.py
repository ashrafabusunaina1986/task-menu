# app/schemas/security/security_attempts/security_status/resend_otp/read.py
from datetime import datetime

from pydantic import ConfigDict

from app.schemas.security.security_attempts.security_status.resend_otp.base import (
    ResendOtpSecurityStatusBase
)


class ResendOtpSecurityStatusRead(ResendOtpSecurityStatusBase):

    id: str
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        populate_by_name=True
    )
