# app/repositories/team/team/repository.py


from app.repositories.team.team.base import TeamRepositoriesBase

from app.repositories.team.team.create import TeamRepositoryCreate
from app.repositories.team.team.read import TeamRepositoryRead
from app.repositories.team.team.update import TeamRepositoryUpdate
from app.repositories.team.team.delete import TeamRepositoryDelete

from app.models.team.team import TeamModel
from app.schemas.team.team.read import TeamRead, TeamsRead
from app.schemas.team.team.response import TeamList, TeamResponse
from app.schemas.team.team.update import TeamUpdate


class TeamRepository(TeamRepositoriesBase):

    def __init__(
        self,
        create: TeamRepositoryCreate,
        read: TeamRepositoryRead,
        update: TeamRepositoryUpdate,
        delete: TeamRepositoryDelete,
    ):
        self.repository_create = create
        self.repository_read = read
        self.repository_update = update
        self.repository_delete = delete

    # CREATE

    async def create(self, data: TeamModel) -> TeamResponse:

        return await self.repository_create.create(data=data)

    # READ / QUERY

    async def get_teams(self, data: TeamsRead | None = None) -> TeamList:

        return await self.repository_read.get_teams(data=data)

    async def get_team(self, data: TeamRead) -> TeamResponse | None:

        return await self.repository_read.get_team(data=data)

    # UPDATE

    async def update(self, team_id: str, data: TeamUpdate) -> TeamResponse | None:

        return await self.repository_update.update(team_id=team_id, data=data)

    # DELETE

    async def delete(self, team_id: str) -> bool:

        return await self.repository_delete.delete(team_id=team_id)
