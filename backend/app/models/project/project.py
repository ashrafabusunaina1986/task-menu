
# app/models/project/project.py

from datetime import datetime, timezone
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Status = Literal[
    "planned",
    "in_progress",
    "on_hold",
    "completed",
    "cancelled"
]

Priority = Literal[
    "low",
    "medium",
    "high"
]


class ProjectModel(BaseModel):

    id: str | None = Field(
        default=None,
        alias="_id"
    )

    name: str = Field(
        min_length=1,
        max_length=150
    )

    description: str | None = Field(
        default=None,
        max_length=2000
    )

    owner_id: str | None = Field(
        default=None,
        min_length=1
    )
    owner_role: str | None = None

    status: Status = "planned"
    priority: Priority = "medium"

    start_date: datetime | None = None
    due_date: datetime | None = None

    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc)
    )

    model_config = ConfigDict(
        validate_assignment=True,
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True
    )
