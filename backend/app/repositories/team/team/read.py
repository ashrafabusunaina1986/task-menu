# app/repositories/team/team/read.py

from bson import ObjectId

from app.core.database import get_team_collection

from app.schemas.team.team.read import TeamRead, TeamsRead
from app.schemas.team.team.response import TeamResponse, TeamList


class TeamRepositoryRead:

    @property
    def collection(self):
        return get_team_collection()

    # GET TEAM
    async def get_team(self, data: TeamRead) -> TeamResponse | None:

        data_model = data.model_dump(
            mode="python",
            exclude_none=True,
            exclude_unset=True,
        )

        if not data_model:
            raise ValueError("At least one search field is required")

        if "team_id" in data_model:
            team_id = data_model.pop("team_id")

            if not ObjectId.is_valid(team_id):
                return None

            data_model["_id"] = ObjectId(team_id)

        team = await self.collection.find_one(data_model)

        if team is None:
            return None

        team["_id"] = str(team["_id"])

        return TeamResponse.model_validate(team)

    # GET TEAMS
    async def get_teams(
        self,
        data: TeamsRead | None = None,
    ) -> TeamList:

        query = {}

        if data is not None:

            if data.status is not None:
                query["status"] = data.status

            if data.owner_id is not None:
                query["owner_id"] = data.owner_id

        cursor = self.collection.find(query)

        teams = await cursor.to_list(length=None)

        team_list = []

        for team in teams:
            team["_id"] = str(team["_id"])
            team_list.append(team)

        return TeamList.model_validate(
            {
                "teams": team_list,
                "total": len(team_list),
            }
        )
