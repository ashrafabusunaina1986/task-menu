# app/services/team/team_invitation/status.py

from fastapi import Depends, HTTPException, status
from datetime import datetime, timezone

from app.models.user.user import User
from app.schemas.team.team_invitation.response import TeamInvitationResponse
from app.schemas.team.team_invitation.read import TeamInvitationRead
from app.repositories.team.team_invitation.repository import TeamInvitationRepository

from app.security.dependencies.service import DependencyService
from app.security.permissions.permissions import Permission

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamInvitationServiceStatus:

    def __init__(
        self,
        repository: TeamInvitationRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def accept(self, invitation_id: str) -> TeamInvitationResponse:

        # Check whether the current user has permission to update invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_UPDATE,
        )

        # Retrieve the invitation.
        invitation = await self.repository.get_invitation(
            data=TeamInvitationRead(id=invitation_id)
        )

        if invitation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found.",
            )

        # Prevent the inviter from accepting their own invitation.
        if invitation.inviter_id == str(self.user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot accept an invitation you sent.",
            )

        # Ensure that the current user is the intended recipient.
        if invitation.invitee_email.lower() != self.user.email.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to accept this invitation.",
            )

        # Accept the invitation.
        accepted = await self.repository.accept(invitation_id=invitation_id)

        if accepted is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invitation cannot be accepted.",
            )

        return accepted

    async def reject(self, invitation_id: str) -> TeamInvitationResponse:

        # Check whether the current user has permission to update invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_UPDATE,
        )

        # Retrieve the invitation.
        invitation = await self.repository.get_invitation(
            data=TeamInvitationRead(id=invitation_id)
        )

        if invitation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found.",
            )

        # Prevent the inviter from rejecting their own invitation.
        if invitation.inviter_id == str(self.user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You cannot reject an invitation you sent.",
            )

        # Ensure that the current user is the intended recipient.
        if invitation.invitee_email.lower() != self.user.email.lower():
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You are not authorized to reject this invitation.",
            )

        # Reject the invitation.
        rejected = await self.repository.reject(invitation_id=invitation_id)

        if rejected is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invitation cannot be rejected.",
            )

        return rejected

    async def cancel(self, invitation_id: str) -> TeamInvitationResponse:

        # Check whether the current user has permission to update invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_UPDATE,
        )

        # Retrieve the invitation.
        invitation = await self.repository.get_invitation(
            data=TeamInvitationRead(id=invitation_id)
        )

        if invitation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found.",
            )

        # Ensure that the current user is the inviter.
        if invitation.inviter_id != str(self.user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only the inviter can cancel this invitation.",
            )

        # Ensure that the invitation is still pending.
        if invitation.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only pending invitations can be cancelled.",
            )

        # Cancel the invitation.
        cancelled = await self.repository.cancel(invitation_id=invitation_id)

        if cancelled is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invitation cannot be cancelled.",
            )

        return cancelled

    async def expire(self, invitation_id: str) -> TeamInvitationResponse:

        # Retrieve the invitation.
        invitation = await self.repository.get_invitation(
            data=TeamInvitationRead(id=invitation_id)
        )

        if invitation is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Invitation not found.",
            )

        # Ensure that the invitation is still pending.
        if invitation.status != "pending":
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Only pending invitations can be expired.",
            )

        # Ensure that the invitation has reached its expiration time.
        if invitation.expires_at > datetime.now(timezone.utc):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invitation has not expired yet.",
            )

        # Expire the invitation.
        expired = await self.repository.expire(invitation_id=invitation_id)

        if expired is None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Invitation cannot be expired.",
            )

        return expired
