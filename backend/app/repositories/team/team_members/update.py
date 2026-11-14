# app/repositories/team/team_members/update.py

from bson import ObjectId
from pymongo import ReturnDocument
from datetime import datetime, timezone

from app.core.database import get_team_members_collection
from app.schemas.team.team_members.response import TeamMemberResponse
from app.schemas.team.team_members.update import TeamMemberUpdate


class TeamMemberRepositoryUpdate:

    @property
    def collection(self):
        # Return the team_members MongoDB collection.
        return get_team_members_collection()

    async def update(
        self,
        member_id: str,
        data: TeamMemberUpdate,
    ) -> TeamMemberResponse | None:

        # Validate the membership ID.
        if not ObjectId.is_valid(member_id):
            return None

        # Extract only the fields explicitly provided for updating.
        update_data = data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        # Return None if there are no fields to update.
        if not update_data:
            return None

        # Update the timestamp.

        now = datetime.now(timezone.utc)
        update_data["updated_at"] = now

        # Update the membership and return the updated document.
        document = await self.collection.find_one_and_update(
            {"_id": ObjectId(member_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        # Convert MongoDB ObjectId into a string.
        document["member_id"] = str(document.pop("_id"))

        # Validate and return the updated membership.
        return TeamMemberResponse.model_validate(document)
