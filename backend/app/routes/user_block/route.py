# app/routes/user_block/route.py

from fastapi import APIRouter

from app.routes.user_block.base import UserBlockRouteBase

from app.routes.user_block.create import UserBlockRouteCreate
from app.routes.user_block.read import UserBlockRouteRead
from app.routes.user_block.update import UserBlockRouteUpdate


class UserBlockRoute:

    def __init__(
        self,
    ):
        self.router = APIRouter(
            prefix=UserBlockRouteBase().prefix,
            tags=UserBlockRouteBase().tags
        )

        self.router.include_router(
            UserBlockRouteCreate().router
        )
        self.router.include_router(
            UserBlockRouteRead().router
        )
        self.router.include_router(
            UserBlockRouteUpdate().router
        )
