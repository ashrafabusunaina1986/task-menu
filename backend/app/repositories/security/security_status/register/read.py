# app/repositories/security/security_status/register/read.py

from typing import Optional

from app.core.database import get_register_collection

from app.models.security.security_status.register import (
    RegisterSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.register.read import (
    RegisterSecurityStatusRead
)


class RegisterSecurityStatusRepositoryRead:

    async def get_register_status(
        self,
        data: RegisterSecurityStatusRead
    ) -> Optional[RegisterSecurityStatusModel]:

        data_model = data.model_dump()

        register_security_status = await get_register_collection().find_one(
            data_model
        )

        if not register_security_status:
            return None

        register_security_status["_id"] = str(
            register_security_status["_id"]
        )

        return RegisterSecurityStatusModel.model_validate(
            register_security_status
        )
