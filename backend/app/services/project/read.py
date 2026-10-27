# app/services/project/read.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.security.permissions.permissions import Permission
from app.security.permissions.roles import Role

from app.security.dependencies.service import DependencyService
from app.core.container.security import get_security_service, get_current_user_dependency

from app.models.project.project import ProjectModel
from app.schemas.project.read import ProjectRead

from app.repositories.project.read import ProjectRepositoryRead


class ProjectServiceRead:

    def __init__(
        self,
        repository_read: ProjectRepositoryRead,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(
            get_security_service
        )
    ):
        self.repository_read = repository_read
        self.user = user
        self.security = security

    def _can_read_other_projects(self) -> bool:
        return self.user.role in {
            Role.ADMIN,
            Role.MANAGER
        }

    async def get_projects(self) -> list[ProjectModel]:
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_READ
        )
        if self.user.role != Role.ADMIN:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Only admins can read all projects"
            )

        return await self.repository_read.get_projects()

    async def get_project(
        self,
        data: ProjectRead
    ) -> ProjectModel | None:

        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_READ
        )

        project = await self.repository_read.get_project(
            data=data
        )

        if project is None:
            return None

        if (
            not self._can_read_other_projects()
            and project.owner_id != str(self.user.id)
        ):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to read this project"
            )

        return project

    async def get_projects_by_user(
        self,
        user_id: str
    ) -> list[ProjectModel]:
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_READ
        )

        if not self._can_read_other_projects():
            if user_id != str(self.user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only read your own projects"
                )

        return await self.repository_read.get_projects_by_user(
            user_id=user_id
        )
