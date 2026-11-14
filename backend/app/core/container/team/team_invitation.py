# app/core/container/team/team_invitation.py

from fastapi import Depends

from app.security.dependencies.service import DependencyService
from app.models.user.user import User

from app.core.container.security import (
    get_current_user_dependency,
    get_security_service,
)

from app.repositories.team.team_invitation.repository import TeamInvitationRepository
from app.core.container.team.team import get_team_service
from app.core.container.team.team_members import get_team_members_service
from app.core.container.user import get_user_service

from app.services.user.service import UserService
from app.services.team.team.service import TeamService
from app.services.team.team_members.service import TeamMemberService

from app.services.team.team_invitation.create import TeamInvitationServiceCreate
from app.services.team.team_invitation.read import TeamInvitationServiceRead
from app.services.team.team_invitation.update import TeamInvitationServiceUpdate
from app.services.team.team_invitation.delete import TeamInvitationServiceDelete
from app.services.team.team_invitation.status import TeamInvitationServiceStatus

from app.services.team.team_invitation.service import TeamInvitationService


# Provide the TeamInvitationRepository instance.
def get_team_invitation_repository() -> TeamInvitationRepository:
    return TeamInvitationRepository()


# Provide the service responsible for creating team invitations.
def get_team_invitation_create_service(
    repository: TeamInvitationRepository = Depends(get_team_invitation_repository),
    team: TeamService = Depends(get_team_service),
    team_member: TeamMemberService = Depends(get_team_members_service),
    user_service: UserService = Depends(get_user_service),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamInvitationServiceCreate:
    return TeamInvitationServiceCreate(
        repository=repository,
        team_service=team,
        team_member_service=team_member,
        user=user,
        user_service=user_service,
        security=security,
    )


# Provide the service responsible for reading team invitations.
def get_team_invitation_read_service(
    repository: TeamInvitationRepository = Depends(get_team_invitation_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamInvitationServiceRead:
    return TeamInvitationServiceRead(
        repository=repository, user=user, security=security
    )


# Provide the service responsible for updating team invitations.
def get_team_invitation_update_service(
    repository: TeamInvitationRepository = Depends(get_team_invitation_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamInvitationServiceUpdate:
    return TeamInvitationServiceUpdate(
        repository=repository, user=user, security=security
    )


# Provide the service responsible for deleting team invitations.
def get_team_invitation_delete_service(
    repository: TeamInvitationRepository = Depends(get_team_invitation_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamInvitationServiceDelete:
    return TeamInvitationServiceDelete(
        repository=repository, user=user, security=security
    )


# Provide the service responsible for changing invitation statuses.
def get_team_invitation_status_service(
    repository: TeamInvitationRepository = Depends(get_team_invitation_repository),
    user: User = Depends(get_current_user_dependency),
    security: DependencyService = Depends(get_security_service),
) -> TeamInvitationServiceStatus:
    return TeamInvitationServiceStatus(
        repository=repository, user=user, security=security
    )


# Assemble all specialized services into the main TeamInvitationService.
def get_invitation_service(
    create: TeamInvitationServiceCreate = Depends(get_team_invitation_create_service),
    read: TeamInvitationServiceRead = Depends(get_team_invitation_read_service),
    update: TeamInvitationServiceUpdate = Depends(get_team_invitation_update_service),
    delete: TeamInvitationServiceDelete = Depends(get_team_invitation_delete_service),
    status: TeamInvitationServiceStatus = Depends(get_team_invitation_status_service),
) -> TeamInvitationService:
    return TeamInvitationService(
        create=create, read=read, update=update, delete=delete, status=status
    )
