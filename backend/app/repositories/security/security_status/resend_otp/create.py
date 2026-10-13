# app/repositories/security/security_status/resend_otp/create.py

from app.models.security.security_status.resend_otp import (
    ResendOtpSecurityStatusModel
)
from app.core.database import get_resend_otp_collection


class ResendOtpSecurityStatusRepositoryCreate:

    async def create(
        self,
        data: ResendOtpSecurityStatusModel
    ) -> ResendOtpSecurityStatusModel:
        data_model = data.model_dump(
            exclude={"id"},
            mode="python",
            by_alias=True
        )

        result = await get_resend_otp_collection().insert_one(
            data_model
        )

        data_model["_id"] = str(
            result.inserted_id
        )

        return ResendOtpSecurityStatusModel.model_validate(
            data_model
        )
