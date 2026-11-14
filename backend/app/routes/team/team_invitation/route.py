# app/routes/team/team_invitation/route.py

from fastapi import APIRouter

from app.routes.team.team_invitation.base import base
from app.routes.team.team_invitation.create import create
from app.routes.team.team_invitation.read import read
from app.routes.team.team_invitation.update import update
from app.routes.team.team_invitation.delete import delete
from app.routes.team.team_invitation.status import status


class TeamInvitationRoute:

    def __init__(self):

        self.router = APIRouter(prefix=base.prefix, tags=base.tags)

        # Register invitation creation routes.
        self.router.include_router(create)

        # Register invitation read routes.
        self.router.include_router(read)

        # Register invitation update routes.
        self.router.include_router(update)

        # Register invitation deletion routes.
        self.router.include_router(delete)

        # Register invitation status routes.
        self.router.include_router(status)


invitation_router = TeamInvitationRoute().router
