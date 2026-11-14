# app/services/team/team_members/read.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team.read import TeamRead

from app.schemas.team.team_members.read import (
    TeamMemberRead,
    TeamMembersRead,
)

from app.schemas.team.team_members.response import (
    TeamMemberResponse,
    TeamMembersResponse,
)

from app.repositories.team.team.repository import TeamRepository
from app.repositories.team.team_members.repository import TeamMemberRepository

from app.security.permissions.permissions import Permission
from app.security.permissions.roles import Role
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)
from app.core.container.team.team import get_repository


class TeamMemberServiceRead:

    def __init__(
        self,
        repository: TeamMemberRepository,
        team_repository: TeamRepository = Depends(get_repository),
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.team_repository = team_repository
        self.user = user
        self.security = security

    async def get_members(
        self,
        data: TeamMembersRead | None = None,
    ) -> TeamMembersResponse:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_MEMBERS_READ,
        )

        # 2. ADMIN and MANAGER can view all team members
        if self.user.role in {Role.ADMIN, Role.MANAGER}:
            return await self.repository.get_members(data=data)

        # 3. USER must specify a team
        if data is None or data.team_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must specify a team to view its members.",
            )

        # 4. Check whether the team exists
        team = await self.team_repository.get_team(data=TeamRead(team_id=data.team_id))

        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found.",
            )

        # 5. USER can only view members of their own teams
        if team.owner_id != str(self.user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to view this team's members.",
            )

        # 6. Retrieve team members
        result = await self.repository.get_members(data=data)

        if result.total == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No team members found.",
            )

        return result

    async def get_member(
        self,
        data: TeamMemberRead,
    ) -> TeamMemberResponse | None:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_MEMBERS_READ,
        )

        # 2. Ensure at least one search filter is provided
        if not any(
            value is not None
            for value in (
                data.member_id,
                data.team_id,
                data.user_id,
                data.role,
                data.status,
            )
        ):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one search filter is required.",
            )

        # 3. ADMIN and MANAGER can access any team member
        if self.user.role in {Role.ADMIN, Role.MANAGER}:
            return await self.repository.get_member(data=data)

        # 4. USER must specify a team
        if data.team_id is None:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You must specify a team to access its members.",
            )

        # 5. Check whether the team exists
        team = await self.team_repository.get_team(data=TeamRead(team_id=data.team_id))

        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found.",
            )

        # 6. USER can only access members of their own teams
        if team.owner_id != str(self.user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this team member.",
            )

        # 7. Retrieve the team member
        member = await self.repository.get_member(data=data)

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team member not found.",
            )

        return member
