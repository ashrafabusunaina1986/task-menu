# app/repositories/team/team/update.py

from bson import ObjectId
from pymongo import ReturnDocument

from app.core.database import get_team_collection

from app.schemas.team.team.update import TeamUpdate
from app.schemas.team.team.response import TeamResponse


class TeamRepositoryUpdate:

    @property
    def collection(self):
        return get_team_collection()

    async def update(
        self,
        team_id: str,
        data: TeamUpdate,
    ) -> TeamResponse | None:

        if not ObjectId.is_valid(team_id):
            return None

        update_data = data.model_dump(
            mode="python",
            exclude_unset=True,
        )

        if not update_data:
            return None

        result = await self.collection.find_one_and_update(
            {"_id": ObjectId(team_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )

        if result is None:
            return None

        result["_id"] = str(result["_id"])

        return TeamResponse.model_validate(result)
