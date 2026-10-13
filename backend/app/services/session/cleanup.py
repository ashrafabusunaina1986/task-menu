# app/services/session/cleanup.py

from app.services.session.base import SessionServiceBase


class SessionCleanupService(
    SessionServiceBase
):

    async def cleanup(
        self,
    ) -> int:
        return await self.repository.cleanup()
