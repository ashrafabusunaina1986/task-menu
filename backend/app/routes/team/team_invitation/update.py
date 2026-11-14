# app/routes/team/team_invitation/update.py
from fastapi import APIRouter, Depends, status

from app.services.team.team_invitation.service import TeamInvitationService
from app.core.container.team.team_invitation import get_invitation_service

from app.schemas.team.team_invitation.update import TeamInvitationUpdate
from app.schemas.team.team_invitation.response import TeamInvitationResponse


class TeamInvitationRouteUpdate:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/update/{invitation_id}",
            endpoint=self.update,
            methods=["PUT"],
            response_model=TeamInvitationResponse,
            summary="Update a team invitation",
            status_code=status.HTTP_200_OK,
        )

    async def update(
        self,
        invitation_id: str,
        data: TeamInvitationUpdate,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Update an existing team invitation.
        return await service.update(
            invitation_id=invitation_id,
            data=data,
        )


update = TeamInvitationRouteUpdate().router
