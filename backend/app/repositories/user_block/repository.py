# app/repositories/user_block/repository.py

from typing import Optional

from app.models.user_block.user_block import UserBlockModel

from app.repositories.user_block.base import UserBlockRepositoryBase

from app.repositories.user_block.update import UserBlockRepositoryUpdate
from app.repositories.user_block.create import UserBlockRepositoryCreate
from app.repositories.user_block.read import UserBlockRepositoryRead

from app.schemas.user_block.create import UserBlockCreate
from app.schemas.user_block.update import UserBlockUpdate
from app.schemas.user_block.read import UserBlockRead
from app.schemas.user_block.response import BlockStatusResponse


class UserBlockRepository(UserBlockRepositoryBase):
    def __init__(
        self,
        user_block_create: UserBlockRepositoryCreate,
        user_block_read: UserBlockRepositoryRead,
        user_block_update: UserBlockRepositoryUpdate
    ):
        self.user_block_create = user_block_create
        self.user_block_read = user_block_read
        self.user_block_update = user_block_update

    async def create(
        self,
        data: UserBlockCreate
    ) -> UserBlockModel:

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
