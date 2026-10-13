# app/services/user_block/update.py

from app.schemas.user_block.update import UserBlockUpdate

from app.repositories.user_block.repository import UserBlockRepository


class UserBlockServiceUpdate:
    def __init__(
        self,
        repository: UserBlockRepository
    ):
        self.user_block_repository = repository

    async def update(
        self,
        blocked_id: str,
        data: UserBlockUpdate
    ) -> bool:
        return await self.user_block_repository.update(
            blocked_id=blocked_id,
            data=data
        )
