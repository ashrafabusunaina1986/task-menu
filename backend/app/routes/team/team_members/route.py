# app/routes/team/team_members/route.py

from fastapi import APIRouter

from app.routes.team.team_members.base import base
from app.routes.team.team_members.create import create
from app.routes.team.team_members.read import read
from app.routes.team.team_members.update import update
from app.routes.team.team_members.delete import delete
from app.routes.team.team_members.reactivate import reactivate


class TeamMembersRoute:
    """
    Main router aggregator for all team member endpoints.
    Combines create, read, update, delete, and reactivate sub-routes
    under a common prefix and tag group.
    """

    def __init__(self):
        self.router = APIRouter(prefix=base.prefix, tags=base.tags)
        self._include_sub_routers()

    def _include_sub_routers(self) -> None:
        """Register all sub-routers with the main router."""
        self.router.include_router(create)
        self.router.include_router(read)
        self.router.include_router(update)
        self.router.include_router(delete)
        self.router.include_router(reactivate)


# Create the shared team members router instance
team_members_router = TeamMembersRoute().router
