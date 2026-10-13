# app/security/auth/current_user.py

from fastapi import HTTPException, status

from app.models.user.user import User
from app.services.user.service import UserService
from app.security.token.service import TokenService
from app.security.token.verifier import TokenTypes


class CurrentUserService:

    def __init__(
        self,
        token_service: TokenService,
        user_service: UserService
    ):
        self.user_service = user_service
        self.token_service = token_service

    async def current_user(
        self,
        token: str
    ) -> User:
        """
        Return authentication user.
        """

        payload = self.token_service.verify_token(
            token=token,
            token_type=TokenTypes.ACCESS
        )

        user_id = payload["sub"]

        user = await self.user_service.get_by_id(
            user_id=user_id
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found"
            )

        return user
