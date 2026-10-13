# app/routes/user_block/base.py


from app.core.container.user_block import get_user_block_service
from app.services.user_block.service import UserBlockService


class UserBlockRouteBase:

    prefix = "/user-block"
    tags = ["USER BLOCK"]

    user_block_service = UserBlockService
    get_user_block_service = get_user_block_service
