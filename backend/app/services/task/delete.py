# app/services/task/delete.py

from motor.motor_asyncio import AsyncIOMotorClientSession

from fastapi import HTTPException

from app.services.task.base import TaskServiceBase

from app.security.permissions.roles import Role
from app.models.user.user import User


class TaskDeleteService(TaskServiceBase):

    async def delete(
        self,
        task_id: str,
        project_id: str,
        user: User,
        session: AsyncIOMotorClientSession | None = None
    ) -> dict:

        if user.role == Role.ADMIN or user.role == Role.MANAGER:

            deleted = await self.repository.delete(
                task_id=task_id,
                session=session,
                project_id=project_id
            )
        else:

            deleted = await self.repository.delete_by_user(
                task_id=task_id,
                user_id=user.id,
                session=session,
                project_id=project_id
            )

        if not deleted:
            raise HTTPException(
                status_code=404,
                detail="Task not found"
            )

        return {
            "message": "Task deleted successfully"
        }

    async def delete_tasks(self, project_id: str, session: AsyncIOMotorClientSession | None = None) -> bool:
        return await self.repository.delete_tasks(project_id, session=session)
