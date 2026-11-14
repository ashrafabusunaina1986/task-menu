
# app/routes/team/team/base.py


class TeamRouteBase:

    @property
    def prefix(self):
        # Define the common URL prefix for all team endpoints.
        return "/teams"

    @property
    def tags(self):
        # Group all team endpoints under the TEAM tag in Swagger documentation.
        return ["TEAMS"]


# Create the shared team route configuration instance.
base = TeamRouteBase()
