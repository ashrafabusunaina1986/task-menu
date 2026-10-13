# app/services/user/pending_registration/create.py

from datetime import datetime, timezone, timedelta

from app.security.constants import PENDING_REGISTER_EXPIRE_MINUTES

from app.security.password.hasher import PasswordHasher

from app.models.user.pending_registration import PendingRegistrationModel

from app.repositories.user.pending_registration.repository import PendingRegisterRepository

from app.schemas.user.pending_registration.create import PendingRegisterCreate


class PendingRegisterServiceCreate:
    def __init__(
        self,
        repository: PendingRegisterRepository,
        hasher: PasswordHasher
    ):
        self.service_repository = repository
        self.hasher = hasher

    async def create(
        self,
        data: PendingRegisterCreate
    ) -> PendingRegistrationModel:
        now = datetime.now(timezone.utc)

        created_at = now

        expires_at = (
            now+timedelta(minutes=PENDING_REGISTER_EXPIRE_MINUTES)
        )

        hashed_password = self.hasher.hash(
            password=data.password
        )
        pending_register = PendingRegistrationModel(
            name=data.name,
            email=data.email,
            hashed_password=hashed_password,
            expires_at=expires_at,
            created_at=created_at
        )

        return await self.service_repository.create(
            data=pending_register
        )
