# app/services/project/create

from datetime import datetime, timezone
from fastapi import Depends

from app.models.user.user import User

from app.security.permissions.permissions import Permission

from app.security.dependencies.service import DependencyService
from app.core.container.security import get_security_service, get_current_user_dependency

from app.models.project.project import ProjectModel
from app.repositories.project.create import ProjectRepositoryCreate
from app.schemas.project.create import ProjectCreate


class ProjectServiceCreate:

    def __init__(
        self,
        repository_create: ProjectRepositoryCreate,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(
            get_security_service
        )

    ):
        self.repository_create = repository_create
        self.user = user
        self.security = security

    async def create(
        self,
        data: ProjectCreate
    ) -> ProjectModel:

        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.PROJECTS_CREATE
        )

        if data.owner_id is not None and data.owner_id != str(self.user.id):

            print("Checking PROJECTS_ASSIGN_OWNER")
            self.security.require_permission_dependency.require_permission(
                user=self.user,
                permission=Permission.PROJECTS_ASSIGN_OWNER
            )
            
        now = datetime.now(timezone.utc)

        data_model = data.model_dump()

        data_model["owner_id"] = self.user.id
        data_model["created_at"] = now
        data_model["updated_at"] = now

        project = ProjectModel.model_validate(data_model)

        return await self.repository_create.create(
            data=project
        )
