# app/services/user/google_create.py

from app.repositories.user.repository import UserRepository
from app.security.permissions.roles import Role


class GoogleUserCreateService:
    def __init__(
        self,
        repository: UserRepository
    ):
        self.repository = repository

    async def create(
        self,
        name: str,
        email: str,
        google_id: str,
        image: str | None = None
    ) -> str:
        user_dict = {
            "name": name,
            "email": email,
            "image": image,
            "hashed_password": None,
            "auth_providers": ["google"],
            "google_id": google_id,
            "role": Role.USER,
            "is_active": True,
            "is_verified": True
        }

        return await self.repository.create(
            user_data=user_dict
        )
