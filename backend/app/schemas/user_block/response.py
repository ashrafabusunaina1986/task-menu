# app/schemas/user_block/response.py

from app.schemas.user_block.base import UserBlockBase
from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class UserBlockResponse(UserBlockBase):
    id: str
    blocked_at: datetime
    is_active: bool
    created_at: datetime
    updated_at: datetime


class BlockStatusResponse(BaseModel):
    blocked: bool
    reason: Optional[str] = None
    blocked_until: Optional[str] = None
