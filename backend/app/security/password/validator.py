# app/security/password/validator.py

import re

from fastapi import HTTPException

from app.security.constants import PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH


class PasswordValidator:

    @classmethod
    def validate(cls, password: str) -> str:
        if len(password) < PASSWORD_MIN_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Password must be at least {PASSWORD_MIN_LENGTH} characters."
            )

        if len(password) > PASSWORD_MAX_LENGTH:
            raise HTTPException(
                status_code=400,
                detail=f"Password must not exceed {PASSWORD_MAX_LENGTH} characters."
            )

        if not re.search(r"[A-Z]", password):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one uppercase letter. "
            )

        if not re.search(r"[a-z]", password):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one lowercase letter."
            )

        if not re.search(r"\d", password):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one number"
            )

        if not re.search(
            r"[!@#$%^&*()_\-+=\[\]{}|\\:;\"'<>,.?/`~]",
            password
        ):
            raise HTTPException(
                status_code=400,
                detail="Password must contain at least one special character."
            )
        return password
