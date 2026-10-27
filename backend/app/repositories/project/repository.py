# app/repositories/project/repository.py

from motor.motor_asyncio import AsyncIOMotorClientSession

from app.models.project.project import ProjectModel
from app.repositories.project.base import ProjectRepositoryBase

from app.repositories.project.read import ProjectRepositoryRead
from app.repositories.project.update import ProjectRepositoryUpdate
from app.repositories.project.create import ProjectRepositoryCreate
from app.repositories.project.delete import ProjectRepositoryDelete

from app.schemas.project.update import ProjectUpdate
from app.schemas.project.read import ProjectRead


class ProjectRepository(ProjectRepositoryBase):

    def __init__(
        self,
        repository_create: ProjectRepositoryCreate,
        repository_read: ProjectRepositoryRead,
        repository_update: ProjectRepositoryUpdate,
        repository_delete: ProjectRepositoryDelete
    ):
        self.repository_create = repository_create
        self.repository_read = repository_read
        self.repository_update = repository_update
        self.repository_delete = repository_delete

    async def create(
        self,
        data: ProjectModel
    ) -> ProjectModel:
        return await self.repository_create.create(
            data=data
        )
        
    async def get_projects(self)->list[ProjectModel]:
        return await self.repository_read.get_projects()

    async def get_project(
        self,
        data: ProjectRead
    ) -> ProjectModel | None:
        return await self.repository_read.get_project(
            data=data
        )

    async def get_projects_by_user(
        self,
        user_id: str
    ) -> list[ProjectModel]:
        return await self.repository_read.get_projects_by_user(
            user_id=user_id
        )

    async def update(
        self,
        project_id: str,
        data: ProjectUpdate
    ) -> bool:
        return await self.repository_update.update(
            project_id=project_id,
            data=data
        )

    async def delete(
        self,
        project_id: str,
        session: AsyncIOMotorClientSession | None = None
    ) -> bool:
        return await self.repository_delete.delete(
            project_id=project_id,
            session=session
        )
