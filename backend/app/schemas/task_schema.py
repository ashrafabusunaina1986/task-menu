# app/schemas/task_schema.py

from datetime import datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field

# Define strict enumerable limits for task pipeline metrics
Status = Literal["todo", "in_progress", "done"]
Priority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    """
    Data validation schema for incoming task initialization request payloads.
    Enforces absolute string boundaries and optional dual-timeline checkpoints.
    """
    project_id: str = Field(min_length=1)
    title: str = Field(min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: Status = "todo"
    priority: Priority = "low"

    # Injected continuous validation temporal parameters for cross-boundary verification
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None


class TaskUpdate(BaseModel):
    """
    Data validation schema for patch mutation operations on existing task nodes.
    Allows administrators to dynamically re-schedule deployment and delivery lifecycles.
    """
    title: Optional[str] = Field(default=None, min_length=1, max_length=100)
    description: Optional[str] = Field(default=None, max_length=1000)
    status: Optional[Status] = None
    priority: Optional[Priority] = None

    # Enable operators to realign baseline task execution limits live on production
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None


class TaskResponse(BaseModel):
    """
    Unified transactional egress schema for outgoing serializations.
    Exposes minified metadata clusters directly compatible with client-side dashboard panels.
    """
    id: str = Field(alias="_id")
    user_id: str
    project_id: str
    title: str
    description: Optional[str] = None
    status: Status
    priority: Priority

    # Exposed temporal fields required by analytics telemetry grids
    start_date: Optional[datetime] = None
    due_date: Optional[datetime] = None

    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True  # Enables flawless native database model mapping
    )
