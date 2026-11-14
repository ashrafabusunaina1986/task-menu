# app/services/team/team_members/reactivate.py


from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team.read import TeamRead
from app.schemas.team.team_members.read import TeamMemberRead
from app.schemas.team.team_members.response import TeamMemberResponse

from app.repositories.team.team_members.repository import TeamMemberRepository
from app.repositories.team.team.repository import TeamRepository

from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)
from app.core.container.team.team import get_repository


class TeamMemberServiceReactivate:

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

    async def reactivate(
        self,
        team_id: str,
        user_id: str,
    ) -> TeamMemberResponse:

        # Check permission to manage team members.
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAM_MEMBERS_CREATE,
        )

        # Verify that the team exists.
        team = await self.team_repository.get_team(
            data=TeamRead(team_id=team_id)
        )

        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Team not found.",
            )

        # Check whether the user already has an active membership.
        active_member = await self.repository.get_member(
            data=TeamMemberRead(
                user_id=user_id,
                status="active",
            )
        )

        if active_member is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="User already has an active team membership.",
            )

        # Reactivate the existing removed membership.
        member = await self.repository.reactivate(
            team_id=team_id,
            user_id=user_id,
        )

        if member is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Removed team membership not found.",
            )

        return member
