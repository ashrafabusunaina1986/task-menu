# app/models/team/team_member.py

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

TeamMemberRole = Literal["owner", "admin", "member"]

TeamMemberStatus = Literal["active", "pending", "removed"]


class TeamMemberModel(BaseModel):

    id: str | None = Field(default=None, alias="_id")

    team_id: str = Field(min_length=1)

    user_id: str = Field(min_length=1)

    role: TeamMemberRole = "member"

    status: TeamMemberStatus = "active"

    joined_at: datetime | None = None

    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
        extra="forbid",
        from_attributes=True,
        validate_assignment=True,
    )
