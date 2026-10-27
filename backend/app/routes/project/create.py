# app/routes/project/create.py

from fastapi import Depends, APIRouter

from app.core.container.project.project import get_project_service
from app.services.project.service import ProjectService

from app.schemas.project.create import ProjectCreate

from app.schemas.project.response import ProjectResponse


class ProjectRouteCreate:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/create",
            self.create,
            response_model=ProjectResponse,
            methods=["POST"]
        )

    async def create(
        self,
        data: ProjectCreate,
        service: ProjectService = Depends(get_project_service)
    ) -> ProjectResponse:
        return await service.create(
            data=data
        )


create = ProjectRouteCreate()
