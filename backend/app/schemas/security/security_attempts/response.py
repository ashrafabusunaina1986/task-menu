# app/schemas/security/security_attempts/response.py

from datetime import datetime


from app.schemas.security.security_attempts.base import (
    SecurityAttemptsBase
)


class SecurityAttemptsResponse(SecurityAttemptsBase):

    id: str

    type_operation: str

    attempts: int

    max_attempts: int

    is_blocked: bool

    is_current: bool

    created_at: datetime

    updated_at: datetime
