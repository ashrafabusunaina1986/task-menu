# app/models/team/team.py

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field

TeamStatus = Literal[
    "active",
    "archived",
    "suspended",
]

TeamVisibility = Literal[
    "private",
    "public",
]


class TeamModel(BaseModel):

    id: str | None = Field(
        default=None,
        alias="_id",
    )

    name: str = Field(
        min_length=3,
        max_length=100,
    )

    description: str | None = Field(
        default=None,
        max_length=500,
    )

    owner_id: str = Field(
        min_length=1,
    )

    project_id: str = Field(
        min_length=1,
    )

    status: TeamStatus = "active"

    visibility: TeamVisibility = "private"

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc),
    )

    model_config = ConfigDict(
        populate_by_name=True,
        extra="forbid",
        validate_assignment=True,
        from_attributes=True,
        str_strip_whitespace=True,
    )
