# app/core/container/user_block.py

from app.repositories.user_block.repository import UserBlockRepository
from app.repositories.user_block.create import UserBlockRepositoryCreate
from app.repositories.user_block.read import UserBlockRepositoryRead
from app.repositories.user_block.update import UserBlockRepositoryUpdate

from app.services.user_block.service import UserBlockService

from app.services.user_block.update import UserBlockServiceUpdate
from app.services.user_block.read import UserBlockServiceRead
from app.services.user_block.create import UserBlockServiceCreate


def get_user_block_service() -> UserBlockService:
    user_block_repository = UserBlockRepository(
        user_block_update=UserBlockRepositoryUpdate(),
        user_block_read=UserBlockRepositoryRead(),
        user_block_create=UserBlockRepositoryCreate()
    )

    user_block_service_create = UserBlockServiceCreate(
        repository=user_block_repository
    )
    user_block_service_read = UserBlockServiceRead(
        repository=user_block_repository
    )
    user_block_service_update = UserBlockServiceUpdate(
        repository=user_block_repository
    )

    return UserBlockService(
        user_block_update=user_block_service_update,
        user_block_read=user_block_service_read,
        user_block_create=user_block_service_create
    )
