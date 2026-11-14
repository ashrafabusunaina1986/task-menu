# app/routes/team/team_members/update.py

from fastapi import Depends, APIRouter, HTTPException, status
from typing import Optional

from app.schemas.team.team_members.update import TeamMemberUpdate
from app.schemas.team.team_members.response import TeamMemberResponse

from app.services.team.team_members.service import TeamMemberService
from app.core.container.team.team_members import get_team_members_service


class TeamMembersRouteUpdate:
    """
    Update endpoints for team memberships.
    Supports updating membership details, status, roles, and permissions.
    """

    def __init__(self):
        self.router = APIRouter()

        # Update a single membership by its ID
        self.router.add_api_route(
            "/update/{membership_id}",
            endpoint=self.update,
            methods=["PUT"],
            response_model=Optional[TeamMemberResponse],
            status_code=status.HTTP_200_OK,
            summary="Update membership by ID",
        )

    async def update(
        self,
        membership_id: str,
        data: TeamMemberUpdate,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> Optional[TeamMemberResponse]:
        """
        Update a team membership by its unique ID.
        Returns the updated membership or None if not found.
        """
        try:
            return await service.update(member_id=membership_id, data=data)
        except ValueError as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=str(e)
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"An unexpected error occurred: {str(e)}"
            )


# Create the shared update router instance
update = TeamMembersRouteUpdate().router
