# app/repositories/session/cleanup.py

from app.repositories.session.base import SessionRepositoryBase


class SessionCleanupRepository(
    SessionRepositoryBase
):
    async def cleanup(
        self
    ) -> int:
        result = await self.collection.delete_many(
            {
                "active": False
            }
        )

        return result.deleted_count
