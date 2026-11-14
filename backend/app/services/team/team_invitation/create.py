# app/services/team/team_invitation/create.py

from datetime import datetime, timedelta, timezone

from fastapi import Depends, HTTPException, status

from app.models.user.user import User
from app.services.user.service import UserService
from app.models.team.team_invitation import TeamInvitationModel

from app.schemas.team.team_invitation.create import TeamInvitationCreate
from app.schemas.team.team_invitation.read import TeamInvitationRead
from app.schemas.team.team_invitation.response import TeamInvitationResponse

from app.schemas.team.team_members.read import TeamMemberRead

from app.repositories.team.team_invitation.repository import TeamInvitationRepository
from app.services.team.team.service import TeamService
from app.services.team.team_members.service import TeamMemberService


from app.security.dependencies.service import DependencyService
from app.security.permissions.permissions import Permission

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)
from app.core.container.team.team import get_team_service
from app.core.container.user import get_user_service
from app.core.container.team.team_members import get_team_members_service


class TeamInvitationServiceCreate:

    def __init__(
        self,
        repository: TeamInvitationRepository,
        team_service: TeamService = Depends(get_team_service),
        user_service: UserService = Depends(get_user_service),
        team_member_service: TeamMemberService = Depends(get_team_members_service),
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.team_service = team_service
        self.user_service = user_service
        self.team_member_service = team_member_service
        self.user = user
        self.security = security

    async def create(self, data: TeamInvitationCreate) -> TeamInvitationResponse:

        # Check whether the current user has permission to create team invitations.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_INVITATIONS_CREATE,
        )

        # Retrieve the team associated with the invitation.
        await self.team_service.get_team_by_id(team_id=data.team_id)

        # Normalize the invitee email address.
        invitee_email = str(data.invitee_email).lower()

        # Prevent users from inviting themselves.
        if invitee_email == str(self.user.email).lower():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You cannot invite yourself",
            )

        # Retrieve the user receiving the invitation.
        invitee = await self.user_service.get_by_email(invitee_email)

        # Retrieve the invitee user ID.
        invitee_id = str(invitee.id)

        # Check whether the invitee already belongs to an active team.
        try:
            await self.team_member_service.get_member(
                TeamMemberRead(
                    user_id=invitee_id,
                    status="active",
                )
            )
        except HTTPException as exc:
            if exc.status_code != status.HTTP_404_NOT_FOUND:
                raise
        else:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already belongs to an active team",
            )

        # Check whether a pending invitation already exists.
        existing_invitation = await self.repository.get_invitation(
            TeamInvitationRead(
                team_id=data.team_id,
                invitee_email=invitee_email,
                status="pending",
            )
        )

        if existing_invitation is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A pending invitation already exists",
            )

        # Get the current UTC time.
        now = datetime.now(timezone.utc)

        # Build the invitation document.
        invitation = TeamInvitationModel(
            team_id=data.team_id,
            inviter_id=str(self.user.id),
            invitee_email=invitee_email,
            role=data.role,
            status="pending",
            expires_at=now + timedelta(days=7),
            responded_at=None,
            created_at=now,
            updated_at=now,
        )

        # Save the invitation in the database.
        result = await self.repository.create(invitation)

        return result
