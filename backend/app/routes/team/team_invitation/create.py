# app/routes/team/team_invitation/create.py

from fastapi import APIRouter, Depends, status

from app.services.team.team_invitation.service import TeamInvitationService
from app.core.container.team.team_invitation import get_invitation_service

from app.schemas.team.team_invitation.create import TeamInvitationCreate
from app.schemas.team.team_invitation.response import TeamInvitationResponse


class TeamInvitationRouteCreate:

    def __init__(self):
        self.router = APIRouter()

        self.router.add_api_route(
            "/create",
            endpoint=self.create,
            methods=["POST"],
            response_model=TeamInvitationResponse,
            status_code=status.HTTP_201_CREATED,
            summary="Create a team invitation",
        )

    async def create(
        self,
        data: TeamInvitationCreate,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Create a new team invitation.
        return await service.create(data=data)


create = TeamInvitationRouteCreate().router
