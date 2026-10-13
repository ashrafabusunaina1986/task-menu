# app/security/permissions/permissions.py

from enum import StrEnum


class Permission(StrEnum):
    USERS_CREATE = "users:create"
    USERS_READ = "users:read"
    USERS_UPDATE = "users:update"
    USERS_DELETE = "users:delete"

    TASKS_CREATE = "tasks:create"
    TASKS_READ = "tasks:read"
    TASKS_UPDATE = "tasks:update"
    TASKS_DELETE = "tasks:delete"
