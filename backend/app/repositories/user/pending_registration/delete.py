# app/repositories/user/pending_registration/delete.py

from datetime import datetime, timezone
from app.core.database import get_pending_register_collection


class PendingRegisterRepositoryDelete:

    async def delete_expired_register(
        self,
    ) -> bool:
        now = datetime.now(timezone.utc)
        query = {
            "expires_at": {
                "$lte": now
            }
        }
        result = await get_pending_register_collection().delete_many(
            filter=query
        )

        return result.deleted_count > 0
