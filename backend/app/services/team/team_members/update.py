# app/services/team/team_members/update.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team.read import TeamRead

from app.schemas.team.team_members.read import TeamMemberRead
from app.schemas.team.team_members.update import TeamMemberUpdate
from app.schemas.team.team_members.response import TeamMemberResponse

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


class TeamMemberServiceUpdate:

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

    async def update(
        self,
        member_id: str,
        data: TeamMemberUpdate,
    ) -> TeamMemberResponse | None:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_MEMBERS_UPDATE,
        )

        # 2. Check whether update data is provided
        update_data = data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        if not update_data:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="At least one field must be provided for update.",
            )

        # 3. Prevent direct activation
        if update_data.get("status") == "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Use the reactivate operation to activate a membership.",
            )

        # 4. Check whether the membership exists
        member = await self.repository.get_member(
            data=TeamMemberRead(member_id=member_id)
        )

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team membership not found.",
            )

        # 5. ADMIN and MANAGER can update any membership
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

            # USER can only update memberships in their own teams
            if team.owner_id != str(self.user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to update this team member.",
                )

        # 6. Update membership
        updated_member = await self.repository.update(
            member_id=member_id,
            data=data,
        )

        if updated_member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team membership not found.",
            )

        return updated_member
