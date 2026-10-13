# app/services/task/create.py

from app.services.task.base import TaskServiceBase
from app.schemas.task_schema import TaskCreate
from app.models.user.user import User


class TaskCreateService(TaskServiceBase):

    async def create(
        self,
        user: User,
        task_data: TaskCreate
    ) -> dict:

        task = task_data.model_dump()
        task["user_id"] = user.id

        task_id = await self.repository.create(
            task_data=task
        )

        return {
            "message": "Task created successfully",
            "id": task_id
        }
