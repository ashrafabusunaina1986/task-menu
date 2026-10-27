# app/services/project/delete.py

from fastapi import Depends
from motor.motor_asyncio import AsyncIOMotorClientSession
from app.core.database import MongoDB

from app.services.project.read import ProjectServiceRead
from app.models.user.user import User
from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService
from app.core.container.security import (
    get_current_user_dependency,
    get_security_service
)
from app.repositories.project.delete import ProjectRepositoryDelete
from app.services.task.delete import TaskDeleteService

from app.schemas.project.read import ProjectRead


class ProjectServiceDelete:

    def __init__(
        self,
        service_project: ProjectServiceRead,
        repository_delete: ProjectRepositoryDelete,
        service_task: TaskDeleteService,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service)
    ):
        self.service_project = service_project
        self.repository_delete = repository_delete
        self.service_task = service_task
        self.user = user
        self.security = security

    async def delete(self, project_id: str) -> bool:
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_DELETE
        )
        project = await self.service_project.get_project(
            data=ProjectRead(project_id=project_id)
        )
        if not project:
            return False

        async with await MongoDB.client.start_session() as session:
            async with session.start_transaction():
                delete_tasks = await self.service_task.delete_tasks(project_id=project_id, session=session)
                if not delete_tasks:
                    raise RuntimeError("Failed to delete project tasks")

                project_deleted = await self.repository_delete.delete(project_id=project_id, session=session)
                if not project_deleted:
                    raise RuntimeError("Failed to delete project")

        return True
