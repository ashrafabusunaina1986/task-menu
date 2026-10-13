# app/security/password/reset.py

from app.security.password.hasher import PasswordHasher
from app.security.password.validator import PasswordValidator


class PasswordResetService:

    def __init__(
        self
    ):
        self.hasher = PasswordHasher()

    def reset(self, password: str) -> str:
        """
        Validate and hash a new password.
        Returns the hashed password ready for storage.
        """

        PasswordValidator.validate(password=password)

        return self.hasher.hash(
            password=password
        )
