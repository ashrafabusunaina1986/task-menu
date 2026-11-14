# app/schemas/team/team/response.py

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.team.team import (
    TeamStatus,
    TeamVisibility,
)


class TeamResponse(BaseModel):

    id: str = Field(alias="_id")

    name: str

    description: str | None = None

    owner_id: str

    project_id: str

    status: TeamStatus

    visibility: TeamVisibility

    created_at: datetime

    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True,
    )


class TeamList(BaseModel):

    teams: list[TeamResponse]

    total: int = Field(ge=0)
