# app/security/permissions/roles.py

from enum import StrEnum
from app.security.constants import (
    ROLE_ADMIN,
    ROLE_MANAGER,
    ROLE_USER
)


class Role(StrEnum):
    ADMIN = ROLE_ADMIN
    MANAGER = ROLE_MANAGER
    USER = ROLE_USER
