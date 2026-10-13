# app/schemas/user_block/update.py

from pydantic import BaseModel

from datetime import datetime
from typing import Optional


class UserBlockUpdate(BaseModel):
    blocked_until: Optional[datetime] = None
