# app/services/task/update.py

from fastapi import HTTPException

from app.services.task.base import TaskServiceBase

from app.security.permissions.roles import Role
from app.models.user.user import User


class TaskUpdateService(TaskServiceBase):

    async def update(
        self,
        task_id: str,
        project_id: str,
        user: User,
        data: dict
    ) -> dict:
        if user.role == Role.ADMIN:
            result = await self.repository.update(
                task_id=task_id,
                data=data,
                project_id=project_id

            )
        else:
            result = await self.repository.update_by_user(
                task_id=task_id,
                user_id=user.id,
                data=data,
                project_id=project_id
            )

        if result is None or result.matched_count == 0:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        return {
            "message": "Task updated successfully"
        }
