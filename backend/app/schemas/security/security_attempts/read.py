# app/schemas/security/security_attempts/read.py
from typing import Optional
from pydantic import BaseModel

from app.schemas.security.security_attempts.base import (
    SecurityOperation,
)


class SecurityAttemptsRead(BaseModel):
    user_id: Optional[str] = None
    ip_id: Optional[str] = None
    device_id: Optional[str] = None
    session_id: Optional[str] = None
    register_id:Optional[str]=None
    type_operation: SecurityOperation
