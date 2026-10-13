# app/repositories/user_block/update.py

from datetime import datetime, timezone
from bson import ObjectId

from app.schemas.user_block.update import UserBlockUpdate

from app.core.database import get_user_block_collection


class UserBlockRepositoryUpdate:

    async def update(
        self,
        blocked_id: str,
        data: UserBlockUpdate
    ) -> bool:

        data_update = data.model_dump(
            exclude_unset=True
        )

        if not data_update:
            return False

        now = datetime.now(timezone.utc)

        data_update["updated_at"] = now

        updated = await get_user_block_collection().update_one(
            {
                "_id": ObjectId(blocked_id)
            },
            {
                "$set": data_update
            }
        )

        return updated.modified_count == 1
