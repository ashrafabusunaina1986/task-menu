# app/schemas/team/team_members/read.py


from pydantic import BaseModel, ConfigDict

from app.models.team.team_member import (
    TeamMemberRole,
    TeamMemberStatus,
)


class TeamMemberRead(BaseModel):

    member_id: str | None = None

    team_id: str | None = None

    user_id: str | None = None

    role: TeamMemberRole | None = None

    status: TeamMemberStatus | None = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True,
    )


class TeamMembersRead(BaseModel):

    team_id: str | None = None

    user_id: str | None = None

    role: TeamMemberRole | None = None

    status: TeamMemberStatus | None = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True,
    )