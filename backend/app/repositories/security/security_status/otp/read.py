from typing import Optional
from datetime import timezone

from app.core.database import get_otp_collection
from app.models.security.security_status.otp import (
    OTPStatusModel
)


class OTPReadRepository:

    async def get_active_by_user_id(
        self,
        register_id: str | None,
        user_id: str | None
    ) -> Optional[OTPStatusModel]:

        query = {
            "used": False
        }
        if user_id:
            query["user_id"] = user_id
        elif register_id:
            query["register_id"] = register_id
        else:
            return None

        cursor = (
            get_otp_collection()
            .find(query)
            .sort(
                "created_at",
                -1
            )
            .limit(1)
        )

        data = await cursor.to_list(length=1)

        if not data:
            return None

        data = data[0]

        data["_id"] = str(data["_id"])

        expires_at = data["expires_at"]

        if expires_at.tzinfo is None:
            data["expires_at"] = expires_at.replace(
                tzinfo=timezone.utc
            )

        return OTPStatusModel.model_validate(data)
