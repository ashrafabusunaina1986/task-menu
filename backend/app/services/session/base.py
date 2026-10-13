# app/services/session/base.py

from app.repositories.session.repository import SessionRepository


class SessionServiceBase:
    def __init__(
        self,
        repository: SessionRepository
    ):
        self.repository = repository

