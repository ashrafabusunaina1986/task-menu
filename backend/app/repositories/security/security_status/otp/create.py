# app/repositories/otp/create.py

from app.models.security.security_status.otp import (
    OTPStatusModel
)
from app.core.database import get_otp_collection


class OTPCreateRepository:

    async def create(
        self,
        otp: OTPStatusModel
    ) -> OTPStatusModel:
        data = otp.model_dump(
            by_alias=True,
            exclude_none=True
        )

        result = await get_otp_collection().insert_one(
            data
        )

        otp.id = str(result.inserted_id)

        return otp
