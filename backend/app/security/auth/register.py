# app/security/auth/register.py

from app.schemas.user.create import UserCreate, RegisterUser
from app.services.user.create import UserCreateService


class RegisterService:

    def __init__(
        self,
        user_service: UserCreateService
    ):
        self.user_service = user_service

    async def register(
        self,
        data: UserCreate | RegisterUser
    ) -> str:
        """
        Register a new user.
        """

        return await self.user_service.create(
            data=data
        )
