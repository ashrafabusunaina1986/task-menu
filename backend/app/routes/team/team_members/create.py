# app/routes/team/team_members/create.py

from fastapi import Depends, APIRouter, HTTPException, status

# Import the TeamMember service and its dependency provider
from app.services.team.team_members.service import TeamMemberService
from app.core.container.team.team_members import get_team_members_service

# Import request and response schemas
from app.schemas.team.team_members.create import TeamMemberCreate
from app.schemas.team.team_members.response import TeamMemberResponse


class TeamMembersRouteCreate:
    def __init__(self):
        # Initialize the API router
        self.router = APIRouter()

        # Register the endpoint for creating a team membership
        self.router.add_api_route(
            path="/create",
            endpoint=self.create,
            methods=["POST"],
            response_model=TeamMemberResponse,
            status_code=status.HTTP_201_CREATED,
            summary="Create a new team member",
            description="Add a new member to the team with their details and permissions",
        )

    async def create(
        self,
        data: TeamMemberCreate,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> TeamMemberResponse:
        """
        Create a new team membership

        Args:
            data: Data for the new team member
            service: Team member management service

        Returns:
            The created team member data

        Raises:
            HTTPException: If validation fails or an error occurs
        """
        try:
            return await service.create(data=data)
        except ValueError as e:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))


# Create the shared team member creation router instance
create = TeamMembersRouteCreate().router
