# app/repositories/team/team_invitation/delete.py

from bson import ObjectId

from app.core.database import get_team_invitations_collection


class TeamInvitationRepositoryDelete:

    @property
    def collection(self):
        # Get the MongoDB collection for team invitations.
        return get_team_invitations_collection()

    # Delete a single invitation by its ID.
    async def delete(self, invitation_id: str) -> bool:

        # Validate the MongoDB ObjectId.
        if not ObjectId.is_valid(invitation_id):
            return False

        # Delete the invitation from MongoDB.
        result = await self.collection.delete_one(
            {"_id": ObjectId(invitation_id)}
        )

        # Return whether an invitation was deleted.
        return result.deleted_count > 0

    # Delete all invitations associated with a specific team.
    async def delete_invitations(self, team_id: str) -> int:

        # Delete all invitations belonging to the team.
        result = await self.collection.delete_many(
            {"team_id": team_id}
        )

        # Return the number of deleted invitations.
        return result.deleted_count