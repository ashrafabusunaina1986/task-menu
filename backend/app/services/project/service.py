# app/services/project/service.py

from fastapi import HTTPException, status

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
        service_delete: ProjectServiceDelete,
    ):
        self.service_create = service_create
        self.service_read = service_read
        self.service_update = service_update
        self.service_delete = service_delete

    async def create(self, data: ProjectCreate) -> ProjectModel:
        """
        Orchestrates the transactional sequence to provision a new project container slot.
        Enforces strict case-insensitive uniqueness checks on the 'project_name' parameter before persistence.
        """
        # 🔒 ANTI-DUPLICATE SECURE GUARD GATE: Verify name existence against MongoDB registries
        # Passing the input name wrapped inside the verified validation schema

        await self.check_project_name(project_name=data.name)

        # Dispatch the validated unique data packet directly down to the pipeline creation layer
        return await self.service_create.create(data=data)

    async def get_projects(self) -> list[ProjectModel]:
        return await self.service_read.get_projects()

    async def get_project(self, data: ProjectRead) -> ProjectModel | None:
        return await self.service_read.get_project(data=data)

    async def get_projects_by_user(self, user_id: str) -> list[ProjectModel]:
        return await self.service_read.get_projects_by_user(user_id=user_id)

    async def update(self, project_id: str, data: ProjectUpdate) -> bool:
        return await self.service_update.update(project_id=project_id, data=data)

    async def delete(self, project_id: str) -> bool:
        return await self.service_delete.delete(project_id)

    async def check_project_name(self, project_name: str) -> bool:
        """
        Performs an isolated verification lookup to check if a project name exists.
        Returns True if a duplicate entry is localized, and False if the name is available.
        """
        # ✅ FIXED: Correctly wrap the incoming string token inside the required ProjectRead schema for the lower reader logic
        project_exists = await self.get_project(data=ProjectRead(name=project_name))

        if project_exists:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Operational Breach: A project infrastructure node identified as '{project_name}' already exists within this cluster registry.",
            )

        return True
