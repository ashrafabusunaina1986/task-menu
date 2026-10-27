# app/services/task/base.py
from fastapi import HTTPException, status

from app.repositories.task.repository import TaskRepository
from app.services.project.read import ProjectServiceRead
from app.models.user.user import User

from app.schemas.project.read import ProjectRead


class TaskServiceBase:

    def __init__(
        self,
        project_service_read: ProjectServiceRead
    ):
        self.repository = TaskRepository()
        self.project_service_read = project_service_read

    async def _check_project_access(
        self,
        user: User,
        project_id: str
    ) -> None:
        project = await self.project_service_read.get_project(
            data=ProjectRead(
                owner_id=str(user.id),
                project_id=project_id
            )
        )

        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
