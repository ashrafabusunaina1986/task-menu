# app/routes/user_block/read.py

from fastapi import Depends, APIRouter
from typing import Optional

from app.routes.user_block.base import UserBlockRouteBase
from app.services.user_block.service import UserBlockService

from app.schemas.user_block.response import (
    UserBlockResponse,
    BlockStatusResponse
)
from app.schemas.user_block.read import UserBlockRead
from app.models.user_block.user_block import (
    BlockType
)


class UserBlockRouteRead:

    def __init__(
        self
    ):
        self.router = APIRouter()
        self.router.add_api_route(
            '/get-active-block',
            self.get_active_block,
            methods=["GET"],
            response_model=Optional[UserBlockResponse]
        )

        self.router.add_api_route(
            '/block-status',
            self.block_status,
            methods=["GET"],
            response_model=BlockStatusResponse
        )

    async def get_active_block(
        self,
        data: UserBlockRead,
        service: UserBlockService = Depends(
            UserBlockRouteBase.get_user_block_service
        )
    ):
        return await service.get_active_block(
            data=data
        )

    async def block_status(
        self,
        block_type: BlockType,
        ip_id: str | None = None,
        device_id: str | None = None,
        user_id: str | None = None,
        register_id: str | None = None,
        service: UserBlockService = Depends(
            UserBlockRouteBase.get_user_block_service
        )
    ):

        if device_id:
            data = UserBlockRead(
                device_id=device_id,
                block_type=block_type.value
            )
        elif ip_id:
            data = UserBlockRead(
                ip_id=ip_id,
                block_type=block_type.value
            )
        elif user_id:
            data = UserBlockRead(
                user_id=user_id,
                block_type=block_type.value
            )
        elif register_id:
            data = UserBlockRead(
                register_id=register_id,
                block_type=block_type.value
            )
        else:
            return BlockStatusResponse(
                blocked=False
            )

        return await service.block_status(
            data=data
        )
