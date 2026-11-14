
# app/services/user/read.py

from fastapi import HTTPException, status

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

    async def get_users_for_select(self):
        # Retrieve active and verified users for selection.
        return await self.repository.get_users_for_select()

    async def get_by_id(self, user_id: str) -> User:
        # Retrieve the user by ID.
        user = await self.repository.get_by_id(
            user_id=user_id
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return User(**user)

    async def get_by_email(self, email: EmailStr) -> User:
        # Retrieve the user by email.
        user = await self.repository.get_by_email(
            email=email
        )

        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )

        return User(**user)
