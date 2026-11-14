# app/services/team/team_invitation/delete.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.repositories.team.team_invitation.repository import TeamInvitationRepository

from app.security.dependencies.service import DependencyService
from app.security.permissions.permissions import Permission

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamInvitationServiceDelete:

    def __init__(
        self,
        repository: TeamInvitationRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def delete(self, invitation_id: str) -> bool:

        # Check whether the current user has permission to delete invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_DELETE,
        )

        # Delete the invitation.
        deleted = await self.repository.delete(invitation_id=invitation_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team invitation not found.",
            )

        return deleted

    async def delete_invitation(self, team_id: str) -> int:

        # Check whether the current user has permission to delete invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_DELETE,
        )

        # Delete all invitations associated with the team.
        deleted_count = await self.repository.delete_invitations(team_id=team_id)

        if deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No team invitations found.",
            )

        return deleted_count
