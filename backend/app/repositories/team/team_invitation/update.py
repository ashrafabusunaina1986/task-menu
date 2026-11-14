# app/repositories/team/team_invitation/update.py

from datetime import datetime, timezone

from bson import ObjectId
from pymongo import ReturnDocument

from app.core.database import get_team_invitations_collection

from app.schemas.team.team_invitation.update import TeamInvitationUpdate
from app.schemas.team.team_invitation.response import TeamInvitationResponse


class TeamInvitationRepositoryUpdate:

    @property
    def collection(self):
        # Get the MongoDB collection for team invitations.
        return get_team_invitations_collection()

    # Update an existing invitation by its ID.
    async def update(
        self,
        invitation_id: str,
        data: TeamInvitationUpdate,
    ) -> TeamInvitationResponse | None:

        # Validate the MongoDB ObjectId.
        if not ObjectId.is_valid(invitation_id):
            return None

        # Extract only the fields explicitly provided for updating.
        update_data = data.model_dump(
            exclude_unset=True,
            exclude_none=True,
        )

        # Return None if there are no fields to update.
        if not update_data:
            return None

        # Update the modification timestamp.
        update_data["updated_at"] = datetime.now(timezone.utc)

        # Update the invitation and retrieve the updated document.
        document = await self.collection.find_one_and_update(
            {"_id": ObjectId(invitation_id)},
            {"$set": update_data},
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        # Convert the MongoDB ID into a string.
        document["id"] = str(document.pop("_id"))

        # Return the updated invitation.
        return TeamInvitationResponse.model_validate(document)