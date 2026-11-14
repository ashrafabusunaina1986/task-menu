# app/repositories/team/team_invitation/status.py

from datetime import datetime, timezone

from bson import ObjectId
from pymongo import ReturnDocument

from app.core.database import get_team_invitations_collection

from app.schemas.team.team_invitation.response import TeamInvitationResponse


class TeamInvitationRepositoryStatus:

    @property
    def collection(self):
        # Get the MongoDB collection for team invitations.
        return get_team_invitations_collection()

    # Accept a pending invitation that has not expired.
    async def accept(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:

        if not ObjectId.is_valid(invitation_id):
            return None

        now = datetime.now(timezone.utc)

        # Accept the invitation only if it is pending and not expired.
        document = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(invitation_id),
                "status": "pending",
                "expires_at": {"$gt": now},
            },
            {
                "$set": {
                    "status": "accepted",
                    "responded_at": now,
                    "updated_at": now,
                }
            },
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        # Convert the MongoDB ID into a string.
        document["id"] = str(document.pop("_id"))

        return TeamInvitationResponse.model_validate(document)

    # Reject a pending invitation that has not expired.
    async def reject(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:

        if not ObjectId.is_valid(invitation_id):
            return None

        now = datetime.now(timezone.utc)

        # Reject the invitation only if it is pending and not expired.
        document = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(invitation_id),
                "status": "pending",
                "expires_at": {"$gt": now},
            },
            {
                "$set": {
                    "status": "rejected",
                    "responded_at": now,
                    "updated_at": now,
                }
            },
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        # Convert the MongoDB ID into a string.
        document["id"] = str(document.pop("_id"))

        return TeamInvitationResponse.model_validate(document)

    # Cancel a pending invitation.
    async def cancel(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:

        if not ObjectId.is_valid(invitation_id):
            return None

        now = datetime.now(timezone.utc)

        # Cancel the invitation only if it is still pending.
        document = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(invitation_id),
                "status": "pending",
            },
            {
                "$set": {
                    "status": "cancelled",
                    "responded_at": now,
                    "updated_at": now,
                }
            },
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        # Convert the MongoDB ID into a string.
        document["id"] = str(document.pop("_id"))

        return TeamInvitationResponse.model_validate(document)

    # Mark a pending invitation as expired.
    async def expire(
        self,
        invitation_id: str,
    ) -> TeamInvitationResponse | None:

        if not ObjectId.is_valid(invitation_id):
            return None

        now = datetime.now(timezone.utc)

        # Expire the invitation only if its expiration time has passed.
        document = await self.collection.find_one_and_update(
            {
                "_id": ObjectId(invitation_id),
                "status": "pending",
                "expires_at": {"$lte": now},
            },
            {
                "$set": {
                    "status": "expired",
                    "updated_at": now,
                }
            },
            return_document=ReturnDocument.AFTER,
        )

        if document is None:
            return None

        # Convert the MongoDB ID into a string.
        document["id"] = str(document.pop("_id"))

        return TeamInvitationResponse.model_validate(document)