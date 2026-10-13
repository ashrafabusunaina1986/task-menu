# app/security/dependencies/current_user.py

from app.security.auth.current_user import CurrentUserService
from app.models.user.user import User


class CurrentUserDependency:
    def __init__(
        self,
        current_user_service: CurrentUserService
    ):
        self.current_user_service = current_user_service

    async def __call__(
        self,
        token: str
    ) -> User:
        return await self.current_user_service.current_user(
            token=token
        )
