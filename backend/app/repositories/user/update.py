# app/repositories/user/update.py

from datetime import datetime, timezone

from bson import ObjectId
from bson.errors import InvalidId

from app.core.database import get_users_collection


class UserUpdateRepository:

    async def update(
        self,
        user_id: str,
        data: dict
    ):
        update_at = datetime.now(timezone.utc)
        try:
            update_data = {
                **data,
                "updated_at": update_at
            }

            update_result = await get_users_collection().update_one(
                {"_id": ObjectId(user_id)},
                {"$set": update_data}
            )
            return update_result
        except InvalidId:
            return None
