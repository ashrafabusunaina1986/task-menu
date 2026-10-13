# app/services/user/create.py

from app.services.user.base import UserServiceBase
from app.schemas.user.create import UserCreate
from app.security.permissions.roles import Role


class UserCreateService(UserServiceBase):

    async def create(
        self,
        data: UserCreate
    ) -> str:

        user_data = data.model_dump()

        password = user_data.pop("password")

        user_data["hashed_password"] = self.password.hasher.hash(
            password=password
        )
        user_data["role"] = Role.USER

        return await self.repository.create(
            user_data=user_data
        )
