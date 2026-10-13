# app/security/token/service.py

from app.security.token.jwt import JWTService
from app.security.token.access_token import AccessTokenService
from app.security.token.refresh_token import RefreshTokenService
from app.security.token.register_token import RegisterTokenService
from app.security.token.verifier import TokenVerifier, TokenTypes

from app.security.constants import JWT_ALGORITHM


class TokenService:

    def __init__(
        self,
        secret_key: str,
        algorithm: str = JWT_ALGORITHM
    ):

        jwt_service = JWTService(
            secret_key=secret_key,
            algorithm=algorithm
        )

        self.access = AccessTokenService(
            jwt_service=jwt_service
        )

        self.refresh = RefreshTokenService(
            jwt_service=jwt_service
        )

        self.register = RegisterTokenService(
            jwt_service=jwt_service
        )

        self.verifier = TokenVerifier(
            jwt_service=jwt_service
        )

    def create_access_token(
        self,
        user_id: str
    ) -> str:

        return self.access.create(
            user_id=user_id
        )

    def create_refresh_token(
        self,
        user_id: str
    ) -> str:

        return self.refresh.create(
            user_id=user_id
        )

    def create_register_token(
        self,
        register_id: str,
        email: str
    ) -> str:

        return self.register.create(
            register_id=register_id,
            email=email
        )

    def verify_token(
        self,
        token: str,
        token_type: TokenTypes
    ) -> dict:

        return self.verifier.verify(
            token=token,
            token_type=token_type
        )
