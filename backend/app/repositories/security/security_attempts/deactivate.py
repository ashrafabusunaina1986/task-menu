# app/repositories/security/security_attempts/deactivate.py

from datetime import datetime, timezone

from app.core.database import (
    get_security_attempts_collection
)

from app.schemas.security.security_attempts.deactivate import (
    SecurityAttemptsDeactivate
)


class SecurityAttemptsRepositoryDeactivate:

    @property
    def collection(self):
        return get_security_attempts_collection()

    async def deactivate(
        self,
        data: SecurityAttemptsDeactivate
    ) -> bool:
        now = datetime.now(timezone.utc)
        query = {
            "type_operation": data.type_operation,
            "device_id": data.device_id,
            "ip_id": data.ip_id,
            "is_current": True
        }
        if data.session_id is not None:
            query["session_id"] = data.session_id

        if data.user_id is not None:
            query["user_id"] = data.user_id

        result = await self.collection.update_one(
            query,
            {
                "$set": {
                    "is_current": False,
                    "updated_at": now
                }
            }
        )
        return result.modified_count > 0
