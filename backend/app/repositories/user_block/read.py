# app/repositories/user_block/read.py

from typing import Optional
from datetime import datetime, timezone

from app.models.user_block.user_block import (
    UserBlockModel,
    BlockType
)
from app.schemas.user_block.read import (
    UserBlockRead
)
from app.core.database import get_user_block_collection


class UserBlockRepositoryRead:

    async def get_active_block(
        self,
        data: UserBlockRead
    ) -> Optional[UserBlockModel]:

        query = {
            "block_type": data.block_type,
            "is_active": True
        }
        if data.block_type == BlockType.USER:
            query["user_id"] = data.user_id

        if data.block_type == BlockType.REGISTER:
            query["register_id"] = data.register_id

        if data.block_type == BlockType.DEVICE:
            query["device_id"] = data.device_id

        if data.block_type == BlockType.IP:
            query["ip_id"] = data.ip_id

        user_block = await get_user_block_collection().find_one(
            query
        )

        if not user_block:
            return None
        now = datetime.now(timezone.utc)

        blocked_until = user_block["blocked_until"]

        if blocked_until.tzinfo is None:
            blocked_until = blocked_until.replace(
                tzinfo=timezone.utc
            )
        if now >= blocked_until:
            await get_user_block_collection().update_one(
                {
                    "_id": user_block["_id"]
                },
                {
                    "$set": {
                        "is_active": False,
                        "updated_at": now
                    }
                }
            )

            return None

        user_block["_id"] = str(user_block["_id"])

        return UserBlockModel.model_validate(
            user_block
        )
