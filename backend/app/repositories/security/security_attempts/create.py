# app/repositories/security/security_attempts/create.py

from datetime import datetime, timezone

from app.models.security.security_attempts import (
    SecurityAttemptsModel
)
from app.schemas.security.security_attempts.create import (
    SecurityAttemptsCreate
)

from app.core.database import (
    get_security_attempts_collection
)


class SecurityAttemptsRepositoryCreate:
    
    @property
    def collection(self):
        return get_security_attempts_collection()

    async def create(
        self,
        data: SecurityAttemptsCreate
    ) -> SecurityAttemptsModel:

        security_attempts_data = data.model_dump()

        security_attempts_data["attempts"] = 0
        security_attempts_data["is_blocked"] = False
        security_attempts_data["is_current"] = True

        now = datetime.now(timezone.utc)

        security_attempts_data["created_at"] = now
        security_attempts_data["updated_at"] = now

        result = await self.collection.insert_one(
            security_attempts_data
        )
        security_attempts_data["_id"] = str(
            result.inserted_id
        )

        return SecurityAttemptsModel.model_validate(
            security_attempts_data
        )
