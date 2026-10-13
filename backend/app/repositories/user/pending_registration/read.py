# app/repositories/user/pending_registration/read.py

from typing import Optional
from bson import ObjectId
from bson.errors import InvalidId
from datetime import datetime, timezone

from app.models.user.pending_registration import (
    PendingRegistrationModel
)
from app.schemas.user.pending_registration.read import (
    PendingRegisterRead
)

from app.core.database import get_pending_register_collection


class PendingRegisterRepositoryRead:

    async def get_pending_register(
        self,
        data: PendingRegisterRead
    ) -> Optional[PendingRegistrationModel]:
        now = datetime.now(timezone.utc)
        try:
            register_id = ObjectId(data.register_id)

        except (InvalidId, TypeError):
            return None

        pending_register = await get_pending_register_collection().find_one(
            {
                "_id": register_id,
                "expires_at": {
                    "$gt": now
                }
            }
        )

        if pending_register is None:
            return None

        pending_register["_id"] = str(
            pending_register["_id"]
        )

        return PendingRegistrationModel.model_validate(
            pending_register
        )

