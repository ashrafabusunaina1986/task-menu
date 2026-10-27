# app/routes/project/read.py

from fastapi import Depends, APIRouter

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
            response_model=list[ProjectResponse]
        )

        self.router.add_api_route(
            "/get-project",
            self.get_project,
            response_model=ProjectResponse | None,
            methods=["POST"]
        )

        self.router.add_api_route(
            "/get-project-by-user",
            self.get_projects_by_user,
            response_model=list[ProjectResponse],
            methods=["GET"]
        )

    async def get_projects(
        self,
        service: ProjectService = Depends(get_project_service)
    ) -> list[ProjectResponse]:
        return await service.get_projects()

    async def get_project(
        self,
        data: ProjectRead,
        service: ProjectService = Depends(get_project_service)
    ) -> ProjectResponse | None:
        return await service.get_project(
            data=data
        )

    async def get_projects_by_user(
        self,
        user_id: str,
        service: ProjectService = Depends(get_project_service)
    ) -> list[ProjectResponse]:
        return await service.get_projects_by_user(
            user_id=user_id
        )


read = ProjectRouteRead()
