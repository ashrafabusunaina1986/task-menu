# app/routes/user_block/create.py

from fastapi import Depends, APIRouter

from app.routes.user_block.base import UserBlockRouteBase
from app.services.user_block.service import UserBlockService

from app.schemas.user_block.create import UserBlockCreate
from app.schemas.user_block.response import UserBlockResponse


class UserBlockRouteCreate:

    def __init__(
        self
    ):
        self.router = APIRouter()

        self.router.add_api_route(
            '/create',
            self.create,
            methods=["POST"],
            response_model=UserBlockResponse
        )

    async def create(
        self,
        data: UserBlockCreate,
        service: UserBlockService = Depends(
            UserBlockRouteBase.get_user_block_service
        )
    ):
        return await service.create(
            data=data
        )
