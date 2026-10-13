# app/services/task/read.py

from fastapi import HTTPException

from app.services.task.base import TaskServiceBase

from app.models.user.user import User

from app.security.permissions.roles import Role


class TaskReadService(TaskServiceBase):

    async def get_all(
        self,
        user: User
    ) -> list[dict]:
        if user.role == Role.ADMIN:
            return await self.repository.get_all()

        return await self.repository.get_user_tasks(
            user_id=user.id
        )

    async def get_by_id(
        self,
        task_id: str,
        user: User
    ) -> dict:
        if user.role == Role.ADMIN:
            task = await self.repository.get_by_id(
                task_id=task_id
            )
        else:
            task = await self.repository.get_user_task_by_id(
                task_id=task_id,
                user_id=user.id
            )

        if task is None:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        return task
