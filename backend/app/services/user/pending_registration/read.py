# app/services/user/pending_registration/read.py

from typing import Optional

from app.repositories.user.pending_registration.repository import PendingRegisterRepository

from app.schemas.user.pending_registration.read import PendingRegisterRead

from app.models.user.pending_registration import PendingRegistrationModel


class PendingRegisterServiceRead:
    def __init__(
        self,
        repository: PendingRegisterRepository
    ):
        self.repository = repository

    async def get_pending_register(
        self,
        data: PendingRegisterRead
    ) -> Optional[PendingRegistrationModel]:
        return await self.repository.get_pending_register(
            data=data
        )

