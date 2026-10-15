# app/models/user/validators.py

from pydantic import (
    EmailStr, field_validator
)


class UserValidators:

    @field_validator("name")
    @classmethod
    def validate_name(cls, value: str) -> str:
        value = value.strip()

        words = [word for word in value.split() if word]

        if len(words) < 1:
            raise ValueError(
                "Name must contain at least two words."
            )

        return " ".join(words)

    @field_validator("email")
    @classmethod
    def validate_email(cls, value: EmailStr) -> EmailStr:
        return value.lower().strip()
