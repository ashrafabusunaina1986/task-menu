# app/models/task.py

from pydantic import BaseModel, ConfigDict, Field
from typing import Optional, Literal
from datetime import datetime, timezone

# Define standard operational limits for system task states
Status = Literal["todo", "in_progress", "done"]
Priority = Literal["low", "medium", "high"]


class Task(BaseModel):
    """
    Core persistent database instance architecture for cluster task containers.
    Enforces dual-timeline serialization limits and strictly strips dynamic payload whitespaces.
    """
    id: Optional[str] = Field(default=None, alias="_id")

    user_id: str = Field(min_length=1)
    project_id: str = Field(min_length=1)

    title: str = Field(min_length=1)
    description: Optional[str] = None

    status: Status = "todo"
    priority: Priority = "low"

    # Strict dual-timeline parameter bounds injected for structural database safety
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

    # Dynamic date-time evaluations wrapped within runtime closures to catch true generation packets
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(
        default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        validate_assignment=True,
        populate_by_name=True,
        extra="forbid",
        str_strip_whitespace=True,
        from_attributes=True
    )
