# app/security/exceptions/auth.py

from fastapi import HTTPException, status


class AuthenticationException:

    @staticmethod
    def invalid_credentials() -> None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password."
        )

    @staticmethod
    def inactive_user() -> None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive."
        )

    @staticmethod
    def unverified_user() -> None:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is not verified."
        )
