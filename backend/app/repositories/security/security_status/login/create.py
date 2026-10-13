# app/repositories/security/security_status/login/create.py

from datetime import datetime, timezone

from app.core.database import get_login_collection

from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.login.create import (
    LoginSecurityStatusCreate
)


class LoginSecurityStatusRepositoryCreate:

    async def create(
        self,
        data: LoginSecurityStatusCreate
    ) -> LoginSecurityStatusModel:

        data_model = data.model_dump()

        now = datetime.now(timezone.utc)

        data_model["created_at"] = now
        data_model["updated_at"] = now

        result = await get_login_collection().insert_one(
            data_model
        )
        data_model["_id"] = str(result.inserted_id)

        return LoginSecurityStatusModel.model_validate(
            data_model
        )
