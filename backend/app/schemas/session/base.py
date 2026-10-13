# app/schemas/session/base.py

from pydantic import BaseModel


class SessionBase(BaseModel):
    device: str | None = None

    ip_address: str | None = None
