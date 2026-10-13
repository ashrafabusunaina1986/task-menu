# app/services/user_block/read.py

from typing import Optional

from app.models.user_block.user_block import UserBlockModel

from app.repositories.user_block.repository import UserBlockRepository

from app.schemas.user_block.read import UserBlockRead


class UserBlockServiceRead:
    def __init__(
        self,
        repository: UserBlockRepository
    ):
        self.user_block_repository = repository

    async def get_active_block(
        self,
        data: UserBlockRead
    ) -> Optional[UserBlockModel]:
        return await self.user_block_repository.get_active_block(
            data=data
        )
