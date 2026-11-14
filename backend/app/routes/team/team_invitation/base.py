# app/routes/team/team_invitation/base.py

from fastapi import APIRouter


class TeamInvitationRouteBase:

    @property
    def prefix(self):
        # Define the base URL prefix for invitation routes.
        return "/invitations"

    @property
    def tags(self):
        # Define the OpenAPI tags for invitation routes.
        return ["INVITATIONS"]


base = TeamInvitationRouteBase()
