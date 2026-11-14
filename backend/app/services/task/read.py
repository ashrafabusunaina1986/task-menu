# app/services/task/read.py

from fastapi import HTTPException, status

from app.services.task.base import TaskServiceBase

from app.models.user.user import User

from app.security.permissions.roles import Role


class TaskReadService(TaskServiceBase):

    async def get_all(self, user: User, project_id: str) -> list[dict]:
        """
        Fetches the complete active task operational tree for a specific parent project container.
        ✅ FIXED CRITICAL LOGIC OVERLAP: Stripped out the temporal 403 freeze barriers from this retrieval query block.
        This guarantees that archived, historical, and expired project data fields remain fully transparent and readable.
        """
        # 1. Authority Clearance Check: Enforce structural dependency ownership authorization gates
        await self._check_owner_project(project_id=project_id)

        # 2. RBAC Data Retrieval: Admin reads the entire catalog cluster, while users fetch their personal allocations
        if user.role == Role.ADMIN:
            return await self.repository.get_all(project_id=project_id)

        return await self.repository.get_user_tasks(
            user_id=str(user.id), project_id=project_id
        )

    async def get_by_id(self, task_id: str, user: User, project_id: str) -> dict:

        if user.role == Role.ADMIN:
            task = await self.repository.get_by_id(
                task_id=task_id, project_id=project_id
            )
        else:
            task = await self.repository.get_user_task_by_id(
                task_id=task_id, user_id=str(user.id), project_id=project_id
            )

        if task is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
            )

        return task

    async def check_task_title(self, task_title: str) -> bool:
        return await self.repository.check_task_title(task_title=task_title.strip())
