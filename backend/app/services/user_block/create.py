# app/services/user_block/create.py

from app.models.user_block.user_block import UserBlockModel
from app.schemas.user_block.create import UserBlockCreate

from app.repositories.user_block.repository import UserBlockRepository


class UserBlockServiceCreate:
    def __init__(self, repository: UserBlockRepository):
        self.user_block_repository = repository

    async def create(self, data: UserBlockCreate) -> UserBlockModel:
        return await self.user_block_repository.create(
            data=data
        )
