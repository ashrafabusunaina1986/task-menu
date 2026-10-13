# app/repositories/security/security_attempts/read.py

from typing import Optional

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)
from app.schemas.security.security_attempts.read import (
    SecurityAttemptsRead
)
from app.core.database import (
    get_security_attempts_collection
)


class SecurityAttemptsRepositoryRead:

    @property
    def collection(self):
        return get_security_attempts_collection()

    async def get_by_user_and_operation(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:

        query = {
            "type_operation": data.type_operation
        }

        if data.session_id:
            query["session_id"] = data.session_id

        if data.user_id:
            query["user_id"] = data.user_id

        if data.ip_id:
            query["ip_id"] = data.ip_id

        if data.device_id:
            query["device_id"] = data.device_id

        security_attempts = await self.collection.find_one(
            query
        )

        if not security_attempts:
            return None

        security_attempts["_id"] = str(
            security_attempts["_id"]
        )

        return SecurityAttemptsModel.model_validate(
            security_attempts
        )

    async def get_current_by_context(
        self,
        data: SecurityAttemptsRead
    ) -> Optional[SecurityAttemptsModel]:
        query = {
            "type_operation": data.type_operation,
            "ip_id": data.ip_id,
            "device_id": data.device_id,
            "is_current": True
        }

        if data.session_id:
            query["session_id"] = data.session_id

        security_attempts = await self.collection.find_one(
            query
        )

        if not security_attempts:
            return None

        security_attempts["_id"] = str(
            security_attempts["_id"]
        )

        return SecurityAttemptsModel.model_validate(
            security_attempts
        )
