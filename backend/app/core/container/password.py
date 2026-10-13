# app/core/container/password.py

from app.security.password.service import PasswordService
from app.security.password.hasher import PasswordHasher
from app.security.password.reset import PasswordResetService
from app.security.password.validator import PasswordValidator


def get_password_service() -> PasswordService:
    return PasswordService(
        reset=PasswordResetService(),
        hasher=PasswordHasher(),
        validator=PasswordValidator()
    )
