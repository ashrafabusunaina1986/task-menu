# app/services/user/create.py

from app.services.user.base import UserServiceBase
from app.schemas.user.create import UserCreate, RegisterUser
from app.security.permissions.roles import Role


class UserCreateService(UserServiceBase):

    async def create(
        self,
        data: UserCreate | RegisterUser
    ) -> str:

        user_data = data.model_dump()
        if isinstance(data, UserCreate):

            password = user_data.pop("password")

            user_data["hashed_password"] = self.password.hasher.hash(
                password=password
            )

        user_data["role"] = Role.USER

        return await self.repository.create(
            user_data=user_data
        )
