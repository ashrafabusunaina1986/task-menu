# app/routes/team/team/read.py

from fastapi import APIRouter, Depends

from app.models.team.team import TeamStatus

from app.schemas.team.team.read import TeamRead, TeamsRead
from app.schemas.team.team.response import TeamResponse, TeamList

from app.core.container.team.team import get_team_service
from app.services.team.team.service import TeamService


class TeamRouteRead:

    def __init__(self):

        # Initialize the API router.
        self.router = APIRouter()

        # Register the endpoint for retrieving teams.
        self.router.add_api_route(
            "/get-teams",
            endpoint=self.get_teams,
            response_model=TeamList,
            methods=["GET"],
        )

        # Register the endpoint for retrieving teams by owner.
        self.router.add_api_route(
            "/get-teams-by-owner",
            endpoint=self.get_teams_by_owner,
            response_model=TeamList,
            methods=["GET"],
        )

        # Register the endpoint for retrieving teams by status.
        self.router.add_api_route(
            "/get-teams-by-status",
            endpoint=self.get_teams_by_status,
            response_model=TeamList,
            methods=["GET"],
        )

        # Register the endpoint for retrieving a team using search criteria.
        self.router.add_api_route(
            "/get-team",
            endpoint=self.get_team,
            response_model=TeamResponse | None,
            methods=["GET"],
        )

        # Register the endpoint for retrieving a team by its ID.
        self.router.add_api_route(
            "/get-team-by-id",
            endpoint=self.get_team_by_id,
            response_model=TeamResponse | None,
            methods=["GET"],
        )

        # Register the endpoint for retrieving a team by its name.
        self.router.add_api_route(
            "/get-team-by-name",
            endpoint=self.get_team_by_name,
            response_model=TeamResponse | None,
            methods=["GET"],
        )

        # Register the endpoint for retrieving a team by its project ID.
        self.router.add_api_route(
            "/get-team-by-project",
            endpoint=self.get_team_by_project,
            response_model=TeamResponse | None,
            methods=["GET"],
        )

    async def get_teams(
        self,
        data: TeamsRead = Depends(),
        service: TeamService = Depends(get_team_service),
    ) -> TeamList:

        # Retrieve teams according to the provided filters.
        return await service.get_teams(data=data)

    async def get_teams_by_owner(
        self,
        owner_id: str,
        service: TeamService = Depends(get_team_service),
    ) -> TeamList:

        # Retrieve all teams belonging to a specific owner.
        return await service.get_teams_by_owner(owner_id=owner_id)

    async def get_teams_by_status(
        self,
        status: TeamStatus,
        service: TeamService = Depends(get_team_service),
    ) -> TeamList:

        # Retrieve teams filtered by their status.
        return await service.get_teams_by_status(status=status)

    async def get_team(
        self,
        data: TeamRead = Depends(),
        service: TeamService = Depends(get_team_service),
    ) -> TeamResponse | None:

        # Retrieve a team using the provided search criteria.
        return await service.get_team(data=data)

    async def get_team_by_project(
        self,
        project_id: str,
        service: TeamService = Depends(get_team_service),
    ) -> TeamResponse | None:

        # Retrieve the team associated with a specific project.
        return await service.get_team_by_project(project_id=project_id)

    async def get_team_by_name(
        self,
        name: str,
        service: TeamService = Depends(get_team_service),
    ) -> TeamResponse | None:

        # Retrieve a team using its name.
        return await service.get_team_by_name(name=name)

    async def get_team_by_id(
        self,
        team_id: str,
        service: TeamService = Depends(get_team_service),
    ) -> TeamResponse | None:

        # Retrieve a team using its unique identifier.
        return await service.get_team_by_id(team_id=team_id)


# Create the router instance for team read operations.
read = TeamRouteRead().router
