# app/repositories/user_block/create.py
from datetime import datetime, timezone

from app.schemas.user_block.create import UserBlockCreate
from app.models.user_block.user_block import UserBlockModel
from app.core.database import get_user_block_collection


class UserBlockRepositoryCreate:

    async def create(
        self,
        data: UserBlockCreate
    ) -> UserBlockModel:

        user_block_data = data.model_dump()
        user_block_data["is_active"] = True
        now = datetime.now(timezone.utc)

        user_block_data["blocked_at"] = now
        user_block_data["created_at"] = now
        user_block_data["updated_at"] = now
        
        result = await get_user_block_collection().insert_one(
            user_block_data
        )

        user_block_data["_id"] = str(result.inserted_id)

        return UserBlockModel.model_validate(
            user_block_data
        )
