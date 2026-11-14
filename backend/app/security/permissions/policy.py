# app/security/permissions/policy.py

from app.security.permissions.roles import Role
from app.security.permissions.permissions import Permission


class PermissionPolicy:

    ROLE_PERMISSION = {
        # ==========================================
        # ADMIN: Full access to all system resources
        # ==========================================
        Role.ADMIN: {
            # USER: Manage system users
            Permission.USERS_CREATE,
            Permission.USERS_DELETE,
            Permission.USERS_READ,
            Permission.USERS_UPDATE,
            # TASK: Manage all tasks
            Permission.TASKS_CREATE,
            Permission.TASKS_DELETE,
            Permission.TASKS_READ,
            Permission.TASKS_UPDATE,
            # PROJECT: Manage all projects and ownership
            Permission.PROJECTS_CREATE,
            Permission.PROJECTS_READ,
            Permission.PROJECTS_UPDATE,
            Permission.PROJECTS_DELETE,
            Permission.PROJECTS_ASSIGN_OWNER,
            Permission.PROJECTS_CREATE_UNASSIGNED,
            # TEAM: Manage teams
            Permission.TEAMS_CREATE,
            Permission.TEAMS_READ,
            Permission.TEAMS_UPDATE,
            Permission.TEAMS_DELETE,
            # TEAM MEMBER: Manage team memberships
            Permission.TEAM_MEMBERS_CREATE,
            Permission.TEAM_MEMBERS_READ,
            Permission.TEAM_MEMBERS_UPDATE,
            Permission.TEAM_MEMBERS_DELETE,
            # TEAM INVITATION: Manage team invitations
            Permission.TEAM_INVITATIONS_CREATE,
            Permission.TEAM_INVITATIONS_READ,
            Permission.TEAM_INVITATIONS_UPDATE,
            Permission.TEAM_INVITATIONS_DELETE,
        },
        # ==========================================
        # MANAGER: Manage operational resources
        # ==========================================
        Role.MANAGER: {
            # TASK: Manage tasks
            Permission.TASKS_CREATE,
            Permission.TASKS_DELETE,
            Permission.TASKS_READ,
            Permission.TASKS_UPDATE,
            # PROJECT: Manage projects and ownership
            Permission.PROJECTS_CREATE,
            Permission.PROJECTS_READ,
            Permission.PROJECTS_UPDATE,
            Permission.PROJECTS_DELETE,
            Permission.PROJECTS_CREATE_UNASSIGNED,
            Permission.PROJECTS_ASSIGN_OWNER,
            # TEAM: Manage teams
            Permission.TEAMS_CREATE,
            Permission.TEAMS_READ,
            Permission.TEAMS_UPDATE,
            Permission.TEAMS_DELETE,
            # TEAM MEMBER: Manage team memberships
            Permission.TEAM_MEMBERS_CREATE,
            Permission.TEAM_MEMBERS_READ,
            Permission.TEAM_MEMBERS_UPDATE,
            Permission.TEAM_MEMBERS_DELETE,
            # TEAM INVITATION: Manage team invitations
            Permission.TEAM_INVITATIONS_CREATE,
            Permission.TEAM_INVITATIONS_READ,
            Permission.TEAM_INVITATIONS_UPDATE,
            Permission.TEAM_INVITATIONS_DELETE,
        },
        # ==========================================
        # USER: Access assigned resources only
        # ==========================================
        Role.USER: {
            # TASK: Access and manage permitted tasks
            Permission.TASKS_CREATE,
            Permission.TASKS_DELETE,
            Permission.TASKS_READ,
            Permission.TASKS_UPDATE,
            # PROJECT: Access and manage permitted projects
            Permission.PROJECTS_CREATE,
            Permission.PROJECTS_READ,
            Permission.PROJECTS_UPDATE,
            # TEAM: Read assigned teams
            Permission.TEAMS_READ,
            # TEAM MEMBER: Read team members
            Permission.TEAM_MEMBERS_READ,
            # TEAM INVITATION: Read and respond to own invitations
            Permission.TEAM_INVITATIONS_READ,
            Permission.TEAM_INVITATIONS_UPDATE,
        },
    }

    # Return all permissions assigned to a role
    def get_permissions(self, role: Role) -> set[Permission]:
        return self.ROLE_PERMISSION.get(role, set())

    # Check whether a role has a specific permission
    def has_permission(self, role: Role, permission: Permission) -> bool:
        return permission in self.get_permissions(role=role)
