# app/repositories/session/create.py

from datetime import datetime, timezone

from app.repositories.session.base import SessionRepositoryBase
from app.schemas.session.create import SessionCreate


class SessionCreateRepository(
    SessionRepositoryBase
):

    async def create(
        self,
        session_data: SessionCreate
    ) -> str:
        data = session_data.model_dump()

        now = datetime.now(timezone.utc)

        data.update({
            "created_at": now,
            "updated_at": now,
            "active": True,
            "revoked_at": None
        })

        result = await self.collection.insert_one(
            data
        )
        return str(
            result.inserted_id
        )
