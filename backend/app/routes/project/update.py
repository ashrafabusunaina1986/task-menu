# app/routes/project/update.py

from fastapi import Depends, APIRouter

from app.core.container.project.project import get_project_service
from app.services.project.service import ProjectService

from app.schemas.project.update import ProjectUpdate


class ProjectRouteUpdate:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/update",
            self.update,
            response_model=bool,
            methods=["PUT"]
        )

    async def update(
        self,
        project_id: str,
        data: ProjectUpdate,
        service: ProjectService = Depends(get_project_service)
    ) -> bool:
        return await service.update(
            project_id=project_id,
            data=data
        )


update = ProjectRouteUpdate()
