# app/services/task/base.py
from fastapi import HTTPException, status
from datetime import datetime
from app.repositories.task.repository import TaskRepository
from app.services.project.read import ProjectServiceRead
from app.models.user.user import User


from app.schemas.project.read import ProjectRead


class TaskServiceBase:

    def __init__(self, project_service_read: ProjectServiceRead):
        self.repository = TaskRepository()
        self.project_service_read = project_service_read

    async def _check_project_access(self, user: User, project_id: str) -> None:
        project = await self.project_service_read.get_project(
            data=ProjectRead(owner_id=str(user.id), project_id=project_id)
        )
        print({"PROJECT": project})
        if project is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Project not found"
            )

    async def get_due_date_of_project(self, project_id: str) -> datetime | None:
        project = await self.project_service_read.get_project(
            data=ProjectRead(project_id=project_id)
        )
        if not project:
            return None

        return project.due_date

    async def get_start_date_of_project(self, project_id: str) -> datetime | None:
        project = await self.project_service_read.get_project(
            data=ProjectRead(project_id=project_id)
        )
        if not project:
            return None

        return project.start_date

    async def _check_owner_project(self, project_id: str) -> None:
        """
        Validates parent project ownership bounds before routing core execution pipelines.
        Enforces atomic isolation gates and blocks transactions if the cluster has no assigned owner.
        """
        # Query the isolated project reading infrastructure layer
        project = await self.project_service_read.get_project(
            data=ProjectRead(project_id=project_id)
        )

        # 🛡️ Secure Validation Gate: Prevent unassigned global pipelines from executing sub-task nodes
        if project is not None and (
            project.owner_id is None or project.owner_role is None
        ):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Operational Block: This target project container does not possess an assigned owner resource node.",
            )
