# app/repositories/team/team/delete.py

from bson import ObjectId

from app.core.database import get_team_collection


class TeamRepositoryDelete:

    @property
    def collection(self):
        return get_team_collection()

    async def delete(self, team_id: str) -> bool:

        if not ObjectId.is_valid(team_id):
            return False

        result = await self.collection.delete_one({"_id": ObjectId(team_id)})

        return result.deleted_count == 1
