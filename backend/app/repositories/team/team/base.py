# app/repositories/team/team/base.py

from abc import ABC, abstractmethod

from app.models.team.team import TeamModel
from app.schemas.team.team.response import TeamList, TeamResponse
from app.schemas.team.team.update import TeamUpdate
from app.schemas.team.team.read import TeamRead, TeamsRead


class TeamRepositoriesBase(ABC):

    # CREATE

    @abstractmethod
    async def create(self, data: TeamModel) -> TeamResponse: ...

    # READ / QUERY

    @abstractmethod
    async def get_teams(self, data: TeamsRead | None = None) -> TeamList: ...

    @abstractmethod
    async def get_team(self, data: TeamRead) -> TeamResponse | None: ...

    # UPDATE

    @abstractmethod
    async def update(self, team_id: str, data: TeamUpdate) -> TeamResponse | None: ...

    # DELETE

    @abstractmethod
    async def delete(self, team_id: str) -> bool: ...
