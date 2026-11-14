# app/services/team/team_members/base.py

from abc import ABC, abstractmethod

from app.schemas.team.team_members.create import TeamMemberCreate

from app.schemas.team.team_members.response import (
    TeamMemberResponse,
    TeamMembersResponse,
)

from app.schemas.team.team_members.read import (
    TeamMemberRead,
    TeamMembersRead,
)

from app.schemas.team.team_members.update import TeamMemberUpdate


class TeamMemberServiceBase(ABC):

    @abstractmethod
    async def create(
        self,
        data: TeamMemberCreate,
    ) -> TeamMemberResponse: ...

    @abstractmethod
    async def get_members(
        self,
        data: TeamMembersRead | None = None,
    ) -> TeamMembersResponse: ...

    @abstractmethod
    async def get_member(
        self,
        data: TeamMemberRead,
    ) -> TeamMemberResponse | None: ...

    @abstractmethod
    async def update(
        self,
        member_id: str,
        data: TeamMemberUpdate,
    ) -> TeamMemberResponse | None: ...

    @abstractmethod
    async def reactivate(
        self,
        team_id: str,
        user_id: str,
    ) -> TeamMemberResponse: ...

    @abstractmethod
    async def delete(self, member_id: str) -> bool: ...

    @abstractmethod
    async def delete_members(self, team_id: str) -> int: ...
