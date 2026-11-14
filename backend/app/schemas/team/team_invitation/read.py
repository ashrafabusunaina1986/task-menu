# app/schemas/team/team_invitation/read.py

from pydantic import BaseModel, ConfigDict

from app.models.team.team_invitation import (
    TeamInvitationRole,
    TeamInvitationStatus,
)


class TeamInvitationRead(BaseModel):
    # Filter invitations by their MongoDB document ID.
    id: str | None = None

    # Filter invitations by team ID.
    team_id: str | None = None

    # Filter invitations by the user who sent them.
    inviter_id: str | None = None

    # Filter invitations by the recipient's email address.
    invitee_email: str | None = None

    # Filter invitations by the assigned role.
    role: TeamInvitationRole | None = None

    # Filter invitations by their current status.
    status: TeamInvitationStatus | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )


class TeamInvitationsRead(BaseModel):
    # Filter invitations by team ID.
    team_id: str | None = None

    # Filter invitations by the user who sent them.
    inviter_id: str | None = None

    # Filter invitations by the recipient's email address.
    invitee_email: str | None = None

    # Filter invitations by the assigned role.
    role: TeamInvitationRole | None = None

    # Filter invitations by their current status.
    status: TeamInvitationStatus | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )