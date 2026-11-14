# app/routes/team/team_members/read.py

from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional

from app.schemas.team.team_members.read import TeamMemberRead, TeamMembersRead
from app.schemas.team.team_members.response import (
    TeamMemberResponse,
    TeamMembersResponse,
)

from app.services.team.team_members.service import TeamMemberService
from app.core.container.team.team_members import get_team_members_service


class TeamMembersRouteRead:
    """
    Read endpoints for team members.
    Provides various ways to retrieve member data and membership information.
    """

    def __init__(self):
        self.router = APIRouter()

        # List all members with optional filters
        self.router.add_api_route(
            "/get-members",
            endpoint=self.get_members,
            response_model=TeamMembersResponse,
            methods=["GET"],
            summary="Get all team members",
        )

        # Get all members belonging to a specific team
        self.router.add_api_route(
            "/get-team-members",
            endpoint=self.get_team_members,
            response_model=TeamMembersResponse,
            methods=["GET"],
            summary="Get members by team ID",
        )

        # Get membership records matching both user and team
        self.router.add_api_route(
            "/get-members-by-user-and-team",
            endpoint=self.get_members_by_user_and_team,
            response_model=TeamMembersResponse,
            methods=["GET"],
            summary="Get memberships by user and team",
        )

        # Get a single member by filter criteria
        self.router.add_api_route(
            "/get-member",
            endpoint=self.get_member,
            methods=["GET"],
            response_model=Optional[TeamMemberResponse],
            summary="Get a single member",
        )

        # Get active membership for a specific user
        self.router.add_api_route(
            "/get-member-by-user",
            endpoint=self.get_member_by_user,
            methods=["GET"],
            response_model=Optional[TeamMemberResponse],
            summary="Get member by user ID",
        )

        # Get member details by team ID
        self.router.add_api_route(
            "/get-member-by-team",
            endpoint=self.get_member_by_team,
            methods=["GET"],
            response_model=Optional[TeamMemberResponse],
            summary="Get member by team ID",
        )

        # Get specific membership record
        self.router.add_api_route(
            "/get-member-by-team-and-user",
            endpoint=self.get_member_by_team_and_user,
            methods=["GET"],
            response_model=Optional[TeamMemberResponse],
            summary="Get member by user and team",
        )

    async def get_members(
        self,
        data: TeamMembersRead,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> TeamMembersResponse:
        """Get a list of team members with optional filters."""
        try:
            return await service.get_members(data=data)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def get_member(
        self,
        data: TeamMemberRead,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> Optional[TeamMemberResponse]:
        """Get a single member using filter criteria."""
        try:
            return await service.get_member(data=data)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def get_member_by_user(
        self,
        user_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> Optional[TeamMemberResponse]:
        """Get the active membership record for a specific user."""
        try:
            return await service.get_member_by_user(user_id=user_id)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def get_member_by_team(
        self,
        team_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> Optional[TeamMemberResponse]:
        """Get membership record(s) by team ID."""
        try:
            return await service.get_member_by_team(team_id=team_id)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def get_member_by_team_and_user(
        self,
        user_id: str,
        team_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> Optional[TeamMemberResponse]:
        """Get a specific membership record by both user and team IDs."""
        try:
            return await service.get_member_by_team_and_user(
                user_id=user_id,
                team_id=team_id
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def get_team_members(
        self,
        team_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> TeamMembersResponse:
        """Get all members belonging to a specific team."""
        try:
            return await service.get_team_members(team_id=team_id)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )

    async def get_members_by_user_and_team(
        self,
        user_id: str,
        team_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> TeamMembersResponse:
        """Get membership records matching both user ID and team ID."""
        try:
            return await service.get_members_by_user_and_team(
                team_id=team_id,
                user_id=user_id
            )
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )


# Create the shared read router instance
read = TeamMembersRouteRead().router
