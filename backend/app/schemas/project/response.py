
# app/schemas/project/response.py

from datetime import datetime

from pydantic import ConfigDict, Field

from app.schemas.project.base import ProjectBase


class ProjectResponse(ProjectBase):

    id: str = Field(
        alias="_id"
    )

    owner_id: str | None = None
    owner_role: str | None = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        str_strip_whitespace=True,
        extra="forbid"
    )
