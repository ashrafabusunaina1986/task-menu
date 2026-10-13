# app/schemas/user/pending_registration/read.py

from pydantic import BaseModel


class PendingRegisterRead(BaseModel):

    register_id: str
