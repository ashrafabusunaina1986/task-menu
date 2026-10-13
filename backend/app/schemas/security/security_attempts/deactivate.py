# app/schemas/security/security_attempts/deactivate.py

from pydantic import BaseModel
from typing import Optional


class SecurityAttemptsDeactivate(BaseModel):
    session_id: Optional[str] = None
    ip_id: str
    device_id: str
    user_id: Optional[str] = None
    type_operation: str
