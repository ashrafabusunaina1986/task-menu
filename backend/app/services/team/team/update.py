
# app/services/team/team/update.py

from fastapi import Depends

from app.models.user.user import User

from app.schemas.team.team.update import TeamUpdate
from app.schemas.team.team.response import TeamResponse

from app.repositories.team.team.repository import TeamRepository

from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamServiceUpdate:
    def __init__(
        self,
        repository: TeamRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def update(
        self,
        team_id: str,
        data: TeamUpdate,
    ) -> TeamResponse | None:

        # Check permission to update teams
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAMS_UPDATE,
        )

        return await self.repository.update(
            team_id=team_id,
            data=data,
        )
