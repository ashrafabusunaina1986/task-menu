# app/security/token/register_token.py

from app.security.token.jwt import JWTService
from app.security.constants import (
    REGISTER_TOKEN_EXPIRE_MINUTES,
)
from app.security.token.types import TokenTypes
from app.core.config import (
    settings
)


class RegisterTokenService:

    def __init__(
        self,
        jwt_service: JWTService
    ):
        self.jwt_service = jwt_service

    def create(
        self,
        register_id: str,
        email: str
    ) -> str:

        return self.jwt_service.encode(
            {
                "sub": register_id,
                "email": email,
                "token_type": TokenTypes.REGISTER.value,
                "iss": settings.JWT_ISSUER,
                "aud": settings.JWT_AUDIENCE
            },
            expires_minutes=REGISTER_TOKEN_EXPIRE_MINUTES
        )
