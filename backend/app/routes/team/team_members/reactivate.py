# app/routes/team/team_members/reactivate.py

from fastapi import Depends, APIRouter, HTTPException, status

from app.schemas.team.team_members.response import TeamMemberResponse

from app.services.team.team_members.service import TeamMemberService
from app.core.container.team.team_members import get_team_members_service


class TeamMembersRouteReactivate:
    """
    Reactivation endpoint for team memberships.
    Restores a previously deactivated or removed membership.
    """

    def __init__(self):
        self.router = APIRouter()

        # Reactivate a membership by user and team IDs
        self.router.add_api_route(
            "/reactivate",
            endpoint=self.reactivate,
            methods=["PUT"],
            response_model=TeamMemberResponse,
            status_code=status.HTTP_200_OK,
            summary="Reactivate membership",
        )

    async def reactivate(
        self,
        user_id: str,
        team_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> TeamMemberResponse:
        """
        Reactivate a previously inactive membership for a user in a specific team.
        Returns the reactivated membership details.
        """
        try:
            result = await service.reactivate(user_id=user_id, team_id=team_id)
            
            if result is None:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Membership not found or could not be reactivated"
                )
            
            return result

        except HTTPException:
            raise
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


# Create the shared reactivate router instance
reactivate = TeamMembersRouteReactivate().router
