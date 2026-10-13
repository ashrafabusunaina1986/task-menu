# app/security/exceptions/token.py

from fastapi import HTTPException, status


class TokenException:
    
    @staticmethod
    def invalid_token() -> None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token."
        )

    @staticmethod
    def expired_token() -> None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired."
        )

    @staticmethod
    def invalid_token_type() -> None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token type."
        )
