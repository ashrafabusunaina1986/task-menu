# app/services/team/team/create.py


from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status

from app.models.user.user import User
from app.models.team.team import TeamModel

from app.schemas.team.team.create import TeamCreate
from app.schemas.team.team.read import TeamRead
from app.schemas.team.team.response import TeamResponse

from app.repositories.team.team.repository import TeamRepository

from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)


class TeamServiceCreate:

    def __init__(
        self,
        repository: TeamRepository,
        user: User = Depends(get_current_user_dependency),
        security: DependencyService = Depends(get_security_service),
    ):
        self.repository = repository
        self.user = user
        self.security = security

    async def create(
        self,
        data: TeamCreate
    ) -> TeamResponse:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user,
            permission=Permission.TEAMS_CREATE
        )

        # 2. Check whether the project already has a team
        existing_team = await self.repository.get_team(
            data=TeamRead(project_id=data.project_id)
        )

        if existing_team is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This project already has a team."
            )

        # 3. Prepare model
        now = datetime.now(timezone.utc)

        data_model = data.model_dump()

        data_model["owner_id"] = str(self.user.id)
        data_model["created_at"] = now
        data_model["updated_at"] = now

        team = TeamModel.model_validate(data_model)

        # 4. Save team
        return await self.repository.create(data=team)
