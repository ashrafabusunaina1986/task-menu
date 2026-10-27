# app/services/project/service.py

from app.services.project.base import ProjectServiceBase
from app.services.project.update import ProjectServiceUpdate
from app.services.project.create import ProjectServiceCreate
from app.services.project.read import ProjectServiceRead
from app.services.project.delete import ProjectServiceDelete

from app.schemas.project.create import ProjectCreate
from app.schemas.project.read import ProjectRead
from app.schemas.project.update import ProjectUpdate

from app.models.project.project import ProjectModel


class ProjectService(ProjectServiceBase):

    def __init__(
        self,
        service_create: ProjectServiceCreate,
        service_read: ProjectServiceRead,
        service_update: ProjectServiceUpdate,
        service_delete: ProjectServiceDelete
    ):
        self.service_create = service_create
        self.service_read = service_read
        self.service_update = service_update
        self.service_delete = service_delete

    async def create(
        self,
        data: ProjectCreate
    ) -> ProjectModel:
        return await self.service_create.create(
            data=data
        )

    async def get_projects(self) -> list[ProjectModel]:
        return await self.service_read.get_projects()

    async def get_project(
        self,
        data: ProjectRead
    ) -> ProjectModel | None:
        return await self.service_read.get_project(
            data=data
        )

    async def get_projects_by_user(
        self,
        user_id: str
    ) -> list[ProjectModel]:
        return await self.service_read.get_projects_by_user(
            user_id=user_id
        )

    async def update(
        self,
        project_id: str,
        data: ProjectUpdate
    ) -> bool:
        return await self.service_update.update(
            project_id=project_id,
            data=data
        )

    async def delete(self, project_id: str) -> bool:
        return await self.service_delete.delete(project_id)
