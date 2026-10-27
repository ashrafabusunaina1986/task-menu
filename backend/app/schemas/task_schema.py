# app/schemas/task_schema.py

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


Status = Literal["todo", "in_progress", "done"]
Priority = Literal["low", "medium", "high"]


class TaskCreate(BaseModel):
    project_id: str = Field(min_length=1)
    title: str = Field(min_length=1, max_length=100)
    description: str | None = Field(default=None, max_length=1000)
    status: Status = "todo"
    priority: Priority = "low"


class TaskUpdate(BaseModel):
    title: str | None = Field(
        default=None,
        min_length=1,
        max_length=100
    )
    description: str | None = Field(default=None, max_length=1000)
    status: Status | None = None
    priority: Priority | None = None


class TaskResponse(BaseModel):
    model_config = ConfigDict(
        populate_by_name=True
    )

    id: str = Field(alias="_id")
    user_id: str
    project_id: str
    title: str
    description: str | None = None
    status: Status
    priority: Priority
    created_at: datetime
    updated_at: datetime
