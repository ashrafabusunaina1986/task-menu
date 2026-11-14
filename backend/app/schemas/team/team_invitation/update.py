# app/schemas/team/team_invitation/update.py

from pydantic import BaseModel, ConfigDict, EmailStr

from app.models.team.team_invitation import TeamInvitationRole


class TeamInvitationUpdate(BaseModel):
    # Update the recipient's email address.
    invitee_email: EmailStr | None = None

    # Update the role assigned to the invited user.
    role: TeamInvitationRole | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )
