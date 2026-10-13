# app/schemas/user/pending_register/response.py

from pydantic import EmailStr, BaseModel
from typing import Optional
from datetime import datetime


class PendingRegisterResponse(BaseModel):

    id: Optional[str] = None

    name: str

    email: EmailStr

    expires_at: datetime

    created_at: datetime
