# app/services/task/read.py

from fastapi import HTTPException, status

from app.services.task.base import TaskServiceBase

from app.models.user.user import User

from app.security.permissions.roles import Role


class TaskReadService(TaskServiceBase):

    async def get_all(
        self,
        user: User,
        project_id: str
    ) -> list[dict]:

        await self._check_project_access(user=user, project_id=project_id)

        if user.role == Role.ADMIN:
            return await self.repository.get_all(project_id=project_id)

        return await self.repository.get_user_tasks(
            user_id=str(user.id),
            project_id=project_id
        )

    async def get_by_id(
        self,
        task_id: str,
        user: User,
        project_id: str
    ) -> dict:
        await self._check_project_access(user=user, project_id=project_id)

        if user.role == Role.ADMIN:
            task = await self.repository.get_by_id(
                task_id=task_id,
                project_id=project_id
            )
        else:
            task = await self.repository.get_user_task_by_id(
                task_id=task_id,
                user_id=str(user.id),
                project_id=project_id
            )

        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )

        return task
