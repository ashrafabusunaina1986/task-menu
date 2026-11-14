
# app/services/team/team_invitation/read.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team_invitation.read import (
    TeamInvitationRead,
    TeamInvitationsRead,
)
from app.schemas.team.team_invitation.response import (
    TeamInvitationResponse,
    TeamInvitationsResponse,
)

from app.repositories.team.team_invitation.repository import TeamInvitationRepository

from app.security.dependencies.service import DependencyService
from app.security.permissions.permissions import Permission

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamInvitationServiceRead:

    def __init__(
        self,
        repository: TeamInvitationRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    # GET INVITATIONS
    async def get_invitations(
        self,
        data: TeamInvitationsRead | None = None,
    ) -> TeamInvitationsResponse:

        # Check whether the current user has permission to read invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_READ,
        )

        # Retrieve the matching invitations.
        result = await self.repository.get_invitations(data)

        if result.total == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No team invitations found.",
            )

        return result

    # GET INVITATION
    async def get_invitation(
        self,
        data: TeamInvitationRead,
    ) -> TeamInvitationResponse:

        # Check whether the current user has permission to read invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_READ,
        )

        # Ensure that at least one search field is provided.
        filters = data.model_dump(
            exclude_none=True,
            exclude_unset=True,
        )

        if not filters:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one search filter is required.",
            )

        # Retrieve the matching invitation.
        invitation = await self.repository.get_invitation(data)

        if invitation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team invitation not found.",
            )

        return invitation
