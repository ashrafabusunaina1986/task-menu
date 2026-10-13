# app/services/session/read.py

from fastapi import HTTPException

from app.services.session.base import SessionServiceBase


class SessionReadService(
    SessionServiceBase
):

    async def get_by_id(
        self,
        session_id: str
    ):
        session = await self.repository.get_by_id(
            session_id=session_id
        )

        if not session:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )

        return session

    async def get_by_user(
        self,
        user_id: str
    ):
        return await self.get_by_user(
            user_id=user_id
        )

    async def get_by_refresh_token(
        self,
        refresh_token: str
    ):
        return await self.repository.get_by_refresh_token(
            refresh_token=refresh_token
        )
