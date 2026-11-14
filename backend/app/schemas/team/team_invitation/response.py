# app/schemas/team/team_invitation/response.py

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.team.team_invitation import (
    TeamInvitationRole,
    TeamInvitationStatus,
)
from .base import TeamInvitationBase


class TeamInvitationResponse(TeamInvitationBase):
    # Unique identifier of the invitation.
    id: str

    # ID of the user who sent the invitation.
    inviter_id: str

    # Current status of the invitation.
    status: TeamInvitationStatus

    # Date and time when the invitation expires.
    expires_at: datetime

    # Date and time when the invitation was accepted or rejected.
    responded_at: datetime | None = None

    # Date and time when the invitation was created.
    created_at: datetime

    # Date and time when the invitation was last updated.
    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
    )


class TeamInvitationsResponse(BaseModel):
    # List of returned invitations.
    invitations: list[TeamInvitationResponse] = Field(default_factory=list)

    # Total number of returned invitations.
    total: int

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
    )