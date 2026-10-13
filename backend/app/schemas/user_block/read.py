# app/schemas/user_block/read.py

from typing import Optional
from pydantic import BaseModel

from app.models.user_block.user_block import (
    BlockType
)


class UserBlockRead(BaseModel):
    session_id: Optional[str] = None
    user_id: Optional[str] = None
    register_id: Optional[str] = None
    ip_id: Optional[str] = None
    device_id: Optional[str] = None
    block_type: BlockType
