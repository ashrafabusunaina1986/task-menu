# app/schemas/team/team/read.py

from pydantic import BaseModel, ConfigDict, Field

from app.models.team.team import TeamStatus


class TeamRead(BaseModel):

    team_id: str | None = None

    project_id: str | None = None

    owner_id: str | None = None

    name: str | None = None

    status: TeamStatus | None = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True,
    )

class TeamsRead(BaseModel):

    owner_id: str | None = None

    status: TeamStatus | None = None

    model_config = ConfigDict(
        from_attributes=True,
        extra="forbid",
        str_strip_whitespace=True,
        validate_assignment=True,
    )
