# app/services/team/team/base.py

from abc import ABC, abstractmethod

from app.schemas.team.team.create import TeamCreate
from app.schemas.team.team.read import TeamRead, TeamsRead
from app.schemas.team.team.response import TeamList, TeamResponse
from app.schemas.team.team.update import TeamUpdate


class TeamServiceBase(ABC):

    # CREATE

    @abstractmethod
    async def create(self, data: TeamCreate) -> TeamResponse: ...

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
