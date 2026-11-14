# app/services/team/team_members/service.py


from app.services.team.team_members.base import TeamMemberServiceBase

from app.services.team.team_members.create import TeamMemberServiceCreate
from app.services.team.team_members.read import TeamMemberServiceRead
from app.services.team.team_members.update import TeamMemberServiceUpdate
from app.services.team.team_members.delete import TeamMemberServiceDelete
from app.services.team.team_members.reactivate import TeamMemberServiceReactivate

from app.schemas.team.team_members.create import TeamMemberCreate
from app.schemas.team.team_members.read import TeamMemberRead, TeamMembersRead
from app.schemas.team.team_members.update import TeamMemberUpdate

from app.schemas.team.team_members.response import (
    TeamMemberResponse,
    TeamMembersResponse,
)


class TeamMemberService(TeamMemberServiceBase):

    def __init__(
        self,
        create: TeamMemberServiceCreate,
        read: TeamMemberServiceRead,
        update: TeamMemberServiceUpdate,
        delete: TeamMemberServiceDelete,
        reactivate: TeamMemberServiceReactivate,
    ):
        self.create_service = create
        self.read_service = read
        self.update_service = update
        self.delete_service = delete
        self.reactivate_service = reactivate

    # CREATE

    async def create(self, data: TeamMemberCreate) -> TeamMemberResponse:
        return await self.create_service.create(data=data)

    # READ

    async def get_members(
        self,
        data: TeamMembersRead | None = None,
    ) -> TeamMembersResponse:
        return await self.read_service.get_members(data=data)

    async def get_member(
        self,
        data: TeamMemberRead,
    ) -> TeamMemberResponse | None:
        return await self.read_service.get_member(data=data)

    async def get_member_by_user(
        self,
        user_id: str,
    ) -> TeamMemberResponse | None:
        return await self.get_member(data=TeamMemberRead(user_id=user_id))

    async def get_member_by_team(
        self,
        team_id: str,
    ) -> TeamMemberResponse | None:
        return await self.get_member(data=TeamMemberRead(team_id=team_id))

    async def get_member_by_team_and_user(
        self,
        team_id: str,
        user_id: str,
    ) -> TeamMemberResponse | None:
        return await self.get_member(
            data=TeamMemberRead(
                team_id=team_id,
                user_id=user_id,
            )
        )

    async def get_team_members(
        self,
        team_id: str,
    ) -> TeamMembersResponse:
        return await self.get_members(data=TeamMembersRead(team_id=team_id))

    async def get_members_by_user_and_team(
        self, user_id: str, team_id: str
    ) -> TeamMembersResponse:
        return await self.get_members(
            data=TeamMembersRead(team_id=team_id, user_id=user_id)
        )

    # UPDATE

    async def update(
        self,
        member_id: str,
        data: TeamMemberUpdate,
    ) -> TeamMemberResponse | None:
        return await self.update_service.update(
            member_id=member_id,
            data=data,
        )

    # DELETE

    async def delete(self, member_id: str) -> bool:
        return await self.delete_service.delete(member_id=member_id)

    async def delete_members(self, team_id: str) -> int:
        return await self.delete_service.delete_members(team_id=team_id)

    # REACTIVATE

    async def reactivate(
        self,
        team_id: str,
        user_id: str,
    ) -> TeamMemberResponse:
        return await self.reactivate_service.reactivate(
            team_id=team_id,
            user_id=user_id,
        )
