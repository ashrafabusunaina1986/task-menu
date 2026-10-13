
# app/core/container/register.py

from app.services.user.service import UserService
from app.security.auth.register import RegisterService
from app.core.container.user import get_user_service


def get_register_service() -> RegisterService:
    
    user_service: UserService = get_user_service()
    return RegisterService(
        user_service=user_service
    )
