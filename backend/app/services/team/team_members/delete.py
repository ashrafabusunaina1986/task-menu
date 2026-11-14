# app/services/team/team_members/delete.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team.read import TeamRead
from app.schemas.team.team_members.read import TeamMemberRead

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


class TeamMemberServiceDelete:

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

    async def delete(self, member_id: str) -> bool:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_MEMBERS_DELETE,
        )

        # 2. Check whether the membership exists
        member = await self.repository.get_member(
            data=TeamMemberRead(member_id=member_id)
        )

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team membership not found.",
            )

        # 3. ADMIN and MANAGER can delete any membership
        if self.user.role not in {Role.ADMIN, Role.MANAGER}:

            # Check whether the team exists
            team = await self.team_repository.get_team(
                data=TeamRead(team_id=member.team_id)
            )

            if team is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Team not found.",
                )

            # USER can only delete memberships in their own teams
            if team.owner_id != str(self.user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to delete this team member.",
                )

        # 4. Delete membership
        deleted = await self.repository.delete(member_id=member_id)

        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team membership not found.",
            )

        return deleted

    async def delete_members(self, team_id: str) -> int:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAMS_DELETE,
        )

        # 2. Check whether the team exists
        team = await self.team_repository.get_team(data=TeamRead(team_id=team_id))

        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found.",
            )

        # 3. ADMIN and MANAGER can delete any team's memberships
        if self.user.role not in {Role.ADMIN, Role.MANAGER}:
            if team.owner_id != str(self.user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to delete this team's members.",
                )

        # 4. Delete all memberships belonging to the team
        return await self.repository.delete_members(team_id=team_id)
