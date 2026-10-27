# app/models/task.py

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Literal
from datetime import datetime, timezone

Status = Literal[
    "todo", "in_progress", "done"
]
Priority = Literal[
    "low", "medium", "high"
]


class Task(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")

    user_id: str = Field(min_length=1)
    project_id: str = Field(min_length=1)

    title: str = Field(min_length=1)
    description: Optional[str] = None

    status: Status = "todo"
    priority: Priority = "low"

    created_at: datetime = Field(default_factory=datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=datetime.now(timezone.utc))

    model_config = ConfigDict(
        validate_assignment=True,
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True
    )
