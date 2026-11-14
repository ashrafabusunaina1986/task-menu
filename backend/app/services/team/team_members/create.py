# app/services/team/team_members/create.py

from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status

from app.models.user.user import User
from app.models.team.team_member import TeamMemberModel

from app.schemas.team.team_members.create import TeamMemberCreate
from app.schemas.team.team_members.read import TeamMemberRead
from app.schemas.team.team_members.response import TeamMemberResponse

from app.repositories.team.team_members.repository import TeamMemberRepository
from app.repositories.team.team.repository import TeamRepository

from app.schemas.team.team.read import TeamRead

from app.security.permissions.permissions import Permission
from app.security.dependencies.service import DependencyService

from app.core.container.security import (
    get_security_service,
    get_current_user_dependency,
)
from app.core.container.team.team import get_repository


class TeamMemberServiceCreate:

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

    async def create(self, data: TeamMemberCreate) -> TeamMemberResponse:

        # 1. Check permission
        self.security.require_permission_dependency.require_permission(
            user=self.user, permission=Permission.TEAM_MEMBERS_CREATE
        )

        # 2. Check whether the team exists
        team = await self.team_repository.get_team(data=TeamRead(team_id=data.team_id))

        if team is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Team not found."
            )

        # 3. Check whether the user already has an active membership
        active_member = await self.repository.get_member(
            data=TeamMemberRead(user_id=data.user_id, status="active")
        )

        if active_member is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This user already belongs to an active team.",
            )

        # 4. Check whether a membership record already exists in this team
        existing_member = await self.repository.get_member(
            data=TeamMemberRead(team_id=data.team_id, user_id=data.user_id)
        )

        if existing_member is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="This user already has a membership record in this team.",
            )

        # 5. Prepare membership model
        now = datetime.now(timezone.utc)

        member_data = data.model_dump(exclude={"status", "joined_at"})

        member_data["status"] = "active"
        member_data["joined_at"] = now
        member_data["created_at"] = now
        member_data["updated_at"] = now

        member = TeamMemberModel.model_validate(member_data)

        # 6. Save membership
        return await self.repository.create(data=member)
