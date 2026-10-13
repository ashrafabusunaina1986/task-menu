# app/schemas/user_block/base.py

from datetime import datetime

from pydantic import BaseModel

from typing import Optional
from enum import Enum

from app.models.user_block.user_block import (
    BlockType
)


class BlockedUntilStatus(int, Enum):
    LOGIN = 2
    LOGIN_OTP = 3
    GOOGLE_LOGIN = 3
    REGISTER = 1
    REGISTER_OTP = 5
    RESEND_OTP = 2


class UserBlockBase(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    register_id: Optional[str] = None
    ip_id: Optional[str] = None
    device_id: Optional[str] = None
    block_type: BlockType
    reason: str
    blocked_until: datetime
