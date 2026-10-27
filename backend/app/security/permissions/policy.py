# app/security/permissions/policy.py


from app.security.permissions.roles import Role
from app.security.permissions.permissions import Permission


class PermissionPolicy:

    ROLE_PERMISSION = {
        Role.ADMIN: {
            Permission.USERS_CREATE,
            Permission.USERS_DELETE,
            Permission.USERS_READ,
            Permission.USERS_UPDATE,

            Permission.TASKS_CREATE,
            Permission.TASKS_DELETE,
            Permission.TASKS_READ,
            Permission.TASKS_UPDATE,

            Permission.PROJECTS_CREATE,
            Permission.PROJECTS_READ,
            Permission.PROJECTS_UPDATE,
            Permission.PROJECTS_DELETE,
            Permission.PROJECTS_ASSIGN_OWNER,
            Permission.PROJECTS_CREATE_UNASSIGNED
        },

        Role.MANAGER: {
            Permission.TASKS_CREATE,
            Permission.TASKS_DELETE,
            Permission.TASKS_READ,
            Permission.TASKS_UPDATE,

            Permission.PROJECTS_CREATE,
            Permission.PROJECTS_READ,
            Permission.PROJECTS_UPDATE,
            Permission.PROJECTS_DELETE,
            Permission.PROJECTS_CREATE_UNASSIGNED,
            Permission.PROJECTS_ASSIGN_OWNER,
        },

        Role.USER: {
            Permission.TASKS_CREATE,
            Permission.TASKS_DELETE,
            Permission.TASKS_READ,
            Permission.TASKS_UPDATE,

            Permission.PROJECTS_CREATE,
            Permission.PROJECTS_READ,
            Permission.PROJECTS_UPDATE,
        }
    }

    def get_permissions(
        self,
        role: Role
    ) -> set[Permission]:
        return self.ROLE_PERMISSION.get(
            role,
            set()
        )

    def has_permission(
        self,
        role: Role,
        permission: Permission
    ) -> bool:
        return permission in self.get_permissions(
            role=role
        )
