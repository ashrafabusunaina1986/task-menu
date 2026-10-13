# app/schemas/auth/login.py

from datetime import datetime
from pydantic import BaseModel


class LoginBlockedResponse(BaseModel):
    blocked: bool = True
    reason: str
    blocked_until: datetime