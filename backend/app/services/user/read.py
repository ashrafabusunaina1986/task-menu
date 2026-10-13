# app/services/user/read.py

from app.services.user.base import UserServiceBase
from app.models.user.user import User
from pydantic import EmailStr


class UserReadService(UserServiceBase):

    async def get_all(self) -> list[User]:
        users = await self.repository.get_all()
        return [
            User(**user)
            for user in users
        ]

    async def get_by_id(self, user_id: str) -> User | None:
        user = await self.repository.get_by_id(
            user_id=user_id
        )
        if not user:
            return None

        return User(**user)

    async def get_by_email(self, email: EmailStr) -> User | None:
        user = await self.repository.get_by_email(
            email=email
        )
        if not user:
            return None
        return User(**user)
