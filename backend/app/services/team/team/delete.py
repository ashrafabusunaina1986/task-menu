
# app/services/team/team/delete.py

from fastapi import Depends

from app.models.user.user import User

from app.repositories.team.team.repository import TeamRepository

from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamServiceDelete:
    def __init__(
        self,
        repository: TeamRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def delete(self, team_id: str) -> bool:

        # Check permission to delete teams
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAMS_DELETE,
        )

        return await self.repository.delete(
            team_id=team_id,
        )
