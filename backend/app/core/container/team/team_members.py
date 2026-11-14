# app/core/container/team/team_members.py

from fastapi import Depends

# Import the main TeamMember service aggregator.
from app.services.team.team_members.service import TeamMemberService

# Import individual TeamMember services.
from app.services.team.team_members.create import TeamMemberServiceCreate
from app.services.team.team_members.read import TeamMemberServiceRead
from app.services.team.team_members.update import TeamMemberServiceUpdate
from app.services.team.team_members.delete import TeamMemberServiceDelete
from app.services.team.team_members.reactivate import TeamMemberServiceReactivate

# Import individual TeamMember repository implementations.
from app.repositories.team.team_members.repository import TeamMemberRepository

# Import user and security dependencies.
from app.models.user.user import User
from app.security.dependencies.service import DependencyService

# Import the Team service to access team-related operations.
from app.services.team.team.service import TeamService

# Import the Team repository dependency using an alias to distinguish it.
from app.core.container.team.team import get_repository as get_team_repository

# Import authentication and security dependency providers.
from app.core.container.security import (
    get_current_user_dependency,
    get_security_service,
)

# ---------------------------------------------------------
# REPOSITORY
# ---------------------------------------------------------


def get_team_members_repository() -> TeamMemberRepository:
    return TeamMemberRepository()


# ---------------------------------------------------------
# CREATE SERVICE
# ---------------------------------------------------------


# Build the service responsible for creating team memberships.
def get_team_members_create_service(
    repository: TeamMemberRepository = Depends(get_team_members_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    team_repository: TeamService = Depends(get_team_repository),
) -> TeamMemberServiceCreate:

    return TeamMemberServiceCreate(
        repository=repository,
        team_repository=team_repository,
        user=user,
        security=security,
    )


# ---------------------------------------------------------
# READ SERVICE
# ---------------------------------------------------------


# Build the service responsible for retrieving team memberships.
def get_team_members_read_service(
    repository: TeamMemberRepository = Depends(get_team_members_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    team_repository: TeamService = Depends(get_team_repository),
) -> TeamMemberServiceRead:

    return TeamMemberServiceRead(
        repository=repository,
        team_repository=team_repository,
        user=user,
        security=security,
    )


# ---------------------------------------------------------
# UPDATE SERVICE
# ---------------------------------------------------------


# Build the service responsible for updating team memberships.
def get_team_members_update_service(
    repository: TeamMemberRepository = Depends(get_team_members_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    team_repository: TeamService = Depends(get_team_repository),
) -> TeamMemberServiceUpdate:

    return TeamMemberServiceUpdate(
        repository=repository,
        team_repository=team_repository,
        user=user,
        security=security,
    )


# ---------------------------------------------------------
# DELETE SERVICE
# ---------------------------------------------------------


# Build the service responsible for deleting team memberships.
def get_team_members_delete_service(
    repository: TeamMemberRepository = Depends(get_team_members_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    team_repository: TeamService = Depends(get_team_repository),
) -> TeamMemberServiceDelete:

    return TeamMemberServiceDelete(
        repository=repository,
        team_repository=team_repository,
        user=user,
        security=security,
    )


# ---------------------------------------------------------
# REACTIVATE SERVICE
# ---------------------------------------------------------


# Build the service responsible for reactivating removed memberships.
def get_team_members_reactivate_service(
    repository: TeamMemberRepository = Depends(get_team_members_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
    team_repository: TeamService = Depends(get_team_repository),
) -> TeamMemberServiceReactivate:

    return TeamMemberServiceReactivate(
        repository=repository,
        team_repository=team_repository,
        user=user,
        security=security,
    )


# ---------------------------------------------------------
# TEAM MEMBERS SERVICE AGGREGATOR
# ---------------------------------------------------------


# Combine all TeamMember services into one service interface.
def get_team_members_service(
    create: TeamMemberServiceCreate = Depends(get_team_members_create_service),
    read: TeamMemberServiceRead = Depends(get_team_members_read_service),
    update: TeamMemberServiceUpdate = Depends(get_team_members_update_service),
    delete: TeamMemberServiceDelete = Depends(get_team_members_delete_service),
    reactivate: TeamMemberServiceReactivate = Depends(
        get_team_members_reactivate_service
    ),
) -> TeamMemberService:

    return TeamMemberService(
        create=create,
        read=read,
        update=update,
        delete=delete,
        reactivate=reactivate,
    )
