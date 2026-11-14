# app/repositories/team/team_members/delete.py

from bson import ObjectId

from app.core.database import get_team_members_collection


class TeamMemberRepositoryDelete:

    @property
    def collection(self):
        # Return the team_members MongoDB collection.
        return get_team_members_collection()

    async def delete(self, member_id: str) -> bool:

        # Validate the membership ID.
        if not ObjectId.is_valid(member_id):
            return False

        # Delete one membership document.
        result = await self.collection.delete_one(
            {"_id": ObjectId(member_id)}
        )

        # Return True if a membership was deleted.
        return result.deleted_count == 1

    async def delete_members(self, team_id: str) -> int:

        # Delete all membership documents belonging to the team.
        result = await self.collection.delete_many(
            {"team_id": team_id}
        )

        # Return the number of deleted memberships.
        return result.deleted_count