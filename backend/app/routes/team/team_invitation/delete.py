# app/routes/team/team_invitation/delete.py

from fastapi import APIRouter, Depends, status

from app.services.team.team_invitation.service import TeamInvitationService
from app.core.container.team.team_invitation import get_invitation_service


class TeamInvitationRouteDelete:

    def __init__(self):

        self.router = APIRouter()

        self.router.add_api_route(
            "/delete/{invitation_id}",
            endpoint=self.delete,
            methods=["DELETE"],
            summary="Delete a team invitation",
            status_code=status.HTTP_204_NO_CONTENT,
        )

        self.router.add_api_route(
            "/delete_invitations/{team_id}",
            endpoint=self.delete_invitation,
            methods=["DELETE"],
            summary="Delete team invitations",
            status_code=status.HTTP_200_OK,
        )

    async def delete(
        self,
        invitation_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ):

        # Delete a specific team invitation.
        await service.delete(invitation_id=invitation_id)

    async def delete_invitation(
        self,
        team_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> int:

        # Delete all invitations belonging to a team.
        return await service.delete_invitation(team_id=team_id)


delete = TeamInvitationRouteDelete().router
