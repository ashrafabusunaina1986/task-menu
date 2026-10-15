# app/services/user/pending_registration/service.py

from typing import Optional

from app.services.user.pending_registration.create import PendingRegisterServiceCreate

from app.services.user.pending_registration.read import PendingRegisterServiceRead

from app.services.user.pending_registration.delete import PendingRegisterServicesDelete
from app.schemas.user.pending_registration.read import PendingRegisterRead
from app.schemas.user.pending_registration.create import PendingRegisterCreate

from app.services.user.pending_registration.base import PendingRegisterServicesBase

from app.models.user.pending_registration import PendingRegistrationModel


class PendingRegisterService(PendingRegisterServicesBase):
    def __init__(
        self,
        service_create: PendingRegisterServiceCreate,
        service_read: PendingRegisterServiceRead,
        service_delete: PendingRegisterServicesDelete
    ):
        self.service_create = service_create
        self.service_read = service_read
        self.service_delete = service_delete

    async def create(
        self,
        data: PendingRegisterCreate
    ) -> PendingRegistrationModel:
        return await self.service_create.create(
            data=data
        )

    async def get_pending_register(
        self,
        data: PendingRegisterRead
    ) -> Optional[PendingRegistrationModel]:
        return await self.service_read.get_pending_register(
            data=data
        )

    async def delete_expired_register(
        self,
    ) -> bool:
        return await self.service_delete.delete_expired_register()

    async def delete_pending_register_id(
        self,
        register_id: str
    ) -> bool:
        return self.service_delete.delete_pending_register_id(
            register_id=register_id
        )
