from datetime import datetime, timezone

from bson import ObjectId

from app.core.database import get_otp_collection


class OTPUpdateRepository:

    async def mark_used(
        self,
        otp_id: str
    ) -> bool:

        result = await get_otp_collection().update_one(
            {
                "_id": ObjectId(otp_id)
            },
            {
                "$set": {
                    "used": True,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

        return result.modified_count == 1

    async def resend(
        self,
        otp_id: str,
        otp_hash: str,
        expires_at: datetime
    ) -> bool:

        result = await get_otp_collection().update_one(
            {
                "_id": ObjectId(otp_id)
            },
            {
                "$set": {
                    "otp_hash": otp_hash,
                    "expires_at": expires_at,
                    "used": False,
                    "updated_at": datetime.now(timezone.utc)
                }
            }
        )

        return result.modified_count == 1