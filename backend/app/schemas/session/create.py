# app/schemas/session/create.py

from app.schemas.session.base import SessionBase


class SessionCreate(SessionBase):

    user_id: str

    refresh_token: str
