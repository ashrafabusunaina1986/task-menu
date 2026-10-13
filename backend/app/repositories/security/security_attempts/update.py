# app/repositories/security/security_attempts/update.py

from datetime import datetime, timezone

from bson import ObjectId

from app.schemas.security.security_attempts.update import (
    SecurityAttemptsUpdate
)
from app.core.database import (
    get_security_attempts_collection
)


class SecurityAttemptsRepositoryUpdate:

    @property
    def collection(self):
        return get_security_attempts_collection()

    async def update(
        self,
        data: SecurityAttemptsUpdate
    ) -> bool:
        now = datetime.now(timezone.utc)

        result = await self.collection.update_one({
            "_id": ObjectId(data.security_attempts_id)
        }, [
            {
                "$set": {
                    "attempts": {
                        "$add": ["$attempts", 1]
                    },
                    "last_attempt_at": now,
                    "updated_at": now

                }
            },
            {
                "$set": {
                    "is_blocked": {
                        "$gte": ["$attempts", "$max_attempts"]
                    }
                }
            }
        ])

        return result.modified_count > 0
