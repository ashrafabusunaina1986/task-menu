# app/security/token/verifier.py

from fastapi import HTTPException, status

from jose import JWTError
from app.core.config import settings
from app.security.token.jwt import JWTService
from app.security.token.types import TokenTypes


class TokenVerifier:

    def __init__(
        self,
        jwt_service: JWTService
    ):
        self.jwt_service = jwt_service

    def verify(
        self,
        token: str,
        token_type: TokenTypes
    ) -> dict:

        try:
            payload = self.jwt_service.decode(token)

        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token"
            )

        if payload.get("token_type") != token_type.value:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )

        subject = payload.get("sub")
        if not subject:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing user identity"
            )

        issuer = payload.get("iss")

        if issuer != settings.JWT_ISSUER:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing issuer"
            )

        audience = payload.get("aud")

        if audience != settings.JWT_AUDIENCE:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token missing audience"
            )

        return payload
