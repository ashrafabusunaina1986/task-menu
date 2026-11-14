# app/schemas/team/team/update.py

from pydantic import BaseModel, ConfigDict, Field

from app.models.team.team import (
    TeamStatus,
    TeamVisibility,
)


class TeamUpdate(BaseModel):

    name: str | None = Field(
        default=None,
        min_length=3,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    visibility: TeamVisibility | None = None

    status: TeamStatus | None = None

    model_config = ConfigDict(
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True,
        from_attributes=True,
    )
