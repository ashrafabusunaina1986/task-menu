# app/schemas/team/team_invitation/create.py

from .base import TeamInvitationBase


class TeamInvitationCreate(TeamInvitationBase):
    # Reuse the base invitation fields without additional validation.
    pass
