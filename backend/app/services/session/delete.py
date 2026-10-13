# app/services/session/delete.py

from fastapi import HTTPException

from app.services.session.base import SessionServiceBase


class SessionDeleteService(
    SessionServiceBase
):
    async def delete(
        self,
        session_id: str
    ) -> bool:
        deleted = await self.repository.delete(
            session_id=session_id
        )

        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Session not found"
            )

        return True
