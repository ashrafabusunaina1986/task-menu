# app/security/session/revoke.py

from datetime import datetime, timezone

from app.services.session.service import SessionService


class SessionRevokeService:

    def __init__(
        self,
        session_service: SessionService
    ):
        self.session_service = session_service

    async def revoke(
        self,
        session_id: str
    ) -> bool:
        """
        Revoke a single session.
        """
        return await self.session_service.update(
            session_id=session_id,
            data={
                "active": False,
                "revoked_at": datetime.now(timezone.utc)
            }
        )

    async def revoke_all(
        self,
        user_id: str,
    ) -> int:
        """
        Revoke all user sessions.
        """
        sessions = await self.session_service.get_by_user(
            user_id=user_id
        )

        count = 0
        now = datetime.now(timezone.utc)
        for session in sessions:
            if session.get("active"):
                await self.session_service.update(
                    session_id=session["_id"],
                    data={
                        "active": False,
                        "revoked_at": now
                    }
                )

                count += 1
        return count






