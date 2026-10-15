# app/services/user/pending_registration/base.py

from abc import ABC, abstractmethod
from typing import Optional

from app.models.user.pending_registration import PendingRegistrationModel

from app.schemas.user.pending_registration.read import PendingRegisterRead


class PendingRegisterServicesBase(ABC):

    @abstractmethod
    async def create(self, data: PendingRegistrationModel) -> PendingRegistrationModel:
        ...

    @abstractmethod
    async def get_pending_register(self, data: PendingRegisterRead) -> Optional[PendingRegistrationModel]:
        ...

    @abstractmethod
    async def delete_expired_register(self) -> bool:
        ...

    async def delete_pending_register_id(
        self,
        register_id: str
    ) -> bool:
        ...