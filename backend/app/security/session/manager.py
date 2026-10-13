# app/security/session/manager.py

from app.services.session.service import SessionService


class SessionManagerService:

    def __init__(
        self,
        session_service: SessionService
    ):
        self.session_service = session_service

    async def get_session(
        self,
        session_id: str
    ):
        """
        Return a session.
        """
        return await self.session_service.get_by_id(
            session_id=session_id
        )

    async def get_by_refresh_token(
        self,
        refresh_token: str
    ):
        """
        Return session by refresh token
        """
        return await self.session_service.get_by_refresh_token(
            refresh_token=refresh_token
        )

    async def get_user_sessions(
        self,
        user_id: str
    ):
        """
        Return all active sessions.
        """
        sessions = await self.session_service.get_by_user(
            user_id=user_id
        )

        return [
            session
            for session in sessions
            if session.get("active") is True
        ]



