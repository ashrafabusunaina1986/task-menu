# app/routes/team/team_invitation/status.py
from fastapi import APIRouter, Depends, status

from app.services.team.team_invitation.service import TeamInvitationService
from app.core.container.team.team_invitation import get_invitation_service

from app.schemas.team.team_invitation.response import TeamInvitationResponse


class TeamInvitationRouteStatus:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/accept/{invitation_id}",
            endpoint=self.accept,
            methods=["PATCH"],
            response_model=TeamInvitationResponse,
            summary="Accept a team invitation",
            status_code=status.HTTP_200_OK,
        )

        self.router.add_api_route(
            "/reject/{invitation_id}",
            endpoint=self.reject,
            methods=["PATCH"],
            response_model=TeamInvitationResponse,
            summary="Reject a team invitation",
            status_code=status.HTTP_200_OK,
        )

        self.router.add_api_route(
            "/cancel/{invitation_id}",
            endpoint=self.cancel,
            methods=["PATCH"],
            response_model=TeamInvitationResponse,
            summary="Cancel a team invitation",
            status_code=status.HTTP_200_OK,
        )

    async def accept(
        self,
        invitation_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Accept a team invitation.
        return await service.accept(invitation_id=invitation_id)

    async def reject(
        self,
        invitation_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Reject a team invitation.
        return await service.reject(invitation_id=invitation_id)

    async def cancel(
        self,
        invitation_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Cancel a team invitation.
        return await service.cancel(invitation_id=invitation_id)


status = TeamInvitationRouteStatus().router
