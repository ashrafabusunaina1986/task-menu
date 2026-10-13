# app/repositories/user/pending_registration/base.py

from typing import Optional
from abc import ABC, abstractmethod

from app.models.user.pending_registration import (
    PendingRegistrationModel
)


from app.schemas.user.pending_registration.read import (
    PendingRegisterRead
)


class PendingRegisterRepositoryBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: PendingRegistrationModel
    ) -> PendingRegistrationModel:
        pass

    @abstractmethod
    async def get_pending_register(
        self,
        data: PendingRegisterRead
    ) -> Optional[PendingRegistrationModel]:
        pass

    @abstractmethod
    async def delete_expired_register(
        self,
    ) -> bool:
        pass
