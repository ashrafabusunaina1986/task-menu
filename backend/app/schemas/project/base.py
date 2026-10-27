
# app/schemas/project/base.py

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field

from app.models.project.project import Status, Priority


class ProjectBase(BaseModel):

    name: str = Field(
        min_length=1,
        max_length=150
    )

    description: str | None = Field(
        default=None,
        max_length=2000
    )

    status: Status = "planned"

    priority: Priority = "medium"

    start_date: datetime | None = None
    due_date: datetime | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )
