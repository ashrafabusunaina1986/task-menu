# app/security/password/service.py

from app.security.password.hasher import PasswordHasher
from app.security.password.reset import PasswordResetService
from app.security.password.validator import PasswordValidator


class PasswordService:

    def __init__(
        self,
        hasher: PasswordHasher,
        validator: PasswordValidator,
        reset: PasswordResetService
    ):
        self.hasher = hasher
        self.validator = validator
        self.reset = reset