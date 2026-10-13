# app/security/token/types.py

from app.security.constants import (
    ACCESS_TOKEN_TYPE,
    REFRESH_TOKEN_TYPE,
    REGISTER_TOKEN_TYPE,
)

from enum import Enum


class TokenTypes(str, Enum):
    ACCESS = ACCESS_TOKEN_TYPE
    REFRESH = REFRESH_TOKEN_TYPE
    REGISTER = REGISTER_TOKEN_TYPE
