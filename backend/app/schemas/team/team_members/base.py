# app/schemas/team/team_members/base.py

from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.team.team_member import (
    TeamMemberRole,
    TeamMemberStatus,
)


class TeamMemberBase(BaseModel):

    team_id: str

    user_id: str

    role: TeamMemberRole = "member"

    status: TeamMemberStatus = "active"

    joined_at: datetime | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )
