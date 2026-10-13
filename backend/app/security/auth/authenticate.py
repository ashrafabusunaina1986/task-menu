# app/security/auth/authenticate.py

from app.models.user.user import User
from app.services.user.service import UserService
from app.security.password.hasher import PasswordHasher
from pydantic import EmailStr


class AuthenticationService:

    def __init__(
        self,
        user_service: UserService,
        password_hasher: PasswordHasher
    ):
        self.user_service = user_service
        self.password_hasher = password_hasher

    async def authenticate(
        self,
        email: EmailStr,
        password: str
    ) -> User | None:
        """
        Verify email and password.

        Returns:
            User if authentication succeeds.
            None otherwise
        """
        user = await self.user_service.get_by_email(
            email=email
        )

        if not user:
            return None

        try:
            valid = self.password_hasher.verify(
                plain_password=password,
                hashed_password=user.hashed_password
            )

        except Exception as e:
            raise

        if not valid:
            return None

        return user
