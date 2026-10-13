# app/security/session/create.py

from app.schemas.session.create import SessionCreate
from app.services.session.service import SessionService


class SessionCreateService:

    def __init__(
        self,
        session_service: SessionService
    ):
        self.session_service = session_service

    async def create(
        self,
        user_id: str,
        refresh_token: str,
        device: str | None = None,
        ip_address: str | None = None,
    ) -> str:
        """
        Create a new user session.
        """

        session_data = SessionCreate(
            user_id=user_id,
            refresh_token=refresh_token,
            device=device,
            ip_address=ip_address
        )
        return await self.session_service.create(
            session_data=session_data
        )





