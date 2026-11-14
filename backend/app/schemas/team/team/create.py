# app/schemas/team/team/create.py

from pydantic import BaseModel, Field

from app.models.team.team import TeamVisibility


class TeamCreate(BaseModel):

    name: str = Field(min_length=3, max_length=100)

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    project_id: str = Field(min_length=1)

    visibility: TeamVisibility = "private"
