# app/security/session/cleanup.py


from app.services.session.service import SessionService


class SessionCleanupService:

    def __init__(
        self,
        session_service: SessionService
    ):
        self.session_service = session_service

    async def cleanup(self) -> int:
        """
        Remove expired sessions.
        """
        return await self.session_service.cleanup()
