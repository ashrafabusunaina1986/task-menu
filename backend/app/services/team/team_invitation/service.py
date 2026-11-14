# app/services/team/team_invitation/service.py

from app.services.team.team_invitation.base import TeamInvitationServiceBase

from app.services.team.team_invitation.create import TeamInvitationServiceCreate
from app.services.team.team_invitation.read import TeamInvitationServiceRead
from app.services.team.team_invitation.update import TeamInvitationServiceUpdate
from app.services.team.team_invitation.delete import TeamInvitationServiceDelete
from app.services.team.team_invitation.status import TeamInvitationServiceStatus

from app.schemas.team.team_invitation.read import (
    TeamInvitationRead,
    TeamInvitationsRead,
)


class TeamInvitationService(TeamInvitationServiceBase):

    def __init__(
        self,
        create: TeamInvitationServiceCreate,
        read: TeamInvitationServiceRead,
        update: TeamInvitationServiceUpdate,
        delete: TeamInvitationServiceDelete,
        status: TeamInvitationServiceStatus,
    ):
        # Initialize the specialized invitation services.
        self.create_service = create
        self.read_service = read
        self.update_service = update
        self.delete_service = delete
        self.status_service = status

    # CREATE INVITATION
    async def create(self, data):
        return await self.create_service.create(data)

    # GET ALL INVITATIONS
    async def get_invitations(self, data=None):
        return await self.read_service.get_invitations(data)

    # GET INVITATION USING FILTERS
    async def get_invitation(self, data):
        return await self.read_service.get_invitation(data)

    # UPDATE INVITATION
    async def update(self, invitation_id, data):
        return await self.update_service.update(invitation_id, data)

    # DELETE INVITATION BY ID
    async def delete(self, invitation_id):
        return await self.delete_service.delete(invitation_id)

    # DELETE ALL INVITATIONS ASSOCIATED WITH A TEAM
    async def delete_invitation(self, team_id):
        return await self.delete_service.delete_invitation(team_id)

    # ACCEPT INVITATION
    async def accept(self, invitation_id):
        return await self.status_service.accept(invitation_id)

    # REJECT INVITATION
    async def reject(self, invitation_id):
        return await self.status_service.reject(invitation_id)

    # CANCEL INVITATION
    async def cancel(self, invitation_id):
        return await self.status_service.cancel(invitation_id)

    # MARK INVITATION AS EXPIRED
    async def expire(self, invitation_id):
        return await self.status_service.expire(invitation_id)

    # GET INVITATION BY ID
    async def get_invitation_by_id(self, invitation_id: str):
        return await self.read_service.get_invitation(
            TeamInvitationRead(id=invitation_id)
        )

    # GET PENDING INVITATION BY TEAM AND EMAIL
    async def get_pending_invitation(
        self,
        team_id: str,
        invitee_email: str,
    ):
        return await self.read_service.get_invitation(
            TeamInvitationRead(
                team_id=team_id,
                invitee_email=invitee_email,
                status="pending",
            )
        )

    # GET ALL INVITATIONS ASSOCIATED WITH A TEAM
    async def get_invitations_by_team(self, team_id: str):
        return await self.read_service.get_invitations(
            TeamInvitationsRead(team_id=team_id)
        )

    # GET ALL INVITATIONS SENT TO AN EMAIL
    async def get_invitations_by_email(self, invitee_email: str):
        return await self.read_service.get_invitations(
            TeamInvitationsRead(invitee_email=invitee_email)
        )

    # GET INVITATION BY TEAM AND EMAIL
    async def get_invitation_by_team_and_email(
        self,
        team_id: str,
        invitee_email: str,
    ):
        return await self.read_service.get_invitation(
            TeamInvitationRead(
                team_id=team_id,
                invitee_email=invitee_email,
            )
        )
