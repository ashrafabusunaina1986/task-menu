# app/services/user_block/service.py

from typing import Optional
from datetime import timezone

from app.services.user_block.create import UserBlockServiceCreate
from app.services.user_block.read import UserBlockServiceRead
from app.services.user_block.update import UserBlockServiceUpdate

from app.models.user_block.user_block import UserBlockModel
from app.schemas.user_block.update import UserBlockUpdate
from app.schemas.user_block.create import UserBlockCreate
from app.schemas.user_block.read import UserBlockRead
from app.schemas.user_block.response import BlockStatusResponse


class UserBlockService:

    def __init__(
        self,
        user_block_create: UserBlockServiceCreate,
        user_block_read: UserBlockServiceRead,
        user_block_update: UserBlockServiceUpdate
    ):
        self.user_block_create = user_block_create
        self.user_block_read = user_block_read
        self.user_block_update = user_block_update

    async def create(self, data: UserBlockCreate) -> UserBlockModel:
        return await self.user_block_create.create(
            data=data
        )

    async def get_active_block(
        self,
        data: UserBlockRead
    ) -> Optional[UserBlockModel]:
        return await self.user_block_read.get_active_block(
            data=data
        )

    async def update(
        self,
        blocked_id: str,
        data: UserBlockUpdate
    ) -> bool:
        return await self.user_block_update.update(
            blocked_id=blocked_id,
            data=data
        )

    async def block_status(
        self,
        data: UserBlockRead
    ) -> BlockStatusResponse:

        user_block = await self.get_active_block(
            data=data
        )

        if not user_block:
            return BlockStatusResponse(
                blocked=False
            )

      

        return BlockStatusResponse(
            blocked=True,
            reason=user_block.reason,
            blocked_until=user_block.blocked_until.replace(
                tzinfo=timezone.utc
            ).isoformat()
        )
