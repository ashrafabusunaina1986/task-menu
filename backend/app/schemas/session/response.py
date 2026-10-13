# app/schemas/session/response.py

from datetime import datetime

from app.schemas.session.base import SessionBase


class SessionResponse(SessionBase):

    id: str

    user_id: str

    active: bool

    created_at: datetime

    revoked_at: datetime | None = None
