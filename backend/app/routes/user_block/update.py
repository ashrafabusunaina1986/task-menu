# app/routes/user_block/update.py

from fastapi import Depends, APIRouter

from app.routes.user_block.base import UserBlockRouteBase
from app.services.user_block.service import UserBlockService

from app.schemas.user_block.update import UserBlockUpdate


class UserBlockRouteUpdate:

    def __init__(
        self
    ):
        self.router = APIRouter()

        self.router.add_api_route(
            '/update',
            self.update,
            methods=["PUT"],
            response_model=bool
        )

    async def update(
        self,
        blocked_id: str,
        data: UserBlockUpdate,
        service: UserBlockService = Depends(
            UserBlockRouteBase.get_user_block_service
        )
    ):
        return await service.update(
            blocked_id=blocked_id,
            data=data
        )
