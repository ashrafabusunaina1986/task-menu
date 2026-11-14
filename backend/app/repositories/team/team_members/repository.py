# app/repositories/team/team_members/repository.py

from app.repositories.team.team_members.base import TeamMemberRepositoryBase

from app.repositories.team.team_members.create import TeamMemberRepositoryCreate
from app.repositories.team.team_members.read import TeamMemberRepositoryRead
from app.repositories.team.team_members.update import TeamMemberRepositoryUpdate
from app.repositories.team.team_members.delete import TeamMemberRepositoryDelete
from app.repositories.team.team_members.reactivate import TeamMemberRepositoryReactivate

from app.models.team.team_member import TeamMemberModel

from app.schemas.team.team_members.response import (
    TeamMemberResponse,
    TeamMembersResponse,
)
from app.schemas.team.team_members.read import (
    TeamMemberRead,
    TeamMembersRead,
)
from app.schemas.team.team_members.update import TeamMemberUpdate


class TeamMemberRepository(TeamMemberRepositoryBase):

    def __init__(self):
        self.create_repository = TeamMemberRepositoryCreate()
        self.read_repository = TeamMemberRepositoryRead()
        self.update_repository = TeamMemberRepositoryUpdate()
        self.delete_repository = TeamMemberRepositoryDelete()
        self.reactivate_repository = TeamMemberRepositoryReactivate()

    async def create(
        self,
        data: TeamMemberModel,
    ) -> TeamMemberResponse:
        return await self.create_repository.create(data=data)

    async def get_members(
        self,
        data: TeamMembersRead | None = None,
    ) -> TeamMembersResponse:
        return await self.read_repository.get_members(data=data)

    async def get_member(
        self,
        data: TeamMemberRead,
    ) -> TeamMemberResponse | None:
        return await self.read_repository.get_member(data=data)

    async def update(
        self,
        member_id: str,
        data: TeamMemberUpdate,
    ) -> TeamMemberResponse | None:
        return await self.update_repository.update(
            member_id=member_id,
            data=data,
        )

    async def reactivate(
        self,
        team_id: str,
        user_id: str,
    ) -> TeamMemberResponse | None:
        return await self.reactivate_repository.reactivate(
            team_id=team_id,
            user_id=user_id,
        )

    async def delete(self, member_id: str) -> bool:
        return await self.delete_repository.delete(member_id=member_id)

    async def delete_members(self, team_id: str) -> int:
        return await self.delete_repository.delete_members(team_id=team_id)
