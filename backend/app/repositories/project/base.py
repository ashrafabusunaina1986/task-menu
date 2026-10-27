
# app/repositories/project/base.py

from abc import ABC, abstractmethod

from motor.motor_asyncio import AsyncIOMotorClientSession

from app.models.project.project import ProjectModel
from app.schemas.project.read import ProjectRead
from app.schemas.project.update import ProjectUpdate


class ProjectRepositoryBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: ProjectModel
    ) -> ProjectModel:
        ...

    @abstractmethod
    async def get_projects(
        self,
    ) -> list[ProjectModel]:
        ...

    @abstractmethod
    async def get_project(
        self,
        data: ProjectRead
    ) -> ProjectModel | None:
        ...

    @abstractmethod
    async def get_projects_by_user(
        self,
        user_id: str
    ) -> list[ProjectModel]:
        ...

    @abstractmethod
    async def update(
        self,
        project_id: str,
        data: ProjectUpdate
    ) -> bool:
        ...

    @abstractmethod
    async def delete(
        self,
        project_id: str,
        session: AsyncIOMotorClientSession | None = None
    ) -> bool:
        ...
