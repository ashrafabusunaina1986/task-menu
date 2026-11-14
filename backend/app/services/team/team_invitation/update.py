# app/services/team/team_invitation/update.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team_invitation.update import TeamInvitationUpdate
from app.schemas.team.team_invitation.response import TeamInvitationResponse

from app.repositories.team.team_invitation.repository import TeamInvitationRepository

from app.security.dependencies.service import DependencyService
from app.security.permissions.permissions import Permission

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamInvitationServiceUpdate:

    def __init__(
        self,
        repository: TeamInvitationRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def update(
        self,
        invitation_id: str,
        data: TeamInvitationUpdate,
    ) -> TeamInvitationResponse:

        # Check whether the current user has permission to update invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_UPDATE,
        )

        # Update the invitation.
        update_invitation = await self.repository.update(
            invitation_id=invitation_id,
            data=data,
        )

        # Raise an exception if the invitation does not exist.
        if update_invitation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team invitation not found.",
            )

        return update_invitation
