# app/security/token/jwt.py

from datetime import (
    datetime,
    timedelta,
    timezone
)

from jose import jwt

from app.core.config import settings


class JWTService:

    def __init__(
        self,
        secret_key: str,
        algorithm: str = "HS256"
    ):
        self.secret_key = secret_key
        self.algorithm = algorithm

    def encode(
        self,
        payload: dict,
        expires_minutes: int
    ) -> str:

        data = payload.copy()

        expire = (
            datetime.now(timezone.utc)
            +
            timedelta(
                minutes=expires_minutes
            )
        )

        data["exp"] = expire
        data["issuer"] = settings.JWT_ISSUER
        data["audience"] = settings.JWT_AUDIENCE

        return jwt.encode(
            data,
            self.secret_key,
            algorithm=self.algorithm,
        )

    def decode(
        self,
        token: str
    ) -> dict:

        return jwt.decode(
            token,
            self.secret_key,
            algorithms=[
                self.algorithm
            ],
            issuer=settings.JWT_ISSUER,
            audience=settings.JWT_AUDIENCE
        )
