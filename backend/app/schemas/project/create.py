
from pydantic import ConfigDict, Field

from app.schemas.project.base import ProjectBase


class ProjectCreate(ProjectBase):

    owner_id: str | None = Field(
        default=None,
        min_length=1
    )

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid"
    )
