# app/services/security/security_attempts/service.py

from typing import Optional

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)
from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate
)
from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)

from app.services.security.security_attempts.create import (
    SecurityAttemptsServiceCreate
)
from app.services.security.security_attempts.read import (
    SecurityAttemptsServiceRead
)
from app.services.security.security_attempts.update import (
    SecurityAttemptsServiceUpdate
)
from app.services.security.security_attempts.deactivate import (
    SecurityAttemptsServiceDeactivate
)


class SecurityAttemptsService:

    def __init__(
        self,
        create: SecurityAttemptsServiceCreate,
        read: SecurityAttemptsServiceRead,
        update: SecurityAttemptsServiceUpdate,
        deactivate: SecurityAttemptsServiceDeactivate,
    ):
        self.security_attempts_create_service = create
        self.security_attempts_read_service = read
        self.security_attempts_update_service = update
        self.security_attempts_deactivate_service = deactivate

    async def create(
        self,
        data: SecurityAttemptsCreate
    ) -> SecurityAttemptsModel:
        return await self.security_attempts_create_service.create(
            data=data
        )

    async def get_by_user_and_operation(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        return await self.security_attempts_read_service\
            .get_by_user_and_operation(
                data=data
            )

    async def get_current_by_context(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        return await self.security_attempts_read_service.get_current_by_context(
            data=data
        )

    async def update(
        self,
        data: SecurityAttemptsUpdate
    ) -> bool:
        return await self.security_attempts_update_service.update(
            data=data
        )

    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate
    ) -> bool:
        return await self.security_attempts_deactivate_service.deactivate(
            data=data
        )

    async def record_attempt(
        self,
        data: SecurityAttemptsRead,
        max_attempts: int
    ) -> SecurityAttemptsModel:
        print(data)
        security_attempts = await self.get_current_by_context(
            data=data
        )

        if not security_attempts:
            security_attempts = await self.create(
                data=SecurityAttemptsCreate(
                    max_attempts=max_attempts,
                    user_id=data.user_id,
                    ip_id=data.ip_id,
                    device_id=data.device_id,
                    session_id=data.session_id,
                    type_operation=data.type_operation,
                    register_id=data.register_id
                )
            )

        await self.update(
            data=SecurityAttemptsUpdate(
                security_attempts_id=security_attempts.id
            )
        )
        security_attempts = await self.get_current_by_context(
            data=data
        )

        return security_attempts
