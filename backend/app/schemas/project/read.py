
# app/schemas/project/read.py

from pydantic import BaseModel, ConfigDict, Field

from app.models.project.project import Status, Priority


class ProjectRead(BaseModel):

    project_id: str | None = None

    owner_id: str | None = None

    status: Status | None = None
    priority: Priority | None = None

    model_config = ConfigDict(
        str_strip_whitespace=True,
        populate_by_name=True,
        extra="forbid"
    )
