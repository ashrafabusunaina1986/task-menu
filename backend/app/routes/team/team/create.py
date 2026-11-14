# app/routes/team/team/create.py

from fastapi import APIRouter, Depends

from app.schemas.team.team.create import TeamCreate
from app.schemas.team.team.response import TeamResponse

from app.core.container.team.team import get_team_service
from app.services.team.team.service import TeamService


class TeamRouteCreate:

    def __init__(self):

        # Initialize the API router.
        self.router = APIRouter()

        # Register the team creation endpoint.
        self.router.add_api_route(
            "/create",
            endpoint=self.create,
            response_model=TeamResponse,
            methods=["POST"],
        )

    async def create(
        self,
        data: TeamCreate,
        service: TeamService = Depends(get_team_service),
    ) -> TeamResponse:

        # Delegate the team creation operation to the service layer.
        return await service.create(data=data)

# Create the router instance for team creation operations.
create = TeamRouteCreate().router
