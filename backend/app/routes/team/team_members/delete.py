# app/routes/team/team_members/delete.py

from fastapi import Depends, APIRouter, HTTPException, status

from app.services.team.team_members.service import TeamMemberService
from app.core.container.team.team_members import get_team_members_service


class TeamMembersRouteDelete:
    """
    Delete endpoints for team memberships.
    Supports removing a single member or all members from a team.
    """

    def __init__(self):
        self.router = APIRouter()

        # Delete all members from a specific team
        self.router.add_api_route(
            "/delete-members/{team_id}",
            methods=["DELETE"],
            response_model=int,
            endpoint=self.delete_members,
            status_code=status.HTTP_200_OK,
            summary="Delete all members from a team",
        )

        # Delete a single membership by ID
        self.router.add_api_route(
            "/delete/{membership_id}",
            methods=["DELETE"],
            response_model=bool,
            endpoint=self.delete,
            status_code=status.HTTP_200_OK,
            summary="Delete a single team member",
        )

    async def delete_members(
        self,
        team_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> int:
        """
        Delete all membership records for a specific team.
        Returns the number of deleted membership entries.
        """
        try:
            return await service.delete_members(team_id=team_id)
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

    async def delete(
        self,
        membership_id: str,
        service: TeamMemberService = Depends(get_team_members_service),
    ) -> bool:
        """
        Delete a single membership by its unique ID.
        Returns True if the membership was deleted successfully.
        """
        try:
            return await service.delete(member_id=membership_id)
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


# Create the shared delete router instance
delete = TeamMembersRouteDelete().router
