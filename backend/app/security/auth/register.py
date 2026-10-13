# app/security/auth/register.py

from app.schemas.user.create import UserCreate
from app.services.user.create import UserCreateService


class RegisterService:

    def __init__(
        self,
        user_service: UserCreateService
    ):
        self.user_service = user_service


    async def register(
        self,
        data: UserCreate
    ) -> str:
        """
        Register a new user.
        """

        return await self.user_service.create(
            data=data
        )