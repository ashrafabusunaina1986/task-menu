# app/services/user_block/base.py

from typing import Optional
from abc import ABC, abstractmethod

from app.models.user_block.user_block import UserBlockModel
from app.schemas.user_block.create import UserBlockCreate
from app.schemas.user_block.update import UserBlockUpdate
from app.schemas.user_block.read import UserBlockRead
from app.schemas.user_block.response import BlockStatusResponse


class UserBlockServiceBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: UserBlockCreate
    ) -> UserBlockModel:
        pass

    @abstractmethod
    async def get_active_block(
        self,
        data: UserBlockRead
    ) -> Optional[UserBlockModel]:
        pass

    @abstractmethod
    async def update(
        self,
        blocked_id: str,
        data: UserBlockUpdate
    ) -> bool:
        pass

    @abstractmethod
    async def block_status(
        self,
        data: UserBlockRead
    ) -> BlockStatusResponse:
        pass
