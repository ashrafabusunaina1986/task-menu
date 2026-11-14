# app/repositories/team/team_invitation/base.py

from abc import ABC, abstractmethod

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


class TeamInvitationRepositoryBase(ABC):

    # Create a new team invitation.
    @abstractmethod
    async def create(
        self,
        data: TeamInvitationModel,
    ) -> TeamInvitationResponse: ...

    # Retrieve a list of invitations using optional filters.
    @abstractmethod
    async def get_invitations(
        self,
        data: TeamInvitationsRead | None = None,
    ) -> TeamInvitationsResponse: ...

    # Retrieve a single invitation using search filters.
    @abstractmethod
    async def get_invitation(
        self,
        data: TeamInvitationRead,
    ) -> TeamInvitationResponse | None: ...

    # Update invitation details.
    @abstractmethod
    async def update(
        self,
        invitation_id: str,
        data: TeamInvitationUpdate,
    ) -> TeamInvitationResponse | None: ...

    # Accept a pending invitation.
    @abstractmethod
    async def accept(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None: ...

    # Reject a pending invitation.
    @abstractmethod
    async def reject(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None: ...

    # Cancel a pending invitation.
    @abstractmethod
    async def cancel(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None: ...

    # Mark an expired invitation as expired.
    @abstractmethod
    async def expire(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None: ...

    # Delete a single invitation.
    @abstractmethod
    async def delete(
        self,
        invitation_id: str,
    ) -> bool: ...

    # Delete all invitations associated with a team.
    @abstractmethod
    async def delete_invitations(
        self,
        team_id: str,
    ) -> int: ...
