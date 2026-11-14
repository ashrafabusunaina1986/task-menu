# app/schemas/team/team_members/response.py

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.team.team_member import (
    TeamMemberRole,
    TeamMemberStatus,
)


class TeamMemberResponse(BaseModel):

    member_id: str

    team_id: str

    user_id: str

    role: TeamMemberRole

    status: TeamMemberStatus

    joined_at: datetime | None = None

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
    )


class TeamMembersResponse(BaseModel):

    members: list[TeamMemberResponse] = Field(default_factory=list)

    total: int

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
    )