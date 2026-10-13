# app/schemas/security/security_attempts/security_status/register/response.py
from datetime import datetime

from app.schemas.security.security_attempts.security_status.register.base import (
    RegisterSecurityStatusBase
)


class RegisterSecurityStatusCreate(RegisterSecurityStatusBase):

    id: str

    created_at: datetime

    updated_at: datetime
