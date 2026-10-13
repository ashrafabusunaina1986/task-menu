# app/services/session/create.py

from app.services.session.base import SessionServiceBase
from app.schemas.session.create import SessionCreate


class SessionCreateService(
    SessionServiceBase
):
    async def create(
        self,
        session_data: SessionCreate
    ) -> str:
        return await self.repository.create(
            session_data=session_data
        )
