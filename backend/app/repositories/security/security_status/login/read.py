# app/repositories/security/security_status/login/read.py

from typing import Optional

from app.core.database import get_login_collection

from app.models.security.security_status.login import (
    LoginSecurityStatusModel
)
from app.schemas.security.security_attempts.security_status.login.read import (
    LoginSecurityStatusRead
)


class LoginSecurityStatusRepositoryRead:

    async def get_login_status(
        self,
        data: LoginSecurityStatusRead
    ) -> Optional[LoginSecurityStatusModel]:

        data_model = data.model_dump()

        login_security_status = await get_login_collection().find_one(
            data_model
        )
        if not login_security_status:
            return None

        login_security_status["_id"] = str(
            login_security_status["_id"]
        )

        return LoginSecurityStatusModel.model_validate(
            login_security_status
        )
