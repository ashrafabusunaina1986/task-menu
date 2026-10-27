# app/services/project/update.py

from fastapi import Depends


from app.models.user.user import User

from app.security.permissions.permissions import Permission

from app.security.dependencies.service import DependencyService
from app.core.container.security import get_security_service, get_current_user_dependency

from app.repositories.project.update import ProjectRepositoryUpdate
from app.schemas.project.update import ProjectUpdate


class ProjectServiceUpdate:

    def __init__(
        self,
        repository_update: ProjectRepositoryUpdate,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(
            get_security_service
        )
    ):
        self.repository_update = repository_update
        self.user = user
        self.security = security

    async def update(
        self,
        project_id: str,
        data: ProjectUpdate
    ) -> bool:

        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_UPDATE
        )

        return await self.repository_update.update(
            project_id=project_id,
            data=data
        )
