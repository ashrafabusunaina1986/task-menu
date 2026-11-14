# app/security/permissions/permissions.py

from enum import StrEnum


class Permission(StrEnum):

    # ==========================================
    # USER: User account management
    # ==========================================
    USERS_CREATE = "users:create"  # Create new users
    USERS_READ = "users:read"  # View user information
    USERS_UPDATE = "users:update"  # Update user information
    USERS_DELETE = "users:delete"  # Delete users

    # ==========================================
    # TASK: Task management
    # ==========================================
    TASKS_CREATE = "tasks:create"  # Create tasks
    TASKS_READ = "tasks:read"  # View tasks
    TASKS_UPDATE = "tasks:update"  # Update tasks
    TASKS_DELETE = "tasks:delete"  # Delete tasks

    # ==========================================
    # PROJECT: Project management
    # ==========================================
    PROJECTS_CREATE = "projects:create"  # Create projects
    PROJECTS_READ = "projects:read"  # View projects
    PROJECTS_UPDATE = "projects:update"  # Update projects
    PROJECTS_DELETE = "projects:delete"  # Delete projects

    # Assign or transfer project ownership
    PROJECTS_ASSIGN_OWNER = "projects:assign_owner"

    # Create projects without assigning an owner
    PROJECTS_CREATE_UNASSIGNED = "projects:create_unassigned"

    # ==========================================
    # TEAM: Team management
    # ==========================================
    TEAMS_CREATE = "teams:create"  # Create teams
    TEAMS_READ = "teams:read"  # View teams
    TEAMS_UPDATE = "teams:update"  # Update team information
    TEAMS_DELETE = "teams:delete"  # Delete teams

    # ==========================================
    # TEAM MEMBER: Team membership management
    # ==========================================
    TEAM_MEMBERS_CREATE = "team_members:create"  # Add members to teams
    TEAM_MEMBERS_READ = "team_members:read"  # View team members
    TEAM_MEMBERS_UPDATE = "team_members:update"  # Update member roles or status
    TEAM_MEMBERS_DELETE = "team_members:delete"  # Remove members from teams

    # ==========================================
    # TEAM INVITATION: Team invitation management
    # ==========================================
    TEAM_INVITATIONS_CREATE = "team_invitations:create"  # Create invitations
    TEAM_INVITATIONS_READ = "team_invitations:read"  # View invitations
    TEAM_INVITATIONS_UPDATE = (
        "team_invitations:update"  # Accept, reject, or update invitations
    )
    TEAM_INVITATIONS_DELETE = "team_invitations:delete"  # Cancel or delete invitations
