# app/models/session/validator.py

from pydantic import BaseModel


class SessionValidator(BaseModel):

    user_id: str

    refresh_token: str

    device: str | None = None

    ip_address: str | None = None
