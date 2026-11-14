# app/schemas/team/team_invitation/base.py

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.team.team_invitation import TeamInvitationRole


class TeamInvitationBase(BaseModel):
    # ID of the team associated with the invitation.
    team_id: str

    # Email address of the user receiving the invitation.
    invitee_email: EmailStr

    # Role assigned to the invited user after accepting the invitation.
    role: TeamInvitationRole = "member"

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )