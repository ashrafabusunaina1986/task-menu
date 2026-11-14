# app/routes/team/team_invitation/create.py

from fastapi import APIRouter, Depends

from app.services.team.team_invitation.service import TeamInvitationService
from app.core.container.team.team_invitation import get_invitation_service

from app.schemas.team.team_invitation.read import (
    TeamInvitationRead,
    TeamInvitationsRead,
)

from app.schemas.team.team_invitation.response import (
    TeamInvitationResponse,
    TeamInvitationsResponse,
)


class TeamInvitationRouteRead:

    def __init__(self):

        self.router = APIRouter()

        # Register the invitation read routes.
        self.router.add_api_route(
            "/get_invitations",
            endpoint=self.get_invitations,
            methods=["GET"],
            response_model=TeamInvitationsResponse,
            summary="Get team invitations",
        )

        self.router.add_api_route(
            "/get_invitation",
            endpoint=self.get_invitation,
            methods=["GET"],
            response_model=TeamInvitationResponse,
            summary="Get a team invitation",
        )

        self.router.add_api_route(
            "/get_invitation_by_id/{invitation_id}",
            endpoint=self.get_invitation_by_id,
            methods=["GET"],
            response_model=TeamInvitationResponse,
            summary="Get an invitation by ID",
        )

        self.router.add_api_route(
            "/get_pending_invitation",
            endpoint=self.get_pending_invitation,
            methods=["GET"],
            response_model=TeamInvitationResponse,
            summary="Get a pending invitation",
        )

        self.router.add_api_route(
            "/get_invitations_by_team/{team_id}",
            endpoint=self.get_invitations_by_team,
            methods=["GET"],
            response_model=TeamInvitationsResponse,
            summary="Get invitations by team",
        )

        self.router.add_api_route(
            "/get_invitations_by_email",
            endpoint=self.get_invitations_by_email,
            methods=["GET"],
            response_model=TeamInvitationsResponse,
            summary="Get invitations by email",
        )

        self.router.add_api_route(
            "/get_invitation_by_team_and_email",
            endpoint=self.get_invitation_by_team_and_email,
            methods=["GET"],
            response_model=TeamInvitationResponse,
            summary="Get an invitation by team and email",
        )

    async def get_invitations(
        self,
        data: TeamInvitationsRead = Depends(),
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationsResponse:

        # Retrieve invitations using the provided filters.
        return await service.get_invitations(data=data)

    async def get_invitation(
        self,
        data: TeamInvitationRead = Depends(),
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Retrieve a single invitation using the provided filters.
        return await service.get_invitation(data=data)

    async def get_invitation_by_id(
        self,
        invitation_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Retrieve an invitation by its ID.
        return await service.get_invitation_by_id(invitation_id=invitation_id)

    async def get_pending_invitation(
        self,
        team_id: str,
        invitee_email: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Retrieve a pending invitation by team and recipient email.
        return await service.get_pending_invitation(
            team_id=team_id,
            invitee_email=invitee_email,
        )

    async def get_invitations_by_team(
        self,
        team_id: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationsResponse:

        # Retrieve all invitations belonging to a team.
        return await service.get_invitations_by_team(team_id=team_id)

    async def get_invitations_by_email(
        self,
        invitee_email: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationsResponse:

        # Retrieve invitations addressed to an email.
        return await service.get_invitations_by_email(invitee_email=invitee_email)

    async def get_invitation_by_team_and_email(
        self,
        team_id: str,
        invitee_email: str,
        service: TeamInvitationService = Depends(get_invitation_service),
    ) -> TeamInvitationResponse:

        # Retrieve an invitation by team and recipient email.
        return await service.get_invitation_by_team_and_email(
            team_id=team_id,
            invitee_email=invitee_email,
        )


read = TeamInvitationRouteRead().router
