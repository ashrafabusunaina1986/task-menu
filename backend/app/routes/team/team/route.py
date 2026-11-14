# app/routes/team/team/route.py

from fastapi import APIRouter

from app.routes.team.team.base import TeamRouteBase
from app.routes.team.team.create import create
from app.routes.team.team.read import read
from app.routes.team.team.update import update
from app.routes.team.team.delete import delete


class TeamRoute(TeamRouteBase):

    def __init__(self):
        # Create the main router using the shared prefix and tags.
        self.router = APIRouter(prefix=self.prefix, tags=self.tags)

        # Register the team creation endpoints.
        self.router.include_router(create)

        # Register the team read endpoints.
        self.router.include_router(read)

        # Register the team update endpoints.
        self.router.include_router(update)

        # Register the team deletion endpoints.
        self.router.include_router(delete)


# Create the main Team router instance.
team_router = TeamRoute().router
