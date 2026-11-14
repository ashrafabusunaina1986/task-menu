# app/routes/team/team_members/base.py


class TeamMembersRouteBase:
    """
    Base configuration for all team member routes.
    Provides shared URL prefix and API documentation tags.
    """

    @property
    def prefix(self) -> str:
        """Return the common URL prefix for team member endpoints."""
        return "/team-members"

    @property
    def tags(self) -> list[str]:
        """Return the tag used to group endpoints in the OpenAPI documentation."""
        return ["TEAM MEMBERS"]


# Shared instance for reuse across all team member route modules
base = TeamMembersRouteBase()
