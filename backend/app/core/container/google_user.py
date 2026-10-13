# app/core/container/google_user.py

from app.repositories.user.repository import UserRepository
from app.services.user.google_create import GoogleUserCreateService


def get_google_user_create_service() -> GoogleUserCreateService:
    return GoogleUserCreateService(
        repository=UserRepository()
    )
