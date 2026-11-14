# app/services/team/team/read.py

from fastapi import Depends, HTTPException, status

from app.models.user.user import User

from app.schemas.team.team.read import TeamRead, TeamsRead
from app.schemas.team.team.response import TeamResponse, TeamList

from app.repositories.team.team.repository import TeamRepository

from app.security.permissions.permissions import Permission
from app.security.permissions.roles import Role
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamServiceRead:
    def __init__(
        self,
        repository: TeamRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def get_teams(
        self,
        data: TeamsRead | None = None,
    ) -> TeamList:
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAMS_READ,
        )

        # Only ADMIN and MANAGER can view all teams
        if self.user.role not in {Role.ADMIN, Role.MANAGER}:

            if data is None:
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You do not have permission to view all teams.",
                )

            # Users can only view their own teams
            if data.owner_id is not None and data.owner_id != str(self.user.id):
                raise HTTPException(
                    status_code=status.HTTP_403_FORBIDDEN,
                    detail="You can only view your own teams.",
                )

            # Force filtering by the current user's ID
            data = data.model_copy(update={"owner_id": str(self.user.id)})

        return await self.repository.get_teams(data=data)

    async def get_team(
        self,
        data: TeamRead,
    ) -> TeamResponse | None:
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAMS_READ,
        )

        team = await self.repository.get_team(data=data)

        # ADMIN and MANAGER can access any team
        if self.user.role in {Role.ADMIN, Role.MANAGER}:
            return team

        # USER can only access their own teams
        if team is not None and team.owner_id != str(self.user.id):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="You do not have permission to access this team.",
            )

        return team
