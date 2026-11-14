# app/services/team/team/service.py

from app.models.team.team import TeamStatus

from app.schemas.team.team.create import TeamCreate
from app.schemas.team.team.read import TeamRead, TeamsRead
from app.schemas.team.team.update import TeamUpdate
from app.schemas.team.team.response import TeamResponse, TeamList

from app.services.team.team.create import TeamServiceCreate
from app.services.team.team.read import TeamServiceRead
from app.services.team.team.update import TeamServiceUpdate
from app.services.team.team.delete import TeamServiceDelete


class TeamService:
    def __init__(
        self,
        create: TeamServiceCreate,
        read: TeamServiceRead,
        update: TeamServiceUpdate,
        delete: TeamServiceDelete,
    ):
        self.service_create = create
        self.service_read = read
        self.service_update = update
        self.service_delete = delete

    # Create a new team
    async def create(self, data: TeamCreate) -> TeamResponse:
        return await self.service_create.create(data=data)

    # Get teams with optional filters
    async def get_teams(
        self,
        data: TeamsRead | None = None,
    ) -> TeamList:
        return await self.service_read.get_teams(data=data)

    # Get a specific team
    async def get_team(self, data: TeamRead) -> TeamResponse | None:
        return await self.service_read.get_team(data=data)

    # Update an existing team
    async def update(
        self,
        team_id: str,
        data: TeamUpdate,
    ) -> TeamResponse | None:
        return await self.service_update.update(
            team_id=team_id,
            data=data,
        )

    # Delete a team
    async def delete(self, team_id: str) -> bool:
        return await self.service_delete.delete(team_id=team_id)

    # ============================= ==========================

    # GET TEAM BY ID
    async def get_team_by_id(self, team_id: str) -> TeamResponse | None:
        return await self.service_read.get_team(data=TeamRead(team_id=team_id))

    # GET TEAM BY PROJECT
    async def get_team_by_project(self, project_id: str) -> TeamResponse | None:
        return await self.service_read.get_team(data=TeamRead(project_id=project_id))

    # GET TEAM BY NAME
    async def get_team_by_name(self, name: str) -> TeamResponse | None:
        return await self.service_read.get_team(data=TeamRead(name=name))

    # GET TEAMS BY OWNER
    async def get_teams_by_owner(self, owner_id: str) -> TeamList:
        return await self.service_read.get_teams(data=TeamsRead(owner_id=owner_id))

    # GET TEAMS BY STATUS
    async def get_teams_by_status(self, status: TeamStatus) -> TeamList:
        return await self.service_read.get_teams(data=TeamsRead(status=status))
