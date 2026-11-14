# app/services/team/team_invitation/base.py

from abc import ABC, abstractmethod

from app.schemas.team.team_invitation.create import TeamInvitationCreate
from app.schemas.team.team_invitation.read import (
    TeamInvitationRead,
    TeamInvitationsRead,
)
from app.schemas.team.team_invitation.update import TeamInvitationUpdate
from app.schemas.team.team_invitation.response import (
    TeamInvitationResponse,
    TeamInvitationsResponse,
)


class TeamInvitationServiceBase(ABC):

    # Create a new team invitation.
    @abstractmethod
    async def create(
        self,
        data: TeamInvitationCreate,
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
    ) -> TeamInvitationResponse: ...

    # Reject a pending invitation.
    @abstractmethod
    async def reject(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse: ...

    # Cancel a pending invitation.
    @abstractmethod
    async def cancel(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse: ...

    # Mark an expired invitation as expired.
    @abstractmethod
    async def expire(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse: ...

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
