# app/routes/project/read.py

from fastapi import Depends, APIRouter, Query

from app.core.container.project.project import get_project_service
from app.services.project.service import ProjectService

from app.schemas.project.read import ProjectRead

from app.schemas.project.response import ProjectResponse


class ProjectRouteRead:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/get-projects",
            self.get_projects,
            methods=["GET"],
            response_model=list[ProjectResponse],
        )

        self.router.add_api_route(
            "/get-project",
            self.get_project,
            response_model=ProjectResponse | None,
            methods=["POST"],
        )

        self.router.add_api_route(
            "/get-project-by-user",
            self.get_projects_by_user,
            response_model=list[ProjectResponse],
            methods=["GET"],
        )

        self.router.add_api_route(
            "/check-name",
            self.check_project_name,
            response_model=bool,
            methods=["GET"],
        )

    async def get_projects(
        self, service: ProjectService = Depends(get_project_service)
    ) -> list[ProjectResponse]:
        return await service.get_projects()

    async def get_project(
        self, data: ProjectRead, service: ProjectService = Depends(get_project_service)
    ) -> ProjectResponse | None:
        return await service.get_project(data=data)

    # ✅ FIXED: Re-engineered endpoint signature to accept explicit project_name query parameters
    # This matches the incoming Next.js Proxy request packet format perfectly and drops the 404 error
    async def check_project_name(
        self,
        project_name: str = Query(
            ..., description="The unique project identifier name to inspect"
        ),
        service: ProjectService = Depends(get_project_service),
    ) -> bool:
        """
        Investigates the database registries via the underlying core service pipeline
        to confirm whether a specific project name identity is already operational.
        """

        return await service.check_project_name(project_name=project_name.strip())

    async def get_projects_by_user(
        self, user_id: str, service: ProjectService = Depends(get_project_service)
    ) -> list[ProjectResponse]:
        return await service.get_projects_by_user(user_id=user_id)


read = ProjectRouteRead()
