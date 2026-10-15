# app/repositories/user/pending_registration/repository.py

from typing import Optional

from app.models.user.pending_registration import PendingRegistrationModel

from app.repositories.user.pending_registration.base import PendingRegisterRepositoryBase
from app.repositories.user.pending_registration.create import PendingRegisterRepositoryCreate
from app.repositories.user.pending_registration.read import PendingRegisterRepositoryRead
from app.repositories.user.pending_registration.delete import PendingRegisterRepositoryDelete

from app.schemas.user.pending_registration.read import PendingRegisterRead


class PendingRegisterRepository(PendingRegisterRepositoryBase):

    def __init__(
        self,
        create: PendingRegisterRepositoryCreate,
        read: PendingRegisterRepositoryRead,
        delete: PendingRegisterRepositoryDelete
    ):
        self.repository_create = create
        self.repository_read = read
        self.repository_delete = delete

    async def create(
        self,
        data: PendingRegistrationModel
    ) -> PendingRegistrationModel:
        return await self.repository_create.create(data=data)

    async def get_pending_register(self, data: PendingRegisterRead) -> Optional[PendingRegistrationModel]:
        return await self.repository_read.get_pending_register(data=data)

    async def delete_expired_register(self) -> bool:
        return self.repository_delete.delete_expired_register()

    async def delete_pending_register_id(
        self,
        register_id: str
    ) -> bool:
        return self.delete_pending_register_id(
            register_id=register_id
        )
