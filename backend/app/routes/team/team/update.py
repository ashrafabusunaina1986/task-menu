
# app/routes/team/team/update.py

from fastapi import APIRouter, Depends

from app.schemas.team.team.update import TeamUpdate
from app.schemas.team.team.response import TeamResponse

from app.core.container.team.team import get_team_service
from app.services.team.team.service import TeamService


class TeamRouteUpdate:

    def __init__(self):

        # Initialize the API router.
        self.router = APIRouter()

        # Register the team update endpoint.
        self.router.add_api_route(
            "/update",
            endpoint=self.update,
            response_model=TeamResponse | None,
            methods=["PUT"],
        )

    async def update(
        self,
        team_id: str,
        data: TeamUpdate,
        service: TeamService = Depends(get_team_service),
    ) -> TeamResponse | None:

        # Delegate the team update operation to the service layer.
        return await service.update(team_id=team_id, data=data)


# Create the router instance for team update operations.
update = TeamRouteUpdate().router
