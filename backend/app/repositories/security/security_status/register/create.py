# app/repositories/security/security_status/register/create.py

from datetime import datetime, timezone

from app.core.database import get_register_collection

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.register.create import (
    RegisterSecurityStatusCreate
)


class RegisterSecurityStatusRepositoryCreate:

    async def create(
        self,
        data: RegisterSecurityStatusCreate
    ) -> RegisterSecurityStatusModel:

        data_model = data.model_dump()

        now = datetime.now(timezone.utc)

        data_model["created_at"] = now
        data_model["updated_at"] = now

        result = await get_register_collection().insert_one(
            data_model
        )

        data_model["_id"] = str(result.inserted_id)

        return RegisterSecurityStatusModel.model_validate(
            data_model
        )
