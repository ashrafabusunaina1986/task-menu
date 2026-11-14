# app/repositories/team/team_invitation/repository.py

from app.repositories.team.team_invitation.base import (
    TeamInvitationRepositoryBase,
)

from app.repositories.team.team_invitation.create import (
    TeamInvitationRepositoryCreate,
)
from app.repositories.team.team_invitation.read import (
    TeamInvitationRepositoryRead,
)
from app.repositories.team.team_invitation.update import (
    TeamInvitationRepositoryUpdate,
)
from app.repositories.team.team_invitation.delete import (
    TeamInvitationRepositoryDelete,
)
from app.repositories.team.team_invitation.status import (
    TeamInvitationRepositoryStatus,
)

from app.models.team.team_invitation import TeamInvitationModel

from app.schemas.team.team_invitation.read import (
    TeamInvitationRead,
    TeamInvitationsRead,
)
from app.schemas.team.team_invitation.update import TeamInvitationUpdate
from app.schemas.team.team_invitation.response import (
    TeamInvitationResponse,
    TeamInvitationsResponse,
)


class TeamInvitationRepository(TeamInvitationRepositoryBase):

    def __init__(self):
        # Initialize repositories for each operation.
        self.create_repository = TeamInvitationRepositoryCreate()
        self.read_repository = TeamInvitationRepositoryRead()
        self.update_repository = TeamInvitationRepositoryUpdate()
        self.delete_repository = TeamInvitationRepositoryDelete()
        self.status_repository = TeamInvitationRepositoryStatus()

    # CREATE
    async def create(
        self,
        data: TeamInvitationModel,
    ) -> TeamInvitationResponse:
        return await self.create_repository.create(data=data)

    # READ
    async def get_invitations(
        self,
        data: TeamInvitationsRead | None = None,
    ) -> TeamInvitationsResponse:
        return await self.read_repository.get_invitations(data=data)

    async def get_invitation(
        self,
        data: TeamInvitationRead,
    ) -> TeamInvitationResponse | None:
        return await self.read_repository.get_invitation(data=data)

    # UPDATE
    async def update(
        self,
        invitation_id: str,
        data: TeamInvitationUpdate,
    ) -> TeamInvitationResponse | None:
        return await self.update_repository.update(
            invitation_id=invitation_id,
            data=data,
        )

    # STATUS
    async def accept(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:
        return await self.status_repository.accept(
            invitation_id=invitation_id,
        )

    async def reject(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:
        return await self.status_repository.reject(
            invitation_id=invitation_id,
        )

    async def cancel(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:
        return await self.status_repository.cancel(
            invitation_id=invitation_id,
        )

    async def expire(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:
        return await self.status_repository.expire(
            invitation_id=invitation_id,
        )

    # DELETE
    async def delete(
        self,
        invitation_id: str,
    ) -> bool:
        return await self.delete_repository.delete(
            invitation_id=invitation_id,
        )

    async def delete_invitations(
        self,
        team_id: str,
    ) -> int:
        return await self.delete_repository.delete_invitations(
            team_id=team_id,
        )
