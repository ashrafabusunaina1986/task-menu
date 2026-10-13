# app/core/container/user.py

from app.services.user.service import UserService
from app.core.container.password import get_password_service
from app.repositories.user.repository import UserRepository


def get_user_service() -> UserService:
    user_service = UserService(
        password=get_password_service(),
        repository=UserRepository()
    )
    return user_service
