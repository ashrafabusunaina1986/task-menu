# app/services/session/update.py

from fastapi import HTTPException

from app.services.session.base import SessionServiceBase


class SessionUpdateService(
    SessionServiceBase
):

    async def update(
        self,
        session_id: str,
        data: dict
    ) -> bool:
        result = await self.repository.update(
            session_id=session_id,
            data=data
        )

        if not result or result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )
        return True
