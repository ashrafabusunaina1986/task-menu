# app/routes/project/delete.py

from fastapi import Depends, APIRouter

from app.core.container.project.project import get_project_service
from app.services.project.service import ProjectService


class ProjectRouteDelete:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/delete",
            self.delete,
            response_model=bool,
            methods=["DELETE"]
        )

    async def delete(
        self,
        project_id: str,
        service: ProjectService = Depends(get_project_service)
    ) -> bool:
        return await service.delete(project_id=project_id)


delete = ProjectRouteDelete()
