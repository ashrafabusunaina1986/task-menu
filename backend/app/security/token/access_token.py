# app/security/token/access_token.py

from app.security.token.jwt import JWTService
from app.security.constants import (
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from app.security.token.types import TokenTypes
from app.core.config import (
    settings
)


class AccessTokenService:

    def __init__(
        self,
        jwt_service: JWTService
    ):
        self.jwt_service = jwt_service

    def create(
        self,
        user_id: str
    ) -> str:

        return self.jwt_service.encode(
            {
                "sub": user_id,
                "token_type": TokenTypes.ACCESS.value,
                "iss": settings.JWT_ISSUER,
                "aud": settings.JWT_AUDIENCE
            },
            expires_minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )
