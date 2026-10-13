# app/schemas/security/security_attempts/update.py

from pydantic import BaseModel


class SecurityAttemptsUpdate(BaseModel):
    security_attempts_id: str
