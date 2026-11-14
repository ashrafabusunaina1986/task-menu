# app/schemas/team/team_members/update.py

from pydantic import BaseModel, ConfigDict, Field

from app.models.team.team_member import (
    TeamMemberRole,
    TeamMemberStatus,
)


class TeamMemberUpdate(BaseModel):

    role: TeamMemberRole | None = None

    status: TeamMemberStatus | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
        validate_assignment=True,
    )
