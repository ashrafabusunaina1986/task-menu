# app/security/auth/logout.py

from app.security.session.service import SessionService
from app.services.user.service import UserService

from app.schemas.user.update import UserUpdate

from fastapi import HTTPException, status


class LogoutService:

    def __init__(
        self,
        session_service: SessionService,
        user_service: UserService
    ):
        self.session_service = session_service
        self.user_service = user_service

    async def logout(
        self,
        refresh_token: str
    ) -> bool:

        session = await self.session_service.manager.get_by_refresh_token(
            refresh_token=refresh_token
        )

        if not session:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Session not found"
            )
        # ====================
        # user not verified
        # ====================
        user_id = session["user_id"]

        await self.user_service.update(
            user_id=user_id,
            data=UserUpdate(
                is_verified=False
            )
        )

        session_id = session["_id"]
        """
        Revoke current session/token.
        """
        return await self.session_service.revoke.revoke(
            session_id=session_id
        )
