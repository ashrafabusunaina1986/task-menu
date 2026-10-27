# app/services/task/create.py

from datetime import datetime, timezone

from app.services.task.base import TaskServiceBase
from app.schemas.task_schema import TaskCreate
from app.models.user.user import User
from app.models.task import Task


class TaskCreateService(TaskServiceBase):

    async def create(
        self,
        user: User,
        task_data: TaskCreate,
    ) -> dict:

        now = datetime.now(timezone.utc)
        task_model = task_data.model_dump()
        task_model["user_id"] = user.id
        task_model["created_at"] = now
        task_model["updated_at"] = now

        task = Task.model_validate(task_model)

        task_id = await self.repository.create(
            task_data=task
        )

        return {
            "message": "Task created successfully",
            "id": task_id
        }
