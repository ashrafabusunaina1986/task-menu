
# app/routes/team/team/delete.py

from fastapi import APIRouter, Depends

from app.core.container.team.team import get_team_service
from app.services.team.team.service import TeamService


class TeamRouteDelete:

    def __init__(self):

        # Initialize the API router.
        self.router = APIRouter()

        # Register the team deletion endpoint.
        self.router.add_api_route(
            "/delete",
            endpoint=self.delete,
            response_model=bool,
            methods=["DELETE"],
        )

    async def delete(
        self,
        team_id: str,
        service: TeamService = Depends(get_team_service),
    ) -> bool:

        # Delegate the team deletion operation to the service layer.
        return await service.delete(team_id=team_id)


# Create the router instance for team deletion operations.
delete = TeamRouteDelete().router
