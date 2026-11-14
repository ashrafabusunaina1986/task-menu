# app/schemas/team/team_members/create.py

from pydantic import ConfigDict

from app.schemas.team.team_members.base import TeamMemberBase


class TeamMemberCreate(TeamMemberBase):

    model_config = ConfigDict(
        str_strip_whitespace=True,
        extra="forbid",
    )
