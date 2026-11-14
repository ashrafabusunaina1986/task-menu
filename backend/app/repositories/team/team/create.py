# app/repositories/team/team/create.py


from app.core.database import get_team_collection

from app.models.team.team import TeamModel
from app.schemas.team.team.response import TeamResponse


class TeamRepositoryCreate:

    @property
    def collection(self):
        return get_team_collection()

    async def create(self, data: TeamModel) -> TeamResponse:

        data_model = data.model_dump(mode="python", by_alias=True, exclude={"id"})

        result = await self.collection.insert_one(data_model)

        data_model["_id"] = str(result.inserted_id)

        return TeamResponse.model_validate(data_model)
