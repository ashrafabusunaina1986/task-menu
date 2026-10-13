# app/schemas/security/security_attempts/security_status/login/response.py

from datetime import datetime

from app.schemas.security.security_attempts.security_status.login.base import (
    LoginSecurityStatusBase
)


class LoginSecurityStatusResponse(LoginSecurityStatusBase):

    id: str

    created_at: datetime

    updated_at: datetime
