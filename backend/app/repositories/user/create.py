# app/repositories/user/create.py

from datetime import datetime, timezone

from app.core.database import get_users_collection


class UserCreateRepository:
    async def create(self, user_data: dict) -> str:
        now = datetime.now(timezone.utc)

        user_data["created_at"] = now
        user_data["updated_at"] = now

        result = await get_users_collection().insert_one(
            user_data
        )

        return str(result.inserted_id)
