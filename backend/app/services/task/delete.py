# app/services/task/delete.py

from fastapi import HTTPException

from app.services.task.base import TaskServiceBase

from app.security.permissions.roles import Role
from app.models.user.user import User


class TaskDeleteService(TaskServiceBase):

    async def delete(
        self,
        task_id: str,
        user: User
    ) -> dict:

        if user.role == Role.ADMIN:

            deleted = await self.repository.delete(
                task_id=task_id
            )
        else:

            deleted = await self.repository.delete_by_user(
                task_id=task_id,
                user_id=user.id
            )

        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        return {
            "message": "Task deleted successfully"
        }
